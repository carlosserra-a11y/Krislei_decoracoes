// Guirlanda de balões orgânicos em 3D para o hero (Three.js, carregado sob demanda).
const FOV = 40;
const Z_CAMERA = 12;
const TEMPO_ESTOURO = 0.22;
const TEMPO_RENASCER = 6;
const MAX_CONFETES = 160;

function semente(valor) {
  let s = valor;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function temWebgl() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const suavizar = (u) => 1 - (1 - Math.min(1, Math.max(0, u))) ** 3;

/** Fator de escala do balão em cada fase (vivo, estourando, morto, nascendo). */
function fatorEscala(m, t) {
  if (!m.ativo) return 0;
  if (m.estado === 'estourando') {
    const u = (t - m.t0) / TEMPO_ESTOURO;
    if (u >= 1) {
      m.estado = 'morto';
      m.t0 = t;
      return 0;
    }
    return u < 0.3 ? 1 + (u / 0.3) * 0.25 : 1.25 * (1 - (u - 0.3) / 0.7);
  }
  if (m.estado === 'morto') {
    if (t - m.t0 < TEMPO_RENASCER) return 0;
    m.estado = 'nascendo';
    m.t0 = t;
  }
  if (m.estado === 'nascendo') {
    const u = (t - m.t0) / 0.9;
    if (u >= 1) m.estado = 'vivo';
    return suavizar(u);
  }
  return 1;
}

export async function iniciarBaloes({ canvas, hero, tema, aoEstourar }) {
  if (!temWebgl()) throw new Error('sem-webgl');
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

  const movel = window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4;
  const total = movel ? 24 : 40;
  let dprMax = movel ? 1.5 : 2;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !movel, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, Z_CAMERA);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const sol = new THREE.DirectionalLight(0xffffff, 1.5);
  sol.position.set(3, 5, 7);
  scene.add(sol, new THREE.HemisphereLight(0xffffff, 0xffd6e8, 0.6));

  // ----- balões -----
  const grupo = new THREE.Group();
  scene.add(grupo);
  const aleatorio = semente(2611);
  const metas = Array.from({ length: total }, (_, i) => ({
    i,
    tipo: i % 7 === 0 ? 'cromo' : i % 9 === 4 ? 'bolha' : 'fosco',
    r: aleatorio(), fase: aleatorio() * Math.PI * 2, jx: aleatorio() - 0.5, jy: aleatorio() - 0.5, jz: aleatorio() - 0.5,
    hx: 0, hy: 0, hz: 0, s: 1, ox: 0, oy: 0, vx: 0, vy: 0, estado: 'vivo', t0: 0, ativo: true, cor: new THREE.Color(), idx: 0,
  }));
  const materiais = {
    fosco: new THREE.MeshPhysicalMaterial({ roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.25, envMapIntensity: 0.9 }),
    cromo: new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.12, envMapIntensity: 1.25 }),
    bolha: new THREE.MeshPhysicalMaterial({ roughness: 0.05, transparent: true, opacity: 0.3, clearcoat: 1, envMapIntensity: 1.5, depthWrite: false }),
  };
  const esfera = new THREE.SphereGeometry(1, 28, 20);
  const geoNo = new THREE.ConeGeometry(0.16, 0.3, 10);
  const matNo = new THREE.MeshStandardMaterial({ roughness: 0.6 });
  const malhas = {};
  ['fosco', 'cromo', 'bolha'].forEach((tipo) => {
    const lista = metas.filter((m) => m.tipo === tipo);
    lista.forEach((m, k) => { m.idx = k; });
    const malha = new THREE.InstancedMesh(esfera, materiais[tipo], Math.max(1, lista.length));
    malha.count = lista.length;
    malha.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    malhas[tipo] = malha;
    grupo.add(malha);
  });
  const nos = new THREE.InstancedMesh(geoNo, matNo, total);
  nos.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  grupo.add(nos);

  // ----- confete 3D -----
  const posicoes = new Float32Array(MAX_CONFETES * 3).fill(999);
  const cores = new Float32Array(MAX_CONFETES * 3);
  const confetes = Array.from({ length: MAX_CONFETES }, () => ({ vx: 0, vy: 0, vz: 0, vida: 0 }));
  const geoConfete = new THREE.BufferGeometry();
  geoConfete.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
  geoConfete.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  const matConfete = new THREE.PointsMaterial({ size: 0.25, vertexColors: true, sizeAttenuation: true, transparent: true, depthWrite: false });
  const pontos = new THREE.Points(geoConfete, matConfete);
  pontos.frustumCulled = false;
  scene.add(pontos);

  // ----- estado -----
  let temaAtual = tema;
  let mudando = false;
  let mundoAltura = 8;
  let unidade = 0.5;
  let wpp = 0.01;
  let rolagem = 0;
  let tempo = 0;
  let ultimo = 0;
  let contador = 0;
  let degradado = false;
  const ponteiro = { x: 0, y: 0, nx: 0, ny: 0, ativo: false };
  const dummy = new THREE.Object3D();

  function corAlvo(m, t) {
    if (m.tipo === 'cromo') return new THREE.Color(t.cromo[m.i % 2]);
    if (m.tipo === 'bolha') return new THREE.Color('#ffffff').lerp(new THREE.Color(t.baloes[0]), 0.25);
    return new THREE.Color(t.baloes[m.i % t.baloes.length]);
  }

  function layout() {
    const caixa = canvas.getBoundingClientRect();
    const w = Math.max(1, caixa.width);
    const h = Math.max(1, caixa.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mundoAltura = 2 * Z_CAMERA * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    wpp = mundoAltura / h;
    const arcos = hero.querySelector('[data-hero-arcos]')?.getBoundingClientRect();
    if (!arcos) return;
    const cx = (arcos.left + arcos.width / 2 - caixa.left - w / 2) * wpp;
    const cy = -(arcos.top + arcos.height / 2 - caixa.top - h / 2) * wpp;
    const rx = arcos.width * 0.57 * wpp;
    const ry = arcos.height * 0.6 * wpp;
    unidade = arcos.width * wpp * 0.07;
    matConfete.size = unidade * 0.55;
    metas.forEach((m, i) => {
      const ang = THREE.MathUtils.lerp(1.14 * Math.PI, -0.14 * Math.PI, i / (total - 1));
      m.hx = cx + rx * Math.cos(ang) + m.jx * unidade * 0.9;
      m.hy = cy + ry * Math.sin(ang) * 0.92 + m.jy * unidade * 0.9;
      m.hz = m.jz * 1.2;
      m.s = unidade * (0.55 + m.r * 1.05) * (m.tipo === 'bolha' ? 1.2 : 1);
    });
  }

  function definirCores(imediato) {
    metas.forEach((m) => {
      const alvo = corAlvo(m, temaAtual);
      m.alvo = alvo;
      if (imediato) m.cor.copy(alvo);
    });
    mudando = true;
  }

  function atualizarCores(dt) {
    if (!mudando) return;
    const k = 1 - Math.exp(-dt * 4);
    let diferenca = 0;
    metas.forEach((m) => {
      m.cor.lerp(m.alvo, k);
      diferenca += Math.abs(m.cor.r - m.alvo.r) + Math.abs(m.cor.g - m.alvo.g) + Math.abs(m.cor.b - m.alvo.b);
      malhas[m.tipo].setColorAt(m.idx, m.cor);
      nos.setColorAt(m.i, m.cor);
    });
    Object.values(malhas).forEach((malha) => { if (malha.instanceColor) malha.instanceColor.needsUpdate = true; });
    if (nos.instanceColor) nos.instanceColor.needsUpdate = true;
    if (diferenca < 0.004) mudando = false;
  }

  function atualizarBalao(m, dt) {
    const f = fatorEscala(m, tempo);
    const flutua = Math.sin(tempo * 0.8 + m.fase) * unidade * 0.18;
    const balanca = Math.cos(tempo * 0.6 + m.fase) * unidade * 0.1;
    if (ponteiro.ativo && f > 0) {
      const dx = m.hx + m.ox - ponteiro.x;
      const dy = m.hy + m.oy - (ponteiro.y - grupo.position.y);
      const dist = Math.hypot(dx, dy) || 0.001;
      const raio = m.s * 1.6 + unidade;
      if (dist < raio) {
        m.vx += (dx / dist) * (raio - dist) * 40 * dt;
        m.vy += (dy / dist) * (raio - dist) * 40 * dt;
      }
    }
    m.vx += (-m.ox * 9 - m.vx * 3.2) * dt;
    m.vy += (-m.oy * 9 - m.vy * 3.2) * dt;
    m.ox += m.vx * dt;
    m.oy += m.vy * dt;
    const x = m.hx + m.ox + balanca;
    const y = m.hy + m.oy + flutua;
    dummy.rotation.set(0, 0, Math.sin(tempo * 0.7 + m.fase) * 0.06);
    dummy.position.set(x, y, m.hz);
    dummy.scale.set(m.s * f, m.s * 1.12 * f, m.s * f);
    dummy.updateMatrix();
    malhas[m.tipo].setMatrixAt(m.idx, dummy.matrix);
    dummy.position.set(x, y - m.s * 1.2 * f, m.hz);
    dummy.scale.setScalar(m.s * f);
    dummy.updateMatrix();
    nos.setMatrixAt(m.i, dummy.matrix);
  }

  function atualizarConfetes(dt) {
    let vivo = false;
    confetes.forEach((c, i) => {
      if (c.vida <= 0) return;
      c.vida -= dt;
      c.vy -= unidade * 22 * dt;
      posicoes[i * 3] += c.vx * dt;
      posicoes[i * 3 + 1] += c.vy * dt;
      posicoes[i * 3 + 2] += c.vz * dt;
      if (c.vida <= 0) posicoes[i * 3] = 999;
      vivo = true;
    });
    if (vivo) geoConfete.attributes.position.needsUpdate = true;
  }

  function soltarConfetes(m) {
    const paleta = temaAtual.baloes.concat(temaAtual.cromo);
    let nascidos = 0;
    for (let i = 0; i < MAX_CONFETES && nascidos < 26; i += 1) {
      if (confetes[i].vida > 0) continue;
      const ang = Math.random() * Math.PI * 2;
      const forca = unidade * (3 + Math.random() * 5);
      confetes[i] = { vx: Math.cos(ang) * forca, vy: Math.sin(ang) * forca + unidade * 2, vz: (Math.random() - 0.5) * forca, vida: 1 + Math.random() * 0.8 };
      posicoes.set([m.hx + m.ox, m.hy + m.oy, m.hz], i * 3);
      const cor = new THREE.Color(paleta[Math.floor(Math.random() * paleta.length)]);
      cores.set([cor.r, cor.g, cor.b], i * 3);
      nascidos += 1;
    }
    geoConfete.attributes.color.needsUpdate = true;
    geoConfete.attributes.position.needsUpdate = true;
  }

  function estourar(m) {
    m.estado = 'estourando';
    m.t0 = tempo;
    soltarConfetes(m);
    contador += 1;
    aoEstourar?.(contador);
  }

  // ----- laço de render -----
  let rodando = false;
  let visivel = true;
  let somaDt = 0;
  let quadros = 0;

  function vigiarDesempenho(dt) {
    somaDt += dt;
    quadros += 1;
    if (somaDt < 2) return;
    const fps = quadros / somaDt;
    somaDt = 0;
    quadros = 0;
    if (fps >= 45 || degradado) return;
    degradado = true;
    dprMax = 1;
    renderer.setPixelRatio(1);
    metas.forEach((m, i) => { if (i % 3 === 0) m.ativo = false; });
  }

  function quadro(agora) {
    if (!rodando) return;
    const dt = Math.min((agora - ultimo) / 1000, 0.05);
    ultimo = agora;
    tempo += dt;
    const alvoY = ponteiro.ativo ? ponteiro.nx * 0.14 : 0;
    const alvoX = ponteiro.ativo ? -ponteiro.ny * 0.09 : 0;
    grupo.rotation.y += (alvoY - grupo.rotation.y) * Math.min(1, dt * 3);
    grupo.rotation.x += (alvoX - grupo.rotation.x) * Math.min(1, dt * 3);
    grupo.position.y = rolagem * mundoAltura * 0.55;
    camera.position.z = Z_CAMERA + rolagem * 2.4;
    atualizarCores(dt);
    metas.forEach((m) => atualizarBalao(m, dt));
    Object.values(malhas).forEach((malha) => { malha.instanceMatrix.needsUpdate = true; });
    nos.instanceMatrix.needsUpdate = true;
    atualizarConfetes(dt);
    renderer.render(scene, camera);
    vigiarDesempenho(dt);
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

  // ----- eventos -----
  const aoMover = (e) => {
    if (e.pointerType === 'touch') return;
    const c = canvas.getBoundingClientRect();
    ponteiro.x = (e.clientX - c.left - c.width / 2) * wpp;
    ponteiro.y = -(e.clientY - c.top - c.height / 2) * wpp;
    ponteiro.nx = (e.clientX - c.left) / c.width - 0.5;
    ponteiro.ny = (e.clientY - c.top) / c.height - 0.5;
    ponteiro.ativo = true;
  };
  const aoSair = () => { ponteiro.ativo = false; };
  const aoPressionar = (e) => {
    if (e.target.closest('a, button, input, label, summary')) return;
    const c = canvas.getBoundingClientRect();
    const px = (e.clientX - c.left - c.width / 2) * wpp;
    const py = -(e.clientY - c.top - c.height / 2) * wpp - grupo.position.y;
    const alvo = metas
      .filter((m) => m.ativo && (m.estado === 'vivo' || m.estado === 'nascendo'))
      .map((m) => ({ m, d: Math.hypot(m.hx + m.ox - px, m.hy + m.oy - py) }))
      .filter(({ m, d }) => d < m.s * 1.2)
      .sort((a, b) => a.d - b.d)[0];
    if (alvo) estourar(alvo.m);
  };
  hero.addEventListener('pointermove', aoMover);
  hero.addEventListener('pointerleave', aoSair);
  hero.addEventListener('pointerdown', aoPressionar);
  const observadorTamanho = new ResizeObserver(layout);
  observadorTamanho.observe(hero);
  const observadorVisivel = new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; atualizarLaco(); }, { threshold: 0 });
  observadorVisivel.observe(hero);
  document.addEventListener('visibilitychange', atualizarLaco);

  layout();
  definirCores(true);
  atualizarCores(0);
  atualizarLaco();

  return {
    definirTema(novo) {
      temaAtual = novo;
      definirCores(false);
    },
    definirRolagem(p) {
      rolagem = Math.min(1, Math.max(0, p));
    },
    destruir() {
      rodando = false;
      hero.removeEventListener('pointermove', aoMover);
      hero.removeEventListener('pointerleave', aoSair);
      hero.removeEventListener('pointerdown', aoPressionar);
      observadorTamanho.disconnect();
      observadorVisivel.disconnect();
      document.removeEventListener('visibilitychange', atualizarLaco);
      [esfera, geoNo, geoConfete, ...Object.values(materiais), matNo, matConfete].forEach((o) => o.dispose());
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
