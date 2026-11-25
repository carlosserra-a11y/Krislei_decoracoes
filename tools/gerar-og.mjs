// Gera assets/og.jpg (1200x630) para o compartilhamento em WhatsApp/redes, a partir da foto 04.
// Uso: cd tools && npm install && node gerar-og.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const foto = path.join(raiz, 'assets', 'fotos', '04-margaridas-rosa-amarelo-neon-1.jpeg');
const saida = path.join(raiz, 'assets', 'og.jpg');

const LARGURA_ARCO = 500;
const ALTURA_ARCO = 580;

const mascaraArco = Buffer.from(
  `<svg width="${LARGURA_ARCO}" height="${ALTURA_ARCO}"><path d="M0 ${ALTURA_ARCO}V250C0 112 112 0 250 0s250 112 250 250v${ALTURA_ARCO - 250}z" fill="#fff"/></svg>`,
);

const fundo = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFF7F1"/><stop offset="1" stop-color="#FBD3E0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1080" cy="80" r="130" fill="#B9A3E3" opacity="0.45"/>
  <circle cx="560" cy="580" r="110" fill="#9ADBC9" opacity="0.5"/>
  <text x="70" y="250" font-family="Georgia, serif" font-style="italic" font-size="130" fill="#B8386B">Krislei</text>
  <text x="76" y="310" font-family="Arial, sans-serif" font-weight="700" font-size="32" letter-spacing="14" fill="#2B2230">DECORAÇÕES</text>
  <text x="76" y="402" font-family="Georgia, serif" font-weight="700" font-size="46" fill="#2B2230">Aluguel de decorações</text>
  <text x="76" y="456" font-family="Georgia, serif" font-weight="700" font-size="46" fill="#2B2230">para festas</text>
  <text x="76" y="534" font-family="Arial, sans-serif" font-size="28" fill="#5E5266">Aniversário · Chá de bebê · 15 anos</text>
</svg>`);

async function gerar() {
  const recorte = await sharp(foto).resize(LARGURA_ARCO, ALTURA_ARCO, { fit: 'cover', position: 'centre' }).toBuffer();
  const arco = await sharp(recorte).composite([{ input: mascaraArco, blend: 'dest-in' }]).png().toBuffer();
  await sharp(fundo).composite([{ input: arco, left: 650, top: 25 }]).jpeg({ quality: 88 }).toFile(saida);
  process.stdout.write(`Gerado: ${saida}\n`);
}

gerar().catch((erro) => {
  process.stderr.write(`Falha ao gerar a imagem: ${erro.message}\n`);
  process.exitCode = 1;
});
