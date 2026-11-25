// Palco 3D do assistente: um cenário feito só com formas simples, que recolore e liga/desliga peças.
import { temaPorId, fotoUrl } from './dados.js';

const CHAVES = ['arco', 'redondo', 'cilindros', 'baloes', 'neon', 'tapete'];
const FOTO_FALLBACK_LARGURA = 960;

function temWebgl() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Alternativa sem 3D: mostra a foto de capa do tema escolhido. */
export function iniciarEstudioEstatico({ canvas, imagem }) {
  canvas.hidden = true;
  imagem.hidden = false;
  const mostrar = (id) => {
    const tema = temaPorId(id);
    imagem.src = fotoUrl(tema.capa, FOTO_FALLBACK_LARGURA);
    imagem.alt = `Exemplo de cenário no tema ${tema.nome}`;
  };
  document.addEventListener('tema:mudou', ({ detail }) => mostrar(detail.tema.id));
  mostrar(document.documentElement.dataset.tema || 'padrao');
}

export async function iniciarEstudio({ canvas, palco, inicial }) {
  if (!temWebgl()) throw new Error('sem-webgl');
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 2.3, 10.8);
  camera.lookAt(0, 1.55, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const sol = new THREE.DirectionalLight(0xffffff, 1.3);
  sol.position.set(3, 6, 5);
  cena.add(sol, new THREE.HemisphereLight(0xffffff, 0xffe3ee, 0.7));

  const palcoGrupo = new THREE.Group();
  cena.add(palcoGrupo);

  // ----- materiais (as cores mudam com o tema) -----
  const cor = (hex) => new THREE.Color(hex);
  const mats = {
    painel: new THREE.MeshStandardMaterial({ roughness: 0.65 }),
    painel2: new THREE.MeshStandardMaterial({ roughness: 0.6 }),
    cilindro: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    cilindro2: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    tapete: new THREE.MeshStandardMaterial({ roughness: 1 }),
  };
  const ouro = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.25 });
  const alvos = Object.fromEntries(Object.keys(mats).map((k) => [k, new THREE.Color()]));

  const partes = {};
  const novaParte = (chave, x, y, z) => {
    const grupo = new THREE.Group();
    grupo.position.set(x, y, z);
    grupo.scale.setScalar(0.001);
    palcoGrupo.add(grupo);
    partes[chave] = { grupo, atual: 0, alvo: 1 };
    return grupo;
  };

  // tapete
  const tapete = novaParte('tapete', 0, 0.03, 0.2);
  tapete.add(new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.06, 56), mats.tapete));

  // painel em arco
  const forma = new THREE.Shape();
  forma.moveTo(-1.1, 0);
  forma.lineTo(-1.1, 2.4);
  forma.absarc(0, 2.4, 1.1, Math.PI, 0, true);
  forma.lineTo(1.1, 0);
  forma.closePath();
  const arco = novaParte('arco', -1.0, 0.06, -1.1);
  arco.add(new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: 0.1, bevelEnabled: false, curveSegments: 32 }), mats.painel));

  // painel redondo
  const redondo = novaParte('redondo', 0.95, 2.35, -1.25);
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.08, 56), mats.painel2);
  disco.rotation.x = Math.PI / 2;
  const aro = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.04, 10, 72), ouro);
  redondo.add(disco, aro);

  // cilindros (cada um é uma parte com pivô na base)
  const cilindros = novaParte('cilindros', 0, 0.06, 0);
  [
    { x: -1.4, z: 0.55, r: 0.45, h: 0.8, m: 'cilindro' },
    { x: 0, z: 0.8, r: 0.5, h: 1.25, m: 'cilindro2' },
    { x: 1.4, z: 0.5, r: 0.42, h: 0.6, m: 'cilindro' },
  ].forEach(({ x, z, r, h, m }) => {
    const corpo = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40), mats[m]);
    corpo.position.set(x, h / 2, z);
    const prato = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.72, 0.04, 40), ouro);
    prato.position.set(x, h + 0.03, z);
    cilindros.add(corpo, prato);
  });

  // guirlanda de balões ao redor do arco
  const baloes = novaParte('baloes', -1.0, 2.5, -1.0);
  const esfera = new THREE.SphereGeometry(1, 24, 18);
  const matBaloes = Array.from({ length: 5 }, () => new THREE.MeshPhysicalMaterial({ roughness: 0.5, clearcoat: 0.6, envMapIntensity: 0.9 }));
  const matCromo = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.14, envMapIntensity: 1.2 });
  const alvosBaloes = matBaloes.map(() => new THREE.Color());
  const alvoCromo = new THREE.Color();
  for (let i = 0; i < 16; i += 1) {
    const ang = THREE.MathUtils.lerp(1.12 * Math.PI, -0.12 * Math.PI, i / 15);
    const tamanho = 0.18 + ((i * 37) % 17) / 17 * 0.17;
    const balao = new THREE.Mesh(esfera, i % 5 === 2 ? matCromo : matBaloes[i % 5]);
    balao.scale.set(tamanho, tamanho * 1.12, tamanho);
    balao.position.set(Math.cos(ang) * 1.45, Math.sin(ang) * 1.15 + 0.05, ((i * 13) % 7) / 7 * 0.5 - 0.25);
    baloes.add(balao);
  }

  // neon (textura de canvas num plano, para girar junto com o cenário)
  const lona = document.createElement('canvas');
  lona.width = 512;
  lona.height = 512;
  const textura = new THREE.CanvasTexture(lona);
  textura.colorSpace = THREE.SRGBColorSpace;
  const neon = novaParte('neon', -1.0, 1.9, -0.88);
  neon.add(new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: textura, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  let neonTexto = null;
  let neonCor = null;

  function desenharNeon(texto, brilho) {
    if (texto === neonTexto && brilho === neonCor) return;
    neonTexto = texto;
    neonCor = brilho;
    const g = lona.getContext('2d');
    g.clearRect(0, 0, 512, 512);
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const tracar = (largura, estilo, desfoque) => {
      g.shadowColor = brilho;
      g.shadowBlur = desfoque;
      g.strokeStyle = estilo;
      g.lineWidth = largura;
      if (texto) {
        g.font = `700 ${texto.length > 2 ? 190 : 300}px Fraunces, Georgia, serif`;
        g.strokeText(texto, 256, 270);
      } else {
        g.beginPath();
        g.moveTo(256, 400);
        g.bezierCurveTo(60, 270, 110, 120, 256, 210);
        g.bezierCurveTo(402, 120, 452, 270, 256, 400);
        g.stroke();
      }
    };
    tracar(26, brilho, 50);
    tracar(14, '#ffffff', 18);
    textura.needsUpdate = true;
  }

  // ----- interação (arrastar para girar) -----
  let rotAlvo = 0;
  let arrastando = false;
  let inicioX = 0;
  let rotInicio = 0;
  let ultimaInteracao = -10;
  const LIMITE = 0.85;

  const aoPressionar = (e) => {
    arrastando = true;
    inicioX = e.clientX;
    rotInicio = rotAlvo;
    ultimaInteracao = tempo;
    canvas.setPointerCapture?.(e.pointerId);
  };
  const aoMover = (e) => {
    if (!arrastando) return;
    rotAlvo = Math.max(-LIMITE, Math.min(LIMITE, rotInicio + (e.clientX - inicioX) / 160));
    ultimaInteracao = tempo;
  };
  const aoSoltar = () => { arrastando = false; };
  canvas.addEventListener('pointerdown', aoPressionar);
  canvas.addEventListener('pointermove', aoMover);
  canvas.addEventListener('pointerup', aoSoltar);
  canvas.addEventListener('pointercancel', aoSoltar);

  // ----- atualização a partir do assistente -----
  function atualizar({ temaId, cenas, numero }) {
    const tema = temaPorId(temaId);
    const c = tema.cena;
    Object.keys(alvos).forEach((k) => alvos[k].set(c[k]));
    alvosBaloes.forEach((cb, i) => cb.set(tema.baloes[i % tema.baloes.length]));
    alvoCromo.set(tema.cromo[0]);
    CHAVES.forEach((chave) => { partes[chave].alvo = cenas.includes(chave) ? 1 : 0; });
    const texto = String(numero ?? '');
    partes.neon.alvo = cenas.includes('neon') ? 1 : 0;
    desenharNeon(texto, c.neon);
  }

  // ----- laço -----
  let tempo = 0;
  let ultimo = 0;
  let rodando = false;
  let visivel = true;
  let primeira = true;

  function quadro(agora) {
    if (!rodando) return;
    const dt = Math.min((agora - ultimo) / 1000, 0.05);
    ultimo = agora;
    tempo += dt;
    if (!arrastando && tempo - ultimaInteracao > 3) rotAlvo = Math.sin(tempo * 0.35) * 0.35;
    palcoGrupo.rotation.y += (rotAlvo - palcoGrupo.rotation.y) * Math.min(1, dt * 4);
    const k = primeira ? 1 : 1 - Math.exp(-dt * 5);
    primeira = false;
    Object.keys(mats).forEach((nome) => mats[nome].color.lerp(alvos[nome], k));
    matBaloes.forEach((m, i) => m.color.lerp(alvosBaloes[i], k));
    matCromo.color.lerp(alvoCromo, k);
    Object.values(partes).forEach((p) => {
      p.atual += (p.alvo - p.atual) * Math.min(1, dt * 7);
      p.grupo.visible = p.atual > 0.02;
      p.grupo.scale.setScalar(Math.max(0.001, p.atual));
    });
    renderer.render(cena, camera);
    requestAnimationFrame(quadro);
  }

  function atualizarLaco() {
    const deve = visivel && !document.hidden;
    if (deve && !rodando) {
      rodando = true;
      ultimo = performance.now();
      requestAnimationFrame(quadro);
    } else if (!deve) rodando = false;
  }

  function redimensionar() {
    const caixa = palco.getBoundingClientRect();
    const w = Math.max(1, caixa.width);
    const h = Math.max(1, caixa.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(palco);
  const observadorVisivel = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; atualizarLaco(); });
  observadorVisivel.observe(palco);
  document.addEventListener('visibilitychange', atualizarLaco);

  redimensionar();
  if (inicial) atualizar(inicial);
  atualizarLaco();

  return {
    atualizar,
    destruir() {
      rodando = false;
      observadorTamanho.disconnect();
      observadorVisivel.disconnect();
      document.removeEventListener('visibilitychange', atualizarLaco);
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
