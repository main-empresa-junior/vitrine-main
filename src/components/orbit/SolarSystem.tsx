import type { ShowcaseProject } from '@/features/projects/model';
import { planetDistance, planetRadius, systemCenter } from '@/lib/orbits';

import { OrbitingPlanet } from './OrbitingPlanet';
import { OrbitRing } from './OrbitRing';
import { Stars } from './Stars';
import { Sun } from './Sun';

const AXIAL_TILT_BASE = 0.25;
const AXIAL_TILT_STEP = 0.12;

type SolarSystemProps = {
  orbitIndex: number;
  projects: readonly ShowcaseProject[];
};

export function SolarSystem({ orbitIndex, projects }: SolarSystemProps) {
  const center = systemCenter(orbitIndex);

  return (
    <group position={center}>
      <Sun orbitIndex={orbitIndex} center={center} />
      <Stars
        count={1400}
        minRadius={60}
        maxRadius={260}
        seed={orbitIndex + 101}
        size={0.45}
        opacity={0.75}
      />
      {projects.map((project, slot) => (
        <group key={project.id}>
          <OrbitRing radius={planetDistance(slot)} />
          <OrbitingPlanet
            slot={slot}
            palette={project.palette}
            texture={project.texture}
            hasRing={project.hasRing}
            seed={project.seed}
            radius={planetRadius(project.texture, project.seed)}
            tilt={AXIAL_TILT_BASE + (slot % 3) * AXIAL_TILT_STEP}
          />
        </group>
      ))}
    </group>
  );
}
