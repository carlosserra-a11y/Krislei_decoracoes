// ÚNICO arquivo que a cliente/o desenvolvedor precisa editar para publicar.
// Tudo o que estiver vazio ("") ou null simplesmente não aparece na página.

export const CONFIG = Object.freeze({
  marca: 'Krislei Decorações', // CONFIRMAR o nome comercial exato
  donaNome: 'Krislei', // CONFIRMAR a grafia

  // Número informado pelo desenvolvedor: (48) 98869-0917 (o 9 na frente foi confirmado em 25/11/2026).
  whatsapp: '5548988690917',
  // Como o número aparece na tela. Ex.: '(48) 99999-8888'
  whatsappExibicao: '(48) 98869-0917',

  instagram: '', // ex.: 'krislei.decoracoes' (sem @) — vazio = não mostra
  cidade: '',
  regiaoAtendida: '',
  horarioAtendimento: '',
  // URL pública do site (usada no SEO). Padrão: GitHub Pages do repositório.
  siteUrl: 'https://carlosserra-a11y.github.io/Krislei_decoracoes/',

  // null = "a confirmar" (a página usa texto neutro). true/false quando a cliente confirmar.
  servicos: Object.freeze({ entrega: null, montagem: null, retirada: null }),

  // CONFIRMAR se a pista de LED faz parte do que ela aluga. false = some do portfólio, das peças e do 3D.
  secoes: Object.freeze({ pistaLed: true }),

  // CONFIRMAR quais ocasiões ela atende.
  ocasioes: Object.freeze([
    { id: 'infantil', nome: 'Aniversário infantil', numero: true },
    { id: 'adulto', nome: 'Aniversário adulto', numero: true },
    { id: 'cha-bebe', nome: 'Chá de bebê', numero: false },
    { id: 'cha-revelacao', nome: 'Chá revelação', numero: false },
    { id: '15-anos', nome: '15 anos', numero: false, numeroFixo: 15 },
    { id: 'batizado', nome: 'Batizado', numero: false },
    { id: 'outra', nome: 'Outra comemoração', numero: false },
  ]),

  // CONFIRMAR o que ela realmente aluga: ative/desative com `ativo`.
  // `padrao` = já vem marcada no assistente · `cena` = peça correspondente no palco 3D · `curto` = nome nas etiquetas.
  pecas: Object.freeze([
    { id: 'paineis-arco', nome: 'Painéis em arco', curto: 'Painéis em arco', desc: 'O arco que emoldura a mesa e vira o centro da festa.', ativo: true, padrao: true, cena: 'arco' },
    { id: 'paineis-redondos', nome: 'Painéis redondos', curto: 'Painéis redondos', desc: 'Com a arte do tema escolhido: jardim, cerejeira, margaridas…', ativo: true, padrao: true, cena: 'redondo' },
    { id: 'cilindros', nome: 'Cilindros e mesas de doces', curto: 'Cilindros', desc: 'Alturas diferentes que dão volume e ritmo ao cenário.', ativo: true, padrao: true, cena: 'cilindros' },
    { id: 'arcos-baloes', nome: 'Arcos de balões orgânicos', curto: 'Arcos de balões', desc: 'Balões de tamanhos variados, fosco, cromado e transparente.', ativo: true, padrao: true, cena: 'baloes' },
    { id: 'suportes-doces', nome: 'Suportes e bandejas para doces', curto: 'Suportes de doces', desc: 'Dourados, brancos ou coloridos, para a mesa ficar linda.', ativo: true, padrao: true, cena: 'doces' },
    { id: 'tapetes', nome: 'Tapetes de pelo', curto: 'Tapetes', desc: 'Um chão macio que “assenta” todo o cenário.', ativo: true, padrao: true, cena: 'tapete' },
    { id: 'vasos-flores', nome: 'Vasos, topiarias e flores', curto: 'Vasos e flores', desc: 'Verde e flores que dão vida e acabamento.', ativo: true, padrao: true, cena: 'vasos' },
    { id: 'letreiros', nome: 'Letreiros “Happy Birthday”', curto: 'Letreiros', desc: 'Detalhe dourado que assina a comemoração.', ativo: true, padrao: true, cena: 'letreiro' },
    { id: 'neon', nome: 'Neon de números e letras', curto: 'Neon', desc: 'O número da idade brilhando no meio da festa.', ativo: true, padrao: false, cena: 'neon' },
    { id: 'baloes-bolha', nome: 'Balões-bolha transparentes', curto: 'Balões-bolha', desc: 'Flutuando no teto, deixam o salão leve e mágico.', ativo: true, padrao: false, cena: 'bolhas' },
    { id: 'pecas-mdf', nome: 'Peças temáticas em MDF', curto: 'Peças em MDF', desc: 'Borboletas, margaridas, passarinhos e casinhas recortadas.', ativo: true, padrao: false, cena: 'mdf' },
    { id: 'estantes', nome: 'Estantes-escada e nichos', curto: 'Estantes', desc: 'Para organizar lembrancinhas com charme.', ativo: true, padrao: false, cena: 'estante' },
    { id: 'pista-led', nome: 'Pista de LED', curto: 'Pista de LED', desc: 'Um piso que brilha como um céu estrelado.', ativo: true, padrao: false, cena: 'led', secao: 'pistaLed' },
  ]),
});
