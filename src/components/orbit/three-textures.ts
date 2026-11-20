import { CanvasTexture, DataTexture, SRGBColorSpace, type Texture } from 'three';

import type { Rgb } from '@/lib/color';
import {
  generatePlanetPixels,
  generateSunPixels,
  type PixelBuffer,
  type PlanetPalette,
  type PlanetTextureKind,
} from '@/lib/textures';

// shortcut: o cache nunca é esvaziado; serve enquanto a vitrine tiver poucas dezenas de projetos.
const cache = new Map<string, Texture>();

function memo(key: string, create: () => Texture): Texture {
  const cached = cache.get(key);
  if (cached) return cached;
  const texture = create();
  cache.set(key, texture);
  return texture;
}

function toTexture({ data, width, height }: PixelBuffer): DataTexture {
  // DataTexture começa pela linha de baixo; a imagem gerada começa pela de cima.
  const flipped = new Uint8ClampedArray(data.length);
  const rowSize = width * 4;
  for (let y = 0; y < height; y++) {
    flipped.set(data.subarray(y * rowSize, (y + 1) * rowSize), (height - 1 - y) * rowSize);
  }
  const texture = new DataTexture(flipped, width, height);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function planetTexture(
  kind: PlanetTextureKind,
  palette: PlanetPalette,
  seed: number,
): Texture {
  const key = `planet|${kind}|${palette.primary}|${palette.accent}|${palette.background}|${seed}`;
  return memo(key, () => toTexture(generatePlanetPixels(kind, palette, seed)));
}

export function sunTexture(stops: readonly Rgb[], seed: number): Texture {
  return memo(`sun|${stops.join('|')}|${seed}`, () => toTexture(generateSunPixels(stops, seed)));
}

export function glowTexture(color: string): Texture {
  return memo(`glow|${color}`, () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    if (context) {
      const half = size / 2;
      const gradient = context.createRadialGradient(half, half, 0, half, half, half);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.25, `${color}73`);
      gradient.addColorStop(1, `${color}00`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    }
    return new CanvasTexture(canvas);
  });
}
