// Vídeos: tocam só quando entram na tela, nunca dois ao mesmo tempo, com controles acessíveis.
const reduzir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function trocarIcone(botao, id) {
  botao.querySelector('use')?.setAttribute('href', `#${id}`);
}

async function tocar(video) {
  try {
    await video.play();
  } catch {
    /* autoplay bloqueado: o visitante usa o botão de play */
  }
}

export function iniciarVideos() {
  const blocos = [...document.querySelectorAll('[data-video-bloco]')];
  const videos = blocos.map((b) => b.querySelector('video'));

  blocos.forEach((bloco) => {
    const video = bloco.querySelector('video');
    const botaoPlay = bloco.querySelector('[data-video-play]');
    const botaoSom = bloco.querySelector('[data-video-som]');
    const botaoTela = bloco.querySelector('[data-video-tela]');
    let pausadoPeloUsuario = false;

    const sincronizar = () => trocarIcone(botaoPlay, video.paused ? 'i-play' : 'i-pause');
    video.addEventListener('play', () => {
      videos.filter((v) => v !== video).forEach((v) => v.pause());
      sincronizar();
    });
    video.addEventListener('pause', sincronizar);

    botaoPlay.addEventListener('click', () => {
      if (video.paused) {
        pausadoPeloUsuario = false;
        tocar(video);
      } else {
        pausadoPeloUsuario = true;
        video.pause();
      }
    });
    botaoSom.addEventListener('click', () => {
      video.muted = !video.muted;
      botaoSom.setAttribute('aria-pressed', String(!video.muted));
      botaoSom.setAttribute('aria-label', video.muted ? 'Ligar o som' : 'Desligar o som');
    });
    botaoTela.addEventListener('click', () => {
      const pedir = video.requestFullscreen ?? video.webkitRequestFullscreen ?? video.webkitEnterFullscreen;
      pedir?.call(video);
    });

    if (reduzir() || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !pausadoPeloUsuario) tocar(video);
        else if (!entrada.isIntersecting) video.pause();
      },
      { threshold: 0.55 },
    ).observe(bloco);
  });
}
