import { requireTeamMember } from '@/features/auth/session';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

import 'server-only';

export type ProjectRequestRow = Omit<
  Database['public']['Tables']['project_requests']['Row'],
  'ip_hash'
>;

const LISTED_COLUMNS =
  'id, client_name, description, platform, email, phone, contact_preference, deadline, consent, status, created_at';

export async function getProjectRequests(): Promise<ProjectRequestRow[]> {
  await requireTeamMember();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_requests')
    .select(LISTED_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw new Error('Não foi possível carregar os pedidos de projeto.');
  return data;
}
