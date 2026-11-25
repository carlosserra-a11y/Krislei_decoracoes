// Fundo animado: aurora colorida e peças flutuantes em três profundidades, com parallax ao rolar.
const SIMBOLOS = ['i-balao', 'i-balao', 'i-borboleta', 'i-estrela', 'i-balao', 'i-margarida', 'i-coracao'];
const CORES = ['var(--a1)', 'var(--a2)', 'var(--a3)', 'var(--destaque)'];
const MARGEM = 90;

/** Camadas: longe (pequeno, lento, desfocado) até perto (grande, rápido, nítido). */
const CAMADAS = [
  { tamanho: [10, 18], opacidade: 0.32, desfoque: 1.5, parallax: 0.08, subida: 6 },
  { tamanho: [20, 34], opacidade: 0.34, desfoque: 0.5, parallax: 0.2, subida: 11 },
  { tamanho: [38, 62], opacidade: 0.22, desfoque: 3, parallax: 0.42, subida: 17 },
];

const entre = (min, max) => min + Math.random() * (max - min);
const resto = (valor, base) => ((valor % base) + base) % base;

function criarItem(indice, total) {
  const camada = CAMADAS[indice % CAMADAS.length];
  const no = document.createElement('i');
  no.className = 'fundo__item';
  const tamanho = entre(...camada.tamanho);
  const x = (indice / total) * 94 + entre(0, 5);
  no.style.cssText = `--x:${x.toFixed(1)}%;--s:${tamanho.toFixed(0)}px;--o:${camada.opacidade};--b:${camada.desfoque}px;--c:${CORES[indice % CORES.length]};--t:${entre(4, 9).toFixed(1)}s;--d:-${entre(0, 6).toFixed(1)}s`;
  no.innerHTML = `<svg viewBox="${/borboleta|margarida/.test(SIMBOLOS[indice % SIMBOLOS.length]) ? '0 0 64 64' : '0 0 24 24'}"><use href="#${SIMBOLOS[indice % SIMBOLOS.length]}"/></svg>`;
  return { no, camada, base: Math.random() };
}

export function iniciarFundo({ reduzir = false } = {}) {
  const area = document.getElementById('fundo');
  if (!area) return;
  area.innerHTML = [1, 2, 3].map((n) => `<b class="fundo__aurora fundo__aurora--${n}"></b>`).join('');
  if (reduzir) return;
  const total = window.matchMedia('(max-width: 768px)').matches ? 10 : 21;
  const itens = Array.from({ length: total }, (_, i) => criarItem(i, total));
  area.append(...itens.map((item) => item.no));

  let rodando = false;
  const quadro = (agora) => {
    if (!rodando) return;
    const altura = window.innerHeight + MARGEM * 2;
    const rolagem = window.scrollY;
    const segundos = agora / 1000;
    itens.forEach(({ no, camada, base }) => {
      const y = resto(base * altura - rolagem * camada.parallax - segundos * camada.subida, altura) - MARGEM;
      no.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
    requestAnimationFrame(quadro);
  };
  const atualizar = () => {
    const deve = !document.hidden;
    if (deve && !rodando) {
      rodando = true;
      requestAnimationFrame(quadro);
    } else if (!deve) rodando = false;
  };
  document.addEventListener('visibilitychange', atualizar);
  atualizar();
}
