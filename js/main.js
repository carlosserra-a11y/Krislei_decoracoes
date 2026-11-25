// Ponto de entrada: monta o conteúdo, liga o WhatsApp e carrega as partes pesadas (animações e 3D) depois.
import { CONFIG } from './config.js';
import { hidratarFotos } from './fotos.js';
import { iniciarSite, atualizarLinks } from './site.js';
import { iniciarTemas, temaAtual } from './temas.js';
import { montarMarquees, montarPecasChips, montarBaloesFinais } from './conteudo.js';
import { iniciarPortfolio } from './portfolio.js';
import { iniciarAssistente } from './assistente.js';
import { iniciarReveal, iniciarCursor, iniciarAnimacoes } from './animacoes.js';
import { iniciarFundo } from './fundo.js';
import { iniciarConversa } from './conversa.js';
import { soltarConfete } from './confete.js';

const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;
let ultimoCenario = null;
document.addEventListener('cenario:mudou', ({ detail }) => { ultimoCenario = detail; });

function esconderLoader() {
  if (!raiz.classList.contains('com-loader')) return;
  document.getElementById('loader')?.classList.add('fim');
  setTimeout(() => raiz.classList.remove('com-loader'), 650);
  try {
    sessionStorage.setItem('krislei:visto', '1');
  } catch {
    /* sem armazenamento */
  }
}

function pecasAtivas() {
  return CONFIG.pecas.filter((p) => p.ativo && (!p.secao || CONFIG.secoes[p.secao]));
}

/** A história começa recolhida para a página ficar curta; sem JavaScript ela aparece inteira. */
function iniciarHistoria() {
  const secao = document.getElementById('historia');
  const botao = document.getElementById('ler-mais');
  if (!secao || !botao) return;
  secao.classList.add('recolhida');
  botao.hidden = false;
  botao.addEventListener('click', () => {
    const recolhida = secao.classList.toggle('recolhida');
    botao.setAttribute('aria-expanded', String(!recolhida));
    botao.textContent = recolhida ? 'Ler a história completa' : 'Recolher a história';
    if (recolhida) secao.scrollIntoView({ block: 'start' });
    document.dispatchEvent(new CustomEvent('layout:mudou'));
  });
}

function montarConteudo() {
  hidratarFotos();
  montarMarquees(CONFIG.ocasioes, pecasAtivas());
  montarPecasChips(pecasAtivas());
  montarBaloesFinais();
  iniciarTemas();
  iniciarSite();
  iniciarPortfolio();
  iniciarAssistente();
  iniciarHistoria();
}

/** Guirlanda de balões em CSS, usada quando não há 3D (sem WebGL, sem biblioteca ou movimento reduzido). */
function guirlandaEstatica() {
  const hero = document.querySelector('.hero');
  const area = document.getElementById('guirlanda-fallback');
  if (!hero || !area) return;
  hero.classList.add('sem-3d');
  const cores = ['var(--a1)', 'var(--a2)', 'var(--a3)', '#fff'];
  const estreito = window.matchMedia('(max-width: 899px)').matches;
  const centro = estreito ? { x: 50, y: 76, rx: 42, ry: 18 } : { x: 73, y: 52, rx: 25, ry: 36 };
  area.innerHTML = Array.from({ length: 16 }, (_, i) => {
    const ang = Math.PI * (1.12 - 1.24 * (i / 15));
    const x = centro.x + centro.rx * Math.cos(ang);
    const y = centro.y - centro.ry * Math.sin(ang) + (i % 2) * 2;
    const tamanho = (estreito ? 22 : 34) + ((i * 29) % 36);
    return `<i style="--x:${x.toFixed(1)}%;--y:${y.toFixed(1)}%;--s:${tamanho}px;--c:${cores[i % 4]};--d:-${(i % 5) * 0.9}s"></i>`;
  }).join('');
}

function mostrarToast(texto) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const frase = document.createElement('span');
  frase.textContent = texto;
  const link = document.createElement('a');
  link.className = 'btn btn--wa';
  link.dataset.wa = 'geral';
  link.dataset.waOrigem = 'toast';
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Chamar agora';
  toast.replaceChildren(frase, link);
  toast.hidden = false;
  atualizarLinks();
  requestAnimationFrame(() => toast.classList.add('visivel'));
  setTimeout(() => {
    toast.classList.remove('visivel');
    setTimeout(() => { toast.hidden = true; }, 500);
  }, 9000);
}

async function iniciarHero3d(libs) {
  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('hero-canvas');
  if (reduzir || !hero || !canvas) {
    guirlandaEstatica();
    return;
  }
  try {
    const { iniciarBaloes } = await import('./hero-baloes.js');
    const baloes = await iniciarBaloes({
      canvas, hero, tema: temaAtual(),
      aoEstourar: (n) => { if (n === 5) mostrarToast('Gostou? Chame a Krislei!'); },
    });
    document.addEventListener('tema:mudou', ({ detail }) => baloes.definirTema(detail.tema));
    libs?.ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onUpdate: (self) => baloes.definirRolagem(self.progress) });
  } catch (erro) {
    console.warn('[Krislei] 3D indisponível, usando a guirlanda estática:', erro.message);
    canvas.hidden = true;
    guirlandaEstatica();
  }
}

function iniciarPalco() {
  const palco = document.getElementById('palco');
  const canvas = document.getElementById('palco-canvas');
  const imagem = document.getElementById('palco-fallback');
  if (!palco || !canvas || !imagem) return;
  const carregar = async () => {
    let modulo = null;
    try {
      modulo = await import('./estudio3d.js');
      if (reduzir) {
        modulo.iniciarEstudioEstatico({ canvas, imagem });
        return;
      }
      const estudio = await modulo.iniciarEstudio({ canvas, palco, inicial: ultimoCenario });
      document.addEventListener('cenario:mudou', ({ detail }) => estudio.atualizar(detail));
    } catch (erro) {
      console.warn('[Krislei] Palco 3D indisponível:', erro.message);
      modulo?.iniciarEstudioEstatico({ canvas, imagem });
    }
  };
  if (!('IntersectionObserver' in window)) {
    carregar();
    return;
  }
  const observador = new IntersectionObserver(([entrada]) => {
    if (!entrada.isIntersecting) return;
    observador.disconnect();
    carregar();
  }, { rootMargin: '700px 0px' });
  observador.observe(palco);
}

async function carregarPesados() {
  let libs = null;
  if (!reduzir) {
    try {
      libs = await iniciarAnimacoes();
    } catch (erro) {
      console.warn('[Krislei] Animações indisponíveis (a página segue funcionando):', erro.message);
    }
  }
  await iniciarHero3d(libs);
  iniciarPalco();
}

function confeteNoClique() {
  if (reduzir) return;
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, label, summary, select, textarea, video, canvas, dialog, aside')) return;
    soltarConfete({ x: e.clientX, y: e.clientY, n: 14 });
  });
}

function iniciar() {
  montarConteudo();
  iniciarFundo({ reduzir });
  if (reduzir) raiz.classList.add('no-anim');
  else {
    iniciarReveal();
    iniciarCursor();
  }
  confeteNoClique();
  iniciarConversa();
  setTimeout(esconderLoader, 800);
  const quandoOciosa = window.requestIdleCallback ?? ((funcao) => setTimeout(funcao, 200));
  quandoOciosa(carregarPesados);
}

iniciar();
