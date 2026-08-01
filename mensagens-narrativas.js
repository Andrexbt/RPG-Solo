"use strict";

function formatarSinalNarrativo(valor) {
  const numero = Number(valor) || 0;

  if (numero < 0) {
    return `- ${Math.abs(numero)}`;
  }

  return `+ ${numero}`;
}

function formatarDadosNarrativos(ataque) {
  if (!ataque?.dano?.gruposDeDados) {
    return "dados de dano";
  }

  return ataque.dano.gruposDeDados
    .map(function formatarGrupo(grupo) {
      return `${grupo.quantidade}d${grupo.numeroDeFaces}`;
    })
    .join(" + ");
}

function formatarExpressaoDanoNarrativa(ataque) {
  const dados = formatarDadosNarrativos(ataque);
  const modificador = Number(ataque?.dano?.modificador) || 0;

  if (modificador === 0) {
    return dados;
  }

  return `${dados} ${formatarSinalNarrativo(modificador)}`;
}

function exibirMensagemNarrativa(elemento, mensagem) {
  if (!elemento) {
    return;
  }

  elemento.innerHTML = mensagem ?? "";
}

window.exibirMensagemNarrativa = exibirMensagemNarrativa;

window.mensagensNarrativas = {
  iniciativa: {
    pedir: function (modificador) {
      return (
        "A batalha começou! Você vai rolar " +
        `<strong>1d20 ${formatarSinalNarrativo(modificador)}</strong>` +
        " para definir sua posição na fila de combate."
      );
    },
  },

  ataque: {
    selecionarAlvo: "Selecione um inimigo antes de atacar.",

    pedirNormal: function (modificador, alvoNome) {
      return (
        `Você vai rolar <strong>1d20 ${formatarSinalNarrativo(modificador)}</strong> ` +
        `para atacar ${alvoNome}.`
      );
    },

    pedirVantagem: function (modificador, alvoNome) {
      return (
        `Você vai rolar <strong>2d20 ${formatarSinalNarrativo(modificador)}</strong>, ` +
        `<strong>usar o maior resultado</strong> para atacar ${alvoNome}.`
      );
    },

    pedirDesvantagem: function (modificador, alvoNome) {
      return (
        `Você vai rolar <strong>2d20 ${formatarSinalNarrativo(modificador)}</strong>, ` +
        `<strong>usar o menor resultado</strong> para atacar ${alvoNome}.`
      );
    },
  },

  dano: {
    acertoNormal: function (expressaoCompleta) {
      return (
        "O ataque acertou. Você vai rolar " +
        `<strong>${expressaoCompleta}</strong> de dano.`
      );
    },

    acertoCritico: function () {
      return (
        "Acerto Crítico! Você vai rolar seu dano normalmente, " +
        "<strong>multiplicar por 2</strong>, e depois adicionar " +
        "o bônus de dano do ataque escolhido."
      );
    },
  },

  efeitos: {
    disponivel: function (nome) {
      return `${nome} está disponível. Deseja utilizá-lo?`;
    },

    atacanteSelvagemNormal: function (dadosDaArma, bonusDano) {
      return (
        "Você escolheu utilizar Atacante Selvagem. Role " +
        `<strong>${dadosDaArma}</strong> duas vezes, ` +
        "<strong>escolha o maior valor</strong> e adicione " +
        `<strong>${formatarSinalNarrativo(bonusDano)}</strong> ` +
        "de bônus de dano do ataque escolhido."
      );
    },

    atacanteSelvagemCritico: function (dadosDaArma, bonusDano) {
      return (
        "Você escolheu utilizar Atacante Selvagem em combinação com seu Acerto Crítico. Role " +
        `<strong>${dadosDaArma}</strong> duas vezes, ` +
        "<strong>escolha o maior valor, multiplique por dois</strong> e adicione " +
        `<strong>${formatarSinalNarrativo(bonusDano)}</strong> ` +
        "de bônus de dano do ataque escolhido."
      );
    },

    escolherResultado: "Escolha qual resultado de dano utilizar.",
  },

  dados: {
    erroRolagem: "Você não jogou a combinação certa de dados.",

    resultadoNormal: function (subtotal, modificador, total) {
      return `${subtotal} ${formatarSinalNarrativo(modificador)} = ${total}`;
    },

    resultadoCritico: function (subtotal, modificador) {
      const dobrado = subtotal * 2;
      const total = dobrado + (Number(modificador) || 0);

      return (
        `${subtotal} × 2 = ${dobrado} ` +
        `${formatarSinalNarrativo(modificador)} = ${total}`
      );
    },
  },

  turno: {
    jogador: "Seu turno começou. O que você irá fazer?",

    inimigo: function (nome) {
      return `${nome} está decidindo o que fazer.`;
    },

    erroInimigo: function (nome) {
      return `${nome} não conseguiu concluir o turno.`;
    },
  },
};

