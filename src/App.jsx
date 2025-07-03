import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls,
  Background,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Custom Node Component
const CustomNode = ({ data, isConnectable }) => (
  <div className="custom-node">
    <Handle
      type="target"
      position={Position.Left}
      className="custom-handle"
      isConnectable={isConnectable}
    />
    <div className="node-label">{data.label}</div>
    <Handle
      type="source"
      position={Position.Right}
      className="custom-handle"
      isConnectable={isConnectable}
    />
  </div>
);

const nodeTypes = { custom: CustomNode };

const defaultEdgeOptions = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#666',
  },
  style: {
    strokeWidth: 2,
    stroke: '#666',
  },
};

const validateDAG = (nodes, edges) => {
  const errors = [];

  if (nodes.length < 2) {
    errors.push("At least 2 nodes required");
  }

  const connectedNodes = new Set();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  const unconnectedNodes = nodes.filter(node => !connectedNodes.has(node.id));
  if (unconnectedNodes.length > 0 && nodes.length > 0) {
    errors.push(`${unconnectedNodes.length} node(s) not connected`);
  }

  const hasCycle = () => {
    const graph = {};
    const visited = new Set();
    const stack = new Set();

    nodes.forEach(node => (graph[node.id] = []));
    edges.forEach(edge => {
      if (graph[edge.source]) {
        graph[edge.source].push(edge.target);
      }
    });

    const dfs = (id) => {
      if (stack.has(id)) return true;
      if (visited.has(id)) return false;

      visited.add(id);
      stack.add(id);

      for (const neighbor of graph[id]) {
        if (dfs(neighbor)) return true;
      }

      stack.delete(id);
      return false;
    };

    return Object.keys(graph).some(id => !visited.has(id) && dfs(id));
  };

  if (hasCycle()) {
    errors.push("Cycle detected in graph");
  }

  return { isValid: errors.length === 0, errors };
};

const getLayoutedElements = (nodes, edges) => {
  const layoutedNodes = nodes.map((node, i) => ({
    ...node,
    position: { x: (i % 3) * 200 + 100, y: Math.floor(i / 3) * 100 + 50 },
  }));
  return { nodes: layoutedNodes, edges };
};

const PipelineEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [validationStatus, setValidationStatus] = useState({ isValid: false, errors: [] });
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const { fitView } = useReactFlow();

  useEffect(() => {
    setValidationStatus(validateDAG(nodes, edges));
  }, [nodes, edges]);

  const onConnect = useCallback((params) => {
    if (params.source === params.target) return;
    const newEdge = { ...params, ...defaultEdgeOptions };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const addNode = useCallback(() => {
    if (!newNodeName.trim()) return;

    const newNode = {
      id: `node-${nodeId}`,
      type: 'custom',
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
      data: { label: newNodeName },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
    setNewNodeName('');
    setShowAddNodeModal(false);
  }, [newNodeName, nodeId, setNodes]);

  const deleteSelected = useCallback(() => {
    const selectedNodeIds = nodes.filter(n => n.selected).map(n => n.id);
    const selectedEdgeIds = edges.filter(e => e.selected).map(e => e.id);

    setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedEdgeIds.includes(e.id) &&
          !selectedNodeIds.includes(e.source) &&
          !selectedNodeIds.includes(e.target)
      )
    );
  }, [nodes, edges]);

  const onEdgeClick = useCallback((_, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected]);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setTimeout(() => fitView(), 100);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
  }, []);

  return (
    <div className="pipeline-editor">
      <div className="header">
        <div className="header-content">
          <h1 className="title">Pipeline Editor</h1>
          <div className="header-controls">
            <div className={`validation-status ${validationStatus.isValid ? 'valid' : 'invalid'}`}>
              {validationStatus.isValid ? '✓ Valid DAG' : '✗ Invalid DAG'}
            </div>
            <button onClick={() => setShowAddNodeModal(true)} className="btn btn-primary">Add Node</button>
            <button onClick={onLayout} className="btn btn-success" disabled={nodes.length === 0}>Auto Layout</button>
            <button onClick={clearAll} className="btn btn-danger">Clear All</button>
          </div>
        </div>
        {!validationStatus.isValid && validationStatus.errors.length > 0 && (
          <div className="validation-errors">
            Issues: {validationStatus.errors.join(', ')}
          </div>
        )}
      </div>

      <div className="editor-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick} // 👈 delete on edge click
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          selectEdgesOnClick={true} // 👈 enable edge selection
          className="react-flow"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="instructions">
            <h3>Welcome to Pipeline Editor</h3>
            <p>Start by adding nodes to create your pipeline</p>
            <ul>
              <li>• Click "Add Node" to create new nodes</li>
              <li>• Drag from the right handle to left handle to connect nodes</li>
              <li>• Select nodes/edges and press Delete to remove them</li>
              <li>• Or click directly on edges to remove</li>
              <li>• Use "Auto Layout" to organize your pipeline</li>
            </ul>
          </div>
        )}
      </div>

      {showAddNodeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Node</h3>
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNode();
                if (e.key === 'Escape') {
                  setShowAddNodeModal(false);
                  setNewNodeName('');
                }
              }}
              placeholder="Enter node name..."
              className="modal-input"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => { setShowAddNodeModal(false); setNewNodeName(''); }} className="btn btn-secondary">Cancel</button>
              <button onClick={addNode} disabled={!newNodeName.trim()} className="btn btn-primary">Add Node</button>
            </div>
          </div>
        </div>
      )}

      <div className="stats-panel">
        Nodes: {nodes.length} | Edges: {edges.length} | Press Delete or click on edge to remove it
      </div>
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <PipelineEditor />
  </ReactFlowProvider>
);

export default App;
