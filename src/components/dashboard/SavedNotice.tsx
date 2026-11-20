'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useToast } from '@/components/ui/ToastProvider';
import { parseSaveNotice, SAVE_NOTICE_PARAM, SAVE_NOTICES } from '@/features/projects/save-notice';

// Mostra o aviso vindo de um salvamento e limpa a URL, para ele não voltar ao recarregar.
export function SavedNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showToast = useToast();
  const shownRef = useRef<string | null>(null);
  const notice = parseSaveNotice(searchParams.get(SAVE_NOTICE_PARAM));

  useEffect(() => {
    if (!notice || shownRef.current === notice) return;
    shownRef.current = notice;
    showToast(SAVE_NOTICES[notice], 'success');
    router.replace('/dashboard', { scroll: false });
  }, [notice, router, showToast]);

  return null;
}
