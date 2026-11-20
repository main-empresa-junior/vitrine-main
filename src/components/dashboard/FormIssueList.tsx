'use client';

import { useEffect, useRef } from 'react';

import type { FormIssue } from './form-issues';

type FormIssueListProps = {
  title: string;
  issues: readonly FormIssue[];
};

// Resumo dos erros no topo do formulário: recebe o foco e cada item leva ao campo.
export function FormIssueList({ title, issues }: FormIssueListProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.focus();
  }, [issues]);

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      role="alert"
      aria-labelledby="form-issues-title"
      className="rounded-card border-2 border-danger bg-surface p-6"
    >
      <h2 id="form-issues-title" className="font-display text-heading">
        {title}
      </h2>
      <ul className="mt-3 flex list-disc flex-col gap-1 ps-5">
        {issues.map((issue) => (
          <li key={`${issue.fieldId}-${issue.message}`}>
            <a
              href={`#${issue.fieldId}`}
              className="font-semibold text-danger underline underline-offset-4"
            >
              {issue.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
