"use strict";

const COLUNAS_TABULEIRO = 48;
const LINHAS_TABULEIRO = 27;
const TAMANHO_CELULA_BASE = 140;

const seletorBatalha = document.querySelector("#seletorBatalha");
const imagemMapa = document.querySelector("#imagemMapa");
const canvasEditor = document.querySelector("#canvasEditor");
const gridEditor = document.querySelector("#gridEditor");
const controleZoom = document.querySelector("#controleZoom");
const valorZoom = document.querySelector("#valorZoom");
const quantidadeDificil = document.querySelector("#quantidadeDificil");
const quantidadeBloqueado = document.querySelector("#quantidadeBloqueado");
const quantidadeBloqueioVisao = document.querySelector("#quantidadeBloqueioVisao");
const quantidadeBarreirasVisao = document.querySelector("#quantidadeBarreirasVisao");
const coordenadaAtual = document.querySelector("#coordenadaAtual");
const botaoDesfazer = document.querySelector("#botaoDesfazer");
const botaoRefazer = document.querySelector("#botaoRefazer");
const botaoGerarCodigo = document.querySelector("#botaoGerarCodigo");
const botaoCopiarCodigo = document.querySelector("#botaoCopiarCodigo");
const saidaCodigo = document.querySelector("#saidaCodigo");
const mensagemEditor = document.querySelector("#mensagemEditor");
const ferramentasTerreno = document.querySelector("#ferramentasTerreno");
const ferramentasVisao = document.querySelector("#ferramentasVisao");
const seletorModoVisao = document.querySelector("#seletorModoVisao");
const pinceisVisaoCasa = document.querySelector("#pinceisVisaoCasa");
const pinceisVisaoBorda = document.querySelector("#pinceisVisaoBorda");
const ajudaVisao = document.querySelector("#ajudaVisao");

const batalhasDisponiveis = new Map();
const tiposCelulas = new Map();
const bloqueiosVisao = new Set();
const barreirasVisao = new Map();
const historicoDesfazer = [];
const historicoRefazer = [];

let tipoPincel = "normal";
let tipoPincelVisaoCasa = "livre";
let tipoPincelBarreira = "livre";
let camadaEditor = "terreno";
let modoVisao = "casa";
let pintando = false;
let estadoAntesDoTraco = null;

function chaveCelula(coluna, linha) {
  return `${coluna},${linha}`;
}

function preencherListaBatalhas() {
  for (const [aventuraId, aventura] of Object.entries(bancoAventuras)) {
    for (const [cenaId, cena] of Object.entries(aventura.cenas ?? {})) {
      if (!cena.combate?.mapa) {
        continue;
      }

      const chave = `${aventuraId}:${cenaId}`;
      batalhasDisponiveis.set(chave, {
        aventuraId,
        cenaId,
        aventura,
        cena,
      });

      const opcao = document.createElement("option");
      opcao.value = chave;
      opcao.textContent = `${aventura.titulo} — ${cena.combate.introducao?.titulo ?? cenaId}`;
      seletorBatalha.append(opcao);
    }
  }

  const batalhaRuas = [...batalhasDisponiveis.entries()].find(
    ([, item]) => item.cenaId === "batalhaRuasD",
  );

  if (batalhaRuas) {
    seletorBatalha.value = batalhaRuas[0];
  }
}

function celulaPertenceRegiao(coluna, linha, regiao) {
  if (Number.isFinite(Number(regiao.coluna)) && Number.isFinite(Number(regiao.linha))) {
    return coluna === Number(regiao.coluna) && linha === Number(regiao.linha);
  }

  return (
    coluna >= Math.min(Number(regiao.colunaInicial), Number(regiao.colunaFinal)) &&
    coluna <= Math.max(Number(regiao.colunaInicial), Number(regiao.colunaFinal)) &&
    linha >= Math.min(Number(regiao.linhaInicial), Number(regiao.linhaFinal)) &&
    linha <= Math.max(Number(regiao.linhaInicial), Number(regiao.linhaFinal))
  );
}

