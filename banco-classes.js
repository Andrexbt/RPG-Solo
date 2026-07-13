window.bancoClasses = {

  guerreiro: {
    id: "guerreiro",
    nome: "Guerreiro",
    dadoVida: 10,
    habilidadePrimaria: ["Força", "Destreza"],
    salvaguardas: ["forca", "constituicao"],

    pericias: {
      quantidade: 2,
      opcoes: [
        "acrobacia",
        "adestrarAnimais",
        "atletismo",
        "historia",
        "intuicao",
        "intimidacao",
        "persuasao",
        "percepcao",
        "sobrevivencia"
      ]
    },

    proficiencias: {
      armas: ["Armas simples", "Armas marciais"],
      armaduras: [
        "Armaduras leves",
        "Armaduras médias",
        "Armaduras pesadas",
        "Escudos"
      ]
    },

    maestriasArmas: {
      quantidade: 3
    }
  },

  ladino: {
    id: "ladino",
    nome: "Ladino",
    dadoVida: 8,
    habilidadePrimaria: ["Destreza"],
    salvaguardas: ["destreza", "inteligencia"],

    pericias: {
      quantidade: 4,
      opcoes: [
        "acrobacia",
        "atletismo",
        "enganacao",
        "intuicao",
        "intimidacao",
        "investigacao",
        "percepcao",
        "persuasao",
        "prestidigitacao",
        "furtividade"
      ]
    },

    proficiencias: {
      armas: ["Armas simples"],
      armasEspecificas: ["espadaCurta"],
      armaduras: ["Armaduras leves"],
      ferramentas: ["Ferramentas de ladrão"]
    },

    maestriasArmas: {
      quantidade: 2
    }
  }

};
