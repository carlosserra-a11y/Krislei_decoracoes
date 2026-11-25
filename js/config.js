// ÚNICO arquivo que a cliente/o desenvolvedor precisa editar para publicar.
// Tudo o que estiver vazio ("") ou null simplesmente não aparece na página.

export const CONFIG = Object.freeze({
  marca: 'Krislei Decorações', // CONFIRMAR o nome comercial exato
  donaNome: 'Krislei', // CONFIRMAR a grafia

  // OBRIGATÓRIO: só dígitos, com 55 + DDD + número. Ex.: '5548999998888'
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

  // CONFIRMAR se a pista de LED faz parte do que ela aluga. false = esconde a seção inteira.
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
  // `foto` e `pos` definem o recorte da foto real; `cena` liga a peça ao palco 3D.
  pecas: Object.freeze([
    { id: 'paineis-arco', nome: 'Painéis em arco', desc: 'O arco que emoldura a mesa e vira o centro da festa.', ativo: true, padrao: true, cena: 'arco', foto: '02', pos: '22% 38%' },
    { id: 'paineis-redondos', nome: 'Painéis redondos', desc: 'Com a arte do tema escolhido: jardim, cerejeira, margaridas…', ativo: true, padrao: true, cena: 'redondo', foto: '03', pos: '20% 28%' },
    { id: 'cilindros', nome: 'Cilindros e mesas de doces', desc: 'Alturas diferentes que dão volume e ritmo ao cenário.', ativo: true, padrao: true, cena: 'cilindros', foto: '06', pos: '62% 82%' },
    { id: 'arcos-baloes', nome: 'Arcos de balões orgânicos', desc: 'Balões de tamanhos variados, fosco, cromado e transparente.', ativo: true, padrao: true, cena: 'baloes', foto: '02', pos: '72% 8%' },
    { id: 'neon', nome: 'Neon de números e letras', desc: 'O número da idade brilhando no meio da festa.', ativo: true, padrao: false, cena: 'neon', foto: '09', pos: '50% 76%' },
    { id: 'tapetes', nome: 'Tapetes de pelo', desc: 'Um chão macio que “assenta” todo o cenário.', ativo: true, padrao: true, cena: 'tapete', foto: '03', pos: '50% 100%' },
    { id: 'pista-led', nome: 'Pista de LED', desc: 'Um piso que brilha como um céu estrelado.', ativo: true, padrao: false, cena: null, foto: '08', pos: '50% 78%', secao: 'pistaLed' },
    { id: 'baloes-bolha', nome: 'Balões-bolha transparentes', desc: 'Flutuando no teto, deixam o salão leve e mágico.', ativo: true, padrao: false, cena: null, foto: '08', pos: '50% 4%' },
    { id: 'estantes', nome: 'Estantes-escada e nichos', desc: 'Para organizar lembrancinhas com charme.', ativo: true, padrao: false, cena: null, foto: '05', pos: '6% 62%' },
    { id: 'vasos-flores', nome: 'Vasos, topiarias e flores', desc: 'Verde e flores que dão vida e acabamento.', ativo: true, padrao: false, cena: null, foto: '07', pos: '72% 40%' },
    { id: 'letreiros', nome: 'Letreiros “Happy Birthday”', desc: 'Detalhe dourado que assina a comemoração.', ativo: true, padrao: false, cena: null, foto: '02', pos: '22% 24%' },
    { id: 'suportes-doces', nome: 'Suportes e bandejas para doces', desc: 'Dourados, brancos ou coloridos, para a mesa ficar linda.', ativo: true, padrao: false, cena: null, foto: '06', pos: '30% 70%' },
    { id: 'pecas-mdf', nome: 'Peças temáticas em MDF', desc: 'Borboletas, margaridas, passarinhos e casinhas recortadas.', ativo: true, padrao: false, cena: null, foto: '07', pos: '82% 96%' },
  ]),
});
