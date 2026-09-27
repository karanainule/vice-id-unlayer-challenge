type ClassValue = string | number | null | undefined | false;

/** Minimal className joiner — avoids pulling in the clsx dependency for one job. */
export function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
