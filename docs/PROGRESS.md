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

## Transições, bugs da órbita, carrossel, publicação completa, enquadramento e carregamento (concluída)

- **Bugs 2 e 3 (mesma causa):** a interface da órbita fica no palco `sticky` e aparecia sempre que
  um pedaço dele estava na tela, enquanto a cena só aparecia com o fim da seção abaixo de 60% da
  altura. Chegando por `#todos`/`#sobre` e voltando pela rolagem, o controle de órbitas era a
  primeira coisa a entrar na tela; o clique iniciava a viagem fora da tela e travava a rolagem.
  Agora há uma única fonte de verdade (`isOrbitActive`, IntersectionObserver) para a cena e toda a
  interface, que fica `inert` e esmaecida quando inativa, e a viagem encaixa a parada atual na
  tela antes de travar a rolagem. Testes em `e2e/orbit-navigation.spec.ts`.
- **Playwright:** `npm run test:e2e` roda contra um build de produção (`E2E_BASE_URL` aponta para
  um servidor já aberto). Fica fora do CI porque precisa de projetos publicados no banco (cenário
  `duas-orbitas` ou `misto` da branch `test-data`).
- **Transições:** câmera com amortecimento exponencial (`damp` em `lib/motion.ts`, testado),
  viagem com curva quíntica e campo de visão e linhas de velocidade seguindo a velocidade do
  foguete, recuo da câmera e escurecimento da cena ao sair da seção, esmaecimentos na ficha, avisos
  e seções de baixo. Constantes em `MOTION` e `fadeClasses`.
- **Carrossel:** `components/ui/Carousel` (scroll-snap, botões, "1 a 4 de 15", setas do teclado,
  rótulos para leitor de tela) em "Todos os projetos" e no painel (Publicados e Rascunhos). O
  `ProjectCard` ganhou o espaço de ações do painel; reordenar troca com o vizinho do mesmo grupo.
- **Publicação completa:** `projectDraftSchema` e `projectPublishSchema` derivados da mesma base,
  usados no navegador e nas Server Actions. Limites: nome 40, resumo 160, descrição 1200, título
  de funcionalidade 60, descrição de funcionalidade 200 (os textos atuais cabem e o layout da ficha
  e da página comporta esses tamanhos). A migração `20261121000000` passou para rascunho os
  projetos publicados incompletos `sss`, `ssss`, `teste` e `teste-1`, e o banco agora recusa
  publicados sem cliente, resumo, descrição, tecnologias ou desenvolvedores. Funcionalidades
  (mínimo 3) e telas (mínimo 1) são conferidas na Server Action, inclusive ao publicar pela lista.
  O formulário lista o que falta com links para cada campo e mostra contadores de caracteres. A
  página do projeto tem estrutura fixa; projeto publicado incompleto registra o erro e mostra a
  página de erro, e o build só pré-renderiza os completos.
- **Enquadramento:** `lib/planet-framing.ts` (testado) calcula a distância pela esfera que envolve
  planeta e anel, campo de visão e proporção do quadro; usado no palco compartilhado.
- **Carregamento:** `ProgressBar` (topo e em linha), barra global em toda navegação interna,
  `WaitingScreen` nos `loading.tsx` com o Orbi segurando a placa (pose `sign`), que aparece por
  CSS após 700 ms e fica pelo menos 400 ms (`WaitingLinger`).
- Pendente: os projetos de teste antigos ficaram incompletos para as regras novas; rode de novo o
  cenário na `test-data` (o seed foi atualizado).

## Chat de dúvidas com o Orbi (concluída)

- **Dados:** perguntas, respostas e avisos de redirecionamento em `features/assistant/faq.ts`
  (respostas ainda em [colchetes], esperando os textos da Main). O reducer puro
  `features/assistant/conversation.ts` cuida do histórico, da pergunta em espera, das perguntas
  disponíveis, do redirecionamento em andamento, do bloqueio de cliques repetidos e do recomeço;
  o estado salvo no `sessionStorage` é validado com zod. Testes em `conversation.test.ts`.
- **Chat:** o "?" virou botão (`aria-expanded`/`aria-controls`) que carrega o painel
  (`components/assistant/`) por import dinâmico na primeira abertura. Diálogo não modal "Converse
  com o Orbi", foco na primeira pergunta ao abrir e de volta no "?" ao fechar (X, Esc ou o próprio
  "?"), histórico `aria-live`, indicador "Orbi está digitando" com tempo proporcional à resposta
  (até 1 s). Tempos em `CHAT_TIMING` (`lib/motion.ts`).
- **Contato:** "Escrever e-mail" (mailto com assunto e corpo, `contactMailto` aceita corpo),
  e-mail visível e "Copiar e-mail" com o Toast "E-mail copiado"; o `ToastProvider` passou a
  envolver o site público.
- **Redirecionamento:** aviso do Orbi com piscadela (pose `wink`, no avatar e no Orbi do canto) e
  navegação após 800 ms (300 ms sem animação). Âncoras da home fecham o chat, rolam até a seção e
  focam o título; outras páginas usam o próprio link (barra de carregamento) com o chat aberto.
  Clique do meio e com Ctrl/Cmd/Shift seguem o link direto.
- **Orbi:** com o chat aberto para de brincar, fica na pose `talking` olhando para o painel e
  aponta (`pointing`) quando a resposta chega.
- **Correção:** vindo de outra página, links para `/#todos` e `/#sobre` (inclusive os do
  cabeçalho) não rolavam até a seção, porque o Next rolava ainda na tela de carregamento.
  `ScrollToHashOnArrival` rola quando o conteúdo da home monta.
