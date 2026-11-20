import { describe, expect, it } from 'vitest';

import { boundingRadius, cameraDistanceToFit, RING_OUTER_SCALE } from './planet-framing';

const FOV = 40;
const MARGIN = 1.1;

function angularRadius(radius: number, distance: number): number {
  return (Math.asin(radius / distance) * 180) / Math.PI;
}

describe('planet framing', () => {
  it('uses the outer ring radius when the planet has a ring', () => {
    expect(boundingRadius(1, true)).toBe(RING_OUTER_SCALE);
    expect(boundingRadius(1, true)).toBeGreaterThan(boundingRadius(1, false));
  });

  it.each([0.46, 0.75, 1, 1.6])('fits the whole ringed planet in a %f aspect frame', (aspect) => {
    const radius = boundingRadius(1, true);
    const distance = cameraDistanceToFit({
      boundingRadius: radius,
      verticalFovDegrees: FOV,
      aspect,
      margin: MARGIN,
    });
    const horizontalFov = (2 * Math.atan(Math.tan((FOV * Math.PI) / 360) * aspect) * 180) / Math.PI;
    const visible = angularRadius(radius, distance);
    expect(visible).toBeLessThan(FOV / 2);
    expect(visible).toBeLessThan(horizontalFov / 2);
  });

  it('moves the camera back for narrow frames and ringed planets', () => {
    const base = { verticalFovDegrees: FOV, margin: MARGIN };
    const wide = cameraDistanceToFit({ ...base, boundingRadius: 2, aspect: 1.6 });
    const narrow = cameraDistanceToFit({ ...base, boundingRadius: 2, aspect: 0.5 });
    expect(narrow).toBeGreaterThan(wide);
    const plain = cameraDistanceToFit({
      ...base,
      boundingRadius: boundingRadius(1, false),
      aspect: 1,
    });
    const ringed = cameraDistanceToFit({
      ...base,
      boundingRadius: boundingRadius(1, true),
      aspect: 1,
    });
    expect(ringed).toBeGreaterThan(plain);
  });
});
