# Progresso

## Etapa 0 — padronização (concluída)

- ESLint: proíbe `any`, `@ts-ignore`, `var`; exige `===`, `import type` e zero avisos.
- `.vscode/settings.json` (o arquivo estava como `setting.json`), `.editorconfig`, `CONTRIBUTING.md`.
- Vitest e Supabase CLI instalados; scripts `test` e `db:types`; CI roda os testes e usa os
  segredos `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `@types/node` alinhado ao Node 22; Next.js 16.4.3 → 16.4.6 (correções de segurança em `use cache`).
- Painel marcado com `instant = false`: toda página depende da sessão.

## Próximo

Etapa 1: tokens, tema e componentes base.
