import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactFlowProvider } from 'reactflow';
import { CanvasControls } from '../components/Canvas/CanvasControls';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { ToastProvider } from '../contexts/ToastContext';

// Mock the useReactFlow hook
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual,
    useReactFlow: () => ({
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      fitView: vi.fn(),
    }),
  };
});

describe('CanvasControls', () => {
  beforeEach(() => {
    useWorkflowStore.setState({ nodes: [], edges: [], selectedNodeId: null });
  });

  it('should render all control buttons', () => {
    render(
      <ToastProvider>
        <ReactFlowProvider>
          <CanvasControls />
        </ReactFlowProvider>
      </ToastProvider>
    );

    expect(screen.getByLabelText('Zoom In')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom Out')).toBeInTheDocument();
    expect(screen.getByLabelText('Fit View')).toBeInTheDocument();
    expect(screen.getByLabelText('Clear Workflow')).toBeInTheDocument();
  });

  it('should disable clear button when no nodes exist', () => {
    render(
      <ToastProvider>
        <ReactFlowProvider>
          <CanvasControls />
        </ReactFlowProvider>
      </ToastProvider>
    );

    const clearButton = screen.getByLabelText('Clear Workflow');
    expect(clearButton).toBeDisabled();
  });

  it('should enable clear button when nodes exist', () => {
    useWorkflowStore.setState({
      nodes: [
        {
          id: 'node-1',
          type: 'start',
          position: { x: 0, y: 0 },
          data: { id: 'node-1', type: 'start', label: 'Start', title: 'Start', metadata: {} },
        },
      ],
      edges: [],
      selectedNodeId: null,
    });

    render(
      <ToastProvider>
        <ReactFlowProvider>
          <CanvasControls />
        </ReactFlowProvider>
      </ToastProvider>
    );

    const clearButton = screen.getByLabelText('Clear Workflow');
    expect(clearButton).not.toBeDisabled();
  });

  it('should show confirmation modal when clear button is clicked', () => {
    useWorkflowStore.setState({
      nodes: [
        {
          id: 'node-1',
          type: 'start',
          position: { x: 0, y: 0 },
          data: { id: 'node-1', type: 'start', label: 'Start', title: 'Start', metadata: {} },
        },
      ],
      edges: [],
      selectedNodeId: null,
    });

    render(
      <ToastProvider>
        <ReactFlowProvider>
          <CanvasControls />
        </ReactFlowProvider>
      </ToastProvider>
    );

    const clearButton = screen.getByLabelText('Clear Workflow');
    fireEvent.click(clearButton);

    expect(screen.getByText('Clear Workflow?')).toBeInTheDocument();
    expect(screen.getByText(/This will remove all nodes and connections/)).toBeInTheDocument();
  });

  it('should clear workflow when confirmed', () => {
    useWorkflowStore.setState({
      nodes: [
        {
          id: 'node-1',
          type: 'start',
          position: { x: 0, y: 0 },
          data: { id: 'node-1', type: 'start', label: 'Start', title: 'Start', metadata: {} },
        },
      ],
      edges: [],
      selectedNodeId: null,
    });

    render(
      <ToastProvider>
        <ReactFlowProvider>
          <CanvasControls />
        </ReactFlowProvider>
      </ToastProvider>
    );

    const clearButton = screen.getByLabelText('Clear Workflow');
    fireEvent.click(clearButton);

    // Get the confirm button from the modal (not the icon button)
    const confirmButton = screen.getByText('Clear Workflow', { selector: 'button.bg-red-600' });
    fireEvent.click(confirmButton);

    const state = useWorkflowStore.getState();
    expect(state.nodes).toHaveLength(0);
    expect(state.edges).toHaveLength(0);
  });

  it('should cancel clear workflow when cancel is clicked', () => {
    useWorkflowStore.setState({
      nodes: [
        {
          id: 'node-1',
          type: 'start',
          position: { x: 0, y: 0 },
          data: { id: 'node-1', type: 'start', label: 'Start', title: 'Start', metadata: {} },
        },
      ],
      edges: [],
      selectedNodeId: null,
    });

    render(
      <ToastProvider>
        <ReactFlowProvider>
          <CanvasControls />
        </ReactFlowProvider>
      </ToastProvider>
    );

    const clearButton = screen.getByLabelText('Clear Workflow');
    fireEvent.click(clearButton);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Clear Workflow?')).not.toBeInTheDocument();
    
    const state = useWorkflowStore.getState();
    expect(state.nodes).toHaveLength(1);
  });
});
