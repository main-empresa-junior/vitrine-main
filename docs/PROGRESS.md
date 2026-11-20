# Progresso

## Etapa 0 — padronização (concluída)

- ESLint: proíbe `any`, `@ts-ignore`, `var`; exige `===`, `import type` e zero avisos.
- `.vscode/settings.json` (o arquivo estava como `setting.json`), `.editorconfig`, `CONTRIBUTING.md`.
- Vitest e Supabase CLI instalados; scripts `test` e `db:types`; CI roda os testes e usa os
  segredos `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `@types/node` alinhado ao Node 22; Next.js 16.4.3 → 16.4.6 (correções de segurança em `use cache`).
- Painel marcado com `instant = false`: toda página depende da sessão.

## Etapa 1 — tokens, tema e componentes base (concluída)

- `globals.css`: tokens semânticos novos (`surface-strong`, `danger`, `success`, `overlay`), tema
  claro também em `[data-theme='light']`, variantes `motion-safe`/`motion-reduce` ligadas a
  `data-motion`.
- Script no `<head>` (`PREFERENCES_SCRIPT`) sempre define `data-motion` e aplica o tema salvo.
- Hooks `useReducedMotion`, `useHtmlAttribute`, `useHasMounted`.
- `components/ui`: `Button` (+ `buttonClasses` para links), `Field`, `TextField`, `TextArea`,
  `Select`, `Checkbox`, `FieldError`, `Card`, `Badge`, `Tag`, `Icon`, `Spinner`, `Dialog`
  (`<dialog>` nativo com `showModal`), `Toast` + `ToastProvider`, `ThemeToggle`, `MotionToggle`.
- Página inicial padrão do Next substituída por um marcador em `(site)`, com tema escuro.

## Próximo

Etapa 2: Supabase e autenticação.
