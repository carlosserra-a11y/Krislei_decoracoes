// Dados de design: fotos reais da cliente e temas (paletas). Não precisa editar.

/** Fotos: largura original (as versões otimizadas nunca passam dela), proporção e texto alternativo. */
export const FOTOS = Object.freeze({
  '01': { w: 644, h: 659, alt: 'Tema Jardim Encantado de 1 aninho: painel redondo com passarinhos e borboletas, arco de balões rosa, lilás e verde-água, neon “1” e cilindros brancos com doces' },
  '02': { w: 738, h: 883, alt: 'Painel em arco azul-marinho com letreiro dourado “Happy Birthday”, arco de balões dourado e branco, cilindros marinho e ripados e vasos dourados' },
  '03': { w: 982, h: 809, alt: 'Cenário Cerejeira e Borboletas: painel redondo de cerejeira em flor, cilindros rosa e lilás, borboletas de MDF e arco de balões rosa e roxo' },
  '04': { w: 1080, h: 1075, alt: 'Cenário de margaridas em rosa e amarelo com neon “1”, painel redondo florido, margaridas gigantes de MDF e arco de balões pastel' },
  '05': { w: 960, h: 1280, alt: 'Cenário preto e branco com gravata-borboleta, arco de balões preto, branco e espelhado, cilindros listrados e estantes de lembrancinhas' },
  '06': { w: 1026, h: 1129, alt: 'Mesa de doces em azul-marinho e dourado com suportes dourados, cilindros decorados e balões dourados e transparentes' },
  '07': { w: 1094, h: 1437, alt: 'Mini table com bambolê dourado e balões pastel, bancada branca, casinha de passarinho, passarinhos de MDF e borboleta lilás' },
  '08': { w: 899, h: 1599, alt: 'Salão de festa com pista de LED estrelada, balões transparentes no teto e cenário azul e prata ao fundo' },
  '09': { w: 1200, h: 1600, alt: 'Cenário de 15 anos em azul e prata com painel de debutante, neon “15”, cilindros marinho e arco de balões cromados' },
  '10': { w: 960, h: 1280, alt: 'Montagem de 15 anos em azul-marinho e prata com neon “15”, cilindros ripados e estante de lembrancinhas' },
});

const LARGURAS = [480, 960];

export function larguras(id) {
  const total = FOTOS[id].w;
  return [...LARGURAS.filter((l) => l < total), total];
}

export function fotoUrl(id, largura) {
  const total = FOTOS[id].w;
  return `assets/otimizado/${id}-${largura >= total ? 'full' : largura}.webp`;
}

export function fotoSrcset(id) {
  return larguras(id)
    .map((l) => `${fotoUrl(id, l)} ${l}w`)
    .join(', ');
}

export function fotoMaior(id) {
  return fotoUrl(id, FOTOS[id].w);
}

/**
 * Temas. tokens → variáveis CSS; baloes/cromo → cores dos balões 3D; cena → cores do palco 3D.
 * `capa` = foto do arco central do hero; `fotos` = fotos do tema.
 */
