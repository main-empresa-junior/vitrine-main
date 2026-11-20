import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Icon } from '@/components/ui/Icon';
import type { ShowcaseProject } from '@/features/projects/model';
import type { MoveDirection } from '@/features/projects/ordering';

import { ReorderButtons } from './ReorderButtons';

type ProjectActionsProps = {
  project: ShowcaseProject;
  canMoveBack: boolean;
  canMoveForward: boolean;
  isBusy: boolean;
  onMove: (direction: MoveDirection) => void;
  onTogglePublished: () => void;
  onDelete: () => void;
};

export function ProjectActions({
  project,
  canMoveBack,
  canMoveForward,
  isBusy,
  onMove,
  onTogglePublished,
  onDelete,
}: ProjectActionsProps) {
  return (
    <>
      <ButtonLink href={`/dashboard/${project.id}/edit`} variant="secondary" size="sm">
        <Icon name="pencil" />
        Editar<span className="sr-only"> {project.name}</span>
      </ButtonLink>
      <Button variant="secondary" size="sm" disabled={isBusy} onClick={onTogglePublished}>
        <Icon name={project.published ? 'eyeOff' : 'eye'} />
        {project.published ? 'Despublicar' : 'Publicar'}
        <span className="sr-only"> {project.name}</span>
      </Button>
      <ReorderButtons
        orientation="horizontal"
        itemLabel={project.name}
        canMoveUp={canMoveBack}
        canMoveDown={canMoveForward}
        disabled={isBusy}
        onMove={onMove}
      />
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
    </>
  );
}
