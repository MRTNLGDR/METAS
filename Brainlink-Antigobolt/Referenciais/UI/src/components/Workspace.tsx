import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Maximize2, Minimize2, Minus, LayoutGrid, XCircle, Settings } from 'lucide-react';
import { PanelContent } from './PanelContent';
import { WorkspacePanel, useWorkspaceStore } from '../store/workspaceStore';

interface WorkspaceProps {
  panels: WorkspacePanel[];
  onPanelUpdate: (panel: WorkspacePanel) => void;
  onPanelClose: (panelId: string) => void;
}

// Configuration
const SNAP_THRESHOLD = 20;
const PREDICTION_THRESHOLD = 50;
const SNAP_ANIMATION_DURATION = 150;
const GRID_SIZE = 10;
const PANEL_MARGIN = 6; // 1.5mm in pixels
const BASE_Z_INDEX = 0;
const MAX_Z_INDEX = 999;

interface SnapGuide {
  position: number;
  type: 'vertical' | 'horizontal';
  strength: number;
}

interface SnapPreview {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

export const Workspace: React.FC<WorkspaceProps> = ({ panels, onPanelUpdate, onPanelClose }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [snapPreview, setSnapPreview] = useState<SnapPreview | null>(null);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [showAutoOrganize, setShowAutoOrganize] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [predictedSnapPoints, setPredictedSnapPoints] = useState<Array<{x: number, y: number}>>([]);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const maxZIndexRef = useRef(BASE_Z_INDEX);
  const { setSettingsOpen, setSettingsSection } = useWorkspaceStore();

  // Initialize z-indexes for panels
  useEffect(() => {
    const newZIndexes: Record<string, number> = {};
    panels.forEach((panel, index) => {
      if (!(panel.id in newZIndexes)) {
        newZIndexes[panel.id] = maxZIndexRef.current + index;
      }
    });
    setZIndexes(newZIndexes);
    maxZIndexRef.current = Math.max(...Object.values(newZIndexes), maxZIndexRef.current);
  }, [panels]);

  const bringToFront = (panelId: string) => {
    setZIndexes(prev => {
      const newZIndexes = { ...prev };
      const currentMaxZ = maxZIndexRef.current;
      
      // Se o painel já está no topo, não faz nada
      if (newZIndexes[panelId] === currentMaxZ) {
        return prev;
      }
      
      // Decrementa o z-index de todos os painéis que estavam acima do atual
      const currentZ = newZIndexes[panelId];
      Object.keys(newZIndexes).forEach(id => {
        if (newZIndexes[id] > currentZ) {
          newZIndexes[id]--;
        }
      });
      
      // Coloca o painel selecionado no topo
      newZIndexes[panelId] = currentMaxZ;
      return newZIndexes;
    });
  };

  // Check for overlapping panels
  useEffect(() => {
    const hasOverlap = panels.some((panel1, i) => 
      panels.some((panel2, j) => {
        if (i === j) return false;
        return !(
          panel1.position.x + panel1.size.width + PANEL_MARGIN < panel2.position.x ||
          panel1.position.x > panel2.position.x + panel2.size.width + PANEL_MARGIN ||
          panel1.position.y + panel1.size.height + PANEL_MARGIN < panel2.position.y ||
          panel1.position.y > panel2.position.y + panel2.size.height + PANEL_MARGIN
        );
      })
    );
    setShowAutoOrganize(hasOverlap);
  }, [panels]);

  const autoOrganizePanels = () => {
    const margin = PANEL_MARGIN;
    const maxWidth = containerSize.width - margin * 2;
    const maxHeight = containerSize.height - margin * 2;
    
    // Calculate optimal grid dimensions
    const count = panels.length;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    
    // Calculate panel dimensions
    const panelWidth = (maxWidth - (cols - 1) * margin) / cols;
    const panelHeight = (maxHeight - (rows - 1) * margin) / rows;
    
    // Update panel positions
    const updatedPanels = panels.map((panel, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      return {
        ...panel,
        position: {
          x: margin + col * (panelWidth + margin),
          y: margin + row * (panelHeight + margin)
        },
        size: {
          width: panelWidth,
          height: panelHeight
        }
      };
    });
    
    // Update all panels
    updatedPanels.forEach(panel => onPanelUpdate(panel));
    setShowAutoOrganize(false);
  };

  const closeAllPanels = () => {
    panels.forEach(panel => onPanelClose(panel.id));
    setShowAutoOrganize(false);
  };

  // Handle Alt key for disabling snapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault();
        setIsAltPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate potential snap points
  const calculatePotentialSnapPoints = useCallback((panel: WorkspacePanel) => {
    const points: Array<{x: number, y: number}> = [];
    
    // Container edges and centers
    points.push(
      { x: 0, y: 0 }, // Top-left
      { x: containerSize.width - panel.size.width, y: 0 }, // Top-right
      { x: 0, y: containerSize.height - panel.size.height }, // Bottom-left
      { x: containerSize.width - panel.size.width, y: containerSize.height - panel.size.height }, // Bottom-right
      { x: (containerSize.width - panel.size.width) / 2, y: (containerSize.height - panel.size.height) / 2 } // Center
    );

    // Points relative to other panels
    panels.forEach(otherPanel => {
      if (otherPanel.id === panel.id) return;

      // Adjacent positions
      points.push(
        { x: otherPanel.position.x + otherPanel.size.width, y: otherPanel.position.y }, // Right
        { x: otherPanel.position.x - panel.size.width, y: otherPanel.position.y }, // Left
        { x: otherPanel.position.x, y: otherPanel.position.y + otherPanel.size.height }, // Bottom
        { x: otherPanel.position.x, y: otherPanel.position.y - panel.size.height } // Top
      );

      // Aligned positions
      points.push(
        { x: otherPanel.position.x, y: otherPanel.position.y }, // Same position
        { x: otherPanel.position.x + (otherPanel.size.width - panel.size.width) / 2, y: otherPanel.position.y } // Centered horizontally
      );
    });

    return points;
  }, [containerSize, panels]);

  // Calculate snap positions for a panel
  const calculateSnapPositions = useCallback((
    currentPanel: WorkspacePanel,
    x: number,
    y: number,
    width: number,
    height: number
  ): { snapX: number | null; snapY: number | null; preview: SnapPreview | null } => {
    if (isAltPressed) return { snapX: null, snapY: null, preview: null };

    const guides: SnapGuide[] = [];
    const center = { x: x + width / 2, y: y + height / 2 };
    
    // Container edges
    guides.push(
      { position: PANEL_MARGIN, type: 'vertical', strength: 1 },
      { position: containerSize.width - PANEL_MARGIN, type: 'vertical', strength: 1 },
      { position: PANEL_MARGIN, type: 'horizontal', strength: 1 },
      { position: containerSize.height - PANEL_MARGIN, type: 'horizontal', strength: 1 }
    );

    // Center lines
    guides.push(
      { position: containerSize.width / 2, type: 'vertical', strength: 0.8 },
      { position: containerSize.height / 2, type: 'horizontal', strength: 0.8 }
    );

    // Other panels
    panels.forEach(panel => {
      if (panel.id === currentPanel.id) return;

      // Add margin to panel edges for snapping
      const panelLeft = panel.position.x - PANEL_MARGIN;
      const panelRight = panel.position.x + panel.size.width + PANEL_MARGIN;
      const panelTop = panel.position.y - PANEL_MARGIN;
      const panelBottom = panel.position.y + panel.size.height + PANEL_MARGIN;

      const panelCenter = {
        x: panel.position.x + panel.size.width / 2,
        y: panel.position.y + panel.size.height / 2
      };

      guides.push(
        { position: panelLeft, type: 'vertical', strength: 0.7 },
        { position: panelRight, type: 'vertical', strength: 0.7 },
        { position: panelTop, type: 'horizontal', strength: 0.7 },
        { position: panelBottom, type: 'horizontal', strength: 0.7 },
        { position: panelCenter.x, type: 'vertical', strength: 0.6 },
        { position: panelCenter.y, type: 'horizontal', strength: 0.6 }
      );
    });

    // Find closest snap positions
    let snapX: number | null = null;
    let snapY: number | null = null;
    let minDistX = SNAP_THRESHOLD;
    let minDistY = SNAP_THRESHOLD;
    let preview: SnapPreview | null = null;

    guides.forEach(guide => {
      if (guide.type === 'vertical') {
        const dist = Math.abs(x - guide.position);
        if (dist < minDistX) {
          minDistX = dist;
          snapX = guide.position;
        }
      } else {
        const dist = Math.abs(y - guide.position);
        if (dist < minDistY) {
          minDistY = dist;
          snapY = guide.position;
        }
      }
    });

    // Calculate preview
    if (snapX !== null || snapY !== null) {
      preview = {
        x: snapX !== null ? snapX : x,
        y: snapY !== null ? snapY : y,
        width,
        height,
        opacity: Math.max(0.3, 1 - Math.max(minDistX, minDistY) / SNAP_THRESHOLD)
      };
    }

    setSnapGuides(guides.filter(guide => 
      (guide.type === 'vertical' && Math.abs(x - guide.position) < PREDICTION_THRESHOLD) ||
      (guide.type === 'horizontal' && Math.abs(y - guide.position) < PREDICTION_THRESHOLD)
    ));

    return { snapX, snapY, preview };
  }, [isAltPressed, containerSize, panels]);

  const handlePanelClick = (id: string) => {
    bringToFront(id);
  };

  const handleDragStart = (id: string) => {
    const panel = panels.find(p => p.id === id);
    if (panel) {
      bringToFront(id);
      setActivePanel(id);
      setIsDragging(true);
      setPredictedSnapPoints(calculatePotentialSnapPoints(panel));
    }
  };

  const handleDrag = (id: string, x: number, y: number) => {
    const panel = panels.find(p => p.id === id);
    if (!panel) return;

    const { snapX, snapY, preview } = calculateSnapPositions(
      panel,
      x,
      y,
      panel.size.width,
      panel.size.height
    );
    
    setSnapPreview(preview);
    
    onPanelUpdate({
      ...panel,
      position: {
        x: snapX !== null ? snapX : x,
        y: snapY !== null ? snapY : y
      }
    });
  };

  const handleDragStop = () => {
    setIsDragging(false);
    setActivePanel(null);
    setSnapGuides([]);
    setSnapPreview(null);
    setPredictedSnapPoints([]);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gray-900 overflow-hidden"
    >
      {/* Management buttons */}
      {showAutoOrganize && (
        <div className="absolute top-2 right-2 z-50 flex gap-1 animate-fade-in">
          <button
            onClick={closeAllPanels}
            className="p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-md flex items-center gap-1 shadow-lg transition-colors"
            title="Close All Panels"
          >
            <XCircle size={14} />
          </button>
          <button
            onClick={autoOrganizePanels}
            className="p-1.5 bg-blue-500/90 hover:bg-blue-600 text-white rounded-md flex items-center gap-1 shadow-lg transition-colors"
            title="Auto-organize Panels"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      )}

      {/* Predicted Snap Points */}
      {isDragging && predictedSnapPoints.map((point, index) => (
        <div
          key={`predict-${index}`}
          className="absolute w-3 h-3 rounded-full bg-blue-500/20 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: point.x,
            top: point.y
          }}
        />
      ))}

