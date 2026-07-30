"use strict";

function buscarEfeitoPorId(efeitoId) {
  const efeitoEncontrado = bancoEfeitos[efeitoId];

  if (!efeitoEncontrado) {
    return {
      sucesso: false,
      motivo: "efeitoNaoEncontrado",
      efeito: null
    };
  }

  return {
    sucesso: true,
    motivo: null,
    efeito: efeitoEncontrado
  };
}

function buscarEfeitosPorGatilho(efeitosIds, gatilho) {
  const efeitosEncontrados = [];

  for (const efeitoId of efeitosIds) {
    const resultadoBusca =
      buscarEfeitoPorId(efeitoId);

    if (!resultadoBusca.sucesso) {
      continue;
    }

    const efeito =
      resultadoBusca.efeito;

    if (efeito.gatilho !== gatilho) {
      continue;
    }

    efeitosEncontrados.push(
      efeito
    );
  }

  return efeitosEncontrados;
}

function efeitoEstaDisponivel(
  participante,
  efeito
) {
  if (!efeito.usos) {
    return true;
  }

  const estadoEfeito =
    participante
      .estadoEfeitos
      ?.[efeito.id];

  if (!estadoEfeito) {
    return false;
  }

  return (
    estadoEfeito.usosRestantes >
    0
  );
}

function buscarEfeitosDoParticipante(
  participante,
  gatilho
) {
  const talentos =
    participante.talentos ?? [];

  const efeitos =
    buscarEfeitosPorGatilho(
      talentos,
      gatilho
    );

  return efeitos.filter(
    efeito =>
      efeitoEstaDisponivel(
        participante,
        efeito
      )
  );
}

function prepararOperacaoEfeito(
  efeito,
  contexto
) {
  if (!efeito) {
    return {
      sucesso: false,
      motivo: "efeitoInexistente"
    };
  }

  if (!efeito.operacao) {
    return {
      sucesso: false,
      motivo: "operacaoInexistente"
    };
  }

  if (
    efeito.operacao.tipo ===
    "rolarNovamente"
  ) {
    return {
      sucesso: true,
      tipo: "rolarNovamente",

      efeitoId:
        efeito.id,

      participanteId:
        contexto.participanteId,

      rolagemAfetada:
        efeito.operacao
          .rolagemAfetada,

      quantidadeDeRolagens:
        efeito.operacao
          .quantidadeDeRolagens,

      criterioDeEscolha:
        efeito.operacao
          .criterioDeEscolha
    };
  }

  return {
    sucesso: false,
    motivo: "operacaoNaoImplementada"
  };
}

function prepararEfeitosPorGatilho(
  participante,
  gatilho
) {
  const efeitos =
    buscarEfeitosDoParticipante(
      participante,
      gatilho
    );

  const operacoesPreparadas =
    [];

  for (const efeito of efeitos) {
    const resultado =
      prepararOperacaoEfeito(
        efeito,
        {
          participanteId:
            participante.id
        }
      );

    if (!resultado.sucesso) {
      continue;
    }

    operacoesPreparadas.push(
      resultado
    );
  }

  return operacoesPreparadas;
}

function criarEstadoEfeitos(
  participante
) {
  const estadoEfeitos = {};

  const talentos =
    participante.talentos ?? [];

  for (const talentoId of talentos) {
    const resultadoBusca =
      buscarEfeitoPorId(
        talentoId
      );

    if (!resultadoBusca.sucesso) {
      continue;
    }

    const efeito =
      resultadoBusca.efeito;

    estadoEfeitos[efeito.id] = {
      usosRestantes:
        efeito.usos
          ?.quantidade ??
        null,

      recarga:
        efeito.usos
          ?.recarga ??
        null
    };
  }

  return estadoEfeitos;
}

function consumirUsoEfeito(
  participante,
  efeitoId
) {
  const resultadoBusca =
    buscarEfeitoPorId(
      efeitoId
    );

  if (!resultadoBusca.sucesso) {
    return {
      sucesso: false,
      motivo: "efeitoNaoEncontrado"
    };
  }

  const efeito =
    resultadoBusca.efeito;

  if (!efeito.usos) {
    return {
      sucesso: true,
      motivo: null,
      usoConsumido: false
    };
  }

  const estadoEfeito =
    participante
      .estadoEfeitos
      ?.[efeitoId];

  if (!estadoEfeito) {
    return {
      sucesso: false,
      motivo: "estadoEfeitoNaoEncontrado"
    };
  }

  if (
    estadoEfeito.usosRestantes <=
    0
  ) {
    return {
      sucesso: false,
      motivo: "efeitoSemUsos"
    };
  }

  estadoEfeito.usosRestantes -=
    1;

  return {
    sucesso: true,
    motivo: null,
    usoConsumido: true,

    usosRestantes:
      estadoEfeito.usosRestantes
  };
}

function recarregarEfeitos(
  participante,
  tipoRecarga
) {
  const estadoEfeitos =
    participante.estadoEfeitos ??
    {};

  const efeitosRecarregados =
    [];

  for (
    const efeitoId in
    estadoEfeitos
  ) {
    const resultadoBusca =
      buscarEfeitoPorId(
        efeitoId
      );

    if (!resultadoBusca.sucesso) {
      continue;
    }

    const efeito =
      resultadoBusca.efeito;

    if (
      efeito.usos?.recarga !==
      tipoRecarga
    ) {
      continue;
    }

    estadoEfeitos[
      efeitoId
    ].usosRestantes =
      efeito.usos.quantidade;

    efeitosRecarregados.push(
      efeitoId
    );
  }

  return {
    sucesso: true,

    efeitosRecarregados:
      efeitosRecarregados
  };
}