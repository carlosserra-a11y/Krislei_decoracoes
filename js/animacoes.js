// Animações: revelações ao rolar (sem dependências) e parallax/scroll com GSAP + Lenis (carregados sob demanda).
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
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  $$('.reveal, .linhas, .assinatura, .historia__citacao, .historia__final').forEach((el) => observador.observe(el));
}

// ----- blocos com GSAP -----

function progressoDeLeitura(ScrollTrigger) {
  const barra = $('.progresso');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => barra.style.setProperty('--p', self.progress.toFixed(4)) });
}

function parallaxDoHero(gsap, ScrollTrigger) {
  const hero = $('.hero');
  if (!hero) return;
  const gatilho = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  $$('[data-parallax]', hero).forEach((el) => {
    const fator = parseFloat(el.dataset.parallax);
    gsap.to(el, { y: () => -fator * hero.offsetHeight * 0.9, ease: 'none', scrollTrigger: gatilho });
    gsap.fromTo(el, { '--py': '-4%' }, { '--py': '5%', ease: 'none', scrollTrigger: gatilho });
  });
  $$('.orn', $('.hero__ornamentos')).forEach((el) => {
    const f = parseFloat(el.dataset.orn);
    gsap.to(el, { y: -f * 260, rotation: f * 40, ease: 'none', scrollTrigger: gatilho });
  });
  if (!temHover()) return;
  const mover = (alvo, amplitude) => ({ x: gsap.quickTo(alvo, 'x', { duration: 0.8 }), y: gsap.quickTo(alvo, 'y', { duration: 0.8 }), amplitude });
  const camadas = [mover($('.hero__fundo'), 24), mover($('.hero__ornamentos'), -18)];
  hero.addEventListener('pointermove', (e) => {
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    camadas.forEach(({ x, y, amplitude }) => { x(nx * amplitude); y(ny * amplitude); });
  });
}

function ornamentosDasSecoes(gsap) {
  $$('.impacto__orn').forEach((el) => {
    const f = parseFloat(el.dataset.orn);
    gsap.fromTo(el, { y: 90 * f, rotation: -10 * f }, {
      y: -170 * f, rotation: 28 * f, ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function frasesDeImpacto(gsap) {
  const frase = $('#impacto-frase');
  if (!frase) return;
  const palavras = dividirPalavras(frase, 'palavra');
  gsap.to(palavras, {
    opacity: 1, stagger: 0.12, ease: 'none',
    scrollTrigger: { trigger: frase, start: 'top 85%', end: 'bottom 45%', scrub: true },
  });
}

function galeriaFixada(gsap) {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const galeria = $('#galeria');
    const trilho = $('#galeria-trilho');
    const pino = $('.galeria__pin');
    if (!galeria || !trilho || !pino) return undefined;
    galeria.classList.add('pinada');
    const distancia = () => Math.max(0, trilho.scrollWidth - window.innerWidth);
    const anim = gsap.to(trilho, {
      x: () => -distancia(), ease: 'none',
      scrollTrigger: { trigger: pino, start: 'center center', end: () => `+=${distancia()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    $$('.tema-card__arco img', trilho).forEach((img) => {
      gsap.fromTo(img, { xPercent: -4 }, {
        xPercent: 4, ease: 'none',
        scrollTrigger: { trigger: img.closest('.tema-card'), containerAnimation: anim, start: 'left right', end: 'right left', scrub: true },
      });
    });
    return () => galeria.classList.remove('pinada');
  });
}

function pistaDeLed(gsap) {
  const secao = $('#led');
  if (!secao || secao.hidden) return;
  const gatilho = { trigger: secao, start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo('#led-piso', { '--inclina': '72deg' }, { '--inclina': '46deg', ease: 'none', scrollTrigger: gatilho });
  gsap.fromTo('#led-bolhas', { y: 60 }, { y: -120, ease: 'none', scrollTrigger: gatilho });
}

function linhaDoTempo(ScrollTrigger) {
  const linha = $('#linha-tempo');
  const texto = $('.historia__texto');
  if (!linha || !texto) return;
  ScrollTrigger.create({
    trigger: texto, start: 'top 70%', end: 'bottom 70%',
    onUpdate: (self) => linha.style.setProperty('--prog', self.progress.toFixed(3)),
  });
}

function velocidadeDoMarquee(gsap, ScrollTrigger) {
  const animacao = $('#marquee')?.getAnimations?.()[0];
  if (!animacao) return;
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
    animacao.updatePlaybackRate(direcao * fator);
  });
}

function cursorMagnetico(gsap) {
  if (!temHover()) return;
  $$('.btn--grande, .btn--gigante').forEach((botao) => {
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
    if (!botao || botao.dataset.subindo) return;
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

function ancoras(lenis) {
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    const alvo = link && link.getAttribute('href').length > 1 ? $(link.getAttribute('href')) : null;
    if (!alvo) return;
    e.preventDefault();
    lenis.scrollTo(alvo, { offset: -72 });
    history.pushState(null, '', link.getAttribute('href'));
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
  parallaxDoHero(gsap, ScrollTrigger);
  ornamentosDasSecoes(gsap);
  frasesDeImpacto(gsap);
  galeriaFixada(gsap);
  pistaDeLed(gsap);
  linhaDoTempo(ScrollTrigger);
  velocidadeDoMarquee(gsap, ScrollTrigger);
  cursorMagnetico(gsap);
  balaozinhos();
  ancoras(lenis);
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  return { gsap, ScrollTrigger, lenis };
}
