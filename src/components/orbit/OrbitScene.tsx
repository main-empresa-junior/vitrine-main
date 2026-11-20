'use client';

import type { RefObject } from 'react';
import { Canvas } from '@react-three/fiber';

import { spaceColors } from '@/lib/design-tokens';
import { systemCenter } from '@/lib/orbits';
import { MAX_PIXEL_RATIO } from '@/lib/webgl';

import { CameraRig } from './CameraRig';
import type { JourneyCallbacks, JourneyState, Orbit } from './journey';
import { SolarSystem } from './SolarSystem';
import { Starfield } from './Starfield';

type OrbitSceneProps = JourneyCallbacks & {
  orbits: readonly Orbit[];
  journeyRef: RefObject<JourneyState>;
  isActive: boolean;
};

export function OrbitScene({ orbits, journeyRef, isActive, ...callbacks }: OrbitSceneProps) {
  const lastCenter = systemCenter(Math.max(0, orbits.length - 1));
  const skyCenter = [lastCenter[0] / 2, 0, lastCenter[2] / 2] as const;

  return (
    <Canvas
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0 }}
      dpr={[1, MAX_PIXEL_RATIO]}
      frameloop={isActive ? 'always' : 'never'}
      camera={{ fov: 45, near: 0.1, far: 4000, position: [0, 30, 52] }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[spaceColors[950]]} />
      <ambientLight color="#2A3060" intensity={0.55} />
      <Starfield center={skyCenter} />
      {orbits.map((orbit, orbitIndex) => (
        <SolarSystem key={orbitIndex} orbitIndex={orbitIndex} projects={orbit} />
      ))}
      <CameraRig orbits={orbits} journeyRef={journeyRef} {...callbacks} />
    </Canvas>
  );
}
