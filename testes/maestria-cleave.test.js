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

test("ciclo completo da Maestria Cleave", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.maestria.cleave");

  assert.equal(resultado.status, "aprovado", resultado.mensagem);
  assert.match(resultado.detalhes.join("\n"), /somente o segundo inimigo/i);
  assert.match(resultado.detalhes.join("\n"), /sem exigir outra ação/i);
  assert.match(resultado.detalhes.join("\n"), /Força positiva: 0/i);
  assert.match(resultado.detalhes.join("\n"), /segunda utilização.*impedida/i);
  assert.match(resultado.detalhes.join("\n"), /disponível no início do turno seguinte/i);
  assert.match(resultado.detalhes.join("\n"), /modificador negativo.*mantido/i);
});
