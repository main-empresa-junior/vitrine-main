import type { Metadata } from 'next';
import { connection } from 'next/server';

import { PageHeading } from '@/components/dashboard/PageHeading';
import { ProjectEditor } from '@/components/dashboard/ProjectEditor';
import { suggestionToPlanetFields } from '@/features/projects/planet-fields';
import type { ProjectFormValues } from '@/features/projects/schema';
import { suggestPlanet } from '@/lib/planet-suggestion';

export const metadata: Metadata = { title: 'Novo projeto' };

const EMPTY_PROJECT: Omit<ProjectFormValues, 'texture' | 'hasRing' | 'palette'> = {
  name: '',
  slug: '',
  client: '',
  year: new Date().getFullYear(),
  type: 'app',
  summary: '',
  description: '',
  technologies: [],
  developers: [],
  features: [],
  published: false,
  images: [],
};

export default async function NewProjectPage() {
  // Cada projeto novo nasce com um planeta sorteado na hora do pedido.
  await connection();
  const initialValues = { ...EMPTY_PROJECT, ...suggestionToPlanetFields(suggestPlanet()) };

  return (
    <main className="flex flex-col gap-8">
      <PageHeading title="Novo projeto" />
      <ProjectEditor initialValues={initialValues} />
    </main>
  );
}
