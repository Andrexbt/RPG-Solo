"use strict";

window.narracaoCombate = {

  categorias: {

    besta: {
      errou: [
        "A linha de ataque de {alvo} é mais baixa do que você está acostumado, e seu golpe passa por cima.",
        "{alvo} é mais ágil do que você previa e consegue escapar do ataque.",
      ],

      derrotou: [
        "{alvo} perde as forças e cai.",
      ],

      acertoContraJogador: [
        "{atacante} avança sobre você e acerta o ataque.",
      ],
    },

    humanoide: {
      errou: [
        "{alvo} percebe seu movimento a tempo e desvia do ataque.",
        "{alvo} consegue se proteger no último instante.",
      ],

      derrotou: [
        "{alvo} não consegue continuar lutando e cai.",
      ],

      acertoContraJogador: [
        "{atacante} encontra uma abertura em sua defesa e acerta o ataque.",
      ],
    },

  },

  ataques: {

    mordida: {
      acertou: [
      "{atacante} crava os dentes em {alvo}, causando {dano} de dano.",
      "{atacante} avança e abocanha {alvo}, causando {dano} de dano.",
      ],

      critico: [
        "{atacante} se lança com ferocidade sobre {alvo} e crava os dentes profundamente, causando {dano} de dano.",
      ],

      derrotou: [
        "{atacante} abocanha {alvo} com violência, causando {dano} de dano. {alvo} cai sem conseguir continuar lutando.",
     ],
    },

    lanca: {
    acertou: [
      "{atacante} atinge {alvo} com a lança.",
      "{atacante} encontra uma abertura e perfura {alvo} com a ponta da lança.",
    ],
    },

    espadaCurta: {
      acertou: [
        "{atacante} encontra uma abertura e atinge {alvo} com a espada curta, causando {dano} de dano.",
        "{atacante} desfere um golpe rápido contra {alvo}, causando {dano} de dano.",
      ],

      critico: [
        "{atacante} encontra uma abertura decisiva e atinge {alvo} em cheio com a espada curta, causando {dano} de dano.",
      ],

      derrotou: [
        "{atacante} atinge {alvo} com a espada curta, causando {dano} de dano. {alvo} não consegue continuar lutando e cai.",
      ],
      
    },

    arcoCurto: {
  acertou: [
    "A flecha disparada por {atacante} atinge {alvo}.",
    "{atacante} dispara rapidamente, e a flecha encontra {alvo}.",
  ],
    },

    bestaLeve: {
  acertou: [
    "O virote disparado por {atacante} atinge {alvo}.",
    "{atacante} dispara a besta leve e acerta {alvo}.",
  ],
    },

  },

};

function escolherVariacaoNarrativa(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return null;
  }

  const indice = Math.floor(
    Math.random() * lista.length,
  );

  return lista[indice];
}

function substituirTermosNarrativos(
  texto,
  contexto,
) {
  if (!texto) {
    return "";
  }

  return texto
    .replaceAll(
      "{atacante}",
      contexto.atacante ?? "O atacante",
    )
    .replaceAll(
      "{alvo}",
      contexto.alvo ?? "o alvo",
    )
    .replaceAll(
      "{dano}",
      String(contexto.dano ?? ""),
    );
}

function gerarNarracaoPorCategoria(
  categoria,
  evento,
  contexto,
) {
  const categoriaNarrativa =
    window.narracaoCombate
      .categorias?.[categoria];

  if (!categoriaNarrativa) {
    return null;
  }

  const variacoes =
    categoriaNarrativa[evento];

  const textoEscolhido =
    escolherVariacaoNarrativa(variacoes);

  if (!textoEscolhido) {
    return null;
  }

  return substituirTermosNarrativos(
    textoEscolhido,
    contexto,
  );
}

function gerarNarracaoPorAtaque(
  tipoNarrativo,
  evento,
  contexto,
) {
  const ataqueNarrativo =
    window.narracaoCombate
      .ataques?.[tipoNarrativo];

  if (!ataqueNarrativo) {
    return null;
  }

  const variacoes =
    ataqueNarrativo[evento];

  const textoEscolhido =
    escolherVariacaoNarrativa(variacoes);

  if (!textoEscolhido) {
    return null;
  }

  return substituirTermosNarrativos(
    textoEscolhido,
    contexto,
  );
}

function gerarNarracaoCombate(configuracao) {
  const {
    atacante,
    alvo,
    ataque,
    evento,
    dano,
  } = configuracao;

  const contexto = {
    atacante:
      atacante?.narracao?.termos?.sujeito ??
      atacante?.nome ??
      "O atacante",

    alvo:
      alvo?.narracao?.termos?.sujeito ??
      alvo?.nome ??
      "o alvo",

    dano: dano ?? "",
  };

  const tipoNarrativoAtaque =
    atacante
      ?.narracao
      ?.ataques
      ?.[ataque?.id]
      ?.tipoNarrativo;

  if (
    tipoNarrativoAtaque &&
    (
      evento === "acertou" ||
      evento === "critico" ||
      evento === "derrotou"
    )
  ) {
    const narracaoAtaque =
      gerarNarracaoPorAtaque(
        tipoNarrativoAtaque,
        evento,
        contexto,
      );

    if (narracaoAtaque) {
      return narracaoAtaque;
    }
  }

  const categoriaNarrativa =
    alvo?.narracao?.categoria ??
    atacante?.narracao?.categoria;

  if (categoriaNarrativa) {
    const narracaoCategoria =
      gerarNarracaoPorCategoria(
        categoriaNarrativa,
        evento,
        contexto,
      );

    if (narracaoCategoria) {
      return narracaoCategoria;
    }
  }

  return null;
}

window.gerarNarracaoCombate =
  gerarNarracaoCombate;

window.gerarNarracaoPorCategoria =
  gerarNarracaoPorCategoria;

window.gerarNarracaoPorAtaque =
  gerarNarracaoPorAtaque;