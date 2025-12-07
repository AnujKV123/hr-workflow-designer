import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValidationResults } from '../components/Sandbox/ValidationResults';
import { ValidationError } from '../../types/workflow';
import { useWorkflowStore } from '../hooks/useWorkflowStore';

describe('ValidationResults', () => {
  beforeEach(() => {
    // Clear the store before each test
    useWorkflowStore.setState({ nodes: [], edges: [], selectedNodeId: null });
  });

  it('should render nothing when there are no errors', () => {
    const { container } = render(<ValidationResults errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display validation errors with node references', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Start node is required',
        severity: 'error'
      },
      {
        nodeId: 'node-2',
        message: 'End node has outgoing edges',
        severity: 'warning'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText('Validation Issues Found')).toBeInTheDocument();
    expect(screen.getByText('Start node is required')).toBeInTheDocument();
    expect(screen.getByText('End node has outgoing edges')).toBeInTheDocument();
  });

  it('should display clickable node references', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Node has validation error',
        severity: 'error'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    const nodeLink = screen.getByRole('button', { name: /Node: node-1/i });
    expect(nodeLink).toBeInTheDocument();
  });

  it('should select node when clicking on node reference', async () => {
    const user = userEvent.setup();
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Node has validation error',
        severity: 'error'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    const nodeLink = screen.getByRole('button', { name: /Node: node-1/i });
    await user.click(nodeLink);
    
    const state = useWorkflowStore.getState();
    expect(state.selectedNodeId).toBe('node-1');
  });

  it('should display edge references when provided', () => {
    const errors: ValidationError[] = [
      {
        edgeId: 'edge-1',
        message: 'Invalid edge connection',
        severity: 'error'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText('Edge: edge-1')).toBeInTheDocument();
    expect(screen.getByText('Invalid edge connection')).toBeInTheDocument();
  });

  it('should count and display error and warning counts', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Error 1',
        severity: 'error'
      },
      {
        nodeId: 'node-2',
        message: 'Error 2',
        severity: 'error'
      },
      {
        nodeId: 'node-3',
        message: 'Warning 1',
        severity: 'warning'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText(/2 errors, 1 warning/i)).toBeInTheDocument();
  });

  it('should display only error count when no warnings', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Error 1',
        severity: 'error'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText(/1 error/i)).toBeInTheDocument();
  });

  it('should display only warning count when no errors', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Warning 1',
        severity: 'warning'
      },
      {
        nodeId: 'node-2',
        message: 'Warning 2',
        severity: 'warning'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText(/2 warnings/i)).toBeInTheDocument();
  });

  it('should use correct styling for error severity', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'This is an error',
        severity: 'error'
      }
    ];

    const { container } = render(<ValidationResults errors={errors} />);
    
    const errorElement = container.querySelector('.bg-red-50.border-red-200.text-red-800');
    expect(errorElement).toBeInTheDocument();
    
    // Check for the uppercase severity label
    const severityLabel = container.querySelector('.text-xs.font-semibold.uppercase');
    expect(severityLabel).toHaveTextContent('error');
  });

  it('should use correct styling for warning severity', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'This is a warning',
        severity: 'warning'
      }
    ];

    const { container } = render(<ValidationResults errors={errors} />);
    
    const warningElement = container.querySelector('.bg-yellow-50.border-yellow-200.text-yellow-800');
    expect(warningElement).toBeInTheDocument();
    
    // Check for the uppercase severity label
    const severityLabel = container.querySelector('.text-xs.font-semibold.uppercase');
    expect(severityLabel).toHaveTextContent('warning');
  });

  it('should handle errors without node or edge references', () => {
    const errors: ValidationError[] = [
      {
        message: 'General validation error',
        severity: 'error'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText('General validation error')).toBeInTheDocument();
    expect(screen.queryByText(/Node:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Edge:/)).not.toBeInTheDocument();
  });

  it('should display multiple errors correctly', () => {
    const errors: ValidationError[] = [
      {
        nodeId: 'node-1',
        message: 'Error 1',
        severity: 'error'
      },
      {
        nodeId: 'node-2',
        message: 'Error 2',
        severity: 'warning'
      },
      {
        edgeId: 'edge-1',
        message: 'Error 3',
        severity: 'error'
      }
    ];

    render(<ValidationResults errors={errors} />);
    
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
    expect(screen.getByText('Error 3')).toBeInTheDocument();
  });
});
