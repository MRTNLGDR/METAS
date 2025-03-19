import React, { useState } from 'react';
import { Power, Settings, Download, X, Plus } from 'lucide-react';
import { usePluginStore, type Plugin } from '../store/pluginStore';
import { useWorkspaceStore } from '../store/workspaceStore';

interface InstallPluginFormData {
  name: string;
  description: string;
  version: string;
  author: string;
  entry: string;
}

export const PluginLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInstallForm, setShowInstallForm] = useState(false);
  const [formData, setFormData] = useState<InstallPluginFormData>({
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    entry: ''
  });

  const { plugins, activePlugins, activatePlugin, deactivatePlugin, installPlugin } = usePluginStore();
  const { addPanel } = useWorkspaceStore();

  const handleInstallPlugin = async () => {
    if (!formData.name || !formData.description || !formData.version || !formData.author || !formData.entry) {
      return;
    }

    const config = {
      id: crypto.randomUUID(),
      ...formData,
      permissions: [],
      dependencies: {},
      config: {}
    };

    try {
      await installPlugin(config);
      setShowInstallForm(false);
      setFormData({
        name: '',
        description: '',
        version: '1.0.0',
        author: '',
        entry: ''
      });
    } catch (error) {
      console.error('Failed to install plugin:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handlePluginClick = async (pluginId: string) => {
    if (activePlugins.has(pluginId)) {
      await deactivatePlugin(pluginId);
    } else {
      await activatePlugin(pluginId);
      
      // Add plugin panel to workspace
      const plugin = plugins.find(p => p.id === pluginId);
      if (plugin) {
        addPanel({
          id: `plugin-${plugin.id}-${Date.now()}`,
          title: plugin.name,
          type: 'plugin',
          position: { x: 20, y: 20 },
          size: { width: 400, height: 300 },
          pluginId: plugin.id
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-400 transition-colors relative"
        title="Plugin Manager"
      >
        <Power size={16} className="sm:w-[18px] sm:h-[18px]" />
        {activePlugins.size > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
        )}
      </button>

      {(isOpen || showInstallForm) && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50">
          <div className="w-[32rem] bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                <Power className="w-5 h-5 text-blue-400" />
                Plugins
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showInstallForm ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Plugin Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Entry Point
                  </label>
                  <input
                    type="text"
                    value={formData.entry}
                    onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="plugin-name/index.ts"
                  />
                </div>
              </div>
            ) : (
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {plugins.map(plugin => (
                <div
                  key={plugin.id}
                  className="p-4 bg-gray-750 rounded-lg mb-2 last:mb-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-200 font-medium">{plugin.name}</h3>
                      <p className="text-sm text-gray-400">{plugin.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePluginClick(plugin.id)}
                        className={`
                          p-2 rounded-md transition-colors
                          ${activePlugins.has(plugin.id)
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
                        `}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        className="p-2 bg-gray-700 rounded-md text-gray-400 hover:bg-gray-600"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowInstallForm(true)}
                className="w-full mt-4 p-4 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-blue-500/50 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Install New Plugin
              </button>
            </div>
            )}

            <div className="p-4 border-t border-gray-700 flex justify-end">
              {showInstallForm ? (
                <>
                  <button
                    onClick={() => setShowInstallForm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-gray-200 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInstallPlugin}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Install Plugin
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Close
              </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}