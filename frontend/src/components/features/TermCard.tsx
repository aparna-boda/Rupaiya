import { Link } from 'react-router-dom';
import type { Term } from '../../types/knowledge';
import { TERM_TRACK_LABELS } from '../../utils/glossary';
import Card from '../ui/Card';

interface TermCardProps {
  term: Term;
  compact?: boolean;
}

export default function TermCard({ term, compact = false }: TermCardProps) {
  const primaryConcept = term.relatedConceptSlugs[0];

  return (
    <Card className={compact ? 'p-3' : ''} padding={compact ? 'sm' : 'md'}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-ink text-base leading-snug">{term.title}</h3>
        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-pill bg-sunken text-muted uppercase tracking-wide">
          {TERM_TRACK_LABELS[term.track]}
        </span>
      </div>
      <p className="text-sm text-ink leading-relaxed mb-2">{term.shortDefinition}</p>
      {!compact && (
        <>
          <p className="text-sm text-secondary-text leading-relaxed mb-2">
            <span className="font-medium text-ink">Why it matters: </span>
            {term.whyItMatters}
          </p>
          {term.example && (
            <p className="text-xs text-muted leading-relaxed mb-3 italic">{term.example}</p>
          )}
        </>
      )}
      {primaryConcept && (
        <Link
          to={`/learning?concept=${primaryConcept}`}
          className="text-xs text-primary border border-transparent hover-link-pill inline-flex px-2 py-1 rounded-pill"
        >
          Read full lesson →
        </Link>
      )}
    </Card>
  );
}
