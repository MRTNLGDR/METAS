import React, { useState, useEffect, useRef } from 'react';
import { Command, Search, ChevronRight } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

interface CommandPaletteProps {
  tools: Array<{
    id: string;
    label: string;
    icon: React.FC<{ size?: number }>;
  }>;
  onToolSelect: (tool: { id: string; label: string }) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ tools, onToolSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { panels, removePanel } = useWorkspaceStore();

  const filteredTools = tools.filter(tool =>
    tool.label.toLowerCase().includes(search.toLowerCase())
  );

  const panelActions = panels.map(panel => ({
    id: `close-${panel.id}`,
    label: `Close ${panel.title}`,
    action: () => removePanel(panel.id),
    icon: panel.type,
  }));

  const allItems = [
    ...filteredTools.map(tool => ({
      type: 'tool' as const,
      ...tool,
    })),
    ...panelActions.map(action => ({
      type: 'action' as const,
      ...action,
    })),
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
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
    } else {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < allItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : allItems.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        if (selected.type === 'tool') {
          onToolSelect(selected);
        } else {
          selected.action();
        }
        setIsOpen(false);
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
            placeholder="Search tools and actions..."
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-400"
          />
          <kbd className="hidden sm:block px-2 py-1 text-xs font-mono bg-gray-700 rounded-md text-gray-400">
            ⌘P
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {allItems.length > 0 ? (
            <div className="p-2">
              {allItems.map((item, index) => (
                <button
                  key={item.id}
                  className={`
                    w-full text-left px-4 py-2 rounded-md flex items-center gap-3
                    ${index === selectedIndex ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}
                  `}
                  onClick={() => {
                    if (item.type === 'tool') {
                      onToolSelect(item);
                    } else {
                      item.action();
                    }
                    setIsOpen(false);
                  }}
                >
                  {item.type === 'tool' ? (
                    <item.icon size={16} className="opacity-50" />
                  ) : (
                    <ChevronRight size={16} className="opacity-50" />
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};