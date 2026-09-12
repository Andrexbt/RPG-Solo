"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

global.window = global;
global.location = { hostname: "127.0.0.1" };
const armazenamentoTemporario = new Map();
global.localStorage = {
  getItem(chave) {
    return armazenamentoTemporario.has(chave)
      ? armazenamentoTemporario.get(chave)
      : null;
  },
  setItem(chave, valor) {
    armazenamentoTemporario.set(chave, String(valor));
  },
  removeItem(chave) {
    armazenamentoTemporario.delete(chave);
  },
};
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
require("../personagem-dados.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../regras-equipamentos.js");
require("../ficha-personagem.js");
require("../regras-ficha-criacao.js");
require("../testes-dev.js");

test("continuidade integral do Guerreiro no nível 1", async () => {
  const resultado = await global.TestesDev.executarTeste(
    "guerreiro.continuidade",
  );

  assert.equal(
    resultado.status,
    "aprovado",
    `${resultado.mensagem}\n${resultado.detalhes?.join("\n") ?? ""}`,
  );
});
