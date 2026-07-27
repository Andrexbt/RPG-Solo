"use strict";

window.bancoNpcs = {

  aFuga: {
      ned: {
          id: "ned",
          nome:"Ned",
          tipo:"aliado",

          atributos: {
          forca: 10,
          destreza: 12,
          constituicao: 10,
          inteligencia: 10,
          sabedoria: 11,
          carisma: 14
          },

          bonusProficiencia: 2,
          pericias: ["persuasao"],
          salvaguardas: [],

          combate: {
          classeArmadura: 12,
          pontosDeVida: { atuais: 9, maximo: 9}
          },

          ataques: [
      {
        id: "espadaCurta",
        nome: "Espada curta",
        bonusAtaque: 3,

        dano: {
          gruposDeDados: [
            {quantidade: 1, numeroDeFaces: 6}
          ],

          modificador: 1,
          tipo: "perfurante"
        }
      },

      {
        id: "arcoCurto",
        nome: "Arco curto",
        bonusAtaque: 3,

        dano: {
          gruposDeDados: [
            {quantidade:1, numeroDeFaces:6}

          ],

          modificador:1,
          tipo: "perfurante"
        }
      }
          ]
      },

      guardaConde: {
          id: "guardaConde",
          nome: "Guarda",
          tipo: "inimigo",
      
          atributos: {
          forca: 13,
          destreza: 12,
          constituicao: 12,
          inteligencia: 10,
          sabedoria: 11,
          carisma: 10
          },

          bonusProficiencia: 2,
          pericias: ["atletismo", "percepcao"],
        salvaguardas: [],

          combate: {
          classeArmadura: 14,
          pontosDeVida: {atuais:11, maximo: 11}
          },

          ataques: [
      {
        id: "espadaCurta",
        nome: "Espada curta",
        bonusAtaque: 3,

        dano: {
          gruposDeDados: [
            {quantidade: 1, numeroDeFaces: 6}
          ],

          modificador: 1,
          tipo: "perfurante"
        }
      },

      {
        id: "arcoCurto",
        nome: "Arco curto",
        bonusAtaque: 3,

        dano: {
          gruposDeDados: [
            {quantidade:1, numeroDeFaces:6}

          ],

          modificador:1,
          tipo: "perfurante"
        }
      }
          ]
      },

      lagartoBronze: {
          id: "lagartoBronze",
          nome: "Lagarto de Bronze",
          tipo: "inimigo",

          atributos: {
              forca: 14,
              destreza: 13,
              constituicao: 14,
              inteligencia: 10,
              sabedoria: 12,
              carisma: 10
            },

          bonusProficiencia: 2,
          pericias: ["intimidacao", "percepcao"],
          salvaguardas: [],

          combate: {
              classeArmadura: 14,
              pontosDeVida: { atuais: 13, maximo: 13 }
            },

              ataques: [
              {
              id: "lanca",
      nome: "Lança",
      bonusAtaque: 4,

      dano: {
        gruposDeDados: [
          { quantidade: 1, numeroDeFaces: 6 }
        ],

        modificador: 2,
        tipo: "perfurante"
      }
    },

    {
      id: "bestaLeve",
      nome: "Besta leve",
      bonusAtaque: 3,

      dano: {
        gruposDeDados: [
          { quantidade: 1, numeroDeFaces: 8 }
        ],

        modificador: 1,
        tipo: "perfurante"
      }
    }
  ]
      }

    }

};