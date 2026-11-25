# Prompt — Landing page da Krislei Decorações

> **Como usar:** abra o Claude Code na **raiz deste repositório** (as fotos e os vídeos já estão em `assets/`) e cole tudo o que está entre `=== INÍCIO DO PROMPT ===` e `=== FIM DO PROMPT ===`.
> Antes de publicar, preencha `js/config.js` (número do WhatsApp, cidade, Instagram — veja a seção 3).

=== INÍCIO DO PROMPT ===

## 1. Missão

Você é um(a) designer + desenvolvedor(a) front-end sênior, especialista em landing pages de alta conversão com animação 3D e parallax. Construa **a landing page da Krislei Decorações**, uma microempresa de **aluguel de decorações para festas** (aniversários, chá de bebê, 15 anos e outras comemorações).

**Objetivo único da página:** fazer a pessoa **chamar a Krislei no WhatsApp** para reservar a decoração da festa dela. Tudo (design, animação, copy, ordem das seções) serve a esse objetivo.

**Público:** mães, pais, avós e madrinhas que organizam festas; chegam principalmente pelo **celular** (Instagram e WhatsApp). Pense *mobile-first*: 70%+ do tráfego será mobile.

**Sensação desejada:** encantamento, carinho, "uau, quero isso na minha festa" — mas com cara de profissional confiável. Feminino sem ser infantilizado; luxo acessível; muito colorido e luminoso.

Trabalhe de forma autônoma: tome decisões, não me faça perguntas no meio do caminho. O que não for possível saber (número, preços, cidade…) fica **configurável** e **sinalizado** — nunca inventado (veja seção 12).

---

## 2. Contexto da cliente (use como base da copy)

A cliente é a Krislei (nome a confirmar — veja seção 3). Esta é a história dela, **a ser usada integralmente na seção "Nossa história"** (mantenha as palavras; só ajuste a formatação; troque os emojis por ornamentos em SVG; assine como "— Krislei"):

> **Tudo começou com uma festa de aniversário... e se transformou em uma paixão!**
>
> Minha história no mundo da decoração começou de uma maneira muito especial: no aniversário de 12 anos da minha filha. Na época, aluguei um pegue e monte e resolvi eu mesma decorar a festa.
>
> O que eu não imaginava era que, naquele dia, descobriria algo que faria meus olhos brilharem!
>
> Enquanto preparava cada detalhe, fui me apaixonando por aquele universo. Olhei para tudo e pensei: **"Eu gosto disso! É isso que eu quero fazer!"**
>
> Foi então que comecei a decorar as festas dos familiares, colocando carinho, dedicação e amor em cada montagem. Aos poucos, fui aprendendo, criando, evoluindo e acreditando cada vez mais no meu potencial.
>
> E o que começou com uma simples decoração para comemorar os 12 anos da minha filha foi tomando proporções muito maiores do que eu poderia imaginar.
>
> Hoje, olho para trás e vejo o quanto fui além daquele primeiro passo. Aquela paixão que nasceu em uma festa se transformou em um sonho, em um trabalho e em uma realização!
>
> **Porque, às vezes, os maiores sonhos começam de uma maneira simples, dentro da nossa própria casa.**
>
> E essa é apenas uma parte da minha história... Que venham muitos cenários, muitas festas e muitos sonhos para realizar!

**Tom de voz da marca:** acolhedor, em primeira pessoa quando for a Krislei falando, simples, caloroso, sem jargão. Frases curtas. Verbos de ação ("Chame", "Escolha", "Reserve").

---

## 3. Dados que ainda faltam (centralize em `js/config.js`)

Crie **um único arquivo de configuração** (`js/config.js`, exportando um objeto congelado) que alimenta a página inteira. Use estes valores-padrão e **sinalize os placeholders** (veja "regra do placeholder" abaixo):

| Chave | Valor padrão | Observação |
|---|---|---|
| `marca` | `"Krislei Decorações"` | **confirmar** nome comercial exato |
| `donaNome` | `"Krislei"` | **confirmar** grafia |
| `whatsapp` | `"55XXXXXXXXXXX"` | **OBRIGATÓRIO preencher**: só dígitos, com 55 + DDD + número |
| `whatsappExibicao` | `"(XX) XXXXX-XXXX"` | como aparece na tela |
| `instagram` | `""` | se vazio, **não renderize** o link |
| `cidade` / `regiaoAtendida` | `""` | se vazio, não renderize e não coloque no SEO |
| `horarioAtendimento` | `""` | se vazio, não renderize |
| `servicos.entrega` / `servicos.montagem` / `servicos.retirada` | `null` | `null` = "a confirmar": a seção "Como funciona" usa texto neutro |
| `pecas[]` | lista da seção 8.5, cada uma com `ativo: true/false` | a cliente liga/desliga o que realmente aluga |
| `secoes.pistaLed` | `true` | **confirmar** se a pista de LED faz parte do que ela aluga; se `false`, esconda a seção inteira |
| `ocasioes[]` | Aniversário infantil, Aniversário adulto, Chá de bebê, Chá revelação, 15 anos, Batizado, Outra | **confirmar** quais ela atende |