- **Testes:** `e2e/orbi-chat.spec.ts` (pergunta, resposta, aviso único com clique duplo, chegada e
  foco em "Todos os projetos"; contato e Esc devolvendo o foco ao "?"). Conferido no navegador em
  1440 e 390 px (folha de baixo no celular) e com animações reduzidas.
- Próximo: textos reais das respostas do chat, de "Sobre a Main" e de contato.

## Chat no lugar do Orbi e menu de celular (concluída)

- **Chat:** enquanto o chat está aberto, o "?" e o Orbi grande saem do canto (200 ms,
  `CHAT_TIMING.cornerSwapMs`) e ficam `inert` e `aria-hidden`; o painel ocupa o canto. O cabeçalho
  do painel tem um Orbi pequeno que conversa (`talking`), aponta quando a resposta chega
  (`pointing`) e pisca nos redirecionamentos (`wink`), o mesmo `OrbiFigure` do canto e dos
  avatares. O X se chama "Fechar conversa"; ao fechar, o foco volta ao "?" depois que ele
  reaparece. Redirecionamentos para âncoras da home fecham o chat, trazem o Orbi de volta e focam o
  título da seção.
- **Menu de celular:** `MobileMenu` (botão de três linhas que vira X, "Abrir menu"/"Fechar menu")
  abre o `Dialog` na nova variante `sheet` (painel lateral modal, entra pela direita, sem animação
  no modo reduzido). Qualquer diálogo modal aberto trava a rolagem da página (`dialog.css`). Os
  itens de cada cabeçalho estão numa lista de dados renderizada na barra e no menu
  (`SiteHeaderItems`, `DashboardHeaderItems`); o cabeçalho público ganhou o link "Contato"
  (`/#contato`). Ponto de quebra no token `--breakpoint-nav` (64rem): em 768 px os itens do site
  não cabem lado a lado quando "Ativar animações" aparece, então tablets também usam o menu.
- **Menu e chat:** `useOverlay` guarda qual sobreposição está aberta; abrir uma fecha a outra.
- **Testes:** `e2e/orbi-chat.spec.ts` (canto escondido e de volta, X, Esc, redirecionamento) e
  `e2e/mobile-menu.spec.ts` (390 px: todas as opções, foco, link para seção, Esc, menu fecha o
  chat). O menu do painel foi conferido numa rota temporária, sem sessão real.

## Acessibilidade, movimento reduzido, login e VLibras (concluída)

### Auditoria (WCAG 2.2 AA)

Encontrado e corrigido:

- **Contraste:** a área pública é sempre escura, mas o fundo do `<body>` seguia o tema guardado; com
  o tema claro, o texto claro ficava sobre fundo claro. O layout público ganhou fundo escuro
  próprio (`isolate bg-space-950`).
- **Lista do carrossel:** os `li` tinham `role="group"`, o que quebrava a lista; o papel passou para
  um `div` interno.
- **Estrutura:** link "Pular para o conteúdo" em todas as páginas; `MainContent` (o `main` de cada
  página, focável) recebe o foco ao trocar de rota (o Next já anuncia o título da página nova).
- **Foco escondido (2.4.11):** `scroll-padding` no `html` para o foco não parar atrás do cabeçalho
  ou dos controles de baixo. Voltando com Shift+Tab para a órbita, a página rola até a parada
  atual. O `<dialog>` modal prende o Tab dentro dele. O Orbi do canto para de brincar por 15 s quando a pessoa usa o Tab, para não voar por
  cima do foco.
- **Órbita pelo teclado:** setas, Home e End na trilha trocam de planeta; anúncio curto do planeta
  em destaque em vez da ficha inteira; "N projetos encontrados" nos filtros.
- **Formulários:** campos marcados como "obrigatório" ou "obrigatório para publicar" (visível e
  lido); contador de caracteres descrito no campo e anunciado só ao atingir o limite.
- **Alto contraste:** botões com borda transparente, que o `forced-colors` desenha.

Testes novos: `accessibility.spec.ts` (axe em home, projeto, login, lista e formulário do painel,
nos dois temas, nos dois modos de movimento, em 390 e 1440 px, e reflow em 320 px),
`keyboard.spec.ts`, `reduced-motion.spec.ts` e `vlibras.spec.ts`.

Limitações conhecidas: os testes do painel só rodam com `E2E_USER_EMAIL`/`E2E_USER_PASSWORD` (não
foram rodados aqui, sem sessão no Supabase); a home vazia só é verificada depois do `reset` da
`test-data`; texto ampliado em 200%, NVDA e VoiceOver estão no roteiro manual de
`docs/ACCESSIBILITY.md`.

### Movimento reduzido

- Tokens `--duration-reduced` (200 ms) e `--ease-reduced`; a regra central em `globals.css` limita
  as transições a opacidade e cor, então nada desliza ou cresce, mas tudo esmaece.
- Câmera e troca de órbita: véu escuro (`reduced-journey.ts`, testado) que escurece, troca a câmera
  no escuro e clareia; sem foguete; aviso "Chegando à órbita N". A ficha troca com esmaecimento.
- Chat, menu, diálogos, toasts, Orbi do canto e tela de espera abrem e fecham esmaecendo; a barra
  de carregamento avança em etapas.

### Login

- "Voltar ao site" com seta acima do cartão e o logo como link para a home.

### VLibras

- `components/accessibility/VLibras.tsx` no layout público e no login, script `lazyOnload`,
  inicialização única com `position: 'L'` (documentação v7), escondido no painel. O botão fica no
  meio do cabeçalho em telas estreitas e abaixo dele à esquerda a partir de 1024 px. Sem CSP no
  projeto hoje; os domínios necessários estão em `docs/ACCESSIBILITY.md`.

Próximo: textos reais do chat, de "Sobre a Main" e de contato; rodar os testes do painel com um
usuário de teste.
