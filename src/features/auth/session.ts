import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import 'server-only';

export type TeamMember = {
  id: string;
  email: string;
};

// Segunda camada de proteção (depois do proxy): toda página e ação do painel confere a sessão.
export async function requireTeamMember(): Promise<TeamMember> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect('/dashboard/login');
  return { id: claims.sub, email: typeof claims.email === 'string' ? claims.email : '' };
}
