// =====================================================
// Banco de equipamentos
// -----------------------------------------------------
// Guarda armaduras, armas e itens secundários usados na
// criação e na ficha do personagem. Este arquivo contém
// apenas dados; os cálculos de CA, ataque e dano ficam nos
// scripts de ficha/criação.
// =====================================================

window.bancoEquipamentos = {
  // =====================================================
  // Armaduras
  // -----------------------------------------------------
  // caBase: valor inicial da Classe de Armadura.
  // usaDestreza: indica se o modificador de Destreza entra.
  // limiteDestreza: limite máximo do modificador, quando houver.
  // =====================================================
  armaduras: {
    semArmadura: {
      nome: "Sem armadura",
      caBase: 10,
      usaDestreza: true,
      limiteDestreza: null,
      desvantagemFurtividade: false,
    },

    couro: {
      nome: "Armadura de couro",
      caBase: 11,
      usaDestreza: true,
      limiteDestreza: null,
      desvantagemFurtividade: false,
    },

    cotaDeMalha: {
      nome: "Cota de malha",
      caBase: 16,
      usaDestreza: false,
      limiteDestreza: 0,
      desvantagemFurtividade: true,
    },
  },

  // =====================================================
  // Armas
  // -----------------------------------------------------
  // tipo define proficiência simples/marcial.
  // categoria separa corpo a corpo de distância.
  // maestria aponta para banco-maestrias.js.
  // propriedades aponta para banco-propriedades-armas.js.
  // =====================================================
  armas: {
    espadaLonga: {
      nome: "Espada longa",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "sap",
      propriedades: ["versatil"],
    },

    machadoDeBatalha: {
      nome: "Machado de batalha",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "topple",
      propriedades: ["versatil"],
    },

    lanca: {
      nome: "Lança",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "sap",
      propriedades: ["arremesso", "versatil"],
    },

    arcoLongo: {
      nome: "Arco longo",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "slow",
      propriedades: ["pesada", "duasMaos", "municao"],
    },

    espadaCurta: {
      nome: "Espada curta",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["leve", "acuidade"],
    },

    adaga: {
      nome: "Adaga",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "perfurante",
      maestria: "nick",
      propriedades: ["leve", "arremesso", "acuidade"],
    },

    bordao: {
      nome: "Bordão",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "contundente",
      maestria: "topple",
      propriedades: ["versatil"],
    },

    arcoCurto: {
      nome: "Arco curto",
      tipo: "simples",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["duasMaos", "municao"],
    },

    machadoGrande: {
  nome: "Machado grande",

  tipo: "marcial",

  categoria: "corpo-a-corpo",

  atributoAtaque: "forca",

  dano: "1d12",

  tipoDano: "cortante",

  maestria: "cleave",

  propriedades: [
    "pesada",
    "duasMaos",
  ],
},

espadaGrande: {
  nome: "Espada grande",

  tipo: "marcial",

  categoria: "corpo-a-corpo",

  atributoAtaque: "forca",

  dano: "2d6",

  tipoDano: "cortante",

  maestria: "graze",

  propriedades: [
    "pesada",
    "duasMaos",
  ],
},

marteloDeGuerra: {
  nome: "Martelo de guerra",

  tipo: "marcial",

  categoria: "corpo-a-corpo",

  atributoAtaque: "forca",

  dano: "1d8",

  tipoDano: "contundente",

  maestria: "push",

  propriedades: [
    "versatil",
  ],
},
  },

  // =====================================================
  // Itens secundários
  // -----------------------------------------------------
  // Representam o que o personagem usa na outra mão.
  // Escudo altera CA; arma secundária ativa regras de duas armas.
  // =====================================================
  itensSecundarios: {
    escudo: {
      nome: "Escudo",
      bonusCA: 2,
    },

    armaSecundaria: {
      nome: "Arma secundária",
      bonusCA: 0,
    },

    nada: {
      nome: "Nada",
      bonusCA: 0,
    },
  },

  // =====================================================
  // Itens gerais
  // -----------------------------------------------------
  // Guarda equipamentos de aventura, ferramentas e
  // objetos concedidos durante a criação do personagem.
  // =====================================================
  itensGerais: {
    suprimentosCaligrafo: {
      nome: "Suprimentos de calígrafo",
    },

    livroOracoes: {
      nome: "Livro de orações",
    },

    simboloSagrado: {
      nome: "Símbolo sagrado",
    },

    pergaminho: {
      nome: "Pergaminho",
    },

    veste: {
      nome: "Veste",
    },

    ferramentasLadrao: {
      nome: "Ferramentas de ladrão",
    },

    peDeCabra: {
      nome: "Pé de cabra",
    },

    bolsa: {
      nome: "Bolsa",
    },

    roupasViajante: {
      nome: "Roupas de viajante",
    },

    livroHistoria: {
      nome: "Livro de história",
    },

    flecha: {
      nome: "Flecha",
    },

    conjuntoJogos: {
      nome: "Conjunto de jogos",
    },

    kitCurandeiro: {
      nome: "Kit de curandeiro",
    },

    aljava: {
      nome: "Aljava",
    },
  },
};
