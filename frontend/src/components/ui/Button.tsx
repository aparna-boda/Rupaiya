import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-5 py-3 text-[15px] font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary text-white border-primary hover:bg-primary-dark hover:shadow-md hover:shadow-primary/20',
    secondary:
      'bg-secondary-soft text-secondary-dark border-border hover:bg-secondary-soft hover:border-secondary/50 hover:text-secondary-dark',
    ghost:
      'bg-transparent text-secondary-text border-border hover:bg-[var(--color-hover-bg)] hover:border-[var(--color-hover-border)] hover:text-[var(--color-hover-text)]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
