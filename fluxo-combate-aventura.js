"use strict";

function receberResultadoRolagem(evento) {
  const resultadoRolagem = evento.detail;
  const combate = estadoAtualJogo.combateAtual;

  if (combate?.efeitoPendente) {
    resolverEfeitoPendente(resultadoRolagem);
    return;
  }

  if (combate?.iniciativaPendenteId) {
    resolverIniciativaJogador(resultadoRolagem);
    return;
  }

  if (combate?.ataquePendente) {
    resolverAtaqueJogador(resultadoRolagem);
    return;
  }

  if (combate?.danoPendente) {
    resolverDanoJogador(resultadoRolagem);
  }
}

function resolverEfeitoPendente(resultadoRolagem) {
  const combate = estadoAtualJogo.combateAtual;
  const operacao = combate?.efeitoPendente;

  if (!combate || !operacao) {
    return false;
  }

  if (operacao.tipo !== "curar") {
    console.warn("Operação de efeito ainda não implementada:", operacao.tipo);
    return false;
  }

  const participante = combate.participantes.find(
    (participanteAtual) => participanteAtual.id === operacao.participanteId,
  );

  if (!participante) {
    console.warn("Participante do efeito não encontrado:", operacao.participanteId);
    combate.efeitoPendente = null;
    return true;
  }

  const resultadoCura = SistemaCombate.aplicarCura(
    participante,
    resultadoRolagem.total,
  );

  if (!resultadoCura.sucesso) {
    console.warn("Não foi possível aplicar a cura:", resultadoCura.motivo);
    combate.efeitoPendente = null;
    return true;
  }

  combate.efeitoPendente = null;
  atualizarInterfaceTurno(combate);

  return true;
}

function solicitarRolagemNaCaixa(
  gruposDeDados,
  modificador,
  descricao,
  quantidadeDeRolagens = 1,
  critico = false,
) {
  if (typeof window.configurarRolagemSolicitada !== "function") {
    console.warn("A caixa de dados não está disponível.");
    return;
  }

  window.configurarRolagemSolicitada({
    gruposDeDados,
    modificador,
    descricao,
    quantidadeDeRolagens,
    critico,
  });
}

function processarTurnoAtual(combate) {
  atualizarInterfaceTurno(combate);

  if (combate.status !== "ativo") {
    return;
  }

  const participanteAtivo = combate.participantes.find(
    (participante) => participante.id === combate.participanteAtivoId,
  );

  if (!participanteAtivo) {
    return;
  }

  if (participanteAtivo.tipo === "jogador") {
    exibirAcaoAtualCombate(mensagensNarrativas.turno.jogador);
    return;
  }

  exibirAcaoAtualCombate(`${participanteAtivo.nome} está decidindo o que fazer.`);
  solicitacaoCombate.textContent = "";
  solicitacaoCombate.hidden = true;

  setTimeout(async function executarTurnoInimigo() {
    try {
      await esperar(800);

      const resultado = SistemaCombate.executarTurnoInimigo(combate);

      await registrarResultadoTurnoInimigo(resultado, participanteAtivo);
      atualizarInterfaceTurno(combate);
    } catch (erro) {
      exibirAcaoAtualCombate(
        mensagensNarrativas.turno.erroInimigo(participanteAtivo.nome),
      );

      await esperar(1200);
    }

    if (combate.status !== "ativo") {
      notificarFimCombate(combate);
      return;
    }

    if (combate.participanteAtivoId !== participanteAtivo.id) {
      return;
    }

    SistemaCombate.encerrarTurno(combate);
    processarTurnoAtual(combate);
  }, 1000);
}

function encerrarTurnoAtual() {
  const combate = estadoAtualJogo.combateAtual;

  if (!combate || combate.status !== "ativo") {
    return;
  }

  const participanteAtivo = combate.participantes.find(
    (participante) => participante.id === combate.participanteAtivoId,
  );

  if (!participanteAtivo || participanteAtivo.tipo !== "jogador") {
    return;
  }

  SistemaCombate.encerrarTurno(combate);
  processarTurnoAtual(combate);
}

function notificarFimCombate(combate) {
  if (combate.status === "ativo" || combate.resultadoNotificado) {
    return;
  }

  combate.resultadoNotificado = true;
  botaoEncerrarTurno.disabled = true;
  acoesCombate.innerHTML = "";

  solicitacaoCombate.textContent =
    combate.status === "vitoria"
      ? "Combate encerrado: vitória."
      : "Combate encerrado: derrota.";

  solicitacaoCombate.hidden = false;

  document.dispatchEvent(
    new CustomEvent("combateEncerrado", {
      detail: {
        combateId: combate.id,
        resultado: combate.status,
        combate,
      },
    }),
  );
}

function processarResultadoCombate(evento) {
  const idResultado = evento.detail?.resultado;
  const resultado = cenaAtual.combate?.resultados?.[idResultado];

  if (!resultado) {
    console.warn("Consequência de combate não encontrada:", idResultado);
    return;
  }

  setTimeout(function exibirResultadoCombate() {
    exibirTelaAventura();
    exibirContexto(resultado.contexto);
    ocultarEscolhas();
  }, 1200);
}

function verificarCombateDaCena(cena) {
  if (!cena.combate || estadoAtualJogo.combateAtual?.status === "ativo") {
    return;
  }

  const participanteJogador = criarParticipanteJogadorCombate(
    cena.combate.jogador,
  );

  if (!participanteJogador) {
    return;
  }

  const participantesInimigos = criarParticipantesNpcsCombate(
    cena.combate.inimigos,
  );

  iniciarCombateDaAventura({
    id: `${aventuraAtual.id}-${estadoAtualJogo.progresso.cenaId}`,
    participantes: [participanteJogador, ...participantesInimigos],
    mapa: cena.combate.mapa,
  });
}
