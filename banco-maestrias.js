// =====================================================
// Banco de maestrias de armas
// -----------------------------------------------------
// Guarda as maestrias que podem aparecer nas armas. Cada
// maestria possui uma descrição curta para a ficha e uma
// descrição longa para modais/popovers de detalhe.
// =====================================================

window.bancoMaestrias = {
  // =====================================================
  // Maestrias disponíveis
  // =====================================================
  cleave: {
    id: "cleave",
    nome: "Cleave",

    regra: {
      gatilho: "aposAcertarAtaque",
      opcional: true,

      limite: {
        quantidade: 1,
        recarga: "turno",
      },

      requisito: {
        ataqueCorpoACorpo: true,

        segundoAlvo: {
          distanciaDoPrimeiroAlvo: 1,
          precisaEstarAoAlcance: true,
        },
      },

      efeito: {
        tipo: "permitirAtaqueAdicional",

        alvo: "segundaCriatura",

        dano: {
          incluirModificadorAtributo: "somenteSeNegativo",
        },
      },
    },

    descricaoCurta:
      "Depois de acertar com esta arma, você pode atacar uma segunda criatura próxima ao primeiro alvo.",

    descricaoLonga:
      "Ao acertar uma criatura com um ataque corpo a corpo usando esta arma, você pode fazer um ataque adicional contra outra criatura que esteja próxima do primeiro alvo e dentro do alcance da arma. Esse ataque adicional pode ser realizado apenas uma vez por turno.",
  },

  graze: {
    id: "graze",
    nome: "Graze",

    regra: {
      gatilho: "aposErrarAtaque",

      opcional: true,

      efeito: {
        tipo: "causarDanoSemAcerto",

        quantidade: {
          tipo: "modificadorAtributoAtaque",
          minimo: 0,
        },

        tipoDano: "mesmoDaArma",

        permiteOutrosBonus: false,
      },
    },

    descricaoCurta:
      "Quando o ataque erra, o alvo ainda sofre dano igual ao modificador do atributo usado.",

    descricaoLonga:
      "Se um ataque com esta arma errar, o alvo sofre dano do mesmo tipo da arma igual ao modificador do atributo utilizado na jogada de ataque. Esse dano só pode ser aumentado por um aumento nesse modificador.",
  },

  nick: {
    id: "nick",
    nome: "Nick",

    regra: {
      gatilho: "aoPrepararAtaqueAdicionalArmaLeve",

      opcional: true,

      limite: {
        quantidade: 1,
        recarga: "turno",
      },

      requisito: {
        propriedadeArma: "leve",
      },

      efeito: {
        tipo: "alterarCustoAtaqueAdicional",

        custoOriginal: "acaoBonus",
        novoCusto: "parteDaAcaoAtaque",
      },
    },

    descricaoCurta: "O ataque adicional da propriedade Leve pode fazer parte da ação de Ataque.",

    descricaoLonga:
      "Ao realizar o ataque adicional concedido pela propriedade Leve, você pode fazê-lo como parte da mesma ação de Ataque, em vez de usar uma ação bônus. Essa mudança pode ser aplicada uma vez por turno.",
  },

  push: {
    id: "push",
    nome: "Push",

    regra: {
      gatilho: "aposAcertarAtaque",
      opcional: true,

      requisito: {
        tamanhoMaximoAlvo: "grande",
      },

      efeito: {
        tipo: "deslocarAlvo",

        distanciaCelulas: 2,
        direcao: "afastarDoAtacante",
      },
    },

    descricaoCurta: "Ao acertar, você pode empurrar uma criatura Grande ou menor em até 2 células.",

    descricaoLonga:
      "Ao acertar uma criatura Grande ou menor com esta arma, você pode empurrá-la em linha reta para longe de você em até 2 células, equivalentes a 10 pés.",
  },

  sap: {
  id: "sap",
  nome: "Sap",

  regra: {
    gatilho: "aposAcertarAtaque",

    efeito: {
      tipo: "concederDesvantagem",

      rolagemAfetada: "ataque",
      quantidadeDeUsos: 1,

      expiracao:
        "inicioDoProximoTurnoDoAtacante",
    },
  },

  descricaoCurta:
    "A criatura atingida tem Desvantagem em sua próxima jogada de ataque.",

  descricaoLonga:
    "Ao ser atingida por esta arma, a criatura recebe Desvantagem em sua próxima jogada de ataque antes do início do seu próximo turno.",
},

  slow: {
  id: "slow",
  nome: "Slow",

  regra: {
    gatilho: "aposCausarDano",
    opcional: true,

    efeito: {
      tipo: "modificarDeslocamento",

      valorCelulas: -2,

      acumulacao: {
        chave: "slow",
        limiteTotalCelulas: -2,
      },

      expiracao:
        "inicioDoProximoTurnoDoAtacante",
    },
  },

  descricaoCurta:
    "Ao causar dano, você pode reduzir o deslocamento do alvo em 2 células.",

  descricaoLonga:
    "Ao acertar e causar dano com esta arma, você pode reduzir o deslocamento da criatura em 2 células, equivalentes a 10 pés, até o início do seu próximo turno. Vários acertos com Slow não aumentam essa redução.",
},

  topple: {
  id: "topple",
  nome: "Topple",

  regra: {
    gatilho: "aposAcertarAtaque",
    opcional: true,

    efeito: {
      tipo: "solicitarSalvaguarda",

      atributoId: "constituicao",

      dificuldade: {
        base: 8,
        adicionar:
          [
            {
              tipo:
                "modificadorAtributoAtaque",
            },

            {
              tipo:
                "bonusProficiencia",
            },
          ],
      },

      resultados: {
        sucesso: null,

        fracasso: {
          tipo: "aplicarCondicao",
          condicaoId: "caido",
        },
      },
    },
  },

  descricaoCurta:
    "Ao acertar, você pode forçar uma salvaguarda de Constituição para derrubar o alvo.",

  descricaoLonga:
    "Ao acertar uma criatura com esta arma, você pode exigir uma salvaguarda de Constituição. A dificuldade é 8 mais o modificador do atributo usado no ataque e o bônus de proficiência. Em caso de fracasso, a criatura fica Caída.",
},

  vex: {
  id: "vex",
  nome: "Vex",

  regra: {
    gatilho: "aposCausarDano",

    efeito: {
      tipo: "concederVantagem",

      rolagemAfetada: "ataque",
      alvo: "mesmoAlvo",
      quantidadeDeUsos: 1,

      expiracao:
        "fimDoProximoTurnoDoAtacante",
    },
  },

  descricaoCurta:
    "Ao causar dano, você recebe Vantagem no próximo ataque contra a mesma criatura.",

  descricaoLonga:
    "Ao acertar e causar dano com esta arma, você recebe Vantagem em sua próxima jogada de ataque contra a mesma criatura antes do fim do seu próximo turno.",
},
};
