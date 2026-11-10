import type { Term, TermCategory, TermTrack } from '../types/knowledge';

export const TERM_CATEGORY_LABELS: Record<TermCategory, string> = {
  'mutual-funds': 'Mutual funds',
  'stocks-trading': 'Stocks & trading',
  metrics: 'Returns & metrics',
  'market-mechanics': 'Market & brokers',
  tax: 'Tax',
  'debt-insurance': 'Debt & insurance',
};

export const TERM_TRACK_LABELS: Record<TermTrack, string> = {
  core: 'Core',
  investor: 'Investor',
  trader: 'Trading',
};

export function groupTermsByCategory(terms: Term[]): Map<TermCategory, Term[]> {
  const map = new Map<TermCategory, Term[]>();
  for (const term of [...terms].sort((a, b) => a.sortOrder - b.sortOrder)) {
    const list = map.get(term.category) ?? [];
    list.push(term);
    map.set(term.category, list);
  }
  return map;
}

export function searchTerms(terms: Term[], query: string): Term[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return terms.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.shortDefinition.toLowerCase().includes(q) ||
      t.aliases.some((a) => a.toLowerCase().includes(q)) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
