import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useProfile } from '../hooks/useProfile';
import { useCalculator } from '../hooks/useCalculator';
import { formatINR, formatMultiplier, formatAge, getFirstName } from '../utils/formatters';
import {
  getDefaultRateForRisk,
  PROJECTION_DISCLAIMER,
  PROJECTION_SCENARIOS,
} from '../utils/projections';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import ProjectionScenarios from '../components/features/ProjectionScenarios';

const RETURN_PRESETS = [7, 10, 12] as const;

export default function Calculator() {
  const { profile } = useProfile();
  const [monthly, setMonthly] = useState(profile.monthlyInvestment);
  const [years, setYears] = useState(Math.max(60 - profile.age, 1));
  const [rate, setRate] = useState(getDefaultRateForRisk(profile.riskAppetite));
  const [customRate, setCustomRate] = useState(false);

  const result = useCalculator(monthly, rate, years);
  const firstName = getFirstName(profile.name);

  return (
    <PageWrapper title="Calculator">
      <PageHeader
        title={firstName ? `${firstName}'s SIP calculator` : 'SIP Calculator'}
        description={
          firstName
            ? `Play with your numbers, ${firstName} — default rate matches your ${profile.riskAppetite} risk profile.`
            : 'See how your monthly investment could grow — adjust sliders and compare scenarios.'
        }
      />

      <div className="mb-6">
        <ProjectionScenarios
          monthly={monthly}
          years={years}
          riskAppetite={profile.riskAppetite}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm text-secondary-text mb-2 block">
              Monthly investment — {formatINR(monthly)}
            </label>
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <Input
              prefix="₹"
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-secondary-text mb-2 block">
              Years — {years} (until age {formatAge(profile.age, years)})
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="text-sm text-secondary-text mb-2 block">
              Expected return (illustrative)
            </label>
            <div className="flex flex-wrap gap-2">
              {RETURN_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setRate(preset);
                    setCustomRate(false);
                  }}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    !customRate && rate === preset
                      ? 'bg-primary text-white border-primary'
                      : 'bg-sunken text-secondary-text border-border hover-choice'
                  }`}
                >
                  {preset}%
                  <span className="hidden sm:inline text-xs opacity-80 ml-1">
                    · {PROJECTION_SCENARIOS.find((s) => s.rate === preset)?.label}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setCustomRate(true)}
                className={`px-4 py-2 text-sm rounded-md border ${
                  customRate
                    ? 'bg-primary text-white border-primary'
                    : 'bg-sunken text-secondary-text border-border hover-choice'
                }`}
              >
                Custom
              </button>
            </div>
            {customRate && (
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <p className="text-xs text-muted mb-1">Total value at {rate}%</p>
            <p
              className="font-bold text-primary mb-4"
              style={{ fontSize: '32px', letterSpacing: '-1px' }}
            >
              {formatINR(result.totalValue)}
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[11px] text-muted">Invested</p>
                <p className="text-sm font-medium">{formatINR(result.totalInvested)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Earned</p>
                <p className="text-sm font-medium">{formatINR(result.totalGain)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Multiplier</p>
                <p className="text-sm font-medium text-primary">
                  {formatMultiplier(result.totalValue, result.totalInvested)}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-muted mt-4 leading-relaxed">{PROJECTION_DISCLAIMER}</p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-ink mb-3">Year-by-year growth</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={result.yearlyBreakdown}>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => formatINR(v)}
                  tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => formatINR(value)}
                  contentStyle={{
                    background: 'var(--color-card)',
                    border: '0.5px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Value"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="invested"
                  name="Invested"
                  stroke="var(--color-secondary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
