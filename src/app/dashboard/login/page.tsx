import type { Metadata } from 'next';

import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Entrar | Painel da Main',
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <main
      data-theme="dark"
      className="flex min-h-dvh items-center justify-center bg-background px-5"
    >
      <div className="w-full max-w-md rounded-panel border border-border bg-surface p-9 shadow-card">
        <h1 className="font-display text-title">Área da equipe</h1>
        <p className="mt-2 mb-7 text-muted">
          Entre para cadastrar e editar os projetos da vitrine.
        </p>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
