import type { ReactNode } from 'react';

import { VLibras } from '@/components/accessibility/VLibras';
import { OrbiCorner } from '@/components/mascot/OrbiCorner';
import { CssStarfield } from '@/components/site/CssStarfield';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    // A área pública é sempre escura: o fundo próprio não depende do tema guardado no <html>.
    <div data-theme="dark" className="isolate min-h-dvh bg-space-950 text-foreground">
      <ToastProvider>
        <CssStarfield />
        <SiteHeader />
        {children}
        <SiteFooter />
        <OrbiCorner />
        <VLibras />
      </ToastProvider>
    </div>
  );
}