function obterTipoConfigurado(terreno, coluna, linha) {
  if ((terreno?.bloqueado ?? []).some((regiao) => celulaPertenceRegiao(coluna, linha, regiao))) {
    return "bloqueado";
  }

  if ((terreno?.dificil ?? []).some((regiao) => celulaPertenceRegiao(coluna, linha, regiao))) {
    return "dificil";
  }

  return "normal";
}

function possuiBloqueioVisaoConfigurado(visao, coluna, linha) {
  return (visao?.bloqueios ?? []).some((regiao) =>
    celulaPertenceRegiao(coluna, linha, regiao),
  );
}

function chaveBarreira(barreira) {
  return `${barreira.coluna},${barreira.linha},${barreira.lado}`;
}

function normalizarBarreira(coluna, linha, lado, tipo) {
  if (lado === "leste" && coluna < COLUNAS_TABULEIRO) {
    return { coluna: coluna + 1, linha, lado: "oeste", tipo };
  }

  if (lado === "sul" && linha < LINHAS_TABULEIRO) {
    return { coluna, linha: linha + 1, lado: "norte", tipo };
  }

  return { coluna, linha, lado, tipo };
}

function carregarBarreiraConfigurada(barreira) {
  if (!barreira?.lado || !barreira?.tipo) {
    return;
  }

  const normalizada = normalizarBarreira(
    Number(barreira.coluna),
    Number(barreira.linha),
    barreira.lado,
    barreira.tipo,
  );

  barreirasVisao.set(chaveBarreira(normalizada), normalizada);
}

function criarGrid() {
  const fragmento = document.createDocumentFragment();

  for (let linha = 1; linha <= LINHAS_TABULEIRO; linha++) {
    for (let coluna = 1; coluna <= COLUNAS_TABULEIRO; coluna++) {
      const celula = document.createElement("button");
      celula.type = "button";
      celula.className = "celula-editor";
      celula.dataset.coluna = coluna;
      celula.dataset.linha = linha;
      celula.title = `Coluna ${coluna}, linha ${linha}`;
      celula.setAttribute("aria-label", celula.title);
      fragmento.append(celula);
    }
  }

  gridEditor.append(fragmento);
}

function atualizarCelulaVisual(coluna, linha) {
  const celula = gridEditor.querySelector(
    `[data-coluna="${coluna}"][data-linha="${linha}"]`,
  );

  if (!celula) {
    return;
  }

  const tipo = tiposCelulas.get(chaveCelula(coluna, linha)) ?? "normal";
  celula.classList.toggle("tipo-dificil", tipo === "dificil");
  celula.classList.toggle("tipo-bloqueado", tipo === "bloqueado");
  celula.classList.toggle(
    "tipo-bloqueio-visao",
    bloqueiosVisao.has(chaveCelula(coluna, linha)),
  );
}

const classesBarreiras = [
  "borda-norte-coberturaParcial",
  "borda-norte-coberturaTresQuartos",
  "borda-norte-bloqueioTotal",
  "borda-leste-coberturaParcial",
  "borda-leste-coberturaTresQuartos",
  "borda-leste-bloqueioTotal",
  "borda-sul-coberturaParcial",
  "borda-sul-coberturaTresQuartos",
  "borda-sul-bloqueioTotal",
  "borda-oeste-coberturaParcial",
  "borda-oeste-coberturaTresQuartos",
  "borda-oeste-bloqueioTotal",
];

function atualizarTodasBarreirasVisuais() {
  for (const celula of gridEditor.querySelectorAll(".celula-editor")) {
    celula.classList.remove(...classesBarreiras);
  }

  for (const barreira of barreirasVisao.values()) {
    const celula = gridEditor.querySelector(
      `[data-coluna="${barreira.coluna}"][data-linha="${barreira.linha}"]`,
    );

    celula?.classList.add(`borda-${barreira.lado}-${barreira.tipo}`);
  }
}

