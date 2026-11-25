// Preenche <img data-foto="NN"> com srcset, tamanho e texto alternativo vindos de dados.js.
import { FOTOS, fotoSrcset, fotoMaior } from './dados.js';

export function hidratarFotos(raiz = document) {
  raiz.querySelectorAll('img[data-foto]').forEach((img) => {
    const id = img.dataset.foto;
    const foto = FOTOS[id];
    if (!foto) return;
    img.srcset = fotoSrcset(id);
    img.sizes = img.dataset.sizes || '100vw';
    img.src = fotoMaior(id);
    img.width = foto.w;
    img.height = foto.h;
    if (!img.getAttribute('alt')) img.alt = foto.alt;
  });
}
