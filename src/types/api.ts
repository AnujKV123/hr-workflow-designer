// API type definitions for mock service layer

import { NodeType } from './nodes';
import { ValidationError } from './workflow';

export interface AutomatedAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  nodeTitle: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: ValidationError[];
  executionTime: number;
}
