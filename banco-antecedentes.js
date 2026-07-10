window.bancoAntecedentes = {
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

  criminoso: {
    id: "criminoso",
    nome: "Criminoso",
    descricaoCurta: "Você aprendeu a sobreviver à margem da lei.",
    pericias: ["furtividade", "enganacao"],
    ferramentas: ["ferramentasLadrao"],

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    talentoOrigem: "sortudo",
    equipamento: ["ferramentasLadrao", "roupasComuns"],

    moedas: {
      ouro: 15
    },

    atributosSugeridos: ["destreza", "carisma", "inteligencia"]
  }
};
