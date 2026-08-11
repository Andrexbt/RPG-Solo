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

     if (!fluxo) {
    return;
  }

    const bloco =
      document.createElement("p");

    bloco.className =
      "escolha-realizada";

    bloco.textContent = texto;

    bloco.textContent =
    `Você escolheu ${texto}`

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
    definirVelocidade,
    obterVelocidade,
    rolarParaFim,
    limpar,
    estaEscrevendo,
  };
})();