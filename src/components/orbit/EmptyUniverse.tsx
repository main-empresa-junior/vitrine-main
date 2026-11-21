import { OrbiScout } from '@/components/mascot/OrbiScout';
import { TeamShortcut } from '@/components/site/TeamShortcut';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyOrbitIllustration } from '@/components/ui/EmptyOrbitIllustration';
import { contactMailto } from '@/lib/contact';
import { type CameraPose, overviewPose } from '@/lib/orbits';
import { REQUEST_PROJECT_PATH } from '@/lib/site';

import { EmptySystem } from './EmptySystem';
import { SpaceBackdrop } from './SpaceBackdrop';

const CENTER = [0, 0, 0] as const;
// O olhar sai do centro para o sol ficar longe do texto: à direita no desktop, no alto no celular.
const WIDE_VIEW: CameraPose = { ...overviewPose(CENTER, false), lookAt: [-18, -4, 0] };
const NARROW_VIEW: CameraPose = { ...overviewPose(CENTER, true), lookAt: [0, -24, 0] };

// A vitrine antes do primeiro projeto publicado: o sistema existe, só falta o primeiro mundo.
export function EmptyUniverse() {
  return (
    <section
      aria-labelledby="empty-universe-title"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-5 pt-32 pb-28 sm:px-12 lg:px-24"
    >
      <SpaceBackdrop
        pose={WIDE_VIEW}
        narrowPose={NARROW_VIEW}
        fallback={
          <EmptyOrbitIllustration className="absolute top-24 left-1/2 max-w-xl -translate-x-1/2 opacity-80" />
        }
      >
        <EmptySystem />
      </SpaceBackdrop>
      <OrbiScout className="absolute top-1/6 left-1/4 w-16 md:top-1/4 md:left-3/5 md:w-20" />
      <div className="relative max-w-xl">
        <h1 id="empty-universe-title" className="font-display text-display">
          Um universo esperando o primeiro mundo
        </h1>
        <p className="mt-5 max-w-prose text-lead text-muted">
          A Main ainda não colocou projetos em órbita por aqui. Em breve, cada projeto que
          construirmos vai virar um planeta neste sistema.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={REQUEST_PROJECT_PATH}>Solicitar projeto</ButtonLink>
          <ButtonLink href={contactMailto()} variant="secondary">
            Fale com a Main
          </ButtonLink>
          <TeamShortcut />
        </div>
      </div>
    </section>
  );
}
