import { useMemo } from 'react';
import { Color, DoubleSide } from 'three';

import type { PlanetPalette } from '@/lib/textures';

const RING_BANDS = [
  { inner: 1.42, outer: 1.58, opacity: 0.3 },
  { inner: 1.6, outer: 1.86, opacity: 0.42 },
  { inner: 1.9, outer: 2.02, opacity: 0.16 },
  { inner: 2.06, outer: 2.3, opacity: 0.28 },
  { inner: 2.34, outer: 2.42, opacity: 0.12 },
] as const;

type PlanetRingsProps = {
  radius: number;
  palette: PlanetPalette;
};

export function PlanetRings({ radius, palette }: PlanetRingsProps) {
  const colors = useMemo(
    () =>
      RING_BANDS.map((_, index) =>
        new Color(index % 2 ? palette.accent : palette.primary).lerp(new Color('#FFFFFF'), 0.25),
      ),
    [palette.accent, palette.primary],
  );

  return (
    <group rotation-x={Math.PI / 2}>
      {RING_BANDS.map((band, index) => (
        <mesh key={band.inner}>
          <ringGeometry args={[radius * band.inner, radius * band.outer, 160]} />
          <meshBasicMaterial
            color={colors[index]}
            transparent
            opacity={band.opacity}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
