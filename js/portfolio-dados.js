// Itens do portfólio (fotos e vídeos reais da cliente) e a regra de filtro. Funções puras: testadas em tests/portfolio.test.mjs.

export const FILTROS = Object.freeze([
  { id: 'todos', nome: 'Todos' },
  { id: 'infantil', nome: 'Infantil' },
  { id: '15anos', nome: '15 anos' },
  { id: 'elegantes', nome: 'Elegantes' },
  { id: 'video', nome: 'Em vídeo' },
]);

/**
 * A ordem define a grade. `forma` só vale na grade completa: grande = 2x2, alto = 1x2.
 * `pos` = foco do recorte da imagem. `secao` liga o item a uma seção opcional de config.js.
 */
export const PORTFOLIO = Object.freeze([
  { id: 'margaridas', tipo: 'foto', foto: '04', titulo: 'Margaridas em rosa e amarelo', legenda: 'Neon “1”, painel redondo florido e margaridas gigantes de MDF.', tema: 'margaridas', tags: ['infantil'], forma: 'grande', pos: '50% 40%' },
  { id: 'quinze-azul', tipo: 'foto', foto: '09', titulo: '15 anos azul e prata', legenda: 'Painel de debutante, neon “15” e arco de balões cromados.', tema: 'quinze', tags: ['15anos'], forma: 'alto', pos: '50% 45%' },
  { id: 'marinho', tipo: 'foto', foto: '02', titulo: 'Marinho e dourado', legenda: 'Painel em arco com letreiro dourado e balões cromados.', tema: 'marinho', tags: ['elegantes'], pos: '40% 30%' },
  { id: 'video-pb', tipo: 'video', video: 'assets/videos/video-01.mp4', foto: '05', titulo: 'Preto & Branco em vídeo', legenda: 'O cenário da gravatinha, com balões espelhados e estantes.', tema: 'pb', tags: ['elegantes', 'video'], forma: 'alto', pos: '50% 50%' },
  { id: 'cerejeira', tipo: 'foto', foto: '03', titulo: 'Cerejeira & Borboletas', legenda: 'Painel de cerejeira, borboletas de MDF e tons de rosa e lilás.', tema: 'cerejeira', tags: ['infantil'], pos: '30% 40%' },
  { id: 'mini', tipo: 'foto', foto: '07', titulo: 'Mini table', legenda: 'Festa pequena, encanto gigante: bambolê dourado e passarinhos de MDF.', tema: 'padrao', tags: ['infantil'], pos: '50% 35%' },
  { id: 'led', tipo: 'foto', foto: '08', titulo: 'Pista de LED estrelada', legenda: 'Piso iluminado, balões transparentes no teto e cortina de luzes.', tema: 'quinze', tags: ['15anos'], secao: 'pistaLed', pos: '50% 70%' },
  { id: 'marinho-doces', tipo: 'foto', foto: '06', titulo: 'Marinho e dourado com doces', legenda: 'Cilindros decorados e suportes dourados para a mesa de doces.', tema: 'marinho', tags: ['elegantes'], pos: '50% 60%' },
  { id: 'jardim', tipo: 'foto', foto: '01', titulo: 'Jardim Encantado', legenda: 'Passarinhos, borboletas e muito verde-água em 1 aninho.', tema: 'jardim', tags: ['infantil'], pos: '50% 40%' },
  { id: 'video-15', tipo: 'video', video: 'assets/videos/video-02.mp4', foto: '10', titulo: 'Neon “15” em vídeo', legenda: 'O neon brilhando sobre o tapete preto.', tema: 'quinze', tags: ['15anos', 'video'], pos: '50% 55%' },
]);

/** Quantos itens aparecem antes do "Ver todos" (grade de 4 colunas no desktop / 2 no celular). */
export const VISIVEIS_DESKTOP = 7;
export const VISIVEIS_CELULAR = 6;

/** Devolve os itens do filtro, sem os de seções desligadas em config.js. */
export function filtrar(itens, filtro = 'todos', secoes = {}) {
  const ativos = itens.filter((item) => !item.secao || secoes[item.secao] !== false);
  if (filtro === 'todos') return ativos;
  return ativos.filter((item) => item.tags.includes(filtro));
}

export function itemPorId(itens, id) {
  return itens.find((item) => item.id === id) ?? null;
}

/** Vizinho (circular) dentro de uma lista já filtrada. */
export function vizinho(lista, idAtual, passo) {
  if (!lista.length) return null;
  const indice = lista.findIndex((item) => item.id === idAtual);
  const base = indice === -1 ? 0 : indice;
  return lista[(base + passo + lista.length) % lista.length];
}
