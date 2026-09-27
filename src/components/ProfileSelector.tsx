import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff, Loader2, Upload } from 'lucide-react';
import { PRESET_PROFILES } from '../data/profiles';
import { processImageForStorage, validateImageFile } from '../utils/image';
import { clsx } from '../utils/clsx';
import type { PresetProfile } from '../types/identity';

interface ProfileSelectorProps {
  onSelectUpload: (image: string) => void;
  onSelectPreset: (preset: PresetProfile) => void;
  selectedPresetId?: string | null;
  error: string | null;
  onError: (message: string) => void;
}

export function ProfileSelector({
  onSelectUpload,
  onSelectPreset,
  selectedPresetId,
  error,
  onError,
}: ProfileSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brokenPresets, setBrokenPresets] = useState<Set<string>>(new Set());

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || isProcessing) return;
      const result = validateImageFile(file);
      if (!result.valid) {
        onError(result.message ?? 'That file could not be used.');
        return;
      }
      setIsProcessing(true);
      try {
        // Resize + compress before it ever touches app state, so a 10MB
        // phone photo never gets base64-encoded whole into localStorage.
        const processed = await processImageForStorage(file);
        onSelectUpload(processed);
      } catch {
        onError('Could not process that image. Try a different file.');
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, onSelectUpload, onError],
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 font-display text-sm tracking-widest text-accent">UPLOAD PHOTO</h2>
        <p className="mb-4 text-sm text-muted">Bring your own face into Leonora.</p>
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isProcessing && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!isProcessing && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!isProcessing) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (!isProcessing) handleFile(e.dataTransfer.files?.[0]);
          }}
          aria-disabled={isProcessing}
          className={clsx(
            'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
            isProcessing
              ? 'cursor-wait border-white/15 opacity-70'
              : 'cursor-pointer',
            !isProcessing && (isDragging
              ? 'border-accent bg-accent/5'
              : 'border-white/15 hover:border-primary/60'),
          )}
          aria-label="Upload a photo — click or drag and drop an image file"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
              <p className="font-display text-sm text-paper">Compressing your photo…</p>
              <p className="text-xs text-muted">This keeps your file small and fast to save.</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-accent" aria-hidden="true" />
              <p className="font-display text-sm text-paper">Drag a photo here, or click to browse</p>
              <p className="text-xs text-muted">PNG, JPG, or WEBP — up to 12MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="sr-only"
            disabled={isProcessing}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-primary">
            {error}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-1 font-display text-sm tracking-widest text-accent">
          CHOOSE A CITY PROFILE
        </h2>
        <p className="mb-4 text-sm text-muted">Six fictional Leonora locals, ready to edit.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESET_PROFILES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isBroken = brokenPresets.has(preset.id);
            return (
              <motion.button
                key={preset.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectPreset(preset)}
                className={clsx(
                  'group relative overflow-hidden rounded-xl border text-left transition-colors',
                  isSelected
                    ? 'border-primary shadow-glow'
                    : 'border-white/10 hover:border-accent/50',
                )}
                aria-pressed={isSelected}
              >
                <div className="aspect-square w-full bg-surface2">
                  {isBroken ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
                      <ImageOff className="h-6 w-6" aria-hidden="true" />
                      <span className="text-[10px]">Image unavailable</span>
                    </div>
                  ) : (
                    <img
                      src={preset.image}
                      alt={`${preset.name}, ${preset.archetype.toLowerCase()}`}
                      className="h-full w-full object-cover"
                      onError={() =>
                        setBrokenPresets((prev) => new Set(prev).add(preset.id))
                      }
                    />
                  )}
                </div>
                <div className="p-2.5">
                  <p className="font-display text-xs tracking-wide text-paper">
                    {preset.archetype}
                  </p>
                  <p className="text-[11px] text-muted">{preset.name}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
