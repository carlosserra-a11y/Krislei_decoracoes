// Animações: revelações e cursor (sem dependências) + parallax e rolagem suave com GSAP + Lenis (sob demanda).
import { dividirPalavras } from './conteudo.js';

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
const temHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Revelações simples por IntersectionObserver. Só esconde o conteúdo se o observador existir. */
export function iniciarReveal() {
  if (!('IntersectionObserver' in window)) return;
  $$('.linhas').forEach((p) => dividirPalavras(p, 'w'));
  document.documentElement.classList.add('anim-pronto');
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
  );
  $$('.reveal, .linhas, .assinatura, .historia__citacao, .historia__final').forEach((el) => observador.observe(el));
}

/** Anel que segue o mouse e cresce sobre o que é clicável (só com mouse). */
export function iniciarCursor() {
  const anel = $('#cursor');
  if (!anel || !temHover()) return;
  const alvo = { x: -100, y: -100 };
  const atual = { ...alvo };
  let andando = false;
  const quadro = () => {
    atual.x += (alvo.x - atual.x) * 0.22;
    atual.y += (alvo.y - atual.y) * 0.22;
    anel.style.transform = `translate3d(${atual.x.toFixed(1)}px, ${atual.y.toFixed(1)}px, 0)`;
    andando = Math.abs(alvo.x - atual.x) + Math.abs(alvo.y - atual.y) > 0.3;
    if (andando) requestAnimationFrame(quadro);
  };
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    alvo.x = e.clientX;
    alvo.y = e.clientY;
    anel.classList.add('ativo');
    anel.classList.toggle('sobre', Boolean(e.target.closest?.('a, button, input, label, summary, canvas')));
    if (!andando) {
      andando = true;
      requestAnimationFrame(quadro);
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => anel.classList.remove('ativo'));
}

// ----- blocos com GSAP -----

function progressoDeLeitura(ScrollTrigger) {
  const barra = $('.progresso');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => barra.style.setProperty('--p', self.progress.toFixed(4)) });
}

function parallaxDoHero(gsap) {
  const hero = $('.hero');
  if (!hero) return;
  const gatilho = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  // no celular o texto fica em cima das fotos: o deslocamento precisa ser pequeno para não sobrepor
  const lado = window.matchMedia('(min-width: 900px)').matches;
  const intensidade = lado ? 0.8 : 0.12;
  $$('[data-parallax]', hero).forEach((el) => {
    const fator = parseFloat(el.dataset.parallax);
    gsap.to(el, { y: () => -fator * hero.offsetHeight * intensidade, ease: 'none', scrollTrigger: gatilho });
  });
  $$('.arco', hero).forEach((arco) => gsap.fromTo(arco, { '--py': '-5%' }, { '--py': '7%', ease: 'none', scrollTrigger: gatilho }));
  $$('.orn', hero).forEach((el) => {
    const f = parseFloat(el.dataset.orn);
    gsap.to(el, { y: -f * 300, rotation: f * 60, ease: 'none', scrollTrigger: gatilho });
  });
  if (lado) gsap.fromTo('.hero__texto', { y: 0, opacity: 1 }, { y: 90, opacity: 0.25, ease: 'none', scrollTrigger: { ...gatilho, start: '25% top' } });
}

/** O mouse inclina os arcos em 3D e desloca fundo e enfeites em profundidades diferentes. */
function profundidadeNoMouse(gsap) {
  const hero = $('.hero');
  if (!hero || !temHover()) return;
  const arcos = $('[data-hero-arcos]', hero);
  gsap.set(arcos, { transformPerspective: 1400 });
  const rapido = (alvo, prop) => gsap.quickTo(alvo, prop, { duration: 0.9, ease: 'power3.out' });
  const girarY = rapido(arcos, 'rotationY');
  const girarX = rapido(arcos, 'rotationX');
  const camadas = [
    { x: rapido($('.hero__fundo'), 'x'), y: rapido($('.hero__fundo'), 'y'), amplitude: 34 },
    { x: rapido($('.hero__ornamentos'), 'x'), y: rapido($('.hero__ornamentos'), 'y'), amplitude: -26 },
  ];
  hero.addEventListener('pointermove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    girarY(nx * 10);
    girarX(-ny * 7);
    camadas.forEach(({ x, y, amplitude }) => { x(nx * amplitude); y(ny * amplitude); });
  });
}

/** Cada foto do portfólio desliza dentro da própria moldura conforme a posição na tela. */
function parallaxDoPortfolio(ScrollTrigger) {
  const grade = $('#bento');
  if (!grade) return;
  const atualizar = () => {
    const meio = window.innerHeight / 2;
    $$('.tile img', grade).forEach((img) => {
      const caixa = img.parentElement.getBoundingClientRect();
      const desvio = Math.max(-1, Math.min(1, (caixa.top + caixa.height / 2 - meio) / meio));
      img.style.setProperty('--py', `${(desvio * -6).toFixed(2)}%`);
    });
  };
  ScrollTrigger.create({ trigger: grade, start: 'top bottom', end: 'bottom top', onUpdate: atualizar });
  document.addEventListener('layout:mudou', () => requestAnimationFrame(atualizar));
  atualizar();
}

