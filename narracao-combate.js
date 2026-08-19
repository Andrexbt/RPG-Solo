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
    },

    humanoide: {
      errou: [
        "{alvo} percebe seu movimento a tempo e desvia do ataque.",
        "{alvo} consegue se proteger no último instante.",
      ],

      derrotou: [
        "{alvo} não consegue continuar lutando e cai.",
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
        "{atacante} atinge {alvo} com a lança, causando {dano} de dano.",
        "{atacante} encontra uma abertura e perfura {alvo} com a ponta da lança, causando {dano} de dano.",
      ],

      critico: [
        "{atacante} aproveita uma abertura decisiva e atravessa a defesa de {alvo} com a lança, causando {dano} de dano.",
      ],

      derrotou: [
        "{atacante} atinge {alvo} em cheio com a lança, causando {dano} de dano. {alvo} não consegue continuar lutando e cai.",
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
        "A flecha disparada por {atacante} atinge {alvo}, causando {dano} de dano.",
        "{atacante} dispara rapidamente, e a flecha encontra {alvo}, causando {dano} de dano.",
      ],

      critico: [
        "O disparo de {atacante} encontra um ponto vulnerável de {alvo}, causando {dano} de dano.",
      ],

      derrotou: [
        "A flecha disparada por {atacante} atinge {alvo}, causando {dano} de dano. {alvo} cai sem conseguir continuar lutando.",
      ],
    },

    cimitarra: {
      acertou: [
        "{atacante} atinge {alvo} com a cimitarra, causando {dano} de dano.",
        "{atacante} desfere um corte com a cimitarra contra {alvo}, causando {dano} de dano.",
      ],

      critico: [
        "{atacante} encontra uma abertura e desfere um golpe preciso com a cimitarra contra {alvo}, causando {dano} de dano.",
      ],

      derrotou: [
        "{atacante} atinge {alvo} com a cimitarra, causando {dano} de dano. {alvo} cai sem conseguir continuar lutando.",
      ],
    },

    bestaLeve: {
      acertou: [
        "O virote disparado por {atacante} atinge {alvo}, causando {dano} de dano.",
        "{atacante} dispara a besta leve e acerta {alvo}, causando {dano} de dano.",
      ],

      critico: [
        "O virote disparado por {atacante} encontra uma abertura precisa na defesa de {alvo}, causando {dano} de dano.",
      ],

      derrotou: [
        "O virote de {atacante} atinge {alvo}, causando {dano} de dano. {alvo} não consegue continuar lutando e cai.",
      ],
    },
  },

  fallbacks: {
    acertou: [
      "{atacante} atinge {alvo} com {ataque}, causando {dano} de dano.",
    ],

    critico: [
      "{atacante} encontra uma abertura decisiva e atinge {alvo} com {ataque}, causando {dano} de dano.",
    ],

    derrotou: [
      "{atacante} atinge {alvo} com {ataque}, causando {dano} de dano. {alvo} não consegue continuar lutando.",
    ],
  },
};

function escolherVariacaoNarrativa(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return null;
  }

  const indice = Math.floor(Math.random() * lista.length);

  return lista[indice];
}

function capitalizarPrimeiraLetra(texto) {
  if (!texto) {
    return "";
  }

  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}

function substituirTermosNarrativos(texto, contexto) {
  if (!texto) {
    return "";
  }

  const textoSubstituido = texto
    .replaceAll("{atacante}", contexto.atacante ?? "O atacante")
    .replaceAll("{alvo}", contexto.alvo ?? "o alvo")
    .replaceAll("{ataque}", contexto.ataque ?? "o ataque")
    .replaceAll("{dano}", String(contexto.dano ?? ""));

  return capitalizarPrimeiraLetra(textoSubstituido);
}

function obterFonteNarrativaParticipante(participante) {
  if (!participante) {
    return null;
  }

  if (participante.narracao) {
    return participante;
  }

  if (participante.tipo === "jogador") {
    return window.estadoJogo?.personagem?.dados ?? participante;
  }

  const idBase = String(participante.id ?? "").replace(/-\d+$/, "");
  const npcOriginal = window.estadoJogo?.npcs?.[idBase];

  return npcOriginal ?? participante;
}

