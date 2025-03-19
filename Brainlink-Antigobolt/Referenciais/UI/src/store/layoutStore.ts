import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LayoutPreset, WorkspaceMode } from '../types/workspace';
import { WorkspacePanel } from './workspaceStore';

interface LayoutState {
  mode: WorkspaceMode;
  presets: LayoutPreset[];
  layouts: Array<{
    id: string;
    name: string;
    panels: WorkspacePanel[];
    shortcut?: string;
  }>;
  activeLayoutId: string | null;
  
  setMode: (type: 'edit' | 'work') => void;
  saveLayout: (name: string, panels: WorkspacePanel[]) => void;
  loadLayout: (id: string) => WorkspacePanel[];
  deleteLayout: (id: string) => void;
  updateLayout: (id: string, updates: Partial<{ name: string; panels: WorkspacePanel[] }>) => void;
  loadPreset: (id: string) => WorkspacePanel[];
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      mode: { type: 'work', isLocked: true },
      presets: [
        {
          id: 'default-1',
          name: 'Development',
          shortcut: 'Ctrl+1',
          panels: [
            {
              id: 'editor',
              title: 'Code Editor',
              type: 'code',
              position: { x: 0, y: 0 },
              size: { width: 800, height: 600 }
            },
            {
              id: 'terminal',
              title: 'Terminal',
              type: 'terminal',
              position: { x: 0, y: 620 },
              size: { width: 800, height: 200 }
            }
          ]
        },
        {
          id: 'default-2',
          name: 'Full Stack',
          shortcut: 'Ctrl+2',
          panels: [
            {
              id: 'editor',
              title: 'Frontend',
              type: 'code',
              position: { x: 0, y: 0 },
              size: { width: 600, height: 400 }
            },
            {
              id: 'backend',
              title: 'Backend',
              type: 'code',
              position: { x: 620, y: 0 },
              size: { width: 600, height: 400 }
            },
            {
              id: 'terminal',
              title: 'Terminal',
              type: 'terminal',
              position: { x: 0, y: 420 },
              size: { width: 1220, height: 200 }
            }
          ]
        },
        {
          id: 'default-3',
          name: 'Database',
          shortcut: 'Ctrl+3',
          panels: [
            {
              id: 'db',
              title: 'Database',
              type: 'database',
              position: { x: 0, y: 0 },
              size: { width: 600, height: 800 }
            },
            {
              id: 'query',
              title: 'Query Editor',
              type: 'code',
              position: { x: 620, y: 0 },
              size: { width: 600, height: 400 }
            }
          ]
        },
        {
          id: 'default-4',
          name: 'Documentation',
          shortcut: 'Ctrl+4',
          panels: [
            {
              id: 'docs',
              title: 'Documentation',
              type: 'documents',
              position: { x: 0, y: 0 },
              size: { width: 800, height: 600 }
            },
            {
              id: 'preview',
              title: 'Preview',
              type: 'preview',
              position: { x: 820, y: 0 },
              size: { width: 400, height: 600 }
            }
          ]
        },
        {
          id: 'default-5',
          name: 'Chat',
          shortcut: 'Ctrl+5',
          panels: [
            {
              id: 'chat',
              title: 'AI Assistant',
              type: 'chat',
              position: { x: 0, y: 0 },
              size: { width: 400, height: 800 }
            },
            {
              id: 'context',
              title: 'Context',
              type: 'documents',
              position: { x: 420, y: 0 },
              size: { width: 800, height: 800 }
            }
          ]
        }
      ],
      layouts: [],
      activeLayoutId: null,

      setMode: (type) => set((state) => ({
        mode: { ...state.mode, type }
      })),

      saveLayout: (name, panels) => {
        const id = crypto.randomUUID();
        set((state) => {
          // Limit to 20 layouts
          const layouts = [...state.layouts];
          if (layouts.length >= 20) {
            layouts.pop(); // Remove the oldest layout
          }
          return {
            layouts: [{ id, name, panels }, ...layouts],
            activeLayoutId: id
          };
        });
      },

      loadLayout: (id) => {
        const { layouts, presets } = get();
        const layout = layouts.find(l => l.id === id) || presets.find(p => p.id === id);
        return layout ? layout.panels : [];
      },

      deleteLayout: (id) => set((state) => ({
        layouts: state.layouts.filter(l => l.id !== id),
        activeLayoutId: state.activeLayoutId === id ? null : state.activeLayoutId
      })),

      updateLayout: (id, updates) => set((state) => ({
        layouts: state.layouts.map(layout =>
          layout.id === id ? { ...layout, ...updates } : layout
        )
      })),

      loadPreset: (id) => {
        const { presets } = get();
        const preset = presets.find(p => p.id === id);
        return preset ? preset.panels : [];
      }
    }),
    {
      name: 'workspace-layouts',
      partialize: (state) => ({
        layouts: state.layouts,
        activeLayoutId: state.activeLayoutId
      })
    }
  )
);