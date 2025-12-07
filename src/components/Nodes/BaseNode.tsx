import { ReactNode } from 'react';
import { Handle, Position } from 'reactflow';

interface BaseNodeProps {
  children: ReactNode;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  className?: string;
}

export function BaseNode({ 
  children, 
  showSourceHandle = true, 
  showTargetHandle = true,
  className = ''
}: BaseNodeProps) {
  return (
    <div className={`bg-white border-2 border-gray-300 rounded-lg shadow-md min-w-[180px] ${className}`}>
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500"
        />
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500"
        />
      )}
    </div>
  );
}
