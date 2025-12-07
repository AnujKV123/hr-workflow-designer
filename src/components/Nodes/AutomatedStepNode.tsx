import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { AutomatedStepNodeData } from '../../types/nodes';

export const AutomatedStepNode = memo(({ data }: NodeProps<AutomatedStepNodeData>) => {
  return (
    <BaseNode className="border-purple-500 bg-purple-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white font-bold">
          ⚡
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase font-semibold">Automated</div>
          <div className="font-semibold text-gray-800">{data.title || 'Automated Step'}</div>
          {data.actionLabel && (
            <div className="text-xs text-gray-600 mt-1">
              Action: {data.actionLabel}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
});

AutomatedStepNode.displayName = 'AutomatedStepNode';
