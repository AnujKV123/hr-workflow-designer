import { DragEvent } from 'react';
import { NodeType } from '../../types/nodes';

interface NodeTemplateProps {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
}

export function NodeTemplate({ type, label, icon, description }: NodeTemplateProps) {
  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:shadow-md transition-all duration-200"
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg text-2xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">{label}</div>
        <div className="text-xs text-gray-500 truncate">{description}</div>
      </div>
    </div>
  );
}
