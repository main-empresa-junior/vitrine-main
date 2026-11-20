'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { type SignInInput, signInSchema } from '@/lib/validation/auth';

const DEFAULT_REDIRECT = '/dashboard';

export type SignInResult = { error: string } | undefined;

export async function signIn(input: SignInInput, next?: string): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Confira o e-mail e a senha.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Same message for wrong email or wrong password, so attackers can't probe accounts.
    return { error: 'E-mail ou senha incorretos.' };
  }

  redirect(getSafeRedirect(next));
}

function getSafeRedirect(next?: string) {
  // Only allow internal dashboard paths, to prevent open redirects to other sites.
  return next?.startsWith('/dashboard') && !next.startsWith('//') ? next : DEFAULT_REDIRECT;
}
