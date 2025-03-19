import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Lock, Unlock, Save, History, Download, Upload } from 'lucide-react';
import { useLayoutStore } from '../store/layoutStore';
import { useWorkspaceStore } from '../store/workspaceStore';

export const LayoutControls: React.FC = () => {
  const { mode, setMode, toggleLock, saveLayout, loadPreset, exportLayouts, importLayouts } = useLayoutStore();
  const { panels } = useWorkspaceStore();
  const [layoutName, setLayoutName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!layoutName.trim()) return;
    saveLayout(layoutName, panels);
    setLayoutName('');
    setShowSaveDialog(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      importLayouts(content);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = exportLayouts();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workspace-layouts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const presetIndex = parseInt(e.key) - 1;
        const preset = presets[presetIndex];
        if (preset) {
          loadPreset(preset.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadPreset]);

  return (
    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
      <button
        onClick={() => setMode(mode.type === 'edit' ? 'work' : 'edit')}
        className={`
          p-2 rounded-md transition-colors
          ${mode.type === 'edit' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
        `}
        title={mode.type === 'edit' ? 'Switch to Work Mode' : 'Switch to Edit Mode'}
      >
        <Edit2 size={20} />
      </button>

      <button
        onClick={toggleLock}
        className={`
          p-2 rounded-md transition-colors
          ${mode.isLocked
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-blue-500 text-white'}
        `}
        title={mode.isLocked ? 'Unlock Layout' : 'Lock Layout'}
      >
        {mode.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
      </button>

      <button
        onClick={() => setShowSaveDialog(true)}
        className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        title="Save Layout"
      >
        <Save size={20} />
      </button>

      <button
        onClick={handleExport}
        className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        title="Export Layouts"
      >
        <Download size={20} />
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        title="Import Layouts"
      >
        <Upload size={20} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Save Layout</h3>
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Layout Name"
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!layoutName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};