import { HTMLAttributes } from 'react';
import { clsx } from '../utils/clsx';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({ glow = false, className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass-panel rounded-2xl',
        glow && 'shadow-glow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
