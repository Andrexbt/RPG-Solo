"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

global.window = global;

require("../personagem-dados.js");

test("fábrica cria o contrato inicial esperado", () => {
  const personagem = global.PersonagemDados.criarInicial();

  assert.equal(personagem.schemaVersion, 1);
  assert.equal(personagem.rulesVersion, "2024");
  assert.equal(personagem.nivel, 1);
  assert.equal(personagem.xp, 0);
  assert.equal(personagem.classeId, "");
  assert.deepEqual(personagem.niveisPorClasse, {});
  assert.deepEqual(personagem.combate.pontosDeVida, {
    atuais: null,
    temporarios: 0,
    maximo: null,
    dadoVida: "",
    dadosVidaUsados: 0,
  });
  assert.deepEqual(personagem.habilidades, {
    escolhas: {},
    recursos: {},
  });
  assert.deepEqual(personagem.idiomasBase, ["comum"]);
  assert.deepEqual(personagem.pericias, []);
  assert.deepEqual(personagem.combate.ataques, []);
});

test("cada chamada cria um estado completamente independente", () => {
  const primeiro = global.PersonagemDados.criarInicial();
  const segundo = global.PersonagemDados.criarInicial();

  primeiro.classeId = "guerreiro";
  primeiro.idiomasBase.push("anao");
  primeiro.combate.ataques.push({ id: "espadaLonga" });
  primeiro.habilidades.escolhas.estilosDeLuta = "defesa";
  primeiro.detalhes.equipamentos.armadura = "cotaDeMalha";

  assert.notStrictEqual(primeiro, segundo);
  assert.equal(segundo.classeId, "");
  assert.deepEqual(segundo.idiomasBase, ["comum"]);
  assert.deepEqual(segundo.combate.ataques, []);
  assert.deepEqual(segundo.habilidades.escolhas, {});
  assert.equal(segundo.detalhes.equipamentos.armadura, "...");
});