function atualizarBarreiraVisual(barreira) {
  const celula = gridEditor.querySelector(
    `[data-coluna="${barreira.coluna}"][data-linha="${barreira.linha}"]`,
  );

  if (!celula) {
    return;
  }

  for (const tipo of ["coberturaParcial", "coberturaTresQuartos", "bloqueioTotal"]) {
    celula.classList.remove(`borda-${barreira.lado}-${tipo}`);
  }

  const atual = barreirasVisao.get(chaveBarreira(barreira));

  if (atual) {
    celula.classList.add(`borda-${atual.lado}-${atual.tipo}`);
  }
}

function atualizarTodasCelulas() {
  for (let linha = 1; linha <= LINHAS_TABULEIRO; linha++) {
    for (let coluna = 1; coluna <= COLUNAS_TABULEIRO; coluna++) {
      atualizarCelulaVisual(coluna, linha);
    }
  }

  atualizarTodasBarreirasVisuais();
  atualizarResumo();
}

function atualizarResumo() {
  let dificeis = 0;
  let bloqueadas = 0;

  for (const tipo of tiposCelulas.values()) {
    if (tipo === "dificil") {
      dificeis++;
    } else if (tipo === "bloqueado") {
      bloqueadas++;
    }
  }

  quantidadeDificil.textContent = dificeis;
  quantidadeBloqueado.textContent = bloqueadas;
  quantidadeBloqueioVisao.textContent = bloqueiosVisao.size;
  quantidadeBarreirasVisao.textContent = barreirasVisao.size;
}

function carregarBatalhaSelecionada() {
  const item = batalhasDisponiveis.get(seletorBatalha.value);

  if (!item) {
    return;
  }

  tiposCelulas.clear();
  bloqueiosVisao.clear();
  barreirasVisao.clear();
  historicoDesfazer.length = 0;
  historicoRefazer.length = 0;

  imagemMapa.src = item.cena.combate.mapa;
  imagemMapa.alt = `Mapa de ${item.cena.combate.introducao?.titulo ?? item.cenaId}`;

  for (let linha = 1; linha <= LINHAS_TABULEIRO; linha++) {
    for (let coluna = 1; coluna <= COLUNAS_TABULEIRO; coluna++) {
      const tipo = obterTipoConfigurado(item.cena.combate.terreno, coluna, linha);

      if (tipo !== "normal") {
        tiposCelulas.set(chaveCelula(coluna, linha), tipo);
      }

      if (possuiBloqueioVisaoConfigurado(item.cena.combate.visao, coluna, linha)) {
        bloqueiosVisao.add(chaveCelula(coluna, linha));
      }

    }
  }

  for (const barreira of item.cena.combate.visao?.barreiras ?? []) {
    carregarBarreiraConfigurada(barreira);
  }

  saidaCodigo.value = "";
  mensagemEditor.textContent = "Configuração atual carregada.";
  atualizarTodasCelulas();
  atualizarBotoesHistorico();
}

function ativarCamadaEditor(novaCamada) {
  camadaEditor = novaCamada;
  gridEditor.classList.toggle("editando-visao", camadaEditor === "visao");

  mensagemEditor.textContent =
    camadaEditor === "terreno"
      ? "Editando terreno e movimentação."
      : "Editando bloqueios de visão.";
}

function selecionarModoVisao(evento) {
  const botao = evento.target.closest("[data-modo-visao]");

  if (!botao) {
    return;
  }

  ativarCamadaEditor("visao");
  modoVisao = botao.dataset.modoVisao;
  pinceisVisaoCasa.hidden = modoVisao !== "casa";
  pinceisVisaoBorda.hidden = modoVisao !== "borda";

  for (const outroBotao of seletorModoVisao.querySelectorAll("[data-modo-visao]")) {
    const selecionado = outroBotao === botao;
    outroBotao.classList.toggle("ativo", selecionado);
    outroBotao.setAttribute("aria-pressed", String(selecionado));
  }

  ajudaVisao.textContent =
    modoVisao === "casa"
      ? "Preencha construções e outros volumes totalmente opacos."
      : "Aproxime o ponteiro de um dos quatro lados da casa e clique ou arraste.";
}

