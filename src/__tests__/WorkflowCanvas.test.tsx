import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkflowCanvas } from '../components/Canvas/WorkflowCanvas';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { NodeType } from '../types/nodes';
import { ToastProvider } from '../contexts/ToastContext';

describe('WorkflowCanvas', () => {
  beforeEach(() => {
    // Clear the store before each test
    useWorkflowStore.getState().clearWorkflow();
  });

  it('renders the canvas with React Flow controls', () => {
    render(
      <ToastProvider>
        <WorkflowCanvas />
      </ToastProvider>
    );
    
    // React Flow should render with controls
    const canvas = document.querySelector('.react-flow');
    expect(canvas).toBeTruthy();
  });

  it('displays nodes from the store', () => {
    const { addNode } = useWorkflowStore.getState();
    
    // Add a test node
    addNode({
      id: 'test-node-1',
      type: NodeType.START,
      position: { x: 100, y: 100 },
      data: {
        id: 'test-node-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Test Start Node',
        metadata: {},
      },
    });

    render(
      <ToastProvider>
        <WorkflowCanvas />
      </ToastProvider>
    );
    
    // Check if the node is rendered
    expect(screen.getByText('Test Start Node')).toBeInTheDocument();
  });

  it('handles node deletion from store', () => {
    const { addNode, deleteNode } = useWorkflowStore.getState();
    
    // Add a node
    addNode({
      id: 'test-node-2',
      type: NodeType.TASK,
      position: { x: 200, y: 200 },
      data: {
        id: 'test-node-2',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Test Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {},
      },
    });

    const { rerender } = render(
      <ToastProvider>
        <WorkflowCanvas />
      </ToastProvider>
    );
    
    // Verify node is rendered
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    
    // Delete the node
    deleteNode('test-node-2');
    
    // Rerender to reflect the change
    rerender(
      <ToastProvider>
        <WorkflowCanvas />
      </ToastProvider>
    );
    
    // Verify node is removed
    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
  });

  it('syncs edges from the store', () => {
    const { addNode, addEdge } = useWorkflowStore.getState();
    
    // Add two nodes
    addNode({
      id: 'node-1',
      type: NodeType.START,
      position: { x: 100, y: 100 },
      data: {
        id: 'node-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start Node 1',
        metadata: {},
      },
    });

    addNode({
      id: 'node-2',
      type: NodeType.END,
      position: { x: 300, y: 300 },
      data: {
        id: 'node-2',
        type: NodeType.END,
        label: 'End',
        endMessage: '',
        showSummary: false,
      },
    });

    // Add an edge
    addEdge({
      id: 'e-node-1-node-2',
      source: 'node-1',
      target: 'node-2',
    });

    render(
      <ToastProvider>
        <WorkflowCanvas />
      </ToastProvider>
    );
    
    // Verify both nodes are rendered
    expect(screen.getByText('Start Node 1')).toBeInTheDocument();
    expect(screen.getByText('End Node')).toBeInTheDocument();
    
    // Verify the edge is in the store
    const state = useWorkflowStore.getState();
    expect(state.edges).toHaveLength(1);
    expect(state.edges[0].source).toBe('node-1');
    expect(state.edges[0].target).toBe('node-2');
  });
});
