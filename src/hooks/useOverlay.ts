'use client';

import { useSyncExternalStore } from 'react';

export type OverlayName = 'menu' | 'chat';

// Só uma sobreposição aberta por vez: abrir o menu fecha o chat do Orbi e vice-versa.
let openOverlay: OverlayName | null = null;
const listeners = new Set<() => void>();

function setOpenOverlay(next: OverlayName | null) {
  openOverlay = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOverlay(name: OverlayName): [boolean, (isOpen: boolean) => void] {
  const isOpen = useSyncExternalStore(
    subscribe,
    () => openOverlay === name,
    () => false,
  );
  function setIsOpen(next: boolean) {
    if (next) setOpenOverlay(name);
    else if (openOverlay === name) setOpenOverlay(null);
  }
  return [isOpen, setIsOpen];
}
