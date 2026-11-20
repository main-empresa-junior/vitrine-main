import { describe, expect, it } from 'vitest';

import { moveItem } from './ordering';
import { projectFormSchema } from './schema';
import { SLUG_PATTERN, slugify } from './slug';

describe('slugify', () => {
  it.each([
    ['Engasguei', 'engasguei'],
    ['Vitrine da Main 2.0', 'vitrine-da-main-2-0'],
    ['  Ação & Reação!  ', 'acao-reacao'],
    ['Órbita—Ciência', 'orbita-ciencia'],
  ])('turns %s into %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
    expect(slugify(input)).toMatch(SLUG_PATTERN);
  });
});

describe('moveItem', () => {
  it('swaps with the neighbour', () => {
    expect(moveItem(['a', 'b', 'c'], 1, 'up')).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 1, 'down')).toEqual(['a', 'c', 'b']);
  });

  it('skips items of another group', () => {
    const items = ['p1', 'd1', 'p2', 'd2'];
    const sameGroup = (a: string, b: string) => a[0] === b[0];
    expect(moveItem(items, 2, 'up', sameGroup)).toEqual(['p2', 'd1', 'p1', 'd2']);
    expect(moveItem(items, 3, 'down', sameGroup)).toEqual(items);
  });

  it('keeps the order at the edges', () => {
    expect(moveItem(['a', 'b'], 0, 'up')).toEqual(['a', 'b']);
    expect(moveItem(['a', 'b'], 1, 'down')).toEqual(['a', 'b']);
  });
});

describe('projectFormSchema', () => {
  const valid = {
    name: 'Engasguei',
    slug: 'engasguei',
    client: 'SAMU',
    year: 2026,
    type: 'app',
    summary: 'Alerta de engasgo.',
    description: '',
    technologies: ['Kotlin'],
    developers: [],
    features: [{ title: 'Alerta', description: '' }],
    palette: { primary: '#FF6B5B', accent: '#FFE3DC', background: '#4A0B18' },
    texture: 'rocky',
    hasRing: false,
    published: false,
    images: [{ path: 'b1c2-d3.png', alt: 'Tela inicial' }],
  };

  it('accepts a complete project', () => {
    expect(projectFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid slug, color and image path', () => {
    expect(projectFormSchema.safeParse({ ...valid, slug: 'Com Espaço' }).success).toBe(false);
    expect(
      projectFormSchema.safeParse({ ...valid, palette: { ...valid.palette, primary: 'red' } })
        .success,
    ).toBe(false);
    expect(
      projectFormSchema.safeParse({ ...valid, images: [{ path: '../secret', alt: 'x' }] }).success,
    ).toBe(false);
  });

  it('requires alt text for every image', () => {
    expect(
      projectFormSchema.safeParse({ ...valid, images: [{ path: 'a.png', alt: '  ' }] }).success,
    ).toBe(false);
  });
});
