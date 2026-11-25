// Portfólio: grade com filtros e visualizador (foto ou vídeo) com navegação.
import { CONFIG } from './config.js';
import { PORTFOLIO, FILTROS, VISIVEIS_CELULAR, VISIVEIS_DESKTOP, filtrar, itemPorId, vizinho } from './portfolio-dados.js';
import { FOTOS, fotoSrcset, fotoMaior, temaPorId } from './dados.js';
import * as wa from './whatsapp.js';
import { aplicarTema } from './temas.js';
import { registrarProvedor, atualizarLinks } from './site.js';

const DISTANCIA_SWIPE = 50;
const $ = (id) => document.getElementById(id);

let filtroAtual = 'todos';
let itemAberto = null;
let lista = [];

const avisar = (nome) => document.dispatchEvent(new CustomEvent(nome));

function htmlDoItem(item, indice) {
  const foto = FOTOS[item.foto];
  const video = item.tipo === 'video';
  const classes = ['tile', 'entrando', item.forma ? `tile--${item.forma}` : '', video ? 'tile--video' : ''].filter(Boolean).join(' ');
  const largura = item.forma === 'grande' ? '50vw' : '25vw';
  return `<button type="button" class="${classes}" data-item="${item.id}" style="--i:${indice % 8}" aria-label="${video ? 'Assistir' : 'Ampliar'}: ${item.titulo}">
    <img src="${fotoMaior(item.foto)}" srcset="${fotoSrcset(item.foto)}" sizes="(min-width: 900px) ${largura}, 50vw" width="${foto.w}" height="${foto.h}" loading="lazy" decoding="async" alt="" style="object-position:${item.pos}">
    <span class="tile__ver"><svg aria-hidden="true"><use href="#${video ? 'i-play' : 'i-mais'}"/></svg></span>
    <span class="tile__legenda"><b>${item.titulo}</b><small>${item.legenda}</small></span>
  </button>`;
}

function desenhar() {
  const grade = $('bento');
  const botao = $('ver-todos');
  lista = filtrar(PORTFOLIO, filtroAtual, CONFIG.secoes);
  const filtrado = filtroAtual !== 'todos';
  grade.classList.toggle('filtrado', filtrado);
  grade.innerHTML = lista.map(htmlDoItem).join('');
  const minimo = window.matchMedia('(min-width: 900px)').matches ? VISIVEIS_DESKTOP : VISIVEIS_CELULAR;
  botao.parentElement.hidden = filtrado || lista.length <= minimo;
  avisar('layout:mudou');
}

function montarFiltros() {
  const grupo = $('filtros');
  grupo.innerHTML = FILTROS.map((f) => `<button type="button" class="filtro" data-filtro="${f.id}" aria-pressed="${f.id === filtroAtual}">${f.nome}</button>`).join('');
  grupo.addEventListener('click', (e) => {
    const botao = e.target.closest('.filtro');
    if (!botao || botao.dataset.filtro === filtroAtual) return;
    filtroAtual = botao.dataset.filtro;
    grupo.querySelectorAll('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
    desenhar();
  });
}

function midiaDoItem(item) {
  if (item.tipo === 'video') {
    const video = document.createElement('video');
    Object.assign(video, { controls: true, playsInline: true, autoplay: true, loop: true, preload: 'metadata' });
    video.poster = fotoMaior(item.foto);
    video.src = item.video;
    video.setAttribute('aria-label', item.titulo);
    // Se o navegador bloquear o autoplay com som, o visitante usa o botão de play.
    video.play()?.catch(() => {});
    return video;
  }
  const img = new Image();
  img.sizes = '(min-width: 860px) 60vw, 100vw';
  img.srcset = fotoSrcset(item.foto);
  img.src = fotoMaior(item.foto);
  img.alt = FOTOS[item.foto].alt;
  return img;
}

function mostrar(id) {
  const item = itemPorId(PORTFOLIO, id);
  if (!item) return;
  itemAberto = item.id;
  $('lb-midia').replaceChildren(midiaDoItem(item));
  $('lb-titulo').textContent = item.titulo;
  $('lb-legenda').textContent = item.legenda;
  $('lb-contador').textContent = `${lista.findIndex((i) => i.id === item.id) + 1} de ${lista.length}`;
  atualizarLinks();
}

function abrir(id) {
  const dialogo = $('lightbox');
  mostrar(id);
  if (dialogo.open) return;
  dialogo.showModal();
  document.documentElement.style.overflow = 'hidden';
  avisar('modal:aberto');
}

function aoFechar() {
  $('lb-midia').replaceChildren(); // para o vídeo
  document.documentElement.style.overflow = '';
  avisar('modal:fechado');
}

function andar(passo) {
  const proximo = vizinho(lista, itemAberto, passo);
  if (proximo) mostrar(proximo.id);
}

function ligarVisualizador() {
  const dialogo = $('lightbox');
  dialogo.addEventListener('close', aoFechar);
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) return dialogo.close(); // clique no fundo
    const acao = e.target.closest('[data-lb]')?.dataset.lb;
    if (acao === 'fechar') dialogo.close();
    else if (acao === 'ant') andar(-1);
    else if (acao === 'prox') andar(1);
    else if (acao === 'tema') {
      aplicarTema(temaPorId(itemPorId(PORTFOLIO, itemAberto).tema).id);
      dialogo.close();
    }
    return undefined;
  });
  dialogo.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'VIDEO') return;
    if (e.key === 'ArrowLeft') andar(-1);
    if (e.key === 'ArrowRight') andar(1);
  });
  let inicioX = null;
  const midia = $('lb-midia');
  midia.addEventListener('pointerdown', (e) => { inicioX = e.target.tagName === 'VIDEO' ? null : e.clientX; });
  midia.addEventListener('pointerup', (e) => {
    if (inicioX === null) return;
    const dx = e.clientX - inicioX;
    inicioX = null;
    if (Math.abs(dx) > DISTANCIA_SWIPE) andar(dx > 0 ? -1 : 1);
  });
}

function ligarVerTodos() {
  const botao = $('ver-todos');
  botao.addEventListener('click', () => {
    const aberto = $('bento').classList.toggle('aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.textContent = aberto ? 'Mostrar menos' : 'Ver todos os cenários';
    if (!aberto) $('cenarios').scrollIntoView({ block: 'start' });
    avisar('layout:mudou');
  });
}

export function iniciarPortfolio() {
  if (!$('bento')) return;
  registrarProvedor('portfolio', () => wa.mensagemCenario(itemPorId(PORTFOLIO, itemAberto)?.titulo ?? 'do portfólio'));
  montarFiltros();
  desenhar();
  ligarVerTodos();
  ligarVisualizador();
  $('bento').addEventListener('click', (e) => {
    const bloco = e.target.closest('[data-item]');
    if (bloco) abrir(bloco.dataset.item);
  });
}
