'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

import { getSafeDashboardPath } from './safe-redirect';
import { type SignInInput, signInSchema } from './schema';
import { SIGN_OUT_REASONS, type SignOutReason } from './session-limits';

const LOGIN_PATH = '/dashboard/login';

export type SignInResult = { error: string } | undefined;

export async function signIn(input: SignInInput, next?: string): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Confira o e-mail e a senha.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Mesma mensagem para e-mail ou senha errados, para não revelar quais contas existem.
    return { error: 'E-mail ou senha incorretos.' };
  }

  redirect(getSafeDashboardPath(next));
}

const reasonSchema = z.enum(SIGN_OUT_REASONS);

// Encerra a sessão no Supabase (o refresh token deixa de valer), não só os cookies do navegador.
async function endSession(query = ''): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });
  redirect(`${LOGIN_PATH}${query}`);
}

export async function signOut(): Promise<never> {
  return endSession();
}

// Saída automática (inatividade ou outra aba): o login explica o motivo.
export async function signOutBecause(reason: SignOutReason): Promise<never> {
  const parsed = reasonSchema.safeParse(reason);
  return endSession(parsed.success ? `?reason=${parsed.data}` : '');
}
