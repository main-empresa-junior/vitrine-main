import type { ReactNode } from 'react';

import { TagList } from '@/components/ui/TagList';
import type { ProjectDetails } from '@/features/projects/model';

type ProjectFactsProps = {
  project: ProjectDetails;
};

export function ProjectFacts({ project }: ProjectFactsProps) {
  const facts: { label: string; value: ReactNode }[] = [
    { label: 'Cliente', value: project.client },
    { label: 'Ano', value: project.year },
    { label: 'Desenvolvido por', value: <TagList items={project.developers} /> },
    { label: 'Tecnologias', value: <TagList items={project.technologies} /> },
  ];

  return (
    <dl className="grid gap-6 rounded-card border border-border bg-surface p-7 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-2">
          <dt className="text-small font-semibold text-muted">{fact.label}</dt>
          <dd className="font-semibold">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
