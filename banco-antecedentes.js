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
    descricaoCurta: "Você viveu ligado a um templo, ordem religiosa ou tradição espiritual.",
    descricao: "a definir",

    atributos: {
      opcoes: ["inteligencia", "sabedoria", "carisma"],

      distribuicoesPermitidas: [
        {valores: [2,1], atributosDiferentes: true},
        {valores: [1,1,1], atributosDiferentes: true}
      ]

    },

    talentoOrigem: {id: "iniciadoMagia", configuracao: {listaMagias:"clerigo"}},

    proficiencias: {
      pericias: ["intuicao","religiao"],
      ferramentas: ["suprimentosCaligrafo"]
    },

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    equipamento: {
      opcoes: [
        
        {id:"equipamento",
          nome: "Equipamento inicial",
          itens: [
          {
          id:"suprimentosCaligrafo",
          quantidade: 1
          },

          {
          id: "livroOracoes",
          quantidade: 1
          },

          {
          id: "simboloSagrado",
          quantidade: 1
          },

          {
          id: "pergaminho",
          quantidade:10
          },

          {
          id: "veste",
          quantidade:1
          }

          ],

          moedas: {
          ouro: 8
          }
        },

        {id:"ouro",
          nome:"50 peças de ouro",
          itens: [],

          moedas: {
          ouro: 50
          }
        }
      ]

    }

  },

  soldado: {
    id: "soldado",
    nome: "Soldado",
    descricaoCurta: "Você teve treinamento militar e experiência em combate.",
    pericias: ["atletismo", "intimidacao"],
    ferramentas: ["jogo"],

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    talentoOrigem: "atacanteSelvagem",
    equipamento: ["insigniaMilitar", "kitExplorador"],

    moedas: {
      ouro: 10
    },

    atributosSugeridos: ["forca", "constituicao", "carisma"]
  },

  sabio: {
    id: "sabio",
    nome: "Sábio",
    descricaoCurta: "Você estudou conhecimento, história e teoria.",
    pericias: ["arcanismo", "historia"],
    ferramentas: [],

    idiomas: {
      quantidade: 2,
      fixos: [],
      opcoes: "qualquer"
    },

    talentoOrigem: "iniciadoMagia",
    equipamento: ["livro", "pena", "tinta"],

    moedas: {
      ouro: 8
    },

    atributosSugeridos: ["inteligencia", "sabedoria", "constituicao"]
  },

  criminoso: {
    id: "criminoso",
    nome: "Criminoso",
    descricaoCurta: "Você aprendeu a sobreviver à margem da lei.",
    pericias: ["furtividade", "prestidigitacao"],
    ferramentas: ["ferramentasLadrao"],

    idiomas: {
      quantidade: 0,
      fixos: [],
      opcoes: []
    },

    talentoOrigem: "alerta",
    equipamento: ["ferramentasLadrao", "roupasComuns"],

    moedas: {
      ouro: 15
    },

    atributosSugeridos: ["destreza", "carisma", "inteligencia"]
  },

}
