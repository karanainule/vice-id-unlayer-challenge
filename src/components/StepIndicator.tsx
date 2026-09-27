import { Link } from 'react-router-dom';
import { clsx } from '../utils/clsx';
import type { CreationStep } from '../types/identity';

const STEPS: CreationStep[] = [
  { index: 1, label: 'PROFILE', path: '/create' },
  { index: 2, label: 'EDIT', path: '/edit' },
  { index: 3, label: 'FILE', path: '/file' },
  { index: 4, label: 'PUBLISH', path: '/nightwire' },
];

interface StepIndicatorProps {
  current: number;
  reachable?: number;
}

export function StepIndicator({ current, reachable = current }: StepIndicatorProps) {
  return (
    <nav aria-label="Identity creation progress" className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((step, i) => {
          const state =
            step.index === current ? 'current' : step.index < current ? 'done' : 'upcoming';
          const canNavigate = step.index <= reachable;
          const content = (
            <span
              className={clsx(
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-display tracking-wider transition-colors sm:px-4 sm:text-sm',
                state === 'current' &&
                  'border-primary bg-primary/10 text-primary shadow-glow',
                state === 'done' && 'border-accent/40 text-accent',
                state === 'upcoming' && 'border-white/10 text-muted',
              )}
            >
              <span className="tabular-nums">{String(step.index).padStart(2, '0')}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </span>
          );
          return (
            <li key={step.path} className="flex items-center gap-1 sm:gap-2">
              {canNavigate ? (
                <Link to={step.path} aria-current={state === 'current' ? 'step' : undefined}>
                  {content}
                </Link>
              ) : (
                <span aria-disabled="true">{content}</span>
              )}
              {i < STEPS.length - 1 && (
                <span className="h-px w-3 bg-white/15 sm:w-6" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
