import { REDUCED_MOTION } from '@/lib/motion';

import type { JourneyState } from './journey';

type VeilTarget = { kind: 'stop'; stop: number } | { kind: 'travel' };

type Veil = {
  startedAt: number;
  target: VeilTarget;
  switchedAt: number | null;
};

// No modo reduzido a câmera fica parada em cada parada e troca de lugar com a cena escurecida.
export type ReducedJourney = {
  shownStop: number | null;
  veil: Veil | null;
};

export type ReducedFrame = {
  veilOpacity: number;
  changedStop: number | null;
  arrivedOrbit: number | null;
};

export function createReducedJourney(): ReducedJourney {
  return { shownStop: null, veil: null };
}

function wantedTarget(state: JourneyState, lastStop: number): VeilTarget {
  if (state.travel) return { kind: 'travel' };
  return { kind: 'stop', stop: Math.min(lastStop, Math.max(0, Math.round(state.progressTarget))) };
}

function switchTo(journey: ReducedJourney, target: VeilTarget, state: JourneyState): number | null {
  if (target.kind === 'stop') {
    journey.shownStop = target.stop;
    return null;
  }
  if (!state.travel) return null;
  const destination = state.travel.to;
  state.travel = null;
  state.orbitIndex = destination;
  state.progressTarget = 0;
  journey.shownStop = 0;
  return destination;
}

// Avança um quadro. Muda `journey` e, ao fim de uma troca de órbita, também `state`.
// A fase escura conta a partir do quadro da troca: mesmo com poucos quadros por segundo, a câmera
// nunca muda de lugar com a cena visível.
export function advanceReducedJourney(
  journey: ReducedJourney,
  state: JourneyState,
  lastStop: number,
  now: number,
): ReducedFrame {
  const { fadeMs, holdMs } = REDUCED_MOTION;
  const frame: ReducedFrame = { veilOpacity: 0, changedStop: null, arrivedOrbit: null };

  if (!journey.veil) {
    const target = wantedTarget(state, lastStop);
    if (target.kind === 'stop' && journey.shownStop === null) {
      journey.shownStop = target.stop;
      frame.changedStop = target.stop;
      return frame;
    }
    if (target.kind === 'stop' && target.stop === journey.shownStop) return frame;
    journey.veil = { startedAt: now, target, switchedAt: null };
  }

  const veil = journey.veil;
  if (veil.switchedAt === null) {
    const rising = (now - veil.startedAt) / fadeMs;
    if (rising < 1) {
      frame.veilOpacity = rising;
      return frame;
    }
    veil.switchedAt = now;
    frame.arrivedOrbit = switchTo(journey, veil.target, state);
    frame.changedStop = journey.shownStop;
  }

  const sinceSwitch = now - veil.switchedAt;
  frame.veilOpacity = sinceSwitch < holdMs ? 1 : Math.max(0, 1 - (sinceSwitch - holdMs) / fadeMs);
  if (frame.veilOpacity === 0) journey.veil = null;
  return frame;
}
