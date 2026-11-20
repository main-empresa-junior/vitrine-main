import type { InputHTMLAttributes, Ref } from 'react';

import { cn } from '@/lib/utils/cn';

import {
  type CharacterCount,
  Field,
  FIELD_CONTROL_CLASSES,
  fieldDescriptionIds,
  type FieldRequirement,
} from './Field';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  requirement?: FieldRequirement;
  count?: CharacterCount;
  ref?: Ref<HTMLInputElement>;
};

export function TextField({
  id,
  label,
  error,
  hint,
  count,
  requirement,
  className,
  ...props
}: TextFieldProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} count={count} requirement={requirement}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-required={requirement === 'always' || undefined}
        aria-describedby={fieldDescriptionIds(id, error, hint, count)}
        className={cn(FIELD_CONTROL_CLASSES, 'h-12', className)}
        {...props}
      />
    </Field>
  );
}
