import { Link } from 'react-router-dom';
import { APP_NAME, DISCLAIMER, WHAT_WE_DONT_DO } from '../constants/copy';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';

export default function About() {
  return (
    <PageWrapper title="About">
      <div className="max-w-2xl">
        <PageHeader
          title={`About ${APP_NAME}`}
          description="An honest, plain-spoken guide to how money works in India — built for people starting from zero."
        />

        <Card className="mb-4">
          <h2 className="text-base font-medium text-ink mb-3">What we are</h2>
          <p className="text-sm text-secondary-text leading-relaxed">
            {APP_NAME} teaches core money concepts, shows illustrative projections with your numbers,
            and answers questions in plain language. Content is educational — not personalised
            investment advice from a SEBI-registered adviser.
          </p>
        </Card>

        <Card className="mb-4 border-secondary/25">
          <h2 className="text-base font-medium text-ink mb-3">What we don&apos;t do</h2>
          <ul className="space-y-2">
            {WHAT_WE_DONT_DO.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-secondary-text">
                <span className="text-primary shrink-0" aria-hidden>
                  ×
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mb-4">
          <h2 className="text-base font-medium text-ink mb-3">Your data</h2>
          <p className="text-sm text-secondary-text leading-relaxed">
            Your profile (name, age, income, goals) stays in your browser&apos;s local storage.
            We don&apos;t sell it, share it with brokers, or use it to pitch products.
            AI chat sends your profile to our server only to personalise answers — not stored as an account.
          </p>
        </Card>

        <Card className="mb-6 bg-secondary-soft/50 border-border">
          <h2 className="text-base font-medium text-ink mb-3">Trust & sources</h2>
          <p className="text-sm text-secondary-text leading-relaxed mb-3">
            Tax and regulation notes on Learning cards point to official sources where possible.
            Return ranges on Grow Money are historical illustrations — not promises.
          </p>
          <ul className="text-xs text-muted space-y-1">
            <li>
              <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                incometax.gov.in
              </a>{' '}
              — tax rules
            </li>
            <li>
              <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                sebi.gov.in
              </a>{' '}
              — markets & investor protection
            </li>
            <li>
              <a href="https://www.amfiindia.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                amfiindia.com
              </a>{' '}
              — mutual funds
            </li>
          </ul>
        </Card>

        <p className="text-xs text-muted leading-relaxed mb-6">{DISCLAIMER}</p>

        <Link to="/home" className="inline-flex text-sm text-primary px-3 py-2 rounded-md hover-link-pill border border-transparent">
          ← Back to Home
        </Link>
      </div>
    </PageWrapper>
  );
}
