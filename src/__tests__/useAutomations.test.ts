import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAutomations } from '../hooks/useAutomations';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api');

describe('useAutomations', () => {
  const mockAutomations = [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch automations on mount', async () => {
    vi.mocked(api.getAutomations).mockResolvedValue(mockAutomations);

    const { result } = renderHook(() => useAutomations());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.actions).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.actions).toEqual(mockAutomations);
    expect(result.current.error).toBeNull();
    expect(api.getAutomations).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('Failed to fetch automations');
    vi.mocked(api.getAutomations).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAutomations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.actions).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });

  it('should support retry functionality', async () => {
    vi.mocked(api.getAutomations)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockAutomations);

    const { result } = renderHook(() => useAutomations());

    // Wait for initial error
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.actions).toEqual([]);

    // Retry
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.actions).toEqual(mockAutomations);
    expect(result.current.error).toBeNull();
    expect(api.getAutomations).toHaveBeenCalledTimes(2);
  });

  it('should cache data and not refetch on remount', async () => {
    vi.mocked(api.getAutomations).mockResolvedValue(mockAutomations);

    const { result, unmount, rerender } = renderHook(() => useAutomations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.actions).toEqual(mockAutomations);
    expect(api.getAutomations).toHaveBeenCalledTimes(1);

    // Rerender should not trigger another fetch
    rerender();

    expect(api.getAutomations).toHaveBeenCalledTimes(1);
    expect(result.current.actions).toEqual(mockAutomations);
  });

  it('should clear error on successful refetch', async () => {
    vi.mocked(api.getAutomations)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockAutomations);

    const { result } = renderHook(() => useAutomations());

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    // Refetch should clear the error
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.actions).toEqual(mockAutomations);
  });
});
