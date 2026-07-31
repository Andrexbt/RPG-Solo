// =====================================================
// Banco de antecedentes
// -----------------------------------------------------
// Guarda os antecedentes disponíveis na criação de
// personagem. Cada antecedente pode conceder perícias,
// ferramentas, idiomas, talento de origem, equipamento,
// moedas e sugestões de atributos.
// =====================================================

window.bancoAntecedentes = {
  acolito: {
    id: "acolito",
    nome: "Acólito",
    descricaoCurta:
      "Você viveu parte da sua vida em um templo, ou vários, se dedicando ao estudo de algum deus ou religião.",

    // Adicione aqui a descrição narrativa completa.
    descricao: `Como acólito, você pode ter sido aprendiz de uma figura religiosa, membro de um grupo de devotos ou estudioso de textos religiosos.

    Graças aos seus estudos e serviços, você desenvolveu um grande conhecimento religioso. Talvez em uma religião specífica, talvez em várias.

    Esse conhecimento é tanto teórico quanto prático, permitindo-lha canalizar uma parcela de poder divino em algumas magias simples de Clérigo. `,

    atributos: {
      opcoes: ["inteligencia", "sabedoria", "carisma"],

      distribuicoesPermitidas: [
        { valores: [2, 1], atributosDiferentes: true },
        { valores: [1, 1, 1], atributosDiferentes: true },
      ],
    },

    talentoOrigem: { id: "iniciadoMagia", configuracao: { listaMagias: "clerigo" } },

    proficiencias: {
      pericias: ["intuicao", "religiao"],
      ferramentas: ["suprimentosCaligrafo"],
    },

    equipamento: {
      opcoes: [
        {
          id: "equipamento",
          nome: "Equipamento inicial",
          itens: [
            {
              id: "suprimentosCaligrafo",
              quantidade: 1,
            },

            {
              id: "livroOracoes",
              quantidade: 1,
            },

            {
              id: "simboloSagrado",
              quantidade: 1,
            },

            {
              id: "pergaminho",
              quantidade: 10,
            },

            {
              id: "veste",
              quantidade: 1,
            },
          ],

          moedas: {
            ouro: 8,
          },
        },

        {
          id: "ouro",
          nome: "50 peças de ouro",
          itens: [],

          moedas: {
            ouro: 50,
          },
        },
      ],
    },
  },

  soldado: {
    id: "soldado",
    nome: "Soldado",
    descricaoCurta:
      "Assim que atingiu a maioridade, você começou a se dedicar ao treinamento militar, aprendendo técnicas marciais e adquirindo experiência em combate.",

    // Adicione aqui a descrição narrativa completa.
    descricao: `Você entende de batalha como ninguém. Sua experiência lhe concede a habilidade de manipular virtualmente qualquer arma em que coloque suas mãos.

    Você pode ter experiência prévia em uma guerra, ter participado de uma milícia desde muito jovem, ou até mesmo estudado formalmente em uam academia de oficiais do exército.

    O fato é que quando o assunto é técnica e estratégia de combate, poucas pessoas são capazes de enfrentá-lo de frente.`,

    atributos: {
      opcoes: ["forca", "destreza", "constituicao"],

      distribuicoesPermitidas: [
        {
          valores: [2, 1],
          atributosDiferentes: true,
        },

        {
          valores: [1, 1, 1],
          atributosDiferentes: true,
        },
      ],
    },

    talentoOrigem: {
      id: "atacanteSelvagem",
    },

    proficiencias: {
      pericias: ["atletismo", "intimidacao"],

      ferramentas: ["conjuntoJogos"],
    },

    equipamento: {
      opcoes: [
        {
          id: "equipamento",
          nome: "Equipamento inicial",

          itens: [
            {
              id: "lanca",
              quantidade: 1,
            },

            {
              id: "arcoCurto",
              quantidade: 1,
            },

            {
              id: "flecha",
              quantidade: 20,
            },

            {
              id: "conjuntoJogos",
              quantidade: 1,
            },

            {
              id: "kitCurandeiro",
              quantidade: 1,
            },

            {
              id: "aljava",
              quantidade: 1,
            },

            {
              id: "roupasViajante",
              quantidade: 1,
            },
          ],

          moedas: {
            ouro: 14,
          },
        },

        {
          id: "ouro",
          nome: "50 peças de ouro",
          itens: [],

          moedas: {
            ouro: 50,
          },
        },
      ],
    },
  },

  sabio: {
    id: "sabio",
    nome: "Sábio",
    descricaoCurta:
      "Você dedicou sua vida à busca por conhecimento, estivesse ele odne estivesse. E você sabe que há ainda mais a aprender.",

    // Adicione aqui a descrição narrativa completa.
    descricao: `Você tem uma sede insaciável por conhecimento. Ele é sua motivação e maldição. Em suas mente, nada permanece um mistério por muito tempo, contanto que você tenha tenha acesso e tempo para realizar suas pesquisas.

    Seus conhecimentos podem ser específicos, ou passar por diversas áreas. Você pode tê-los acumulado com estudos formais ou informais, viajando entre instituições de ensino e monastérios.

    Ao longo de seus anos de estudo, você inclusive aprendeu algumas mágias básicas de Mago, que podem ser sido adquiridas por meios oficiais ou não.`,

    atributos: {
      opcoes: ["constituicao", "inteligencia", "sabedoria"],

      distribuicoesPermitidas: [
        {
          valores: [2, 1],
          atributosDiferentes: true,
        },

        {
          valores: [1, 1, 1],
          atributosDiferentes: true,
        },
      ],
    },

    talentoOrigem: {
      id: "iniciadoMagia",

      configuracao: {
        listaMagias: "mago",
      },
    },

    proficiencias: {
      pericias: ["arcanismo", "historia"],

      ferramentas: ["suprimentosCaligrafo"],
    },

    equipamento: {
      opcoes: [
        {
          id: "equipamento",
          nome: "Equipamento inicial",

          itens: [
            {
              id: "bordao",
              quantidade: 1,
            },

            {
              id: "suprimentosCaligrafo",
              quantidade: 1,
            },

            {
              id: "livroHistoria",
              quantidade: 1,
            },

            {
              id: "pergaminho",
              quantidade: 8,
            },

            {
              id: "veste",
              quantidade: 1,
            },
          ],

          moedas: {
            ouro: 8,
          },
        },

        {
          id: "ouro",
          nome: "50 peças de ouro",
          itens: [],

          moedas: {
            ouro: 50,
          },
        },
      ],
    },
  },

  criminoso: {
    id: "criminoso",
    nome: "Criminoso",
    descricaoCurta:
      "Você aprendeu a sobreviver à margem da lei e da sociedade, fazendo o que fosse preciso para sobreviver até o dia seguinte.",

    // Adicione aqui a descrição narrativa completa.
    descricao: `Você conhece os becos das cidades, e os refúgios nas florestas, e se movimenta por eles com precisão e astúcia. A vida lhe ensinou que o que você quer precisa ser tomado, seja à força ou com subterfúgio.

    Você pode ter sido membro de um grupo de bandidos, ou pode ter sido forçado pela miséria a lutar por seu sustento por meios escusos. Talvez até mesmo um mercenário, que vende suas habilidades para quem pagar o maior preço, independente de para quê elas serão utilizadas.

    Poucas coisas o abalam, e ainda menos conseguem se colocar entre você e seus objetivos.`,

    atributos: {
      opcoes: ["destreza", "constituicao", "inteligencia"],

      distribuicoesPermitidas: [
        {
          valores: [2, 1],
          atributosDiferentes: true,
        },

        {
          valores: [1, 1, 1],
          atributosDiferentes: true,
        },
      ],
    },

    talentoOrigem: {
      id: "alerta",
    },

    proficiencias: {
      pericias: ["prestidigitacao", "furtividade"],

      ferramentas: ["ferramentasLadrao"],
    },

    equipamento: {
      opcoes: [
        {
          id: "equipamento",
          nome: "Equipamento inicial",

          itens: [
            {
              id: "adaga",
              quantidade: 2,
            },

            {
              id: "ferramentasLadrao",
              quantidade: 1,
            },

            {
              id: "peDeCabra",
              quantidade: 1,
            },

            {
              id: "bolsa",
              quantidade: 2,
            },

            {
              id: "roupasViajante",
              quantidade: 1,
            },
          ],

          moedas: {
            ouro: 16,
          },
        },

        {
          id: "ouro",
          nome: "50 peças de ouro",
          itens: [],

          moedas: {
            ouro: 50,
          },
        },
      ],
    },
  },
};