function obterTermoNarrativo(participante, fonteNarrativa, papel) {
  if (participante?.tipo === "jogador") {
    return papel === "atacante" ? "Você" : "você";
  }

  return (
    fonteNarrativa?.narracao?.termos?.sujeito ??
    participante?.nome ??
    (papel === "atacante" ? "O atacante" : "o alvo")
  );
}

function gerarNarracaoPorCategoria(categoria, evento, contexto) {
  const categoriaNarrativa = window.narracaoCombate.categorias?.[categoria];

  if (!categoriaNarrativa) {
    return null;
  }

  const textoEscolhido = escolherVariacaoNarrativa(categoriaNarrativa[evento]);

  if (!textoEscolhido) {
    return null;
  }

  return substituirTermosNarrativos(textoEscolhido, contexto);
}

function gerarNarracaoPorAtaque(tipoNarrativo, evento, contexto) {
  const ataqueNarrativo = window.narracaoCombate.ataques?.[tipoNarrativo];

  if (!ataqueNarrativo) {
    return null;
  }

  const textoEscolhido = escolherVariacaoNarrativa(ataqueNarrativo[evento]);

  if (!textoEscolhido) {
    return null;
  }

  return substituirTermosNarrativos(textoEscolhido, contexto);
}

function gerarNarracaoFallback(evento, contexto) {
  const textoEscolhido = escolherVariacaoNarrativa(
    window.narracaoCombate.fallbacks?.[evento],
  );

  if (!textoEscolhido) {
    return null;
  }

  return substituirTermosNarrativos(textoEscolhido, contexto);
}

function gerarNarracaoCombate(configuracao) {
  const {
    atacante,
    alvo,
    ataque,
    evento,
    dano,
  } = configuracao;

  const fonteAtacante = obterFonteNarrativaParticipante(atacante);
  const fonteAlvo = obterFonteNarrativaParticipante(alvo);

  const contexto = {
    atacante: obterTermoNarrativo(atacante, fonteAtacante, "atacante"),
    alvo: obterTermoNarrativo(alvo, fonteAlvo, "alvo"),
    ataque: ataque?.nome?.toLowerCase?.() ?? "o ataque",
    dano: dano ?? "",
  };

  const tipoNarrativoConfigurado =
    fonteAtacante?.narracao?.ataques?.[ataque?.id]?.tipoNarrativo;

  const tipoNarrativoAtaque =
    tipoNarrativoConfigurado ??
    (window.narracaoCombate.ataques?.[ataque?.id] ? ataque.id : null);

  if (
    tipoNarrativoAtaque &&
    (evento === "acertou" || evento === "critico" || evento === "derrotou")
  ) {
    const narracaoAtaque = gerarNarracaoPorAtaque(
      tipoNarrativoAtaque,
      evento,
      contexto,
    );

    if (narracaoAtaque) {
      return narracaoAtaque;
    }
  }

  const categoriaNarrativa =
    fonteAlvo?.narracao?.categoria ??
    fonteAtacante?.narracao?.categoria;

  if (categoriaNarrativa) {
    const narracaoCategoria = gerarNarracaoPorCategoria(
      categoriaNarrativa,
      evento,
      contexto,
    );

    if (narracaoCategoria) {
      return narracaoCategoria;
    }
  }

  return gerarNarracaoFallback(evento, contexto);
}

function obterDadosAtaquePendente(combate, ataquePendente) {
  if (!combate || !ataquePendente) {
    return null;
  }

  const atacante = combate.participantes.find(
    (participante) => participante.id === ataquePendente.atacanteId,
  );

  const alvo = combate.participantes.find(
    (participante) => participante.id === ataquePendente.alvoId,
  );

  const ataque = atacante?.ataques?.find(
    (item) => item.id === ataquePendente.ataqueId,
  );

  if (!atacante || !alvo || !ataque) {
    return null;
  }

  return {
    atacante,
    alvo,
    ataque,
  };
}

function exibirNarracaoIntegrada(texto, combate) {
  if (!texto) {
    return;
  }

  const mensagemAcaoAtual = document.querySelector("#mensagemAcaoAtualCombate");
  const solicitacaoCombate = document.querySelector("#solicitacaoCombate");

  if (mensagemAcaoAtual) {
    mensagemAcaoAtual.textContent = texto;
  }

  if (solicitacaoCombate && combate?.status === "ativo") {
    solicitacaoCombate.textContent = texto;
    solicitacaoCombate.hidden = false;
  }
}

