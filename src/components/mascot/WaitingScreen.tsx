'use client';

import { useEffect } from 'react';

import { ProgressBar } from '@/components/ui/ProgressBar';

import { lingerOrbiUntil, MIN_ORBI_VISIBLE_MS, WAIT_BEFORE_ORBI_MS } from './waiting-store';
import { WaitingOrbi } from './WaitingOrbi';

// Usada nos loading.tsx: a barra aparece na hora; o Orbi surge por CSS só depois de 700 ms.
export function WaitingScreen() {
  useEffect(() => {
    const mountedAt = Date.now();
    return () => {
      const orbiShownAt = mountedAt + WAIT_BEFORE_ORBI_MS;
      // Se o Orbi chegou a aparecer, a cópia global o segura na tela até completar o tempo mínimo.
      if (Date.now() >= orbiShownAt) lingerOrbiUntil(orbiShownAt + MIN_ORBI_VISIBLE_MS);
    };
  }, []);

  return (
    <main aria-busy="true" className="flex min-h-dvh items-center justify-center px-5">
      <ProgressBar variant="top" />
      <div className="animate-appear-late">
        <WaitingOrbi />
      </div>
    </main>
  );
}
