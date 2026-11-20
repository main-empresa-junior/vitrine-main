'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { CssStarfield } from '@/components/site/CssStarfield';
import { useSupportsWebGL } from '@/hooks/useSupportsWebGL';
import type { CameraPose } from '@/lib/orbits';

import { CameraDrift } from './CameraDrift';

const SpaceCanvas = dynamic(() => import('./SpaceCanvas').then((module) => module.SpaceCanvas), {
  ssr: false,
  loading: () => <CssStarfield />,
});

const DEFAULT_POSE: CameraPose = { position: [0, 4, 30], lookAt: [0, 0, 0] };

type SpaceBackdropProps = {
  children?: ReactNode;
  fallback?: ReactNode;
  pose?: CameraPose;
  narrowPose?: CameraPose;
};

// Fundo de tela cheia: céu 3D com a câmera flutuando, ou estrelas em CSS sem WebGL.
export function SpaceBackdrop({
  children,
  fallback,
  pose = DEFAULT_POSE,
  narrowPose,
}: SpaceBackdropProps) {
  const hasWebGL = useSupportsWebGL();

  if (!hasWebGL) {
    return (
      <>
        <CssStarfield />
        {fallback}
      </>
    );
  }

  return (
    <SpaceCanvas cameraPosition={pose.position}>
      <CameraDrift pose={pose} narrowPose={narrowPose} />
      {children}
    </SpaceCanvas>
  );
}
