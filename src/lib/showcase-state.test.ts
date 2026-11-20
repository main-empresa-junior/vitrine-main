import { describe, expect, it } from 'vitest';

import { getShowcaseState } from './showcase-state';

describe('getShowcaseState', () => {
  it('is empty without projects', () => {
    expect(getShowcaseState([])).toBe('empty');
  });

  it('ignores drafts', () => {
    expect(getShowcaseState([{ published: false }, { published: false }])).toBe('empty');
  });

  it('is populated with a single published project', () => {
    expect(getShowcaseState([{ published: false }, { published: true }])).toBe('populated');
  });
});
