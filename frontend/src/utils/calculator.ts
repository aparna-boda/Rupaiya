export interface SipResult {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  multiplier: number;
  yearlyBreakdown: { year: number; value: number; invested: number }[];
}

export function calculateSip(
  monthly: number,
  ratePercent: number,
  years: number
): SipResult {
  const r = ratePercent / 100 / 12;
  const n = years * 12;

  const totalValue =
    r === 0
      ? monthly * n
      : monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const totalInvested = monthly * n;
  const totalGain = totalValue - totalInvested;
  const multiplier = totalInvested > 0 ? totalValue / totalInvested : 0;

  const yearlyBreakdown = [];
  for (let y = 1; y <= years; y++) {
    const nY = y * 12;
    const val =
      r === 0
        ? monthly * nY
        : monthly * (((Math.pow(1 + r, nY) - 1) / r) * (1 + r));
    yearlyBreakdown.push({
      year: y,
      value: Math.round(val),
      invested: monthly * nY,
    });
  }

  return {
    totalValue: Math.round(totalValue),
    totalInvested: Math.round(totalInvested),
    totalGain: Math.round(totalGain),
    multiplier: Math.round(multiplier * 10) / 10,
    yearlyBreakdown,
  };
}
