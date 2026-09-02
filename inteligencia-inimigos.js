"use strict";

window.InteligenciaInimigos = (function () {
  //Este módulo concentrará as decisões táticas dos inimigos. As regras e a execução das ações continuam pertencendo ao SistemaCombate.//

  //Perfis Táticos//

  const perfisTaticos = {
    equilibrado: {
      id: "equilibrado",

      bonusCorpoACorpo: 0,
      bonusDistancia: 0,

      valorAproximacao: 1,
      valorDistancia: 1,
      valorCobertura: 1,
      toleranciaRisco: 1,
    },

    agressivo: {
      id: "agressivo",

      bonusCorpoACorpo: 15,
      bonusDistancia: 0,

      valorAproximacao: 3,
      valorDistancia: 0,
      valorCobertura: 1,
      toleranciaRisco: 2,
    },

    atirador: {
      id: "atirador",

      bonusCorpoACorpo: 0,
      bonusDistancia: 15,

      valorAproximacao: 0,
      valorDistancia: 3,
      valorCobertura: 2,
      toleranciaRisco: 1,
    },

    defensivo: {
      id: "defensivo",

      bonusCorpoACorpo: 0,
      bonusDistancia: 5,

      valorAproximacao: 0,
      valorDistancia: 2,
      valorCobertura: 4,
      toleranciaRisco: 0,
    },

    covarde: {
      id: "covarde",

      bonusCorpoACorpo: -10,
      bonusDistancia: 10,

      valorAproximacao: -3,
      valorDistancia: 4,
      valorCobertura: 4,
      toleranciaRisco: -2,
    },
  };

  //Avaliações de Batalha//

  function obterPerfilTatico(inimigo) {
    const perfilId = inimigo?.inteligencia?.perfil ?? "equilibrado";

    return perfisTaticos[perfilId] ?? perfisTaticos.equilibrado;
  }

  function avaliarCoberturaDaPosicao(combate, posicaoDefensor, posicaoAtacante) {
    const resultadoLinhaVisao = SistemaCombate.verificarLinhaVisao(
      combate,
      posicaoAtacante,
      posicaoDefensor,
    );

    if (!resultadoLinhaVisao.sucesso) {
      return {
        pontuacao: 0,
        cobertura: null,
        linhaLivre: false,
      };
    }

    const cobertura = resultadoLinhaVisao.cobertura;

    if (cobertura === "bloqueioTotal") {
      return {
        pontuacao: -Infinity,
        cobertura,
        linhaLivre: false,
      };
    }

    if (cobertura === "coberturaTresQuartos") {
      return {
        pontuacao: 5,
        cobertura,
        linhaLivre: true,
      };
    }

    if (cobertura === "coberturaParcial") {
      return {
        pontuacao: 2,
        cobertura,
        linhaLivre: true,
      };
    }

    return {
      pontuacao: 0,
      cobertura: null,
      linhaLivre: true,
    };
  }

  function avaliarAtaqueDaPosicao(combate, inimigo, alvo, ataque, posicao) {
    if (!combate || !inimigo || !alvo || !ataque || !posicao) {
      return {
        podeAtacar: false,
        motivo: "dadosInvalidos",
      };
    }

    const inimigoSimulado = {
      ...inimigo,

      posicao: {
        coluna: posicao.coluna,
        linha: posicao.linha,
      },
    };

    const resultadoSelecao = SistemaCombate.validarSelecaoAcao(
      inimigoSimulado,
      alvo,
      ataque,
      combate,
    );

    if (!resultadoSelecao.sucesso) {
      return {
        podeAtacar: false,
        motivo: resultadoSelecao.motivo,
        distancia: resultadoSelecao.distancia ?? null,
      };
    }

    return {
      podeAtacar: true,
      motivo: null,
      distancia: resultadoSelecao.distancia,
      tipoRolagem: resultadoSelecao.tipoRolagem,
      coberturaDoAlvo: resultadoSelecao.cobertura ?? null,
      bonusCoberturaDoAlvo: resultadoSelecao.bonusCobertura ?? 0,
    };
  }

  function avaliarPosicaoTaticaDeAtaque(combate, inimigo, alvo, ataque, posicao) {
    const avaliacaoAtaque = avaliarAtaqueDaPosicao(combate, inimigo, alvo, ataque, posicao);

    if (!avaliacaoAtaque.podeAtacar) {
      return {
        posicao: {
          coluna: posicao.coluna,
          linha: posicao.linha,
        },

        custoMovimento: Number(posicao.custo) || 0,

        caminho: structuredClone(posicao.caminho ?? []),

        valida: false,
        pontuacao: -Infinity,
        motivo: avaliacaoAtaque.motivo,
        ataque: avaliacaoAtaque,
        defesa: null,
      };
    }

    const avaliacaoDefesa = avaliarCoberturaDaPosicao(combate, posicao, alvo.posicao);

    const perfil = obterPerfilTatico(inimigo);

    const bonusTipoAtaque =
      ataque.categoria === "corpoACorpo"
        ? perfil.bonusCorpoACorpo
        : ataque.categoria === "distancia"
          ? perfil.bonusDistancia
          : 0;

    const valorDefensivoCobertura = avaliacaoDefesa.pontuacao * perfil.valorCobertura;

    const bonusAlcanceNormal = avaliacaoAtaque.tipoRolagem === "normal" ? 20 : 0;

    const penalidadeCoberturaDoAlvo = avaliacaoAtaque.bonusCoberturaDoAlvo ?? 0;

    const pontuacao =
      100 +
      bonusAlcanceNormal +
      bonusTipoAtaque +
      valorDefensivoCobertura -
      penalidadeCoberturaDoAlvo;

    return {
      posicao: {
        coluna: posicao.coluna,
        linha: posicao.linha,
      },

      custoMovimento: Number(posicao.custo) || 0,

      caminho: structuredClone(posicao.caminho ?? []),

      valida: true,
      pontuacao,
      motivo: null,
      perfilId: perfil.id,
      criterios: {
        base: 100,
        alcanceNormal: bonusAlcanceNormal,
        tipoAtaque: bonusTipoAtaque,
        coberturaPropria: valorDefensivoCobertura,
        coberturaDoAlvo: -penalidadeCoberturaDoAlvo,
      },
      ataque: avaliacaoAtaque,

defesa: avaliacaoDefesa,
    };
  }

  function listarPosicoesAlcancaveis(combate, inimigo) {
    if (!combate?.tabuleiro || !inimigo?.posicao) {
      return [];
    }

    const movimentoDisponivel = Number(inimigo.movimentoRestante) || 0;

    const colunaMinima = Math.max(1, inimigo.posicao.coluna - movimentoDisponivel);

    const colunaMaxima = Math.min(
      combate.tabuleiro.colunas,
      inimigo.posicao.coluna + movimentoDisponivel,
    );

    const linhaMinima = Math.max(1, inimigo.posicao.linha - movimentoDisponivel);

    const linhaMaxima = Math.min(
      combate.tabuleiro.linhas,
      inimigo.posicao.linha + movimentoDisponivel,
    );

    const posicoes = [];

    for (let linha = linhaMinima; linha <= linhaMaxima; linha++) {
      for (let coluna = colunaMinima; coluna <= colunaMaxima; coluna++) {
        const resultadoCaminho = SistemaCombate.calcularCaminhoMovimento(combate, inimigo, {
          coluna,
          linha,
        });

        if (!resultadoCaminho || resultadoCaminho.custo > movimentoDisponivel) {
          continue;
        }

        posicoes.push({
          coluna,
          linha,
          custo: resultadoCaminho.custo,
          caminho: resultadoCaminho.caminho,
        });
      }
    }

    return posicoes;
  }

  function escolherMelhorPosicaoTatica(combate, inimigo, alvo, ataque, posicoesCandidatas) {
    if (!Array.isArray(posicoesCandidatas) || posicoesCandidatas.length === 0) {
      return null;
    }

    let melhorAvaliacao = null;

    for (const posicao of posicoesCandidatas) {
      const avaliacao = avaliarPosicaoTaticaDeAtaque(combate, inimigo, alvo, ataque, posicao);

      if (!avaliacao.valida) {
        continue;
      }

      const possuiPontuacaoMaior =
        melhorAvaliacao === null || avaliacao.pontuacao > melhorAvaliacao.pontuacao;

      const possuiMesmaPontuacao =
        melhorAvaliacao !== null && avaliacao.pontuacao === melhorAvaliacao.pontuacao;

      const possuiMenorCusto =
        melhorAvaliacao !== null && avaliacao.custoMovimento < melhorAvaliacao.custoMovimento;

      if (possuiPontuacaoMaior || (possuiMesmaPontuacao && possuiMenorCusto)) {
        melhorAvaliacao = avaliacao;
      }
    }

    return melhorAvaliacao;
  }

  function planejarPosicaoParaAtaque(combate, inimigo, alvo, ataque) {
    const posicoesAlcancaveis = listarPosicoesAlcancaveis(combate, inimigo);

    if (posicoesAlcancaveis.length === 0) {
      return {
        sucesso: false,
        motivo: "nenhumaPosicaoAlcancavel",
        quantidadeAvaliada: 0,
        melhorPosicao: null,
      };
    }

    const melhorPosicao = escolherMelhorPosicaoTatica(
      combate,
      inimigo,
      alvo,
      ataque,
      posicoesAlcancaveis,
    );

    if (!melhorPosicao) {
      return {
        sucesso: false,
        motivo: "nenhumaPosicaoPermiteAtaque",
        quantidadeAvaliada: posicoesAlcancaveis.length,
        melhorPosicao: null,
      };
    }

    return {
      sucesso: true,
      motivo: null,
      quantidadeAvaliada: posicoesAlcancaveis.length,
      melhorPosicao,
    };
  }

  function planejarAproximacaoAoAlvo(
  combate,
  inimigo,
  alvo,
) {
  const perfil =
    obterPerfilTatico(inimigo);

  if (perfil.valorAproximacao <= 0) {
    return {
      sucesso: false,
      motivo: "perfilNaoBuscaAproximacao",
      melhorPosicao: null,
    };
  }

  const distanciaInicial =
    SistemaCombate.calcularDistancia(
      inimigo.posicao,
      alvo.posicao,
    );

  const posicoesAlcancaveis =
    listarPosicoesAlcancaveis(
      combate,
      inimigo,
    );

  let melhorPosicao = null;

  for (const posicao of posicoesAlcancaveis) {
    const distanciaFinal =
      SistemaCombate.calcularDistancia(
        posicao,
        alvo.posicao,
      );

    const reducaoDistancia =
      distanciaInicial - distanciaFinal;

    if (reducaoDistancia <= 0) {
      continue;
    }

    const pontuacao =
      100 +
      perfil.bonusCorpoACorpo +
      reducaoDistancia *
        perfil.valorAproximacao;

    const avaliacao = {
      posicao: {
        coluna: posicao.coluna,
        linha: posicao.linha,
      },

      custoMovimento: posicao.custo,

      caminho:
        structuredClone(posicao.caminho),

      distanciaInicial,
      distanciaFinal,
      reducaoDistancia,
      pontuacao,
      perfilId: perfil.id,
    };

    const possuiPontuacaoMaior =
      melhorPosicao === null ||
      avaliacao.pontuacao >
        melhorPosicao.pontuacao;

    const possuiMesmaPontuacao =
      melhorPosicao !== null &&
      avaliacao.pontuacao ===
        melhorPosicao.pontuacao;

    const possuiMenorCusto =
      melhorPosicao !== null &&
      avaliacao.custoMovimento <
        melhorPosicao.custoMovimento;

    if (
      possuiPontuacaoMaior ||
      (
        possuiMesmaPontuacao &&
        possuiMenorCusto
      )
    ) {
      melhorPosicao = avaliacao;
    }
  }

  if (!melhorPosicao) {
    return {
      sucesso: false,
      motivo: "nenhumaAproximacaoPossivel",
      melhorPosicao: null,
    };
  }

  return {
    sucesso: true,
    motivo: null,
    melhorPosicao,
  };
}

  function planejarAtaqueEPosicao(
  combate,
  inimigo,
  alvo,
) {
  if (
    !Array.isArray(inimigo?.ataques) ||
    inimigo.ataques.length === 0
  ) {
    return {
      sucesso: false,
      motivo: "inimigoSemAtaques",
      planosAvaliados: [],
      melhorPlano: null,
    };
  }

  const planosAvaliados = [];

  for (const ataque of inimigo.ataques) {
    const plano =
      planejarPosicaoParaAtaque(
        combate,
        inimigo,
        alvo,
        ataque,
      );

    if (!plano.sucesso) {
      continue;
    }

    planosAvaliados.push({
      ataque,
      plano,

      pontuacao:
        plano.melhorPosicao.pontuacao,

      custoMovimento:
        plano.melhorPosicao
          .custoMovimento,
    });
  }

  if (planosAvaliados.length === 0) {
    return {
      sucesso: false,
      motivo: "nenhumAtaquePossivel",
      planosAvaliados,
      melhorPlano: null,
    };
  }

  planosAvaliados.sort(
    (planoA, planoB) => {
      const diferencaPontuacao =
        planoB.pontuacao -
        planoA.pontuacao;

      if (diferencaPontuacao !== 0) {
        return diferencaPontuacao;
      }

      return (
        planoA.custoMovimento -
        planoB.custoMovimento
      );
    },
  );

  return {
    sucesso: true,
    motivo: null,
    planosAvaliados,
    melhorPlano: planosAvaliados[0],
  };
}

function planejarTurnoTatico(
  combate,
  inimigo,
  alvo,
) {
  const opcoes = [];

  const planoAtaque =
    planejarAtaqueEPosicao(
      combate,
      inimigo,
      alvo,
    );

  if (planoAtaque.sucesso) {
    opcoes.push({
      tipo: "atacar",

      pontuacao:
        planoAtaque.melhorPlano
          .pontuacao,

      custoMovimento:
        planoAtaque.melhorPlano
          .custoMovimento,

      ataque:
        planoAtaque.melhorPlano
          .ataque,

      posicao:
        planoAtaque.melhorPlano
          .plano.melhorPosicao,

      detalhes: planoAtaque,
    });
  }

  const planoAproximacao =
    planejarAproximacaoAoAlvo(
      combate,
      inimigo,
      alvo,
    );

  if (planoAproximacao.sucesso) {
    opcoes.push({
      tipo: "aproximar",

      pontuacao:
        planoAproximacao
          .melhorPosicao
          .pontuacao,

      custoMovimento:
        planoAproximacao
          .melhorPosicao
          .custoMovimento,

      ataque: null,

      posicao:
        planoAproximacao
          .melhorPosicao,

      detalhes: planoAproximacao,
    });
  }

  if (opcoes.length === 0) {
    return {
      sucesso: false,
      motivo: "nenhumPlanoDisponivel",
      opcoes: [],
      planoEscolhido: null,
    };
  }

  opcoes.sort(
    (opcaoA, opcaoB) => {
      const diferencaPontuacao =
        opcaoB.pontuacao -
        opcaoA.pontuacao;

      if (diferencaPontuacao !== 0) {
        return diferencaPontuacao;
      }

      return (
        opcaoA.custoMovimento -
        opcaoB.custoMovimento
      );
    },
  );

  return {
    sucesso: true,
    motivo: null,
    opcoes,
    planoEscolhido: opcoes[0],
  };
}

  function escolherPosicaoComMelhorCobertura(combate, posicoesCandidatas, posicaoAtacante) {
    if (!Array.isArray(posicoesCandidatas) || posicoesCandidatas.length === 0) {
      return null;
    }

    let melhorPosicao = null;

    for (const posicao of posicoesCandidatas) {
      const avaliacao = avaliarCoberturaDaPosicao(combate, posicao, posicaoAtacante);

      if (!avaliacao.linhaLivre) {
        continue;
      }

      if (melhorPosicao === null || avaliacao.pontuacao > melhorPosicao.pontuacao) {
        melhorPosicao = {
          posicao: {
            coluna: posicao.coluna,
            linha: posicao.linha,
          },

          pontuacao: avaliacao.pontuacao,
          cobertura: avaliacao.cobertura,
        };
      }
    }

    return melhorPosicao;
  }

  return {
    obterPerfilTatico,

    avaliarCoberturaDaPosicao,
    avaliarAtaqueDaPosicao,
    avaliarPosicaoTaticaDeAtaque,

    listarPosicoesAlcancaveis,
    escolherMelhorPosicaoTatica,

    planejarPosicaoParaAtaque,
    planejarAproximacaoAoAlvo,
    planejarAtaqueEPosicao,
    planejarTurnoTatico,

    escolherPosicaoComMelhorCobertura,
  };
})();
