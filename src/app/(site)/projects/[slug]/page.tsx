import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextProjectLink } from '@/components/project/NextProjectLink';
import { ProjectFacts } from '@/components/project/ProjectFacts';
import { ProjectFeatures } from '@/components/project/ProjectFeatures';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { ProjectHero } from '@/components/project/ProjectHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getPublishedProject, getPublishedProjects } from '@/features/projects/queries';
import { projectPageBackground } from '@/lib/color';

// Cache Components exige ao menos um parâmetro; sem projetos publicados, este cai no 404.
const EMPTY_SHOWCASE_SLUG = 'sem-projetos';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getPublishedProjects();
  if (projects.length === 0) return [{ slug: EMPTY_SHOWCASE_SLUG }];
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    openGraph: { title: `${project.name} | Main`, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getPublishedProject(slug),
    getPublishedProjects(),
  ]);
  if (!project) notFound();

  const index = allProjects.findIndex(({ id }) => id === project.id);
  const nextProject = allProjects.length > 1 ? allProjects[(index + 1) % allProjects.length] : null;
  const paragraphs = project.description.split(/\n\s*\n/).filter(Boolean);

  return (
    <main
      className="px-5 pb-24 sm:px-12 lg:px-24"
      style={{ backgroundColor: projectPageBackground(project.palette.background) }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        <ProjectHero project={project} />
        <div className="grid gap-10 lg:grid-cols-5">
          {paragraphs.length > 0 && (
            <section aria-labelledby="about-project-title" className="lg:col-span-3">
              <SectionTitle id="about-project-title">Sobre o projeto</SectionTitle>
              <div className="mt-6 flex flex-col gap-4 text-lead text-muted">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}
          <div className={paragraphs.length > 0 ? 'lg:col-span-2' : 'lg:col-span-5'}>
            <ProjectFacts project={project} />
          </div>
        </div>
        <ProjectFeatures features={project.features} accentColor={project.palette.primary} />
        <ProjectGallery images={project.images} projectName={project.name} />
        {nextProject && <NextProjectLink project={nextProject} />}
      </div>
    </main>
  );
}
