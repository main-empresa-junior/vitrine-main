import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatBrazilPhone } from '@/features/project-requests/phone';
import type { ProjectRequestRow } from '@/features/project-requests/queries';
import {
  CONTACT_PREFERENCE_LABELS,
  PLATFORM_LABELS,
  REQUEST_STATUS_LABELS,
} from '@/features/project-requests/schema';

import { RequestStatusControl } from './RequestStatusControl';

const DATE_TIME = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});
const DATE = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' });

type ProjectRequestCardProps = {
  request: ProjectRequestRow;
};

export function ProjectRequestCard({ request }: ProjectRequestCardProps) {
  const titleId = `request-${request.id}`;
  const facts = [
    { label: 'Onde deve funcionar', value: PLATFORM_LABELS[request.platform] },
    { label: 'Prefere contato por', value: CONTACT_PREFERENCE_LABELS[request.contact_preference] },
    {
      label: 'Prazo desejado',
      value: request.deadline ? DATE.format(new Date(request.deadline)) : 'Sem prazo',
    },
  ];

  return (
    <Card>
      <article aria-labelledby={titleId} className="flex flex-col gap-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="font-display text-heading break-words">
              {request.client_name}
            </h2>
            <p className="mt-1 text-small text-muted">
              Enviado em {DATE_TIME.format(new Date(request.created_at))}
            </p>
          </div>
          <Badge tone={request.status === 'new' ? 'brand' : 'neutral'}>
            {REQUEST_STATUS_LABELS[request.status]}
          </Badge>
        </header>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-small font-semibold text-muted">E-mail</dt>
            <dd>
              <a
                href={`mailto:${request.email}`}
                className="font-semibold break-all underline underline-offset-4"
              >
                {request.email}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small font-semibold text-muted">Telefone</dt>
            <dd className="font-semibold">
              {request.phone ? (
                <a href={`tel:+55${request.phone}`} className="underline underline-offset-4">
                  {formatBrazilPhone(request.phone)}
                </a>
              ) : (
                'Não informado'
              )}
            </dd>
          </div>
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt className="text-small font-semibold text-muted">{fact.label}</dt>
              <dd className="font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-1">
          <h3 className="text-small font-semibold text-muted">O que o cliente precisa</h3>
          <p className="whitespace-pre-wrap">{request.description}</p>
        </div>
        <RequestStatusControl id={request.id} status={request.status} />
      </article>
    </Card>
  );
}
