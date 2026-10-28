// Despensa: itens essenciais da casa, verificação estilo "arrasta pro lado"
// e lista de compras gerada a partir do que falta. Dados só no aparelho (localStorage).

const CHAVE = 'despensa:v1';
const STATUS = {
  tem: { rot: 'Tem', icone: 'tem' },
  pouco: { rot: 'Pouco', icone: 'pouco' },
  falta: { rot: 'Acabou', icone: 'falta' },
  depois: { rot: 'Agora não', icone: 'depois' },
};
const ORDEM_STATUS = ['tem', 'pouco', 'falta', 'depois'];

let S = carregar();
let aba = 'lista';
let busca = '';
let filtroCasa = 'todos';
let escolhaVerif = new Set(); // categorias escolhidas para verificar (vazio = tudo)

// ---------- dados ----------

function carregar() {
  try {
    const t = localStorage.getItem(CHAVE);
    if (t) return migrar(JSON.parse(t));
  } catch (e) { /* sem dados salvos */ }
  return null;
}

// Versão 1 usava emojis nas categorias; agora são ícones desenhados.
function migrar(st) {
  for (const c of st.categorias || []) {
    if (!c.icone) c.icone = Icones.DE_EMOJI[c.emoji] || 'caixa';
    delete c.emoji;
  }
  return st;
}

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { avisar('Não consegui salvar no aparelho.'); }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function novoEstado(comSugestao) {
  const st = { v: 2, categorias: [], itens: [], pontuais: [], carrinho: {}, sessao: null, ultimaVerificacao: null };
  if (comSugestao) {
    for (const c of SUGESTAO) {
      const id = uid();
      st.categorias.push({ id, nome: c.nome, icone: c.icone });
      for (const nome of c.itens) st.itens.push({ id: uid(), nome, cat: id, status: 'tem' });
    }
  } else {
    st.categorias.push({ id: uid(), nome: 'Geral', icone: 'caixa' });
  }
  return st;
}

const cat = (id) => S.categorias.find((c) => c.id === id) || { id: '', nome: 'Sem categoria', icone: 'caixa' };
const item = (id) => S.itens.find((i) => i.id === id);
const iconeItem = (i) => Icones.paraItem(i.nome, cat(i.cat).icone);
const precisaComprar = (i) => i.status === 'falta' || i.status === 'pouco';

function ordenarNome(a, b) {
  return a.nome.localeCompare(b.nome, 'pt-BR');
}

