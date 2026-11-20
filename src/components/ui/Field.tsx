import type { ReactNode } from 'react';

import { FieldError } from './FieldError';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  count?: CharacterCount;
  requirement?: FieldRequirement;
  children: ReactNode;
};

export type CharacterCount = { value: number; max: number };

// "always": o formulário não envia sem o campo; "publish": só a publicação exige.
export type FieldRequirement = 'always' | 'publish';

const REQUIREMENT_LABELS: Record<FieldRequirement, string> = {
  always: 'obrigatório',
  publish: 'obrigatório para publicar',
};

export const FIELD_CONTROL_CLASSES =
  'w-full rounded-field border border-border bg-surface px-4 text-body text-foreground placeholder:text-muted aria-invalid:border-danger';

export function fieldDescriptionIds(
  id: string,
  error?: string,
  hint?: string,
  count?: CharacterCount,
): string | undefined {
  const ids = [hint && `${id}-hint`, count && `${id}-count`, error && `${id}-error`].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export function Field({ id, label, error, hint, count, requirement, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-small font-semibold">
          {label}
          {requirement && (
            <span className="font-normal text-muted"> ({REQUIREMENT_LABELS[requirement]})</span>
          )}
        </label>
        {count && <FieldCount id={`${id}-count`} count={count} />}
      </div>
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

// O número muda a cada tecla, mas só o limite atingido é anunciado; o total fica na descrição do campo.
function FieldCount({ id, count }: { id: string; count: CharacterCount }) {
  const isAtLimit = count.value >= count.max;
  return (
    <>
      <span
        aria-hidden="true"
        className={isAtLimit ? 'text-small text-danger' : 'text-small text-muted'}
      >
        {count.value}/{count.max}
      </span>
      <span id={id} className="sr-only">
        Até {count.max} caracteres.
      </span>
      <span aria-live="polite" className="sr-only">
        {isAtLimit ? `Limite de ${count.max} caracteres atingido.` : ''}
      </span>
    </>
  );
}
