import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import type { Concept, Investment } from '../../types/knowledge';
import { calculateSip } from '../../utils/calculator';
import { formatINR } from '../../utils/formatters';
import RichTextContent from './RichTextContent';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Icon, IconBadge } from '../ui/Icon';
import { getInvestmentIcon } from '../../utils/icons';
import ProjectionDisclaimer from '../ui/ProjectionDisclaimer';

interface InvestmentCardProps {
  investment: Investment;
  concepts: Concept[];
}

export default function InvestmentCard({ investment, concepts }: InvestmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const yearsToRetirement = Math.max(60 - profile.age, 1);
  const isProtection = investment.riskLabel === 'Protection';
  const projection =
    !isProtection && investment.returnAvg > 0
      ? calculateSip(profile.monthlyInvestment, investment.returnAvg, yearsToRetirement)
      : null;

  const relatedConcepts = concepts.filter((c) =>
    investment.relatedConceptIds.includes(c.slug)
  );

  const handleAsk = () => {
    navigate('/ask', {
      state: { prefilled: `Tell me more about ${investment.name}` },
    });
  };

  return (
    <Card interactive className="mb-3" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <IconBadge name={getInvestmentIcon(investment.slug)} size="md" />
          <div className="min-w-0">
            <h3 className="font-medium text-ink text-[15px]">{investment.name}</h3>
            <p className="text-xs text-muted mt-0.5">{investment.tagline}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge label={investment.riskLabel} riskGrade={investment.riskGrade} variant="pill" />
              <span className="text-xs text-secondary-text">
                {isProtection
                  ? 'Protection — not for returns'
                  : investment.returnAvg > 0
                    ? `${investment.returnMin}–${investment.returnMax}% avg`
                    : 'Highly variable'}
              </span>
            </div>
          </div>
        </div>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size="sm"
          className="text-muted shrink-0 mt-1"
        />
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border/60" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-1 mb-4">
            {[0, 1, 2, 3, 4].map((grade) => (
              <div
                key={grade}
                className="h-2 flex-1 rounded-sm"
                style={{
                  backgroundColor:
                    grade <= investment.riskGrade
                      ? 'var(--color-primary)'
                      : 'var(--color-sunken)',
                }}
              />
            ))}
          </div>

          <RichTextContent html={investment.explanation} className="mb-4" />

          {projection && (
            <div className="bg-secondary-soft/70 rounded-md p-3 mb-4">
              <p className="text-sm text-ink">
                {formatINR(profile.monthlyInvestment)}/month for {yearsToRetirement} years at{' '}
                {investment.returnAvg}% avg →{' '}
                <span className="font-bold text-primary">{formatINR(projection.totalValue)}</span>
              </p>
              <ProjectionDisclaimer className="mt-2" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {investment.highlights.map((highlight) => (
              <span
                key={highlight}
                className="text-[11px] px-3 py-1 bg-sunken rounded-pill text-muted"
              >
                {highlight}
              </span>
            ))}
          </div>

          {relatedConcepts.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted mb-2">Related concepts</p>
              <div className="flex flex-wrap gap-2">
                {relatedConcepts.map((concept) => (
                  <Link
                    key={concept.id}
                    to="/learning"
                    className="text-[11px] px-3 py-1.5 bg-secondary-soft rounded-pill text-secondary-dark border border-transparent hover-link-pill"
                  >
                    {concept.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Button variant="secondary" fullWidth onClick={handleAsk} className="gap-2">
            Ask about this
            <Icon name="arrow-right" size="sm" />
          </Button>
        </div>
      )}
    </Card>
  );
}
