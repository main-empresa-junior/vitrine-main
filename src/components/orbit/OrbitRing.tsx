import { useMemo } from 'react';
import { BufferGeometry, Vector3 } from 'three';

const SEGMENTS = 256;

type OrbitRingProps = {
  radius: number;
};

export function OrbitRing({ radius }: OrbitRingProps) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: SEGMENTS + 1 }, (_, k) => {
      const angle = (k / SEGMENTS) * Math.PI * 2;
      return new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
    return new BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="#CFE6FF" transparent opacity={0.16} />
    </lineLoop>
  );
}
