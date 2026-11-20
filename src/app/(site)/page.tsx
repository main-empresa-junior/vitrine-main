import { AllProjects } from '@/components/orbit/AllProjects';
import { EmptyUniverse } from '@/components/orbit/EmptyUniverse';
import { OrbitExperience } from '@/components/orbit/OrbitExperience';
import { AboutSection } from '@/components/site/AboutSection';
import { getPublishedProjects } from '@/features/projects/queries';
import { getShowcaseState } from '@/lib/showcase-state';

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const isEmpty = getShowcaseState(projects) === 'empty';

  return (
    <main>
      {isEmpty ? (
        <EmptyUniverse />
      ) : (
        <>
          <OrbitExperience projects={projects} />
          <AllProjects projects={projects} />
        </>
      )}
      <AboutSection />
    </main>
  );
}
