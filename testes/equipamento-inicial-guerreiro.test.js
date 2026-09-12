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
};

require("../banco-equipamentos.js");
require("../banco-classes.js");
require("../banco-antecedentes.js");
require("../regras-equipamentos.js");
require("../personagem-dados.js");
require("../testes-dev.js");

test("regra central identifica proficiência com armas", () => {
  const regra = global.RegrasEquipamentos.personagemTemProficienciaComArma;

  assert.equal(regra({ classeId: "guerreiro" }, "adaga"), true);
  assert.equal(regra({ classeId: "guerreiro" }, "espadaGrande"), true);
  assert.equal(regra({ classeId: "ladino" }, "adaga"), true);
  assert.equal(regra({ classeId: "ladino" }, "espadaCurta"), true);
  assert.equal(regra({ classeId: "ladino" }, "espadaGrande"), false);
  assert.equal(regra({ classeId: "inexistente" }, "adaga"), false);
  assert.equal(regra({ classeId: "guerreiro" }, "armaInexistente"), false);
});

test("compatibilidade de arma reúne proficiência e requisito da propriedade Pesada", () => {
  const avaliar = global.RegrasEquipamentos.avaliarUsoArma;

  const espadaInadequada = avaliar(
    { classeId: "guerreiro", atributos: { forca: 12, destreza: 18 } },
    "espadaGrande",
  );
  assert.equal(espadaInadequada.adequado, false);
  assert.match(espadaInadequada.problemas.join(" "), /Força.*menor que 13/i);

  const espadaAdequada = avaliar(
    { classeId: "guerreiro", atributos: { forca: 13, destreza: 8 } },
    "espadaGrande",
  );
  assert.equal(espadaAdequada.adequado, true);

  const arcoInadequado = avaliar(
    { classeId: "guerreiro", atributos: { forca: 18, destreza: 12 } },
    "arcoLongo",
  );
  assert.equal(arcoInadequado.adequado, false);
  assert.match(arcoInadequado.problemas.join(" "), /Destreza.*menor que 13/i);

  const semProficiencia = avaliar(
    { classeId: "ladino", atributos: { forca: 16, destreza: 16 } },
    "espadaLonga",
  );
  assert.equal(semProficiencia.adequado, false);
  assert.match(semProficiencia.problemas.join(" "), /bônus de proficiência/i);
});

test("compatibilidade de armadura reúne treinamento e requisito de Força", () => {
  const avaliar = global.RegrasEquipamentos.avaliarUsoArmadura;

  assert.equal(
    avaliar({ classeId: "guerreiro", atributos: { forca: 13 } }, "cotaDeMalha").adequado,
    true,
  );

  const forcaInsuficiente = avaliar(
    { classeId: "guerreiro", atributos: { forca: 12 } },
    "cotaDeMalha",
  );
  assert.equal(forcaInsuficiente.adequado, false);
  assert.match(forcaInsuficiente.problemas.join(" "), /velocidade.*10 pés/i);

  const semTreinamento = avaliar(
    { classeId: "ladino", atributos: { forca: 16 } },
    "cotaDeMalha",
  );
  assert.equal(semTreinamento.adequado, false);
  assert.match(semTreinamento.problemas.join(" "), /impossibilidade de conjurar/i);
});

test("loja adiciona itens e acumula quantidades no inventário", () => {
  const personagem = global.PersonagemDados.criarInicial();

  global.PersonagemDados.adicionarItemInventario(personagem, {
    categoria: "armas",
    id: "azagaia",
    quantidade: 1,
  });
  global.PersonagemDados.adicionarItemInventario(personagem, {
    categoria: "armas",
    id: "azagaia",
    quantidade: 2,
  });

  assert.deepEqual(personagem.inventario.itens, [
    { categoria: "armas", id: "azagaia", quantidade: 3 },
  ]);
});

test("economia inicial registra orçamento, retenção e ouro fixo sem misturá-los", () => {
  const economiaGuerreiro = global.bancoClasses.guerreiro.economiaInicial;

  assert.deepEqual(economiaGuerreiro, {
    ouroFixo: 155,
    orcamentoEquipamentos: 2015,
    percentualRetencao: 5,
  });

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(global.bancoAntecedentes).map(([id, antecedente]) => [
        id,
        antecedente.ouroInicial,
      ]),
    ),
    {
      acolito: 8,
      soldado: 14,
      sabio: 8,
      criminoso: 16,
    },
  );

  const personagem = global.PersonagemDados.criarInicial();
  assert.deepEqual(personagem.inventario.moedas, { ouro: 0 });
  assert.deepEqual(personagem.economiaCriacao, {
    ouroFixoClasse: 0,
    ouroFixoAntecedente: 0,
    orcamentoEquipamentos: 0,
    saldoOrcamentoEquipamentos: 0,
    percentualRetencao: 0,
    ouroRetidoOrcamento: 0,
    finalizada: false,
  });
  assert.ok(global.bancoEquipamentos.itensGerais.equipamentoAventura);
});

test("concede ouro, ferramenta e Equipamento de Aventura automaticamente", () => {
  const personagem = global.PersonagemDados.criarInicial();

  global.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe: global.bancoClasses.guerreiro,
    antecedente: global.bancoAntecedentes.soldado,
  });

  assert.equal(personagem.inventario.moedas.ouro, 169);
  assert.deepEqual(personagem.economiaCriacao, {
    ouroFixoClasse: 155,
    ouroFixoAntecedente: 14,
    orcamentoEquipamentos: 2015,
    saldoOrcamentoEquipamentos: 2015,
    percentualRetencao: 5,
    ouroRetidoOrcamento: 0,
    finalizada: false,
  });
  assert.deepEqual(
    personagem.inventario.itens.map(({ categoria, id, quantidade, origem }) => ({
      categoria,
      id,
      quantidade,
      origem,
    })),
    [
      {
        categoria: "itensGerais",
        id: "equipamentoAventura",
        quantidade: 1,
        origem: "concessaoInicial",
      },
      {
        categoria: "itensGerais",
        id: "conjuntoJogos",
        quantidade: 1,
        origem: "concessaoInicial",
      },
    ],
  );
});

