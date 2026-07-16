// =====================================================
// Banco de magias
// -----------------------------------------------------
// Guarda a progressão mágica das classes. A seleção completa
// de magias ainda será implementada; por enquanto, este banco
// informa se uma classe possui escolhas mágicas no nível atual.
// =====================================================

window.bancoMagias = {
  // =====================================================
  // Magias cadastradas
  // -----------------------------------------------------
  // A lista real de magias será preenchida no próximo passo.
  // =====================================================
  magias: {},

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
        atributoConjuracao: "sabedoria",
        truquesConhecidos: 3,
        magiasPreparadas: 4,
        espacosMagia: {
          nivel1: 2
        },
        mensagem: "O Clérigo prepara e conjura magias usando Sabedoria.",
        escolhas: []
      }
    }
  }
};