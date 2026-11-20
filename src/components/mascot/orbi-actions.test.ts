import { describe, expect, it } from 'vitest';

import { ORBI_ACTIONS, pickNextAction } from './orbi-actions';

describe('pickNextAction', () => {
  it('never repeats the previous action', () => {
    for (const previous of ORBI_ACTIONS) {
      for (let i = 0; i < 20; i++) {
        expect(pickNextAction(previous, () => i / 20)).not.toBe(previous);
      }
    }
  });

  it('can pick every other action', () => {
    const picked = new Set(
      Array.from({ length: 50 }, (_, i) => pickNextAction('jump', () => i / 50)),
    );
    expect(picked).toEqual(new Set(ORBI_ACTIONS.filter((action) => action !== 'jump')));
  });

  it('stays in range when random returns 1', () => {
    expect(ORBI_ACTIONS).toContain(pickNextAction(null, () => 1));
  });
});
