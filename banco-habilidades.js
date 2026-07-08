

window.bancoHabilidades = {

  habilidades: {

    segundoFolego: {
      id: "segundoFolego",
      nome: "Segundo Fôlego",
      tipo: "habilidade-classe",
      descricaoCurta: "Habilidade automática do Guerreiro no nível 1."
    },

    maestriaComArmas: {
      id: "maestriaComArmas",
      nome: "Maestria com Armas",
      tipo: "habilidade-classe",
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
    },

  },

  progressaoClasses: {

    guerreiro: {

      nivel1: {

        habilidadesAutomaticas: [
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

}


