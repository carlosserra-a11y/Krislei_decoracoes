# Krislei Decorações — landing page

Landing page de **aluguel de decorações para festas** (aniversário, chá de bebê, 15 anos e mais) da cliente Krislei.

O objetivo da página é um só: **levar a pessoa a chamar a Krislei no WhatsApp**. O número aparece sempre na tela: no topo, numa barra fixa no celular, num botão flutuante no desktop e nos botões de ação.

Site 100% estático (HTML + CSS + JavaScript, **sem build**). Publicável direto no GitHub Pages.

## O que a página tem

1. **Hero** com 3 arcos de fotos reais, inclinação 3D que segue o mouse, parallax em camadas, selo giratório e uma **guirlanda de balões em 3D** (Three.js) que muda de cor com o tema e **estoura ao clicar**.
2. **Faixas de texto** que aceleram conforme a rolagem.
3. **Portfólio** em grade com filtros (Infantil, 15 anos, Elegantes, Em vídeo), "Ver todos", **visualizador** de fotos e vídeos (setas, teclado e arrastar) com botão "Quero um assim", e 7 paletas que recolorem a página.
4. **Estúdio 3D**: assistente de 4 passos com um cenário detalhado (painéis, letreiro, bolo e doces, balões, neon, vasos, estante, borboletas, pista de LED) que liga e desliga peças ao vivo. **Giro** com arrastar e inércia (360°), balanço automático, botões, zoom, teclado e duplo toque para voltar. O pedido sai pronto pelo WhatsApp (sem preços) e pode ser **mostrado à família**.
5. **História** da Krislei (recolhível), **como funciona + dúvidas** e **chamada final** com verificação de data.

Extras: **fundo animado** com peças flutuando em três profundidades, **balão de conversa** que convida a começar o pedido (uma vez por sessão, depois do topo), anel que segue o mouse e confete.

**Plano B:** sem WebGL, sem as bibliotecas ou com "reduzir movimento" ativado, entram uma guirlanda em CSS e uma foto no lugar do palco 3D.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | A página |
| `css/` | `tokens.css` (cores e variáveis), `base.css`, `componentes.css`, `secoes.css`, `secoes-2.css` |
| `js/config.js` | **O único arquivo para editar na hora de publicar** (WhatsApp, cidade, Instagram, peças, ocasiões) |
| `js/dados.js`, `js/portfolio-dados.js` | Temas (paletas), fotos e itens do portfólio |
| `js/whatsapp.js` | Mensagens e links do WhatsApp (funções puras, testadas) |
| `js/estudio3d.js`, `estudio-modelos.js`, `estudio-texturas.js` | Palco 3D: câmera e giro, peças e texturas desenhadas por código |
| `js/hero-baloes.js` | Balões 3D do hero |
| `js/*.js` | Portfólio, assistente, animações, fundo, balão de conversa |
| `assets/fotos`, `assets/videos` | Mídias originais da cliente |
| `assets/otimizado` | Fotos em WebP (480 px, 960 px e tamanho original) |
| `assets/logo` | Logotipo **provisório** e favicon |
| `tools/` | Scripts de mídia (`otimizar-midia.mjs`, `gerar-og.mjs`) |
| `tests/` | Testes do WhatsApp e do portfólio |
| [`PROMPT-LANDING-PAGE.md`](PROMPT-LANDING-PAGE.md) | O prompt da primeira versão (a página evoluiu depois dele) |

## Rodar localmente

Módulos ES não funcionam abrindo o arquivo direto; use um servidor:

```powershell
python -m http.server 5173
```

Depois abra `http://127.0.0.1:5173/`.

## Testes

```powershell
node --test tests/whatsapp.test.mjs tests/portfolio.test.mjs
```

## Colocar uma foto nova no portfólio

1. Salve em `assets/fotos/` com um prefixo numérico novo (ex.: `11-tema.jpeg`) e rode os comandos abaixo.
2. Cadastre largura, altura e descrição em `js/dados.js` (`FOTOS`) e o item em `js/portfolio-dados.js`.

```powershell
cd tools
npm install
node otimizar-midia.mjs
node gerar-og.mjs
```

## O que falta confirmar com a cliente

Nada disso foi inventado: tudo fica em `js/config.js` e a página não mostra o que estiver vazio.

- [x] **WhatsApp:** **(48) 98869-0917**. Para trocar: `whatsapp` e `whatsappExibicao` em `js/config.js` e o mesmo número no `index.html` (busque por `5548988690917` e `98869-0917`).
- [ ] Nome comercial exato e grafia de "Krislei"
- [ ] Cidade e região atendida, Instagram e horário de atendimento
- [ ] A **pista de LED**, a **entrega**, a **montagem** e a **retirada** fazem parte do serviço? (`secoes.pistaLed` e `servicos.*`)
- [ ] Quais ocasiões ela atende e quais peças ela realmente aluga (`ocasioes` e `pecas`)
- [ ] Respostas das perguntas frequentes
- [ ] Logotipo oficial (a página usa um logotipo tipográfico provisório)

## Publicação (Vercel)

Site no ar: **https://krislei-decoracoes.vercel.app/** (projeto `krislei-decoracoes`).

O projeto **ainda não está ligado ao GitHub**, então um `push` não publica sozinho. Para publicar automaticamente, dê ao app da Vercel acesso a este repositório ([configurações da instalação no GitHub](https://github.com/settings/installations)) e conecte-o em **Vercel → projeto → Settings → Git**.

O `.vercelignore` deixa `tools/`, `tests/` e os arquivos `.md` fora do site. Todos os caminhos são relativos. Ao mudar CSS, aumente o `?v=` dos links no `index.html` para furar o cache.
