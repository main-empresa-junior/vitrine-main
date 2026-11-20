import type { Metadata } from 'next';

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
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <Card className="w-full max-w-md p-9">
        <Logo variant="onLight" priority className="dark:hidden" />
        <Logo variant="onDark" priority className="hidden dark:block" />
        <h1 className="mt-8 font-display text-title">Área da equipe</h1>
        <p className="mt-2 mb-7 text-muted">
          Entre para cadastrar e editar os projetos da vitrine.
        </p>
        <LoginForm next={typeof next === 'string' ? next : undefined} />
      </Card>
    </main>
  );
}
