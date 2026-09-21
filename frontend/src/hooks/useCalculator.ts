import { useMemo } from 'react';
import { calculateSip } from '../utils/calculator';

export function useCalculator(
  monthly: number,
  ratePercent: number,
  years: number
) {
  return useMemo(
    () => calculateSip(monthly, ratePercent, years),
    [monthly, ratePercent, years]
  );
}
