'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

import { spaceColors } from '@/lib/design-tokens';
import type { Vec3 } from '@/lib/orbits';
import { MAX_PIXEL_RATIO } from '@/lib/webgl';

import { SpaceBackground } from './SpaceBackground';

// Camada fixa atrás de todo o conteúdo: as seções rolam por cima e nada aqui recebe clique ou foco.
const BACKGROUND_LAYER: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
};

type SpaceCanvasProps = {
  children?: ReactNode;
  isSceneVisible?: boolean;
  skyCenter?: Vec3;
  cameraPosition?: Vec3;
};

// Canvas decorativo de tela cheia com o céu; cada cena acrescenta o que for dela.
export function SpaceCanvas({
  children,
  isSceneVisible = true,
  skyCenter,
  cameraPosition = [0, 30, 52],
}: SpaceCanvasProps) {
  return (
    <Canvas
      aria-hidden="true"
      style={BACKGROUND_LAYER}
      dpr={[1, MAX_PIXEL_RATIO]}
      camera={{ fov: 45, near: 0.1, far: 4000, position: cameraPosition }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[spaceColors[950]]} />
      <ambientLight color="#2A3060" intensity={0.55} />
      <SpaceBackground center={skyCenter} />
      <group visible={isSceneVisible}>{children}</group>
    </Canvas>
  );
}