**Regra do placeholder:** se `whatsapp` ainda contiver `XXXX`, a página deve (a) funcionar normalmente, (b) mostrar uma **faixa vermelha fixa só em `localhost`**: "Preencha o WhatsApp em js/config.js", e (c) dar `console.warn`. Em produção a faixa nunca aparece.

---

## 4. Conteúdo disponível (já está em `assets/` — **use tudo**, e só isso)

**Não use imagens de banco/stock nem IA.** Use **apenas** as fotos e vídeos reais da cliente. **Abra e olhe cada arquivo** antes de decidir onde ele entra.

### 4.1 Fotos (`assets/fotos/`)

| Arquivo | Tamanho | O que mostra | Uso sugerido |
|---|---|---|---|
| `01-jardim-encantado-1-aninho.jpeg` | 644×659 | **Jardim Encantado**, 1 aninho: painel redondo ilustrado (casinha de passarinho, borboletas), arco de balões rosa/lilás/verde-água/amarelo, neon "1", cilindros brancos com doces, casinha de passarinho em MDF | card do tema Jardim. **Baixa resolução**: nunca exibir acima de ~420px de largura |
| `02-azul-marinho-dourado-happy-birthday.jpeg` | 738×883 | **Azul-marinho e dourado**: painel arco marinho com letreiro dourado "Happy Birthday", arco de balões dourado cromado/branco/marinho, cilindros marinho e brancos ripados, vasos dourados, tapete preto | card do tema Marinho & Dourado; arco lateral do hero |
| `03-cerejeira-borboletas-rosa-lilas.jpeg` | 982×809 | **Cerejeira em flor**: painel redondo de cerejeira, painel rosa com letreiro dourado, cilindro lilás texturizado, **borboletas vazadas em MDF**, arco de balões rosa/lilás/roxo/bolhas transparentes, tapete peludo rosa | card do tema Cerejeira & Borboletas; arco lateral do hero |
| `04-margaridas-rosa-amarelo-neon-1.jpeg` | 1080×1075 | **Margaridas**: arco escalonado rosa, painel redondo de margaridas, neon "1" rosa, balões pastéis (amarelo/rosa), cilindros ripados/amarelo/rosa, margaridas gigantes em MDF, estantes laterais, bolo | **foto-herói** (cores vivas, boa resolução) e card do tema Margaridas |
| `05-preto-branco-gravata-borboleta.jpeg` | 960×1280 | **Preto e branco "gravatinha"**: painel arco claro com gravata-borboleta preta, painel preto, arco de balões preto/branco/espelhado, cilindros pretos e listrados, estantes-escada com lembrancinhas | card do tema Preto & Branco; seção de peças (estantes) |
| `06-azul-marinho-dourado-mesa-de-doces.jpeg` | 1026×1129 | Marinho e dourado com **mesa de doces** em suportes dourados, balões dourado/marinho/bolha | seção de peças (suportes e cilindros) |
| `07-mini-table-passarinhos-bambole-dourado.jpeg` | 1094×1437 | **Mini table / festa pequena**: bambolê dourado com balões pastéis, bancada branca ripada, casinha de passarinho, passarinhos de MDF no chão, borboleta lilás, bolo rosa, flores. Fundo claro | seção "Mini table" / "festa pequena"; excelente para recorte vertical |
| `08-salao-15-anos-pista-led.jpeg` | 899×1599 | **Salão de 15 anos**: pista de LED estrelada em primeiro plano, bolhas transparentes no teto, cenário azul/prata ao fundo, cortina de luzes | seção Pista de LED. **Há pessoas ao fundo** (de costas/perfil): não ampliar nem recortar nelas; foque no piso e no teto |
| `09-15-anos-azul-prata-neon.jpeg` | 1200×1600 | **15 anos azul e prata**: painel arco com ilustração de debutante, arco de balões marinho/prata cromado, neon "15", cilindros marinho e ripados, estante de lembrancinhas, cortina de luzes | **melhor resolução**: arco central do hero alternativo e card do tema 15 Anos |
| `10-15-anos-azul-prata-vertical.jpeg` | 960×1280 | Mesma montagem de 15 anos, enquadramento frontal | galeria / peças (neon, estante) |

### 4.2 Vídeos (`assets/videos/`)

