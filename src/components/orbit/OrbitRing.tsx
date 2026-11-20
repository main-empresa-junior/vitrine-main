'use client';

import { useMemo } from 'react';
import { BufferGeometry, type Line, Vector3 } from 'three';

const SEGMENTS = 256;
const RING_COLOR = '#CFE6FF';

type OrbitRingProps = {
  radius: number;
  isDashed?: boolean;
  opacity?: number;
};

export function OrbitRing({ radius, isDashed = false, opacity = 0.16 }: OrbitRingProps) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: SEGMENTS + 1 }, (_, k) => {
      const angle = (k / SEGMENTS) * Math.PI * 2;
      return new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
    return new BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <lineLoop
      geometry={geometry}
      // O tracejado precisa das distâncias acumuladas ao longo da linha.
      onUpdate={(line: Line) => line.computeLineDistances()}
    >
      {isDashed ? (
        <lineDashedMaterial
          color={RING_COLOR}
          transparent
          opacity={opacity}
          dashSize={0.9}
          gapSize={0.7}
        />
      ) : (
        <lineBasicMaterial color={RING_COLOR} transparent opacity={opacity} />
      )}
    </lineLoop>
  );
}
