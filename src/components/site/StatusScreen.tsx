import type { ReactNode } from 'react';

import { OrbiFigure } from '@/components/mascot/OrbiFigure';

type StatusScreenProps = {
  title: string;
  message: string;
  children: ReactNode;
};

export function StatusScreen({ title, message, children }: StatusScreenProps) {
  return (
    <main
      data-theme="dark"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-space-950 px-5 text-center text-foreground"
    >
      <div className="w-28 -rotate-12">
        <OrbiFigure />
      </div>
      <h1 className="font-display text-title">{title}</h1>
      <p className="max-w-prose text-lead text-muted">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">{children}</div>
    </main>
  );
}
