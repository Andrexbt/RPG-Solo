"use strict";

(function iniciarIntegracaoRolagens() {
  const solicitacaoCombate = document.querySelector("#solicitacaoCombate");

  let assinaturaConfiguracaoAtual = null;

  function obterCombateAtual() {
    return window.estadoJogo?.combateAtual ?? null;
  }

  function criarAssinatura(gruposDeDados, modificador, descricao) {
    return JSON.stringify({
      gruposDeDados: gruposDeDados,
      modificador: modificador,
      descricao: descricao,
    });
  }

  function configurarSeNecessario(gruposDeDados, modificador, descricao) {
    if (typeof window.configurarRolagemSolicitada !== "function") {
      return;
    }

    const assinatura = criarAssinatura(
      gruposDeDados,
      modificador,
      descricao,
    );

    if (assinatura === assinaturaConfiguracaoAtual) {
      return;
    }

    assinaturaConfiguracaoAtual = assinatura;

    window.configurarRolagemSolicitada({
      gruposDeDados: gruposDeDados,
      modificador: modificador,
      descricao: descricao,
    });
  }

  function obterAtaqueDoDanoPendente(combate) {
    const danoPendente = combate?.danoPendente;

    if (!danoPendente) {
      return null;
    }

    const atacante = combate.participantes.find(
      (participante) => participante.id === danoPendente.atacanteId,
    );

    return atacante?.ataques?.find(
      (ataque) => ataque.id === danoPendente.ataqueId,
    ) ?? null;
  }

  function configurarIniciativa(combate) {
    if (!combate?.iniciativaPendenteId) {
      return false;
    }

    const participante = combate.participantes.find(
      (item) => item.id === combate.iniciativaPendenteId,
    );

    configurarSeNecessario(
      [
        {
          quantidade: 1,
          numeroDeFaces: 20,
        },
      ],
      Number(participante?.bonusIniciativa) || 0,
      "Rolagem de iniciativa",
    );

    return true;
  }

  function configurarAtacanteSelvagem(combate) {
    const danoPendente = combate?.danoPendente;
    const efeitoAtivo = danoPendente?.efeitoAtivo;

    if (!efeitoAtivo || efeitoAtivo.tipo !== "rolarNovamente") {
      return false;
    }

    const ataque = obterAtaqueDoDanoPendente(combate);

    if (!ataque?.dano?.gruposDeDados) {
      return false;
    }

    const multiplicadorCritico = danoPendente.critico ? 2 : 1;
    const quantidadeDeRolagens = Number(efeitoAtivo.quantidadeDeRolagens) || 2;

    const gruposDeDados = ataque.dano.gruposDeDados.map(
      function prepararGrupo(grupo) {
        return {
          quantidade:
            grupo.quantidade *
            multiplicadorCritico *
            quantidadeDeRolagens,
          numeroDeFaces: grupo.numeroDeFaces,
        };
      },
    );

    configurarSeNecessario(
      gruposDeDados,
      Number(ataque.dano.modificador) || 0,
      "Duas rolagens de dano do Atacante Selvagem",
    );

    return true;
  }

  function sincronizarSolicitacao() {
    const combate = obterCombateAtual();

    if (!combate) {
      assinaturaConfiguracaoAtual = null;
      return;
    }

    if (configurarIniciativa(combate)) {
      return;
    }

    if (configurarAtacanteSelvagem(combate)) {
      return;
    }

    assinaturaConfiguracaoAtual = null;
  }

  if (solicitacaoCombate) {
    const observador = new MutationObserver(function () {
      queueMicrotask(sincronizarSolicitacao);
    });

    observador.observe(solicitacaoCombate, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  document.addEventListener("rolagemConcluida", function () {
    queueMicrotask(sincronizarSolicitacao);
  });

  window.setTimeout(sincronizarSolicitacao, 0);
})();
