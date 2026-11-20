'use client';

import { HexColorInput, HexColorPicker } from 'react-colorful';

import { FIELD_CONTROL_CLASSES } from '@/components/ui/Field';
import { FieldError } from '@/components/ui/FieldError';
import { cn } from '@/lib/utils/cn';

type ColorFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function ColorField({ id, label, value, onChange, error }: ColorFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
      </label>
      <HexColorPicker
        color={value}
        onChange={(color) => onChange(color.toUpperCase())}
        style={{ width: '100%' }}
      />
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-12 shrink-0 rounded-field border border-border"
          style={{ backgroundColor: value }}
        />
        <HexColorInput
          id={id}
          prefixed
          color={value}
          onChange={(color) => onChange(color.toUpperCase())}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_CONTROL_CLASSES, 'h-12 uppercase')}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
