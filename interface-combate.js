"use strict";

function obterZoomMinimoVisivel() {
  if (
    visualizacaoCombate.clientWidth === 0 ||
    visualizacaoCombate.clientHeight === 0 ||
    tabuleiroCombate.offsetWidth === 0 ||
    tabuleiroCombate.offsetHeight === 0
  ) {
    return cameraCombate.zoomMinimo;
  }

  const zoomMinimoHorizontal = visualizacaoCombate.clientWidth / tabuleiroCombate.offsetWidth;

  const zoomMinimoVertical = visualizacaoCombate.clientHeight / tabuleiroCombate.offsetHeight;

  return Math.min(
    cameraCombate.zoomMaximo,
    Math.max(cameraCombate.zoomMinimo, zoomMinimoHorizontal, zoomMinimoVertical),
  );
}

function limitarCameraCombate() {
  const larguraTabuleiro = tabuleiroCombate.offsetWidth * cameraCombate.zoom;

  const alturaTabuleiro = tabuleiroCombate.offsetHeight * cameraCombate.zoom;

  const limiteHorizontal = Math.max(0, (larguraTabuleiro - visualizacaoCombate.clientWidth) / 2);

  const limiteVertical = Math.max(0, (alturaTabuleiro - visualizacaoCombate.clientHeight) / 2);

  cameraCombate.deslocamentoX = Math.min(
    limiteHorizontal,
    Math.max(-limiteHorizontal, cameraCombate.deslocamentoX),
  );

  cameraCombate.deslocamentoY = Math.min(
    limiteVertical,
    Math.max(-limiteVertical, cameraCombate.deslocamentoY),
  );
}

function atualizarCameraCombate() {
  tabuleiroCombate.style.setProperty("--camera-x", `${cameraCombate.deslocamentoX}px`);

  tabuleiroCombate.style.setProperty("--camera-y", `${cameraCombate.deslocamentoY}px`);

  tabuleiroCombate.style.setProperty("--camera-zoom", cameraCombate.zoom);
}

function controlarZoomCombate(evento) {
  evento.preventDefault();

  const variacaoZoom = evento.deltaY < 0 ? 0.1 : -0.1;

  const novoZoom = cameraCombate.zoom + variacaoZoom;

  cameraCombate.zoom = Math.min(
    cameraCombate.zoomMaximo,
    Math.max(obterZoomMinimoVisivel(), Number(novoZoom.toFixed(2))),
  );

  limitarCameraCombate();
  atualizarCameraCombate();
}

function iniciarArrasteCamera(evento) {
  const iniciouEmToken = evento.target.closest(".token-combate");

  if (iniciouEmToken || evento.button !== 2) {
    return;
  }

  arrasteCamera = {
    ponteiroId: evento.pointerId,

    inicioX: evento.clientX,

    inicioY: evento.clientY,

    deslocamentoInicialX: cameraCombate.deslocamentoX,

    deslocamentoInicialY: cameraCombate.deslocamentoY,
  };

  visualizacaoCombate.setPointerCapture(evento.pointerId);

  visualizacaoCombate.classList.add("camera-arrastando");

  evento.preventDefault();
}

function continuarArrasteCamera(evento) {
  if (!arrasteCamera || evento.pointerId !== arrasteCamera.ponteiroId) {
    return;
  }

  cameraCombate.deslocamentoX =
    arrasteCamera.deslocamentoInicialX + evento.clientX - arrasteCamera.inicioX;

  cameraCombate.deslocamentoY =
    arrasteCamera.deslocamentoInicialY + evento.clientY - arrasteCamera.inicioY;

  limitarCameraCombate();
  atualizarCameraCombate();
}

function finalizarArrasteCamera(evento) {
  if (!arrasteCamera || evento.pointerId !== arrasteCamera.ponteiroId) {
    return;
  }

  if (visualizacaoCombate.hasPointerCapture(evento.pointerId)) {
    visualizacaoCombate.releasePointerCapture(evento.pointerId);
  }

  visualizacaoCombate.classList.remove("camera-arrastando");

  arrasteCamera = null;
}

function exibirTelaCombate() {
  visualizacaoAventura.hidden = true;

  painelComandosCombate.hidden = false;

  visualizacaoCombate.hidden = false;

  layoutAventura.classList.add("modo-combate");
}

function exibirTelaAventura() {
  visualizacaoCombate.hidden = true;

  visualizacaoAventura.hidden = false;

  painelComandosCombate.hidden = true;

  layoutAventura.classList.remove("modo-combate");
}

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

  token.setAttribute("aria-label", participante.id);

  return token;
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

function renderizarTabuleiroCombate(combate) {
  tabuleiroCombate.innerHTML = "";

  criarCelulasTabuleiro(combate);

  renderizarParticipantesCombate(combate.participantes);
}

function abrirPainelAtaquesCombate() {
  painelAtaquesCombate.hidden = false;
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
    !solicitacaoCombate.hidden && solicitacaoCombate.textContent.trim() !== "";

  if (!possuiSolicitacao) {
    return;
  }

  reabrirPainelComandosCombate();
}

function exibirAcaoAtualCombate(mensagem) {
  mensagemAcaoAtualCombate.textContent = mensagem;

  painelAcaoAtualCombate.hidden = false;
}

