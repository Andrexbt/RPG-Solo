// =====================================================
// Banco de classes
// -----------------------------------------------------
// Guarda os dados básicos das classes disponíveis na
// criação de personagem. Este arquivo não controla a tela:
// ele apenas fornece informações para os outros scripts.
// =====================================================

window.bancoClasses = {
  // =====================================================
  // Guerreiro
  // =====================================================
  guerreiro: {
    id: "guerreiro",
    nome: "Guerreiro",
    dadoVida: 10,
    habilidadePrimaria: ["Força", "Destreza"],
    salvaguardas: ["forca", "constituicao"],

    // Perícias que o Guerreiro pode escolher no nível 1.
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

    // Proficiências usadas pela ficha para equipamentos e ataques.
    proficiencias: {
      armas: ["Armas simples", "Armas marciais"],
      armaduras: [
        "Armaduras leves",
        "Armaduras médias",
        "Armaduras pesadas",
        "Escudos"
      ]
    },

    // Quantidade de armas nas quais a classe pode escolher maestria.
    maestriasArmas: {
      quantidade: 3
    }
  },

  // =====================================================
  // Ladino
  // =====================================================
  ladino: {
    id: "ladino",
    nome: "Ladino",
    dadoVida: 8,
    habilidadePrimaria: ["Destreza"],
    salvaguardas: ["destreza", "inteligencia"],

    // Perícias que o Ladino pode escolher no nível 1.
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

    // O Ladino tem armas simples, espada curta, armadura leve
    // e ferramentas de ladrão.
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
