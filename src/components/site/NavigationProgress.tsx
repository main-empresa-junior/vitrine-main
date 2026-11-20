'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const START_VALUE = 0.12;
const TRICKLE_LIMIT = 0.9;
const TRICKLE_SHARE = 0.12;
const TRICKLE_INTERVAL_MS = 200;
const FINISH_HOLD_MS = 300;

// Um clique num link interno para outra rota começa a barra; a troca de rota termina.
function isInternalNavigation(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest('a');
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
  const url = new URL(anchor.href, window.location.href);
  return url.origin === window.location.origin && url.pathname !== window.location.pathname;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState<number | null>(null);
  const [startedFrom, setStartedFrom] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  // A rota mudou: a navegação terminou e a barra completa.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (startedFrom !== null) {
      setStartedFrom(null);
      setValue(1);
    }
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!isInternalNavigation(event)) return;
      setStartedFrom(window.location.pathname);
      setValue(START_VALUE);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (startedFrom === null || reducedMotion) return;
    const timer = setInterval(() => {
      setValue((current) =>
        current === null ? null : current + (TRICKLE_LIMIT - current) * TRICKLE_SHARE,
      );
    }, TRICKLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [startedFrom, reducedMotion]);

  useEffect(() => {
    if (value !== 1) return;
    const timer = setTimeout(() => setValue(null), FINISH_HOLD_MS);
    return () => clearTimeout(timer);
  }, [value]);

  if (value === null) return null;
  return <ProgressBar variant="top" value={value} />;
}
