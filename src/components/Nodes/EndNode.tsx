import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { EndNodeData } from '../../types/nodes';

export const EndNode = memo(({ data }: NodeProps<EndNodeData>) => {
  return (
    <BaseNode 
      showSourceHandle={false}
      className="border-red-500 bg-red-50"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
          ■
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase font-semibold">End</div>
          <div className="font-semibold text-gray-800">End Node</div>
        </div>
      </div>
    </BaseNode>
  );
});

EndNode.displayName = 'EndNode';
