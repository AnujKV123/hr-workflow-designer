// Workflow serialization utilities
// Requirements: 9.1

import { WorkflowGraph } from '../types/workflow';

/**
 * Serializes a workflow graph to a JSON string
 * @param graph - The workflow graph to serialize
 * @returns JSON string representation of the workflow
 */
export function serializeWorkflow(graph: WorkflowGraph): string {
  return JSON.stringify(graph, null, 2);
}

/**
 * Deserializes a JSON string to a workflow graph
 * @param json - JSON string representation of a workflow
 * @returns The deserialized workflow graph
 * @throws Error if JSON is invalid or doesn't match WorkflowGraph structure
 */
export function deserializeWorkflow(json: string): WorkflowGraph {
  try {
    const parsed = JSON.parse(json);
    
    // Validate that the parsed object has the required structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid workflow format: expected an object');
    }
    
    if (!Array.isArray(parsed.nodes)) {
      throw new Error('Invalid workflow format: missing or invalid nodes array');
    }
    
    if (!Array.isArray(parsed.edges)) {
      throw new Error('Invalid workflow format: missing or invalid edges array');
    }
    
    // Basic validation of node structure
    for (const node of parsed.nodes) {
      if (!node.id || !node.type || !node.position || !node.data) {
        throw new Error('Invalid node structure in workflow');
      }
    }
    
    // Basic validation of edge structure
    for (const edge of parsed.edges) {
      if (!edge.id || !edge.source || !edge.target) {
        throw new Error('Invalid edge structure in workflow');
      }
    }
    
    return parsed as WorkflowGraph;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw error;
  }
}

/**
 * Exports a workflow graph as a downloadable JSON file
 * @param graph - The workflow graph to export
 * @param filename - The name of the file to download (default: 'workflow.json')
 */
export function exportWorkflow(graph: WorkflowGraph, filename: string = 'workflow.json'): void {
  // Ensure filename has .json extension
  const finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
  
  // Serialize the workflow
  const json = serializeWorkflow(graph);
  
  // Create a blob from the JSON string
  const blob = new Blob([json], { type: 'application/json' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  link.click();
  
  // Clean up the temporary URL
  URL.revokeObjectURL(url);
}
