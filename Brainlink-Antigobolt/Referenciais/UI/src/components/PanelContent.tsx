import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { WorkspacePanel } from '../store/workspaceStore';
import { useAssistantStore } from '../store/assistantStore'; 
import { usePluginStore } from '../store/pluginStore';
import { Send, ChevronDown, Power, AlertCircle } from 'lucide-react';
import { StoragePanel } from './StoragePanel';
import { GraphVisualizer } from './GraphVisualizer';
import { PluginSelector } from './PluginSelector';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useRef } from 'react';
import { useCallback } from 'react';

interface PanelContentProps {
  panel: WorkspacePanel;
}

const TerminalComponent: React.FC = () => {
  const terminalInstance = useRef<Terminal>();
  const fitAddonRef = useRef<FitAddon>();
  const resizeObserver = useRef<ResizeObserver>();
  const commandHistory = useRef<string[]>([]);
  const commandIndex = useRef<number>(-1);
  const currentCommand = useRef<string>('');
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadXtermStyles = async () => {
      await import('xterm/css/xterm.css');
      setIsReady(true);
    };
    loadXtermStyles();
  }, []);

  const handleResize = useCallback(() => {
    if (fitAddonRef.current && terminalInstance.current && containerRef.current) {
      try {
        fitAddonRef.current.fit();
        terminalInstance.current.focus();
      } catch (error) {
        console.error('Terminal fit error:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      resizeObserver.current = new ResizeObserver(handleResize);
      resizeObserver.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [handleResize]);

  useEffect(() => {
    if (!terminalInstance.current && containerRef.current && isReady) {
      const container = containerRef.current;
      const { width, height } = container.getBoundingClientRect();
      
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        rows: 24,
        cols: 80,
        theme: {
          background: '#111827',
          cursor: '#3b82f6',
          foreground: '#ffffff'
        },
        allowTransparency: true,
        convertEol: true
      });

      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;
      term.loadAddon(fitAddon);
      term.open(container);
      
      // Initial fit
      requestAnimationFrame(() => {
        fitAddon.fit();
        term.focus();
      });
      
      terminalInstance.current = term;
      term.write('\x1b[1;32mWelcome to BrainLink Terminal\x1b[0m\r\n$ ');

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent as KeyboardEvent;
        
        if (ev.key === 'Enter') {
          const command = currentCommand.current.trim();
          if (command) {
            commandHistory.current.push(command);
            commandIndex.current = commandHistory.current.length;
            // Execute command here
            term.write('\r\n' + command);
            term.write('\r\n$ ');
          } else {
            term.write('\r\n$ ');
          }
          currentCommand.current = '';
        } else if (ev.key === 'ArrowUp') {
          if (commandIndex.current > 0) {
            commandIndex.current--;
            currentCommand.current = commandHistory.current[commandIndex.current];
            term.write('\x1b[2K\r$ ' + currentCommand.current);
          }
        } else if (ev.key === 'ArrowDown') {
          if (commandIndex.current < commandHistory.current.length - 1) {
            commandIndex.current++;
            currentCommand.current = commandHistory.current[commandIndex.current];
            term.write('\x1b[2K\r$ ' + currentCommand.current);
          } else {
            commandIndex.current = commandHistory.current.length;
            currentCommand.current = '';
            term.write('\x1b[2K\r$ ');
          }
        } else if (ev.key === 'Backspace') {
          if (currentCommand.current.length > 0) {
            currentCommand.current = currentCommand.current.slice(0, -1);
            term.write('\b \b');
          }
        } else if (!ev.ctrlKey && !ev.altKey) {
          currentCommand.current += key;
          term.write(key);
        }
      });
    }

    return () => {
      try {
        if (terminalInstance.current) {
          if (resizeObserver.current) {
            resizeObserver.current.disconnect();
          }
          terminalInstance.current.dispose();
        }
      } catch (error) {
        console.error('Terminal cleanup error:', error);
      }
    };
  }, [isReady]);

  return (
    <div ref={containerRef} className="h-full w-full bg-gray-900 rounded-md overflow-hidden p-2" />
  );
};

const PanelContent: React.FC<PanelContentProps> = ({ panel }) => {
  const [inputMessage, setInputMessage] = useState('');
  const { 
    currentSession, 
    addMessage, 
    createSession, 
    currentConfig,
    loadConfigs,
    savedConfigs
  } = useAssistantStore();

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const renderContent = () => {
    switch (panel.type) {
      case 'graph':
        return <GraphVisualizer />;

      case 'storage':
        return <StoragePanel />;

      case 'plugin':
        return <PluginPanel panel={panel} />;

      case 'chat':
        const handleSendMessage = () => {
          if (!inputMessage.trim()) return;

          if (!currentSession && currentConfig) {
            createSession(currentConfig);
          } else if (!currentSession && savedConfigs.length > 0) {
            createSession(savedConfigs[0]);
          }

          addMessage({
            role: 'user',
            content: inputMessage
          });

          setInputMessage('');
        };

        return (
          <div className="h-full flex flex-col">
            {!currentSession && !currentConfig && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg m-4">
                <p className="text-sm text-blue-400">
                  Configure the assistant settings to start chatting
                </p>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentSession?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`
                    flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-lg p-3
                      ${message.role === 'user' 
                        ? 'bg-blue-500/20 text-blue-100' 
                        : 'bg-gray-700 text-gray-300'}
                    `}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="h-full">
            <div className="bg-gray-800 p-4 rounded-md">
              <pre className="text-sm font-mono text-gray-300">
                <code>{`function example() {
  console.log("Hello, World!");
  return {
    message: "Welcome to the code editor!",
    status: "ready"
  };
}`}</code>
              </pre>
            </div>
          </div>
        );

      case 'terminal':
        return (
          <TerminalComponent />
        );

      case 'database':
        return (
          <div className="p-4 space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-200">Database Connection</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-green-400">Connected</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Connected to: brain-link-db</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-200 mb-2">Tables</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>assistant_configs</li>
                <li>chat_sessions</li>
                <li>plugins</li>
                <li>storage_items</li>
                <li>sync_queue</li>
                <li>roadmap_items</li>
                <li>organizations</li>
                <li>user_profiles</li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <div className="text-gray-400">
              Content for {panel.title}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-800 rounded-lg overflow-hidden">
      {renderContent()}
    </div>
  );
};

interface PluginPanelProps {
  panel: WorkspacePanel;
}

const PluginPanel: React.FC<PluginPanelProps> = ({ panel }) => {
  const { plugins, activePlugins } = usePluginStore();
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const selectedPlugin = plugins.find(p => p.id === selectedPluginId);

  const handlePluginSelect = (pluginId: string) => {
    setSelectedPluginId(pluginId);
    setIsSelectorOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 rounded-md text-gray-200 hover:bg-gray-600"
          >
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-blue-400" />
              <span>{selectedPlugin?.name || "Select a plugin"}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <PluginSelector
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            onSelect={handlePluginSelect}
          />
        </div>
      </div>

      <div className="flex-1 p-4">
        {selectedPlugin ? (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-200 mb-2">{selectedPlugin.name}</h3>
              <p className="text-gray-400">{selectedPlugin.description}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-200 mb-2">Plugin Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-gray-200">{selectedPlugin.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Author</span>
                  <span className="text-gray-200">{selectedPlugin.author}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a plugin to view its content
          </div>
        )}
      </div>
    </div>
  );
};

export { PanelContent };