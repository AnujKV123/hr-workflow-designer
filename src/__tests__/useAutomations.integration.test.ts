import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { useAutomations } from '../hooks/useAutomations';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';

// Set up MSW server for integration testing
const server = setupServer(...handlers);

describe('useAutomations - Integration with MSW', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should fetch real automation data from MSW mock API', async () => {
    const { result } = renderHook(() => useAutomations());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify we got the expected mock data
    expect(result.current.actions).toHaveLength(5);
    expect(result.current.actions[0]).toEqual({
      id: 'send_email',
      label: 'Send Email',
      params: ['to', 'subject', 'body']
    });
    expect(result.current.error).toBeNull();
  });

  it('should cache data across multiple hook instances', async () => {
    // First hook instance
    const { result: result1 } = renderHook(() => useAutomations());
    
    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
    });

    const firstActions = result1.current.actions;
    expect(firstActions).toHaveLength(5);

    // Second hook instance should get cached data
    const { result: result2 } = renderHook(() => useAutomations());
    
    // Should have data immediately from cache
    await waitFor(() => {
      expect(result2.current.loading).toBe(false);
    });

    expect(result2.current.actions).toEqual(firstActions);
  });
});
