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
require("../banco-habilidades.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../combate.js");
require("../testes-dev.js");

test("ciclo completo da Maestria Nick", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.maestria.nick");

  assert.equal(resultado.status, "aprovado", resultado.mensagem);
  assert.match(resultado.detalhes.join("\n"), /ataque adicional com Nick: nenhum/i);
  assert.match(resultado.detalhes.join("\n"), /preservou a ação bônus/i);
  assert.match(resultado.detalhes.join("\n"), /uso de Nick foi registrado/i);
  assert.match(resultado.detalhes.join("\n"), /ataque adicional: 0/i);
  assert.match(resultado.detalhes.join("\n"), /nova tentativa.*acaoBonus/i);
  assert.match(resultado.detalhes.join("\n"), /disponível no início do turno seguinte/i);
});
