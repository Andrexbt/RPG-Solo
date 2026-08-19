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

    descansos: {
    ultimoDescansoLongoConcluidoEm: null,
    descansoCurtoAtual: null
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

function registrarMemorias(memorias) {
  if (
    !memorias ||
    typeof memorias !== "object" ||
    Array.isArray(memorias)
  ) {
    return;
  }

  Object.assign(
    window.estadoJogo.progresso.flags,
    memorias,
  );
}

function carregarNpcsDaAventura(aventuraId) {
  const npcsDaAventura =
    window.bancoNpcs?.[aventuraId];

  if (!npcsDaAventura) {
    console.warn(
      "NPCs não encontrados para a aventura:",
      aventuraId,
    );

    window.estadoJogo.npcs = {};

    return;
  }

  const npcsCarregados = {};

  for (
    const [npcId, configuracaoNpc]
    of Object.entries(npcsDaAventura)
  ) {
    const npc =
      window.CriaturaDados
        ?.criarNpcAPartirDoBloco(
          configuracaoNpc,
        );

    if (!npc) {
      console.warn(
        "Não foi possível carregar o NPC:",
        npcId,
      );

      continue;
    }

    npcsCarregados[npcId] = npc;
  }

  window.estadoJogo.npcs = npcsCarregados;
}

window.estadoJogo = criarEstadoInicialJogo();
window.criarEstadoInicialJogo = criarEstadoInicialJogo;
window.registrarEscolhaRemovida = registrarEscolhaRemovida;
window.obterEscolhasDisponiveis = obterEscolhasDisponiveis;
window.carregarNpcsDaAventura = carregarNpcsDaAventura;
window.registrarMemorias = registrarMemorias;
