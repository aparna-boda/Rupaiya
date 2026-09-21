import { useState, type MouseEvent } from 'react';
import { Icon } from './Icon';

interface FlipButtonProps {
  onFlip: () => void;
  label?: string;
  className?: string;
  pulse?: boolean;
}

/** Dedicated turn control — works reliably inside horizontal scroll decks. */
export default function FlipButton({
  onFlip,
  label = 'Turn card',
  className = '',
  pulse = true,
}: FlipButtonProps) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSpinning(true);
    window.setTimeout(() => setSpinning(false), 550);
    onFlip();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      className={`flip-btn inline-flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary-soft px-3 py-2 rounded-md border border-transparent hover-chip ${
        pulse ? 'flip-btn-pulse' : ''
      } ${className}`}
    >
      <span className={`flip-btn-icon inline-flex ${spinning ? 'is-spinning' : ''}`}>
        <Icon name="rotate" size="xs" />
      </span>
      {label}
    </button>
  );
}
