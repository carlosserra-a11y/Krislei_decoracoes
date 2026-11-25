// Monta, a partir de config.js, os trechos de conteúdo gerados por script.
import { iconeSvg } from './icones.js';

const sorteio = (min, max) => min + Math.random() * (max - min);

function preencherTrilho(id, nomes) {
  const trilho = document.getElementById(id);
  if (!trilho || !nomes.length) return;
  const metade = [...nomes, ...nomes].map((n) => `<span class="faixa__item">${n}</span>`).join('');
  // duas metades idênticas: a animação anda -50% e recomeça sem salto
  trilho.innerHTML = metade + metade;
}

export function montarMarquees(ocasioes, pecas) {
  preencherTrilho('marquee-1', ocasioes.filter((o) => o.id !== 'outra').map((o) => o.nome));
  preencherTrilho('marquee-2', pecas.map((p) => p.curto ?? p.nome));
}

export function montarPecasChips(pecas) {
  const lista = document.getElementById('pecas-chips');
  if (!lista) return;
  lista.innerHTML = pecas.map((p) => `<li title="${p.desc}"><span>${iconeSvg(p.id)}</span>${p.curto ?? p.nome}</li>`).join('');
}

export function montarBaloesFinais() {
  const area = document.getElementById('final-baloes');
  if (!area) return;
  const cores = ['var(--a1)', 'var(--a2)', 'var(--a3)'];
  area.innerHTML = Array.from({ length: 14 }, (_, i) => {
    const tamanho = sorteio(30, 72).toFixed(0);
    const estilo = `--x:${sorteio(0, 94).toFixed(1)}%;--s:${tamanho}px;--t:${sorteio(14, 26).toFixed(1)}s;--d:-${sorteio(0, 20).toFixed(1)}s;--c:${cores[i % 3]};--dx:${sorteio(-40, 40).toFixed(0)}px`;
    return `<svg class="sobe" viewBox="0 0 24 26" style="${estilo}"><use href="#i-balao"/></svg>`;
  }).join('');
}

/** Divide o texto de um elemento em <span>s por palavra (mantém o texto acessível via aria-label). */
export function dividirPalavras(el, classe = 'w') {
  const texto = el.textContent.trim().replace(/\s+/g, ' ');
  el.setAttribute('aria-label', texto);
  const palavras = texto.split(' ');
  el.textContent = '';
  palavras.forEach((palavra, i) => {
    const span = document.createElement('span');
    span.className = classe;
    span.style.setProperty('--w', String(i));
    span.setAttribute('aria-hidden', 'true');
    span.textContent = i < palavras.length - 1 ? `${palavra} ` : palavra;
    el.appendChild(span);
  });
  return [...el.children];
}
