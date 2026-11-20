import type { ReactNode } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/Badge';
import { PROJECT_TYPE_LABELS } from '@/features/projects/constants';
import type { ShowcaseProject } from '@/features/projects/model';

import { PlanetThumbnail } from './PlanetThumbnail';

type ProjectCardProps = {
  project: ShowcaseProject;
  // No painel o cartão mostra o status e as ações; na vitrine, o cartão inteiro é o link.
  actions?: ReactNode;
};

export function ProjectCard({ project, actions }: ProjectCardProps) {
  const isShowcase = actions === undefined;

  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-6 transition duration-200 hover:border-focus">
      <div className="flex items-start justify-between gap-3">
        <PlanetThumbnail
          palette={project.palette}
          texture={project.texture}
          seed={project.seed}
          size={72}
          className="self-start"
        />
        {!isShowcase && (
          <Badge tone={project.published ? 'success' : 'neutral'}>
            {project.published ? 'Publicado' : 'Rascunho'}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-small font-semibold text-muted">
          {PROJECT_TYPE_LABELS[project.type]} · {project.year}
        </p>
        <h3 className="font-display text-heading break-words">
          {isShowcase ? (
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:rounded-card"
            >
              {project.name}
            </Link>
          ) : (
            project.name || 'Sem nome'
          )}
        </h3>
        <p className="line-clamp-3 text-muted">{project.summary}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-1">{actions}</div>}
    </article>
  );
}
