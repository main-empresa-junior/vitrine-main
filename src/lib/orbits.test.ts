import { describe, expect, it } from 'vitest';

import {
  nearestStop,
  overviewPose,
  planetAngle,
  planetLocalPosition,
  planetPose,
  planetRadius,
  poseBetween,
  quadraticBezier,
  splitIntoOrbits,
  systemCenter,
} from './orbits';

describe('splitIntoOrbits', () => {
  it('groups up to 7 projects per orbit, keeping the order', () => {
    const items = Array.from({ length: 16 }, (_, i) => i);
    const orbits = splitIntoOrbits(items);
    expect(orbits.map((orbit) => orbit.length)).toEqual([7, 7, 2]);
    expect(orbits.flat()).toEqual(items);
  });

  it('returns no orbits for no projects', () => {
    expect(splitIntoOrbits([])).toEqual([]);
  });

  it('accepts a custom size', () => {
    expect(splitIntoOrbits([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
  });
});

describe('planet layout', () => {
  it('places each system further away', () => {
    expect(systemCenter(0).map(Math.abs)).toEqual([0, 0, 0]);
    expect(systemCenter(2)[2]).toBeLessThan(systemCenter(1)[2]);
  });

  it('keeps planets on their orbit radius', () => {
    const [x, , z] = planetLocalPosition(3, 120);
    expect(Math.hypot(x, z)).toBeCloseTo(9 + 3 * 5.2, 6);
  });

  it('moves outer planets slower', () => {
    const inner = planetAngle(0, 100) - planetAngle(0, 0);
    const outer = planetAngle(6, 100) - planetAngle(6, 0);
    expect(outer).toBeLessThan(inner);
  });

  it('gives gas giants a bigger radius than rocky planets', () => {
    expect(planetRadius('gas', 500)).toBeGreaterThan(planetRadius('rocky', 500));
  });
});

describe('camera poses', () => {
  const center = [0, 0, 0] as const;

  it('looks down at the system in the overview', () => {
    const pose = overviewPose(center, false);
    expect(pose.position[1]).toBeGreaterThan(pose.lookAt[1]);
  });

  it('stops on the sunlit side of the planet', () => {
    const planet = [20, 0, 0] as const;
    const pose = planetPose(center, planet, 1, false, false);
    const cameraDistanceToSun = Math.hypot(pose.position[0], pose.position[2]);
    expect(cameraDistanceToSun).toBeLessThan(20);
  });

  it('curves around the sun between stops', () => {
    const from = { position: [30, 5, 0] as const, lookAt: [0, 0, 0] as const };
    const to = { position: [-30, 5, 0] as const, lookAt: [0, 0, 0] as const };
    const middle = poseBetween(center, from, to, 0.5);
    expect(Math.hypot(middle.position[0], middle.position[2])).toBeGreaterThan(5);
    expect(poseBetween(center, from, to, 0).position).toEqual(from.position);
    expect(poseBetween(center, from, to, 1).position).toEqual(to.position);
  });

  it('evaluates a quadratic bezier', () => {
    expect(quadraticBezier([0, 0, 0], [1, 2, 0], [2, 0, 0], 0.5)).toEqual([1, 1, 0]);
  });
});

describe('nearestStop', () => {
  it('returns the stop only when close enough', () => {
    expect(nearestStop(2.05)).toBe(2);
    expect(nearestStop(1.5)).toBeNull();
    expect(nearestStop(0)).toBe(0);
  });
});
