import { create } from 'zustand';
import { WorkflowNode, WorkflowEdge, WorkflowGraph, WorkflowNodeData } from '../types';

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  
  // Node actions
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  
  // Edge actions
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (id: string) => void;
  
  // Selection actions
  setSelectedNode: (id: string | null) => void;
  
  // Workflow actions
  clearWorkflow: () => void;
  loadWorkflow: (workflow: WorkflowGraph) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  
  // Node actions
  addNode: (node) => 
    set((state) => ({
      nodes: [...state.nodes, node]
    })),
  
  updateNode: (id, data) => 
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      )
    })),
  
  deleteNode: (id) => 
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
    })),
  
  // Edge actions
  addEdge: (edge) => 
    set((state) => ({
      edges: [...state.edges, edge]
    })),
  
  deleteEdge: (id) => 
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id)
    })),
  
  // Selection actions
  setSelectedNode: (id) => 
    set({ selectedNodeId: id }),
  
  // Workflow actions
  clearWorkflow: () => 
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null
    }),
  
  loadWorkflow: (workflow) => 
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      selectedNodeId: null
    })
}));
