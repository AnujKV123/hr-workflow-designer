// ValidationResults component to display validation errors
// Requirements: 9.4, 9.5

import { ValidationError } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

interface ValidationResultsProps {
  errors: ValidationError[];
}

export function ValidationResults({ errors }: ValidationResultsProps) {
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);

  if (errors.length === 0) {
    return null;
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    // Scroll to the node in the canvas (the canvas will handle the visual focus)
  };

  const getSeverityColor = (severity: ValidationError['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: ValidationError['severity']) => {
    switch (severity) {
      case 'error':
        return '⚠';
      case 'warning':
        return '⚡';
      default:
        return 'ℹ';
    }
  };

  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="p-3 rounded-t border bg-yellow-50 border-yellow-200">
        <h3 className="text-sm font-semibold text-yellow-800">
          Validation Issues Found
        </h3>
        <p className="text-sm text-gray-700 mt-1">
          {errorCount > 0 && `${errorCount} error${errorCount !== 1 ? 's' : ''}`}
          {errorCount > 0 && warningCount > 0 && ', '}
          {warningCount > 0 && `${warningCount} warning${warningCount !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Errors List */}
      <div className="border border-t-0 border-gray-200 rounded-b bg-white">
        <div className="p-3">
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={`${error.nodeId || error.edgeId || 'general'}-${index}`}
                className={`p-2 rounded border ${getSeverityColor(error.severity)}`}
              >
                <div className="flex items-start gap-2">
                  {/* Severity Icon */}
                  <span className="text-lg flex-shrink-0">
                    {getSeverityIcon(error.severity)}
                  </span>

                  {/* Error Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase">
                        {error.severity}
                      </span>
                      {error.nodeId && (
                        <button
                          onClick={() => handleNodeClick(error.nodeId!)}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                          title="Click to select node"
                        >
                          Node: {error.nodeId}
                        </button>
                      )}
                      {error.edgeId && (
                        <span className="text-xs text-gray-600">
                          Edge: {error.edgeId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1">
                      {error.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
