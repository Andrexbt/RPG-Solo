"use strict";

window.narracaoCombate = {

  categorias: {
    besta: {
      erroAtaqueJogador: [
        "A linha de ataque de {alvo} é mais baixa do que você está acostumado, e seu golpe passa por cima.",
        "{alvo} é mais ágil do que você previa e consegue escapar do ataque.",
      ],

      acertoContraJogador: [
        "{atacante} avança sobre você e acerta o ataque.",
      ],
    },

    humanoide: {
      erroAtaqueJogador: [
        "{alvo} percebe seu movimento a tempo e desvia do ataque.",
        "{alvo} consegue se proteger no último instante.",
      ],

      acertoContraJogador: [
        "{atacante} encontra uma abertura em sua defesa e acerta o ataque.",
      ],
    },
  },

  ataques: {
  mordida: {
    acertou: [
      "{atacante} crava os dentes em {alvo}.",
      "{atacante} avança e abocanha {alvo}.",
    ],
  },

  lanca: {
    acertou: [
      "{atacante} atinge {alvo} com a lança.",
      "{atacante} encontra uma abertura e perfura {alvo} com a ponta da lança.",
    ],
  },
},

};