function selecionarPincel(evento) {
  const botao = evento.target.closest(
    "[data-tipo], [data-tipo-visao-casa], [data-tipo-barreira]",
  );

  if (!botao) {
    return;
  }

  let seletor;
  let grupo;

  if (botao.matches("[data-tipo]")) {
    ativarCamadaEditor("terreno");
    seletor = "[data-tipo]";
    grupo = ferramentasTerreno;
    tipoPincel = botao.dataset.tipo;
  } else if (botao.matches("[data-tipo-visao-casa]")) {
    ativarCamadaEditor("visao");
    modoVisao = "casa";
    seletor = "[data-tipo-visao-casa]";
    grupo = pinceisVisaoCasa;
    tipoPincelVisaoCasa = botao.dataset.tipoVisaoCasa;
  } else {
    ativarCamadaEditor("visao");
    modoVisao = "borda";
    seletor = "[data-tipo-barreira]";
    grupo = pinceisVisaoBorda;
    tipoPincelBarreira = botao.dataset.tipoBarreira;
  }

  for (const outroBotao of grupo.querySelectorAll(seletor)) {
    outroBotao.classList.toggle("ativo", outroBotao === botao);
  }
}

function obterLadoMaisProximo(celula, evento) {
  const retangulo = celula.getBoundingClientRect();
  const distancias = {
    oeste: Math.abs(evento.clientX - retangulo.left),
    leste: Math.abs(retangulo.right - evento.clientX),
    norte: Math.abs(evento.clientY - retangulo.top),
    sul: Math.abs(retangulo.bottom - evento.clientY),
  };

  return Object.entries(distancias).sort(([, distanciaA], [, distanciaB]) =>
    distanciaA - distanciaB,
  )[0][0];
}

function aplicarPincel(celula, evento) {
  if (!celula) {
    return;
  }

  const coluna = Number(celula.dataset.coluna);
  const linha = Number(celula.dataset.linha);
  const chave = chaveCelula(coluna, linha);

  if (camadaEditor === "visao" && modoVisao === "borda") {
    const lado = obterLadoMaisProximo(celula, evento);
    const barreira = normalizarBarreira(coluna, linha, lado, tipoPincelBarreira);
    const chaveDaBarreira = chaveBarreira(barreira);

    if (tipoPincelBarreira === "livre") {
      barreirasVisao.delete(chaveDaBarreira);
    } else {
      barreirasVisao.set(chaveDaBarreira, barreira);
    }

    atualizarBarreiraVisual(barreira);
  } else if (camadaEditor === "visao") {
    if (tipoPincelVisaoCasa === "livre") {
      bloqueiosVisao.delete(chave);
    } else {
      bloqueiosVisao.add(chave);
    }
  } else {
    if (tipoPincel === "normal") {
      tiposCelulas.delete(chave);
    } else {
      tiposCelulas.set(chave, tipoPincel);
    }
  }

  atualizarCelulaVisual(coluna, linha);
  atualizarResumo();
}

function iniciarPintura(evento) {
  if (evento.button !== 0) {
    return;
  }

  const celula = evento.target.closest(".celula-editor");

  if (!celula) {
    return;
  }

  evento.preventDefault();
  pintando = true;
  estadoAntesDoTraco = criarEstadoEditor();
  aplicarPincel(celula, evento);
}

function continuarPintura(evento) {
  const celula = evento.target.closest(".celula-editor");

  if (celula) {
    coordenadaAtual.textContent = `${celula.dataset.coluna}, ${celula.dataset.linha}`;
  }

  if (pintando && celula) {
    aplicarPincel(celula, evento);
  }
}

function mapasIguais(mapaA, mapaB) {
  if (mapaA.size !== mapaB.size) {
    return false;
  }

  for (const [chave, valor] of mapaA) {
    if (mapaB.get(chave) !== valor) {
      return false;
    }
  }

  return true;
}

function conjuntosIguais(conjuntoA, conjuntoB) {
  if (conjuntoA.size !== conjuntoB.size) {
    return false;
  }

  for (const valor of conjuntoA) {
    if (!conjuntoB.has(valor)) {
      return false;
    }
  }

  return true;
}

