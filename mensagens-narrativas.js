"use strict";

window.mensagensNarrativas = {
  iniciativa: {
    pedir: function (modificador) {
      const sinal =
        modificador >= 0 ? "+" : "-";

      return (
        `Role 1d20 ${sinal} ` +
        `${Math.abs(modificador)} ` +
        "para determinar sua iniciativa."
      );
    },

    erro: "Para a iniciativa, use exatamente 1d20.",
  },

  ataque: {
    pedirNormal: function (
      modificador,
      alvoNome,
    ) {
      const sinal =
        modificador >= 0 ? "+" : "-";

      return (
        `Role 1d20 ${sinal} ` +
        `${Math.abs(modificador)} ` +
        `para atacar ${alvoNome}.`
      );
    },

    pedirVantagem: function (
      modificador,
      alvoNome,
    ) {
      return (
        "Role 2d20 e use o maior resultado " +
        `para atacar ${alvoNome}.`
      );
    },

    pedirDesvantagem: function (
      modificador,
      alvoNome,
    ) {
      return (
        "Role 2d20 e use o menor resultado " +
        `para atacar ${alvoNome}.`
      );
    },
  },

  dano: {
    acertoNormal: function (expressao) {
      return (
        `O ataque acertou! ` +
        `Role ${expressao} de dano.`
      );
    },

    acertoCritico: function (expressao) {
      return (
        `Acerto crítico! ` +
        `Role ${expressao} de dano.`
      );
    },
  },

  efeitos: {
    disponivel: function (nome) {
      return (
        `${nome} está disponível. ` +
        "Deseja utilizá-lo?"
      );
    },

    ativado: function (
      nome,
      expressao,
      quantidadeDeRolagens,
    ) {
      return (
        `${nome} ativado. ` +
        `Role ${expressao} ` +
        `${quantidadeDeRolagens} vezes.`
      );
    },

    escolherResultado:
      "Escolha qual resultado de dano utilizar.",
  },

  dados: {
    erroRolagem: function (expressao) {
      return `Use ${expressao}`;
    },
  },
};