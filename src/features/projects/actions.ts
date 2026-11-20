'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireTeamMember } from '@/features/auth/session';
import { createClient } from '@/lib/supabase/server';

import { PROJECT_IMAGES_BUCKET, PROJECTS_CACHE_TAG } from './constants';
import { toFormValues, toProjectColumns } from './model';
import { type MoveDirection, moveItem } from './ordering';
import { getProjectForEditing } from './queries';
import { SAVE_NOTICE_PARAM, saveNoticeFor } from './save-notice';
import { type ProjectFormValues, projectPublishSchema, schemaFor } from './schema';

const UNIQUE_VIOLATION = '23505';
const idSchema = z.uuid();

export type ActionResult =
  { ok: true; id: string } | { ok: false; error: string; field?: keyof ProjectFormValues };

export type SaveFailure = Extract<ActionResult, { ok: false }>;

function refreshPublicPages(): void {
  updateTag(PROJECTS_CACHE_TAG);
  revalidatePath('/');
  revalidatePath('/projects/[slug]', 'page');
  revalidatePath('/dashboard');
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function replaceChildren(
  supabase: Supabase,
  projectId: string,
  values: ProjectFormValues,
): Promise<string | null> {
  const [{ data: oldFeatures }, { data: oldImages }] = await Promise.all([
    supabase.from('project_features').select('id').eq('project_id', projectId),
    supabase.from('project_images').select('id, path').eq('project_id', projectId),
  ]);

  // Insere antes de apagar: se algo falhar no meio, as listas antigas continuam salvas.
  const inserts = await Promise.all([
    values.features.length > 0
      ? supabase.from('project_features').insert(
          values.features.map((feature, position) => ({
            ...feature,
            project_id: projectId,
            position,
          })),
        )
      : { error: null },
    values.images.length > 0
      ? supabase
          .from('project_images')
          .insert(
            values.images.map((image, position) => ({ ...image, project_id: projectId, position })),
          )
      : { error: null },
  ]);
  if (inserts.some(({ error }) => error)) return 'Não foi possível salvar funcionalidades e telas.';

  const oldFeatureIds = (oldFeatures ?? []).map(({ id }) => id);
  const oldImageIds = (oldImages ?? []).map(({ id }) => id);
  await Promise.all([
    oldFeatureIds.length > 0 && supabase.from('project_features').delete().in('id', oldFeatureIds),
    oldImageIds.length > 0 && supabase.from('project_images').delete().in('id', oldImageIds),
  ]);

  const keptPaths = new Set(values.images.map((image) => image.path));
  const removedPaths = (oldImages ?? [])
    .map(({ path }) => path)
    .filter((path) => !keptPaths.has(path));
  if (removedPaths.length > 0)
    await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove(removedPaths);
  return null;
}

export async function saveProject(
  input: ProjectFormValues,
  projectId?: string,
): Promise<SaveFailure> {
  await requireTeamMember();
  const parsed = schemaFor(input.published).safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: input.published
        ? 'Faltam informações para publicar. Confira a lista no topo do formulário.'
        : 'Confira os campos destacados.',
    };
  }
  if (projectId && !idSchema.safeParse(projectId).success) {
    return { ok: false, error: 'Projeto não encontrado.' };
  }

  const supabase = await createClient();
  const columns = toProjectColumns(parsed.data);

  let id = projectId;
  if (id) {
    const { error } = await supabase.from('projects').update(columns).eq('id', id);
    if (error) return saveError(error.code);
  } else {
    const { data: last } = await supabase
      .from('projects')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...columns, position: (last?.position ?? -1) + 1 })
      .select('id')
      .single();
    if (error) return saveError(error.code);
    id = data.id;
  }

  const childError = await replaceChildren(supabase, id, parsed.data);
  if (childError) return { ok: false, error: childError };

  refreshPublicPages();
  const notice = saveNoticeFor(parsed.data.published, Boolean(projectId));
  redirect(`/dashboard?${SAVE_NOTICE_PARAM}=${notice}`);
}

function saveError(code: string): SaveFailure {
  if (code === UNIQUE_VIOLATION) {
    return { ok: false, error: 'Já existe um projeto com esse endereço.', field: 'slug' };
  }
  return { ok: false, error: 'Não foi possível salvar o projeto. Tente de novo.' };
}

// Funcionalidades e telas ficam em outras tabelas: a regra de publicação delas é garantida aqui.
async function missingForPublishing(id: string): Promise<string | null> {
  const row = await getProjectForEditing(id);
  if (!row) return 'Projeto não encontrado.';
  const result = projectPublishSchema.safeParse(toFormValues({ ...row, published: true }));
  if (result.success) return null;
  const messages = [...new Set(result.error.issues.map((issue) => issue.message))];
  return `Para publicar, abra o projeto e complete: ${messages.join(' ')}`;
}

export async function setProjectPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireTeamMember();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Projeto não encontrado.' };
  if (published) {
    const missing = await missingForPublishing(id);
    if (missing) return { ok: false, error: missing };
  }
  const supabase = await createClient();
  const { error } = await supabase.from('projects').update({ published }).eq('id', id);
  if (error) return { ok: false, error: 'Não foi possível mudar a publicação.' };
  refreshPublicPages();
  return { ok: true, id };
}

export async function moveProject(id: string, direction: MoveDirection): Promise<ActionResult> {
  await requireTeamMember();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Projeto não encontrado.' };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, position, published')
    .order('position')
    .order('created_at');
  if (error) return { ok: false, error: 'Não foi possível reordenar.' };

  const ordered = moveItem(
    data,
    data.findIndex((project) => project.id === id),
    direction,
    (a, b) => a.published === b.published,
  );
  const updates = ordered
    .map((project, position) => ({ ...project, position }))
    .filter(
      (project, position) =>
        data.find(({ id: rowId }) => rowId === project.id)?.position !== position,
    );
  const results = await Promise.all(
    updates.map(({ id: rowId, position }) =>
      supabase.from('projects').update({ position }).eq('id', rowId),
    ),
  );
  if (results.some((result) => result.error))
    return { ok: false, error: 'Não foi possível reordenar.' };

  refreshPublicPages();
  return { ok: true, id };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireTeamMember();
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Projeto não encontrado.' };
  const supabase = await createClient();
  const { data: images } = await supabase
    .from('project_images')
    .select('path')
    .eq('project_id', id);
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { ok: false, error: 'Não foi possível excluir o projeto.' };
  const paths = (images ?? []).map(({ path }) => path);
  if (paths.length > 0) await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove(paths);

  refreshPublicPages();
  return { ok: true, id };
}
