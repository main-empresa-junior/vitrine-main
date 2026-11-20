import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="min-h-dvh bg-space-950 text-foreground">
      {children}
    </div>
  );
}
