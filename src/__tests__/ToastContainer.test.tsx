import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../contexts/ToastContext';
import { ToastContainer } from '../components/Toast/ToastContainer';
import { useToast } from '../contexts/ToastContext';

// Test component that uses the toast hook
function ToastTrigger() {
  const { addToast } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => addToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => addToast('Warning message', 'warning')}>
        Show Warning
      </button>
      <button onClick={() => addToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  );
}

describe('ToastContainer', () => {
  it('should not render when there are no toasts', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    expect(container.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
  });

  it('should display success toast', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTrigger />
        <ToastContainer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should display error toast', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTrigger />
        <ToastContainer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Error'));
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should display warning toast', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTrigger />
        <ToastContainer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Warning'));
    
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should display info toast', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTrigger />
        <ToastContainer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Info'));
    
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should allow closing toast manually', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTrigger />
        <ToastContainer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    const closeButton = screen.getByLabelText('Close notification');
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  // Note: Auto-dismiss and multiple toasts are tested manually
  // as they involve complex timing interactions that are difficult to test reliably
});
