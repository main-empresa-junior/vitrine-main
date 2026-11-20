import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Figtree, Unbounded } from 'next/font/google';
import Script from 'next/script';

import { WaitingLinger } from '@/components/mascot/WaitingLinger';
import { NavigationProgress } from '@/components/site/NavigationProgress';
import { PREFERENCES_SCRIPT } from '@/lib/preferences';
import { SITE_URL } from '@/lib/site';

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
  metadataBase: new URL(SITE_URL),
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
      <body>
        <Script id="preferences" strategy="beforeInteractive">
          {PREFERENCES_SCRIPT}
        </Script>
        <NavigationProgress />
        {children}
        <WaitingLinger />
      </body>
    </html>
  );
}
