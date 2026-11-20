'use client';

import { useFrame } from '@react-three/fiber';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { type CameraPose, NARROW_SCREEN_WIDTH, type Vec3 } from '@/lib/orbits';

const DRIFT_AMPLITUDE: Vec3 = [1.6, 0.8, 1.2];
const DRIFT_SPEED: Vec3 = [0.07, 0.05, 0.04];

type CameraDriftProps = {
  pose: CameraPose;
  narrowPose?: CameraPose;
};

// Flutua devagar em volta de um ponto, como uma nave parada no espaço.
export function CameraDrift({ pose, narrowPose = pose }: CameraDriftProps) {
  const reducedMotion = useReducedMotion();

  useFrame(({ camera, clock, size }) => {
    const { position, lookAt } = size.width < NARROW_SCREEN_WIDTH ? narrowPose : pose;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    camera.position.set(
      position[0] + Math.sin(time * DRIFT_SPEED[0]) * DRIFT_AMPLITUDE[0],
      position[1] + Math.sin(time * DRIFT_SPEED[1]) * DRIFT_AMPLITUDE[1],
      position[2] + Math.cos(time * DRIFT_SPEED[2]) * DRIFT_AMPLITUDE[2],
    );
    camera.lookAt(...lookAt);
  });

  return null;
}
