'use client';

import { type KeyboardEvent, useState } from 'react';

import { Field, FIELD_CONTROL_CLASSES, fieldDescriptionIds } from '@/components/ui/Field';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils/cn';

type TagInputProps = {
  id: string;
  label: string;
  values: readonly string[];
  onChange: (values: string[]) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
};

const ADD_KEYS = new Set(['Enter', ',']);

const DEFAULT_HINT = 'Tecle Enter ou vírgula para adicionar.';

export function TagInput({
  id,
  label,
  values,
  onChange,
  hint = DEFAULT_HINT,
  error,
  placeholder,
}: TagInputProps) {
  const [draft, setDraft] = useState('');

  function addDraft() {
    const value = draft.trim().replace(/,$/, '');
    setDraft('');
    if (value && !values.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
      onChange([...values, value]);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (ADD_KEYS.has(event.key)) {
      event.preventDefault();
      addDraft();
    } else if (event.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <Field id={id} label={label} hint={hint} error={error} requirement="publish">
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={label}>
          {values.map((value) => (
            <li key={value}>
              <Tag
                onRemove={() => onChange(values.filter((item) => item !== value))}
                removeLabel={`Remover ${value}`}
              >
                {value}
              </Tag>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addDraft}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescriptionIds(id, error, hint)}
        className={cn(FIELD_CONTROL_CLASSES, 'h-12')}
      />
    </Field>
  );
}
