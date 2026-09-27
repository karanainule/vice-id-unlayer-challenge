import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Radio, Sparkles, Users } from 'lucide-react';
import type { ReactionCategory } from '../types/identity';
import { generateId } from '../utils/id';

export interface ToastItem {
  id: string;
  message: string;
  category?: ReactionCategory;
}

const ICONS: Record<ReactionCategory, typeof Eye> = {
  SURVEILLANCE: Eye,
  STREET: Users,
  NIGHTLIFE: Sparkles,
  UNDERGROUND: Radio,
};

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    (message: string, category?: ReactionCategory, durationMs = 5000) => {
      const id = generateId();
      setToasts((prev) => [...prev.slice(-3), { id, message, category }]);
      const timer = setTimeout(() => dismissToast(id), durationMs);
      timers.current.set(id, timer);
    },
    [dismissToast],
  );

  return { toasts, pushToast, dismissToast };
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = toast.category ? ICONS[toast.category] : Radio;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="glass-panel pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl px-4 py-3 shadow-lg"
              role="status"
            >
              <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <p className="flex-1 text-sm text-paper">{toast.message}</p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-xs text-muted hover:text-paper"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
