import { describe, expect, it } from 'vitest';

import { damp, fadeClasses } from './motion';

describe('damp', () => {
  it('moves toward the target without overshooting', () => {
    const next = damp(0, 10, 0.5, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
  });

  it('does not depend on the frame rate', () => {
    let fast = 0;
    for (let frame = 0; frame < 120; frame++) fast = damp(fast, 10, 0.5, 1 / 120);
    let slow = 0;
    for (let frame = 0; frame < 30; frame++) slow = damp(slow, 10, 0.5, 1 / 30);
    expect(fast).toBeCloseTo(slow, 6);
  });

  it('jumps straight to the target without smoothing', () => {
    expect(damp(3, 10, 0, 1 / 60)).toBe(10);
  });
});

describe('fadeClasses', () => {
  it('hides and disables pointer events when not shown', () => {
    expect(fadeClasses(false)).toContain('opacity-0');
    expect(fadeClasses(false)).toContain('pointer-events-none');
    expect(fadeClasses(true)).toContain('opacity-100');
  });
});