function mapasBarreirasIguais(mapaA, mapaB) {
  if (mapaA.size !== mapaB.size) {
    return false;
  }

  for (const [chave, barreiraA] of mapaA) {
    const barreiraB = mapaB.get(chave);

    if (!barreiraB || barreiraA.tipo !== barreiraB.tipo) {
      return false;
    }
  }

  return true;
}

function criarEstadoEditor() {
  return {
    terreno: new Map(tiposCelulas),
    bloqueiosVisao: new Set(bloqueiosVisao),
    barreirasVisao: new Map(barreirasVisao),
  };
}

function estadosIguais(estadoA, estadoB) {
  return (
    mapasIguais(estadoA.terreno, estadoB.terreno) &&
    conjuntosIguais(estadoA.bloqueiosVisao, estadoB.bloqueiosVisao) &&
    mapasBarreirasIguais(estadoA.barreirasVisao, estadoB.barreirasVisao)
  );
}

function finalizarPintura() {
  if (!pintando) {
    return;
  }

  pintando = false;

  const estadoAtual = criarEstadoEditor();

  if (estadoAntesDoTraco && !estadosIguais(estadoAntesDoTraco, estadoAtual)) {
    historicoDesfazer.push(estadoAntesDoTraco);
    historicoRefazer.length = 0;

    if (historicoDesfazer.length > 60) {
      historicoDesfazer.shift();
    }
  }

  estadoAntesDoTraco = null;
  atualizarBotoesHistorico();
}

function restaurarEstado(estado) {
  tiposCelulas.clear();
  bloqueiosVisao.clear();
  barreirasVisao.clear();

  for (const [chave, tipo] of estado.terreno) {
    tiposCelulas.set(chave, tipo);
  }

  for (const chave of estado.bloqueiosVisao) {
    bloqueiosVisao.add(chave);
  }

  for (const [chave, barreira] of estado.barreirasVisao) {
    barreirasVisao.set(chave, barreira);
  }

  atualizarTodasCelulas();
}

function desfazer() {
  const estado = historicoDesfazer.pop();

  if (!estado) {
    return;
  }

  historicoRefazer.push(criarEstadoEditor());
  restaurarEstado(estado);
  atualizarBotoesHistorico();
}

function refazer() {
  const estado = historicoRefazer.pop();

  if (!estado) {
    return;
  }

  historicoDesfazer.push(criarEstadoEditor());
  restaurarEstado(estado);
  atualizarBotoesHistorico();
}

function atualizarBotoesHistorico() {
  botaoDesfazer.disabled = historicoDesfazer.length === 0;
  botaoRefazer.disabled = historicoRefazer.length === 0;
}

function obterRegioesCompactadas(tipo, conjunto = null) {
  const linhasAtivas = new Map();
  const regioes = [];

  function celulaEstaAtiva(coluna, linha) {
    const chave = chaveCelula(coluna, linha);

    return conjunto ? conjunto.has(chave) : tiposCelulas.get(chave) === tipo;
  }

  for (let linha = 1; linha <= LINHAS_TABULEIRO; linha++) {
    const intervalos = [];
    let coluna = 1;

    while (coluna <= COLUNAS_TABULEIRO) {
      if (!celulaEstaAtiva(coluna, linha)) {
        coluna++;
        continue;
      }

      const colunaInicial = coluna;

      while (
        coluna < COLUNAS_TABULEIRO &&
        celulaEstaAtiva(coluna + 1, linha)
      ) {
        coluna++;
      }

      intervalos.push([colunaInicial, coluna]);
      coluna++;
    }

    const proximasLinhasAtivas = new Map();

    for (const [colunaInicial, colunaFinal] of intervalos) {
      const chaveIntervalo = `${colunaInicial}:${colunaFinal}`;
      const regiao = linhasAtivas.get(chaveIntervalo) ?? {
        colunaInicial,
        colunaFinal,
        linhaInicial: linha,
        linhaFinal: linha,
      };

      regiao.linhaFinal = linha;
      proximasLinhasAtivas.set(chaveIntervalo, regiao);
    }

    for (const [chaveIntervalo, regiao] of linhasAtivas) {
      if (!proximasLinhasAtivas.has(chaveIntervalo)) {
        regioes.push(regiao);
      }
    }

    linhasAtivas.clear();

    for (const [chaveIntervalo, regiao] of proximasLinhasAtivas) {
      linhasAtivas.set(chaveIntervalo, regiao);
    }
  }

  regioes.push(...linhasAtivas.values());
  return regioes;
}

