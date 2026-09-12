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

test("ciclo completo da Maestria Vex", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.maestria.vex");

  assert.equal(resultado.status, "aprovado", resultado.mensagem);
  assert.match(resultado.detalhes.join("\n"), /outro alvo: normal/i);
  assert.match(resultado.detalhes.join("\n"), /alvo de Vex: vantagem/i);
  assert.match(resultado.detalhes.join("\n"), /aplicações simultâneas foram consumidas/i);
  assert.match(resultado.detalhes.join("\n"), /expirou ao fim do próximo turno/i);
});
