'use client';

import { Controller, useFormContext } from 'react-hook-form';

import type { ProjectFormValues } from '@/features/projects/schema';

import { DevelopersField } from './DevelopersField';
import { FormSection } from './FormSection';
import { TagInput } from './TagInput';

export function TeamSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();

  return (
    <FormSection title="Equipe e tecnologias">
      <DevelopersField />
      <Controller
        control={control}
        name="technologies"
        render={({ field: { value, onChange } }) => (
          <TagInput
            id="technologies"
            label="Tecnologias"
            placeholder="Ex.: Kotlin, Next.js"
            values={value}
            onChange={onChange}
            error={errors.technologies?.message}
          />
        )}
      />
    </FormSection>
  );
}
