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

## Etapa 2 — Supabase e autenticação (concluída)

- Migração `20261120000000_initial_schema.sql` aplicada no projeto Vitrine MAIN: `projects`,
  `project_features`, `project_images`, enums, gatilho `updated_at`, RLS e bucket `project-images`
  (5 MB, PNG/JPG/WebP/AVIF).
- Tipos gerados em `src/types/database.ts` (`npm run db:types`, agora com `--remote`).
- Clientes tipados; `public.ts` lê sem cookies para as consultas em cache.
- `features/auth`: esquema, ações `signIn`/`signOut`, `getSafeDashboardPath` (testado) e
  `requireTeamMember`.
- Logos em `public/brand/` (os pares `on-light`/`on-dark` e `mono-black`/`mono-white` vieram
  trocados e foram renomeados); `icon.png` e `apple-icon.png` em `src/app`.

## Etapa 3 — painel (concluída)

- `features/projects`: constantes, esquema Zod único (navegador e Server Action), slug, ordem,
  modelo, consultas (`'use cache'` + `cacheTag`) e ações com `updateTag` + `revalidatePath`.
- Lista com miniatura 2D do planeta, busca, reordenar, publicar e excluir com `Dialog`.
- `ProjectEditor` com seções, `TagInput`, `ColorField` (react-colorful), upload de telas e prévia ao
  vivo com o mesmo `Planet` 3D e a mesma `ProjectSheet` da vitrine.
- `lib/color`, `lib/noise`, `lib/textures` com testes.
- Não verificado com sessão real: precisa da senha do usuário de teste.

## Etapa 4 — vitrine 3D (concluída)

- `lib/orbits.ts` (divisão em órbitas de 7, posições, paradas da câmera, curva em volta do sol) e
  `lib/stars.ts`, com testes.
- `components/orbit`: `OrbitScene`, `SolarSystem`, `Sun` (cor por órbita e farol ao longe),
  `OrbitingPlanet`, `OrbitRing`, `Starfield`, `Rocket`, `SpeedLines`, `CameraRig` + `travel.ts`
  (viagem com meia-volta no retorno), `JourneyIntro`, `ProjectSheet`, `StopTrail`, `OrbitSwitcher`,
  `TravelNotice`, `AllProjects` com filtros e `ProjectCard`.
- Cabeçalho, "Sobre a Main" e rodapé de contato com marcadores `[…]` até os textos chegarem.
- Sem WebGL: título e aviso, com a lista "Todos os projetos" logo abaixo.
- Cena carregada com `dynamic(..., { ssr: false })`, pixel ratio até 2, texturas em cache por
  projeto, `frameloop` parado quando a seção sai da tela.
- Verificado no navegador com dados fictícios (rota temporária, já removida): visão geral, parada no
  planeta com ficha, e viagem para a órbita 2.

## Próximo

Etapa 5: página do projeto.
