import { describe, expect, it } from 'vitest';

import { REDUCED_MOTION } from '@/lib/motion';

import type { JourneyState } from './journey';
import { advanceReducedJourney, createReducedJourney } from './reduced-journey';

const LAST_STOP = 4;

function journeyState(overrides: Partial<JourneyState> = {}): JourneyState {
  return { orbitIndex: 0, progressTarget: 0, exitProgress: 0, travel: null, ...overrides };
}

describe('advanceReducedJourney', () => {
  it('shows the first stop right away, without a veil', () => {
    const journey = createReducedJourney();
    const frame = advanceReducedJourney(journey, journeyState(), LAST_STOP, 0);
    expect(frame).toEqual({ veilOpacity: 0, changedStop: 0, arrivedOrbit: null });
  });

  it('fades to dark, switches the stop while dark and fades back', () => {
    const journey = createReducedJourney();
    const state = journeyState();
    advanceReducedJourney(journey, state, LAST_STOP, 0);
    state.progressTarget = 2;

    const start = advanceReducedJourney(journey, state, LAST_STOP, 1000);
    expect(start.changedStop).toBeNull();
    expect(journey.shownStop).toBe(0);

    const dark = advanceReducedJourney(journey, state, LAST_STOP, 1000 + REDUCED_MOTION.fadeMs);
    expect(dark.veilOpacity).toBe(1);
    expect(dark.changedStop).toBe(2);

    const switchedAt = 1000 + REDUCED_MOTION.fadeMs;
    const holding = advanceReducedJourney(
      journey,
      state,
      LAST_STOP,
      switchedAt + REDUCED_MOTION.holdMs / 2,
    );
    expect(holding.veilOpacity).toBe(1);

    const end = advanceReducedJourney(
      journey,
      state,
      LAST_STOP,
      switchedAt + REDUCED_MOTION.holdMs + REDUCED_MOTION.fadeMs,
    );
    expect(end.veilOpacity).toBe(0);
    expect(journey.veil).toBeNull();
  });

  it('finishes an orbit change while the scene is dark', () => {
    const journey = createReducedJourney();
    const state = journeyState();
    advanceReducedJourney(journey, state, LAST_STOP, 0);
    state.travel = { from: 0, to: 1 };

    advanceReducedJourney(journey, state, LAST_STOP, 500);
    const switchedAt = 500 + REDUCED_MOTION.fadeMs;
    const dark = advanceReducedJourney(journey, state, LAST_STOP, switchedAt);
    expect(dark.veilOpacity).toBe(1);
    expect(dark.arrivedOrbit).toBeNull();
    expect(state).toMatchObject({ travel: null, orbitIndex: 1, progressTarget: 0 });
    expect(journey.shownStop).toBe(0);

    const clear = advanceReducedJourney(
      journey,
      state,
      LAST_STOP,
      switchedAt + REDUCED_MOTION.travelHoldMs + REDUCED_MOTION.fadeMs,
    );
    expect(clear.veilOpacity).toBe(0);
    expect(clear.arrivedOrbit).toBe(1);
  });

  it('stays fully dark on the switch frame even when frames are slow', () => {
    const journey = createReducedJourney();
    const state = journeyState();
    advanceReducedJourney(journey, state, LAST_STOP, 0);
    state.progressTarget = 1;
    advanceReducedJourney(journey, state, LAST_STOP, 100);
    const late = advanceReducedJourney(journey, state, LAST_STOP, 100 + REDUCED_MOTION.fadeMs * 3);
    expect(late.changedStop).toBe(1);
    expect(late.veilOpacity).toBe(1);
  });

  it('rounds a scroll position between stops to the closest one', () => {
    const journey = createReducedJourney();
    const frame = advanceReducedJourney(journey, journeyState({ progressTarget: 9.4 }), 4, 0);
    expect(frame.changedStop).toBe(4);
  });
});
