import { svgDataUrl } from '../utils/image';
import type { ReactionCategory } from '../types/identity';

export const NPC_COMMENTS: string[] = [
  'Never seen this face downtown.',
  'Looks like trouble.',
  'Someone knows this person.',
  'That\u2019s a Neon Beach look if I\u2019ve ever seen one.',
  'Careful who you show that to.',
  'File this one under "watch closely."',
  'The Harbor crowd is already talking.',
  'New face, old instincts.',
  'This one won\u2019t stay unconfirmed for long.',
  'Leonora remembers everything.',
];

interface NotificationTemplate {
  category: ReactionCategory;
  message: string;
}

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  { category: 'SURVEILLANCE', message: 'Someone in Harbor District viewed your file.' },
  { category: 'SURVEILLANCE', message: 'A traffic camera flagged your last known location.' },
  { category: 'STREET', message: 'Your profile was mentioned on Nightwire.' },
  { category: 'STREET', message: 'A courier is asking about you in Old Quarter.' },
  { category: 'NIGHTLIFE', message: 'Your file was spotted at a Neon Beach rooftop.' },
  { category: 'NIGHTLIFE', message: 'Someone bought a round in your name.' },
  { category: 'UNDERGROUND', message: 'A stranger saved your identity.' },
  { category: 'UNDERGROUND', message: 'Your record was cross-referenced by an unknown source.' },
];

export interface SamplePost {
  id: string;
  handle: string;
  alias: string;
  district: string;
  caption: string;
  image: string;
  likes: number;
  views: number;
}

function samplePortrait(from: string, to: string, seed: number): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#g${seed})" />
  <rect width="300" height="300" fill="#07060A" opacity="0.3" />
  <circle cx="${90 + seed * 12}" cy="${70 + seed * 6}" r="70" fill="#07060A" opacity="0.25" />
  <path d="M30 300 C30 200 100 240 150 240 C200 240 270 200 270 300 Z" fill="#0b0a10" opacity="0.85" />
  <circle cx="150" cy="140" r="58" fill="#0b0a10" opacity="0.85" />
  <rect width="300" height="300" fill="none" stroke="${to}" stroke-width="3" opacity="0.4" />
</svg>`.trim();
  return svgDataUrl(svg);
}

export const SAMPLE_NIGHTWIRE_POSTS: SamplePost[] = [
  {
    id: 'sample-1',
    handle: '@cinder_row',
    alias: 'Cinder Row',
    district: 'Neon Beach',
    caption: 'Different lights, same instincts.',
    image: samplePortrait('#FF3EA5', '#7C3AED', 1),
    likes: 412,
    views: 2600,
  },
  {
    id: 'sample-2',
    handle: '@marlowe_static',
    alias: 'Marlowe Static',
    district: 'Downtown',
    caption: 'Filed under: complicated.',
    image: samplePortrait('#7C3AED', '#00E5FF', 2),
    likes: 189,
    views: 1400,
  },
  {
    id: 'sample-3',
    handle: '@harbor_echo',
    alias: 'Harbor Echo',
    district: 'Harbor',
    caption: 'The water keeps better secrets than the city does.',
    image: samplePortrait('#00E5FF', '#111018', 3),
    likes: 601,
    views: 3800,
  },
  {
    id: 'sample-4',
    handle: '@palm_static',
    alias: 'Palm Static',
    district: 'Palm Heights',
    caption: 'New face. Same city. Different rules.',
    image: samplePortrait('#FF3EA5', '#00E5FF', 4),
    likes: 275,
    views: 1900,
  },
  {
    id: 'sample-5',
    handle: '@quarter_low',
    alias: 'Quarter Low',
    district: 'Old Quarter',
    caption: 'Some files are better left unconfirmed.',
    image: samplePortrait('#7C3AED', '#FF3EA5', 5),
    likes: 344,
    views: 2100,
  },
  {
    id: 'sample-6',
    handle: '@midnight_reel',
    alias: 'Midnight Reel',
    district: 'Neon Beach',
    caption: 'They only see what I show them.',
    image: samplePortrait('#00E5FF', '#7C3AED', 6),
    likes: 528,
    views: 3300,
  },
];
