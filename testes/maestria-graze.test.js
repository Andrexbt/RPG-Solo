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

test("ciclo completo da Maestria Graze", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.maestria.graze");

  assert.equal(resultado.status, "aprovado", resultado.mensagem);
  assert.match(resultado.detalhes.join("\n"), /erro do ataque disponibilizou Graze/i);
  assert.match(resultado.detalhes.join("\n"), /Força 16: 3/i);
  assert.match(resultado.detalhes.join("\n"), /Tipo do dano: cortante/i);
  assert.match(resultado.detalhes.join("\n"), /Força 8: 0/i);
  assert.match(resultado.detalhes.join("\n"), /reduziu o alvo a 0 PV/i);
});
