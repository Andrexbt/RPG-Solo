"use strict";

const assert = require("node:assert/strict");

global.window = global;
require("../mensagens-narrativas.js");

const queda = global.obterMensagemJogabilidade(
  "descricoesNarrativas.combate.arremesso.caiuAposErro",
  {
    arma: "Adaga",
    alvo: "Guarda 1",
    coluna: 12,
    linha: 8,
  },
);

assert.deepEqual(queda, {
  acaoAtual: "A Adaga errou o alvo e caiu nas proximidades.",
  solicitacao: "A Adaga passou por Guarda 1 e caiu na coluna 12, linha 8.",
  historicoTitulo: "Adaga caída",
  historicoDescricao: "A arma arremessada errou Guarda 1 e caiu na coluna 12, linha 8.",
});

const cravada = global.obterMensagemJogabilidade("descricoesNarrativas.combate.arremesso.cravada", {
  arma: "Adaga",
  alvo: "Guarda 2",
});

assert.equal(cravada.acaoAtual, "A Adaga ficou cravada no alvo.");
assert.equal(cravada.solicitacao, "A Adaga ficou cravada em Guarda 2.");
assert.equal(global.obterMensagemJogabilidade("combate.evento.inexistente"), null);

assert.equal(
  global.mensagensNarrativas.iniciativa.pedir(2),
  "Role 1d20 + 2 para definir sua posição na ordem do combate.",
);
assert.equal(
  global.mensagensNarrativas.ataque.pedirNormal(5, "Guarda 1"),
  "Role <strong>1d20 + 5</strong> para atacar Guarda 1.",
);
assert.equal(
  global.mensagensNarrativas.dano.acertoNormal("1d4 + 3"),
  "O ataque acertou. Role <strong>1d4 + 3</strong> de dano.",
);

console.log("✓ Catálogo de mensagens de jogabilidade passou.");
