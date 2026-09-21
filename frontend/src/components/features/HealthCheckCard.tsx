import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { buildHealthCheck, healthStatusIcon } from '../../utils/healthCheck';
import { getFirstName } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';

export default function HealthCheckCard() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const firstName = getFirstName(profile.name);
  const { items, nextAction } = buildHealthCheck(profile);

  return (
    <Card className="border-secondary/30 bg-gradient-to-br from-card to-secondary-soft/15">
      <p className="text-xs font-medium uppercase tracking-wider text-secondary-dark mb-1">
        Your snapshot
      </p>
      <h2 className="text-lg font-medium text-ink mb-4">
        {firstName ? `${firstName}'s financial health check` : 'Financial health check'}
      </h2>

      <ul className="space-y-3 mb-5">
        {items.map((item) => (
          <li key={item.label} className="flex gap-3 text-sm">
            <span
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                item.status === 'good'
                  ? 'bg-primary-soft text-primary-dark'
                  : item.status === 'warning'
                    ? 'bg-secondary-soft text-secondary-dark'
                    : 'bg-sunken text-muted'
              }`}
              aria-hidden
            >
              {healthStatusIcon(item.status)}
            </span>
            <div>
              <p className="font-medium text-ink">{item.label}</p>
              <p className="text-secondary-text text-xs mt-0.5 leading-relaxed">{item.message}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-border/60">
        <p className="text-xs text-muted mb-2">Suggested next step</p>
        <Button
          variant="secondary"
          fullWidth
          className="gap-2"
          onClick={() => navigate(nextAction.route + (nextAction.search ?? ''))}
        >
          {nextAction.label}
          <Icon name="arrow-right" size="sm" />
        </Button>
      </div>
    </Card>
  );
}
