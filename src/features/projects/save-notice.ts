export const SAVE_NOTICE_PARAM = 'aviso';

export const SAVE_NOTICES = {
  created: 'Projeto criado',
  updated: 'Projeto atualizado',
  published: 'Projeto publicado',
} as const;

export type SaveNotice = keyof typeof SAVE_NOTICES;

export function saveNoticeFor(published: boolean, isEditing: boolean): SaveNotice {
  if (published) return 'published';
  return isEditing ? 'updated' : 'created';
}

export function parseSaveNotice(value: string | null): SaveNotice | null {
  return value !== null && Object.hasOwn(SAVE_NOTICES, value) ? (value as SaveNotice) : null;
}
