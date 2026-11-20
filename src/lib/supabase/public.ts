import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

import { supabaseEnv } from './env';

import 'server-only';

// Sem cookies: lê como visitante, então pode ser usado dentro de 'use cache' e só vê o que é público.
export function createPublicClient() {
  return createClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
