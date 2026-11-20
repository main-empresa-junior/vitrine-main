'use client';

import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TEXTURE_DESCRIPTIONS } from '@/features/projects/constants';
import { type PlanetFields, suggestionToPlanetFields } from '@/features/projects/planet-fields';
import type { ProjectFormValues } from '@/features/projects/schema';
import { type PlanetSuggestion, suggestPlanet } from '@/lib/planet-suggestion';

const SET_OPTIONS = { shouldDirty: true, shouldValidate: true } as const;

export function PlanetSuggestionControls() {
  const { getValues, setValue } = useFormContext<ProjectFormValues>();
  const [beforeSuggestion, setBeforeSuggestion] = useState<PlanetFields | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const lastSuggestionRef = useRef<PlanetSuggestion | null>(null);

  function apply(fields: PlanetFields) {
    setValue('texture', fields.texture, SET_OPTIONS);
    setValue('hasRing', fields.hasRing, SET_OPTIONS);
    setValue('palette', fields.palette, SET_OPTIONS);
  }

  function suggest() {
    const { texture, hasRing, palette } = getValues();
    const suggestion = suggestPlanet({ previous: lastSuggestionRef.current });
    lastSuggestionRef.current = suggestion;
    setBeforeSuggestion({ texture, hasRing, palette });
    apply(suggestionToPlanetFields(suggestion));
    setAnnouncement(
      `Nova sugestão: planeta ${TEXTURE_DESCRIPTIONS[suggestion.texture]}${suggestion.hasRing ? ' com anel' : ''}.`,
    );
  }

  function undo() {
    if (!beforeSuggestion) return;
    apply(beforeSuggestion);
    setBeforeSuggestion(null);
    setAnnouncement('Sugestão desfeita: o planeta voltou ao que era.');
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={suggest}>
        <Icon name="sparkles" />
        Sugerir planeta
      </Button>
      {beforeSuggestion && (
        <Button variant="ghost" size="sm" onClick={undo} className="underline underline-offset-4">
          Desfazer sugestão
        </Button>
      )}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
