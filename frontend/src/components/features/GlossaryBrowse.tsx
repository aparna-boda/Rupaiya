import { useMemo, useState } from 'react';
import type { Term, TermCategory } from '../../types/knowledge';
import {
  TERM_CATEGORY_LABELS,
  groupTermsByCategory,
  searchTerms,
} from '../../utils/glossary';
import Input from '../ui/Input';
import TermCard from './TermCard';

interface GlossaryBrowseProps {
  terms: Term[];
  intro?: { title: string; description: string };
}

const CATEGORY_ORDER: TermCategory[] = [
  'mutual-funds',
  'stocks-trading',
  'metrics',
  'market-mechanics',
  'tax',
  'debt-insurance',
];

export default function GlossaryBrowse({ terms, intro }: GlossaryBrowseProps) {
  const [query, setQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<TermCategory | 'all'>('all');

  const grouped = useMemo(() => groupTermsByCategory(terms), [terms]);
  const searchResults = useMemo(() => searchTerms(terms, query), [terms, query]);
  const isSearching = query.trim().length >= 2;

  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-ink mb-1">
          {intro?.title ?? 'Terminology'}
        </h2>
        <p className="text-sm text-secondary-text leading-relaxed">
          {intro?.description ??
            'Plain definitions for jargon you hear in apps, news, and conversations.'}
        </p>
        <p className="text-xs text-muted mt-2">{terms.length} terms · search or browse by topic</p>
      </div>

      <Input
        label="Search terms"
        subtext="Try NAV, XIRR, demat, STCG, F&O, SIP..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${terms.length} terms...`}
      />

      {isSearching ? (
        <div className="mt-4">
          <p className="text-xs text-muted mb-3">
            {searchResults.length} match{searchResults.length === 1 ? '' : 'es'} for &ldquo;
            {query.trim()}&rdquo;
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.slice(0, 24).map((term) => (
                <TermCard key={term.id} term={term} compact />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No terms found — try a shorter word or browse categories below.</p>
          )}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setExpandedCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-pill border ${
              expandedCategory === 'all'
                ? 'bg-primary text-white border-primary'
                : 'bg-sunken border-border text-secondary-text hover-choice'
            }`}
          >
            All
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const count = grouped.get(cat)?.length ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setExpandedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-pill border ${
                  expandedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-sunken border-border text-secondary-text hover-choice'
                }`}
              >
                {TERM_CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      )}

      {!isSearching && (
        <div className="space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            if (expandedCategory !== 'all' && expandedCategory !== cat) return null;
            const catTerms = grouped.get(cat);
            if (!catTerms?.length) return null;
            return (
              <div key={cat}>
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted mb-3">
                  {TERM_CATEGORY_LABELS[cat]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {catTerms.map((term) => (
                    <TermCard key={term.id} term={term} compact />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
