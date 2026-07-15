// =====================================================
// Banco de espécies
// -----------------------------------------------------
// Guarda as espécies disponíveis na criação de personagem.
// Cada espécie define tamanho, velocidade e idiomas fixos
// concedidos automaticamente.
// =====================================================

window.bancoEspecies = {
  especies: {
    // =====================================================
    // Espécies jogáveis
    // =====================================================
    humano: {
      id: "humano",
      nome: "Humano",
      velocidade: "9 m",
      tamanho: "Médio",
      idiomasFixos: []
    },

    anao: {
      id: "anao",
      nome: "Anão",
      velocidade: "9 m",
      tamanho: "Médio",
      idiomasFixos: ["anao"]
    },

    elfo: {
      id: "elfo",
      nome: "Elfo",
      velocidade: "9 m",
      tamanho: "Médio",
      idiomasFixos: ["elfico"]
    },

    halfling: {
      id: "halfling",
      nome: "Halfling",
      velocidade: "9 m",
      tamanho: "Pequeno",
      idiomasFixos: ["halfling"]
    }
  }
};
