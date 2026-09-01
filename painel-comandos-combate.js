"use strict";

function abrirPainelAtaquesCombate() {
  painelAtaquesCombate.hidden = false;

  const combate =
    estadoAtualJogo.combateAtual;

    if (combate) {
  combate.participanteSelecionadoId =
    null;

  const tokensSelecionados =
    tabuleiroCombate.querySelectorAll(
      ".token-selecionado",
    );

  for (
    const token of tokensSelecionados
  ) {
    token.classList.remove(
      "token-selecionado",
    );
  }

  atualizarDestaquesMovimentoCombate(
    combate,
  );
}

  const alvo =
    combate?.participantes.find(
      (participante) =>
        participante.id ===
        combate.alvoSelecionadoId,
    );

    if (combate) {
  atualizarDestaquesAlvosCombate(
    combate,
  );
}

  if (alvo) {
    exibirAcaoAtualCombate(
      `Escolha um ataque contra ${alvo.nome}.`,
    );

    return;
  }

  exibirAcaoAtualCombate(
    "Selecione um inimigo no campo de batalha.",
  );

  
}

function reabrirPainelComandosCombate() {
  if (visualizacaoCombate.hidden) {
    return;
  }

  painelComandosCombate.hidden = false;

  painelComandosCombate.classList.remove("janela-minimizada");

  const botaoMinimizar = painelComandosCombate.querySelector("[data-minimizar-janela]");

  if (!botaoMinimizar) {
    return;
  }

  botaoMinimizar.setAttribute("aria-expanded", "true");

  botaoMinimizar.textContent = "−";
}

function verificarNovaSolicitacaoCombate() {
  const possuiSolicitacao =
    !solicitacaoCombate.hidden &&
    solicitacaoCombate
      .textContent
      .trim() !== "";

  if (!possuiSolicitacao) {
    return;
  }

  painelAcaoAtualCombate.hidden =
    false;
}
function fecharPainelAtaquesCombate() {
  painelAtaquesCombate.hidden = true;

  const combate =
    estadoAtualJogo.combateAtual;

  if (combate) {
    atualizarDestaquesAlvosCombate(
      combate,
    );
  }
}

function ativarEfeitoCombate(
  participante,
  operacao,
) {
  const combate =
    estadoAtualJogo
      .combateAtual;

  if (
    !combate ||
    !operacao
  ) {
    return;
  }

  let custoConsumido = true;

  if (
    operacao.custo ===
    "acao"
  ) {
    custoConsumido =
      SistemaCombate
        .consumirAcao(
          participante,
        );
  }

  if (
    operacao.custo ===
    "acaoBonus"
  ) {
    custoConsumido =
      SistemaCombate
        .consumirAcaoBonus(
          participante,
        );
  }

  if (
    operacao.custo ===
    "reacao"
  ) {
    custoConsumido =
      SistemaCombate
        .consumirReacao(
          participante,
        );
  }

  if (!custoConsumido) {
    console.warn(
      "Não foi possível consumir o custo da operação.",
    );

    return;
  }

  const resultadoRecurso =
    window.TradutorRegras
      .consumirRecurso(
        participante,
        operacao,
      );

  if (!resultadoRecurso.sucesso) {
    console.warn(
      "Não foi possível consumir o recurso:",
      resultadoRecurso.motivo,
    );

    return;
  }

  combate.efeitoPendente =
    structuredClone(
      operacao,
    );

  const rolagem =
    operacao.rolagem;

  if (!rolagem) {
    console.warn(
      "A operação não possui rolagem.",
    );

    combate.efeitoPendente =
      null;

    return;
  }

  solicitarRolagemNaCaixa(
    rolagem.gruposDeDados,
    rolagem.modificador,
    operacao.origem.nome,
  );

  solicitacaoCombate.textContent =
    `Role os dados para usar ` +
    `${operacao.origem.nome}.`;

  solicitacaoCombate.hidden =
    false;

  atualizarInterfaceTurno(
    combate,
  );
}

function renderizarEfeitosAtivaveisCombate(
  participante
) {
  const efeitos =
  window.TradutorRegras
    .prepararOperacoes({
      gatilho: "aoAtivar",
      participante: participante,
    });

  let quantidadeAcoesBonus =
    0;

  for (const efeito of efeitos) {
    const botao =
      document.createElement(
        "button"
      );

    botao.type =
      "button";

    botao.textContent =
      efeito.origem.nome;

    botao.dataset.efeitoId =
      efeito.origem.id;

      botao.addEventListener(
  "click",
  function ativarEfeito() {
    ativarEfeitoCombate(
      participante,
      efeito,
    );
  }
);

    if (
      efeito.custo ===
      "acao"
    ) {
      listaAcoesTurno.append(
        botao
      );

      continue;
    }

    if (
      efeito.custo ===
      "acaoBonus"
    ) {
      listaAcoesBonusTurno.append(
        botao
      );

      quantidadeAcoesBonus++;
    }
  }

  return {
    quantidadeAcoesBonus:
      quantidadeAcoesBonus
  };
}

