import type { InputHTMLAttributes, Ref } from 'react';

import { cn } from '@/lib/utils/cn';

import { Field, FIELD_CONTROL_CLASSES, fieldDescriptionIds } from './Field';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  ref?: Ref<HTMLInputElement>;
};

export function TextField({ id, label, error, hint, className, ...props }: TextFieldProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescriptionIds(id, error, hint)}
        className={cn(FIELD_CONTROL_CLASSES, 'h-12', className)}
        {...props}
      />
    </Field>
  );
}
