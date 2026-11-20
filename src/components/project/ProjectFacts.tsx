import type { ReactNode } from 'react';

import { TagList } from '@/components/ui/TagList';
import type { ProjectDetails } from '@/features/projects/model';

type ProjectFactsProps = {
  project: ProjectDetails;
};

export function ProjectFacts({ project }: ProjectFactsProps) {
  const facts: { label: string; value: ReactNode; isVisible: boolean }[] = [
    { label: 'Cliente', value: project.client, isVisible: Boolean(project.client) },
    { label: 'Ano', value: project.year, isVisible: true },
    {
      label: 'Desenvolvido por',
      value: <TagList items={project.developers} />,
      isVisible: project.developers.length > 0,
    },
    {
      label: 'Tecnologias',
      value: <TagList items={project.technologies} />,
      isVisible: project.technologies.length > 0,
    },
  ];

  return (
    <dl className="grid gap-6 rounded-card border border-border bg-surface p-7 sm:grid-cols-2">
      {facts
        .filter((fact) => fact.isVisible)
        .map((fact) => (
          <div key={fact.label} className="flex flex-col gap-2">
            <dt className="text-small font-semibold text-muted">{fact.label}</dt>
            <dd className="font-semibold">{fact.value}</dd>
          </div>
        ))}
    </dl>
  );
}
