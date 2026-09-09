"use strict";

const assert = require("node:assert/strict");

global.window = global;
require("../combate.js");

const {
  algumDadoRolouMaximo,
  listarCelulasAdjacentesLivres,
  registrarArmaArremessadaNoChao,
  resolverDestinoArmaArremessada,
  sortearCelulaAdjacenteLivre,
} = global.SistemaCombate;

function criarCombateTeste() {
  return {
    tabuleiro: { colunas: 48, linhas: 27 },
    terreno: { bloqueado: [] },
    participantes: [],
    itensNoChao: [],
  };
}

assert.equal(
  algumDadoRolouMaximo({
    gruposRolados: [{ numeroDeFaces: 4, resultados: [4] }],
  }),
  true,
  "deve reconhecer o valor máximo de um d4",
);

assert.equal(
  algumDadoRolouMaximo({
    gruposRolados: [{ numeroDeFaces: 4, resultados: [3] }],
  }),
  false,
  "não deve confundir um resultado abaixo do máximo",
);

assert.equal(
  algumDadoRolouMaximo({
    gruposRolados: [{ numeroDeFaces: 6, resultados: [2, 6] }],
  }),
  true,
  "basta um dado do grupo alcançar o máximo",
);

assert.equal(
  algumDadoRolouMaximo({ gruposRolados: [] }),
  false,
  "uma rolagem sem dados não possui resultado máximo",
);

const combateLivre = criarCombateTeste();
const centro = { coluna: 10, linha: 10 };
const celulasLivres = listarCelulasAdjacentesLivres(combateLivre, centro);

assert.equal(celulasLivres.length, 8, "uma célula central deve possuir oito vizinhas");
assert.deepEqual(
  sortearCelulaAdjacenteLivre(combateLivre, centro, () => 0),
  celulasLivres[0],
  "zero deve selecionar a primeira célula",
);
assert.deepEqual(
  sortearCelulaAdjacenteLivre(combateLivre, centro, () => 0.999999),
  celulasLivres.at(-1),
  "um valor próximo de um deve selecionar a última célula",
);

const combateComRestricoes = criarCombateTeste();
combateComRestricoes.terreno.bloqueado.push({ coluna: 9, linha: 9 });
combateComRestricoes.participantes.push({
  id: "ocupante",
  estado: "ativo",
  posicao: { coluna: 10, linha: 9 },
});
combateComRestricoes.itensNoChao.push({
  id: "item-existente",
  posicao: { coluna: 11, linha: 9 },
});

const celulasFiltradas = listarCelulasAdjacentesLivres(combateComRestricoes, centro);

assert.equal(celulasFiltradas.length, 5, "deve retirar terreno, participante e item");
assert.equal(
  celulasFiltradas.some(({ coluna, linha }) => linha === 9 && coluna >= 9),
  false,
  "nenhuma das três células indisponíveis deve permanecer",
);

const combateRegistro = criarCombateTeste();
const atacante = { id: "jogador" };
const adaga = {
  armaId: "adaga",
  equipamentoInstanciaId: "adaga:armaSecundaria",
  modoUso: "arremesso",
  nome: "Adaga (arremesso)",
};
const registro = registrarArmaArremessadaNoChao(combateRegistro, atacante, adaga, centro);

assert.equal(registro.sucesso, true, "deve registrar a adaga arremessada");
assert.equal(combateRegistro.itensNoChao.length, 1, "deve criar somente um item");
assert.equal(registro.item.nome, "Adaga", "deve remover o sufixo do modo de uso");
assert.equal(
  Math.max(
    Math.abs(registro.item.posicao.coluna - centro.coluna),
    Math.abs(registro.item.posicao.linha - centro.linha),
  ),
  1,
  "a adaga deve cair em uma célula adjacente",
);

assert.equal(
  registrarArmaArremessadaNoChao(combateRegistro, atacante, adaga, centro).motivo,
  "itemJaEstaNoChao",
  "não deve registrar a mesma arma duas vezes",
);

assert.equal(
  registrarArmaArremessadaNoChao(
    criarCombateTeste(),
    atacante,
    { ...adaga, modoUso: "padrao" },
    centro,
  ).motivo,
  "ataqueNaoEhArremesso",
  "não deve registrar um ataque corpo a corpo como arremesso",
);

function criarContextoDestino() {
  const combate = criarCombateTeste();
  const atacante = {
    id: "jogador",
    estado: "ativo",
    posicao: { coluna: 5, linha: 5 },
  };
  const alvo = {
    id: "guarda-1",
    estado: "ativo",
    posicao: { coluna: 10, linha: 10 },
  };
  const ataque = {
    armaId: "adaga",
    equipamentoInstanciaId: "adaga:armaSecundaria",
    modoUso: "arremesso",
    nome: "Adaga (arremesso)",
  };

  combate.participantes.push(atacante, alvo);
  return { combate, atacante, alvo, ataque };
}

const contextoErro = criarContextoDestino();
const destinoErro = resolverDestinoArmaArremessada({
  ...contextoErro,
  acertou: false,
});
assert.equal(destinoErro.destino, "chao", "um ataque errado deve lançar a adaga ao chão");
assert.equal(contextoErro.combate.itensNoChao.length, 1);

const contextoDanoComum = criarContextoDestino();
const destinoDanoComum = resolverDestinoArmaArremessada({
  ...contextoDanoComum,
  acertou: true,
  resultadoRolagemDano: {
    gruposRolados: [{ numeroDeFaces: 4, resultados: [3] }],
  },
});
assert.equal(
  destinoDanoComum.destino,
  "chao",
  "um acerto sem valor máximo deve lançar a adaga ao chão",
);
assert.equal(contextoDanoComum.combate.itensNoChao.length, 1);
assert.equal(contextoDanoComum.alvo.itensCravados, undefined);

const contextoDanoMaximo = criarContextoDestino();
const destinoDanoMaximo = resolverDestinoArmaArremessada({
  ...contextoDanoMaximo,
  acertou: true,
  resultadoRolagemDano: {
    gruposRolados: [{ numeroDeFaces: 4, resultados: [4] }],
  },
});
assert.equal(destinoDanoMaximo.destino, "alvo", "um acerto com valor máximo deve cravar a adaga");
assert.equal(contextoDanoMaximo.combate.itensNoChao.length, 0);
assert.equal(contextoDanoMaximo.alvo.itensCravados.length, 1);
assert.equal(
  contextoDanoMaximo.alvo.itensCravados[0].equipamentoInstanciaId,
  contextoDanoMaximo.ataque.equipamentoInstanciaId,
);

console.log("✓ Testes de arremesso e itens no chão passaram.");
