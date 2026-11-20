import { type Ref, useMemo } from 'react';
import { AdditiveBlending, type LineBasicMaterial, type LineSegments } from 'three';

import { seededRandom } from '@/lib/noise';

const LINE_COUNT = 500;
export const SPEED_LINES_DEPTH = 160;

type SpeedLinesProps = {
  ref?: Ref<LineSegments>;
  materialRef?: Ref<LineBasicMaterial>;
};

// Riscos que acompanham a câmera e só aparecem no salto entre órbitas.
export function SpeedLines({ ref, materialRef }: SpeedLinesProps) {
  const positions = useMemo(() => {
    const random = seededRandom(7);
    const buffer = new Float32Array(LINE_COUNT * 6);
    for (let i = 0; i < LINE_COUNT; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 3 + random() * 30;
      const z = -random() * SPEED_LINES_DEPTH;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const length = 2 + random() * 6;
      buffer.set([x, y, z, x, y, z - length], i * 6);
    }
    return buffer;
  }, []);

  return (
    <lineSegments ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color="#CFE6FF"
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </lineSegments>
  );
}
