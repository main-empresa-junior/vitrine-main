import type { Metadata } from 'next';

import { SpaceBackdrop } from '@/components/orbit/SpaceBackdrop';
import { CssStarfield } from '@/components/site/CssStarfield';
import { Card } from '@/components/ui/Card';
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
      <div data-theme="light" className="relative w-full max-w-md text-foreground">
        <Card className="p-9">
          <Logo variant="onLight" priority />
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
