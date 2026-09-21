import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EMERGENCY_FUND_OPTIONS,
  EXISTING_INVESTMENTS_OPTIONS,
  ONBOARDING_STEPS,
  PRIMARY_GOAL_OPTIONS,
} from '../constants/copy';
import { useProfile } from '../hooks/useProfile';
import { RISK_LABELS } from '../utils/learningPath';
import type {
  EmergencyFundStatus,
  ExistingInvestments,
  PrimaryGoal,
  UserProfile,
} from '../types/profile';
import { formatINR } from '../utils/formatters';
import { calculateSip } from '../utils/calculator';
import { getDefaultRateForRisk } from '../utils/projections';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ProjectionDisclaimer from '../components/ui/ProjectionDisclaimer';
import ProjectionScenarios from '../components/features/ProjectionScenarios';
import PageWrapper from '../components/layout/PageWrapper';
import BrandHero from '../components/brand/BrandHero';

const RISK_OPTIONS: { value: UserProfile['riskAppetite']; hint: string }[] = [
  { value: 'safe', hint: 'FDs, PPF, capital safety first' },
  { value: 'low', hint: 'Mostly safe with a little equity' },
  { value: 'medium', hint: 'Balanced mix of equity and debt' },
  { value: 'high', hint: 'Comfortable with volatility' },
];

