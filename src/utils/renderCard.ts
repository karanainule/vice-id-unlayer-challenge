import type { IdentityProfile } from '../types/identity';
import { generateBarcodePattern, generateCoordinates } from './id';

const WIDTH = 900;
const HEIGHT = 1260;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the identity image.'));
    img.src = src;
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draws the identity file onto an offscreen canvas and returns a PNG data URL.
 * Pure canvas 2D — no external rendering dependency.
 */
export async function renderIdentityCard(
  profile: IdentityProfile,
  recordNumber: string,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context2d = canvas.getContext('2d');
  if (!context2d) throw new Error('Canvas is not supported in this browser.');
  const ctx = context2d;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, '#111018');
  bgGrad.addColorStop(1, '#07060A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Outer frame
  ctx.strokeStyle = 'rgba(248,247,255,0.15)';
  ctx.lineWidth = 2;
  roundedRect(ctx, 24, 24, WIDTH - 48, HEIGHT - 48, 20);
  ctx.stroke();

  // Header
  ctx.fillStyle = '#A8A4B7';
  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('LEONORA CIVIC NETWORK', 60, 60);

  ctx.fillStyle = '#00E5FF';
  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(recordNumber, WIDTH - 60, 60);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = 'rgba(248,247,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(60, 104);
  ctx.lineTo(WIDTH - 60, 104);
  ctx.stroke();

  // Portrait
  const portraitSize = 560;
  const portraitX = (WIDTH - portraitSize) / 2;
  const portraitY = 140;
  try {
    const img = await loadImage(profile.image);
    ctx.save();
    roundedRect(ctx, portraitX, portraitY, portraitSize, portraitSize, 16);
    ctx.clip();
    // Cover-fit draw
    const scale = Math.max(portraitSize / img.width, portraitSize / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    ctx.drawImage(
      img,
      portraitX - (drawW - portraitSize) / 2,
      portraitY - (drawH - portraitSize) / 2,
      drawW,
      drawH,
    );
    ctx.restore();
  } catch {
    ctx.fillStyle = '#181622';
    roundedRect(ctx, portraitX, portraitY, portraitSize, portraitSize, 16);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(0,229,255,0.5)';
  ctx.lineWidth = 2;
  roundedRect(ctx, portraitX, portraitY, portraitSize, portraitSize, 16);
  ctx.stroke();

  let y = portraitY + portraitSize + 50;

  function field(label: string, value: string, color = '#F8F7FF') {
    ctx.fillStyle = '#A8A4B7';
    ctx.font = '500 14px "Inter", sans-serif';
    ctx.fillText(label, 60, y);
    ctx.fillStyle = color;
    ctx.font = '600 26px "Space Grotesk", sans-serif';
    ctx.fillText(value, 60, y + 20);
    y += 68;
  }

  field('ALIAS', profile.alias);
  field('ROLE  //  DISTRICT', `${profile.role}  //  ${profile.district}`);
  field(
    'STATUS',
    profile.status,
    profile.status === 'CONFIRMED' ? '#00E5FF' : '#A8A4B7',
  );

  // Wanted stars
  ctx.fillStyle = '#A8A4B7';
  ctx.font = '500 14px "Inter", sans-serif';
  ctx.fillText('WANTED', 60, y);
  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#FF3EA5';
  const stars = '★★★★★'.slice(0, profile.wantedLevel) + '☆☆☆☆☆'.slice(profile.wantedLevel);
  ctx.fillText(stars.slice(0, 5), 60, y + 18);
  y += 68;

  if (profile.quote) {
    ctx.fillStyle = '#A8A4B7';
    ctx.font = '500 14px "Inter", sans-serif';
    ctx.fillText('QUOTE', 60, y);
    ctx.fillStyle = '#F8F7FF';
    ctx.font = 'italic 22px "Inter", sans-serif';
    ctx.fillText(`"${profile.quote}"`, 60, y + 24, WIDTH - 120);
    y += 70;
  }

  // Barcode
  const bars = generateBarcodePattern(profile.id);
  let bx = 60;
  const barY = HEIGHT - 150;
  ctx.fillStyle = '#F8F7FF';
  bars.forEach((w) => {
    ctx.fillRect(bx, barY, w, 46);
    bx += w + 3;
  });

  // Coordinates + timestamp
  ctx.fillStyle = '#A8A4B7';
  ctx.font = '500 13px "Inter", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(generateCoordinates(profile.id), WIDTH - 60, barY);
  ctx.fillText(new Date(profile.createdAt).toISOString(), WIDTH - 60, barY + 20);
  ctx.textAlign = 'left';

  // Verification stamp
  ctx.save();
  ctx.translate(WIDTH - 210, 190);
  ctx.rotate(-0.35);
  ctx.strokeStyle = profile.status === 'CONFIRMED' ? '#00E5FF' : '#FF3EA5';
  ctx.lineWidth = 3;
  roundedRect(ctx, -90, -26, 180, 52, 8);
  ctx.stroke();
  ctx.fillStyle = profile.status === 'CONFIRMED' ? '#00E5FF' : '#FF3EA5';
  ctx.font = '700 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(profile.status, 0, -8);
  ctx.restore();
  ctx.textAlign = 'left';

  // Fictional disclaimer
  ctx.fillStyle = 'rgba(168,164,183,0.7)';
  ctx.font = '400 11px "Inter", sans-serif';
  ctx.fillText('FICTIONAL RECORD — LEONORA CIVIC NETWORK IS NOT A REAL AGENCY', 60, HEIGHT - 46);

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
