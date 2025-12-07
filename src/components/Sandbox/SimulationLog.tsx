// SimulationLog component to display step-by-step execution
// Requirements: 9.3

import { SimulationStep } from '../../types/api';

interface SimulationLogProps {
  steps: SimulationStep[];
  executionTime: number;
  success: boolean;
}

export function SimulationLog({ steps, executionTime, success }: SimulationLogProps) {
  const getStatusColor = (status: SimulationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: SimulationStep['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✗';
      case 'pending':
        return '○';
      default:
        return '○';
    }
  };

  return (
    <div className="mt-4">
      {/* Header */}
      <div className={`p-3 rounded-t border ${
        success 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <h3 className={`text-sm font-semibold ${
          success ? 'text-green-800' : 'text-red-800'
        }`}>
          {success ? 'Simulation Successful' : 'Simulation Failed'}
        </h3>
        <p className="text-sm text-gray-700 mt-1">
          Execution time: {executionTime}ms
        </p>
      </div>

      {/* Steps List */}
      <div className="border border-t-0 border-gray-200 rounded-b bg-white">
        <div className="p-3">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">
            Execution Steps ({steps.length})
          </h4>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={`${step.nodeId}-${index}`}
                className="flex items-start gap-2 p-2 rounded border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {step.nodeTitle}
                    </span>
                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
                      {step.nodeType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${getStatusColor(step.status).split(' ')[0]}`}>
                      {step.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {step.details && (
                    <p className="text-xs text-gray-600 mt-1">
                      {step.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
