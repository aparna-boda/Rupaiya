import { PROJECTION_DISCLAIMER } from '../../utils/projections';

interface ProjectionDisclaimerProps {
  className?: string;
}

export default function ProjectionDisclaimer({ className = '' }: ProjectionDisclaimerProps) {
  return (
    <p className={`text-[11px] text-muted leading-relaxed ${className}`}>
      {PROJECTION_DISCLAIMER}
    </p>
  );
}
