import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SpaceBackdrop } from '@/components/orbit/SpaceBackdrop';
import { NextProjectLink } from '@/components/project/NextProjectLink';
import { ProjectFacts } from '@/components/project/ProjectFacts';
import { ProjectFeatures } from '@/components/project/ProjectFeatures';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { ProjectHero } from '@/components/project/ProjectHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { detailsToFormValues, type ProjectDetails } from '@/features/projects/model';
import { getPublishedProject, getPublishedProjects } from '@/features/projects/queries';
import { projectPublishSchema } from '@/features/projects/schema';
import { projectPageBackground } from '@/lib/color';

// O céu aparece por baixo da cor do projeto, translúcida e escura o bastante para manter o contraste.
const PAGE_TINT_ALPHA = 'B3';
// Cache Components exige ao menos um parâmetro; sem projetos publicados, este cai no 404.
const EMPTY_SHOWCASE_SLUG = 'sem-projetos';

function isComplete(project: ProjectDetails): boolean {
  return projectPublishSchema.safeParse(detailsToFormValues(project, true)).success;
}

// Só pré-renderiza projetos completos: um registro quebrado não pode derrubar o build inteiro.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getPublishedProjects();
  const details = await Promise.all(projects.map(({ slug }) => getPublishedProject(slug)));
  const complete = details.filter(
    (project): project is ProjectDetails => project !== null && isComplete(project),
  );
  if (complete.length === 0) return [{ slug: EMPTY_SHOWCASE_SLUG }];
  return complete.map(({ slug }) => ({ slug }));
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
  // Publicar exige tudo o que a página mostra; se algo escapar, cai na página de erro do site.
  if (!isComplete(project)) {
    console.error(`Projeto publicado incompleto: ${project.slug}`);
    throw new Error(`O projeto ${project.slug} está publicado sem todas as informações.`);
  }

  const index = allProjects.findIndex(({ id }) => id === project.id);
  const nextProject = allProjects.length > 1 ? allProjects[(index + 1) % allProjects.length] : null;
  const paragraphs = project.description.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="relative px-5 pb-24 sm:px-12 lg:px-24">
      <SpaceBackdrop />
      <div
        aria-hidden="true"
        className="fixed inset-0"
        style={{
          backgroundColor: `${projectPageBackground(project.palette.background)}${PAGE_TINT_ALPHA}`,
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-20">
        <ProjectHero project={project} />
        <div className="grid gap-10 lg:grid-cols-5">
          <section aria-labelledby="about-project-title" className="lg:col-span-3">
            <SectionTitle id="about-project-title">Sobre o projeto</SectionTitle>
            <div className="mt-6 flex flex-col gap-4 text-lead text-muted">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
          <div className="lg:col-span-2">
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
