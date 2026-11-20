import type { Ref, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

import { Field, FIELD_CONTROL_CLASSES, fieldDescriptionIds } from './Field';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  ref?: Ref<HTMLTextAreaElement>;
};

export function TextArea({ id, label, error, hint, className, rows = 4, ...props }: TextAreaProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescriptionIds(id, error, hint)}
        className={cn(FIELD_CONTROL_CLASSES, 'py-3', className)}
        {...props}
      />
    </Field>
  );
}
