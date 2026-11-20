import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { supabaseEnv } from './env';

import 'server-only';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. This is safe to ignore
          // because the proxy refreshes the session on every dashboard request.
        }
      },
    },
  });
}
