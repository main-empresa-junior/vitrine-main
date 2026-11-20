import { useMemo } from 'react';
import { AdditiveBlending, BackSide, Color } from 'three';

const ATMOSPHERE_SCALE = 1.07;

const VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 modelView = modelViewMatrix * vec4(position, 1.0);
  vPosition = modelView.xyz;
  gl_Position = projectionMatrix * modelView;
}`;

// Brilho de borda: mais forte onde a normal fica perpendicular ao olhar.
const FRAGMENT_SHADER = `
uniform vec3 color;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  float intensity = pow(clamp(0.68 - dot(vNormal, normalize(-vPosition)), 0.0, 1.0), 2.6);
  gl_FragColor = vec4(color, 1.0) * intensity * 1.1;
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
