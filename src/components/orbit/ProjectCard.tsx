import Link from 'next/link';

import { PROJECT_TYPE_LABELS } from '@/features/projects/constants';
import type { ShowcaseProject } from '@/features/projects/model';

import { PlanetThumbnail } from './PlanetThumbnail';

type ProjectCardProps = {
  project: ShowcaseProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-6 transition duration-200 hover:border-focus">
      <PlanetThumbnail
        palette={project.palette}
        texture={project.texture}
        seed={project.seed}
        size={72}
        className="self-start"
      />
      <div className="flex flex-col gap-2">
        <p className="text-small font-semibold text-muted">
          {PROJECT_TYPE_LABELS[project.type]} · {project.year}
        </p>
        <h3 className="font-display text-heading">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-card"
          >
            {project.name}
          </Link>
        </h3>
        <p className="text-muted">{project.summary}</p>
      </div>
    </article>
  );
}
