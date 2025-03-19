import React, { useState, useEffect, useRef } from 'react';
import { Layout, Plus, Save, Trash2, X, Edit2 } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useLayoutStore } from '../store/layoutStore';

interface LayoutSelectorProps {
  onClose: () => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ onClose }) => {
  const [newLayoutName, setNewLayoutName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { layouts, activeLayout, saveLayout, loadLayout, deleteLayout } = useWorkspaceStore();
  const { presets, loadPreset } = useLayoutStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSaveNewLayout = () => {
    if (!newLayoutName.trim()) return;
    saveLayout(newLayoutName);
    setNewLayoutName('');
    setIsCreatingNew(false);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50"
    >
      {isCreatingNew ? (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="Layout name..."
              className="flex-1 px-2 py-1 text-sm bg-gray-700 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSaveNewLayout}
              disabled={!newLayoutName.trim()}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="p-1 text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="p-2 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-200">Workspace Layouts</h3>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="p-1 text-gray-400 hover:text-gray-200 rounded"
              title="Save Current Layout"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="p-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Preset Layouts */}
            <div className="px-2 py-1.5 text-xs text-gray-400 font-medium">Presets</div>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  loadPreset(preset.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 opacity-50" />
                  <span>{preset.name}</span>
                </div>
                <kbd className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                  {preset.shortcut}
                </kbd>
              </button>
            ))}

            {/* Custom Layouts */}
            {layouts.length > 0 && (
              <>
                <div className="px-2 py-1.5 mt-2 text-xs text-gray-400 font-medium">Custom</div>
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className={`
                      flex items-center px-3 py-1.5 text-sm
                      ${layout.id === activeLayout 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-300 hover:bg-gray-700'
                      }
                      rounded group
                    `}
                  >
                    <button
                      onClick={() => {
                        loadLayout(layout.id);
                        onClose();
                      }}
                      className="flex items-center gap-2 flex-1"
                    >
                      <Layout className="w-4 h-4 opacity-50" />
                      <span>{layout.name}</span>
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => deleteLayout(layout.id)}
                        className="p-1 text-gray-400 hover:text-red-400 rounded"
                        title="Delete Layout"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-blue-400 rounded"
                        title="Edit Layout"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};