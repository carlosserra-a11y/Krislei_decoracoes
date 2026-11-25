// Palco 3D do assistente: câmera que gira ao redor do cenário, luz com sombras e controles.
import { temaPorId, fotoUrl } from './dados.js';
import { criarModelos } from './estudio-modelos.js';

const FOV = 34;
const ALVO_Y = 1.8;
const MEIA_LARGURA = 3.4;
const VISTA = Object.freeze({ giro: 0, altura: 0.14, zoom: 1 });
const PASSO_GIRO = Math.PI / 4;
const PAUSA_APOS_TOQUE = 4;
const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

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
  document.getElementById('palco-controles')?.setAttribute('hidden', '');
  document.getElementById('palco-dica')?.setAttribute('hidden', '');
  const mostrar = (id) => {
    const tema = temaPorId(id);
    imagem.src = fotoUrl(tema.capa, 960);
    imagem.alt = `Exemplo de cenário no tema ${tema.nome}`;
  };
  document.addEventListener('tema:mudou', ({ detail }) => mostrar(detail.tema.id));
  mostrar(document.documentElement.dataset.tema || 'padrao');
}

/** Estado do giro: arrastar (com inércia), passos por botão/teclado e balanço automático. */
function criarOrbita() {
  const o = { ...VISTA, destino: null, velocidade: 0, auto: true, arrastando: false, parado: 99, fase: 0 };
  return {
    estado: o,
    interagir() { o.parado = 0; },
    girar(delta) {
      o.destino = (o.destino ?? o.giro) + delta;
      o.velocidade = 0;
      o.parado = 0;
    },
    aproximar(delta) { o.zoom = limitar(o.zoom + delta, 0.62, 1.3); },
    inclinar(delta) { o.altura = limitar(o.altura + delta, -0.04, 0.6); o.parado = 0; },
    reiniciar() {
      o.giro = Math.atan2(Math.sin(o.giro), Math.cos(o.giro));
      Object.assign(o, { destino: 0, velocidade: 0, altura: VISTA.altura, zoom: VISTA.zoom, auto: true, parado: PAUSA_APOS_TOQUE - 1.5, fase: 0 });
    },
    atualizar(dt) {
      if (o.arrastando) return;
      o.parado += dt;
      if (o.destino !== null) {
        o.giro += (o.destino - o.giro) * Math.min(1, dt * 6);
        if (Math.abs(o.destino - o.giro) < 0.004) o.destino = null;
        return;
      }
      o.giro += o.velocidade * dt;
      o.velocidade *= Math.exp(-dt * 2.4);
      if (!o.auto || o.parado < PAUSA_APOS_TOQUE || Math.abs(o.velocidade) > 0.05) return;
      // volta pelo caminho mais curto e balança de um lado ao outro, sem mostrar as costas do cenário
      o.giro = Math.atan2(Math.sin(o.giro), Math.cos(o.giro));
      o.fase += dt;
      const alvo = Math.sin(o.fase * 0.42) * 0.62;
      o.giro += (alvo - o.giro) * Math.min(1, dt * 1.4);
      o.altura += (VISTA.altura - o.altura) * Math.min(1, dt);
    },
  };
}

function ligarControles({ canvas, palco, orbita }) {
  const o = orbita.estado;
  const dica = palco.querySelector('#palco-dica');
  const botoes = palco.querySelector('#palco-controles');
  const botaoAuto = botoes?.querySelector('[data-cena="auto"]');
  const tocou = () => { orbita.interagir(); dica?.classList.add('some'); };
  let ultimo = null;

  canvas.addEventListener('pointerdown', (e) => {
    o.arrastando = true;
    o.destino = null;
    o.velocidade = 0;
    ultimo = { x: e.clientX, y: e.clientY, t: performance.now() };
    canvas.setPointerCapture?.(e.pointerId);
    tocou();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!o.arrastando || !ultimo) return;
    const agora = performance.now();
    const passo = -(e.clientX - ultimo.x) * 0.008;
    o.giro += passo;
    o.velocidade = limitar(passo / Math.max(0.016, (agora - ultimo.t) / 1000), -7, 7);
    if (e.pointerType === 'mouse') orbita.inclinar((e.clientY - ultimo.y) * 0.004);
    ultimo = { x: e.clientX, y: e.clientY, t: agora };
  });
  const soltar = () => {
    if (ultimo && performance.now() - ultimo.t > 120) o.velocidade = 0;
    o.arrastando = false;
    ultimo = null;
    orbita.interagir();
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.addEventListener('dblclick', () => orbita.reiniciar());

  const mostrarAuto = () => {
    botaoAuto?.setAttribute('aria-pressed', String(o.auto));
    botaoAuto?.querySelector('use')?.setAttribute('href', o.auto ? '#i-pause' : '#i-play');
  };
  const acoes = {
    esq: () => orbita.girar(-PASSO_GIRO),
    dir: () => orbita.girar(PASSO_GIRO),
    mais: () => orbita.aproximar(-0.12),
    menos: () => orbita.aproximar(0.12),
    reset: () => orbita.reiniciar(),
    auto: () => { o.auto = !o.auto; o.parado = PAUSA_APOS_TOQUE; o.velocidade = 0; o.destino = null; },
  };
  botoes?.addEventListener('click', (e) => {
    const nome = e.target.closest('[data-cena]')?.dataset.cena;
    if (!acoes[nome]) return;
    acoes[nome]();
    dica?.classList.add('some');
    mostrarAuto();
  });
  const teclas = {
    ArrowLeft: acoes.esq, ArrowRight: acoes.dir, '+': acoes.mais, '=': acoes.mais, '-': acoes.menos, Home: acoes.reset,
    ArrowUp: () => orbita.inclinar(0.08), ArrowDown: () => orbita.inclinar(-0.08),
  };
  canvas.addEventListener('keydown', (e) => {
    if (!teclas[e.key]) return;
    e.preventDefault();
    teclas[e.key]();
    mostrarAuto();
  });
}

