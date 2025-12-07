import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateInput } from '../components/FormFields/DateInput';

describe('DateInput', () => {
  it('renders with label', () => {
    const onChange = vi.fn();
    render(
      <DateInput
        label="Due Date"
        value=""
        onChange={onChange}
      />
    );

    expect(screen.getByText('Due Date')).toBeInTheDocument();
  });

  it('displays required indicator when required', () => {
    const onChange = vi.fn();
    render(
      <DateInput
        label="Due Date"
        value=""
        onChange={onChange}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays current value', () => {
    const onChange = vi.fn();
    render(
      <DateInput
        label="Due Date"
        value="2024-12-31"
        onChange={onChange}
      />
    );

    const input = screen.getByDisplayValue('2024-12-31') as HTMLInputElement;
    expect(input.value).toBe('2024-12-31');
  });

  it('calls onChange when date is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(
      <DateInput
        label="Due Date"
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText('Due Date');
    await user.type(input, '2024-12-31');

    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    const onChange = vi.fn();
    render(
      <DateInput
        label="Due Date"
        value=""
        onChange={onChange}
        error="Invalid date"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid date');
  });

  it('applies error styling when error is present', () => {
    const onChange = vi.fn();
    render(
      <DateInput
        label="Due Date"
        value=""
        onChange={onChange}
        error="Invalid date"
      />
    );

    const input = screen.getByLabelText('Due Date');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('respects min and max constraints', () => {
    const onChange = vi.fn();
    render(
      <DateInput
        label="Due Date"
        value=""
        onChange={onChange}
        min="2024-01-01"
        max="2024-12-31"
      />
    );

    const input = screen.getByLabelText('Due Date') as HTMLInputElement;
    expect(input.min).toBe('2024-01-01');
    expect(input.max).toBe('2024-12-31');
  });
});
