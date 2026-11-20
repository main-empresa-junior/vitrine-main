import { ImageResponse } from 'next/og';

import { PROJECT_TYPE_LABELS } from '@/features/projects/constants';
import { getPublishedProject } from '@/features/projects/queries';
import { projectPageBackground } from '@/lib/color';
import { brandColors, spaceColors } from '@/lib/design-tokens';

export const alt = 'Projeto da Main, empresa júnior';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TEXT_COLOR = '#EEF1FF';
const MUTED_COLOR = '#B9C2EE';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  const name = project?.name ?? 'Main';
  const palette = project?.palette ?? {
    primary: brandColors.violet,
    accent: brandColors.glow,
    background: spaceColors[900],
  };

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 80,
        background: projectPageBackground(palette.background),
        color: TEXT_COLOR,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
        {project && (
          <div style={{ fontSize: 30, color: MUTED_COLOR }}>
            {PROJECT_TYPE_LABELS[project.type]} · {project.year}
          </div>
        )}
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, marginTop: 20 }}>{name}</div>
        {project && (
          <div style={{ fontSize: 32, color: MUTED_COLOR, marginTop: 28 }}>{project.summary}</div>
        )}
        <div style={{ fontSize: 28, marginTop: 48, color: brandColors.glow }}>
          Main · Projetos em órbita
        </div>
      </div>
      <div
        style={{
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${palette.accent}, ${palette.primary} 45%, ${palette.background})`,
          boxShadow: `0 0 80px ${palette.primary}`,
        }}
      />
    </div>,
    size,
  );
}
