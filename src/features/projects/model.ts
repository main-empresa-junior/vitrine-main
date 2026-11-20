import { type PlanetPalette, type PlanetTextureKind, seedFromText } from '@/lib/textures';
import type { Database } from '@/types/database';

import type { ProjectType } from './constants';
import type { ProjectFormValues } from './schema';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type FeatureRow = Pick<
  Database['public']['Tables']['project_features']['Row'],
  'title' | 'description' | 'position'
>;
type ImageRow = Pick<
  Database['public']['Tables']['project_images']['Row'],
  'path' | 'alt' | 'position'
>;

export type ProjectRowWithChildren = ProjectRow & {
  project_features: FeatureRow[];
  project_images: ImageRow[];
};

export type ShowcaseProject = {
  id: string;
  slug: string;
  name: string;
  client: string;
  year: number;
  type: ProjectType;
  summary: string;
  technologies: readonly string[];
  palette: PlanetPalette;
  texture: PlanetTextureKind;
  hasRing: boolean;
  published: boolean;
  seed: number;
};

export type ProjectDetails = ShowcaseProject & {
  description: string;
  developers: readonly string[];
  features: readonly FeatureRow[];
  images: readonly ImageRow[];
};

export function toShowcaseProject(row: ProjectRow): ShowcaseProject {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    client: row.client,
    year: row.year,
    type: row.type,
    summary: row.summary,
    technologies: row.technologies,
    palette: {
      primary: row.color_primary,
      accent: row.color_accent,
      background: row.color_background,
    },
    texture: row.texture,
    hasRing: row.has_ring,
    published: row.published,
    seed: seedFromText(row.id),
  };
}

export function toProjectDetails(row: ProjectRowWithChildren): ProjectDetails {
  return {
    ...toShowcaseProject(row),
    description: row.description,
    developers: row.developers,
    features: row.project_features,
    images: row.project_images,
  };
}

export function toFormValues(row: ProjectRowWithChildren): ProjectFormValues {
  const details = toProjectDetails(row);
  return {
    name: details.name,
    slug: details.slug,
    client: details.client,
    year: details.year,
    type: details.type,
    summary: details.summary,
    description: details.description,
    technologies: [...details.technologies],
    developers: [...details.developers],
    features: details.features.map(({ title, description }) => ({ title, description })),
    palette: details.palette,
    texture: details.texture,
    hasRing: details.hasRing,
    published: row.published,
    images: details.images.map(({ path, alt }) => ({ path, alt })),
  };
}

export function toProjectColumns(values: ProjectFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    client: values.client,
    year: values.year,
    type: values.type,
    summary: values.summary,
    description: values.description,
    technologies: values.technologies,
    developers: values.developers,
    color_primary: values.palette.primary,
    color_accent: values.palette.accent,
    color_background: values.palette.background,
    texture: values.texture,
    has_ring: values.hasRing,
    published: values.published,
  } satisfies Database['public']['Tables']['projects']['Update'];
}
