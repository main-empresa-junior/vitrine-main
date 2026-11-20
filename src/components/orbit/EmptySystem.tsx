'use client';

import { planetDistance, planetLocalPosition } from '@/lib/orbits';

import { GhostPlanet } from './GhostPlanet';
import { OrbitRing } from './OrbitRing';
import { Sun } from './Sun';

const EMPTY_ORBIT_COUNT = 4;
const CENTER = [0, 0, 0] as const;

// O sistema da Main ainda sem planetas: sol, órbitas vazias e o lugar do primeiro projeto.
export function EmptySystem() {
  return (
    <group>
      <Sun orbitIndex={0} center={CENTER} />
      {Array.from({ length: EMPTY_ORBIT_COUNT }, (_, slot) => (
        <OrbitRing key={slot} radius={planetDistance(slot)} isDashed opacity={0.32} />
      ))}
      <GhostPlanet position={planetLocalPosition(0, 0)} />
    </group>
  );
}
