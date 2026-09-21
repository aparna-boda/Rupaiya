import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FlipCardProps {
  flipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  heightClass?: string;
}

const TAP_THRESHOLD_PX = 14;

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('button, a, input, textarea, select, [data-no-flip]'));
}

export default function FlipCard({
  flipped,
  onFlip,
  front,
  back,
  className = '',
  heightClass = 'min-h-[340px] h-auto',
}: FlipCardProps) {
  const [revealKey, setRevealKey] = useState(0);
  const tapRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (flipped) setRevealKey((k) => k + 1);
  }, [flipped]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isInteractiveTarget(e.target)) return;
    tapRef.current = { x: e.clientX, y: e.clientY, active: true };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!tapRef.current.active || isInteractiveTarget(e.target)) {
      tapRef.current.active = false;
      return;
    }
    tapRef.current.active = false;

    const dx = Math.abs(e.clientX - tapRef.current.x);
    const dy = Math.abs(e.clientY - tapRef.current.y);
    if (dx < TAP_THRESHOLD_PX && dy < TAP_THRESHOLD_PX) {
      onFlip();
    }
  };

  const handlePointerCancel = () => {
    tapRef.current.active = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className={`flip-scene cursor-pointer ${heightClass} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
    >
      <div className="flip-spark flip-spark-a" aria-hidden />
      <div className="flip-spark flip-spark-b" aria-hidden />
      <div className={`flip-inner h-full ${flipped ? 'is-flipped' : ''}`}>
        <div className="flip-face flip-front bg-card border border-border/80 rounded-lg p-4">
          {front}
        </div>
        <div className="flip-face flip-back bg-card border border-primary/30 rounded-lg p-4">
          <div key={revealKey} className="flip-back-reveal h-full">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}
