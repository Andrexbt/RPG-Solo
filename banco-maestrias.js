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
    descricaoCurta: "Permite atingir outro alvo próximo em certas condições.",
    descricaoLonga: "A maestria Cleave representa um golpe amplo, capaz de ameaçar mais de um inimigo próximo. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  graze: {
    id: "graze",
    nome: "Graze",
    descricaoCurta: "Mesmo quando erra, o ataque ainda pode causar algum efeito.",
    descricaoLonga: "A maestria Graze representa um ataque que ainda raspa, pressiona ou causa impacto mesmo quando não atinge plenamente o alvo. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  nick: {
    id: "nick",
    nome: "Nick",
    descricaoCurta: "Facilita ataques com armas leves.",
    descricaoLonga: "A maestria Nick representa um golpe rápido e preciso, útil para personagens que lutam com armas leves ou em sequência. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  push: {
    id: "push",
    nome: "Push",
    descricaoCurta: "Pode empurrar o alvo atingido.",
    descricaoLonga: "A maestria Push representa um ataque capaz de deslocar o alvo pela força do impacto. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  sap: {
    id: "sap",
    nome: "Sap",
    descricaoCurta: "Prejudica a próxima ação ofensiva do alvo.",
    descricaoLonga: "A maestria Sap representa um golpe que atrapalha a capacidade ofensiva do alvo. Em combate, ela pode dificultar a próxima ação agressiva da criatura atingida. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  slow: {
    id: "slow",
    nome: "Slow",
    descricaoCurta: "Reduz temporariamente o deslocamento do alvo.",
    descricaoLonga: "A maestria Slow representa um golpe que atrasa, desequilibra ou limita o movimento do alvo. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  topple: {
    id: "topple",
    nome: "Topple",
    descricaoCurta: "Pode derrubar o alvo.",
    descricaoLonga: "A maestria Topple representa um ataque que pode tirar o alvo do equilíbrio e derrubá-lo. A automação completa desse efeito será implementada futuramente no sistema de combate."
  },

  vex: {
    id: "vex",
    nome: "Vex",
    descricaoCurta: "Ajuda a criar vantagem contra o alvo.",
    descricaoLonga: "A maestria Vex representa um golpe que expõe uma abertura no inimigo, facilitando ataques posteriores contra ele. A automação completa desse efeito será implementada futuramente no sistema de combate."
  }
};
