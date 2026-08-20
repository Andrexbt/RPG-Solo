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

function persistirPersonagemAposCombate(
  combate,
) {
  const personagemAtual =
    estadoAtualJogo
      .personagem
      .dados;

  if (!personagemAtual?.id) {
    return {
      sucesso: false,
      motivo: "personagemInvalido",
    };
  }

  const participanteJogador =
    combate
      ?.participantes
      ?.find(
        function (participante) {
          return (
            participante.tipo ===
            "jogador"
          );
        },
      );

  if (!participanteJogador) {
    return {
      sucesso: false,
      motivo:
        "participanteJogadorNaoEncontrado",
    };
  }

  const personagemAtualizado =
    structuredClone(
      personagemAtual,
    );

  if (
    !personagemAtualizado.combate ||
    typeof personagemAtualizado.combate !==
      "object"
  ) {
    personagemAtualizado.combate = {};
  }

  personagemAtualizado
    .combate
    .pontosDeVida =
      structuredClone(
        participanteJogador
          .pontosDeVida,
      );

  if (
    participanteJogador
      .habilidades
      ?.recursos
  ) {
    if (
      !personagemAtualizado
        .habilidades ||
      typeof personagemAtualizado
        .habilidades !== "object"
    ) {
      personagemAtualizado
        .habilidades = {};
    }

    personagemAtualizado
      .habilidades
      .recursos =
        structuredClone(
          participanteJogador
            .habilidades
            .recursos,
        );
  }

  const personagemSalvo =
    window.PersonagemDados
      .atualizarSalvo(
        personagemAtualizado,
      );

  if (!personagemSalvo) {
    return {
      sucesso: false,
      motivo: "falhaAoPersistir",
    };
  }

  estadoAtualJogo
    .personagem
    .dados =
      personagemSalvo;

  const resultado = {
    sucesso: true,
    motivo: null,

    personagem:
      personagemSalvo,

    pontosDeVida:
      structuredClone(
        personagemSalvo
          .combate
          .pontosDeVida,
      ),

    recursos:
      structuredClone(
        personagemSalvo
          .habilidades
          ?.recursos
          ?? {},
      ),
  };

  combate.persistenciaPersonagem =
    {
      sucesso: true,

      pontosDeVida:
        structuredClone(
          resultado.pontosDeVida,
        ),

      recursos:
        structuredClone(
          resultado.recursos,
        ),
    };

  return resultado;
}

function concederXpDaVitoria(
  combate,
) {
  const personagem =
    estadoAtualJogo
      .personagem
      .dados;

  const xpEncontro =
    Number(
      combate
        ?.encontro
        ?.avaliacao
        ?.xpTotal,
    );

  if (!personagem?.id) {
    return {
      sucesso: false,
      concedida: false,
      motivo: "personagemInvalido",
    };
  }

  if (
    !Number.isInteger(xpEncontro) ||
    xpEncontro <= 0
  ) {
    return {
      sucesso: false,
      concedida: false,
      motivo: "xpEncontroInvalido",
    };
  }

  const recompensaId =
    `combate:${combate.id}:vitoria:xp`;

  const resultadoXp =
    window.SistemaProgressao
      .concederXp(
        personagem,
        {
          id: recompensaId,
          tipo: "xp",
          quantidade: xpEncontro,

          origem: {
            tipo: "combate",
            aventuraId:
              aventuraAtual.id,

            cenaId:
              estadoAtualJogo
                .progresso
                .cenaId,

            combateId:
              combate.id,

            resultado:
              "vitoria",
          },
        },
      );

  if (
    resultadoXp.sucesso &&
    resultadoXp.personagem
  ) {
    estadoAtualJogo
      .personagem
      .dados =
        resultadoXp.personagem;
  }

  combate.recompensaXp = {
    id: recompensaId,
    sucesso:
      resultadoXp.sucesso,

    concedida:
      resultadoXp.concedida,

    motivo:
      resultadoXp.motivo,

    quantidade:
      xpEncontro,

    xpAnterior:
      resultadoXp.xpAnterior,

    xpAtual:
      resultadoXp.xpAtual,

    novoNivelDisponivel:
      resultadoXp
        .novoNivelDisponivel
        ?? false,

    nivelAtualPorXp:
      resultadoXp
        .nivelAtualPorXp
        ?? null,
  };

  return resultadoXp;
}

