"use strict";

window.bancoCriaturas = {
  experienciaPorNivelDesafio: {
    0: 0,
    "1/8": 25,
    "1/4": 50,
    "1/2": 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000,
  },

  blocos: {

    guarda: {
      id: "guarda",
      nome: "Guarda",

      fonte: {
        sistema: "dnd-2024",
        publicacao: "Regras Básicas 2024",
        nomeOriginal: "Guard",
        oficial: true,
      },

      nivelDesafio: "1/8",
      xp: 25,
      bonusProficiencia: 2,

      tamanho: ["medio", "pequeno"],
      tipoCriatura: "humanoide",
      tendencia: "neutro",

      iniciativa: {
        bonus: 1,
        valorPassivo: 11,
      },

      deslocamento: {
        terrestre: 6,
      },

      atributos: {
        forca: 13,
        destreza: 12,
        constituicao: 12,
        inteligencia: 10,
        sabedoria: 11,
        carisma: 10,
      },

      pericias: ["percepcao"],

      salvaguardas: [],

      sentidos: {
        percepcaoPassiva: 12,
      },

      idiomas: ["comum"],

      equipamentos: [
        "camisaoDeMalha",
        "escudo",
        "lanca",
      ],

      combate: {
        classeArmadura: 16,

        pontosDeVida: {
          atuais: 11,
          maximo: 11,

          formula: {
            quantidade: 2,
            numeroDeFaces: 8,
            modificador: 2,
          },
        },
      },

      ataques: [
        {
          id: "lancaCorpoACorpo",
          ataqueOriginalId: "lanca",
          nome: "Lança",
          categoria: "corpoACorpo",

          selecao: {
            tipo: "criatura",

            alcance: {
              normal: 1,
            },

            area: null,
          },

          bonusAtaque: 3,

          dano: {
            gruposDeDados: [
              {
                quantidade: 1,
                numeroDeFaces: 6,
              },
            ],

            modificador: 1,
            tipo: "perfurante",
          },
        },

        {
          id: "lancaDistancia",
          ataqueOriginalId: "lanca",
          nome: "Lança",
          categoria: "distancia",

          selecao: {
            tipo: "criatura",

            alcance: {
              normal: 4,
              longo: 12,
            },

            area: null,
          },

          bonusAtaque: 3,

          dano: {
            gruposDeDados: [
              {
                quantidade: 1,
                numeroDeFaces: 6,
              },
            ],

            modificador: 1,
            tipo: "perfurante",
          },
        },
      ],


    },

    bandido: {
      id: "bandido",
      nome: "Bandido",

      fonte: {
        sistema: "dnd-2024",
        publicacao: "Regras Básicas 2024",
        nomeOriginal: "Bandit",
        oficial: true,
      },

      nivelDesafio: "1/8",
      xp: 25,
      bonusProficiencia: 2,

      tamanho: ["medio", "pequeno"],
      tipoCriatura: "humanoide",
      tendencia: "neutro",

      iniciativa: {
        bonus: 1,
        valorPassivo: 11,
      },

      deslocamento: {
        terrestre: 6,
      },

      atributos: {
        forca: 11,
        destreza: 12,
        constituicao: 12,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
      },

      pericias: [],

      salvaguardas: [],

      sentidos: {
        percepcaoPassiva: 10,
      },

      idiomas: [
        "comum",
        "cantLadroes",
      ],

      equipamentos: [
        "armaduraDeCouro",
        "bestaLeve",
        "cimitarra",
      ],

      combate: {
        classeArmadura: 12,

        pontosDeVida: {
          atuais: 11,
          maximo: 11,

          formula: {
            quantidade: 2,
            numeroDeFaces: 8,
            modificador: 2,
          },
        },
      },

      ataques: [
        {
          id: "cimitarra",
          nome: "Cimitarra",
          categoria: "corpoACorpo",

          selecao: {
            tipo: "criatura",

            alcance: {
              normal: 1,
            },

            area: null,
          },

          bonusAtaque: 3,

          dano: {
            gruposDeDados: [
              {
                quantidade: 1,
                numeroDeFaces: 6,
              },
            ],

            modificador: 1,
            tipo: "cortante",
          },
        },

        {
          id: "bestaLeve",
          nome: "Besta leve",
          categoria: "distancia",

          selecao: {
            tipo: "criatura",

            alcance: {
              normal: 16,
              longo: 64,
            },

            area: null,
          },

          bonusAtaque: 3,

          dano: {
            gruposDeDados: [
              {
                quantidade: 1,
                numeroDeFaces: 8,
              },
            ],

            modificador: 1,
            tipo: "perfurante",
          },
        },
      ],
    },

  },
};
