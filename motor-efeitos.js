"use strict";

function buscarEfeitoPorId(efeitoId) {
  const efeitoEncontrado = bancoEfeitos[efeitoId];

  if (!efeitoEncontrado) {
    return {
      sucesso: false,
      motivo: "efeitoNaoEncontrado",
      efeito: null,
    };
  }

  return {
    sucesso: true,
    motivo: null,
    efeito: efeitoEncontrado,
  };
}

function resolverModificadorEfeito(
  modificador,
  participante
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
        modificador.classeId
      );
  }

  return 0;
}

function buscarEfeitosPorGatilho(efeitosIds, gatilho) {
  const efeitosEncontrados = [];

  for (const efeitoId of efeitosIds) {
    const resultadoBusca = buscarEfeitoPorId(efeitoId);

    if (!resultadoBusca.sucesso) {
      continue;
    }

    const efeito = resultadoBusca.efeito;

    if (efeito.gatilho !== gatilho) {
      continue;
    }

    efeitosEncontrados.push(efeito);
  }

  return efeitosEncontrados;
}

function obterRecursoDoEfeito(
  participante,
  efeito
) {
  if (
    efeito.recurso?.tipo ===
    "habilidade"
  ) {
    return participante
      .habilidades
      ?.recursos
      ?.[efeito.recurso.id] ??
      null;
  }

  return null;
}

function efeitoEstaDisponivel(
  participante,
  efeito
) {
  const recurso =
    obterRecursoDoEfeito(
      participante,
      efeito
    );

    if (
  efeito.recurso !== undefined &&
  recurso === null
) {
  return false;
}

  if (recurso !== null) {
    return recurso.usosAtuais > 0;
  }

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

  return estadoEfeito.usosRestantes > 0;
}

function custoEfeitoEstaDisponivel(
  participante,
  efeito
) {
  if (
    efeito.custo === undefined ||
    efeito.custo === null
  ) {
    return true;
  }

  if (
    efeito.custo ===
    "acao"
  ) {
    return participante
      .acaoDisponivel ===
      true;
  }

  if (
    efeito.custo ===
    "acaoBonus"
  ) {
    return participante
      .acaoBonusDisponivel ===
      true;
  }

  if (
    efeito.custo ===
    "reacao"
  ) {
    return participante
      .reacaoDisponivel ===
      true;
  }

  return false;
}

function consumirCustoEfeito(
  participante,
  efeito
) {
  if (
    efeito.custo === undefined ||
    efeito.custo === null
  ) {
    return {
      sucesso:
        true,

      custoConsumido:
        false
    };
  }

  if (
    !custoEfeitoEstaDisponivel(
      participante,
      efeito
    )
  ) {
    return {
      sucesso:
        false,

      motivo:
        "custoIndisponivel",

      custoConsumido:
        false
    };
  }

  let custoConsumido =
    false;

  if (
    efeito.custo ===
    "acao"
  ) {
    custoConsumido =
      window
        .SistemaCombate
        .consumirAcao(
          participante
        );
  }

  if (
    efeito.custo ===
    "acaoBonus"
  ) {
    custoConsumido =
      window
        .SistemaCombate
        .consumirAcaoBonus(
          participante
        );
  }

  if (
    efeito.custo ===
    "reacao"
  ) {
    custoConsumido =
      window
        .SistemaCombate
        .consumirReacao(
          participante
        );
  }

  return {
    sucesso:
      custoConsumido,

    motivo:
      custoConsumido
        ? null
        : "falhaAoConsumirCusto",

    custoConsumido:
      custoConsumido
  };
}

function buscarIdsEfeitosDasHabilidades(
  participante
) {
  const classeId =
    participante.classeId;

  if (!classeId) {
    return [];
  }

  const progressaoClasse =
    window.bancoHabilidades
      ?.progressaoClasses
      ?.[classeId]
      ?.nivel1;

  if (!progressaoClasse) {
    return [];
  }

  const habilidadesAutomaticas =
    progressaoClasse
      .classFeaturesAutomaticas ?? [];

  const efeitosEncontrados = [];

  for (
    const idHabilidade of
    habilidadesAutomaticas
  ) {
    const habilidade =
      window.bancoHabilidades
        ?.classFeatures
        ?.[idHabilidade];

    if (!habilidade) {
      continue;
    }

    const efeitosDaHabilidade =
      habilidade.efeitos ?? [];

    for (
      const idEfeito of
      efeitosDaHabilidade
    ) {
      if (
        efeitosEncontrados.includes(
          idEfeito
        )
      ) {
        continue;
      }

      efeitosEncontrados.push(
        idEfeito
      );
    }
  }

  return efeitosEncontrados;
}

