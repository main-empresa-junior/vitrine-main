'use client';

import { type MouseEvent, type ReactNode, useId, useRef } from 'react';

import { useOverlay } from '@/hooks/useOverlay';
import { cn } from '@/lib/utils/cn';

import { Dialog } from './Dialog';

const BAR =
  'absolute left-0 h-0.5 w-full rounded-full bg-current transition duration-200 ease-out-soft';

type MobileMenuProps = {
  children: ReactNode;
};

export function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useOverlay('menu');
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  function close() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function closeOnLinkClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest('a')) close();
  }

  return (
    <div className="nav:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-strong"
      >
        <span aria-hidden="true" className="relative h-3.5 w-5">
          <span className={cn(BAR, 'top-0', isOpen && 'translate-y-1.5 rotate-45')} />
          <span className={cn(BAR, 'top-1.5', isOpen && 'opacity-0')} />
          <span className={cn(BAR, 'top-3', isOpen && '-translate-y-1.5 -rotate-45')} />
        </span>
      </button>
      <Dialog
        id={menuId}
        variant="sheet"
        open={isOpen}
        onClose={close}
        title="Menu"
        closeLabel="Fechar menu"
      >
        <div onClick={closeOnLinkClick}>{children}</div>
      </Dialog>
    </div>
  );
}
