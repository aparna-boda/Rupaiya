export type RiskGrade = 0 | 1 | 2 | 3 | 4;

export interface Investment {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  riskGrade: RiskGrade;
  riskLabel: string;
  returnMin: number;
  returnMax: number;
  returnAvg: number;
  highlights: string[];
  explanation: string;
}
