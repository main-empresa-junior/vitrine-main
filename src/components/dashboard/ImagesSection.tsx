'use client';

import { type ChangeEvent, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Image from 'next/image';

import { Spinner } from '@/components/ui/Spinner';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/ToastProvider';
import { ACCEPTED_IMAGE_TYPES, PROJECT_IMAGES_BUCKET } from '@/features/projects/constants';
import { checkImageFile, projectImageUrl } from '@/features/projects/images';
import type { ProjectFormValues } from '@/features/projects/schema';
import { createClient } from '@/lib/supabase/client';

import { FormSection } from './FormSection';
import { ReorderButtons } from './ReorderButtons';

export function ImagesSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'images' });
  const [isUploading, setIsUploading] = useState(false);
  const showToast = useToast();

  // shortcut: arquivo enviado e removido antes de salvar fica órfão no bucket; limpar com uma rotina se crescer.
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    setIsUploading(true);
    const storage = createClient().storage.from(PROJECT_IMAGES_BUCKET);
    for (const file of files) {
      const check = checkImageFile(file);
      if (!check.ok) {
        showToast(check.error, 'error');
        continue;
      }
      const { error } = await storage.upload(check.path, file, { contentType: file.type });
      if (error) showToast(`${file.name}: não foi possível enviar.`, 'error');
      else append({ path: check.path, alt: '' });
    }
    setIsUploading(false);
  }

  return (
    <FormSection
      title="Telas"
      description="Capturas do projeto. Até 5 MB cada, em PNG, JPG, WebP ou AVIF. O texto alternativo é obrigatório."
    >
      {fields.length > 0 && (
        <ol className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex flex-col gap-4 rounded-field border border-border p-4 sm:flex-row"
            >
              <Image
                src={projectImageUrl(field.path)}
                alt=""
                width={160}
                height={100}
                className="h-24 w-40 shrink-0 rounded-field bg-surface-strong object-cover"
              />
              <div className="flex flex-1 flex-col gap-2">
                <TextField
                  id={`images-${index}-alt`}
                  label={`Texto alternativo da tela ${index + 1}`}
                  error={errors.images?.[index]?.alt?.message}
                  {...register(`images.${index}.alt`)}
                />
                <ReorderButtons
                  itemLabel={`tela ${index + 1}`}
                  canMoveUp={index > 0}
                  canMoveDown={index < fields.length - 1}
                  onMove={(direction) => move(index, direction === 'up' ? index - 1 : index + 1)}
                  onRemove={() => remove(index)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
      <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 self-start rounded-full border-2 border-dashed border-border px-6 font-bold has-focus-visible:outline-3 has-focus-visible:outline-focus">
        {isUploading && <Spinner />}
        {isUploading ? 'Enviando…' : 'Adicionar telas'}
        <input
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={upload}
          disabled={isUploading}
          className="sr-only"
        />
      </label>
      {errors.images?.message && <p className="text-small text-danger">{errors.images.message}</p>}
    </FormSection>
  );
}
