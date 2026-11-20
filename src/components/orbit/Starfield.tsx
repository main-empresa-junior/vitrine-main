import type { Vec3 } from '@/lib/orbits';

import { Stars } from './Stars';

const MILKY_WAY_TILT: Vec3 = [0.5, 0, 0.35];

type StarfieldProps = {
  center: Vec3;
};

// Céu distante grande o bastante para envolver todas as órbitas.
export function Starfield({ center }: StarfieldProps) {
  return (
    <>
      <Stars
        count={14000}
        minRadius={1300}
        maxRadius={2400}
        seed={11}
        size={2.6}
        opacity={0.9}
        position={center}
      />
      <Stars
        count={7000}
        minRadius={1400}
        maxRadius={2400}
        isBand
        seed={23}
        size={2}
        opacity={0.55}
        position={center}
        rotation={MILKY_WAY_TILT}
      />
    </>
  );
}
