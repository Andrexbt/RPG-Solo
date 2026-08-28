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

      ultimaTransicao: null,
      historicoTransicoes: [],
      ultimoEventoNarrativo: null,

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

function registrarEventoNarrativo(evento = {}) {
  const progresso = window.estadoJogo?.progresso;

  if (!progresso) {
    return;
  }

  progresso.ultimoEventoNarrativo = {
    cenaId: progresso.cenaId,
    etapaId: progresso.etapaId,
    caminhoId: progresso.caminhoId,
    ...evento,
  };
}

function registrarTransicaoAutomatica(cenaDestinoId) {
  const progresso = window.estadoJogo?.progresso;

  if (!progresso) {
    return;
  }

  const evento = progresso.ultimoEventoNarrativo;

  const eventoPertenceAoLocalAtual =
    evento?.cenaId === progresso.cenaId &&
    evento?.etapaId === progresso.etapaId;

  const transicao = {
    cenaOrigemId: progresso.cenaId,
    etapaOrigemId: progresso.etapaId,
    caminhoOrigemId: progresso.caminhoId,
    cenaDestinoId,

    tipo: eventoPertenceAoLocalAtual
      ? evento.tipo ?? null
      : null,

    resultado: eventoPertenceAoLocalAtual
      ? evento.resultado ?? null
      : null,

    quantidadeAcertos: eventoPertenceAoLocalAtual
      ? evento.quantidadeAcertos ?? null
      : null,
  };

  progresso.ultimaTransicao = transicao;
  progresso.historicoTransicoes ??= [];
  progresso.historicoTransicoes.push(transicao);

  // Impede que uma aventura muito longa acumule indefinidamente.
  if (progresso.historicoTransicoes.length > 100) {
    progresso.historicoTransicoes.shift();
  }

  progresso.ultimoEventoNarrativo = null;
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
