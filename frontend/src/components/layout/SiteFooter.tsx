import { Link } from 'react-router-dom';
import { DISCLAIMER } from '../../constants/copy';
import BrandLogo from '../brand/BrandLogo';
import BrandTagline from '../brand/BrandTagline';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto bg-sunken/40">
      <div className="mx-auto max-w-site px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          <div>
            <BrandLogo size="sm" />
            <BrandTagline className="mt-2 max-w-xs" />
          </div>
          <div className="flex flex-col gap-2 self-start">
            <Link
              to="/about"
              className="text-sm text-hint hover:text-[var(--color-hover-text)] hover:bg-[var(--color-hover-bg)] px-2 py-1 -mx-2 rounded-md transition-colors"
            >
              About & trust
            </Link>
            <Link
              to="/admin"
              className="text-sm text-hint hover:text-[var(--color-hover-text)] hover:bg-[var(--color-hover-bg)] px-2 py-1 -mx-2 rounded-md transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed max-w-3xl border-t border-border pt-6">
          {DISCLAIMER}
        </p>
      </div>
    </footer>
  );
}
