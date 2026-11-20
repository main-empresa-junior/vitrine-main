# Acessibilidade

O site segue a WCAG 2.2, nível AA, na área pública e no painel. Os testes automáticos
(`npm run test:e2e`) cobrem o axe nas páginas principais, o uso só com teclado, o modo de movimento
reduzido, a largura de 320 px e o VLibras. Eles não substituem o roteiro abaixo, que a equipe repete
antes de cada entrega.

## Roteiro de teste manual

Faça em um navegador de computador e em um celular, com o cenário `misto` da branch `test-data`.

### 1. Só teclado

- [ ] O primeiro Tab mostra "Pular para o conteúdo"; Enter leva ao início do conteúdo.
- [ ] Tab e Shift+Tab percorrem a home inteira na ordem visual, sem o foco sumir ou ficar atrás do
      cabeçalho, do Orbi, do chat, do controle de órbitas ou do botão do VLibras.
- [ ] Na trilha da órbita, as setas, Home e End trocam de planeta; Enter em "Viajar para a órbita 2"
      troca de órbita.
- [ ] O "?" abre o chat com o foco na primeira pergunta; Esc fecha e devolve o foco ao "?".
- [ ] No celular, o menu de três linhas prende o foco enquanto aberto e Esc o fecha.
- [ ] Login e formulário de projeto podem ser preenchidos e enviados sem mouse; ao enviar com erros,
      o foco vai para o resumo do que falta.

### 2. Leitor de tela

NVDA no Windows (Chrome ou Firefox) e VoiceOver no iPhone (Safari).

- [ ] Ao trocar de página, o título da página nova é anunciado.
- [ ] Ao parar num planeta, é anunciado "Em destaque: nome, planeta N de M da órbita X".
- [ ] A chegada a uma órbita, as respostas e os avisos do chat e o resultado dos filtros
      ("6 projetos encontrados") são anunciados uma vez, sem repetir a cada tecla.
- [ ] Campos do formulário leem rótulo, "obrigatório" ou "obrigatório para publicar", limite de
      caracteres e mensagem de erro.
- [ ] Imagens dos projetos têm descrição; ícones decorativos não são lidos.

### 3. Zoom

- [ ] Texto ampliado em 200% (configuração de fonte do navegador): nada some nem se sobrepõe.
- [ ] Zoom de 400% em 1280 px: sem rolagem horizontal, exceto dentro dos carrosséis.

### 4. Alto contraste

- [ ] Windows: Configurações → Acessibilidade → Temas de contraste. Botões, campos, foco e bordas
      continuam visíveis.

### 5. Movimento reduzido

- [ ] Com "Reduzir animações" (ou a preferência do sistema), nada desliza, gira ou fica em laço.
- [ ] Trocar de planeta e de órbita escurece a cena e volta, sem foguete; o chat, o menu, os
      diálogos e os avisos aparecem e somem esmaecendo.

### 6. VLibras

- [ ] O botão do VLibras aparece uma vez nas páginas públicas e no login, e não no painel.
- [ ] Ele não cobre o Orbi, o chat, o controle de órbitas, a trilha nem a ficha do projeto, em
      390 px, 768 px e 1440 px.
- [ ] O botão é alcançável pelo teclado e, ao abrir, o avatar traduz um trecho selecionado.

## VLibras, serviço de terceiros

O VLibras é o tradutor de português para Libras mantido pelo governo federal. O componente
`src/components/accessibility/VLibras.tsx` carrega `https://vlibras.gov.br/app/vlibras-plugin.js`
depois que a página fica ociosa, chama `new VLibras.Widget({ rootPath, position: 'L' })` como diz a
documentação oficial (https://vlibras.gov.br/doc/widget/) e esconde o widget fora da área pública.
O botão é reposicionado por CSS em `vlibras.css`, sem alterar os arquivos do widget.

Ao usar o site, o navegador de quem visita baixa scripts, fontes e o avatar dos servidores do
governo (`vlibras.gov.br` e `cdn.jsdelivr.net`). Se uma política de segurança de conteúdo (CSP) for
criada, libere esses domínios em `script-src`, `frame-src` e `font-src`. Se o serviço estiver fora
do ar, o site funciona normalmente, sem o botão.

## Limitações conhecidas

- A marcação interna do VLibras fica fora da análise do axe, porque não a controlamos. O botão de
  abrir tem nome acessível e é testado à parte.
- O canvas 3D é decorativo e fica oculto para leitores de tela; tudo o que ele mostra existe como
  texto na ficha do projeto, na trilha e em "Todos os projetos".
- Os testes do painel (axe, login e formulário pelo teclado) só rodam com as variáveis
  `E2E_USER_EMAIL` e `E2E_USER_PASSWORD` de um usuário de teste.
