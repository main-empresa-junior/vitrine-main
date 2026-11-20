'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { getSafeDashboardPath } from './safe-redirect';
import { type SignInInput, signInSchema } from './schema';

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

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
