"use strict";

(function criarAnimacoesCombate() {
  async function animarArremessoArma(atacanteId, alvoId, armaId, opcoes = {}) {
    const raiz = opcoes.raiz ?? document;
    const zoom = Number(opcoes.zoom) || 1;

    const configuracao = window.bancoEquipamentos?.armas?.[armaId]?.visual?.arremesso;

    if (!configuracao?.src) {
      return false;
    }

    const tokenAtacante = raiz.querySelector(`[data-id-participante="${atacanteId}"]`);

    const tokenAlvo = raiz.querySelector(`[data-id-participante="${alvoId}"]`);

    if (!tokenAtacante || !tokenAlvo) {
      return false;
    }

    const origem = tokenAtacante.getBoundingClientRect();

    const destino = tokenAlvo.getBoundingClientRect();

    const origemX = origem.left + origem.width / 2;

    const origemY = origem.top + origem.height / 2;

    const destinoX = destino.left + destino.width / 2;

    const destinoY = destino.top + destino.height / 2;

    const deslocamentoX = destinoX - origemX;

    const deslocamentoY = destinoY - origemY;

    const anguloTrajetoria = Math.atan2(deslocamentoY, deslocamentoX) * (180 / Math.PI);

    const anguloInicial = anguloTrajetoria + (Number(configuracao.anguloBase) || 0);

    const rotacoes = Number(configuracao.rotacoesDuranteVoo) || 0;

    const anguloFinal = anguloInicial + rotacoes * 360;

    const tamanhoCelulaPx = Number(opcoes.tamanhoCelulaPx) || 64;

    const tamanhoEmCelulas = Number(configuracao.tamanhoEmCelulas) || 1;

    const comprimentoProjetil = tamanhoCelulaPx * tamanhoEmCelulas * zoom;

    const projetil = document.createElement("img");

    projetil.className = "projetil-arma-arremessada-combate";

    projetil.src = configuracao.src;
    projetil.alt = "";
    projetil.draggable = false;
    projetil.style.left = `${origemX}px`;
    projetil.style.top = `${origemY}px`;
    projetil.style.width = "auto";
    projetil.style.height = `${comprimentoProjetil}px`;

    document.body.append(projetil);

    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animacao = projetil.animate(
      [
        {
          transform: `translate(-50%, -50%) ` + `rotate(${anguloInicial}deg)`,
        },
        {
          transform:
            `translate(` +
            `calc(-50% + ${deslocamentoX}px), ` +
            `calc(-50% + ${deslocamentoY}px)` +
            `) rotate(${anguloFinal}deg)`,
        },
      ],
      {
        duration: reduzirMovimento ? 1 : Number(configuracao.duracaoMs) || 700,
        easing: "cubic-bezier(0.3, 0.7, 0.25, 1)",
        fill: "forwards",
      },
    );

    await animacao.finished.catch(() => null);
    projetil.remove();

    return true;
  }

  window.AnimacoesCombate = {
    animarArremessoArma,
  };
})();
