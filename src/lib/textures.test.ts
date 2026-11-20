import { describe, expect, it } from 'vitest';

import {
  contrastRatio,
  hexToRgb,
  mixRgb,
  projectPageBackground,
  rampRgb,
  readableTextColor,
  rgbToHex,
} from './color';
import { createNoise } from './noise';
import { generatePlanetPixels, generateSunPixels, seedFromText } from './textures';

const PALETTE = { primary: '#FF6B5B', accent: '#FFE3DC', background: '#4A0B18' };

describe('color helpers', () => {
  it('converts hex to rgb and back', () => {
    expect(hexToRgb('#7B61D9')).toEqual([123, 97, 217]);
    expect(rgbToHex([123, 97, 217])).toBe('#7B61D9');
  });

  it('mixes colors linearly', () => {
    expect(mixRgb([0, 0, 0], [200, 100, 50], 0.5)).toEqual([100, 50, 25]);
  });

  it('ramps through stops and clamps the ends', () => {
    const stops = [
      [0, 0, 0],
      [100, 100, 100],
      [200, 200, 200],
    ] as const;
    expect(rampRgb(stops, -1)).toEqual([0, 0, 0]);
    expect(rampRgb(stops, 0.5)).toEqual([100, 100, 100]);
    expect(rampRgb(stops, 0.75)).toEqual([150, 150, 150]);
    expect(rampRgb(stops, 2)).toEqual([200, 200, 200]);
  });

  it('computes WCAG contrast', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
  });
});

describe('createNoise', () => {
  const fbm = createNoise(42);

  it('is deterministic for the same seed', () => {
    expect(createNoise(42)(0.3, 0.7, 4, 6)).toBe(fbm(0.3, 0.7, 4, 6));
  });

  it('stays inside [0, 1]', () => {
    for (let i = 0; i < 200; i++) {
      const value = fbm(i / 37, i / 53, 5, 6);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('wraps horizontally so the sphere has no seam', () => {
    for (const y of [0.1, 0.4, 0.9]) {
      expect(fbm(0, y, 5, 6)).toBeCloseTo(fbm(1, y, 5, 6), 6);
    }
  });

  it('is continuous between neighbouring samples', () => {
    expect(Math.abs(fbm(0.5, 0.5, 4, 6) - fbm(0.5001, 0.5, 4, 6))).toBeLessThan(0.01);
  });
});

describe('texture generation', () => {
  it.each(['gas', 'rocky', 'earth', 'ice'] as const)('fills an opaque %s texture', (kind) => {
    const { data, width, height } = generatePlanetPixels(kind, PALETTE, 7, 64, 32);
    expect(data).toHaveLength(width * height * 4);
    for (let k = 3; k < data.length; k += 4) expect(data[k]).toBe(255);
  });

  it('is deterministic per seed', () => {
    const a = generatePlanetPixels('gas', PALETTE, 3, 32, 16).data;
    const b = generatePlanetPixels('gas', PALETTE, 3, 32, 16).data;
    expect(a).toEqual(b);
  });

  it('generates a sun texture from color stops', () => {
    const { data } = generateSunPixels(
      [
        [255, 120, 10],
        [255, 245, 200],
      ],
      1,
      16,
      8,
    );
    expect(data[0]).toBeGreaterThan(200);
  });

  it('derives a stable seed from text', () => {
    expect(seedFromText('engasguei')).toBe(seedFromText('engasguei'));
    expect(seedFromText('engasguei')).not.toBe(seedFromText('outro'));
  });
});

describe('readableTextColor', () => {
  it('picks dark text on light colors and white on dark ones', () => {
    expect(readableTextColor('#FFE3DC')).toBe('#0A0F33');
    expect(readableTextColor('#1A1D66')).toBe('#FFFFFF');
  });
});

describe('projectPageBackground', () => {
  it('keeps white text readable even for a light project color', () => {
    expect(contrastRatio(projectPageBackground('#FFFFFF'), '#EEF1FF')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(projectPageBackground('#4A0B18'), '#B9C2EE')).toBeGreaterThanOrEqual(4.5);
  });
});
