import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from '../utils/clsx';
import type { IdentityProfile } from '../types/identity';

interface AppShellProps {
  children: ReactNode;
  profile: IdentityProfile | null;
}

const NAV_LINKS = [
  { label: 'CITY', path: '/' },
  { label: 'NIGHTWIRE', path: '/nightwire' },
];

export function AppShell({ children, profile }: AppShellProps) {
  const location = useLocation();
  const identityPath = profile ? '/profile' : '/create';

  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <div className="grain-overlay" />
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-lg font-bold tracking-wide text-paper">
            VICE <span className="text-primary">ID</span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'font-display text-xs tracking-widest text-muted transition-colors hover:text-accent sm:text-sm',
                  location.pathname === link.path && 'text-accent',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={identityPath}
              className={clsx(
                'font-display text-xs tracking-widest text-muted transition-colors hover:text-primary sm:text-sm',
                (location.pathname === identityPath) && 'text-primary',
              )}
            >
              IDENTITY
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
    </div>
  );
}
