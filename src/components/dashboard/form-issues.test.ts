import { describe, expect, it } from 'vitest';

import { collectFormIssues } from './form-issues';

describe('collectFormIssues', () => {
  it('maps fields, list items and whole lists to the ids used in the form', () => {
    const errors = {
      client: { type: 'too_small', message: 'Informe o cliente.' },
      features: {
        root: { type: 'too_small', message: 'Adicione pelo menos 3 funcionalidades.' },
        0: { description: { type: 'too_small', message: 'Descreva a funcionalidade.' } },
      },
      images: { type: 'too_small', message: 'Adicione pelo menos 1 tela.' },
      palette: { primary: { type: 'invalid', message: 'Use uma cor no formato #RRGGBB.' } },
    };

    expect(collectFormIssues(errors)).toEqual([
      { fieldId: 'client', message: 'Informe o cliente.' },
      { fieldId: 'features-section', message: 'Adicione pelo menos 3 funcionalidades.' },
      { fieldId: 'features-0-description', message: 'Descreva a funcionalidade.' },
      { fieldId: 'images-section', message: 'Adicione pelo menos 1 tela.' },
      { fieldId: 'palette-primary', message: 'Use uma cor no formato #RRGGBB.' },
    ]);
  });

  it('returns nothing without errors', () => {
    expect(collectFormIssues({})).toEqual([]);
    expect(collectFormIssues(undefined)).toEqual([]);
  });
});
