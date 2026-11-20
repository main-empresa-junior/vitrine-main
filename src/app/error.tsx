'use client';

import Link from 'next/link';

import { StatusScreen } from '@/components/site/StatusScreen';
import { Button } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/button-styles';

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <StatusScreen
      title="Houve uma pane na nave"
      message="Algo deu errado ao carregar esta página. Tente de novo em instantes."
    >
      <Button onClick={() => retry()}>Tentar de novo</Button>
      <Link href="/" className={buttonClasses({ variant: 'secondary' })}>
        Voltar para a vitrine
      </Link>
    </StatusScreen>
  );
}
