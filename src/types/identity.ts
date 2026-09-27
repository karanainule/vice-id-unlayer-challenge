export type IdentityRole =
  | 'Driver'
  | 'Fixer'
  | 'Hacker'
  | 'Street Artist'
  | 'Freelancer'
  | 'Unknown';

export type IdentityDistrict =
  | 'Neon Beach'
  | 'Downtown'
  | 'Harbor'
  | 'Palm Heights'
  | 'Old Quarter';

export type IdentityStatus = 'UNCONFIRMED' | 'CONFIRMED' | 'FLAGGED';

export interface IdentityProfile {
  id: string;
  alias: string;
  role: IdentityRole;
  district: IdentityDistrict;
  wantedLevel: number; // 1-5
  quote: string;
  image: string; // data URL or preset image reference
  createdAt: string; // ISO timestamp
  reputation: number;
  views: number;
  likes: number;
  comments: number;
  status: IdentityStatus;
}

export interface PresetProfile {
  id: string;
  name: string;
  role: IdentityRole;
  archetype: string;
  description: string;
  image: string;
  gradient: [string, string];
}

export type ReactionCategory =
  | 'SURVEILLANCE'
  | 'STREET'
  | 'NIGHTLIFE'
  | 'UNDERGROUND';

export interface CityNotification {
  id: string;
  category: ReactionCategory;
  message: string;
}

export interface NightwireComment {
  id: string;
  author: string;
  text: string;
}

export interface CreationStep {
  index: number;
  label: string;
  path: string;
}
