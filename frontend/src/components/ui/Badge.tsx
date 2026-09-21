import type { RiskGrade } from '../../types/investment';

interface BadgeProps {
  label: string;
  riskGrade?: RiskGrade;
  variant?: 'default' | 'pill';
}

const RISK_STYLES: Record<RiskGrade, { bg: string; text: string }> = {
  0: { bg: 'var(--color-risk-0-bg)', text: 'var(--color-risk-0-text)' },
  1: { bg: 'var(--color-risk-1-bg)', text: 'var(--color-risk-1-text)' },
  2: { bg: 'var(--color-risk-2-bg)', text: 'var(--color-risk-2-text)' },
  3: { bg: 'var(--color-risk-3-bg)', text: 'var(--color-risk-3-text)' },
  4: { bg: 'var(--color-risk-4-bg)', text: 'var(--color-risk-4-text)' },
};

export default function Badge({ label, riskGrade, variant = 'default' }: BadgeProps) {
  const style =
    riskGrade !== undefined
      ? RISK_STYLES[riskGrade]
      : { bg: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)' };

  const radius = variant === 'pill' ? 'rounded-pill' : 'rounded-sm';

  return (
    <span
      className={`inline-block px-3 py-1 text-[11px] font-medium ${radius}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </span>
  );
}
