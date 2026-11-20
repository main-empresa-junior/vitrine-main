'use client';

import { useMemo, useState, useTransition } from 'react';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/ToastProvider';
import {
  type ActionResult,
  deleteProject,
  moveProject,
  setProjectPublished,
} from '@/features/projects/actions';
import type { DashboardProject } from '@/features/projects/model';
import { normalizeForSearch } from '@/lib/utils/text';

import { ProjectRow } from './ProjectRow';

type ProjectListProps = {
  projects: readonly DashboardProject[];
};

export function ProjectList({ projects }: ProjectListProps) {
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<DashboardProject | null>(null);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  const visible = useMemo(
    () =>
      projects.filter((project) =>
        normalizeForSearch(project.name).includes(normalizeForSearch(query.trim())),
      ),
    [projects, query],
  );
  const isFiltering = query.trim().length > 0;

  function run(action: () => Promise<ActionResult>, successMessage: string) {
    startTransition(async () => {
      const result = await action();
      showToast(result.ok ? successMessage : result.error, result.ok ? 'success' : 'error');
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const { id, name } = pendingDelete;
    setPendingDelete(null);
    run(() => deleteProject(id), `${name} foi excluído.`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="max-w-sm">
        <TextField
          id="project-search"
          label="Buscar por nome"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          hint={isFiltering ? 'A ordem só pode ser mudada sem busca.' : undefined}
        />
      </div>
      {visible.length === 0 ? (
        <p className="text-muted">
          {isFiltering ? 'Nenhum projeto com esse nome.' : 'Nenhum projeto cadastrado ainda.'}
        </p>
      ) : (
        <ol className="flex flex-col gap-3" aria-label="Projetos na ordem da vitrine">
          {visible.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              canMoveUp={!isFiltering && index > 0}
              canMoveDown={!isFiltering && index < visible.length - 1}
              isBusy={isPending}
              onMove={(direction) =>
                run(() => moveProject(project.id, direction), 'Ordem atualizada.')
              }
              onTogglePublished={() =>
                run(
                  () => setProjectPublished(project.id, !project.published),
                  project.published
                    ? `${project.name} virou rascunho.`
                    : `${project.name} foi publicado.`,
                )
              }
              onDelete={() => setPendingDelete(project)}
            />
          ))}
        </ol>
      )}
      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Excluir projeto?"
        description={
          pendingDelete
            ? `${pendingDelete.name} e as telas dele serão apagados de vez. Isso não pode ser desfeito.`
            : undefined
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Excluir
            </Button>
          </>
        }
      />
    </div>
  );
}
