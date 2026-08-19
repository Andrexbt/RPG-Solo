"use strict";

window.bancoNpcs = {

  aFuga: {

    ned: {
      id: "ned",
      nome: "Ned",
      tipo: "aliado",

      avatar: {
        imagem: "Imagens/Avatares/npcs/ned.webp",

        frame: "Imagens/Avatares/frame/frame-08.webp",
      },

      atributos: {
        forca: 10,
        destreza: 12,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 11,
        carisma: 14,
      },

      bonusProficiencia: 2,
      pericias: ["persuasao"],
      salvaguardas: [],

      combate: {
        classeArmadura: 12,

        pontosDeVida: {
          atuais: 9,
          maximo: 9,
        },
      },

      ataques: [
        {
          id: "espadaCurta",
          nome: "Espada curta",
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
          id: "arcoCurto",
          nome: "Arco curto",
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
                numeroDeFaces: 6,
              },
            ],

            modificador: 1,
            tipo: "perfurante",
          },
        },
      ],

      narracao: {
        categoria: "humanoide",

        termos: {
          sujeito: "Ned",
        },

        ataques: {
          espadaCurta: {
            tipoNarrativo: "espadaCurta",
          },

          arcoCurto: {
            tipoNarrativo: "arcoCurto",
          },
        },
      },
    },

    guardaConde: {
      id: "guardaConde",
      nome: "Guarda",
      tipo: "inimigo",

      blocoCriaturaId: "bandido",

      avatar: {
        imagem: "Imagens/Avatares/npcs/guardaConde.webp",

        frame: "Imagens/Avatares/frame/frame-07.webp",
      },

      narracao: {
        categoria: "humanoide",

        termos: {
          sujeito: "o guarda",
        },

        ataques: {
          cimitarra: {
            tipoNarrativo: "cimitarra",
          },

          bestaLeve: {
            tipoNarrativo: "bestaLeve",
          },
        },
      },
    },

    lagartoBronze: {
      id: "lagartoBronze",
      nome: "Lagarto de Bronze",
      tipo: "inimigo",

      avatar: {
        imagem: "Imagens/Avatares/npcs/lagartoBronze.webp",

        frame: "Imagens/Avatares/frame/frame-01.webp",
      },

      atributos: {
        forca: 14,
        destreza: 13,
        constituicao: 14,
        inteligencia: 10,
        sabedoria: 12,
        carisma: 10,
      },

      bonusProficiencia: 2,
      pericias: ["intimidacao", "percepcao"],
      salvaguardas: [],

      combate: {
        classeArmadura: 14,

        pontosDeVida: {
          atuais: 13,
          maximo: 13,
        },
      },

      ataques: [
        {
          id: "lanca",
          nome: "Lança",
          categoria: "corpoACorpo",

          selecao: {
            tipo: "criatura",

            alcance: {
              normal: 1,
            },

            area: null,
          },

          bonusAtaque: 4,

          dano: {
            gruposDeDados: [
              {
                quantidade: 1,
                numeroDeFaces: 6,
              },
            ],

            modificador: 2,
            tipo: "perfurante",
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

      narracao: {
        categoria: "humanoide",

        termos: {
          sujeito: "o Lagarto de Bronze",
        },

        ataques: {
          lanca: {
            tipoNarrativo: "lanca",
          },

          bestaLeve: {
            tipoNarrativo: "bestaLeve",
          },
        },
      },
    },
  },
};
