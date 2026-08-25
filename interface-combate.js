"use strict";

function exibirTelaAventura() {
  visualizacaoCombate.hidden = true;

  visualizacaoAventura.hidden = false;

  painelComandosCombate.hidden = true;

  layoutAventura.classList.remove("modo-combate");

   devolverCaixaDadosParaAventura();
}

function moverCaixaDadosParaCombate() {
  if (!janelaDados) {
    return;
  }

  document.body.append(janelaDados);

  janelaDados.classList.remove(
    "janela-encaixada",
  );

  janelaDados.style.left = "24px";
  janelaDados.style.right = "auto";
  janelaDados.style.bottom = "24px";
  janelaDados.style.top = "auto";
}

function exibirTelaCombate() {
  visualizacaoAventura.hidden = true;

  painelComandosCombate.hidden = false;

  visualizacaoCombate.hidden = false;

  layoutAventura.classList.add("modo-combate");

  moverCaixaDadosParaCombate();
}

function devolverCaixaDadosParaAventura() {
  if (
    !janelaDados ||
    !marcadorOriginalJanelaDados.parentNode
  ) {
    return;
  }

  marcadorOriginalJanelaDados.parentNode.insertBefore(
    janelaDados,
    marcadorOriginalJanelaDados.nextSibling,
  );

  janelaDados.classList.add(
    "janela-encaixada",
  );

  janelaDados.style.left = "";
  janelaDados.style.right = "";
  janelaDados.style.bottom = "";
  janelaDados.style.top = "";
}

function atualizarIndicadorRecurso(elemento, disponivel) {
  if (typeof disponivel !== "boolean") {
    elemento.textContent = "—";

    elemento.removeAttribute("data-disponivel");

    return;
  }

  elemento.textContent = disponivel ? "Disponíveis" : "Utilizadas";

  elemento.dataset.disponivel = String(disponivel);
}

function atualizarPontosDeVidaFichaCombate(
  combate,
) {
  const participanteJogador =
    combate.participantes.find(
      function encontrarJogador(
        participante,
      ) {
        return (
          participante.tipo ===
          "jogador"
        );
      },
    );

  if (
    !participanteJogador ||
    !estadoAtualJogo
      .personagem
      .dados
  ) {
    return;
  }

  estadoAtualJogo
    .personagem
    .dados
    .combate
    .pontosDeVida =
    structuredClone(
      participanteJogador
        .pontosDeVida,
    );

  const areaFicha =
    document.getElementById(
      "conteudoFicha",
    );

  if (!areaFicha) {
    return;
  }

  window.FichaPersonagem.renderizar(
    estadoAtualJogo
      .personagem
      .dados,
    areaFicha,
    {
      secoes: [
        "combate",
      ],
    },
  );
}

function alvoDisponivelParaAtaque(
  combate,
  atacante,
  alvo,
) {
  if (
    !combate ||
    !atacante ||
    !alvo ||
    atacante.tipo !== "jogador" ||
    alvo.tipo !== "inimigo" ||
    alvo.estado === "derrotado"
  ) {
    return false;
  }

  const ataques =
    atacante.ataques ?? [];

  return ataques.some(
    function ataqueAlcancaAlvo(
      ataque,
    ) {
      const resultado =
        SistemaCombate
          .validarSelecaoAcao(
            atacante,
            alvo,
            ataque,
          );

      return resultado.sucesso;
    },
  );
}

function atualizarDestaquesAlvosCombate(
  combate,
) {
  const modoSelecaoAtivo =
    !painelAtaquesCombate.hidden;

  tabuleiroCombate.classList.toggle(
    "selecionando-alvo",
    modoSelecaoAtivo,
  );

  const atacante =
    combate?.participantes.find(
      (participante) =>
        participante.id ===
        combate.participanteAtivoId,
    );

  const tokens =
    tabuleiroCombate.querySelectorAll(
      ".token-combate",
    );

  for (const token of tokens) {
    const participante =
      combate?.participantes.find(
        (item) =>
          item.id ===
          token.dataset.idParticipante,
      );

    const alvoDisponivel =
      modoSelecaoAtivo &&
      alvoDisponivelParaAtaque(
        combate,
        atacante,
        participante,
      );

    token.classList.toggle(
      "token-alvo-disponivel",
      alvoDisponivel,
    );
  }
}

