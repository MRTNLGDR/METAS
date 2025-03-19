import React, { useState, useEffect } from 'react';
import { usePluginStore } from '../store/pluginStore';
import { X, Search, Power, Settings, Package, Box, Zap, PenTool as Tool, Puzzle, Utensils as Extension } from 'lucide-react';

interface PluginSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pluginId: string) => void;
}

const defaultPluginIcon = (plugin: { name: string }) => {
  // Generate a deterministic icon based on plugin name
  const nameHash = plugin.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const icons = [Package, Box, Zap, Tool, Puzzle, Extension];
  const IconComponent = icons[nameHash % icons.length];
  return <IconComponent className="w-8 h-8 text-blue-400" />;
};

export const PluginSelector: React.FC<PluginSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const { plugins, activePlugins } = usePluginStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group plugins by category
  const categories = Array.from(new Set(plugins.map(p => p.config?.category || 'Uncategorized')));
  
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || plugin.config?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[48rem] max-h-[80vh] bg-gray-800 rounded-lg shadow-2xl border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-200 flex items-center gap-2">
            <Power className="w-5 h-5 text-blue-400" />
            Select Plugin
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Categories */}
        <div className="p-4 border-b border-gray-700 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search plugins..."
              className="w-full pl-9 pr-4 py-2 bg-gray-700 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap
                ${!selectedCategory 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-gray-700 text-gray-400 hover:text-gray-200'}`}
            >
              All Plugins
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap
                  ${selectedCategory === category
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-700 text-gray-400 hover:text-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Plugin Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredPlugins.map(plugin => (
              <button
                key={plugin.id}
                onClick={() => onSelect(plugin.id)}
                className={`
                  p-4 rounded-lg border transition-all
                  ${activePlugins.has(plugin.id)
                    ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                    : 'bg-gray-750 border-gray-700 hover:border-gray-600'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    {plugin.icon 
                      ? <img src={plugin.icon} alt="" className="w-8 h-8" /> 
                      : defaultPluginIcon(plugin)
                    }
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-200">{plugin.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{plugin.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-gray-500">v{plugin.version}</span>
                      <span className="text-gray-500">{plugin.author}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};