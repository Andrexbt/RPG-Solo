"use strict";

(function () {
  const orcamentoXpPorPersonagem = {
    1: {
      baixa: 50,
      moderada: 75,
      alta: 100,
    },

    2: {
      baixa: 100,
      moderada: 150,
      alta: 200,
    },

    3: {
      baixa: 150,
      moderada: 225,
      alta: 400,
    },

    4: {
      baixa: 250,
      moderada: 375,
      alta: 500,
    },

    5: {
      baixa: 500,
      moderada: 750,
      alta: 1100,
    },

    6: {
      baixa: 600,
      moderada: 1000,
      alta: 1400,
    },

    7: {
      baixa: 750,
      moderada: 1300,
      alta: 1700,
    },

    8: {
      baixa: 1000,
      moderada: 1700,
      alta: 2100,
    },

    9: {
      baixa: 1300,
      moderada: 2000,
      alta: 2600,
    },

    10: {
      baixa: 1600,
      moderada: 2300,
      alta: 3100,
    },

    11: {
      baixa: 1900,
      moderada: 2900,
      alta: 4100,
    },

    12: {
      baixa: 2200,
      moderada: 3700,
      alta: 4700,
    },

    13: {
      baixa: 2600,
      moderada: 4200,
      alta: 5400,
    },

    14: {
      baixa: 2900,
      moderada: 4900,
      alta: 6200,
    },

    15: {
      baixa: 3300,
      moderada: 5400,
      alta: 7800,
    },

    16: {
      baixa: 3800,
      moderada: 6100,
      alta: 9800,
    },

    17: {
      baixa: 4500,
      moderada: 7200,
      alta: 11700,
    },

    18: {
      baixa: 5000,
      moderada: 8700,
      alta: 14200,
    },

    19: {
      baixa: 5500,
      moderada: 10700,
      alta: 17200,
    },

    20: {
      baixa: 6400,
      moderada: 13200,
      alta: 22000,
    },
  };

  function obterOrcamentoEncontro(
    nivelPersonagem,
    quantidadePersonagens = 1,
  ) {
    const nivel = Number(nivelPersonagem);
    const quantidade = Number(quantidadePersonagens);

    const orcamentoIndividual =
      orcamentoXpPorPersonagem[nivel];

    if (!orcamentoIndividual) {
      return null;
    }

    if (
      !Number.isInteger(quantidade) ||
      quantidade < 1
    ) {
      return null;
    }

    return {
      baixa:
        orcamentoIndividual.baixa *
        quantidade,

      moderada:
        orcamentoIndividual.moderada *
        quantidade,

      alta:
        orcamentoIndividual.alta *
        quantidade,
    };
  }

  function calcularXpEncontro(
    configuracoesInimigos,
    catalogoNpcs,
  ) {
    const resultado = {
      xpTotal: 0,
      quantidadeCriaturas: 0,
      criaturas: [],
      erros: [],
    };

    if (!Array.isArray(configuracoesInimigos)) {
      resultado.erros.push(
        "A configuração de inimigos não é uma lista.",
      );

      return resultado;
    }

    for (
      const configuracao
      of configuracoesInimigos
    ) {
      const npcId = configuracao?.npcId;
      const npc = catalogoNpcs?.[npcId];

      if (!npc) {
        resultado.erros.push(
          `NPC não encontrado: ${npcId ?? "sem ID"}.`,
        );

        continue;
      }

      const quantidade =
        Number(configuracao.quantidade ?? 1);

      if (
        !Number.isInteger(quantidade) ||
        quantidade < 1
      ) {
        resultado.erros.push(
          `Quantidade inválida para o NPC ${npcId}.`,
        );

        continue;
      }

      const xpIndividual = Number(npc.xp);

      if (
        !Number.isFinite(xpIndividual) ||
        xpIndividual < 0
      ) {
        resultado.erros.push(
          `XP inválido para o NPC ${npcId}.`,
        );

        continue;
      }

      const xpSubtotal =
        xpIndividual * quantidade;

      resultado.xpTotal += xpSubtotal;
      resultado.quantidadeCriaturas += quantidade;

      resultado.criaturas.push({
        npcId,
        blocoCriaturaId:
          npc.blocoCriaturaId ?? null,

        quantidade,
        nivelDesafio:
          npc.nivelDesafio ?? null,

        xpIndividual,
        xpSubtotal,
      });
    }

    return resultado;
  }

  function classificarDificuldadeEncontro(
    xpTotal,
    nivelPersonagem,
    quantidadePersonagens = 1,
  ) {
    const xp = Number(xpTotal);

    if (!Number.isFinite(xp) || xp < 0) {
      return null;
    }

    const orcamento =
      obterOrcamentoEncontro(
        nivelPersonagem,
        quantidadePersonagens,
      );

    if (!orcamento) {
      return null;
    }

    if (xp === 0) {
      return {
        categoria: "semXp",
        xpTotal: xp,
        orcamento,
      };
    }

    if (xp <= orcamento.baixa) {
      return {
        categoria: "baixa",
        xpTotal: xp,
        orcamento,
      };
    }

    if (xp <= orcamento.moderada) {
      return {
        categoria: "moderada",
        xpTotal: xp,
        orcamento,
      };
    }

    if (xp <= orcamento.alta) {
      return {
        categoria: "alta",
        xpTotal: xp,
        orcamento,
      };
    }

    return {
      categoria: "acimaDoOrcamento",
      xpTotal: xp,
      orcamento,
    };
  }

  function avaliarEncontro({
    inimigos,
    catalogoNpcs,
    nivelPersonagem,
    quantidadePersonagens = 1,
  }) {
    const experiencia =
      calcularXpEncontro(
        inimigos,
        catalogoNpcs,
      );

    const dificuldade =
      classificarDificuldadeEncontro(
        experiencia.xpTotal,
        nivelPersonagem,
        quantidadePersonagens,
      );

    return {
      ...experiencia,
      dificuldade,
    };
  }

  window.SistemaEncontros = Object.freeze({
    obterOrcamentoEncontro,
    calcularXpEncontro,
    classificarDificuldadeEncontro,
    avaliarEncontro,
  });
})();