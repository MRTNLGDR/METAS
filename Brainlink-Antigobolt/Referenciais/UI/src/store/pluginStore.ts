import { create } from 'zustand';
import { Plugin, PluginConfig } from '../types/plugin';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

const ErrorSchema = z.object({
  message: z.string()
});

type PluginError = z.infer<typeof ErrorSchema>;

export interface PluginStore {
  plugins: Plugin[];
  activePlugins: Set<string>;
  isLoading: boolean;
  error: PluginError | null;
  
  loadPlugins: () => Promise<void>;
  installPlugin: (config: PluginConfig) => Promise<void>;
  uninstallPlugin: (id: string) => Promise<void>;
  activatePlugin: (id: string) => Promise<void>;
  deactivatePlugin: (id: string) => Promise<void>;
  updatePluginConfig: (id: string, config: Record<string, any>) => Promise<void>;
}

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: [],
  activePlugins: new Set(),
  isLoading: false,
  error: null,

  loadPlugins: async () => {
    set({ isLoading: true, error: null });
    try {
      // Validate user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('plugins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const plugins: Plugin[] = data.map(plugin => ({
        ...plugin,
        isActive: false,
        isInstalled: true,
        permissions: plugin.permissions || [],
        dependencies: plugin.dependencies || {},
        config: plugin.config || {}
      }));

      set({ plugins });
    } catch (error) {
      set({ error: { message: (error as Error).message } });
    } finally {
      set({ isLoading: false });
    }
  },

  installPlugin: async (config) => {
    set({ isLoading: true, error: null });
    try {
      // Validate config
      const validatedConfig = PluginConfigSchema.parse(config);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('plugins')
        .insert([{ ...validatedConfig, user_id: user.id }]);

      if (error) throw error;

      const newPlugin: Plugin = {
        ...validatedConfig,
        isActive: false,
        isInstalled: true,
        userId: user.id
      };

      set(state => ({
        plugins: [...state.plugins, newPlugin]
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        set({ error: { message: 'Invalid plugin configuration' } });
      } else {
        set({ error: { message: (error as Error).message } });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  uninstallPlugin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('plugins')
        .delete()
        .match({ id });

      if (error) throw error;

      set(state => ({
        plugins: state.plugins.filter(p => p.id !== id),
        activePlugins: new Set([...state.activePlugins].filter(pid => pid !== id))
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  activatePlugin: async (id) => {
    const plugin = get().plugins.find(p => p.id === id);
    if (!plugin) return;

    try {
      set(state => ({
        plugins: state.plugins.map(p => 
          p.id === id ? { ...p, isActive: true } : p
        ),
        activePlugins: new Set([...state.activePlugins, id])
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deactivatePlugin: async (id) => {
    const plugin = get().plugins.find(p => p.id === id);
    if (!plugin) return;

    try {
      set(state => ({
        plugins: state.plugins.map(p => 
          p.id === id ? { ...p, isActive: false } : p
        ),
        activePlugins: new Set([...state.activePlugins].filter(pid => pid !== id))
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updatePluginConfig: async (id, config) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('plugins')
        .update({ config })
        .match({ id });

      if (error) throw error;

      set(state => ({
        plugins: state.plugins.map(p => 
          p.id === id ? { ...p, config } : p
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  }
}));