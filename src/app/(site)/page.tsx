import { AllProjects } from '@/components/orbit/AllProjects';
import { EmptyUniverse } from '@/components/orbit/EmptyUniverse';
import { OrbitExperience } from '@/components/orbit/OrbitExperience';
import { AboutSection } from '@/components/site/AboutSection';
import { ScrollToHashOnArrival } from '@/components/site/ScrollToHashOnArrival';
import { MainContent } from '@/components/ui/MainContent';
import { getPublishedProjects } from '@/features/projects/queries';
import { getShowcaseState } from '@/lib/showcase-state';

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const isEmpty = getShowcaseState(projects) === 'empty';

  return (
    <MainContent>
      {isEmpty ? (
        <EmptyUniverse />
      ) : (
        <>
          <OrbitExperience projects={projects} />
          <AllProjects projects={projects} />
        </>
      )}
      <AboutSection />
      <ScrollToHashOnArrival />
    </MainContent>
  );
}
