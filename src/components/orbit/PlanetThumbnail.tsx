'use client';

import { useEffect, useRef } from 'react';

import { projectSphere } from '@/lib/sphere-projection';
import { generatePlanetPixels, type PlanetPalette, type PlanetTextureKind } from '@/lib/textures';
import { cn } from '@/lib/utils/cn';

const THUMBNAIL_TEXTURE = { width: 128, height: 64 } as const;

type PlanetThumbnailProps = {
  palette: PlanetPalette;
  texture: PlanetTextureKind;
  seed: number;
  size?: number;
  className?: string;
};

export function PlanetThumbnail({
  palette,
  texture,
  seed,
  size = 56,
  className,
}: PlanetThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { primary, accent, background } = palette;

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const pixels = generatePlanetPixels(
      texture,
      { primary, accent, background },
      seed,
      THUMBNAIL_TEXTURE.width,
      THUMBNAIL_TEXTURE.height,
    );
    context.putImageData(new ImageData(projectSphere(pixels, size), size, size), 0, 0);
  }, [texture, primary, accent, background, seed, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      className={cn('shrink-0 rounded-full', className)}
    />
  );
}
