import type { PlanetPalette, PlanetTextureKind } from '@/lib/textures';
import { Constants, type Database } from '@/types/database';

export type ProjectType = Database['public']['Enums']['project_type'];

export const PROJECT_TYPES = Constants.public.Enums.project_type;
export const PLANET_TEXTURES = Constants.public.Enums.planet_texture;

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  app: 'App',
  site: 'Site',
  system: 'Sistema',
};

export const TEXTURE_LABELS: Record<PlanetTextureKind, string> = {
  gas: 'Gasoso',
  rocky: 'Rochoso',
  earth: 'Terra',
  ice: 'Gelo',
};

export type PalettePreset = {
  name: string;
  palette: PlanetPalette;
};

export const PALETTE_PRESETS: readonly PalettePreset[] = [
  { name: 'Coral', palette: { primary: '#FF6B5B', accent: '#FFE3DC', background: '#4A0B18' } },
  { name: 'Anil', palette: { primary: '#7C8BFF', accent: '#E8EBFF', background: '#1A1D66' } },
  { name: 'Âmbar', palette: { primary: '#F2A93B', accent: '#FFF2DB', background: '#5A3006' } },
  { name: 'Esmeralda', palette: { primary: '#3FD39A', accent: '#DFFFF1', background: '#0B3D30' } },
  { name: 'Magenta', palette: { primary: '#E35BC6', accent: '#FFE6F7', background: '#4A0B40' } },
];

export const PROJECTS_CACHE_TAG = 'projects';
export const PROJECT_IMAGES_BUCKET = 'project-images';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
] as const;
