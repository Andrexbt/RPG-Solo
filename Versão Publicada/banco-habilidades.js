

window.bancoHabilidades = {
  habilidades: {
    segundoFolego: {
      id: "segundoFolego",
      nome: "Segundo Fôlego",
      tipo: "habilidade-classe",
      descricaoCurta: "Habilidade automática do Guerreiro no nível 1."
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
        }
      ]
    }
  },

  progressaoClasses: {
    guerreiro: {
      nivel1: {
        habilidadesAutomaticas: ["segundoFolego"],

        escolhas: [
          {
            grupo: "estilosDeLuta",
            quantidade: 1
          }
        ]
      }
    }
  }
};

