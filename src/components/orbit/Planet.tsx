'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PlanetPalette, PlanetTextureKind } from '@/lib/textures';

import { Atmosphere } from './Atmosphere';
import { PlanetRings } from './PlanetRings';
import { planetTexture } from './three-textures';

const SPIN_SPEED = 0.12;

export type PlanetProps = {
  palette: PlanetPalette;
  texture: PlanetTextureKind;
  hasRing: boolean;
  radius: number;
  seed: number;
  tilt?: number;
  spinSpeed?: number;
};

export function Planet({
  palette,
  texture,
  hasRing,
  radius,
  seed,
  tilt = 0.3,
  spinSpeed = SPIN_SPEED,
}: PlanetProps) {
  const globeRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();
  const map = useMemo(() => planetTexture(texture, palette, seed), [texture, palette, seed]);

  useFrame((_, delta) => {
    if (!reducedMotion && globeRef.current) globeRef.current.rotation.y += delta * spinSpeed;
  });

  return (
    <group>
      <group rotation-z={tilt}>
        <group ref={globeRef}>
          <mesh scale={radius}>
            <sphereGeometry args={[1, 96, 48]} />
            <meshStandardMaterial
              map={map}
              roughness={texture === 'ice' ? 0.55 : 0.9}
              metalness={0}
            />
          </mesh>
        </group>
        {hasRing && <PlanetRings radius={radius} palette={palette} />}
      </group>
      <Atmosphere radius={radius} color={palette.primary} />
    </group>
  );
}
