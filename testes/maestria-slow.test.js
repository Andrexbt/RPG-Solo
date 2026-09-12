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

test("ciclo completo da Maestria Slow", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.maestria.slow");

  assert.equal(resultado.status, "aprovado", resultado.mensagem);
  assert.match(resultado.detalhes.join("\n"), /após Slow: 4 de 6/i);
  assert.match(resultado.detalhes.join("\n"), /segunda aplicação não acumulou/i);
  assert.match(resultado.detalhes.join("\n"), /expirou no início do próximo turno/i);
  assert.match(resultado.detalhes.join("\n"), /movimento restaurado.*6 células/i);
  assert.match(resultado.detalhes.join("\n"), /arma não dominada não ativou Slow/i);
});
