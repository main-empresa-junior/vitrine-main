'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { Icon } from './Icon';

import './dialog.css';

const SIZE_CLASSES = { md: 'max-w-lg', lg: 'max-w-5xl' } as const;

const VARIANT_CLASSES = {
  center: 'm-auto w-11/12 rounded-panel',
  sheet: 'dialog-sheet ms-auto me-0 my-0 h-dvh max-h-dvh w-full max-w-xs rounded-s-panel',
} as const;

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  size?: keyof typeof SIZE_CLASSES;
  variant?: keyof typeof VARIANT_CLASSES;
  closeLabel?: string;
  id?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
  variant = 'center',
  closeLabel = 'Fechar',
  id,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isSheet = variant === 'sheet';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // showModal deixa o resto da página inerte: o foco fica preso no diálogo e Esc fecha.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const heading = (
    <div className={cn('flex items-start justify-between gap-4', isSheet && 'order-first')}>
      <h2 id={titleId} className="font-display text-heading">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="-me-3 -mt-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-strong"
      >
        <Icon name="close" />
      </button>
    </div>
  );

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        'border border-border bg-background p-0 text-foreground shadow-card backdrop:bg-overlay',
        VARIANT_CLASSES[variant],
        !isSheet && SIZE_CLASSES[size],
      )}
    >
      <div className="flex flex-col gap-4 p-7">
        {/* No painel lateral o título vem depois no código para o foco começar no primeiro item. */}
        {!isSheet && heading}
        {description && (
          <p id={descriptionId} className="text-muted">
            {description}
          </p>
        )}
        {children}
        {actions && <div className="mt-2 flex flex-wrap justify-end gap-3">{actions}</div>}
        {isSheet && heading}
      </div>
    </dialog>
  );
}
