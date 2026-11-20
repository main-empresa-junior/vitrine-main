'use client';

import { type ReactNode, useRef } from 'react';

import { useIsVisible } from '@/hooks/useIsVisible';
import { fadeClasses } from '@/lib/motion';

const ENTER_MARGIN = '0px 0px -10% 0px';

type FadeInProps = {
  children: ReactNode;
};

// Começa visível (sem JavaScript o conteúdo aparece) e esmaece ao entrar e sair da tela.
export function FadeIn({ children }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref, ENTER_MARGIN, true);

  return (
    <div ref={ref} className={fadeClasses(isVisible)}>
      {children}
    </div>
  );
}
