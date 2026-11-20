import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { PageHeading } from '@/components/dashboard/PageHeading';
import { ProjectEditor } from '@/components/dashboard/ProjectEditor';
import { toFormValues } from '@/features/projects/model';
import { getProjectForEditing } from '@/features/projects/queries';

export const metadata: Metadata = { title: 'Editar projeto' };

export default async function EditProjectPage({ params }: PageProps<'/dashboard/[id]/edit'>) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const project = await getProjectForEditing(id);
  if (!project) notFound();

  return (
    <main className="flex flex-col gap-8">
      <PageHeading title={`Editar ${project.name}`} />
      <ProjectEditor projectId={project.id} initialValues={toFormValues(project)} />
    </main>
  );
}
