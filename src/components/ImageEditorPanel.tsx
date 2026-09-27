import { useCallback, useRef, useState, type ElementRef } from 'react';
import ImageEditor from '@unlayer/react-image-editor';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, RotateCcw, Save } from 'lucide-react';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

interface ImageEditorPanelProps {
  image: string;
  onSave: (dataUrl: string) => void | Promise<void>;
}

const MICROCOPY = [
  'THE CITY ONLY SEES WHAT YOU SHOW IT.',
  'CROP THE STORY.',
  'CHANGE THE LIGHT.',
  'LEAVE YOUR MARK.',
  'MAKE IT LOOK EXPENSIVE.',
  'EVERY DETAIL BECOMES EVIDENCE.',
];

type EditorHandle = ElementRef<typeof ImageEditor>;

export function ImageEditorPanel({ image, onSave }: ImageEditorPanelProps) {
  const editorRef = useRef<EditorHandle>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'load-error' | 'error'>('loading');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [savedOnce, setSavedOnce] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const persistEdit = useCallback(
    async (dataUrl: string) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await onSave(dataUrl);
        setSavedOnce(true);
      } catch {
        setSaveError("Couldn't save that edit. Try again.");
      } finally {
        setIsSaving(false);
      }
    },
    [onSave],
  );

  const handleSave = useCallback(() => {
    const current = editorRef.current?.editor?.getImage();
    if (current) {
      void persistEdit(current);
    }
  }, [persistEdit]);

  const handleReset = useCallback(() => {
    editorRef.current?.editor?.reset(image);
    setSavedOnce(false);
  }, [image]);

  const controlsDisabled = status !== 'ready' || isSaving;

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="order-2 flex flex-row gap-2 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {MICROCOPY.map((line, i) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="min-w-[150px] shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 lg:min-w-0"
          >
            <p className="font-display text-[11px] leading-tight tracking-wide text-muted">
              {line}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="order-1 space-y-4 lg:order-2">
        <GlassCard className="relative overflow-hidden p-2 sm:p-3">
          {status === 'load-error' && (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
              <AlertTriangle className="h-8 w-8 text-primary" aria-hidden="true" />
              <p className="font-display text-sm text-paper">
                This image couldn&rsquo;t be loaded into the editor.
              </p>
              <p className="text-sm text-muted">
                Try a different photo or one of the city profiles.
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
              <AlertTriangle className="h-8 w-8 text-primary" aria-hidden="true" />
              <p className="font-display text-sm text-paper">The editor couldn&rsquo;t start.</p>
              <p className="text-sm text-muted">
                {errorDetail ?? 'Reload the page and try again.'}
              </p>
            </div>
          )}
          <div
            className={
              status === 'load-error' || status === 'error' ? 'hidden' : 'min-h-[420px]'
            }
            role="group"
            aria-label="Leonora identity image editor"
          >
            <ImageEditor
              ref={editorRef}
              image={image}
              minHeight={480}
              options={{ theme: 'dark' }}
              onLoad={() => setStatus('ready')}
              onLoadError={() => setStatus('load-error')}
              onError={(err) => {
                setErrorDetail(err?.message ?? null);
                setStatus('error');
              }}
              onSave={({ dataUrl }) => {
                void persistEdit(dataUrl);
              }}
              onCancel={() => undefined}
            />
          </div>
        </GlassCard>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {isSaving
              ? 'Processing your edit…'
              : savedOnce
                ? 'Saved. You can keep editing — saving again will use the latest version.'
                : 'Edit your visual, then save it to your file.'}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleReset} disabled={controlsDisabled}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={controlsDisabled}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {isSaving ? 'Saving…' : 'Save edit'}
            </Button>
          </div>
        </div>
        {saveError && (
          <p role="alert" className="text-sm text-primary">
            {saveError}
          </p>
        )}
      </div>
    </div>
  );
}

