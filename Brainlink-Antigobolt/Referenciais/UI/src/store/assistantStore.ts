import { create } from 'zustand';
import { AssistantConfig, Message, ChatSession } from '../types/assistant';
import { supabase } from '../lib/supabase';

const defaultConfig: AssistantConfig = {
  name: '',
  role: '',
  expertise: [],
  personality: {
    traits: [],
    communicationStyle: 'professional',
    formality: 'neutral',
  },
  knowledge: {
    domains: [],
    limitations: [],
  },
  responseFormat: {
    style: 'concise',
    structure: 'free',
  },
  language: {
    primary: 'en',
    tone: 'professional',
  },
  contextHandling: {
    memoryLength: 10,
    contextStrategy: 'recent',
  },
  modelConfig: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopSequences: [],
  },
};

interface AssistantStore {
  currentConfig: AssistantConfig | null;
  savedConfigs: AssistantConfig[];
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  
  // Configuration actions
  setCurrentConfig: (config: AssistantConfig) => void;
  saveConfig: (config: AssistantConfig) => Promise<void>;
  loadConfigs: () => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  
  // Session actions
  createSession: (config: AssistantConfig) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearSession: () => void;
  loadSessions: () => Promise<void>;
  saveSession: () => Promise<void>;
}

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  currentConfig: null,
  savedConfigs: [],
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,

  setCurrentConfig: (config) => set({ 
    currentConfig: config || { ...defaultConfig }
  }),

  saveConfig: async (config) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('assistant_configs')
        .upsert([config])
        .select();

      if (error) throw error;

      set((state) => ({
        savedConfigs: [...state.savedConfigs, data[0]],
        currentConfig: data[0],
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  loadConfigs: async () => {
    set({ isLoading: true, error: null });
    try {
      // Initialize with default config if none exists
      if (!get().currentConfig) {
        set({ currentConfig: { ...defaultConfig } });
      }

      const { data, error } = await supabase
        .from('assistant_configs')
        .select('*');

      if (error) throw error;

      set({ savedConfigs: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteConfig: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('assistant_configs')
        .delete()
        .match({ id });

      if (error) throw error;

      set((state) => ({
        savedConfigs: state.savedConfigs.filter((config) => config.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createSession: (config) => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      config,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set({ currentSession: newSession });
  },

  addMessage: (message) => {
    set((state) => {
      if (!state.currentSession) return state;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        ...message,
        timestamp: Date.now(),
      };

      const updatedSession: ChatSession = {
        ...state.currentSession,
        messages: [...state.currentSession.messages, newMessage],
        updatedAt: Date.now(),
      };

      return { currentSession: updatedSession };
    });
  },

  clearSession: () => set({ currentSession: null }),

  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*');

      if (error) throw error;

      set({ sessions: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .upsert([currentSession])
        .select();

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));