import Link from 'next/link';

import { PlanetThumbnail } from '@/components/orbit/PlanetThumbnail';
import { Icon } from '@/components/ui/Icon';
import type { ShowcaseProject } from '@/features/projects/model';

type NextProjectLinkProps = {
  project: ShowcaseProject;
};

export function NextProjectLink({ project }: NextProjectLinkProps) {
  return (
    <nav aria-label="Próximo projeto">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex items-center gap-5 rounded-card border border-border bg-surface p-6 transition duration-200 hover:border-focus"
      >
        <PlanetThumbnail
          palette={project.palette}
          texture={project.texture}
          seed={project.seed}
          size={72}
        />
        <span className="flex-1">
          <span className="block text-small font-semibold text-muted">Próximo projeto</span>
          <span className="mt-1 block font-display text-heading">{project.name}</span>
        </span>
        <Icon
          name="arrowRight"
          className="size-7 transition duration-200 group-hover:translate-x-1"
        />
      </Link>
    </nav>
  );
}
