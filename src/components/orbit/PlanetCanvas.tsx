'use client';

import { useRef, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';

import { useIsVisible } from '@/hooks/useIsVisible';
import { cn } from '@/lib/utils/cn';
import { MAX_PIXEL_RATIO, supportsWebGL } from '@/lib/webgl';

import { Planet, type PlanetProps } from './Planet';
import { PlanetThumbnail } from './PlanetThumbnail';

const CAMERA_DISTANCE_PER_RADIUS = 4.2;
const FALLBACK_SIZE = 320;

type PlanetCanvasProps = Omit<PlanetProps, 'radius'> & {
  className?: string;
};

const noopSubscribe = () => () => {};

export function PlanetCanvas({ className, ...planet }: PlanetCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(containerRef, '100px');
  const hasWebGL = useSyncExternalStore(noopSubscribe, supportsWebGL, () => true);
  const cameraDistance = CAMERA_DISTANCE_PER_RADIUS * (planet.hasRing ? 1.35 : 1);

  return (
    <div ref={containerRef} aria-hidden="true" className={cn('relative', className)}>
      {hasWebGL ? (
        <Canvas
          dpr={[1, MAX_PIXEL_RATIO]}
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: [0, 0.6, cameraDistance], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.35} color="#2A3060" />
          <directionalLight position={[-5, 2, 4]} intensity={2.6} color="#FFF1DC" />
          <Planet {...planet} radius={1} />
        </Canvas>
      ) : (
        <PlanetThumbnail
          palette={planet.palette}
          texture={planet.texture}
          seed={planet.seed}
          size={FALLBACK_SIZE}
          className="m-auto size-3/4"
        />
      )}
    </div>
  );
}
