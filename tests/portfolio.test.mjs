import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PORTFOLIO, FILTROS, filtrar, itemPorId, vizinho } from '../js/portfolio-dados.js';
import { mensagemCenario, mensagemOcasiao, mensagemCompartilhar, urlCompartilhar } from '../js/whatsapp.js';

test('todos os itens têm id único, título e foto de capa', () => {
  const ids = PORTFOLIO.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
  PORTFOLIO.forEach((i) => {
    assert.ok(i.titulo && i.foto && i.tema, `item ${i.id} incompleto`);
    if (i.tipo === 'video') assert.match(i.video, /\.mp4$/);
  });
});

test('todas as tags usadas existem nos filtros', () => {
  const validos = new Set(FILTROS.map((f) => f.id));
  PORTFOLIO.forEach((i) => i.tags.forEach((t) => assert.ok(validos.has(t), `${i.id}: tag ${t}`)));
});

test('filtrar devolve tudo em "todos" e só os da tag nos demais', () => {
  assert.equal(filtrar(PORTFOLIO, 'todos').length, PORTFOLIO.length);
  const videos = filtrar(PORTFOLIO, 'video');
  assert.equal(videos.length, 2);
  assert.ok(videos.every((i) => i.tipo === 'video'));
  assert.ok(filtrar(PORTFOLIO, '15anos').every((i) => i.tags.includes('15anos')));
});

test('filtrar esconde itens de seções desligadas', () => {
  const sem = filtrar(PORTFOLIO, 'todos', { pistaLed: false });
  assert.equal(sem.length, PORTFOLIO.length - 1);
  assert.ok(!sem.some((i) => i.id === 'led'));
  assert.equal(filtrar(PORTFOLIO, 'todos', { pistaLed: true }).length, PORTFOLIO.length);
});

test('itemPorId encontra ou devolve null', () => {
  assert.equal(itemPorId(PORTFOLIO, 'mini').titulo, 'Mini table');
  assert.equal(itemPorId(PORTFOLIO, 'nao-existe'), null);
});

test('vizinho anda em círculo nos dois sentidos', () => {
  const lista = filtrar(PORTFOLIO, 'video');
  assert.equal(vizinho(lista, lista[0].id, 1).id, lista[1].id);
  assert.equal(vizinho(lista, lista[0].id, -1).id, lista[1].id);
  assert.equal(vizinho([], 'x', 1), null);
});

test('mensagens novas do WhatsApp', () => {
  assert.match(mensagemCenario('Mini table'), /\*Mini table\*/);
  assert.match(mensagemOcasiao('Chá de bebê'), /\*Chá de bebê\*/);
  assert.match(mensagemOcasiao(''), /aluguel de decorações/);
  assert.equal(mensagemCompartilhar({ url: 'https://x.test/?tema=pb', tema: 'Preto & Branco' }), 'Olha o cenário que montei para a festa (clima Preto & Branco): https://x.test/?tema=pb');
  const url = urlCompartilhar('a & b');
  assert.equal(url, 'https://wa.me/?text=a%20%26%20b');
});
