"use strict";

window.TradutorRegras = (function () {
  function adicionarRegra(
    regrasEncontradas,
    origem,
    entidade,
  ) {
    if (!entidade?.regra) {
      return;
    }

    regrasEncontradas.push({
      origem: {
        tipo: origem.tipo,
        id: origem.id,
        nome: entidade.nome,
      },

      regra:
        structuredClone(
          entidade.regra,
        ),
    });
  }

  function buscarRegrasDeTalentos(
    participante,
  ) {
    const regrasEncontradas = [];

    const talentos =
      participante?.talentos ?? [];

    for (const talentoId of talentos) {
      const talento =
        window.bancoTalentos
          ?.[talentoId];

      adicionarRegra(
        regrasEncontradas,
        {
          tipo: "talento",
          id: talentoId,
        },
        talento,
      );
    }

    return regrasEncontradas;
  }

  function buscarRegrasDeEspecie(
  participante,
) {
  const regrasEncontradas = [];

  const especieId =
    participante?.especieId;

  if (!especieId) {
    return regrasEncontradas;
  }

  const especie =
    window.bancoEspecies
      ?.especies
      ?.[especieId];

  const tracos =
    especie?.tracos ?? [];

  for (const tracoId of tracos) {
    const traco =
      window.bancoEspecies
        ?.tracos
        ?.[tracoId];

    if (!traco) {
      continue;
    }

    const regras =
      traco.regras ??
      (
        traco.regra
          ? [traco.regra]
          : []
      );

    for (const regra of regras) {
      regrasEncontradas.push({
        origem: {
          tipo: "tracoEspecie",
          id: traco.id,
          nome: traco.nome,
        },

        regra:
          structuredClone(
            regra,
          ),
      });
    }
  }

  return regrasEncontradas;
  }

  function buscarRegrasDeHabilidades(
    participante,
  ) {
    const regrasEncontradas = [];

    const classeId =
      participante?.classeId;

    if (!classeId) {
      return regrasEncontradas;
    }

    const progressao =
      window.bancoHabilidades
        ?.progressaoClasses
        ?.[classeId]
        ?.nivel1;

    const habilidades =
      progressao
        ?.classFeaturesAutomaticas ??
      [];

    for (
      const habilidadeId
      of habilidades
    ) {
      const habilidade =
        window.bancoHabilidades
          ?.classFeatures
          ?.[habilidadeId];

      adicionarRegra(
        regrasEncontradas,
        {
          tipo: "habilidade",
          id: habilidadeId,
        },
        habilidade,
      );
    }

    return regrasEncontradas;
  }

  function participanteDominaArma(
    participante,
    ataque,
  ) {
    const armasDominadas =
      participante
        ?.habilidades
        ?.escolhas
        ?.maestriasArmas ?? [];

    if (
      !Array.isArray(armasDominadas)
    ) {
      return false;
    }

    return armasDominadas.includes(
      ataque?.id,
    );
  }

  function buscarRegraDeMaestria(
    participante,
    ataque,
  ) {
    if (
      !ataque?.maestriaId ||
      !participanteDominaArma(
        participante,
        ataque,
      )
    ) {
      return [];
    }

    const maestria =
      window.bancoMaestrias
        ?.[ataque.maestriaId];

    const regrasEncontradas = [];

    adicionarRegra(
      regrasEncontradas,
      {
        tipo: "maestria",
        id: ataque.maestriaId,
      },
      maestria,
    );

    return regrasEncontradas;
  }

  function descobrirRegras(
    contexto,
  ) {
    const participante =
      contexto?.participante;

    if (!participante) {
      return [];
    }

    const regrasEncontradas = [
      ...buscarRegrasDeTalentos(
        participante,
      ),

      ...buscarRegrasDeEspecie(
        participante,
      ),

      ...buscarRegrasDeHabilidades(
        participante,
      ),

      ...buscarRegraDeMaestria(
        participante,
        contexto.ataque,
      ),
    ];

    if (!contexto.gatilho) {
      return regrasEncontradas;
    }

    return regrasEncontradas.filter(
      function filtrarPorGatilho(
        regraEncontrada,
      ) {
        return (
          regraEncontrada
            .regra
            .gatilho ===
          contexto.gatilho
        );
      },
    );
  }

  function traduzirRegra(
  regraEncontrada,
  contexto,
) {
  if (
    !regraEncontrada?.regra?.efeito
  ) {
    return null;
  }

  return {
    origem: structuredClone(
      regraEncontrada.origem,
    ),

    gatilho:
      regraEncontrada
        .regra
        .gatilho,

    custo:
       regraEncontrada
        .regra
        .custo ??
      null,

    alvo:
       regraEncontrada
        .regra
        .alvo ??
      null,

      condicao:
  structuredClone(
    regraEncontrada
      .regra
      .condicao ??
    null,
  ),

  requisito:
  structuredClone(
    regraEncontrada
      .regra
      .requisito ??
    null,
  ),

    recurso:
        structuredClone(
          regraEncontrada
            .regra
            .recurso ??
          null,
        ),

    efeito: structuredClone(
      regraEncontrada
        .regra
        .efeito,
    ),

    usos:
      structuredClone(
        regraEncontrada
          .regra
          .usos ??
        null,
      ),

    contexto: {
      participanteId:
        contexto
          ?.participante
          ?.id ??
        null,

      ataqueId:
        contexto
          ?.ataque
          ?.id ??
        null,

      alvoId:
        contexto
          ?.alvo
          ?.id ??
        null,
    },
  };
  }

  function condicaoRegraEhCompativel(
  regra,
  contexto,
) {
  const condicao =
    regra?.condicao;

  if (!condicao) {
    return true;
  }

  if (
    condicao.condicaoId &&
    condicao.condicaoId !==
      contexto?.condicaoId
  ) {
    return false;
  }

  if (
    Array.isArray(
      condicao.finalidades,
    ) &&
    condicao.finalidades.length > 0
  ) {
    if (
      !condicao.finalidades.includes(
        contexto?.finalidade,
      )
    ) {
      return false;
    }
  }

  return true;
  }

  function traduzirRegras(
  contexto,
) {
  const regrasEncontradas =
    descobrirRegras(
      contexto,
    );

  const ordens = [];

  for (
    const regraEncontrada
    of regrasEncontradas
  ) {
     if (
    !condicaoRegraEhCompativel(
      regraEncontrada.regra,
      contexto,
    )
  ) {
    continue;
  }
    const ordem =
      traduzirRegra(
        regraEncontrada,
        contexto,
      );

    if (!ordem) {
      continue;
    }

    ordens.push(ordem);
  }

  return ordens;
  }

  function resolverQuantidade(
  quantidade,
  participante,
) {
  if (
    typeof quantidade ===
    "number"
  ) {
    return quantidade;
  }

  if (
    !quantidade ||
    typeof quantidade !==
      "object"
  ) {
    return 0;
  }

  if (
    quantidade.tipo ===
    "bonusProficiencia"
  ) {
    const nivel =
      Math.max(
        1,
        Number(
          participante?.nivel,
        ) || 1,
      );

    return (
      2 +
      Math.floor(
        (nivel - 1) / 4,
      )
    );
  }

  return 0;
  }

  function inicializarEstadoRegra(
  participante,
  ordem,
) {
  if (
    !participante ||
    !ordem?.origem ||
    !ordem?.usos
  ) {
    return null;
  }

  participante.estadoRegras ??= {};

  const chave =
    criarChaveEstadoRegra(
      ordem.origem,
    );

  if (
    participante.estadoRegras[chave]
  ) {
    return (
      participante.estadoRegras[chave]
    );
  }

  const quantidadeUsos =
  resolverQuantidade(
    ordem.usos.quantidade,
    participante,
  );

  participante.estadoRegras[chave] = {
    usosMaximos:
    quantidadeUsos,

    usosRestantes:
    quantidadeUsos,

    recarga:
    ordem.usos.recarga,
  };

  return (
    participante.estadoRegras[chave]
  );
  }

  function regraEstaDisponivel(
  participante,
  ordem,
) {
  if (!ordem?.usos) {
    return true;
  }

  const estado =
    inicializarEstadoRegra(
      participante,
      ordem,
    );

  return (
    estado?.usosRestantes > 0
  );
  }

  function requisitoEstaSatisfeito(
  requisito,
  contexto,
) {
  if (!requisito) {
    return true;
  }

  if (
    requisito.tipo ===
    "contatoComSuperficie"
  ) {
    const superficie =
      contexto
        ?.ambiente
        ?.superficieContato;

    if (!superficie) {
      return false;
    }

    if (
      requisito.material &&
      superficie.material !==
        requisito.material
    ) {
      return false;
    }

    return true;
  }

  return false;
  }

  function recursoEstaDisponivel(
  participante,
  ordem,
) {
  if (!ordem?.recurso) {
    return true;
  }

  if (
    ordem.recurso.tipo ===
    "habilidade"
  ) {
    const recurso =
      participante
        ?.habilidades
        ?.recursos
        ?.[ordem.recurso.id];

    if (!recurso) {
      return false;
    }

    return (
      recurso.usosAtuais > 0
    );
  }

  return true;
  }

  function custoEstaDisponivel(
  participante,
  ordem,
  contexto = {}
) {
  if (!ordem?.custo) {
    return true;
  }

  if (
    contexto.modo !== "combate"
  ) {
    return true;
  }

  if (
    ordem.custo === "acao"
  ) {
    return (
      participante
        ?.acaoDisponivel === true
    );
  }

  if (
    ordem.custo === "acaoBonus"
  ) {
    return (
      participante
        ?.acaoBonusDisponivel === true
    );
  }

  if (
    ordem.custo === "reacao"
  ) {
    return (
      participante
        ?.reacaoDisponivel === true
    );
  }

  return false;
  }

  function consumirUsoRegra(
  participante,
  ordem,
) {
  if (!ordem?.usos) {
    return {
      sucesso: true,
      usoConsumido: false,
      usosRestantes: null,
    };
  }

  const estado =
    inicializarEstadoRegra(
      participante,
      ordem,
    );

  if (!estado) {
    return {
      sucesso: false,
      motivo:
        "estadoRegraInexistente",
    };
  }

  if (
    estado.usosRestantes <= 0
  ) {
    return {
      sucesso: false,
      motivo:
        "regraSemUsos",
    };
  }

  estado.usosRestantes -= 1;

  return {
    sucesso: true,
    motivo: null,

    usoConsumido: true,

    usosRestantes:
      estado.usosRestantes,
  };
  }

  function consumirRecurso(
  participante,
  operacao,
) {
  if (!operacao?.recurso) {
    return {
      sucesso: true,
      recursoConsumido: false,
    };
  }

  if (
    operacao.recurso.tipo ===
    "habilidade"
  ) {
    const recurso =
      participante
        ?.habilidades
        ?.recursos
        ?.[operacao.recurso.id];

    if (!recurso) {
      return {
        sucesso: false,
        motivo:
          "recursoInexistente",
      };
    }

    if (
      recurso.usosAtuais <= 0
    ) {
      return {
        sucesso: false,
        motivo:
          "recursoSemUsos",
      };
    }

    recurso.usosAtuais -= 1;

    return {
      sucesso: true,

      recursoConsumido: true,

      usosRestantes:
        recurso.usosAtuais,
    };
  }

  return {
    sucesso: false,
    motivo:
      "tipoRecursoNaoImplementado",
  };
  }

  function consumirCusto(
  participante,
  operacao,
  contexto = {}
) {
  if (!operacao?.custo) {
    return {
      sucesso: true,
      custoConsumido: false,
    };
  }

  if (
  contexto.modo !== "combate"
) {
  return {
    sucesso: true,
    custoConsumido: false,
    custo: operacao.custo,
    motivo:
      "custoNaoConsumidoForaDeCombate",
  };
}

  if (
    operacao.custo === "acao"
  ) {
    if (
      participante
        ?.acaoDisponivel !== true
    ) {
      return {
        sucesso: false,
        motivo:
          "acaoIndisponivel",
      };
    }

    participante.acaoDisponivel =
      false;

    return {
      sucesso: true,
      custoConsumido: true,
      custo: "acao",
    };
  }

  if (
    operacao.custo ===
    "acaoBonus"
  ) {
    if (
      participante
        ?.acaoBonusDisponivel !== true
    ) {
      return {
        sucesso: false,
        motivo:
          "acaoBonusIndisponivel",
      };
    }

    participante
      .acaoBonusDisponivel =
      false;

    return {
      sucesso: true,
      custoConsumido: true,
      custo: "acaoBonus",
    };
  }

  if (
    operacao.custo === "reacao"
  ) {
    if (
      participante
        ?.reacaoDisponivel !== true
    ) {
      return {
        sucesso: false,
        motivo:
          "reacaoIndisponivel",
      };
    }

    participante.reacaoDisponivel =
      false;

    return {
      sucesso: true,
      custoConsumido: true,
      custo: "reacao",
    };
  }

  return {
    sucesso: false,
    motivo:
      "tipoCustoNaoImplementado",
  };
  }

  function prepararOperacoes(
  contexto,
) {
  const ordens =
    traduzirRegras(
      contexto,
    );

  const operacoes = [];

  for (const ordem of ordens) {
    if (
      !regraEstaDisponivel(
        contexto.participante,
        ordem,
      )
    ) {
      continue;
    }

    if (
  !requisitoEstaSatisfeito(
    ordem.requisito,
    contexto,
  )
) {
  continue;
}

    if (
    !recursoEstaDisponivel(
      contexto.participante,
      ordem,
    )
  ) {
    continue;
  }

  if (
  !custoEstaDisponivel(
    contexto.participante,
    ordem, contexto,
  )
) {
  continue;
}

    const resultado =
  window.MotorEfeitos
    .prepararOperacaoGenerica(
        ordem.efeito,
        {
          participante:
            contexto.participante,

          participanteId:
            contexto
              ?.participante
              ?.id ??
            null,

          ataque:
            contexto.ataque,

          alvo:
            contexto.alvo,
        },
      );

    if (!resultado.sucesso) {
      continue;
    }

    operacoes.push({
      ...resultado,

      origem:
        structuredClone(
          ordem.origem,
        ),

        custo:
    ordem.custo,

  alvo:
    ordem.alvo,

    condicao:
  structuredClone(
    ordem.condicao ?? null,
  ),

  requisito:
  structuredClone(
    ordem.requisito ?? null,
  ),

  recurso:
    structuredClone(
      ordem.recurso ?? null,
    ),

      usos:
        structuredClone(
          ordem.usos ?? null,
        ),
    });
  }

  return operacoes;
  }

  function executarOperacao(
  operacao,
  contexto = {},
) {
  const participante =
    contexto?.participante;

  if (
    !participante ||
    !operacao
  ) {
    return {
      sucesso: false,
      motivo:
        "dadosExecucaoInvalidos",
    };
  }

  if (
    !requisitoEstaSatisfeito(
      operacao.requisito,
      contexto,
    )
  ) {
    return {
      sucesso: false,
      motivo:
        "requisitoNaoSatisfeito",
    };
  }

  if (
    !regraEstaDisponivel(
      participante,
      operacao,
    )
  ) {
    return {
      sucesso: false,
      motivo:
        "regraIndisponivel",
    };
  }

  if (
    !recursoEstaDisponivel(
      participante,
      operacao,
    )
  ) {
    return {
      sucesso: false,
      motivo:
        "recursoIndisponivel",
    };
  }

  if (
    !custoEstaDisponivel(
      participante,
      operacao,
      contexto,
    )
  ) {
    return {
      sucesso: false,
      motivo:
        "custoIndisponivel",
    };
  }

  let resultadoEfeito;

  if (
    operacao.duracao
  ) {
    resultadoEfeito =
      window.MotorEfeitos
        .aplicarEfeitoTemporario(
          operacao,
        );
  } else {
    return {
      sucesso: false,
      motivo:
        "execucaoEfeitoNaoImplementada",
    };
  }

  if (
    !resultadoEfeito?.sucesso
  ) {
    return {
      sucesso: false,
      motivo:
        resultadoEfeito
          ?.motivo ??
        "falhaAoAplicarEfeito",
    };
  }

  const resultadoCusto =
    consumirCusto(
      participante,
      operacao,
      contexto,
    );

  if (!resultadoCusto.sucesso) {
    return resultadoCusto;
  }

  const resultadoUso =
    consumirUsoRegra(
      participante,
      operacao,
    );

  if (!resultadoUso.sucesso) {
    return resultadoUso;
  }

  const resultadoRecurso =
    consumirRecurso(
      participante,
      operacao,
    );

  if (
    !resultadoRecurso.sucesso
  ) {
    return resultadoRecurso;
  }

  return {
    sucesso: true,

    operacao:
      structuredClone(
        operacao,
      ),

    efeito:
      resultadoEfeito.efeito,

    custo:
      resultadoCusto,

    uso:
      resultadoUso,

    recurso:
      resultadoRecurso,
  };
  }

  function criarChaveEstadoRegra(
  origem,
) {
  return (
    origem.tipo +
    ":" +
    origem.id
  );
  }

  function obterEstadoRegra(
  participante,
  origem,
) {
  if (
    !participante ||
    !origem
  ) {
    return null;
  }

  const chave =
    criarChaveEstadoRegra(
      origem,
    );

  return (
    participante
      ?.estadoRegras
      ?.[chave] ??
    null
  );
  }

  function recarregarRegras(
  participante,
  tipoRecarga,
) {
  const estadoRegras =
    participante?.estadoRegras ?? {};

  const regrasRecarregadas = [];

  for (const chave in estadoRegras) {
    const estado =
      estadoRegras[chave];

    if (
      estado.recarga !==
      tipoRecarga
    ) {
      continue;
    }

    estado.usosRestantes =
      estado.usosMaximos;

    regrasRecarregadas.push(
      chave,
    );
  }

  return {
    sucesso: true,

    regrasRecarregadas,
  };
  }

  function obterVantagemDeContexto(
  contexto,
) {
  const operacoes =
    prepararOperacoes(
      contexto,
    );

  return operacoes.some(
    function verificarVantagem(
      operacao,
    ) {
      return (
        operacao.tipo ===
          "concederVantagem" &&
        operacao.rolagemAfetada ===
          contexto?.tipoRolagem
      );
    },
  );
  }

  return {
    descobrirRegras,
    traduzirRegras,
    prepararOperacoes,
    participanteDominaArma,
    executarOperacao,

    regraEstaDisponivel,
    consumirUsoRegra,
    recarregarRegras,

    consumirRecurso,
    obterVantagemDeContexto,
  };
})();