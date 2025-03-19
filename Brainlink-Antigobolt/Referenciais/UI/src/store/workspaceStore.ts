import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkspacePanel {
  id: string;
  title: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized?: boolean;
  isMinimized?: boolean;
  order?: number; // Added for responsive layout ordering
  group?: string; // Added for panel grouping
}

export interface WorkspaceLayout {
  id: string;
  name: string;
  panels: WorkspacePanel[];
  createdAt: number;
  updatedAt: number;
}

interface WorkspaceState {
  panels: WorkspacePanel[];
  layouts: WorkspaceLayout[];
  activeLayout: string | null;
  isSettingsOpen: boolean;
  settingsSection: string;
  setPanels: (panels: WorkspacePanel[]) => void;
  addPanel: (panel: WorkspacePanel) => void;
  updatePanel: (id: string, updates: Partial<WorkspacePanel>) => void;
  removePanel: (id: string) => void;
  saveLayout: (name: string) => void;
  loadLayout: (id: string) => void;
  deleteLayout: (id: string) => void;
  rearrangePanels: (width: number, height: number) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  setSettingsSection: (section: string) => void;
}

// Configuration
const MARGIN = 6; // 1.5mm in pixels
const MIN_PANEL_WIDTH = 200;
const MIN_PANEL_HEIGHT = 100;

// Breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      panels: [],
      layouts: [],
      activeLayout: null,
      isSettingsOpen: false,
      settingsSection: 'general',

      setPanels: (panels) => set({ panels }),

      addPanel: (panel) => 
        set((state) => ({ 
          panels: [...state.panels, { ...panel, order: state.panels.length }] 
        })),

      updatePanel: (id, updates) =>
        set((state) => ({
          panels: state.panels.map((panel) =>
            panel.id === id ? { ...panel, ...updates } : panel
          ),
        })),

      removePanel: (id) =>
        set((state) => ({
          panels: state.panels.filter((panel) => panel.id !== id),
        })),

      saveLayout: (name) => {
        const { panels } = get();
        const layout: WorkspaceLayout = {
          id: crypto.randomUUID(),
          name,
          panels: panels.map(({ ...panel }) => panel),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          layouts: [...state.layouts, layout],
          activeLayout: layout.id,
        }));
      },

      loadLayout: (id) => {
        const { layouts } = get();
        const layout = layouts.find((l) => l.id === id);
        if (!layout) return;

        set({
          panels: layout.panels,
          activeLayout: id,
        });
      },

      deleteLayout: (id) =>
        set((state) => ({
          layouts: state.layouts.filter((layout) => layout.id !== id),
          activeLayout: state.activeLayout === id ? null : state.activeLayout,
        })),

      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
      
      setSettingsSection: (section) => set({ settingsSection: section }),

      rearrangePanels: (width, height) => {
        const { panels } = get();
        const sortedPanels = [...panels].sort((a, b) => (a.order || 0) - (b.order || 0));
        const updatedPanels: WorkspacePanel[] = [];

        // Calculate available space
        const sidebarWidth = width < BREAKPOINTS.md ? 48 : 64;
        const headerHeight = 48;
        const availableWidth = width - sidebarWidth - (MARGIN * 2);
        const availableHeight = height - headerHeight - (MARGIN * 2);

        // Helper function to calculate optimal panel size
        const getOptimalSize = (panel: WorkspacePanel, maxWidth: number, maxHeight: number) => {
          const aspectRatio = panel.size.width / panel.size.height;
          let newWidth = Math.min(panel.size.width, maxWidth);
          let newHeight = newWidth / aspectRatio;

          if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
          }

          return {
            width: Math.max(MIN_PANEL_WIDTH, Math.min(newWidth, maxWidth)),
            height: Math.max(MIN_PANEL_HEIGHT, Math.min(newHeight, maxHeight))
          };
        };

        // Mobile layout (single column)
        if (width < BREAKPOINTS.md) {
          let currentY = MARGIN;

          sortedPanels.forEach((panel) => {
            const size = getOptimalSize(panel, availableWidth, availableHeight / 3);
            updatedPanels.push({
              ...panel,
              position: { x: MARGIN, y: currentY },
              size,
              group: 'mobile'
            });
            currentY += size.height + MARGIN;
          });
        }
        // Tablet layout (2 columns)
        else if (width < BREAKPOINTS.lg) {
          const columns = [MARGIN, availableWidth / 2 + MARGIN];
          const columnHeights = [MARGIN, MARGIN];

          sortedPanels.forEach((panel, index) => {
            const columnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
            const size = getOptimalSize(panel, availableWidth / 2 - MARGIN, availableHeight / 2);

            updatedPanels.push({
              ...panel,
              position: { x: columns[columnIndex], y: columnHeights[columnIndex] },
              size,
              group: `tablet-${columnIndex}`
            });

            columnHeights[columnIndex] += size.height + MARGIN;
          });
        }
        // Desktop layout (maintain original layout with adjustments)
        else {
          const columns = Math.floor(availableWidth / (MIN_PANEL_WIDTH + MARGIN));
          const columnWidth = availableWidth / columns;

          sortedPanels.forEach((panel, index) => {
            const columnIndex = index % columns;
            const rowIndex = Math.floor(index / columns);
            const size = getOptimalSize(panel, columnWidth - MARGIN, availableHeight / 2);

            updatedPanels.push({
              ...panel,
              position: {
                x: MARGIN + (columnIndex * (columnWidth)),
                y: MARGIN + (rowIndex * (size.height + MARGIN))
              },
              size,
              group: `desktop-${columnIndex}-${rowIndex}`
            });
          });
        }

        set({ panels: updatedPanels });
      },
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({
        layouts: state.layouts,
        activeLayout: state.activeLayout,
      }),
    }
  )
);