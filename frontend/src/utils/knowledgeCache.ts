import type { KnowledgeSnapshot } from '../types/knowledge';

const CACHE_KEY = 'rupaiya_knowledge_cache';

interface CachedKnowledge {
  version: string;
  data: KnowledgeSnapshot;
  fetchedAt: number;
}

export function readKnowledgeCache(): CachedKnowledge | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedKnowledge;
  } catch {
    return null;
  }
}

export function writeKnowledgeCache(data: KnowledgeSnapshot): void {
  try {
    const payload: CachedKnowledge = {
      version: data.meta.version,
      data,
      fetchedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // quota or private mode — ignore
  }
}

export function isCacheStale(cached: CachedKnowledge, maxAgeMs = 1000 * 60 * 60 * 24): boolean {
  return Date.now() - cached.fetchedAt > maxAgeMs;
}
