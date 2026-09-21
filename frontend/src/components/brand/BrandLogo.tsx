import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import BrandTagline from './BrandTagline';
import BrandWordmark from './BrandWordmark';

type BrandSize = 'sm' | 'md' | 'lg';

interface BrandLogoProps {
  size?: BrandSize;
  showTagline?: boolean;
  linkToHome?: boolean;
  className?: string;
}

const GAPS: Record<BrandSize, string> = {
  sm: 'gap-2.5',
  md: 'gap-3',
  lg: 'gap-4',
};

const TAGLINE_SIZES: Record<BrandSize, string> = {
  sm: 'text-[11px]',
  md: 'text-sm',
  lg: 'text-base',
};

export default function BrandLogo({
  size = 'md',
  showTagline = false,
  linkToHome = false,
  className = '',
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center ${GAPS[size]} ${className}`}>
      <BrandMark size={size} />
      <div className="pt-0.5">
        <BrandWordmark size={size} />
        {showTagline && (
          <BrandTagline className={`${TAGLINE_SIZES[size]} mt-1 max-w-xs leading-snug`} />
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/home" className="inline-block hover:opacity-90 transition-opacity brand-logo-link">
        {content}
      </Link>
    );
  }

  return content;
}
