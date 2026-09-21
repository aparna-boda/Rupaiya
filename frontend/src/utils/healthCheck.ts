import type { UserProfile } from '../types/profile';
import { formatINRFull } from './formatters';

export type HealthStatus = 'good' | 'warning' | 'unknown' | 'action';

export interface HealthCheckItem {
  label: string;
  status: HealthStatus;
  message: string;
}

export interface HealthNextAction {
  label: string;
  route: string;
  search?: string;
}

export interface HealthCheckResult {
  items: HealthCheckItem[];
  nextAction: HealthNextAction;
}

const STATUS_ICON: Record<HealthStatus, string> = {
  good: '✓',
  warning: '!',
  unknown: '?',
  action: '→',
};

export function healthStatusIcon(status: HealthStatus): string {
  return STATUS_ICON[status];
}

export function buildHealthCheck(profile: UserProfile): HealthCheckResult {
  const items: HealthCheckItem[] = [];

  if (profile.emergencyFundStatus === 'done') {
    items.push({
      label: 'Emergency fund',
      status: 'good',
      message: '6+ months set aside — solid foundation.',
    });
  } else if (profile.emergencyFundStatus === 'partial') {
    items.push({
      label: 'Emergency fund',
      status: 'warning',
      message: 'Started but not 6 months yet — keep building before risky bets.',
    });
  } else {
    items.push({
      label: 'Emergency fund',
      status: 'action',
      message: 'Not started — priority before scaling investments.',
    });
  }

  if (profile.hasDependents) {
    items.push({
      label: 'Term insurance',
      status: 'action',
      message: 'Dependents rely on your income — pure term cover comes first.',
    });
  } else {
    items.push({
      label: 'Term insurance',
      status: 'unknown',
      message: 'Review when someone depends on your income.',
    });
  }

  const investRatio = profile.monthlyIncome > 0
    ? profile.monthlyInvestment / profile.monthlyIncome
    : 0;

  if (profile.existingInvestments === 'mixed' || profile.existingInvestments === 'mutual-funds') {
    items.push({
      label: 'Investing habit',
      status: 'good',
      message: `${formatINRFull(profile.monthlyInvestment)}/mo — you are already in the game.`,
    });
  } else if (profile.monthlyInvestment >= 5000 && investRatio >= 0.05) {
    items.push({
      label: 'Investing habit',
      status: 'good',
      message: `${formatINRFull(profile.monthlyInvestment)}/mo set aside — strong start.`,
    });
  } else if (profile.monthlyInvestment >= 500) {
    items.push({
      label: 'Investing habit',
      status: 'warning',
      message: `${formatINRFull(profile.monthlyInvestment)}/mo — good start; aim to grow this yearly.`,
    });
  } else {
    items.push({
      label: 'Investing habit',
      status: 'action',
      message: 'Even ₹500/month builds the habit — start small, stay consistent.',
    });
  }

  let nextAction: HealthNextAction;

  if (profile.emergencyFundStatus === 'none') {
    nextAction = {
      label: 'Build your emergency fund',
      route: '/learning',
      search: '?category=saving&concept=emergency-fund',
    };
  } else if (profile.hasDependents) {
    nextAction = {
      label: 'Understand term insurance',
      route: '/learning',
      search: '?category=insurance&concept=term-insurance',
    };
  } else if (profile.existingInvestments === 'none') {
    nextAction = {
      label: 'Explore ways to grow money',
      route: '/grow',
    };
  } else {
    nextAction = {
      label: 'Generate your personalised plan',
      route: '/plan',
    };
  }

  return { items, nextAction };
}
