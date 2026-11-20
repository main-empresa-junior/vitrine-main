import { describe, expect, it } from 'vitest';

import { moveItem } from './ordering';
import { projectDraftSchema, projectPublishSchema, schemaFor, TEXT_LIMITS } from './schema';
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

describe('draft and publish schemas', () => {
  const complete = {
    name: 'Engasguei',
    slug: 'engasguei',
    client: 'SAMU',
    year: 2026,
    type: 'app',
    summary: 'Alerta de engasgo.',
    description: 'Envia a localização e a ficha médica aos contatos.',
    technologies: ['Kotlin'],
    developers: ['Ana'],
    features: [
      { title: 'Alerta', description: 'Um toque envia o alerta.' },
      { title: 'Ficha médica', description: 'Dados salvos no aparelho.' },
      { title: 'Guia', description: 'Manobra passo a passo.' },
    ],
    palette: { primary: '#FF6B5B', accent: '#FFE3DC', background: '#4A0B18' },
    texture: 'rocky',
    hasRing: false,
    published: true,
    images: [{ path: 'b1c2-d3.png', alt: 'Tela inicial' }],
  };
  const incomplete = {
    ...complete,
    client: '',
    summary: '',
    description: '',
    technologies: [],
    developers: [],
    features: [{ title: 'Alerta', description: '' }],
    images: [],
    published: false,
  };

  it('accepts a complete project for publishing', () => {
    expect(projectPublishSchema.safeParse(complete).success).toBe(true);
  });

  it('accepts an incomplete draft', () => {
    expect(projectDraftSchema.safeParse(incomplete).success).toBe(true);
  });

  it('lists every missing field when publishing an incomplete project', () => {
    const result = projectPublishSchema.safeParse({ ...incomplete, published: true });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((issue) => issue.path.join('.'));
    expect(paths).toEqual(
      expect.arrayContaining([
        'client',
        'summary',
        'description',
        'technologies',
        'developers',
        'features',
        'features.0.description',
        'images',
      ]),
    );
  });

  it('enforces the text limits in both schemas', () => {
    const tooLong = { ...complete, name: 'x'.repeat(TEXT_LIMITS.name + 1) };
    expect(projectDraftSchema.safeParse(tooLong).success).toBe(false);
    expect(projectPublishSchema.safeParse(tooLong).success).toBe(false);
  });

  it('picks the schema from the published flag', () => {
    expect(schemaFor(true)).toBe(projectPublishSchema);
    expect(schemaFor(false)).toBe(projectDraftSchema);
  });

  it('still requires a name for drafts', () => {
    expect(projectDraftSchema.safeParse({ ...incomplete, name: ' ' }).success).toBe(false);
  });

  it('rejects invalid slug, color and image path', () => {
    expect(projectDraftSchema.safeParse({ ...complete, slug: 'Com Espaço' }).success).toBe(false);
    expect(
      projectDraftSchema.safeParse({
        ...complete,
        palette: { ...complete.palette, primary: 'red' },
      }).success,
    ).toBe(false);
    expect(
      projectDraftSchema.safeParse({ ...complete, images: [{ path: '../secret.png', alt: 'x' }] })
        .success,
    ).toBe(false);
    expect(
      projectDraftSchema.safeParse({ ...complete, images: [{ path: 'seed/tela-1.png', alt: 'x' }] })
        .success,
    ).toBe(true);
  });
});