export const TEMAS = Object.freeze([
  {
    id: 'padrao', nome: 'Algodão-doce', frase: 'Rosa, lilás e verde-água: o clima mais doce de todos.', capa: '04', fotos: ['04'],
    tokens: { bg: '#FFF7F1', bg2: '#FFEDE3', texto: '#2B2230', suave: '#5E5266', a1: '#F29CB7', a2: '#B9A3E3', a3: '#9ADBC9', onA1: '#2B2230', destaque: '#B8386B', card: 'rgba(255,255,255,0.72)', borda: 'rgba(43,34,48,0.12)', escuro: false },
    baloes: ['#F29CB7', '#B9A3E3', '#9ADBC9', '#F8E58C', '#FFFFFF'], cromo: ['#E9C46A', '#E8E8EE'],
    cena: { painel: '#F29CB7', painel2: '#B9A3E3', cilindro: '#FFFFFF', cilindro2: '#9ADBC9', tapete: '#F6CDDB', neon: '#FF8FC1' },
  },
  {
    id: 'jardim', nome: 'Jardim Encantado', frase: 'Passarinhos, borboletas e muito verde-água.', capa: '01', fotos: ['01'],
    chips: ['Painel redondo ilustrado', 'Arco de balões', 'Casinha de passarinho'],
    tokens: { bg: '#FFF8F2', bg2: '#FDEFE4', texto: '#2B2230', suave: '#5A5062', a1: '#F6A6BF', a2: '#9ADBC9', a3: '#F8E58C', onA1: '#2B2230', destaque: '#B43A6A', card: 'rgba(255,255,255,0.72)', borda: 'rgba(43,34,48,0.12)', escuro: false },
    baloes: ['#F6A6BF', '#9ADBC9', '#F8E58C', '#B9A3E3', '#FFFFFF'], cromo: ['#E9C46A', '#E8E8EE'],
    cena: { painel: '#F6A6BF', painel2: '#9ADBC9', cilindro: '#FFFFFF', cilindro2: '#F8E58C', tapete: '#F7D3DD', neon: '#FF8FC1' },
  },
  {
    id: 'margaridas', nome: 'Margaridas', frase: 'Rosa e amarelo que parecem primavera.', capa: '04', fotos: ['04'],
    chips: ['Margaridas gigantes de MDF', 'Neon “1”', 'Cilindros ripados'],
    tokens: { bg: '#FFFBEF', bg2: '#FFF1C9', texto: '#2B2230', suave: '#5E5560', a1: '#F7B6C8', a2: '#F8D94A', a3: '#FFFFFF', onA1: '#2B2230', destaque: '#B23367', card: 'rgba(255,255,255,0.78)', borda: 'rgba(43,34,48,0.12)', escuro: false },
    baloes: ['#F7B6C8', '#F8D94A', '#FFFFFF', '#FBE9A6', '#F29CB7'], cromo: ['#E9C46A', '#F4F4F4'],
    cena: { painel: '#F7B6C8', painel2: '#FFFFFF', cilindro: '#F8D94A', cilindro2: '#FFFFFF', tapete: '#F8D5DD', neon: '#FF9CC8' },
  },
  {
    id: 'cerejeira', nome: 'Cerejeira & Borboletas', frase: 'Romântico, em tons de rosa e lilás.', capa: '03', fotos: ['03'],
    chips: ['Painel de cerejeira', 'Borboletas de MDF', 'Cilindro lilás'],
    tokens: { bg: '#FFF3F8', bg2: '#FBE0EC', texto: '#2B2230', suave: '#5E4F63', a1: '#E58AB3', a2: '#9B6FD1', a3: '#F4C7DA', onA1: '#2B2230', destaque: '#A52C78', card: 'rgba(255,255,255,0.74)', borda: 'rgba(43,34,48,0.12)', escuro: false },
    baloes: ['#E58AB3', '#9B6FD1', '#F4C7DA', '#C9A8F0', '#D96A99'], cromo: ['#C98FA8', '#E8DDF2'],
    cena: { painel: '#E58AB3', painel2: '#9B6FD1', cilindro: '#C9A8F0', cilindro2: '#F4C7DA', tapete: '#F2BCD3', neon: '#FF8AC4' },
  },
  {
    id: 'marinho', nome: 'Marinho & Dourado', frase: 'Elegância clássica para qualquer idade.', capa: '02', fotos: ['02', '06'],
    chips: ['Painel arco marinho', 'Balões dourado cromado', 'Suportes dourados'],
    tokens: { bg: '#0E1B3D', bg2: '#142650', texto: '#FFFFFF', suave: '#C9D3EE', a1: '#D4AF37', a2: '#2B4A94', a3: '#F5EFE0', onA1: '#1A1405', destaque: '#E8C75A', card: 'rgba(255,255,255,0.08)', borda: 'rgba(255,255,255,0.2)', escuro: true },
    baloes: ['#1F3A7A', '#FFFFFF', '#14224F', '#2B4A94', '#F5EFE0'], cromo: ['#D4AF37', '#E8C75A'],
    cena: { painel: '#14224F', painel2: '#D4AF37', cilindro: '#1F3A7A', cilindro2: '#FFFFFF', tapete: '#0B0B12', neon: '#FFE08A' },
  },
  {
    id: 'pb', nome: 'Preto & Branco', frase: 'Moderno e cheio de personalidade (a gravatinha!).', capa: '05', fotos: ['05'],
    chips: ['Gravata-borboleta', 'Balões espelhados', 'Estantes-escada'],
    tokens: { bg: '#121212', bg2: '#1D1D1D', texto: '#FFFFFF', suave: '#D0D0D0', a1: '#FFFFFF', a2: '#C9C9C9', a3: '#D4AF37', onA1: '#111111', destaque: '#E8C75A', card: 'rgba(255,255,255,0.08)', borda: 'rgba(255,255,255,0.22)', escuro: true },
    baloes: ['#161616', '#FFFFFF', '#2A2A2A', '#E6E6E6', '#0B0B0B'], cromo: ['#C9C9C9', '#4A4A4A'],
    cena: { painel: '#1A1A1A', painel2: '#F2F2F2', cilindro: '#111111', cilindro2: '#FFFFFF', tapete: '#050505', neon: '#FFFFFF' },
  },
  {
    id: 'quinze', nome: '15 Anos Azul & Prata', frase: 'Um sonho de debutante, com neon e brilho.', capa: '09', fotos: ['09', '10'],
    chips: ['Neon “15”', 'Balões cromados', 'Cortina de luzes'],
    tokens: { bg: '#0B1B4D', bg2: '#102560', texto: '#FFFFFF', suave: '#CAD3F2', a1: '#C0C7D1', a2: '#2F55D4', a3: '#FFFFFF', onA1: '#0B1B4D', destaque: '#B8CBFF', card: 'rgba(255,255,255,0.09)', borda: 'rgba(255,255,255,0.22)', escuro: true },
    baloes: ['#1B3A8C', '#2F55D4', '#0F2468', '#E6EAF2', '#FFFFFF'], cromo: ['#C0C7D1', '#E8ECF4'],
    cena: { painel: '#13296F', painel2: '#C0C7D1', cilindro: '#1B3A8C', cilindro2: '#FFFFFF', tapete: '#060A1F', neon: '#CFE0FF' },
  },
]);

export const TEMA_PADRAO = 'padrao';

export function temaPorId(id) {
  return TEMAS.find((t) => t.id === id) ?? TEMAS[0];
}

/** Escolhe as duas fotos laterais do hero, diferentes da foto central. */
export function fotosLaterais(centro) {
  return ['02', '03', '05', '06'].filter((n) => n !== centro).slice(0, 2);
}
