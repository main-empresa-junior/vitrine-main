'use client';

import dynamic from 'next/dynamic';

export const LazyPlanetCanvas = dynamic(
  () => import('./PlanetCanvas').then((module) => module.PlanetCanvas),
  { ssr: false },
);
