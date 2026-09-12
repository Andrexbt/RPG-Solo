"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

global.window = global;
global.location = { hostname: "127.0.0.1" };
global.document = {
  readyState: "complete",
  querySelector() {
    return null;
  },
};

require("../banco-maestrias.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../combate.js");
require("../testes-dev.js");

test("economia completa do turno do Guerreiro", async () => {
  const resultado = await global.TestesDev.executarTeste(
    "guerreiro.economia-turno",
  );

  assert.equal(
    resultado.status,
    "aprovado",
    `${resultado.mensagem}\n${resultado.detalhes.join("\n")}`,
  );
});
