'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { PROJECT_TYPE_LABELS, PROJECT_TYPES } from '@/features/projects/constants';
import { type ProjectFormValues, TEXT_LIMITS } from '@/features/projects/schema';
import { slugify } from '@/features/projects/slug';

import { FormSection } from './FormSection';

const TYPE_OPTIONS = PROJECT_TYPES.map((type) => ({
  value: type,
  label: PROJECT_TYPE_LABELS[type],
}));

type InfoSectionProps = {
  isEditing: boolean;
};

export function InfoSection({ isEditing }: InfoSectionProps) {
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useFormContext<ProjectFormValues>();
  const [name, summary, description] = useWatch({
    control,
    name: ['name', 'summary', 'description'],
  });
  // Ao editar, o endereço já está publicado: só muda se alguém mexer nele de propósito.
  const [isSlugLocked, setIsSlugLocked] = useState(isEditing);

  return (
    <FormSection title="Informações" description="O que aparece na ficha e na página do projeto.">
      <TextField
        id="name"
        maxLength={TEXT_LIMITS.name}
        count={{ value: name.length, max: TEXT_LIMITS.name }}
        label="Nome"
        error={errors.name?.message}
        {...register('name', {
          onChange: (event: { target: { value: string } }) => {
            if (!isSlugLocked) setValue('slug', slugify(event.target.value));
          },
        })}
      />
      <TextField
        id="slug"
        label="Endereço"
        hint="Aparece em /projects/endereço. Gerado do nome; pode ser editado."
        error={errors.slug?.message}
        {...register('slug', { onChange: () => setIsSlugLocked(true) })}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          id="client"
          label="Cliente"
          error={errors.client?.message}
          {...register('client')}
        />
        <TextField
          id="year"
          label="Ano"
          type="number"
          inputMode="numeric"
          error={errors.year?.message}
          {...register('year', { valueAsNumber: true })}
        />
        <Select
          id="type"
          label="Tipo"
          options={TYPE_OPTIONS}
          error={errors.type?.message}
          {...register('type')}
        />
      </div>
      <TextField
        id="summary"
        maxLength={TEXT_LIMITS.summary}
        count={{ value: summary.length, max: TEXT_LIMITS.summary }}
        label="Resumo"
        hint="Uma linha sobre o que o projeto faz."
        error={errors.summary?.message}
        {...register('summary')}
      />
      <TextArea
        id="description"
        maxLength={TEXT_LIMITS.description}
        count={{ value: description.length, max: TEXT_LIMITS.description }}
        label="Descrição"
        rows={6}
        error={errors.description?.message}
        {...register('description')}
      />
    </FormSection>
  );
}
