import React, { useState } from 'react';
import { Save, Trash2, Layout } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

export const LayoutManager: React.FC = () => {
  const { layouts, activeLayout, saveLayout, loadLayout, deleteLayout } = useWorkspaceStore();
  const [newLayoutName, setNewLayoutName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    if (!newLayoutName.trim()) return;
    saveLayout(newLayoutName);
    setNewLayoutName('');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="absolute bottom-4 left-20 flex items-center space-x-2">
        <div className="bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2">
          <select
            className="bg-gray-700 text-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={activeLayout || ''}
            onChange={(e) => loadLayout(e.target.value)}
          >
            <option value="">Select Layout</option>
            {layouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-purple-400 transition-colors"
            title="Save Layout"
          >
            <Save size={16} />
          </button>
          
          {activeLayout && (
            <button
              onClick={() => deleteLayout(activeLayout)}
              className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-red-400 transition-colors"
              title="Delete Layout"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Save Layout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <Layout className="mr-2" size={20} />
              Save Layout
            </h3>
            
            <input
              type="text"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="Layout Name"
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newLayoutName.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};