import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { StartNodeData } from '../../types/nodes';

export const StartNode = memo(({ data }: NodeProps<StartNodeData>) => {
  return (
    <BaseNode 
      showTargetHandle={false}
      className="border-green-500 bg-green-50"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          ▶
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase font-semibold">Start</div>
          <div className="font-semibold text-gray-800">{data.title || 'Start Node'}</div>
        </div>
      </div>
    </BaseNode>
  );
});

StartNode.displayName = 'StartNode';
