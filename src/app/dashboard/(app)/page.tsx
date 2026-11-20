import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';

import { signOut } from './actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // Defense in depth: the proxy already blocks visitors, but pages check again.
  if (!data?.claims) redirect('/dashboard/login');

  return (
    <main className="min-h-dvh bg-background p-8 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-heading">Painel da equipe</h1>
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            Sair
          </Button>
        </form>
      </div>
      <p className="mt-4 text-muted">Você entrou como {data.claims.email}.</p>
    </main>
  );
}