- `video-01.mp4` (~7,4 MB) e `video-02.mp4` (~4,1 MB), gravados no mesmo dia das fotos.
- **Conferidos depois da criação do prompt:** ambos são **verticais** e têm ~35 s. O `video-01` (480×854) mostra o cenário **Preto & Branco** com gravata-borboleta (póster: foto `05`). O `video-02` (464×832) mostra o **neon “15”** sobre o tapete preto (póster: foto `09`). Ainda vale conferir o áudio.
- Use-os na seção "Veja ao vivo" (seção 8.7), em molduras de celular.

### 4.3 Identidade visual

Não há logotipo. Crie um **logotipo tipográfico provisório** em SVG: "Krislei" em fonte script + "decorações" em caixa-alta espaçada + um pequeno ícone de arco/balão. Deixe o arquivo em `assets/logo/` e a referência em um só lugar para troca fácil quando a cliente enviar o logo oficial.

---

## 5. Direção de arte

### 5.1 Conceito: **"as peças dela viram a linguagem da página"**
A identidade visual nasce dos produtos da Krislei. Três formas sagradas, repetidas em toda a página:

1. **O arco** (o painel arqueado): é a *moldura padrão das fotos* (`border-radius: 999px 999px 0 0`/`clip-path`). Use também como separador de seção, como máscara e como ícone.
2. **O círculo** (painel redondo): para selos, avatares, botões flutuantes, bolhas de destaque.
3. **O cilindro** (mesa/cilindro de doces): barras de progresso, degraus do passo a passo, pedestais para itens 3D.

Complementos: **balões orgânicos** (blobs com brilho), **borboletas, margaridas e passarinhos** em SVG simples (formas de MDF recortado), **neon** (números "1" e "15" em tubo luminoso) e **luzes de cortina** (pontinhos de luz).

### 5.2 Paleta (extraída das fotos)
Defina como tokens em `:root` (`--cor-...`) e **troque dinamicamente por tema** (seção 8.3):

| Tema | Fundo | Destaque 1 | Destaque 2 | Destaque 3 |
|---|---|---|---|---|
| **Padrão / Algodão-doce** | `#FFF7F1` creme | `#F29CB7` rosa | `#B9A3E3` lilás | `#9ADBC9` verde-água |
| Jardim Encantado | `#FFF8F2` | `#F6A6BF` | `#9ADBC9` | `#F8E58C` |
| Margaridas | `#FFFBEF` | `#F7B6C8` | `#F8D94A` | `#FFFFFF` |
| Cerejeira & Borboletas | `#FFF3F8` | `#E58AB3` | `#9B6FD1` | `#F4C7DA` |
| Marinho & Dourado | `#0E1B3D` (escuro) | `#D4AF37` | `#1F3A7A` | `#F5EFE0` |
| Preto & Branco | `#101010` (escuro) | `#FFFFFF` | `#C9C9C9` | `#D4AF37` |
| 15 Anos Azul & Prata | `#0B1B4D` (escuro) | `#C0C7D1` | `#2F55D4` | `#FFFFFF` |

Texto: `#2B2230` sobre fundos claros, `#FFF` sobre escuros. **Contraste AA obrigatório** (≥ 4.5:1 para texto; ≥ 3:1 para texto grande). Sobre fotos, use *scrim* em gradiente.

### 5.3 Tipografia (Google Fonts, `display=swap`, com `preconnect`)
- **Títulos:** `Fraunces` (serifada suave, 600–700) — elegância e aconchego.
- **Acentos manuscritos** (1–3 palavras por título, ex.: "sonho"): `Pinyon Script` ou `Dancing Script`.
- **Corpo/UI:** `Nunito` (400/600/800).
- Escala fluida com `clamp()`: H1 `clamp(2.4rem, 7vw, 5.5rem)`; corpo 17–18px no mobile.

### 5.4 Textura e profundidade
- Fundo com **grão sutil** (SVG noise, opacidade 4–6%) e **blobs borrados** em movimento lento (2–3 por seção).
- Sombras suaves coloridas (não cinza); cantos bem arredondados; brilhos "glossy" nos balões e botões.
- Ritmo de seções alternando claro ↔ escuro (a seção de 15 anos/pista de LED e a de história podem ser as escuras).

---

## 6. Arquitetura técnica

**Sem build, sem framework** (publicável direto no GitHub Pages):

```
index.html
css/        tokens.css · base.css · componentes.css · secoes.css
js/         config.js · main.js · whatsapp.js · temas.js · hero-baloes.js
            estudio3d.js · assistente.js · animacoes.js · video.js
assets/     fotos/ · videos/ · logo/ · otimizado/   (já existem fotos/ e videos/)
tools/      otimizar-midia.mjs   (gera WebP/AVIF e póster)
tests/      whatsapp.test.mjs
README.md
```

