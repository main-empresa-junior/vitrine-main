import type { ReactNode } from 'react';

import { OrbiFigure } from './OrbiFigure';

import './orbi.css';

type OrbiSpeakingProps = {
  children: ReactNode;
};

// O Orbi acenando com um balão de fala; o texto do balão é texto de verdade, lido por leitores de tela.
export function OrbiSpeaking({ children }: OrbiSpeakingProps) {
  return (
    <div className="flex animate-appear flex-col items-center gap-5">
      <div className="relative max-w-md rounded-panel border border-border bg-surface px-6 py-5 text-center text-lead font-semibold text-foreground shadow-card backdrop-blur-md">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-r border-b border-border bg-surface"
        />
      </div>
      <div aria-hidden="true" className="orbi wave w-32">
        <OrbiFigure />
      </div>
    </div>
  );
}
