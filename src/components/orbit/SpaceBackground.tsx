'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Vec3 } from '@/lib/orbits';

import { Comet } from './Comet';
import { Nebula } from './Nebula';
import { Stars } from './Stars';

const MILKY_WAY_TILT: Vec3 = [0.5, 0, 0.35];
const SKY_SPIN = 0.004;

type SpaceBackgroundProps = {
  center?: Vec3;
};

// O céu inteiro: não depende de projetos e é o mesmo em todas as páginas com cena 3D.
export function SpaceBackground({ center = [0, 0, 0] }: SpaceBackgroundProps) {
  const skyRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!reducedMotion && skyRef.current) skyRef.current.rotation.y += delta * SKY_SPIN;
  });

  return (
    <>
      <group ref={skyRef} position={center}>
        <Nebula />
        <Stars count={14000} minRadius={1300} maxRadius={2400} seed={11} size={2.6} opacity={0.9} />
        <Stars count={600} minRadius={1200} maxRadius={2000} seed={37} size={5} opacity={1} />
        <Stars
          count={7000}
          minRadius={1400}
          maxRadius={2400}
          isBand
          seed={23}
          size={2}
          opacity={0.55}
          rotation={MILKY_WAY_TILT}
        />
      </group>
      {!reducedMotion && <Comet />}
    </>
  );
}
