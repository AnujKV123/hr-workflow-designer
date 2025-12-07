import { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useToast } from '../../contexts/ToastContext';

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { clearWorkflow, nodes } = useWorkflowStore();
  const { addToast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 200, padding: 0.2 });
  }, [fitView]);

  const handleClearClick = useCallback(() => {
    if (nodes.length === 0) {
      return;
    }
    setShowConfirmation(true);
  }, [nodes.length]);

  const handleConfirmClear = useCallback(() => {
    clearWorkflow();
    setShowConfirmation(false);
    addToast('Workflow cleared successfully', 'success');
  }, [clearWorkflow, addToast]);

  const handleCancelClear = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors duration-150 group"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <svg
            className="w-5 h-5 text-gray-700 group-hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors duration-150 group"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <svg
            className="w-5 h-5 text-gray-700 group-hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
            />
          </svg>
        </button>

        <div className="border-t border-gray-200 my-1" />

        <button
          onClick={handleFitView}
          className="p-2 hover:bg-gray-100 rounded transition-colors duration-150 group"
          title="Fit View"
          aria-label="Fit View"
        >
          <svg
            className="w-5 h-5 text-gray-700 group-hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        <div className="border-t border-gray-200 my-1" />

        <button
          onClick={handleClearClick}
          className="p-2 hover:bg-red-50 rounded transition-colors duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear Workflow"
          aria-label="Clear Workflow"
          disabled={nodes.length === 0}
        >
          <svg
            className="w-5 h-5 text-gray-700 group-hover:text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-200 scale-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Clear Workflow?
            </h3>
            <p className="text-gray-600 mb-6">
              This will remove all nodes and connections from the canvas. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelClear}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-150 font-medium"
              >
                Clear Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
