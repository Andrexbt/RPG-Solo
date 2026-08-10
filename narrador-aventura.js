"use strict";

window.NarradorAventura = (function () {
  const CHAVE_VELOCIDADE =
    "rpgSoloVelocidadeTexto";

  const velocidades = {
    instantaneo: 0,
    rapido: 8,
    normal: 18,
    lento: 35,
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
    const intervalo =
      obterIntervalo();

    if (intervalo === 0) {
      elemento.textContent = texto;
      rolarParaFim();
      return;
    }

    escrevendo = true;

    elemento.textContent = "";

    let acompanharFim =
      usuarioEstaNoFim();

    for (const caractere of texto) {
      elemento.textContent += caractere;

      if (acompanharFim) {
        rolarParaFim();
      }

      await esperar(intervalo);
    }

    escrevendo = false;
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
        trecho
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
      texto
    );
  }

  function adicionarEscolhaRealizada(texto) {
    if (!texto) {
      return;
    }

    const fluxo = obterFluxo();

    const bloco =
      document.createElement("p");

    bloco.className =
      "escolha-realizada";

    bloco.textContent = texto;

    fluxo.append(bloco);

    rolarParaFim();
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

  return {
    adicionarNarracao,
    adicionarTeste,
    adicionarEscolhaRealizada,
    definirVelocidade,
    obterVelocidade,
    rolarParaFim,
    limpar,
    estaEscrevendo,
  };
})();