function normal(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function esc(t) {
  return String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Grupos da lista de compras: essenciais em falta/pouco por categoria + pontuais.
function gruposCompra() {
  const grupos = [];
  for (const c of S.categorias) {
    const itens = S.itens
      .filter((i) => i.cat === c.id && precisaComprar(i))
      .sort(ordenarNome)
      .map((i) => ({ id: i.id, nome: i.nome, tipo: 'item', status: i.status }));
    if (itens.length) grupos.push({ nome: c.nome, icone: c.icone, itens });
  }
  const orfaos = S.itens.filter((i) => !S.categorias.some((c) => c.id === i.cat) && precisaComprar(i));
  if (orfaos.length) grupos.push({ nome: 'Sem categoria', icone: 'caixa', itens: orfaos.map((i) => ({ id: i.id, nome: i.nome, tipo: 'item', status: i.status })) });
  if (S.pontuais.length) {
    grupos.push({ nome: 'Só desta vez', icone: 'caixa', pontual: true, itens: S.pontuais.map((p) => ({ id: p.id, nome: p.nome, tipo: 'pontual' })) });
  }
  return grupos;
}

// ---------- utilidades de interface ----------

const $ = (s, r = document) => r.querySelector(s);
const tela = $('#tela');
const ui = Icones.ui;

// Caixinha de marcar desenhada à mão.
const CAIXA = `<svg class="caixa" viewBox="0 0 24 24" aria-hidden="true">
  <path class="borda" d="M4.2 5.1C9 3.8 14.8 4.6 19.6 4.1c.6 5 .1 10.2.4 15.6-5.1.6-10.4-.2-15.6.3-.6-5.1.2-10-.2-14.9Z"/>
  <path class="risco" d="M6.5 12.2c1.4 1.6 2.6 3.4 3.6 5.4 2.6-5.2 6.4-10 11.2-14.1"/>
</svg>`;

let timerAviso;
function avisar(msg, desfazer) {
  const el = $('#aviso');
  el.innerHTML = `<span>${esc(msg)}</span>${desfazer ? '<button type="button">Desfazer</button>' : ''}`;
  el.classList.add('visivel');
  if (desfazer) {
    el.querySelector('button').onclick = () => { desfazer(); el.classList.remove('visivel'); };
  }
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => el.classList.remove('visivel'), desfazer ? 5000 : 2600);
}

let timerFolha;
function abrirFolha(html, aoMontar) {
  clearTimeout(timerFolha);
  const f = $('#folha');
  f.innerHTML = `<div class="folha-fundo" data-fechar></div><div class="folha-corpo" role="dialog" aria-modal="true"><div class="folha-alca"></div>${html}</div>`;
  f.hidden = false;
  requestAnimationFrame(() => f.classList.add('aberta'));
  f.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', fecharFolha));
  if (aoMontar) aoMontar(f);
}

function fecharFolha() {
  const f = $('#folha');
  f.classList.remove('aberta');
  timerFolha = setTimeout(() => { f.hidden = true; f.innerHTML = ''; }, 180);
}

function opcoesCategoria(sel) {
  return S.categorias.map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')
    + '<option value="__nova">+ Nova categoria…</option>';
}

// Se a pessoa escolheu "Nova categoria", cria e devolve o id.
function resolverCategoria(valor, nomeNova) {
  if (valor !== '__nova') return valor;
  const nome = (nomeNova || '').trim();
  if (!nome) return null;
  const c = { id: uid(), nome, icone: Icones.paraItem(nome, 'caixa') };
  S.categorias.push(c);
  return c.id;
}

function ligarCategoriaNova(f) {
  const sel = f.querySelector('select[name=cat]');
  const campo = f.querySelector('.campo-nova');
  const atualizar = () => { campo.hidden = sel.value !== '__nova'; if (!campo.hidden) campo.querySelector('input').focus(); };
  sel.addEventListener('change', atualizar);
  atualizar();
}

function quando(ts) {
  if (!ts) return 'nunca';
  const dias = Math.floor((Date.now() - ts) / 86400000);
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'ontem';
  return `há ${dias} dias`;
}

function tituloGrupo(nome, icone) {
  return `<h3 class="titulo-grupo">${Icones.svg(icone, { classe: 'mini' })}<span>${esc(nome)}</span></h3>`;
}

// ---------- navegação ----------

$('#defs').innerHTML = Icones.FILTROS;
document.querySelectorAll('[data-ui]').forEach((el) => (el.outerHTML = ui(el.dataset.ui)));

function irPara(nova) {
  aba = nova;
  document.querySelectorAll('.abas button').forEach((b) => b.classList.toggle('ativa', b.dataset.aba === aba));
  window.scrollTo(0, 0);
  render();
}

document.querySelectorAll('.abas button').forEach((b) => b.addEventListener('click', () => irPara(b.dataset.aba)));

function render() {
  if (!S) return renderBoasVindas();
  document.body.classList.remove('sem-abas');
  if (aba === 'lista') renderLista();
  else if (aba === 'verificar') renderVerificar();
  else renderCasa();
}

// ---------- boas-vindas ----------

function renderBoasVindas() {
  document.body.classList.add('sem-abas');
  $('#acoes-topo').innerHTML = '';
  const total = SUGESTAO.reduce((n, c) => n + c.itens.length, 0);
  tela.innerHTML = `
    <section class="boas-vindas">
      <div class="adesivos" aria-hidden="true">
        ${['cenoura', 'pao', 'papel', 'queijo', 'maca', 'limpeza'].map((n) => `<span class="adesivo">${Icones.svg(n)}</span>`).join('')}
      </div>
      <h2>A lista de compras que sabe o que tem em casa</h2>
      <p>Cadastre o que você <em>sempre</em> precisa ter. Antes do mercado, passe por cada item — tem, pouco, acabou — e a lista se monta sozinha.</p>
      <button class="btn primario grande" id="bv-sugestao">Começar com ${total} itens sugeridos</button>
      <button class="btn grande" id="bv-zero">Começar do zero</button>
      <p class="dica">Dá para editar, apagar e adicionar itens depois.</p>
    </section>`;
  $('#bv-sugestao').onclick = () => { S = novoEstado(true); salvar(); irPara('casa'); };
  $('#bv-zero').onclick = () => { S = novoEstado(false); salvar(); irPara('casa'); };
}

// ---------- aba Lista ----------

function renderLista() {
  $('#titulo').textContent = 'Lista de compras';
  const grupos = gruposCompra();
  const total = grupos.reduce((n, g) => n + g.itens.length, 0);
  const noCarrinho = grupos.reduce((n, g) => n + g.itens.filter((e) => S.carrinho[e.id]).length, 0);
  const adiados = S.itens.filter((i) => i.status === 'depois').length;

  $('#acoes-topo').innerHTML = total
    ? `<button class="icone-btn" id="btn-compartilhar" aria-label="Compartilhar ou baixar a lista">${ui('compartilhar')}</button>`
    : '';

  const formPontual = `
    <form class="add-pontual" id="form-pontual">
      <input name="nome" placeholder="Algo só desta vez? Ex.: pano de prato" autocomplete="off" maxlength="80" aria-label="Adicionar item só desta vez">
      <button class="btn primario" aria-label="Adicionar">${ui('mais')}</button>
    </form>`;

  const notaAdiados = adiados
    ? `<button class="nota-adiados" id="ver-adiados">${ui('depois')}<span>${adiados} ${adiados === 1 ? 'item ficou' : 'itens ficaram'} para depois</span>${ui('seta')}</button>`
    : '';

  if (!total) {
    tela.innerHTML = `
      ${formPontual}
      <section class="vazio">
        <span class="adesivo grande">${Icones.svg('maca')}</span>
        <h2>Nada para comprar</h2>
        <p>Verifique a casa para ver o que está acabando, ou marque direto em <strong>Em casa</strong> o que você já sabe que acabou.</p>
        <button class="btn primario" data-ir="verificar">Verificar a casa</button>
        <button class="btn" data-ir="casa">Marcar o que acabou</button>
      </section>
      ${notaAdiados}`;
  } else {
    tela.innerHTML = `
      ${formPontual}
      <p class="resumo">${total} ${total === 1 ? 'item' : 'itens'}${noCarrinho ? ` · <strong>${noCarrinho} no carrinho</strong>` : ''}</p>
      ${grupos.map((g) => `
        <section class="grupo">
          ${g.pontual ? `<h3 class="titulo-grupo"><span class="marca-pontual"></span><span>${esc(g.nome)}</span></h3>` : tituloGrupo(g.nome, g.icone)}
          <ul class="linhas">
            ${g.itens.map((e) => `
              <li class="linha-compra ${S.carrinho[e.id] ? 'no-carrinho' : ''}" data-id="${e.id}" data-tipo="${e.tipo}">
                <button class="marcar" aria-pressed="${!!S.carrinho[e.id]}" aria-label="No carrinho: ${esc(e.nome)}">${CAIXA}<span class="nome">${esc(e.nome)}</span></button>
                ${e.tipo === 'item' ? `<span class="tag ${e.status}">${STATUS[e.status].rot}</span>` : ''}
                <button class="remover" aria-label="Tirar da lista: ${esc(e.nome)}">${ui('fechar', { filtro: false })}</button>
              </li>`).join('')}
          </ul>
        </section>`).join('')}
      <div class="rodape-lista">
        <button class="btn primario grande" id="btn-terminei" ${noCarrinho ? '' : 'disabled'}>Terminei as compras${noCarrinho ? ` (${noCarrinho})` : ''}</button>
        <p class="dica">Toque nos itens conforme coloca no carrinho.</p>
      </div>
      ${notaAdiados}`;
  }

  $('#form-pontual').onsubmit = (ev) => {
    ev.preventDefault();
    const inp = ev.target.nome;
    const nome = inp.value.trim();
    if (!nome) return;
    adicionarPontual(nome);
    inp.value = '';
    renderLista();
    $('#form-pontual input').focus();
  };

  tela.querySelectorAll('[data-ir]').forEach((b) => (b.onclick = () => irPara(b.dataset.ir)));
  tela.querySelectorAll('.linha-compra').forEach((li) => {
    const { id, tipo } = li.dataset;
    li.querySelector('.marcar').onclick = () => {
      if (S.carrinho[id]) delete S.carrinho[id]; else S.carrinho[id] = true;
      salvar();
      renderLista();
    };
    li.querySelector('.remover').onclick = () => tirarDaLista(id, tipo);
  });

  const va = $('#ver-adiados');
  if (va) va.onclick = () => { filtroCasa = 'depois'; busca = ''; irPara('casa'); };
  const bt = $('#btn-terminei');
  if (bt) bt.onclick = confirmarTerminei;
  const bc = $('#btn-compartilhar');
  if (bc) bc.onclick = abrirCompartilhar;
}

function adicionarPontual(nome) {
  nome = nome.charAt(0).toLocaleUpperCase('pt-BR') + nome.slice(1);
  // Se já existe como essencial, só marca que acabou.
  const ja = S.itens.find((i) => normal(i.nome) === normal(nome));
  if (ja) {
    const antes = ja.status;
    ja.status = 'falta';
    salvar();
    avisar(`${ja.nome} já é essencial — marquei como "Acabou".`, () => { ja.status = antes; salvar(); render(); });
    return;
  }
  if (S.pontuais.some((p) => normal(p.nome) === normal(nome))) return avisar('Esse item já está na lista.');
  S.pontuais.push({ id: uid(), nome });
  salvar();
}

function tirarDaLista(id, tipo) {
  if (tipo === 'pontual') {
    const idx = S.pontuais.findIndex((p) => p.id === id);
    const [p] = S.pontuais.splice(idx, 1);
    delete S.carrinho[id];
    salvar();
    renderLista();
    avisar(`${p.nome} saiu da lista.`, () => { S.pontuais.splice(idx, 0, p); salvar(); render(); });
    return;
  }
  const i = item(id);
  abrirFolha(`
    <h2>Tirar ${esc(i.nome)} da lista</h2>
    <p>Como ele está em casa?</p>
    <div class="opcoes">
      <button class="opcao" data-st="tem">${ui('tem')}<div><strong>Tem</strong><small>Já tenho, não preciso comprar</small></div></button>
      <button class="opcao" data-st="depois">${ui('depois')}<div><strong>Agora não</strong><small>Não tem, mas não quero comprar agora</small></div></button>
    </div>
    <div class="folha-acoes"><button class="btn" data-fechar>Cancelar</button></div>`, (f) => {
    f.querySelectorAll('[data-st]').forEach((b) => (b.onclick = () => {
      const antes = i.status;
      i.status = b.dataset.st;
      delete S.carrinho[id];
      salvar();
      fecharFolha();
      renderLista();
      avisar(`${i.nome}: "${STATUS[i.status].rot}".`, () => { i.status = antes; salvar(); render(); });
    }));
  });
}

function confirmarTerminei() {
  const ids = Object.keys(S.carrinho);
  abrirFolha(`
    <h2>Terminou as compras?</h2>
    <p>Os <strong>${ids.length}</strong> itens que você marcou saem da lista: os essenciais voltam para <strong>Tem</strong> e os de “só desta vez” são apagados. O que não foi marcado continua na lista.</p>
    <div class="folha-acoes">
      <button class="btn" data-fechar>Cancelar</button>
      <button class="btn primario" id="ok-terminei">Confirmar</button>
    </div>`, () => {
    $('#ok-terminei').onclick = () => {
      for (const id of ids) {
        const i = item(id);
        if (i) i.status = 'tem';
      }
      S.pontuais = S.pontuais.filter((p) => !S.carrinho[p.id]);
      S.carrinho = {};
      salvar();
      fecharFolha();
      renderLista();
      avisar('Compras concluídas!');
    };
  });
}

function abrirCompartilhar() {
  abrirFolha(`
    <h2>Levar a lista</h2>
    <div class="opcoes">
      <button class="opcao" data-formato="texto">${ui('texto')}<div><strong>Texto</strong><small>Para WhatsApp ou notas</small></div></button>
      <button class="opcao" data-formato="imagem">${ui('imagem')}<div><strong>Imagem</strong><small>Uma foto da lista (PNG)</small></div></button>
      <button class="opcao" data-formato="pdf">${ui('pdf')}<div><strong>PDF</strong><small>Para imprimir ou enviar</small></div></button>
    </div>
    <div class="folha-acoes"><button class="btn" data-fechar>Fechar</button></div>`, (f) => {
    f.querySelectorAll('[data-formato]').forEach((b) => (b.onclick = () => exportar(b.dataset.formato)));
  });
}

async function exportar(formato) {
  const grupos = gruposCompra();
  try {
    if (formato === 'texto') {
      const txt = Exportar.texto(grupos);
      if (navigator.share) {
        try { await navigator.share({ text: txt }); fecharFolha(); return; } catch (e) { if (e.name === 'AbortError') return; }
      }
      await navigator.clipboard.writeText(txt);
      fecharFolha();
      avisar('Lista copiada. É só colar onde quiser.');
      return;
    }
    avisar('Gerando…');
    const blob = formato === 'pdf' ? await Exportar.pdf(grupos) : await Exportar.imagem(grupos);
    const r = await Exportar.entregar(blob, Exportar.nomeArquivo(formato === 'pdf' ? 'pdf' : 'png'));
    fecharFolha();
    if (r === 'baixado') avisar('Arquivo salvo em Downloads.');
  } catch (e) {
    avisar('Não consegui gerar a lista. Tente de novo.');
  }
}

// ---------- aba Verificar ----------

const DIRECOES = [
  ['falta', '←', 'Acabou'],
  ['pouco', '↑', 'Pouco'],
  ['depois', '↓', 'Agora não'],
  ['tem', '→', 'Tem'],
];

function renderVerificar() {
  $('#titulo').textContent = 'Verificar a casa';
  $('#acoes-topo').innerHTML = '';
  const sess = S.sessao;
  if (sess) {
    sess.fila = sess.fila.filter((id) => item(id));
    if (sess.i >= sess.fila.length) return renderFimVerificacao();
    return renderCartao();
  }

  const comItens = S.categorias.filter((c) => S.itens.some((i) => i.cat === c.id));
  const escolhidas = S.itens.filter((i) => !escolhaVerif.size || escolhaVerif.has(i.cat));
  tela.innerHTML = `
    <section class="verif-inicio">
      <div class="pilha-demo" aria-hidden="true"><div></div><div></div><div>${Icones.svg('lata')}</div></div>
      <p>Abra os armários e vá dizendo como está cada item. Arraste o cartão ou use os botões.</p>
      <ul class="legenda">
        ${DIRECOES.map(([s, seta, rot]) => `<li class="${s}"><b>${seta}</b>${rot}</li>`).join('')}
      </ul>
      ${comItens.length > 1 ? `
        <h3 class="rotulo">O que verificar</h3>
        <div class="chips">
          <button class="chip ${escolhaVerif.size ? '' : 'ativo'}" data-cat="">Tudo</button>
          ${comItens.map((c) => `<button class="chip com-icone ${escolhaVerif.has(c.id) ? 'ativo' : ''}" data-cat="${c.id}">${Icones.svg(c.icone, { classe: 'mini', filtros: false })}${esc(c.nome)}</button>`).join('')}
        </div>` : ''}
      <button class="btn primario grande" id="btn-comecar" ${escolhidas.length ? '' : 'disabled'}>
        ${escolhidas.length ? `Começar · ${escolhidas.length} ${escolhidas.length === 1 ? 'item' : 'itens'}` : 'Cadastre itens em "Em casa"'}
      </button>
      <p class="dica">Última verificação: ${quando(S.ultimaVerificacao)}</p>
    </section>`;

  tela.querySelectorAll('.chip').forEach((b) => (b.onclick = () => {
    const id = b.dataset.cat;
    if (!id) escolhaVerif.clear();
    else if (escolhaVerif.has(id)) escolhaVerif.delete(id);
    else escolhaVerif.add(id);
    renderVerificar();
  }));
  $('#btn-comecar').onclick = () => {
    // Na ordem das categorias, para seguir os cômodos/armários.
    const ordem = new Map(S.categorias.map((c, k) => [c.id, k]));
    const fila = escolhidas
      .slice()
      .sort((a, b) => (ordem.get(a.cat) ?? 99) - (ordem.get(b.cat) ?? 99) || ordenarNome(a, b))
      .map((i) => i.id);
    S.sessao = { fila, i: 0, hist: [] };
    salvar();
    renderVerificar();
  };
}

function renderCartao() {
  const sess = S.sessao;
  const atual = item(sess.fila[sess.i]);
  const prox = item(sess.fila[sess.i + 1]);
  const c = cat(atual.cat);
  const pct = Math.round((sess.i / sess.fila.length) * 100);

  tela.innerHTML = `
    <section class="verif">
      <div class="verif-topo">
        <button class="icone-btn" id="btn-desfazer" ${sess.hist.length ? '' : 'disabled'} aria-label="Voltar ao item anterior">${ui('desfazer')}</button>
        <div class="progresso" role="progressbar" aria-valuenow="${sess.i}" aria-valuemax="${sess.fila.length}"><div style="width:${pct}%"></div></div>
        <span class="contagem">${sess.i + 1}/${sess.fila.length}</span>
        <button class="icone-btn" id="btn-sair" aria-label="Parar verificação">${ui('fechar')}</button>
      </div>
      <div class="baralho">
        ${prox ? `<div class="cartao atras" aria-hidden="true"></div>` : ''}
        <div class="cartao" id="cartao">
          <div class="selo tem">Tem</div>
          <div class="selo falta">Acabou</div>
          <div class="selo pouco">Pouco</div>
          <div class="selo depois">Agora não</div>
          <div class="c-cat">${esc(c.nome)}</div>
          ${Icones.svg(iconeItem(atual), { classe: 'c-ilustra' })}
          <div class="c-nome">${esc(atual.nome)}</div>
          <div class="c-antes">da última vez: <span class="tag ${atual.status}">${STATUS[atual.status].rot}</span></div>
        </div>
      </div>
      <div class="botoes-verif">
        ${DIRECOES.map(([s, , rot]) => `<button class="redondo ${s}" data-st="${s}">${ui(STATUS[s].icone)}<span>${rot}</span></button>`).join('')}
      </div>
    </section>`;

  const card = $('#cartao');
  ligarArrasto(card);
  tela.querySelectorAll('[data-st]').forEach((b) => (b.onclick = () => voar(card, b.dataset.st)));
  $('#btn-desfazer').onclick = desfazerVerif;
  $('#btn-sair').onclick = () => {
    abrirFolha(`
      <h2>Parar a verificação?</h2>
      <p>O que você já respondeu fica salvo. Os outros itens continuam como estavam.</p>
      <div class="folha-acoes">
        <button class="btn" data-fechar>Continuar</button>
        <button class="btn primario" id="ok-sair">Parar</button>
      </div>`, () => {
      $('#ok-sair').onclick = () => {
        if (S.sessao.hist.length) S.ultimaVerificacao = Date.now();
        S.sessao = null;
        salvar();
        fecharFolha();
        renderVerificar();
      };
    });
  };
}

function ligarArrasto(card) {
  let x0 = 0, y0 = 0, dx = 0, dy = 0, ativo = false;
  const selos = {};
  card.querySelectorAll('.selo').forEach((s) => (selos[s.classList[1]] = s));
  const limitar = (v) => Math.max(0, Math.min(1, v));

  const direcao = () => {
    if (dx > 90) return 'tem';
    if (dx < -90) return 'falta';
    if (Math.abs(dx) < 90 && dy < -80) return 'pouco';
    if (Math.abs(dx) < 90 && dy > 80) return 'depois';
    return null;
  };

  card.addEventListener('pointerdown', (e) => {
    ativo = true;
    x0 = e.clientX; y0 = e.clientY; dx = dy = 0;
    card.setPointerCapture(e.pointerId);
    card.style.transition = 'none';
  });
  card.addEventListener('pointermove', (e) => {
    if (!ativo) return;
    dx = e.clientX - x0;
    dy = e.clientY - y0;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 16}deg)`;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    selos.tem.style.opacity = horizontal ? limitar(dx / 90) : 0;
    selos.falta.style.opacity = horizontal ? limitar(-dx / 90) : 0;
    selos.pouco.style.opacity = horizontal ? 0 : limitar(-dy / 80);
    selos.depois.style.opacity = horizontal ? 0 : limitar(dy / 80);
  });
  const soltar = () => {
    if (!ativo) return;
    ativo = false;
    const d = direcao();
    if (d) return voar(card, d, dx, dy);
    card.style.transition = 'transform .18s ease-out';
    card.style.transform = '';
    Object.values(selos).forEach((s) => (s.style.opacity = 0));
  };
  card.addEventListener('pointerup', soltar);
  card.addEventListener('pointercancel', soltar);
}

let voando = false;
function voar(card, status, dx = 0, dy = 0) {
  if (voando) return;
  voando = true;
  const sx = { tem: 1, falta: -1 }[status] || 0;
  const sy = { pouco: -1, depois: 1 }[status] || 0;
  const tx = sx ? sx * (window.innerWidth + 200) : dx;
  const ty = sy ? sy * (window.innerHeight + 200) : dy;
  card.querySelectorAll('.selo').forEach((s) => (s.style.opacity = s.classList.contains(status) ? 1 : 0));
  card.style.transition = 'transform .22s ease-in';
  card.style.transform = `translate(${tx}px, ${ty}px) rotate(${sx * 18}deg)`;
  setTimeout(() => { voando = false; responder(status); }, 220);
}

function responder(status) {
  const sess = S.sessao;
  const i = item(sess.fila[sess.i]);
  sess.hist.push({ id: i.id, antes: i.status });
  i.status = status;
  if (!precisaComprar(i)) delete S.carrinho[i.id];
  sess.i++;
  salvar();
  renderVerificar();
}

function desfazerVerif() {
  const sess = S.sessao;
  const h = sess.hist.pop();
  if (!h) return;
  const i = item(h.id);
  if (i) i.status = h.antes;
  sess.i = Math.max(0, sess.i - 1);
  salvar();
  renderVerificar();
}

function renderFimVerificacao() {
  const sess = S.sessao;
  const respondidos = sess.hist.map((h) => item(h.id)).filter(Boolean);
  const n = { tem: 0, pouco: 0, falta: 0, depois: 0 };
  respondidos.forEach((i) => n[i.status]++);
  tela.innerHTML = `
    <section class="vazio">
      <span class="adesivo grande">${Icones.svg('casa')}</span>
      <h2>Casa verificada!</h2>
      <ul class="placar">
        <li class="falta"><b>${n.falta}</b><span>acabaram</span></li>
        <li class="pouco"><b>${n.pouco}</b><span>com pouco</span></li>
        <li class="depois"><b>${n.depois}</b><span>agora não</span></li>
        <li class="tem"><b>${n.tem}</b><span>tem</span></li>
      </ul>
      <button class="btn primario grande" id="ver-lista">Ver lista de compras</button>
      <button class="btn" id="voltar-ultimo">Voltar ao último item</button>
    </section>`;
  const fechar = () => { S.sessao = null; S.ultimaVerificacao = Date.now(); salvar(); };
  $('#ver-lista').onclick = () => { fechar(); irPara('lista'); };
  $('#voltar-ultimo').onclick = desfazerVerif;
}

// Teclado no computador: ← acabou, ↑ pouco, ↓ agora não, → tem, Backspace desfaz.
document.addEventListener('keydown', (e) => {
  if (aba !== 'verificar' || !S || !S.sessao || !$('#folha').hidden) return;
  const card = $('#cartao');
  if (!card) return;
  const mapa = { ArrowRight: 'tem', ArrowLeft: 'falta', ArrowUp: 'pouco', ArrowDown: 'depois' };
  if (mapa[e.key]) { e.preventDefault(); voar(card, mapa[e.key]); }
  else if (e.key === 'Backspace') { e.preventDefault(); desfazerVerif(); }
});

// ---------- aba Em casa ----------

function renderCasa() {
  $('#titulo').textContent = 'Em casa';
  $('#acoes-topo').innerHTML = `
    <button class="icone-btn" id="btn-novo" aria-label="Novo item essencial">${ui('mais')}</button>
    <button class="icone-btn" id="btn-mais" aria-label="Mais opções">${ui('opcoes')}</button>`;
  $('#btn-novo').onclick = () => abrirEditor(null, busca);
  $('#btn-mais').onclick = abrirMais;

  tela.innerHTML = `
    <div class="busca">
      ${ui('buscar')}
      <input id="campo-busca" type="search" placeholder="Acabou algo? Busque aqui" value="${esc(busca)}" autocomplete="off" aria-label="Buscar item">
    </div>
    <div class="chips filtros">
      ${['todos', ...ORDEM_STATUS].map((f) => `<button class="chip ${filtroCasa === f ? 'ativo' : ''}" data-f="${f}"></button>`).join('')}
    </div>
    <div id="lista-casa"></div>`;

  const campo = $('#campo-busca');
  campo.oninput = () => { busca = campo.value; desenharItensCasa(); };
  tela.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { filtroCasa = b.dataset.f; renderCasa(); }));
  atualizarContagens();
  desenharItensCasa();
}

function desenharItensCasa() {
  const alvo = $('#lista-casa');
  const q = normal(busca);
  const visiveis = S.itens.filter((i) => (filtroCasa === 'todos' || i.status === filtroCasa) && (!q || normal(i.nome).includes(q)));

  let html = '';
  const cats = [...S.categorias];
  if (S.itens.some((i) => !S.categorias.some((c) => c.id === i.cat))) cats.push(cat(''));
  for (const c of cats) {
    const itens = visiveis.filter((i) => (c.id ? i.cat === c.id : !S.categorias.some((k) => k.id === i.cat))).sort(ordenarNome);
    if (!itens.length) continue;
    html += `
      <section class="grupo">
        ${tituloGrupo(c.nome, c.icone)}
        <ul class="linhas">
          ${itens.map((i) => `
            <li class="linha-casa" data-id="${i.id}">
              <button class="nome-btn">${esc(i.nome)}</button>
              <div class="seg" role="group" aria-label="Situação de ${esc(i.nome)}">
                ${ORDEM_STATUS.map((s) => `<button class="${s} ${i.status === s ? 'sel' : ''}" data-st="${s}" aria-pressed="${i.status === s}" aria-label="${STATUS[s].rot}" title="${STATUS[s].rot}">${ui(STATUS[s].icone, { filtro: false })}<span>${STATUS[s].rot}</span></button>`).join('')}
              </div>
            </li>`).join('')}
        </ul>
      </section>`;
  }

  if (q) {
    const exato = S.itens.some((i) => normal(i.nome) === q) || S.pontuais.some((p) => normal(p.nome) === q);
    if (!exato) {
      html += `
        <div class="sugerir">
          <p>${visiveis.length ? 'Não é nenhum desses?' : `“${esc(busca.trim())}” não está cadastrado.`}</p>
          <button class="btn primario" id="add-pontual-busca">Pôr na lista só desta vez</button>
          <button class="btn" id="add-essencial-busca">Cadastrar como essencial</button>
        </div>`;
    }
  } else if (!visiveis.length) {
    html = S.itens.length
      ? '<p class="dica centro">Nenhum item com essa situação.</p>'
      : `<section class="vazio"><span class="adesivo grande">${Icones.svg('casa')}</span><h2>Nenhum item ainda</h2><p>Cadastre o que você precisa ter sempre em casa: arroz, feijão, papel higiênico…</p><button class="btn primario" id="add-primeiro">Cadastrar item</button></section>`;
  }
  alvo.innerHTML = html;

  alvo.querySelectorAll('.linha-casa').forEach((li) => {
    const i = item(li.dataset.id);
    li.querySelector('.nome-btn').onclick = () => abrirEditor(i);
    li.querySelectorAll('[data-st]').forEach((b) => (b.onclick = () => {
      if (i.status === b.dataset.st) return;
      i.status = b.dataset.st;
      if (!precisaComprar(i)) delete S.carrinho[i.id];
      salvar();
      if (filtroCasa === 'todos') {
        li.querySelectorAll('[data-st]').forEach((x) => { x.classList.toggle('sel', x === b); x.setAttribute('aria-pressed', x === b); });
        atualizarContagens();
      } else renderCasa();
      if (precisaComprar(i)) avisar(`${i.nome} vai para a lista.`);
    }));
  });
  const ap = $('#add-pontual-busca');
  if (ap) ap.onclick = () => { adicionarPontual(busca.trim()); avisar(`${busca.trim()} entrou na lista.`); busca = ''; renderCasa(); };
  const ae = $('#add-essencial-busca');
  if (ae) ae.onclick = () => abrirEditor(null, busca.trim());
  const a1 = $('#add-primeiro');
  if (a1) a1.onclick = () => abrirEditor(null);
}

function atualizarContagens() {
  const n = { tem: 0, pouco: 0, falta: 0, depois: 0 };
  S.itens.forEach((i) => n[i.status]++);
  tela.querySelectorAll('[data-f]').forEach((b) => {
    const f = b.dataset.f;
    b.textContent = f === 'todos' ? `Todos · ${S.itens.length}` : `${STATUS[f].rot} · ${n[f]}`;
  });
}

function abrirEditor(i, nomeInicial = '') {
  const novo = !i;
  abrirFolha(`
    <h2>${novo ? 'Novo item essencial' : 'Editar item'}</h2>
    <form id="form-item" class="form">
      <label>Nome<input name="nome" required maxlength="60" value="${esc(novo ? nomeInicial : i.nome)}" autocomplete="off"></label>
      <label>Categoria<select name="cat">${opcoesCategoria(novo ? (S.categorias[0] || {}).id : i.cat)}</select></label>
      <label class="campo-nova" hidden>Nome da nova categoria<input name="catNova" maxlength="40" autocomplete="off"></label>
      ${novo ? `<fieldset><legend>Agora em casa</legend>
        <div class="seg largo">
          ${ORDEM_STATUS.map((s, k) => `<label class="${s}"><input type="radio" name="status" value="${s}" ${k === 0 ? 'checked' : ''}>${ui(STATUS[s].icone, { filtro: false })}<span>${STATUS[s].rot}</span></label>`).join('')}
        </div></fieldset>` : ''}
      <div class="folha-acoes">
        ${novo ? '<button type="button" class="btn" data-fechar>Cancelar</button>' : '<button type="button" class="btn perigo" id="apagar-item">Apagar</button>'}
        <button class="btn primario">Salvar</button>
      </div>
    </form>`, (f) => {
    ligarCategoriaNova(f);
    if (novo && !nomeInicial) f.querySelector('input[name=nome]').focus();
    $('#form-item').onsubmit = (ev) => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const nome = fd.get('nome').trim();
      if (!nome) return;
      const dup = S.itens.find((x) => normal(x.nome) === normal(nome) && x !== i);
      if (dup) return avisar(`Já existe "${dup.nome}".`);
      const catId = resolverCategoria(fd.get('cat'), fd.get('catNova'));
      if (!catId) return avisar('Dê um nome para a nova categoria.');
      if (novo) {
        S.itens.push({ id: uid(), nome, cat: catId, status: fd.get('status') });
        // Se era "só desta vez", vira essencial e sai dos pontuais.
        const p = S.pontuais.findIndex((x) => normal(x.nome) === normal(nome));
        if (p >= 0) S.pontuais.splice(p, 1);
      } else {
        i.nome = nome;
        i.cat = catId;
      }
      salvar();
      fecharFolha();
      busca = '';
      renderCasa();
      avisar(novo ? `${nome} cadastrado.` : 'Item atualizado.');
    };
    const ap = $('#apagar-item');
    if (ap) ap.onclick = () => {
      const idx = S.itens.indexOf(i);
      S.itens.splice(idx, 1);
      delete S.carrinho[i.id];
      salvar();
      fecharFolha();
      renderCasa();
      avisar(`${i.nome} apagado.`, () => { S.itens.splice(idx, 0, i); salvar(); render(); });
    };
  });
}

function abrirMais() {
  abrirFolha(`
    <h2>Mais opções</h2>
    <div class="opcoes">
      <button class="opcao" id="m-cats">${ui('pasta')}<div><strong>Categorias</strong><small>Renomear, trocar desenho, reordenar</small></div></button>
      <button class="opcao" id="m-backup">${ui('salvar')}<div><strong>Fazer backup</strong><small>Salva um arquivo com todos os itens</small></div></button>
      <button class="opcao" id="m-restaurar">${ui('restaurar')}<div><strong>Restaurar backup</strong><small>Carrega um arquivo salvo antes</small></div></button>
      <button class="opcao perigo" id="m-zerar">${ui('lixo')}<div><strong>Apagar tudo</strong><small>Volta para a tela inicial</small></div></button>
    </div>
    <input type="file" id="arquivo-backup" accept="application/json,.json" hidden>
    <div class="folha-acoes"><button class="btn" data-fechar>Fechar</button></div>`, () => {
    $('#m-cats').onclick = abrirCategorias;
    $('#m-backup').onclick = async () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      await Exportar.entregar(blob, Exportar.nomeArquivo('json').replace('lista-de-compras', 'despensa-backup'));
    };
    const arq = $('#arquivo-backup');
    $('#m-restaurar').onclick = () => arq.click();
    arq.onchange = async () => {
      try {
        const dados = JSON.parse(await arq.files[0].text());
        if (!Array.isArray(dados.itens) || !Array.isArray(dados.categorias)) throw new Error('formato');
        S = migrar(Object.assign(novoEstado(false), dados, { sessao: null }));
        salvar();
        fecharFolha();
        render();
        avisar('Backup restaurado.');
      } catch (e) {
        avisar('Esse arquivo não é um backup válido.');
      }
    };
    $('#m-zerar').onclick = () => {
      abrirFolha(`
        <h2>Apagar tudo?</h2>
        <p>Todos os itens, categorias e a lista atual serão apagados deste aparelho. Faça um backup antes se quiser guardar.</p>
        <div class="folha-acoes">
          <button class="btn" data-fechar>Cancelar</button>
          <button class="btn perigo" id="ok-zerar">Apagar tudo</button>
        </div>`, () => {
        $('#ok-zerar').onclick = () => {
          localStorage.removeItem(CHAVE);
          S = null;
          fecharFolha();
          aba = 'lista';
          render();
        };
      });
    };
  });
}

function abrirCategorias(editando = null) {
  const linha = (c, k) => {
    const n = S.itens.filter((i) => i.cat === c.id).length;
    return `
      <li data-id="${c.id}">
        <button class="desenho-btn ${editando === c.id ? 'ativo' : ''}" aria-label="Trocar desenho de ${esc(c.nome)}">${Icones.svg(c.icone, { filtros: false })}</button>
        <input value="${esc(c.nome)}" maxlength="40" aria-label="Nome da categoria">
        <button class="icone-btn" data-mover="-1" ${k === 0 ? 'disabled' : ''} aria-label="Subir">${ui('subir', { filtro: false })}</button>
        <button class="icone-btn" data-mover="1" ${k === S.categorias.length - 1 ? 'disabled' : ''} aria-label="Descer">${ui('descer', { filtro: false })}</button>
        <button class="icone-btn" data-apagar ${n ? `disabled title="Tem ${n} itens"` : ''} aria-label="Apagar categoria">${ui('lixo', { filtro: false })}</button>
      </li>`;
  };
  const alvo = S.categorias.find((c) => c.id === editando);
  abrirFolha(`
    <h2>Categorias</h2>
    <p class="dica esquerda">A ordem aqui é a ordem da verificação e da lista — dá para seguir o caminho da cozinha ou do mercado. Toque no desenho para trocar.</p>
    <ul class="lista-cats">${S.categorias.map(linha).join('')}</ul>
    ${alvo ? `<div class="galeria" role="group" aria-label="Desenhos para ${esc(alvo.nome)}">
      ${Icones.nomes.map((n) => `<button data-icone="${n}" class="${alvo.icone === n ? 'ativo' : ''}" title="${Icones.rotulo(n)}" aria-label="${Icones.rotulo(n)}">${Icones.svg(n, { filtros: false })}</button>`).join('')}
    </div>` : ''}
    <div class="folha-acoes">
      <button class="btn" id="nova-cat">+ Categoria</button>
      <button class="btn primario" data-fechar>Pronto</button>
    </div>`, (f) => {
    f.querySelectorAll('.lista-cats li').forEach((li) => {
      const c = S.categorias.find((x) => x.id === li.dataset.id);
      li.querySelector('input').onchange = (e) => { const v = e.target.value.trim(); if (v) { c.nome = v; salvar(); render(); } };
      li.querySelector('.desenho-btn').onclick = () => abrirCategorias(editando === c.id ? null : c.id);
      li.querySelectorAll('[data-mover]').forEach((b) => (b.onclick = () => {
        const k = S.categorias.indexOf(c);
        const j = k + Number(b.dataset.mover);
        [S.categorias[k], S.categorias[j]] = [S.categorias[j], S.categorias[k]];
        salvar(); render(); abrirCategorias(editando);
      }));
      li.querySelector('[data-apagar]').onclick = () => {
        S.categorias.splice(S.categorias.indexOf(c), 1);
        salvar(); render(); abrirCategorias();
      };
    });
    f.querySelectorAll('[data-icone]').forEach((b) => (b.onclick = () => {
      alvo.icone = b.dataset.icone;
      salvar(); render(); abrirCategorias();
    }));
    $('#nova-cat').onclick = () => {
      S.categorias.push({ id: uid(), nome: 'Nova categoria', icone: 'caixa' });
      salvar(); render(); abrirCategorias();
      const inputs = $('#folha').querySelectorAll('.lista-cats input');
      inputs[inputs.length - 1].select();
    };
  });
}

render();