function consolidarResultadoCombate({
  combate,
  resultadoId,
  consequencia,
}) {
  if (!combate || !resultadoId || !consequencia) {
    return {
      sucesso: false,
      motivo: "dadosResultadoInvalidos",
      deveAplicarConsequencia: false,
    };
  }

  const consolidacaoExistente =
    combate.consolidacaoResultado;

  if (consolidacaoExistente?.concluida) {
    return {
      sucesso: true,
      motivo: "resultadoJaConsolidado",
      repetida: true,
      deveAplicarConsequencia: false,
      consolidacao:
        structuredClone(
          consolidacaoExistente
        ),
    };
  }

  if (consolidacaoExistente?.emAndamento) {
    return {
      sucesso: false,
      motivo: "resultadoEmAndamento",
      repetida: true,
      deveAplicarConsequencia: false,
    };
  }

  combate.consolidacaoResultado = {
    emAndamento: true,
    concluida: false,
    resultadoId,
  };

  const contexto = Array.isArray(
    consequencia.contexto
  )
    ? [...consequencia.contexto]
    : consequencia.contexto
      ? [consequencia.contexto]
      : [];

  const persistencia =
    persistirPersonagemAposCombate(
      combate
    );

  if (!persistencia.sucesso) {
    contexto.push(
      mensagensNarrativas
        .progressao
        .erroAoSalvarCombate
    );

    combate.consolidacaoResultado = {
      emAndamento: false,
      concluida: false,
      resultadoId,
      sucesso: false,
      motivo: persistencia.motivo,
    };

    return {
      sucesso: false,
      motivo: persistencia.motivo,
      deveAplicarConsequencia: false,
      contexto,
    };
  }

  let resultadoXp = null;

  if (resultadoId === "vitoria") {
    resultadoXp =
      concederXpDaVitoria(
        combate
      );

    if (!resultadoXp.sucesso) {
      contexto.push(
        mensagensNarrativas
          .progressao
          .erroAoConcederXp
      );
    } else if (resultadoXp.concedida) {
      contexto.push(
        mensagensNarrativas
          .progressao
          .xpRecebido(
            resultadoXp
              .recompensa
              .quantidade,

            resultadoXp.xpAtual
          )
      );

      if (
        resultadoXp.novoNivelDisponivel
      ) {
        contexto.push(
          mensagensNarrativas
            .progressao
            .novoNivelDisponivel(
              resultadoXp
                .nivelAtualPorXp
            )
        );
      }
    }
  }

  document.dispatchEvent(
    new CustomEvent(
      "personagemAtualizado",
      {
        detail: {
          personagem:
            estadoAtualJogo
              .personagem
              .dados,
        },
      }
    )
  );

  const consequenciaFinal = {
    ...consequencia,
    contexto,
  };

  combate.consolidacaoResultado = {
    emAndamento: false,
    concluida: true,
    sucesso: true,
    resultadoId,

    persistencia: {
      sucesso:
        persistencia.sucesso,

      pontosDeVida:
        structuredClone(
          persistencia.pontosDeVida
        ),

      recursos:
        structuredClone(
          persistencia.recursos
        ),
    },

    xp: resultadoXp
      ? {
          sucesso:
            resultadoXp.sucesso,

          concedida:
            resultadoXp.concedida,

          quantidade:
            resultadoXp
              .recompensa
              ?.quantidade
              ?? 0,

          xpAtual:
            resultadoXp.xpAtual
              ?? null,

                        novoNivelDisponivel:
            resultadoXp
              .novoNivelDisponivel
              ?? false,

          nivelAtualPorXp:
            resultadoXp
              .nivelAtualPorXp
              ?? null,
        }
      : null,
  };

  return {
    sucesso: true,
    motivo: null,
    repetida: false,
    deveAplicarConsequencia: true,
    consequencia: consequenciaFinal,

    consolidacao:
      structuredClone(
        combate.consolidacaoResultado
      ),
  };
}

let resultadoCombatePendente = null;

function obterTextoTelaResultado(
  resultadoId,
  consequencia
) {
  const textoConfigurado =
    consequencia.tela?.texto;

  if (
    typeof textoConfigurado === "string" &&
    textoConfigurado.trim() !== ""
  ) {
    return textoConfigurado;
  }

  if (resultadoId === "vitoria") {
    return "Seus adversários foram derrotados. O caminho está livre para continuar.";
  }

  return "Você não conseguiu superar seus adversários. Sua história, porém, ainda não terminou.";
}

