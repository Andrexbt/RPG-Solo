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

test("ciclo completo da Maestria Topple", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.maestria.topple");

  assert.equal(resultado.status, "aprovado", resultado.mensagem);
  assert.match(resultado.detalhes.join("\n"), /CD de Topple: 13/i);
  assert.match(resultado.detalhes.join("\n"), /recebeu a condição Caído/i);
  assert.match(resultado.detalhes.join("\n"), /1 célula.*vantagem/i);
  assert.match(resultado.detalhes.join("\n"), /distante.*desvantagem/i);
  assert.match(resultado.detalhes.join("\n"), /metade do movimento.*3 células/i);
  assert.match(resultado.detalhes.join("\n"), /igualou a CD e permaneceu de pé/i);
});
