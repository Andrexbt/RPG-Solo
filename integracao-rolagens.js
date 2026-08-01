"use strict";

/*
 * Algumas rotinas de aventuras.js ainda usam somarResultados como
 * utilitário global ao separar as duas rolagens do Atacante Selvagem.
 * O sistema de dados passou a ficar isolado em uma IIFE, então esse
 * utilitário deixou de existir no escopo global. Mantemos aqui uma
 * versão compartilhada para preservar a integração sem reabrir todo o
 * escopo interno de dados.js.
 */
if (typeof window.somarResultados !== "function") {
  window.somarResultados = function somarResultados(resultados) {
    if (!Array.isArray(resultados)) {
      return 0;
    }

    return resultados.reduce(function somar(total, resultado) {
      return total + Number(resultado || 0);
    }, 0);
  };
}

(function iniciarIntegracaoRolagens() {
  const solicitacaoCombate = document.querySelector("#solicitacaoCombate");

  let assinaturaConfiguracaoAtual = null;

  function obterCombateAtual() {
    return window.estadoJogo?.combateAtual ?? null;
  }

  function criarAssinatura(
  gruposDeDados,
  modificador,
  descricao,
  quantidadeDeRolagens = 1,
) {
  return JSON.stringify({
    gruposDeDados: gruposDeDados,
    modificador: modificador,
    descricao: descricao,
    quantidadeDeRolagens: quantidadeDeRolagens,
  });
}

  function configurarSeNecessario(gruposDeDados, modificador, descricao, quantidadeDeRolagens = 1,) {
    if (typeof window.configurarRolagemSolicitada !== "function") {
      return;
    }

    const assinatura = criarAssinatura(
      gruposDeDados,
      modificador,
      descricao,
      quantidadeDeRolagens,
    );

    if (assinatura === assinaturaConfiguracaoAtual) {
      return;
    }

    assinaturaConfiguracaoAtual = assinatura;

    window.configurarRolagemSolicitada({
      gruposDeDados: gruposDeDados,
      modificador: modificador,
      descricao: descricao,
      quantidadeDeRolagens: quantidadeDeRolagens,
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

 function configurarEfeitoDeNovaRolagem(combate) {
  const danoPendente =
    combate?.danoPendente;

  const efeitoAtivo =
    danoPendente?.efeitoAtivo;

  if (
    !efeitoAtivo ||
    efeitoAtivo.tipo !== "rolarNovamente"
  ) {
    return false;
  }

  const ataque =
    obterAtaqueDoDanoPendente(combate);

  if (!ataque?.dano?.gruposDeDados) {
    return false;
  }

  const quantidadeDeRolagens =
    Number(
      efeitoAtivo.quantidadeDeRolagens,
    ) || 1;

  const multiplicadorCritico =
    danoPendente.critico ? 2 : 1;

  const gruposDeDados =
    ataque.dano.gruposDeDados.map(
      function prepararGrupo(grupo) {
        return {
          quantidade:
            grupo.quantidade *
            multiplicadorCritico *
            quantidadeDeRolagens,

          numeroDeFaces:
            grupo.numeroDeFaces,
        };
      },
    );

  configurarSeNecessario(
    gruposDeDados,
    Number(
      ataque.dano.modificador,
    ) || 0,
    "Rolagens adicionais de dano",
    quantidadeDeRolagens,
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

    if (configurarEfeitoDeNovaRolagem(combate)) {
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
    window.setTimeout(sincronizarSolicitacao, 0);
  });

  window.setTimeout(sincronizarSolicitacao, 0);
})();
