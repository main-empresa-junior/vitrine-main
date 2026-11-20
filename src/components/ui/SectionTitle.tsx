import type { ReactNode } from 'react';

type SectionTitleProps = {
  id: string;
  children: ReactNode;
};

export function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <h2 id={id} className="font-display text-title">
      {children}
    </h2>
  );
}
