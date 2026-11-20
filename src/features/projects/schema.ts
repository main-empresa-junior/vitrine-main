import { z } from 'zod';

import { PLANET_TEXTURES, PROJECT_TYPES } from './constants';
import { SLUG_PATTERN } from './slug';

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;
const MAX_TAGS = 20;
const MAX_FEATURES = 20;
const MAX_IMAGES = 12;
const IMAGE_PATH_PATTERN = /^[a-z0-9-]+\.(png|jpe?g|webp|avif)$/;

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use uma cor no formato #RRGGBB.');
const tag = z.string().trim().min(1).max(40);

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do projeto.').max(80, 'Use até 80 caracteres.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Informe o endereço.')
    .max(80, 'Use até 80 caracteres.')
    .regex(SLUG_PATTERN, 'Use letras minúsculas, números e hífens.'),
  client: z.string().trim().max(120, 'Use até 120 caracteres.'),
  year: z
    .number({ error: 'Informe o ano.' })
    .int('Informe o ano.')
    .min(MIN_YEAR, `Use um ano a partir de ${MIN_YEAR}.`)
    .max(MAX_YEAR, `Use um ano até ${MAX_YEAR}.`),
  type: z.enum(PROJECT_TYPES, { error: 'Escolha o tipo.' }),
  summary: z
    .string()
    .trim()
    .min(1, 'Escreva um resumo de uma linha.')
    .max(200, 'Use até 200 caracteres.'),
  description: z.string().trim().max(4000, 'Use até 4000 caracteres.'),
  technologies: z.array(tag).max(MAX_TAGS, `Use até ${MAX_TAGS} tecnologias.`),
  developers: z.array(tag).max(MAX_TAGS, `Use até ${MAX_TAGS} nomes.`),
  features: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Dê um título.').max(80, 'Use até 80 caracteres.'),
        description: z.string().trim().max(400, 'Use até 400 caracteres.'),
      }),
    )
    .max(MAX_FEATURES, `Use até ${MAX_FEATURES} funcionalidades.`),
  palette: z.object({ primary: hexColor, accent: hexColor, background: hexColor }),
  texture: z.enum(PLANET_TEXTURES),
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
          .max(200, 'Use até 200 caracteres.'),
      }),
    )
    .max(MAX_IMAGES, `Use até ${MAX_IMAGES} imagens.`),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
