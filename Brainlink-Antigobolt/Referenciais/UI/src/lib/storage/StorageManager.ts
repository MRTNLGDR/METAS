import { BehaviorSubject, Subject, interval } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import localforage from 'localforage';
import { supabase } from '../supabase';

export interface StorageItem {
  id: string;
  path: string;
  contentHash: string;
  size: number;
  metadata: Record<string, any>;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'error';
  lastSynced: Date | null;
  lastModified: Date;
  isDeleted: boolean;
}

export class StorageManager {
  private static instance: StorageManager;
  private syncSubject = new Subject<StorageItem>();
  private syncStatus = new BehaviorSubject<'idle' | 'syncing'>('idle');
  private localStore: LocalForage;
  private syncInterval = 30000; // 30 seconds

  private constructor() {
    this.localStore = localforage.createInstance({
      name: 'workspace_storage'
    });

    // Initialize sync process
    this.initializeSync();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private async initializeSync() {
    // Set up periodic sync
    interval(this.syncInterval).pipe(
      filter(() => this.syncStatus.value === 'idle'),
      mergeMap(() => this.syncAll())
    ).subscribe();

    // Process sync queue
    this.syncSubject.pipe(
      mergeMap(async (item) => {
        try {
          await this.syncItem(item);
        } catch (error) {
          console.error(`Failed to sync item ${item.path}:`, error);
        }
      })
    ).subscribe();
  }

  async getItem(path: string): Promise<StorageItem | null> {
    try {
      // Try local first
      const localItem = await this.localStore.getItem<StorageItem>(path);
      if (localItem) return localItem;

      // If not found locally, try cloud
      const { data, error } = await supabase
        .from('storage_items')
        .select('*')
        .eq('path', path)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Cache cloud item locally
      const item: StorageItem = {
        id: data.id,
        path: data.path,
        contentHash: data.content_hash,
        size: data.size,
        metadata: data.metadata,
        syncStatus: 'synced',
        lastSynced: new Date(data.last_synced),
        lastModified: new Date(data.last_modified),
        isDeleted: data.is_deleted
      };

      await this.localStore.setItem(path, item);
      return item;
    } catch (error) {
      console.error('Failed to get item:', error);
      return null;
    }
  }

  async saveItem(path: string, content: Blob | ArrayBuffer, metadata: Record<string, any> = {}): Promise<StorageItem> {
    try {
      const contentHash = await this.calculateHash(content);
      const size = content instanceof Blob ? content.size : content.byteLength;

      const item: StorageItem = {
        id: crypto.randomUUID(),
        path,
        contentHash,
        size,
        metadata,
        syncStatus: 'pending',
        lastSynced: null,
        lastModified: new Date(),
        isDeleted: false
      };

      // Save locally
      await this.localStore.setItem(path, item);
      await this.localStore.setItem(`${path}:content`, content);

      // Queue for sync
      this.syncSubject.next(item);

      return item;
    } catch (error) {
      console.error('Failed to save item:', error);
      throw error;
    }
  }

  async deleteItem(path: string): Promise<void> {
    try {
      const item = await this.getItem(path);
      if (!item) return;

      // Mark as deleted
      const updatedItem: StorageItem = {
        ...item,
        isDeleted: true,
        syncStatus: 'pending',
        lastModified: new Date()
      };

      await this.localStore.setItem(path, updatedItem);
      this.syncSubject.next(updatedItem);
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }

  private async syncItem(item: StorageItem): Promise<void> {
    if (this.syncStatus.value === 'syncing') return;
    this.syncStatus.next('syncing');

    try {
      if (item.isDeleted) {
        // Delete from cloud
        const { error } = await supabase
          .from('storage_items')
          .delete()
          .eq('path', item.path);

        if (error) throw error;

        // Remove from local storage
        await this.localStore.removeItem(item.path);
        await this.localStore.removeItem(`${item.path}:content`);
      } else {
        // Get content
        const content = await this.localStore.getItem<Blob | ArrayBuffer>(`${item.path}:content`);
        if (!content) throw new Error('Content not found');

        // Upload to cloud storage
        const { error: uploadError } = await supabase.storage
          .from('workspace')
          .upload(item.path, content, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Update metadata in database
        const { error: dbError } = await supabase
          .from('storage_items')
          .upsert({
            id: item.id,
            path: item.path,
            content_hash: item.contentHash,
            size: item.size,
            metadata: item.metadata,
            last_modified: item.lastModified.toISOString()
          });

        if (dbError) throw dbError;

        // Update local sync status
        const updatedItem: StorageItem = {
          ...item,
          syncStatus: 'synced',
          lastSynced: new Date()
        };

        await this.localStore.setItem(item.path, updatedItem);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      
      // Update item with error status
      const errorItem: StorageItem = {
        ...item,
        syncStatus: 'error'
      };
      await this.localStore.setItem(item.path, errorItem);
    } finally {
      this.syncStatus.next('idle');
    }
  }

  private async syncAll(): Promise<void> {
    const keys = await this.localStore.keys();
    const items = await Promise.all(
      keys
        .filter(key => !key.endsWith(':content'))
        .map(key => this.localStore.getItem<StorageItem>(key))
    );

    const pendingItems = items.filter(
      item => item && item.syncStatus === 'pending'
    ) as StorageItem[];

    for (const item of pendingItems) {
      await this.syncItem(item);
    }
  }

  private async calculateHash(content: Blob | ArrayBuffer): Promise<string> {
    const buffer = content instanceof Blob 
      ? await content.arrayBuffer()
      : content;
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const storageManager = StorageManager.getInstance();