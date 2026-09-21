import { APP_NAME } from '../../constants/copy';
import { formatINR, getFirstName } from '../../utils/formatters';
import { useProfile } from '../../hooks/useProfile';

export default function Header() {
  const { profile } = useProfile();
  const firstName = getFirstName(profile.name);

  return (
    <header className="flex items-center justify-between py-4 mb-1">
      <div>
        <p className="text-[11px] text-muted mb-0.5">
          {firstName ? 'Your space' : APP_NAME}
        </p>
        <h1 className="text-lg font-medium text-ink leading-tight">
          {firstName ? `Hi, ${firstName}` : APP_NAME}
        </h1>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-sunken rounded-pill border border-border/80">
        <span className="text-xs text-muted">{profile.age} yrs</span>
        <span className="text-xs text-border">·</span>
        <span className="text-xs font-medium text-primary">
          {formatINR(profile.monthlyInvestment)}/mo
        </span>
      </div>
    </header>
  );
}
