"use strict";

function criarEstadoInicialJogo() {

  return {
    aventuraId: null,

    personagem: {
      id: null,
      dados: null,
      condicoes: []
    },

    progresso: {
      cenaId: null,
      caminhoId: null,
      etapaId: null,

      escolhasRemovidas: {},
      contadores: {},
      flags: {}
    },

    npcs: {},

    testePendente: null,

    combateAtual: null,

    diario: []
  };

}

function registrarEscolhaRemovida(cenaId, escolhaId) {

  const escolhasRemovidas =
    window.estadoJogo.progresso.escolhasRemovidas;

  if (!escolhasRemovidas[cenaId]) {
    escolhasRemovidas[cenaId] = [];
  }

  if (!escolhasRemovidas[cenaId].includes(escolhaId)) {
    escolhasRemovidas[cenaId].push(escolhaId);
  }

}

function obterEscolhasDisponiveis(cenaId, escolhas) {

  const escolhasRemovidas =
    window.estadoJogo.progresso.escolhasRemovidas[cenaId] || [];

  return escolhas.filter(
    function (escolha) {

      return !escolhasRemovidas.includes(escolha.id);

    }
  );

}

function carregarNpcsDaAventura(aventuraId) {

  const npcsDaAventura =
    window.bancoNpcs[aventuraId];

  if (!npcsDaAventura) {

    console.warn(
      "NPCs não encontrados para a aventura:",
      aventuraId
    );

    window.estadoJogo.npcs = {};

    return;

  }

  window.estadoJogo.npcs =
    structuredClone(npcsDaAventura);

}

window.registrarEscolhaRemovida = registrarEscolhaRemovida;
window.obterEscolhasDisponiveis = obterEscolhasDisponiveis;
window.carregarNpcsDaAventura = carregarNpcsDaAventura;
window.estadoJogo = criarEstadoInicialJogo();
window.criarEstadoInicialJogo = criarEstadoInicialJogo;