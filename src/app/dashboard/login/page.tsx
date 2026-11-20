import type { Metadata } from 'next';
import Link from 'next/link';

import { SpaceBackdrop } from '@/components/orbit/SpaceBackdrop';
import { CssStarfield } from '@/components/site/CssStarfield';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

import { LoginForm } from './LoginForm';

// Lê o parâmetro next da URL antes de renderizar o formulário.
export const instant = false;

export const metadata: Metadata = {
  title: 'Entrar no painel',
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<'/dashboard/login'>) {
  const { next } = await searchParams;

  return (
    <main
      data-theme="dark"
      className="relative flex min-h-dvh items-center justify-center px-5 py-10"
    >
      <CssStarfield />
      <SpaceBackdrop />
      <div className="relative flex w-full max-w-md flex-col gap-4">
        <ButtonLink href="/" variant="secondary" size="sm" className="self-start">
          <Icon name="arrowLeft" className="size-4" />
          Voltar ao site
        </ButtonLink>
        <Card data-theme="light" className="p-9 text-foreground">
          <Link
            href="/"
            aria-label="Main, voltar ao início"
            className="inline-flex min-h-11 items-center rounded-field"
          >
            <Logo variant="onLight" priority />
          </Link>
          <h1 className="mt-8 font-display text-title">Área da equipe</h1>
          <p className="mt-2 mb-7 text-muted">
            Entre para cadastrar e editar os projetos da vitrine.
          </p>
          <LoginForm next={typeof next === 'string' ? next : undefined} />
        </Card>
      </div>
    </main>
  );
}