- **ES Modules** + `importmap` com versões **fixas** via `cdn.jsdelivr.net`: `three@0.160.0` (e `three/addons/`), `gsap@3.12.5` (+ `ScrollTrigger`), `lenis@1.1.13` (scroll suave). Nenhuma outra dependência de runtime.
- **Caminhos relativos** em todo o site (ele será servido em `…github.io/Krislei_decoracoes/`, não na raiz).
- Cada arquivo **< 800 linhas**, funções pequenas (< 50 linhas), **sem mutação desnecessária**, sem `console.log` esquecido, erros tratados (`try/catch` em tudo que toca `localStorage`, WebGL e autoplay).
- Para testar localmente use um servidor (`npx serve .` ou `python -m http.server`), pois módulos ES não funcionam em `file://`.
- HTML semântico (`header`, `main`, `section`, `nav`, `footer`), `lang="pt-BR"`, um único `h1`.

---

## 7. REGRA INEGOCIÁVEL — o número do WhatsApp **sempre** na tela

Em **qualquer posição de scroll, em qualquer tela (mobile e desktop), o número e um botão de WhatsApp precisam estar visíveis.** Implemente **todas** as camadas abaixo:

1. **Header fixo** (vidro fosco): à direita, pílula verde-WhatsApp com ícone + **número por extenso** (desktop). No mobile, ícone + "WhatsApp".
2. **Barra inferior fixa no mobile** (≤ 768px): faixa com `Chamar no WhatsApp · (XX) XXXXX-XXXX`, altura ≥ 56px, `padding-bottom: env(safe-area-inset-bottom)`. Adicione `padding-bottom` ao `body` para não cobrir o rodapé.
3. **Botão flutuante (FAB) no desktop** (canto inferior direito): círculo verde com pulso suave a cada ~6s que se **expande mostrando o número** ao passar o mouse e a cada ~15s por 4s.
4. **CTA em cada seção**, sempre com o número visível no próprio botão ou logo abaixo dele.
5. **Link `tel:`** no rodapé e na seção final, além do `wa.me`.
6. O número precisa existir **também no HTML estático** (para quem desativa JS e para SEO); o JS só **reaplica** os valores vindos de `config.js` em todos os elementos `[data-wa-numero]` e `[data-wa-link]`.

**Mensagens pré-preenchidas contextuais** (`https://wa.me/{numero}?text={encodeURIComponent(msg)}`), geradas por uma função **pura** em `js/whatsapp.js` (testável):

- Geral: `Olá, Krislei! Vi o seu site e quero saber mais sobre o aluguel de decorações. 🎈`
- Tema: `Olá, Krislei! Me interessei pelo tema *{tema}* para {ocasião}. Podemos conversar?`
- Data: `Olá, Krislei! Quero saber se você tem disponibilidade no dia *{data}* para {ocasião} (cerca de {convidados} convidados).`
- Assistente (seção 8.6): resumo completo — ocasião, tema/cores, peças marcadas, data, convidados.
- Vídeo/Pista de LED: `Olá, Krislei! Vi a *pista de LED* no seu site e quero um orçamento.`

Cada link recebe `data-wa-origem="hero|header|barra|fab|tema-jardim|assistente|…"` e dispara um evento `CustomEvent('wa:click')` (e `window.dataLayer.push` se existir) — para mensurar de onde vêm os cliques. `target="_blank" rel="noopener"`, `aria-label` com o número.

---

## 8. Estrutura da página (ordem, conteúdo e comportamento)

### 8.0 Preloader (≤ 1,2 s, só na 1ª visita da sessão)
Balão que **enche** (SVG/GSAP) com "Preparando a sua festa…". Pule se `prefers-reduced-motion` ou se a sessão já viu. Nunca atrase o LCP além disso.

### 8.1 Hero (100svh) — **o grande momento**
- **Composição de 3 arcos** escalonados (o central maior), cada um com uma foto real recortada em forma de arco: central = foto `04` (padrão), esquerdo = `02`, direito = `03`. **Cada arco com velocidade de parallax diferente** (profundidade), mais ornamentos SVG (borboleta, margarida, passarinho) flutuando em camadas distintas.
- **Canvas 3D (Three.js)**: uma **guirlanda de balões orgânicos** em 3D emoldurando os arcos — veja seção 9.1.
- **Texto:**
  - Eyebrow: `Aluguel de decorações para festas`
  - **H1:** `Sua festa merece um cenário de sonho.` ("sonho" em fonte manuscrita com sublinhado desenhado por animação)
  - Subtítulo: `Painéis, arcos de balões, cilindros, neon e muito mais — com carinho em cada detalhe, para aniversários, chá de bebê, 15 anos e todas as datas que merecem ser lembradas.`
  - CTA primário: `Chamar no WhatsApp` + número visível no botão. CTA secundário: `Ver cenários ↓`.
  - Faixa de "selos" (somente fatos visíveis nas fotos): `Aniversários · Chá de bebê · 15 anos · Pista de LED` (esta última só se `secoes.pistaLed`).
