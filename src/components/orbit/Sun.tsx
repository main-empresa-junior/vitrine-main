'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Mesh, type SpriteMaterial, Vector3 } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Rgb } from '@/lib/color';
import type { Vec3 } from '@/lib/orbits';

import { glowTexture, sunTexture } from './three-textures';

const SUN_RADIUS = 3.4;
const SUN_SPIN = 0.03;
const BEACON_SIZE = 70;
const BEACON_MAX_OPACITY = 0.55;
const BEACON_FADE_START = 120;
const BEACON_FADE_LENGTH = 300;

type SunLook = {
  surface: readonly Rgb[];
  innerGlow: string;
  outerGlow: string;
};

// Uma cor por órbita: laranja, azul e rosa, repetindo a partir da quarta.
const SUN_LOOKS: readonly SunLook[] = [
  {
    surface: [
      [180, 40, 0],
      [255, 120, 10],
      [255, 196, 60],
      [255, 245, 200],
    ],
    innerGlow: '#FFBE5A',
    outerGlow: '#FF8C28',
  },
  {
    surface: [
      [20, 60, 160],
      [80, 150, 255],
      [170, 215, 255],
      [240, 250, 255],
    ],
    innerGlow: '#8CC8FF',
    outerGlow: '#4682FF',
  },
  {
    surface: [
      [120, 20, 90],
      [230, 70, 160],
      [255, 160, 210],
      [255, 235, 245],
    ],
    innerGlow: '#FF96DC',
    outerGlow: '#E646A0',
  },
];

type SunProps = {
  orbitIndex: number;
  center: Vec3;
};

export function Sun({ orbitIndex, center }: SunProps) {
  const look = SUN_LOOKS[orbitIndex % SUN_LOOKS.length];
  const sunRef = useRef<Mesh>(null);
  const beaconRef = useRef<SpriteMaterial>(null);
  const reducedMotion = useReducedMotion();
  const centerVector = useMemo(() => new Vector3(...center), [center]);
  const surface = useMemo(() => sunTexture(look.surface, orbitIndex * 11), [look, orbitIndex]);
  const glows = useMemo(
    () => [
      { size: 13, map: glowTexture(look.innerGlow), opacity: 0.85 },
      { size: 24, map: glowTexture(look.outerGlow), opacity: 0.32 },
    ],
    [look],
  );
  const beacon = useMemo(() => glowTexture(look.innerGlow), [look]);

  useFrame(({ camera }, delta) => {
    if (!reducedMotion && sunRef.current) sunRef.current.rotation.y += delta * SUN_SPIN;
    // O farol só aparece de longe; perto do sistema, ele apagaria a cena.
    if (beaconRef.current) {
      const distance = camera.position.distanceTo(centerVector);
      beaconRef.current.opacity = Math.max(
        0,
        Math.min(BEACON_MAX_OPACITY, (distance - BEACON_FADE_START) / BEACON_FADE_LENGTH),
      );
    }
  });

  return (
    <group>
      <mesh ref={sunRef} scale={SUN_RADIUS}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial map={surface} />
      </mesh>
      {glows.map((glow) => (
        <sprite key={glow.size} scale={[glow.size, glow.size, 1]}>
          <spriteMaterial
            map={glow.map}
            blending={AdditiveBlending}
            transparent
            opacity={glow.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
      <sprite scale={[BEACON_SIZE, BEACON_SIZE, 1]}>
        <spriteMaterial
          ref={beaconRef}
          map={beacon}
          blending={AdditiveBlending}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </sprite>
      <pointLight color="#FFF1DC" intensity={3} distance={160} decay={0} />
    </group>
  );
}
