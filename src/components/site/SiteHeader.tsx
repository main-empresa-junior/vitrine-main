import Link from 'next/link';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Logo } from '@/components/ui/Logo';
import { MotionToggle } from '@/components/ui/MotionToggle';

const NAV_LINKS = [
  { href: '/#todos', label: 'Projetos' },
  { href: '/#sobre', label: 'Sobre a Main' },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 bg-space-950/85 px-5 py-3 backdrop-blur-md sm:bg-transparent sm:bg-linear-to-b sm:from-space-950/70 sm:to-transparent sm:px-12 sm:py-4 sm:backdrop-blur-none">
      <Link href="/" className="rounded-field">
        <Logo variant="onDark" priority />
      </Link>
      <nav aria-label="Principal" className="flex flex-wrap items-center justify-end gap-1.5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hidden min-h-11 items-center rounded-full px-3.5 font-semibold hover:text-brand-glow sm:inline-flex"
          >
            {link.label}
          </Link>
        ))}
        <MotionToggle />
        <ButtonLink
          href="/dashboard"
          variant="ghost"
          size="sm"
          className="bg-mist-100 text-space-800 hover:bg-white"
        >
          Área da equipe
        </ButtonLink>
      </nav>
    </header>
  );
}
