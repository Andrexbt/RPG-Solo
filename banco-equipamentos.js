// =====================================================
// Banco de equipamentos
// -----------------------------------------------------
// Guarda armaduras, armas e itens secundários usados na
// criação e na ficha do personagem. Este arquivo contém
// apenas dados; os cálculos de CA, ataque e dano ficam nos
// scripts de ficha/criação.
// =====================================================

window.bancoEquipamentos = {
  // =====================================================
  // Armaduras
  // -----------------------------------------------------
  // caBase: valor inicial da Classe de Armadura.
  // usaDestreza: indica se o modificador de Destreza entra.
  // limiteDestreza: limite máximo do modificador, quando houver.
  // =====================================================
  armaduras: {
    semArmadura: {
      nome: "Sem armadura",
      caBase: 10,
      usaDestreza: true,
      limiteDestreza: null
    },

    couro: {
      nome: "Armadura de couro",
      caBase: 11,
      usaDestreza: true,
      limiteDestreza: null
    },

    cotaDeMalha: {
      nome: "Cota de malha",
      caBase: 16,
      usaDestreza: false,
      limiteDestreza: 0
    }
  },

  // =====================================================
  // Armas
  // -----------------------------------------------------
  // tipo define proficiência simples/marcial.
  // categoria separa corpo a corpo de distância.
  // maestria aponta para banco-maestrias.js.
  // propriedades aponta para banco-propriedades-armas.js.
  // =====================================================
  armas: {
    espadaLonga: {
      nome: "Espada longa",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "sap",
      propriedades: ["versatil"]
    },

    machadoDeBatalha: {
      nome: "Machado de batalha",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "topple",
      propriedades: ["versatil"]
    },

    lanca: {
      nome: "Lança",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "sap",
      propriedades: ["arremesso", "versatil"]
    },

    arcoLongo: {
      nome: "Arco longo",
      tipo: "marcial",
      categoria: "distancia",
      atributoAtaque: "destreza",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "slow",
      propriedades: ["duasMaos", "municao"]
    },

    espadaCurta: {
      nome: "Espada curta",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "vex",
      propriedades: ["leve", "acuidade"]
    },

    adaga: {
      nome: "Adaga",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "perfurante",
      maestria: "nick",
      propriedades: ["leve", "arremesso", "acuidade"]
    }
  },

  // =====================================================
  // Itens secundários
  // -----------------------------------------------------
  // Representam o que o personagem usa na outra mão.
  // Escudo altera CA; arma secundária ativa regras de duas armas.
  // =====================================================
  itensSecundarios: {
    escudo: {
      nome: "Escudo",
      bonusCA: 2
    },

    armaSecundaria: {
      nome: "Arma secundária",
      bonusCA: 0
    },

    nada: {
      nome: "Nada",
      bonusCA: 0
    }
  }
};