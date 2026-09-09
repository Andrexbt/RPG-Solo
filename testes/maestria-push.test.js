"use strict";

const assert = require("node:assert/strict");

global.window = global;

require("../banco-maestrias.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../combate.js");

function criarContexto({ dominaArma = true, tamanhoAlvo = "medio", bloqueios = [] } = {}) {
  const atacante = {
    id: "guerreiro",
    tipo: "jogador",
    estado: "ativo",
    posicao: { coluna: 5, linha: 5 },
    habilidades: {
      escolhas: {
        maestriasArmas: dominaArma ? ["marteloGuerra"] : ["espadaLonga"],
      },
    },
  };

  const alvo = {
    id: "alvo",
    tipo: "inimigo",
    estado: "ativo",
    tamanho: tamanhoAlvo,
    posicao: { coluna: 6, linha: 5 },
  };

  return {
    atacante,
    alvo,
    ataque: {
      id: "marteloGuerra:principal",
      armaId: "marteloGuerra",
      maestriaId: "push",
    },
    combate: {
      status: "ativo",
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: bloqueios, dificil: [] },
      participantes: [atacante, alvo],
      objetivos: [],
    },
  };
}

function prepararPush(contexto, gatilho = "aposAcertarAtaque") {
  return global.TradutorRegras.prepararOperacoes({
    gatilho,
    participante: contexto.atacante,
    ataque: contexto.ataque,
    alvo: contexto.alvo,
  }).find((operacao) => operacao.tipo === "deslocarAlvo");
}

const contextoValido = criarContexto();
const operacaoValida = prepararPush(contextoValido);

assert.ok(operacaoValida, "um acerto com arma dominada deve oferecer Push");

const resultadoValido = global.SistemaCombate.aplicarDeslocamentoForcado(
  contextoValido.combate,
  operacaoValida,
);

assert.equal(resultadoValido.sucesso, true);
assert.equal(resultadoValido.distanciaPercorrida, 2, "Push deve deslocar até duas células");
assert.deepEqual(contextoValido.alvo.posicao, { coluna: 8, linha: 5 });

assert.equal(
  prepararPush(criarContexto(), "aposErrarAtaque"),
  undefined,
  "um ataque que errou não deve oferecer Push",
);

assert.equal(
  prepararPush(criarContexto({ dominaArma: false })),
  undefined,
  "uma arma não dominada não deve oferecer Push",
);

assert.equal(
  prepararPush(criarContexto({ tamanhoAlvo: "enorme" })),
  undefined,
  "Push não deve afetar uma criatura Enorme",
);

const contextoBloqueado = criarContexto({
  bloqueios: [{ coluna: 7, linha: 5 }],
});
const resultadoBloqueado = global.SistemaCombate.aplicarDeslocamentoForcado(
  contextoBloqueado.combate,
  prepararPush(contextoBloqueado),
);

assert.equal(resultadoBloqueado.aplicado, false);
assert.equal(resultadoBloqueado.distanciaPercorrida, 0);
assert.deepEqual(contextoBloqueado.alvo.posicao, { coluna: 6, linha: 5 });

const contextoParcial = criarContexto({
  bloqueios: [{ coluna: 8, linha: 5 }],
});
const resultadoParcial = global.SistemaCombate.aplicarDeslocamentoForcado(
  contextoParcial.combate,
  prepararPush(contextoParcial),
);

assert.equal(resultadoParcial.distanciaPercorrida, 1, "Push deve parar antes do bloqueio");
assert.deepEqual(contextoParcial.alvo.posicao, { coluna: 7, linha: 5 });

console.log("✓ Maestria Push passou em todos os cenários.");