function montarLuzes(THREE, cena, comSombra) {
  const principal = new THREE.DirectionalLight(0xffffff, 1.7);
  principal.position.set(3.5, 7.5, 6);
  principal.castShadow = comSombra;
  principal.shadow.mapSize.set(1024, 1024);
  Object.assign(principal.shadow.camera, { left: -5, right: 5, top: 6, bottom: -3, near: 1, far: 22 });
  principal.shadow.bias = -0.0004;
  principal.shadow.normalBias = 0.025;
  principal.shadow.radius = 5;
  const preenchimento = new THREE.DirectionalLight(0xffe4f0, 0.5);
  preenchimento.position.set(-6, 3, 3);
  cena.add(principal, preenchimento, new THREE.HemisphereLight(0xffffff, 0xf3d3e0, 0.45));
  const piso = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.ShadowMaterial({ opacity: 0.2 }));
  piso.rotation.x = -Math.PI / 2;
  piso.receiveShadow = true;
  cena.add(piso);
}

export async function iniciarEstudio({ canvas, palco, inicial }) {
  if (!temWebgl()) throw new Error('sem-webgl');
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const movel = window.matchMedia('(max-width: 768px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, movel ? 1.6 : 2));
  renderer.shadowMap.enabled = !movel;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  const cena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
  montarLuzes(THREE, cena, !movel);
  const modelos = criarModelos(THREE);
  cena.add(modelos.grupo);

  const orbita = criarOrbita();
  ligarControles({ canvas, palco, orbita });
  let distanciaBase = 11;

  function posicionarCamera() {
    const { giro, altura, zoom } = orbita.estado;
    const d = distanciaBase * zoom;
    camera.position.set(Math.sin(giro) * Math.cos(altura) * d, ALVO_Y + Math.sin(altura) * d, Math.cos(giro) * Math.cos(altura) * d);
    camera.lookAt(0, ALVO_Y, 0);
  }

  function redimensionar() {
    const caixa = palco.getBoundingClientRect();
    const w = Math.max(1, caixa.width);
    const h = Math.max(1, caixa.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    distanciaBase = Math.max(10.6, MEIA_LARGURA / (Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * camera.aspect));
  }

  function atualizar({ temaId, cenas, numero }) {
    modelos.definirTema(temaPorId(temaId), numero);
    Object.entries(modelos.partes).forEach(([chave, parte]) => { parte.alvo = cenas.includes(chave) ? 1 : 0; });
  }

  let tempo = 0;
  let ultimo = 0;
  let rodando = false;
  let visivel = true;

  function quadro(agora) {
    if (!rodando) return;
    const dt = Math.min((agora - ultimo) / 1000, 0.05);
    ultimo = agora;
    tempo += dt;
    orbita.atualizar(dt);
    modelos.animar(tempo, dt);
    posicionarCamera();
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

  new ResizeObserver(redimensionar).observe(palco);
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; atualizarLaco(); }).observe(palco);
  document.addEventListener('visibilitychange', atualizarLaco);

  redimensionar();
  atualizar(inicial ?? { temaId: 'padrao', cenas: ['tapete', 'arco', 'redondo', 'cilindros', 'baloes'], numero: '' });
  atualizarLaco();
  return { atualizar };
}
