// API service functions for interacting with the mock backend

import { AutomatedAction, SimulationResult } from '../types/api';
import { WorkflowGraph } from '../types/workflow';

/**
 * Fetches available automated actions from the API
 */
export async function getAutomations(): Promise<AutomatedAction[]> {
  const response = await fetch('/api/automations');
  
  if (!response.ok) {
    throw new Error('Failed to fetch automations');
  }
  
  return response.json();
}

/**
 * Simulates workflow execution
 */
export async function simulateWorkflowAPI(workflow: WorkflowGraph): Promise<SimulationResult> {
  const response = await fetch('/api/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflow),
  });
  
  if (!response.ok) {
    throw new Error('Failed to simulate workflow');
  }
  
  return response.json();
}
