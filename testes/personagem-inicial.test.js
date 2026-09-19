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

test("personagens antigos mantêm seus avatares após a mudança de pasta", () => {
  const personagem = global.PersonagemDados.criarInicial();
  personagem.avatar.imagem = "Imagens/Avatares/aasimar/Female/Aasimar_Female_Cleric.webp";
  personagem.avatar.frame = "Imagens/Avatares/frame/frame-01.webp";

  const normalizado = global.PersonagemDados.normalizar(personagem);

  assert.equal(
    normalizado.avatar.imagem,
    "assets/avatares/aasimar/female/aasimar_female_cleric.webp",
  );
  assert.equal(normalizado.avatar.frame, "assets/avatares/frame/frame-01.webp");
  assert.equal(personagem.avatar.frame, "Imagens/Avatares/frame/frame-01.webp");
});

test("personagens salvos com nomes antigos de avatar passam para minúsculas", () => {
  const personagem = global.PersonagemDados.criarInicial();
  personagem.avatar.imagem = "assets/avatares/aasimar/Male/Aasimar_Male_Wizard.webp";

  const normalizado = global.PersonagemDados.normalizar(personagem);

  assert.equal(normalizado.avatar.imagem, "assets/avatares/aasimar/male/aasimar_male_wizard.webp");
  assert.equal(normalizado.avatar.generoGramatical, "masculino");
});
