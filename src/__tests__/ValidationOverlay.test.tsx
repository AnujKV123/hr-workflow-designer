import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValidationOverlay } from '../components/Canvas/ValidationOverlay';
import * as useWorkflowValidationModule from '../hooks/useWorkflowValidation';
import * as useWorkflowStoreModule from '../hooks/useWorkflowStore';

// Mock the hooks
vi.mock('../../hooks/useWorkflowValidation');
vi.mock('../../hooks/useWorkflowStore');

describe('ValidationOverlay', () => {
  const mockSetSelectedNode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for useWorkflowStore
    vi.spyOn(useWorkflowStoreModule, 'useWorkflowStore').mockImplementation((selector: any) => {
      const state = {
        nodes: [{ id: 'node-1', type: 'start', position: { x: 0, y: 0 }, data: {} }],
        setSelectedNode: mockSetSelectedNode,
      };
      return selector ? selector(state) : state;
    });
  });

  it('should not render when workflow is empty', () => {
    vi.spyOn(useWorkflowStoreModule, 'useWorkflowStore').mockImplementation((selector: any) => {
      const state = {
        nodes: [],
        setSelectedNode: mockSetSelectedNode,
      };
      return selector ? selector(state) : state;
    });

    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [],
      warnings: [],
      isValid: true,
      hasWarnings: false,
      all: [],
    });

    const { container } = render(<ValidationOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it('should display success indicator when workflow is valid', () => {
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [],
      warnings: [],
      isValid: true,
      hasWarnings: false,
      all: [],
    });

    render(<ValidationOverlay />);
    expect(screen.getByText('Workflow is valid')).toBeInTheDocument();
  });

  it('should display errors when validation fails', () => {
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [
        { message: 'Workflow must contain at least one Start Node', severity: 'error' as const },
        { nodeId: 'node-1', message: 'End Node cannot have outgoing connections', severity: 'error' as const },
      ],
      warnings: [],
      isValid: false,
      hasWarnings: false,
      all: [
        { message: 'Workflow must contain at least one Start Node', severity: 'error' as const },
        { nodeId: 'node-1', message: 'End Node cannot have outgoing connections', severity: 'error' as const },
      ],
    });

    render(<ValidationOverlay />);
    expect(screen.getByText('2 Errors')).toBeInTheDocument();
    expect(screen.getByText('Workflow must contain at least one Start Node')).toBeInTheDocument();
    expect(screen.getByText('End Node cannot have outgoing connections')).toBeInTheDocument();
  });

  it('should display warnings when validation has warnings', () => {
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [],
      warnings: [
        { nodeId: 'node-1', message: 'Multiple Start Nodes detected', severity: 'warning' as const },
        { message: 'Disconnected nodes detected', severity: 'warning' as const },
      ],
      isValid: true,
      hasWarnings: true,
      all: [
        { nodeId: 'node-1', message: 'Multiple Start Nodes detected', severity: 'warning' as const },
        { message: 'Disconnected nodes detected', severity: 'warning' as const },
      ],
    });

    render(<ValidationOverlay />);
    expect(screen.getByText('2 Warnings')).toBeInTheDocument();
    expect(screen.getByText('Multiple Start Nodes detected')).toBeInTheDocument();
    expect(screen.getByText('Disconnected nodes detected')).toBeInTheDocument();
  });

  it('should call setSelectedNode when clicking on error with nodeId', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [
        { nodeId: 'node-1', message: 'End Node cannot have outgoing connections', severity: 'error' as const },
      ],
      warnings: [],
      isValid: false,
      hasWarnings: false,
      all: [
        { nodeId: 'node-1', message: 'End Node cannot have outgoing connections', severity: 'error' as const },
      ],
    });

    render(<ValidationOverlay />);
    
    const errorMessage = screen.getByText('End Node cannot have outgoing connections');
    await user.click(errorMessage);
    
    expect(mockSetSelectedNode).toHaveBeenCalledWith('node-1');
  });

  it('should call setSelectedNode when clicking on warning with nodeId', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [],
      warnings: [
        { nodeId: 'node-2', message: 'Node has no outgoing connections', severity: 'warning' as const },
      ],
      isValid: true,
      hasWarnings: true,
      all: [
        { nodeId: 'node-2', message: 'Node has no outgoing connections', severity: 'warning' as const },
      ],
    });

    render(<ValidationOverlay />);
    
    const warningMessage = screen.getByText('Node has no outgoing connections');
    await user.click(warningMessage);
    
    expect(mockSetSelectedNode).toHaveBeenCalledWith('node-2');
  });

  it('should not call setSelectedNode when clicking on error without nodeId', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [
        { message: 'Workflow must contain at least one Start Node', severity: 'error' as const },
      ],
      warnings: [],
      isValid: false,
      hasWarnings: false,
      all: [
        { message: 'Workflow must contain at least one Start Node', severity: 'error' as const },
      ],
    });

    render(<ValidationOverlay />);
    
    const errorMessage = screen.getByText('Workflow must contain at least one Start Node');
    await user.click(errorMessage);
    
    expect(mockSetSelectedNode).not.toHaveBeenCalled();
  });

  it('should display both errors and warnings together', () => {
    vi.spyOn(useWorkflowValidationModule, 'useWorkflowValidation').mockReturnValue({
      errors: [
        { message: 'Workflow contains cycles', severity: 'error' as const },
      ],
      warnings: [
        { message: 'Disconnected nodes detected', severity: 'warning' as const },
      ],
      isValid: false,
      hasWarnings: true,
      all: [
        { message: 'Workflow contains cycles', severity: 'error' as const },
        { message: 'Disconnected nodes detected', severity: 'warning' as const },
      ],
    });

    render(<ValidationOverlay />);
    expect(screen.getByText('1 Error')).toBeInTheDocument();
    expect(screen.getByText('1 Warning')).toBeInTheDocument();
    expect(screen.getByText('Workflow contains cycles')).toBeInTheDocument();
    expect(screen.getByText('Disconnected nodes detected')).toBeInTheDocument();
  });
});
