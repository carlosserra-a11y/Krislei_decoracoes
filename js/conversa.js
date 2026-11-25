// Balão de conversa: um convite discreto para começar o pedido no WhatsApp. Aparece uma vez por sessão.
const CHAVE = 'krislei:conversa';
const ESPERA_MS = 14000;

function jaVisto() {
  try {
    return Boolean(sessionStorage.getItem(CHAVE));
  } catch {
    return false;
  }
}

function marcarVisto() {
  try {
    sessionStorage.setItem(CHAVE, '1');
  } catch {
    /* sem armazenamento */
  }
}

/** Não interrompe quem está preenchendo o assistente, vendo uma foto ou já na chamada final. */
function momentoRuim() {
  // no topo ele cobriria o botão principal: espera a pessoa começar a rolar
  if (window.scrollY < window.innerHeight * 0.7) return true;
  if (document.querySelector('dialog[open]')) return true;
  if (document.activeElement?.closest?.('form, dialog')) return true;
  const estaNaTela = (id) => {
    const caixa = document.getElementById(id)?.getBoundingClientRect();
    return Boolean(caixa) && caixa.top < window.innerHeight * 0.6 && caixa.bottom > window.innerHeight * 0.4;
  };
  return estaNaTela('monte') || estaNaTela('contato');
}

export function iniciarConversa() {
  const balao = document.getElementById('conversa');
  if (!balao || jaVisto()) return;

  const fechar = () => {
    marcarVisto();
    balao.classList.remove('visivel');
    setTimeout(() => { balao.hidden = true; }, 500);
  };
  const mostrar = () => {
    if (momentoRuim()) {
      setTimeout(mostrar, 6000);
      return;
    }
    balao.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => balao.classList.add('visivel')));
  };
  balao.addEventListener('click', (e) => {
    if (e.target.closest('.conversa__fechar, a[data-wa]')) fechar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !balao.hidden) fechar();
  });
  setTimeout(mostrar, ESPERA_MS);
}
