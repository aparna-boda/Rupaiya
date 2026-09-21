import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EMERGENCY_FUND_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from '../../constants/copy';
import { useProfile } from '../../hooks/useProfile';
import { RISK_LABELS } from '../../utils/learningPath';
import { recommendFromQuiz, type QuizAnswers } from '../../utils/learningQuiz';
import type { UserProfile } from '../../types/profile';
import Card from '../ui/Card';
import Button from '../ui/Button';

const RISK_OPTIONS: UserProfile['riskAppetite'][] = ['safe', 'low', 'medium', 'high'];

export default function ConfusedQuiz() {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    emergencyFund: profile.emergencyFundStatus,
    riskAppetite: profile.riskAppetite,
    primaryGoal: profile.primaryGoal,
  });
  const [result, setResult] = useState<ReturnType<typeof recommendFromQuiz> | null>(null);

  const reset = () => {
    setStep(0);
    setResult(null);
    setAnswers({
      emergencyFund: profile.emergencyFundStatus,
      riskAppetite: profile.riskAppetite,
      primaryGoal: profile.primaryGoal,
    });
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const finish = (final: QuizAnswers) => {
    const rec = recommendFromQuiz(final);
    setResult(rec);
    updateProfile(rec.profileUpdates);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left p-4 rounded-lg border border-dashed border-[var(--color-hover-border)] bg-[var(--color-hover-bg)]/40 hover-choice mb-5"
      >
        <p className="text-sm font-medium text-primary-dark">I don&apos;t know where to start</p>
        <p className="text-xs text-secondary-text mt-1">
          3 quick questions → a recommended path for you
        </p>
      </button>
    );
  }

  return (
    <Card className="mb-5 border-primary/25">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Quick quiz</p>
          <h3 className="text-base font-medium text-ink mt-1">
            {result ? 'Your recommended path' : `Question ${step + 1} of 3`}
          </h3>
        </div>
        <button type="button" onClick={handleClose} className="text-xs text-muted hover:text-ink">
          Close
        </button>
      </div>

      {result ? (
        <div>
          <p className="font-medium text-ink text-sm">{result.title}</p>
          <p className="text-sm text-secondary-text mt-2 leading-relaxed">{result.description}</p>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => navigate(result.route)} className="flex-1">
              Go there
            </Button>
            <Button variant="ghost" onClick={reset} className="flex-1">
              Retake
            </Button>
          </div>
        </div>
      ) : step === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-secondary-text mb-2">Do you have an emergency fund?</p>
          {EMERGENCY_FUND_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                const next = { ...answers, emergencyFund: o.value };
                setAnswers(next);
                setStep(1);
              }}
              className="w-full text-left p-3 rounded-lg border border-border bg-sunken hover-choice"
            >
              <p className="text-sm font-medium text-ink">{o.label}</p>
              <p className="text-xs text-muted">{o.hint}</p>
            </button>
          ))}
        </div>
      ) : step === 1 ? (
        <div className="space-y-2">
          <p className="text-sm text-secondary-text mb-2">How do you feel about risk?</p>
          {RISK_OPTIONS.map((risk) => (
            <button
              key={risk}
              type="button"
              onClick={() => {
                const next = { ...answers, riskAppetite: risk };
                setAnswers(next);
                setStep(2);
              }}
              className="w-full text-left p-3 rounded-lg border border-border bg-sunken hover-choice"
            >
              <p className="text-sm font-medium text-ink">{RISK_LABELS[risk]}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-secondary-text mb-2">What is your main money goal?</p>
          {PRIMARY_GOAL_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => finish({ ...answers, primaryGoal: o.value })}
              className="w-full text-left p-3 rounded-lg border border-border bg-sunken hover-choice"
            >
              <p className="text-sm font-medium text-ink">{o.label}</p>
              <p className="text-xs text-muted">{o.hint}</p>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
