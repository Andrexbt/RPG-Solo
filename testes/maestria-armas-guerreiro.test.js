"use strict";

const assert = require("node:assert/strict");

global.window = global;

require("../banco-classes.js");
require("../banco-habilidades.js");
require("../banco-maestrias.js");
require("../banco-equipamentos.js");
require("../combate.js");

const guerreiro = global.bancoClasses.guerreiro;
const progressao = global.bancoHabilidades.progressaoClasses.guerreiro.nivel1;
const grupoMaestrias = global.bancoHabilidades.gruposDeEscolha.maestriasArmas;

const escolhaMaestrias = progressao.escolhas.find(function (escolha) {
  return escolha.grupo === "maestriasArmas";
});

assert.equal(
  guerreiro.maestriasArmas.quantidade,
  3,
  "o Guerreiro de nível 1 deve dominar três tipos de arma",
);

assert.equal(
  escolhaMaestrias?.quantidade,
  3,
  "a progressão do Guerreiro deve exigir três escolhas de maestria",
);

assert.equal(
  grupoMaestrias.quantidadeEscolhas,
  3,
  "o grupo de escolha deve apresentar três seleções",
);

for (const [armaId, arma] of Object.entries(global.bancoEquipamentos.armas)) {
  assert.ok(
    global.bancoMaestrias[arma.maestria],
    `${armaId} deve apontar para uma maestria cadastrada`,
  );
}

const participante = {
  habilidades: {
    escolhas: {
      maestriasArmas: ["espadaLonga", "arcoLongo", "adaga"],
    },
  },
};

assert.equal(
  global.SistemaCombate.participanteDominaArma(participante, {
    armaId: "espadaLonga",
  }),
  true,
  "deve reconhecer uma arma escolhida pelo personagem",
);

assert.equal(
  global.SistemaCombate.participanteDominaArma(participante, {
    armaId: "machadoGrande",
  }),
  false,
  "não deve liberar a maestria de uma arma que não foi escolhida",
);

assert.equal(
  global.SistemaCombate.participanteDominaArma(
    { habilidades: { escolhas: { maestriasArmas: "espadaLonga" } } },
    { armaId: "espadaLonga" },
  ),
  false,
  "um valor salvo fora do formato de lista não deve liberar a maestria",
);

console.log("✓ Contrato básico de Maestria em Armas do Guerreiro passou.");
