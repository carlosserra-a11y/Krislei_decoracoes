// Funções PURAS (sem DOM) que montam as mensagens e os links do WhatsApp.
// Testadas em tests/whatsapp.test.mjs.

export function soDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

/** O número é válido se não tiver "X" de placeholder e tiver 12–13 dígitos (55 + DDD + 8/9 dígitos). */
export function numeroConfigurado(numero) {
  const bruto = String(numero ?? '');
  if (/x/i.test(bruto)) return false;
  const tamanho = soDigitos(bruto).length;
  return tamanho === 12 || tamanho === 13;
}

export function montarUrl(numero, mensagem = '') {
  const texto = encodeURIComponent(String(mensagem));
  return `https://wa.me/${soDigitos(numero)}?text=${texto}`;
}

export function montarTel(numero) {
  return `tel:+${soDigitos(numero)}`;
}

/** '2026-12-05' -> '05/12/2026'. Devolve '' se a data não existir. */
export function formatarDataBR(iso) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  if (!partes) return '';
  const [, ano, mes, dia] = partes;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const existe =
    data.getFullYear() === Number(ano) && data.getMonth() === Number(mes) - 1 && data.getDate() === Number(dia);
  return existe ? `${dia}/${mes}/${ano}` : '';
}

export function hojeISO(agora = new Date()) {
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

/** true se a data (ISO) for anterior a hoje. */
export function dataPassada(iso, agora = new Date()) {
  return Boolean(formatarDataBR(iso)) && iso < hojeISO(agora);
}

export function mensagemGeral() {
  return 'Olá, Krislei! Vi o seu site e quero saber mais sobre o aluguel de decorações. 🎈';
}

export function mensagemTema({ tema, ocasiao } = {}) {
  const nome = tema ? `*${tema}*` : 'um dos temas';
  const extra = ocasiao ? ` (ocasião: ${ocasiao})` : '';
  return `Olá, Krislei! Me interessei pelo tema ${nome}${extra}. Podemos conversar?`;
}

export function mensagemData({ data, ocasiao, convidados } = {}) {
  const dataBR = formatarDataBR(data);
  const dia = dataBR ? `no dia *${dataBR}*` : 'para a minha festa';
  const detalhes = [];
  if (ocasiao) detalhes.push(`ocasião: ${ocasiao}`);
  if (convidados) detalhes.push(`cerca de ${convidados} convidados`);
  const extra = detalhes.length ? ` (${detalhes.join(', ')})` : '';
  return `Olá, Krislei! Quero saber se você tem disponibilidade ${dia}${extra}.`;
}

export function mensagemPista() {
  return 'Olá, Krislei! Vi a *pista de LED* no seu site e quero um orçamento.';
}

export function mensagemMini() {
  return 'Olá, Krislei! Vi a *mini table* no seu site e quero saber mais. Podemos conversar?';
}

export function mensagemVideo() {
  return 'Olá, Krislei! Vi os vídeos no seu site e quero uma decoração assim. Podemos conversar?';
}

/**
 * Resumo do assistente "Monte o seu cenário".
 * estado = { ocasiao, numero, tema, pecas: string[], data, convidados }
 */
export function mensagemAssistente(estado = {}) {
  const { ocasiao, numero, tema, pecas = [], data, convidados } = estado;
  const linhas = ['Olá, Krislei! Montei o meu cenário no site:'];
  if (ocasiao) linhas.push(`• Ocasião: ${ocasiao}${numero ? ` (número ${numero})` : ''}`);
  if (tema) linhas.push(`• Clima: ${tema}`);
  if (pecas.length) linhas.push(`• Peças: ${pecas.join(', ')}`);
  const dataBR = formatarDataBR(data);
  linhas.push(`• Data: ${dataBR || 'ainda vou definir'}`);
  if (convidados) linhas.push(`• Convidados: cerca de ${convidados}`);
  linhas.push('Pode me passar um orçamento?');
  return linhas.join('\n');
}

/** Valida o pedido do assistente. Devolve { ok, erros }. */
export function validarPedido(estado = {}, agora = new Date()) {
  const erros = [];
  if (!estado.ocasiao) erros.push('Escolha a ocasião da festa.');
  if (estado.data) {
    if (!formatarDataBR(estado.data)) erros.push('A data informada não existe.');
    else if (dataPassada(estado.data, agora)) erros.push('Escolha uma data a partir de hoje.');
  }
  const convidados = Number(estado.convidados);
  if (estado.convidados !== undefined && (!Number.isFinite(convidados) || convidados < 1 || convidados > 1000)) {
    erros.push('Informe uma quantidade de convidados válida.');
  }
  return { ok: erros.length === 0, erros };
}
