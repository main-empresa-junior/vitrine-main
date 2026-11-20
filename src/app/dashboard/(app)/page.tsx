import type { Metadata } from 'next';

import { ProjectList } from '@/components/dashboard/ProjectList';
import { SavedNotice } from '@/components/dashboard/SavedNotice';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Icon } from '@/components/ui/Icon';
import { getDashboardProjects } from '@/features/projects/queries';

export const metadata: Metadata = { title: 'Projetos' };

export default async function DashboardPage() {
  const projects = await getDashboardProjects();

  return (
    <main className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-title">Projetos</h1>
          <p className="mt-2 max-w-prose text-muted">
            A ordem da lista é a ordem da vitrine. A cada 7 projetos publicados, começa uma nova
            órbita.
          </p>
        </div>
        <ButtonLink href="/dashboard/new">
          <Icon name="plus" />
          Novo projeto
        </ButtonLink>
      </div>
      <ProjectList projects={projects} />
      <SavedNotice />
    </main>
  );
}
