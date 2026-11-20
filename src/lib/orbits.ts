import type { PlanetTextureKind } from './textures';

export type Vec3 = readonly [number, number, number];

export type CameraPose = {
  position: Vec3;
  lookAt: Vec3;
};

export const PROJECTS_PER_ORBIT = 7;
export const NARROW_SCREEN_WIDTH = 760;

const FIRST_PLANET_DISTANCE = 9;
const PLANET_DISTANCE_STEP = 5.2;
const FIRST_PLANET_ANGLE = -0.5;
const PLANET_ANGLE_STEP = 0.85;
const BASE_ORBIT_SPEED = 0.012;
const ORBIT_SPEED_SCALE = 0.15;

const BASE_RADIUS: Record<PlanetTextureKind, number> = {
  gas: 1.6,
  rocky: 1,
  earth: 1.15,
  ice: 1.1,
};
const RADIUS_VARIATION = 0.25;

export function splitIntoOrbits<T>(items: readonly T[], perOrbit = PROJECTS_PER_ORBIT): T[][] {
  const orbits: T[][] = [];
  for (let start = 0; start < items.length; start += perOrbit) {
    orbits.push(items.slice(start, start + perOrbit));
  }
  return orbits;
}

// Cada sistema fica longe e mais ao fundo do anterior, para o próximo parecer uma estrela distante.
export function systemCenter(orbitIndex: number): Vec3 {
  return [orbitIndex * 420, orbitIndex * 30, orbitIndex * -520];
}

export function planetDistance(slot: number): number {
  return FIRST_PLANET_DISTANCE + slot * PLANET_DISTANCE_STEP;
}

export function planetAngle(slot: number, elapsedSeconds: number): number {
  const speed = BASE_ORBIT_SPEED / Math.sqrt(planetDistance(slot) / FIRST_PLANET_DISTANCE);
  return FIRST_PLANET_ANGLE + slot * PLANET_ANGLE_STEP + elapsedSeconds * speed * ORBIT_SPEED_SCALE;
}

export function planetLocalPosition(slot: number, elapsedSeconds: number): Vec3 {
  const distance = planetDistance(slot);
  const angle = planetAngle(slot, elapsedSeconds);
  return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance];
}

export function planetRadius(texture: PlanetTextureKind, seed: number): number {
  const variation = ((seed % 1000) / 1000 - 0.5) * 2 * RADIUS_VARIATION;
  return BASE_RADIUS[texture] * (1 + variation);
}

export function smoothstep(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped * clamped * (3 - 2 * clamped);
}

export function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function quadraticBezier(a: Vec3, control: Vec3, b: Vec3, t: number): Vec3 {
  return lerpVec(lerpVec(a, control, t), lerpVec(control, b, t), t);
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(a: Vec3, factor: number): Vec3 {
  return [a[0] * factor, a[1] * factor, a[2] * factor];
}

function normalize(a: Vec3): Vec3 {
  const length = Math.hypot(...a) || 1;
  return scale(a, 1 / length);
}

export function overviewPose(center: Vec3, isNarrow: boolean): CameraPose {
  return {
    position: add(center, [0, isNarrow ? 46 : 30, isNarrow ? 82 : 52]),
    lookAt: add(center, [0, -2, 0]),
  };
}

// A câmera para no lado iluminado (voltada para o sol) e desloca o olhar para o planeta ficar à direita.
export function planetPose(
  center: Vec3,
  planetWorld: Vec3,
  radius: number,
  hasRing: boolean,
  isNarrow: boolean,
): CameraPose {
  const outward = normalize([planetWorld[0] - center[0], 0, planetWorld[2] - center[2]]);
  const side: Vec3 = [-outward[2], 0, outward[0]];
  const distance = radius * (hasRing ? 6.8 : 5.9);
  const position = add(
    add(add(planetWorld, scale(outward, -distance * 0.7)), scale(side, distance * 0.66)),
    [0, distance * 0.3, 0],
  );
  const forward = normalize([
    planetWorld[0] - position[0],
    planetWorld[1] - position[1],
    planetWorld[2] - position[2],
  ]);
  const right = normalize([-forward[2], 0, forward[0]]);
  const lookAt = add(planetWorld, scale(right, -distance * (isNarrow ? 0 : 0.3)));
  return { position, lookAt };
}

// Entre duas paradas, a câmera faz uma curva por fora, para não atravessar o sol.
export function poseBetween(center: Vec3, from: CameraPose, to: CameraPose, t: number): CameraPose {
  const eased = smoothstep(t);
  const middle = lerpVec(from.position, to.position, 0.5);
  const radiusFrom = Math.hypot(from.position[0] - center[0], from.position[2] - center[2]);
  const radiusTo = Math.hypot(to.position[0] - center[0], to.position[2] - center[2]);
  let radial: Vec3 = [middle[0] - center[0], 0, middle[2] - center[2]];
  if (Math.hypot(...radial) < 1e-2) radial = [1, 0, 0];
  radial = scale(normalize(radial), Math.max(radiusFrom, radiusTo) * 1.08);
  const gap = Math.hypot(
    to.position[0] - from.position[0],
    to.position[1] - from.position[1],
    to.position[2] - from.position[2],
  );
  const control: Vec3 = [center[0] + radial[0], middle[1] + gap * 0.22, center[2] + radial[2]];
  return {
    position: quadraticBezier(from.position, control, to.position, eased),
    lookAt: lerpVec(from.lookAt, to.lookAt, eased),
  };
}

export function nearestStop(progress: number, threshold = 0.18): number | null {
  const nearest = Math.round(progress);
  return Math.abs(progress - nearest) < threshold ? nearest : null;
}
