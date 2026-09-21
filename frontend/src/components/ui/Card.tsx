import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  /** Warm color highlight on hover — for clickable cards */
  interactive?: boolean;
  /** Subtle border/shadow highlight — for informational cards */
  hoverable?: boolean;
}

export default function Card({
  children,
  padding = 'md',
  interactive = false,
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={`bg-card rounded-lg border border-border/80 ${paddingClasses[padding]} ${
        interactive ? 'interactive-card' : hoverable ? 'hoverable-card' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
