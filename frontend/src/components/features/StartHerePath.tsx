import { useNavigate } from 'react-router-dom';
import { usePathProgressStore } from '../../store/pathProgressStore';
import {
  getNextIncompleteStep,
  getPathProgress,
  START_HERE_STEPS,
  type StartHereStep,
} from '../../utils/startHerePath';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';

interface StartHerePathProps {
  firstName: string;
}

function stepLink(step: StartHereStep): string {
  if (step.groupSlug) {
    const params = new URLSearchParams({ category: step.groupSlug });
    if (step.conceptSlug) params.set('concept', step.conceptSlug);
    return `${step.route}?${params.toString()}`;
  }
  return step.route;
}

export default function StartHerePath({ firstName }: StartHerePathProps) {
  const navigate = useNavigate();
  const completedStepIds = usePathProgressStore((s) => s.completedStepIds);
  const toggleStep = usePathProgressStore((s) => s.toggleStep);
  const { completed, total, percent } = getPathProgress(completedStepIds);
  const nextStep = getNextIncompleteStep(completedStepIds);

  const goToStep = (step: StartHereStep) => {
    navigate(stepLink(step));
  };

  return (
    <Card className="border-secondary/25 bg-gradient-to-br from-card to-secondary-soft/20">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-secondary-dark mb-1">
            Start here
          </p>
          <h2 className="text-lg font-medium text-ink">
            {firstName ? `${firstName}'s 12-step path` : 'Your 12-step path'}
          </h2>
          <p className="text-sm text-secondary-text mt-1">
            A guided journey — not 159 cards at once. Check off steps as you go.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold text-primary">{percent}%</p>
          <p className="text-xs text-muted">
            {completed} of {total} done
          </p>
        </div>
      </div>

      {nextStep && (
        <div className="mb-5 p-4 rounded-lg bg-secondary-soft/70 border border-secondary/25">
          <p className="text-xs font-medium text-primary mb-1">Up next · Step {nextStep.order}</p>
          <p className="font-medium text-ink text-sm">{nextStep.title}</p>
          <p className="text-xs text-secondary-text mt-1 mb-3">{nextStep.description}</p>
          <Button onClick={() => goToStep(nextStep)} className="gap-2">
            Continue
            <Icon name="arrow-right" size="sm" />
          </Button>
        </div>
      )}

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {START_HERE_STEPS.map((step) => {
          const done = completedStepIds.includes(step.id);
          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                done
                  ? 'bg-secondary-soft/50 border-secondary/20'
                  : 'bg-bg border-border hover-row'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  done
                    ? 'bg-primary border-primary text-white'
                    : 'border-border bg-sunken hover:border-primary'
                }`}
                aria-label={done ? `Mark step ${step.order} incomplete` : `Mark step ${step.order} complete`}
              >
                {done && <span className="text-xs leading-none">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">
                  <span className="text-muted font-normal mr-1.5">{step.order}.</span>
                  {step.title}
                </p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{step.description}</p>
              </div>
              <button
                type="button"
                onClick={() => goToStep(step)}
                className="text-xs text-primary shrink-0 mt-0.5 px-2 py-1 rounded-pill hover-link-pill border border-transparent"
              >
                Go
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
