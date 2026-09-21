import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { getConceptExample } from '../../utils/examples';
import { getConceptAction } from '../../utils/conceptActions';
import { getConceptTrustNote } from '../../utils/conceptTrustNotes';
import type { Concept, Investment } from '../../types/knowledge';
import RichTextContent from './RichTextContent';
import FlipCard from '../ui/FlipCard';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';
import { getInvestmentIcon } from '../../utils/icons';

interface ConceptCardProps {
  concept: Concept;
  investments: Investment[];
  index?: number;
  isActive?: boolean;
}

export default function ConceptCard({
  concept,
  investments,
  index,
  isActive = true,
}: ConceptCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isActive) setFlipped(false);
  }, [isActive]);

  const example = getConceptExample(
    concept.exampleKey,
    profile.age,
    profile.monthlyInvestment,
    profile.monthlyIncome
  );

  const action = getConceptAction(concept.slug, concept.groupSlug);
  const trustNote = getConceptTrustNote(concept.slug, concept.groupSlug);
  const relatedInvestments = investments.filter((i) =>
    concept.relatedInvestmentIds.includes(i.slug)
  );
  const actionInvestment = action.investmentSlug
    ? investments.find((i) => i.slug === action.investmentSlug)
    : undefined;
  const displayInvestments = actionInvestment
    ? [actionInvestment, ...relatedInvestments.filter((i) => i.slug !== actionInvestment.slug)]
    : relatedInvestments;

  const askPrompt = action.askPrompt ?? `Explain ${concept.title} for my situation`;

  return (
    <FlipCard
      flipped={flipped}
      onFlip={() => setFlipped(!flipped)}
      front={
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-3">
              {index !== undefined && (
                <span className="concept-index-badge shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary-soft text-primary-dark text-sm font-medium">
                  {index}
                </span>
              )}
              <div className="min-w-0">
                <h3 className="font-medium text-ink text-[16px] leading-snug">{concept.title}</h3>
                <p className="text-sm text-secondary-dark mt-2 leading-relaxed">{concept.tagline}</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted mt-4 flex items-center gap-1.5">
            <Icon name="rotate" size="xs" className="text-primary" />
            Tap anywhere to turn
          </p>
        </div>
      }
      back={
        <div className="h-full flex flex-col justify-between">
          <div className="min-h-0 overflow-y-auto">
            <RichTextContent html={concept.explanation} className="mb-3 text-[13px] leading-relaxed" />
            {trustNote && (
              <p className="text-[11px] text-muted italic mb-3 leading-relaxed border-l-2 border-secondary/40 pl-2">
                {trustNote}
              </p>
            )}
            {example && (
              <div className="bg-secondary-soft rounded-md p-3 mb-3">
                <p className="text-xs text-muted mb-1">Your numbers</p>
                <p className="text-sm text-ink leading-relaxed">{example}</p>
              </div>
            )}

            <div className="bg-secondary-soft/70 rounded-md p-3 mb-3 border border-secondary/20">
              <p className="text-xs font-medium text-primary-dark mb-1">Do this next</p>
              <p className="text-sm text-ink leading-relaxed">{action.doThisNext}</p>
            </div>

            {displayInvestments.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted mb-2">Related instruments</p>
                <div className="flex flex-wrap gap-2">
                  {displayInvestments.map((inv) => (
                    <Link
                      key={inv.id}
                      to="/grow"
                      onPointerDown={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 bg-sunken rounded-pill text-secondary-text border border-transparent hover-link-pill"
                    >
                      <Icon name={getInvestmentIcon(inv.slug)} size="xs" className="shrink-0" />
                      {inv.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="secondary"
              fullWidth
              className="gap-2 text-sm py-2"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/ask', { state: { prefilled: askPrompt } });
              }}
            >
              Ask about this
              <Icon name="arrow-right" size="sm" />
            </Button>
          </div>
          <p className="text-[11px] text-muted mt-3 shrink-0 flex items-center gap-1.5">
            <Icon name="rotate" size="xs" className="text-primary" />
            Tap anywhere to turn back
          </p>
        </div>
      }
    />
  );
}
