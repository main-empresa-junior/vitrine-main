import type { Metadata } from 'next';

import { ProjectRequestCard } from '@/components/dashboard/ProjectRequestCard';
import { MainContent } from '@/components/ui/MainContent';
import { getProjectRequests } from '@/features/project-requests/queries';

export const metadata: Metadata = { title: 'Pedidos de projeto' };

export default async function ProjectRequestsPage() {
  const requests = await getProjectRequests();

  return (
    <MainContent className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-title">Pedidos de projeto</h1>
        <p className="mt-2 max-w-prose text-muted">
          Pedidos enviados pelo formulário do site, dos mais novos para os mais antigos.
        </p>
      </div>
      {requests.length === 0 ? (
        <p className="rounded-card border border-border bg-surface p-7 text-muted">
          Nenhum pedido ainda. Eles aparecem aqui assim que alguém enviar o formulário.
        </p>
      ) : (
        <ol className="flex flex-col gap-5">
          {requests.map((request) => (
            <li key={request.id}>
              <ProjectRequestCard request={request} />
            </li>
          ))}
        </ol>
      )}
    </MainContent>
  );
}
