"use strict";

(function configurarTestesDev() {
  const host = window.location.hostname;
  const ambienteDesenvolvimento =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0";

  if (!ambienteDesenvolvimento) {
    return;
  }

  let cenario = null;

  function clonar(valor) {
    return structuredClone(valor);
  }

  function obterDadosPersonagemAtual() {
    return window.estadoJogo?.personagem?.dados ?? null;
  }

  function criarParticipanteAnaoTeste() {
    const dados = obterDadosPersonagemAtual();

    if (!dados) {
      return null;
    }

    return {
      ...clonar(dados),
      id:
        window.estadoJogo?.personagem?.id ??
        dados.id ??
        "personagem-dev",
      especieId: "anao",
      nivel: Math.max(1, Number(dados.nivel) || 1),
    };
  }

  function garantirInfraestruturaTemporal() {
    if (!window.estadoJogo) {
      return false;
    }

    window.estadoJogo.tempo ??= {
      segundosTotais: 0,
    };

    window.estadoJogo.efeitosTemporarios ??= [];

    return true;
  }

  function prepararCenario() {
    if (!garantirInfraestruturaTemporal()) {
      return {
        sucesso: false,
        motivo: "estadoJogoIndisponivel",
      };
    }

    const participante = criarParticipanteAnaoTeste();

    if (!participante) {
      return {
        sucesso: false,
        motivo: "personagemDaAventuraAindaNaoCarregado",
      };
    }

    cenario = {
      participante,
      modo: "exploracao",
      ambiente: {
        superficieContato: {
          material: "pedra",
        },
      },
    };

    return {
      sucesso: true,
      participante: clonar(participante),
      contexto: {
        modo: cenario.modo,
        ambiente: clonar(cenario.ambiente),
      },
    };
  }

  function obterCenario() {
    if (!cenario) {
      const preparacao = prepararCenario();

      if (!preparacao.sucesso) {
        return null;
      }
    }

    return cenario;
  }

  function ativarConhecimentoDaPedra() {
    const atual = obterCenario();

    if (!atual) {
      return {
        sucesso: false,
        motivo: "cenarioIndisponivel",
      };
    }

    if (!window.TradutorRegras || !window.MotorEfeitos || !window.MotorTempo) {
      return {
        sucesso: false,
        motivo: "motoresAindaNaoCarregados",
      };
    }

    const contexto = {
      gatilho: "aoAtivar",
      participante: atual.participante,
      modo: atual.modo,
      ambiente: clonar(atual.ambiente),
    };

    const operacoes = window.TradutorRegras.prepararOperacoes(contexto);

    const operacao = operacoes.find(
      item => item?.origem?.id === "conhecimentoDaPedra",
    );

    if (!operacao) {
      return {
        sucesso: false,
        motivo: "conhecimentoDaPedraNaoDisponivel",
        operacoesEncontradas: operacoes.map(item => item?.origem?.id ?? item?.tipo),
      };
    }

    const resultado = window.TradutorRegras.executarOperacao(
      operacao,
      {
        participante: atual.participante,
        modo: atual.modo,
        ambiente: clonar(atual.ambiente),
      },
    );

    return {
      ...resultado,
      participanteId: atual.participante.id,
      estadoRegra:
        atual.participante.estadoRegras?.[
          "tracoEspecie:conhecimentoDaPedra"
        ] ?? null,
      efeitosAtivos: obterEfeitosAtivos(),
    };
  }

  function obterEfeitosAtivos() {
    const atual = obterCenario();

    if (!atual || !window.MotorEfeitos) {
      return [];
    }

    return window.MotorEfeitos
      .obterEfeitosTemporariosAtivos({
        participanteId: atual.participante.id,
      })
      .map(efeito => ({
        ...clonar(efeito),
        tempoRestante:
          window.MotorTempo?.obterTempoRestante(efeito) ?? null,
      }));
  }

  function avancarTempo(quantidade, unidade = "minutos") {
    if (!window.MotorTempo) {
      return {
        sucesso: false,
        motivo: "motorTempoIndisponivel",
      };
    }

    const resultado = window.MotorTempo.avancar({
      quantidade,
      unidade,
    });

    return {
      ...resultado,
      efeitosAtivos: obterEfeitosAtivos(),
    };
  }

  function mostrarEstado() {
    const atual = obterCenario();

    return {
      tempoAtual:
        window.MotorTempo?.obterTempoAtual() ?? null,
      participante: atual
        ? {
            id: atual.participante.id,
            especieId: atual.participante.especieId,
            classeId: atual.participante.classeId,
            nivel: atual.participante.nivel,
            estadoRegras: clonar(atual.participante.estadoRegras ?? {}),
          }
        : null,
      efeitosTemporariosGlobais:
        clonar(window.estadoJogo?.efeitosTemporarios ?? []),
      efeitosAtivosDoParticipante: obterEfeitosAtivos(),
    };
  }

  function resetar() {
    cenario = null;

    if (window.estadoJogo) {
      window.estadoJogo.tempo = {
        segundosTotais: 0,
      };
      window.estadoJogo.efeitosTemporarios = [];
    }

    return {
      sucesso: true,
      tempoAtual: 0,
      efeitosTemporarios: [],
    };
  }

  function executarSuiteConhecimentoDaPedra() {
    resetar();

    const preparacao = prepararCenario();

    if (!preparacao.sucesso) {
      return { preparacao };
    }

    const ativacao = ativarConhecimentoDaPedra();
    const aposAtivacao = mostrarEstado();
    const aposCincoMinutos = avancarTempo(5, "minutos");
    const estadoCincoMinutos = mostrarEstado();
    const aposDezMinutos = avancarTempo(5, "minutos");
    const estadoDezMinutos = mostrarEstado();

    return {
      preparacao,
      ativacao,
      aposAtivacao,
      aposCincoMinutos,
      estadoCincoMinutos,
      aposDezMinutos,
      estadoDezMinutos,
    };
  }

  function formatarSaida(valor) {
    try {
      return JSON.stringify(valor, null, 2);
    } catch (erro) {
      return String(valor);
    }
  }

  function exibirNoPainel(valor) {
    const saida = document.querySelector("#testesDevSaida");

    if (saida) {
      saida.textContent = formatarSaida(valor);
    }

    console.log("[TestesDev]", valor);

    return valor;
  }

  function criarBotao(texto, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.addEventListener("click", function executarAcaoDev() {
      exibirNoPainel(acao());
    });
    return botao;
  }

  function criarPainel() {
    if (document.querySelector("#painelTestesDev")) {
      return;
    }

    const painel = document.createElement("aside");
    painel.id = "painelTestesDev";
    painel.setAttribute("aria-label", "Ferramentas de desenvolvimento");
    painel.style.position = "fixed";
    painel.style.right = "12px";
    painel.style.bottom = "12px";
    painel.style.zIndex = "99999";
    painel.style.width = "320px";
    painel.style.maxHeight = "70vh";
    painel.style.overflow = "auto";
    painel.style.padding = "12px";
    painel.style.border = "1px solid currentColor";
    painel.style.borderRadius = "8px";
    painel.style.background = "Canvas";
    painel.style.color = "CanvasText";
    painel.style.boxShadow = "0 4px 18px rgba(0, 0, 0, 0.25)";
    painel.style.font = "13px/1.4 system-ui, sans-serif";

    const titulo = document.createElement("strong");
    titulo.textContent = "Testes DEV — tempo e efeitos";

    const instrucoes = document.createElement("p");
    instrucoes.textContent =
      "Use os botões após a aventura carregar. O cenário de teste é recriado após cada reload.";

    const botoes = document.createElement("div");
    botoes.style.display = "grid";
    botoes.style.gridTemplateColumns = "1fr 1fr";
    botoes.style.gap = "6px";

    botoes.append(
      criarBotao("Preparar anão", prepararCenario),
      criarBotao("Ativar Pedra", ativarConhecimentoDaPedra),
      criarBotao("+1 min", () => avancarTempo(1, "minutos")),
      criarBotao("+5 min", () => avancarTempo(5, "minutos")),
      criarBotao("+10 min", () => avancarTempo(10, "minutos")),
      criarBotao("Mostrar estado", mostrarEstado),
      criarBotao("Suite completa", executarSuiteConhecimentoDaPedra),
      criarBotao("Resetar", resetar),
    );

    const saida = document.createElement("pre");
    saida.id = "testesDevSaida";
    saida.style.whiteSpace = "pre-wrap";
    saida.style.wordBreak = "break-word";
    saida.style.marginTop = "10px";
    saida.style.padding = "8px";
    saida.style.maxHeight = "280px";
    saida.style.overflow = "auto";
    saida.style.background = "rgba(127, 127, 127, 0.12)";
    saida.textContent = "Aguardando teste.";

    painel.append(titulo, instrucoes, botoes, saida);
    document.body.append(painel);
  }

  window.TestesDev = {
    prepararCenario,
    ativarConhecimentoDaPedra,
    obterEfeitosAtivos,
    avancarTempo,
    mostrarEstado,
    resetar,
    executarSuiteConhecimentoDaPedra,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", criarPainel, { once: true });
  } else {
    criarPainel();
  }
})();
