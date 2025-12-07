// Mock simulation logic for workflow testing

import { WorkflowGraph, ValidationError } from '../../types/workflow';
import { SimulationResult, SimulationStep } from '../../types/api';
import { NodeType } from '../../types/nodes';

/**
 * Validates the workflow structure and returns any errors
 */
function validateWorkflowStructure(workflow: WorkflowGraph): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Check for Start Node
  const startNodes = workflow.nodes.filter(n => n.data.type === NodeType.START);
  if (startNodes.length === 0) {
    errors.push({
      message: 'Workflow must have at least one Start Node',
      severity: 'error'
    });
  }
  
  if (startNodes.length > 1) {
    errors.push({
      message: 'Multiple Start Nodes detected. Only one Start Node is recommended.',
      severity: 'warning'
    });
  }
  
  // Check for End Nodes with outgoing edges
  const endNodes = workflow.nodes.filter(n => n.data.type === NodeType.END);
  endNodes.forEach(endNode => {
    const hasOutgoingEdge = workflow.edges.some(e => e.source === endNode.id);
    if (hasOutgoingEdge) {
      errors.push({
        nodeId: endNode.id,
        message: `End Node "${endNode.data.label}" cannot have outgoing edges`,
        severity: 'error'
      });
    }
  });
  
  // Check for cycles using DFS
  const hasCycle = detectCycle(workflow);
  if (hasCycle) {
    errors.push({
      message: 'Workflow contains cycles. Cyclic workflows are not supported.',
      severity: 'error'
    });
  }
  
  // Check for disconnected nodes
  if (startNodes.length > 0) {
    const reachableNodes = getReachableNodes(workflow, startNodes[0].id);
    const disconnectedNodes = workflow.nodes.filter(n => !reachableNodes.has(n.id));
    
    if (disconnectedNodes.length > 0) {
      disconnectedNodes.forEach(node => {
        errors.push({
          nodeId: node.id,
          message: `Node "${node.data.label}" is disconnected from the workflow`,
          severity: 'warning'
        });
      });
    }
  }
  
  // Check for incomplete paths (non-End nodes with no outgoing edges)
  workflow.nodes.forEach(node => {
    if (node.data.type !== NodeType.END) {
      const hasOutgoingEdge = workflow.edges.some(e => e.source === node.id);
      if (!hasOutgoingEdge) {
        errors.push({
          nodeId: node.id,
          message: `Node "${node.data.label}" has no outgoing edges and is not an End Node`,
          severity: 'warning'
        });
      }
    }
  });
  
  return errors;
}

/**
 * Detects if the workflow graph contains a cycle
 */
function detectCycle(workflow: WorkflowGraph): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const outgoingEdges = workflow.edges.filter(e => e.source === nodeId);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) {
          return true;
        }
      } else if (recursionStack.has(edge.target)) {
        return true;
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  for (const node of workflow.nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Gets all nodes reachable from a starting node
 */
function getReachableNodes(workflow: WorkflowGraph, startNodeId: string): Set<string> {
  const reachable = new Set<string>();
  const queue = [startNodeId];
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (reachable.has(currentId)) {
      continue;
    }
    
    reachable.add(currentId);
    
    const outgoingEdges = workflow.edges.filter(e => e.source === currentId);
    for (const edge of outgoingEdges) {
      if (!reachable.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }
  
  return reachable;
}

/**
 * Simulates a single node execution
 */
function simulateNode(
  node: WorkflowGraph['nodes'][0],
  workflow: WorkflowGraph,
  steps: SimulationStep[],
  visited: Set<string>
): void {
  if (visited.has(node.id)) {
    return;
  }
  
  visited.add(node.id);
  
  // Create simulation step
  steps.push({
    nodeId: node.id,
    nodeType: node.data.type,
    nodeTitle: node.data.label,
    status: 'completed',
    timestamp: new Date().toISOString(),
    details: `Executed ${node.data.type} node: ${node.data.label}`
  });
  
  // Find next nodes
  const outgoingEdges = workflow.edges.filter(e => e.source === node.id);
  for (const edge of outgoingEdges) {
    const nextNode = workflow.nodes.find(n => n.id === edge.target);
    if (nextNode) {
      simulateNode(nextNode, workflow, steps, visited);
    }
  }
}

/**
 * Simulates workflow execution
 */
export function simulateWorkflow(workflow: WorkflowGraph): SimulationResult {
  const steps: SimulationStep[] = [];
  const errors: ValidationError[] = [];
  
  // Validate workflow structure
  const validationErrors = validateWorkflowStructure(workflow);
  
  // If there are blocking errors, return early
  const blockingErrors = validationErrors.filter(e => e.severity === 'error');
  if (blockingErrors.length > 0) {
    return {
      success: false,
      steps: [],
      errors: validationErrors,
      executionTime: 0
    };
  }
  
  // Include warnings in the result
  errors.push(...validationErrors.filter(e => e.severity === 'warning'));
  
  // Simulate execution
  const startTime = Date.now();
  const startNode = workflow.nodes.find(n => n.data.type === NodeType.START);
  
  if (startNode) {
    const visited = new Set<string>();
    simulateNode(startNode, workflow, steps, visited);
  }
  
  const executionTime = Date.now() - startTime;
  
  return {
    success: true,
    steps,
    errors,
    executionTime
  };
}