function buscarIdsEfeitosDoParticipante(
  participante
) {
  const efeitosEncontrados = [];

  const efeitosDosTalentos =
    participante.talentos ?? [];

  const efeitosDasHabilidades =
    buscarIdsEfeitosDasHabilidades(
      participante
    );

  const gruposDeEfeitos = [
    efeitosDosTalentos,
    efeitosDasHabilidades
  ];

  for (
    const grupoDeEfeitos of
    gruposDeEfeitos
  ) {
    for (
      const idEfeito of
      grupoDeEfeitos
    ) {
      if (
        efeitosEncontrados.includes(
          idEfeito
        )
      ) {
        continue;
      }

      efeitosEncontrados.push(
        idEfeito
      );
    }
  }

  return efeitosEncontrados;
}

function buscarEfeitosDoParticipante(
  participante,
  gatilho
) {
  const efeitosIds =
    buscarIdsEfeitosDoParticipante(
      participante
    );

  const efeitos =
    buscarEfeitosPorGatilho(
      efeitosIds,
      gatilho
    );

  return efeitos.filter(
  function filtrarEfeito(
    efeito
  ) {
    return (
      efeitoEstaDisponivel(
        participante,
        efeito
      ) &&
      custoEfeitoEstaDisponivel(
        participante,
        efeito
      )
    );
  }
);
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

      alvo:
        efeito.alvo,

      rolagem,
    };
  }

  return {
    sucesso: false,
    motivo:
      "efeitoGenericoNaoImplementado",
  };
}

function prepararOperacaoEfeito(efeito, contexto) {
  if (!efeito) {
    return {
      sucesso: false,
      motivo: "efeitoInexistente",
    };
  }

  if (!efeito.operacao) {
    return {
      sucesso: false,
      motivo: "operacaoInexistente",
    };
  }

  const operacao =
  prepararOperacaoGenerica(
    efeito.operacao,
    contexto,
  );

if (!operacao.sucesso) {
  return operacao;
}

return {
  ...operacao,

  efeitoId:
    efeito.id,

  custo:
    efeito.custo,

  recurso:
    structuredClone(
      efeito.recurso ?? null,
    ),
};
}

function prepararEfeitosPorGatilho(participante, gatilho) {
  const efeitos = buscarEfeitosDoParticipante(participante, gatilho);

  const operacoesPreparadas = [];

  for (const efeito of efeitos) {
    const resultado =
  prepararOperacaoEfeito(
    efeito,
    {
      participante:
        participante
    }
  );

    if (!resultado.sucesso) {
      continue;
    }

    operacoesPreparadas.push(resultado);
  }

  return operacoesPreparadas;
}

function criarEstadoEfeitos(participante) {
  const estadoEfeitos = {};

  const talentos = participante.talentos ?? [];

  for (const talentoId of talentos) {
    const resultadoBusca = buscarEfeitoPorId(talentoId);

    if (!resultadoBusca.sucesso) {
      continue;
    }

    const efeito = resultadoBusca.efeito;

    estadoEfeitos[efeito.id] = {
      usosRestantes: efeito.usos?.quantidade ?? null,

      recarga: efeito.usos?.recarga ?? null,
    };
  }

  return estadoEfeitos;
}

function consumirUsoEfeito(participante, efeitoId) {
  const resultadoBusca = buscarEfeitoPorId(efeitoId);

  if (!resultadoBusca.sucesso) {
    return {
      sucesso: false,
      motivo: "efeitoNaoEncontrado",
    };
  }

  const efeito = resultadoBusca.efeito;

  const recurso =
  obterRecursoDoEfeito(
    participante,
    efeito
  );

if (recurso !== null) {
  if (recurso.usosAtuais <= 0) {
    return {
      sucesso:
        false,

      motivo:
        "recursoSemUsos"
    };
  }

  recurso.usosAtuais -=
    1;

  return {
    sucesso:
      true,

    motivo:
      null,

    usoConsumido:
      true,

    usosRestantes:
      recurso.usosAtuais
  };
}

  if (!efeito.usos) {
    return {
      sucesso: true,
      motivo: null,
      usoConsumido: false,
    };
  }

  const estadoEfeito = participante.estadoEfeitos?.[efeitoId];

  if (!estadoEfeito) {
    return {
      sucesso: false,
      motivo: "estadoEfeitoNaoEncontrado",
    };
  }

  if (estadoEfeito.usosRestantes <= 0) {
    return {
      sucesso: false,
      motivo: "efeitoSemUsos",
    };
  }

  estadoEfeito.usosRestantes -= 1;

  return {
    sucesso: true,
    motivo: null,
    usoConsumido: true,

    usosRestantes: estadoEfeito.usosRestantes,
  };
}

function recarregarEfeitos(participante, tipoRecarga) {
  const estadoEfeitos = participante.estadoEfeitos ?? {};

  const efeitosRecarregados = [];

  for (const efeitoId in estadoEfeitos) {
    const resultadoBusca = buscarEfeitoPorId(efeitoId);

    if (!resultadoBusca.sucesso) {
      continue;
    }

    const efeito = resultadoBusca.efeito;

    if (efeito.usos?.recarga !== tipoRecarga) {
      continue;
    }

    estadoEfeitos[efeitoId].usosRestantes = efeito.usos.quantidade;

    efeitosRecarregados.push(efeitoId);
  }

  return {
    sucesso: true,

    efeitosRecarregados: efeitosRecarregados,
  };
}

