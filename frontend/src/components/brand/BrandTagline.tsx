import { APP_TAGLINE } from '../../constants/copy';

interface BrandTaglineProps {
  className?: string;
  /** Larger emphasis — hero sections */
  highlight?: boolean;
}

/** Tagline with "rupee" highlighted in brand amber. */
export default function BrandTagline({ className = '', highlight = false }: BrandTaglineProps) {
  const parts = APP_TAGLINE.split(/(rupee)/gi);

  return (
    <p
      className={`${highlight ? 'text-secondary-text text-lg md:text-xl' : 'text-muted'} ${className}`}
    >
      {parts.map((part, i) =>
        part.toLowerCase() === 'rupee' ? (
          <span key={i} className="brand-rupee-highlight font-medium">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
}
