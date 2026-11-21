import type { Metadata } from 'next';
import Link from 'next/link';
import { z } from 'zod';

import { VLibras } from '@/components/accessibility/VLibras';
import { SpaceBackdrop } from '@/components/orbit/SpaceBackdrop';
import { CssStarfield } from '@/components/site/CssStarfield';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { MainContent } from '@/components/ui/MainContent';
import { SIGN_OUT_MESSAGES, SIGN_OUT_REASONS } from '@/features/auth/session-limits';

import { LoginForm } from './LoginForm';

// Lê o parâmetro next da URL antes de renderizar o formulário.
export const instant = false;

export const metadata: Metadata = {
  title: 'Entrar no painel',
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<'/dashboard/login'>) {
  const { next, reason } = await searchParams;
  const signOutReason = z.enum(SIGN_OUT_REASONS).safeParse(reason);

  return (
    <MainContent
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
          {signOutReason.success && (
            <p
              role="status"
              className="mb-6 rounded-field border-2 border-focus px-4 py-3 font-semibold"
            >
              {SIGN_OUT_MESSAGES[signOutReason.data]}
            </p>
          )}
          <LoginForm next={typeof next === 'string' ? next : undefined} />
        </Card>
      </div>
      <VLibras />
    </MainContent>
  );
}
