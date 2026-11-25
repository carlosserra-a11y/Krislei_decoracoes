# Krislei Decorações — landing page

Landing page de **aluguel de decorações para festas** (aniversário, chá de bebê, 15 anos e mais) da cliente Krislei.

O objetivo da página é um só: **levar a pessoa a chamar a Krislei no WhatsApp**. O número aparece sempre na tela: no topo, numa barra fixa no celular, num botão flutuante no desktop e em todos os botões de ação.

Site 100% estático (HTML + CSS + JavaScript, **sem build**). Publicável direto no GitHub Pages.

## O que a página tem

- **Hero** com 3 arcos de fotos reais em parallax e uma **guirlanda de balões em 3D** (Three.js): reage ao mouse, muda de cor com o tema, rola junto com a página e **estoura ao clicar** (com confete).
- **"Escolha o clima da festa":** 7 paletas que recolorem a página inteira, os balões e as fotos; galeria dos temas com rolagem horizontal fixada no desktop e carrossel no celular.
- **"Monte o seu cenário":** assistente de 4 passos com um **palco 3D** que muda ao vivo e termina enviando o pedido pronto pelo WhatsApp (ocasião, clima, peças, data, convidados), sem preços.
- Peças que ela aluga, mini table, vídeos verticais em molduras de celular, pista de LED, a história da Krislei, como funciona, dúvidas, verificação de data e chamada final.
- Plano B sem 3D (sem WebGL, sem bibliotecas ou com "reduzir movimento" ativado): guirlanda em CSS e foto no lugar do palco.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | A página |
| `css/` | `tokens.css` (cores e variáveis), `base.css`, `componentes.css`, `secoes.css`, `secoes-2.css` |
| `js/config.js` | **O único arquivo para editar na hora de publicar** (WhatsApp, cidade, Instagram, peças, ocasiões) |
| `js/dados.js` | Temas (paletas) e tamanhos das fotos |
| `js/whatsapp.js` | Mensagens e links do WhatsApp (funções puras, testadas) |
| `js/*.js` | Hero 3D, palco 3D, assistente, vídeos, animações |
| `assets/fotos`, `assets/videos` | Mídias originais da cliente |
| `assets/otimizado` | Fotos em WebP (480 px, 960 px e tamanho original) |
| `assets/logo` | Logotipo **provisório** e favicon |
| `tools/` | Scripts de mídia (`otimizar-midia.mjs`, `gerar-og.mjs`) |
| `tests/` | Testes do módulo do WhatsApp |
| [`PROMPT-LANDING-PAGE.md`](PROMPT-LANDING-PAGE.md) | O prompt usado para criar a página |

## Rodar localmente

Módulos ES não funcionam abrindo o arquivo direto; use um servidor:

```powershell
python -m http.server 5173
```

Depois abra `http://127.0.0.1:5173/`.

## Testes

```powershell
node --test tests/whatsapp.test.mjs
```

## Regerar as imagens

```powershell
cd tools
npm install
node otimizar-midia.mjs
node gerar-og.mjs
```

## O que falta confirmar com a cliente

Nada disso foi inventado: tudo fica em `js/config.js` e a página não mostra o que estiver vazio.

- [ ] **WhatsApp:** o número em uso é **(48) 8869-0917**. Confirmar se é esse mesmo ou se falta o 9 na frente (celular: `48 9 8869-0917`). Para trocar: `whatsapp` e `whatsappExibicao` em `js/config.js` e o mesmo número nos `href`/textos do `index.html` (busque por `554888690917` e `8869-0917`).
- [ ] Nome comercial exato e grafia de "Krislei"
- [ ] Cidade e região atendida, Instagram e horário de atendimento
- [ ] A **pista de LED**, a **entrega**, a **montagem** e a **retirada** fazem parte do serviço? (`secoes.pistaLed` e `servicos.*`)
- [ ] Quais ocasiões ela atende e quais peças ela realmente aluga (`ocasioes` e `pecas`)
- [ ] Respostas das perguntas frequentes (hoje todas mandam chamar no WhatsApp)
- [ ] Logotipo oficial (a página usa um logotipo tipográfico provisório)

## Publicação (GitHub Pages)

**Settings → Pages → Deploy from branch → `main` / (root)**.
O site fica em `https://carlosserra-a11y.github.io/Krislei_decoracoes/`. Todos os caminhos são relativos. Ao mudar CSS, aumente o `?v=` dos links no `index.html` para furar o cache.
