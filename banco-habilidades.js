// =====================================================
// Banco de habilidades
// -----------------------------------------------------
// Guarda habilidades de classe, grupos de escolhas e
// progressão inicial das classes. Este arquivo não aplica
// regras sozinho: ele fornece os dados usados pelas telas de
// criação, ficha e visualização do personagem.
// =====================================================

window.bancoHabilidades = {
  // Reservado para traços de espécie ou características gerais.
  traits: {},

  // Reservado para talentos que possam ser integrados a este banco.
  feats: {},

  // =====================================================
  // Habilidades de classe
  // -----------------------------------------------------
  // Cada entrada descreve uma habilidade automática de uma
  // classe. Quando a habilidade possui recurso limitado,
  // o campo recurso informa usos, recuperação e fórmula.
  // =====================================================
  classFeatures: {
    segundoFolego: {
      id: "segundoFolego",
      nome: "Segundo Fôlego",
      categoria: "classFeature",
      classe: "guerreiro",
      nivel: 1,
      descricaoCurta: "Você pode recuperar pontos de vida usando uma reserva limitada de usos.",
      descricaoLonga: "Você possui uma reserva limitada de vigor que pode usar para se recuperar. No nível 1, você tem 2 usos de Segundo Fôlego. Ao usar esta habilidade, recupera 1d10 + seu nível de Guerreiro pontos de vida. Você recupera os usos gastos ao terminar um descanso longo.",

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
    },

    ataqueFurtivo: {
      id: "ataqueFurtivo",
      nome: "Ataque Furtivo",
      categoria: "classFeature",
      classe: "ladino",
      nivel: 1,
      descricaoCurta: "Você causa dano extra quando ataca explorando uma abertura.",
      descricaoLonga: "O Ataque Furtivo representa a capacidade do Ladino de atingir pontos vulneráveis do inimigo. No nível 1, ele adiciona 1d6 de dano em certas condições. A automação completa dessas condições será implementada futuramente no sistema de combate."
    },

    especializacao: {
      id: "especializacao",
      nome: "Especialização",
      categoria: "classFeature",
      classe: "ladino",
      nivel: 1,
      descricaoCurta: "Você se torna excepcionalmente competente em algumas perícias.",
      descricaoLonga: "A Especialização representa treinamento refinado em áreas específicas. Futuramente, o sistema permitirá escolher quais perícias recebem esse benefício e aplicará automaticamente o bônus ampliado."
    },

    giriaDeLadrao: {
      id: "giriaDeLadrao",
      nome: "Gíria de Ladrão",
      categoria: "classFeature",
      classe: "ladino",
      nivel: 1,
      descricaoCurta: "Você conhece códigos, sinais e expressões usados por criminosos e informantes.",
      descricaoLonga: "A Gíria de Ladrão permite reconhecer e transmitir mensagens ocultas em conversas, símbolos e sinais discretos. No sistema, ela será tratada inicialmente como uma habilidade narrativa."
    },

    conjuracaoClerigo: {
      id: "conjuracaoClerigo",
      nome: "Conjuração",
      categoria: "classFeature",
      classe: "clerigo",
      nivel: 1,
      descricaoCurta: "Você canaliza magia divina usando Sabedoria como atributo de conjuração.",
      descricaoLonga: "A Conjuração do Clérigo representa sua capacidade de canalizar magia divina por meio da fé, devoção ou vínculo com uma força sagrada. No nível 1, o Clérigo começa a preparar e conjurar magias usando Sabedoria. A escolha detalhada das magias será desenvolvida no próximo módulo do sistema."
    }
  },

  // =====================================================
  // Grupos de escolha
  // -----------------------------------------------------
  // Descrevem escolhas que o jogador precisa fazer no nível 1.
  // Alguns grupos possuem opções fixas; outros buscam opções
  // dinamicamente, como armas proficientes ou perícias já conhecidas.
  // =====================================================
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

    especializacoesPericias: {
      id: "especializacoesPericias",
      nome: "Especialização em Perícias",
      quantidadeEscolhas: 2,
      origemDasOpcoes: "periciasProficientes"
    }
  },

  // =====================================================
  // Progressão das classes
  // -----------------------------------------------------
  // Define quais habilidades automáticas e quais escolhas cada
  // classe recebe em determinado nível. Por enquanto, o sistema
  // usa apenas o nível 1.
  // =====================================================
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
    },

    ladino: {
      nivel1: {
        classFeaturesAutomaticas: [
          "ataqueFurtivo",
          "especializacao",
          "giriaDeLadrao",
          "maestriaComArmas"
        ],

        escolhas: [
          {
            grupo: "especializacoesPericias",
            quantidade: 2
          },
          {
            grupo: "maestriasArmas",
            quantidade: 2
          }
        ]
      }
    },

    clerigo: {
      nivel1: {
        classFeaturesAutomaticas: [
          "conjuracaoClerigo"
        ],

        escolhas: []
      }
    }
  }
};
