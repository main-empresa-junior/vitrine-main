import type { Ref, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

import {
  type CharacterCount,
  Field,
  FIELD_CONTROL_CLASSES,
  fieldDescriptionIds,
  type FieldRequirement,
} from './Field';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  requirement?: FieldRequirement;
  count?: CharacterCount;
  ref?: Ref<HTMLTextAreaElement>;
};

export function TextArea({
  id,
  label,
  error,
  hint,
  count,
  requirement,
  className,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} count={count} requirement={requirement}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-required={requirement === 'always' || undefined}
        aria-describedby={fieldDescriptionIds(id, error, hint, count)}
        className={cn(FIELD_CONTROL_CLASSES, 'py-3', className)}
        {...props}
      />
    </Field>
  );
}
