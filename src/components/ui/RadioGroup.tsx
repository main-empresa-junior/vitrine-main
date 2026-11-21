import type { InputHTMLAttributes, Ref } from 'react';

import { type FieldRequirement, REQUIREMENT_LABELS } from './Field';
import { FieldError } from './FieldError';

export type RadioOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type RadioGroupProps<T extends string> = {
  id: string;
  legend: string;
  options: readonly RadioOption<T>[];
  error?: string;
  requirement?: FieldRequirement;
  // As props do input vindas do formulário (por exemplo, o retorno de register).
  inputProps: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> };
};

export function RadioGroup<T extends string>({
  id,
  legend,
  options,
  error,
  requirement,
  inputProps,
}: RadioGroupProps<T>) {
  const errorId = `${id}-error`;
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      role="radiogroup"
      aria-invalid={Boolean(error)}
      aria-required={requirement === 'always' || undefined}
      aria-describedby={error ? errorId : undefined}
      className="flex flex-col gap-2"
    >
      <legend className="mb-2 text-small font-semibold">
        {legend}
        {requirement && (
          <span className="font-normal text-muted"> ({REQUIREMENT_LABELS[requirement]})</span>
        )}
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex min-h-11 cursor-pointer items-start gap-3 rounded-field border-2 border-border bg-surface p-3 has-checked:border-focus"
            >
              <input
                id={optionId}
                type="radio"
                value={option.value}
                className="mt-1 size-5 shrink-0 accent-brand-violet"
                {...inputProps}
              />
              <span className="flex flex-col gap-1">
                <span className="font-semibold">{option.label}</span>
                {option.description && (
                  <span className="text-small text-muted">{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
