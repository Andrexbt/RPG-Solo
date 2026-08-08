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
  const escolhasRemovidas = window.estadoJogo.progresso.escolhasRemovidas;

  if (!escolhasRemovidas[cenaId]) {
    escolhasRemovidas[cenaId] = [];
  }

  if (!escolhasRemovidas[cenaId].includes(escolhaId)) {
    escolhasRemovidas[cenaId].push(escolhaId);
  }
}

function obterEscolhasDisponiveis(cenaId, escolhas) {
  const escolhasRemovidas = window.estadoJogo.progresso.escolhasRemovidas[cenaId] || [];

  const listaEscolhas = escolhas ?? [];

  return listaEscolhas.filter(function (escolha) {
    return !escolhasRemovidas.includes(escolha.id);
  });
}

function carregarNpcsDaAventura(aventuraId) {
  const npcsDaAventura = window.bancoNpcs[aventuraId];

  if (!npcsDaAventura) {
    console.warn("NPCs não encontrados para a aventura:", aventuraId);

    window.estadoJogo.npcs = {};

    return;
  }

  window.estadoJogo.npcs = structuredClone(npcsDaAventura);
}

window.registrarEscolhaRemovida = registrarEscolhaRemovida;
window.obterEscolhasDisponiveis = obterEscolhasDisponiveis;
window.carregarNpcsDaAventura = carregarNpcsDaAventura;
window.estadoJogo = criarEstadoInicialJogo();
window.criarEstadoInicialJogo = criarEstadoInicialJogo;

const scriptConfirmacaoCombate = document.createElement("script");
scriptConfirmacaoCombate.src = "confirmacao-combate.js";
scriptConfirmacaoCombate.async = false;
document.head.append(scriptConfirmacaoCombate);

if (document.querySelector("#visualizacaoAventura")) {
  const scriptMotorAventura = document.createElement("script");
  scriptMotorAventura.src = "motor-aventura.js";
  scriptMotorAventura.async = false;
  document.head.append(scriptMotorAventura);
}

const hostDesenvolvimento = window.location.hostname;
const ambienteDesenvolvimento =
  hostDesenvolvimento === "localhost" ||
  hostDesenvolvimento === "127.0.0.1" ||
  hostDesenvolvimento === "0.0.0.0";

if (ambienteDesenvolvimento) {
  const scriptTestesDev = document.createElement("script");
  scriptTestesDev.src = "testes-dev.js";
  scriptTestesDev.async = false;
  document.head.append(scriptTestesDev);
}
