import React, { useEffect, useState } from 'react';
import { Workspace } from './Workspace';
import { Header } from './Header';
import { WorkspaceSettings } from './WorkspaceSettings';
import { WorkspacePanel, useWorkspaceStore } from '../store/workspaceStore';
import { useLayoutStore } from '../store/layoutStore';
import { 
  MessageSquare, FileText, Code, Terminal, 
  Database, Layout, PenTool, FolderTree,
  GitBranch, Cloud, HelpCircle, HardDrive,
  Puzzle, Share2
} from 'lucide-react';
import { PluginLauncher } from './PluginLauncher';
import { QuickPluginSelector } from './QuickPluginSelector';

const tools = [
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'code', icon: Code, label: 'Code' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'database', icon: Database, label: 'Database' },
  { id: 'filemanager', icon: FolderTree, label: 'File Manager' },
  { id: 'git', icon: GitBranch, label: 'Git' },
  { id: 'deploy', icon: Cloud, label: 'Deploy' },
  { id: 'storage', icon: HardDrive, label: 'Storage' },
  { id: 'plugins', icon: PluginLauncher, component: PluginLauncher },
  { id: 'quick-plugins', icon: QuickPluginSelector, component: QuickPluginSelector },
  { id: 'graph', icon: Share2, label: 'Graph View' },
  { id: 'help', icon: HelpCircle, label: 'Help' },
];

export const WorkspaceManager: React.FC = () => {
  const { 
    panels, 
    setPanels, 
    addPanel: addPanelToStore, 
    updatePanel, 
    removePanel,
    isSettingsOpen,
    setSettingsOpen 
  } = useWorkspaceStore();
  const { loadPreset } = useLayoutStore();

  useEffect(() => {
    const loadWorkspace = async () => {
      const presetPanels = loadPreset('default-1');
      if (presetPanels.length > 0) {
        setPanels(presetPanels);
      }
    };
    loadWorkspace();
  }, [loadPreset, setPanels]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const presetId = `default-${e.key}`;
        const presetPanels = loadPreset(presetId);
        if (presetPanels.length > 0) {
          setPanels(presetPanels);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadPreset, setPanels]);

  const handlePanelUpdate = (updatedPanel: WorkspacePanel) => {
    updatePanel(updatedPanel.id, updatedPanel);
  };

  const handlePanelClose = (panelId: string) => {
    removePanel(panelId);
  };

  const addPanel = (tool: typeof tools[0]) => {
    const newPanel = {
      id: `${tool.id}-${Date.now()}`,
      title: tool.label,
      type: tool.id,
      position: { x: 20, y: 20 },
      size: { width: 400, height: 300 }
    };
    addPanelToStore(newPanel);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <div className="w-10 sm:w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2 space-y-1 sm:space-y-2">
          {tools.map(tool => (
            tool.component ? (
              <tool.component key={tool.id} />
            ) : (
              <button
                key={tool.id}
                onClick={() => addPanel(tool)}
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                title={tool.label}
              >
                <tool.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )
          ))}
        </div>

        <div className="flex-1 bg-gray-900 relative">
          <Workspace
            panels={panels}
            onPanelUpdate={handlePanelUpdate}
            onPanelClose={handlePanelClose}
          />
        </div>
        <WorkspaceSettings isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
};
