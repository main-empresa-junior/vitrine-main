'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { type ProjectFormValues, TEXT_LIMITS } from '@/features/projects/schema';

import { FormSection } from './FormSection';
import { ReorderButtons } from './ReorderButtons';

export function FeaturesSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'features' });
  const values = useWatch({ control, name: 'features' });

  return (
    <FormSection
      id="features-section"
      title="Funcionalidades"
      description="O que o projeto faz, na ordem em que aparece."
    >
      {fields.length > 0 && (
        <ol className="flex flex-col gap-4">
          {fields.map((field, index) => {
            const itemLabel = `funcionalidade ${index + 1}`;
            return (
              <li
                key={field.id}
                className="flex flex-col gap-3 rounded-field border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">Funcionalidade {index + 1}</p>
                  <ReorderButtons
                    itemLabel={itemLabel}
                    canMoveUp={index > 0}
                    canMoveDown={index < fields.length - 1}
                    onMove={(direction) => move(index, direction === 'up' ? index - 1 : index + 1)}
                    onRemove={() => remove(index)}
                  />
                </div>
                <TextField
                  id={`features-${index}-title`}
                  maxLength={TEXT_LIMITS.featureTitle}
                  count={{
                    value: values[index]?.title.length ?? 0,
                    max: TEXT_LIMITS.featureTitle,
                  }}
                  label="Título"
                  error={errors.features?.[index]?.title?.message}
                  {...register(`features.${index}.title`)}
                />
                <TextArea
                  id={`features-${index}-description`}
                  maxLength={TEXT_LIMITS.featureDescription}
                  count={{
                    value: values[index]?.description.length ?? 0,
                    max: TEXT_LIMITS.featureDescription,
                  }}
                  label="Descrição"
                  rows={2}
                  error={errors.features?.[index]?.description?.message}
                  {...register(`features.${index}.description`)}
                />
              </li>
            );
          })}
        </ol>
      )}
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => append({ title: '', description: '' })}
      >
        <Icon name="plus" />
        Adicionar funcionalidade
      </Button>
    </FormSection>
  );
}
