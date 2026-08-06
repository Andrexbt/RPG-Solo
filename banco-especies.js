// =====================================================
// Banco de espécies
// -----------------------------------------------------
// Guarda as espécies disponíveis na criação de personagem.
// Cada espécie define tamanho, velocidade e idiomas fixos
// concedidos automaticamente.
// =====================================================

window.bancoEspecies = {
  tracos:{

    visaoNoEscuroAnao: {
      id: "visaoNoEscuroAnao",
      nome: "Visão no Escuro",

      descricaoCurta: "Você enxerga no escuro a uma distância maior que a maioria das criaturas.",

      regras: [
        {
          gatilho: "passivo",
          efeito: {
          tipo: "concederSentido",
          sentido: "visaoNoEscuro",
          alcance: 36,
          },
        },
     ],
    },

    resilienciaAna: {
  id: "resilienciaAna",
  nome: "Resiliência Anã",

  descricaoCurta:
    "Sua natureza anã torna você especialmente resistente a venenos.",

  regras: [
    {
      gatilho: "passivo",

      efeito: {
        tipo: "concederResistenciaDano",
        tipoDano: "veneno",
      },
    },

    {
      gatilho: "aoFazerSalvaguarda",

      condicao: {
        condicaoId: "envenenado",
        finalidades: [
          "evitar",
          "encerrar",
        ],
      },

      efeito: {
        tipo: "concederVantagem",
        rolagemAfetada: "salvaguarda",
      },
    },
  ],
},

tenacidadeAna: {
  id: "tenacidadeAna",
  nome: "Tenacidade Anã",

  descricaoCurta:
    "Sua resistência natural aumenta seus Pontos de Vida.",

  regras: [
    {
      gatilho: "aoCalcularPontosDeVidaMaximos",

      efeito: {
        tipo: "aumentarPontosDeVidaMaximos",

        quantidade: {
          tipo: "nivelPersonagem",
        },
      },
    },
  ],
},

conhecimentoDaPedra: {
  id: "conhecimentoDaPedra",
  nome: "Conhecimento da Pedra",

  descricaoCurta:
    "Ao entrar em sintonia com a pedra, você consegue perceber criaturas através de vibrações.",

  regras: [
    {
      gatilho: "aoAtivar",

      custo: "acaoBonus",

      requisito: {
        tipo: "contatoComSuperficie",
        material: "pedra",
      },

      efeito: {
        tipo: "concederSentidoTemporario",
        sentido: "sentidoTremor",
        alcance: 18,
        duracao: {
          quantidade: 10,
          unidade: "minutos",
        },
      },

      usos: {
        quantidade: {
          tipo: "bonusProficiencia",
        },

        recarga: "descansoLongo",
      },
    },
  ],
},

  },

  especies: {
    
    humano: {
      id: "humano",
      nome: "Humano",
      velocidade: "9 m",
      tamanho: "Médio",
      idiomasFixos: [],
    },

    anao: {
      id: "anao",
      nome: "Anão",
      tipoCriatura: "humanoide",
      velocidade: "9 m",
      tamanho: "Médio",
      idiomasFixos: ["anao"],
      tracos: [
        "visaoNoEscuroAnao",
        "resilienciaAna",
        "tenacidadeAna",
        "conhecimentoDaPedra",
      ],
    },

    elfo: {
      id: "elfo",
      nome: "Elfo",
      velocidade: "9 m",
      tamanho: "Médio",
      idiomasFixos: ["elfico"],
    },

    halfling: {
      id: "halfling",
      nome: "Halfling",
      velocidade: "9 m",
      tamanho: "Pequeno",
      idiomasFixos: ["halfling"],
    },
  },

};
