import { useNavigate } from 'react-router-dom';
import { HOME_NAV_CARDS } from '../constants/copy';
import { useProfile } from '../hooks/useProfile';
import { formatINR, formatMultiplier, getFirstName } from '../utils/formatters';
import { getDefaultRateForRisk } from '../utils/projections';
import { calculateSip } from '../utils/calculator';
import PageWrapper from '../components/layout/PageWrapper';
import BrandHero from '../components/brand/BrandHero';
import Card from '../components/ui/Card';
import { IconBadge } from '../components/ui/Icon';
import ProjectionScenarios from '../components/features/ProjectionScenarios';
import StartHerePath from '../components/features/StartHerePath';
import HealthCheckCard from '../components/features/HealthCheckCard';

export default function Home() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const years = Math.max(60 - profile.age, 1);
  const defaultRate = getDefaultRateForRisk(profile.riskAppetite);
  const result = calculateSip(profile.monthlyInvestment, defaultRate, years);
  const firstName = getFirstName(profile.name);

  return (
    <PageWrapper title="Home">
      <BrandHero>
        <p className="text-secondary-text text-base md:text-lg">
          {firstName ? (
            <>
              Hi <span className="font-medium text-primary">{firstName}</span> — your personal
              finance space is ready.
            </>
          ) : (
            <>Your plain-spoken guide to how money works in India.</>
          )}
        </p>
      </BrandHero>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <Card className="border-border bg-gradient-to-br from-card to-secondary-soft/40">
          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-3">
            Your projection
          </p>
          <p className="text-sm text-muted mb-4">
            {firstName ? `${firstName}, if you start today` : 'If you start today'} · by age 60 ·{' '}
            {years} years
          </p>
          <ProjectionScenarios
            monthly={profile.monthlyInvestment}
            years={years}
            riskAppetite={profile.riskAppetite}
            compact
          />
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-border/60">
            <span className="text-xs px-3 py-1.5 bg-sunken rounded-pill text-muted">
              Invested {formatINR(result.totalInvested)}
            </span>
            <span className="text-xs px-3 py-1.5 bg-sunken rounded-pill text-muted">
              Earned {formatINR(result.totalGain)}
            </span>
            <span className="text-xs px-3 py-1.5 bg-secondary-soft rounded-pill text-secondary-dark font-medium">
              {formatMultiplier(result.totalValue, result.totalInvested)}
            </span>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-1 content-start">
          <HealthCheckCard />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOME_NAV_CARDS.map((card) => (
            <Card
              key={card.path}
              interactive
              className="group"
              onClick={() => navigate(card.path)}
            >
              <IconBadge name={card.icon} size="md" />
              <h3 className="font-medium text-ink text-base mt-3 transition-colors">
                {card.label}
              </h3>
              <p className="text-sm text-muted mt-1">{card.description}</p>
            </Card>
          ))}
          </div>
        </div>
      </div>

      <StartHerePath firstName={firstName} />
    </PageWrapper>
  );
}
