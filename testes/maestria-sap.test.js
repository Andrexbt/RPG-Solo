"use strict";

const assert = require("node:assert/strict");

global.window = global;

require("../banco-maestrias.js");
require("../motor-testes.js");
require("../motor-efeitos.js");
require("../tradutor-regras.js");
require("../combate.js");

const guerreiro = {
  id: "guerreiro",
  habilidades: {
    escolhas: {
      maestriasArmas: ["espadaLonga"],
    },
  },
};

const inimigo = {
  id: "inimigo",
};

const ataque = {
  id: "espadaLonga:principal",
  armaId: "espadaLonga",
  maestriaId: "sap",
};

const operacoes = global.TradutorRegras.prepararOperacoes({
  gatilho: "aposAcertarAtaque",
  participante: guerreiro,
  ataque,
  alvo: inimigo,
});

const operacaoSap = operacoes.find(
  (operacao) => operacao.tipo === "concederDesvantagem" && operacao.origem?.id === "sap",
);

assert.ok(operacaoSap, "um acerto com uma Espada Longa dominada deve produzir a operação de Sap");

const combate = {
  efeitosTemporarios: [],
};

const resultado = global.SistemaCombate.aplicarDesvantagemTemporaria(combate, operacaoSap);

assert.equal(resultado.sucesso, true);
assert.equal(combate.efeitosTemporarios.length, 1);

assert.deepEqual(combate.efeitosTemporarios[0], {
  tipo: "desvantagem",
  participanteId: "inimigo",
  origemParticipanteId: "guerreiro",
  rolagemAfetada: "ataque",
  usosRestantes: 1,
  expiracao: "inicioDoProximoTurnoDoAtacante",
  origem: {
    tipo: "maestria",
    id: "sap",
    nome: "Sap",
  },
});

assert.equal(
  global.TradutorRegras.prepararOperacoes({
    gatilho: "aposErrarAtaque",
    participante: guerreiro,
    ataque,
    alvo: inimigo,
  }).some((operacao) => operacao.origem?.id === "sap"),
  false,
  "um ataque que errou não deve aplicar Sap",
);

const guerreiroCombate = {
  ...guerreiro,
  tipo: "jogador",
  estado: "ativo",
  classeArmadura: 16,
  posicao: { coluna: 5, linha: 5 },
  ataques: [],
  acaoDisponivel: true,
};
const inimigoCombate = {
  ...inimigo,
  tipo: "inimigo",
  estado: "ativo",
  classeArmadura: 12,
  posicao: { coluna: 6, linha: 5 },
  atributos: { forca: 14, destreza: 10 },
  habilidades: { escolhas: {} },
  acaoDisponivel: true,
  ataques: [
    {
      id: "clava",
      armaId: "clava",
      nome: "Clava",
      categoria: "corpoACorpo",
      propriedades: [],
      bonusAtaque: 3,
      custoPadrao: "acao",
      selecao: { tipo: "criatura", alcance: { normal: 1, longo: null } },
      dano: {
        gruposDeDados: [{ quantidade: 1, numeroDeFaces: 4 }],
        modificador: 2,
        tipo: "contundente",
      },
    },
  ],
};
const combateRepeticoes = {
  status: "ativo",
  participanteAtivoId: inimigoCombate.id,
  tabuleiro: { colunas: 12, linhas: 12 },
  terreno: { bloqueado: [], dificil: [] },
  visao: { bloqueios: [], barreiras: [] },
  participantes: [guerreiroCombate, inimigoCombate],
  efeitosTemporarios: [],
  objetivos: [],
};

global.SistemaCombate.aplicarDesvantagemTemporaria(combateRepeticoes, operacaoSap);
global.SistemaCombate.aplicarDesvantagemTemporaria(combateRepeticoes, operacaoSap);

const primeiroAtaque = global.SistemaCombate.prepararAtaque(
  combateRepeticoes,
  inimigoCombate.id,
  guerreiroCombate.id,
  "clava",
);

assert.equal(primeiroAtaque.tipoRolagem, "desvantagem");

global.SistemaCombate.resolverAtaque(combateRepeticoes, {
  gruposRolados: [{ numeroDeFaces: 20, resultados: [17, 4] }],
  modificador: 3,
});

assert.equal(
  combateRepeticoes.efeitosTemporarios.length,
  0,
  "a primeira jogada deve consumir todas as aplicações de Sap que a afetaram",
);

inimigoCombate.acaoDisponivel = true;

const segundoAtaque = global.SistemaCombate.prepararAtaque(
  combateRepeticoes,
  inimigoCombate.id,
  guerreiroCombate.id,
  "clava",
);

assert.equal(
  segundoAtaque.tipoRolagem,
  "normal",
  "Sap não deve causar desvantagem em dois ataques consecutivos",
);

console.log("✓ Aplicação inicial da Maestria Sap passou.");
