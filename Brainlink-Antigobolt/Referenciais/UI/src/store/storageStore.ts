import { create } from 'zustand';
import { StorageItem, storageManager } from '../lib/storage/StorageManager';

interface StorageState {
  items: StorageItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadItems: () => Promise<void>;
  saveItem: (path: string, content: Blob | ArrayBuffer, metadata?: Record<string, any>) => Promise<void>;
  deleteItem: (path: string) => Promise<void>;
  getItem: (path: string) => Promise<StorageItem | null>;
}

export const useStorageStore = create<StorageState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      // Implementation will depend on how you want to list items
      // This is a placeholder
      set({ items: [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveItem: async (path, content, metadata = {}) => {
    set({ isLoading: true, error: null });
    try {
      const item = await storageManager.saveItem(path, content, metadata);
      set(state => ({
        items: [...state.items.filter(i => i.path !== path), item]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (path) => {
    set({ isLoading: true, error: null });
    try {
      await storageManager.deleteItem(path);
      set(state => ({
        items: state.items.filter(item => item.path !== path)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getItem: async (path) => {
    try {
      return await storageManager.getItem(path);
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  }
}));