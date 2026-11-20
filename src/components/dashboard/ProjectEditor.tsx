'use client';

import { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const showToast = useToast();

  const submitWith = (published: boolean) =>
    form.handleSubmit(
      (values) =>
        startTransition(async () => {
          const result = await saveProject({ ...values, published }, projectId);
          if (!result.ok) {
            if (result.field) form.setError(result.field, { message: result.error });
            showToast(result.error, 'error');
            return;
          }
          showToast(published ? 'Projeto publicado.' : 'Rascunho salvo.', 'success');
          form.reset({ ...values, published });
          if (!projectId) router.replace(`/dashboard/${result.id}/edit`);
        }),
      () => showToast('Confira os campos destacados.', 'error'),
    );

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submitWith(true)} className="grid gap-8 lg:grid-cols-5">
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
              <Button variant="secondary" disabled={isPending} onClick={submitWith(false)}>
                Salvar como rascunho
              </Button>
              <Button type="submit" isLoading={isPending} loadingLabel="Salvando…">
                Salvar e publicar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
