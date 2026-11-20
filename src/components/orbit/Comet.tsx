'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Group,
  type LineSegments,
  type Sprite,
  Vector3,
} from 'three';

import { brandColors } from '@/lib/design-tokens';

import { glowTexture } from './three-textures';

const FLIGHT_SECONDS = 2.6;
const MIN_WAIT_SECONDS = 9;
const WAIT_VARIATION_SECONDS = 12;
const DISTANCE_AHEAD = 520;
const TAIL_LENGTH = 70;

type Flight = { start: Vector3; end: Vector3; startedAt: number };

// Cruza o campo de visão de tempos em tempos, sempre na frente da câmera.
export function Comet() {
  const groupRef = useRef<Group>(null);
  const tailRef = useRef<LineSegments>(null);
  const headRef = useRef<Sprite>(null);
  const flightRef = useRef<Flight | null>(null);
  const nextLaunchRef = useRef(MIN_WAIT_SECONDS / 2);
  const headTexture = useMemo(() => glowTexture(brandColors.glow), []);
  const tailGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(6), 3));
    geometry.setAttribute('color', new BufferAttribute(new Float32Array([1, 1, 1, 0, 0, 0]), 3));
    return geometry;
  }, []);

  useFrame(({ camera, clock }) => {
    const group = groupRef.current;
    const tail = tailRef.current;
    const head = headRef.current;
    if (!group || !tail || !head) return;
    const now = clock.elapsedTime;

    if (!flightRef.current && now >= nextLaunchRef.current) {
      const forward = camera.getWorldDirection(new Vector3());
      const right = new Vector3().crossVectors(forward, camera.up).normalize();
      const up = new Vector3().crossVectors(right, forward).normalize();
      const center = camera.position.clone().addScaledVector(forward, DISTANCE_AHEAD);
      const side = Math.random() < 0.5 ? -1 : 1;
      const start = center
        .clone()
        .addScaledVector(right, -320 * side)
        .addScaledVector(up, 160 + Math.random() * 80);
      const end = center
        .clone()
        .addScaledVector(right, 320 * side)
        .addScaledVector(up, -60 + Math.random() * 60);
      flightRef.current = { start, end, startedAt: now };
    }

    const flight = flightRef.current;
    group.visible = flight !== null;
    if (!flight) return;
    const progress = (now - flight.startedAt) / FLIGHT_SECONDS;
    if (progress >= 1) {
      flightRef.current = null;
      nextLaunchRef.current = now + MIN_WAIT_SECONDS + Math.random() * WAIT_VARIATION_SECONDS;
      return;
    }
    const position = flight.start.clone().lerp(flight.end, progress);
    const direction = flight.end.clone().sub(flight.start).normalize();
    const tailEnd = position.clone().addScaledVector(direction, -TAIL_LENGTH);
    const positions = tail.geometry.getAttribute('position');
    positions.setXYZ(0, position.x, position.y, position.z);
    positions.setXYZ(1, tailEnd.x, tailEnd.y, tailEnd.z);
    positions.needsUpdate = true;
    head.position.copy(position);
  });

  return (
    <group ref={groupRef} visible={false}>
      <sprite ref={headRef} scale={[14, 14, 1]}>
        <spriteMaterial
          map={headTexture}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </sprite>
      <lineSegments ref={tailRef} geometry={tailGeometry} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
