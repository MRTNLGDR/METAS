import React, { useState, useEffect, useRef } from 'react';
import { Command, Search } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

interface QuickLaunchProps {
  tools: Array<{
    id: string;
    label: string;
    icon: React.FC<{ size?: number }>;
  }>;
  onToolSelect: (tool: { id: string; label: string }) => void;
}

export const QuickLaunch: React.FC<QuickLaunchProps> = ({ tools, onToolSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { panels } = useWorkspaceStore();

  const filteredTools = tools.filter(tool =>
    tool.label.toLowerCase().includes(search.toLowerCase())
  );

  const recentPanels = panels
    .slice()
    .reverse()
    .slice(0, 3)
    .map(panel => ({
      id: panel.type,
      label: panel.title,
    }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredTools.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredTools.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredTools[selectedIndex];
      if (selected) {
        onToolSelect(selected);
        setIsOpen(false);
        setSearch('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50">
      <div className="w-[32rem] bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-400"
          />
          <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 rounded-md text-gray-400">
            ESC
          </kbd>
        </div>

        <div className="p-2">
          {recentPanels.length > 0 && !search && (
            <div className="px-2 py-1.5 text-xs text-gray-400 font-medium">
              Recent
            </div>
          )}
          
          {!search && recentPanels.map((panel, index) => (
            <button
              key={panel.id}
              className={`
                w-full text-left px-4 py-2 rounded-md flex items-center gap-3
                ${index === selectedIndex ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-gray-700'}
              `}
              onClick={() => {
                onToolSelect(panel);
                setIsOpen(false);
              }}
            >
              <Command className="w-4 h-4 opacity-50" />
              <span>{panel.label}</span>
            </button>
          ))}

          {filteredTools.map((tool, index) => (
            <button
              key={tool.id}
              className={`
                w-full text-left px-4 py-2 rounded-md flex items-center gap-3
                ${index === selectedIndex ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-gray-700'}
              `}
              onClick={() => {
                onToolSelect(tool);
                setIsOpen(false);
              }}
            >
              <tool.icon size={16} className="opacity-50" />
              <span>{tool.label}</span>
            </button>
          ))}

          {filteredTools.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400">
              No tools found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};