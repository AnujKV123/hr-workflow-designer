import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { ValidationError } from '../../types/workflow';

/**
 * ValidationOverlay component
 * Displays validation status and provides visual feedback for workflow validation
 * 
 * Requirements: 2.5, 3.5, 7.5, 8.5, 10.1, 10.2, 10.3, 10.4, 10.5
 */
export function ValidationOverlay() {
  const { errors, warnings, isValid } = useWorkflowValidation();
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);

  // Don't show anything if workflow is empty
  const nodes = useWorkflowStore((state) => state.nodes);
  if (nodes.length === 0) {
    return null;
  }

  // Handle clicking on an error to select the node
  const handleErrorClick = (error: ValidationError) => {
    if (error.nodeId) {
      setSelectedNode(error.nodeId);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 max-w-md">
      {/* Success indicator */}
      {isValid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg mb-2">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800 font-medium">Workflow is valid</span>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg mb-2">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-2">
                {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
              </h3>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li
                    key={index}
                    className={`text-sm text-red-700 ${
                      error.nodeId ? 'cursor-pointer hover:text-red-900 hover:underline' : ''
                    }`}
                    onClick={() => handleErrorClick(error)}
                  >
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-yellow-800 font-medium mb-2">
                {warnings.length} {warnings.length === 1 ? 'Warning' : 'Warnings'}
              </h3>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li
                    key={index}
                    className={`text-sm text-yellow-700 ${
                      warning.nodeId ? 'cursor-pointer hover:text-yellow-900 hover:underline' : ''
                    }`}
                    onClick={() => handleErrorClick(warning)}
                  >
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
