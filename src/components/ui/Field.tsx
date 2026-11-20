import type { ReactNode } from 'react';

import { FieldError } from './FieldError';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export const FIELD_CONTROL_CLASSES =
  'w-full rounded-field border border-border bg-surface px-4 text-body text-foreground placeholder:text-muted aria-invalid:border-danger';

export function fieldDescriptionIds(id: string, error?: string, hint?: string): string | undefined {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-small text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
