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
  clear() {
    armazenamentoTemporario.clear();
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

require("../banco-habilidades.js");
require("../banco-maestrias.js");
require("../mensagens-narrativas.js");
require("../personagem-dados.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../ficha-personagem.js");
require("../combate.js");
require("../sistema-descansos.js");
require("../testes-dev.js");

test("ativação e cura do Segundo Fôlego", async () => {
  const resultado = await global.TestesDev.executarTeste(
    "guerreiro.segundo-folego.basico",
  );

  assert.equal(
    resultado.status,
    "aprovado",
    `${resultado.mensagem}\n${resultado.detalhes.join("\n")}`,
  );
});

test("usos do Segundo Fôlego persistem ao salvar e recarregar", () => {
  localStorage.clear();

  const personagem = global.PersonagemDados.criarInicial();
  personagem.id = "guerreiro-segundo-folego-persistencia";
  personagem.classeId = "guerreiro";
  personagem.nivel = 1;
  personagem.habilidades.recursos.segundoFolego = {
    id: "segundoFolego",
    nome: "Segundo Fôlego",
    usosAtuais: 0,
    usosMaximos: 2,
    recuperacao: {
      descansoCurto: { quantidade: 1 },
      descansoLongo: { restaurarTodos: true },
    },
  };

  const salvo = global.PersonagemDados.adicionarSalvo(personagem);
  const recarregado = global.PersonagemDados.buscarSalvoPorId(personagem.id);

  assert.ok(salvo);
  assert.equal(recarregado.habilidades.recursos.segundoFolego.usosAtuais, 0);
  assert.equal(recarregado.habilidades.recursos.segundoFolego.usosMaximos, 2);

  recarregado.habilidades.recursos.segundoFolego.usosAtuais = 1;
  const atualizado = global.PersonagemDados.atualizarSalvo(recarregado);
  const recarregadoNovamente = global.PersonagemDados.buscarSalvoPorId(
    personagem.id,
  );

  assert.ok(atualizado);
  assert.equal(
    recarregadoNovamente.habilidades.recursos.segundoFolego.usosAtuais,
    1,
  );
  assert.deepEqual(
    recarregadoNovamente.habilidades.recursos.segundoFolego.recuperacao,
    {
      descansoCurto: { quantidade: 1 },
      descansoLongo: { restaurarTodos: true },
    },
  );
});
