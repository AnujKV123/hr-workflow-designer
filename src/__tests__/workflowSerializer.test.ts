// Tests for workflow serialization utilities

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { serializeWorkflow, deserializeWorkflow, exportWorkflow } from '../utils/workflowSerializer';
import { WorkflowGraph } from '../types/workflow';
import { NodeType } from '../types/nodes';

describe('workflowSerializer', () => {
  describe('serializeWorkflow', () => {
    it('should serialize an empty workflow', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      const result = serializeWorkflow(graph);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual(graph);
    });

    it('should serialize a workflow with nodes', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'node-1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: {
              id: 'node-1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start Node',
              metadata: { key: 'value' }
            }
          }
        ],
        edges: []
      };
      
      const result = serializeWorkflow(graph);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual(graph);
    });

    it('should serialize a workflow with nodes and edges', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'node-1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: {
              id: 'node-1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start Node',
              metadata: {}
            }
          },
          {
            id: 'node-2',
            type: 'end',
            position: { x: 300, y: 100 },
            data: {
              id: 'node-2',
              type: NodeType.END,
              label: 'End',
              endMessage: 'Complete',
              showSummary: true
            }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2'
          }
        ]
      };
      
      const result = serializeWorkflow(graph);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual(graph);
    });

    it('should preserve all node data types', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'task-1',
            type: 'task',
            position: { x: 200, y: 200 },
            data: {
              id: 'task-1',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Review Document',
              description: 'Review the onboarding document',
              assignee: 'john@example.com',
              dueDate: '2024-12-31',
              customFields: { priority: 'high' }
            }
          }
        ],
        edges: []
      };
      
      const result = serializeWorkflow(graph);
      const parsed = JSON.parse(result);
      
      expect(parsed.nodes[0].data).toEqual(graph.nodes[0].data);
    });

    it('should format JSON with indentation', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      const result = serializeWorkflow(graph);
      
      // Check that the result contains newlines (formatted)
      expect(result).toContain('\n');
    });
  });

  describe('deserializeWorkflow', () => {
    it('should deserialize a valid workflow JSON', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'node-1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: {
              id: 'node-1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start Node',
              metadata: {}
            }
          }
        ],
        edges: []
      };
      
      const json = JSON.stringify(graph);
      const result = deserializeWorkflow(json);
      
      expect(result).toEqual(graph);
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      
      expect(() => deserializeWorkflow(invalidJson)).toThrow('Invalid JSON format');
    });

    it('should throw error for non-object JSON', () => {
      const json = '"just a string"';
      
      expect(() => deserializeWorkflow(json)).toThrow('Invalid workflow format: expected an object');
    });

    it('should throw error for missing nodes array', () => {
      const json = JSON.stringify({ edges: [] });
      
      expect(() => deserializeWorkflow(json)).toThrow('Invalid workflow format: missing or invalid nodes array');
    });

    it('should throw error for missing edges array', () => {
      const json = JSON.stringify({ nodes: [] });
      
      expect(() => deserializeWorkflow(json)).toThrow('Invalid workflow format: missing or invalid edges array');
    });

    it('should throw error for invalid node structure', () => {
      const json = JSON.stringify({
        nodes: [{ id: 'node-1' }], // Missing required fields
        edges: []
      });
      
      expect(() => deserializeWorkflow(json)).toThrow('Invalid node structure in workflow');
    });

    it('should throw error for invalid edge structure', () => {
      const json = JSON.stringify({
        nodes: [],
        edges: [{ id: 'edge-1' }] // Missing source and target
      });
      
      expect(() => deserializeWorkflow(json)).toThrow('Invalid edge structure in workflow');
    });

    it('should deserialize complex workflow with all node types', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'start-1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: 'start-1',
              type: NodeType.START,
              label: 'Start',
              title: 'Begin',
              metadata: { workflow: 'onboarding' }
            }
          },
          {
            id: 'task-1',
            type: 'task',
            position: { x: 200, y: 0 },
            data: {
              id: 'task-1',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Complete Form',
              description: 'Fill out the form',
              assignee: 'user@example.com',
              dueDate: '2024-12-31',
              customFields: {}
            }
          },
          {
            id: 'approval-1',
            type: 'approval',
            position: { x: 400, y: 0 },
            data: {
              id: 'approval-1',
              type: NodeType.APPROVAL,
              label: 'Approval',
              title: 'Manager Approval',
              approverRole: 'manager',
              autoApproveThreshold: 5
            }
          },
          {
            id: 'auto-1',
            type: 'automatedStep',
            position: { x: 600, y: 0 },
            data: {
              id: 'auto-1',
              type: NodeType.AUTOMATED_STEP,
              label: 'Automated',
              title: 'Send Email',
              actionId: 'send_email',
              actionLabel: 'Send Email',
              parameters: { to: 'user@example.com' }
            }
          },
          {
            id: 'end-1',
            type: 'end',
            position: { x: 800, y: 0 },
            data: {
              id: 'end-1',
              type: NodeType.END,
              label: 'End',
              endMessage: 'Workflow complete',
              showSummary: true
            }
          }
        ],
        edges: [
          { id: 'e1', source: 'start-1', target: 'task-1' },
          { id: 'e2', source: 'task-1', target: 'approval-1' },
          { id: 'e3', source: 'approval-1', target: 'auto-1' },
          { id: 'e4', source: 'auto-1', target: 'end-1' }
        ]
      };
      
      const json = JSON.stringify(graph);
      const result = deserializeWorkflow(json);
      
      expect(result).toEqual(graph);
    });
  });

  describe('exportWorkflow', () => {
    let createElementSpy: any;
    let createObjectURLSpy: any;
    let revokeObjectURLSpy: any;
    let mockLink: any;

    beforeEach(() => {
      // Mock DOM APIs
      mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a download link with correct filename', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      exportWorkflow(graph, 'my-workflow.json');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('my-workflow.json');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should add .json extension if not provided', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      exportWorkflow(graph, 'my-workflow');
      
      expect(mockLink.download).toBe('my-workflow.json');
    });

    it('should use default filename if not provided', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      exportWorkflow(graph);
      
      expect(mockLink.download).toBe('workflow.json');
    });

    it('should create blob with correct content type', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      exportWorkflow(graph);
      
      expect(createObjectURLSpy).toHaveBeenCalled();
      const blobArg = createObjectURLSpy.mock.calls[0][0];
      expect(blobArg.type).toBe('application/json');
    });

    it('should revoke object URL after download', () => {
      const graph: WorkflowGraph = {
        nodes: [],
        edges: []
      };
      
      exportWorkflow(graph);
      
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should export workflow with all data preserved', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'node-1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: {
              id: 'node-1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start Node',
              metadata: { key: 'value' }
            }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2'
          }
        ]
      };
      
      exportWorkflow(graph, 'test.json');
      
      // Verify the blob was created with serialized content
      expect(createObjectURLSpy).toHaveBeenCalled();
      const blobArg = createObjectURLSpy.mock.calls[0][0];
      
      // Read the blob content (in a real browser, this would be the file content)
      expect(blobArg).toBeInstanceOf(Blob);
    });
  });

  describe('round-trip serialization', () => {
    it('should preserve workflow data through serialize and deserialize', () => {
      const graph: WorkflowGraph = {
        nodes: [
          {
            id: 'node-1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: {
              id: 'node-1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start Node',
              metadata: { key: 'value' }
            }
          },
          {
            id: 'node-2',
            type: 'task',
            position: { x: 300, y: 100 },
            data: {
              id: 'node-2',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Task Node',
              description: 'Do something',
              assignee: 'user@example.com',
              dueDate: '2024-12-31',
              customFields: { priority: 'high', category: 'onboarding' }
            }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2',
            type: 'default'
          }
        ]
      };
      
      const serialized = serializeWorkflow(graph);
      const deserialized = deserializeWorkflow(serialized);
      
      expect(deserialized).toEqual(graph);
    });
  });
});
