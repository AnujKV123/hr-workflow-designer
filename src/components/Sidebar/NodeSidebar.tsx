import { NodeTemplate } from './NodeTemplate';
import { NodeType } from '../../types/nodes';

const nodeTemplates = [
  {
    type: NodeType.START,
    label: 'Start',
    icon: '▶️',
    description: 'Workflow entry point',
  },
  {
    type: NodeType.TASK,
    label: 'Task',
    icon: '📋',
    description: 'Human task assignment',
  },
  {
    type: NodeType.APPROVAL,
    label: 'Approval',
    icon: '✅',
    description: 'Approval step with role',
  },
  {
    type: NodeType.AUTOMATED_STEP,
    label: 'Automated Step',
    icon: '⚙️',
    description: 'System automation',
  },
  {
    type: NodeType.END,
    label: 'End',
    icon: '🏁',
    description: 'Workflow completion',
  },
];

export function NodeSidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Node Types</h2>
        <p className="text-xs text-gray-600">Drag nodes to the canvas</p>
      </div>
      
      <div className="space-y-3">
        {nodeTemplates.map((template) => (
          <NodeTemplate
            key={template.type}
            type={template.type}
            label={template.label}
            icon={template.icon}
            description={template.description}
          />
        ))}
      </div>
    </aside>
  );
}
