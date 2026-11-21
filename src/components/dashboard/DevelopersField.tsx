'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { FieldError } from '@/components/ui/FieldError';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { DEVELOPER_LINK_LABELS, developerLinkKind } from '@/features/projects/developer-link';
import { type ProjectFormValues, TEXT_LIMITS } from '@/features/projects/schema';

import { ReorderButtons } from './ReorderButtons';

const LIST_ERROR_ID = 'developers-error';

export function DevelopersField() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'developers' });
  const values = useWatch({ control, name: 'developers' });
  const listError = errors.developers?.message ?? errors.developers?.root?.message;

  return (
    <fieldset id="developers-section" tabIndex={-1} className="flex flex-col gap-3">
      <legend className="text-small font-semibold">
        Desenvolvedores
        <span className="font-normal text-muted"> (obrigatório para publicar)</span>
      </legend>
      {fields.length > 0 && (
        <ol className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const url = values[index]?.url ?? '';
            const kind = developerLinkKind(url);
            return (
              <li
                key={field.id}
                className="flex flex-col gap-3 rounded-field border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">Pessoa {index + 1}</p>
                  <ReorderButtons
                    itemLabel={`pessoa ${index + 1}`}
                    canMoveUp={index > 0}
                    canMoveDown={index < fields.length - 1}
                    onMove={(direction) => move(index, direction === 'up' ? index - 1 : index + 1)}
                    onRemove={() => remove(index)}
                  />
                </div>
                <TextField
                  id={`developers-${index}-name`}
                  label="Nome"
                  requirement="always"
                  maxLength={TEXT_LIMITS.developerName}
                  error={errors.developers?.[index]?.name?.message}
                  {...register(`developers.${index}.name`)}
                />
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <TextField
                      id={`developers-${index}-url`}
                      label="Link de contato (opcional)"
                      type="url"
                      inputMode="url"
                      placeholder="https://github.com/usuario"
                      hint="GitHub, LinkedIn ou outro site; o tipo é reconhecido pelo endereço."
                      error={errors.developers?.[index]?.url?.message}
                      {...register(`developers.${index}.url`)}
                    />
                  </div>
                  {url !== '' && (
                    <span
                      role="img"
                      aria-label={`Link do ${DEVELOPER_LINK_LABELS[kind]}`}
                      className="mb-3 flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-strong"
                    >
                      <Icon name={kind === 'other' ? 'link' : kind} />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <FieldError id={LIST_ERROR_ID} message={listError} />
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => append({ name: '', url: '' })}
      >
        <Icon name="plus" />
        Adicionar desenvolvedor
      </Button>
    </fieldset>
  );
}
