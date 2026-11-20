import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from '@/components/ui/MobileMenu';

import { SiteHeaderItems } from './SiteHeaderItems';

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 bg-space-950/85 px-5 py-3 backdrop-blur-md nav:bg-transparent nav:bg-linear-to-b nav:from-space-950/70 nav:to-transparent nav:px-12 nav:py-4 nav:backdrop-blur-none">
      <Link href="/" className="rounded-field">
        <Logo variant="onDark" priority />
      </Link>
      <nav aria-label="Principal">
        <SiteHeaderItems placement="bar" />
        <MobileMenu>
          <SiteHeaderItems placement="menu" />
        </MobileMenu>
      </nav>
    </header>
  );
}
