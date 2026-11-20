'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Sprite } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { brandColors } from '@/lib/design-tokens';
import type { Vec3 } from '@/lib/orbits';

import { ghostPlanetTexture } from './three-textures';

const SIZE = 5;
const PULSE_SPEED = 1.4;
const PULSE_SCALE = 0.08;
const BASE_OPACITY = 0.75;

type GhostPlanetProps = {
  position: Vec3;
};

// O lugar reservado para o primeiro projeto: um contorno tracejado que pulsa devagar.
export function GhostPlanet({ position }: GhostPlanetProps) {
  const spriteRef = useRef<Sprite>(null);
  const reducedMotion = useReducedMotion();
  const map = useMemo(() => ghostPlanetTexture(brandColors.glow), []);

  useFrame(({ clock }) => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    const pulse = reducedMotion ? 0 : Math.sin(clock.elapsedTime * PULSE_SPEED);
    const scale = SIZE * (1 + pulse * PULSE_SCALE);
    sprite.scale.set(scale, scale, 1);
    sprite.material.opacity = BASE_OPACITY + pulse * 0.2;
  });

  return (
    <sprite ref={spriteRef} position={position} scale={[SIZE, SIZE, 1]}>
      <spriteMaterial map={map} transparent opacity={BASE_OPACITY} depthWrite={false} />
    </sprite>
  );
}