- Indicador de rolagem em forma de balão subindo.

### 8.2 Faixa de ocasiões (marquee infinito)
`Aniversário infantil ✦ Chá de bebê ✦ 15 anos ✦ Chá revelação ✦ Aniversário adulto ✦ Batizado …` (de `config.ocasioes`), com velocidade que **acelera/inverte conforme o scroll**. Pausa ao `hover`/foco.

### 8.3 "Escolha o clima da sua festa" — seletor de temas (a seção estrela)
- Título: `Escolha o clima da sua festa` · Subtítulo: `Cada tema é um mundo. Toque numa paleta e veja a página — e os balões — mudarem de cor.`
- **Seletor de 6 paletas** (círculos com 3 cores): Jardim Encantado, Margaridas, Cerejeira & Borboletas, Marinho & Dourado, Preto & Branco, 15 Anos Azul & Prata.
- Ao escolher: (a) as **variáveis CSS** do site animam para a nova paleta (GSAP, 0,6s); (b) os **balões 3D do hero recoloram** em transição; (c) a foto do arco central **troca com crossfade**; (d) aparece um cartão do tema com nome, 1 frase e CTA `Quero este tema` (mensagem de tema, seção 7). Persistir a escolha em `localStorage` (com `try/catch`).
- **Galeria dos temas**: no desktop, **seção fixada com rolagem horizontal** (ScrollTrigger `pin` + `scrub`) com um cartão grande por tema; no mobile, **carrossel com *scroll-snap***. Cada cartão: foto em arco com **parallax interno** (a imagem se move dentro da moldura), **inclinação 3D** que segue o mouse/dedo (CSS `perspective` + `rotateX/Y`, brilho especular que acompanha), nome do tema, 3 *chips* de peças vistas na foto e o CTA do tema.
  - Jardim Encantado (`01`) — "Passarinhos, borboletas e muito verde-água."
  - Margaridas (`04`) — "Rosa e amarelo que parecem primavera."
  - Cerejeira & Borboletas (`03`) — "Romântico, em tons de rosa e lilás."
  - Marinho & Dourado (`02`, `06`) — "Elegância clássica para qualquer idade."
  - Preto & Branco (`05`) — "Moderno e cheio de personalidade (a gravatinha!)."
  - 15 Anos Azul & Prata (`09`, `10`) — "Um sonho de debutante, com neon e brilho."
- Bloco extra **"Mini table"** com a foto `07` em destaque (vertical): `Festa pequena, encanto gigante` — "Para comemorar em casa, em pequenos espaços ou em um cantinho especial."

### 8.4 Faixa de impacto (parallax em camadas)
Frase grande atravessando a tela com texto que "revela" por palavra (scrub): `Cada detalhe pensado para o seu momento brilhar.` Entre as palavras, balões e ornamentos SVG em 3 profundidades de parallax. Serve de respiro visual.

### 8.5 "Peças que fazem a diferença" — o que ela aluga
Grade de cartões (cada um com ícone SVG próprio, recorte da foto real via `object-position`/zoom e uma frase curta), de `config.pecas` (somente `ativo: true`). **Lista inicial deduzida das fotos — a cliente confirma e liga/desliga:**

1. Painéis em arco · 2. Painéis redondos (com arte do tema) · 3. Cilindros e mesas de doces · 4. Arcos de balões orgânicos · 5. Neon (números/letras) · 6. Tapetes de pelo · 7. Pista de LED · 8. Balões-bolha transparentes · 9. Estantes-escada e nichos de lembrancinhas · 10. Vasos, topiarias e flores · 11. Letreiros "Happy Birthday" · 12. Suportes e bandejas para doces · 13. Peças temáticas em MDF (borboletas, margaridas, passarinhos, casinhas).

Interação: ao passar o mouse, o cartão levanta em 3D e um "balãozinho" sobe; no mobile, toque expande.

### 8.6 "Monte o seu cenário" — assistente + **estúdio 3D** (o diferencial)
Seção com **duas colunas** (empilhadas no mobile): à esquerda o **palco 3D**, à direita o **assistente em 4 passos**.

**Palco 3D (Three.js, leve):** um cenário montado só com **primitivas** — painel em arco (forma extrudada), painel redondo, 3 cilindros de alturas diferentes, tapete (cilindro achatado), mini guirlanda de esferas e um **número em neon** (sprite com textura de canvas que brilha). Arrastar gira o cenário (rotação limitada, inércia); sem zoom por scroll (não sequestre o scroll da página). **Tudo recolore em tempo real** conforme as escolhas do assistente. Luz de estúdio + `RoomEnvironment` para reflexos glossy.

