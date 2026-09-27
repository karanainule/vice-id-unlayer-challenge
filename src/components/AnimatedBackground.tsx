import { clsx } from '../utils/clsx';

interface AnimatedBackgroundProps {
  variant?: 'full' | 'quiet';
  className?: string;
}

/**
 * A self-contained, purely decorative neon coastal skyline. Original vector
 * shapes only — no photography, no third-party art, no copyrighted logos.
 */
export function AnimatedBackground({ variant = 'full', className }: AnimatedBackgroundProps) {
  return (
    <div
      className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-leonora-sky" />

      {variant === 'full' && (
        <>
          <div className="absolute -top-24 left-1/4 h-72 w-72 animate-drift rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute top-1/3 right-0 h-96 w-96 animate-drift rounded-full bg-accent/20 blur-3xl [animation-delay:3s]" />
          <div className="absolute bottom-0 left-0 h-80 w-80 animate-drift rounded-full bg-primary/25 blur-3xl [animation-delay:6s]" />

          <svg
            className="absolute bottom-0 left-0 h-1/2 w-full text-ink"
            viewBox="0 0 1200 260"
            preserveAspectRatio="none"
            fill="none"
          >
            <rect x="40" y="120" width="46" height="140" fill="currentColor" opacity="0.85" />
            <rect x="100" y="90" width="34" height="170" fill="currentColor" opacity="0.9" />
            <rect x="150" y="150" width="60" height="110" fill="currentColor" />
            <rect x="990" y="100" width="40" height="160" fill="currentColor" opacity="0.9" />
            <rect x="1050" y="70" width="30" height="190" fill="currentColor" />
            <rect x="1100" y="140" width="70" height="120" fill="currentColor" opacity="0.85" />
            {Array.from({ length: 10 }).map((_, i) => (
              <rect
                key={i}
                x={44 + i * 6}
                y={130 + (i % 3) * 10}
                width="2"
                height="2"
                fill="#FF3EA5"
                opacity="0.8"
              />
            ))}
          </svg>

          <svg
            className="absolute bottom-0 right-6 h-40 w-40 text-ink sm:h-56 sm:w-56"
            viewBox="0 0 200 220"
            fill="none"
          >
            <rect x="94" y="90" width="10" height="130" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="10" strokeLinecap="round">
              <path d="M99 95 C60 80 30 40 20 15" />
              <path d="M99 95 C140 75 170 40 178 10" />
              <path d="M99 90 C55 95 20 90 5 70" />
              <path d="M99 90 C145 100 175 95 190 78" />
              <path d="M99 88 C90 55 95 25 110 5" />
            </g>
          </svg>
        </>
      )}

      <div className="absolute inset-0 scanlines opacity-40" />
    </div>
  );
}
