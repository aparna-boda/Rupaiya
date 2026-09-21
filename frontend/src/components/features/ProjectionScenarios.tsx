import { useMemo } from 'react';
import type { UserProfile } from '../../types/profile';
import { calculateSip } from '../../utils/calculator';
import { formatINR } from '../../utils/formatters';
import {
  getDefaultScenarioId,
  PROJECTION_DISCLAIMER,
  PROJECTION_SCENARIOS,
} from '../../utils/projections';

interface ProjectionScenariosProps {
  monthly: number;
  years: number;
  riskAppetite: UserProfile['riskAppetite'];
  compact?: boolean;
}

export default function ProjectionScenarios({
  monthly,
  years,
  riskAppetite,
  compact = false,
}: ProjectionScenariosProps) {
  const defaultId = getDefaultScenarioId(riskAppetite);

  const scenarios = useMemo(
    () =>
      PROJECTION_SCENARIOS.map((scenario) => ({
        ...scenario,
        result: calculateSip(monthly, scenario.rate, years),
        isDefault: scenario.id === defaultId,
      })),
    [monthly, years, defaultId]
  );

  const defaultScenario = scenarios.find((s) => s.isDefault) ?? scenarios[1];

  if (compact) {
    return (
      <div>
        <p
          className="font-bold text-primary leading-none mb-2"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1.5px' }}
        >
          {formatINR(defaultScenario.result.totalValue)}
        </p>
        <p className="text-sm text-secondary-text mb-4">
          {defaultScenario.label} scenario · {defaultScenario.rate}% · {years} years
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className={`rounded-lg px-2 py-2 text-center border ${
                s.isDefault
                  ? 'bg-secondary-soft/60 border-secondary/35'
                  : 'bg-sunken/60 border-transparent'
              }`}
            >
              <p className="text-[10px] text-muted uppercase tracking-wide">{s.label}</p>
              <p className="text-xs font-semibold text-ink mt-0.5">{formatINR(s.result.totalValue)}</p>
              <p className="text-[10px] text-muted">{s.rate}%</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted leading-relaxed">{PROJECTION_DISCLAIMER}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((s) => (
          <div
            key={s.id}
            className={`rounded-lg p-4 border transition-colors ${
              s.isDefault
                ? 'bg-secondary-soft/60 border-secondary/35 ring-1 ring-secondary/25'
                : 'bg-sunken/50 border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-medium text-ink">{s.label}</p>
              {s.isDefault && (
                <span className="text-[10px] px-2 py-0.5 bg-primary text-white rounded-pill">
                  Your profile
                </span>
              )}
            </div>
            <p className="text-xl font-bold text-primary">{formatINR(s.result.totalValue)}</p>
            <p className="text-[11px] text-muted mt-1">{s.rate}% · {s.hint}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted leading-relaxed">{PROJECTION_DISCLAIMER}</p>
    </div>
  );
}
