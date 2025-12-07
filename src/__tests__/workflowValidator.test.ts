import { describe, it, expect } from 'vitest';
import { validateWorkflow } from '../services/workflowValidator';
import { WorkflowGraph } from '../types/workflow';
import { NodeType } from '../types/nodes';

describe('workflowValidator', () => {
  describe('validateStartNode', () => {
    it('should return error when no Start Node exists', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'task',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.TASK,
              label: 'Task 1',
              title: 'Task 1',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          }
        ],
        edges: []
      };

      const errors = validateWorkflow(workflow);
      const startNodeError = errors.find(e => 
        e.message.includes('Start Node') && e.severity === 'error'
      );

      expect(startNodeError).toBeDefined();
      expect(startNodeError?.message).toBe('Workflow must contain at least one Start Node');
    });

    it('should not return error when Start Node exists', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          }
        ],
        edges: []
      };

      const errors = validateWorkflow(workflow);
      const startNodeError = errors.find(e => 
        e.message.includes('at least one Start Node')
      );

      expect(startNodeError).toBeUndefined();
    });
  });

  describe('validateMultipleStartNodes', () => {
    it('should return warning when multiple Start Nodes exist', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start 1',
              title: 'Start 1',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'start',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.START,
              label: 'Start 2',
              title: 'Start 2',
              metadata: {}
            }
          }
        ],
        edges: []
      };

      const errors = validateWorkflow(workflow);
      const multipleStartWarnings = errors.filter(e => 
        e.message.includes('Multiple Start Nodes') && e.severity === 'warning'
      );

      expect(multipleStartWarnings.length).toBe(2);
      expect(multipleStartWarnings[0].nodeId).toBeDefined();
    });

    it('should not return warning with single Start Node', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          }
        ],
        edges: []
      };

      const errors = validateWorkflow(workflow);
      const multipleStartWarnings = errors.filter(e => 
        e.message.includes('Multiple Start Nodes')
      );

      expect(multipleStartWarnings.length).toBe(0);
    });
  });

  describe('validateNoCycles', () => {
    it('should detect simple cycle', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '1' } // Creates cycle
        ]
      };

      const errors = validateWorkflow(workflow);
      const cycleError = errors.find(e => 
        e.message.includes('cycle') && e.severity === 'error'
      );

      expect(cycleError).toBeDefined();
      expect(cycleError?.message).toContain('Cyclic workflows are not supported');
    });

    it('should detect complex cycle', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task 1',
              title: 'Task 1',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'task',
            position: { x: 200, y: 0 },
            data: {
              id: '3',
              type: NodeType.TASK,
              label: 'Task 2',
              title: 'Task 2',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '3' },
          { id: 'e3', source: '3', target: '2' } // Creates cycle between 2 and 3
        ]
      };

      const errors = validateWorkflow(workflow);
      const cycleError = errors.find(e => 
        e.message.includes('cycle') && e.severity === 'error'
      );

      expect(cycleError).toBeDefined();
    });

    it('should not detect cycle in valid workflow', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '3',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '3' }
        ]
      };

      const errors = validateWorkflow(workflow);
      const cycleError = errors.find(e => e.message.includes('cycle'));

      expect(cycleError).toBeUndefined();
    });
  });

  describe('validateEndNodes', () => {
    it('should return error when End Node has outgoing edges', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'end',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' } // End node with outgoing edge
        ]
      };

      const errors = validateWorkflow(workflow);
      const endNodeError = errors.find(e => 
        e.nodeId === '1' && e.message.includes('outgoing connections')
      );

      expect(endNodeError).toBeDefined();
      expect(endNodeError?.severity).toBe('error');
    });

    it('should not return error when End Node has no outgoing edges', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'end',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' }
        ]
      };

      const errors = validateWorkflow(workflow);
      const endNodeError = errors.find(e => 
        e.nodeId === '2' && e.message.includes('outgoing')
      );

      expect(endNodeError).toBeUndefined();
    });

    it('should allow multiple End Nodes', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'end',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.END,
              label: 'End 1',
              endMessage: '',
              showSummary: false
            }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 100, y: 100 },
            data: {
              id: '3',
              type: NodeType.END,
              label: 'End 2',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '1', target: '3' }
        ]
      };

      const errors = validateWorkflow(workflow);
      // Should not have errors about multiple end nodes
      const multipleEndError = errors.find(e => 
        e.message.toLowerCase().includes('multiple') && 
        e.message.toLowerCase().includes('end')
      );

      expect(multipleEndError).toBeUndefined();
    });
  });

  describe('validateDisconnectedNodes', () => {
    it('should detect node not reachable from Start', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Connected Task',
              title: 'Connected Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'task',
            position: { x: 100, y: 100 },
            data: {
              id: '3',
              type: NodeType.TASK,
              label: 'Disconnected Task',
              title: 'Disconnected Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '4',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '4',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '4' }
          // Node 3 is disconnected
        ]
      };

      const errors = validateWorkflow(workflow);
      const disconnectedError = errors.find(e => 
        e.message.includes('Disconnected') && e.severity === 'warning'
      );

      expect(disconnectedError).toBeDefined();
      expect(disconnectedError?.message).toContain('Disconnected Task');
    });

    it('should detect node that cannot reach End', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Dead End Task',
              title: 'Dead End Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '3',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' }
          // Node 2 cannot reach End node 3
        ]
      };

      const errors = validateWorkflow(workflow);
      const disconnectedError = errors.find(e => 
        e.message.includes('Disconnected') && e.severity === 'warning'
      );

      expect(disconnectedError).toBeDefined();
    });

    it('should not report disconnected nodes in valid workflow', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '3',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '3' }
        ]
      };

      const errors = validateWorkflow(workflow);
      const disconnectedError = errors.find(e => 
        e.message.includes('Disconnected')
      );

      expect(disconnectedError).toBeUndefined();
    });
  });

  describe('validateIncompletePaths', () => {
    it('should warn when non-End node has no outgoing edges', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Incomplete Task',
              title: 'Incomplete Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' }
          // Node 2 has no outgoing edges
        ]
      };

      const errors = validateWorkflow(workflow);
      const incompletePathError = errors.find(e => 
        e.nodeId === '2' && 
        e.message.includes('no outgoing connections') &&
        e.severity === 'warning'
      );

      expect(incompletePathError).toBeDefined();
      expect(incompletePathError?.message).toContain('Incomplete Task');
    });

    it('should not warn for End nodes without outgoing edges', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'end',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' }
        ]
      };

      const errors = validateWorkflow(workflow);
      const incompletePathError = errors.find(e => 
        e.nodeId === '2' && e.message.includes('no outgoing')
      );

      expect(incompletePathError).toBeUndefined();
    });

    it('should not warn when all non-End nodes have outgoing edges', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '3',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '3' }
        ]
      };

      const errors = validateWorkflow(workflow);
      const incompletePathError = errors.find(e => 
        e.message.includes('no outgoing')
      );

      expect(incompletePathError).toBeUndefined();
    });
  });

  describe('validateWorkflow - integration', () => {
    it('should return multiple errors for invalid workflow', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'task',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '2',
            type: 'end',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '2', target: '1' } // End node with outgoing edge
        ]
      };

      const errors = validateWorkflow(workflow);
      
      // Should have error for missing Start Node
      expect(errors.some(e => 
        e.message.includes('Start Node') && e.severity === 'error'
      )).toBe(true);
      
      // Should have error for End Node with outgoing edge
      expect(errors.some(e => 
        e.message.includes('outgoing connections') && e.severity === 'error'
      )).toBe(true);
    });

    it('should return empty array for valid workflow', () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'task',
            position: { x: 100, y: 0 },
            data: {
              id: '2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '3',
              type: NodeType.END,
              label: 'End',
              endMessage: '',
              showSummary: false
            }
          }
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '2', target: '3' }
        ]
      };

      const errors = validateWorkflow(workflow);
      expect(errors).toEqual([]);
    });
  });
});
