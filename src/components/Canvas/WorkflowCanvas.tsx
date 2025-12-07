import { useCallback, useEffect, DragEvent } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  Node,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { useToast } from '../../contexts/ToastContext';
import { NodeType, WorkflowNodeData } from '../../types/nodes';
import {
  StartNode,
  TaskNode,
  ApprovalNode,
  AutomatedStepNode,
  EndNode,
} from '../Nodes';
import { ValidationOverlay } from './ValidationOverlay';
import { CanvasControls } from './CanvasControls';

// Define custom node types for React Flow
const nodeTypes: NodeTypes = {
  [NodeType.START]: StartNode,
  [NodeType.TASK]: TaskNode,
  [NodeType.APPROVAL]: ApprovalNode,
  [NodeType.AUTOMATED_STEP]: AutomatedStepNode,
  [NodeType.END]: EndNode,
};

export function WorkflowCanvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    addEdge: addStoreEdge,
    deleteNode,
    deleteEdge,
    setSelectedNode,
  } = useWorkflowStore();

  const { addToast } = useToast();

  // Get validation results to highlight nodes
  const { errors, warnings } = useWorkflowValidation();

  // Convert store nodes/edges to React Flow format
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync store changes to React Flow and apply validation styling
  useEffect(() => {
    // Create a map of node IDs to their validation status
    const errorNodeIds = new Set(
      errors.filter(e => e.nodeId).map(e => e.nodeId!)
    );
    const warningNodeIds = new Set(
      warnings.filter(w => w.nodeId).map(w => w.nodeId!)
    );

    // Apply styling based on validation status
    const nodesWithValidation = storeNodes.map(node => {
      let className = '';
      
      if (errorNodeIds.has(node.id)) {
        className = 'validation-error';
      } else if (warningNodeIds.has(node.id)) {
        className = 'validation-warning';
      }

      return {
        ...node,
        className,
      };
    });

    setNodes(nodesWithValidation);
  }, [storeNodes, errors, warnings, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  // Sync React Flow state with Zustand store
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // Handle node deletion
      changes.forEach((change) => {
        if (change.type === 'remove') {
          deleteNode(change.id);
          addToast('Node deleted', 'info');
        }
      });
    },
    [onNodesChange, deleteNode, addToast]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      
      // Handle edge deletion
      changes.forEach((change) => {
        if (change.type === 'remove') {
          deleteEdge(change.id);
          addToast('Connection deleted', 'info');
        }
      });
    },
    [onEdgesChange, deleteEdge, addToast]
  );

  // Handle edge creation
  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge = {
          id: `e${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
        };
        
        setEdges((eds) => addEdge(connection, eds));
        addStoreEdge(newEdge);
      }
    },
    [setEdges, addStoreEdge]
  );

  // Handle node selection
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Handle drag over (required for drop to work)
  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from sidebar
  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      if (!nodeType) {
        return;
      }

      // Get the canvas bounds to calculate the correct position
      const reactFlowBounds = (event.target as HTMLElement)
        .closest('.react-flow')
        ?.getBoundingClientRect();

      if (!reactFlowBounds) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Generate unique ID
      const id = `${nodeType}-${Date.now()}`;

      // Create node data based on type
      const newNode = {
        id,
        type: nodeType,
        position,
        data: createNodeData(id, nodeType as NodeType),
      };

      addNode(newNode);
      setNodes((nds) => [...nds, newNode]);
      addToast('Node added to canvas', 'success');
    },
    [addNode, setNodes, addToast]
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
      >
        <Background />
        <MiniMap />
        <CanvasControls />
      </ReactFlow>
      <ValidationOverlay />
    </div>
  );
}

// Helper function to create initial node data based on type
function createNodeData(id: string, type: NodeType): WorkflowNodeData {
  switch (type) {
    case NodeType.START:
      return {
        id,
        type: NodeType.START,
        label: 'Start',
        title: 'Start',
        metadata: {},
      };
    case NodeType.TASK:
      return {
        id,
        type: NodeType.TASK,
        label: 'Task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {},
      };
    case NodeType.APPROVAL:
      return {
        id,
        type: NodeType.APPROVAL,
        label: 'Approval',
        title: 'Approval',
        approverRole: '',
        autoApproveThreshold: 0,
      };
    case NodeType.AUTOMATED_STEP:
      return {
        id,
        type: NodeType.AUTOMATED_STEP,
        label: 'Automated Step',
        title: 'Automated Step',
        actionId: '',
        actionLabel: '',
        parameters: {},
      };
    case NodeType.END:
      return {
        id,
        type: NodeType.END,
        label: 'End',
        endMessage: '',
        showSummary: false,
      };
  }
}
