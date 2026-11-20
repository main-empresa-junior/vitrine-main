'use client';

import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

import { boundingRadius, cameraDistanceToFit } from '@/lib/planet-framing';

export const PLANET_FOV = 40;
const FRAME_MARGIN = 1.08;
// Olhar levemente de cima, para o anel aparecer como elipse e não como uma linha.
const VIEW_DIRECTION = new Vector3(0, 0.14, 1).normalize();

type FitPlanetCameraProps = {
  hasRing: boolean;
};

// Recalcula a distância a cada quadro: acompanha mudanças de tamanho do quadro sem efeitos extras.
export function FitPlanetCamera({ hasRing }: FitPlanetCameraProps) {
  useFrame(({ camera, size }) => {
    const distance = cameraDistanceToFit({
      boundingRadius: boundingRadius(1, hasRing),
      verticalFovDegrees: PLANET_FOV,
      aspect: size.width / Math.max(1, size.height),
      margin: FRAME_MARGIN,
    });
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(distance);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
