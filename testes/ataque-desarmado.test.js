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
require("../motor-dados.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../regras-equipamentos.js");
require("../ficha-personagem.js");
require("../regras-ficha-criacao.js");
require("../combate.js");
require("../testes-dev.js");

test("criação e uso do Ataque Desarmado", async () => {
  const resultado = await global.TestesDev.executarTeste(
    "guerreiro.ataque-desarmado",
  );

  assert.equal(
    resultado.status,
    "aprovado",
    `${resultado.mensagem}\n${resultado.detalhes.join("\n")}`,
  );
});
