import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWorkflowValidation } from '../hooks/useWorkflowValidation';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { NodeType } from '../types/nodes';
import { WorkflowNode } from '../types/workflow';

describe('useWorkflowValidation', () => {
  beforeEach(() => {
    // Clear workflow before each test
    useWorkflowStore.getState().clearWorkflow();
  });

  it('should return validation errors for empty workflow', () => {
    const { result } = renderHook(() => useWorkflowValidation());
    
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].message).toContain('Start Node');
  });

  it('should return valid for workflow with Start and End nodes', () => {
    // Add Start Node
    const startNode: WorkflowNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start',
        metadata: {}
      }
    };
    
    // Add End Node
    const endNode: WorkflowNode = {
      id: 'end-1',
      type: 'end',
      position: { x: 200, y: 0 },
      data: {
        id: 'end-1',
        type: NodeType.END,
        label: 'End',
        endMessage: 'Complete',
        showSummary: false
      }
    };
    
    useWorkflowStore.getState().addNode(startNode);
    useWorkflowStore.getState().addNode(endNode);
    useWorkflowStore.getState().addEdge({
      id: 'e1',
      source: 'start-1',
      target: 'end-1'
    });
    
    // Render hook after state changes
    const { result } = renderHook(() => useWorkflowValidation());
    
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toHaveLength(0);
  });

  it('should detect multiple Start Nodes as warning', () => {
    // Add two Start Nodes
    const startNode1: WorkflowNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start 1',
        title: 'Start 1',
        metadata: {}
      }
    };
    
    const startNode2: WorkflowNode = {
      id: 'start-2',
      type: 'start',
      position: { x: 0, y: 100 },
      data: {
        id: 'start-2',
        type: NodeType.START,
        label: 'Start 2',
        title: 'Start 2',
        metadata: {}
      }
    };
    
    useWorkflowStore.getState().addNode(startNode1);
    useWorkflowStore.getState().addNode(startNode2);
    
    const { result } = renderHook(() => useWorkflowValidation());
    
    expect(result.current.isValid).toBe(true); // No errors, just warnings
    expect(result.current.hasWarnings).toBe(true);
    expect(result.current.warnings.length).toBeGreaterThan(0);
    expect(result.current.warnings[0].message).toContain('Multiple Start Nodes');
  });

  it('should detect incomplete paths as warning', () => {
    // Add Start Node
    const startNode: WorkflowNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start',
        metadata: {}
      }
    };
    
    // Add Task Node with no outgoing edges
    const taskNode: WorkflowNode = {
      id: 'task-1',
      type: 'task',
      position: { x: 200, y: 0 },
      data: {
        id: 'task-1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      }
    };
    
    useWorkflowStore.getState().addNode(startNode);
    useWorkflowStore.getState().addNode(taskNode);
    useWorkflowStore.getState().addEdge({
      id: 'e1',
      source: 'start-1',
      target: 'task-1'
    });
    
    const { result } = renderHook(() => useWorkflowValidation());
    
    expect(result.current.hasWarnings).toBe(true);
    expect(result.current.warnings.some(w => w.message.includes('no outgoing connections'))).toBe(true);
  });

  it('should detect End Node with outgoing edges as error', () => {
    // Add Start Node
    const startNode: WorkflowNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start',
        metadata: {}
      }
    };
    
    // Add End Node
    const endNode: WorkflowNode = {
      id: 'end-1',
      type: 'end',
      position: { x: 200, y: 0 },
      data: {
        id: 'end-1',
        type: NodeType.END,
        label: 'End',
        endMessage: 'Complete',
        showSummary: false
      }
    };
    
    // Add Task Node
    const taskNode: WorkflowNode = {
      id: 'task-1',
      type: 'task',
      position: { x: 400, y: 0 },
      data: {
        id: 'task-1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      }
    };
    
    useWorkflowStore.getState().addNode(startNode);
    useWorkflowStore.getState().addNode(endNode);
    useWorkflowStore.getState().addNode(taskNode);
    useWorkflowStore.getState().addEdge({
      id: 'e1',
      source: 'start-1',
      target: 'end-1'
    });
    // Invalid: End Node with outgoing edge
    useWorkflowStore.getState().addEdge({
      id: 'e2',
      source: 'end-1',
      target: 'task-1'
    });
    
    const { result } = renderHook(() => useWorkflowValidation());
    
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors.some(e => e.message.includes('End Node cannot have outgoing'))).toBe(true);
  });

  it('should update validation when workflow changes', () => {
    const { result: initialResult } = renderHook(() => useWorkflowValidation());
    
    // Initially invalid (no Start Node)
    expect(initialResult.current.isValid).toBe(false);
    
    // Add Start Node
    const startNode: WorkflowNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start',
        metadata: {}
      }
    };
    
    const endNode: WorkflowNode = {
      id: 'end-1',
      type: 'end',
      position: { x: 200, y: 0 },
      data: {
        id: 'end-1',
        type: NodeType.END,
        label: 'End',
        endMessage: 'Complete',
        showSummary: false
      }
    };
    
    useWorkflowStore.getState().addNode(startNode);
    useWorkflowStore.getState().addNode(endNode);
    useWorkflowStore.getState().addEdge({
      id: 'e1',
      source: 'start-1',
      target: 'end-1'
    });
    
    // Render hook again after changes
    const { result: updatedResult } = renderHook(() => useWorkflowValidation());
    
    // Now valid
    expect(updatedResult.current.isValid).toBe(true);
    expect(updatedResult.current.errors).toHaveLength(0);
  });

  it('should separate errors and warnings correctly', () => {
    // Add two Start Nodes (warning)
    const startNode1: WorkflowNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start 1',
        title: 'Start 1',
        metadata: {}
      }
    };
    
    const startNode2: WorkflowNode = {
      id: 'start-2',
      type: 'start',
      position: { x: 0, y: 100 },
      data: {
        id: 'start-2',
        type: NodeType.START,
        label: 'Start 2',
        title: 'Start 2',
        metadata: {}
      }
    };
    
    // Add End Node with outgoing edge (error)
    const endNode: WorkflowNode = {
      id: 'end-1',
      type: 'end',
      position: { x: 200, y: 0 },
      data: {
        id: 'end-1',
        type: NodeType.END,
        label: 'End',
        endMessage: 'Complete',
        showSummary: false
      }
    };
    
    const taskNode: WorkflowNode = {
      id: 'task-1',
      type: 'task',
      position: { x: 400, y: 0 },
      data: {
        id: 'task-1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      }
    };
    
    useWorkflowStore.getState().addNode(startNode1);
    useWorkflowStore.getState().addNode(startNode2);
    useWorkflowStore.getState().addNode(endNode);
    useWorkflowStore.getState().addNode(taskNode);
    useWorkflowStore.getState().addEdge({
      id: 'e1',
      source: 'start-1',
      target: 'end-1'
    });
    useWorkflowStore.getState().addEdge({
      id: 'e2',
      source: 'end-1',
      target: 'task-1'
    });
    
    const { result } = renderHook(() => useWorkflowValidation());
    
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors.length).toBeGreaterThan(0);
    expect(result.current.hasWarnings).toBe(true);
    expect(result.current.warnings.length).toBeGreaterThan(0);
    expect(result.current.all.length).toBe(
      result.current.errors.length + result.current.warnings.length
    );
  });
});