function ativarDesengajarCombate(
  participante,
) {
  const combate =
    estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const resultado =
    SistemaCombate.usarAcaoDesengajar(
      combate,
      participante.id,
    );

  if (!resultado.sucesso) {
    console.warn(
      "Não foi possível desengajar:",
      resultado.motivo,
    );

    return;
  }

  fecharPainelAtaquesCombate();

  adicionarEventoHistoricoCombate(
    `${participante.nome} desengajou.`,
    "Você se preparou para deixar o alcance dos inimigos.",
  );

  exibirAcaoAtualCombate(
    "Você pode se mover sem provocar ataques de oportunidade até o final deste turno.",
  );

  atualizarInterfaceTurno(combate);
}

function renderizarAcoesCombate(participante) {
  listaAcoesTurno.innerHTML = "";

  listaAcoesBonusTurno.innerHTML = "";

  acoesCombate.innerHTML = "";

  if (!participante || participante.tipo !== "jogador") {
    fecharPainelAtaquesCombate();

    return;
  }

  const botaoAtacar = document.createElement("button");

  botaoAtacar.type = "button";

  botaoAtacar.textContent = "Atacar";

  botaoAtacar.disabled = !participante.acaoDisponivel;

  botaoAtacar.addEventListener("click", abrirPainelAtaquesCombate);

  listaAcoesTurno.append(botaoAtacar);

  const botaoDesengajar =
  document.createElement("button");

botaoDesengajar.type = "button";

botaoDesengajar.textContent =
  participante.desengajando
    ? "Desengajando"
    : "Desengajar";

botaoDesengajar.title =
  "Gaste sua ação para se mover sem provocar ataques de oportunidade neste turno.";

botaoDesengajar.disabled =
  !participante.acaoDisponivel ||
  participante.desengajando;

botaoDesengajar.addEventListener(
  "click",
  function () {
    ativarDesengajarCombate(
      participante,
    );
  },
);

listaAcoesTurno.append(
  botaoDesengajar,
);

  const resultadoEfeitos =
  renderizarEfeitosAtivaveisCombate(
    participante
  );

if (
  resultadoEfeitos
    .quantidadeAcoesBonus ===
  0
) {
  const mensagemAcaoBonus =
    document.createElement(
      "p"
    );

  mensagemAcaoBonus.textContent =
    participante
      .acaoBonusDisponivel
      ? "Nenhuma opção disponível."
      : "Ação bônus utilizada.";

  listaAcoesBonusTurno.append(
    mensagemAcaoBonus
  );
}
}

function formatarResultadoEscolhaRolagem(
  rolagem,
) {
  const subtotal =
    Number(rolagem.subtotal) || 0;

  const modificador =
    Number(rolagem.modificador) || 0;

  const total =
    Number(rolagem.total) ||
    subtotal + modificador;

  if (modificador < 0) {
    return (
      `${subtotal} - ` +
      `${Math.abs(modificador)} = ` +
      `${total}`
    );
  }

  return (
    `${subtotal} + ` +
    `${modificador} = ` +
    `${total}`
  );
}

function exibirEscolhaEntreRolagens(
  rolagens,
  aoEscolher,
) {
  acoesCombate.innerHTML = "";

  solicitacaoCombate.textContent =
    "Escolha qual resultado de dano utilizar.";

  solicitacaoCombate.hidden = false;

  if (
    !Array.isArray(rolagens) ||
    rolagens.length === 0
  ) {
    console.warn(
      "Nenhuma rolagem disponível para escolha.",
      rolagens,
    );

    return;
  }

  rolagens.forEach(function criarBotaoRolagem(
    rolagem,
    indice,
  ) {
    const subtotal =
      Number(rolagem.subtotal) || 0;

    const modificador =
      Number(rolagem.modificador) || 0;

    const total =
      Number.isFinite(Number(rolagem.total))
        ? Number(rolagem.total)
        : subtotal + modificador;

    const combate =
  estadoAtualJogo.combateAtual;

const critico =
  Boolean(
    combate?.danoPendente?.critico,
  );

let conta;

if (critico) {
  const subtotalDobrado =
    subtotal * 2;

  const totalCritico =
    subtotalDobrado + modificador;

  if (modificador < 0) {
    conta =
      `${subtotal} × 2 = ` +
      `${subtotalDobrado} - ` +
      `${Math.abs(modificador)} = ` +
      `${totalCritico}`;
  } else if (modificador > 0) {
    conta =
      `${subtotal} × 2 = ` +
      `${subtotalDobrado} + ` +
      `${modificador} = ` +
      `${totalCritico}`;
  } else {
    conta =
      `${subtotal} × 2 = ` +
      `${subtotalDobrado}`;
  }
} else if (modificador < 0) {
  conta =
    `${subtotal} - ` +
    `${Math.abs(modificador)} = ` +
    `${total}`;
} else if (modificador > 0) {
  conta =
    `${subtotal} + ` +
    `${modificador} = ` +
    `${total}`;
} else {
  conta =
    String(subtotal);
}

    const botao = document.createElement(
      "button",
    );

    botao.type = "button";

botao.classList.add(
  "opcao-rolagem-combate",
);

const rotuloRolagem =
  document.createElement("span");

rotuloRolagem.className =
  "rotulo-opcao-rolagem";

rotuloRolagem.textContent =
  `Usar rolagem ${indice + 1}`;

const calculoRolagem =
  document.createElement("span");

calculoRolagem.className =
  "calculo-opcao-rolagem";

calculoRolagem.textContent =
  conta;

botao.append(
  rotuloRolagem,
  calculoRolagem,
);

    botao.addEventListener(
      "click",
      function escolherRolagem() {
        acoesCombate.innerHTML = "";

        aoEscolher(rolagem);
      },
    );

    acoesCombate.append(botao);
  });
}

