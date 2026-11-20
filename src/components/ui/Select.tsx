import type { Ref, SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

import { Field, FIELD_CONTROL_CLASSES, fieldDescriptionIds } from './Field';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: readonly SelectOption[];
  error?: string;
  hint?: string;
  ref?: Ref<HTMLSelectElement>;
};

export function Select({ id, label, options, error, hint, className, ...props }: SelectProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescriptionIds(id, error, hint)}
        className={cn(FIELD_CONTROL_CLASSES, 'h-12', className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
