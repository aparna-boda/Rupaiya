import { useEffect, useMemo, useState } from 'react';
import { usePathProgressStore } from '../store/pathProgressStore';
import { Link } from 'react-router-dom';
import { generatePlan } from '../api/client';
import {
  PLAN_PHASE_LABELS,
  PLAN_PHASE_ORDER,
  type PlanPhase,
  type PlanStep,
} from '../types/chat';
import { useProfile } from '../hooks/useProfile';
import { formatINRFull, getFirstName } from '../utils/formatters';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function groupByPhase(steps: PlanStep[]): Map<PlanPhase, PlanStep[]> {
  const map = new Map<PlanPhase, PlanStep[]>();
  for (const phase of PLAN_PHASE_ORDER) map.set(phase, []);
  for (const step of steps) {
    const list = map.get(step.phase) ?? [];
    list.push(step);
    map.set(step.phase, list);
  }
  return map;
}

export default function MyPlan() {
  const { profile } = useProfile();
  const [steps, setSteps] = useState<PlanStep[]>([]);
  const [allocationNote, setAllocationNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const investTotal = useMemo(
    () =>
      steps
        .filter((s) => s.phase === 'invest' || s.phase === 'tax')
        .reduce((sum, s) => sum + s.amount, 0),
    [steps]
  );

  const allocationPercent = profile.monthlyInvestment > 0
    ? Math.round((investTotal / profile.monthlyInvestment) * 100)
    : 0;

  const grouped = useMemo(() => groupByPhase(steps), [steps]);
  const markStepComplete = usePathProgressStore((s) => s.markStepComplete);

  useEffect(() => {
    markStepComplete('my-plan');
  }, [markStepComplete]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePlan(profile);
      setSteps(result.steps);
      setAllocationNote(result.allocationNote ?? '');
    } catch {
      setError('Could not build your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="My Plan">
      <div className="max-w-3xl">
        <PageHeader
          title={
            getFirstName(profile.name)
              ? `${getFirstName(profile.name)}'s plan`
              : 'Your plan, built for you'
          }
          description={`Age ${profile.age} · ${formatINRFull(profile.monthlyIncome)}/month income · ${formatINRFull(profile.monthlyInvestment)}/month to invest`}
        />

        {steps.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-sm text-secondary-text mb-2">
              Structured in 4 phases: Protect → Save → Invest → Optimise tax
            </p>
            <p className="text-sm text-muted mb-6">
              Each step links to a concept and shows ₹ allocation that sums to your monthly capacity.
            </p>
            <Button onClick={handleGenerate} fullWidth>
              Generate my plan
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-sm text-muted">Building your plan...</p>
          </div>
        )}

        {error && (
          <p className="text-sm text-center py-4 mb-4" style={{ color: 'var(--color-risk-3-text)' }}>
            {error}
          </p>
        )}

        {steps.length > 0 && (
          <>
            <Card className="mb-5 border-border bg-secondary-soft/40">
              <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
                Monthly allocation
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-2xl font-bold text-primary">{formatINRFull(investTotal)}</p>
                <p className="text-sm text-muted">
                  of {formatINRFull(profile.monthlyInvestment)}/mo ({allocationPercent}%)
                </p>
              </div>
              <div className="h-2 bg-sunken rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(allocationPercent, 100)}%` }}
                />
              </div>
              {allocationNote && (
                <p className="text-sm text-secondary-text mt-3 leading-relaxed">{allocationNote}</p>
              )}
              {(profile.riskAppetite === 'safe' || profile.riskAppetite === 'low') && (
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Safe profiles rarely go 100% equity — debt, PPF, and emergency buffers come first.
                </p>
              )}
            </Card>

            {PLAN_PHASE_ORDER.map((phase) => {
              const phaseSteps = grouped.get(phase) ?? [];
              if (phaseSteps.length === 0) return null;
              return (
                <div key={phase} className="mb-6">
                  <h2 className="text-sm font-medium uppercase tracking-wider text-muted mb-3">
                    {PLAN_PHASE_LABELS[phase]}
                  </h2>
                  {phaseSteps.map((step, index) => (
                    <Card
                      key={`${phase}-${step.order}`}
                      className="mb-3"
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? 'var(--color-card)'
                            : 'var(--color-secondary-soft)',
                      }}
                    >
                      <div className="flex gap-3">
                        <span
                          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                          }}
                        >
                          {step.order}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-medium text-ink text-[15px]">{step.title}</h3>
                          <p className="text-sm text-secondary-text mt-1">{step.action}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {step.amount > 0 && (
                              <span className="text-[11px] px-3 py-1 bg-bg/60 rounded-pill text-muted">
                                {formatINRFull(step.amount)}/month
                              </span>
                            )}
                            <span className="text-[11px] px-3 py-1 bg-bg/60 rounded-pill text-muted">
                              {step.instrument}
                            </span>
                            {step.conceptSlug && (
                              <Link
                                to={`/learning?concept=${step.conceptSlug}`}
                                className="text-[11px] px-3 py-1 bg-bg/60 rounded-pill text-primary border border-transparent hover-link-pill"
                              >
                                Learn: {step.conceptSlug.replace(/-/g, ' ')}
                              </Link>
                            )}
                          </div>
                          <p className="text-sm text-secondary-text mt-3 leading-relaxed">{step.why}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </>
        )}

        {steps.length > 0 && (
          <Button
            variant="ghost"
            fullWidth
            onClick={handleGenerate}
            disabled={loading}
            className="mt-2 mb-4"
          >
            Regenerate plan
          </Button>
        )}

        <p className="text-sm text-muted leading-relaxed mt-6">
          Illustrative only. Not SEBI-registered advice.
        </p>
      </div>
    </PageWrapper>
  );
}
