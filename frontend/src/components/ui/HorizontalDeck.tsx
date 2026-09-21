import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Icon } from './Icon';

interface HorizontalDeckProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export default function HorizontalDeck({ children, className = '', label = 'Card' }: HorizontalDeckProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const count = items.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    const clamped = Math.max(0, Math.min(index, count - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActiveIndex(clamped);
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const updateIndex = () => {
      const slides = Array.from(track.children) as HTMLElement[];
      if (slides.length === 0) return;

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Infinity;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(trackCenter - slideCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      setActiveIndex(nearest);
    };

    updateIndex();
    track.addEventListener('scroll', updateIndex, { passive: true });
    return () => track.removeEventListener('scroll', updateIndex);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className="horizontal-deck flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-1"
      >
        {items.map((child, index) => (
          <div
            key={child.key ?? index}
            className={`deck-slide snap-center shrink-0 w-[calc(100%-0.5rem)] max-w-full transition-all duration-300 ${
              index === activeIndex ? 'deck-slide-active' : 'deck-slide-idle'
            }`}
          >
            {cloneElement(child, { isActive: index === activeIndex } as { isActive: boolean })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="deck-nav-btn w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card text-secondary-text disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/40 transition-colors"
          aria-label={`Previous ${label}`}
        >
          <Icon name="arrow-left" size="sm" />
        </button>

        <div className="text-center">
          <p className="text-xs font-medium text-ink">
            {activeIndex + 1} <span className="text-muted">/ {count}</span>
          </p>
          <div className="flex justify-center gap-1 mt-1.5">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-4 bg-primary deck-dot-active'
                    : 'w-1.5 bg-border hover:bg-muted'
                }`}
                aria-label={`Go to ${label} ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === count - 1}
          className="deck-nav-btn w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card text-secondary-text disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/40 transition-colors"
          aria-label={`Next ${label}`}
        >
          <Icon name="arrow-right" size="sm" />
        </button>
      </div>

      <p className="text-[11px] text-muted text-center mt-2">
        Swipe sideways to browse · tap the card to turn it
      </p>
    </div>
  );
}
