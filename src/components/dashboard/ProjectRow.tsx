import Link from 'next/link';

import { PlanetThumbnail } from '@/components/orbit/PlanetThumbnail';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { PROJECT_TYPE_LABELS } from '@/features/projects/constants';
import type { ShowcaseProject } from '@/features/projects/model';
import type { MoveDirection } from '@/features/projects/ordering';

import { ReorderButtons } from './ReorderButtons';

type ProjectRowProps = {
  project: ShowcaseProject;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isBusy: boolean;
  onMove: (direction: MoveDirection) => void;
  onTogglePublished: () => void;
  onDelete: () => void;
};

export function ProjectRow({
  project,
  canMoveUp,
  canMoveDown,
  isBusy,
  onMove,
  onTogglePublished,
  onDelete,
}: ProjectRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-surface p-4">
      <PlanetThumbnail palette={project.palette} texture={project.texture} seed={project.seed} />
      <div className="min-w-40 flex-1">
        <p className="font-display text-lead">{project.name}</p>
        <p className="text-small text-muted">
          {PROJECT_TYPE_LABELS[project.type]} · {project.year}
        </p>
      </div>
      <Badge tone={project.published ? 'success' : 'neutral'}>
        {project.published ? 'Publicado' : 'Rascunho'}
      </Badge>
      <div className="flex flex-wrap items-center gap-1">
        <ReorderButtons
          itemLabel={project.name}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          disabled={isBusy}
          onMove={onMove}
        />
        <Button variant="secondary" size="sm" disabled={isBusy} onClick={onTogglePublished}>
          <Icon name={project.published ? 'eyeOff' : 'eye'} />
          {project.published ? 'Despublicar' : 'Publicar'}
        </Button>
        <Link
          href={`/dashboard/${project.id}/edit`}
          className={buttonClasses({ variant: 'secondary', size: 'sm' })}
        >
          <Icon name="pencil" />
          Editar<span className="sr-only"> {project.name}</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-danger"
          disabled={isBusy}
          onClick={onDelete}
          aria-label={`Excluir ${project.name}`}
        >
          <Icon name="trash" />
        </Button>
      </div>
    </li>
  );
}
