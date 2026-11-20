'use client';

import type { RefObject } from 'react';

import { systemCenter } from '@/lib/orbits';

import { CameraRig } from './CameraRig';
import type { JourneyCallbacks, JourneyState, Orbit } from './journey';
import { SolarSystem } from './SolarSystem';
import { SpaceCanvas } from './SpaceCanvas';

type OrbitSceneProps = JourneyCallbacks & {
  orbits: readonly Orbit[];
  journeyRef: RefObject<JourneyState>;
  isSceneVisible: boolean;
};

export function OrbitScene({ orbits, journeyRef, isSceneVisible, ...callbacks }: OrbitSceneProps) {
  const lastCenter = systemCenter(Math.max(0, orbits.length - 1));
  const skyCenter = [lastCenter[0] / 2, 0, lastCenter[2] / 2] as const;

  return (
    <SpaceCanvas isSceneVisible={isSceneVisible} skyCenter={skyCenter}>
      {orbits.map((orbit, orbitIndex) => (
        <SolarSystem key={orbitIndex} orbitIndex={orbitIndex} projects={orbit} />
      ))}
      <CameraRig orbits={orbits} journeyRef={journeyRef} {...callbacks} />
    </SpaceCanvas>
  );
}
