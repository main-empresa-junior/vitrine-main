import type { ReactNode } from 'react';

type SectionTitleProps = {
  id: string;
  children: ReactNode;
};

export function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <h2 id={id} tabIndex={-1} className="font-display text-title">
      {children}
    </h2>
  );
}
