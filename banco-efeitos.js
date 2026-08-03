"use strict";

window.bancoEfeitos = {

  atacanteSelvagem: {
    id: "atacanteSelvagem",
    nome: "Atacante Selvagem",

    origem: {
      tipo: "talento",
      id: "atacanteSelvagem",
    },

    tipo: "alterarRolagem",
    gatilho: "aoRolarDano",
    alvo: "proprioPersonagem",

    operacao: {
      tipo: "rolarNovamente",
      rolagemAfetada: "danoDaArma",
      quantidadeDeRolagens: 2,
      criterioDeEscolha: "escolhaDoJogador",
    },

    usos: {
      quantidade: 1,
      recarga: "turno",
    },
  },

    segundoFolego: {
    id:
      "segundoFolego",

    nome:
      "Segundo Fôlego",

    origem: {
      tipo:
        "habilidade",

      id:
        "segundoFolego"
    },

    tipo:
      "cura",

    gatilho:
      "aoAtivar",

    custo:
      "acaoBonus",

    alvo:
      "proprioPersonagem",

    recurso: {
      tipo:
        "habilidade",

      id:
        "segundoFolego"
    },

    operacao: {
      tipo:
        "curar",

      rolagem: {
        gruposDeDados: [
          {
            quantidade:
              1,

            numeroDeFaces:
              10
          }
        ],

        modificador: {
          tipo:
            "nivelClasse",

          classeId:
            "guerreiro"
        }
      }
    }
  }

};
