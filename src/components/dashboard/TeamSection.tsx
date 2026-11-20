'use client';

import { Controller, useFormContext } from 'react-hook-form';

import type { ProjectFormValues } from '@/features/projects/schema';

import { FormSection } from './FormSection';
import { TagInput } from './TagInput';

const TAG_FIELDS = [
  {
    name: 'developers',
    label: 'Desenvolvedores',
    placeholder: 'Nome de quem trabalhou no projeto',
  },
  { name: 'technologies', label: 'Tecnologias', placeholder: 'Ex.: Kotlin, Next.js' },
] as const;

export function TeamSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();

  return (
    <FormSection title="Equipe e tecnologias">
      {TAG_FIELDS.map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: { value, onChange } }) => (
            <TagInput
              id={field.name}
              label={field.label}
              placeholder={field.placeholder}
              values={value}
              onChange={onChange}
              error={errors[field.name]?.message}
            />
          )}
        />
      ))}
    </FormSection>
  );
}