function exibirTelaResultadoCombate({
  resultadoId,
  resultado,
  consequencia,
  combate,
}) {
  const vitoria =
    resultadoId === "vitoria";

  const configuracaoTela =
    consequencia.tela ?? {};

  rotuloResultadoCombate.textContent =
    configuracaoTela.rotulo ??
    "Combate encerrado";

  tituloResultadoCombate.textContent =
    configuracaoTela.titulo ??
    (vitoria ? "Vitória" : "Derrota");

  textoResultadoCombate.textContent =
    obterTextoTelaResultado(
      resultadoId,
      consequencia
    );

  telaResultadoCombate.dataset.resultado =
    resultadoId;

  const xp =
    resultado.consolidacao?.xp;

  const recebeuXp =
    vitoria &&
    xp?.sucesso &&
    xp?.concedida;

  recompensasResultadoCombate.hidden =
    !recebeuXp;

  if (recebeuXp) {
    xpRecebidoResultadoCombate.textContent =
      `+${xp.quantidade} XP`;

    xpAtualResultadoCombate.textContent =
      xp.novoNivelDisponivel
        ? `Total: ${xp.xpAtual} XP — novo nível disponível`
        : `Total: ${xp.xpAtual} XP`;
  }

  resultadoCombatePendente = {
    combate,
    consequencia:
      resultado.consequencia,
  };

  telaResultadoCombate.hidden = false;
  botaoContinuarResultadoCombate.focus();
}

async function continuarAposResultadoCombate() {
  if (!resultadoCombatePendente) {
    return;
  }

  const {
    combate,
    consequencia,
  } = resultadoCombatePendente;

  resultadoCombatePendente = null;
  telaResultadoCombate.hidden = true;

  exibirTelaAventura();
  ocultarEscolhas();

  await window.MotorAventura
    .aplicarConsequencia(
      consequencia
    );

  combate.resultadoProcessado = true;
}

function processarResultadoCombate(
  evento
) {
  const resultadoId =
    evento.detail?.resultado;

  const combate =
    evento.detail?.combate;

  const consequencia =
    cenaAtual
      .combate
      ?.resultados
      ?.[resultadoId];

  if (!consequencia) {
    console.warn(
      "Consequência de combate não encontrada:",
      resultadoId
    );

    return;
  }

  const resultado =
    consolidarResultadoCombate({
      combate,
      resultadoId,
      consequencia,
    });

  if (!resultado.sucesso) {
    if (
      resultado.motivo !==
      "resultadoEmAndamento"
    ) {
      console.error(
        "Não foi possível consolidar o resultado do combate:",
        resultado
      );
    }

    return;
  }

  if (
    !resultado.deveAplicarConsequencia
  ) {
    return;
  }

    exibirTelaResultadoCombate({
    resultadoId,
    resultado,
    consequencia,
    combate,
  });
}

function verificarCombateDaCena(cena) {
  if (!cena.combate || estadoAtualJogo.combateAtual?.status === "ativo") {
    return;
  }

    const nivelPersonagem =
    Number(
      estadoAtualJogo
        .personagem
        .dados
        ?.nivel,
    ) || 1;

  const avaliacaoEncontro =
    window.SistemaEncontros
      ?.avaliarEncontro({
        inimigos:
          cena.combate.inimigos,

        catalogoNpcs:
          estadoAtualJogo.npcs,

        nivelPersonagem,

        quantidadePersonagens: 1,
      });

  if (!avaliacaoEncontro) {
    console.error(
      "Não foi possível avaliar o encontro.",
    );

    return;
  }

  if (avaliacaoEncontro.erros.length > 0) {
    console.error(
      "A configuração do encontro possui erros:",
      avaliacaoEncontro.erros,
    );

    return;
  }

  const dificuldadePretendida =
    cena.combate
      .dificuldadePretendida
      ?? null;

  const dificuldadeCalculada =
    avaliacaoEncontro
      .dificuldade
      ?.categoria
      ?? null;

  if (!dificuldadePretendida) {
    console.warn(
      "A batalha não declara uma dificuldade pretendida.",
    );
  } else if (
    dificuldadePretendida !==
    dificuldadeCalculada
  ) {
    console.warn(
      "A dificuldade calculada não corresponde à pretendida:",
      {
        pretendida:
          dificuldadePretendida,

        calculada:
          dificuldadeCalculada,

        xpTotal:
          avaliacaoEncontro.xpTotal,
      },
    );
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

    encontro: {
      dificuldadePretendida,
      avaliacao: avaliacaoEncontro,
    },
  });
}
