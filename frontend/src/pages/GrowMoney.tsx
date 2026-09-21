import { useKnowledge } from '../hooks/useKnowledge';
import { useProfile } from '../hooks/useProfile';
import { getFirstName } from '../utils/formatters';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import InvestmentCard from '../components/features/InvestmentCard';
import ProjectionDisclaimer from '../components/ui/ProjectionDisclaimer';

export default function GrowMoney() {
  const { profile } = useProfile();
  const { data, loading, error } = useKnowledge();
  const firstName = getFirstName(profile.name);

  return (
    <PageWrapper title="Grow Money">
      {loading && <p className="text-sm text-muted">Loading investments...</p>}
      {error && <p className="text-sm text-muted">{error}</p>}

      {data && (
        <>
          <PageHeader
            title={
              firstName ? `${firstName}, ways to grow your money` : data.meta.growIntro.title
            }
            description={
              firstName
                ? `${data.meta.growIntro.description} Projections use your ₹${profile.monthlyInvestment.toLocaleString('en-IN')}/month.`
                : data.meta.growIntro.description
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.investments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                concepts={data.concepts}
              />
            ))}
          </div>

          <ProjectionDisclaimer className="mt-6" />
        </>
      )}
    </PageWrapper>
  );
}
