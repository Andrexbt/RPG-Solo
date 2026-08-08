"use strict";

let janelaArrastada = null;
let dadosInicioArraste = null;

function alternarMinimizacaoJanela(evento) {
  const botao = evento.currentTarget;

  const janela = botao.closest(".janela-flutuante");

  if (!janela) {
    return;
  }

  const estaMinimizada = janela.classList.toggle("janela-minimizada");

  botao.setAttribute("aria-expanded", String(!estaMinimizada));

  botao.textContent = estaMinimizada ? "+" : "−";
}

const botoesMinimizarJanela = document.querySelectorAll("[data-minimizar-janela]");

for (const botao of botoesMinimizarJanela) {
  botao.addEventListener("click", alternarMinimizacaoJanela);
}

function iniciarArrasteJanela(evento) {
  if (evento.target.closest("[data-minimizar-janela]")) {
    return;
  }

  const alca = evento.currentTarget;

  const janela = alca.closest(".janela-flutuante");


  if (!janela) {
    return;
  }

  janela.classList.remove(
  "janela-encaixada"
);

  const posicaoAtual = janela.getBoundingClientRect();

  janela.style.left = `${posicaoAtual.left}px`;

  janela.style.top = `${posicaoAtual.top}px`;

  janela.style.right = "auto";

  janela.style.bottom = "auto";

  janelaArrastada = janela;

  dadosInicioArraste = {
    x: evento.clientX,
    y: evento.clientY,
    esquerda: posicaoAtual.left,
    topo: posicaoAtual.top,
    ponteiroId: evento.pointerId,
    alca,
  };

  janela.classList.add("janela-arrastando");

  alca.setPointerCapture(evento.pointerId);

  evento.preventDefault();
}

function continuarArrasteJanela(evento) {
  if (!janelaArrastada || evento.pointerId !== dadosInicioArraste.ponteiroId) {
    return;
  }

  const deslocamentoX = evento.clientX - dadosInicioArraste.x;

  const deslocamentoY = evento.clientY - dadosInicioArraste.y;

  const limiteEsquerda = window.innerWidth - janelaArrastada.offsetWidth;

  const limiteTopo = window.innerHeight - janelaArrastada.offsetHeight;

  const novaEsquerda = Math.min(
    Math.max(0, dadosInicioArraste.esquerda + deslocamentoX),
    Math.max(0, limiteEsquerda),
  );

  const novoTopo = Math.min(
    Math.max(0, dadosInicioArraste.topo + deslocamentoY),
    Math.max(0, limiteTopo),
  );

  janelaArrastada.style.left = `${novaEsquerda}px`;

  janelaArrastada.style.top = `${novoTopo}px`;
}

function finalizarArrasteJanela(evento) {
  if (!janelaArrastada || evento.pointerId !== dadosInicioArraste.ponteiroId) {
    return;
  }

  janelaArrastada.classList.remove("janela-arrastando");

  dadosInicioArraste.alca.releasePointerCapture(evento.pointerId);

  janelaArrastada = null;

  dadosInicioArraste = null;
}

const alcasArraste = document.querySelectorAll("[data-alca-arraste]");

for (const alca of alcasArraste) {
  alca.addEventListener("pointerdown", iniciarArrasteJanela);

  alca.addEventListener("pointermove", continuarArrasteJanela);

  alca.addEventListener("pointerup", finalizarArrasteJanela);

  alca.addEventListener("pointercancel", finalizarArrasteJanela);
}

const scriptIntegracaoRolagens = document.createElement("script");

scriptIntegracaoRolagens.src = "integracao-rolagens.js";
scriptIntegracaoRolagens.defer = true;

document.head.append(scriptIntegracaoRolagens);
