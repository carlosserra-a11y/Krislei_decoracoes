// Monta, a partir de config.js, os trechos de conteúdo gerados por script.
import { fotoUrl } from './dados.js';
import { iconeSvg } from './icones.js';

const sorteio = (min, max) => min + Math.random() * (max - min);

export function montarMarquee(ocasioes) {
  const trilho = document.getElementById('marquee');
  if (!trilho) return;
  const nomes = [...ocasioes.map((o) => o.nome), ...ocasioes.map((o) => o.nome)];
  const metade = nomes.map((n) => `<span class="faixa__item">${n}</span>`).join('');
  // duas metades idênticas: a animação anda -50% e recomeça sem salto
  trilho.innerHTML = metade + metade;
}

export function montarPecas(pecas) {
  const grade = document.getElementById('grade-pecas');
  if (!grade) return;
  grade.innerHTML = pecas
    .map((p, i) => {
      const imagem = fotoUrl(p.foto, 960);
      return `<article class="peca reveal" style="--i:${i % 4}">
        <div class="peca__foto" aria-hidden="true" style="background-image:url('${imagem}');background-position:${p.pos}">
          <span class="peca__icone">${iconeSvg(p.id)}</span>
        </div>
        <svg class="peca__balao" viewBox="0 0 24 26" aria-hidden="true"><use href="#i-balao"/></svg>
        <h3>${p.nome}</h3>
        <p>${p.desc}</p>
      </article>`;
    })
    .join('');
}

export function montarLed() {
  const piso = document.getElementById('led-piso');
  const ceu = document.getElementById('led-bolhas');
  if (piso) {
    const luzes = Array.from({ length: 110 }, () => {
      const estilo = `--x:${sorteio(2, 98).toFixed(1)}%;--y:${sorteio(4, 96).toFixed(1)}%;--t:${sorteio(1.6, 4).toFixed(2)}s;--d:-${sorteio(0, 4).toFixed(2)}s`;
      return `<i style="${estilo}"></i>`;
    }).join('');
    piso.innerHTML = `<div class="led__plano">${luzes}</div>`;
  }
  if (ceu) {
    ceu.innerHTML = Array.from({ length: 12 }, () => {
      const estilo = `--x:${sorteio(0, 92).toFixed(1)}%;--y:${sorteio(2, 80).toFixed(1)}%;--s:${sorteio(36, 120).toFixed(0)}px;--d:-${sorteio(0, 6).toFixed(1)}s`;
      return `<i class="bolha" style="${estilo}"></i>`;
    }).join('');
  }
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
