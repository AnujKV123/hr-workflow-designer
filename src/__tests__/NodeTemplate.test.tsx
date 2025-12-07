import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NodeTemplate } from '../components/Sidebar/NodeTemplate';
import { NodeType } from '../types/nodes';

describe('NodeTemplate', () => {
  it('renders node template with label and description', () => {
    render(
      <NodeTemplate
        type={NodeType.START}
        label="Start"
        icon="▶️"
        description="Workflow entry point"
      />
    );
    
    expect(screen.getByText('Start')).toBeDefined();
    expect(screen.getByText('Workflow entry point')).toBeDefined();
    expect(screen.getByText('▶️')).toBeDefined();
  });

  it('is draggable', () => {
    const { container } = render(
      <NodeTemplate
        type={NodeType.TASK}
        label="Task"
        icon="📋"
        description="Human task assignment"
      />
    );
    
    const draggableElement = container.querySelector('[draggable="true"]');
    expect(draggableElement).toBeDefined();
  });

  it('handles drag start event', () => {
    const { container } = render(
      <NodeTemplate
        type={NodeType.APPROVAL}
        label="Approval"
        icon="✅"
        description="Approval step"
      />
    );
    
    const draggableElement = container.querySelector('[draggable="true"]');
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    };
    
    const dragEvent = {
      dataTransfer: mockDataTransfer,
      preventDefault: vi.fn(),
    } as any;
    
    fireEvent.dragStart(draggableElement!, dragEvent);
    
    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'application/reactflow',
      NodeType.APPROVAL
    );
    expect(mockDataTransfer.effectAllowed).toBe('move');
  });
});
