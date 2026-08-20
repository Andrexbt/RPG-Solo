"use strict";

(function () {
  const xpNecessarioPorNivel = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000,
  };

  function obterNivelPorXp(xpTotal) {
    const xp = Number(xpTotal);

    if (
      !Number.isFinite(xp) ||
      xp < 0
    ) {
      return null;
    }

    let nivelCorrespondente = 1;

    for (
      let nivel = 1;
      nivel <= 20;
      nivel += 1
    ) {
      if (
        xp >=
        xpNecessarioPorNivel[nivel]
      ) {
        nivelCorrespondente = nivel;
      }
    }

    return nivelCorrespondente;
  }

  function validarRecompensaXp(
    recompensa,
  ) {
    if (
      recompensa === null ||
      typeof recompensa !== "object"
    ) {
      return {
        valida: false,
        motivo: "recompensaInvalida",
      };
    }

    if (
      typeof recompensa.id !== "string" ||
      recompensa.id.trim() === ""
    ) {
      return {
        valida: false,
        motivo: "recompensaSemId",
      };
    }

    if (recompensa.tipo !== "xp") {
      return {
        valida: false,
        motivo: "tipoRecompensaInvalido",
      };
    }

    const quantidade =
      Number(recompensa.quantidade);

    if (
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      return {
        valida: false,
        motivo: "quantidadeXpInvalida",
      };
    }

    return {
      valida: true,
      motivo: null,
      quantidade,
    };
  }

  function prepararConcessaoXp(
    personagemOriginal,
    recompensa,
  ) {
    const personagem =
      window.PersonagemDados
        .normalizar(
          personagemOriginal,
        );

    if (!personagem?.id) {
      return {
        sucesso: false,
        concedida: false,
        motivo: "personagemInvalido",
      };
    }

    const validacao =
      validarRecompensaXp(
        recompensa,
      );

    if (!validacao.valida) {
      return {
        sucesso: false,
        concedida: false,
        motivo: validacao.motivo,
      };
    }

        const aventuraId =
      recompensa
        .origem
        ?.aventuraId;

    const aventuraJaVencida =
      typeof aventuraId === "string" &&
      window.PersonagemDados
        ?.venceuAventura?.(
          personagem,
          aventuraId
        );

    if (aventuraJaVencida) {
      const xpAtual =
        Number(personagem.xp) || 0;

      const nivelAtualPorXp =
        obterNivelPorXp(xpAtual);

      return {
        sucesso: true,
        concedida: false,
        motivo:
          "aventuraJaConcluida",

        personagem,

        xpAnterior: xpAtual,
        xpAtual,

        nivelAnteriorPorXp:
          nivelAtualPorXp,

        nivelAtualPorXp,

        novoNivelDisponivel:
          false,
      };
    }

    const recompensaJaRecebida =
      personagem
        .recompensasRecebidas
        .some(
          function (
            recompensaRegistrada,
          ) {
            return (
              recompensaRegistrada.id ===
              recompensa.id
            );
          },
        );

    const xpAnterior =
      Number(personagem.xp) || 0;

    const nivelAnteriorPorXp =
      obterNivelPorXp(xpAnterior);

    if (recompensaJaRecebida) {
      return {
        sucesso: true,
        concedida: false,
        motivo: "recompensaJaRecebida",
        personagem,
        xpAnterior,
        xpAtual: xpAnterior,
        nivelAnteriorPorXp,
        nivelAtualPorXp:
          nivelAnteriorPorXp,
      };
    }

    const personagemAtualizado =
      structuredClone(personagem);

    const registroRecompensa = {
      id: recompensa.id,
      tipo: "xp",
      quantidade:
        validacao.quantidade,

      origem:
        structuredClone(
          recompensa.origem ?? null,
        ),

      recebidaEm:
        new Date().toISOString(),
    };

    personagemAtualizado.xp =
      xpAnterior +
      validacao.quantidade;

    personagemAtualizado
      .recompensasRecebidas
      .push(registroRecompensa);

    const nivelAtualPorXp =
      obterNivelPorXp(
        personagemAtualizado.xp,
      );

    return {
      sucesso: true,
      concedida: true,
      motivo: null,

      personagem:
        personagemAtualizado,

      recompensa:
        registroRecompensa,

      xpAnterior,
      xpAtual:
        personagemAtualizado.xp,

      nivelAnteriorPorXp,
      nivelAtualPorXp,

      novoNivelDisponivel:
        nivelAtualPorXp >
        nivelAnteriorPorXp,
    };
  }

  function concederXp(
    personagemOriginal,
    recompensa,
  ) {
    const preparacao =
      prepararConcessaoXp(
        personagemOriginal,
        recompensa,
      );

    if (!preparacao.sucesso) {
      return preparacao;
    }

    if (!preparacao.concedida) {
      return preparacao;
    }

    const personagemSalvo =
      window.PersonagemDados
        .atualizarSalvo(
          preparacao.personagem,
        );

    if (!personagemSalvo) {
      return {
        ...preparacao,
        sucesso: false,
        concedida: false,
        motivo: "falhaAoPersistir",
      };
    }

    return {
      ...preparacao,
      personagem:
        personagemSalvo,
    };
  }

  window.SistemaProgressao =
    Object.freeze({
      obterNivelPorXp,
      prepararConcessaoXp,
      concederXp,
    });
})();