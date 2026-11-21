'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { signOut, signOutBecause } from '@/features/auth/actions';
import {
  formatCountdown,
  type InactivityState,
  inactivityState,
} from '@/features/auth/session-limits';

import {
  announceSignOut,
  onSignOutElsewhere,
  readSharedActivity,
  shareActivity,
} from './session-sync';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'] as const;
const TICK_MS = 1000;

// Encerra a sessão do painel depois de 30 minutos sem interação em nenhuma aba, com aviso antes.
export function SessionGuard() {
  const [state, setState] = useState<InactivityState>({ kind: 'active' });
  const [isLeaving, startLeaving] = useTransition();
  const router = useRouter();
  const isWarningRef = useRef(false);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    shareActivity(Date.now());

    function recordActivity() {
      // Com o aviso aberto, só "Continuar conectado" mantém a sessão.
      if (!isWarningRef.current) shareActivity(Date.now());
    }
    for (const type of ACTIVITY_EVENTS) {
      window.addEventListener(type, recordActivity, { capture: true, passive: true });
    }

    const timer = setInterval(() => {
      const next = inactivityState(readSharedActivity(), Date.now());
      isWarningRef.current = next.kind === 'warning';
      setState(next);
      if (next.kind === 'expired' && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        announceSignOut();
        void signOutBecause('inactive');
      }
    }, TICK_MS);

    const stopListening = onSignOutElsewhere(() => {
      router.replace('/dashboard/login?reason=elsewhere');
    });

    return () => {
      for (const type of ACTIVITY_EVENTS) {
        window.removeEventListener(type, recordActivity, { capture: true });
      }
      clearInterval(timer);
      stopListening();
    };
  }, [router]);

  function stayConnected() {
    isWarningRef.current = false;
    shareActivity(Date.now());
    setState({ kind: 'active' });
  }

  function leaveNow() {
    announceSignOut();
    startLeaving(() => signOut());
  }

  return (
    <Dialog
      open={state.kind === 'warning'}
      onClose={stayConnected}
      title="Sua sessão vai expirar por inatividade"
      description={
        state.kind === 'warning'
          ? `Sem atividade, você será desconectado em ${formatCountdown(state.remainingMs)}.`
          : undefined
      }
      actions={
        <>
          <Button variant="secondary" onClick={leaveNow} isLoading={isLeaving}>
            Sair agora
          </Button>
          <Button onClick={stayConnected}>Continuar conectado</Button>
        </>
      }
    />
  );
}
