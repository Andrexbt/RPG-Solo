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
  querySelectorAll() {
    return [];
  },
};

require("../banco-classes.js");
require("../banco-equipamentos.js");
require("../banco-habilidades.js");
require("../banco-maestrias.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../regras-equipamentos.js");
require("../ficha-personagem.js");
require("../regras-ficha-criacao.js");
require("../testes-dev.js");

test("integra ficha e combate com a proficiência das duas armas", async () => {
  const resultado = await global.TestesDev.executarTeste(
    "guerreiro.integracao.proficiencia-duas-armas",
  );
  const detalhes = resultado.detalhes.join("\n");

  assert.equal(resultado.status, "aprovado", `${resultado.mensagem}\n${detalhes}`);
  assert.match(detalhes, /Guerreiro.*espada curta: 5; cimitarra: 5/i);
  assert.match(detalhes, /Clérigo.*espada curta: 3; cimitarra: 3/i);
  assert.match(detalhes, /duas armas do Guerreiro receberam o bônus de proficiência/i);
  assert.match(detalhes, /não receberam proficiência indevida/i);
});
