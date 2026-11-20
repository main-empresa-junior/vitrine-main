import { SectionTitle } from '@/components/ui/SectionTitle';
import type { ProjectDetails } from '@/features/projects/model';

type ProjectFeaturesProps = {
  features: ProjectDetails['features'];
  accentColor: string;
};

export function ProjectFeatures({ features, accentColor }: ProjectFeaturesProps) {
  if (features.length === 0) return null;
  return (
    <section aria-labelledby="features-title">
      <SectionTitle id="features-title">Funcionalidades</SectionTitle>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {features.map((feature) => (
          <li
            key={`${feature.position}-${feature.title}`}
            className="rounded-card border border-t-4 border-border bg-surface p-6"
            style={{ borderTopColor: accentColor }}
          >
            <h3 className="font-display text-lead">{feature.title}</h3>
            {feature.description && <p className="mt-2 text-muted">{feature.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
