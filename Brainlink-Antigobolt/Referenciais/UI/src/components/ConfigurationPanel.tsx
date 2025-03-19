import React from 'react';
import { Settings, Save, Trash2 } from 'lucide-react';
import { AssistantConfig } from '../types/assistant';
import { useAssistantStore } from '../store/assistantStore';

interface ConfigurationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurationPanel({ isOpen, onClose }: ConfigurationPanelProps) {
  const { currentConfig, setCurrentConfig, saveConfig } = useAssistantStore();
  const [localConfig, setLocalConfig] = React.useState<AssistantConfig | null>(currentConfig);

  const handleSave = async () => {
    if (!localConfig) return;
    await saveConfig(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Assistant Configuration
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={localConfig?.name || ''}
                    onChange={(e) =>
                      setLocalConfig(
                        localConfig
                          ? { ...localConfig, name: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={localConfig?.role || ''}
                    onChange={(e) =>
                      setLocalConfig(
                        localConfig
                          ? { ...localConfig, role: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
              </div>
            </section>

            {/* Model Configuration */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Model Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={localConfig?.modelConfig.model || 'gpt-3.5-turbo'}
                    onChange={(e) =>
                      setLocalConfig(
                        localConfig
                          ? {
                              ...localConfig,
                              modelConfig: {
                                ...localConfig.modelConfig,
                                model: e.target.value,
                              },
                            }
                          : null
                      )
                    }
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    className="mt-1 block w-full"
                    value={localConfig?.modelConfig.temperature || 0.7}
                    onChange={(e) =>
                      setLocalConfig(
                        localConfig
                          ? {
                              ...localConfig,
                              modelConfig: {
                                ...localConfig.modelConfig,
                                temperature: parseFloat(e.target.value),
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
              </div>
            </section>

            {/* Personality Configuration */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Personality</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Communication Style
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={localConfig?.personality.communicationStyle || ''}
                    onChange={(e) =>
                      setLocalConfig(
                        localConfig
                          ? {
                              ...localConfig,
                              personality: {
                                ...localConfig.personality,
                                communicationStyle: e.target.value,
                              },
                            }
                          : null
                      )
                    }
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Formality
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={localConfig?.personality.formality || ''}
                    onChange={(e) =>
                      setLocalConfig(
                        localConfig
                          ? {
                              ...localConfig,
                              personality: {
                                ...localConfig.personality,
                                formality: e.target.value as any,
                              },
                            }
                          : null
                      )
                    }
                  >
                    <option value="casual">Casual</option>
                    <option value="neutral">Neutral</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}