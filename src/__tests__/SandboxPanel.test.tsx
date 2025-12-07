import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SandboxPanel } from '../components/Sandbox/SandboxPanel';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import * as api from '../services/api';
import { NodeType } from '../types/nodes';

// Mock the API module
vi.mock('../services/api');

describe('SandboxPanel', () => {
  beforeEach(() => {
    // Clear the store before each test
    useWorkflowStore.setState({ nodes: [], edges: [], selectedNodeId: null });
    vi.clearAllMocks();
  });

  it('should render the sandbox panel with test button', () => {
    render(<SandboxPanel />);
    
    expect(screen.getByText('Workflow Testing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test workflow/i })).toBeInTheDocument();
  });

  it('should disable test button when workflow is empty', () => {
    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    expect(testButton).toBeDisabled();
    expect(screen.getByText(/add nodes to the canvas/i)).toBeInTheDocument();
  });

  it('should enable test button when workflow has nodes', () => {
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    expect(testButton).not.toBeDisabled();
  });

  it('should show loading state during simulation', async () => {
    const user = userEvent.setup();
    
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    // Mock API to delay response
    vi.mocked(api.simulateWorkflowAPI).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        steps: [],
        errors: [],
        executionTime: 100
      }), 100))
    );

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    expect(screen.getByText('Testing...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Testing...')).not.toBeInTheDocument();
    });
  });

  it('should display simulation results on success', async () => {
    const user = userEvent.setup();
    
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    // Mock successful API response
    vi.mocked(api.simulateWorkflowAPI).mockResolvedValue({
      success: true,
      steps: [
        {
          nodeId: '1',
          nodeType: NodeType.START,
          nodeTitle: 'Start Node',
          status: 'completed',
          timestamp: '2024-01-01T00:00:00Z'
        }
      ],
      errors: [],
      executionTime: 50
    });

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Successful')).toBeInTheDocument();
      expect(screen.getByText(/Execution time: 50ms/i)).toBeInTheDocument();
    });
  });

  it('should display validation errors when present', async () => {
    const user = userEvent.setup();
    
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    // Mock API response with validation errors
    vi.mocked(api.simulateWorkflowAPI).mockResolvedValue({
      success: false,
      steps: [],
      errors: [
        {
          nodeId: '1',
          message: 'Node has validation error',
          severity: 'error'
        }
      ],
      executionTime: 10
    });

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText('Validation Issues Found')).toBeInTheDocument();
      expect(screen.getByText('Node has validation error')).toBeInTheDocument();
    });
  });

  it('should display both validation errors and simulation log', async () => {
    const user = userEvent.setup();
    
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    // Mock API response with both steps and errors
    vi.mocked(api.simulateWorkflowAPI).mockResolvedValue({
      success: false,
      steps: [
        {
          nodeId: '1',
          nodeType: NodeType.START,
          nodeTitle: 'Start Node',
          status: 'completed',
          timestamp: '2024-01-01T00:00:00Z'
        }
      ],
      errors: [
        {
          nodeId: '1',
          message: 'Warning message',
          severity: 'warning'
        }
      ],
      executionTime: 25
    });

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText('Validation Issues Found')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText(/Execution Steps/i)).toBeInTheDocument();
      expect(screen.getByText('Start Node')).toBeInTheDocument();
    });
  });

  it('should display error message on API failure', async () => {
    const user = userEvent.setup();
    
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    // Mock API error
    vi.mocked(api.simulateWorkflowAPI).mockRejectedValue(
      new Error('Failed to simulate workflow')
    );

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to simulate workflow')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('should allow retry after error', async () => {
    const user = userEvent.setup();
    
    // Add a node to the store
    useWorkflowStore.setState({
      nodes: [{
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      }],
      edges: []
    });

    // Mock API error first, then success
    vi.mocked(api.simulateWorkflowAPI)
      .mockRejectedValueOnce(new Error('Failed to simulate workflow'))
      .mockResolvedValueOnce({
        success: true,
        steps: [
          {
            nodeId: '1',
            nodeType: NodeType.START,
            nodeTitle: 'Start Node',
            status: 'completed',
            timestamp: '2024-01-01T00:00:00Z'
          }
        ],
        errors: [],
        executionTime: 50
      });

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to simulate workflow')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Successful')).toBeInTheDocument();
    });
  });

  it('should send complete workflow data to API', async () => {
    const user = userEvent.setup();
    
    // Add nodes and edges to the store
    const nodes = [
      {
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          id: '1',
          type: NodeType.START,
          label: 'Start',
          title: 'Start Node',
          metadata: {}
        }
      },
      {
        id: '2',
        type: 'end',
        position: { x: 200, y: 0 },
        data: {
          id: '2',
          type: NodeType.END,
          label: 'End',
          endMessage: 'Done',
          showSummary: false
        }
      }
    ];
    
    const edges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2'
      }
    ];

    useWorkflowStore.setState({ nodes, edges });

    // Mock successful API response
    vi.mocked(api.simulateWorkflowAPI).mockResolvedValue({
      success: true,
      steps: [],
      errors: [],
      executionTime: 50
    });

    render(<SandboxPanel />);
    
    const testButton = screen.getByRole('button', { name: /test workflow/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(api.simulateWorkflowAPI).toHaveBeenCalledWith({
        nodes,
        edges
      });
    });
  });
});
