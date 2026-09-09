"use strict";

const assert = require("node:assert/strict");

global.window = global;

require("../banco-maestrias.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../combate.js");

const guerreiro = {
  id: "guerreiro",
  habilidades: {
    escolhas: {
      maestriasArmas: ["espadaLonga"],
    },
  },
};

const inimigo = {
  id: "inimigo",
};

const ataque = {
  id: "espadaLonga:principal",
  armaId: "espadaLonga",
  maestriaId: "sap",
};

const operacoes = global.TradutorRegras.prepararOperacoes({
  gatilho: "aposAcertarAtaque",
  participante: guerreiro,
  ataque,
  alvo: inimigo,
});

const operacaoSap = operacoes.find(
  (operacao) =>
    operacao.tipo === "concederDesvantagem" &&
    operacao.origem?.id === "sap",
);

assert.ok(
  operacaoSap,
  "um acerto com uma Espada Longa dominada deve produzir a operação de Sap",
);

const combate = {
  efeitosTemporarios: [],
};

const resultado = global.SistemaCombate.aplicarDesvantagemTemporaria(
  combate,
  operacaoSap,
);

assert.equal(resultado.sucesso, true);
assert.equal(combate.efeitosTemporarios.length, 1);

assert.deepEqual(combate.efeitosTemporarios[0], {
  tipo: "desvantagem",
  participanteId: "inimigo",
  origemParticipanteId: "guerreiro",
  rolagemAfetada: "ataque",
  usosRestantes: 1,
  expiracao: "inicioDoProximoTurnoDoAtacante",
  origem: {
    tipo: "maestria",
    id: "sap",
  },
});

assert.equal(
  global.TradutorRegras.prepararOperacoes({
    gatilho: "aposErrarAtaque",
    participante: guerreiro,
    ataque,
    alvo: inimigo,
  }).some((operacao) => operacao.origem?.id === "sap"),
  false,
  "um ataque que errou não deve aplicar Sap",
);

console.log("✓ Aplicação inicial da Maestria Sap passou.");