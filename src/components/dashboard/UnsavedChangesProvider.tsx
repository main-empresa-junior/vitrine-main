'use client';

import { createContext, type ReactNode, use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';

type UnsavedChanges = {
  setHasUnsavedChanges: (value: boolean) => void;
  // Devolve true quando a navegação pode seguir sem perguntar.
  confirmNavigation: (href: string) => boolean;
};

const UnsavedChangesContext = createContext<UnsavedChanges | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const router = useRouter();

  const value = useMemo<UnsavedChanges>(
    () => ({
      setHasUnsavedChanges,
      confirmNavigation: (href) => {
        if (!hasUnsavedChanges) return true;
        setPendingHref(href);
        return false;
      },
    }),
    [hasUnsavedChanges],
  );

  function discard() {
    if (!pendingHref) return;
    setHasUnsavedChanges(false);
    setPendingHref(null);
    router.push(pendingHref);
  }

  return (
    <UnsavedChangesContext value={value}>
      {children}
      <Dialog
        open={pendingHref !== null}
        onClose={() => setPendingHref(null)}
        title="Descartar alterações?"
        description="As mudanças deste projeto ainda não foram salvas e serão perdidas."
        actions={
          <>
            <Button variant="secondary" onClick={() => setPendingHref(null)}>
              Continuar editando
            </Button>
            <Button variant="danger" onClick={discard}>
              Descartar
            </Button>
          </>
        }
      />
    </UnsavedChangesContext>
  );
}

export function useUnsavedChanges(): UnsavedChanges {
  const context = use(UnsavedChangesContext);
  if (!context) throw new Error('useUnsavedChanges must be used inside UnsavedChangesProvider');
  return context;
}
