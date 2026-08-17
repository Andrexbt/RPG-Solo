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

  const zoomHorizontal =
    visualizacaoCombate.clientWidth /
    tabuleiroCombate.offsetWidth;

  const zoomVertical =
    visualizacaoCombate.clientHeight /
    tabuleiroCombate.offsetHeight;

  return Math.min(
  Math.max(
    zoomHorizontal,
    zoomVertical,
  ),
  cameraCombate.zoomMaximo,
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
  cameraCombateElemento.style.setProperty(
    "--camera-x",
    `${cameraCombate.deslocamentoX}px`,
  );

  cameraCombateElemento.style.setProperty(
    "--camera-y",
    `${cameraCombate.deslocamentoY}px`,
  );

  cameraCombateElemento.style.setProperty(
    "--camera-zoom",
    cameraCombate.zoom,
  );

  const espessuraLinhaGrid =
  1.25 / cameraCombate.zoom;

cameraCombateElemento.style.setProperty(
  "--espessura-linha-grid",
  `${espessuraLinhaGrid}px`,
);
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

function impedirMenuContextoCombate(evento) {
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

  if (
  participante.tipo === "jogador"
) {

  const barraPontosDeVida =
  document.createElement("span");

barraPontosDeVida.classList.add(
  "barra-pontos-vida-token",
);

const preenchimentoPontosDeVida =
  document.createElement("span");

preenchimentoPontosDeVida.classList.add(
  "preenchimento-pontos-vida-token",
);

const textoPontosDeVida =
  document.createElement("span");

textoPontosDeVida.classList.add(
  "texto-pontos-vida-token",
);

barraPontosDeVida.append(
  preenchimentoPontosDeVida,textoPontosDeVida,
);

token.append(
  barraPontosDeVida,
);
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
  detalhesAtaque,
);

botao.append(nomeAtaque);

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

  const quantidadeParticipantes = Math.max(1, combate.ordemTurnos.length);

  const larguraPainelTurno = Math.max(
    260,
    Math.min(692, 116 + quantidadeParticipantes * 76),
  );

  painelTurnoCombate.style.setProperty(
    "--largura-painel-turno",
    `${larguraPainelTurno}px`,
  );

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

  atualizarPontosDeVidaFichaCombate(
  combate,
);

  painelTurnoCombate.hidden = false;
}
