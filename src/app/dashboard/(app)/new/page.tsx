import type { Metadata } from 'next';

import { PageHeading } from '@/components/dashboard/PageHeading';
import { ProjectEditor } from '@/components/dashboard/ProjectEditor';
import { PALETTE_PRESETS } from '@/features/projects/constants';
import type { ProjectFormValues } from '@/features/projects/schema';

export const metadata: Metadata = { title: 'Novo projeto' };

const EMPTY_PROJECT: ProjectFormValues = {
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
  palette: PALETTE_PRESETS[0].palette,
  texture: 'rocky',
  hasRing: false,
  published: false,
  images: [],
};

export default function NewProjectPage() {
  return (
    <main className="flex flex-col gap-8">
      <PageHeading title="Novo projeto" />
      <ProjectEditor initialValues={EMPTY_PROJECT} />
    </main>
  );
}
