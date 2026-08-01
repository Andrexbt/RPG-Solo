"use strict";

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
  const acoesCombate = document.querySelector("#acoesCombate");
  const resultadoDado = document.querySelector("#resultadoDado");

  let assinaturaConfiguracaoAtual = null;
  let formulaEscolhidaCritico = null;

  function obterCombateAtual() {
    return window.estadoJogo?.combateAtual ?? null;
  }

  function obterParticipante(combate, participanteId) {
    return combate?.participantes?.find(
      (participante) => participante.id === participanteId,
    ) ?? null;
  }

  function obterAtaqueDoDanoPendente(combate) {
    const danoPendente = combate?.danoPendente;

    if (!danoPendente) {
      return null;
    }

    const atacante = obterParticipante(
      combate,
      danoPendente.atacanteId,
    );

    return atacante?.ataques?.find(
      (ataque) => ataque.id === danoPendente.ataqueId,
    ) ?? null;
  }

  function criarAssinatura(
    gruposDeDados,
    modificador,
    descricao,
    quantidadeDeRolagens = 1,
  ) {
    return JSON.stringify({
      gruposDeDados,
      modificador,
      descricao,
      quantidadeDeRolagens,
    });
  }

  function configurarSeNecessario(
    gruposDeDados,
    modificador,
    descricao,
    quantidadeDeRolagens = 1,
  ) {
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
      gruposDeDados,
      modificador,
      descricao,
      quantidadeDeRolagens,
    });
  }

  function formatarDadosDaArma(ataque) {
    if (!Array.isArray(ataque?.dano?.gruposDeDados)) {
      return "dados de dano da arma";
    }

    return ataque.dano.gruposDeDados
      .map((grupo) => `${grupo.quantidade}d${grupo.numeroDeFaces}`)
      .join(" + ");
  }

  function configurarIniciativa(combate) {
    if (!combate?.iniciativaPendenteId) {
      return false;
    }

    const participante = obterParticipante(
      combate,
      combate.iniciativaPendenteId,
    );

    configurarSeNecessario(
      [{ quantidade: 1, numeroDeFaces: 20 }],
      Number(participante?.bonusIniciativa) || 0,
      "Rolagem de iniciativa",
    );

    return true;
  }

  function configurarEfeitoDeNovaRolagem(combate) {
    const danoPendente = combate?.danoPendente;
    const efeitoAtivo = danoPendente?.efeitoAtivo;

    if (!efeitoAtivo || efeitoAtivo.tipo !== "rolarNovamente") {
      return false;
    }

    const ataque = obterAtaqueDoDanoPendente(combate);

    if (!ataque?.dano?.gruposDeDados) {
      return false;
    }

    const quantidadeDeRolagens =
      Number(efeitoAtivo.quantidadeDeRolagens) || 1;

    const gruposDeDados = ataque.dano.gruposDeDados.map(
      function prepararGrupo(grupo) {
        return {
          quantidade:
            grupo.quantidade * quantidadeDeRolagens,
          numeroDeFaces: grupo.numeroDeFaces,
        };
      },
    );

    configurarSeNecessario(
      gruposDeDados,
      Number(ataque.dano.modificador) || 0,
      "Rolagens adicionais de dano",
      quantidadeDeRolagens,
    );

    const mensagens = window.mensagensNarrativas;

    if (solicitacaoCombate && mensagens?.efeitos) {
      const dadosDaArma = formatarDadosDaArma(ataque);
      const bonusDano = Number(ataque.dano.modificador) || 0;

      const mensagem = danoPendente.critico
        ? mensagens.efeitos.atacanteSelvagemCritico(
            dadosDaArma,
            bonusDano,
          )
        : mensagens.efeitos.atacanteSelvagemNormal(
            dadosDaArma,
            bonusDano,
          );

      if (solicitacaoCombate.innerHTML !== mensagem) {
        solicitacaoCombate.innerHTML = mensagem;
        solicitacaoCombate.hidden = false;
      }
    }

    return true;
  }

  function configurarDanoPendente(combate) {
    const danoPendente = combate?.danoPendente;

    if (!danoPendente || danoPendente.efeitoAtivo) {
      return false;
    }

    const ataque = obterAtaqueDoDanoPendente(combate);

    if (!ataque?.dano?.gruposDeDados) {
      return false;
    }

    configurarSeNecessario(
      structuredClone(ataque.dano.gruposDeDados),
      Number(ataque.dano.modificador) || 0,
      "Rolagem de dano",
      1,
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

    if (configurarDanoPendente(combate)) {
      return;
    }

    assinaturaConfiguracaoAtual = null;
  }

  function calcularFormulaCritica(subtotal, modificador) {
    const subtotalSeguro = Number(subtotal) || 0;
    const modificadorSeguro = Number(modificador) || 0;
    const dobrado = subtotalSeguro * 2;
    const total = dobrado + modificadorSeguro;
    const sinal = modificadorSeguro < 0
      ? `- ${Math.abs(modificadorSeguro)}`
      : `+ ${modificadorSeguro}`;

    return {
      total,
      texto: `${subtotalSeguro} × 2 = ${dobrado} ${sinal} = ${total}`,
    };
  }

  function obterResultadosCriticosSeparados(
    resultadoRolagem,
    quantidadeDeRolagens,
  ) {
    const grupos = resultadoRolagem?.gruposRolados ?? [];

    if (!Array.isArray(grupos) || grupos.length === 0) {
      return [];
    }

    const resultados = [];

    for (
      let indice = 0;
      indice < quantidadeDeRolagens;
      indice += 1
    ) {
      let subtotal = 0;

      for (const grupo of grupos) {
        const lista = Array.isArray(grupo.resultados)
          ? grupo.resultados
          : [];

        const quantidadePorRolagem =
          lista.length / quantidadeDeRolagens;

        if (!Number.isInteger(quantidadePorRolagem)) {
          return [];
        }

        const inicio = indice * quantidadePorRolagem;
        const fim = inicio + quantidadePorRolagem;

        subtotal += window.somarResultados(
          lista.slice(inicio, fim),
        );
      }

      resultados.push(
        calcularFormulaCritica(
          subtotal,
          resultadoRolagem.modificador,
        ),
      );
    }

    return resultados;
  }

  function atualizarResultadoVisualCritico(evento) {
    const combate = obterCombateAtual();
    const danoPendente = combate?.danoPendente;

    if (!danoPendente?.critico || !resultadoDado) {
      return;
    }

    const atacante = obterParticipante(
      combate,
      danoPendente.atacanteId,
    );

    if (atacante?.tipo !== "jogador") {
      return;
    }

    const quantidadeDeRolagens =
      Number(
        danoPendente.efeitoAtivo?.quantidadeDeRolagens,
      ) || 1;

    const resultados = obterResultadosCriticosSeparados(
      evento.detail,
      quantidadeDeRolagens,
    );

    if (resultados.length === 0) {
      return;
    }

    resultadoDado.textContent = resultados
      .map((resultado, indice) =>
        quantidadeDeRolagens > 1
          ? `Rolagem ${indice + 1}: ${resultado.texto}`
          : resultado.texto,
      )
      .join("\n");
  }

  function corrigirBotoesEscolhaCritica() {
    const combate = obterCombateAtual();
    const danoPendente = combate?.danoPendente;

    if (
      !danoPendente?.critico ||
      !danoPendente.efeitoAtivo ||
      !acoesCombate
    ) {
      return;
    }

    const rolagens = danoPendente.rolagensEfeito ?? [];
    const botoes = Array.from(
      acoesCombate.querySelectorAll("button"),
    ).filter((botao) =>
      botao.textContent.startsWith("Usar rolagem"),
    );

    botoes.forEach(function ajustarBotao(botao, indice) {
      const rolagem = rolagens[indice];

      if (!rolagem) {
        return;
      }

      const formula = calcularFormulaCritica(
        rolagem.subtotal,
        rolagem.modificador,
      );

      botao.textContent =
        `Usar rolagem ${indice + 1}: ${formula.texto}`;

      if (!botao.dataset.formulaCriticaRegistrada) {
        botao.dataset.formulaCriticaRegistrada = "true";
        botao.addEventListener("click", function () {
          formulaEscolhidaCritico = formula.texto;
        });
      }
    });
  }

  function corrigirMensagemResultadoEscolhido() {
    if (
      !formulaEscolhidaCritico ||
      !solicitacaoCombate
    ) {
      return;
    }

    if (
      solicitacaoCombate.textContent.startsWith(
        "Resultado escolhido:",
      )
    ) {
      solicitacaoCombate.textContent =
        `Resultado escolhido: ${formulaEscolhidaCritico}.`;
      formulaEscolhidaCritico = null;
    }
  }

  function instalarCorrecaoDanoCritico() {
    if (
      !window.SistemaCombate ||
      typeof window.SistemaCombate.resolverDano !== "function"
    ) {
      window.setTimeout(instalarCorrecaoDanoCritico, 0);
      return;
    }

    if (window.SistemaCombate.resolverDano.__criticoSimplificado) {
      return;
    }

    const resolverDanoOriginal =
      window.SistemaCombate.resolverDano;

    function resolverDanoComCriticoSimplificado(
      combate,
      resultadoRolagem,
    ) {
      const danoPendente = combate?.danoPendente;
      const atacante = danoPendente
        ? obterParticipante(combate, danoPendente.atacanteId)
        : null;

      if (
        danoPendente?.critico &&
        atacante?.tipo === "jogador" &&
        Number.isFinite(Number(resultadoRolagem?.subtotal))
      ) {
        const resultadoAjustado = structuredClone(
          resultadoRolagem,
        );

        const formula = calcularFormulaCritica(
          resultadoAjustado.subtotal,
          resultadoAjustado.modificador,
        );

        resultadoAjustado.total = formula.total;

        return resolverDanoOriginal(
          combate,
          resultadoAjustado,
        );
      }

      return resolverDanoOriginal(combate, resultadoRolagem);
    }

    resolverDanoComCriticoSimplificado.__criticoSimplificado = true;

    window.SistemaCombate.resolverDano =
      resolverDanoComCriticoSimplificado;
  }

  if (solicitacaoCombate) {
    const observador = new MutationObserver(function () {
      queueMicrotask(function () {
        sincronizarSolicitacao();
        corrigirMensagemResultadoEscolhido();
      });
    });

    observador.observe(solicitacaoCombate, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  if (acoesCombate) {
    const observadorAcoes = new MutationObserver(function () {
      queueMicrotask(corrigirBotoesEscolhaCritica);
    });

    observadorAcoes.observe(acoesCombate, {
      childList: true,
      subtree: true,
    });
  }

  document.addEventListener("rolagemConcluida", function (evento) {
    atualizarResultadoVisualCritico(evento);
    window.setTimeout(sincronizarSolicitacao, 0);
  });

  instalarCorrecaoDanoCritico();
  window.setTimeout(sincronizarSolicitacao, 0);
})();
