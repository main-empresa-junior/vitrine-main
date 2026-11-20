import { useMemo } from 'react';
import { AdditiveBlending } from 'three';

import { brandColors } from '@/lib/design-tokens';
import type { Vec3 } from '@/lib/orbits';

import { glowTexture } from './three-textures';

const CLOUDS: readonly { color: string; position: Vec3; size: number; opacity: number }[] = [
  { color: brandColors.cyan, position: [-900, 260, -1500], size: 1300, opacity: 0.16 },
  { color: brandColors.violet, position: [-500, 120, -1700], size: 1700, opacity: 0.2 },
  { color: brandColors.magenta, position: [-150, 320, -1550], size: 1100, opacity: 0.14 },
];

// Nuvens distantes nas cores da marca, atrás de tudo.
export function Nebula() {
  const clouds = useMemo(
    () => CLOUDS.map((cloud) => ({ ...cloud, map: glowTexture(cloud.color) })),
    [],
  );

  return (
    <>
      {clouds.map((cloud) => (
        <sprite key={cloud.color} position={cloud.position} scale={[cloud.size, cloud.size, 1]}>
          <spriteMaterial
            map={cloud.map}
            blending={AdditiveBlending}
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </>
  );
}
