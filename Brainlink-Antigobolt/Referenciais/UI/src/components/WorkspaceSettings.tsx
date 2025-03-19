import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Settings, X, Layout, Database, Terminal, 
  MessageSquare, Code, FileText, Monitor,
  Sliders, Cloud, GitBranch
} from 'lucide-react';
import { useAssistantStore } from '../store/assistantStore';

interface WorkspaceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 'general' | 'panels' | 'layout' | 'appearance' | 'integrations' | 'chat';

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const { currentConfig, setCurrentConfig, saveConfig } = useAssistantStore();
  
  // Initialize config when component mounts
  useEffect(() => {
    if (!currentConfig) {
      setCurrentConfig(null); // This will set the default config
    }
  }, []);

  useEffect(() => {
    const handlePanelSettings = (event: Event) => {
      const { panelType } = (event as CustomEvent).detail;
      if (panelType === 'chat') {
        setActiveSection('chat');
      }
    };

    window.addEventListener('openPanelSettings', handlePanelSettings as EventListener);
    return () => window.removeEventListener('openPanelSettings', handlePanelSettings as EventListener);
  }, []);

  if (!isOpen) return null;

  const sections = {
    chat: {
      icon: MessageSquare,
      title: 'Chat Settings',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Assistant Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={currentConfig?.name}
                  onChange={(e) => setCurrentConfig(
                    currentConfig ? { ...currentConfig, name: e.target.value } : null
                  )}
                  className="w-full bg-gray-700 text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={currentConfig?.role}
                  onChange={(e) => setCurrentConfig(
                    currentConfig ? { ...currentConfig, role: e.target.value } : null
                  )}
                  className="w-full bg-gray-700 text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={currentConfig?.modelConfig.model}
                  onChange={(e) => setCurrentConfig(
                    currentConfig ? {
                      ...currentConfig,
                      modelConfig: { ...currentConfig.modelConfig, model: e.target.value }
                    } : null
                  )}
                  className="w-full bg-gray-700 text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={currentConfig?.modelConfig.temperature}
                  onChange={(e) => setCurrentConfig(
                    currentConfig ? {
                      ...currentConfig,
                      modelConfig: { ...currentConfig.modelConfig, temperature: parseFloat(e.target.value) }
                    } : null
                  )}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => currentConfig && saveConfig(currentConfig)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )
    },
    general: {
      icon: Settings,
      title: 'General Settings',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Workspace Behavior</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Auto-save interval</label>
                <select className="bg-gray-700 text-gray-200 rounded-md px-3 py-1">
                  <option>30 seconds</option>
                  <option>1 minute</option>
                  <option>5 minutes</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Default panel size</label>
                <div className="flex gap-2">
                  <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" placeholder="Width" />
                  <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" placeholder="Height" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    panels: {
      icon: Layout,
      title: 'Panel Configuration',
      content: (
        <div className="space-y-6">
          {['Terminal', 'Code Editor', 'Chat', 'Database'].map((panel) => (
            <div key={panel} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-200">{panel}</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
                    Reset
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Default position</label>
                  <div className="flex gap-2">
                    <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" placeholder="X" />
                    <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" placeholder="Y" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Minimum size</label>
                  <div className="flex gap-2">
                    <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" placeholder="Width" />
                    <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" placeholder="Height" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    layout: {
      icon: Monitor,
      title: 'Layout Management',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Grid Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Grid size</label>
                <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Snap threshold</label>
                <input type="number" className="w-20 bg-gray-700 text-gray-200 rounded-md px-2 py-1" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    appearance: {
      icon: Sliders,
      title: 'Appearance',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 bg-gray-800 rounded-lg border-2 border-blue-500">
                <div className="h-20 bg-gray-900 rounded-md mb-2"></div>
                <span className="text-sm text-gray-200">Dark</span>
              </button>
              <button className="p-4 bg-white rounded-lg">
                <div className="h-20 bg-gray-100 rounded-md mb-2"></div>
                <span className="text-sm text-gray-800">Light</span>
              </button>
              <button className="p-4 bg-gray-800 rounded-lg">
                <div className="h-20 bg-blue-900 rounded-md mb-2"></div>
                <span className="text-sm text-gray-200">Custom</span>
              </button>
            </div>
          </div>
        </div>
      )
    },
    integrations: {
      icon: Cloud,
      title: 'Integrations',
      content: (
        <div className="space-y-6">
          {[
            { name: 'Database', icon: Database, connected: true },
            { name: 'Git', icon: GitBranch, connected: false },
            { name: 'Terminal', icon: Terminal, connected: true },
            { name: 'Chat', icon: MessageSquare, connected: true },
            { name: 'Code Editor', icon: Code, connected: true },
            { name: 'File System', icon: FileText, connected: true }
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <integration.icon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-200">{integration.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${integration.connected ? 'text-green-400' : 'text-gray-400'}`}>
                  {integration.connected ? 'Connected' : 'Not connected'}
                </span>
                <button className={`px-3 py-1 rounded-md text-sm ${
                  integration.connected 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                }`}>
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-[90vw] h-[90vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1">
            {(Object.entries(sections) as [SettingsSection, typeof sections[keyof typeof sections]][]).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                  ${activeSection === key 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}
                `}
              >
                <section.icon className="w-4 h-4" />
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
              {(() => {
                const Icon = sections[activeSection].icon;
                return <Icon className="w-6 h-6" />;
              })()}
              {sections[activeSection].title}
            </h2>
            {sections[activeSection].content}
          </div>
        </div>
      </div>
    </div>
  );
};