function celulaDisponivelParaMovimento(
  combate,
  participante,
  coluna,
  linha,
) {
  if (
    !combate ||
    !participante ||
    participante.tipo !== "jogador" ||
    combate.participanteAtivoId !==
      participante.id
  ) {
    return false;
  }

  const celulaOcupada =
    combate.participantes.some(
      function verificarOcupacao(
        outroParticipante,
      ) {
        return (
          outroParticipante.id !==
            participante.id &&
          outroParticipante.estado !==
            "derrotado" &&
          outroParticipante.posicao.coluna ===
            coluna &&
          outroParticipante.posicao.linha ===
            linha
        );
      },
    );

  if (celulaOcupada) {
    return false;
  }

  const distancia =
    SistemaCombate.calcularDistancia(
      participante.posicao,
      {
        coluna,
        linha,
      },
    );

  return (
    distancia > 0 &&
    distancia <=
      participante.movimentoRestante
  );
}

function atualizarDestaquesMovimentoCombate(
  combate,
) {
  const participante =
    combate?.participantes.find(
      (item) =>
        item.id ===
        combate.participanteSelecionadoId,
    );

  const modoMovimentoAtivo =
    participante?.tipo === "jogador" &&
    participante.id ===
      combate?.participanteAtivoId &&
    participante.movimentoRestante > 0 &&
    painelAtaquesCombate.hidden;

  tabuleiroCombate.classList.toggle(
    "selecionando-movimento",
    Boolean(modoMovimentoAtivo),
  );

  const celulas =
    tabuleiroCombate.querySelectorAll(
      ".celula-combate",
    );

  for (const celula of celulas) {
    const coluna =
      Number(celula.dataset.coluna);

    const linha =
      Number(celula.dataset.linha);

    const disponivel =
      modoMovimentoAtivo &&
      celulaDisponivelParaMovimento(
        combate,
        participante,
        coluna,
        linha,
      );

    celula.classList.toggle(
      "celula-movimento-disponivel",
      disponivel,
    );
  }
}

function atualizarInterfaceTurno(combate) {
  const participanteAtivo = combate.participantes.find(
    (participante) => participante.id === combate.participanteAtivoId,
  );

  const participanteJogadorAtivo = participanteAtivo?.tipo === "jogador" ? participanteAtivo : null;

  botaoEncerrarTurno.disabled = !participanteJogadorAtivo || combate.status !== "ativo";

  numeroRodadaCombate.textContent = combate.rodada;

  renderizarFilaIniciativa(combate);

  movimentoRestanteCombate.textContent = participanteJogadorAtivo
    ? `${participanteJogadorAtivo.movimentoRestante} / ` +
      `${participanteJogadorAtivo.movimentoMaximo}`
    : "—";

  atualizarIndicadorRecurso(acaoDisponivelCombate, participanteJogadorAtivo?.acaoDisponivel);

  atualizarIndicadorRecurso(
    acaoBonusDisponivelCombate,
    participanteJogadorAtivo?.acaoBonusDisponivel,
  );

  renderizarAcoesCombate(participanteJogadorAtivo);

  renderizarListaAtaquesCombate(combate, participanteJogadorAtivo);

  const tokens = tabuleiroCombate.querySelectorAll(".token-combate");

  for (const token of tokens) {
    const participanteDoToken = combate.participantes.find(
      (participante) => participante.id === token.dataset.idParticipante,
    );

    if (participanteDoToken) {
      token.style.gridColumn = participanteDoToken.posicao.coluna;

      token.style.gridRow = participanteDoToken.posicao.linha;

      renderizarCondicoesToken(
  token,
  participanteDoToken,
  combate,
);


      if (
  participanteDoToken &&
  participanteDoToken.tipo === "jogador"
) {
      const pontosAtuais =
    Number(
      participanteDoToken
        .pontosDeVida
        ?.atuais,
    ) || 0;

  const pontosMaximos =
    Number(
      participanteDoToken
        .pontosDeVida
        ?.maximo,
    ) || 0;

    const textoPontosDeVida =
  token.querySelector(
    ".texto-pontos-vida-token",
  );

if (textoPontosDeVida) {
  textoPontosDeVida.textContent =
    `${pontosAtuais} / ${pontosMaximos}`;
}

  const porcentagemVida =
    pontosMaximos > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (
              pontosAtuais /
              pontosMaximos
            ) * 100,
          ),
        )
      : 0;

  const preenchimento =
    token.querySelector(
      ".preenchimento-pontos-vida-token",
    );

  if (preenchimento) {
    preenchimento.style.width =
      `${porcentagemVida}%`;
  }
}
    }

    token.classList.toggle(
      "token-turno-ativo",
      token.dataset.idParticipante === combate.participanteAtivoId,
    );

    token.classList.toggle(
      "token-alvo-selecionado",
      token.dataset.idParticipante === combate.alvoSelecionadoId,
    );

    token.classList.toggle("token-derrotado", participanteDoToken?.estado === "derrotado");
  }

  atualizarDestaquesAlvosCombate(
  combate,
);

atualizarDestaquesMovimentoCombate(
  combate,
);

  atualizarPontosDeVidaFichaCombate(
  combate,
);

  painelTurnoCombate.hidden = false;
}
