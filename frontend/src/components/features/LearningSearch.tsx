import { useMemo, useState } from 'react';
import type { Concept } from '../../types/knowledge';
import Input from '../ui/Input';
import ConceptCard from './ConceptCard';
import type { Investment } from '../../types/knowledge';

interface LearningSearchProps {
  concepts: Concept[];
  investments: Investment[];
  onClear?: () => void;
}

export default function LearningSearch({ concepts, investments, onClear }: LearningSearchProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return concepts.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [concepts, query]);

  return (
    <div className="mb-5">
      <Input
        label="Search concepts"
        subtext="Title or keyword — e.g. demat, SIP, PPF, tax"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search 159 concepts..."
      />

      {query.trim().length >= 2 && (
        <div className="mt-4">
          <p className="text-xs text-muted mb-3">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query.trim()}&rdquo;
            {onClear && (
              <button type="button" onClick={() => { setQuery(''); onClear(); }} className="ml-2 text-primary hover:underline">
                Clear
              </button>
            )}
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {results.slice(0, 20).map((concept, index) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  investments={investments}
                  index={index + 1}
                  isActive
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No matches — try a shorter word or browse categories below.</p>
          )}
        </div>
      )}
    </div>
  );
}
