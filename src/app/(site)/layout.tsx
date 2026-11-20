import type { ReactNode } from 'react';

import { OrbiCorner } from '@/components/mascot/OrbiCorner';
import { CssStarfield } from '@/components/site/CssStarfield';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="min-h-dvh text-foreground">
      <CssStarfield />
      <SiteHeader />
      {children}
      <SiteFooter />
      <OrbiCorner />
    </div>
  );
}
