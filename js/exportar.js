// Gera a lista em texto, imagem (PNG) e PDF, sem bibliotecas externas.
// O PDF é montado à mão: cada página é uma imagem JPEG em tamanho A4.

const Exportar = (() => {
  const CORES = { papel: '#fbf6ea', tinta: '#262a22', suave: '#5f6858', risco: '#e3dac6', verde: '#2e7d55', pouco: '#9a6608', pouco_fundo: '#f7e2ac' };
  const FONTE = '"Shantell Sans", system-ui, sans-serif';
  const CAIXA = new Path2D('M4.2 5.1C9 3.8 14.8 4.6 19.6 4.1c.6 5 .1 10.2.4 15.6-5.1.6-10.4-.2-15.6.3-.6-5.1.2-10-.2-14.9Z');

  function dataHoje() {
    return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Texto pronto para o WhatsApp (*negrito* vira negrito lá).
  function texto(grupos) {
    const linhas = [`*Lista de compras* — ${dataHoje()}`, ''];
    for (const g of grupos) {
      linhas.push(`*${g.nome}*`);
      for (const e of g.itens) linhas.push(`- ${e.nome}${e.status === 'pouco' ? ' (pouco)' : ''}`);
      linhas.push('');
    }
    return linhas.join('\n').trim();
  }

  // Transforma os grupos em linhas com altura fixa, para desenhar e paginar.
  function linhasDe(grupos) {
    const out = [];
    for (const g of grupos) {
      out.push({ tipo: 'cat', texto: g.nome, icone: g.pontual ? null : g.icone, alt: 100 });
      for (const e of g.itens) out.push({ tipo: 'item', texto: e.nome, pouco: e.status === 'pouco', alt: 68 });
    }
    return out;
  }

  function cortar(ctx, t, larg) {
    if (ctx.measureText(t).width <= larg) return t;
    while (t.length > 1 && ctx.measureText(t + '…').width > larg) t = t.slice(0, -1);
    return t + '…';
  }

  function carregarImagem(src) {
    return new Promise((ok) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = () => ok(null);
      im.src = src;
    });
  }

  async function prepararIcones(grupos) {
    const mapa = {};
    for (const g of grupos) {
      if (g.pontual || mapa[g.icone] !== undefined) continue;
      const svg = Icones.svgAvulso(g.icone);
      mapa[g.icone] = await carregarImagem('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    }
    return mapa;
  }

  function desenharCabecalho(ctx, W, P, total, pagina, nPaginas) {
    ctx.fillStyle = CORES.tinta;
    ctx.font = `800 64px ${FONTE}`;
    ctx.fillText('Lista de compras', P, P + 58);
    ctx.fillStyle = CORES.suave;
    ctx.font = `400 32px ${FONTE}`;
    let sub = `${dataHoje()} · ${total} ${total === 1 ? 'item' : 'itens'}`;
    if (nPaginas > 1) sub += ` · página ${pagina}/${nPaginas}`;
    ctx.fillText(sub, P, P + 108);
    // traço de giz
    ctx.strokeStyle = CORES.verde;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(P + 2, P + 136);
    ctx.bezierCurveTo(P + 40, P + 130, P + 80, P + 140, P + 120, P + 132);
    ctx.stroke();
    return P + 150;
  }

  function desenharLinha(ctx, l, y, W, P, icones) {
    if (l.tipo === 'cat') {
      let x = P;
      const im = l.icone && icones[l.icone];
      if (im) { ctx.drawImage(im, P - 6, y + 22, 64, 64); x = P + 70; }
      ctx.fillStyle = CORES.tinta;
      ctx.font = `800 40px ${FONTE}`;
      ctx.fillText(cortar(ctx, l.texto, W - P - x), x, y + 70);
      return;
    }
    const meio = y + l.alt / 2;
    ctx.save();
    ctx.translate(P + 4, meio - 19);
    ctx.scale(1.6, 1.6);
    ctx.strokeStyle = CORES.suave;
    ctx.lineWidth = 1.6;
    ctx.stroke(CAIXA);
    ctx.restore();
    let fimTexto = W - P;
    if (l.pouco) {
      ctx.font = `700 28px ${FONTE}`;
      const lt = ctx.measureText('pouco').width;
      ctx.fillStyle = CORES.pouco_fundo;
      ctx.fillRect(W - P - lt - 20, meio - 20, lt + 20, 36);
      ctx.fillStyle = CORES.pouco;
      ctx.fillText('pouco', W - P - lt - 10, meio + 8);
      fimTexto = W - P - lt - 40;
    }
    ctx.fillStyle = CORES.tinta;
    ctx.font = `400 38px ${FONTE}`;
    ctx.fillText(cortar(ctx, l.texto, fimTexto - (P + 64)), P + 64, meio + 13);
    ctx.strokeStyle = CORES.risco;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(P + 64, y + l.alt);
    ctx.lineTo(W - P, y + l.alt);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Divide as linhas em páginas de altura máxima (Infinity = página única).
  function paginar(linhas, topo, maxY) {
    const paginas = [[]];
    let y = topo;
    for (const l of linhas) {
      // Categoria não fica sozinha no fim da página.
      const precisa = l.tipo === 'cat' ? l.alt + 68 : l.alt;
      if (y + precisa > maxY && paginas[paginas.length - 1].length) {
        paginas.push([]);
        y = topo;
      }
      paginas[paginas.length - 1].push({ l, y });
      y += l.alt;
    }
    return { paginas, fimY: y };
  }

  function novoCanvas(w, h, fundo) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, w, h);
    return { c, ctx };
  }

  function total(grupos) {
    return grupos.reduce((n, g) => n + g.itens.length, 0);
  }

  function emBlob(canvas, tipo, q) {
    return new Promise((ok) => canvas.toBlob(ok, tipo, q));
  }

  async function prontoParaDesenhar(grupos) {
    try { await document.fonts.load(`400 38px "Shantell Sans"`); await document.fonts.load(`800 40px "Shantell Sans"`); } catch (e) { /* usa a fonte reserva */ }
    return prepararIcones(grupos);
  }

  async function imagem(grupos) {
    const icones = await prontoParaDesenhar(grupos);
    const W = 1080, P = 72;
    const topo = 226;
    const { paginas, fimY } = paginar(linhasDe(grupos), topo, Infinity);
    const { c, ctx } = novoCanvas(W, Math.max(fimY + P, 600), CORES.papel);
    desenharCabecalho(ctx, W, P, total(grupos), 1, 1);
    for (const { l, y } of paginas[0]) desenharLinha(ctx, l, y, W, P, icones);
    return emBlob(c, 'image/png');
  }

  async function pdf(grupos) {
    const icones = await prontoParaDesenhar(grupos);
    const W = 1240, H = 1754, P = 90; // A4 a 150 dpi
    const topo = P + 154;
    const { paginas } = paginar(linhasDe(grupos), topo, H - P);
    const jpegs = [];
    for (let i = 0; i < paginas.length; i++) {
      const { c, ctx } = novoCanvas(W, H, '#ffffff');
      desenharCabecalho(ctx, W, P, total(grupos), i + 1, paginas.length);
      for (const { l, y } of paginas[i]) desenharLinha(ctx, l, y, W, P, icones);
      const b = await emBlob(c, 'image/jpeg', 0.9);
      jpegs.push({ bytes: new Uint8Array(await b.arrayBuffer()), w: W, h: H });
    }
    return montarPdf(jpegs);
  }

  function montarPdf(paginas) {
    const enc = new TextEncoder();
    const partes = [];
    const offs = [];
    let tam = 0;
    const add = (x) => {
      const b = typeof x === 'string' ? enc.encode(x) : x;
      partes.push(b);
      tam += b.length;
    };
    const obj = (num, corpo) => {
      offs[num] = tam;
      add(`${num} 0 obj\n`);
      corpo();
      add('\nendobj\n');
    };

    add('%PDF-1.4\n');
    const n = paginas.length;
    // 1 = catálogo, 2 = páginas; cada página usa 3 objetos (página, conteúdo, imagem).
    obj(1, () => add('<< /Type /Catalog /Pages 2 0 R >>'));
    const kids = paginas.map((_, k) => `${3 + 3 * k} 0 R`).join(' ');
    obj(2, () => add(`<< /Type /Pages /Kids [${kids}] /Count ${n} >>`));
    paginas.forEach((p, k) => {
      const pg = 3 + 3 * k;
      obj(pg, () => add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${k} ${pg + 2} 0 R >> >> /Contents ${pg + 1} 0 R >>`));
      const cs = `q 595.28 0 0 841.89 0 0 cm /Im${k} Do Q`;
      obj(pg + 1, () => { add(`<< /Length ${cs.length} >>\nstream\n`); add(cs); add('\nendstream'); });
      obj(pg + 2, () => {
        add(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`);
        add(p.bytes);
        add('\nendstream');
      });
    });
    const totalObjs = 3 + 3 * n;
    const xref = tam;
    let tabela = `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
    for (let i = 1; i < totalObjs; i++) tabela += `${String(offs[i]).padStart(10, '0')} 00000 n \n`;
    add(tabela);
    add(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: 'application/pdf' });
  }

  // Compartilha pelo menu do celular (WhatsApp etc.) ou baixa o arquivo.
  async function entregar(blob, nome) {
    const arquivo = new File([blob], nome, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      try {
        await navigator.share({ files: [arquivo], title: 'Lista de compras' });
        return 'compartilhado';
      } catch (e) {
        if (e.name === 'AbortError') return 'cancelado';
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'baixado';
  }

  function nomeArquivo(ext) {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `lista-de-compras-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.${ext}`;
  }

  return { texto, imagem, pdf, entregar, nomeArquivo };
})();
