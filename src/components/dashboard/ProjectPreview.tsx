'use client';

import { useDeferredValue } from 'react';
import { useFormContext } from 'react-hook-form';

import { LazyPlanetCanvas } from '@/components/orbit/LazyPlanetCanvas';
import { ProjectSheet } from '@/components/orbit/ProjectSheet';
import { projectDraftSchema, type ProjectFormValues } from '@/features/projects/schema';
import { brandColors } from '@/lib/design-tokens';
import { seedFromText } from '@/lib/textures';

const NEW_PROJECT_SEED = 'novo-projeto';
const FALLBACK_PALETTE = {
  primary: brandColors.violet,
  accent: brandColors.glow,
  background: brandColors.ink,
};

type ProjectPreviewProps = {
  projectId?: string;
};

export function ProjectPreview({ projectId }: ProjectPreviewProps) {
  const values = useFormContext<ProjectFormValues>().watch();
  const typedPalette = projectDraftSchema.shape.palette.safeParse(values.palette);
  // Gerar a textura custa alguns milissegundos; adiar evita travar a digitação.
  const palette = useDeferredValue(typedPalette.success ? typedPalette.data : FALLBACK_PALETTE);
  const texture = useDeferredValue(values.texture);

  return (
    <aside
      aria-label="Prévia na vitrine"
      data-theme="dark"
      className="flex flex-col gap-4 rounded-panel bg-space-950 p-5 text-foreground"
    >
      <p className="text-small font-semibold text-muted">Prévia na vitrine</p>
      <LazyPlanetCanvas
        className="aspect-square w-full"
        palette={palette}
        texture={texture}
        hasRing={values.hasRing}
        seed={seedFromText(projectId ?? NEW_PROJECT_SEED)}
      />
      <ProjectSheet isLinkEnabled={false} project={{ ...values, palette }} />
    </aside>
  );
}
