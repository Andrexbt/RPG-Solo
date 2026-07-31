"use strict";

const bancoEfeitos = {
  atacanteSelvagem: {
    id: "atacanteSelvagem",
    nome: "Atacante Selvagem",

    origem: {
      tipo: "talento",
      id: "atacanteSelvagem",
    },

    tipo: "alterarRolagem",
    gatilho: "aoRolarDano",
    alvo: "proprioPersonagem",

    operacao: {
      tipo: "rolarNovamente",
      rolagemAfetada: "danoDaArma",
      quantidadeDeRolagens: 2,
      criterioDeEscolha: "escolhaDoJogador",
    },

    usos: {
      quantidade: 1,
      recarga: "turno",
    },
  },
};
