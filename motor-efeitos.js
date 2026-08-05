"use strict";

function resolverModificadorEfeito(
  modificador,
  participante,
) {
  if (
    typeof modificador ===
    "number"
  ) {
    return modificador;
  }

  if (
    modificador === undefined ||
    modificador === null
  ) {
    return 0;
  }

  if (
    modificador.tipo ===
    "nivelClasse"
  ) {
    return window
      .PersonagemDados
      .obterNivelClasse(
        participante,
        modificador.classeId,
      );
  }

  return 0;
}

function prepararOperacaoGenerica(
  efeito,
  contexto = {},
) {
  if (!efeito) {
    return {
      sucesso: false,
      motivo: "efeitoInexistente",
    };
  }

  if (!efeito.tipo) {
    return {
      sucesso: false,
      motivo: "tipoEfeitoInexistente",
    };
  }

  if (
    efeito.tipo ===
    "rolarNovamente"
  ) {
    return {
      sucesso: true,

      tipo:
        "rolarNovamente",

      participanteId:
        contexto
          ?.participante
          ?.id ??
        contexto
          ?.participanteId ??
        null,

      rolagemAfetada:
        efeito.rolagemAfetada,

      quantidadeDeRolagens:
        efeito.quantidadeDeRolagens,

      criterioDeEscolha:
        efeito.criterioDeEscolha,
    };
  }

  if (
    efeito.tipo ===
    "curar"
  ) {
    const rolagem =
      structuredClone(
        efeito.rolagem,
      );

    if (!rolagem) {
      return {
        sucesso: false,
        motivo:
          "rolagemInexistente",
      };
    }

    rolagem.modificador =
      resolverModificadorEfeito(
        rolagem.modificador,
        contexto.participante,
      );

    return {
      sucesso: true,

      tipo: "curar",

      participanteId:
        contexto
          ?.participante
          ?.id ??
        null,

      rolagem,
    };
  }

  if (
  efeito.tipo ===
  "concederVantagem"
) {
  return {
    sucesso: true,

    tipo:
      "concederVantagem",

    participanteId:
      contexto
        ?.participante
        ?.id ??
      null,

    alvoId:
      contexto
        ?.alvo
        ?.id ??
      null,

    rolagemAfetada:
      efeito.rolagemAfetada,

    alvo:
      efeito.alvo,

    quantidadeDeUsos:
      efeito.quantidadeDeUsos ??
      1,

    expiracao:
      efeito.expiracao ??
      null,
  };
}

  return {
    sucesso: false,
    motivo:
      "efeitoGenericoNaoImplementado",
  };
}

function ativarEfeitoPendente(
  participante,
  contextoPendente,
  efeitoId,
) {
  if (!contextoPendente) {
    return {
      sucesso: false,
      motivo:
        "contextoPendenteInexistente",
    };
  }

  const operacao =
    contextoPendente
      .efeitos
      ?.find(
        function encontrarOperacao(
          efeito,
        ) {
          return (
            efeito
              ?.origem
              ?.id ===
            efeitoId
          );
        },
      );

  if (!operacao) {
    return {
      sucesso: false,
      motivo:
        "efeitoIndisponivel",
    };
  }

  const resultadoConsumo =
    window.TradutorRegras
      .consumirUsoRegra(
        participante,
        operacao,
      );

  if (!resultadoConsumo.sucesso) {
    return resultadoConsumo;
  }

  contextoPendente.efeitoAtivo =
    structuredClone(
      operacao,
    );

  contextoPendente.rolagensEfeito =
    [];

  return {
    sucesso: true,
    motivo: null,

    efeitoAtivo:
      contextoPendente.efeitoAtivo,

    usosRestantes:
      resultadoConsumo
        .usosRestantes,
  };
}

function registrarRolagemEfeito(
  contextoPendente,
  resultadoRolagem,
) {
  const efeitoAtivo =
    contextoPendente
      ?.efeitoAtivo;

  if (!efeitoAtivo) {
    return {
      sucesso: false,
      motivo:
        "nenhumEfeitoAtivo",
    };
  }

  const rolagens =
    contextoPendente
      .rolagensEfeito;

  if (!Array.isArray(rolagens)) {
    return {
      sucesso: false,
      motivo:
        "listaRolagensInexistente",
    };
  }

  const quantidadeNecessaria =
    efeitoAtivo
      .quantidadeDeRolagens;

  const criterioDeEscolha =
    efeitoAtivo
      .criterioDeEscolha ??
    "primeiroResultado";

  if (
    rolagens.length >=
    quantidadeNecessaria
  ) {
    return {
      sucesso: false,
      motivo:
        "rolagensJaCompletas",
    };
  }

  rolagens.push(
    structuredClone(
      resultadoRolagem,
    ),
  );

  const concluida =
    rolagens.length >=
    quantidadeNecessaria;

  return {
    sucesso: true,
    motivo: null,

    quantidadeRegistrada:
      rolagens.length,

    quantidadeNecessaria:
      quantidadeNecessaria,

    concluida:
      concluida,

    criterioDeEscolha:
      criterioDeEscolha,

    exigeEscolhaDoJogador:
      concluida &&
      criterioDeEscolha ===
        "escolhaDoJogador",

    rolagens:
      rolagens,
  };
}

function finalizarEfeitoPendente(
  contextoPendente,
) {
  if (!contextoPendente) {
    return {
      sucesso: false,
      motivo:
        "contextoPendenteInexistente",
    };
  }

  const efeitoAtivo =
    contextoPendente
      .efeitoAtivo;

  if (!efeitoAtivo) {
    return {
      sucesso: false,
      motivo:
        "nenhumEfeitoAtivo",
    };
  }

  const efeitoFinalizado =
    structuredClone(
      efeitoAtivo,
    );

  const rolagensRegistradas =
    Array.isArray(
      contextoPendente
        .rolagensEfeito,
    )
      ? structuredClone(
          contextoPendente
            .rolagensEfeito,
        )
      : [];

  contextoPendente.efeitoAtivo =
    null;

  contextoPendente.rolagensEfeito =
    [];

  return {
    sucesso: true,
    motivo: null,

    efeitoFinalizado:
      efeitoFinalizado,

    rolagensRegistradas:
      rolagensRegistradas,
  };
}

window.MotorEfeitos = {
  prepararOperacaoGenerica,
};