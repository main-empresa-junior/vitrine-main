import { seededRandom } from './noise';

export type StarLayer = {
  count: number;
  minRadius: number;
  maxRadius: number;
  // Faixa estreita em torno do equador, como a Via Láctea.
  isBand?: boolean;
  seed: number;
};

export type StarBuffers = {
  positions: Float32Array<ArrayBuffer>;
  colors: Float32Array<ArrayBuffer>;
};

const STAR_TINTS = [
  [1, 1, 1],
  [0.8, 0.9, 1],
  [1, 0.92, 0.82],
  [0.75, 0.85, 1],
] as const;
const BAND_SPREAD = 0.35;

export function generateStars({
  count,
  minRadius,
  maxRadius,
  isBand = false,
  seed,
}: StarLayer): StarBuffers {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = minRadius + random() * (maxRadius - minRadius);
    const theta = random() * Math.PI * 2;
    const phi = isBand ? Math.PI / 2 + (random() - 0.5) * BAND_SPREAD : Math.acos(2 * random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const tint = STAR_TINTS[Math.floor(random() * STAR_TINTS.length)];
    const brightness = 0.5 + random() * 0.5;
    colors[i * 3] = tint[0] * brightness;
    colors[i * 3 + 1] = tint[1] * brightness;
    colors[i * 3 + 2] = tint[2] * brightness;
  }
  return { positions, colors };
}
