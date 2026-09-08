"use strict";

(function configurarTestesDev() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
    window.location.hostname,
  );

  if (!ambienteLocal) {
    return;
  }

  let saidaPainel = null;
  let seletorEncerramento = null;
  let seletorMapaBatalha = null;
  let colunaJogadorBatalha = null;
  let linhaJogadorBatalha = null;
  let listaInimigosBatalha = null;

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

  function obterVariacoesEncerramento() {
    return aventuraAtual
      ?.cenas
      ?.encerramentoAventura
      ?.variacoes ?? [];
  }

  function obterResultadoFinalVariacao(variacao) {
    return variacao.escolhas
      ?.find((escolha) => escolha.fimAventura)
      ?.fimAventura
      ?.resultadoId ?? "indefinido";
  }

  function criarRotuloVariacaoEncerramento(variacao, indice) {
    const origem = variacao.se?.veioDe ?? {};
    const resultadoFinal = obterResultadoFinalVariacao(variacao);
    const local = [origem.cenaId, origem.etapaId]
      .filter(Boolean)
      .join(" / ");
    const evento = [origem.tipo, origem.resultado]
      .filter(Boolean)
      .join(": ");

    return `${indice + 1}. ${resultadoFinal} — ${local || "sem origem"}` +
      (evento ? ` — ${evento}` : "");
  }

  function abrirEncerramentoAventura(indiceVariacao) {
    const cenaEncerramento =
      aventuraAtual?.cenas?.encerramentoAventura;

    if (!cenaEncerramento) {
      return exibirResultado("Abrir encerramento", {
        sucesso: false,
        motivo: "encerramentoAventuraNaoEncontrado",
      });
    }

    if (!estadoAtualJogo.personagem?.dados) {
      return exibirResultado("Abrir encerramento", {
        sucesso: false,
        motivo: "personagemNaoCarregado",
      });
    }

    const variacao =
      cenaEncerramento.variacoes?.[indiceVariacao];
    const origem = variacao?.se?.veioDe;

    if (!origem) {
      return exibirResultado("Abrir encerramento", {
        sucesso: false,
        motivo: "variacaoSemProcedencia",
        indiceVariacao,
      });
    }

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = origem.cenaId;
    estadoAtualJogo.progresso.etapaId = origem.etapaId ?? null;
    estadoAtualJogo.progresso.caminhoId = origem.caminhoId ?? null;

    registrarEventoNarrativo({
      tipo: origem.tipo ?? null,
      resultado: origem.resultado ?? null,
      quantidadeAcertos: origem.quantidadeAcertos ?? null,
    });

    exibirTelaAventura();
    NarradorAventura.limpar();
    mudarCena("encerramentoAventura");

    return exibirResultado("Abrir encerramento", {
      sucesso: true,
      indiceVariacao,
      resultadoFinal: obterResultadoFinalVariacao(variacao),
      procedencia: clonar(origem),
      cenaId: "encerramentoAventura",
    });
  }

  function abrirEncerramentoSelecionado() {
    return abrirEncerramentoAventura(
      Number(seletorEncerramento?.value ?? 0),
    );
  }

  function abrirPrimeiroEncerramentoDoTipo(resultadoId) {
    const indice = obterVariacoesEncerramento()
      .findIndex(
        (variacao) =>
          obterResultadoFinalVariacao(variacao) === resultadoId,
      );

    return abrirEncerramentoAventura(indice);
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

  function listarBatalhasDisponiveis() {
    return Object.entries(aventuraAtual?.cenas ?? {})
      .filter(([, cena]) => Boolean(cena?.combate?.mapa))
      .map(([cenaId, cena]) => ({
        cenaId,
        cena,
        combate: cena.combate,
      }));
  }

  function criarCampoNumero(valorInicial) {
    const campo = document.createElement("input");
    campo.type = "number";
    campo.min = "1";
    campo.step = "1";
    campo.value = String(valorInicial ?? 1);
    campo.style.width = "68px";
    campo.style.padding = "6px";

    return campo;
  }

  function criarSeletorNpc(npcIdSelecionado) {
    const seletor = document.createElement("select");
    seletor.style.minWidth = "0";
    seletor.style.padding = "6px";

    for (const [npcId, npc] of Object.entries(estadoAtualJogo.npcs ?? {})) {
      if (npc.tipo !== "inimigo") {
        continue;
      }

      const opcao = document.createElement("option");
      opcao.value = npcId;
      opcao.textContent = `${npc.nome} (${npcId})`;
      opcao.selected = npcId === npcIdSelecionado;
      seletor.append(opcao);
    }

    return seletor;
  }

  function adicionarInimigoBatalha(
    npcId = null,
    posicao = { coluna: 1, linha: 1 },
  ) {
    if (!listaInimigosBatalha) {
      return;
    }

    const linha = document.createElement("div");
    linha.dataset.inimigoBatalhaDev = "";
    linha.style.display = "grid";
    linha.style.gridTemplateColumns = "minmax(0, 1fr) auto auto auto";
    linha.style.gap = "5px";
    linha.style.alignItems = "center";

    const seletorNpc = criarSeletorNpc(npcId);
    seletorNpc.dataset.campo = "npcId";

    const coluna = criarCampoNumero(posicao.coluna);
    coluna.dataset.campo = "coluna";
    coluna.title = "Coluna";

    const linhaPosicao = criarCampoNumero(posicao.linha);
    linhaPosicao.dataset.campo = "linha";
    linhaPosicao.title = "Linha";

    const remover = criarBotao("×", () => linha.remove());
    remover.title = "Remover inimigo";

    linha.append(seletorNpc, coluna, linhaPosicao, remover);
    listaInimigosBatalha.append(linha);
  }

  function obterBatalhaSelecionada() {
    return listarBatalhasDisponiveis().find(
      (batalha) => batalha.cenaId === seletorMapaBatalha?.value,
    ) ?? null;
  }

  function carregarPosicoesOriginaisBatalha() {
    const batalha = obterBatalhaSelecionada();

    if (!batalha) {
      return;
    }

    colunaJogadorBatalha.value = String(
      batalha.combate.jogador?.posicao?.coluna ?? 1,
    );
    linhaJogadorBatalha.value = String(
      batalha.combate.jogador?.posicao?.linha ?? 1,
    );

    listaInimigosBatalha.innerHTML = "";

    for (const configuracao of batalha.combate.inimigos ?? []) {
      for (const posicao of configuracao.posicoes ?? []) {
        adicionarInimigoBatalha(configuracao.npcId, posicao);
      }
    }

    if (!listaInimigosBatalha.children.length) {
      adicionarInimigoBatalha();
    }
  }

  function lerPosicao(coluna, linha) {
    return {
      coluna: Number(coluna),
      linha: Number(linha),
    };
  }

  function validarPosicoesBatalha(combateBase, posicoes) {
    const ocupadas = new Set();

    for (const item of posicoes) {
      const { coluna, linha } = item.posicao;

      if (
        !Number.isInteger(coluna) ||
        !Number.isInteger(linha) ||
        coluna < 1 ||
        coluna > 48 ||
        linha < 1 ||
        linha > 27
      ) {
        return `Posição inválida para ${item.nome}: coluna ${coluna}, linha ${linha}.`;
      }

      const chave = `${coluna},${linha}`;

      if (ocupadas.has(chave)) {
        return `Mais de um participante ocupa a célula ${chave}.`;
      }

      ocupadas.add(chave);

      const tipoTerreno = SistemaCombate.obterTipoTerreno(
        { terreno: combateBase.terreno },
        coluna,
        linha,
      );

      if (tipoTerreno === "bloqueado") {
        return `${item.nome} foi colocado em terreno bloqueado (${chave}).`;
      }
    }

    return null;
  }

  function iniciarBatalhaPersonalizada() {
    const batalha = obterBatalhaSelecionada();

    if (!batalha) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "mapaNaoSelecionado",
      });
    }

    if (!estadoAtualJogo.personagem?.dados) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "personagemNaoCarregado",
      });
    }

    const posicaoJogador = lerPosicao(
      colunaJogadorBatalha.value,
      linhaJogadorBatalha.value,
    );

    const inimigosInformados = Array.from(
      listaInimigosBatalha.querySelectorAll("[data-inimigo-batalha-dev]"),
    ).map((linha, indice) => ({
      npcId: linha.querySelector('[data-campo="npcId"]').value,
      nome: `Inimigo ${indice + 1}`,
      posicao: lerPosicao(
        linha.querySelector('[data-campo="coluna"]').value,
        linha.querySelector('[data-campo="linha"]').value,
      ),
    }));

    if (!inimigosInformados.length) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "nenhumInimigo",
      });
    }

    const erroPosicao = validarPosicoesBatalha(
      batalha.combate,
      [
        { nome: "Jogador", posicao: posicaoJogador },
        ...inimigosInformados,
      ],
    );

    if (erroPosicao) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "posicaoInvalida",
        mensagem: erroPosicao,
      });
    }

    const inimigosAgrupados = new Map();

    for (const inimigo of inimigosInformados) {
      const grupo = inimigosAgrupados.get(inimigo.npcId) ?? {
        npcId: inimigo.npcId,
        quantidade: 0,
        posicoes: [],
        inteligencia: { perfil: "equilibrado" },
        movimentoMaximo: 6,
      };

      grupo.quantidade += 1;
      grupo.posicoes.push(inimigo.posicao);
      inimigosAgrupados.set(inimigo.npcId, grupo);
    }

    const participanteJogador = criarParticipanteJogadorCombate({
      posicao: posicaoJogador,
      movimentoMaximo: batalha.combate.jogador?.movimentoMaximo ?? 6,
    });

    const participantesInimigos = criarParticipantesNpcsCombate(
      Array.from(inimigosAgrupados.values()),
    );

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = batalha.cenaId;
    cenaAtual = batalha.cena;

    iniciarCombateDaAventura({
      id: `dev-${batalha.cenaId}-${Date.now()}`,
      participantes: [participanteJogador, ...participantesInimigos],
      mapa: batalha.combate.mapa,
      introducao: {
        titulo: "Batalha de teste",
        descricao: `Mapa: ${batalha.cenaId}`,
      },
      objetivos: batalha.combate.objetivos,
      terreno: batalha.combate.terreno,
      visao: batalha.combate.visao,
      areas: batalha.combate.areas,
      marcadores: batalha.combate.marcadores,
    });

    introducaoCombateConfirmada = true;

    if (modalIntroducaoCombate.open) {
      modalIntroducaoCombate.close();
    }

    iniciarEtapaIniciativaCombate(estadoAtualJogo.combateAtual);

    return exibirResultado("Batalha personalizada", {
      sucesso: true,
      mapa: batalha.cenaId,
      posicaoJogador,
      inimigos: inimigosInformados,
    });
  }

  function criarConstrutorBatalha() {
    const area = document.createElement("fieldset");
    area.style.display = "grid";
    area.style.gap = "7px";
    area.style.margin = "10px 0 0";
    area.style.padding = "8px";
    area.style.border = "1px solid rgba(184, 138, 74, 0.55)";

    const legenda = document.createElement("legend");
    legenda.textContent = "Montar batalha";
    legenda.style.fontWeight = "700";

    seletorMapaBatalha = document.createElement("select");
    seletorMapaBatalha.style.width = "100%";
    seletorMapaBatalha.style.padding = "7px";

    for (const batalha of listarBatalhasDisponiveis()) {
      const opcao = document.createElement("option");
      opcao.value = batalha.cenaId;
      opcao.textContent = batalha.cena.titulo
        ? `${batalha.cena.titulo} (${batalha.cenaId})`
        : batalha.cenaId;
      seletorMapaBatalha.append(opcao);
    }

    const posicaoJogador = document.createElement("div");
    posicaoJogador.style.display = "flex";
    posicaoJogador.style.alignItems = "center";
    posicaoJogador.style.gap = "6px";

    const rotuloJogador = document.createElement("span");
    rotuloJogador.textContent = "Jogador — coluna / linha";
    rotuloJogador.style.flex = "1";

    colunaJogadorBatalha = criarCampoNumero(1);
    linhaJogadorBatalha = criarCampoNumero(1);
    posicaoJogador.append(
      rotuloJogador,
      colunaJogadorBatalha,
      linhaJogadorBatalha,
    );

    const cabecalhoInimigos = document.createElement("div");
    cabecalhoInimigos.style.display = "flex";
    cabecalhoInimigos.style.alignItems = "center";
    cabecalhoInimigos.style.justifyContent = "space-between";

    const rotuloInimigos = document.createElement("span");
    rotuloInimigos.textContent = "Inimigos — NPC / coluna / linha";

    const adicionar = criarBotao("+ Inimigo", () => adicionarInimigoBatalha());
    cabecalhoInimigos.append(rotuloInimigos, adicionar);

    listaInimigosBatalha = document.createElement("div");
    listaInimigosBatalha.style.display = "grid";
    listaInimigosBatalha.style.gap = "5px";

    seletorMapaBatalha.addEventListener(
      "change",
      carregarPosicoesOriginaisBatalha,
    );

    area.append(
      legenda,
      seletorMapaBatalha,
      posicaoJogador,
      cabecalhoInimigos,
      listaInimigosBatalha,
      criarBotao("Iniciar e rolar iniciativa", iniciarBatalhaPersonalizada),
    );

    carregarPosicoesOriginaisBatalha();

    return area;
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
    painel.style.width = "min(460px, calc(100vw - 24px))";
    painel.style.maxHeight = "85vh";
    painel.style.overflow = "auto";
    painel.style.padding = "10px";
    painel.style.border = "1px solid #b88a4a";
    painel.style.borderRadius = "8px";
    painel.style.background = "#211710";
    painel.style.color = "#f4ead2";
    painel.style.boxShadow = "0 5px 22px rgba(0, 0, 0, 0.55)";
    painel.style.font = "13px/1.4 system-ui, sans-serif";

    const titulo = document.createElement("summary");
    titulo.textContent = "Modo DEV — Aventura e IA";
    titulo.style.cursor = "pointer";
    titulo.style.fontWeight = "700";

    const instrucoes = document.createElement("p");
    instrucoes.textContent =
      "Use os cenários rápidos ou monte uma batalha escolhendo mapa, participantes e posições.";

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
      criarBotao("Testar adagas", async function testarAdagas() {
        const resultado = await window.testarDestinosAdagaDev?.();
        exibirResultado("Visuais da adaga", resultado ?? {
          sucesso: false,
          motivo: "testeIndisponivel",
        });
      }),
    );

    const areaEncerramento = document.createElement("div");
    areaEncerramento.style.display = "grid";
    areaEncerramento.style.gap = "6px";
    areaEncerramento.style.marginTop = "10px";

    const rotuloEncerramento = document.createElement("strong");
    rotuloEncerramento.textContent = "Encerramentos";

    seletorEncerramento = document.createElement("select");
    seletorEncerramento.style.width = "100%";
    seletorEncerramento.style.padding = "7px";

    obterVariacoesEncerramento().forEach(function adicionarOpcao(
      variacao,
      indice,
    ) {
      const opcao = document.createElement("option");
      opcao.value = String(indice);
      opcao.textContent = criarRotuloVariacaoEncerramento(
        variacao,
        indice,
      );
      seletorEncerramento.append(opcao);
    });

    areaEncerramento.append(
      rotuloEncerramento,
      seletorEncerramento,
      criarBotao("Abrir final selecionado", abrirEncerramentoSelecionado),
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

    painel.append(
      titulo,
      instrucoes,
      botoes,
      criarBotao("Montar batalha", function abrirMontadorBatalha() {
        window.MontadorBatalhaDev?.abrir();
      }),
      areaEncerramento,
      saidaPainel,
    );
    document.body.append(painel);

    if (
      new URLSearchParams(window.location.search).get("ferramenta") ===
      "montador-batalha"
    ) {
      window.MontadorBatalhaDev?.abrir();
    }
  }

  window.TestesDev = Object.freeze({
    abrirBatalhaRuasD,
    prepararCenario,
    adjacente: () => prepararCenario("adjacente"),
    distante: () => prepararCenario("distante"),
    ameacado: () => prepararCenario("ameacado"),
    semLinhaDeVisao: () => prepararCenario("semLinhaDeVisao"),
    abrirFinal: abrirEncerramentoAventura,
    finalVitoria: () => abrirPrimeiroEncerramentoDoTipo("vitoria"),
    finalDerrota: () => abrirPrimeiroEncerramentoDoTipo("derrota"),
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", criarPainel, { once: true });
  } else {
    criarPainel();
  }
})();
