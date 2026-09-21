import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  label?: string;
  subtext?: string;
}

export default function Input({
  prefix,
  label,
  subtext,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-medium text-ink mb-1">{label}</label>
      )}
      {subtext && (
        <p className="text-sm text-secondary-text mb-4">{subtext}</p>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base">
            {prefix}
          </span>
        )}
        <input
          className={`w-full bg-sunken border border-border rounded-md py-3 text-base text-ink placeholder:text-hint focus:outline-none focus:border-primary ${prefix ? 'pl-9 pr-4' : 'px-4'} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
