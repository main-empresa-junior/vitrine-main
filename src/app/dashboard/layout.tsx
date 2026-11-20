import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { ToastProvider } from '@/components/ui/ToastProvider';

// O painel depende da sessão em toda requisição, então não há casca estática para pré-renderizar.
export const instant = false;

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Painel da Main' },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
