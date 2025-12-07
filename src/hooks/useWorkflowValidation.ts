import { useMemo } from 'react';
import { useWorkflowStore } from './useWorkflowStore';
import { validateWorkflow } from '../services/workflowValidator';
import { ValidationError } from '../types/workflow';

/**
 * Hook that validates the current workflow and returns validation errors/warnings
 * Automatically updates when the workflow changes
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 * 
 * @returns Object containing validation errors and warnings
 */
export function useWorkflowValidation() {
  // Get current workflow state from store
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  // Run validation whenever nodes or edges change
  const validationResults = useMemo(() => {
    const workflow = { nodes, edges };
    const allErrors = validateWorkflow(workflow);
    
    // Separate errors and warnings
    const errors = allErrors.filter(e => e.severity === 'error');
    const warnings = allErrors.filter(e => e.severity === 'warning');
    
    return {
      errors,
      warnings,
      isValid: errors.length === 0,
      hasWarnings: warnings.length > 0,
      all: allErrors
    };
  }, [nodes, edges]);

  return validationResults;
}