function ativarEfeitoDoParticipante(
  participante,
  efeitoId
) {
  const resultadoBusca =
    buscarEfeitoPorId(
      efeitoId
    );

  if (!resultadoBusca.sucesso) {
    return resultadoBusca;
  }

  const efeito =
    resultadoBusca.efeito;

  if (
    !efeitoEstaDisponivel(
      participante,
      efeito
    )
  ) {
    return {
      sucesso:
        false,

      motivo:
        "recursoIndisponivel"
    };
  }

  if (
    !custoEfeitoEstaDisponivel(
      participante,
      efeito
    )
  ) {
    return {
      sucesso:
        false,

      motivo:
        "custoIndisponivel"
    };
  }

  const operacao =
    prepararOperacaoEfeito(
      efeito,
      {
        participante:
          participante
      }
    );

  if (!operacao.sucesso) {
    return operacao;
  }

  const resultadoCusto =
    consumirCustoEfeito(
      participante,
      efeito
    );

  if (!resultadoCusto.sucesso) {
    return resultadoCusto;
  }

  const resultadoUso =
    consumirUsoEfeito(
      participante,
      efeito.id
    );

  if (!resultadoUso.sucesso) {
    return resultadoUso;
  }

  return {
    sucesso:
      true,

    motivo:
      null,

    efeito:
      efeito,

    operacao:
      operacao,

    custoConsumido:
      resultadoCusto
        .custoConsumido,

    usoConsumido:
      resultadoUso
        .usoConsumido,

    usosRestantes:
      resultadoUso
        .usosRestantes
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
      motivo: "contextoPendenteInexistente",
    };
  }

  const operacao =
    contextoPendente.efeitos?.find(
      function encontrarOperacao(
        efeito,
      ) {
        if (
          efeito.efeitoId ===
          efeitoId
        ) {
          return true;
        }

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
      motivo: "efeitoIndisponivel",
    };
  }

  let resultadoConsumo;

if (operacao.origem) {
  resultadoConsumo =
    window.TradutorRegras
      .consumirUsoRegra(
        participante,
        operacao,
      );
} else {
  resultadoConsumo =
    consumirUsoEfeito(
      participante,
      efeitoId,
    );
}

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
      resultadoConsumo.usosRestantes,
  };
}

function registrarRolagemEfeito(contextoPendente, resultadoRolagem) {
  const efeitoAtivo = contextoPendente?.efeitoAtivo;

  if (!efeitoAtivo) {
    return {
      sucesso: false,
      motivo: "nenhumEfeitoAtivo",
    };
  }

  const rolagens = contextoPendente.rolagensEfeito;

  if (!Array.isArray(rolagens)) {
    return {
      sucesso: false,
      motivo: "listaRolagensInexistente",
    };
  }

  const quantidadeNecessaria = efeitoAtivo.quantidadeDeRolagens;

  const criterioDeEscolha =
  efeitoAtivo.criterioDeEscolha ?? "primeiroResultado";

  if (rolagens.length >= quantidadeNecessaria) {
    return {
      sucesso: false,
      motivo: "rolagensJaCompletas",
    };
  }

  rolagens.push(structuredClone(resultadoRolagem));

  const concluida =
  rolagens.length >= quantidadeNecessaria;

  return {
    sucesso: true,
    motivo: null,

    quantidadeRegistrada: rolagens.length,
    quantidadeNecessaria: quantidadeNecessaria,

    concluida: concluida,

  criterioDeEscolha: criterioDeEscolha,

  exigeEscolhaDoJogador:
    concluida &&
    criterioDeEscolha === "escolhaDoJogador",

  rolagens: rolagens,
};
}

function finalizarEfeitoPendente(contextoPendente) {
  if (!contextoPendente) {
    return {
      sucesso: false,
      motivo: "contextoPendenteInexistente",
    };
  }

  const efeitoAtivo = contextoPendente.efeitoAtivo;

  if (!efeitoAtivo) {
    return {
      sucesso: false,
      motivo: "nenhumEfeitoAtivo",
    };
  }

  const efeitoFinalizado = structuredClone(efeitoAtivo);

  const rolagensRegistradas = Array.isArray(
    contextoPendente.rolagensEfeito,
  )
    ? structuredClone(contextoPendente.rolagensEfeito)
    : [];

  contextoPendente.efeitoAtivo = null;
  contextoPendente.rolagensEfeito = [];

  return {
    sucesso: true,
    motivo: null,

    efeitoFinalizado: efeitoFinalizado,
    rolagensRegistradas: rolagensRegistradas,
  };
}

window.MotorEfeitos = {
  prepararOperacaoGenerica,
};