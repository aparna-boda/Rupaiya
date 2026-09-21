import { APP_NAME } from '../../constants/copy';

type WordmarkSize = 'sm' | 'md' | 'lg';

interface BrandWordmarkProps {
  size?: WordmarkSize;
  className?: string;
}

const SIZES: Record<WordmarkSize, string> = {
  sm: 'text-[1.35rem]',
  md: 'text-[1.65rem]',
  lg: 'text-[2.75rem]',
};

/** Stylised "Rupaiya" — Fraunces serif, indigo + amber on "ai". */
export default function BrandWordmark({ size = 'md', className = '' }: BrandWordmarkProps) {
  // Split: Rup + ai + ya (ai = heart of the Hindi word, highlighted in amber)
  const name = APP_NAME;
  const match = name.match(/^(Rup)(ai)(ya)$/i);
  const [, rup = name.slice(0, 3), ai = name.slice(3, 5), ya = name.slice(5)] = match ?? [];

  return (
    <span className={`brand-wordmark font-brand ${SIZES[size]} ${className}`} aria-label={APP_NAME}>
      <span className="brand-wordmark-rup">{rup}</span>
      <span className="brand-wordmark-ai">{ai}</span>
      <span className="brand-wordmark-ya">{ya}</span>
    </span>
  );
}
