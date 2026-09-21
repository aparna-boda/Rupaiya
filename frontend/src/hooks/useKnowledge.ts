import { useCallback, useEffect, useState } from 'react';
import { fetchAdminKnowledge, fetchKnowledge } from '../api/client';
import type { KnowledgeSnapshot } from '../types/knowledge';
import {
  isCacheStale,
  readKnowledgeCache,
  writeKnowledgeCache,
} from '../utils/knowledgeCache';

interface UseKnowledgeResult {
  data: KnowledgeSnapshot | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useKnowledge(): UseKnowledgeResult {
  const [data, setData] = useState<KnowledgeSnapshot | null>(() => readKnowledgeCache()?.data ?? null);
  const [loading, setLoading] = useState(!readKnowledgeCache());
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const cached = readKnowledgeCache();
    if (!cached) setLoading(true);
    setError(null);

    try {
      const snapshot = await fetchKnowledge();
      writeKnowledgeCache(snapshot);
      setData(snapshot);
    } catch {
      if (cached && !isCacheStale(cached)) {
        setData(cached.data);
        setError(null);
      } else if (cached) {
        setData(cached.data);
        setError('Showing saved content — could not refresh.');
      } else {
        setError('Could not load content. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useAdminKnowledge() {
  const [data, setData] = useState<KnowledgeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await fetchAdminKnowledge();
      setData(snapshot);
    } catch {
      setError('Could not load admin content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
