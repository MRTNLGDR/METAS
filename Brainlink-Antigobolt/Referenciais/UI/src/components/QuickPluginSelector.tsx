import React, { useState } from 'react';
import { Puzzle, X, Search, Power, Settings } from 'lucide-react';
import { usePluginStore } from '../store/pluginStore';
import { useWorkspaceStore } from '../store/workspaceStore';

export const QuickPluginSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { plugins, activePlugins, activatePlugin, deactivatePlugin } = usePluginStore();
  const { addPanel } = useWorkspaceStore();

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePluginSelect = async (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    if (!activePlugins.has(pluginId)) {
      await activatePlugin(pluginId);
      addPanel({
        id: `plugin-${plugin.id}-${Date.now()}`,
        title: plugin.name,
        type: 'plugin',
        position: { x: 20, y: 20 },
        size: { width: 400, height: 300 },
        pluginId: plugin.id
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-purple-400 transition-colors relative"
        title="Quick Plugin Access"
      >
        <Puzzle size={16} className="sm:w-[18px] sm:h-[18px]" />
        {activePlugins.size > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50">
          <div className="w-[32rem] bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-purple-400" />
                Quick Plugin Access
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search plugins..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-700 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredPlugins.map(plugin => (
                <button
                  key={plugin.id}
                  onClick={() => handlePluginSelect(plugin.id)}
                  className={`
                    w-full text-left p-3 rounded-lg mb-2 last:mb-0
                    ${activePlugins.has(plugin.id)
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-gray-750 hover:bg-gray-700 text-gray-300'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{plugin.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{plugin.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activePlugins.has(plugin.id) && (
                        <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                      <Power className="w-4 h-4 opacity-50" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};