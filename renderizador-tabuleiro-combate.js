"use strict";

function criarTokenCombate(participante) {
  const token = document.createElement("button");

  token.type = "button";

  token.classList.add("token-combate", `token-${participante.tipo}`);

  token.dataset.idParticipante = participante.id;

  token.style.gridColumn = participante.posicao.coluna;

  token.style.gridRow = participante.posicao.linha;

  const representacao = participante.representacao;

  if (representacao?.imagem) {
    token.classList.add("token-com-imagem");

    const imagemAvatar = document.createElement("img");

    imagemAvatar.classList.add("imagem-token-combate");

    imagemAvatar.src = representacao.imagem;

    imagemAvatar.alt = "";

    token.append(imagemAvatar);

    if (representacao.frame) {
      const imagemFrame = document.createElement("img");

      imagemFrame.classList.add("frame-token-combate");

      imagemFrame.src = representacao.frame;

      imagemFrame.alt = "";

      token.append(imagemFrame);
    }

    const numeroParticipante = obterNumeroParticipante(participante);

    if (numeroParticipante) {
      const identificador = document.createElement("span");

      identificador.className = "identificador-participante";

      identificador.textContent = numeroParticipante;

      token.append(identificador);
    }
  } else {
    token.textContent = participante.tipo === "jogador" ? "P" : "I";
  }

  if (participante.tipo === "jogador") {
    const barraPontosDeVida = document.createElement("span");

    barraPontosDeVida.classList.add("barra-pontos-vida-token");

    const preenchimentoPontosDeVida = document.createElement("span");

    preenchimentoPontosDeVida.classList.add("preenchimento-pontos-vida-token");

    const textoPontosDeVida = document.createElement("span");

    textoPontosDeVida.classList.add("texto-pontos-vida-token");

    barraPontosDeVida.append(preenchimentoPontosDeVida, textoPontosDeVida);

    token.append(barraPontosDeVida);
  }

  const areaCondicoes =
  document.createElement("span");

areaCondicoes.className =
  "condicoes-token-combate";

areaCondicoes.setAttribute(
  "aria-hidden",
  "true",
);

token.append(areaCondicoes);

renderizarCondicoesToken(
  token,
  participante,
);

  token.setAttribute("aria-label", participante.id);

  return token;
}

function renderizarCondicoesToken(
  token,
  participante,
  combate = null,
) {
  const areaCondicoes =
    token.querySelector(
      ".condicoes-token-combate",
    );

  if (!areaCondicoes) {
    return;
  }

  areaCondicoes.innerHTML = "";

  const condicoes =
    participante.condicoes ?? [];

  const condicoesConhecidas =
    condicoes
      .map(
        (condicao) =>
          window.bancoCondicoes?.[
            condicao.id
          ],
      )
      .filter(Boolean);

  const efeitosTemporarios =
    combate?.efeitosTemporarios ?? [];

  const possuiLentidao =
    efeitosTemporarios.some(
      function encontrarLentidao(
        efeito,
      ) {
        return (
          efeito.tipo ===
            "modificadorDeslocamento" &&
          efeito.participanteId ===
            participante.id &&
          Number(efeito.valorCelulas) < 0
        );
      },
    );

  const efeitosVisuais = [];

  if (possuiLentidao) {
    efeitosVisuais.push(
      window.bancoEfeitosVisuais
        ?.lentidao,
    );
  }

  const indicadoresVisuais = [
    ...condicoesConhecidas,
    ...efeitosVisuais.filter(Boolean),
  ];

  const limiteVisivel = 3;

  for (
    const condicao of
      indicadoresVisuais.slice(
        0,
        limiteVisivel,
      )
  ) {
    const marcador =
      document.createElement("span");

    marcador.className =
      "icone-condicao-token";

    marcador.title =
      condicao.nome;

    const imagem =
      document.createElement("img");

    imagem.src =
      condicao.icone;

    imagem.alt = "";

    marcador.append(imagem);

    areaCondicoes.append(
      marcador,
    );
  }

  const quantidadeOculta =
    indicadoresVisuais.length -
    limiteVisivel;

  if (quantidadeOculta > 0) {
    const excedentes =
      document.createElement("span");

    excedentes.className =
      "quantidade-condicoes-token";

    excedentes.textContent =
      `+${quantidadeOculta}`;

    excedentes.title =
      indicadoresVisuais
        .slice(limiteVisivel)
        .map(
          (condicao) =>
            condicao.nome,
        )
        .join(", ");

    areaCondicoes.append(
      excedentes,
    );
  }

  const nomesCondicoes =
    indicadoresVisuais
      .map(
        (condicao) =>
          condicao.nome,
      )
      .join(", ");

  token.setAttribute(
    "aria-label",
    nomesCondicoes
      ? `${participante.nome}. Estados: ${nomesCondicoes}.`
      : participante.nome,
  );
}

