"use strict";

const estadoLinhaTempoCombate = {
  rodada: null,
  participanteAtivoId: null,
  blocoTurnoAtual: null,
};

function reiniciarLinhaTempoCombate() {
  estadoLinhaTempoCombate.rodada = null;
  estadoLinhaTempoCombate.participanteAtivoId = null;
  estadoLinhaTempoCombate.blocoTurnoAtual = null;

  listaHistoricoCombate.innerHTML = "";
  filaIniciativaCombate.innerHTML = "";
}

function exibirAcaoAtualCombate(mensagem) {
  mensagemAcaoAtualCombate.textContent = mensagem;

  painelAcaoAtualCombate.hidden = false;
}

function adicionarEventoHistoricoCombate(titulo, descricao) {
  const evento = document.createElement("div");

  evento.className = "evento-historico-combate";

  const resumo = document.createElement("strong");
  resumo.textContent = titulo;

  evento.append(resumo);

  if (descricao && descricao !== titulo) {
    const detalhes = document.createElement("p");
    detalhes.textContent = descricao;
    evento.append(detalhes);
  }

  const destino =
    estadoLinhaTempoCombate.blocoTurnoAtual?.querySelector(
      ".eventos-turno-linha-tempo",
    ) ?? listaHistoricoCombate;

  destino.append(evento);
  rolarLinhaTempoParaAtual();
}

function alternarHistoricoCombate() {
  rolarLinhaTempoParaAtual("smooth");
}

function rolarLinhaTempoParaAtual(comportamento = "auto") {
  window.requestAnimationFrame(function () {
    const alvo =
      estadoLinhaTempoCombate.blocoTurnoAtual ??
      listaHistoricoCombate.lastElementChild;

    if (!alvo) {
      return;
    }

    painelHistoricoCombate.scrollTo({
      top: Math.max(
        0,
        alvo.offsetTop -
          painelHistoricoCombate.clientHeight / 2 +
          alvo.offsetHeight / 2,
      ),
      behavior: comportamento,
    });
  });
}

function adicionarMarcadorLinhaTempo(texto, classe = "") {
  const marcador = document.createElement("div");
  marcador.className = `marcador-linha-tempo-combate ${classe}`.trim();
  marcador.textContent = texto;
  listaHistoricoCombate.append(marcador);
  return marcador;
}

function criarBlocoTurnoLinhaTempo(participante) {
  const bloco = document.createElement("article");
  bloco.className = "turno-linha-tempo-combate turno-atual-linha-tempo";
  bloco.dataset.participanteId = participante.id;

  const avatar = criarAvatarIniciativa(participante);
  const numeroParticipante = obterNumeroParticipante(participante);

  if (numeroParticipante) {
    const identificador = document.createElement("span");
    identificador.className = "identificador-participante";
    identificador.textContent = numeroParticipante;
    avatar.append(identificador);
  }

  const conteudo = document.createElement("div");
  const nome = document.createElement("strong");
  nome.className = "nome-participante-linha-tempo";
  nome.textContent = participante.nome;

  const eventos = document.createElement("div");
  eventos.className = "eventos-turno-linha-tempo";

  const estado = document.createElement("span");
  estado.className = "estado-turno-linha-tempo";
  estado.textContent = "Turno atual";

  conteudo.append(nome, estado, eventos);
  bloco.append(avatar, conteudo);
  listaHistoricoCombate.append(bloco);
  return bloco;
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
  if (
    estadoLinhaTempoCombate.rodada === null &&
    listaHistoricoCombate.childElementCount === 0
  ) {
    adicionarMarcadorLinhaTempo("Início da batalha", "inicio-batalha");
  }

  if (estadoLinhaTempoCombate.rodada !== combate.rodada) {
    adicionarMarcadorLinhaTempo(`Rodada ${combate.rodada}`);
    estadoLinhaTempoCombate.rodada = combate.rodada;
  }

  if (estadoLinhaTempoCombate.participanteAtivoId !== combate.participanteAtivoId) {
    estadoLinhaTempoCombate.blocoTurnoAtual?.classList.remove(
      "turno-atual-linha-tempo",
    );

    const estadoAnterior =
      estadoLinhaTempoCombate.blocoTurnoAtual?.querySelector(
        ".estado-turno-linha-tempo",
      );

    if (estadoAnterior) {
      estadoAnterior.textContent = "Turno encerrado";
    }

    const participanteAtivo = combate.participantes.find(
      (participante) => participante.id === combate.participanteAtivoId,
    );

    if (participanteAtivo) {
      estadoLinhaTempoCombate.blocoTurnoAtual =
        criarBlocoTurnoLinhaTempo(participanteAtivo);
    }

    estadoLinhaTempoCombate.participanteAtivoId =
      combate.participanteAtivoId;

    rolarLinhaTempoParaAtual("smooth");
  }

  filaIniciativaCombate.innerHTML = "";

  const ordemVisivel =
  combate.ordemTurnos.filter(
    function participanteContinuaNaFila(
      participanteId,
    ) {
      const participante =
        combate.participantes.find(
          (item) =>
            item.id === participanteId,
        );

      return (
        participante &&
        participante.estado !== "derrotado"
      );
    },
  );

const indiceAtivo =
  ordemVisivel.indexOf(
    combate.participanteAtivoId,
  );

for (
  let deslocamento = 1;
  deslocamento <= ordemVisivel.length;
  deslocamento += 1
) {
  const indiceAbsoluto =
    indiceAtivo + deslocamento;

  const indiceParticipante =
    indiceAbsoluto %
    ordemVisivel.length;

  const rodadaDoParticipante =
    combate.rodada +
    Math.floor(
      indiceAbsoluto /
      ordemVisivel.length,
    );

  if (
    indiceParticipante === 0
  ) {
    const marcadorRodada =
      document.createElement("li");

    marcadorRodada.className =
      "marcador-proxima-rodada";

    marcadorRodada.textContent =
      `Rodada ${rodadaDoParticipante}`;

    filaIniciativaCombate.append(
      marcadorRodada,
    );
  }

  const participanteId =
    ordemVisivel[indiceParticipante];
    const participante = combate.participantes.find(
      (participante) => participante.id === participanteId,
    );

    if (!participante) {
      continue;
    }

    const item = document.createElement("li");

    item.classList.add("item-iniciativa");

    item.title = participante.nome;

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