**Assistente (acessível por teclado, barra de progresso em forma de cilindros empilhando):**
1. **Qual é a ocasião?** — chips de `config.ocasioes`. Se "Aniversário", pergunte a idade/número (alimenta o neon: 1, 15, 30…).
2. **Qual clima?** — as mesmas 6 paletas + "Outro (me conta no WhatsApp)".
3. **Quais peças?** — checkboxes com ícone (de `config.pecas`).
4. **Quando e quantos?** — campo de data (`<input type="date">`, mínimo = hoje) e convidados (slider 10–300).
- **Resumo final** ("Seu cenário"): cartão com foto do tema, chips das escolhas e botão `Enviar pedido pelo WhatsApp` (com o número ao lado). **Sem preços** — a mensagem pede orçamento. Ao enviar, solte **confete** e abra o `wa.me`.
- Persistir rascunho em `localStorage` (com `try/catch`). Validar entradas (data passada, campos vazios) com mensagens amigáveis.

### 8.7 "Veja ao vivo" — vídeos
Os 2 vídeos em **molduras 3D inclinadas** (celular se vertical). `muted`, `loop`, `playsinline`, `preload="none"`; **tocam só quando entram na tela** (IntersectionObserver) e **pausam ao sair**; botão de som e de tela cheia; **nunca** os dois ao mesmo tempo. Póster = foto correspondente. Legenda curta + CTA `Quero uma decoração assim`.

### 8.8 Pista de LED estrelada (renderize só se `secoes.pistaLed`)
Seção **escura** com foto `08` e um **piso 3D em CSS** (`perspective` + `rotateX`, grade de luzinhas piscando em ritmos diferentes) que **se inclina conforme o scroll**; bolhas transparentes flutuando em parallax. Título: `Uma pista que brilha como um céu estrelado.` CTA com mensagem da pista (seção 7).

### 8.9 Nossa história (a história da Krislei, seção 2)
Layout editorial: coluna esquerda **fixa** (sticky) com um arco grande contendo a foto `07` ou `01` (sem afirmar que é a festa da filha) e o título; coluna direita com os parágrafos que **revelam linha por linha** ao rolar. Uma **linha do tempo vertical** (12 anos da filha → festas da família → hoje) preenchendo com o scroll. A frase `"Eu gosto disso! É isso que eu quero fazer!"` ganha **tratamento tipográfico gigante** com marca-texto animado; a frase final (`…dentro da nossa própria casa.`) fecha em destaque. Assinatura "— Krislei" em fonte manuscrita desenhada (stroke-dashoffset). Fundo escuro quente, com luzinhas.

### 8.10 Como funciona (4 passos, em "cilindros" que sobem em sequência)
1. **Chame no WhatsApp** — conte a data e o tipo de festa. 2. **Escolha o tema e as peças** — com a ajuda da Krislei. 3. **Confirme a data** e reserve o seu cenário. 4. **Aproveite a festa** — e receba os elogios. *Use texto neutro para entrega/montagem/retirada enquanto `config.servicos.*` for `null`; quando a cliente confirmar, os passos passam a citar o serviço.*

### 8.11 Perguntas frequentes (acordeão acessível)
Perguntas: `Como reservo a minha data?` · `Posso escolher as cores e o tema?` · `Vocês atendem a minha cidade?` · `Como funciona a entrega e a montagem?` · `Com quanta antecedência devo chamar?` · `Como é feito o orçamento?`
**As respostas NÃO podem inventar regras.** Enquanto a cliente não confirmar, cada resposta termina com `Chame a Krislei no WhatsApp e ela te explica direitinho.` e usa só fatos já conhecidos. Marque no `config.js` (`faq[].confirmado: false`) quais ainda aguardam confirmação.

### 8.12 CTA final (tela cheia)
Fundo com os balões 3D **explodindo em confete** quando a seção entra na tela. Título: `Vamos criar a festa dos seus sonhos?` · Texto: `Chame a Krislei agora e garanta a sua data.` · **Botão gigante** com o número em fonte grande, mais link `tel:`.

### 8.13 Rodapé
Logo, "© {ano} {marca}", número (WhatsApp + `tel:`), Instagram/cidade/horário **somente se preenchidos**, e voltar ao topo (balão que sobe).

---

## 9. Animações, 3D e parallax — especificação

