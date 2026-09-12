// =====================================================
// Banco de classes
// -----------------------------------------------------
// Guarda os dados básicos das classes disponíveis na
// criação de personagem. Este arquivo não controla a tela:
// ele apenas fornece informações para os outros scripts.
// =====================================================

window.bancoClasses = {
  // =====================================================
  // Guerreiro
  // =====================================================
  guerreiro: {
    id: "guerreiro",
    nome: "Guerreiro",
    dadoVida: 10,
    habilidadePrimaria: ["Força", "Destreza"],
    salvaguardas: ["forca", "constituicao"],

    // Perícias que o Guerreiro pode escolher no nível 1.
    pericias: {
      quantidade: 2,
      opcoes: [
        "acrobacia",
        "adestrarAnimais",
        "atletismo",
        "historia",
        "intuicao",
        "intimidacao",
        "persuasao",
        "percepcao",
        "sobrevivencia",
      ],
    },

    // Proficiências usadas pela ficha para equipamentos e ataques.
    proficiencias: {
      armas: ["Armas simples", "Armas marciais"],
      armaduras: ["Armaduras leves", "Armaduras médias", "Armaduras pesadas", "Escudos"],
    },

    // Quantidade de armas nas quais a classe pode escolher maestria.
    maestriasArmas: {
      quantidade: 3,
    },

    // Economia própria da criação do RPG Solo.
    // O ouro fixo segue a opção monetária oficial da classe.
    // O orçamento só pode ser usado na loja de equipamentos iniciais.
    economiaInicial: {
      ouroFixo: 155,
      orcamentoEquipamentos: 2015,
      percentualRetencao: 5,
    },

    // Conjuntos oferecidos ao Guerreiro criado no nível 1.
    // Fonte: SRD 5.2.1, página 47.
    equipamentosIniciais: [
      {
        id: "a",
        nome: "Conjunto A",
        itens: [
          { categoria: "armaduras", id: "cotaDeMalha", quantidade: 1 },
          { categoria: "armas", id: "espadaGrande", quantidade: 1 },
          { categoria: "armas", id: "mangual", quantidade: 1 },
          { categoria: "armas", id: "azagaia", quantidade: 8 },
          { categoria: "itensGerais", id: "pacoteExploradorSubterraneo", quantidade: 1 },
        ],
        equipados: {
          armadura: "cotaDeMalha",
          armaPrincipal: "espadaGrande",
          itemSecundario: "nada",
          armaSecundaria: "",
        },
        moedas: { ouro: 4 },
      },
      {
        id: "b",
        nome: "Conjunto B",
        itens: [
          { categoria: "armaduras", id: "couroBatido", quantidade: 1 },
          { categoria: "armas", id: "cimitarra", quantidade: 1 },
          { categoria: "armas", id: "espadaCurta", quantidade: 1 },
          { categoria: "armas", id: "arcoLongo", quantidade: 1 },
          { categoria: "itensGerais", id: "flecha", quantidade: 20 },
          { categoria: "itensGerais", id: "aljava", quantidade: 1 },
          { categoria: "itensGerais", id: "pacoteExploradorSubterraneo", quantidade: 1 },
        ],
        equipados: {
          armadura: "couroBatido",
          armaPrincipal: "cimitarra",
          itemSecundario: "armaSecundaria",
          armaSecundaria: "espadaCurta",
        },
        moedas: { ouro: 11 },
      },
      {
        id: "c",
        nome: "155 peças de ouro",
        itens: [],
        requerCompra: true,
        moedas: { ouro: 155 },
      },
    ],
  },

  // =====================================================
  // Ladino
  // =====================================================
  ladino: {
    id: "ladino",
    nome: "Ladino",
    dadoVida: 8,
    habilidadePrimaria: ["Destreza"],
    salvaguardas: ["destreza", "inteligencia"],

    // Perícias que o Ladino pode escolher no nível 1.
    pericias: {
      quantidade: 4,
      opcoes: [
        "acrobacia",
        "atletismo",
        "enganacao",
        "intuicao",
        "intimidacao",
        "investigacao",
        "percepcao",
        "persuasao",
        "prestidigitacao",
        "furtividade",
      ],
    },

    // O Ladino tem armas simples, espada curta, armadura leve
    // e ferramentas de ladrão.
    proficiencias: {
      armas: ["Armas simples"],
      armasEspecificas: ["espadaCurta"],
      armaduras: ["Armaduras leves"],
      ferramentas: ["Ferramentas de ladrão"],
    },

    maestriasArmas: {
      quantidade: 2,
    },
  },

  // =====================================================
  // Clérigo
  // =====================================================
  clerigo: {
    id: "clerigo",
    nome: "Clérigo",
    dadoVida: 8,
    habilidadePrimaria: ["Sabedoria"],
    salvaguardas: ["sabedoria", "carisma"],

    // Perícias que o Clérigo pode escolher no nível 1.
    pericias: {
      quantidade: 2,
      opcoes: ["historia", "intuicao", "medicina", "persuasao", "religiao"],
    },

    // O Clérigo usa magia divina e tem treinamento defensivo básico.
    proficiencias: {
      armas: ["Armas simples"],
      armaduras: ["Armaduras leves", "Armaduras médias", "Escudos"],
    },
  },
};
