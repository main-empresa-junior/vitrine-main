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

## Etapa 5 — página do projeto (concluída)

- `/projects/[slug]` com `generateStaticParams` (cache de 1 h, revalidado ao salvar),
  `notFound()` para slug inexistente ou rascunho, metadados e `opengraph-image` por projeto.
- Página pintada pela paleta (`projectPageBackground` garante contraste 7:1 mesmo com cor clara),
  planeta 3D grande, ficha, funcionalidades, galeria com ampliação em `Dialog` e próximo projeto.
- Script de preferências passou para `next/script` com `beforeInteractive` (aviso do React 19).
- Brilho da atmosfera refeito para sumir suavemente na borda.
- Com Cache Components, `generateStaticParams` não pode ser vazio: sem projetos publicados, gera
  `/projects/sem-projetos`, que responde 404.

## Etapa 6 — Orbi (concluída)

- `components/mascot`: `OrbiFigure` (SVG com capacete hexagonal no degradê da marca),
  `OrbiCorner` (brincadeiras sorteadas sem repetir: pular, relar, voar, sentar, espiar, girar; para e
  acena ao passar o mouse ou focar) e `orbi.css`. Sorteio testado em `orbi-actions.test.ts`.
- Botão de dúvida abre `mailto:` com assunto, usando `NEXT_PUBLIC_CONTACT_EMAIL`.
- Parado no modo de movimento reduzido.

## Etapa 7 — acabamento (concluída)

- `not-found`, `error` (com `retry`) e `loading` no visual do site, via `StatusScreen` e
  `LoadingState`; `sitemap.ts`, `robots.ts` e `metadataBase` a partir de `NEXT_PUBLIC_SITE_URL`.
- Auditoria em 375 px: cabeçalho sólido no celular, sem rolagem horizontal; 404 com um Orbi só.
- `README.md` em inglês.
- Reaproveitamento: `useSupportsWebGL`, `SectionTitle`, `TagList`, `ReorderButtons`,
  `normalizeForSearch` extraídos ao aparecerem pela segunda vez.

## Pendências

- Textos de "Sobre a Main" e "Contato" (marcados com `[…]`).
- Testar o painel com a sessão real (criar, editar, publicar, enviar telas, excluir).
- Logos `icon-on-light.png` e `icon-on-dark.png` não vieram com os demais arquivos.
- Gerar as texturas leva alguns segundos com muitos planetas; se pesar, reduzir a resolução ou
  movê-las para um Web Worker.
- Auditoria completa com leitor de tela e em 768/1024 px ainda não foi feita.

## Universo sem projetos (concluída)

- `SpaceBackground`: céu único (três camadas de estrelas, Via Láctea, nebulosa nas cores da marca,
  cometa ocasional e rotação lenta) usado por todas as cenas através de `SpaceCanvas`. O antigo
  `Starfield` foi removido.
- `SpaceBackdrop`: céu de tela cheia com a câmera flutuando (`CameraDrift`), usado na página do
  projeto (por baixo da cor da paleta) e no login. Sem WebGL, `CssStarfield` (utilitário
  `bg-starfield`).
- `lib/showcase-state.ts` (`empty` | `populated`, rascunhos não contam), com testes; a página inicial
  escolhe entre `EmptyUniverse` e a vitrine normal.
- Cena vazia: `Sun` sozinho, `OrbitRing` com `isDashed`, `GhostPlanet` pulsando, Orbi com luneta
  (`OrbiFigure hasSpyglass` + ação `scout`), mensagem, "Fale com a Main" e "Cadastrar o primeiro
  projeto" só após `getClaims()` no navegador (a página continua estática).
- `EmptyOrbitIllustration` (tokens semânticos, funciona nos dois temas) no painel vazio
  (`EmptyProjectList`) e na cena vazia sem WebGL; `FirstProjectLink` compartilhado.
- `ShowcaseProject` ganhou `published`; o tipo `DashboardProject` deixou de existir.
- Verificado no navegador em 1440 e 390 px: cena vazia (rota temporária, removida), vitrine com o
  projeto publicado, página do projeto, login e ilustração clara e escura.
- Não verificado: o caminho sem WebGL na prática e o botão de cadastro com sessão real.
- Em desenvolvimento, a cena leva alguns segundos para aparecer (geração de texturas).

## Céu contínuo, navegação do painel, retorno após salvar e sugestão de planeta (concluída)

- **Céu em todas as seções, um só WebGL.** Escolhi a abordagem mais simples que cumpre a regra: a
  página continua com um único canvas, que agora é uma camada fixa em tela cheia atrás de todo o
  conteúdo (`z-index: -1`, `pointer-events: none`, `aria-hidden`), sempre renderizando, e nunca é
  recriado ao rolar. A cena (planetas ou sistema vazio) fica num grupo que só aparece enquanto a
  própria seção está na tela; depois disso fica só o céu, com paralaxe leve ligada à rolagem
  (`SpaceBackground`). `View` do drei não foi necessário porque não há duas cenas ao mesmo tempo.
  O `CssStarfield` virou a base fixa do layout público e do login: cobre o carregamento e o caso
  sem WebGL. Fundos opacos removidos; "Sobre" e rodapé usam `bg-surface` translúcido com desfoque.
- `ButtonLink` (`components/ui`) substitui todos os links com visual de botão.
- Painel: "Voltar ao site" (`/#sobre`) no cabeçalho de todas as telas e "Voltar ao painel" em criar e
  editar, via `GuardedLink` + `UnsavedChangesProvider`, que pede confirmação num `Dialog` quando o
  formulário tem alterações. O "Sobre" já tinha `id="sobre"` e `scroll-mt-24`.
- Salvar (rascunho ou publicação, ao criar ou editar) revalida o painel e as páginas públicas e
  redireciona para `/dashboard?aviso=...`; `SavedNotice` mostra o `Toast` e limpa a URL. Erros
  mantêm o formulário preenchido; cada botão mostra o próprio carregamento e ambos ficam
  desabilitados enquanto salva.
- `lib/planet-suggestion.ts`: paleta por harmonia em HSL com tendências por textura numa tabela,
  contraste 4,5:1 garantido ajustando a luminosidade, anel em parte das sugestões, semente opcional
  e sem repetir a textura anterior; 300 sementes testadas. Novas funções `hslToHex` e `hexToHsl` em
  `lib/color.ts`, testadas.
- "Sugerir planeta" e "Desfazer sugestão" na seção Paleta, com anúncio em `aria-live`; projeto novo
  já abre com uma sugestão (gerada no servidor, depois de `connection()`).
- Corrigido: miniaturas dos cartões de "Todos os projetos" esticavam até a largura do cartão.
- Verificado no navegador (rotas temporárias, removidas): céu contínuo com projetos e vazio, 1440 e
  390 px, âncora `/#sobre` com o título visível, sugestão, desfazer e o diálogo de descarte.
- Não verificado com sessão real: o redirecionamento após salvar e o aviso na lista.
