import { clsx } from '../utils/clsx';
import type { IdentityStatus } from '../types/identity';

const STYLES: Record<IdentityStatus, string> = {
  UNCONFIRMED: 'border-muted/40 text-muted',
  CONFIRMED: 'border-accent/50 text-accent',
  FLAGGED: 'border-primary/50 text-primary',
};

export function StatusBadge({ status }: { status: IdentityStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1 font-display text-xs tracking-widest',
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