(function integrarNarracaoAoCombate() {
  const estadoIntegracao = {
    danoPendente: null,
    danoEscolhido: null,
    atualizandoMensagem: false,
  };

  function prepararSnapshotRolagem() {
    const combate = window.estadoJogo?.combateAtual;

    if (!combate) {
      return null;
    }

    if (combate.ataquePendente) {
      const dados = obterDadosAtaquePendente(combate, combate.ataquePendente);

      return dados
        ? {
            tipo: "ataque",
            combate,
            ...dados,
          }
        : null;
    }

    if (combate.danoPendente) {
      const dados = obterDadosAtaquePendente(combate, combate.danoPendente);

      if (!dados) {
        return null;
      }

      return {
        tipo: "dano",
        combate,
        critico: Boolean(combate.danoPendente.critico),
        pontosDeVidaAntes: dados.alvo.pontosDeVida?.atuais ?? null,
        ...dados,
      };
    }

    return null;
  }

  function concluirNarracaoDano(snapshot, danoInformado) {
    if (!snapshot) {
      return false;
    }

    const combate = snapshot.combate;

    if (combate.danoPendente) {
      estadoIntegracao.danoPendente = snapshot;
      return false;
    }

    const foiDerrotado = snapshot.alvo.estado === "derrotado";
    const evento = foiDerrotado
      ? "derrotou"
      : snapshot.critico
        ? "critico"
        : "acertou";

    let dano = Number(danoInformado);

    if (!Number.isFinite(dano)) {
      const pontosAtuais = snapshot.alvo.pontosDeVida?.atuais;

      if (
        Number.isFinite(snapshot.pontosDeVidaAntes) &&
        Number.isFinite(pontosAtuais)
      ) {
        dano = Math.max(0, snapshot.pontosDeVidaAntes - pontosAtuais);
      } else {
        dano = 0;
      }
    }

    const texto = gerarNarracaoCombate({
      atacante: snapshot.atacante,
      alvo: snapshot.alvo,
      ataque: snapshot.ataque,
      evento,
      dano,
    });

    exibirNarracaoIntegrada(texto, combate);

    estadoIntegracao.danoPendente = null;
    estadoIntegracao.danoEscolhido = null;

    return true;
  }

  document.addEventListener(
    "rolagemConcluida",
    function registrarContextoAntesDaResolucao(evento) {
      const snapshot = prepararSnapshotRolagem();

      if (!snapshot) {
        return;
      }

      window.queueMicrotask(function aplicarNarracaoDepoisDaResolucao() {
        if (snapshot.tipo === "ataque") {
          const danoCriado = snapshot.combate.danoPendente;

          if (!danoCriado) {
            const texto = gerarNarracaoCombate({
              atacante: snapshot.atacante,
              alvo: snapshot.alvo,
              ataque: snapshot.ataque,
              evento: "errou",
            });

            exibirNarracaoIntegrada(texto, snapshot.combate);
          }

          return;
        }

        estadoIntegracao.danoPendente = snapshot;

        concluirNarracaoDano(snapshot, evento.detail?.total);
      });
    },
    true,
  );

  document.addEventListener(
    "click",
    function registrarEscolhaDeRolagem(evento) {
      const botao = evento.target.closest("#acoesCombate button");

      if (!botao || !/Usar rolagem/i.test(botao.textContent ?? "")) {
        return;
      }

      const texto = botao.textContent ?? "";
      const correspondencia = texto.match(/=\s*(-?\d+)\s*$/);

      if (correspondencia) {
        estadoIntegracao.danoEscolhido = Number(correspondencia[1]);
      }

      window.queueMicrotask(function narrarDepoisDaEscolha() {
        concluirNarracaoDano(
          estadoIntegracao.danoPendente,
          estadoIntegracao.danoEscolhido,
        );
      });
    },
    true,
  );
})();

window.gerarNarracaoCombate = gerarNarracaoCombate;
window.gerarNarracaoPorCategoria = gerarNarracaoPorCategoria;
window.gerarNarracaoPorAtaque = gerarNarracaoPorAtaque;
