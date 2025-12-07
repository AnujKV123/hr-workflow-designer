import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { ApprovalNodeData } from '../../types/nodes';

export const ApprovalNode = memo(({ data }: NodeProps<ApprovalNodeData>) => {
  return (
    <BaseNode className="border-yellow-500 bg-yellow-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
          ✋
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase font-semibold">Approval</div>
          <div className="font-semibold text-gray-800">{data.title || 'Approval Node'}</div>
          {data.approverRole && (
            <div className="text-xs text-gray-600 mt-1">
              Approver: {data.approverRole}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
});

ApprovalNode.displayName = 'ApprovalNode';
