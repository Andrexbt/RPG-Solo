// =====================================================
// Banco de magias
// -----------------------------------------------------
// Guarda as magias disponíveis e a progressão mágica das
// classes. Este arquivo só fornece dados; a tela de escolha
// das magias será controlada por criacao-personagem.js.
// =====================================================

window.bancoMagias = {

  // =====================================================
  // Magias disponíveis
  // -----------------------------------------------------
  // nivel 0 = truque.
  // nivel 1 = magia de 1º círculo.
  // =====================================================

  magias: {

    // =====================================================
    // Truques de Clérigo
    // =====================================================

    chamaSagrada: {
      id: "chamaSagrada",
      nome: "Chama Sagrada",
      nivel: 0,
      escola: "Evocação",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "18 m",
      componentes: ["V", "S"],
      duracao: "Instantânea",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: true,
      salvaguarda: "destreza",
      descricaoCurta: "Uma criatura é atingida por energia radiante se falhar em uma salvaguarda.",
      descricaoLonga: "Você invoca energia radiante contra uma criatura que possa ver dentro do alcance. A criatura precisa resistir com uma salvaguarda de Destreza; se falhar, sofre dano radiante."
    },

    orientacao: {
      id: "orientacao",
      nome: "Orientação",
      nivel: 0,
      escola: "Adivinhação",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "Toque",
      componentes: ["V", "S"],
      duracao: "Concentração, até 1 minuto",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Ajuda uma criatura em um teste de atributo.",
      descricaoLonga: "Você concede uma breve orientação divina a uma criatura tocada, ajudando-a em um teste de atributo durante a duração da magia."
    },

    taumaturgia: {
      id: "taumaturgia",
      nome: "Taumaturgia",
      nivel: 0,
      escola: "Transmutação",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "9 m",
      componentes: ["V"],
      duracao: "Até 1 minuto",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Produz pequenos sinais sobrenaturais ligados ao poder divino.",
      descricaoLonga: "Você manifesta um pequeno sinal sobrenatural, como alterar a voz, fazer chamas tremularem, abrir portas destrancadas ou criar outros efeitos narrativos simples."
    },

    pouparOsMortos: {
      id: "pouparOsMortos",
      nome: "Poupar os Mortos",
      nivel: 0,
      escola: "Necromancia",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "Toque",
      componentes: ["V", "S"],
      duracao: "Instantânea",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Estabiliza uma criatura morrendo.",
      descricaoLonga: "Você toca uma criatura viva que esteja morrendo e a estabiliza, impedindo que continue fazendo salvaguardas contra a morte."
    },

    // =====================================================
    // Magias de 1º círculo de Clérigo
    // =====================================================

    curarFerimentos: {
      id: "curarFerimentos",
      nome: "Curar Ferimentos",
      nivel: 1,
      escola: "Abjuração",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "Toque",
      componentes: ["V", "S"],
      duracao: "Instantânea",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Recupera pontos de vida de uma criatura tocada.",
      descricaoLonga: "Você canaliza energia curativa para uma criatura que tocar, restaurando parte dos seus pontos de vida."
    },

    bencao: {
      id: "bencao",
      nome: "Bênção",
      nivel: 1,
      escola: "Encantamento",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "9 m",
      componentes: ["V", "S", "M"],
      duracao: "Concentração, até 1 minuto",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Abençoa aliados, melhorando ataques e salvaguardas.",
      descricaoLonga: "Você abençoa criaturas dentro do alcance. Enquanto a magia durar, elas recebem ajuda divina em jogadas de ataque e salvaguardas."
    },

    escudoDaFe: {
      id: "escudoDaFe",
      nome: "Escudo da Fé",
      nivel: 1,
      escola: "Abjuração",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação bônus",
      alcance: "18 m",
      componentes: ["V", "S", "M"],
      duracao: "Concentração, até 10 minutos",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Protege uma criatura com energia divina.",
      descricaoLonga: "Uma criatura escolhida é envolvida por uma proteção cintilante, aumentando sua defesa enquanto a magia durar."
    },

    raioGuiador: {
      id: "raioGuiador",
      nome: "Raio Guiador",
      nivel: 1,
      escola: "Evocação",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "36 m",
      componentes: ["V", "S"],
      duracao: "1 rodada",
      exigeAtaqueMagico: true,
      exigeSalvaguarda: false,
      descricaoCurta: "Um raio luminoso causa dano radiante e ajuda o próximo ataque contra o alvo.",
      descricaoLonga: "Você dispara um raio de luz contra uma criatura. Se atingir, causa dano radiante e deixa o alvo iluminado por energia divina, facilitando o próximo ataque contra ele."
    },

    detectarMagia: {
      id: "detectarMagia",
      nome: "Detectar Magia",
      nivel: 1,
      escola: "Adivinhação",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "Pessoal",
      componentes: ["V", "S"],
      duracao: "Concentração, até 10 minutos",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: false,
      descricaoCurta: "Permite perceber a presença de magia nas proximidades.",
      descricaoLonga: "Durante a duração da magia, você pode perceber a presença de efeitos mágicos próximos e identificar sua escola quando apropriado."
    },

    comando: {
      id: "comando",
      nome: "Comando",
      nivel: 1,
      escola: "Encantamento",
      classes: ["clerigo"],
      tempoConjuracao: "1 ação",
      alcance: "18 m",
      componentes: ["V"],
      duracao: "1 rodada",
      exigeAtaqueMagico: false,
      exigeSalvaguarda: true,
      salvaguarda: "sabedoria",
      descricaoCurta: "Dá uma ordem curta a uma criatura.",
      descricaoLonga: "Você pronuncia uma ordem breve para uma criatura dentro do alcance. Se ela falhar na salvaguarda, tenta obedecer ao comando em seu próximo turno."
    }
  },

  // =====================================================
  // Progressão mágica por classe
  // -----------------------------------------------------
  // Define quantos truques, magias preparadas e espaços de
  // magia a classe possui no nível 1.
  // =====================================================

  progressaoMagias: {
    
    mago: {
      nivel1: {
        temMagias: true,
        atributoConjuracao: "inteligencia",
        truquesConhecidos: 3,
        magiasPreparadas: 4,
        espacosMagia: {
          nivel1: 2
        },
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
        mensagem: "Escolha 3 truques e 4 magias preparadas de 1º círculo.",
        escolhas: []
      }
    }
  }

};