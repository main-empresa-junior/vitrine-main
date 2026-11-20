'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { Icon } from './Icon';

const SIZE_CLASSES = { md: 'max-w-lg', lg: 'max-w-5xl' } as const;

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  size?: keyof typeof SIZE_CLASSES;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // showModal deixa o resto da página inerte: o foco fica preso no diálogo e Esc fecha.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        'm-auto w-11/12 rounded-panel border border-border bg-background p-0 text-foreground shadow-card backdrop:bg-overlay',
        SIZE_CLASSES[size],
      )}
    >
      <div className="flex flex-col gap-4 p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-heading">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-me-3 -mt-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-strong"
          >
            <Icon name="close" />
          </button>
        </div>
        {description && (
          <p id={descriptionId} className="text-muted">
            {description}
          </p>
        )}
        {children}
        {actions && <div className="mt-2 flex flex-wrap justify-end gap-3">{actions}</div>}
      </div>
    </dialog>
  );
}
