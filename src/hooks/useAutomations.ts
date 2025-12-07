import { useState, useEffect, useCallback } from 'react';
import { AutomatedAction } from '../types/api';
import { getAutomations } from '../services/api';

interface UseAutomationsResult {
  actions: AutomatedAction[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and cache automated actions from the API
 * Handles loading, error, and success states with retry functionality
 * 
 * @returns {UseAutomationsResult} Object containing actions, loading state, error, and refetch function
 */
export function useAutomations(): UseAutomationsResult {
  const [actions, setActions] = useState<AutomatedAction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchAutomations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAutomations();
      setActions(data);
      setHasFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch automations'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch automations on mount only if not already fetched (caching)
  useEffect(() => {
    if (!hasFetched) {
      fetchAutomations();
    }
  }, [hasFetched, fetchAutomations]);

  return {
    actions,
    loading,
    error,
    refetch: fetchAutomations
  };
}
