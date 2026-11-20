import { LazyPlanetCanvas } from '@/components/orbit/LazyPlanetCanvas';
import { PROJECT_TYPE_LABELS } from '@/features/projects/constants';
import type { ProjectDetails } from '@/features/projects/model';

type ProjectHeroProps = {
  project: ProjectDetails;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <header className="grid items-center gap-8 pt-32 lg:grid-cols-2">
      <div>
        <p className="flex items-center gap-2.5 font-semibold text-muted">
          <span
            aria-hidden="true"
            className="size-3 rounded-full"
            style={{ backgroundColor: project.palette.primary }}
          />
          {PROJECT_TYPE_LABELS[project.type]} · {project.year}
        </p>
        <h1 className="mt-4 font-display text-display break-words">{project.name}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{project.summary}</p>
      </div>
      <LazyPlanetCanvas
        className="mx-auto aspect-square w-full max-w-xl"
        palette={project.palette}
        texture={project.texture}
        hasRing={project.hasRing}
        seed={project.seed}
        spinSpeed={0.2}
      />
    </header>
  );
}
