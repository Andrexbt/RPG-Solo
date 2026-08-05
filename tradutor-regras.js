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

  participante.estadoRegras[chave] = {
    usosRestantes:
      ordem.usos.quantidade,

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

      usos:
        structuredClone(
          ordem.usos ?? null,
        ),
    });
  }

  return operacoes;
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



  return {
    descobrirRegras,
    participanteDominaArma,
    traduzirRegras,
    prepararOperacoes,
    regraEstaDisponivel,
    consumirUsoRegra,
  };
})();