'use client';

import { useEffect, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { saveProject } from '@/features/projects/actions';
import { projectFormSchema, type ProjectFormValues } from '@/features/projects/schema';

import { FeaturesSection } from './FeaturesSection';
import { ImagesSection } from './ImagesSection';
import { InfoSection } from './InfoSection';
import { PaletteSection } from './PaletteSection';
import { ProjectPreview } from './ProjectPreview';
import { TeamSection } from './TeamSection';
import { useUnsavedChanges } from './UnsavedChangesProvider';

type SaveMode = 'draft' | 'publish';

type ProjectEditorProps = {
  initialValues: ProjectFormValues;
  projectId?: string;
};

export function ProjectEditor({ initialValues, projectId }: ProjectEditorProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues,
  });
  const [isPending, startTransition] = useTransition();
  const [savingAs, setSavingAs] = useState<SaveMode | null>(null);
  const showToast = useToast();
  const { setHasUnsavedChanges } = useUnsavedChanges();
  const { isDirty } = form.formState;

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges]);

  // Em caso de sucesso a ação redireciona para a lista; aqui só chegam os erros.
  const submitAs = (mode: SaveMode) =>
    form.handleSubmit(
      (values) => {
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
      () => showToast('Confira os campos destacados.', 'error'),
    );

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submitAs('publish')} className="grid gap-8 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
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
                onClick={submitAs('draft')}
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
