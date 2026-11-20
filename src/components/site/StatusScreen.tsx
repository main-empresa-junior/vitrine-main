import type { ReactNode } from 'react';

import { MainContent } from '@/components/ui/MainContent';

type StatusScreenProps = {
  title: string;
  message: string;
  children: ReactNode;
};

export function StatusScreen({ title, message, children }: StatusScreenProps) {
  return (
    <MainContent
      data-theme="dark"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-space-950 px-5 text-center text-foreground"
    >
      <h1 className="font-display text-title">{title}</h1>
      <p className="max-w-prose text-lead text-muted">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">{children}</div>
    </MainContent>
  );
}
