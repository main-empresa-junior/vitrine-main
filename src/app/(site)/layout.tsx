import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="min-h-dvh bg-space-950 text-foreground">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
