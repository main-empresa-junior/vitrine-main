'use client';

import { StatusScreen } from '@/components/site/StatusScreen';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <StatusScreen
      title="Houve uma pane na nave"
      message="Algo deu errado ao carregar esta página. Tente de novo em instantes."
    >
      <Button onClick={() => retry()}>Tentar de novo</Button>
      <ButtonLink href="/" variant="secondary">
        Voltar para a vitrine
      </ButtonLink>
    </StatusScreen>
  );
}
