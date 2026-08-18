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