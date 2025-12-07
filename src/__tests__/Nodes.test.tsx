import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactFlowProvider } from 'reactflow';
import { StartNode } from '../components/Nodes/StartNode';
import { TaskNode } from '../components/Nodes/TaskNode';
import { ApprovalNode } from '../components/Nodes/ApprovalNode';
import { AutomatedStepNode } from '../components/Nodes/AutomatedStepNode';
import { EndNode } from '../components/Nodes/EndNode';
import { NodeType } from '../types/nodes';

// Helper to wrap components with ReactFlowProvider
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ReactFlowProvider>
      {component}
    </ReactFlowProvider>
  );
};

describe('Node Components', () => {
  describe('StartNode', () => {
    it('should render with title', () => {
      const data = {
        id: '1',
        type: NodeType.START,
        label: 'Start',
        title: 'Onboarding Start',
        metadata: {}
      };
      
      renderWithProvider(<StartNode id="1" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Onboarding Start')).toBeInTheDocument();
    });

    it('should render default title when title is empty', () => {
      const data = {
        id: '1',
        type: NodeType.START,
        label: 'Start',
        title: '',
        metadata: {}
      };
      
      renderWithProvider(<StartNode id="1" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Start Node')).toBeInTheDocument();
    });
  });

  describe('TaskNode', () => {
    it('should render with title and assignee', () => {
      const data = {
        id: '2',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Complete Form',
        description: 'Fill out the form',
        assignee: 'John Doe',
        dueDate: '2024-12-31',
        customFields: {}
      };
      
      renderWithProvider(<TaskNode id="2" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Complete Form')).toBeInTheDocument();
      expect(screen.getByText('Assigned to: John Doe')).toBeInTheDocument();
    });

    it('should render without assignee when not provided', () => {
      const data = {
        id: '2',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Complete Form',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      };
      
      renderWithProvider(<TaskNode id="2" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Complete Form')).toBeInTheDocument();
      expect(screen.queryByText(/Assigned to:/)).not.toBeInTheDocument();
    });
  });

  describe('ApprovalNode', () => {
    it('should render with title and approver role', () => {
      const data = {
        id: '3',
        type: NodeType.APPROVAL,
        label: 'Approval',
        title: 'Manager Approval',
        approverRole: 'HR Manager',
        autoApproveThreshold: 0
      };
      
      renderWithProvider(<ApprovalNode id="3" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Approval')).toBeInTheDocument();
      expect(screen.getByText('Manager Approval')).toBeInTheDocument();
      expect(screen.getByText('Approver: HR Manager')).toBeInTheDocument();
    });

    it('should render without approver role when not provided', () => {
      const data = {
        id: '3',
        type: NodeType.APPROVAL,
        label: 'Approval',
        title: 'Manager Approval',
        approverRole: '',
        autoApproveThreshold: 0
      };
      
      renderWithProvider(<ApprovalNode id="3" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Manager Approval')).toBeInTheDocument();
      expect(screen.queryByText(/Approver:/)).not.toBeInTheDocument();
    });
  });

  describe('AutomatedStepNode', () => {
    it('should render with title and action label', () => {
      const data = {
        id: '4',
        type: NodeType.AUTOMATED_STEP,
        label: 'Automated',
        title: 'Send Welcome Email',
        actionId: 'send_email',
        actionLabel: 'Send Email',
        parameters: {}
      };
      
      renderWithProvider(<AutomatedStepNode id="4" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Automated')).toBeInTheDocument();
      expect(screen.getByText('Send Welcome Email')).toBeInTheDocument();
      expect(screen.getByText('Action: Send Email')).toBeInTheDocument();
    });

    it('should render without action label when not provided', () => {
      const data = {
        id: '4',
        type: NodeType.AUTOMATED_STEP,
        label: 'Automated',
        title: 'Send Welcome Email',
        actionId: '',
        actionLabel: '',
        parameters: {}
      };
      
      renderWithProvider(<AutomatedStepNode id="4" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('Send Welcome Email')).toBeInTheDocument();
      expect(screen.queryByText(/Action:/)).not.toBeInTheDocument();
    });
  });

  describe('EndNode', () => {
    it('should render end node', () => {
      const data = {
        id: '5',
        type: NodeType.END,
        label: 'End',
        endMessage: 'Workflow Complete',
        showSummary: true
      };
      
      renderWithProvider(<EndNode id="5" data={data} selected={false} isConnectable={true} zIndex={0} xPos={0} yPos={0} dragging={false} />);
      
      expect(screen.getByText('End')).toBeInTheDocument();
      expect(screen.getByText('End Node')).toBeInTheDocument();
    });
  });
});
