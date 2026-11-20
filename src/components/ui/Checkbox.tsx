import type { InputHTMLAttributes, Ref } from 'react';

import { FieldError } from './FieldError';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  id: string;
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({ id, label, error, ...props }: CheckboxProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="size-5 accent-brand-violet"
          {...props}
        />
        <span className="font-semibold">{label}</span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
