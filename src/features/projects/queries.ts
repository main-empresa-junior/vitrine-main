import { cacheLife, cacheTag } from 'next/cache';

import { createPublicClient } from '@/lib/supabase/public';
import { createClient } from '@/lib/supabase/server';

import { PROJECTS_CACHE_TAG } from './constants';
import {
  type DashboardProject,
  type ProjectDetails,
  type ProjectRowWithChildren,
  type ShowcaseProject,
  toProjectDetails,
  toShowcaseProject,
} from './model';

import 'server-only';

const WITH_CHILDREN =
  '*, project_features(title, description, position), project_images(path, alt, position)';

function sortChildren(row: ProjectRowWithChildren): ProjectRowWithChildren {
  const byPosition = (a: { position: number }, b: { position: number }) => a.position - b.position;
  return {
    ...row,
    project_features: [...row.project_features].sort(byPosition),
    project_images: [...row.project_images].sort(byPosition),
  };
}

export async function getPublishedProjects(): Promise<ShowcaseProject[]> {
  'use cache';
  cacheTag(PROJECTS_CACHE_TAG);
  cacheLife('hours');

  const { data, error } = await createPublicClient()
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('position')
    .order('created_at');
  if (error) throw error;
  return data.map(toShowcaseProject);
}

export async function getPublishedProject(slug: string): Promise<ProjectDetails | null> {
  'use cache';
  cacheTag(PROJECTS_CACHE_TAG);
  cacheLife('hours');

  const { data, error } = await createPublicClient()
    .from('projects')
    .select(WITH_CHILDREN)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data ? toProjectDetails(sortChildren(data)) : null;
}

export async function getDashboardProjects(): Promise<DashboardProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('position')
    .order('created_at');
  if (error) throw error;
  return data.map((row) => ({ ...toShowcaseProject(row), published: row.published }));
}

export async function getProjectForEditing(id: string): Promise<ProjectRowWithChildren | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(WITH_CHILDREN)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? sortChildren(data) : null;
}
