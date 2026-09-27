import { svgDataUrl } from '../utils/image';
import type { IdentityDistrict, IdentityRole, PresetProfile } from '../types/identity';

interface PortraitConfig {
  from: string;
  to: string;
  rim: string;
  motif: 'streaks' | 'grid' | 'fog' | 'speed' | 'glitch' | 'redacted';
}

/**
 * Builds a fully original, self-contained abstract portrait bust — no photographs,
 * no real people, no third-party artwork. Pure procedural vector shapes tuned to
 * the Leonora neon-noir palette so every preset has a distinct silhouette.
 */
function buildPortrait({ from, to, rim, motif }: PortraitConfig): string {
  const motifMarkup: Record<PortraitConfig['motif'], string> = {
    streaks: `
      <g stroke="${rim}" stroke-width="2" opacity="0.35">
        <line x1="20" y1="90" x2="90" y2="90" />
        <line x1="10" y1="110" x2="80" y2="110" />
        <line x1="24" y1="130" x2="70" y2="130" />
      </g>`,
    grid: `
      <g stroke="${rim}" stroke-width="1" opacity="0.25">
        ${Array.from({ length: 6 })
          .map((_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="300" />`)
          .join('')}
        ${Array.from({ length: 6 })
          .map((_, i) => `<line x1="0" y1="${i * 50}" x2="300" y2="${i * 50}" />`)
          .join('')}
      </g>`,
    fog: `
      <g opacity="0.5">
        <ellipse cx="80" cy="230" rx="90" ry="30" fill="${rim}" opacity="0.15" />
        <ellipse cx="220" cy="250" rx="110" ry="26" fill="${rim}" opacity="0.12" />
      </g>`,
    speed: `
      <g stroke="${rim}" stroke-width="3" stroke-linecap="round" opacity="0.4">
        <line x1="0" y1="70" x2="60" y2="70" />
        <line x1="0" y1="95" x2="45" y2="95" />
        <line x1="240" y1="150" x2="300" y2="150" />
        <line x1="255" y1="175" x2="300" y2="175" />
      </g>`,
    glitch: `
      <g opacity="0.4">
        <rect x="30" y="120" width="70" height="6" fill="${rim}" />
        <rect x="190" y="160" width="60" height="6" fill="${rim}" />
        <rect x="60" y="200" width="90" height="4" fill="${rim}" />
      </g>`,
    redacted: `
      <g fill="${rim}" opacity="0.55">
        <rect x="95" y="118" width="40" height="10" />
        <rect x="165" y="118" width="40" height="10" />
        <rect x="120" y="160" width="60" height="8" />
      </g>`,
  };

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <linearGradient id="bust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c1a26" />
      <stop offset="100%" stop-color="#0b0a10" />
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#bg)" />
  <rect width="300" height="300" fill="#07060A" opacity="0.28" />
  ${motifMarkup[motif]}
  <ellipse cx="150" cy="330" rx="150" ry="90" fill="url(#bust)" />
  <circle cx="150" cy="150" r="62" fill="url(#bust)" />
  <circle cx="150" cy="150" r="62" fill="none" stroke="${rim}" stroke-width="2" opacity="0.6" />
  <ellipse cx="150" cy="150" rx="62" ry="62" fill="none" stroke="${rim}" stroke-width="0.5" opacity="0.3" />
  <path d="M40 300 C40 210 100 250 150 250 C200 250 260 210 260 300 Z" fill="url(#bust)" stroke="${rim}" stroke-width="1.5" opacity="0.9" />
  <rect x="0" y="0" width="300" height="300" fill="none" stroke="${rim}" stroke-width="3" opacity="0.5" />
</svg>`.trim();
}

interface PresetSeed {
  id: string;
  name: string;
  archetype: string;
  role: IdentityRole;
  district: IdentityDistrict;
  description: string;
  portrait: PortraitConfig;
}

const SEEDS: PresetSeed[] = [
  {
    id: 'luna-vale',
    name: 'Luna Vale',
    archetype: 'THE DRIVER',
    role: 'Driver',
    district: 'Neon Beach',
    description: 'Knows every back road in Leonora and every reason not to use them.',
    portrait: { from: '#FF3EA5', to: '#7C3AED', rim: '#FF3EA5', motif: 'streaks' },
  },
  {
    id: 'milo-cruz',
    name: 'Milo Cruz',
    archetype: 'THE FIXER',
    role: 'Fixer',
    district: 'Downtown',
    description: 'Solves problems nobody wants written down.',
    portrait: { from: '#7C3AED', to: '#00E5FF', rim: '#00E5FF', motif: 'grid' },
  },
  {
    id: 'nova-reed',
    name: 'Nova Reed',
    archetype: 'THE GHOST',
    role: 'Street Artist',
    district: 'Old Quarter',
    description: 'Leaves the city talking and never leaves a name.',
    portrait: { from: '#00E5FF', to: '#111018', rim: '#00E5FF', motif: 'fog' },
  },
  {
    id: 'rico-vale',
    name: 'Rico Vale',
    archetype: 'THE RUNNER',
    role: 'Freelancer',
    district: 'Harbor',
    description: 'If it needs to move fast and quiet, it moves through Rico.',
    portrait: { from: '#FF3EA5', to: '#111018', rim: '#FF3EA5', motif: 'speed' },
  },
  {
    id: 'jade-monroe',
    name: 'Jade Monroe',
    archetype: 'THE DEALER',
    role: 'Hacker',
    district: 'Palm Heights',
    description: 'Trades in information the city pretends it doesn\u2019t have.',
    portrait: { from: '#7C3AED', to: '#FF3EA5', rim: '#7C3AED', motif: 'glitch' },
  },
  {
    id: 'unknown',
    name: 'UNKNOWN',
    archetype: 'THE UNKNOWN',
    role: 'Unknown',
    district: 'Downtown',
    description: 'No record. No history. The file starts with you.',
    portrait: { from: '#111018', to: '#07060A', rim: '#A8A4B7', motif: 'redacted' },
  },
];

export const PRESET_PROFILES: PresetProfile[] = SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  role: seed.role,
  archetype: seed.archetype,
  description: seed.description,
  image: svgDataUrl(buildPortrait(seed.portrait)),
  gradient: [seed.portrait.from, seed.portrait.to],
}));

export const PRESET_DISTRICTS: Record<string, IdentityDistrict> = SEEDS.reduce(
  (acc, seed) => ({ ...acc, [seed.id]: seed.district }),
  {},
);
