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
const coordenadaAtual = document.querySelector("#coordenadaAtual");
const botaoDesfazer = document.querySelector("#botaoDesfazer");
const botaoRefazer = document.querySelector("#botaoRefazer");
const botaoGerarCodigo = document.querySelector("#botaoGerarCodigo");
const botaoCopiarCodigo = document.querySelector("#botaoCopiarCodigo");
const saidaCodigo = document.querySelector("#saidaCodigo");
const mensagemEditor = document.querySelector("#mensagemEditor");

const batalhasDisponiveis = new Map();
const tiposCelulas = new Map();
const historicoDesfazer = [];
const historicoRefazer = [];

let tipoPincel = "normal";
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
}

function atualizarTodasCelulas() {
  for (let linha = 1; linha <= LINHAS_TABULEIRO; linha++) {
    for (let coluna = 1; coluna <= COLUNAS_TABULEIRO; coluna++) {
      atualizarCelulaVisual(coluna, linha);
    }
  }

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
}

function carregarBatalhaSelecionada() {
  const item = batalhasDisponiveis.get(seletorBatalha.value);

  if (!item) {
    return;
  }

  tiposCelulas.clear();
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
    }
  }

  saidaCodigo.value = "";
  mensagemEditor.textContent = "Configuração atual carregada.";
  atualizarTodasCelulas();
  atualizarBotoesHistorico();
}

function selecionarPincel(evento) {
  const botao = evento.target.closest("[data-tipo]");

  if (!botao) {
    return;
  }

  tipoPincel = botao.dataset.tipo;

  for (const outroBotao of document.querySelectorAll("[data-tipo]")) {
    outroBotao.classList.toggle("ativo", outroBotao === botao);
  }
}

function aplicarPincel(celula) {
  if (!celula) {
    return;
  }

  const coluna = Number(celula.dataset.coluna);
  const linha = Number(celula.dataset.linha);
  const chave = chaveCelula(coluna, linha);

  if (tipoPincel === "normal") {
    tiposCelulas.delete(chave);
  } else {
    tiposCelulas.set(chave, tipoPincel);
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
  estadoAntesDoTraco = new Map(tiposCelulas);
  aplicarPincel(celula);
}

function continuarPintura(evento) {
  const celula = evento.target.closest(".celula-editor");

  if (celula) {
    coordenadaAtual.textContent = `${celula.dataset.coluna}, ${celula.dataset.linha}`;
  }

  if (pintando && celula) {
    aplicarPincel(celula);
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

function finalizarPintura() {
  if (!pintando) {
    return;
  }

  pintando = false;

  if (estadoAntesDoTraco && !mapasIguais(estadoAntesDoTraco, tiposCelulas)) {
    historicoDesfazer.push(estadoAntesDoTraco);
    historicoRefazer.length = 0;

    if (historicoDesfazer.length > 60) {
      historicoDesfazer.shift();
    }
  }

  estadoAntesDoTraco = null;
  atualizarBotoesHistorico();
}

function restaurarMapa(mapa) {
  tiposCelulas.clear();

  for (const [chave, tipo] of mapa) {
    tiposCelulas.set(chave, tipo);
  }

  atualizarTodasCelulas();
}

function desfazer() {
  const estado = historicoDesfazer.pop();

  if (!estado) {
    return;
  }

  historicoRefazer.push(new Map(tiposCelulas));
  restaurarMapa(estado);
  atualizarBotoesHistorico();
}

function refazer() {
  const estado = historicoRefazer.pop();

  if (!estado) {
    return;
  }

  historicoDesfazer.push(new Map(tiposCelulas));
  restaurarMapa(estado);
  atualizarBotoesHistorico();
}

function atualizarBotoesHistorico() {
  botaoDesfazer.disabled = historicoDesfazer.length === 0;
  botaoRefazer.disabled = historicoRefazer.length === 0;
}

function obterRegioesCompactadas(tipo) {
  const linhasAtivas = new Map();
  const regioes = [];

  for (let linha = 1; linha <= LINHAS_TABULEIRO; linha++) {
    const intervalos = [];
    let coluna = 1;

    while (coluna <= COLUNAS_TABULEIRO) {
      if (tiposCelulas.get(chaveCelula(coluna, linha)) !== tipo) {
        coluna++;
        continue;
      }

      const colunaInicial = coluna;

      while (
        coluna < COLUNAS_TABULEIRO &&
        tiposCelulas.get(chaveCelula(coluna + 1, linha)) === tipo
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

function gerarCodigo() {
  const bloqueadas = obterRegioesCompactadas("bloqueado");
  const dificeis = obterRegioesCompactadas("dificil");

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
  ].join("\n");

  mensagemEditor.textContent =
    `Código gerado em ${bloqueadas.length + dificeis.length} regiões compactadas.`;
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

document.querySelector(".grupo-pinceis").addEventListener("click", selecionarPincel);
seletorBatalha.addEventListener("change", carregarBatalhaSelecionada);
gridEditor.addEventListener("pointerdown", iniciarPintura);
gridEditor.addEventListener("pointerover", continuarPintura);
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
