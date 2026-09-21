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
  // Fonte: SRD 5.2.1, páginas 89–92. Valores monetários em PO;
  // peso em libras (lb) e alcance em pés, como na tabela oficial.
  // Campos novos são dados de referência: não implicam automação no motor.
  armaduras: {
    semArmadura: {
      nome: "Sem Armadura",
      categoria: "nenhuma",
      caBase: 10,
      usaDestreza: true,
      limiteDestreza: null,
      desvantagemFurtividade: false,
    },
    acolchoada: {
      nome: "Armadura Acolchoada",
      categoria: "leve",
      caBase: 11,
      usaDestreza: true,
      limiteDestreza: null,
      desvantagemFurtividade: true,
      forcaMinima: null,
      pesoLb: 8,
      precoPO: 5,
      tempoVestirMinutos: 1,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/acolchoada.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/acolchoada.webp" },
      },
    },
    couro: {
      nome: "Armadura de Couro",
      categoria: "leve",
      caBase: 11,
      usaDestreza: true,
      limiteDestreza: null,
      desvantagemFurtividade: false,
      forcaMinima: null,
      pesoLb: 10,
      precoPO: 10,
      tempoVestirMinutos: 1,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/couro.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/couro.webp" },
      },
    },
    couroBatido: {
      nome: "Armadura de Couro Batido",
      categoria: "leve",
      caBase: 12,
      usaDestreza: true,
      limiteDestreza: null,
      desvantagemFurtividade: false,
      forcaMinima: null,
      pesoLb: 13,
      precoPO: 45,
      tempoVestirMinutos: 1,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/couro-batido.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/couro-batido.webp" },
      },
    },
    gibaoDePeles: {
      nome: "Gibão de Peles",
      categoria: "media",
      caBase: 12,
      usaDestreza: true,
      limiteDestreza: 2,
      desvantagemFurtividade: false,
      forcaMinima: null,
      pesoLb: 12,
      precoPO: 10,
      tempoVestirMinutos: 5,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/gibao-de-peles.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/gibao-de-peles.webp" },
      },
    },
    camisaDeMalha: {
      nome: "Camisa de Malha",
      categoria: "media",
      caBase: 13,
      usaDestreza: true,
      limiteDestreza: 2,
      desvantagemFurtividade: false,
      forcaMinima: null,
      pesoLb: 20,
      precoPO: 50,
      tempoVestirMinutos: 5,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/camisa-de-malha.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/camisa-de-malha.webp" },
      },
    },
    brunea: {
      nome: "Brunea",
      categoria: "media",
      caBase: 14,
      usaDestreza: true,
      limiteDestreza: 2,
      desvantagemFurtividade: true,
      forcaMinima: null,
      pesoLb: 45,
      precoPO: 50,
      tempoVestirMinutos: 5,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/brunea.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/brunea.webp" },
      },
    },
    peitoral: {
      nome: "Peitoral",
      categoria: "media",
      caBase: 14,
      usaDestreza: true,
      limiteDestreza: 2,
      desvantagemFurtividade: false,
      forcaMinima: null,
      pesoLb: 20,
      precoPO: 400,
      tempoVestirMinutos: 5,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/peitoral.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/peitoral.webp" },
      },
    },
    meiaArmadura: {
      nome: "Meia Armadura",
      categoria: "media",
      caBase: 15,
      usaDestreza: true,
      limiteDestreza: 2,
      desvantagemFurtividade: true,
      forcaMinima: null,
      pesoLb: 40,
      precoPO: 750,
      tempoVestirMinutos: 5,
      tempoRemoverMinutos: 1,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/meia-armadura.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/meia-armadura.webp" },
      },
    },
    cotaDeAneis: {
      nome: "Cota de Anéis",
      categoria: "pesada",
      caBase: 14,
      usaDestreza: false,
      limiteDestreza: 0,
      desvantagemFurtividade: true,
      forcaMinima: null,
      pesoLb: 40,
      precoPO: 30,
      tempoVestirMinutos: 10,
      tempoRemoverMinutos: 5,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/cota-de-aneis.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/cota-de-aneis.webp" },
      },
    },
    cotaDeMalha: {
      nome: "Cota de Malha",
      categoria: "pesada",
      caBase: 16,
      usaDestreza: false,
      limiteDestreza: 0,
      desvantagemFurtividade: true,
      forcaMinima: 13,
      pesoLb: 55,
      precoPO: 75,
      tempoVestirMinutos: 10,
      tempoRemoverMinutos: 5,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/cota-de-malha.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/cota-de-malha.webp" },
      },
    },
    cotaDeTalas: {
      nome: "Cota de Talas",
      categoria: "pesada",
      caBase: 17,
      usaDestreza: false,
      limiteDestreza: 0,
      desvantagemFurtividade: true,
      forcaMinima: 15,
      pesoLb: 60,
      precoPO: 200,
      tempoVestirMinutos: 10,
      tempoRemoverMinutos: 5,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/cota-de-talas.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/cota-de-talas.webp" },
      },
    },
    placas: {
      nome: "Armadura de Placas",
      categoria: "pesada",
      caBase: 18,
      usaDestreza: false,
      limiteDestreza: 0,
      desvantagemFurtividade: true,
      forcaMinima: 15,
      pesoLb: 65,
      precoPO: 1500,
      tempoVestirMinutos: 10,
      tempoRemoverMinutos: 5,
      visual: {
        icone: { src: "assets/equipamentos/armaduras/placas.webp" },
        vitrine: { src: "assets/equipamentos/armaduras/vitrine/placas.webp" },
      },
    },
  },

  armas: {
    clava: {
      nome: "Clava",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "contundente",
      maestria: "slow",
      propriedades: ["leve"],
      pesoLb: 2,
      precoPO: 0.1,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/clava.webp",
        },
      },
    },
    adaga: {
      nome: "Adaga",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "perfurante",
      maestria: "nick",
      propriedades: ["acuidade", "leve", "arremesso"],
      pesoLb: 1,
      precoPO: 2,
      alcanceCorpoACorpoPes: 5,
      alcanceDistanciaPes: { normal: 20, longo: 60 },
      arremesso: {
        podeFicarCravada: true,
      },
      visual: {
        icone: {
          src: "assets/equipamentos/armas/adaga.webp",
        },
        arremesso: {
          src: "assets/equipamentos/armas/adaga.webp",
          tamanhoEmCelulas: 1,
          anguloBase: 90,
          rotacoesDuranteVoo: 1,
          duracaoMs: 700,
        },
      },
    },
    clavaGrande: {
      nome: "Clava Grande",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "contundente",
      maestria: "push",
      propriedades: ["duasMaos"],
      pesoLb: 10,
      precoPO: 0.2,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/clava-grande-v2.webp",
        },
      },
    },
    machadinha: {
      nome: "Machadinha",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "cortante",
      maestria: "vex",
      propriedades: ["leve", "arremesso"],
      pesoLb: 2,
      precoPO: 5,
      alcanceCorpoACorpoPes: 5,
      alcanceDistanciaPes: {
        normal: 20,
        longo: 60,
      },
      arremesso: {
        podeFicarCravada: true,
      },
      visual: {
        icone: { src: "assets/equipamentos/armas/machadinha.webp" },
        arremesso: {
          src: "assets/equipamentos/armas/machadinha.webp",
          tamanhoEmCelulas: 1.5,
          anguloBase: 90,
          rotacoesDuranteVoo: 2,
          duracaoMs: 800,
        },
      },
    },
    azagaia: {
      nome: "Azagaia",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "slow",
      propriedades: ["arremesso"],
      pesoLb: 2,
      precoPO: 0.5,
      alcanceCorpoACorpoPes: 5,
      alcanceDistanciaPes: {
        normal: 30,
        longo: 120,
      },
      arremesso: {
        podeFicarCravada: true,
      },
      visual: {
        icone: { src: "assets/equipamentos/armas/azagaia-v3.webp" },
        arremesso: {
          src: "assets/equipamentos/armas/azagaia-v3.webp",
          tamanhoEmCelulas: 1.5,
          anguloBase: 90,
          rotacoesDuranteVoo: 0,
          duracaoMs: 700,
        },
      },
    },
    marteloLeve: {
      nome: "Martelo Leve",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "contundente",
      maestria: "nick",
      propriedades: ["leve", "arremesso"],
      pesoLb: 2,
      precoPO: 2,
      alcanceCorpoACorpoPes: 5,
      alcanceDistanciaPes: {
        normal: 20,
        longo: 60,
      },
      arremesso: {
        podeFicarCravada: false,
      },
      visual: {
        icone: { src: "assets/equipamentos/armas/martelo-leve-v3.webp" },
        arremesso: {
          src: "assets/equipamentos/armas/martelo-leve-v3.webp",
          tamanhoEmCelulas: 1.5,
          anguloBase: 90,
          rotacoesDuranteVoo: 2,
          duracaoMs: 800,
        },
      },
    },
    maca: {
      nome: "Maça",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "contundente",
      maestria: "sap",
      propriedades: [],
      pesoLb: 4,
      precoPO: 5,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/maca-v2.webp",
        },
      },
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
      pesoLb: 4,
      precoPO: 0.2,
      alcanceCorpoACorpoPes: 5,
      danoVersatil: "1d8",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/bordao-v2.webp",
        },
      },
    },
    foice: {
      nome: "Foice",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "cortante",
      maestria: "nick",
      propriedades: ["leve"],
      pesoLb: 2,
      precoPO: 1,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/foice.webp",
        },
      },
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
      pesoLb: 3,
      precoPO: 1,
      alcanceCorpoACorpoPes: 5,
      alcanceDistanciaPes: {
        normal: 20,
        longo: 60,
      },
      danoVersatil: "1d8",
      arremesso: {
        podeFicarCravada: true,
      },
      visual: {
        icone: { src: "assets/equipamentos/armas/lanca-v4.webp" },
        arremesso: {
          src: "assets/equipamentos/armas/lanca-v4.webp",
          tamanhoEmCelulas: 2,
          anguloBase: 90,
          rotacoesDuranteVoo: 0,
          duracaoMs: 780,
        },
      },
    },
    dardo: {
      nome: "Dardo",
      tipo: "simples",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d4",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["acuidade", "arremesso"],
      pesoLb: 0.25,
      precoPO: 0.05,
      alcanceDistanciaPes: {
        normal: 20,
        longo: 60,
      },
      arremesso: {
        podeFicarCravada: true,
      },
      visual: {
        icone: { src: "assets/equipamentos/armas/dardos-conjunto-v2.webp" },
        arremesso: {
          src: "assets/equipamentos/armas/dardo.webp",
          tamanhoEmCelulas: 1,
          anguloBase: 90,
          rotacoesDuranteVoo: 0,
          duracaoMs: 560,
        },
      },
    },
    bestaLeve: {
      nome: "Besta Leve",
      tipo: "simples",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "slow",
      propriedades: ["municao", "recarga", "duasMaos"],
      pesoLb: 5,
      precoPO: 25,
      alcanceDistanciaPes: {
        normal: 80,
        longo: 320,
      },
      municaoId: "virote",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/besta-leve.webp",
        },
      },
    },
    arcoCurto: {
      nome: "Arco Curto",
      tipo: "simples",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["municao", "duasMaos"],
      pesoLb: 2,
      precoPO: 25,
      alcanceDistanciaPes: {
        normal: 80,
        longo: 320,
      },
      municaoId: "flecha",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/arco-curto.webp",
        },
      },
    },
    funda: {
      nome: "Funda",
      tipo: "simples",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d4",
      tipoDano: "contundente",
      maestria: "slow",
      propriedades: ["municao"],
      pesoLb: 0,
      precoPO: 0.1,
      alcanceDistanciaPes: {
        normal: 30,
        longo: 120,
      },
      municaoId: "balaFunda",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/funda.webp",
        },
      },
    },
    machadoDeBatalha: {
      nome: "Machado de Batalha",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "topple",
      propriedades: ["versatil"],
      pesoLb: 4,
      precoPO: 10,
      alcanceCorpoACorpoPes: 5,
      danoVersatil: "1d10",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/machado-de-batalha.webp",
        },
      },
    },
    mangual: {
      nome: "Mangual",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "contundente",
      maestria: "sap",
      propriedades: [],
      pesoLb: 2,
      precoPO: 10,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/mangual.webp",
        },
      },
    },
    glaive: {
      nome: "Glaive",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d10",
      tipoDano: "cortante",
      maestria: "graze",
      propriedades: ["pesada", "alcance", "duasMaos"],
      pesoLb: 6,
      precoPO: 20,
      alcanceCorpoACorpoPes: 10,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/glaive-v2.webp",
        },
      },
    },
    machadoGrande: {
      nome: "Machado Grande",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d12",
      tipoDano: "cortante",
      maestria: "cleave",
      propriedades: ["pesada", "duasMaos"],
      pesoLb: 7,
      precoPO: 30,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/machado-grande.webp",
        },
      },
    },
    espadaGrande: {
      nome: "Espada Grande",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "2d6",
      tipoDano: "cortante",
      maestria: "graze",
      propriedades: ["pesada", "duasMaos"],
      pesoLb: 6,
      precoPO: 50,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/espada-grande-v2.webp",
        },
      },
    },
    alabarda: {
      nome: "Alabarda",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d10",
      tipoDano: "cortante",
      maestria: "cleave",
      propriedades: ["pesada", "alcance", "duasMaos"],
      pesoLb: 6,
      precoPO: 20,
      alcanceCorpoACorpoPes: 10,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/alabarda-v2.webp",
        },
      },
    },
    lancaDeMontaria: {
      nome: "Lança de Montaria",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d10",
      tipoDano: "perfurante",
      maestria: "topple",
      propriedades: ["pesada", "alcance", "duasMaos"],
      pesoLb: 6,
      precoPO: 10,
      alcanceCorpoACorpoPes: 10,
      duasMaosExcetoMontado: true,
      visual: { icone: { src: "assets/equipamentos/armas/lanca-de-montaria.webp" } },
    },
    espadaLonga: {
      nome: "Espada Longa",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "sap",
      propriedades: ["versatil"],
      pesoLb: 3,
      precoPO: 15,
      alcanceCorpoACorpoPes: 5,
      danoVersatil: "1d10",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/espada-longa.webp",
        },
      },
    },
    malho: {
      nome: "Malho",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "2d6",
      tipoDano: "contundente",
      maestria: "topple",
      propriedades: ["pesada", "duasMaos"],
      pesoLb: 10,
      precoPO: 10,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/malho-v3.webp",
        },
      },
    },
    macaEstrela: {
      nome: "Maça-Estrela",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "sap",
      propriedades: [],
      pesoLb: 4,
      precoPO: 15,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/maca-estrela-v2.webp",
        },
      },
    },
    pique: {
      nome: "Pique",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d10",
      tipoDano: "perfurante",
      maestria: "push",
      propriedades: ["pesada", "alcance", "duasMaos"],
      pesoLb: 18,
      precoPO: 5,
      alcanceCorpoACorpoPes: 10,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/pique-v3.webp",
        },
      },
    },
    rapieira: {
      nome: "Rapieira",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["acuidade"],
      pesoLb: 2,
      precoPO: 25,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/rapieira.webp",
        },
      },
    },
    cimitarra: {
      nome: "Cimitarra",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "cortante",
      maestria: "nick",
      propriedades: ["acuidade", "leve"],
      pesoLb: 3,
      precoPO: 25,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/cimitarra.webp",
        },
      },
    },
    espadaCurta: {
      nome: "Espada Curta",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["acuidade", "leve"],
      pesoLb: 2,
      precoPO: 10,
      alcanceCorpoACorpoPes: 5,
      visual: {
        icone: {
          src: "assets/equipamentos/armas/espada-curta.webp",
        },
      },
    },
    tridente: {
      nome: "Tridente",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "topple",
      propriedades: ["arremesso", "versatil"],
      pesoLb: 4,
      precoPO: 5,
      alcanceCorpoACorpoPes: 5,
      alcanceDistanciaPes: {
        normal: 20,
        longo: 60,
      },
      danoVersatil: "1d10",
      arremesso: {
        podeFicarCravada: true,
      },
      visual: {
        icone: { src: "assets/equipamentos/armas/tridente-v2.webp" },
        arremesso: {
          src: "assets/equipamentos/armas/tridente-v2.webp",
          tamanhoEmCelulas: 2,
          anguloBase: 90,
          rotacoesDuranteVoo: 0,
          duracaoMs: 820,
        },
      },
    },
    marteloDeGuerra: {
      nome: "Martelo de Guerra",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "contundente",
      maestria: "push",
      propriedades: ["versatil"],
      pesoLb: 5,
      precoPO: 15,
      alcanceCorpoACorpoPes: 5,
      danoVersatil: "1d10",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/martelo-de-guerra-v3.webp",
        },
      },
    },
    picaretaDeGuerra: {
      nome: "Picareta de Guerra",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "sap",
      propriedades: ["versatil"],
      pesoLb: 2,
      precoPO: 5,
      alcanceCorpoACorpoPes: 5,
      danoVersatil: "1d10",
      visual: {
        icone: {
          src: "assets/equipamentos/armas/picareta-de-guerra-v2.webp",
        },
      },
    },
    chicote: {
      nome: "Chicote",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "cortante",
      maestria: "slow",
      propriedades: ["acuidade", "alcance"],
      pesoLb: 3,
      precoPO: 2,
      alcanceCorpoACorpoPes: 10,
      visual: { icone: { src: "assets/equipamentos/armas/chicote.webp" } },
    },
    zarabatana: {
      nome: "Zarabatana",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["municao", "recarga"],
      pesoLb: 1,
      precoPO: 10,
      alcanceDistanciaPes: {
        normal: 25,
        longo: 100,
      },
      municaoId: "agulha",
      visual: { icone: { src: "assets/equipamentos/armas/zarabatana-v3.webp" } },
    },
    bestaDeMao: {
      nome: "Besta de Mão",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["municao", "leve", "recarga"],
      pesoLb: 3,
      precoPO: 75,
      alcanceDistanciaPes: {
        normal: 30,
        longo: 120,
      },
      municaoId: "virote",
      visual: { icone: { src: "assets/equipamentos/armas/besta-de-mao-v2.webp" } },
    },
    bestaPesada: {
      nome: "Besta Pesada",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d10",
      tipoDano: "perfurante",
      maestria: "push",
      propriedades: ["municao", "pesada", "recarga", "duasMaos"],
      pesoLb: 18,
      precoPO: 50,
      alcanceDistanciaPes: {
        normal: 100,
        longo: 400,
      },
      municaoId: "virote",
      visual: { icone: { src: "assets/equipamentos/armas/besta-pesada.webp" } },
    },
    arcoLongo: {
      nome: "Arco Longo",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "slow",
      propriedades: ["municao", "pesada", "duasMaos"],
      pesoLb: 2,
      precoPO: 50,
      alcanceDistanciaPes: {
        normal: 150,
        longo: 600,
      },
      municaoId: "flecha",
      visual: { icone: { src: "assets/equipamentos/armas/arco-longo.webp" } },
    },
    mosquete: {
      nome: "Mosquete",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d12",
      tipoDano: "perfurante",
      maestria: "slow",
      propriedades: ["municao", "recarga", "duasMaos"],
      pesoLb: 10,
      precoPO: 500,
      alcanceDistanciaPes: {
        normal: 40,
        longo: 120,
      },
      municaoId: "balaArmaFogo",
      visual: { icone: { src: "assets/equipamentos/armas/mosquete-v2.webp" } },
    },
    pistola: {
      nome: "Pistola",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d10",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["municao", "recarga"],
      pesoLb: 3,
      precoPO: 250,
      alcanceDistanciaPes: {
        normal: 30,
        longo: 90,
      },
      municaoId: "balaArmaFogo",
      visual: { icone: { src: "assets/equipamentos/armas/pistola.webp" } },
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
      pesoLb: 6,
      precoPO: 10,
      acaoVestirRemover: "utilizar",
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
    equipamentoAventura: {
      nome: "Equipamento de Aventura",
      descricao:
        "Conjunto inicial comum a todo aventureiro. Seu conteúdo será detalhado em uma etapa futura.",
    },

    virote: {
      nome: "Virote de Besta",
    },

    balaFunda: {
      nome: "Bala de Funda",
    },

    agulha: {
      nome: "Agulha de Zarabatana",
    },

    balaArmaFogo: {
      nome: "Bala de Arma de Fogo",
    },

    suprimentosCaligrafo: {
      nome: "Suprimentos de Calígrafo",
    },

    livroOracoes: {
      nome: "Livro de Orações",
    },

    simboloSagrado: {
      nome: "Símbolo Sagrado",
    },

    pergaminho: {
      nome: "Pergaminho",
    },

    veste: {
      nome: "Veste",
    },

    ferramentasLadrao: {
      nome: "Ferramentas de Ladrão",
    },

    peDeCabra: {
      nome: "Pé de Cabra",
    },

    bolsa: {
      nome: "Bolsa",
    },

    roupasViajante: {
      nome: "Roupas de Viajante",
    },

    livroHistoria: {
      nome: "Livro de História",
    },

    flecha: {
      nome: "Flecha",
    },

    conjuntoJogos: {
      nome: "Conjunto de Jogos",
    },

    kitCurandeiro: {
      nome: "Kit de Curandeiro",
    },

    aljava: {
      nome: "Aljava",
    },

    pacoteExploradorSubterraneo: {
      nome: "Pacote de Explorador Subterrâneo",
    },
  },
};
