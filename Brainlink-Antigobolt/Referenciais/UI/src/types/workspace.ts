import { WorkspacePanel } from '../store/workspaceStore';

export interface LayoutPreset {
  id: string;
  name: string;
  shortcut: string;
  panels: WorkspacePanel[];
}

export interface WorkspaceMode {
  type: 'edit' | 'work';
  isLocked: boolean;
}

export interface LayoutHistory {
  id: string;
  timestamp: number;
  layout: WorkspacePanel[];
}