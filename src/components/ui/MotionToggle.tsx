'use client';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  MOTION_STORAGE_KEY,
  readStoredPreference,
  storePreference,
  systemPrefersReducedMotion,
} from '@/lib/preferences';

import { Button } from './Button';

type MotionToggleProps = {
  className?: string;
};

export function MotionToggle({ className }: MotionToggleProps) {
  const hasMounted = useHasMounted();
  const isReduced = useReducedMotion();

  // Só aparece para quem tem motivo para trocar: sistema pedindo menos movimento ou escolha já feita.
  const shouldOffer =
    hasMounted &&
    (systemPrefersReducedMotion() || readStoredPreference(MOTION_STORAGE_KEY) !== null);
  if (!shouldOffer) return null;

  function toggle() {
    const next = isReduced ? 'full' : 'reduced';
    document.documentElement.dataset.motion = next;
    storePreference(MOTION_STORAGE_KEY, next);
  }

  return (
    <Button variant="secondary" size="sm" onClick={toggle} className={className}>
      {isReduced ? 'Ativar animações' : 'Reduzir animações'}
    </Button>
  );
}
