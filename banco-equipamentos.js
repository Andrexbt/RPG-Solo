window.bancoEquipamentos = {

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

  armas: {

    espadaLonga: {
      nome: "Espada longa",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "Sap",
      propriedades: ["versatil"]
    },

    machadoDeBatalha: {
      nome: "Machado de batalha",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d8",
      tipoDano: "cortante",
      maestria: "Topple",
      propriedades: ["versatil"]
    },

    lanca: {
      nome: "Lança",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "Sap",
      propriedades: ["arremesso", "versatil"]
    },

    arcoLongo: {
      nome: "Arco longo",
      tipo: "marcial",
      categoria: "distância",
      atributoAtaque: "destreza",
      dano: "1d8",
      tipoDano: "perfurante",
      maestria: "Slow",
      propriedades: ["duasMaos", "municao"]
    },

     espadaCurta: {
      nome: "Espada curta",
      tipo: "marcial",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d6",
      tipoDano: "perfurante",
      maestria: "Vex",
      propriedades: ["leve", "acuidade"]
    },

     adaga: {
      nome: "Adaga",
      tipo: "simples",
      categoria: "corpo-a-corpo",
      atributoAtaque: "forca",
      dano: "1d4",
      tipoDano: "perfurante",
      maestria: "Nick",
      propriedades: ["leve", "arremesso", "acuidade"]
    }

  },

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