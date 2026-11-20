import type { ReactNode } from 'react';

// O painel depende da sessão em toda requisição, então não há casca estática para pré-renderizar.
export const instant = false;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
