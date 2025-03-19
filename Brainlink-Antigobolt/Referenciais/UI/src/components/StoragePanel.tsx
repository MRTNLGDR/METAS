import React, { useState, useEffect } from 'react';
import { useStorageStore } from '../store/storageStore';
import { Upload, Download, RefreshCw, AlertCircle, File, X } from 'lucide-react';

export const StoragePanel: React.FC = () => {
  const { items, isLoading, error, loadItems } = useStorageStore();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { saveItem } = useStorageStore();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        await saveItem(file.name, file, {
          type: file.type,
          lastModified: file.lastModified
        });
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div 
      className="h-full flex flex-col relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-200 font-medium">Storage Manager</h2>
          {isLoading && (
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadItems()}
            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-blue-400"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="m-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.path}
                className="p-3 bg-gray-750 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-200">{item.path}</p>
                  <p className="text-sm text-gray-400">
                    {new Intl.NumberFormat('en-US', {
                      style: 'unit',
                      unit: 'byte',
                      unitDisplay: 'narrow',
                    }).format(item.size)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.syncStatus === 'pending' && (
                    <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                      Pending
                    </span>
                  )}
                  {item.syncStatus === 'syncing' && (
                    <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                      Syncing
                    </span>
                  )}
                  {item.syncStatus === 'error' && (
                    <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                      Error
                    </span>
                  )}
                  {item.syncStatus === 'synced' && (
                    <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                      Synced
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No items to display
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="p-4 border-t border-gray-700">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Upload size={16} />
          Upload Files
        </button>
      </div>

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500/50 border-dashed rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <File className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-400">Drop files here to upload</p>
          </div>
        </div>
      )}
    </div>
  );
};