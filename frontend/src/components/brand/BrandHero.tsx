import type { ReactNode } from 'react';
import BrandLogo from './BrandLogo';
import BrandTagline from './BrandTagline';

interface BrandHeroProps {
  children?: ReactNode;
  compact?: boolean;
}

export default function BrandHero({ children, compact = false }: BrandHeroProps) {
  return (
    <section
      className={`brand-hero relative overflow-hidden rounded-xl border border-primary/15 ${
        compact ? 'p-6 mb-8' : 'p-8 md:p-10 mb-10'
      }`}
    >
      <div className="brand-hero-glow" aria-hidden />
      <div className="relative z-10">
        <BrandLogo size={compact ? 'md' : 'lg'} />
        <BrandTagline highlight className={`${compact ? 'mt-3' : 'mt-4'} max-w-2xl`} />
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
