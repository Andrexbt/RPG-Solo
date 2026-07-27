"use strict";

window.SistemaCombate = (function() {

  function criarEstadoCombate(configuracao) {

    return {
      id: configuracao.id,
      status: "ativo",

      rodada: 1,
      indiceTurno: 0,

      participantes:
        structuredClone(
          configuracao.participantes
        ),

      tabuleiro: {
        colunas: 10,
        linhas: 8
      }
    };

  }

  function iniciarCombate(configuracao) {

  const combate =
    criarEstadoCombate(
      configuracao
    );

  window.estadoJogo.combateAtual =
    combate;

  return combate;

  }

  return {
    criarEstadoCombate,
    iniciarCombate
  };

})();

const combateTeste =
  SistemaCombate.criarEstadoCombate({
    id: "combateTeste",

    participantes: [
      {
        id: "jogador",
        tipo: "jogador",

        posicao: {
          coluna: 2,
          linha: 7
        }
      },

      {
        id: "guardaConde",
        tipo: "inimigo",

        posicao: {
          coluna: 8,
          linha: 2
        }
      }
    ]
  });

  console.log(combateTeste);