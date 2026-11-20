'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { PALETTE_PRESETS, PLANET_TEXTURES, TEXTURE_LABELS } from '@/features/projects/constants';
import type { ProjectFormValues } from '@/features/projects/schema';
import { cn } from '@/lib/utils/cn';

import { ColorField } from './ColorField';
import { FormSection } from './FormSection';
import { PlanetSuggestionControls } from './PlanetSuggestionControls';

const TEXTURE_OPTIONS = PLANET_TEXTURES.map((texture) => ({
  value: texture,
  label: TEXTURE_LABELS[texture],
}));

const COLOR_FIELDS = [
  { key: 'primary', label: 'Cor principal' },
  { key: 'accent', label: 'Cor clara' },
  { key: 'background', label: 'Cor escura' },
] as const;

export function PaletteSection() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();
  const palette = useWatch({ control, name: 'palette' });

  return (
    <FormSection
      title="Paleta"
      description="Pinta o planeta e a página do projeto. Peça uma sugestão, escolha uma paleta pronta ou ajuste as três cores."
    >
      <PlanetSuggestionControls />
      <div role="group" aria-label="Paletas prontas" className="flex flex-wrap gap-2">
        {PALETTE_PRESETS.map((preset) => {
          const isSelected =
            preset.palette.primary === palette.primary &&
            preset.palette.accent === palette.accent &&
            preset.palette.background === palette.background;
          return (
            <button
              key={preset.name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setValue('palette', preset.palette, { shouldDirty: true })}
              className={cn(
                'flex min-h-11 items-center gap-2 rounded-full border-2 py-1 ps-1 pe-4 text-small font-semibold',
                isSelected ? 'border-focus' : 'border-border',
              )}
            >
              <span aria-hidden="true" className="flex">
                {COLOR_FIELDS.map(({ key }) => (
                  <span
                    key={key}
                    className="-me-1.5 size-7 rounded-full border-2 border-surface"
                    style={{ backgroundColor: preset.palette[key] }}
                  />
                ))}
              </span>
              <span className="ms-2">{preset.name}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {COLOR_FIELDS.map(({ key, label }) => (
          <Controller
            key={key}
            control={control}
            name={`palette.${key}`}
            render={({ field }) => (
              <ColorField
                id={`palette-${key}`}
                label={label}
                value={field.value}
                onChange={field.onChange}
                error={errors.palette?.[key]?.message}
              />
            )}
          />
        ))}
      </div>
      <div className="grid items-end gap-5 sm:grid-cols-2">
        <Select id="texture" label="Textura" options={TEXTURE_OPTIONS} {...register('texture')} />
        <Checkbox id="hasRing" label="Planeta com anel" {...register('hasRing')} />
      </div>
    </FormSection>
  );
}