test("trocar o antecedente substitui concessões sem apagar compras", () => {
  const personagem = global.PersonagemDados.criarInicial();

  global.PersonagemDados.adicionarItemInventario(personagem, {
    categoria: "armas",
    id: "espadaLonga",
    quantidade: 1,
  });
  global.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe: global.bancoClasses.guerreiro,
    antecedente: global.bancoAntecedentes.soldado,
  });
  global.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe: global.bancoClasses.guerreiro,
    antecedente: global.bancoAntecedentes.criminoso,
  });

  assert.equal(personagem.inventario.moedas.ouro, 171);
  assert.ok(
    personagem.inventario.itens.some(
      (item) => item.id === "espadaLonga" && !item.origem,
    ),
  );
  assert.ok(personagem.inventario.itens.some((item) => item.id === "ferramentasLadrao"));
  assert.ok(!personagem.inventario.itens.some((item) => item.id === "conjuntoJogos"));
  assert.equal(
    personagem.inventario.itens.filter((item) => item.id === "equipamentoAventura").length,
    1,
  );
});

test("compras e devoluções atualizam orçamento e retenção", () => {
  const personagem = global.PersonagemDados.criarInicial();
  global.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe: global.bancoClasses.guerreiro,
    antecedente: global.bancoAntecedentes.soldado,
  });

  const compra = global.PersonagemDados.comprarEquipamentoInicial(personagem, {
    categoria: "armaduras",
    id: "placas",
    precoPO: 1500,
  });

  assert.equal(compra.sucesso, true);
  assert.equal(personagem.economiaCriacao.saldoOrcamentoEquipamentos, 515);
  assert.equal(personagem.economiaCriacao.ouroRetidoOrcamento, 25);
  assert.equal(personagem.inventario.moedas.ouro, 169);

  const devolucao = global.PersonagemDados.devolverEquipamentoInicial(personagem, {
    categoria: "armaduras",
    id: "placas",
  });

  assert.equal(devolucao.sucesso, true);
  assert.equal(devolucao.reembolso, 1500);
  assert.equal(personagem.economiaCriacao.saldoOrcamentoEquipamentos, 2015);
  assert.equal(personagem.economiaCriacao.ouroRetidoOrcamento, 100);
  assert.ok(!personagem.inventario.itens.some((item) => item.id === "placas"));
});

test("loja recusa compra acima do orçamento", () => {
  const personagem = global.PersonagemDados.criarInicial();
  global.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe: global.bancoClasses.guerreiro,
  });

  const resultado = global.PersonagemDados.comprarEquipamentoInicial(personagem, {
    categoria: "armaduras",
    id: "placasEmDobro",
    precoPO: 3000,
  });

  assert.deepEqual(resultado, { sucesso: false, motivo: "saldo-insuficiente" });
  assert.equal(personagem.economiaCriacao.saldoOrcamentoEquipamentos, 2015);
});

test("finalização transfere a retenção uma única vez para as moedas", () => {
  const personagem = global.PersonagemDados.criarInicial();
  global.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe: global.bancoClasses.guerreiro,
    antecedente: global.bancoAntecedentes.soldado,
  });
  global.PersonagemDados.comprarEquipamentoInicial(personagem, {
    categoria: "armaduras",
    id: "placas",
    precoPO: 1500,
  });

  global.PersonagemDados.finalizarEconomiaCriacao(personagem);
  assert.equal(personagem.inventario.moedas.ouro, 194);
  assert.equal(personagem.economiaCriacao.finalizada, true);

  global.PersonagemDados.finalizarEconomiaCriacao(personagem);
  assert.equal(personagem.inventario.moedas.ouro, 194);
});

test("configuração inicial persiste ao normalizar e não compartilha referências", () => {
  const personagem = global.PersonagemDados.criarInicial();
  personagem.configuracaoInicialCombate = {
    armadura: { categoria: "armaduras", id: "cotaDeMalha" },
    mao1: { categoria: "armas", id: "espadaGrande" },
    mao2: { ocupadaPor: "mao1" },
  };

  const recarregado = global.PersonagemDados.normalizar(personagem);

  assert.deepEqual(recarregado.configuracaoInicialCombate, personagem.configuracaoInicialCombate);
  assert.notStrictEqual(recarregado.configuracaoInicialCombate, personagem.configuracaoInicialCombate);
  assert.notStrictEqual(
    recarregado.configuracaoInicialCombate.mao1,
    personagem.configuracaoInicialCombate.mao1,
  );
});

test("normalização acrescenta configuração vazia a personagens antigos", () => {
  const personagemAntigo = global.PersonagemDados.criarInicial();
  delete personagemAntigo.configuracaoInicialCombate;

  const normalizado = global.PersonagemDados.normalizar(personagemAntigo);

  assert.deepEqual(normalizado.configuracaoInicialCombate, {
    armadura: null,
    mao1: null,
    mao2: null,
  });
});

test("Laboratório DEV audita a nova economia e configuração inicial", async () => {
  const resultado = await global.TestesDev.executarTeste("guerreiro.equipamentoInicial");

  assert.equal(resultado.status, "aprovado", resultado.detalhes?.join("\n"));
  assert.match(resultado.detalhes.join("\n"), /orçamento exclusivo/i);
  assert.match(resultado.detalhes.join("\n"), /persiste após recarregamento/i);
});
