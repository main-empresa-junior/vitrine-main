import { supabaseEnv } from '@/lib/supabase/env';

import type { ACCEPTED_IMAGE_TYPES } from './constants';
import { MAX_IMAGE_BYTES, PROJECT_IMAGES_BUCKET } from './constants';

const EXTENSIONS: Record<(typeof ACCEPTED_IMAGE_TYPES)[number], string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export function projectImageUrl(path: string): string {
  return `${supabaseEnv.url}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/${path}`;
}

function isAcceptedType(type: string): type is keyof typeof EXTENSIONS {
  return type in EXTENSIONS;
}

export type ImageCheck = { ok: true; path: string } | { ok: false; error: string };

// O bucket também limita tipo e tamanho; a checagem aqui só dá a mensagem antes do envio.
export function checkImageFile(file: File): ImageCheck {
  if (!isAcceptedType(file.type)) {
    return { ok: false, error: `${file.name}: use PNG, JPG, WebP ou AVIF.` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `${file.name}: a imagem passa de 5 MB.` };
  }
  return { ok: true, path: `${crypto.randomUUID()}.${EXTENSIONS[file.type]}` };
}
