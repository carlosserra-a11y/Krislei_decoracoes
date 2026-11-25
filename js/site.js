// Liga a configuração (config.js) à página: número do WhatsApp, links, SEO e seções opcionais.
import { CONFIG } from './config.js';
import * as wa from './whatsapp.js';
import { temaAtual } from './temas.js';
import { temaPorId } from './dados.js';

const provedores = new Map();

/** Permite que outros módulos (ex.: assistente) forneçam a mensagem de um tipo de link. */
export function registrarProvedor(tipo, funcao) {
  provedores.set(tipo, funcao);
}

function mensagemPara(link) {
  const tipo = link.dataset.wa;
  if (provedores.has(tipo)) return provedores.get(tipo)(link);
  switch (tipo) {
    case 'tema': {
      const id = link.dataset.waTema;
      return wa.mensagemTema({ tema: (id ? temaPorId(id) : temaAtual()).nome });
    }
    case 'ocasiao':
      return wa.mensagemOcasiao(link.dataset.ocasiao);
    case 'data':
      return wa.mensagemData({ data: document.getElementById('data-rapida')?.value });
    default:
      return wa.mensagemGeral();
  }
}

export function atualizarLinks() {
  document.querySelectorAll('a[data-wa]').forEach((link) => {
    link.href = wa.montarUrl(CONFIG.whatsapp, mensagemPara(link));
  });
}

function aplicarNumero() {
  document.querySelectorAll('[data-wa-numero]').forEach((el) => {
    el.textContent = CONFIG.whatsappExibicao;
  });
  document.querySelectorAll('a[data-tel]').forEach((el) => {
    el.href = wa.montarTel(CONFIG.whatsapp);
  });
  document.querySelectorAll('a[data-wa]').forEach((el) => {
    const texto = el.textContent.replace(/\s+/g, ' ').trim();
    // o número só é acrescentado ao rótulo quando o botão ainda não o mostra
    const numero = texto.includes(CONFIG.whatsappExibicao) ? '' : ` — WhatsApp ${CONFIG.whatsappExibicao}`;
    el.setAttribute('aria-label', `${texto}${numero}`);
  });
}

function avisoDeDesenvolvimento() {
  if (wa.numeroConfigurado(CONFIG.whatsapp)) return;
  console.warn('[Krislei] Preencha o número do WhatsApp em js/config.js');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const aviso = document.getElementById('aviso-dev');
  if (aviso && local) aviso.hidden = false;
}

function aplicarContatos() {
  const mostrar = (chave, texto, seletorTexto, preencher) => {
    const item = document.querySelector(`[data-config="${chave}"]`);
    if (!item || !texto) return;
    item.hidden = false;
    const alvo = item.querySelector(seletorTexto);
    if (alvo) alvo.textContent = preencher ? preencher(texto) : texto;
  };
  mostrar('instagram', CONFIG.instagram, '[data-insta-texto]', (t) => `@${t.replace(/^@/, '')}`);
  const insta = document.querySelector('[data-insta]');
  if (insta && CONFIG.instagram) insta.href = `https://instagram.com/${CONFIG.instagram.replace(/^@/, '')}`;
  mostrar('cidade', [CONFIG.cidade, CONFIG.regiaoAtendida].filter(Boolean).join(' · '), '[data-cidade-texto]');
  mostrar('horario', CONFIG.horarioAtendimento, '[data-horario-texto]');
}

function aplicarSecoes() {
  if (CONFIG.secoes.pistaLed) return;
  document.querySelectorAll('[data-secao="pistaLed"]').forEach((el) => {
    el.hidden = true;
  });
}

function aplicarServicos() {
  const ativos = ['entrega', 'montagem', 'retirada'].filter((chave) => CONFIG.servicos[chave] === true);
  if (!ativos.length) return;
  const titulo = document.querySelector('[data-passo-final]');
  const texto = document.querySelector('[data-passo-final-texto]');
  if (titulo) titulo.textContent = 'Receba o seu cenário';
  if (texto) texto.textContent = `A Krislei cuida de: ${ativos.join(', ')}. Você só aproveita a festa.`;
}

function atualizarJsonLd() {
  const no = document.getElementById('ld-json');
  if (!no) return;
  const dados = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: CONFIG.marca,
    description: 'Aluguel de decorações para festas: aniversário, chá de bebê, 15 anos e mais.',
    image: `${CONFIG.siteUrl}assets/og.jpg`,
    url: CONFIG.siteUrl,
  };
  if (wa.numeroConfigurado(CONFIG.whatsapp)) dados.telephone = `+${wa.soDigitos(CONFIG.whatsapp)}`;
  if (CONFIG.instagram) dados.sameAs = [`https://instagram.com/${CONFIG.instagram.replace(/^@/, '')}`];
  if (CONFIG.cidade) dados.address = { '@type': 'PostalAddress', addressLocality: CONFIG.cidade };
  if (CONFIG.regiaoAtendida) dados.areaServed = CONFIG.regiaoAtendida;
  no.textContent = JSON.stringify(dados);
}

function animarFab() {
  const fab = document.querySelector('.wa-fab');
  if (!fab || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setInterval(() => {
    fab.classList.add('aberto');
    setTimeout(() => fab.classList.remove('aberto'), 4000);
  }, 15000);
}

export function iniciarSite() {
  aplicarNumero();
  aplicarContatos();
  aplicarSecoes();
  aplicarServicos();
  atualizarJsonLd();
  avisoDeDesenvolvimento();
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
  atualizarLinks();

  document.addEventListener('tema:mudou', atualizarLinks);
  const dataRapida = document.getElementById('data-rapida');
  if (dataRapida) {
    dataRapida.min = wa.hojeISO();
    dataRapida.addEventListener('input', () => {
      // data digitada no passado não entra na mensagem
      if (wa.dataPassada(dataRapida.value)) dataRapida.value = '';
      atualizarLinks();
    });
  }
  // Garante a mensagem mais recente na hora do clique e avisa quem quiser medir a origem.
  document.addEventListener('click', (evento) => {
    const link = evento.target.closest?.('a[data-wa]');
    if (!link) return;
    link.href = wa.montarUrl(CONFIG.whatsapp, mensagemPara(link));
    const detalhe = { origem: link.dataset.waOrigem ?? 'desconhecida', tipo: link.dataset.wa };
    document.dispatchEvent(new CustomEvent('wa:click', { detail: detalhe }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'wa_click', ...detalhe });
  });
  animarFab();
}
