import React, { useState } from 'react';
import { 
  Settings, Bell, User, Search,
  ChevronDown, Command, Layout,
  Menu, Settings as SettingsIcon
} from 'lucide-react';
import { LayoutSelector } from './LayoutSelector';
import { useWorkspaceStore } from '../store/workspaceStore';

export const Header: React.FC = () => {
  const [isLayoutSelectorOpen, setIsLayoutSelectorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setSettingsOpen, setSettingsSection } = useWorkspaceStore();

  const handleSettingsClick = () => {
    setSettingsSection('general');
    setSettingsOpen(true);
  };

  return (
    <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-2 sm:px-4">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button 
          className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200 lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={18} />
        </button>
        <div className="text-base sm:text-lg font-semibold text-gray-200">BrainLink</div>
        <div className="hidden lg:flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-200 text-sm">Projects</button>
          <button className="text-gray-400 hover:text-gray-200 text-sm">Team</button>
          <button className="text-gray-400 hover:text-gray-200 text-sm">Docs</button>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="relative hidden md:flex items-center max-w-[200px] xl:max-w-[300px]">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-400"
          />
          <div className="absolute right-3 hidden lg:flex items-center space-x-1 text-gray-400">
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-600 rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-600 rounded">K</kbd>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsLayoutSelectorOpen(!isLayoutSelectorOpen)}
            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200 flex items-center gap-1"
            title="Layout Options"
          >
            <Layout className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 hidden sm:block" />
          </button>

          {isLayoutSelectorOpen && (
            <LayoutSelector onClose={() => setIsLayoutSelectorOpen(false)} />
          )}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200 hidden sm:block">
            <Command className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200">
            <Bell className="w-4 h-4" />
          </button>
          <button 
            onClick={handleSettingsClick}
            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200 hidden sm:block"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>
          <button className="flex items-center space-x-1 p-1 hover:bg-gray-700 rounded-md">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
              U
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-gray-800 border-b border-gray-700 shadow-lg lg:hidden z-50">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Projects
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Team
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Docs
              </button>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};