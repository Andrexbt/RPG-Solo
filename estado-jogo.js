"use strict";

function criarEstadoInicialJogo() {
  return {
    aventuraId: null,

    personagem: {
      id: null,
      dados: null,
      condicoes: [],
    },

    progresso: {
      cenaId: null,
      caminhoId: null,
      etapaId: null,
      escolhasRemovidas: {},
      contadores: {},
      flags: {},
    },

    npcs: {},
    testePendente: null,
    combateAtual: null,

    tempo: {
      segundosTotais: 0,
    },

    efeitosTemporarios: [],
    diario: [],
  };
}

function registrarEscolhaRemovida(cenaId, escolhaId) {
  if (!cenaId || !escolhaId) {
    return;
  }

  const escolhasRemovidas = window.estadoJogo.progresso.escolhasRemovidas;
  escolhasRemovidas[cenaId] ??= [];

  if (!escolhasRemovidas[cenaId].includes(escolhaId)) {
    escolhasRemovidas[cenaId].push(escolhaId);
  }
}

function obterEscolhasDisponiveis(cenaId, escolhas = []) {
  const removidas = window.estadoJogo.progresso.escolhasRemovidas[cenaId] ?? [];

  return escolhas.filter(function (escolha) {
    return !removidas.includes(escolha.id);
  });
}

function carregarNpcsDaAventura(aventuraId) {
  const npcsDaAventura = window.bancoNpcs?.[aventuraId];

  if (!npcsDaAventura) {
    console.warn("NPCs não encontrados para a aventura:", aventuraId);
    window.estadoJogo.npcs = {};
    return;
  }

  window.estadoJogo.npcs = structuredClone(npcsDaAventura);
}

window.estadoJogo = criarEstadoInicialJogo();
window.criarEstadoInicialJogo = criarEstadoInicialJogo;
window.registrarEscolhaRemovida = registrarEscolhaRemovida;
window.obterEscolhasDisponiveis = obterEscolhasDisponiveis;
window.carregarNpcsDaAventura = carregarNpcsDaAventura;
