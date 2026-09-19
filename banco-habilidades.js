window.bancoHabilidades = {
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

      regra: {
        gatilho: "aoAtivar",
        custo: "acaoBonus",
        alvo: "proprioPersonagem",

        recurso: {
          tipo: "habilidade",
          id: "segundoFolego",
        },

        efeito: {
          tipo: "curar",

          rolagem: {
            gruposDeDados: [
              {
                quantidade: 1,
                numeroDeFaces: 10,
              },
            ],

            modificador: {
              tipo: "nivelClasse",
              classeId: "guerreiro",
            },
          },
        },
      },

      descricaoCurta: "Você pode recuperar pontos de vida usando uma reserva limitada de usos.",
      descricaoLonga:
        "Você possui uma reserva limitada de vigor que pode usar para se recuperar. No nível 1, você tem 2 usos de Segundo Fôlego. Ao usar esta habilidade, recupera 1d10 + seu nível de Guerreiro pontos de vida. um uso gasto ao terminar um descanso curto e todos os usos gastos ao terminar um descanso longo.",

      recurso: {
        id: "segundoFolego",
        nome: "Segundo Fôlego",
        usosMaximos: 2,

        recuperacao: {
          descansoCurto: {
            quantidade: 1,
          },

          descansoLongo: {
            restaurarTodos: true,
          },
        },

        efeito: "cura",
        formula: "1d10 + nivelClasse",
      },
    },

    maestriaComArmas: {
      id: "maestriaComArmas",
      nome: "Maestria com Armas",
      categoria: "classFeature",
      classe: "guerreiro",
      nivel: 1,
      descricaoCurta: "Você escolhe armas para dominar suas propriedades de maestria.",
    },

    ataqueFurtivo: {
      id: "ataqueFurtivo",
      nome: "Ataque Furtivo",
      categoria: "classFeature",
      classe: "ladino",
      nivel: 1,
      descricaoCurta: "Você causa dano extra quando ataca explorando uma abertura.",
      descricaoLonga:
        "O Ataque Furtivo representa a capacidade do Ladino de atingir pontos vulneráveis do inimigo. No nível 1, ele adiciona 1d6 de dano em certas condições. A automação completa dessas condições será implementada futuramente no sistema de combate.",
    },

    especializacao: {
      id: "especializacao",
      nome: "Especialização",
      categoria: "classFeature",
      classe: "ladino",
      nivel: 1,
      descricaoCurta: "Você se torna excepcionalmente competente em algumas perícias.",
      descricaoLonga:
        "A Especialização representa treinamento refinado em áreas específicas. Futuramente, o sistema permitirá escolher quais perícias recebem esse benefício e aplicará automaticamente o bônus ampliado.",
    },

    giriaDeLadrao: {
      id: "giriaDeLadrao",
      nome: "Gíria de Ladrão",
      categoria: "classFeature",
      classe: "ladino",
      nivel: 1,
      descricaoCurta:
        "Você conhece códigos, sinais e expressões usados por criminosos e informantes.",
      descricaoLonga:
        "A Gíria de Ladrão permite reconhecer e transmitir mensagens ocultas em conversas, símbolos e sinais discretos. No sistema, ela será tratada inicialmente como uma habilidade narrativa.",
    },

    conjuracaoClerigo: {
      id: "conjuracaoClerigo",
      nome: "Conjuração",
      categoria: "classFeature",
      classe: "clerigo",
      nivel: 1,
      descricaoCurta: "Você canaliza magia divina usando Sabedoria como atributo de conjuração.",
      descricaoLonga:
        "A Conjuração do Clérigo representa sua capacidade de canalizar magia divina por meio da fé, devoção ou vínculo com uma força sagrada. No nível 1, o Clérigo começa a preparar e conjurar magias usando Sabedoria. A escolha detalhada das magias será desenvolvida no próximo módulo do sistema.",
    },
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

          regra: {
            tipo: "modificadorPassivo",

            efeito: {
              tipo: "modificarAtaqueArma",
              valor: 2,
            },

            condicao: {
              categoriaArma: "distancia",
            },
          },

          descricaoCurta: "Você recebe +2 nas jogadas de ataque feitas com armas à distância.",
        },

        {
          id: "combateAsCegas",
          nome: "Combate às Cegas",

          regra: {
            gatilho: "passivo",

            efeito: {
              tipo: "concederSentido",
              sentido: "visaoAsCegas",
              alcance: 3,
            },
          },

          descricaoCurta: "Você possui Visão às Cegas com alcance de 3 metros.",
        },

        {
          id: "defesa",
          nome: "Defesa",

          regra: {
            tipo: "modificadorPassivo",

            efeito: {
              tipo: "modificarClasseArmadura",
              valor: 1,
            },

            condicao: {
              usandoArmadura: true,
            },
          },

          descricaoCurta: "Enquanto estiver usando armadura, você recebe +1 na Classe de Armadura.",
        },

        {
          id: "duelismo",
          nome: "Duelismo",

          regra: {
            tipo: "modificadorPassivo",

            efeito: {
              tipo: "modificarDanoArma",
              valor: 2,
            },

            condicao: {
              categoriaArma: "corpo-a-corpo",
              armaEmpunhadaEmUmaMao: true,
              nenhumaOutraArmaEmpunhada: true,
            },
          },

          descricaoCurta:
            "Ao empunhar uma arma corpo a corpo em uma mão e nenhuma outra arma, você recebe +2 no dano dessa arma.",
        },

        {
          id: "combateArmasGrandes",
          nome: "Combate com Armas Grandes",

          regra: {
            tipo: "modificadorPassivo",

            efeito: {
              tipo: "ajustarDadosDanoArma",
              resultadosSubstituidos: [1, 2],
              resultadoMinimo: 3,
            },

            condicao: {
              ataqueADistancia: false,
              empunhadaComDuasMaos: true,
            },
          },

          descricaoCurta:
            "Ao rolar o dano de um ataque com uma arma corpo a corpo empunhada com duas mãos, resultados 1 ou 2 nos dados de dano da arma são tratados como 3.",
        },

        {
  id: "interceptacao",
  nome: "Interceptação",

  regra: {
    tipo: "gatilho",
    gatilho: "aposAcertoAntesDoDano",
    opcional: true,
    custo: "reacao",

    alvo: "criaturaAtingida",

    requisito: {
      alcanceAlvoCelulas: 1,
      precisaPerceberAtacante: true,
      precisaEmpunharEscudoOuArma: true,
    },

    efeito: {
      tipo: "solicitarReducaoDano",
      gruposDeDados: [
        {
          quantidade: 1,
          numeroDeFaces: 10,
        },
      ],
      adicionarBonusProficiencia: true,
    },
  },

  descricaoCurta:
    "Quando uma criatura que você pode ver acerta outra criatura a até 1,5 metro de você, você pode usar sua Reação para reduzir o dano em 1d10 mais seu Bônus de Proficiência. Você precisa estar empunhando um escudo ou uma arma simples ou marcial.",
},

        {
          id: "combateArmasArremessaveis",
          nome: "Combate com Armas Arremessáveis",

          regra: {
            tipo: "modificadorPassivo",

            efeito: {
              tipo: "modificarDanoArma",
              valor: 2,
            },

            condicao: {
              propriedadeArma: "arremesso",
              ataqueADistancia: true,
            },
          },

          descricaoCurta:
            "Quando você acerta com um ataque à distância usando uma arma com a propriedade Arremesso, recebe +2 na jogada de dano.",
        },

        {
          id: "combateDuasArmas",
          nome: "Combate com Duas Armas",

          regra: {
            tipo: "modificadorPassivo",

            efeito: {
              tipo: "incluirModificadorAtributoNoDano",
            },

            condicao: {
              ataqueComArmaSecundaria: true,
            },
          },

          descricaoCurta:
            "Ao realizar o ataque adicional com uma arma leve, você pode acrescentar o modificador do atributo ao dano.",
        },

        {
          id: "combateDesarmado",
          nome: "Combate Desarmado",

          regras: [
            {
              tipo: "modificadorPassivo",

              efeito: {
                tipo: "substituirDanoAtaqueDesarmado",
                dadoPadrao: 6,
                dadoSemArmaOuEscudo: 8,
              },
            },

            {
              tipo: "gatilho",
              gatilho: "inicioTurno",
              opcional: true,

              alvo: "criaturaAgarradaPeloParticipante",

              efeito: {
                tipo: "solicitarDanoSemAcerto",
                gruposDeDados: [
                  {
                    quantidade: 1,
                    numeroDeFaces: 4,
                  },
                ],
                tipoDano: "contundente",
              },
            },
          ],

          descricaoCurta:
            "Seus Ataques Desarmados podem causar 1d6 mais seu modificador de Força. Se você não estiver empunhando armas nem escudo, o d6 torna-se d8. No início de cada turno, você pode causar 1d4 de dano contundente a uma criatura agarrada por você.",
        },
      ],
    },

    maestriasArmas: {
      id: "maestriasArmas",
      nome: "Maestria com Armas",
      quantidadeEscolhas: 3,
      origemDasOpcoes: "armas",
    },

    especializacoesPericias: {
      id: "especializacoesPericias",
      nome: "Especialização em Perícias",
      quantidadeEscolhas: 2,
      origemDasOpcoes: "periciasProficientes",
    },
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
        classFeaturesAutomaticas: ["segundoFolego", "maestriaComArmas"],

        escolhas: [
          {
            grupo: "estilosDeLuta",
            quantidade: 1,
          },
          {
            grupo: "maestriasArmas",
            quantidade: 3,
          },
        ],
      },
    },

    ladino: {
      nivel1: {
        classFeaturesAutomaticas: [
          "ataqueFurtivo",
          "especializacao",
          "giriaDeLadrao",
          "maestriaComArmas",
        ],

        escolhas: [
          {
            grupo: "especializacoesPericias",
            quantidade: 2,
          },
          {
            grupo: "maestriasArmas",
            quantidade: 2,
          },
        ],
      },
    },

    clerigo: {
      nivel1: {
        classFeaturesAutomaticas: ["conjuracaoClerigo"],

        escolhas: [],
      },
    },
  },
};
