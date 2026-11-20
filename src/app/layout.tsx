import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Figtree, Unbounded } from 'next/font/google';

import { PREFERENCES_SCRIPT } from '@/lib/preferences';

import './globals.css';

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Main | Projetos em órbita', template: '%s | Main' },
  description:
    'Vitrine dos projetos da Main, empresa júnior de Ciência da Computação e Engenharia de Software da UEM.',
  applicationName: 'Main',
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Main' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // O script de preferências altera atributos do <html> antes da hidratação.
    <html
      lang="pt-BR"
      className={`${unbounded.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
