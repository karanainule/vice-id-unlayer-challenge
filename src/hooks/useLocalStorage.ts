import { useCallback, useEffect, useState } from 'react';

function readValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // Corrupt or inaccessible storage should never crash the app.
    return fallback;
  }
}

/**
 * useState backed by localStorage. Storage failures (quota exceeded,
 * private mode, disabled storage) degrade to in-memory state rather than
 * throwing — the fourth tuple element reports whether the most recent write
 * failed, so callers can surface a real message instead of silently losing
 * data the user thinks was saved.
 */
export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void, boolean] {
  const [value, setValue] = useState<T>(() => readValue(key, fallback));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setFailed(false);
    } catch {
      // Most commonly QuotaExceededError — the value still lives in React
      // state, so the app keeps working this session; callers decide how
      // to warn the user that it won't persist.
      setFailed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue(next);
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
    setValue(fallback);
    setFailed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, update, clear, failed];
}

