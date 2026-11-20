import type { Database } from '@/types/database';

import { BLACK, hexToRgb, mixRgb, rampRgb, type Rgb, WHITE } from './color';
import { createNoise, seededRandom } from './noise';

export type PlanetTextureKind = Database['public']['Enums']['planet_texture'];

export type PlanetPalette = {
  primary: string;
  accent: string;
  background: string;
};

export type PixelBuffer = {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
};

export const TEXTURE_WIDTH = 512;
export const TEXTURE_HEIGHT = 256;

const CRATER_COUNT = 46;
const CRATER_SHADE = 0.28;
const CRATER_RIM_LIGHT = 0.22;
const POLAR_CAP_START = { earth: 0.82, ice: 0.78 } as const;
const CLOUD_THRESHOLD = 0.55;

type ColorAt = (u: number, v: number, latitude: number) => Rgb;

function createBuffer(width: number, height: number): PixelBuffer {
  return { width, height, data: new Uint8ClampedArray(width * height * 4) };
}

function paint(buffer: PixelBuffer, colorAt: ColorAt): void {
  const { width, height, data } = buffer;
  for (let y = 0; y < height; y++) {
    const v = y / height;
    const latitude = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < width; x++) {
      const color = colorAt(x / width, v, latitude);
      const k = (y * width + x) * 4;
      data[k] = color[0];
      data[k + 1] = color[1];
      data[k + 2] = color[2];
      data[k + 3] = 255;
    }
  }
}

function blendPixel(buffer: PixelBuffer, x: number, y: number, target: Rgb, amount: number): void {
  const wrappedX = ((Math.round(x) % buffer.width) + buffer.width) % buffer.width;
  const k = (Math.round(y) * buffer.width + wrappedX) * 4;
  const current: Rgb = [buffer.data[k], buffer.data[k + 1], buffer.data[k + 2]];
  const mixed = mixRgb(current, target, amount);
  buffer.data[k] = mixed[0];
  buffer.data[k + 1] = mixed[1];
  buffer.data[k + 2] = mixed[2];
}

function addCraters(buffer: PixelBuffer, seed: number): void {
  const random = seededRandom(seed * 13);
  for (let c = 0; c < CRATER_COUNT; c++) {
    const cx = random() * buffer.width;
    const cy = 20 + random() * (buffer.height - 40);
    const r = 2 + random() * 9;
    for (let dy = -r - 2; dy <= r + 2; dy++) {
      for (let dx = -r - 2; dx <= r + 2; dx++) {
        const y = cy + dy;
        if (y < 0 || y >= buffer.height) continue;
        if (Math.hypot(dx, dy) <= r) blendPixel(buffer, cx + dx, y, BLACK, CRATER_SHADE);
        // Borda iluminada no alto à esquerda, como se o sol viesse dali.
        const rimDx = dx + r * 0.15;
        const rimDy = dy + r * 0.15;
        const angle = Math.atan2(rimDy, rimDx) + Math.PI * 2;
        const isOnRimArc = (angle % (Math.PI * 2)) / Math.PI;
        if (
          Math.abs(Math.hypot(rimDx, rimDy) - r) < 0.6 &&
          isOnRimArc >= 0.9 &&
          isOnRimArc <= 1.7
        ) {
          blendPixel(buffer, cx + dx, y, WHITE, CRATER_RIM_LIGHT);
        }
      }
    }
  }
}

function addClouds(buffer: PixelBuffer, seed: number): void {
  const fbm = createNoise(seed + 31);
  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      const density = Math.max(
        0,
        (fbm(x / buffer.width, (y / buffer.height) * 2, 5, 6) - CLOUD_THRESHOLD) * 2.4,
      );
      if (density > 0) blendPixel(buffer, x, y, WHITE, Math.min(1, density));
    }
  }
}

function surfaceColor(kind: PlanetTextureKind, palette: PlanetPalette, seed: number): ColorAt {
  const light = hexToRgb(palette.accent);
  const main = hexToRgb(palette.primary);
  const deep = hexToRgb(palette.background);
  const shadow = mixRgb(deep, BLACK, 0.35);
  const fbm = createNoise(seed);
  const detailFbm = createNoise(seed + 7);

  if (kind === 'gas') {
    return (u, v) => {
      const turbulence = fbm(u, v * 3, 5, 6);
      const band = Math.sin((v * 16 + turbulence * 3.4) * Math.PI) * 0.5 + 0.5;
      const fine = detailFbm(u, v * 8, 4, 12);
      return rampRgb([shadow, deep, main, light, main], band * 0.75 + fine * 0.25);
    };
  }

  if (kind === 'ice') {
    return (u, v, latitude) => {
      const height = fbm(u, v * 2, 5, 5);
      const crack = 1 - Math.abs(detailFbm(u, v * 2, 4, 8) - 0.5) * 2;
      let color = rampRgb([deep, main, light, WHITE], 0.45 + height * 0.5);
      if (crack > 0.94) color = mixRgb(color, deep, 0.6);
      return polarCap(color, latitude, POLAR_CAP_START.ice);
    };
  }

  const isEarth = kind === 'earth';
  return (u, v, latitude) => {
    const height = fbm(u, v * 2, 6, 4);
    const detail = detailFbm(u, v * 2, 5, 16);
    const lowlands = isEarth ? [deep, mixRgb(deep, main, 0.4)] : [shadow, deep];
    let color =
      height < 0.5 ? rampRgb(lowlands, height / 0.5) : rampRgb([main, light], (height - 0.5) / 0.5);
    color = mixRgb(color, BLACK, (1 - detail) * 0.25);
    return isEarth ? polarCap(color, latitude, POLAR_CAP_START.earth) : color;
  };
}

function polarCap(color: Rgb, latitude: number, start: number): Rgb {
  return latitude > start ? mixRgb(color, WHITE, Math.min(1, (latitude - start) * 6)) : color;
}

export function generatePlanetPixels(
  kind: PlanetTextureKind,
  palette: PlanetPalette,
  seed: number,
  width = TEXTURE_WIDTH,
  height = TEXTURE_HEIGHT,
): PixelBuffer {
  const buffer = createBuffer(width, height);
  paint(buffer, surfaceColor(kind, palette, seed));
  if (kind === 'rocky') addCraters(buffer, seed);
  if (kind === 'earth' || kind === 'ice') addClouds(buffer, seed);
  return buffer;
}

export function generateSunPixels(
  stops: readonly Rgb[],
  seed: number,
  width = TEXTURE_WIDTH,
  height = TEXTURE_HEIGHT,
): PixelBuffer {
  const buffer = createBuffer(width, height);
  const fbm = createNoise(99 + seed);
  const fine = createNoise(5 + seed);
  paint(buffer, (u, v) => {
    const n = fbm(u, v * 2, 6, 8) * 0.7 + fine(u, v * 2, 4, 30) * 0.3;
    return rampRgb(stops, n * 1.2 - 0.05);
  });
  return buffer;
}

export function seedFromText(text: string): number {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 100003;
  return hash;
}
