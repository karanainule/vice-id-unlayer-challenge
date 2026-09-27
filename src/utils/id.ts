/** Generates a short, non-cryptographic unique id — fine for local-only records. */
export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Produces a fictional Leonora Civic Network record number, e.g. V-ID-482917. */
export function generateRecordNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 899999);
  return `V-ID-${digits}`;
}

/** Turns an alias into a Nightwire-style handle, e.g. "Night Runner" -> "@night_runner". */
export function aliasToHandle(alias: string): string {
  const slug = alias
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 24);
  return `@${slug || 'unknown'}`;
}

/** Deterministic-ish pseudo barcode pattern string for decorative use. */
export function generateBarcodePattern(seed: string): number[] {
  const bars: number[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 40; i += 1) {
    hash = (hash * 9301 + 49297) % 233280;
    bars.push(1 + (hash % 4));
  }
  return bars;
}

/** City-coordinate-style decorative string, derived from a seed so it stays stable per record. */
export function generateCoordinates(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const lat = (Math.abs(hash) % 9000) / 100;
  const lng = (Math.abs(hash >> 3) % 18000) / 100;
  return `${lat.toFixed(2)}°N // ${lng.toFixed(2)}°W`;
}