function formatarRegiao(regiao) {
  if (
    regiao.colunaInicial === regiao.colunaFinal &&
    regiao.linhaInicial === regiao.linhaFinal
  ) {
    return `    { coluna: ${regiao.colunaInicial}, linha: ${regiao.linhaInicial} },`;
  }

  return (
    "    { " +
    `colunaInicial: ${regiao.colunaInicial}, ` +
    `colunaFinal: ${regiao.colunaFinal}, ` +
    `linhaInicial: ${regiao.linhaInicial}, ` +
    `linhaFinal: ${regiao.linhaFinal} },`
  );
}

function formatarBarreira(barreira) {
  return (
    "    { " +
    `coluna: ${barreira.coluna}, ` +
    `linha: ${barreira.linha}, ` +
    `lado: "${barreira.lado}", ` +
    `tipo: "${barreira.tipo}" },`
  );
}

function gerarCodigo() {
  const bloqueadas = obterRegioesCompactadas("bloqueado");
  const dificeis = obterRegioesCompactadas("dificil");
  const bloqueiosVisuais = obterRegioesCompactadas(null, bloqueiosVisao);
  const barreiras = [...barreirasVisao.values()].sort(
    (barreiraA, barreiraB) =>
      barreiraA.linha - barreiraB.linha ||
      barreiraA.coluna - barreiraB.coluna ||
      barreiraA.lado.localeCompare(barreiraB.lado),
  );

  saidaCodigo.value = [
    "terreno: {",
    "  bloqueado: [",
    ...bloqueadas.map(formatarRegiao),
    "  ],",
    "",
    "  dificil: [",
    ...dificeis.map(formatarRegiao),
    "  ],",
    "},",
    "",
    "visao: {",
    "  bloqueios: [",
    ...bloqueiosVisuais.map(formatarRegiao),
    "  ],",
    "",
    "  barreiras: [",
    ...barreiras.map(formatarBarreira),
    "  ],",
    "},",
  ].join("\n");

  mensagemEditor.textContent =
    `Código gerado em ${
      bloqueadas.length +
        dificeis.length +
        bloqueiosVisuais.length +
        barreiras.length
    } regiões compactadas.`;
}

async function copiarCodigo() {
  if (!saidaCodigo.value) {
    gerarCodigo();
  }

  try {
    await navigator.clipboard.writeText(saidaCodigo.value);
    mensagemEditor.textContent = "Código copiado para a área de transferência.";
  } catch {
    saidaCodigo.focus();
    saidaCodigo.select();
    document.execCommand("copy");
    mensagemEditor.textContent = "Código selecionado e copiado.";
  }
}

function atualizarZoom() {
  const porcentagem = Number(controleZoom.value);
  const tamanho = TAMANHO_CELULA_BASE * (porcentagem / 100);

  canvasEditor.style.setProperty("--tamanho-celula", `${tamanho}px`);
  valorZoom.textContent = `${porcentagem}%`;
}

document.querySelector(".barra-ferramentas").addEventListener("click", selecionarPincel);
seletorModoVisao.addEventListener("click", selecionarModoVisao);
seletorBatalha.addEventListener("change", carregarBatalhaSelecionada);
gridEditor.addEventListener("pointerdown", iniciarPintura);
gridEditor.addEventListener("pointermove", continuarPintura);
document.addEventListener("pointerup", finalizarPintura);
document.addEventListener("pointercancel", finalizarPintura);
botaoDesfazer.addEventListener("click", desfazer);
botaoRefazer.addEventListener("click", refazer);
botaoGerarCodigo.addEventListener("click", gerarCodigo);
botaoCopiarCodigo.addEventListener("click", copiarCodigo);
controleZoom.addEventListener("input", atualizarZoom);

preencherListaBatalhas();
criarGrid();
atualizarZoom();
carregarBatalhaSelecionada();
