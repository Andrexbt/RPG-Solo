"use strict";

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