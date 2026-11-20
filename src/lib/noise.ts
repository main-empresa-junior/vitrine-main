const PERMUTATION_SIZE = 256;

export type Fbm = (x: number, y: number, octaves: number, baseFrequency: number) => number;

export function nextSeed(seed: number): number {
  return (seed * 9301 + 49297) % 233280;
}

export function seededRandom(seed: number): () => number {
  let state = Math.abs(Math.floor(seed)) % 233280;
  return () => {
    state = nextSeed(state);
    return state / 233280;
  };
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// Ruído de valor com período horizontal inteiro: a textura fecha sem emenda ao redor da esfera.
export function createNoise(seed: number): Fbm {
  const random = seededRandom(seed);
  const base = Array.from({ length: PERMUTATION_SIZE }, (_, i) => i);
  for (let i = PERMUTATION_SIZE - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  const perm = Uint8Array.from({ length: PERMUTATION_SIZE * 2 }, (_, i) => base[i & 255]);

  function value(x: number, y: number, period: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const x0 = ((xi % period) + period) % period;
    const x1 = (x0 + 1) % period;
    const y0 = yi & 255;
    const y1 = (yi + 1) & 255;
    const a = perm[perm[x0] + y0] / 255;
    const b = perm[perm[x1] + y0] / 255;
    const c = perm[perm[x0] + y1] / 255;
    const d = perm[perm[x1] + y1] / 255;
    const u = smoothstep(x - xi);
    const v = smoothstep(y - yi);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  return (x, y, octaves, baseFrequency) => {
    let sum = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let norm = 0;
    for (let octave = 0; octave < octaves; octave++) {
      const period = baseFrequency * frequency;
      sum += amplitude * value(x * period, y * period, period);
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return sum / norm;
  };
}
