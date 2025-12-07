import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TaskNodeData } from '../../types/nodes';

export const TaskNode = memo(({ data }: NodeProps<TaskNodeData>) => {
  return (
    <BaseNode className="border-blue-500 bg-blue-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold">
          ✓
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase font-semibold">Task</div>
          <div className="font-semibold text-gray-800">{data.title || 'Task Node'}</div>
          {data.assignee && (
            <div className="text-xs text-gray-600 mt-1">
              Assigned to: {data.assignee}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
});

TaskNode.displayName = 'TaskNode';
