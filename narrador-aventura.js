"use strict";

window.NarradorAventura = (function () {
  const CHAVE_VELOCIDADE =
    "rpgSoloVelocidadeTexto";

  const velocidades = {
    instantaneo: 0,
    rapido: 10,
    normal: 25,
    lento: 40,
  };

  let velocidadeAtual =
    localStorage.getItem(CHAVE_VELOCIDADE) ??
    "normal";

  let escrevendo = false;

  function obterFluxo() {
    return document.querySelector(
      "#fluxoNarrativo"
    );
  }

  function obterAreaRolagem() {
    return document.querySelector(
      ".conteudo-pergaminho-cena"
    );
  }

  function obterIntervalo() {
    return velocidades[velocidadeAtual] ?? 18;
  }

  function definirVelocidade(valor) {
    if (!(valor in velocidades)) {
      return;
    }

    velocidadeAtual = valor;

    localStorage.setItem(
      CHAVE_VELOCIDADE,
      valor
    );
  }

  function obterVelocidade() {
    return velocidadeAtual;
  }

  function usuarioEstaNoFim() {
    const area = obterAreaRolagem();

    if (!area) {
      return true;
    }

    const distanciaDoFim =
      area.scrollHeight -
      area.scrollTop -
      area.clientHeight;

    return distanciaDoFim < 80;
  }

  function rolarParaFim() {
    const area = obterAreaRolagem();

    if (!area) {
      return;
    }

    area.scrollTop =
      area.scrollHeight;
  }

  function esperar(ms) {
    return new Promise(function (resolver) {
      window.setTimeout(resolver, ms);
    });
  }

  async function escreverNoElemento(
  elemento,
  texto
) {
  escrevendo = true;

  elemento.textContent = "";

  const acompanharFim =
    usuarioEstaNoFim();

  for (
    let indice = 0;
    indice < texto.length;
    indice += 1
  ) {
    const intervalo =
      obterIntervalo();

    if (intervalo === 0) {
      elemento.textContent +=
        texto.slice(indice);

      if (acompanharFim) {
        rolarParaFim();
      }

      break;
    }

    elemento.textContent +=
      texto[indice];

    if (acompanharFim) {
      rolarParaFim();
    }

    await esperar(intervalo);
  }

  escrevendo = false;
  }

  function obterGeneroGramatical() {
  return (
    window.estadoJogo
      ?.personagem
      ?.dados
      ?.avatar
      ?.generoGramatical ?? null
  );
  }

  function adaptarGenero(texto) {
  if (typeof texto !== "string") {
    return texto;
  }

  const genero =
    obterGeneroGramatical();

  return texto.replace(
    /\{([^|{}]+)\|([^{}]+)\}/g,
    function (
      correspondencia,
      masculino,
      feminino
    ) {
      return genero === "feminino"
        ? feminino
        : masculino;
    }
  );
  }

  async function adicionarNarracao(texto) {
    if (
      texto === undefined ||
      texto === null ||
      texto === ""
    ) {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const textos =
      Array.isArray(texto)
        ? texto
        : [texto];

    const bloco =
      document.createElement("div");

    bloco.className =
      "bloco-narrativo";

    fluxo.append(bloco);

    for (const trecho of textos) {
      const paragrafo =
        document.createElement("p");

      bloco.append(paragrafo);

      await escreverNoElemento(
        paragrafo,
        adaptarGenero(trecho)
      );
    }
  }

  async function adicionarTeste(texto) {
    if (!texto) {
      return;
    }

    const fluxo = obterFluxo();

    const paragrafo =
      document.createElement("p");

    paragrafo.className =
      "linha-teste-narrativo";

    fluxo.append(paragrafo);

    await escreverNoElemento(
      paragrafo,
      adaptarGenero(texto)
    );
  }

  function criarOrigemEscolha() {
  return {
    cenaId:
      window.estadoJogo
        ?.progresso
        ?.cenaId ??
      null,

    caminhoId:
      window.estadoJogo
        ?.progresso
        ?.caminhoId ??
      null,

    etapaId:
      window.estadoJogo
        ?.progresso
        ?.etapaId ??
      null,
  };
  }

  function criarTextoEscolha(
  escolha,
  origem
) {
  const texto =
    escolha.texto ?? "";

  if (origem.etapaId) {
    return (
      `Diante da situação, você decidiu: ` +
      `${texto}`
    );
  }

  if (origem.caminhoId) {
    return (
      `Você decidiu continuar sua ação: ` +
      `${texto}`
    );
  }

  return `Você escolheu: ${texto}`;
  }

  function adicionarEscolhaRealizada(
  escolha
) {
  if (!escolha) {
    return;
  }

  const fluxo = obterFluxo();

  if (!fluxo) {
    return;
  }

  const origem =
    criarOrigemEscolha();

  const bloco =
    document.createElement("p");

  bloco.className =
    "escolha-realizada";

  bloco.dataset.cenaOrigem =
    origem.cenaId ?? "";

  bloco.dataset.caminhoOrigem =
    origem.caminhoId ?? "";

  bloco.dataset.etapaOrigem =
    origem.etapaId ?? "";

  bloco.textContent =
    adaptarGenero(
      criarTextoEscolha(
        escolha,
        origem
      )
    );

  fluxo.append(bloco);

  adicionarDivisor();
  }

  function limpar() {
    const fluxo = obterFluxo();

    if (fluxo) {
      fluxo.replaceChildren();
    }
  }

  function estaEscrevendo() {
    return escrevendo;
  }

  async function adicionarResultadoTeste({
  sucesso,
  nomeTeste,
  acao,
}) {
  const fluxo = obterFluxo();

  if (!fluxo) {
    return;
  }

  const paragrafo =
    document.createElement("p");

  paragrafo.className =
    sucesso
      ? "resultado-teste sucesso"
      : "resultado-teste falha";

  fluxo.append(paragrafo);

  const texto =
    sucesso
      ? `Sucesso no teste de ${nomeTeste}. Você conseguiu ${acao}.`
      : `Falha no teste de ${nomeTeste}. Você não conseguiu ${acao}.`;

  await escreverNoElemento(
    paragrafo,
    texto
  );

  adicionarDivisor();
  }

  function adicionarDivisor() {
  const fluxo = obterFluxo();

  if (!fluxo) {
    return;
  }

  const divisor =
    document.createElement("hr");

  divisor.className =
    "divisor-narrativo";

  fluxo.append(divisor);

  rolarParaFim();
  }

  

  return {
    adicionarNarracao,
    adicionarTeste,
    adicionarResultadoTeste,
    adicionarDivisor,
    adicionarEscolhaRealizada,

    adaptarGenero,
    obterGeneroGramatical,

    definirVelocidade,
    obterVelocidade,
    rolarParaFim,
    limpar,
    estaEscrevendo,
  };
})();