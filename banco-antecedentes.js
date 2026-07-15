// =====================================================
// Banco de antecedentes
// -----------------------------------------------------
// Guarda os antecedentes disponíveis na criação de
// personagem. Cada antecedente pode conceder perícias,
// ferramentas, idiomas, talento de origem, equipamento,
// moedas e sugestões de atributos.
// =====================================================

window.bancoAntecedentes = {
  // =====================================================
  // Acólito
  // =====================================================
  acolito: {
    id: "acolito",
    nome: "Acólito",
    descricaoCurta: "Você viveu ligado a um templo, ordem religiosa ou tradição espiritual.",
    pericias: ["intuicao", "religiao"],
    ferramentas: [],

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    talentoOrigem: "iniciadoMagia",
    equipamento: ["simboloSagrado", "livroDeOracoes"],

    moedas: {
      ouro: 15
    },

    atributosSugeridos: ["inteligencia", "sabedoria", "carisma"]
  },

  // =====================================================
  // Soldado
  // =====================================================
  soldado: {
    id: "soldado",
    nome: "Soldado",
    descricaoCurta: "Você teve treinamento militar e experiência em combate.",
    pericias: ["atletismo", "intimidacao"],
    ferramentas: ["jogo"],

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    talentoOrigem: "atacanteSelvagem",
    equipamento: ["insigniaMilitar", "kitExplorador"],

    moedas: {
      ouro: 10
    },

    atributosSugeridos: ["forca", "constituicao", "carisma"]
  },

  // =====================================================
  // Sábio
  // =====================================================
  sabio: {
    id: "sabio",
    nome: "Sábio",
    descricaoCurta: "Você estudou conhecimento, história e teoria.",
    pericias: ["arcanismo", "historia"],
    ferramentas: [],

    idiomas: {
      quantidade: 2,
      fixos: [],
      opcoes: "qualquer"
    },

    talentoOrigem: "iniciadoMagia",
    equipamento: ["livro", "pena", "tinta"],

    moedas: {
      ouro: 8
    },

    atributosSugeridos: ["inteligencia", "sabedoria", "constituicao"]
  },

  // =====================================================
  // Criminoso
  // =====================================================
  criminoso: {
    id: "criminoso",
    nome: "Criminoso",
    descricaoCurta: "Você aprendeu a sobreviver à margem da lei.",
    pericias: ["furtividade", "prestidigitacao"],
    ferramentas: ["ferramentasLadrao"],

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    talentoOrigem: "alerta",
    equipamento: ["ferramentasLadrao", "roupasComuns"],

    moedas: {
      ouro: 15
    },

    atributosSugeridos: ["destreza", "carisma", "inteligencia"]
  }
};
