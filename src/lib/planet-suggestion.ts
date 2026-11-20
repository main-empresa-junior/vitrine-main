import { contrastRatio, DARK_TEXT, hslToHex, LIGHT_TEXT } from './color';
import { seededRandom } from './noise';
import type { PlanetTextureKind } from './textures';

export type PlanetSuggestion = {
  texture: PlanetTextureKind;
  hasRing: boolean;
  colorPrimary: string;
  colorAccent: string;
  colorBackground: string;
};

type Range = readonly [min: number, max: number];
type Harmony = 'analogous' | 'complementary';

type TextureStyle = {
  hues: readonly Range[];
  saturation: Range;
  lightness: Range;
  harmonies: readonly Harmony[];
};

// Tendências de cor por textura: gelo frio e claro, rocha terrosa, terra verde-azulada, gás livre.
const TEXTURE_STYLES: Record<PlanetTextureKind, TextureStyle> = {
  gas: {
    hues: [[0, 360]],
    saturation: [70, 95],
    lightness: [52, 62],
    harmonies: ['analogous', 'complementary'],
  },
  rocky: { hues: [[8, 45]], saturation: [35, 60], lightness: [50, 60], harmonies: ['analogous'] },
  earth: { hues: [[90, 215]], saturation: [50, 75], lightness: [46, 58], harmonies: ['analogous'] },
  ice: { hues: [[180, 245]], saturation: [45, 75], lightness: [62, 74], harmonies: ['analogous'] },
};

const TEXTURES = Object.keys(TEXTURE_STYLES) as PlanetTextureKind[];

const ACCENT_HUE_SHIFT: Range = [10, 30];
const ACCENT_SATURATION_DROP = 12;
const ACCENT_LIGHTNESS: Range = [84, 92];
const BACKGROUND_SATURATION: Range = [35, 55];
const BACKGROUND_LIGHTNESS: Range = [8, 14];
const BACKGROUND_HUE_SHIFT: Record<Harmony, number> = { analogous: -20, complementary: 180 };
const RING_CHANCE = 0.4;
const MIN_CONTRAST = 4.5;
const LIGHTNESS_STEP = 1;

type Random = () => number;

function between(random: Random, [min, max]: Range): number {
  return min + random() * (max - min);
}

function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}

// Ajusta a luminosidade aos poucos, na direção dada, até o contraste passar.
function withContrast(
  hue: number,
  saturation: number,
  lightness: number,
  text: string,
  direction: 1 | -1,
): string {
  let current = lightness;
  let color = hslToHex([hue, saturation, current]);
  while (contrastRatio(color, text) < MIN_CONTRAST && current > 0 && current < 100) {
    current += direction * LIGHTNESS_STEP;
    color = hslToHex([hue, saturation, current]);
  }
  return color;
}

export function suggestPlanet(
  options: { seed?: number; previous?: PlanetSuggestion | null } = {},
): PlanetSuggestion {
  const random: Random = options.seed === undefined ? Math.random : seededRandom(options.seed);
  const candidates = TEXTURES.filter((texture) => texture !== options.previous?.texture);
  const texture = pick(random, candidates);
  const style = TEXTURE_STYLES[texture];
  const hue = between(random, pick(random, style.hues));
  const saturation = between(random, style.saturation);
  const harmony = pick(random, style.harmonies);
  const accentShift = between(random, ACCENT_HUE_SHIFT) * (random() < 0.5 ? -1 : 1);

  return {
    texture,
    hasRing: random() < RING_CHANCE,
    colorPrimary: withContrast(hue, saturation, between(random, style.lightness), DARK_TEXT, 1),
    colorAccent: hslToHex([
      hue + accentShift,
      saturation - ACCENT_SATURATION_DROP,
      between(random, ACCENT_LIGHTNESS),
    ]),
    colorBackground: withContrast(
      hue + BACKGROUND_HUE_SHIFT[harmony],
      between(random, BACKGROUND_SATURATION),
      between(random, BACKGROUND_LIGHTNESS),
      LIGHT_TEXT,
      -1,
    ),
  };
}
