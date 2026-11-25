// Seletor de temas: troca a paleta da página inteira e as fotos dos arcos do hero.
import { TEMAS, TEMA_PADRAO, FOTOS, temaPorId, fotosLaterais, fotoSrcset, fotoMaior } from './dados.js';

const CHAVE = 'krislei:tema';
const MAPA_TOKENS = {
  bg: '--bg', bg2: '--bg2', texto: '--texto', suave: '--suave', a1: '--a1', a2: '--a2', a3: '--a3',
  onA1: '--on-a1', destaque: '--destaque', card: '--card', borda: '--borda',
};
let atual = temaPorId(TEMA_PADRAO);

export const temaAtual = () => atual;

function lerSalvo() {
  try {
    const url = new URLSearchParams(location.search).get('tema');
    const salvo = url || localStorage.getItem(CHAVE);
    return TEMAS.some((t) => t.id === salvo) ? salvo : TEMA_PADRAO;
  } catch {
    return TEMA_PADRAO;
  }
}

function salvar(id) {
  try {
    localStorage.setItem(CHAVE, id);
  } catch {
    /* sem armazenamento: tudo bem */
  }
}

/** Troca a foto de um arco do hero com crossfade. */
function trocarFoto(img, id) {
  if (!img || img.dataset.fotoAtual === id) return;
  img.dataset.fotoAtual = id;
  const foto = FOTOS[id];
  img.parentElement.querySelectorAll('.arco__sobre').forEach((no) => no.remove());
  clearTimeout(img.trocaTimer);
  const sobre = new Image();
  sobre.className = 'arco__sobre';
  sobre.alt = '';
  sobre.sizes = img.sizes;
  sobre.srcset = fotoSrcset(id);
  sobre.src = fotoMaior(id);
  img.parentElement.appendChild(sobre);
  const concluir = () => {
    requestAnimationFrame(() => sobre.classList.add('visivel'));
    img.trocaTimer = setTimeout(() => {
      img.srcset = sobre.srcset;
      img.src = sobre.src;
      img.width = foto.w;
      img.height = foto.h;
      img.alt = foto.alt;
      sobre.remove();
    }, 800);
  };
  (sobre.decode ? sobre.decode() : Promise.resolve()).then(concluir, concluir);
}

function atualizarArcos(tema) {
  const slot = (nome) => document.querySelector(`[data-slot="${nome}"]`);
  const [esq, dir] = fotosLaterais(tema.capa);
  trocarFoto(slot('centro'), tema.capa);
  trocarFoto(slot('esq'), esq);
  trocarFoto(slot('dir'), dir);
}

function atualizarPaletas(id) {
  document.querySelectorAll('.paleta').forEach((botao) => {
    const ativo = botao.dataset.tema === id;
    botao.setAttribute('aria-checked', String(ativo));
    botao.tabIndex = ativo ? 0 : -1;
  });
}

export function aplicarTema(id, { persistir = true } = {}) {
  const tema = temaPorId(id);
  atual = tema;
  const raiz = document.documentElement;
  Object.entries(MAPA_TOKENS).forEach(([chave, variavel]) => raiz.style.setProperty(variavel, tema.tokens[chave]));
  raiz.dataset.tema = tema.id;
  raiz.dataset.escuro = String(tema.tokens.escuro);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema.tokens.bg);
  document.querySelectorAll('[data-tema-nome]').forEach((el) => { el.textContent = tema.nome; });
  document.querySelectorAll('[data-tema-frase]').forEach((el) => { el.textContent = tema.frase; });
  atualizarPaletas(tema.id);
  atualizarArcos(tema);
  if (persistir) salvar(tema.id);
  document.dispatchEvent(new CustomEvent('tema:mudou', { detail: { tema } }));
}

function montarPaletas() {
  const grupo = document.getElementById('paletas');
  if (!grupo) return;
  grupo.innerHTML = TEMAS.map((t) => {
    const cores = `--c1:${t.tokens.a1};--c2:${t.tokens.a2};--c3:${t.tokens.a3}`;
    return `<button type="button" class="paleta" role="radio" aria-checked="false" data-tema="${t.id}" title="${t.nome}" style="${cores}">
      <span class="paleta__bola"></span><span class="paleta__nome">${t.nome}</span></button>`;
  }).join('');
  grupo.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.paleta');
    if (botao) aplicarTema(botao.dataset.tema);
  });
  grupo.addEventListener('keydown', (evento) => {
    const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[evento.key];
    if (!passo) return;
    evento.preventDefault();
    const indice = TEMAS.findIndex((t) => t.id === atual.id);
    const proximo = TEMAS[(indice + passo + TEMAS.length) % TEMAS.length];
    aplicarTema(proximo.id);
    grupo.querySelector(`[data-tema="${proximo.id}"]`)?.focus();
  });
}

export function iniciarTemas() {
  montarPaletas();
  const inicial = lerSalvo();
  // O hero já nasce com o tema padrão: só precisa trocar se o visitante tinha outro salvo.
  atual = temaPorId(TEMA_PADRAO);
  document.querySelectorAll('[data-slot]').forEach((img) => {
    img.dataset.fotoAtual = img.dataset.foto || (img.dataset.slot === 'centro' ? '04' : '');
  });
  aplicarTema(inicial, { persistir: false });
}
