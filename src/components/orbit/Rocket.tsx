import { type Ref, useMemo } from 'react';
import { AdditiveBlending, type Group } from 'three';

import { brandColors } from '@/lib/design-tokens';

import { glowTexture } from './three-textures';

const FIN_COUNT = 3;
const FLAME_GLOW = '#FFAA50';

type RocketProps = {
  ref?: Ref<Group>;
  bodyRef?: Ref<Group>;
  flameRef?: Ref<Group>;
};

// Modelado em pé (eixo y) e deitado para o nariz apontar para +z, a frente usada no lookAt.
export function Rocket({ ref, bodyRef, flameRef }: RocketProps) {
  const halo = useMemo(() => glowTexture(FLAME_GLOW), []);

  return (
    <group ref={ref} visible={false}>
      <group ref={bodyRef} rotation-x={Math.PI / 2}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.5, 2.2, 32]} />
          <meshStandardMaterial color="#F2F4FF" roughness={0.35} metalness={0.3} />
        </mesh>
        <mesh position-y={1.6}>
          <coneGeometry args={[0.42, 1, 32]} />
          <meshStandardMaterial
            color={brandColors.cyan}
            roughness={0.4}
            metalness={0.2}
            emissive="#003A36"
          />
        </mesh>
        <mesh position-y={-1.27}>
          <cylinderGeometry args={[0.5, 0.36, 0.35, 32]} />
          <meshStandardMaterial
            color={brandColors.magenta}
            roughness={0.4}
            metalness={0.2}
            emissive="#3A0030"
          />
        </mesh>
        <mesh position={[0, 0.55, 0.43]}>
          <circleGeometry args={[0.17, 32]} />
          <meshBasicMaterial color="#9FF7EE" />
        </mesh>
        {Array.from({ length: FIN_COUNT }, (_, k) => (
          <group key={k} rotation-y={(k * Math.PI * 2) / FIN_COUNT}>
            <mesh position={[0, -0.85, 0.62]}>
              <boxGeometry args={[0.06, 0.8, 0.55]} />
              <meshStandardMaterial color={brandColors.magenta} roughness={0.4} metalness={0.2} />
            </mesh>
          </group>
        ))}
        <group ref={flameRef} position-y={-1.45}>
          <mesh rotation-x={Math.PI} position-y={-0.7}>
            <coneGeometry args={[0.34, 1.4, 24, 1, true]} />
            <meshBasicMaterial
              color="#FFB347"
              transparent
              opacity={0.85}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation-x={Math.PI} position-y={-0.45}>
            <coneGeometry args={[0.2, 0.9, 24, 1, true]} />
            <meshBasicMaterial
              color="#FFF3C4"
              transparent
              opacity={0.95}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <sprite scale={[2.4, 2.4, 1]} position-y={-0.6}>
            <spriteMaterial
              map={halo}
              blending={AdditiveBlending}
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </sprite>
        </group>
      </group>
      <pointLight color="#FFC27A" intensity={1.2} distance={12} position={[0, 0, -2]} />
    </group>
  );
}
