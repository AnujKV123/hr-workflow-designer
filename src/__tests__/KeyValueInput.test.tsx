import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyValueInput } from '../components/FormFields/KeyValueInput';

describe('KeyValueInput', () => {
  it('renders with label', () => {
    const onChange = vi.fn();
    render(
      <KeyValueInput
        label="Metadata"
        value={{}}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Metadata')).toBeInTheDocument();
  });

  it('displays existing key-value pairs', () => {
    const onChange = vi.fn();
    render(
      <KeyValueInput
        label="Metadata"
        value={{ department: 'HR', location: 'NYC' }}
        onChange={onChange}
      />
    );

    expect(screen.getByDisplayValue('department')).toBeInTheDocument();
    expect(screen.getByDisplayValue('HR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('location')).toBeInTheDocument();
    expect(screen.getByDisplayValue('NYC')).toBeInTheDocument();
  });

  it('adds new pair when add button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(
      <KeyValueInput
        label="Metadata"
        value={{}}
        onChange={onChange}
      />
    );

    const addButton = screen.getByRole('button', { name: /add metadata/i });
    await user.click(addButton);

    const inputs = screen.getAllByPlaceholderText(/key|value/i);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls onChange when key-value pair is updated', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(
      <KeyValueInput
        label="Metadata"
        value={{ existing: 'value' }}
        onChange={onChange}
      />
    );

    const keyInput = screen.getByDisplayValue('existing');
    await user.clear(keyInput);
    await user.type(keyInput, 'newKey');

    expect(onChange).toHaveBeenCalled();
  });

  it('removes pair when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(
      <KeyValueInput
        label="Metadata"
        value={{ key1: 'value1' }}
        onChange={onChange}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove pair/i });
    await user.click(removeButton);

    expect(onChange).toHaveBeenCalledWith({});
  });

  it('displays error message when provided', () => {
    const onChange = vi.fn();
    render(
      <KeyValueInput
        label="Metadata"
        value={{}}
        onChange={onChange}
        error="This field is required"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });
});
