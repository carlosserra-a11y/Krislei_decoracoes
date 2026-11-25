// Confete em canvas 2D, leve e com limite de partículas.
const MAX_PARTICULAS = 220;
const CORES_PADRAO = ['#F29CB7', '#B9A3E3', '#9ADBC9', '#F8E58C', '#FFFFFF', '#D4AF37'];

let canvas = null;
let ctx = null;
let particulas = [];
let rodando = false;
let ultimo = 0;

const reduzir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function preparar() {
  canvas = canvas ?? document.getElementById('confete');
  if (!canvas) return false;
  ctx = ctx ?? canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== innerWidth * dpr || canvas.height !== innerHeight * dpr) {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return true;
}

function passo(agora) {
  const dt = Math.min((agora - ultimo) / 1000, 0.05);
  ultimo = agora;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particulas = particulas.filter((p) => p.vida > 0 && p.y < innerHeight + 40);
  for (const p of particulas) {
    p.vy += 900 * dt;
    p.vx *= 1 - 1.2 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    p.vida -= dt;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.vida * 1.6));
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.cor;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (particulas.length) requestAnimationFrame(passo);
  else {
    rodando = false;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

/** Solta confete a partir de (x, y) em pixels da janela. */
export function soltarConfete({ x = innerWidth / 2, y = innerHeight / 3, n = 60, cores = CORES_PADRAO } = {}) {
  if (reduzir() || !preparar()) return;
  const quantos = Math.min(n, MAX_PARTICULAS - particulas.length);
  for (let i = 0; i < quantos; i += 1) {
    const angulo = Math.random() * Math.PI * 2;
    const forca = 180 + Math.random() * 420;
    particulas.push({
      x, y, vx: Math.cos(angulo) * forca, vy: Math.sin(angulo) * forca - 260, rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 14, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, vida: 1.4 + Math.random() * 1.2,
      cor: cores[Math.floor(Math.random() * cores.length)],
    });
  }
  if (!rodando && particulas.length) {
    rodando = true;
    ultimo = performance.now();
    requestAnimationFrame(passo);
  }
}
