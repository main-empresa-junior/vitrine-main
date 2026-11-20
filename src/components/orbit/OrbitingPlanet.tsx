'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { planetLocalPosition } from '@/lib/orbits';

import { Planet, type PlanetProps } from './Planet';

type OrbitingPlanetProps = PlanetProps & {
  slot: number;
};

export function OrbitingPlanet({ slot, ...planet }: OrbitingPlanetProps) {
  const groupRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame(({ clock }) => {
    groupRef.current?.position.set(
      ...planetLocalPosition(slot, reducedMotion ? 0 : clock.elapsedTime),
    );
  });

  return (
    <group ref={groupRef} position={planetLocalPosition(slot, 0)}>
      <Planet {...planet} />
    </group>
  );
}
