// Gera versões WebP otimizadas das fotos (sem ampliar além do tamanho original).
// Uso: cd tools && npm install && node otimizar-midia.mjs
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origem = path.join(raiz, 'assets', 'fotos');
const destino = path.join(raiz, 'assets', 'otimizado');
const LARGURAS = [480, 960];

async function otimizarFoto(arquivo) {
  // Nome curto (prefixo numérico) para não estourar o limite de caminho do Windows.
  const base = path.parse(arquivo).name.split('-')[0];
  const entrada = path.join(origem, arquivo);
  const { width } = await sharp(entrada).metadata();
  const alvos = [...LARGURAS.filter((l) => l < width), width];
  const saidas = [];
  for (const largura of alvos) {
    const sufixo = largura === width ? 'full' : String(largura);
    const saida = path.join(destino, `${base}-${sufixo}.webp`);
    await sharp(entrada).resize({ width: largura, withoutEnlargement: true }).webp({ quality: 80 }).toFile(saida);
    saidas.push(`${sufixo}:${largura}`);
  }
  return `${base} -> ${saidas.join(' ')}`;
}

async function principal() {
  await mkdir(destino, { recursive: true });
  const arquivos = (await readdir(origem)).filter((a) => /\.(jpe?g|png)$/i.test(a));
  for (const arquivo of arquivos) {
    process.stdout.write(`${await otimizarFoto(arquivo)}\n`);
  }
}

principal().catch((erro) => {
  process.stderr.write(`Falha ao otimizar mídia: ${erro.message}\n`);
  process.exitCode = 1;
});
