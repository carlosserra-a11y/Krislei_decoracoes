// Texturas do palco 3D desenhadas em canvas (sem arquivos de imagem).
const TAMANHO = 512;
const ESTRELADOS = ['marinho', 'pb', 'quinze'];

function semente(valor) {
  let s = valor;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Cria um canvas com textura; `desenhar(g, ...)` pode ser chamado de novo quando o tema muda. */
export function criarTextura(THREE, largura, altura, desenhar, { repetir } = {}) {
  const lona = document.createElement('canvas');
  lona.width = largura;
  lona.height = altura;
  const textura = new THREE.CanvasTexture(lona);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  if (repetir) {
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(...repetir);
  }
  const redesenhar = (...args) => {
    const g = lona.getContext('2d');
    g.clearRect(0, 0, largura, altura);
    desenhar(g, ...args);
    textura.needsUpdate = true;
  };
  return { textura, redesenhar };
}

/** Tecido ripado dos cilindros (cinza claro: a cor vem do material). */
export function desenharRipas(g) {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 64, 64);
  const gradiente = g.createLinearGradient(0, 0, 64, 0);
  gradiente.addColorStop(0, 'rgba(0,0,0,0.20)');
  gradiente.addColorStop(0.35, 'rgba(0,0,0,0)');
  gradiente.addColorStop(0.75, 'rgba(0,0,0,0.02)');
  gradiente.addColorStop(1, 'rgba(0,0,0,0.20)');
  g.fillStyle = gradiente;
  g.fillRect(0, 0, 64, 64);
}

/** Pelúcia do tapete (pontinhos claros e escuros). */
export function desenharPelucia(g) {
  const r = semente(77);
  g.fillStyle = '#ececec';
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5200; i += 1) {
    const claro = r() > 0.45;
    g.strokeStyle = claro ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.16)';
    g.lineWidth = 1 + r() * 1.6;
    const x = r() * 256;
    const y = r() * 256;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (r() - 0.5) * 9, y + (r() - 0.5) * 9);
    g.stroke();
  }
}

function flor(g, x, y, raio, petala, miolo, petalas) {
  g.save();
  g.translate(x, y);
  g.fillStyle = petala;
  for (let i = 0; i < petalas; i += 1) {
    g.rotate((Math.PI * 2) / petalas);
    g.beginPath();
    g.ellipse(0, -raio * 0.62, raio * (petalas > 6 ? 0.2 : 0.36), raio * 0.55, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = miolo;
  g.beginPath();
  g.arc(0, 0, raio * 0.24, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function brilho(g, x, y, raio, cor) {
  g.fillStyle = cor;
  g.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const r = i % 2 ? raio * 0.28 : raio;
    const a = (i * Math.PI) / 4;
    g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  g.closePath();
  g.fill();
}

/** Arte do painel redondo: flores nos temas claros, céu estrelado nos temas escuros. */
export function desenharPainel(g, tema) {
  const r = semente(tema.id.length * 31 + 5);
  const c = tema.cena;
  const fundo = g.createRadialGradient(TAMANHO * 0.4, TAMANHO * 0.3, 20, TAMANHO / 2, TAMANHO / 2, TAMANHO * 0.7);
  fundo.addColorStop(0, ESTRELADOS.includes(tema.id) ? tema.tokens.a2 : '#ffffff');
  fundo.addColorStop(1, ESTRELADOS.includes(tema.id) ? tema.cena.painel : c.painel2);
  g.fillStyle = fundo;
  g.fillRect(0, 0, TAMANHO, TAMANHO);
  if (ESTRELADOS.includes(tema.id)) {
    const cor = tema.cromo[0];
    for (let i = 0; i < 190; i += 1) brilho(g, r() * TAMANHO, r() * TAMANHO, 2 + r() * r() * 22, i % 3 ? cor : '#ffffff');
    return;
  }
  const petalas = tema.id === 'cerejeira' ? 5 : 11;
  const cores = tema.id === 'margaridas' ? ['#ffffff'] : [...tema.baloes.slice(0, 3), '#ffffff'];
  for (let i = 0; i < 46; i += 1) {
    flor(g, r() * TAMANHO, r() * TAMANHO, 14 + r() * r() * 56, cores[i % cores.length], '#f6c945', petalas);
  }
}

/** Letreiro dourado "Happy Birthday" (precisa da fonte manuscrita carregada). */
export function desenharLetreiro(g) {
  const ouro = g.createLinearGradient(0, 40, 0, 230);
  ouro.addColorStop(0, '#fff0b8');
  ouro.addColorStop(0.5, '#d4af37');
  ouro.addColorStop(1, '#9a7516');
  g.fillStyle = ouro;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,0.35)';
  g.shadowBlur = 6;
  g.shadowOffsetY = 4;
  g.font = '128px "Pinyon Script", cursive';
  g.fillText('Happy', 232, 80);
  g.fillText('Birthday', 280, 178);
}

/** Neon: o número/idade; sem número, um coração. */
export function desenharNeon(g, texto, cor) {
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const tracar = (largura, estilo, desfoque) => {
    g.shadowColor = cor;
    g.shadowBlur = desfoque;
    g.strokeStyle = estilo;
    g.lineWidth = largura;
    if (texto) {
      g.font = `700 ${texto.length > 2 ? 190 : 300}px Fraunces, Georgia, serif`;
      g.strokeText(texto, 256, 270);
      return;
    }
    g.beginPath();
    g.moveTo(256, 400);
    g.bezierCurveTo(60, 270, 110, 120, 256, 210);
    g.bezierCurveTo(402, 120, 452, 270, 256, 400);
    g.stroke();
  };
  tracar(26, cor, 55);
  tracar(12, '#ffffff', 16);
}

/** Pontos de luz da pista de LED. `fase` gera duas distribuições que piscam alternadas. */
export function desenharLuzes(g, fase) {
  const r = semente(100 + fase);
  for (let i = 0; i < 150; i += 1) {
    const x = r() * 512;
    const y = r() * 256;
    const raio = 2 + r() * 4;
    const luz = g.createRadialGradient(x, y, 0, x, y, raio * 2.4);
    luz.addColorStop(0, 'rgba(255,240,200,1)');
    luz.addColorStop(0.4, 'rgba(255,190,90,0.75)');
    luz.addColorStop(1, 'rgba(255,160,60,0)');
    g.fillStyle = luz;
    g.fillRect(x - raio * 3, y - raio * 3, raio * 6, raio * 6);
  }
}