function renderizarListaAtaquesCombate(combate, participante) {
  listaAtaquesCombate.innerHTML = "";

  if (!participante || participante.tipo !== "jogador") {
    mensagemAtaquesCombate.textContent = "";

    return;
  }

  const ataques = participante.ataques ?? [];

  if (ataques.length === 0) {
    mensagemAtaquesCombate.textContent = "Nenhum ataque disponível.";

    return;
  }

  const alvo = combate.participantes.find(
    (participante) =>
      participante.id === combate.alvoSelecionadoId && participante.estado !== "derrotado",
  );

  let quantidadeDisponivel = 0;

  for (const ataque of ataques) {
    const botao = document.createElement("button");

    botao.type = "button";

    botao.classList.add("botao-ataque-combate");

    botao.dataset.idAtaque = ataque.instanciaId ?? ataque.id;

    const nomeAtaque =
  document.createElement("span");

nomeAtaque.classList.add(
  "nome-ataque-combate",
);

nomeAtaque.textContent =
  ataque.nome;

  const detalhesAtaque =
  document.createElement(
    "span",
  );

detalhesAtaque.classList.add(
  "detalhes-ataque-combate",
);

const grupoDano =
  ataque
    ?.dano
    ?.gruposDeDados
    ?.[0];

const textoDano =
  grupoDano
    ? `${grupoDano.quantidade}d${grupoDano.numeroDeFaces}`
    : "";

const modificadorDano =
  ataque
    ?.dano
    ?.modificador ??
  0;

const textoModificadorDano =
  modificadorDano >= 0
    ? `+ ${modificadorDano}`
    : `- ${Math.abs(modificadorDano)}`;

const bonusAtaque =
  ataque.bonusAtaque >= 0
    ? `+${ataque.bonusAtaque}`
    : `${ataque.bonusAtaque}`;

detalhesAtaque.textContent =
  `${bonusAtaque} para acertar • ` +
  `${textoDano} ${textoModificadorDano} ` +
  `${ataque.dano.tipo}`;

botao.append(
  nomeAtaque,
  detalhesAtaque,
);

const dominaMaestria =
  window.TradutorRegras
    .participanteDominaArma(
      participante,
      ataque,
    );

if (
  dominaMaestria &&
  ataque.maestriaId
) {
  const maestria =
    window.bancoMaestrias
      ?.[ataque.maestriaId];

  if (maestria) {
    const textoMaestria =
      document.createElement(
        "span",
      );

    textoMaestria.classList.add(
      "maestria-ataque-combate",
    );

    textoMaestria.textContent =
      `Maestria: ${maestria.nome}`;

    botao.append(
      textoMaestria,
    );
  }
}

    let ataqueDisponivel = false;

    const custoAtaque =
      SistemaCombate.obterCustoAtaque(participante, ataque);

    const recursoDisponivel =
      custoAtaque === "nenhum" ||
      (custoAtaque === "acao" && participante.acaoDisponivel) ||
      (custoAtaque === "acaoBonus" && participante.acaoBonusDisponivel);

    if (alvo && recursoDisponivel) {
      const validacao = SistemaCombate.validarSelecaoAcao(participante, alvo, ataque, combate);

      ataqueDisponivel = validacao.sucesso;
    }

    botao.disabled = !ataqueDisponivel;

    if (ataqueDisponivel) {
      quantidadeDisponivel += 1;
    }

    listaAtaquesCombate.append(botao);
  }

  const possuiAlgumRecursoDeAtaque = ataques.some((ataque) => {
    const custo = SistemaCombate.obterCustoAtaque(participante, ataque);

    return (
      custo === "nenhum" ||
      (custo === "acao" && participante.acaoDisponivel) ||
      (custo === "acaoBonus" && participante.acaoBonusDisponivel)
    );
  });

  if (!possuiAlgumRecursoDeAtaque) {
    mensagemAtaquesCombate.textContent = "Seus ataques disponíveis já foram utilizados.";

    return;
  }

  if (!alvo) {
    mensagemAtaquesCombate.textContent = "Selecione um inimigo no tabuleiro.";

    return;
  }

  if (quantidadeDisponivel === 0) {
    mensagemAtaquesCombate.textContent =
      `Aproxime-se de ${alvo.nome} ` + "para entrar no alcance de um ataque.";

    return;
  }

  mensagemAtaquesCombate.textContent = `Escolha um ataque contra ` + `${alvo.nome}.`;
}
