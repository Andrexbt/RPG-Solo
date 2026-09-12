"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

global.window = global;
global.document = {
  readyState: "complete",
  querySelectorAll() {
    return [];
  },
};

require("../banco-equipamentos.js");
require("../banco-habilidades.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../ficha-personagem.js");

function criarGuerreiro({
  destreza = 14,
  armadura = "semArmadura",
  itemSecundario = "nada",
  estilo = null,
} = {}) {
  return {
    classeId: "guerreiro",
    atributos: { destreza },
    habilidades: {
      escolhas: {
        estilosDeLuta: estilo,
      },
    },
    detalhes: {
      equipamentos: {
        armadura,
        itemSecundario,
      },
    },
  };
}

test("calcula CA sem armadura e com armadura leve", () => {
  assert.equal(global.calcularClasseArmadura(criarGuerreiro()), 12);
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ destreza: 18, armadura: "couro" }),
    ),
    15,
  );
});

test("limita o bônus de Destreza das armaduras médias", () => {
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ destreza: 18, armadura: "peitoral" }),
    ),
    16,
  );
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ destreza: 8, armadura: "peitoral" }),
    ),
    13,
  );
});

test("armadura pesada ignora modificadores positivos e negativos de Destreza", () => {
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ destreza: 18, armadura: "cotaDeMalha" }),
    ),
    16,
  );
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ destreza: 8, armadura: "cotaDeMalha" }),
    ),
    16,
  );
});

test("escudo acrescenta 2 à CA", () => {
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ armadura: "cotaDeMalha", itemSecundario: "escudo" }),
    ),
    18,
  );
});

test("Estilo de Luta Defesa acrescenta 1 somente ao usar armadura", () => {
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ armadura: "cotaDeMalha", estilo: "defesa" }),
    ),
    17,
  );
  assert.equal(
    global.calcularClasseArmadura(
      criarGuerreiro({ armadura: "semArmadura", estilo: "defesa" }),
    ),
    12,
  );
});

test("retorna marcador quando os dados de equipamento estão ausentes ou inválidos", () => {
  assert.equal(global.calcularClasseArmadura({ atributos: { destreza: 14 }, detalhes: {} }), "-");
  assert.equal(
    global.calcularClasseArmadura(criarGuerreiro({ armadura: "inexistente" })),
    "-",
  );
});
