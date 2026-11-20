import type { ReactNode } from 'react';

type FormSectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ id, title, description, children }: FormSectionProps) {
  return (
    <fieldset
      id={id}
      tabIndex={id ? -1 : undefined}
      className="flex min-w-0 flex-col gap-5 rounded-card border border-border bg-surface p-6"
    >
      <legend className="float-left w-full">
        <span className="block font-display text-heading">{title}</span>
        {description && <span className="mt-1 block text-small text-muted">{description}</span>}
      </legend>
      {children}
    </fieldset>
  );
}
