"use strict";

function configurarConfirmacaoDeCombate() {
  if (typeof verificarCombateDaCena !== "function") {
    console.error("Não foi possível configurar a confirmação de combate.");
    return;
  }

  const verificarCombateDaCenaOriginal = verificarCombateDaCena;

  function exibirConfirmacaoDeCombate(cena) {
    if (!cena?.combate) {
      return;
    }

    solicitacaoTeste.textContent =
      "Os inimigos estão preparados para lutar. Quando estiver pronto, inicie a batalha.";
    solicitacaoTeste.hidden = false;

    areaEscolhas.hidden = false;
    tituloEscolhas.hidden = false;
    listaEscolhas.hidden = false;

    tituloEscolhas.textContent = "Confronto iminente";
    listaEscolhas.replaceChildren();

    const botaoIniciarBatalha = document.createElement("button");
    botaoIniciarBatalha.type = "button";
    botaoIniciarBatalha.classList.add("botao-escolha");
    botaoIniciarBatalha.textContent = "Iniciar batalha";

    botaoIniciarBatalha.addEventListener(
      "click",
      function iniciarBatalhaConfirmada() {
        botaoIniciarBatalha.disabled = true;

        solicitacaoTeste.textContent = "Preparando o campo de batalha...";

        ocultarEscolhas();
        verificarCombateDaCenaOriginal(cena);
      },
      { once: true },
    );

    listaEscolhas.append(botaoIniciarBatalha);
  }

  verificarCombateDaCena = function verificarCombateComConfirmacao(cena) {
    if (!cena?.combate) {
      return verificarCombateDaCenaOriginal(cena);
    }

    if (estadoAtualJogo.combateAtual?.status === "ativo") {
      return verificarCombateDaCenaOriginal(cena);
    }

    queueMicrotask(function prepararAvisoDeCombate() {
      exibirConfirmacaoDeCombate(cena);
    });
  };
}

document.addEventListener("DOMContentLoaded", configurarConfirmacaoDeCombate, {
  once: true,
});
