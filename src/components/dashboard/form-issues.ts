export type FormIssue = {
  fieldId: string;
  message: string;
};

// Listas inteiras (faltam itens) apontam para a seção; o resto aponta para o próprio campo.
const SECTION_IDS: Record<string, string> = {
  features: 'features-section',
  images: 'images-section',
  developers: 'developers-section',
};

type ErrorNode = {
  message?: unknown;
  root?: { message?: unknown };
  [key: string]: unknown;
};

function isNode(value: unknown): value is ErrorNode {
  return typeof value === 'object' && value !== null;
}

function fieldIdFor(path: readonly string[]): string {
  const joined = path.join('-');
  return SECTION_IDS[joined] ?? joined;
}

// Achata o objeto de erros do react-hook-form numa lista na ordem dos campos do formulário.
export function collectFormIssues(errors: unknown, path: readonly string[] = []): FormIssue[] {
  if (!isNode(errors)) return [];
  const issues: FormIssue[] = [];
  const message = typeof errors.message === 'string' ? errors.message : errors.root?.message;
  if (path.length > 0 && typeof message === 'string') {
    issues.push({ fieldId: fieldIdFor(path), message });
  }
  for (const [key, child] of Object.entries(errors)) {
    if (key === 'message' || key === 'root' || key === 'ref' || key === 'type' || key === 'types') {
      continue;
    }
    issues.push(...collectFormIssues(child, [...path, key]));
  }
  return issues;
}
