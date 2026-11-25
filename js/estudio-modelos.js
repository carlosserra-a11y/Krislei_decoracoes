// Peças do palco 3D, construídas só com código: cada uma é um grupo que o assistente liga ou desliga.
import * as tex from './estudio-texturas.js';

export function criarModelos(THREE) {
  const grupo = new THREE.Group();
  const partes = {};
  const animados = [];
  const tingidos = [];
  const { MathUtils } = THREE;

  // ----- materiais -----
  const padrao = (opcoes) => new THREE.MeshStandardMaterial({ roughness: 0.62, ...opcoes });
  /** Material cuja cor acompanha o tema (com transição suave). */
  const tingido = (cor, opcoes) => {
    const material = padrao(opcoes);
    tingidos.push({ material, cor, alvo: new THREE.Color() });
    return material;
  };
  const ripas = tex.criarTextura(THREE, 64, 64, tex.desenharRipas, { repetir: [16, 1] });
  const pelucia = tex.criarTextura(THREE, 256, 256, tex.desenharPelucia, { repetir: [3, 3] });
  const arte = tex.criarTextura(THREE, 512, 512, tex.desenharPainel);
  const letreiro = tex.criarTextura(THREE, 512, 256, tex.desenharLetreiro);
  const neon = tex.criarTextura(THREE, 512, 512, tex.desenharNeon);
  ripas.redesenhar();
  pelucia.redesenhar();

  const m = {
    painel: tingido((t) => t.cena.painel),
    painelClaro: tingido((t) => new THREE.Color(t.cena.painel).lerp(new THREE.Color('#ffffff'), 0.24)),
    painel2: tingido((t) => t.cena.painel2),
    cil: tingido((t) => t.cena.cilindro, { map: ripas.textura }),
    cil2: tingido((t) => t.cena.cilindro2, { map: ripas.textura }),
    tapete: tingido((t) => t.cena.tapete, { map: pelucia.textura, bumpMap: pelucia.textura, bumpScale: 3, roughness: 1 }),
    cobertura: tingido((t) => t.tokens.a1, { roughness: 0.35 }),
    baloes: [0, 1, 2, 3, 4].map((i) => {
      const material = new THREE.MeshPhysicalMaterial({ roughness: 0.42, clearcoat: 0.8, clearcoatRoughness: 0.2 });
      tingidos.push({ material, cor: (t) => t.baloes[i % t.baloes.length], alvo: new THREE.Color() });
      return material;
    }),
    cromo: tingido((t) => t.cromo[0], { metalness: 1, roughness: 0.12 }),
    ouro: padrao({ color: 0xd4af37, metalness: 1, roughness: 0.22 }),
    branco: padrao({ color: 0xfaf6f2, roughness: 0.55 }),
    verde: padrao({ color: 0x3f8a46, roughness: 0.9, flatShading: true }),
    cereja: padrao({ color: 0xc4123c, roughness: 0.25 }),
    bolha: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transparent: true, opacity: 0.24, clearcoat: 1, envMapIntensity: 2, depthWrite: false }),
  };

  // ----- ajudantes -----
  const malha = (geometria, material, [x, y, z] = [0, 0, 0], destino) => {
    const obj = new THREE.Mesh(geometria, material);
    obj.position.set(x, y, z);
    const solido = !material.transparent;
    obj.castShadow = solido;
    obj.receiveShadow = solido;
    destino?.add(obj);
    return obj;
  };
  const cilindro = (rt, rb, h, segmentos = 40) => new THREE.CylinderGeometry(rt, rb, h, segmentos);
  const esfera = (r, a = 28, b = 20) => new THREE.SphereGeometry(r, a, b);
  const caixa = (x, y, z) => new THREE.BoxGeometry(x, y, z);
  const parte = (chave, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(0.001);
    grupo.add(g);
    partes[chave] = { grupo: g, atual: 0, alvo: 0 };
    return g;
  };
  const flutuar = (obj, amplitude, velocidade, fase) => animados.push({ obj, y: obj.position.y, amplitude, velocidade, fase });

  // ----- construtores -----
  function tapete() {
    const g = parte('tapete', 0, 0, 0.25);
    malha(cilindro(3.05, 3.12, 0.09, 72), m.tapete, [0, 0.045, 0], g);
  }

  function formaArco(largura, reta) {
    const r = largura / 2;
    const f = new THREE.Shape();
    f.moveTo(-r, 0);
    f.lineTo(-r, reta);
    f.absarc(0, reta, r, Math.PI, 0, true);
    f.lineTo(r, 0);
    f.closePath();
    return f;
  }

  function arco() {
    const g = parte('arco', -1.05, 0.09, -1.15);
    const relevo = { bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 48 };
    malha(new THREE.ExtrudeGeometry(formaArco(2.3, 2.45), { depth: 0.1, ...relevo }), m.painel, [0, 0, 0], g);
    malha(new THREE.ExtrudeGeometry(formaArco(1.96, 2.45), { depth: 0.03, ...relevo, bevelSize: 0.01, bevelThickness: 0.01 }), m.painelClaro, [0, 0.12, 0.12], g);
    const pontos = formaArco(1.96, 2.45).getPoints(64).map((p) => new THREE.Vector3(p.x, p.y + 0.12, 0.17));
    malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos.slice(0, -1), false, 'catmullrom', 0.05), 180, 0.016, 8), m.ouro, [0, 0, 0], g);
  }

  function placaLetreiro() {
    const g = parte('letreiro', -1.05, 2.98, -0.9);
    const material = new THREE.MeshBasicMaterial({ map: letreiro.textura, transparent: true, depthWrite: false });
    malha(new THREE.PlaneGeometry(1.55, 0.78), material, [0, 0, 0], g);
    const desenhar = () => letreiro.redesenhar();
    desenhar();
    document.fonts?.load('128px "Pinyon Script"').then(desenhar, desenhar);
  }

  function painelRedondo() {
    const g = parte('redondo', 1.2, 2.3, -1.42);
    const frente = padrao({ map: arte.textura, roughness: 0.75 });
    const disco = malha(new THREE.CylinderGeometry(1.3, 1.3, 0.09, 80), [m.painel2, frente, m.painel2], [0, 0, 0], g);
    disco.rotation.x = Math.PI / 2;
    malha(new THREE.TorusGeometry(1.32, 0.035, 12, 96), m.ouro, [0, 0, 0.04], g);
    [-0.55, 0.55].forEach((x) => malha(cilindro(0.025, 0.025, 1.2, 12), m.ouro, [x, -1.7, -0.06], g));
  }

  const MESAS = [
    { x: -1.5, z: 0.5, r: 0.46, h: 0.85, material: 'cil' },
    { x: 0.02, z: 0.9, r: 0.53, h: 1.28, material: 'cil2' },
    { x: 1.52, z: 0.48, r: 0.44, h: 0.62, material: 'cil' },
  ];

  function mesas() {
    const g = parte('cilindros', 0, 0.09, 0);
    MESAS.forEach(({ x, z, r, h, material }) => {
      malha(cilindro(r, r, h, 64), m[material], [x, h / 2, z], g);
      malha(cilindro(r * 1.03, r * 1.03, 0.045, 64), m.branco, [x, h + 0.015, z], g);
      const aro = malha(new THREE.TorusGeometry(r * 1.03, 0.014, 10, 64), m.ouro, [x, h + 0.04, z], g);
      aro.rotation.x = Math.PI / 2;
    });
  }

  function prato(destino, x, y, z, raio) {
    malha(cilindro(raio * 0.45, raio * 0.55, 0.025), m.ouro, [x, y + 0.012, z], destino);
    malha(cilindro(0.035, 0.055, 0.13, 16), m.ouro, [x, y + 0.09, z], destino);
    malha(cilindro(raio, raio * 0.9, 0.03), m.ouro, [x, y + 0.165, z], destino);
    return y + 0.18;
  }

  function andar(destino, x, y, z, raio, altura) {
    malha(cilindro(raio, raio, altura, 48), m.painelClaro, [x, y + altura / 2, z], destino);
    const borda = malha(new THREE.TorusGeometry(raio * 0.98, 0.028, 10, 48), m.cobertura, [x, y + altura, z], destino);
    borda.rotation.x = Math.PI / 2;
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 14) * Math.PI * 2;
      const gota = malha(esfera(0.024, 10, 8), m.cobertura, [x + Math.cos(a) * raio, y + altura - 0.05 - (i % 3) * 0.014, z + Math.sin(a) * raio], destino);
      gota.scale.y = 1.8;
      malha(esfera(0.014, 8, 6), m.ouro, [x + Math.cos(a) * raio * 1.01, y + 0.025, z + Math.sin(a) * raio * 1.01], destino);
    }
    return y + altura;
  }

  function doces() {
    const g = parte('doces', 0, 0.09, 0);
    const [esq, meio, dir] = MESAS;
    // bolo de dois andares
    let topo = prato(g, meio.x, meio.h + 0.04, meio.z, 0.38);
    topo = andar(g, meio.x, topo, meio.z, 0.29, 0.23);
    topo = andar(g, meio.x, topo, meio.z, 0.19, 0.19);
    malha(cilindro(0.008, 0.008, 0.14, 6), m.ouro, [meio.x, topo + 0.07, meio.z], g);
    malha(new THREE.OctahedronGeometry(0.085), m.ouro, [meio.x, topo + 0.2, meio.z], g);
    // cupcakes
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      const raio = i === 0 ? 0 : 0.27;
      const x = esq.x + Math.cos(a) * raio;
      const z = esq.z + Math.sin(a) * raio;
      malha(cilindro(0.085, 0.06, 0.1, 18), m.painel2, [x, esq.h + 0.09, z], g);
      malha(new THREE.ConeGeometry(0.09, 0.13, 18), i % 2 ? m.cobertura : m.branco, [x, esq.h + 0.2, z], g);
      malha(esfera(0.026, 10, 8), m.cereja, [x, esq.h + 0.28, z], g);
    }
    // torre de macarons
    const base = prato(g, dir.x, dir.h + 0.04, dir.z, 0.34);
    [[7, 0.22, 0], [4, 0.12, 1], [1, 0, 2]].forEach(([qtd, raio, nivel]) => {
      for (let i = 0; i < qtd; i += 1) {
        const a = (i / qtd) * Math.PI * 2;
        const doce = malha(esfera(0.085, 18, 12), m.baloes[(i + nivel) % 5], [dir.x + Math.cos(a) * raio, base + 0.055 + nivel * 0.09, dir.z + Math.sin(a) * raio], g);
        doce.scale.y = 0.6;
      }
    });
  }

  function baloes() {
    const g = parte('baloes', -1.05, 2.62, -0.98);
    const geo = esfera(1, 32, 24);
    const no = new THREE.ConeGeometry(0.16, 0.26, 10);
    const novo = (x, y, z, r, i) => {
      const material = r > 0.2 && i % 11 === 7 ? m.bolha : i % 5 === 2 ? m.cromo : m.baloes[i % 5];
      const balao = malha(geo, material, [x, y, z], g);
      balao.scale.set(r, r * 1.1, r);
      if (r > 0.24) malha(no, material, [0, -1.08, 0], balao).scale.setScalar(0.5);
      flutuar(balao, 0.012 + (i % 4) * 0.004, 0.9 + (i % 5) * 0.15, i);
    };
    // guirlanda em arco: grandes no trilho, médios e pequenos preenchendo
    for (let i = 0; i < 40; i += 1) {
      const ang = MathUtils.lerp(1.13 * Math.PI, -0.1 * Math.PI, i / 39);
      const r = [0.31, 0.15, 0.22, 0.1, 0.26, 0.17][i % 6];
      const folga = ((i * 37) % 11) / 11 - 0.5;
      novo(Math.cos(ang) * (1.42 + folga * 0.34), Math.sin(ang) * (1.3 + folga * 0.3) + 0.05, folga * 0.55 + (i % 3) * 0.07, r, i);
    }
    // cascata até o chão, como nas montagens
    [[-1.48, -0.78, 0.3], [-1.28, -1.1, 0.19], [-1.62, -1.32, 0.26], [-1.38, -1.62, 0.22], [-1.66, -1.92, 0.32], [-1.22, -2.02, 0.18], [-1.45, -2.28, 0.24], [-1.1, -2.34, 0.14], [-1.8, -2.35, 0.17]]
      .forEach(([x, y, r], i) => novo(x, y, 0.12 + (i % 3) * 0.14, r, i + 3));
  }

  function bolhas() {
    const g = parte('bolhas', 0, 4.15, -0.2);
    const geo = esfera(1, 32, 24);
    const fio = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, transparent: true, opacity: 0.55 });
    [[-2.5, -0.35, 0.4, 0.3], [-1.55, 0.35, 0.9, 0.22], [0.15, 0.2, -0.6, 0.34], [1.35, 0.5, 0.7, 0.2], [2.45, -0.15, 0.1, 0.29], [0.9, -0.15, 1.2, 0.17]]
      .forEach(([x, y, z, r], i) => {
        const bolha = new THREE.Group();
        bolha.position.set(x, y, z);
        malha(geo, m.bolha, [0, 0, 0], bolha).scale.setScalar(r);
        malha(cilindro(0.004, 0.004, 1.4, 4), fio, [0, r + 0.7, 0], bolha);
        g.add(bolha);
        flutuar(bolha, 0.07, 0.6 + i * 0.09, i * 2);
      });
  }

  function placaNeon() {
    const g = parte('neon', -1.05, 1.75, -0.86);
    const material = new THREE.MeshBasicMaterial({ map: neon.textura, transparent: true, depthWrite: false, toneMapped: false });
    malha(new THREE.PlaneGeometry(1.9, 1.9), material, [0, 0, 0], g);
    const luz = new THREE.PointLight(0xffffff, 3, 3.5);
    luz.position.set(0, 0, 0.45);
    g.add(luz);
    tingidos.push({ material: luz, cor: (t) => t.cena.neon, alvo: new THREE.Color() });
  }

  function topiaria(destino, x, z) {
    malha(cilindro(0.22, 0.15, 0.3, 24), m.branco, [x, 0.15, z], destino);
    const folhas = new THREE.IcosahedronGeometry(0.31, 3);
    const posicao = folhas.attributes.position;
    for (let i = 0; i < posicao.count; i += 1) {
      const v = new THREE.Vector3().fromBufferAttribute(posicao, i);
      v.multiplyScalar(1 + Math.sin(v.x * 41) * Math.cos(v.y * 37) * Math.sin(v.z * 43) * 0.16);
      posicao.setXYZ(i, v.x, v.y, v.z);
    }
    folhas.computeVertexNormals();
    malha(folhas, m.verde, [x, 0.55, z], destino);
  }

  function vasos() {
    const g = parte('vasos', 0, 0.09, 0);
    topiaria(g, -2.1, 1.35);
    topiaria(g, 2.18, 1.28);
    const perfil = [[0, 0], [0.17, 0], [0.12, 0.12], [0.2, 0.42], [0.12, 0.66], [0.17, 0.76]].map(([x, y]) => new THREE.Vector2(x, y));
    malha(new THREE.LatheGeometry(perfil, 32), m.branco, [0.95, 0, -0.75], g);
    for (let i = 0; i < 26; i += 1) {
      const a = i * 2.4;
      const raio = 0.05 + (i / 26) * 0.34;
      const x = 0.95 + Math.cos(a) * raio;
      const z = -0.75 + Math.sin(a) * raio * 0.7;
      const y = 1.5 - raio * 0.9 + (i % 3) * 0.07;
      const flor = malha(i % 4 === 0 ? new THREE.IcosahedronGeometry(0.09, 0) : esfera(0.065 + (i % 3) * 0.012, 12, 10), i % 4 === 0 ? m.verde : m.baloes[i % 5], [x, y, z], g);
      flor.scale.y = 0.8;
      const haste = malha(cilindro(0.006, 0.006, y - 0.7, 5), m.verde, [(x + 0.95) / 2, (y + 0.7) / 2, (z - 0.75) / 2], g);
      haste.lookAt(new THREE.Vector3(x, y + 0.09, z).add(grupo.position));
      haste.rotateX(Math.PI / 2);
    }
  }

  function asa(lado) {
    const f = new THREE.Shape();
    f.moveTo(0, 0.05);
    f.bezierCurveTo(0.12 * lado, 0.75, 0.95 * lado, 0.95, 0.82 * lado, 0.35);
    f.bezierCurveTo(0.74 * lado, 0.05, 0.4 * lado, 0.02, 0.2 * lado, 0);
    f.bezierCurveTo(0.72 * lado, -0.1, 0.72 * lado, -0.68, 0.36 * lado, -0.62);
    f.bezierCurveTo(0.12 * lado, -0.56, 0.04 * lado, -0.25, 0, -0.05);
    [[0.52, 0.45, 0.12], [0.3, 0.3, 0.07], [0.66, 0.24, 0.06], [0.36, -0.34, 0.1]].forEach(([x, y, r]) => {
      const furo = new THREE.Path();
      furo.absarc(x * lado, y, r, 0, Math.PI * 2, false);
      f.holes.push(furo);
    });
    return new THREE.ExtrudeGeometry(f, { depth: 0.05, bevelEnabled: false, curveSegments: 24 });
  }

  function mdf() {
    const g = parte('mdf', 0, 0.09, 0);
    [[2.4, 0.72, -0.25, 0.95, -0.5], [0.3, 3.55, -0.9, 0.36, 0.3]].forEach(([x, y, z, escala, giro], i) => {
      const borboleta = new THREE.Group();
      const asas = [1, -1].map((lado) => malha(asa(lado), i ? m.cobertura : m.branco, [0, 0, 0], borboleta));
      malha(new THREE.CapsuleGeometry(0.045, 0.55, 6, 12), m.ouro, [0, 0, 0.03], borboleta);
      borboleta.position.set(x, y, z);
      borboleta.rotation.y = giro;
      borboleta.scale.setScalar(escala);
      g.add(borboleta);
      if (i) {
        flutuar(borboleta, 0.12, 1.4, 1);
        animados.push({ asas });
      }
    });
  }

  function estante() {
    const g = parte('estante', -2.7, 0.09, -0.25);
    g.rotation.y = 0.35;
    [-0.42, 0.42].forEach((x) => {
      const frente = malha(caixa(0.05, 2.1, 0.05), m.branco, [x, 1.02, 0.18], g);
      frente.rotation.x = -0.17;
      malha(caixa(0.05, 2.05, 0.05), m.branco, [x, 1.0, -0.14], g);
    });
    [0.32, 0.84, 1.36, 1.86].forEach((y, nivel) => {
      const fundo = 0.5 - nivel * 0.1;
      const centro = 0.07 - nivel * 0.05;
      malha(caixa(0.9, 0.035, fundo), m.branco, [0, y, centro], g);
      [-0.25, 0.02, 0.28].forEach((x, i) => {
        const material = (i + nivel) % 2 ? m.branco : m.baloes[(i + nivel) % 5];
        malha(caixa(0.17, 0.22, 0.12), material, [x, y + 0.13, centro], g);
        malha(new THREE.TorusGeometry(0.045, 0.008, 6, 16, Math.PI), m.ouro, [x, y + 0.245, centro], g);
      });
    });
  }

  function pista() {
    const g = parte('led', 0, 0.12, 2.35);
    malha(caixa(3.9, 0.07, 1.65), padrao({ color: 0x07060d, metalness: 0.6, roughness: 0.15 }), [0, 0, 0], g);
    [0, 1].forEach((fase) => {
      const luzes = tex.criarTextura(THREE, 512, 256, tex.desenharLuzes);
      luzes.redesenhar(fase);
      const material = new THREE.MeshBasicMaterial({ map: luzes.textura, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const plano = malha(new THREE.PlaneGeometry(3.8, 1.58), material, [0, 0.04 + fase * 0.002, 0], g);
      plano.rotation.x = -Math.PI / 2;
      animados.push({ luz: material, fase: fase * Math.PI });
    });
    [-0.975, 0, 0.975].forEach((x) => malha(caixa(0.02, 0.012, 1.65), m.cromo, [x, 0.045, 0], g));
  }

  [tapete, arco, placaLetreiro, painelRedondo, mesas, doces, baloes, bolhas, placaNeon, vasos, mdf, estante, pista].forEach((construir) => construir());

  let neonAtual = '';
  let primeiroTema = true;

  return {
    grupo,
    partes,
    definirTema(tema, numero) {
      tingidos.forEach((t) => t.alvo.set(t.cor(tema)));
      if (primeiroTema) tingidos.forEach((t) => t.material.color.copy(t.alvo));
      primeiroTema = false;
      const chaveNeon = `${tema.id}|${numero}`;
      if (chaveNeon === neonAtual) return;
      if (!neonAtual.startsWith(`${tema.id}|`)) arte.redesenhar(tema);
      neonAtual = chaveNeon;
      neon.redesenhar(String(numero ?? ''), tema.cena.neon);
    },
    animar(tempo, dt) {
      const k = 1 - Math.exp(-dt * 5);
      tingidos.forEach((t) => t.material.color.lerp(t.alvo, k));
      animados.forEach((a) => {
        if (a.obj) a.obj.position.y = a.y + Math.sin(tempo * a.velocidade + a.fase) * a.amplitude;
        else if (a.luz) a.luz.opacity = 0.55 + Math.sin(tempo * 2.6 + a.fase) * 0.45;
        else a.asas.forEach((obj, i) => { obj.rotation.y = Math.sin(tempo * 5) * 0.55 * (i ? 1 : -1); });
      });
      Object.values(partes).forEach((p) => {
        // mola: a peça "pula" ao entrar em cena
        p.velocidade = (p.velocidade ?? 0) + ((p.alvo - p.atual) * 140 - (p.velocidade ?? 0) * 15) * dt;
        p.atual = Math.max(0, p.atual + p.velocidade * dt);
        p.grupo.visible = p.atual > 0.02;
        p.grupo.scale.setScalar(Math.max(0.001, p.atual));
      });
    },
  };
}
