import type { Metadata } from 'next';

import { SpaceBackdrop } from '@/components/orbit/SpaceBackdrop';
import { PRIVACY_SECTION_ID } from '@/components/requests/privacy';
import { RequestForm } from '@/components/requests/RequestForm';
import { Card } from '@/components/ui/Card';
import { MainContent } from '@/components/ui/MainContent';

export const metadata: Metadata = {
  title: 'Solicitar projeto',
  description:
    'Conte para a Main o sistema, site ou aplicativo que você precisa e receba o contato da equipe.',
};

export default function RequestProjectPage() {
  return (
    <MainContent className="relative px-5 pt-32 pb-24 sm:px-12 lg:px-24">
      <SpaceBackdrop />
      <div className="relative mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <h1 className="font-display text-display">Solicitar projeto</h1>
          <p className="max-w-prose text-lead text-muted">
            Conte o que você precisa e a equipe da Main entra em contato para conversar sobre o
            projeto. Leva só alguns minutos.
          </p>
        </header>
        <Card data-theme="light" className="p-6 text-foreground sm:p-9">
          <RequestForm />
        </Card>
        <section
          id={PRIVACY_SECTION_ID}
          aria-labelledby="privacy-title"
          tabIndex={-1}
          className="flex scroll-mt-24 flex-col gap-3 rounded-card border border-border bg-surface p-7 backdrop-blur-md"
        >
          <h2 id="privacy-title" className="font-display text-heading">
            Como usamos seus dados
          </h2>
          <p className="text-muted">
            Usamos os dados deste formulário só para entrar em contato sobre o seu pedido. Eles
            ficam guardados [por até 12 meses depois do último contato] e não são compartilhados com
            ninguém de fora da Main.
          </p>
          <p className="text-muted">
            Você pode pedir para ver, corrigir ou apagar seus dados a qualquer momento, pelo e-mail
            da Main, como garante a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </section>
      </div>
    </MainContent>
  );
}
