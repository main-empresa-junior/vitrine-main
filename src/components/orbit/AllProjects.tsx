'use client';

import { useState } from 'react';

import { Carousel } from '@/components/ui/Carousel';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { PROJECT_TYPES, type ProjectType } from '@/features/projects/constants';
import type { ShowcaseProject } from '@/features/projects/model';
import { cn } from '@/lib/utils/cn';

import { ProjectCard } from './ProjectCard';

type Filter = ProjectType | 'all';

const FILTER_LABELS: Record<Filter, string> = {
  all: 'Todos',
  app: 'Apps',
  site: 'Sites',
  system: 'Sistemas',
};
const FILTERS: readonly Filter[] = ['all', ...PROJECT_TYPES];

type AllProjectsProps = {
  projects: readonly ShowcaseProject[];
};

export function AllProjects({ projects }: AllProjectsProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = filter === 'all' ? projects : projects.filter(({ type }) => type === filter);

  return (
    <section
      id="todos"
      aria-labelledby="all-projects-title"
      className="scroll-mt-24 px-5 pt-48 pb-28 sm:px-12 lg:px-24"
    >
      <FadeIn>
        <SectionTitle id="all-projects-title">Todos os projetos</SectionTitle>
        <p className="mt-3 max-w-prose text-lead text-muted">
          Para quem quer achar um projeto sem viajar pelas órbitas.
        </p>
        <div role="group" aria-label="Filtrar por tipo" className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={cn(
                'min-h-11 rounded-full border-2 px-5 font-semibold transition duration-200',
                filter === option
                  ? 'border-foreground bg-foreground text-space-900'
                  : 'border-border hover:border-focus',
              )}
            >
              {FILTER_LABELS[option]}
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="mt-8 text-muted">Nenhum projeto desse tipo ainda.</p>
        ) : (
          <div className="mt-8">
            <Carousel
              label="Todos os projetos"
              items={visible.map((project) => ({
                key: project.id,
                content: <ProjectCard project={project} />,
              }))}
            />
          </div>
        )}
      </FadeIn>
    </section>
  );
}
