'use client';

import { useState, useTransition } from 'react';

import { ProjectCard } from '@/components/orbit/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/ToastProvider';
import {
  type ActionResult,
  deleteProject,
  moveProject,
  setProjectPublished,
} from '@/features/projects/actions';
import type { ShowcaseProject } from '@/features/projects/model';
import { normalizeForSearch } from '@/lib/utils/text';

import { EmptyProjectList } from './EmptyProjectList';
import { ProjectActions } from './ProjectActions';

type ProjectListProps = {
  projects: readonly ShowcaseProject[];
};

const GROUPS = [
  { published: true, title: 'Publicados', empty: 'Nenhum projeto publicado.' },
  { published: false, title: 'Rascunhos', empty: 'Nenhum rascunho.' },
] as const;

export function ProjectList({ projects }: ProjectListProps) {
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<ShowcaseProject | null>(null);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const search = normalizeForSearch(query.trim());
  const isFiltering = search.length > 0;

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

  if (projects.length === 0) return <EmptyProjectList />;

  return (
    <div className="flex flex-col gap-10">
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
      {GROUPS.map((group) => {
        const inGroup = projects.filter((project) => project.published === group.published);
        const shown = inGroup.filter((project) =>
          normalizeForSearch(project.name).includes(search),
        );
        const titleId = `projects-${group.published ? 'published' : 'drafts'}`;
        return (
          <section key={titleId} aria-labelledby={titleId} className="flex flex-col gap-4">
            <h2 id={titleId} className="font-display text-heading">
              {group.title} <span className="text-muted">({inGroup.length})</span>
            </h2>
            {shown.length === 0 ? (
              <p className="text-muted">
                {isFiltering ? 'Nenhum projeto com esse nome.' : group.empty}
              </p>
            ) : (
              <Carousel
                label={group.title}
                items={shown.map((project) => {
                  const index = inGroup.indexOf(project);
                  return {
                    key: project.id,
                    content: (
                      <ProjectCard
                        project={project}
                        actions={
                          <ProjectActions
                            project={project}
                            canMoveBack={!isFiltering && index > 0}
                            canMoveForward={!isFiltering && index < inGroup.length - 1}
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
                        }
                      />
                    ),
                  };
                })}
              />
            )}
          </section>
        );
      })}
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
