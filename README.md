# Krislei Decorações — landing page

Projeto da landing page de **aluguel de decorações para festas** (aniversário, chá de bebê, 15 anos e mais) da cliente Krislei.

O objetivo da página é um só: **levar a pessoa a chamar a Krislei no WhatsApp**, com o número sempre visível na tela.

## O que tem neste repositório

| Caminho | Conteúdo |
|---|---|
| [`PROMPT-LANDING-PAGE.md`](PROMPT-LANDING-PAGE.md) | **O prompt completo** para o Claude Code construir a página (hero, 3D, parallax, assistente "Monte o seu cenário", WhatsApp onipresente, SEO, testes) |
| `assets/fotos/` | 10 fotos reais das decorações (nomes descritivos, numeradas `01` a `10`) |
| `assets/videos/` | 2 vídeos das decorações (`video-01.mp4`, `video-02.mp4`) |

> Origem das mídias: arquivos enviados pela cliente por WhatsApp (16/11/2026). Os originais mantêm a qualidade em que chegaram: a foto `01` tem só 644 px de largura.

## Como construir a página

1. Abra o Claude Code na raiz deste repositório.
2. Cole o conteúdo entre `=== INÍCIO DO PROMPT ===` e `=== FIM DO PROMPT ===` do arquivo [`PROMPT-LANDING-PAGE.md`](PROMPT-LANDING-PAGE.md).
3. Ao final, preencha o `js/config.js` (veja abaixo) e teste localmente com `npx serve .`.

## O que falta confirmar com a cliente

Nada disso foi inventado: tudo fica em `js/config.js` e a página não mostra o que estiver vazio.

- [ ] **Número do WhatsApp** (obrigatório: com DDD)
- [ ] Nome comercial exato e grafia de "Krislei"
- [ ] Cidade e região atendida
- [ ] Instagram e horário de atendimento
- [ ] A **pista de LED**, a **entrega**, a **montagem** e a **retirada** fazem parte do serviço?
- [ ] Quais ocasiões ela atende e quais peças ela realmente aluga
- [ ] Respostas das perguntas frequentes (prazo, orçamento, antecedência)
- [ ] Logotipo oficial (a página usa um logotipo tipográfico provisório)

## Publicação (GitHub Pages)

Depois que a página estiver pronta e testada: **Settings → Pages → Deploy from branch → `main` / (root)**.
O site fica em `https://carlosserra-a11y.github.io/Krislei_decoracoes/`. Todos os caminhos do site devem ser relativos.
