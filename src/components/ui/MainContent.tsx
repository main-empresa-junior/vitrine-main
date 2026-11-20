'use client';

import { type HTMLAttributes, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { MAIN_CONTENT_ID } from './main-content-id';

// A primeira página carregada não rouba o foco; ao trocar de rota, a página nova recebe o foco.
// Compara o caminho para não reagir à segunda execução de efeitos do modo estrito.
let lastFocusedPath: string | null = null;

export function MainContent({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const isFirstPage = lastFocusedPath === null;
    if (lastFocusedPath === path) return;
    lastFocusedPath = path;
    if (isFirstPage || window.location.hash) return;
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main
      ref={ref}
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className={cn('focus:outline-none', className)}
      {...props}
    />
  );
}
