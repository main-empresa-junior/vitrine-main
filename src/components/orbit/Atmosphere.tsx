import { useMemo } from 'react';
import { AdditiveBlending, BackSide, Color } from 'three';

import { ATMOSPHERE_SCALE } from '@/lib/planet-framing';

const VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 modelView = modelViewMatrix * vec4(position, 1.0);
  vPosition = modelView.xyz;
  gl_Position = projectionMatrix * modelView;
}`;

// Faces de trás da casca: o brilho é forte junto ao planeta e some até a borda externa.
const FRAGMENT_SHADER = `
uniform vec3 color;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  float facing = clamp(-dot(vNormal, normalize(-vPosition)), 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0) * pow(facing, 1.4) * 1.3;
}`;

type AtmosphereProps = {
  radius: number;
  color: string;
};

export function Atmosphere({ radius, color }: AtmosphereProps) {
  const uniforms = useMemo(() => ({ color: { value: new Color(color) } }), [color]);
  return (
    <mesh scale={radius * ATMOSPHERE_SCALE}>
      <sphereGeometry args={[1, 48, 24]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        side={BackSide}
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
