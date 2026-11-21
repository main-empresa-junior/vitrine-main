export type FormIssue = {
  fieldId: string;
  message: string;
};

type ErrorNode = {
  message?: unknown;
  root?: { message?: unknown };
  [key: string]: unknown;
};

function isNode(value: unknown): value is ErrorNode {
  return typeof value === 'object' && value !== null;
}

// Listas inteiras (faltam itens) podem apontar para a seção delas; o resto aponta para o campo.
export type SectionIds = Readonly<Record<string, string>>;

function fieldIdFor(path: readonly string[], sectionIds: SectionIds): string {
  const joined = path.join('-');
  return sectionIds[joined] ?? joined;
}

// Achata o objeto de erros do react-hook-form numa lista na ordem dos campos do formulário.
export function collectFormIssues(
  errors: unknown,
  sectionIds: SectionIds = {},
  path: readonly string[] = [],
): FormIssue[] {
  if (!isNode(errors)) return [];
  const issues: FormIssue[] = [];
  const message = typeof errors.message === 'string' ? errors.message : errors.root?.message;
  if (path.length > 0 && typeof message === 'string') {
    issues.push({ fieldId: fieldIdFor(path, sectionIds), message });
  }
  for (const [key, child] of Object.entries(errors)) {
    if (key === 'message' || key === 'root' || key === 'ref' || key === 'type' || key === 'types') {
      continue;
    }
    issues.push(...collectFormIssues(child, sectionIds, [...path, key]));
  }
  return issues;
}