### 9.1 Balões 3D do hero (`js/hero-baloes.js`)
- `InstancedMesh` de **esferas ligeiramente alongadas** (escala Y ≈ 1.12) + um pequeno nó (cone) — **40 balões no desktop, 24 no mobile** (detectar por largura/`hardwareConcurrency`).
- Posições ao longo de uma **curva em arco** (guirlanda orgânica) com variação de tamanho (0,35–1,0) e ruído; ~15% **cromados** (metal: `metalness 1`, `roughness .15`, cores ouro/prata/da paleta), ~10% **bolhas transparentes** (`opacity .25` + reflexo de ambiente — evite `transmission`, é caro) e o resto **foscos/pastéis** (`MeshPhysicalMaterial` com `clearcoat`).
- `RoomEnvironment` + `PMREMGenerator` para reflexos; 1 luz direcional suave.
- **Interações:** flutuação contínua (seno/ruído); **parallax pelo mouse** (e pelo toque/arrasto no mobile; sem giroscópio, para não exigir permissão no iOS); **repulsão** quando o ponteiro passa perto; **clique/toque estoura o balão** (animação de escala + **confete** em `Points`); ao estourar 5, mostrar um *toast* `Gostou? Chame a Krislei 🎈` com o CTA (sem prometer desconto).
- **Scroll:** com `ScrollTrigger` (scrub), a guirlanda se "desenrola" e sobe, e a câmera recua levemente.
- **Recolorir por tema** com interpolação suave (`Color.lerp`).
- **Performance:** `devicePixelRatio` máx. 2 (1,5 no mobile); renderizar **só quando o hero está visível** (IntersectionObserver) e a aba ativa; `antialias` só no desktop; liberar geometrias/materiais ao destruir.
- **Fallback:** sem WebGL, `prefers-reduced-motion` ou dispositivo fraco → mostrar uma **guirlanda em SVG/CSS estática** (blobs coloridos com brilho). A página precisa ficar bonita **sem** o 3D.

### 9.2 Parallax
- **Lenis** para rolagem suave (desativar com `prefers-reduced-motion` e no scroll interno de modais).
- Hero: ≥ 4 camadas (fundo/blobs, arcos laterais, arco central, ornamentos, texto) com velocidades distintas.
- **Imagens com parallax interno** (a foto desliza dentro da moldura em arco).
- **Ornamentos SVG** (borboleta, margarida, passarinho) cruzam as seções com velocidades diferentes e leve rotação.
- Revelações de texto por linha/palavra (sem bibliotecas pagas: divida o texto você mesmo, preservando acessibilidade com `aria-label` no elemento original).

### 9.3 Microinterações
- Botões "glossy" com brilho que atravessa ao `hover`; **balãozinho sobe** nos CTAs.
- **Clique em qualquer lugar solta confete** discreto (limite de partículas).
- Barra de progresso de leitura no topo com um balãozinho que percorre a barra.
- *Cursor magnético* nos CTAs (só em dispositivos com `hover: hover`).

### 9.4 Regras de movimento
- `prefers-reduced-motion: reduce` → desligue parallax, Lenis, marquee, 3D e confete; mantenha só *fades* curtos.
- Nenhuma animação pode ser necessária para entender o conteúdo ou achar o WhatsApp.
- Alvo de **60 fps** em celular médio; se o FPS médio cair abaixo de ~45 por 2 s, reduza automaticamente a quantidade de balões e o DPR.

---

## 10. Mais ideias para converter (já incluídas acima — implemente com capricho)

1. **Assistente + palco 3D** (8.6): a pessoa "monta" a festa e envia o pedido pronto — o maior diferencial da página.
2. **Verificar data** num atalho fixo da seção final e do assistente (mensagem da data).
3. **Seletor de tema que recolore a página inteira** (8.3): faz a pessoa se imaginar na festa.
4. **Estourar balões** (9.1): gamificação leve que prende a atenção no topo.
5. **Linha do tempo emocional** (8.9): vende confiança contando a história real.
6. **Barra do WhatsApp onipresente** (seção 7).
7. *(Opcional, se sobrar tempo)* Modo "Compartilhar com a família": botão que gera o link da página com `?tema=` para mandar no grupo da família.

---

## 11. Performance, acessibilidade, SEO

**Performance (meta: Lighthouse mobile — Performance ≥ 85, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO ≥ 95):**
- `tools/otimizar-midia.mjs` (Node + `sharp`) gera **WebP/AVIF em 3 larguras** (480/960/1440, **sem ampliar** além do tamanho original — algumas fotos têm só ~650–1200px) e usa `<picture>`/`srcset`/`sizes`. Preserve os originais.
- `loading="lazy"` e `decoding="async"` em tudo abaixo da dobra; `fetchpriority="high"` + `preload` apenas na foto do arco central do hero.
- 3D carregado **depois** do primeiro paint (`requestIdleCallback`/`import()` dinâmico); `font-display: swap`.
- Vídeos: `preload="none"`; se `ffmpeg` estiver instalado, gere versões 720p H.264 (CRF ~26) e um **póster**; se não estiver, use os originais.
- Evite *layout shift*: defina `width/height` ou `aspect-ratio` em toda mídia.

