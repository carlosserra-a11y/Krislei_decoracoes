// Assistente "Monte o seu cenário": 4 passos + resumo que vira mensagem de WhatsApp.
import { CONFIG } from './config.js';
import { TEMAS, temaPorId } from './dados.js';
import * as wa from './whatsapp.js';
import { aplicarTema, temaAtual } from './temas.js';
import { registrarProvedor, atualizarLinks } from './site.js';
import { soltarConfete } from './confete.js';

const CHAVE = 'krislei:rascunho';
const TOTAL_PASSOS = 4;
const RESUMO = 5;

const pecasDisponiveis = () => CONFIG.pecas.filter((p) => p.ativo && (!p.secao || CONFIG.secoes[p.secao]));
const ocasiaoPorId = (id) => CONFIG.ocasioes.find((o) => o.id === id);

function estadoInicial() {
  return {
    passo: 1,
    ocasiao: '',
    numero: '',
    tema: temaAtual().id,
    pecas: new Set(pecasDisponiveis().filter((p) => p.padrao).map((p) => p.id)),
    data: '',
    semData: false,
    convidados: 50,
  };
}

let estado = estadoInicial();
let formulario = null;

function salvarRascunho() {
  try {
    const { ocasiao, numero, data, semData, convidados } = estado;
    localStorage.setItem(CHAVE, JSON.stringify({ ocasiao, numero, data, semData, convidados, pecas: [...estado.pecas] }));
  } catch {
    /* sem armazenamento */
  }
}

function carregarRascunho() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? 'null');
    if (!bruto || typeof bruto !== 'object') return;
    const validas = new Set(pecasDisponiveis().map((p) => p.id));
    const convidados = Number(bruto.convidados);
    estado = {
      ...estado,
      ocasiao: ocasiaoPorId(bruto.ocasiao) ? bruto.ocasiao : '',
      numero: String(bruto.numero ?? '').slice(0, 3),
      data: typeof bruto.data === 'string' ? bruto.data : '',
      semData: Boolean(bruto.semData),
      convidados: Number.isFinite(convidados) ? Math.min(300, Math.max(10, convidados)) : 50,
      pecas: Array.isArray(bruto.pecas) ? new Set(bruto.pecas.filter((id) => validas.has(id))) : estado.pecas,
    };
  } catch {
    /* rascunho corrompido: ignora */
  }
}

function numeroDoNeon() {
  const ocasiao = ocasiaoPorId(estado.ocasiao);
  if (!ocasiao) return '';
  if (ocasiao.numeroFixo) return String(ocasiao.numeroFixo);
  return ocasiao.numero ? estado.numero : '';
}

function nomeDoTema() {
  return estado.tema === 'outro' ? 'Outro (combinar no WhatsApp)' : temaPorId(estado.tema).nome;
}

function pedido() {
  const nomes = pecasDisponiveis().filter((p) => estado.pecas.has(p.id)).map((p) => p.nome);
  return {
    ocasiao: ocasiaoPorId(estado.ocasiao)?.nome ?? '',
    numero: numeroDoNeon(),
    tema: nomeDoTema(),
    pecas: nomes,
    data: estado.semData ? '' : estado.data,
    convidados: estado.convidados,
  };
}

function emitirCenario() {
  const cenas = pecasDisponiveis().filter((p) => p.cena && estado.pecas.has(p.id)).map((p) => p.cena);
  const temaId = estado.tema === 'outro' ? temaAtual().id : estado.tema;
  document.dispatchEvent(new CustomEvent('cenario:mudou', { detail: { temaId, cenas, numero: numeroDoNeon() } }));
}

function montarOpcoes() {
  const ocasioes = formulario.querySelector('#opcoes-ocasiao');
  ocasioes.innerHTML = CONFIG.ocasioes
    .map((o) => `<label class="opcao"><input type="radio" name="ocasiao" value="${o.id}"><span>${o.nome}</span></label>`)
    .join('');
  const temas = formulario.querySelector('#opcoes-tema');
  const cor = (t) => `--c1:${t.tokens.a1};--c2:${t.tokens.a2};--c3:${t.tokens.a3}`;
  temas.innerHTML =
    TEMAS.map((t) => `<label class="opcao"><input type="radio" name="tema" value="${t.id}"><span><i class="opcao__cor" style="${cor(t)}"></i>${t.nome}</span></label>`).join('') +
    '<label class="opcao"><input type="radio" name="tema" value="outro"><span>Outro (me conta no WhatsApp)</span></label>';
  const pecas = formulario.querySelector('#opcoes-pecas');
  pecas.innerHTML = pecasDisponiveis()
    .map((p) => `<label class="opcao"><input type="checkbox" name="peca" value="${p.id}"><span>${p.nome}</span></label>`)
    .join('');
  const passos = formulario.querySelector('#passos');
  passos.innerHTML = Array.from({ length: TOTAL_PASSOS }, (_, i) => `<li style="--n:${i}" aria-label="Passo ${i + 1} de ${TOTAL_PASSOS}"></li>`).join('');
  formulario.querySelector('#data').min = wa.hojeISO();
}

function sincronizarCampos() {
  const marcar = (nome, valor) => {
    const campo = formulario.querySelector(`input[name="${nome}"][value="${valor}"]`);
    if (campo) campo.checked = true;
  };
  if (estado.ocasiao) marcar('ocasiao', estado.ocasiao);
  marcar('tema', estado.tema);
  formulario.querySelectorAll('input[name="peca"]').forEach((el) => { el.checked = estado.pecas.has(el.value); });
  formulario.querySelector('#numero').value = estado.numero;
  formulario.querySelector('#data').value = estado.data;
  formulario.querySelector('#data').disabled = estado.semData;
  formulario.querySelector('#data-indefinida').checked = estado.semData;
  formulario.querySelector('#convidados').value = String(estado.convidados);
  formulario.querySelector('#convidados-valor').textContent = String(estado.convidados);
  const ocasiao = ocasiaoPorId(estado.ocasiao);
  formulario.querySelector('#campo-numero').hidden = !(ocasiao?.numero && !ocasiao.numeroFixo);
}

