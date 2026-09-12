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
require("../combate.js");
require("../testes-dev.js");

test("efeitos dos Estilos de Luta do Guerreiro", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.estilos-luta");
  const detalhes = resultado.detalhes.join("\n");

  assert.equal(resultado.status, "aprovado", `${resultado.mensagem}\n${detalhes}`);
  assert.match(detalhes, /Arquearia acrescenta \+2/i);
  assert.match(detalhes, /Defesa acrescenta \+1/i);
  assert.match(detalhes, /Duelo permite o uso de escudo/i);
  assert.match(detalhes, /Duelo não funciona com outra arma/i);
  assert.match(detalhes, /Combate com Duas Armas mantém o modificador/i);
});
