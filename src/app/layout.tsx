import type { Metadata } from 'next';
import { Figtree, Unbounded } from 'next/font/google';

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
  title: 'Main | Projetos em órbita',
  description:
    'Vitrine dos projetos da Main, empresa júnior de Ciência da Computação e Engenharia de Software.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${unbounded.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