function criarCelulasTabuleiro(combate) {
  const quantidadeColunas = combate.tabuleiro.colunas;

  const quantidadeLinhas = combate.tabuleiro.linhas;

  for (let linha = 1; linha <= quantidadeLinhas; linha++) {
    for (let coluna = 1; coluna <= quantidadeColunas; coluna++) {
      const celula = document.createElement("button");

      celula.type = "button";

      celula.classList.add("celula-combate");

      celula.dataset.coluna = coluna;

      celula.dataset.linha = linha;

      celula.style.gridColumn = coluna;

      celula.style.gridRow = linha;

      celula.setAttribute("aria-label", `Coluna ${coluna}, linha ${linha}`);

      celula.title = `Coluna ${coluna}, linha ${linha}`;

      tabuleiroCombate.append(celula);
    }
  }
}

function obterNumeroParticipante(participante) {
  if (participante.tipo !== "inimigo") {
    return null;
  }

  const numeroEncontrado = participante.nome.match(/\d+$/);

  return numeroEncontrado ? numeroEncontrado[0] : null;
}

function renderizarParticipantesCombate(participantes) {
  for (const participante of participantes) {
    const token = criarTokenCombate(participante);

    tabuleiroCombate.append(token);
  }
}

function celulaPertenceAreaCombate(coluna, linha, area) {
  const colunaInicial = Number(area.colunaInicial);
  const colunaFinal = Number(area.colunaFinal ?? area.colunaInicial);
  const linhaInicial = Number(area.linhaInicial);
  const linhaFinal = Number(area.linhaFinal ?? area.linhaInicial);

  return (
    Number.isFinite(colunaInicial) &&
    Number.isFinite(colunaFinal) &&
    Number.isFinite(linhaInicial) &&
    Number.isFinite(linhaFinal) &&
    coluna >= Math.min(colunaInicial, colunaFinal) &&
    coluna <= Math.max(colunaInicial, colunaFinal) &&
    linha >= Math.min(linhaInicial, linhaFinal) &&
    linha <= Math.max(linhaInicial, linhaFinal)
  );
}

function renderizarTerrenosCombate(combate) {
  const celulas =
    tabuleiroCombate.querySelectorAll(
      ".celula-combate",
    );

  for (const celula of celulas) {
    const coluna =
      Number(celula.dataset.coluna);

    const linha =
      Number(celula.dataset.linha);

    const tipoTerreno =
      SistemaCombate.obterTipoTerreno(
        combate,
        coluna,
        linha,
      );

    if (tipoTerreno === "normal") {
      continue;
    }

    celula.classList.add(
      `celula-terreno-${tipoTerreno}`,
    );

    const descricao =
      tipoTerreno === "bloqueado"
        ? "Terreno intransponível"
        : "Terreno difícil";

    celula.setAttribute(
      "aria-label",
      `Coluna ${coluna}, linha ${linha}. ${descricao}.`,
    );

    celula.title =
      `Coluna ${coluna}, linha ${linha}. ${descricao}.`;
  }
}

function renderizarVisaoCombate(combate) {
  const obterCelula = (coluna, linha) =>
    tabuleiroCombate.querySelector(
      `.celula-combate[data-coluna="${coluna}"][data-linha="${linha}"]`,
    );

  for (const regiao of combate.visao?.bloqueios ?? []) {
    const colunaInicial = Number(regiao.colunaInicial ?? regiao.coluna);
    const colunaFinal = Number(regiao.colunaFinal ?? regiao.coluna);
    const linhaInicial = Number(regiao.linhaInicial ?? regiao.linha);
    const linhaFinal = Number(regiao.linhaFinal ?? regiao.linha);

    for (let linha = Math.min(linhaInicial, linhaFinal); linha <= Math.max(linhaInicial, linhaFinal); linha++) {
      for (let coluna = Math.min(colunaInicial, colunaFinal); coluna <= Math.max(colunaInicial, colunaFinal); coluna++) {
        obterCelula(coluna, linha)?.classList.add("celula-bloqueio-visao");
      }
    }
  }

  for (const barreira of combate.visao?.barreiras ?? []) {
    const celula = obterCelula(Number(barreira.coluna), Number(barreira.linha));

    if (!celula || !barreira.lado || !barreira.tipo) {
      continue;
    }

    celula.classList.add(`celula-borda-${barreira.lado}-${barreira.tipo}`);
  }
}

function renderizarAreasObjetivoCombate(combate) {
  const areas = Object.entries(combate.areas ?? {}).filter(
    ([, area]) => area.visivel !== false,
  );

  if (areas.length === 0) {
    return;
  }

  const celulas = tabuleiroCombate.querySelectorAll(".celula-combate");

  for (const celula of celulas) {
    const coluna = Number(celula.dataset.coluna);
    const linha = Number(celula.dataset.linha);

    for (const [areaId, area] of areas) {
      if (!celulaPertenceAreaCombate(coluna, linha, area)) {
        continue;
      }

      celula.classList.add("celula-area-objetivo");
      celula.dataset.areaObjetivo = areaId;

      const rotulo = area.rotulo ?? "Área de objetivo";
      celula.setAttribute(
        "aria-label",
        `Coluna ${coluna}, linha ${linha}. ${rotulo}.`,
      );
    }
  }
}

function renderizarTabuleiroCombate(combate) {
  tabuleiroCombate.innerHTML = "";

  criarCelulasTabuleiro(combate);
  renderizarTerrenosCombate(combate);
  renderizarVisaoCombate(combate);

  renderizarAreasObjetivoCombate(combate);

  renderizarParticipantesCombate(combate.participantes);
}
