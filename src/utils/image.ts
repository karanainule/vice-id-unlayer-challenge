const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_BYTES = 12 * 1024 * 1024; // 12MB — raw upload ceiling, before processing

export interface ImageValidationResult {
  valid: boolean;
  message?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: 'Unsupported file type. Use a PNG, JPG, or WEBP image.',
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      valid: false,
      message: 'That file is too large. Keep it under 12MB.',
    };
  }
  return { valid: true };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read that file.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

/** Encode an inline, self-contained SVG string as a data URL usable by <img> and canvas. */
export function svgDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// --- Compression / resize pipeline -----------------------------------------
//
// Raw uploads and editor output can both arrive as multi-megabyte base64
// data URLs, which is unsafe to persist directly in localStorage (typical
// quota is 5-10MB per origin, shared across every key the app writes).
// Everything that ends up in localStorage goes through processImageForStorage
// first, which downsizes and re-encodes it into a small, predictable range.

export interface ProcessImageOptions {
  /** Longest-side cap in pixels. Images already smaller are never upscaled. */
  maxDimension?: number;
  /** JPEG/WebP quality, 0-1. */
  quality?: number;
  /** Output encoding. JPEG is the safest default for photo-editor output. */
  mimeType?: 'image/jpeg' | 'image/webp';
}

const DEFAULT_MAX_DIMENSION = 1700;
const DEFAULT_QUALITY = 0.82;
const DEFAULT_MIME_TYPE: NonNullable<ProcessImageOptions['mimeType']> = 'image/jpeg';
const MIN_QUALITY = 0.5;
const HARD_CEILING_BYTES = 2 * 1024 * 1024; // 2MB safety ceiling
const MAX_COMPRESSION_ATTEMPTS = 4;

/** Approximate decoded byte size of a base64 data URL, without allocating it. */
export function estimateDataUrlBytes(dataUrl: string): number {
  const commaIndex = dataUrl.indexOf(',');
  const base64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
  const paddingMatch = base64.match(/=+$/);
  const padding = paddingMatch ? paddingMatch[0].length : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function loadImageElement(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const isObjectSource = typeof source !== 'string';
    const objectUrl = isObjectSource ? URL.createObjectURL(source) : null;

    const cleanup = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };

    img.onload = () => {
      cleanup();
      resolve(img);
    };
    img.onerror = () => {
      cleanup();
      reject(new Error('Could not read that image.'));
    };
    img.src = objectUrl ?? (source as string);
  });
}

function drawToDataUrl(
  img: HTMLImageElement,
  maxDimension: number,
  quality: number,
  mimeType: NonNullable<ProcessImageOptions['mimeType']>,
): string {
  const longestSide = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const scale = Math.min(1, maxDimension / Math.max(1, longestSide));
  const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not supported in this browser.');
  }

  // JPEG has no alpha channel — flatten transparency onto a solid
  // background first, or transparent areas render as black.
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#07060A';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL(mimeType, quality);
}

/**
 * Resizes and compresses an image (an uploaded File, or an existing data
 * URL such as the React Image Editor's saved output) so it is safe to store
 * in localStorage. Downscales to `maxDimension` on the longest side,
 * re-encodes as JPEG/WebP at `quality`, and — for unusually
 * hard-to-compress images — automatically steps quality and dimension down
 * further until the result is under a 2MB safety ceiling or a handful of
 * attempts are exhausted. Never throws for "just a large image"; only for
 * a file that genuinely can't be decoded.
 */
export async function processImageForStorage(
  source: File | string,
  options: ProcessImageOptions = {},
): Promise<string> {
  let maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  let quality = options.quality ?? DEFAULT_QUALITY;
  const mimeType = options.mimeType ?? DEFAULT_MIME_TYPE;

  const img = await loadImageElement(source);

  let dataUrl = drawToDataUrl(img, maxDimension, quality, mimeType);

  let attempts = 0;
  while (estimateDataUrlBytes(dataUrl) > HARD_CEILING_BYTES && attempts < MAX_COMPRESSION_ATTEMPTS) {
    attempts += 1;
    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - 0.12);
    } else {
      maxDimension = Math.round(maxDimension * 0.8);
    }
    dataUrl = drawToDataUrl(img, maxDimension, quality, mimeType);
  }

  return dataUrl;
}

