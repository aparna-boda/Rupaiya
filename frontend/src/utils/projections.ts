import type { UserProfile } from '../types/profile';

export interface ProjectionScenario {
  id: 'safe' | 'balanced' | 'growth';
  label: string;
  rate: number;
  hint: string;
}

export const PROJECTION_SCENARIOS: ProjectionScenario[] = [
  { id: 'safe', label: 'Conservative', rate: 7, hint: 'FD / debt-heavy mix' },
  { id: 'balanced', label: 'Balanced', rate: 10, hint: 'Debt + equity blend' },
  { id: 'growth', label: 'Growth', rate: 12, hint: 'Equity SIP — historical avg' },
];

export function getDefaultScenarioId(
  risk: UserProfile['riskAppetite']
): ProjectionScenario['id'] {
  switch (risk) {
    case 'safe':
    case 'low':
      return 'safe';
    case 'medium':
      return 'balanced';
    case 'high':
      return 'growth';
  }
}

export function getDefaultRateForRisk(risk: UserProfile['riskAppetite']): number {
  const id = getDefaultScenarioId(risk);
  return PROJECTION_SCENARIOS.find((s) => s.id === id)?.rate ?? 10;
}

export function getScenarioById(id: ProjectionScenario['id']): ProjectionScenario {
  return PROJECTION_SCENARIOS.find((s) => s.id === id) ?? PROJECTION_SCENARIOS[1];
}

export const PROJECTION_DISCLAIMER =
  'Illustrative only — based on historical averages, not guaranteed. Past returns do not predict future results.';
