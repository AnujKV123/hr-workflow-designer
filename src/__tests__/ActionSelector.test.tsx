import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionSelector } from '../components/FormFields/ActionSelector';
import { AutomatedAction } from '../types/api';

const mockActions: AutomatedAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body']
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient']
  },
  {
    id: 'create_ticket',
    label: 'Create Support Ticket',
    params: ['title', 'priority', 'assignee']
  }
];

describe('ActionSelector', () => {
  it('renders with label', () => {
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
      />
    );

    expect(screen.getByText('Select Action')).toBeInTheDocument();
  });

  it('displays all available actions', () => {
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
      />
    );

    expect(screen.getByRole('option', { name: 'Send Email' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Generate Document' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Create Support Ticket' })).toBeInTheDocument();
  });

  it('displays parameter fields when action is selected', async () => {
    const user = userEvent.setup();
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId="send_email"
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
      />
    );

    expect(screen.getByText('Action Parameters')).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
  });

  it('calls onActionChange when action is selected', async () => {
    const user = userEvent.setup();
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'send_email');

    expect(onActionChange).toHaveBeenCalledWith('send_email', 'Send Email');
  });

  it('calls onParametersChange when parameter value changes', async () => {
    const user = userEvent.setup();
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId="send_email"
        parameters={{ to: '', subject: '', body: '' }}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
      />
    );

    const toInput = screen.getByLabelText(/to/i);
    await user.type(toInput, 'test@example.com');

    expect(onParametersChange).toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
        error="Action is required"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Action is required');
  });

  it('shows loading state', () => {
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={[]}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
        loading
      />
    );

    expect(screen.getByRole('option', { name: /loading actions/i })).toBeInTheDocument();
  });

  it('displays required indicator when required', () => {
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('initializes parameters when action is selected', async () => {
    const user = userEvent.setup();
    const onActionChange = vi.fn();
    const onParametersChange = vi.fn();
    
    render(
      <ActionSelector
        label="Select Action"
        actions={mockActions}
        selectedActionId=""
        parameters={{}}
        onActionChange={onActionChange}
        onParametersChange={onParametersChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'send_email');

    expect(onParametersChange).toHaveBeenCalledWith({
      to: '',
      subject: '',
      body: ''
    });
  });
});
