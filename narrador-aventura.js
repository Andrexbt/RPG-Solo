"use strict";

window.NarradorAventura = (function () {
  const CHAVE_VELOCIDADE = "rpgSoloVelocidadeTexto";
  const VAR_ESPACO_PARAGRAFOS = "--espaco-paragrafos-aventura";

  const velocidades = {
    instantaneo: 0,
    rapido: 10,
    normal: 25,
    lento: 40,
  };

  let velocidadeAtual =
    localStorage.getItem(CHAVE_VELOCIDADE) ?? "normal";

  let escrevendo = false;

  function obterFluxo() {
    return document.querySelector("#fluxoNarrativo");
  }

  function obterAreaRolagem() {
    return document.querySelector(".conteudo-pergaminho-cena");
  }

  function obterIntervalo() {
    return velocidades[velocidadeAtual] ?? 18;
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

  function definirEspacoParagrafos(valor) {
    const valorCss =
      typeof valor === "number"
        ? `${valor}px`
        : String(valor || "8px");

    document.documentElement.style.setProperty(
      VAR_ESPACO_PARAGRAFOS,
      valorCss,
    );
  }

  function garantirEstilosParagrafos() {
    if (document.querySelector("#estilosParagrafosAventura")) {
      return;
    }

    const estilo = document.createElement("style");
    estilo.id = "estilosParagrafosAventura";
    estilo.textContent = `
      :root {
        ${VAR_ESPACO_PARAGRAFOS}: 8px;
      }

      .bloco-narrativo p {
        margin: 0 0 var(${VAR_ESPACO_PARAGRAFOS});
      }

      .bloco-narrativo p:last-child {
        margin-bottom: 0;
      }

      .botao-escolha .paragrafo-escolha,
      .escolha-realizada .paragrafo-escolha {
        display: block;
        margin: 0 0 var(${VAR_ESPACO_PARAGRAFOS});
      }

      .botao-escolha .paragrafo-escolha:last-child,
      .escolha-realizada .paragrafo-escolha:last-child {
        margin-bottom: 0;
      }
    `;

    document.head.append(estilo);
  }

  function usuarioEstaNoFim() {
    const area = obterAreaRolagem();

    if (!area) {
      return true;
    }

    const distanciaDoFim =
      area.scrollHeight - area.scrollTop - area.clientHeight;

    return distanciaDoFim < 80;
  }

  function rolarParaFim() {
    const area = obterAreaRolagem();

    if (!area) {
      return;
    }

    area.scrollTop = area.scrollHeight;
  }

  function esperar(ms) {
    return new Promise(function (resolver) {
      window.setTimeout(resolver, ms);
    });
  }

  async function escreverNoElemento(elemento, texto) {
    escrevendo = true;
    elemento.textContent = "";

    const acompanharFim = usuarioEstaNoFim();

    for (let indice = 0; indice < texto.length; indice += 1) {
      const intervalo = obterIntervalo();

      if (intervalo === 0) {
        elemento.textContent += texto.slice(indice);

        if (acompanharFim) {
          rolarParaFim();
        }

        break;
      }

      elemento.textContent += texto[indice];

      if (acompanharFim) {
        rolarParaFim();
      }

      await esperar(intervalo);
    }

    escrevendo = false;
  }

  function obterGeneroGramatical() {
    return (
      window.estadoJogo?.personagem?.dados?.avatar?.generoGramatical ??
      null
    );
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

    const textoAdaptado = texto.replace(
      /\{([^|{}]+)\|([^{}]+)\}/g,
      function (correspondencia, masculino, feminino) {
        return genero === "feminino" ? feminino : masculino;
      },
    );

    return normalizarTexto(textoAdaptado);
  }

  function separarParagrafos(texto) {
    if (typeof texto !== "string") {
      return [];
    }

    return normalizarTexto(texto)
      .split(/\n\s*\n/)
      .map(function (paragrafo) {
        return paragrafo
          .replace(/\s*\n\s*/g, " ")
          .trim();
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

  function formatarBotaoEscolha(botao) {
    if (!botao || botao.dataset.paragrafosFormatados === "true") {
      return;
    }

    const texto = botao.textContent ?? "";
    botao.dataset.paragrafosFormatados = "true";
    preencherElementoComParagrafos(botao, texto);
  }

  function observarBotoesEscolha() {
    const lista = document.querySelector("#listaEscolhas");

    if (!lista || lista.dataset.observadorParagrafos === "true") {
      return;
    }

    lista.dataset.observadorParagrafos = "true";

    const observador = new MutationObserver(function (mutacoes) {
      for (const mutacao of mutacoes) {
        for (const no of mutacao.addedNodes) {
          if (!(no instanceof Element)) {
            continue;
          }

          if (no.matches?.(".botao-escolha")) {
            formatarBotaoEscolha(no);
          }

          const botoesInternos = no.querySelectorAll?.(".botao-escolha") ?? [];

          for (const botao of botoesInternos) {
            formatarBotaoEscolha(botao);
          }
        }
      }
    });

    observador.observe(lista, {
      childList: true,
      subtree: true,
    });

    for (const botao of lista.querySelectorAll(".botao-escolha")) {
      formatarBotaoEscolha(botao);
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

    const textos = Array.isArray(texto) ? texto : [texto];

    const bloco = document.createElement("div");
    bloco.className = "bloco-narrativo";
    fluxo.append(bloco);

    for (const trecho of textos) {
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

  function adicionarDivisor() {
    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const divisor = document.createElement("hr");
    divisor.className = "divisor-narrativo";
    fluxo.append(divisor);

    rolarParaFim();
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

  garantirEstilosParagrafos();
  observarBotoesEscolha();

  return {
    adicionarNarracao,
    adicionarTeste,
    adicionarResultadoTeste,
    adicionarDivisor,
    adicionarEscolhaRealizada,

    adaptarGenero,
    obterGeneroGramatical,
    normalizarTexto,
    separarParagrafos,
    preencherElementoComParagrafos,

    definirEspacoParagrafos,
    definirVelocidade,
    obterVelocidade,
    rolarParaFim,
    limpar,
    estaEscrevendo,
  };
})();