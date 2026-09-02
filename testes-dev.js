"use strict";

(function configurarTestesDev() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
    window.location.hostname,
  );

  if (!ambienteLocal) {
    return;
  }

  let saidaPainel = null;

  function clonar(valor) {
    return structuredClone(valor);
  }

  function exibirResultado(titulo, valor) {
    const resultado = {
      titulo,
      ...valor,
    };

    if (saidaPainel) {
      saidaPainel.textContent = JSON.stringify(resultado, null, 2);
    }

    console.log("[TestesDev]", resultado);

    return resultado;
  }

  function obterCenaRuasD() {
    return aventuraAtual?.cenas?.batalhaRuasD ?? null;
  }

  function abrirBatalhaRuasD() {
    const cena = obterCenaRuasD();

    if (!cena?.combate) {
      return exibirResultado("Abrir Ruas D", {
        sucesso: false,
        motivo: "batalhaRuasDNaoEncontrada",
      });
    }

    if (!estadoAtualJogo.personagem?.dados) {
      return exibirResultado("Abrir Ruas D", {
        sucesso: false,
        motivo: "personagemNaoCarregado",
      });
    }

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = "batalhaRuasD";
    cenaAtual = cena;

    verificarCombateDaCena(cena);

    const combate = estadoAtualJogo.combateAtual;

    if (!combate) {
      return exibirResultado("Abrir Ruas D", {
        sucesso: false,
        motivo: "combateNaoIniciado",
      });
    }

    introducaoCombateConfirmada = true;

    if (modalIntroducaoCombate.open) {
      modalIntroducaoCombate.close();
    }

    solicitacaoCombate.textContent = "";
    solicitacaoCombate.hidden = true;

    return exibirResultado("Abrir Ruas D", {
      sucesso: true,
      combateId: combate.id,
      participantes: combate.participantes.map(function resumirParticipante(participante) {
        return {
          id: participante.id,
          nome: participante.nome,
          tipo: participante.tipo,
        };
      }),
    });
  }

  function garantirBatalhaRuasD() {
    const combateAtual = estadoAtualJogo.combateAtual;

    if (combateAtual?.id?.includes("batalhaRuasD")) {
      return combateAtual;
    }

    abrirBatalhaRuasD();

    return estadoAtualJogo.combateAtual;
  }

  function configurarParticipantes(combate, configuracao) {
    const jogador = combate.participantes.find(
      (participante) => participante.tipo === "jogador",
    );

    const inimigos = combate.participantes.filter(
      (participante) => participante.tipo === "inimigo",
    );

    const inimigo = inimigos[0];

    if (!jogador || !inimigo) {
      return null;
    }

    jogador.estado = "ativo";
    jogador.posicao = clonar(configuracao.posicaoJogador);
    jogador.reacaoDisponivel = true;

    inimigo.estado = "ativo";
    inimigo.posicao = clonar(configuracao.posicaoInimigo);
    inimigo.inteligencia = {
      perfil: configuracao.perfil,
    };
    inimigo.pontosDeVida.atuais = inimigo.pontosDeVida.maximo;

    for (const outroInimigo of inimigos.slice(1)) {
      outroInimigo.estado = "derrotado";
    }

    combate.status = "ativo";
    combate.resultadoId = null;
    combate.objetivoConcluidoId = null;
    combate.decisaoPendente = null;
    combate.ataquePendente = null;
    combate.danoPendente = null;
    combate.ordemTurnos = [inimigo.id, jogador.id];
    combate.indiceTurno = 0;
    combate.rodada = 1;

    SistemaCombate.iniciarTurnoAtual(combate);

    atualizarInterfaceTurno(combate);

    return {
      jogador,
      inimigo,
    };
  }

  function prepararCenario(cenarioId) {
    const configuracoes = {
      adjacente: {
        perfil: "agressivo",
        posicaoJogador: { coluna: 22, linha: 14 },
        posicaoInimigo: { coluna: 22, linha: 13 },
      },

      distante: {
        perfil: "agressivo",
        posicaoJogador: { coluna: 22, linha: 14 },
        posicaoInimigo: { coluna: 23, linha: 5 },
      },

      ameacado: {
        perfil: "covarde",
        posicaoJogador: { coluna: 22, linha: 14 },
        posicaoInimigo: { coluna: 22, linha: 13 },
      },

      semLinhaDeVisao: {
        perfil: "agressivo",
        posicaoJogador: { coluna: 22, linha: 13 },
        posicaoInimigo: { coluna: 20, linha: 13 },
        bloqueioVisao: { coluna: 21, linha: 13 },
      },
    };

    const configuracao = configuracoes[cenarioId];

    if (!configuracao) {
      return exibirResultado("Preparar cenário", {
        sucesso: false,
        motivo: "cenarioDesconhecido",
        cenarioId,
      });
    }

    const combate = garantirBatalhaRuasD();

    if (!combate) {
      return exibirResultado(cenarioId, {
        sucesso: false,
        motivo: "combateIndisponivel",
      });
    }

    combate.visao.bloqueios = configuracao.bloqueioVisao
      ? [clonar(configuracao.bloqueioVisao)]
      : [];

    const participantes = configurarParticipantes(combate, configuracao);

    if (!participantes) {
      return exibirResultado(cenarioId, {
        sucesso: false,
        motivo: "participantesIndisponiveis",
      });
    }

    const plano = InteligenciaInimigos.planejarTurnoTatico(
      combate,
      participantes.inimigo,
      participantes.jogador,
    );

    renderizarTabuleiroCombate(combate);
    atualizarInterfaceTurno(combate);

    const resumo = exibirResultado(cenarioId, {
      sucesso: plano.sucesso,
      perfil: participantes.inimigo.inteligencia.perfil,
      posicaoJogador: clonar(participantes.jogador.posicao),
      posicaoInimigo: clonar(participantes.inimigo.posicao),
      tipoPlano: plano.planoEscolhido?.tipo ?? null,
      ataque: plano.planoEscolhido?.ataque?.nome ?? null,
      destino: clonar(plano.planoEscolhido?.posicao?.posicao ?? null),
      custoMovimento: plano.planoEscolhido?.custoMovimento ?? null,
      caminho: clonar(plano.planoEscolhido?.posicao?.caminho ?? []),
    });

    processarTurnoAtual(combate);

    return resumo;
  }

  function criarBotao(rotulo, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = rotulo;
    botao.style.padding = "7px 8px";
    botao.style.cursor = "pointer";
    botao.addEventListener("click", acao);

    return botao;
  }

  function criarPainel() {
    if (document.querySelector("#painelTestesDev")) {
      return;
    }

    const painel = document.createElement("details");
    painel.id = "painelTestesDev";
    painel.style.position = "fixed";
    painel.style.left = "12px";
    painel.style.bottom = "12px";
    painel.style.zIndex = "100000";
    painel.style.width = "330px";
    painel.style.maxHeight = "75vh";
    painel.style.overflow = "auto";
    painel.style.padding = "10px";
    painel.style.border = "1px solid #b88a4a";
    painel.style.borderRadius = "8px";
    painel.style.background = "#211710";
    painel.style.color = "#f4ead2";
    painel.style.boxShadow = "0 5px 22px rgba(0, 0, 0, 0.55)";
    painel.style.font = "13px/1.4 system-ui, sans-serif";

    const titulo = document.createElement("summary");
    titulo.textContent = "Modo DEV — IA inimiga";
    titulo.style.cursor = "pointer";
    titulo.style.fontWeight = "700";

    const instrucoes = document.createElement("p");
    instrucoes.textContent =
      "Cada cenário reinicia o estado tático e começa diretamente o turno do guarda.";

    const botoes = document.createElement("div");
    botoes.style.display = "grid";
    botoes.style.gridTemplateColumns = "1fr 1fr";
    botoes.style.gap = "6px";

    botoes.append(
      criarBotao("Abrir Ruas D", abrirBatalhaRuasD),
      criarBotao("Adjacente", () => prepararCenario("adjacente")),
      criarBotao("Distante", () => prepararCenario("distante")),
      criarBotao("Ameaçado", () => prepararCenario("ameacado")),
      criarBotao("Sem visão", () => prepararCenario("semLinhaDeVisao")),
    );

    saidaPainel = document.createElement("pre");
    saidaPainel.style.margin = "10px 0 0";
    saidaPainel.style.padding = "8px";
    saidaPainel.style.maxHeight = "240px";
    saidaPainel.style.overflow = "auto";
    saidaPainel.style.whiteSpace = "pre-wrap";
    saidaPainel.style.wordBreak = "break-word";
    saidaPainel.style.background = "rgba(255, 255, 255, 0.07)";
    saidaPainel.textContent = "Aguardando cenário.";

    painel.append(titulo, instrucoes, botoes, saidaPainel);
    document.body.append(painel);
  }

  window.TestesDev = Object.freeze({
    abrirBatalhaRuasD,
    prepararCenario,
    adjacente: () => prepararCenario("adjacente"),
    distante: () => prepararCenario("distante"),
    ameacado: () => prepararCenario("ameacado"),
    semLinhaDeVisao: () => prepararCenario("semLinhaDeVisao"),
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", criarPainel, { once: true });
  } else {
    criarPainel();
  }
})();
