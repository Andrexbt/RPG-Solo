window.bancoHabilidades = {
  traits: {},

  feats: {},

  classFeatures: {
    segundoFolego: {
      id: "segundoFolego",
      nome: "Segundo Fôlego",
      categoria: "classFeature",
      classe: "guerreiro",
      nivel: 1,
      descricaoCurta: "Você pode recuperar pontos de vida usando uma reserva limitada de usos.",

      recurso: {
        id: "segundoFolego",
        nome: "Segundo Fôlego",
        usosMaximos: 2,
        recuperaEm: "descansoLongo",
        efeito: "cura",
        formula: "1d10 + nivelClasse"
      }
    },

    maestriaComArmas: {
      id: "maestriaComArmas",
      nome: "Maestria com Armas",
      categoria: "classFeature",
      classe: "guerreiro",
      nivel: 1,
      descricaoCurta: "Você escolhe armas para dominar suas propriedades de maestria."
    }
  },

  gruposDeEscolha: {
    estilosDeLuta: {
      id: "estilosDeLuta",
      nome: "Estilos de Luta",
      quantidadeEscolhas: 1,

      opcoes: [
        {
          id: "arquearia",
          nome: "Arquearia",
          descricaoCurta: "Estilo voltado para ataques com armas à distância."
        },
        {
          id: "defesa",
          nome: "Defesa",
          descricaoCurta: "Estilo voltado para proteção ao usar armadura."
        },
        {
          id: "duelismo",
          nome: "Duelismo",
          descricaoCurta: "Estilo voltado para lutar com uma arma em uma mão."
        },
        {
          id: "combateDuasArmas",
          nome: "Combate com Duas Armas",
          descricaoCurta: "Estilo voltado para lutar com uma arma em cada mão."
        }
      ]
    },

    maestriasArmas: {
      id: "maestriasArmas",
      nome: "Maestria com Armas",
      quantidadeEscolhas: 3,
      origemDasOpcoes: "armas"
    }
  },

  progressaoClasses: {
    guerreiro: {
      nivel1: {
        classFeaturesAutomaticas: [
          "segundoFolego",
          "maestriaComArmas"
        ],

        escolhas: [
          {
            grupo: "estilosDeLuta",
            quantidade: 1
          },
          {
            grupo: "maestriasArmas",
            quantidade: 3
          }
        ]
      }
    }
  }
};
