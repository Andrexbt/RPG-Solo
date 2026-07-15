// =====================================================
// Banco de magias
// -----------------------------------------------------
// Guarda a progressão mágica das classes. A seleção completa
// de magias ainda será implementada; por enquanto, este banco
// informa se uma classe possui escolhas mágicas no nível atual.
// =====================================================

window.bancoMagias = {
  // =====================================================
  // Progressão mágica por classe
  // =====================================================
  progressaoMagias: {
    mago: {
      nivel1: {
        temMagias: true,
        mensagem: "Esta classe possui escolhas de magia no nível atual.",
        escolhas: []
      }
    },

    clerigo: {
      nivel1: {
        temMagias: true,
        mensagem: "Esta classe possui escolhas de magia no nível atual.",
        escolhas: []
      }
    }
  }
};