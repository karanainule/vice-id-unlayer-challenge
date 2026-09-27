import { useEffect, useRef } from 'react';
import { NOTIFICATION_TEMPLATES } from '../data/reactions';
import type { ReactionCategory } from '../types/identity';

type PushFn = (message: string, category?: ReactionCategory) => void;

/**
 * While `active`, drips a handful of simulated, clearly-fictional city
 * notifications at randomized intervals — never more than a few per visit,
 * so it reads as ambience rather than notification spam.
 */
export function useCityReactions(push: PushFn, active: boolean) {
  const pushRef = useRef(push);
  pushRef.current = push;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let firedCount = 0;
    const maxFires = 3 + Math.floor(Math.random() * 2);

    const scheduleNext = () => {
      const delay = 3500 + Math.random() * 5000;
      const timer = setTimeout(() => {
        if (cancelled || firedCount >= maxFires) return;
        const template =
          NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
        pushRef.current(template.message, template.category);
        firedCount += 1;
        if (firedCount < maxFires) scheduleNext();
      }, delay);
      return timer;
    };

    const first = scheduleNext();
    return () => {
      cancelled = true;
      clearTimeout(first);
    };
  }, [active]);
}
