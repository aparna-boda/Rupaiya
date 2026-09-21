import { ICONS, type IconName } from '../../utils/icons';

const SIZES = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

type IconSize = keyof typeof SIZES;

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 'md', className = '', strokeWidth = 2 }: IconProps) {
  const LucideIcon = ICONS[name];
  return <LucideIcon size={SIZES[size]} className={className} strokeWidth={strokeWidth} />;
}

interface IconBadgeProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

const BADGE_SIZES = {
  sm: { box: 'w-8 h-8', icon: 'sm' as const },
  md: { box: 'w-10 h-10', icon: 'md' as const },
  lg: { box: 'w-12 h-12', icon: 'lg' as const },
};

const BADGE_VARIANTS = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary-dark',
  neutral: 'bg-sunken text-secondary-text',
};

export function IconBadge({
  name,
  size = 'md',
  variant = 'primary',
  className = '',
}: IconBadgeProps) {
  const { box, icon } = BADGE_SIZES[size];
  return (
    <div
      className={`shrink-0 ${box} rounded-lg flex items-center justify-center ${BADGE_VARIANTS[variant]} ${className}`}
    >
      <Icon name={name} size={icon} strokeWidth={2.25} />
    </div>
  );
}
