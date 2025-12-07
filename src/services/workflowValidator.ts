// Workflow validation utility
// Validates workflow structure and returns validation errors/warnings

import { WorkflowGraph, WorkflowNode, WorkflowEdge, ValidationError } from '../types/workflow';
import { NodeType } from '../types/nodes';

/**
 * Validates a workflow graph and returns an array of validation errors/warnings
 * @param workflow - The workflow graph to validate
 * @returns Array of validation errors with severity levels
 */
export function validateWorkflow(workflow: WorkflowGraph): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validation 1: Check for missing Start Node (error)
  errors.push(...validateStartNode(workflow));

  // Validation 2: Check for multiple Start Nodes (warning)
  errors.push(...validateMultipleStartNodes(workflow));

  // Validation 3: Check for cycles in graph (error)
  errors.push(...validateNoCycles(workflow));

  // Validation 4: Check for End Nodes with outgoing edges (error)
  errors.push(...validateEndNodes(workflow));

  // Validation 5: Check for disconnected nodes (warning)
  errors.push(...validateDisconnectedNodes(workflow));

  // Validation 6: Check for incomplete paths (warning)
  errors.push(...validateIncompletePaths(workflow));

  return errors;
}

/**
 * Validates that the workflow has at least one Start Node
 * Requirements: 10.1
 */
function validateStartNode(workflow: WorkflowGraph): ValidationError[] {
  const startNodes = workflow.nodes.filter(
    node => node.data.type === NodeType.START
  );

  if (startNodes.length === 0) {
    return [{
      message: 'Workflow must contain at least one Start Node',
      severity: 'error'
    }];
  }

  return [];
}

/**
 * Validates that the workflow doesn't have multiple Start Nodes (warning only)
 * Requirements: 10.2
 */
function validateMultipleStartNodes(workflow: WorkflowGraph): ValidationError[] {
  const startNodes = workflow.nodes.filter(
    node => node.data.type === NodeType.START
  );

  if (startNodes.length > 1) {
    return startNodes.map(node => ({
      nodeId: node.id,
      message: 'Multiple Start Nodes detected. Only one Start Node is recommended',
      severity: 'warning' as const
    }));
  }

  return [];
}

/**
 * Detects cycles in the workflow graph using DFS
 * Requirements: 10.4
 */
function validateNoCycles(workflow: WorkflowGraph): ValidationError[] {
  const { nodes, edges } = workflow;
  
  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  });

  // DFS to detect cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycleNodes = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) {
          cycleNodes.add(nodeId);
          cycleNodes.add(neighbor);
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        cycleNodes.add(nodeId);
        cycleNodes.add(neighbor);
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check all nodes for cycles
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      hasCycle(node.id);
    }
  }

  if (cycleNodes.size > 0) {
    return [{
      message: `Workflow contains cycles. Cyclic workflows are not supported`,
      severity: 'error'
    }];
  }

  return [];
}

/**
 * Validates that End Nodes don't have outgoing edges
 * Requirements: 7.5
 */
function validateEndNodes(workflow: WorkflowGraph): ValidationError[] {
  const errors: ValidationError[] = [];
  const endNodes = workflow.nodes.filter(
    node => node.data.type === NodeType.END
  );

  for (const endNode of endNodes) {
    const outgoingEdges = workflow.edges.filter(
      edge => edge.source === endNode.id
    );

    if (outgoingEdges.length > 0) {
      errors.push({
        nodeId: endNode.id,
        message: 'End Node cannot have outgoing connections',
        severity: 'error'
      });
    }
  }

  return errors;
}

/**
 * Validates that all nodes are connected to the workflow
 * A node is disconnected if it's not reachable from a Start Node
 * or doesn't have a path to an End Node
 * Requirements: 9.5
 */
function validateDisconnectedNodes(workflow: WorkflowGraph): ValidationError[] {
  const { nodes, edges } = workflow;
  
  if (nodes.length === 0) {
    return [];
  }

  // Find all Start Nodes
  const startNodes = nodes.filter(node => node.data.type === NodeType.START);
  
  if (startNodes.length === 0) {
    // If no start node, all nodes are disconnected (but this is caught by validateStartNode)
    return [];
  }

  // Build adjacency lists for forward and backward traversal
  const forwardAdjacency = new Map<string, string[]>();
  const backwardAdjacency = new Map<string, string[]>();
  
  nodes.forEach(node => {
    forwardAdjacency.set(node.id, []);
    backwardAdjacency.set(node.id, []);
  });
  
  edges.forEach(edge => {
    const forward = forwardAdjacency.get(edge.source) || [];
    forward.push(edge.target);
    forwardAdjacency.set(edge.source, forward);
    
    const backward = backwardAdjacency.get(edge.target) || [];
    backward.push(edge.source);
    backwardAdjacency.set(edge.target, backward);
  });

  // Find nodes reachable from Start Nodes
  const reachableFromStart = new Set<string>();
  
  function dfsForward(nodeId: string) {
    if (reachableFromStart.has(nodeId)) return;
    reachableFromStart.add(nodeId);
    
    const neighbors = forwardAdjacency.get(nodeId) || [];
    neighbors.forEach(neighbor => dfsForward(neighbor));
  }
  
  startNodes.forEach(startNode => dfsForward(startNode.id));

  // Find End Nodes
  const endNodes = nodes.filter(node => node.data.type === NodeType.END);
  
  // Find nodes that can reach an End Node
  const canReachEnd = new Set<string>();
  
  function dfsBackward(nodeId: string) {
    if (canReachEnd.has(nodeId)) return;
    canReachEnd.add(nodeId);
    
    const neighbors = backwardAdjacency.get(nodeId) || [];
    neighbors.forEach(neighbor => dfsBackward(neighbor));
  }
  
  endNodes.forEach(endNode => dfsBackward(endNode.id));

  // Find disconnected nodes (not reachable from start OR can't reach end)
  const disconnectedNodes = nodes.filter(node => 
    !reachableFromStart.has(node.id) || !canReachEnd.has(node.id)
  );

  if (disconnectedNodes.length > 0) {
    const nodeList = disconnectedNodes.map(n => n.data.label || n.id).join(', ');
    return [{
      message: `Disconnected nodes detected: ${nodeList}`,
      severity: 'warning'
    }];
  }

  return [];
}

/**
 * Validates that non-End nodes have outgoing edges (complete paths)
 * Requirements: 10.3
 */
function validateIncompletePaths(workflow: WorkflowGraph): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const node of workflow.nodes) {
    // Skip End Nodes - they're allowed to have no outgoing edges
    if (node.data.type === NodeType.END) {
      continue;
    }

    // Check if this node has any outgoing edges
    const hasOutgoingEdges = workflow.edges.some(
      edge => edge.source === node.id
    );

    if (!hasOutgoingEdges) {
      errors.push({
        nodeId: node.id,
        message: `Node "${node.data.label || node.id}" has no outgoing connections and is not an End Node`,
        severity: 'warning'
      });
    }
  }

  return errors;
}
