'use client';

import { type ReactNode, useRef } from 'react';
import dynamic from 'next/dynamic';

import { useIsVisible } from '@/hooks/useIsVisible';
import { useSupportsWebGL } from '@/hooks/useSupportsWebGL';
import type { CameraPose } from '@/lib/orbits';

import { CameraDrift } from './CameraDrift';

const SpaceCanvas = dynamic(() => import('./SpaceCanvas').then((module) => module.SpaceCanvas), {
  ssr: false,
});

const DEFAULT_POSE: CameraPose = { position: [0, 4, 30], lookAt: [0, 0, 0] };

type SpaceBackdropProps = {
  children?: ReactNode;
  fallback?: ReactNode;
  pose?: CameraPose;
  narrowPose?: CameraPose;
};

// Céu 3D de tela cheia com a câmera flutuando; sem WebGL fica só o CssStarfield da página por baixo.
export function SpaceBackdrop({
  children,
  fallback,
  pose = DEFAULT_POSE,
  narrowPose,
}: SpaceBackdropProps) {
  const hasWebGL = useSupportsWebGL();
  const sectionAreaRef = useRef<HTMLSpanElement>(null);
  const isSceneVisible = useIsVisible(sectionAreaRef);

  if (!hasWebGL) return fallback;

  return (
    <>
      {/* Ocupa a seção que contém o fundo: a cena só aparece enquanto essa seção estiver na tela. */}
      <span
        ref={sectionAreaRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      />
      <SpaceCanvas cameraPosition={pose.position} isSceneVisible={isSceneVisible}>
        <CameraDrift pose={pose} narrowPose={narrowPose} />
        {children}
      </SpaceCanvas>
    </>
  );
}
