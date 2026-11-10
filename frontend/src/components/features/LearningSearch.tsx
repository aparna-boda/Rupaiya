import { useMemo, useState } from 'react';
import type { Concept, Investment, Term } from '../../types/knowledge';
import { searchTerms } from '../../utils/glossary';
import Input from '../ui/Input';
import ConceptCard from './ConceptCard';
import TermCard from './TermCard';

interface LearningSearchProps {
  concepts: Concept[];
  investments: Investment[];
  terms?: Term[];
  onClear?: () => void;
}

export default function LearningSearch({
  concepts,
  investments,
  terms = [],
  onClear,
}: LearningSearchProps) {
  const [query, setQuery] = useState('');

  const conceptResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return concepts.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [concepts, query]);

  const termResults = useMemo(() => searchTerms(terms, query), [terms, query]);

  const totalResults = conceptResults.length + termResults.length;

  return (
    <div className="mb-5">
      <Input
        label="Search learning"
        subtext="Concepts + terminology — e.g. demat, NAV, XIRR, SIP, F&O"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${concepts.length} concepts & ${terms.length} terms...`}
      />

      {query.trim().length >= 2 && (
        <div className="mt-4">
          <p className="text-xs text-muted mb-3">
            {totalResults} result{totalResults === 1 ? '' : 's'} for &ldquo;{query.trim()}&rdquo;
            {onClear && (
              <button type="button" onClick={() => { setQuery(''); onClear(); }} className="ml-2 text-primary hover:underline">
                Clear
              </button>
            )}
          </p>

          {termResults.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
                Terms ({termResults.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {termResults.slice(0, 8).map((term) => (
                  <TermCard key={term.id} term={term} compact />
                ))}
              </div>
            </div>
          )}

          {conceptResults.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
                Lessons ({conceptResults.length})
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {conceptResults.slice(0, 12).map((concept, index) => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    investments={investments}
                    index={index + 1}
                    isActive
                  />
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <p className="text-sm text-muted">No matches — try the glossary below or browse categories.</p>
          )}
        </div>
      )}
    </div>
  );
}
