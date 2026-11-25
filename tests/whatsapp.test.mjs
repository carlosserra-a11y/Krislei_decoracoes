import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  soDigitos,
  numeroConfigurado,
  montarUrl,
  montarTel,
  formatarDataBR,
  dataPassada,
  mensagemGeral,
  mensagemTema,
  mensagemData,
  mensagemAssistente,
  validarPedido,
} from '../js/whatsapp.js';

const HOJE = new Date(2026, 10, 24); // 24/11/2026

test('soDigitos remove tudo que não é número', () => {
  assert.equal(soDigitos('+55 (48) 99999-8888'), '5548999998888');
  assert.equal(soDigitos(undefined), '');
});

test('numeroConfigurado rejeita placeholder e tamanhos inválidos', () => {
  assert.equal(numeroConfigurado('55XXXXXXXXXXX'), false);
  assert.equal(numeroConfigurado(''), false);
  assert.equal(numeroConfigurado('554899998888'), true); // 12 dígitos
  assert.equal(numeroConfigurado('5548999998888'), true); // 13 dígitos
  assert.equal(numeroConfigurado('48999998888'), false);
});

test('montarUrl usa só dígitos e escapa acentos, asteriscos e quebras de linha', () => {
  const url = montarUrl('+55 48 99999-8888', 'Olá!\n*Tema* ação');
  assert.ok(url.startsWith('https://wa.me/5548999998888?text='));
  const texto = decodeURIComponent(url.split('?text=')[1]);
  assert.equal(texto, 'Olá!\n*Tema* ação');
  assert.ok(!url.includes('\n') && !url.includes(' '));
});

test('montarUrl com número vazio não quebra', () => {
  assert.equal(montarUrl('', 'oi'), 'https://wa.me/?text=oi');
});

test('montarTel gera link tel: com +', () => {
  assert.equal(montarTel('5548999998888'), 'tel:+5548999998888');
});

test('formatarDataBR valida datas reais', () => {
  assert.equal(formatarDataBR('2026-12-05'), '05/12/2026');
  assert.equal(formatarDataBR('2026-02-30'), '');
  assert.equal(formatarDataBR('05/12/2026'), '');
  assert.equal(formatarDataBR(''), '');
});

test('dataPassada compara com hoje', () => {
  assert.equal(dataPassada('2026-11-23', HOJE), true);
  assert.equal(dataPassada('2026-11-24', HOJE), false);
  assert.equal(dataPassada('2027-01-01', HOJE), false);
  assert.equal(dataPassada('lixo', HOJE), false);
});

test('mensagens contextuais trazem os dados esperados', () => {
  assert.match(mensagemGeral(), /aluguel de decorações/);
  assert.match(mensagemTema({ tema: 'Jardim Encantado', ocasiao: 'Chá de bebê' }), /\*Jardim Encantado\*.*Chá de bebê/);
  assert.match(mensagemTema(), /um dos temas/);
  const data = mensagemData({ data: '2026-12-05', ocasiao: '15 anos', convidados: 80 });
  assert.match(data, /\*05\/12\/2026\*/);
  assert.match(data, /15 anos, cerca de 80 convidados/);
  assert.match(mensagemData({}), /para a minha festa/);
});

test('mensagemAssistente resume todas as escolhas', () => {
  const texto = mensagemAssistente({
    ocasiao: 'Aniversário infantil',
    numero: 1,
    tema: 'Margaridas',
    pecas: ['Painéis em arco', 'Neon de números e letras'],
    data: '2026-12-05',
    convidados: 60,
  });
  assert.match(texto, /Ocasião: Aniversário infantil \(número 1\)/);
  assert.match(texto, /Clima: Margaridas/);
  assert.match(texto, /Peças: Painéis em arco, Neon de números e letras/);
  assert.match(texto, /Data: 05\/12\/2026/);
  assert.match(texto, /Convidados: cerca de 60/);
  assert.match(texto, /orçamento\?$/);
});

test('mensagemAssistente tolera estado incompleto', () => {
  const texto = mensagemAssistente({ ocasiao: 'Chá de bebê' });
  assert.match(texto, /Data: ainda vou definir/);
  assert.doesNotMatch(texto, /Peças:/);
});

test('validarPedido exige ocasião e rejeita data passada/inexistente', () => {
  assert.deepEqual(validarPedido({ ocasiao: '15 anos' }, HOJE), { ok: true, erros: [] });
  assert.equal(validarPedido({}, HOJE).ok, false);
  assert.equal(validarPedido({ ocasiao: 'x', data: '2026-01-01' }, HOJE).ok, false);
  assert.equal(validarPedido({ ocasiao: 'x', data: '2026-02-31' }, HOJE).ok, false);
  assert.equal(validarPedido({ ocasiao: 'x', convidados: 0 }, HOJE).ok, false);
  assert.equal(validarPedido({ ocasiao: 'x', convidados: 50 }, HOJE).ok, true);
});
