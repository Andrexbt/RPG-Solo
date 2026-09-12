"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

global.window = global;

require("../personagem-dados.js");

const calcular = global.PersonagemDados.calcularPontosDeVidaIniciais;

test("calcula os PV iniciais do Guerreiro com diferentes valores de Constituição", () => {
  assert.equal(calcular({ dadoVida: 10, constituicao: 8 }), 9);
  assert.equal(calcular({ dadoVida: 10, constituicao: 10 }), 10);
  assert.equal(calcular({ dadoVida: 10, constituicao: 16 }), 13);
});

test("inclui bônus adicionais no cálculo", () => {
  assert.equal(calcular({ dadoVida: 10, constituicao: 14, bonus: 2 }), 14);
});

test("nunca produz menos de 1 PV inicial", () => {
  assert.equal(calcular({ dadoVida: 1, constituicao: 1, bonus: -20 }), 1);
});

test("rejeita entradas obrigatórias ausentes ou inválidas", () => {
  assert.equal(calcular({ dadoVida: 10, constituicao: "" }), null);
  assert.equal(calcular({ dadoVida: 10, constituicao: null }), null);
  assert.equal(calcular({ dadoVida: 10, constituicao: undefined }), null);
  assert.equal(calcular({ dadoVida: 0, constituicao: 10 }), null);
  assert.equal(calcular({ dadoVida: "inválido", constituicao: 10 }), null);
});
