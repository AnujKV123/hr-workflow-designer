// Node type definitions for the HR Workflow Designer

export enum NodeType {
  START = 'start',
  TASK = 'task',
  APPROVAL = 'approval',
  AUTOMATED_STEP = 'automatedStep',
  END = 'end'
}

export interface BaseNodeData {
  id: string;
  type: NodeType;
  label: string;
}

export interface StartNodeData extends BaseNodeData {
  type: NodeType.START;
  title: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: NodeType.TASK;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: NodeType.APPROVAL;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  type: NodeType.AUTOMATED_STEP;
  title: string;
  actionId: string;
  actionLabel: string;
  parameters: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: NodeType.END;
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedStepNodeData 
  | EndNodeData;
