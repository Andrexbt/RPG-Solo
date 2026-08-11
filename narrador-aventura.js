"use strict";

window.NarradorAventura = (function () {
  const CHAVE_VELOCIDADE = "rpgSoloVelocidadeTexto";

  const velocidades = {
    instantaneo: 0,
    rapido: 10,
    normal: 25,
    lento: 40,
  };

  let velocidadeAtual = localStorage.getItem(CHAVE_VELOCIDADE) ?? "normal";
  let escrevendo = false;

  function obterFluxo() {
    return document.querySelector("#fluxoNarrativo");
  }

  function obterAreaRolagem() {
    return document.querySelector(".conteudo-pergaminho-cena");
  }

  function obterIntervalo() {
    return velocidades[velocidadeAtual] ?? velocidades.normal;
  }

  function definirVelocidade(valor) {
    if (!(valor in velocidades)) {
      return;
    }

    velocidadeAtual = valor;
    localStorage.setItem(CHAVE_VELOCIDADE, valor);
  }

  function obterVelocidade() {
    return velocidadeAtual;
  }

  function esperar(ms) {
    return new Promise(function (resolver) {
      window.setTimeout(resolver, ms);
    });
  }

  async function escreverNoElemento(elemento, texto) {
    escrevendo = true;
    elemento.textContent = "";

    for (let indice = 0; indice < texto.length; indice += 1) {
      const intervalo = obterIntervalo();

      if (intervalo === 0) {
        elemento.textContent += texto.slice(indice);
        break;
      }

      elemento.textContent += texto[indice];
      await esperar(intervalo);
    }

    escrevendo = false;
  }

  function obterGeneroGramatical() {
    return window.estadoJogo?.personagem?.dados?.avatar?.generoGramatical ?? null;
  }

  function normalizarTexto(texto) {
    if (typeof texto !== "string") {
      return texto;
    }

    return texto
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map(function (linha) {
        return linha.trim();
      })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function adaptarGenero(texto) {
    if (typeof texto !== "string") {
      return texto;
    }

    const genero = obterGeneroGramatical();

    return normalizarTexto(
      texto.replace(
        /\{([^|{}]+)\|([^{}]+)\}/g,
        function (_correspondencia, masculino, feminino) {
          return genero === "feminino" ? feminino : masculino;
        },
      ),
    );
  }

  function separarParagrafos(texto) {
    if (typeof texto !== "string") {
      return [];
    }

    return normalizarTexto(texto)
      .split(/\n\s*\n/)
      .map(function (paragrafo) {
        return paragrafo.replace(/\s*\n\s*/g, " ").trim();
      })
      .filter(Boolean);
  }

  function preencherElementoComParagrafos(
    elemento,
    texto,
    classeParagrafo = "paragrafo-escolha",
  ) {
    const paragrafos = separarParagrafos(adaptarGenero(texto));
    elemento.replaceChildren();

    for (const textoParagrafo of paragrafos) {
      const paragrafo = document.createElement("span");
      paragrafo.className = classeParagrafo;
      paragrafo.textContent = textoParagrafo;
      elemento.append(paragrafo);
    }
  }

  async function adicionarNarracao(texto) {
    if (texto === undefined || texto === null || texto === "") {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const trechos = Array.isArray(texto) ? texto : [texto];
    const bloco = document.createElement("div");
    bloco.className = "bloco-narrativo";
    fluxo.append(bloco);

    for (const trecho of trechos) {
      const paragrafos = separarParagrafos(adaptarGenero(trecho));

      for (const textoParagrafo of paragrafos) {
        const paragrafo = document.createElement("p");
        bloco.append(paragrafo);
        await escreverNoElemento(paragrafo, textoParagrafo);
      }
    }
  }

  async function adicionarTeste(texto) {
    if (!texto) {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const paragrafo = document.createElement("p");
    paragrafo.className = "linha-teste-narrativo";
    fluxo.append(paragrafo);

    await escreverNoElemento(paragrafo, adaptarGenero(texto));
  }

  function adicionarDivisor() {
    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const divisor = document.createElement("hr");
    divisor.className = "divisor-narrativo";
    fluxo.append(divisor);
  }

  function rolarParaEscolha(elemento) {
    const area = obterAreaRolagem();

    if (!area || !elemento) {
      return;
    }

    const areaRect = area.getBoundingClientRect();
    const elementoRect = elemento.getBoundingClientRect();
    const destino = area.scrollTop + elementoRect.top - areaRect.top;

    area.scrollTo({
      top: destino,
      behavior: "smooth",
    });
  }

  function adicionarEscolhaRealizada(escolha) {
    if (!escolha?.texto) {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    adicionarDivisor();

    const bloco = document.createElement("div");
    bloco.className = "escolha-realizada";
    preencherElementoComParagrafos(bloco, escolha.texto);
    fluxo.append(bloco);

    rolarParaEscolha(bloco);
  }

  async function adicionarResultadoTeste({ sucesso, nomeTeste, acao }) {
    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const paragrafo = document.createElement("p");
    paragrafo.className = sucesso
      ? "resultado-teste sucesso"
      : "resultado-teste falha";
    fluxo.append(paragrafo);

    const texto = sucesso
      ? `Sucesso no teste de ${nomeTeste}. Você conseguiu ${acao}.`
      : `Falha no teste de ${nomeTeste}. Você não conseguiu ${acao}.`;

    await escreverNoElemento(paragrafo, adaptarGenero(texto));
    adicionarDivisor();
  }

  function limpar() {
    obterFluxo()?.replaceChildren();
  }

  function estaEscrevendo() {
    return escrevendo;
  }

  return {
    adaptarGenero,
    separarParagrafos,
    preencherElementoComParagrafos,
    adicionarNarracao,
    adicionarTeste,
    adicionarResultadoTeste,
    adicionarEscolhaRealizada,
    definirVelocidade,
    obterVelocidade,
    limpar,
    estaEscrevendo,
  };
})();