(function integrarMensagensNarrativasLegadas() {
  function injetarEstilosMensagensNarrativas() {
    if (document.querySelector("#estilosMensagensNarrativas")) {
      return;
    }

    const estilo = document.createElement("style");
    estilo.id = "estilosMensagensNarrativas";
    estilo.textContent = `
      #solicitacaoCombate strong {
        color: #8b2f25;
        font-weight: 900;
      }
    `;

    document.head.append(estilo);
  }

  function obterCombate() {
    return window.estadoJogo?.combateAtual ?? null;
  }

  function obterAtaquePendente(combate) {
    const pendencia = combate?.ataquePendente ?? combate?.danoPendente;

    if (!pendencia) {
      return null;
    }

    const atacante = combate.participantes?.find(
      (participante) => participante.id === pendencia.atacanteId,
    );

    const alvo = combate.participantes?.find(
      (participante) => participante.id === pendencia.alvoId,
    );

    const ataque = atacante?.ataques?.find(
      (item) => item.id === pendencia.ataqueId,
    );

    if (!atacante || !alvo || !ataque) {
      return null;
    }

    return { atacante, alvo, ataque, pendencia };
  }

  function corrigirSolicitacaoCombate() {
    const elemento = document.querySelector("#solicitacaoCombate");

    if (!elemento) {
      return;
    }

    const textoAtual = elemento.textContent?.trim() ?? "";

    if (!textoAtual) {
      return;
    }

    const combate = obterCombate();

    if (textoAtual === "Role 1d20 e adicione seu modificador de iniciativa.") {
      const jogador = combate?.participantes?.find(
        (participante) => participante.tipo === "jogador",
      );

      exibirMensagemNarrativa(
        elemento,
        window.mensagensNarrativas.iniciativa.pedir(
          Number(jogador?.bonusIniciativa) || 0,
        ),
      );
      return;
    }

    if (/^Role (1d20|2d20).*para atacar .+\.$/i.test(textoAtual)) {
      const contexto = obterAtaquePendente(combate);

      if (!contexto) {
        return;
      }

      const tipoRolagem = contexto.pendencia.tipoRolagem ?? "normal";
      const modificador = Number(contexto.ataque.bonusAtaque) || 0;
      const alvoNome = contexto.alvo.nome;

      const mensagem =
        tipoRolagem === "vantagem"
          ? window.mensagensNarrativas.ataque.pedirVantagem(modificador, alvoNome)
          : tipoRolagem === "desvantagem"
            ? window.mensagensNarrativas.ataque.pedirDesvantagem(modificador, alvoNome)
            : window.mensagensNarrativas.ataque.pedirNormal(modificador, alvoNome);

      exibirMensagemNarrativa(elemento, mensagem);
      return;
    }

    if (/Atacante Selvagem ativado\./i.test(textoAtual)) {
      const contexto = obterAtaquePendente(combate);

      if (!contexto) {
        return;
      }

      const dados = formatarDadosNarrativos(contexto.ataque);
      const bonus = Number(contexto.ataque.dano?.modificador) || 0;
      const critico = Boolean(combate?.danoPendente?.critico);

      exibirMensagemNarrativa(
        elemento,
        critico
          ? window.mensagensNarrativas.efeitos.atacanteSelvagemCritico(dados, bonus)
          : window.mensagensNarrativas.efeitos.atacanteSelvagemNormal(dados, bonus),
      );
      return;
    }

    if (/^Acerto crítico! Role /i.test(textoAtual)) {
      exibirMensagemNarrativa(
        elemento,
        window.mensagensNarrativas.dano.acertoCritico(),
      );
      return;
    }

    if (/^O ataque acertou! Role /i.test(textoAtual)) {
      const contexto = obterAtaquePendente(combate);

      if (!contexto) {
        return;
      }

      exibirMensagemNarrativa(
        elemento,
        window.mensagensNarrativas.dano.acertoNormal(
          formatarExpressaoDanoNarrativa(contexto.ataque),
        ),
      );
    }
  }

  function corrigirMensagemTurno() {
    const elemento = document.querySelector("#mensagemAcaoAtualCombate");

    if (!elemento) {
      return;
    }

    const textoAtual = elemento.textContent?.trim() ?? "";

    if (textoAtual === "É o seu turno.") {
      elemento.textContent = window.mensagensNarrativas.turno.jogador;
      return;
    }

    const combate = obterCombate();
    const participanteAtivo = combate?.participantes?.find(
      (participante) => participante.id === combate.participanteAtivoId,
    );

    if (
      participanteAtivo?.tipo !== "jogador" &&
      textoAtual === `${participanteAtivo?.nome} está decidindo o que fazer.`
    ) {
      elemento.textContent = window.mensagensNarrativas.turno.inimigo(
        participanteAtivo.nome,
      );
    }
  }

  function corrigirErroDados() {
    const elemento = document.querySelector("#resultadoDado");

    if (!elemento) {
      return;
    }

    const textoAtual = elemento.textContent?.trim() ?? "";

    if (/^Use\s+/i.test(textoAtual)) {
      elemento.textContent = window.mensagensNarrativas.dados.erroRolagem;
    }
  }

  function observarElemento(seletor, callback) {
    const elemento = document.querySelector(seletor);

    if (!elemento) {
      return;
    }

    let processando = false;

    const executar = function () {
      if (processando) {
        return;
      }

      processando = true;

      try {
        callback();
      } finally {
        processando = false;
      }
    };

    const observador = new MutationObserver(executar);

    observador.observe(elemento, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    executar();
  }

  function iniciar() {
    injetarEstilosMensagensNarrativas();
    observarElemento("#solicitacaoCombate", corrigirSolicitacaoCombate);
    observarElemento("#mensagemAcaoAtualCombate", corrigirMensagemTurno);
    observarElemento("#resultadoDado", corrigirErroDados);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
