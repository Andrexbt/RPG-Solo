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

require("../banco-classes.js");
require("../banco-habilidades.js");
require("../personagem-dados.js");
require("../testes-dev.js");

test("contrato de formação do Guerreiro no nível 1", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.formacao.nivel1");

  assert.equal(resultado.status, "aprovado", resultado.detalhes?.join("\n"));
  assert.match(resultado.detalhes.join("\n"), /Dado de Vida do Guerreiro é d10/i);
  assert.match(resultado.detalhes.join("\n"), /duas perícias de classe/i);
  assert.match(resultado.detalhes.join("\n"), /um Estilo de Luta/i);
  assert.match(resultado.detalhes.join("\n"), /três escolhas de Maestria/i);
  assert.match(resultado.detalhes.join("\n"), /d10 cheio mais o modificador de Constituição/i);
});
