import React from 'react';
import { WorkspacePanel } from '../store/workspaceStore';

interface PanelGridProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  activePanel: WorkspacePanel | null;
}

export const PanelGrid: React.FC<PanelGridProps> = ({ containerRef, isDragging, activePanel }) => {
  const [gridSize, setGridSize] = React.useState({ width: 0, height: 0 });
  const cellSize = 20; // Size of each grid cell in pixels

  React.useEffect(() => {
    if (!containerRef.current) return;

    const updateGridSize = () => {
      setGridSize({
        width: containerRef.current?.clientWidth || 0,
        height: containerRef.current?.clientHeight || 0,
      });
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, [containerRef]);

  if (!isDragging || !activePanel) return null;

  const columns = Math.floor(gridSize.width / cellSize);
  const rows = Math.floor(gridSize.height / cellSize);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: isDragging ? 0.1 : 0 }}
      >
        <defs>
          <pattern
            id="grid"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-purple-500"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Grid Cells Highlight */}
      <div
        className="absolute transition-opacity duration-200"
        style={{
          width: Math.ceil(activePanel.size.width / cellSize) * cellSize,
          height: Math.ceil(activePanel.size.height / cellSize) * cellSize,
          left: Math.round(activePanel.position.x / cellSize) * cellSize,
          top: Math.round(activePanel.position.y / cellSize) * cellSize,
          background: 'rgba(147, 51, 234, 0.1)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          opacity: isDragging ? 1 : 0,
        }}
      />
    </div>
  );
};