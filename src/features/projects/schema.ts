import { z } from 'zod';

import { PLANET_TEXTURES, PROJECT_TYPES } from './constants';
import { isHttpsUrl } from './developer-link';
import { SLUG_PATTERN } from './slug';

// Limites que a página do projeto comporta sem quebrar o layout (iguais aos da migração).
export const TEXT_LIMITS = {
  name: 40,
  summary: 160,
  description: 1200,
  featureTitle: 60,
  featureDescription: 200,
  developerName: 60,
  developerUrl: 300,
} as const;

export const PUBLISH_MINIMUMS = { features: 3, images: 1, technologies: 1, developers: 1 } as const;

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;
const MAX_TAGS = 20;
const MAX_FEATURES = 20;
const MAX_IMAGES = 12;
// Imagens na raiz do bucket ou numa pasta de um nível (como a dos dados de teste).
const IMAGE_PATH_PATTERN = /^([a-z0-9-]+\/)?[a-z0-9-]+\.(png|jpe?g|webp|avif)$/;

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use uma cor no formato #RRGGBB.');
const tag = z.string().trim().min(1).max(40);
const upTo = (limit: number) => `Use até ${limit} caracteres.`;

const featureDraft = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Dê um título à funcionalidade.')
    .max(TEXT_LIMITS.featureTitle, upTo(TEXT_LIMITS.featureTitle)),
  description: z
    .string()
    .trim()
    .max(TEXT_LIMITS.featureDescription, upTo(TEXT_LIMITS.featureDescription)),
});

export const developerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome de quem desenvolveu.')
    .max(TEXT_LIMITS.developerName, upTo(TEXT_LIMITS.developerName)),
  // Vazio quando a pessoa não quer mostrar um link.
  url: z
    .string()
    .trim()
    .max(TEXT_LIMITS.developerUrl, upTo(TEXT_LIMITS.developerUrl))
    .refine(
      (url) => url === '' || isHttpsUrl(url),
      'Use o endereço completo, começando com https://.',
    ),
});

// Rascunho: só o que o banco exige para guardar a linha; o resto pode ficar para depois.
export const projectDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do projeto.')
    .max(TEXT_LIMITS.name, upTo(TEXT_LIMITS.name)),
  slug: z
    .string()
    .trim()
    .min(1, 'Informe o endereço.')
    .max(80, upTo(80))
    .regex(SLUG_PATTERN, 'Use letras minúsculas, números e hífens.'),
  client: z.string().trim().max(120, upTo(120)),
  year: z
    .number({ error: 'Informe o ano.' })
    .int('Informe o ano.')
    .min(MIN_YEAR, `Use um ano a partir de ${MIN_YEAR}.`)
    .max(MAX_YEAR, `Use um ano até ${MAX_YEAR}.`),
  type: z.enum(PROJECT_TYPES, { error: 'Escolha o tipo.' }),
  summary: z.string().trim().max(TEXT_LIMITS.summary, upTo(TEXT_LIMITS.summary)),
  description: z.string().trim().max(TEXT_LIMITS.description, upTo(TEXT_LIMITS.description)),
  technologies: z.array(tag).max(MAX_TAGS, `Use até ${MAX_TAGS} tecnologias.`),
  developers: z.array(developerSchema).max(MAX_TAGS, `Use até ${MAX_TAGS} pessoas.`),
  features: z.array(featureDraft).max(MAX_FEATURES, `Use até ${MAX_FEATURES} funcionalidades.`),
  palette: z.object({ primary: hexColor, accent: hexColor, background: hexColor }),
  texture: z.enum(PLANET_TEXTURES, { error: 'Escolha a textura.' }),
  hasRing: z.boolean(),
  published: z.boolean(),
  images: z
    .array(
      z.object({
        path: z.string().regex(IMAGE_PATH_PATTERN, 'Arquivo de imagem inválido.'),
        alt: z
          .string()
          .trim()
          .min(1, 'Descreva a imagem para quem usa leitor de tela.')
          .max(200, upTo(200)),
      }),
    )
    .max(MAX_IMAGES, `Use até ${MAX_IMAGES} imagens.`),
});

// Publicação: tudo o que a página do projeto mostra passa a ser obrigatório.
export const projectPublishSchema = projectDraftSchema.extend({
  client: projectDraftSchema.shape.client.min(1, 'Informe o cliente.'),
  summary: projectDraftSchema.shape.summary.min(1, 'Escreva o resumo.'),
  description: projectDraftSchema.shape.description.min(1, 'Escreva a descrição.'),
  technologies: projectDraftSchema.shape.technologies.min(
    PUBLISH_MINIMUMS.technologies,
    'Adicione pelo menos 1 tecnologia.',
  ),
  developers: projectDraftSchema.shape.developers.min(
    PUBLISH_MINIMUMS.developers,
    'Adicione pelo menos 1 desenvolvedor.',
  ),
  features: z
    .array(
      featureDraft.extend({
        description: featureDraft.shape.description.min(1, 'Descreva a funcionalidade.'),
      }),
    )
    .min(
      PUBLISH_MINIMUMS.features,
      `Adicione pelo menos ${PUBLISH_MINIMUMS.features} funcionalidades.`,
    )
    .max(MAX_FEATURES, `Use até ${MAX_FEATURES} funcionalidades.`),
  images: projectDraftSchema.shape.images.min(
    PUBLISH_MINIMUMS.images,
    'Adicione pelo menos 1 tela.',
  ),
});

export type ProjectFormValues = z.infer<typeof projectDraftSchema>;

export function schemaFor(published: boolean) {
  return published ? projectPublishSchema : projectDraftSchema;
}