function adicionarEventoHistoricoCombate(titulo, descricao) {
  const evento = document.createElement("details");

  evento.className = "evento-historico-combate";

  const resumo = document.createElement("summary");

  resumo.textContent = titulo;

  const detalhes = document.createElement("p");

  detalhes.textContent = descricao;

  evento.append(resumo, detalhes);

  listaHistoricoCombate.append(evento);

  painelHistoricoCombate.hidden = false;

  if (painelHistoricoCombate.classList.contains("historico-expandido")) {
    painelHistoricoCombate.scrollTop = painelHistoricoCombate.scrollHeight;
  }
}

function alternarHistoricoCombate() {
  const estaExpandido = painelHistoricoCombate.classList.toggle("historico-expandido");

  botaoExpandirHistorico.setAttribute("aria-expanded", estaExpandido);

  botaoExpandirHistorico.setAttribute(
    "aria-label",
    estaExpandido ? "Recolher histórico" : "Expandir histórico",
  );

  botaoExpandirHistorico.title = estaExpandido ? "Recolher histórico" : "Expandir histórico";

  botaoExpandirHistorico.textContent = estaExpandido ? "−" : "+";

  if (estaExpandido) {
    painelHistoricoCombate.scrollTop = painelHistoricoCombate.scrollHeight;
  }
}

function fecharPainelAtaquesCombate() {
  painelAtaquesCombate.hidden = true;
}

function ativarEfeitoCombate(
  participante,
  efeitoId
) {
  const combate =
    estadoAtualJogo
      .combateAtual;

  if (!combate) {
    return;
  }

  const resultadoAtivacao =
    ativarEfeitoDoParticipante(
      participante,
      efeitoId
    );

  if (!resultadoAtivacao.sucesso) {
    console.warn(
      "Não foi possível ativar o efeito:",
      resultadoAtivacao.motivo
    );

    return;
  }

  combate.efeitoPendente =
    structuredClone(
      resultadoAtivacao
        .operacao
    );

  const rolagem =
    resultadoAtivacao
      .operacao
      .rolagem;

  solicitarRolagemNaCaixa(
    rolagem.gruposDeDados,
    rolagem.modificador,
    resultadoAtivacao
      .efeito
      .nome
  );

  solicitacaoCombate.textContent =
    `Role os dados para usar ` +
    `${resultadoAtivacao.efeito.nome}.`;

  solicitacaoCombate.hidden =
    false;

  atualizarInterfaceTurno(
    combate
  );
}

function renderizarEfeitosAtivaveisCombate(
  participante
) {
  const efeitos =
    buscarEfeitosDoParticipante(
      participante,
      "aoAtivar"
    );

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
      efeito.nome;

    botao.dataset.efeitoId =
      efeito.id;

      botao.addEventListener(
  "click",
  function ativarEfeito() {
    ativarEfeitoCombate(
      participante,
      efeito.id
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

    botao.textContent =
      `Usar rolagem ${indice + 1}: ` +
      conta;

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

    botao.dataset.idAtaque = ataque.id;

    botao.textContent = ataque.nome;

    let ataqueDisponivel = false;

    if (alvo && participante.acaoDisponivel) {
      const validacao = SistemaCombate.validarSelecaoAcao(participante, alvo, ataque);

      ataqueDisponivel = validacao.sucesso;
    }

    botao.disabled = !ataqueDisponivel;

    if (ataqueDisponivel) {
      quantidadeDisponivel += 1;
    }

    listaAtaquesCombate.append(botao);
  }

  if (!participante.acaoDisponivel) {
    mensagemAtaquesCombate.textContent = "Sua ação já foi utilizada.";

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

function atualizarIndicadorRecurso(elemento, disponivel) {
  if (typeof disponivel !== "boolean") {
    elemento.textContent = "—";

    elemento.removeAttribute("data-disponivel");

    return;
  }

  elemento.textContent = disponivel ? "Disponível" : "Utilizada";

  elemento.dataset.disponivel = String(disponivel);
}

function criarAvatarIniciativa(participante) {
  const avatar = document.createElement("div");

  avatar.classList.add("avatar-iniciativa");

  const representacao = participante.representacao;

  if (representacao?.imagem) {
    const imagem = document.createElement("img");

    imagem.classList.add("imagem-avatar-iniciativa");

    imagem.src = representacao.imagem;

    imagem.alt = "";

    avatar.append(imagem);

    if (representacao.frame) {
      const frame = document.createElement("img");

      frame.classList.add("frame-avatar-iniciativa");

      frame.src = representacao.frame;

      frame.alt = "";

      avatar.append(frame);
    }

    return avatar;
  }

  avatar.textContent = participante.nome?.charAt(0).toUpperCase() ?? "?";

  return avatar;
}

function renderizarFilaIniciativa(combate) {
  filaIniciativaCombate.innerHTML = "";

  for (const participanteId of combate.ordemTurnos) {
    const participante = combate.participantes.find(
      (participante) => participante.id === participanteId,
    );

    if (!participante) {
      continue;
    }

    const item = document.createElement("li");

    item.classList.add("item-iniciativa");

    item.title = participante.nome;

    if (participante.id === combate.participanteAtivoId) {
      item.classList.add("turno-ativo");
    }

    const avatar = criarAvatarIniciativa(participante);

    const numeroParticipante = obterNumeroParticipante(participante);

    if (numeroParticipante) {
      const identificador = document.createElement("span");

      identificador.className = "identificador-participante";

      identificador.textContent = numeroParticipante;

      avatar.append(identificador);
    }

    item.append(avatar);

    filaIniciativaCombate.append(item);
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

  painelTurnoCombate.hidden = false;
}
