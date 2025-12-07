import { describe, it, expect, beforeEach } from 'vitest';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { NodeType, WorkflowNode, WorkflowEdge } from '../types';

describe('useWorkflowStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useWorkflowStore.setState({
      nodes: [],
      edges: [],
      selectedNodeId: null
    });
  });

  describe('addNode', () => {
    it('should add a node to the store', () => {
      const node: WorkflowNode = {
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
      };

      useWorkflowStore.getState().addNode(node);
      
      const state = useWorkflowStore.getState();
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0]).toEqual(node);
    });
  });

  describe('updateNode', () => {
    it('should update node data', () => {
      const node: WorkflowNode = {
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
      };

      useWorkflowStore.getState().addNode(node);
      useWorkflowStore.getState().updateNode('node-1', { title: 'Updated Start' });
      
      const state = useWorkflowStore.getState();
      const nodeData = state.nodes[0].data;
      if ('title' in nodeData) {
        expect(nodeData.title).toBe('Updated Start');
      }
    });
  });

  describe('deleteNode', () => {
    it('should delete a node and its connected edges', () => {
      const node1: WorkflowNode = {
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
      };

      const node2: WorkflowNode = {
        id: 'node-2',
        type: 'task',
        position: { x: 200, y: 200 },
        data: {
          id: 'node-2',
          type: NodeType.TASK,
          label: 'Task',
          title: 'Task Node',
          description: '',
          assignee: '',
          dueDate: '',
          customFields: {}
        }
      };

      const edge: WorkflowEdge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      };

      useWorkflowStore.getState().addNode(node1);
      useWorkflowStore.getState().addNode(node2);
      useWorkflowStore.getState().addEdge(edge);
      
      useWorkflowStore.getState().deleteNode('node-1');
      
      const state = useWorkflowStore.getState();
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].id).toBe('node-2');
      expect(state.edges).toHaveLength(0);
    });

    it('should clear selectedNodeId if deleted node was selected', () => {
      const node: WorkflowNode = {
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
      };

      useWorkflowStore.getState().addNode(node);
      useWorkflowStore.getState().setSelectedNode('node-1');
      useWorkflowStore.getState().deleteNode('node-1');
      
      const state = useWorkflowStore.getState();
      expect(state.selectedNodeId).toBeNull();
    });
  });

  describe('addEdge', () => {
    it('should add an edge to the store', () => {
      const edge: WorkflowEdge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      };

      useWorkflowStore.getState().addEdge(edge);
      
      const state = useWorkflowStore.getState();
      expect(state.edges).toHaveLength(1);
      expect(state.edges[0]).toEqual(edge);
    });
  });

  describe('deleteEdge', () => {
    it('should delete an edge from the store', () => {
      const edge: WorkflowEdge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      };

      useWorkflowStore.getState().addEdge(edge);
      useWorkflowStore.getState().deleteEdge('edge-1');
      
      const state = useWorkflowStore.getState();
      expect(state.edges).toHaveLength(0);
    });
  });

  describe('setSelectedNode', () => {
    it('should set the selected node id', () => {
      useWorkflowStore.getState().setSelectedNode('node-1');
      
      const state = useWorkflowStore.getState();
      expect(state.selectedNodeId).toBe('node-1');
    });

    it('should clear selection when passed null', () => {
      useWorkflowStore.getState().setSelectedNode('node-1');
      useWorkflowStore.getState().setSelectedNode(null);
      
      const state = useWorkflowStore.getState();
      expect(state.selectedNodeId).toBeNull();
    });
  });

  describe('clearWorkflow', () => {
    it('should clear all nodes, edges, and selection', () => {
      const node: WorkflowNode = {
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
      };

      const edge: WorkflowEdge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      };

      useWorkflowStore.getState().addNode(node);
      useWorkflowStore.getState().addEdge(edge);
      useWorkflowStore.getState().setSelectedNode('node-1');
      
      useWorkflowStore.getState().clearWorkflow();
      
      const state = useWorkflowStore.getState();
      expect(state.nodes).toHaveLength(0);
      expect(state.edges).toHaveLength(0);
      expect(state.selectedNodeId).toBeNull();
    });
  });

  describe('loadWorkflow', () => {
    it('should load a workflow and clear selection', () => {
      const workflow = {
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
        ] as WorkflowNode[],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2'
          }
        ]
      };

      useWorkflowStore.getState().setSelectedNode('old-node');
      useWorkflowStore.getState().loadWorkflow(workflow);
      
      const state = useWorkflowStore.getState();
      expect(state.nodes).toEqual(workflow.nodes);
      expect(state.edges).toEqual(workflow.edges);
      expect(state.selectedNodeId).toBeNull();
    });
  });
});
