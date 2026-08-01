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