const TOTAL_STEPS = ONBOARDING_STEPS.length + 3; // + risk + preview + context

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; hint: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink mb-2">{label}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full text-left p-3 rounded-lg border ${
              value === option.value
                ? 'bg-primary-soft border-primary'
                : 'bg-sunken border-border hover-choice'
            }`}
          >
            <p className="text-sm font-medium text-ink">{option.label}</p>
            <p className="text-xs text-muted mt-0.5">{option.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [riskAppetite, setRiskAppetite] = useState<UserProfile['riskAppetite']>('safe');
  const [emergencyFundStatus, setEmergencyFundStatus] =
    useState<EmergencyFundStatus>('none');
  const [existingInvestments, setExistingInvestments] =
    useState<ExistingInvestments>('none');
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>('retirement');
  const [hasDependents, setHasDependents] = useState(false);

  const isRiskStep = step === ONBOARDING_STEPS.length;
  const isPreviewStep = step === ONBOARDING_STEPS.length + 1;
  const isContextStep = step === ONBOARDING_STEPS.length + 2;
  const current = !isRiskStep && !isPreviewStep && !isContextStep ? ONBOARDING_STEPS[step] : null;

  const getValue = (): string => {
    if (!current) return '';
    switch (current.field) {
      case 'name':
        return name;
      case 'age':
        return age;
      case 'monthlyIncome':
        return monthlyIncome;
      case 'monthlyInvestment':
        return monthlyInvestment;
    }
  };

  const setValue = (val: string) => {
    if (!current) return;
    switch (current.field) {
      case 'name':
        setName(val);
        break;
      case 'age':
        setAge(val);
        break;
      case 'monthlyIncome':
        setMonthlyIncome(val);
        break;
      case 'monthlyInvestment':
        setMonthlyInvestment(val);
        break;
    }
  };

  const isValid = () => {
    if (isContextStep || isPreviewStep || isRiskStep) return name.trim().length >= 2;
    if (!current) return false;
    if (current.field === 'name') return name.trim().length >= 2;
    const val = Number(getValue());
    if (current.field === 'age') return val >= 18 && val <= 80;
    if (current.field === 'monthlyIncome') return val >= 1000;
    return val >= 500;
  };

  const finish = () => {
    completeOnboarding({
      name: name.trim(),
      age: Number(age),
      monthlyIncome: Number(monthlyIncome),
      monthlyInvestment: Number(monthlyInvestment),
      riskAppetite,
      emergencyFundStatus,
      existingInvestments,
      primaryGoal,
      hasDependents,
    });
    navigate('/home');
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const firstName = name.trim().split(/\s+/)[0];
  const previewYears = Math.max(60 - Number(age || 35), 1);
  const previewMonthly = Number(monthlyInvestment) || 0;
  const defaultRate = getDefaultRateForRisk(riskAppetite);
  const previewResult =
    previewMonthly >= 500
      ? calculateSip(previewMonthly, defaultRate, previewYears)
      : null;

  return (
    <PageWrapper showNav={false} narrow title="Welcome">
      <div className="flex flex-col min-h-[60vh] pt-4">
        <BrandHero compact />

        <div className="flex-1">
          {isPreviewStep ? (
            <div>
              <h2 className="text-lg font-medium text-ink mb-1">
                {firstName ? `${firstName}, here's your number` : "Here's your number"}
              </h2>
              <p className="text-sm text-muted mb-5">
                Illustrative only — based on {formatINR(previewMonthly)}/month until age 60.
              </p>
              {previewMonthly >= 500 ? (
                <>
                  <ProjectionScenarios
                    monthly={previewMonthly}
                    years={previewYears}
                    riskAppetite={riskAppetite}
                    compact
                  />
                  {previewResult && (
                    <p className="text-sm text-secondary-text mt-4">
                      Your profile scenario ({defaultRate}%):{' '}
                      <span className="font-semibold text-primary">
                        {formatINR(previewResult.totalValue)}
                      </span>{' '}
                      by age 60
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-secondary-text">
                  Enter a monthly investment amount on the previous steps to see projections.
                </p>
              )}
              <ProjectionDisclaimer className="mt-4" />
            </div>
          ) : isContextStep ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-medium text-ink mb-1">
                  {firstName ? `${firstName}, a bit more context` : 'A bit more context'}
                </h2>
                <p className="text-sm text-muted mb-4">
                  Helps us personalise your path and AI answers. All optional — defaults are fine.
                </p>
              </div>
              <ChipGroup
                label="Emergency fund"
                options={EMERGENCY_FUND_OPTIONS}
                value={emergencyFundStatus}
                onChange={setEmergencyFundStatus}
              />
              <ChipGroup
                label="Existing investments"
                options={EXISTING_INVESTMENTS_OPTIONS}
                value={existingInvestments}
                onChange={setExistingInvestments}
              />
              <ChipGroup
                label="Primary goal"
                options={PRIMARY_GOAL_OPTIONS}
                value={primaryGoal}
                onChange={setPrimaryGoal}
              />
              <div>
                <p className="text-sm font-medium text-ink mb-2">Financial dependents?</p>
                <div className="flex gap-2">
                  {[
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes — spouse, parents, or kids' },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => setHasDependents(option.value)}
                      className={`flex-1 p-3 rounded-lg border text-sm ${
                        hasDependents === option.value
                          ? 'bg-primary-soft border-primary font-medium text-ink'
                          : 'bg-sunken border-border text-secondary-text hover-choice'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isRiskStep ? (
            <div>
              <h2 className="text-lg font-medium text-ink mb-1">
                {firstName ? `${firstName}, how do you feel about risk?` : 'How do you feel about risk?'}
              </h2>
              <p className="text-sm text-muted mb-5">
                This shapes your learning path and default projection scenario.
              </p>
              <div className="space-y-2">
                {RISK_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRiskAppetite(option.value)}
                    className={`w-full text-left p-4 rounded-lg border ${
                      riskAppetite === option.value
                        ? 'bg-primary-soft border-primary'
                        : 'bg-sunken border-border hover-choice'
                    }`}
                  >
                    <p className="text-sm font-medium text-ink">{RISK_LABELS[option.value]}</p>
                    <p className="text-xs text-muted mt-0.5">{option.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : current ? (
            <Input
              label={current.title}
              subtext={current.subtext}
              prefix={current.prefix || undefined}
              type={current.inputType}
              inputMode={current.inputType === 'number' ? 'numeric' : 'text'}
              value={getValue()}
              onChange={(e) => setValue(e.target.value)}
              placeholder={current.placeholder}
              autoFocus
            />
          ) : null}
        </div>

        <div className="mt-auto pt-8">
          <Button fullWidth onClick={handleNext} disabled={!isValid()}>
            {step < TOTAL_STEPS - 1 ? 'Next' : 'Get started'}
          </Button>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: i === step ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
