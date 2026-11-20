import { describe, expect, it } from 'vitest';

import { contrastRatio, DARK_TEXT, hexToHsl, hslToHex, LIGHT_TEXT } from './color';
import { suggestPlanet } from './planet-suggestion';

const HEX = /^#[0-9A-F]{6}$/;
const SEEDS = Array.from({ length: 300 }, (_, i) => i * 7 + 1);

describe('hsl conversions', () => {
  it.each(['#FF6B5B', '#00CFC1', '#7B61D9', '#0A0F33', '#FFFFFF'])('round-trips %s', (hex) => {
    expect(hslToHex(hexToHsl(hex))).toBe(hex);
  });
});

describe('suggestPlanet', () => {
  it('returns every field in the form format', () => {
    const suggestion = suggestPlanet({ seed: 42 });
    expect(['gas', 'rocky', 'earth', 'ice']).toContain(suggestion.texture);
    expect(typeof suggestion.hasRing).toBe('boolean');
    expect(suggestion.colorPrimary).toMatch(HEX);
    expect(suggestion.colorAccent).toMatch(HEX);
    expect(suggestion.colorBackground).toMatch(HEX);
  });

  it('is deterministic for the same seed', () => {
    expect(suggestPlanet({ seed: 9 })).toEqual(suggestPlanet({ seed: 9 }));
  });

  it.each(SEEDS)('guarantees readable contrast for seed %i', (seed) => {
    const suggestion = suggestPlanet({ seed });
    expect(contrastRatio(LIGHT_TEXT, suggestion.colorBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(DARK_TEXT, suggestion.colorPrimary)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the background very dark and the accent lighter than the primary', () => {
    for (const seed of SEEDS) {
      const { colorPrimary, colorAccent, colorBackground } = suggestPlanet({ seed });
      expect(hexToHsl(colorBackground)[2]).toBeLessThan(20);
      expect(hexToHsl(colorAccent)[2]).toBeGreaterThan(hexToHsl(colorPrimary)[2]);
    }
  });

  it('never repeats the previous texture', () => {
    for (const seed of SEEDS) {
      const previous = suggestPlanet({ seed });
      expect(suggestPlanet({ seed: seed + 1, previous }).texture).not.toBe(previous.texture);
    }
  });

  it('keeps ice suggestions in cool hues', () => {
    const iceHues = SEEDS.map((seed) => suggestPlanet({ seed }))
      .filter((suggestion) => suggestion.texture === 'ice')
      .map((suggestion) => hexToHsl(suggestion.colorPrimary)[0]);
    expect(iceHues.length).toBeGreaterThan(0);
    for (const hue of iceHues) expect(hue).toBeGreaterThanOrEqual(175);
  });

  it('adds a ring to some suggestions but not all', () => {
    const rings = SEEDS.map((seed) => suggestPlanet({ seed }).hasRing);
    expect(rings).toContain(true);
    expect(rings).toContain(false);
  });
});
