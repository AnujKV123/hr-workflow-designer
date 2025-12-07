import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NodeConfigPanel } from '../components/ConfigPanel/NodeConfigPanel';
import { StartNodeForm } from '../components/ConfigPanel/StartNodeForm';
import { TaskNodeForm } from '../components/ConfigPanel/TaskNodeForm';
import { ApprovalNodeForm } from '../components/ConfigPanel/ApprovalNodeForm';
import { EndNodeForm } from '../components/ConfigPanel/EndNodeForm';
import { NodeType } from '../types/nodes';
import { useWorkflowStore } from '../hooks/useWorkflowStore';

describe('NodeConfigPanel', () => {
  beforeEach(() => {
    // Clear the store before each test
    useWorkflowStore.setState({
      nodes: [],
      edges: [],
      selectedNodeId: null
    });
  });

  it('displays empty state when no node is selected', () => {
    render(<NodeConfigPanel />);

    expect(screen.getByText(/no node selected/i)).toBeInTheDocument();
    expect(screen.getByText(/select a node on the canvas/i)).toBeInTheDocument();
  });

  it('displays StartNodeForm when a start node is selected', () => {
    const startNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start Node',
        metadata: {}
      }
    };

    useWorkflowStore.setState({
      nodes: [startNode],
      selectedNodeId: 'start-1'
    });

    render(<NodeConfigPanel />);

    expect(screen.getByText(/node configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/start node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('displays TaskNodeForm when a task node is selected', () => {
    const taskNode = {
      id: 'task-1',
      type: 'task',
      position: { x: 0, y: 0 },
      data: {
        id: 'task-1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Task Node',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      }
    };

    useWorkflowStore.setState({
      nodes: [taskNode],
      selectedNodeId: 'task-1'
    });

    render(<NodeConfigPanel />);

    expect(screen.getByText(/task node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
  });

  it('displays ApprovalNodeForm when an approval node is selected', () => {
    const approvalNode = {
      id: 'approval-1',
      type: 'approval',
      position: { x: 0, y: 0 },
      data: {
        id: 'approval-1',
        type: NodeType.APPROVAL,
        label: 'Approval',
        title: 'Approval Node',
        approverRole: 'Manager',
        autoApproveThreshold: 0
      }
    };

    useWorkflowStore.setState({
      nodes: [approvalNode],
      selectedNodeId: 'approval-1'
    });

    render(<NodeConfigPanel />);

    expect(screen.getByText(/approval node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/approver role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auto-approve threshold/i)).toBeInTheDocument();
  });

  it('displays EndNodeForm when an end node is selected', () => {
    const endNode = {
      id: 'end-1',
      type: 'end',
      position: { x: 0, y: 0 },
      data: {
        id: 'end-1',
        type: NodeType.END,
        label: 'End',
        endMessage: '',
        showSummary: false
      }
    };

    useWorkflowStore.setState({
      nodes: [endNode],
      selectedNodeId: 'end-1'
    });

    render(<NodeConfigPanel />);

    expect(screen.getByText(/end node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show workflow summary/i)).toBeInTheDocument();
  });

  it('updates node data when form values change', async () => {
    const user = userEvent.setup();
    const startNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Initial Title',
        metadata: {}
      }
    };

    useWorkflowStore.setState({
      nodes: [startNode],
      selectedNodeId: 'start-1'
    });

    render(<NodeConfigPanel />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');

    await waitFor(() => {
      const state = useWorkflowStore.getState();
      const updatedNode = state.nodes.find(n => n.id === 'start-1');
      expect(updatedNode?.data.title).toBe('Updated Title');
    });
  });

  it('switches forms when different node is selected', () => {
    const startNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        id: 'start-1',
        type: NodeType.START,
        label: 'Start',
        title: 'Start Node',
        metadata: {}
      }
    };

    const taskNode = {
      id: 'task-1',
      type: 'task',
      position: { x: 0, y: 0 },
      data: {
        id: 'task-1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Task Node',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      }
    };

    useWorkflowStore.setState({
      nodes: [startNode, taskNode],
      selectedNodeId: 'start-1'
    });

    const { rerender } = render(<NodeConfigPanel />);
    expect(screen.getByText(/start node/i)).toBeInTheDocument();

    // Change selection
    useWorkflowStore.setState({ selectedNodeId: 'task-1' });
    rerender(<NodeConfigPanel />);

    expect(screen.getByText(/task node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });
});

describe('Node Configuration Forms', () => {
  describe('StartNodeForm', () => {
    it('renders with initial values', () => {
      const nodeData = {
        id: '1',
        type: NodeType.START,
        label: 'Start',
        title: 'Test Start',
        metadata: { key1: 'value1' }
      };
      const onUpdate = () => {};

      render(<StartNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Start');
    });

    it('calls onUpdate when title changes', async () => {
      const user = userEvent.setup();
      const nodeData = {
        id: '1',
        type: NodeType.START,
        label: 'Start',
        title: '',
        metadata: {}
      };
      let updatedData: any = null;
      const onUpdate = (data: any) => {
        updatedData = data;
      };

      render(<StartNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Title');

      await waitFor(() => {
        expect(updatedData).toBeTruthy();
        expect(updatedData.title).toBe('New Title');
      });
    });
  });

  describe('TaskNodeForm', () => {
    it('renders with initial values', () => {
      const nodeData = {
        id: '1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Test Task',
        description: 'Test Description',
        assignee: 'John Doe',
        dueDate: '2024-12-31',
        customFields: {}
      };
      const onUpdate = () => {};

      render(<TaskNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      expect(screen.getByLabelText(/^title/i)).toHaveValue('Test Task');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
      expect(screen.getByLabelText(/assignee/i)).toHaveValue('John Doe');
    });

    it('shows validation error for empty title', async () => {
      const user = userEvent.setup();
      const nodeData = {
        id: '1',
        type: NodeType.TASK,
        label: 'Task',
        title: 'Initial',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      };
      const onUpdate = () => {};

      render(<TaskNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      const titleInput = screen.getByLabelText(/^title/i);
      await user.clear(titleInput);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('ApprovalNodeForm', () => {
    it('renders with initial values', () => {
      const nodeData = {
        id: '1',
        type: NodeType.APPROVAL,
        label: 'Approval',
        title: 'Test Approval',
        approverRole: 'Manager',
        autoApproveThreshold: 2
      };
      const onUpdate = () => {};

      render(<ApprovalNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      expect(screen.getByLabelText(/^title/i)).toHaveValue('Test Approval');
      expect(screen.getByLabelText(/approver role/i)).toHaveValue('Manager');
      expect(screen.getByLabelText(/auto-approve threshold/i)).toHaveValue(2);
    });

    it('validates required fields', async () => {
      const user = userEvent.setup();
      const nodeData = {
        id: '1',
        type: NodeType.APPROVAL,
        label: 'Approval',
        title: 'Test',
        approverRole: 'Manager',
        autoApproveThreshold: 0
      };
      const onUpdate = () => {};

      render(<ApprovalNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      const approverInput = screen.getByLabelText(/approver role/i);
      await user.clear(approverInput);

      await waitFor(() => {
        expect(screen.getByText(/approver role is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('EndNodeForm', () => {
    it('renders with initial values', () => {
      const nodeData = {
        id: '1',
        type: NodeType.END,
        label: 'End',
        endMessage: 'Workflow complete',
        showSummary: true
      };
      const onUpdate = () => {};

      render(<EndNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      expect(screen.getByLabelText(/end message/i)).toHaveValue('Workflow complete');
      expect(screen.getByLabelText(/show workflow summary/i)).toBeChecked();
    });

    it('calls onUpdate when checkbox is toggled', async () => {
      const user = userEvent.setup();
      const nodeData = {
        id: '1',
        type: NodeType.END,
        label: 'End',
        endMessage: '',
        showSummary: false
      };
      let updatedData: any = null;
      const onUpdate = (data: any) => {
        updatedData = data;
      };

      render(<EndNodeForm nodeData={nodeData} onUpdate={onUpdate} />);

      const checkbox = screen.getByLabelText(/show workflow summary/i);
      await user.click(checkbox);

      await waitFor(() => {
        expect(updatedData).toBeTruthy();
        expect(updatedData.showSummary).toBe(true);
      });
    });
  });
});
