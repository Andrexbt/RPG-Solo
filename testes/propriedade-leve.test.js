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

test("ciclo completo da propriedade Leve", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.propriedade.leve");
  const detalhes = resultado.detalhes.join("\n");

  assert.equal(resultado.status, "aprovado", `${resultado.mensagem}\n${detalhes}`);
  assert.match(detalhes, /ataque adicional Leve: acaoBonus, dano 0/i);
  assert.match(detalhes, /terceira tentativa: acaoIndisponivel/i);
  assert.match(detalhes, /mesma instância física: acao/i);
  assert.match(detalhes, /segunda instância.*: acaoBonus/i);
  assert.match(detalhes, /Combate com Duas Armas: dano 3/i);
  assert.match(detalhes, /modificador negativo: dano -1/i);
  assert.match(detalhes, /reiniciada no turno seguinte/i);
});
