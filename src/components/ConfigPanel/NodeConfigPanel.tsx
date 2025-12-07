import React, { useCallback } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { NodeType } from '../../types/nodes';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm';
import { EndNodeForm } from './EndNodeForm';

export const NodeConfigPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const handleUpdate = useCallback((data: any) => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, data);
    }
  }, [selectedNodeId, updateNode]);

  const getNodeTypeLabel = (type: NodeType): string => {
    const labels: Record<NodeType, string> = {
      [NodeType.START]: 'Start',
      [NodeType.TASK]: 'Task',
      [NodeType.APPROVAL]: 'Approval',
      [NodeType.AUTOMATED_STEP]: 'Automated Step',
      [NodeType.END]: 'End'
    };
    return labels[type] || 'Unknown';
  };

  const renderForm = () => {
    if (!selectedNode) return null;

    switch (selectedNode.data.type) {
      case NodeType.START:
        return <StartNodeForm nodeData={selectedNode.data} onUpdate={handleUpdate} />;
      case NodeType.TASK:
        return <TaskNodeForm nodeData={selectedNode.data} onUpdate={handleUpdate} />;
      case NodeType.APPROVAL:
        return <ApprovalNodeForm nodeData={selectedNode.data} onUpdate={handleUpdate} />;
      case NodeType.AUTOMATED_STEP:
        return <AutomatedStepNodeForm nodeData={selectedNode.data} onUpdate={handleUpdate} />;
      case NodeType.END:
        return <EndNodeForm nodeData={selectedNode.data} onUpdate={handleUpdate} />;
      default:
        return <div className="text-sm text-gray-500">Unknown node type</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Panel content with animation */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
          selectedNode ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        {selectedNode ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Node Configuration</h2>
              <p className="text-sm text-gray-600 mt-1">
                {getNodeTypeLabel(selectedNode.data.type)} Node
              </p>
            </div>

            {/* Form content with scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {renderForm()}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center px-6">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-900">No node selected</p>
              <p className="text-xs text-gray-500 mt-2">
                Select a node on the canvas to configure its properties
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
