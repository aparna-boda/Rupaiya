type BrandMarkSize = 'sm' | 'md' | 'lg';

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
}

const SIZES: Record<BrandMarkSize, { box: string; symbol: string }> = {
  sm: { box: 'w-9 h-9 rounded-[10px]', symbol: 'text-lg' },
  md: { box: 'w-11 h-11 rounded-xl', symbol: 'text-xl' },
  lg: { box: 'w-14 h-14 rounded-2xl', symbol: 'text-2xl' },
};

export default function BrandMark({ size = 'md', className = '' }: BrandMarkProps) {
  const { box, symbol } = SIZES[size];

  return (
    <div className={`brand-mark ${box} ${className}`} aria-hidden>
      <span className={`brand-mark-symbol ${symbol}`}>₹</span>
      <span className="brand-mark-dot" />
    </div>
  );
}
