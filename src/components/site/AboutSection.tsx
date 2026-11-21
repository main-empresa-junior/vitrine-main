import { ButtonLink } from '@/components/ui/ButtonLink';
import { FadeIn } from '@/components/ui/FadeIn';
import { Logo } from '@/components/ui/Logo';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { REQUEST_PROJECT_PATH } from '@/lib/site';

export function AboutSection() {
  return (
    <section
      id="sobre"
      aria-labelledby="about-title"
      className="scroll-mt-24 px-5 py-24 sm:px-12 lg:px-24"
    >
      <FadeIn>
        <div className="grid items-center gap-12 rounded-panel border border-border bg-surface p-8 backdrop-blur-md md:grid-cols-2 md:p-12">
          <div>
            <SectionTitle id="about-title">Sobre a Main</SectionTitle>
            <p className="mt-5 max-w-prose text-lead text-muted">
              [Texto sobre a Main: quem somos, o que fazemos e como trabalhamos.]
            </p>
            <ButtonLink href={REQUEST_PROJECT_PATH} size="lg" className="mt-8">
              Solicitar projeto
            </ButtonLink>
          </div>
          <Logo variant="coursesOnDark" className="mx-auto h-auto w-full max-w-xs" />
        </div>
      </FadeIn>
    </section>
  );
}
