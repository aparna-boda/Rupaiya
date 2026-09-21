import { calculateSip } from './calculator';
import { formatINR, formatINRFull } from './formatters';
import type { ConceptExampleKey } from '../types/knowledge';

export function getConceptExample(
  key: ConceptExampleKey,
  age: number,
  monthlyInvestment: number,
  monthlyIncome: number
): string {
  const years = Math.max(60 - age, 1);
  const sip12 = calculateSip(monthlyInvestment, 12, years);
  const sip7 = calculateSip(monthlyInvestment, 7, years);
  const sip3 = calculateSip(monthlyInvestment, 3.5, years);

  switch (key) {
    case 'compounding':
      return `If you invest ${formatINR(monthlyInvestment)}/month for ${years} years at 12%, you would invest ${formatINR(sip12.totalInvested)} but end up with ${formatINR(sip12.totalValue)} — that's ${formatINR(sip12.totalGain)} earned purely from compounding.`;
    case 'inflation':
      return `At 6% inflation, ${formatINRFull(monthlyIncome)} today will feel like ${formatINRFull(Math.round(monthlyIncome / Math.pow(1.06, 10)))} in 10 years. Your savings account at 3.5% is actually losing ground.`;
    case 'riskReturn':
      return `Same ${formatINR(monthlyInvestment)}/month for ${years} years: at 3.5% (savings) → ${formatINR(sip3.totalValue)}, at 7% (FD) → ${formatINR(sip7.totalValue)}, at 12% (equity SIP) → ${formatINR(sip12.totalValue)}. Higher return, higher uncertainty.`;
    case 'sip':
      return `Starting a SIP of ${formatINR(monthlyInvestment)}/month today in a Nifty 50 index fund could grow to ${formatINR(sip12.totalValue)} by age 60 — without you ever trying to time the market.`;
    case 'diversification': {
      const equity = Math.round(monthlyInvestment * 0.5);
      const fd = Math.round(monthlyInvestment * 0.3);
      const gold = monthlyInvestment - equity - fd;
      return `Instead of putting all ${formatINR(monthlyInvestment)} in one place, you might split it — say ${formatINR(equity)} in equity, ${formatINR(fd)} in FD, ${formatINR(gold)} in gold. If one part dips, the others can steady you.`;
    }
    case 'default':
      // Most concepts teach ideas, not products — skip the generic SIP pitch.
      return '';
    default:
      return '';
  }
}
