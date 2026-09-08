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
  eventos: {
    descricoesNarrativas: {
      combate: {
        arremesso: {
        caiuAposErro: {
          momento: "Depois que um ataque de arremesso erra e a arma cai no mapa.",
          variaveis: ["arma", "alvo", "coluna", "linha"],
          canais: {
            acaoAtual: "A {arma} errou o alvo e caiu nas proximidades.",
            solicitacao:
              "A {arma} passou por {alvo} e caiu na coluna {coluna}, linha {linha}.",
            historicoTitulo: "{arma} caída",
            historicoDescricao:
              "A arma arremessada errou {alvo} e caiu na coluna {coluna}, linha {linha}.",
          },
        },

        caiuAposAcerto: {
          momento:
            "Depois que um ataque de arremesso acerta, mas nenhum dado de dano alcança o máximo.",
          variaveis: ["arma", "alvo", "coluna", "linha"],
          canais: {
            acaoAtual: "A {arma} atingiu o alvo e caiu nas proximidades.",
            solicitacao:
              "Após atingir {alvo}, a {arma} caiu na coluna {coluna}, linha {linha}.",
            historicoTitulo: "{arma} caída",
            historicoDescricao:
              "Depois do impacto, a arma caiu na coluna {coluna}, linha {linha}.",
          },
        },

        cravada: {
          momento:
            "Depois que um ataque de arremesso acerta e ao menos um dado de dano alcança o máximo.",
          variaveis: ["arma", "alvo"],
          canais: {
            acaoAtual: "A {arma} ficou cravada no alvo.",
            solicitacao: "A {arma} ficou cravada em {alvo}.",
            historicoTitulo: "{arma} cravada",
            historicoDescricao: "A arma ficou cravada em {alvo} após o impacto.",
          },
        },
        },
      },
    },

    regras: {
      combate: {
        iniciativa: {
          pedir: {
            momento: "Quando o combate começa e o jogador precisa determinar sua iniciativa.",
            variaveis: ["modificador"],
            canais: {
              solicitacao:
                "Role 1d20 {modificador} para definir sua posição na ordem do combate.",
            },
          },
        },

        ataque: {
          selecionarAlvo: {
            momento: "Quando uma tentativa de ataque ainda não possui um alvo selecionado.",
            variaveis: [],
            canais: {
              solicitacao: "Selecione um inimigo antes de atacar.",
            },
          },

          pedirNormal: {
            momento: "Quando o jogador realiza uma jogada de ataque normal.",
            variaveis: ["modificador", "alvo"],
            canais: {
              solicitacao:
                "Role <strong>1d20 {modificador}</strong> para atacar {alvo}.",
            },
          },

          pedirVantagem: {
            momento: "Quando o jogador realiza uma jogada de ataque com Vantagem.",
            variaveis: ["modificador", "alvo"],
            canais: {
              solicitacao:
                "Role <strong>2d20 {modificador}</strong>, <strong>usar o maior resultado</strong> para atacar {alvo}.",
            },
          },

          pedirDesvantagem: {
            momento: "Quando o jogador realiza uma jogada de ataque com Desvantagem.",
            variaveis: ["modificador", "alvo"],
            canais: {
              solicitacao:
                "Role <strong>2d20 {modificador}</strong>, <strong>usar o menor resultado</strong> para atacar {alvo}.",
            },
          },
        },

        dano: {
          pedirNormal: {
            momento: "Depois de um acerto normal, antes da rolagem de dano.",
            variaveis: ["expressaoDano"],
            canais: {
              solicitacao:
                "O ataque acertou. Role <strong>{expressaoDano}</strong> de dano.",
            },
          },

          pedirCritico: {
            momento: "Depois de um acerto crítico, antes da rolagem de dano.",
            variaveis: [],
            canais: {
              solicitacao:
                "Acerto Crítico! Role dano normalmente, <strong>multiplicar por 2</strong>, e depois adicione o bônus de dano do ataque escolhido.",
            },
          },
        },
      },
    },
  },

  iniciativa: {
    pedir: function (modificador) {
      return obterMensagemJogabilidade("regras.combate.iniciativa.pedir", {
        modificador: formatarSinalNarrativo(modificador),
      }).solicitacao;
    },
  },

  ataque: {
    get selecionarAlvo() {
      return obterMensagemJogabilidade(
        "regras.combate.ataque.selecionarAlvo",
      ).solicitacao;
    },

    pedirNormal: function (modificador, alvoNome) {
      return obterMensagemJogabilidade("regras.combate.ataque.pedirNormal", {
        modificador: formatarSinalNarrativo(modificador),
        alvo: alvoNome,
      }).solicitacao;
    },

    pedirVantagem: function (modificador, alvoNome) {
      return obterMensagemJogabilidade("regras.combate.ataque.pedirVantagem", {
        modificador: formatarSinalNarrativo(modificador),
        alvo: alvoNome,
      }).solicitacao;
    },

    pedirDesvantagem: function (modificador, alvoNome) {
      return obterMensagemJogabilidade("regras.combate.ataque.pedirDesvantagem", {
        modificador: formatarSinalNarrativo(modificador),
        alvo: alvoNome,
      }).solicitacao;
    },
  },

  dano: {
    acertoNormal: function (expressaoCompleta) {
      return obterMensagemJogabilidade("regras.combate.dano.pedirNormal", {
        expressaoDano: expressaoCompleta,
      }).solicitacao;
    },

    acertoCritico: function () {
      return obterMensagemJogabilidade(
        "regras.combate.dano.pedirCritico",
      ).solicitacao;
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

    vexAplicado: function (
  alvoNome,
) {
  return (
    "<strong>Vex foi ativado.</strong> " +
    `Você encontrou um ponto fraco na defesa de ${alvoNome}. ` +
    "Você terá <strong>Vantagem no próximo ataque</strong> " +
    "contra esse alvo antes do fim do seu próximo turno."
  );
},
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

  progressao: {
    xpRecebido: function (
      quantidade,
      xpTotal,
    ) {
      return (
        `Você recebeu ${quantidade} XP. ` +
        `Seu total agora é ${xpTotal} XP.`
      );
    },

    novoNivelDisponivel: function (
      nivel,
    ) {
      return (
        `Você alcançou XP suficiente para o ` +
        `nível ${nivel}. ` +
        "A evolução do personagem estará disponível após a aventura."
      );
    },

    erroAoConcederXp:
      "Não foi possível registrar a recompensa de experiência.",

      erroAoSalvarCombate:
      "Não foi possível salvar todas as alterações causadas pelo combate.",
  },

};

function aplicarRascunhoMensagensJogabilidade() {
  if (typeof localStorage === "undefined") {
    return;
  }

  const chaveRascunho = "rpg-solo:mensagens-jogabilidade:rascunho:v1";
  let rascunho;

  try {
    rascunho = JSON.parse(localStorage.getItem(chaveRascunho));
  } catch (erro) {
    console.warn("Não foi possível ler o rascunho local de mensagens.", erro);
    return;
  }

  for (const [caminho, personalizacao] of Object.entries(rascunho ?? {})) {
    const caminhoAtual = caminho.startsWith("combate.arremesso.")
      ? `descricoesNarrativas.${caminho}`
      : caminho;
    const entrada = caminhoAtual.split(".").reduce(
      (valor, parte) => valor?.[parte],
      window.mensagensNarrativas.eventos,
    );

    if (!entrada?.canais || !personalizacao?.canais) {
      continue;
    }

    for (const [canal, texto] of Object.entries(personalizacao.canais)) {
      if (typeof texto === "string" && Object.hasOwn(entrada.canais, canal)) {
        entrada.canais[canal] = texto;
      }
    }
  }
}

aplicarRascunhoMensagensJogabilidade();

function obterEntradaCatalogoMensagens(caminho) {
  return caminho.split(".").reduce(
    (entrada, parte) => entrada?.[parte],
    window.mensagensNarrativas.eventos,
  ) ?? null;
}

function preencherVariaveisMensagem(modelo, variaveis = {}) {
  if (typeof modelo !== "string") {
    return "";
  }

  return modelo.replace(/\{([a-zA-Z0-9_]+)\}/g, function substituir(
    marcador,
    nomeVariavel,
  ) {
    return Object.hasOwn(variaveis, nomeVariavel)
      ? String(variaveis[nomeVariavel])
      : marcador;
  });
}

function obterMensagemJogabilidade(caminho, variaveis = {}) {
  const entrada = obterEntradaCatalogoMensagens(caminho);

  if (!entrada?.canais) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(entrada.canais).map(([canal, modelo]) => [
      canal,
      preencherVariaveisMensagem(modelo, variaveis),
    ]),
  );
}

window.obterMensagemJogabilidade = obterMensagemJogabilidade;
