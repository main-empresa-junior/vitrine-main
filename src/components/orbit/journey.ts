import type { ShowcaseProject } from '@/features/projects/model';

export type Travel = {
  from: number;
  to: number;
};

// Estado que muda a cada quadro: fica num objeto mutável compartilhado, fora do estado do React.
export type JourneyState = {
  orbitIndex: number;
  progressTarget: number;
  travel: Travel | null;
};

export type JourneyCallbacks = {
  onProgress: (progress: number) => void;
  onStopChange: (stop: number | null) => void;
  onTravelEnd: (orbitIndex: number) => void;
};

export type Orbit = readonly ShowcaseProject[];

export function stopCount(orbit: Orbit): number {
  return orbit.length + 1;
}
