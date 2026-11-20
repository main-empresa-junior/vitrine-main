import { useMemo } from 'react';

import type { Vec3 } from '@/lib/orbits';
import { generateStars, type StarLayer } from '@/lib/stars';

type StarsProps = StarLayer & {
  size: number;
  opacity: number;
  position?: Vec3;
  rotation?: Vec3;
};

export function Stars({ size, opacity, position, rotation, ...layer }: StarsProps) {
  const { count, minRadius, maxRadius, isBand, seed } = layer;
  const { positions, colors } = useMemo(
    () => generateStars({ count, minRadius, maxRadius, isBand, seed }),
    [count, minRadius, maxRadius, isBand, seed],
  );

  return (
    <points position={position} rotation={rotation}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
