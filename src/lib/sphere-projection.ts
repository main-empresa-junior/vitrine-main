import type { PixelBuffer } from './textures';

const LIGHT_DIRECTION = normalize([-0.55, -0.45, 0.7]);
const AMBIENT_LIGHT = 0.18;

function normalize([x, y, z]: readonly [number, number, number]): [number, number, number] {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

// Projeta a textura equirretangular num disco iluminado, para miniaturas sem WebGL.
export function projectSphere(
  texture: PixelBuffer,
  size: number,
  rotation = 0,
): Uint8ClampedArray<ArrayBuffer> {
  const output = new Uint8ClampedArray(size * size * 4);
  const radius = size / 2;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px + 0.5 - radius) / radius;
      const y = (py + 0.5 - radius) / radius;
      const distanceSquared = x * x + y * y;
      if (distanceSquared > 1) continue;
      const z = Math.sqrt(1 - distanceSquared);
      const longitude = Math.atan2(x, z) + rotation;
      const latitude = Math.asin(-y);
      const u = (((longitude / (Math.PI * 2) + 0.5) % 1) + 1) % 1;
      const v = 0.5 - latitude / Math.PI;
      const tx = Math.min(texture.width - 1, Math.floor(u * texture.width));
      const ty = Math.min(texture.height - 1, Math.floor(v * texture.height));
      const source = (ty * texture.width + tx) * 4;
      const light =
        AMBIENT_LIGHT +
        (1 - AMBIENT_LIGHT) *
          Math.max(0, x * LIGHT_DIRECTION[0] + y * LIGHT_DIRECTION[1] + z * LIGHT_DIRECTION[2]);
      const target = (py * size + px) * 4;
      output[target] = texture.data[source] * light;
      output[target + 1] = texture.data[source + 1] * light;
      output[target + 2] = texture.data[source + 2] * light;
      output[target + 3] = 255;
    }
  }
  return output;
}
