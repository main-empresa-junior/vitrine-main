// Tamanho do planeta visível, em múltiplos do raio da esfera.
export const ATMOSPHERE_SCALE = 1.15;
export const RING_OUTER_SCALE = 2.42;

const DEGREES_TO_RADIANS = Math.PI / 180;

export function boundingRadius(radius: number, hasRing: boolean): number {
  return radius * (hasRing ? RING_OUTER_SCALE : ATMOSPHERE_SCALE);
}

type FitOptions = {
  boundingRadius: number;
  verticalFovDegrees: number;
  aspect: number;
  margin: number;
};

// A esfera que envolve planeta e anel cabe no quadro em qualquer inclinação: basta caber no menor
// meio-ângulo de visão (vertical ou horizontal), com uma folga.
export function cameraDistanceToFit({
  boundingRadius: radius,
  verticalFovDegrees,
  aspect,
  margin,
}: FitOptions): number {
  const verticalHalf = (verticalFovDegrees * DEGREES_TO_RADIANS) / 2;
  const horizontalHalf = Math.atan(Math.tan(verticalHalf) * aspect);
  return (radius * margin) / Math.sin(Math.min(verticalHalf, horizontalHalf));
}
