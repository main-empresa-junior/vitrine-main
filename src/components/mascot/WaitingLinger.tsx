'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

import { getLingerUntil, subscribeToLinger } from './waiting-store';
import { WaitingOrbi } from './WaitingOrbi';

const getServerLinger = () => 0;

// Mantém o Orbi de espera por cima da página nova até completar o tempo mínimo, para não piscar.
export function WaitingLinger() {
  const lingerUntil = useSyncExternalStore(subscribeToLinger, getLingerUntil, getServerLinger);
  const [now, setNow] = useState(0);
  const isDashboard = usePathname().startsWith('/dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setNow(Date.now()), Math.max(0, lingerUntil - Date.now()));
    return () => clearTimeout(timer);
  }, [lingerUntil]);

  if (now >= lingerUntil) return null;
  return (
    <div
      aria-hidden="true"
      data-theme={isDashboard ? 'light' : 'dark'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <WaitingOrbi />
    </div>
  );
}
