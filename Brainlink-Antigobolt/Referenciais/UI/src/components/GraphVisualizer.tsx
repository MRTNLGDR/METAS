import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import dagre from 'dagre';
import { Settings, ChevronRight, ChevronDown } from 'lucide-react';
import 'reactflow/dist/style.css';

// Physics configuration
const FORCE_STRENGTH = 0.15; // Reduced for smoother movement
const LINK_DISTANCE = 180; // Increased for better spacing
const COLLISION_RADIUS = 100; // Increased to prevent overlap
const DAMPING = 0.85; // Increased for more stability
const VELOCITY_LIMIT = 5; // Limit maximum velocity

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 170, height: 36 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';
    node.position = {
      x: nodeWithPosition.x - 85,
      y: nodeWithPosition.y - 18,
    };
  });

  return { nodes, edges };
};

const initialNodes: Node[] = [
  { id: '1', data: { label: 'src/components' }, position: { x: 0, y: 0 }, type: 'input' },
  { id: '2', data: { label: 'App.tsx' }, position: { x: 0, y: 100 } },
  { id: '3', data: { label: 'Header.tsx' }, position: { x: 200, y: 100 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

interface GraphVisualizerProps {
  onConfigChange?: (config: any) => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ onConfigChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [layout, setLayout] = useState('TB');
  const [config, setConfig] = useState({
    nodePadding: 50,
    rankSeparation: 100,
    theme: 'dark',
    animate: true
  });
  const animationFrameId = useRef<number>();
  const nodesRef = useRef<{ [key: string]: { vx: number; vy: number } }>({});

  // Initialize physics properties for nodes
  React.useEffect(() => {
    nodes.forEach(node => {
      if (!nodesRef.current[node.id]) {
        nodesRef.current[node.id] = { vx: 0, vy: 0 };
      }
    });
  }, [nodes]);

  // Limit velocity to prevent excessive movement
  const limitVelocity = (velocity: number) => {
    return Math.max(Math.min(velocity, VELOCITY_LIMIT), -VELOCITY_LIMIT);
  };

  // Physics simulation
  const applyForces = useCallback(() => {
    if (!config.animate) return;

    const nodesCopy = [...nodes];
    
    // Apply forces between nodes
    for (let i = 0; i < nodesCopy.length; i++) {
      for (let j = i + 1; j < nodesCopy.length; j++) {
        const nodeA = nodesCopy[i];
        const nodeB = nodesCopy[j];
        
        const dx = nodeB.position.x - nodeA.position.x;
        const dy = nodeB.position.y - nodeA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        if (distance < COLLISION_RADIUS) {
          const force = (COLLISION_RADIUS - distance) * FORCE_STRENGTH;
          const angle = Math.atan2(dy, dx);
          
          nodesRef.current[nodeA.id].vx = limitVelocity(
            nodesRef.current[nodeA.id].vx - Math.cos(angle) * force
          );
          nodesRef.current[nodeA.id].vy = limitVelocity(
            nodesRef.current[nodeA.id].vy - Math.sin(angle) * force
          );
          nodesRef.current[nodeB.id].vx = limitVelocity(
            nodesRef.current[nodeB.id].vx + Math.cos(angle) * force
          );
          nodesRef.current[nodeB.id].vy = limitVelocity(
            nodesRef.current[nodeB.id].vy + Math.sin(angle) * force
          );
        }
      }
    }

    // Apply edge forces with smooth transitions
    edges.forEach(edge => {
      const source = nodesCopy.find(n => n.id === edge.source);
      const target = nodesCopy.find(n => n.id === edge.target);
      
      if (source && target) {
        const dx = target.position.x - source.position.x;
        const dy = target.position.y - source.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const force = (distance - LINK_DISTANCE) * FORCE_STRENGTH;
        const angle = Math.atan2(dy, dx);
        
        nodesRef.current[source.id].vx = limitVelocity(
          nodesRef.current[source.id].vx + Math.cos(angle) * force
        );
        nodesRef.current[source.id].vy = limitVelocity(
          nodesRef.current[source.id].vy + Math.sin(angle) * force
        );
        nodesRef.current[target.id].vx = limitVelocity(
          nodesRef.current[target.id].vx - Math.cos(angle) * force
        );
        nodesRef.current[target.id].vy = limitVelocity(
          nodesRef.current[target.id].vy - Math.sin(angle) * force
        );
      }
    });

    // Update positions with smooth damping
    const updatedNodes = nodesCopy.map(node => {
      const nodePhysics = nodesRef.current[node.id];
      nodePhysics.vx *= DAMPING;
      nodePhysics.vy *= DAMPING;

      // Only update position if velocity is significant
      if (Math.abs(nodePhysics.vx) > 0.01 || Math.abs(nodePhysics.vy) > 0.01) {
        return {
          ...node,
          position: {
            x: node.position.x + nodePhysics.vx,
            y: node.position.y + nodePhysics.vy
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    animationFrameId.current = requestAnimationFrame(applyForces);
  }, [nodes, edges, config.animate, setNodes]);

  // Start/stop physics simulation
  React.useEffect(() => {
    if (config.animate) {
      animationFrameId.current = requestAnimationFrame(applyForces);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [config.animate, applyForces]);

  const handleConfigChange = useCallback((updates: Partial<typeof config>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      onConfigChange?.(newConfig);
      return newConfig;
    });
  }, [onConfigChange]);

  const handleLayout = useCallback((direction: string) => {
    setLayout(direction);
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    setNodes([...newNodes]);
    setEdges([...newEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitView
        className="bg-gray-900 transition-all duration-300"
      >
        <Background 
          color="#444" 
          gap={16} 
          size={1}
          className="transition-opacity duration-200"
        />
        <Controls />
        
        <Panel 
          position="top-right" 
          className={`
            bg-gray-800 rounded-lg shadow-lg transition-all duration-200
            ${isConfigOpen ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
          `}
        >
          <div className="p-2">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors"
            >
              <Settings size={16} />
              <span className="text-sm">Configuration</span>
              {isConfigOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            
            {isConfigOpen && (
              <div className="mt-3 space-y-4 min-w-[200px]">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Layout Direction</label>
                  <select
                    value={layout}
                    onChange={(e) => handleLayout(e.target.value)}
                    className="w-full bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
                  >
                    <option value="TB">Top to Bottom</option>
                    <option value="LR">Left to Right</option>
                    <option value="RL">Right to Left</option>
                    <option value="BT">Bottom to Top</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Node Padding</label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={config.nodePadding}
                    onChange={(e) => handleConfigChange({ nodePadding: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rank Separation</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={config.rankSeparation}
                    onChange={(e) => handleConfigChange({ rankSeparation: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Theme</label>
                  <select
                    value={config.theme}
                    onChange={(e) => handleConfigChange({ theme: e.target.value })}
                    className="w-full bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400">Animate Changes</label>
                  <input
                    type="checkbox"
                    checked={config.animate}
                    onChange={(e) => handleConfigChange({ animate: e.target.checked })}
                    className="rounded bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};