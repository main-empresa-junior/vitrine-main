# Plano de construção — vitrine-main

Plano seguido etapa por etapa. Cada etapa termina com `format`, `lint`, `typecheck`, `test` e
`build` passando, `docs/PROGRESS.md` atualizado e commits pequenos.

## Auditoria do que já existe

| Item                                                     | Estado                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `.prettierrc.json`, `.prettierignore`                    | Certo                                                         |
| `eslint.config.mjs`                                      | Falta proibir `any`, `@ts-ignore`, `var` e exigir `===`       |
| Husky (`pre-commit`, `commit-msg`) e lint-staged         | Certo                                                         |
| `.vscode/setting.json`                                   | Nome errado (`settings.json`)                                 |
| `.editorconfig`, `CONTRIBUTING.md`                       | Faltam                                                        |
| CI                                                       | Falta o passo `test`                                          |
| Scripts `test` e `db:types`                              | Faltam (instalar `vitest` e `supabase`)                       |
| `globals.css`                                            | Tokens quase completos; falta `data-motion` e `ink/mist` dark |
| `layout.tsx`                                             | Falta script de movimento e metadados completos               |
| `Button`, `TextField`                                    | Existem; `Button` sem `ghost`, tamanhos e carregamento        |
| Supabase `client`, `server`, `proxy`, `env`, `src/proxy` | Certos; faltam tipos do banco                                 |
| Login, `signIn`, `signOut`                               | Funcionam; schema vai para `features/auth`                    |
| `src/app/page.tsx`                                       | Página padrão do Next; vira a vitrine em `(site)`             |

## Etapas

### 0. Padronização

Ajustar ESLint, renomear `.vscode/settings.json`, criar `.editorconfig` e `CONTRIBUTING.md`,
adicionar `vitest`, `supabase` CLI e scripts `test`/`db:types`, passo de teste na CI.

### 1. Tokens, tema e componentes base

- `src/app/globals.css`: tokens existentes + variantes `motion-reduced`/`motion-full` via
  `data-motion`, estilos base de movimento reduzido.
- `src/app/layout.tsx`: script de movimento no `<head>`, metadados.
- `src/hooks/useReducedMotion.ts`, `src/lib/motion.ts` (leitura e escrita da preferência).
- `src/components/ui/`: `Button`, `TextField`, `TextArea`, `Select`, `Checkbox`, `FieldError`,
  `Card`, `Badge`, `Tag`, `Dialog`, `Toast` (+ `ToastProvider`), `ThemeToggle`, `MotionToggle`.
- `src/lib/utils/cn.ts` para juntar classes.

### 2. Supabase e autenticação

- `supabase/migrations/<data>_initial_schema.sql`: `projects`, `project_features`,
  `project_images`, gatilho `updated_at`, RLS, bucket `project-images`.
- `src/types/database.ts` gerado por `npm run db:types`.
- `src/features/auth/` (`schema.ts`, `actions.ts`, `safe-redirect.ts` com teste).
- Login com tema claro (o painel é claro).

### 3. Painel

- `src/app/dashboard/layout.tsx` (cabeçalho, usuário, "Sair") e grupo `(app)` para separar o login.
- `src/features/projects/`: `schema.ts` (Zod compartilhado), `queries.ts`, `actions.ts`,
  `palettes.ts`, `slug.ts`.
- `src/components/dashboard/`: `ProjectList`, `ProjectRow`, `DeleteProjectDialog`, `ProjectForm`
  e seções (`InfoSection`, `TeamSection`, `FeaturesSection`, `PaletteSection`, `ImagesSection`),
  `TagInput`, `PalettePicker`, `ProjectPreview`.

### 4. Vitrine 3D

- `src/lib/textures.ts`, `src/lib/orbits.ts`, `src/lib/color.ts` com testes Vitest.
- `src/components/orbit/`: `OrbitExperience` (cliente, estado da viagem), `OrbitScene` (Canvas),
  `Sun`, `Planet`, `OrbitRing`, `Starfield`, `Rocket`, `SpeedLines`, `CameraRig`, e a interface:
  `Intro`, `ProjectSheet`, `StopTrail`, `OrbitControls`, `TravelNotice`, `AllProjects`,
  `ProjectList` (sem WebGL).
- `src/app/(site)/page.tsx` lê os projetos publicados no servidor.

### 5. Página do projeto

- `src/app/(site)/projects/[slug]/page.tsx` + `opengraph-image.tsx`.
- `src/components/project/`: `ProjectHero`, `ProjectFacts`, `ProjectFeatures`, `ProjectGallery`,
  `NextProjectLink`.

### 6. Orbi

- `src/components/mascot/`: `Orbi` (SVG), `OrbiCorner` (brincadeiras e botão de dúvida), CSS de
  animações em `orbi.css`.

### 7. Acabamento

`not-found.tsx`, `error.tsx`, `loading.tsx`, `sitemap.ts`, `robots.ts`, auditoria de acessibilidade
e responsividade, `README.md` em inglês, revisão de duplicações.

## Pendências que dependem do mantenedor

- E-mail de contato da Main (Orbi e página do projeto).
- Projeto Supabase: aplicar a migração, gerar tipos com acesso ao projeto e criar o primeiro usuário.
