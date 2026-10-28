// Ícones desenhados à mão: uma mancha de giz colorida, um pouco deslocada,
// com o contorno em traço fino de caneta por cima (caixa de 64×64).

const Icones = (() => {
  const COR = {
    tomate: '#d2553f', cenoura: '#ec9a4a', mostarda: '#e9be3e', creme: '#e9cf8f',
    folha: '#6f9a5e', ceu: '#8fb8c8', lavanda: '#a998cf', rosa: '#e88aa0', casca: '#d9a066', cafe: '#a87a55',
  };

  // manchas: [cor, cx, cy, rx, ry, rotação]
  const DESENHOS = {
    arroz: {
      nome: 'Saco de grãos', manchas: [['creme', 33, 40, 18, 18, 0]],
      linhas: 'M20 24C14 34 13 50 20 55C28 59 38 59 45 55C52 50 50 34 44 24C38 27 26 27 20 24M22 21C26 17 30 19 32 22C34 18 40 16 42 21M26 39C30 37 35 37 39 39L38 48C34 50 30 50 27 48Z',
    },
    carne: {
      nome: 'Carne', manchas: [['tomate', 31, 26, 17, 14, -30]],
      linhas: 'M28 40C16 36 14 18 26 12C38 6 52 16 46 30C44 34 40 36 38 38M28 40L42 52M38 38L48 47M42 52C40 58 46 60 48 56C52 58 56 52 52 50C56 46 50 42 48 47M25 22C29 18 34 24 30 27',
    },
    queijo: {
      nome: 'Queijo', manchas: [['mostarda', 33, 38, 21, 14, -8]],
      linhas: 'M10 40L44 20C50 22 54 28 54 32L54 46L12 52ZM10 40L54 32M22 45c0-3 5-3 5 0c0 3-5 3-5 0ZM38 42c0-2 4-2 4 0c0 2-4 2-4 0ZM46 47c0-2 3-2 3 0c0 2-3 2-3 0Z',
    },
    cenoura: {
      nome: 'Cenoura', manchas: [['cenoura', 30, 40, 11, 19, 25], ['folha', 33, 16, 10, 9, 0]],
      linhas: 'M24 26C30 22 40 24 41 30C40 40 30 52 22 58C20 50 20 36 24 26ZM33 24C30 16 26 12 22 8M35 24C36 15 40 10 44 6M34 24C34 18 33 12 34 6M25 34l5 1M24 42l4 1M29 38l3 1',
    },
    pao: {
      nome: 'Pão', manchas: [['casca', 31, 37, 22, 13, -6]],
      linhas: 'M10 40C8 28 20 22 32 22C46 22 56 28 54 40C54 46 48 48 32 48C16 48 10 46 10 40ZM20 30C22 34 24 36 26 38M30 28C32 32 34 35 36 37M40 29C42 32 44 34 46 36',
    },
    limpeza: {
      nome: 'Borrifador', manchas: [['ceu', 34, 42, 13, 17, 6]],
      linhas: 'M24 30L22 56C22 58 24 59 26 59L40 59C42 59 43 58 43 56L41 30ZM27 30L28 22L37 22L38 30M26 22L26 14L46 14L48 19L37 19M51 14l5-2M52 19l5 1M30 42c4-3 8 3 4 6',
    },
    papel: {
      nome: 'Papel higiênico', manchas: [['lavanda', 30, 38, 17, 17, 0]],
      linhas: 'M14 22C14 16 34 16 34 22C34 28 14 28 14 22ZM21 22c0-2 6-2 6 0c0 2-6 2-6 0ZM14 22L14 46C14 52 34 52 34 46L34 22M34 30L52 30L52 56C48 54 46 58 42 56C40 54 38 56 36 55L34 48M37 42h4M45 42h4',
    },
    maca: {
      nome: 'Fruta', manchas: [['tomate', 33, 39, 18, 17, 0], ['folha', 42, 13, 6, 4, -20]],
      linhas: 'M32 22C24 16 12 22 14 36C16 50 26 58 32 54C38 58 48 50 50 36C52 22 40 16 32 22ZM32 22C32 16 34 12 36 10M34 16C38 10 46 10 48 12C44 16 38 18 34 16Z',
    },
    lata: {
      nome: 'Enlatado', manchas: [['tomate', 31, 37, 15, 19, 0]],
      linhas: 'M18 18C18 14 46 14 46 18C46 22 18 22 18 18ZM18 18L18 52C18 56 46 56 46 52L46 18M18 28C26 31 38 31 46 28M18 44C26 47 38 47 46 44M28 36c2-3 6-3 8 0',
    },
    cafe: {
      nome: 'Café', manchas: [['cafe', 30, 44, 17, 13, 0]],
      linhas: 'M14 30L16 50C17 56 22 58 28 58L34 58C40 58 44 56 45 50L47 30ZM46 34C54 32 56 42 45 46M24 24C20 20 28 16 24 10M34 24C30 20 38 16 34 10',
    },
    garrafa: {
      nome: 'Garrafa', manchas: [['folha', 33, 42, 12, 18, 0]],
      linhas: 'M27 8L37 8L37 14L27 14ZM28 14L28 22C22 26 20 30 20 36L20 56C20 58 22 59 24 59L40 59C42 59 44 58 44 56L44 36C44 30 42 26 36 22L36 14M20 40L44 40M20 50L44 50',
    },
    leite: {
      nome: 'Leite', manchas: [['ceu', 31, 41, 15, 18, 0]],
      linhas: 'M20 24L32 14L44 24L44 58L20 58ZM20 24L44 24M26 19L26 12L38 12L38 19M32 36C28 42 28 46 32 46C36 46 36 42 32 36Z',
    },
    ovo: {
      nome: 'Ovos', manchas: [['mostarda', 32, 42, 20, 13, 0]],
      linhas: 'M22 26C14 26 10 42 14 48C18 54 28 54 31 48C34 40 30 26 22 26ZM42 30C34 30 32 44 34 50C38 56 48 56 51 50C54 42 50 30 42 30Z',
    },
    peixe: {
      nome: 'Peixe', manchas: [['ceu', 29, 33, 19, 11, 0]],
      linhas: 'M10 32C18 20 36 18 46 32C36 46 18 44 10 32ZM46 32L56 24L54 32L56 40ZM18 30c1-1 2 1 1 2M28 24C30 20 34 20 36 23',
    },
    congelado: {
      nome: 'Congelados', manchas: [['ceu', 32, 33, 18, 17, 0]],
      linhas: 'M32 10L32 54M13 21L51 43M13 43L51 21M27 14L32 18L37 14M27 50L32 46L37 50M14 28L19 26L17 20M50 36L45 38L47 44',
    },
    doce: {
      nome: 'Doces', manchas: [['rosa', 32, 33, 18, 11, -12]],
      linhas: 'M24 32C24 24 40 24 40 32C40 40 24 40 24 32ZM24 32L12 24L14 40ZM40 32L52 24L50 40ZM30 26C28 30 28 34 30 38M35 26C33 30 33 34 35 38',
    },
    pata: {
      nome: 'Pet', manchas: [['casca', 32, 38, 18, 17, 0]],
      linhas: 'M22 44C20 36 28 32 32 32C36 32 44 36 42 44C41 50 36 50 32 48C28 50 23 50 22 44ZM18 32c-3-4 2-8 4-4c2 4-2 8-4 4ZM26 22c-2-5 4-8 5-3c1 5-4 7-5 3ZM38 22c1-5 7-3 5 2c-2 4-6 3-5-2ZM46 32c2-4 7-1 4 3c-2 4-6 1-4-3Z',
    },
    remedio: {
      nome: 'Farmácia', manchas: [['lavanda', 32, 33, 19, 11, -38]],
      linhas: 'M20 46C14 40 20 32 26 28L38 18C44 14 52 20 48 28L36 40C30 46 24 50 20 46ZM32 24L42 34',
    },
    casa: {
      nome: 'Casa', manchas: [['folha', 32, 40, 18, 15, 0]],
      linhas: 'M12 32L32 14L52 32M18 28L18 54L46 54L46 28M28 54L28 42L36 42L36 54',
    },
    caixa: {
      nome: 'Caixa', manchas: [['casca', 32, 39, 20, 15, 0]],
      linhas: 'M12 24L32 16L52 24L52 48L32 56L12 48ZM12 24L32 32L52 24M32 32L32 56M22 20L42 28',
    },
    tempero: {
      nome: 'Temperos', manchas: [['creme', 32, 41, 14, 17, 0]],
      linhas: 'M24 26C22 18 42 18 40 26ZM22 26L20 56L44 56L42 26ZM28 21h.1M32 20h.1M36 21h.1M26 36L38 36',
    },
    sabonete: {
      nome: 'Higiene', manchas: [['rosa', 31, 41, 20, 12, 0]],
      linhas: 'M12 40C12 32 18 30 30 30C44 30 50 32 50 40C50 48 44 50 30 50C18 50 12 48 12 40ZM20 22c0-4 6-4 6 0c0 4-6 4-6 0ZM34 16c0-3 4-3 4 0c0 3-4 3-4 0ZM44 24c0-2 3-2 3 0c0 2-3 2-3 0Z',
    },
    folha: {
      nome: 'Verduras', manchas: [['folha', 32, 32, 19, 15, -40]],
      linhas: 'M14 50C12 30 26 14 50 12C52 36 38 52 14 50ZM14 50C26 38 36 28 44 20M24 40L22 30M32 32L30 22M30 36L40 36',
    },
  };

  // Palavras do nome do item que puxam um ícone próprio (senão usa o da categoria).
  const PALAVRAS = [
    ['arroz|feijao|lentilha|grao|farinha|acucar|aveia|fuba|milho', 'arroz'],
    ['carne|bife|frango|linguica|bacon|costela|file|patinho|alcatra|salsicha|hamburguer', 'carne'],
    ['queijo|presunto|mussarela|requeijao|manteiga|margarina|iogurte', 'queijo'],
    ['cenoura|batata|mandioca|beterraba|abobora', 'cenoura'],
    ['pao|bolo|biscoito|bolacha|torrada', 'pao'],
    ['detergente|sabao|amaciante|sanitaria|desinfetante|limpador|alvejante|multiuso|esponja|saco de lixo', 'limpeza'],
    ['papel|guardanapo|lenco', 'papel'],
    ['maca|banana|laranja|limao|uva|mamao|manga|pera|fruta|morango|abacaxi|tomate', 'maca'],
    ['molho|extrato|milho verde|ervilha|sardinha|atum|lata', 'lata'],
    ['cafe|cha|achocolatado', 'cafe'],
    ['oleo|azeite|vinagre|refrigerante|suco|agua|cerveja|vinho', 'garrafa'],
    ['leite|creme de leite', 'leite'],
    ['ovo', 'ovo'],
    ['peixe|tilapia|salmao|camarao', 'peixe'],
    ['sorvete|congelad|gelo', 'congelado'],
    ['chocolate|doce|bala|chiclete|leite condensado', 'doce'],
    ['racao|areia|petisco', 'pata'],
    ['remedio|vitamina|curativo|dipirona', 'remedio'],
    ['sal|tempero|pimenta|oregano|alho|cebola|caldo', 'tempero'],
    ['sabonete|shampoo|condicionador|pasta de dente|escova|desodorante|absorvente|fio dental|creme', 'sabonete'],
    ['alface|couve|rucula|espinafre|cheiro verde|salsinha|brocolis|verdura', 'folha'],
  ].map(([p, nome]) => [new RegExp(`\\b(${p})`), nome]);

  function semAcento(t) {
    return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function paraItem(nomeItem, iconeCategoria) {
    const t = semAcento(nomeItem);
    for (const [re, nome] of PALAVRAS) if (re.test(t)) return nome;
    return iconeCategoria || 'caixa';
  }

  // Mancha orgânica: pontos em volta de uma elipse com raio irregular, ligados por curvas.
  function mancha(cx, cy, rx, ry, rot, semente) {
    let s = semente;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const n = 8;
    const pts = [];
    const a0 = rand() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * Math.PI * 2;
      const k = 0.84 + rand() * 0.26;
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      const r = (rot * Math.PI) / 180;
      pts.push([cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  }

  function sementeDe(t) {
    let h = 7;
    for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 233280;
    return h;
  }

  // Desenho de um ícone; `tinta` é a cor do traço (no app, a cor do texto).
  function svg(nome, { classe = '', tinta = 'var(--tinta)', filtros = true, titulo = '' } = {}) {
    const d = DESENHOS[nome] || DESENHOS.caixa;
    const manchas = d.manchas.map(([cor, cx, cy, rx, ry, rot], i) =>
      `<path d="${mancha(cx + 3, cy + 3, rx * 1.22, ry * 1.22, rot, sementeDe(nome) + i * 101)}" fill="${COR[cor]}"/>`).join('');
    const fg = filtros ? ' filter="url(#giz)"' : '';
    const ft = filtros ? ' filter="url(#traco)"' : '';
    const rotulo = titulo ? `role="img" aria-label="${titulo}"` : 'aria-hidden="true"';
    return `<svg class="ilustra ${classe}" viewBox="0 0 64 64" ${rotulo}><g${fg} class="giz">${manchas}</g><g${ft} fill="none" stroke="${tinta}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${d.linhas}"/></g></svg>`;
  }

  // Versão independente (com os próprios filtros), para desenhar no canvas da exportação.
  function svgAvulso(nome, tinta = '#262a22') {
    const corpo = svg(nome, { tinta }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256">${FILTROS}${corpo}</svg>`;
  }

  const FILTROS = `<defs>
    <filter id="giz" filterUnits="userSpaceOnUse" x="-10" y="-10" width="84" height="84">
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7" result="r"/>
      <feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.7" result="graos"/>
      <feComposite in="SourceGraphic" in2="graos" operator="in" result="textura"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="2" result="onda"/>
      <feDisplacementMap in="textura" in2="onda" scale="4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="traco" filterUnits="userSpaceOnUse" x="-10" y="-10" width="84" height="84">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="onda"/>
      <feDisplacementMap in="SourceGraphic" in2="onda" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="traco-ui" filterUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
      <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="1" seed="9" result="onda"/>
      <feDisplacementMap in="SourceGraphic" in2="onda" scale="1.1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>`;

  // Ícones de interface (caixa 24×24), em traço de caneta.
  const UI = {
    carrinho: 'M3 4.5c1.2-.3 2-.2 2.4.4l2.2 10.4c.2 1 1 1.6 2 1.6h7.6c.9 0 1.7-.6 1.9-1.5L21 8.2c-4.8-.4-9.8-.3-14.6 0M10 20.5h.1M17.5 20.5h.1',
    cartas: 'M8 4.2c3.4-.3 6.8-.2 10 .1.6 4.5.6 9.6.1 14.6-3.3.4-6.7.3-10-.1-.5-4.8-.6-9.7-.1-14.6ZM5 7c-.6 3.6-.5 8 .1 11.6M10.5 12l2 2 3.5-4',
    casa: 'M3 11.5 12 4l9 7.5M5.3 10c-.3 3.4-.2 6.8 0 10.2 4.5.3 9 .3 13.4 0 .3-3.4.3-6.8 0-10.2M10 20.2c-.1-1.8 0-3.6.2-5.2h3.6c.2 1.6.2 3.4.1 5.2',
    compartilhar: 'M12 15.5c-.2-4-.1-8 .1-12M7.5 7.8 12 3.4l4.4 4.5M5 13c-.2 2-.1 4.1.2 6.2.7.8 1.6 1.1 2.6 1.1h8.6c1 0 1.9-.4 2.5-1.1.3-2 .3-4.1.1-6.2',
    mais: 'M12 5c-.2 4.7-.1 9.4.1 14M5 12.1c4.7-.3 9.3-.2 14 0',
    opcoes: 'M12 5h.1M12 12h.1M12 19h.1',
    desfazer: 'M9 14.2 4.2 9 9 4.3M4.4 9c3.5-.3 7.1-.3 10.4 0 3 .5 5 2.8 5 5.6 0 3-2.4 5.2-5.4 5.3-1.2 0-2.4 0-3.4-.1',
    fechar: 'M6 6.2c4 3.8 8 7.6 12 11.7M17.8 6c-4 3.8-7.9 7.8-11.8 12',
    buscar: 'M11 4.2c3.9-.2 6.9 2.8 6.8 6.7-.1 3.8-3 6.6-6.9 6.6-3.8 0-6.8-3-6.7-6.8.1-3.6 3.1-6.5 6.8-6.5ZM16.2 16.4 20 20.2',
    lixo: 'M4 7.2c5.3-.3 10.7-.3 16 0M6.3 7.4c.2 4.3.5 8.6 1 12.8 3.1.3 6.2.3 9.3 0 .5-4.2.8-8.5 1-12.8M9.3 7c-.1-1-.1-2 .1-3 1.7-.2 3.5-.2 5.2 0 .2 1 .2 2 .1 3M10.2 11c0 2.2.1 4.3.2 6.4M13.8 11c0 2.2-.1 4.3-.2 6.4',
    subir: 'M6 15.2c2-2.1 4-4.1 6-6.1 2 2 4 4 6 6.2',
    descer: 'M6 9c2 2 4 4.1 6 6.1 2-2 4-4.1 6-6.2',
    tem: 'M4.8 12.6c1.7 1.6 3.3 3.3 4.8 5 3-4.3 6.2-8.3 9.6-12.2',
    pouco: 'M5 12.6c2.3-1 4.5 1 7 0s4.6-1 7 .2',
    falta: 'M6.3 6.2c3.9 3.9 7.8 7.7 11.5 11.7M17.7 6.1c-3.9 3.9-7.8 7.8-11.4 11.9',
    depois: 'M12 3.8c4.6-.1 8.3 3.6 8.2 8.2-.1 4.5-3.7 8.1-8.2 8.1-4.6 0-8.2-3.7-8.1-8.3.1-4.4 3.7-8 8.1-8ZM12 7.6c-.1 1.7-.1 3.3.1 4.9 1.3.7 2.6 1.4 3.8 2.2',
    texto: 'M4.2 5.4c5.2-.4 10.4-.4 15.6 0 .4 3.3.4 6.7 0 10-3.5.3-7 .3-10.4.2L5 19.4c.1-1.3.1-2.6 0-4-.6-3.3-.8-6.6-.8-10ZM8 9.5h8M8 12.3h5',
    imagem: 'M4 5.2c5.3-.4 10.7-.4 16 0 .4 4.5.4 9 0 13.6-5.3.4-10.7.4-16 0-.4-4.6-.4-9.1 0-13.6ZM4.4 16.2c2.3-2.4 4.4-4.6 6.4-6.7 2.2 2.4 4 4.6 5.8 6.6M14.3 13.8c1-.9 2-1.8 3-2.6l2.4 2.4M15.5 8.4h.1',
    pdf: 'M6.2 3.5c2.9-.2 5.8-.2 8.6 0l4 4.2c.2 4.2.2 8.4-.1 12.6-4.2.3-8.4.3-12.5 0-.4-5.6-.4-11.2 0-16.8ZM14.6 3.6c-.1 1.5-.1 2.9.1 4.3 1.4.1 2.8.1 4.1-.1M9 12.6h6M9 16h4',
    salvar: 'M12 4c-.2 3.7-.1 7.4.1 11M8 11.4l4 4 4-4.1M5 19.8c4.6.3 9.3.3 14 0',
    restaurar: 'M12 15.4c-.2-3.7-.1-7.4.1-11.1M8 8.2l4-4 4 4.1M5 19.8c4.6.3 9.3.3 14 0',
    pasta: 'M3.8 6.6c.1-1 .1-1.7.4-2.4 1.8-.2 3.6-.1 5.3 0l1.8 2.1c2.9 0 5.8-.1 8.7.2.4 4.3.4 8.6 0 12.9-5.4.4-10.8.4-16.2 0-.3-4.3-.3-8.6 0-12.8',
    seta: 'M5 12.2c4.5-.2 9-.2 13.6 0M13.6 7.2l5 5-5 5',
  };

  function ui(nome, { classe = '', filtro = true } = {}) {
    return `<svg class="ui ${classe}" viewBox="0 0 24 24" aria-hidden="true"><path d="${UI[nome]}"${filtro ? ' filter="url(#traco-ui)"' : ''}/></svg>`;
  }

  const DE_EMOJI = {
    '🍚': 'arroz', '🥩': 'carne', '🧀': 'queijo', '🥕': 'cenoura', '🍎': 'maca', '🍞': 'pao', '🥫': 'lata',
    '🧂': 'tempero', '☕': 'cafe', '🥤': 'garrafa', '🍫': 'doce', '❄️': 'congelado', '🧽': 'limpeza',
    '🧻': 'papel', '🧴': 'sabonete', '🐾': 'pata', '👶': 'caixa', '💊': 'remedio', '🏠': 'casa', '📦': 'caixa',
  };

  return { svg, svgAvulso, ui, paraItem, FILTROS, nomes: Object.keys(DESENHOS), rotulo: (n) => (DESENHOS[n] || DESENHOS.caixa).nome, DE_EMOJI };
})();
