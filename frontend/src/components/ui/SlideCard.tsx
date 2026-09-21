import type { ReactNode } from 'react';

interface SlideCardProps {
  showBack: boolean;
  onToggle: () => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  heightClass?: string;
}

export default function SlideCard({
  showBack,
  onToggle,
  front,
  back,
  className = '',
  heightClass = 'h-[calc(100dvh-16.5rem)] min-h-[300px]',
}: SlideCardProps) {
  return (
    <div
      className={`slide-card overflow-hidden rounded-lg border border-border/80 cursor-pointer ${heightClass} ${className}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-pressed={showBack}
    >
      <div
        className={`slide-track flex w-[200%] h-full transition-transform duration-500 ease-out ${
          showBack ? '-translate-x-1/2' : 'translate-x-0'
        }`}
      >
        <div className="slide-panel w-1/2 h-full bg-card p-4 flex flex-col shrink-0">
          {front}
        </div>
        <div className="slide-panel w-1/2 h-full bg-card border-l border-primary/20 p-4 flex flex-col shrink-0">
          {back}
        </div>
      </div>
    </div>
  );
}
