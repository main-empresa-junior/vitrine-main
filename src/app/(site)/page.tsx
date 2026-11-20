import { AllProjects } from '@/components/orbit/AllProjects';
import { OrbitExperience } from '@/components/orbit/OrbitExperience';
import { AboutSection } from '@/components/site/AboutSection';
import { getPublishedProjects } from '@/features/projects/queries';

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <main>
      <OrbitExperience projects={projects} />
      <AllProjects projects={projects} />
      <AboutSection />
    </main>
  );
}