      {/* Snap Guides */}
      {isDragging && snapGuides.map((guide, index) => (
        <div
          key={`${guide.type}-${guide.position}-${index}`}
          className={`absolute pointer-events-none bg-blue-500 snap-guide
            ${guide.type === 'vertical' ? 'w-px h-full' : 'h-px w-full'}`}
          style={{
            [guide.type === 'vertical' ? 'left' : 'top']: `${guide.position}px`,
            opacity: guide.strength * 0.7
          }}
        />
      ))}

      {/* Snap Preview */}
      {snapPreview && (
        <div
          className="absolute pointer-events-none bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all duration-150"
          style={{
            left: snapPreview.x,
            top: snapPreview.y,
            width: snapPreview.width,
            height: snapPreview.height,
            opacity: snapPreview.opacity
          }}
        />
      )}

      {/* Panels */}
      {panels.map((panel) => (
        <Rnd
          key={panel.id}
          position={panel.position}
          size={panel.size}
          minWidth={200}
          minHeight={100}
          bounds="parent"
          dragGrid={[GRID_SIZE, GRID_SIZE]}
          resizeGrid={[GRID_SIZE, GRID_SIZE]}
          onDragStart={() => handleDragStart(panel.id)}
          onDrag={(e, d) => handleDrag(panel.id, d.x, d.y)}
          onDragStop={handleDragStop}
          onMouseDown={(e) => {
            e.stopPropagation();
            handlePanelClick(panel.id);
          }}
          onResize={(e, direction, ref, delta, position) => {
            bringToFront(panel.id);
            onPanelUpdate({
              ...panel,
              position,
              size: {
                width: ref.offsetWidth,
                height: ref.offsetHeight
              }
            });
          }}
          className={`
            group transition-transform duration-150
          `}
          style={{ zIndex: zIndexes[panel.id] || BASE_Z_INDEX }}
        >
          <div 
            className={`
              flex flex-col h-full bg-gray-800 rounded-lg overflow-hidden border border-gray-600
              ${activePanel === panel.id && isDragging ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''}
              ${zIndexes[panel.id] === maxZIndexRef.current ? 'border-blue-500/50' : 'hover:border-gray-500'}
              transition-all duration-150
            `}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-200">{panel.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSettingsSection(panel.type);
                    setSettingsOpen(true);
                  }}
                  className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-blue-400"
                >
                  <Settings size={14} />
                </button>
                <button
                  onClick={() => {
                    onPanelUpdate({
                      ...panel,
                      isMinimized: !panel.isMinimized,
                      size: panel.isMinimized ? panel.size : { ...panel.size, height: 40 }
                    });
                  }}
                  className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-blue-400"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => {
                    onPanelUpdate({
                      ...panel,
                      isMaximized: !panel.isMaximized,
                      position: !panel.isMaximized ? { x: 0, y: 0 } : panel.position,
                      size: !panel.isMaximized
                        ? { width: containerSize.width, height: containerSize.height }
                        : panel.size
                    });
                  }}
                  className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-blue-400"
                >
                  {panel.isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                  onClick={() => onPanelClose(panel.id)}
                  className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            {!panel.isMinimized && (
              <div className="flex-1 overflow-auto bg-gray-800 text-gray-300">
                <PanelContent panel={panel} />
              </div>
            )}
          </div>
        </Rnd>
      ))}
    </div>
  );
};