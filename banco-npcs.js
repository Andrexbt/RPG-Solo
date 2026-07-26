"use strict";

window.bancoNpcs = {

  aFuga: {
      ned: {
          id:"ned",
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
          pontosDeVida: { atuais: 4, maximo: 4}
          },

          ataques:
          []
        },

      guardaConde: {
          id:"guardaConde",
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
        }

    }

};