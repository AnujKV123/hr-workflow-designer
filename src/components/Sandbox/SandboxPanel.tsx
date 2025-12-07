// Sandbox Panel for workflow testing
// Requirements: 9.1, 9.2, 9.3, 9.4, 9.5

import { useState } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { simulateWorkflowAPI } from '../../services/api';
import { SimulationResult } from '../../types/api';
import { SimulationLog } from './SimulationLog';
import { ValidationResults } from './ValidationResults';

export function SandboxPanel() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleTestWorkflow = async () => {
    // Clear previous results and errors
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // Serialize workflow graph
      const workflow = { nodes, edges };
      
      // Send POST request to /api/simulate
      const simulationResult = await simulateWorkflowAPI(workflow);
      
      // Store the result
      setResult(simulationResult);
    } catch (err) {
      // Handle API errors
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-4 w-80 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Workflow Testing</h2>
      
      {/* Test Button */}
      <button
        onClick={handleTestWorkflow}
        disabled={isLoading || nodes.length === 0}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Testing...' : 'Test Workflow'}
      </button>

      {/* Empty workflow message */}
      {nodes.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Add nodes to the canvas to test your workflow.
        </p>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={handleTestWorkflow}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Simulation Results */}
      {result && !error && (
        <>
          {/* Validation Errors */}
          {result.errors.length > 0 && (
            <ValidationResults errors={result.errors} />
          )}

          {/* Simulation Log */}
          {result.steps.length > 0 && (
            <SimulationLog 
              steps={result.steps} 
              executionTime={result.executionTime}
              success={result.success}
            />
          )}
        </>
      )}
    </div>
  );
}