function parallaxDasSecoes(gsap) {
  $$('.secao h2, .final h2').forEach((titulo) => {
    gsap.fromTo(titulo, { y: 30 }, { y: -20, ease: 'none', scrollTrigger: { trigger: titulo, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.faixa__linha').forEach((linha, i) => {
    const sentido = i === 0 ? 1 : -1;
    gsap.fromTo(linha, { rotation: -2.4 * sentido }, { rotation: 0.4 * sentido, ease: 'none', scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const arco = $('.historia__arco img');
  if (arco) gsap.fromTo(arco, { scale: 1.18, yPercent: -7 }, { scale: 1.18, yPercent: 7, ease: 'none', scrollTrigger: { trigger: '#historia', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.final', { scale: 0.92 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'top 35%', scrub: true } });
}

function linhaDoTempo(ScrollTrigger) {
  const linha = $('#linha-tempo');
  const secao = $('#historia');
  if (!linha || !secao) return;
  ScrollTrigger.create({
    trigger: secao, start: 'top 65%', end: 'bottom 85%',
    onUpdate: (self) => linha.style.setProperty('--prog', self.progress.toFixed(3)),
  });
}

function velocidadeDoMarquee(gsap, ScrollTrigger) {
  const animacoes = $$('.faixa__trilho').flatMap((t) => t.getAnimations?.() ?? []);
  if (!animacoes.length) return;
  let direcao = 1;
  let fator = 1;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      if (Math.abs(v) > 60) direcao = v < 0 ? -1 : 1;
      fator = Math.max(fator, 1 + Math.min(Math.abs(v) / 350, 5));
    },
  });
  gsap.ticker.add(() => {
    fator += (1 - fator) * 0.06;
    animacoes.forEach((a) => a.updatePlaybackRate(direcao * fator));
  });
}

function cursorMagnetico(gsap) {
  if (!temHover()) return;
  $$('.hero .btn--grande, .btn--gigante').forEach((botao) => {
    botao.addEventListener('pointermove', (e) => {
      const caixa = botao.getBoundingClientRect();
      gsap.to(botao, { x: (e.clientX - caixa.left - caixa.width / 2) * 0.18, y: (e.clientY - caixa.top - caixa.height / 2) * 0.28, duration: 0.4 });
    });
    botao.addEventListener('pointerleave', () => gsap.to(botao, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }));
  });
}

/** Um balãozinho sobe do botão do WhatsApp ao passar o mouse. */
function balaozinhos() {
  if (!temHover()) return;
  document.addEventListener('pointerenter', (e) => {
    const botao = e.target instanceof Element ? e.target.closest('.btn--wa') : null;
    if (!botao || botao.dataset.subindo || botao.closest('dialog')) return;
    botao.dataset.subindo = '1';
    const caixa = botao.getBoundingClientRect();
    const balao = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    balao.setAttribute('viewBox', '0 0 24 26');
    balao.innerHTML = '<use href="#i-balao"/>';
    Object.assign(balao.style, { position: 'fixed', left: `${caixa.left + caixa.width * (0.2 + Math.random() * 0.6)}px`, top: `${caixa.top}px`, width: '20px', height: '24px', fill: 'var(--a1)', color: 'var(--a1)', pointerEvents: 'none', zIndex: '80' });
    document.body.appendChild(balao);
    const voo = balao.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-90px) rotate(8deg)', opacity: 0 }], { duration: 1400, easing: 'ease-out' });
    voo.onfinish = () => { balao.remove(); delete botao.dataset.subindo; };
  }, true);
}

function rolagemSuave(lenis, ScrollTrigger) {
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    const alvo = link && link.getAttribute('href').length > 1 ? $(link.getAttribute('href')) : null;
    if (!alvo) return;
    e.preventDefault();
    lenis.scrollTo(alvo, { offset: alvo.id === 'topo' ? 0 : -64 });
    history.pushState(null, '', link.getAttribute('href'));
  });
  document.addEventListener('modal:aberto', () => lenis.stop());
  document.addEventListener('modal:fechado', () => lenis.start());
  // Quando a altura da página muda (filtro, história), recalcula os gatilhos.
  let espera = 0;
  document.addEventListener('layout:mudou', () => {
    clearTimeout(espera);
    espera = setTimeout(() => ScrollTrigger.refresh(), 750);
  });
}

/** Carrega GSAP, ScrollTrigger e Lenis e liga todos os efeitos. Devolve as bibliotecas para outros módulos. */
export async function iniciarAnimacoes() {
  const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
  gsap.ticker.lagSmoothing(0);

  progressoDeLeitura(ScrollTrigger);
  parallaxDoHero(gsap);
  profundidadeNoMouse(gsap);
  parallaxDoPortfolio(ScrollTrigger);
  parallaxDasSecoes(gsap);
  linhaDoTempo(ScrollTrigger);
  velocidadeDoMarquee(gsap, ScrollTrigger);
  cursorMagnetico(gsap);
  balaozinhos();
  rolagemSuave(lenis, ScrollTrigger);
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  return { gsap, ScrollTrigger, lenis };
}
