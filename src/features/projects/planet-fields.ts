import type { PlanetSuggestion } from '@/lib/planet-suggestion';

import type { ProjectFormValues } from './schema';

export type PlanetFields = Pick<ProjectFormValues, 'texture' | 'hasRing' | 'palette'>;

export function suggestionToPlanetFields(suggestion: PlanetSuggestion): PlanetFields {
  return {
    texture: suggestion.texture,
    hasRing: suggestion.hasRing,
    palette: {
      primary: suggestion.colorPrimary,
      accent: suggestion.colorAccent,
      background: suggestion.colorBackground,
    },
  };
}