**Acessibilidade:** navegação 100% por teclado e foco visível; `alt` descritivo em todas as fotos (ex.: `Painel em arco azul-marinho com letreiro dourado "Happy Birthday", arco de balões dourado e branco e cilindros decorados`); ornamentos com `aria-hidden="true"`; botões com `aria-label`; acordeão e assistente com roles/estados ARIA; alvos de toque ≥ 44px; nada que pisque mais de 3×/s.

**SEO/Compartilhamento:**
- `<title>`: `Krislei Decorações | Aluguel de decorações para festas — aniversário, chá de bebê e 15 anos`
- `meta description` (≤ 155 caracteres) com a proposta + CTA.
- Open Graph/Twitter Card com imagem 1200×630 gerada a partir das fotos `04`/`09` (inclua um script ou instruções para gerar; a URL absoluta entra quando o site for publicado).
- **JSON-LD `LocalBusiness`** montado a partir do `config.js`, **omitindo** qualquer campo vazio (telefone, cidade, Instagram…). Não invente endereço, horário nem avaliações.
- `sitemap.xml` e `robots.txt` simples; favicon (arco/balão) e `theme-color` que muda com o tema.

---

## 12. O que NÃO fazer (regras duras)

- ❌ **Não invente** preços, descontos, promoções, prazos, endereço, cidade, horário, número de festas realizadas, anos de experiência, redes sociais, nem **depoimentos/avaliações**. Se a informação não está neste prompt nem em `config.js`, ela não aparece — ou aparece como "chame no WhatsApp".
- ❌ Sem *lorem ipsum* e sem imagens de banco.
- ❌ Sem emojis na interface (use SVG); emojis só dentro do texto das mensagens do WhatsApp.
- ❌ Não ampliar a foto `01` (644px) nem recortar/dar zoom nas **pessoas** da foto `08`.
- ❌ Não sequestrar o scroll nativo no mobile, não usar *popups* que cubram o botão do WhatsApp, não exigir cadastro/e-mail.
- ❌ Não colocar chaves, tokens ou dados pessoais no repositório.
- ❌ Não habilitar o GitHub Pages nem publicar por conta própria: deixe o passo a passo no README.

---

## 13. Plano de execução e critérios de aceite

**Fases (faça um commit por fase, mensagens no padrão `feat:`/`fix:`/`chore:`):**
1. Estrutura, tokens, tipografia, layout estático **responsivo** de todas as seções com o conteúdo real.
2. Sistema do WhatsApp (seção 7) + `config.js` + testes da função de URL.
3. Hero: arcos com parallax + balões 3D + fallback.
4. Seletor de temas + galeria (pin horizontal / carrossel) + recoloração global.
5. Assistente + palco 3D + resumo para o WhatsApp.
6. Vídeos, Pista de LED, História, Como funciona, FAQ, CTA final, rodapé.
7. Otimização de mídia, SEO, acessibilidade, README, QA final.

**Testes:**
- Testes unitários (Node `node --test`) para as funções puras de `whatsapp.js` e do resumo do assistente (cobertura ≥ 80% nelas): URL correta, escape de acentos/asteriscos/quebras de linha, número vazio, data passada.
- **Smoke E2E** (Playwright ou o navegador integrado): em **375×812, 768×1024 e 1440×900**, rolar até 5 posições (topo, 25%, 50%, 75%, fim) e **confirmar que um botão `wa.me` com o número está visível em todas**; testar o assistente de ponta a ponta (a URL final contém ocasião, tema, peças, data); testar com `prefers-reduced-motion` e com WebGL desativado.

**Critérios de aceite (verifique e relate cada um no fim):**
- [ ] Número + botão do WhatsApp visíveis em todas as posições de scroll, mobile e desktop.
- [ ] Todos os links `wa.me` abrem com a mensagem correta e o número do `config.js`.
- [ ] Hero com ≥ 4 camadas de parallax e balões 3D interativos; fallback estático bonito.
- [ ] Seletor de temas recolore página, balões e foto; escolha persiste.
- [ ] Assistente + palco 3D funcionam e geram o pedido no WhatsApp.
- [ ] As 10 fotos e os 2 vídeos aparecem na página (ou há justificativa clara por escrito para cada exceção).
- [ ] A história da Krislei está completa e fiel ao texto.
- [ ] Sem erros no console; sem rolagem horizontal; sem *layout shift* perceptível.
- [ ] Lighthouse mobile dentro das metas (anexe os números).
- [ ] Nenhuma informação inventada (seção 12).

**Entrega final (relatório curto, em português):** o que foi feito; as notas do Lighthouse; **lista do que ainda precisa ser confirmado com a cliente** (número do WhatsApp, nome exato, cidade, Instagram, se a pista de LED/entrega/montagem/retirada fazem parte do serviço, ocasiões atendidas, lista de peças, respostas do FAQ); e o passo a passo para publicar no GitHub Pages (Settings → Pages → Deploy from branch → `main` / raiz).

=== FIM DO PROMPT ===
