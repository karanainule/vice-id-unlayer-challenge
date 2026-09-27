import { useMemo, useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { clsx } from '../utils/clsx';
import { generateBarcodePattern, generateCoordinates } from '../utils/id';
import { downloadDataUrl, renderIdentityCard } from '../utils/renderCard';
import type { IdentityProfile } from '../types/identity';

interface IdentityCardProps {
  profile: IdentityProfile;
  recordNumber: string;
}

function QrGlyph({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Array.from({ length: 49 }, (_, i) => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash % 5 === 0 || i % 8 === 0;
    });
  }, [seed]);

  return (
    <div
      className="grid h-16 w-16 grid-cols-7 gap-[1px] rounded bg-paper p-1.5"
      role="img"
      aria-label="Decorative fictional identity code"
    >
      {cells.map((filled, i) => (
        <span key={i} className={clsx('h-full w-full', filled ? 'bg-ink' : 'bg-transparent')} />
      ))}
    </div>
  );
}

export function IdentityCard({ profile, recordNumber }: IdentityCardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const bars = useMemo(() => generateBarcodePattern(profile.id), [profile.id]);
  const coordinates = useMemo(() => generateCoordinates(profile.id), [profile.id]);

  const handleDownload = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const dataUrl = await renderIdentityCard(profile, recordNumber);
      downloadDataUrl(dataUrl, `${recordNumber}.png`);
    } catch {
      setExportError('Could not export the file. You can still screenshot this card.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard glow className="relative mx-auto max-w-md overflow-hidden p-6">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative flex items-center justify-between">
          <p className="font-display text-xs tracking-widest text-muted">LEONORA CIVIC NETWORK</p>
          <p className="font-display text-xs tracking-widest text-accent">{recordNumber}</p>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10">
          <img
            src={profile.image}
            alt={`Identity photo of ${profile.alias}`}
            className="aspect-square w-full object-cover"
          />
          <div
            className={clsx(
              'absolute right-3 top-3 -rotate-12 rounded border px-3 py-1 font-display text-xs tracking-widest backdrop-blur-sm',
              profile.status === 'CONFIRMED'
                ? 'border-accent text-accent bg-ink/40'
                : 'border-primary text-primary bg-ink/40',
            )}
          >
            {profile.status}
          </div>
        </div>

        <div className="relative mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl text-paper">{profile.alias}</p>
            <StatusBadge status={profile.status} />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <p>
              <span className="text-paper">{profile.role}</span> · Role
            </p>
            <p>
              <span className="text-paper">{profile.district}</span> · District
            </p>
          </div>
          <p className="text-sm text-primary" aria-label={`Wanted level ${profile.wantedLevel} of 5`}>
            {'★'.repeat(profile.wantedLevel)}
            <span className="text-white/15">{'★'.repeat(5 - profile.wantedLevel)}</span>
          </p>
          {profile.quote && (
            <p className="border-l-2 border-accent/40 pl-3 text-sm italic text-paper/90">
              &ldquo;{profile.quote}&rdquo;
            </p>
          )}
        </div>

        <div className="relative mt-6 flex items-end justify-between gap-4">
          <div className="flex items-end gap-[3px]" aria-hidden="true">
            {bars.slice(0, 24).map((w, i) => (
              <span key={i} className="block bg-paper/80" style={{ width: w, height: 32 }} />
            ))}
          </div>
          <QrGlyph seed={profile.id} />
        </div>

        <div className="relative mt-3 flex items-center justify-between text-[11px] text-muted">
          <span>{coordinates}</span>
          <span>{new Date(profile.createdAt).toLocaleString()}</span>
        </div>

        <div className="relative mt-3 flex items-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Fictional record — not a real agency or document.</span>
        </div>
      </GlassCard>

      <div className="flex flex-col items-center gap-2">
        <Button variant="secondary" onClick={handleDownload} disabled={isExporting}>
          <Download className="h-4 w-4" aria-hidden="true" />
          {isExporting ? 'Preparing file…' : 'Download file'}
        </Button>
        {exportError && <p className="text-xs text-primary">{exportError}</p>}
      </div>
    </div>
  );
}
