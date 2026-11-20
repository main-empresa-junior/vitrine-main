'use client';

import { type BaseSyntheticEvent, useEffect, useRef, useState, useTransition } from 'react';
import { FormProvider, type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { saveProject } from '@/features/projects/actions';
import {
  projectDraftSchema,
  type ProjectFormValues,
  projectPublishSchema,
} from '@/features/projects/schema';

import { FeaturesSection } from './FeaturesSection';
import { collectFormIssues, type FormIssue } from './form-issues';
import { FormIssueList } from './FormIssueList';
import { ImagesSection } from './ImagesSection';
import { InfoSection } from './InfoSection';
import { PaletteSection } from './PaletteSection';
import { ProjectPreview } from './ProjectPreview';
import { TeamSection } from './TeamSection';
import { useUnsavedChanges } from './UnsavedChangesProvider';

type SaveMode = 'draft' | 'publish';

const RESOLVERS: Record<SaveMode, Resolver<ProjectFormValues>> = {
  draft: zodResolver(projectDraftSchema),
  publish: zodResolver(projectPublishSchema),
};

type ProjectEditorProps = {
  initialValues: ProjectFormValues;
  projectId?: string;
};

export function ProjectEditor({ initialValues, projectId }: ProjectEditorProps) {
  // O mesmo formulário valida como rascunho ou como publicação, conforme o botão usado.
  const modeRef = useRef<SaveMode>('publish');
  const form = useForm<ProjectFormValues>({
    resolver: (values, context, options) => RESOLVERS[modeRef.current](values, context, options),
    defaultValues: initialValues,
  });
  const [isPending, startTransition] = useTransition();
  const [savingAs, setSavingAs] = useState<SaveMode | null>(null);
  const [issues, setIssues] = useState<{ mode: SaveMode; items: FormIssue[] } | null>(null);
  const showToast = useToast();
  const { setHasUnsavedChanges } = useUnsavedChanges();
  const { isDirty } = form.formState;

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges]);

  // Em caso de sucesso a ação redireciona para a lista; aqui só chegam os erros.
  function submitAs(mode: SaveMode, event?: BaseSyntheticEvent) {
    modeRef.current = mode;
    return form.handleSubmit(
      (values) => {
        setIssues(null);
        setSavingAs(mode);
        startTransition(async () => {
          const failure = await saveProject(
            { ...values, published: mode === 'publish' },
            projectId,
          );
          setSavingAs(null);
          // Depois de um redirect a promessa pode voltar sem valor: nada a mostrar aqui.
          if (!failure) return;
          if (failure.field) form.setError(failure.field, { message: failure.error });
          showToast(failure.error, 'error');
        });
      },
      (errors) => setIssues({ mode, items: collectFormIssues(errors) }),
    )(event);
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(event) => submitAs('publish', event)}
        className="grid gap-8 lg:grid-cols-5"
      >
        <div className="flex flex-col gap-6 lg:col-span-3">
          {issues && issues.items.length > 0 && (
            <FormIssueList
              title={
                issues.mode === 'publish'
                  ? 'Faltam informações para publicar'
                  : 'Confira antes de salvar o rascunho'
              }
              issues={issues.items}
            />
          )}
          <InfoSection isEditing={Boolean(projectId)} />
          <TeamSection />
          <FeaturesSection />
          <PaletteSection />
          <ImagesSection />
        </div>
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            <ProjectPreview projectId={projectId} />
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                disabled={isPending}
                isLoading={savingAs === 'draft'}
                loadingLabel="Salvando…"
                onClick={(event) => submitAs('draft', event)}
              >
                Salvar como rascunho
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                isLoading={savingAs === 'publish'}
                loadingLabel="Publicando…"
              >
                Salvar e publicar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
