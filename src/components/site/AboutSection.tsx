import { Logo } from '@/components/ui/Logo';

export function AboutSection() {
  return (
    <section
      id="sobre"
      aria-labelledby="about-title"
      className="relative scroll-mt-24 bg-space-950 px-5 py-24 sm:px-12 lg:px-24"
    >
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 id="about-title" className="font-display text-title">
            Sobre a Main
          </h2>
          <p className="mt-5 max-w-prose text-lead text-muted">
            [Texto sobre a Main: quem somos, o que fazemos e como trabalhamos.]
          </p>
        </div>
        <Logo variant="coursesOnDark" className="mx-auto h-auto w-full max-w-xs" />
      </div>
    </section>
  );
}
