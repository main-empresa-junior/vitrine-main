'use client';

import { type HTMLAttributes, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { MAIN_CONTENT_ID } from './main-content-id';

// A primeira página carregada não rouba o foco; as seguintes recebem o foco ao trocar de rota.
let hasShownFirstPage = false;

export function MainContent({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!hasShownFirstPage) {
      hasShownFirstPage = true;
      return;
    }
    if (window.location.hash) return;
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