function mostrarErro(mensagem = '') {
  formulario.querySelector('#assistente-erro').textContent = mensagem;
}

function preencherResumo() {
  const dados = pedido();
  const linhas = [
    ['Ocasião', dados.ocasiao + (dados.numero ? ` (número ${dados.numero})` : '')],
    ['Clima', dados.tema],
    ['Peças', dados.pecas.join(', ') || 'A combinar'],
    ['Data', wa.formatarDataBR(dados.data) || 'Ainda a definir'],
    ['Convidados', `cerca de ${dados.convidados}`],
  ];
  const lista = document.createElement('dl');
  linhas.forEach(([titulo, valor]) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = titulo;
    dd.textContent = valor;
    lista.append(dt, dd);
  });
  formulario.querySelector('#resumo').replaceChildren(lista);
}

function mostrarPasso(n) {
  estado = { ...estado, passo: n };
  formulario.querySelectorAll('[data-passo]').forEach((el) => {
    const ativo = Number(el.dataset.passo) === n;
    el.hidden = !ativo;
    if (ativo) {
      el.classList.remove('entrando');
      void el.offsetWidth;
      el.classList.add('entrando');
    }
  });
  formulario.querySelectorAll('#passos li').forEach((li, i) => {
    li.classList.toggle('ativo', i + 1 === n);
    li.classList.toggle('feito', i + 1 < n);
    if (i + 1 === n) li.setAttribute('aria-current', 'step');
    else li.removeAttribute('aria-current');
  });
  formulario.querySelector('#btn-voltar').hidden = n === 1;
  const proximo = formulario.querySelector('#btn-proximo');
  proximo.hidden = n === RESUMO;
  proximo.textContent = n === TOTAL_PASSOS ? 'Ver o resumo' : 'Continuar';
  if (n === RESUMO) preencherResumo();
  atualizarLinks();
  const alvo = formulario.querySelector(`[data-passo="${n}"]`);
  (alvo.querySelector('input:not([hidden]):not([disabled]), h3') ?? alvo).focus?.({ preventScroll: true });
  if (alvo.tagName === 'DIV') alvo.querySelector('h3')?.setAttribute('tabindex', '-1');
}

function passoValido(n) {
  mostrarErro();
  if (n === 1 && !estado.ocasiao) return mostrarErro('Escolha a ocasião da festa para continuar.');
  if (n === TOTAL_PASSOS) {
    const resultado = wa.validarPedido({ ocasiao: estado.ocasiao, data: estado.semData ? '' : estado.data, convidados: estado.convidados });
    if (!resultado.ok) return mostrarErro(resultado.erros[0]);
  }
  return true;
}

function avancar() {
  if (!passoValido(estado.passo)) return;
  mostrarPasso(Math.min(estado.passo + 1, RESUMO));
}

function aoMudar(evento) {
  const campo = evento.target;
  const { name, value, id, checked } = campo;
  if (name === 'ocasiao') estado = { ...estado, ocasiao: value, numero: ocasiaoPorId(value)?.numero ? estado.numero : '' };
  else if (name === 'tema') {
    estado = { ...estado, tema: value };
    if (value !== 'outro') aplicarTema(value);
  } else if (name === 'peca') {
    const pecas = new Set(estado.pecas);
    if (checked) pecas.add(value);
    else pecas.delete(value);
    estado = { ...estado, pecas };
  } else if (id === 'numero') estado = { ...estado, numero: value.replace(/\D/g, '').slice(0, 3) };
  else if (id === 'data') estado = { ...estado, data: value };
  else if (id === 'data-indefinida') estado = { ...estado, semData: checked };
  else if (id === 'convidados') estado = { ...estado, convidados: Number(value) };
  mostrarErro();
  sincronizarCampos();
  salvarRascunho();
  emitirCenario();
  atualizarLinks();
}

export function iniciarAssistente() {
  formulario = document.getElementById('assistente');
  if (!formulario) return;
  carregarRascunho();
  montarOpcoes();
  sincronizarCampos();
  mostrarPasso(1);
  registrarProvedor('assistente', () => wa.mensagemAssistente(pedido()));

  formulario.addEventListener('change', aoMudar);
  formulario.addEventListener('input', (e) => { if (e.target.id === 'convidados' || e.target.id === 'numero') aoMudar(e); });
  formulario.addEventListener('submit', (e) => { e.preventDefault(); avancar(); });
  formulario.querySelector('#btn-proximo').addEventListener('click', avancar);
  formulario.querySelector('#btn-voltar').addEventListener('click', () => { mostrarErro(); mostrarPasso(Math.max(1, estado.passo - 1)); });
  formulario.querySelector('#enviar-pedido').addEventListener('click', (e) => {
    const caixa = e.currentTarget.getBoundingClientRect();
    soltarConfete({ x: caixa.left + caixa.width / 2, y: caixa.top, n: 90 });
  });
  document.addEventListener('tema:mudou', ({ detail }) => {
    if (estado.tema === 'outro' || estado.tema === detail.tema.id) return;
    estado = { ...estado, tema: detail.tema.id };
    sincronizarCampos();
    emitirCenario();
  });
  emitirCenario();
}
