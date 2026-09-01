"use strict";

window.SistemaCombate = (function () {
  function criarParticipanteCombate(entidade, configuracao) {
    return {
      id: configuracao.id ?? entidade.id,
      nome: configuracao.nome ?? entidade.nome,
      tipo: configuracao.tipo ?? entidade.tipo,
      grupoId: configuracao.grupoId ?? null,

      tamanho:
        (Array.isArray(entidade.tamanho) ? entidade.tamanho[0] : entidade.tamanho) ?? "medio",

      atributos: structuredClone(entidade.atributos ?? {}),

      salvaguardas: structuredClone(entidade.salvaguardas ?? []),

      bonusProficiencia:
        Number(entidade.bonusProficiencia) ||
        2 + Math.floor((Math.max(1, Number(entidade.nivel) || 1) - 1) / 4),

      bonusIniciativa: SistemaTestes.calcularModificadorAtributo(entidade.atributos.destreza),

      movimentoMaximo: configuracao.movimentoMaximo ?? 6,

      posicao: structuredClone(configuracao.posicao),

      classeArmadura: entidade.combate.classeArmadura,

      pontosDeVida: structuredClone(entidade.combate.pontosDeVida),

      ataques: structuredClone(entidade.ataques),

      talentos: structuredClone(entidade.talentos ?? []),

      classeId: entidade.classeId ?? null,

      especieId: entidade.especieId ?? null,

      nivel: Number(entidade.nivel) || 0,

      niveisPorClasse: structuredClone(entidade.niveisPorClasse ?? {}),

      habilidades: structuredClone(
        entidade.habilidades ?? {
          escolhas: {},
          recursos: {},
        },
      ),

      representacao: structuredClone(configuracao.representacao ?? entidade.avatar ?? null),
    };
  }

  function criarEstadoCombate(configuracao) {
    const participantes = structuredClone(configuracao.participantes);

    for (const participante of participantes) {
      participante.estado = participante.estado ?? "ativo";

      participante.bonusIniciativa = participante.bonusIniciativa ?? 0;

      participante.iniciativa = null;

      participante.movimentoMaximo = participante.movimentoMaximo ?? 6;

      participante.movimentoRestante = participante.movimentoMaximo;

      participante.acaoDisponivel = true;
      participante.acaoBonusDisponivel = true;
      participante.reacaoDisponivel = true;
      participante.desengajando = false;
    }

    const objetivosConfigurados = Array.isArray(configuracao.objetivos)
      ? structuredClone(configuracao.objetivos)
      : [];

    const objetivos =
      objetivosConfigurados.length > 0
        ? objetivosConfigurados
        : [
            {
              id: "eliminacao",
              tipo: "principal",
              titulo: "Derrotar os inimigos",
              descricao: "Derrote todos os inimigos.",
              condicao: {
                tipo: "inimigosDerrotados",
              },
              resultadoId: "vitoria",
              categoria: "sucesso",
            },
          ];

    for (const objetivo of objetivos) {
      objetivo.estado = objetivo.estado ?? "pendente";
    }

    return {
      id: configuracao.id,
      status: "ativo",
      fase: "iniciativa",
      resultadoId: null,
      objetivoConcluidoId: null,
      encontro: structuredClone(configuracao.encontro ?? null),
      objetivos,
      terreno: structuredClone(
        configuracao.terreno ?? {
          bloqueado: [],
          dificil: [],
        },
      ),
      visao: structuredClone(
        configuracao.visao ?? {
          bloqueios: [],
          barreiras: [],
        },
      ),
      areas: structuredClone(configuracao.areas ?? {}),
      marcadores: structuredClone(configuracao.marcadores ?? {}),

      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [],
      participanteAtivoId: null,
      participanteSelecionadoId: null,
      alvoSelecionadoId: null,
      iniciativaPendenteId: null,
      ataquePendente: null,
      danoPendente: null,
      decisaoPendente: null,

      maestriasAtivas: {},

      resultadoNotificado: false,

      participantes,

      tabuleiro: {
        colunas: 48,
        linhas: 27,
      },
    };
  }

  function iniciarCombate(configuracao) {
    const combate = criarEstadoCombate(configuracao);

    window.estadoJogo.combateAtual = combate;

    return combate;
  }

  function registrarIniciativa(combate, idParticipante, total) {
    const participante = combate.participantes.find(
      (participante) => participante.id === idParticipante,
    );

    if (!participante) {
      console.warn("Participante não encontrado:", idParticipante);

      return false;
    }

    participante.iniciativa = Number(total);

    return true;
  }

  function rolarIniciativasInimigos(combate) {
    for (const participante of combate.participantes) {
      if (participante.tipo === "jogador") {
        continue;
      }

      const resultadoRolagem = realizarRolagemComposta({
        gruposDeDados: [
          {
            quantidade: 1,
            numeroDeFaces: 20,
          },
        ],

        modificador: participante.bonusIniciativa,
      });

      registrarIniciativa(combate, participante.id, resultadoRolagem.total);
    }
  }

  function calcularDistancia(origem, destino) {
    const distanciaColunas = Math.abs(destino.coluna - origem.coluna);

    const distanciaLinhas = Math.abs(destino.linha - origem.linha);

    return Math.max(distanciaColunas, distanciaLinhas);
  }

  function participantesSaoHostis(participanteA, participanteB) {
    if (!participanteA || !participanteB || participanteA.id === participanteB.id) {
      return false;
    }

    if (participanteA.grupoId !== null && participanteB.grupoId !== null) {
      return participanteA.grupoId !== participanteB.grupoId;
    }

    const participanteAInimigo = participanteA.tipo === "inimigo";

    const participanteBInimigo = participanteB.tipo === "inimigo";

    return participanteAInimigo !== participanteBInimigo;
  }

  function obterAlcanceAmeaca(participante) {
    const ataquesCorpoACorpo =
      participante?.ataques?.filter((ataque) => ataque.categoria === "corpoACorpo") ?? [];

    return ataquesCorpoACorpo.reduce(
      (maiorAlcance, ataque) =>
        Math.max(maiorAlcance, Number(ataque.selecao?.alcance?.normal) || 0),
      0,
    );
  }

  function listarAmeacadoresDaPosicao(combate, participante, posicao) {
    if (!combate || !participante || !posicao) {
      return [];
    }

    return combate.participantes.filter((possivelAmeacador) => {
      if (
        possivelAmeacador.estado === "derrotado" ||
        !participantesSaoHostis(participante, possivelAmeacador)
      ) {
        return false;
      }

      const alcanceAmeaca = obterAlcanceAmeaca(possivelAmeacador);

      if (alcanceAmeaca <= 0) {
        return false;
      }

      const distancia = calcularDistancia(possivelAmeacador.posicao, posicao);

      return distancia > 0 && distancia <= alcanceAmeaca;
    });
  }

  function listarSaidasDeZonaInfluencia(combate, participante, caminho) {
    if (!combate || !participante || !Array.isArray(caminho)) {
      return [];
    }

    const saidas = [];

    let posicaoAnterior = {
      coluna: participante.posicao.coluna,
      linha: participante.posicao.linha,
    };

    for (let indicePasso = 0; indicePasso < caminho.length; indicePasso++) {
      const proximaPosicao = caminho[indicePasso];

      const ameacadoresAntes = listarAmeacadoresDaPosicao(combate, participante, posicaoAnterior);

      const idsAmeacadoresDepois = new Set(
        listarAmeacadoresDaPosicao(combate, participante, proximaPosicao).map(
          (ameacador) => ameacador.id,
        ),
      );

      for (const ameacador of ameacadoresAntes) {
        if (idsAmeacadoresDepois.has(ameacador.id)) {
          continue;
        }

        saidas.push({
          ameacador,
          ameacadorId: ameacador.id,

          indicePasso,

          origem: {
            coluna: posicaoAnterior.coluna,
            linha: posicaoAnterior.linha,
          },

          destino: {
            coluna: proximaPosicao.coluna,
            linha: proximaPosicao.linha,
          },
        });
      }

      posicaoAnterior = {
        coluna: proximaPosicao.coluna,
        linha: proximaPosicao.linha,
      };
    }

    return saidas;
  }

  function escolherAtaqueOportunidade(ameacador, posicaoAlvo) {
    const distancia = calcularDistancia(ameacador.posicao, posicaoAlvo);

    return (
      ameacador.ataques?.find((ataque) => {
        if (ataque.categoria !== "corpoACorpo") {
          return false;
        }

        const alcance = Number(ataque.selecao?.alcance?.normal) || 0;

        return alcance > 0 && distancia <= alcance;
      }) ?? null
    );
  }

  function prepararAtaquesOportunidadeMovimento(combate, participante, caminho) {
    if (!combate || !participante || !Array.isArray(caminho) || participante.desengajando) {
      return [];
    }

    const saidas = listarSaidasDeZonaInfluencia(combate, participante, caminho);

    const ameacadoresPreparados = new Set();

    const oportunidades = [];

    for (const saida of saidas) {
      const ameacador = saida.ameacador;

      if (!ameacador.reacaoDisponivel || ameacadoresPreparados.has(ameacador.id)) {
        continue;
      }

      const ataque = escolherAtaqueOportunidade(ameacador, saida.origem);

      if (!ataque) {
        continue;
      }

      ameacadoresPreparados.add(ameacador.id);

      oportunidades.push({
        ameacador,
        ameacadorId: ameacador.id,

        alvo: participante,
        alvoId: participante.id,

        ataque,

        indicePasso: saida.indicePasso,

        origem: structuredClone(saida.origem),

        destino: structuredClone(saida.destino),
      });
    }

    return oportunidades;
  }

  function celulaPertenceRegiao(coluna, linha, regiao) {
    if (!regiao) {
      return false;
    }

    const colunaUnica = Number(regiao.coluna);
    const linhaUnica = Number(regiao.linha);

    if (Number.isFinite(colunaUnica) && Number.isFinite(linhaUnica)) {
      return coluna === colunaUnica && linha === linhaUnica;
    }

    const colunaInicial = Number(regiao.colunaInicial);
    const colunaFinal = Number(regiao.colunaFinal);
    const linhaInicial = Number(regiao.linhaInicial);
    const linhaFinal = Number(regiao.linhaFinal);

    if (
      !Number.isFinite(colunaInicial) ||
      !Number.isFinite(colunaFinal) ||
      !Number.isFinite(linhaInicial) ||
      !Number.isFinite(linhaFinal)
    ) {
      return false;
    }

    const menorColuna = Math.min(colunaInicial, colunaFinal);

    const maiorColuna = Math.max(colunaInicial, colunaFinal);

    const menorLinha = Math.min(linhaInicial, linhaFinal);

    const maiorLinha = Math.max(linhaInicial, linhaFinal);

    return (
      coluna >= menorColuna && coluna <= maiorColuna && linha >= menorLinha && linha <= maiorLinha
    );
  }

  function listarCelulasLinhaVisao(origem, destino) {
    if (!origem || !destino) {
      return [];
    }

    let colunaAtual = Number(origem.coluna);

    let linhaAtual = Number(origem.linha);

    const colunaDestino = Number(destino.coluna);

    const linhaDestino = Number(destino.linha);

    const diferencaColunas = Math.abs(colunaDestino - colunaAtual);

    const diferencaLinhas = Math.abs(linhaDestino - linhaAtual);

    const direcaoColuna = colunaAtual < colunaDestino ? 1 : -1;

    const direcaoLinha = linhaAtual < linhaDestino ? 1 : -1;

    let erro = diferencaColunas - diferencaLinhas;

    const celulas = [];

    while (colunaAtual !== colunaDestino || linhaAtual !== linhaDestino) {
      const erroDuplicado = 2 * erro;

      if (erroDuplicado > -diferencaLinhas) {
        erro -= diferencaLinhas;

        colunaAtual += direcaoColuna;
      }

      if (erroDuplicado < diferencaColunas) {
        erro += diferencaColunas;

        linhaAtual += direcaoLinha;
      }

      const chegouAoDestino = colunaAtual === colunaDestino && linhaAtual === linhaDestino;

      if (!chegouAoDestino) {
        celulas.push({
          coluna: colunaAtual,

          linha: linhaAtual,
        });
      }
    }

    return celulas;
  }

  function verificarLinhaVisao(combate, origem, destino) {
    if (!combate || !origem || !destino) {
      return {
        sucesso: false,

        motivo: "dadosInvalidos",

        linhaLivre: false,

        celulasPercorridas: [],

        bloqueio: null,
      };
    }

    const celulasPercorridas = listarCelulasLinhaVisao(origem, destino);

    const bloqueios = combate.visao?.bloqueios ?? [];

    const barreiras = combate.visao?.barreiras ?? [];

    let bloqueioEncontrado = null;

    let celulaBloqueada = null;

    let barreiraEncontrada = null;

    let cobertura = null;

    const pesoCobertura = {
      coberturaParcial: 1,
      coberturaTresQuartos: 2,
      bloqueioTotal: 3,
    };

    function encontrarBarreira(coluna, linha, lado) {
      return (
        barreiras.find(
          (barreira) =>
            Number(barreira.coluna) === coluna &&
            Number(barreira.linha) === linha &&
            barreira.lado === lado,
        ) ?? null
      );
    }

    function registrarBarreira(barreira) {
      if (!barreira) {
        return;
      }

      if (
        !barreiraEncontrada ||
        (pesoCobertura[barreira.tipo] ?? 0) > (pesoCobertura[barreiraEncontrada.tipo] ?? 0)
      ) {
        barreiraEncontrada = barreira;
        cobertura = barreira.tipo;
      }
    }

    const caminhoCompleto = [origem, ...celulasPercorridas, destino];

    for (let indice = 1; indice < caminhoCompleto.length; indice++) {
      const anterior = caminhoCompleto[indice - 1];
      const atual = caminhoCompleto[indice];
      const diferencaColuna = Number(atual.coluna) - Number(anterior.coluna);
      const diferencaLinha = Number(atual.linha) - Number(anterior.linha);

      if (diferencaColuna > 0) {
        registrarBarreira(
          encontrarBarreira(Number(atual.coluna), Number(atual.linha), "oeste") ??
            encontrarBarreira(Number(anterior.coluna), Number(anterior.linha), "leste"),
        );
      } else if (diferencaColuna < 0) {
        registrarBarreira(
          encontrarBarreira(Number(anterior.coluna), Number(anterior.linha), "oeste") ??
            encontrarBarreira(Number(atual.coluna), Number(atual.linha), "leste"),
        );
      }

      if (diferencaLinha > 0) {
        registrarBarreira(
          encontrarBarreira(Number(atual.coluna), Number(atual.linha), "norte") ??
            encontrarBarreira(Number(anterior.coluna), Number(anterior.linha), "sul"),
        );
      } else if (diferencaLinha < 0) {
        registrarBarreira(
          encontrarBarreira(Number(anterior.coluna), Number(anterior.linha), "norte") ??
            encontrarBarreira(Number(atual.coluna), Number(atual.linha), "sul"),
        );
      }
    }

    for (const celula of celulasPercorridas) {
      const bloqueio = bloqueios.find(function (regiao) {
        return celulaPertenceRegiao(celula.coluna, celula.linha, regiao);
      });

      if (bloqueio) {
        bloqueioEncontrado = bloqueio;

        celulaBloqueada = {
          coluna: celula.coluna,

          linha: celula.linha,
        };

        break;
      }
    }

    return {
      sucesso: true,

      motivo: null,

      linhaLivre: bloqueioEncontrado === null && cobertura !== "bloqueioTotal",

      celulasPercorridas,

      bloqueio: bloqueioEncontrado,

      celulaBloqueada,

      barreira: barreiraEncontrada,

      cobertura,

      bonusCobertura:
        cobertura === "coberturaTresQuartos" ? 5 : cobertura === "coberturaParcial" ? 2 : 0,
    };
  }

  function obterTipoTerreno(combate, coluna, linha) {
    const regioesBloqueadas = combate?.terreno?.bloqueado ?? [];

    const celulaBloqueada = regioesBloqueadas.some((regiao) =>
      celulaPertenceRegiao(coluna, linha, regiao),
    );

    if (celulaBloqueada) {
      return "bloqueado";
    }

    const regioesDificeis = combate?.terreno?.dificil ?? [];

    const celulaDificil = regioesDificeis.some((regiao) =>
      celulaPertenceRegiao(coluna, linha, regiao),
    );

    if (celulaDificil) {
      return "dificil";
    }

    return "normal";
  }

  function movimentoDiagonalCruzaCantoBloqueado(combate, origem, destino) {
    const diferencaColuna = destino.coluna - origem.coluna;

    const diferencaLinha = destino.linha - origem.linha;

    if (Math.abs(diferencaColuna) !== 1 || Math.abs(diferencaLinha) !== 1) {
      return false;
    }

    const terrenoHorizontal = obterTipoTerreno(
      combate,
      origem.coluna + diferencaColuna,
      origem.linha,
    );

    const terrenoVertical = obterTipoTerreno(combate, origem.coluna, origem.linha + diferencaLinha);

    return terrenoHorizontal === "bloqueado" || terrenoVertical === "bloqueado";
  }

  function criarChaveCelula(coluna, linha) {
    return `${coluna},${linha}`;
  }

  function converterChaveCelula(chave) {
    const [coluna, linha] = chave.split(",").map(Number);

    return {
      coluna,
      linha,
    };
  }

  function celulaOcupadaPorOutro(combate, participanteId, coluna, linha) {
    return combate.participantes.some(
      (participante) =>
        participante.id !== participanteId &&
        participante.estado !== "derrotado" &&
        participante.posicao.coluna === coluna &&
        participante.posicao.linha === linha,
    );
  }

  function calcularCaminhoMovimento(combate, participante, destino) {
    if (!combate || !participante || !destino) {
      return null;
    }

    const destinoForaDoTabuleiro =
      destino.coluna < 1 ||
      destino.coluna > combate.tabuleiro.colunas ||
      destino.linha < 1 ||
      destino.linha > combate.tabuleiro.linhas;

    if (destinoForaDoTabuleiro) {
      return null;
    }

    if (obterTipoTerreno(combate, destino.coluna, destino.linha) === "bloqueado") {
      return null;
    }

    if (celulaOcupadaPorOutro(combate, participante.id, destino.coluna, destino.linha)) {
      return null;
    }

    const origem = {
      coluna: participante.posicao.coluna,
      linha: participante.posicao.linha,
    };

    const chaveOrigem = criarChaveCelula(origem.coluna, origem.linha);

    const chaveDestino = criarChaveCelula(destino.coluna, destino.linha);

    if (chaveOrigem === chaveDestino) {
      return {
        caminho: [],
        custo: 0,
      };
    }

    const custos = new Map([[chaveOrigem, 0]]);

    const anteriores = new Map();

    const celulasAbertas = [
      {
        coluna: origem.coluna,
        linha: origem.linha,
        custo: 0,
      },
    ];

    while (celulasAbertas.length > 0) {
      celulasAbertas.sort((celulaA, celulaB) => celulaA.custo - celulaB.custo);

      const atual = celulasAbertas.shift();

      const chaveAtual = criarChaveCelula(atual.coluna, atual.linha);

      if (atual.custo !== custos.get(chaveAtual)) {
        continue;
      }

      if (chaveAtual === chaveDestino) {
        const caminho = [];

        let chavePercorrida = chaveDestino;

        while (chavePercorrida !== chaveOrigem) {
          caminho.unshift(converterChaveCelula(chavePercorrida));

          chavePercorrida = anteriores.get(chavePercorrida);
        }

        return {
          caminho,
          custo: atual.custo,
        };
      }

      for (let diferencaColuna = -1; diferencaColuna <= 1; diferencaColuna++) {
        for (let diferencaLinha = -1; diferencaLinha <= 1; diferencaLinha++) {
          if (diferencaColuna === 0 && diferencaLinha === 0) {
            continue;
          }

          const proximaColuna = atual.coluna + diferencaColuna;

          const proximaLinha = atual.linha + diferencaLinha;

          const foraDoTabuleiro =
            proximaColuna < 1 ||
            proximaColuna > combate.tabuleiro.colunas ||
            proximaLinha < 1 ||
            proximaLinha > combate.tabuleiro.linhas;

          if (foraDoTabuleiro) {
            continue;
          }

          if (
            movimentoDiagonalCruzaCantoBloqueado(combate, atual, {
              coluna: proximaColuna,
              linha: proximaLinha,
            })
          ) {
            continue;
          }

          const tipoTerreno = obterTipoTerreno(combate, proximaColuna, proximaLinha);

          if (tipoTerreno === "bloqueado") {
            continue;
          }

          if (celulaOcupadaPorOutro(combate, participante.id, proximaColuna, proximaLinha)) {
            continue;
          }

          const custoPasso = tipoTerreno === "dificil" ? 2 : 1;

          const novoCusto = atual.custo + custoPasso;

          const chaveProxima = criarChaveCelula(proximaColuna, proximaLinha);

          const custoRegistrado = custos.get(chaveProxima);

          if (custoRegistrado !== undefined && custoRegistrado <= novoCusto) {
            continue;
          }

          custos.set(chaveProxima, novoCusto);

          anteriores.set(chaveProxima, chaveAtual);

          celulasAbertas.push({
            coluna: proximaColuna,
            linha: proximaLinha,
            custo: novoCusto,
          });
        }
      }
    }

    return null;
  }

  function validarSelecaoCriatura(atacante, alvo, acao, combate = null) {
    const distancia = calcularDistancia(atacante.posicao, alvo.posicao);

    const alcanceNormal = acao.selecao.alcance.normal;

    const alcanceLongo = acao.selecao.alcance.longo ?? null;

    if (alcanceLongo !== null && distancia > alcanceLongo) {
      return {
        sucesso: false,
        motivo: "alvoForaDoAlcance",
      };
    }

    if (alcanceLongo === null && distancia > alcanceNormal) {
      return {
        sucesso: false,
        motivo: "alvoForaDoAlcance",
      };
    }

    const resultadoLinhaVisao = combate
      ? verificarLinhaVisao(combate, atacante.posicao, alvo.posicao)
      : null;

    if (resultadoLinhaVisao?.sucesso && !resultadoLinhaVisao.linhaLivre) {
      return {
        sucesso: false,
        motivo: "semLinhaDeVisao",
        distancia,
        linhaVisao: resultadoLinhaVisao,
      };
    }

    const tipoRolagem =
      alcanceLongo !== null && distancia > alcanceNormal ? "desvantagem" : "normal";

    return {
      sucesso: true,
      distancia,
      tipoRolagem,
      cobertura: resultadoLinhaVisao?.cobertura ?? null,
      bonusCobertura: resultadoLinhaVisao?.bonusCobertura ?? 0,
    };
  }

  function validarSelecaoAcao(atacante, alvo, acao, combate = null) {
    if (!acao.selecao) {
      return {
        sucesso: false,
        motivo: "selecaoNaoInformada",
      };
    }

    if (acao.selecao.tipo === "criatura") {
      return validarSelecaoCriatura(atacante, alvo, acao, combate);
    }

    return {
      sucesso: false,
      motivo: "tipoSelecaoNaoImplementado",
    };
  }

  function movimentarParticipante(combate, idParticipante, coluna, linha, opcoes = {}) {
    const participante = combate.participantes.find(
      (participante) => participante.id === idParticipante,
    );

    if (!participante) {
      return {
        sucesso: false,
        motivo: "participanteInexistente",
      };
    }

    if (combate.participanteAtivoId !== participante.id) {
      return {
        sucesso: false,
        motivo: "foraDoTurno",
      };
    }

    const destinoForaDoTabuleiro =
      coluna < 1 ||
      coluna > combate.tabuleiro.colunas ||
      linha < 1 ||
      linha > combate.tabuleiro.linhas;

    if (destinoForaDoTabuleiro) {
      return {
        sucesso: false,
        motivo: "foraDoTabuleiro",
      };
    }

    const tipoTerrenoDestino = obterTipoTerreno(combate, coluna, linha);

    if (tipoTerrenoDestino === "bloqueado") {
      return {
        sucesso: false,
        motivo: "terrenoBloqueado",
      };
    }

    const celulaOcupada = combate.participantes.some(
      (outroParticipante) =>
        outroParticipante.id !== participante.id &&
        outroParticipante.posicao.coluna === coluna &&
        outroParticipante.posicao.linha === linha,
    );

    if (celulaOcupada) {
      return {
        sucesso: false,
        motivo: "celulaOcupada",
      };
    }

    const mesmaCelula =
      participante.posicao.coluna === coluna && participante.posicao.linha === linha;

    if (mesmaCelula) {
      return {
        sucesso: false,
        motivo: "mesmaCelula",
      };
    }

    const resultadoCaminho = calcularCaminhoMovimento(combate, participante, {
      coluna,
      linha,
    });

    if (!resultadoCaminho) {
      return {
        sucesso: false,
        motivo: "caminhoIndisponivel",
      };
    }

    if (resultadoCaminho.custo > participante.movimentoRestante) {
      return {
        sucesso: false,
        motivo: "movimentoInsuficiente",
        custoMovimento: resultadoCaminho.custo,
      };
    }

    let oportunidades = prepararAtaquesOportunidadeMovimento(
      combate,
      participante,
      resultadoCaminho.caminho,
    );

    const oportunidadesDoJogador = oportunidades.filter(function (oportunidade) {
      return oportunidade.ameacador.tipo === "jogador";
    });

    const escolhaReacaoJogador = opcoes.reacaoJogador;

    if (
      participante.tipo === "inimigo" &&
      oportunidadesDoJogador.length > 0 &&
      escolhaReacaoJogador !== "usar" &&
      escolhaReacaoJogador !== "ignorar"
    ) {
      const oportunidadePrincipal = oportunidadesDoJogador[0];

      combate.decisaoPendente = {
        tipo: "oferecerAtaqueOportunidade",

        participanteId: oportunidadePrincipal.ameacadorId,

        alvoId: participante.id,

        destino: {
          coluna,
          linha,
        },

        ataque: {
          id: obterIdentificadorAtaque(oportunidadePrincipal.ataque),

          nome: oportunidadePrincipal.ataque.nome,
        },

        origem: structuredClone(oportunidadePrincipal.origem),

        proximaPosicao: structuredClone(oportunidadePrincipal.destino),
      };

      return {
        sucesso: false,

        motivo: "reacaoJogadorPendente",

        reacaoPendente: true,

        decisao: combate.decisaoPendente,
      };
    }

    if (
      combate.decisaoPendente?.tipo === "oferecerAtaqueOportunidade" &&
      combate.decisaoPendente.alvoId === participante.id
    ) {
      combate.decisaoPendente = null;
    }

    if (participante.tipo === "inimigo" && escolhaReacaoJogador === "ignorar") {
      oportunidades = oportunidades.filter(function (oportunidade) {
        return oportunidade.ameacador.tipo !== "jogador";
      });
    }

    if (participante.tipo === "jogador" && oportunidades.length > 0 && !opcoes.confirmarSaidaZona) {
      combate.decisaoPendente = {
        tipo: "confirmarSaidaZona",

        participanteId: participante.id,

        destino: {
          coluna,
          linha,
        },

        ameacadores: oportunidades.map(function (oportunidade) {
          return {
            id: oportunidade.ameacadorId,

            nome: oportunidade.ameacador.nome,
          };
        }),
      };

      return {
        sucesso: false,

        motivo: "confirmacaoSaidaZonaNecessaria",

        confirmacaoNecessaria: true,

        decisao: combate.decisaoPendente,
      };
    }

    if (
      combate.decisaoPendente?.tipo === "confirmarSaidaZona" &&
      combate.decisaoPendente.participanteId === participante.id
    ) {
      combate.decisaoPendente = null;
    }

    const oportunidadesPorPasso = new Map();

    for (const oportunidade of oportunidades) {
      const listaDoPasso = oportunidadesPorPasso.get(oportunidade.indicePasso) ?? [];

      listaDoPasso.push(oportunidade);

      oportunidadesPorPasso.set(oportunidade.indicePasso, listaDoPasso);
    }

    const caminhoPercorrido = [];

    const ataquesOportunidade = [];

    let custoMovimento = 0;

    let movimentoInterrompido = false;

    movimento: for (
      let indicePasso = 0;
      indicePasso < resultadoCaminho.caminho.length;
      indicePasso++
    ) {
      const passo = resultadoCaminho.caminho[indicePasso];

      const oportunidadesDoPasso = oportunidadesPorPasso.get(indicePasso) ?? [];

      for (const oportunidade of oportunidadesDoPasso) {
        const resultadoOportunidade = executarAtaqueOportunidade(combate, oportunidade);

        ataquesOportunidade.push({
          oportunidade,
          resultado: resultadoOportunidade,
        });

        if (participante.estado === "derrotado" || combate.status !== "ativo") {
          movimentoInterrompido = true;

          break movimento;
        }
      }

      const tipoTerreno = obterTipoTerreno(combate, passo.coluna, passo.linha);

      const custoPasso = tipoTerreno === "dificil" ? 2 : 1;

      participante.posicao.coluna = passo.coluna;

      participante.posicao.linha = passo.linha;

      participante.movimentoRestante -= custoPasso;

      custoMovimento += custoPasso;

      caminhoPercorrido.push({
        coluna: passo.coluna,
        linha: passo.linha,
      });
    }

    const destinoAlcancado =
      participante.posicao.coluna === coluna && participante.posicao.linha === linha;

    return {
      sucesso: true,

      distancia: caminhoPercorrido.length,

      custoMovimento,

      caminho: caminhoPercorrido,

      ataquesOportunidade,

      movimentoInterrompido,

      destinoAlcancado,

      posicaoFinal: structuredClone(participante.posicao),

      movimentoRestante: participante.movimentoRestante,
    };
  }

  function consumirRecurso(participante, nomeRecurso) {
    if (!participante[nomeRecurso]) {
      return false;
    }

    participante[nomeRecurso] = false;

    return true;
  }

  function consumirAcao(participante) {
    return consumirRecurso(participante, "acaoDisponivel");
  }

  function consumirAcaoBonus(participante) {
    return consumirRecurso(participante, "acaoBonusDisponivel");
  }

  function consumirReacao(participante) {
    return consumirRecurso(participante, "reacaoDisponivel");
  }

  function usarAcaoDesengajar(combate, idParticipante) {
    const participante = combate?.participantes.find(
      (participante) => participante.id === idParticipante,
    );

    if (!participante) {
      return {
        sucesso: false,
        motivo: "participanteInexistente",
      };
    }

    if (combate.participanteAtivoId !== participante.id) {
      return {
        sucesso: false,
        motivo: "foraDoTurno",
      };
    }

    if (participante.estado === "derrotado") {
      return {
        sucesso: false,
        motivo: "participanteDerrotado",
      };
    }

    if (!participante.acaoDisponivel) {
      return {
        sucesso: false,
        motivo: "acaoIndisponivel",
      };
    }

    consumirAcao(participante);

    participante.desengajando = true;

    return {
      sucesso: true,
      participante,
    };
  }

  function participanteDominaArma(participante, ataque) {
    const maestriasEscolhidas = participante.habilidades?.escolhas?.maestriasArmas ?? [];

    if (!Array.isArray(maestriasEscolhidas)) {
      return false;
    }

    return maestriasEscolhidas.includes(ataque.armaId ?? ataque.id);
  }

  function resolverTipoRolagem({ vantagem = false, desvantagem = false } = {}) {
    if (vantagem && desvantagem) {
      return "normal";
    }

    if (vantagem) {
      return "vantagem";
    }

    if (desvantagem) {
      return "desvantagem";
    }

    return "normal";
  }

  function obterIdentificadorAtaque(ataque) {
    return ataque?.instanciaId ?? ataque?.id ?? null;
  }

  function encontrarAtaque(participante, identificadorAtaque) {
    return participante?.ataques?.find(
      (ataque) => obterIdentificadorAtaque(ataque) === identificadorAtaque,
    );
  }

  function obterCustoAtaque(participante, ataque) {
    const ataqueHabilitador = participante?.ataqueAdicionalLeve;
    const identificadorAtaque = obterIdentificadorAtaque(ataque);
    const ataqueEhLeve = ataque?.propriedades?.includes("leve") ?? false;

    const ehAtaqueAdicionalLeve =
      ataqueEhLeve && ataqueHabilitador && ataqueHabilitador.ataqueId !== identificadorAtaque;

    if (!ehAtaqueAdicionalLeve) {
      return ataque?.custoPadrao ?? "acao";
    }

    const operacaoNick = window.TradutorRegras.prepararOperacoes({
      gatilho: "aoPrepararAtaqueAdicionalArmaLeve",
      participante,
      ataque,
    }).find((operacao) => operacao.tipo === "alterarCustoAtaqueAdicional");

    return operacaoNick ? "nenhum" : "acaoBonus";
  }

  function prepararAtaque(combate, idAtacante, idAlvo, idAtaque, opcoes = {}) {
    const atacante = combate.participantes.find((participante) => participante.id === idAtacante);

    if (!atacante) {
      return {
        sucesso: false,
        motivo: "atacanteInexistente",
      };
    }

    if (!opcoes.ignorarTurno && combate.participanteAtivoId !== atacante.id) {
      return {
        sucesso: false,
        motivo: "foraDoTurno",
      };
    }

    const alvo = combate.participantes.find((participante) => participante.id === idAlvo);

    if (!alvo) {
      return {
        sucesso: false,
        motivo: "alvoInexistente",
      };
    }

    const ataque = encontrarAtaque(atacante, idAtaque);

    if (!ataque) {
      const resultadoCombate = verificarFimCombate(combate);

      return {
        sucesso: false,
        motivo: "ataqueInexistente",
      };
    }

    const custoAtaque = opcoes.custo ?? obterCustoAtaque(atacante, ataque);

    if (custoAtaque === "acao" && !atacante.acaoDisponivel) {
      return {
        sucesso: false,
        motivo: "acaoIndisponivel",
      };
    }

    if (custoAtaque === "acaoBonus" && !atacante.acaoBonusDisponivel) {
      return {
        sucesso: false,
        motivo: "acaoBonusIndisponivel",
      };
    }

    if (custoAtaque === "reacao" && !atacante.reacaoDisponivel) {
      return {
        sucesso: false,
        motivo: "reacaoIndisponivel",
      };
    }

    const resultadoSelecao = validarSelecaoAcao(atacante, alvo, ataque, combate);

    if (!resultadoSelecao.sucesso) {
      return resultadoSelecao;
    }

    const atacanteEstaCaido =
      atacante.condicoes?.some((condicao) => condicao.id === "caido") ?? false;

    const alvoEstaCaido = alvo.condicoes?.some((condicao) => condicao.id === "caido") ?? false;

    const ataqueProximoContraCaido = alvoEstaCaido && resultadoSelecao.distancia <= 1;

    const ataqueDistanteContraCaido = alvoEstaCaido && resultadoSelecao.distancia > 1;

    const ataqueEhPesado = ataque.propriedades?.includes("pesada") ?? false;

    const atributoExigidoPelaArmaPesada = ataque.categoria === "distancia" ? "destreza" : "forca";

    const valorAtributoArmaPesada =
      Number(atacante.atributos?.[atributoExigidoPelaArmaPesada]) || 0;

    const naoAtendeRequisitoArmaPesada = ataqueEhPesado && valorAtributoArmaPesada < 13;

    const possuiVantagemTemporaria =
      combate.efeitosTemporarios?.some(function verificarVantagem(efeito) {
        return (
          efeito.tipo === "vantagem" &&
          efeito.participanteId === atacante.id &&
          efeito.alvoId === alvo.id &&
          efeito.rolagemAfetada === "ataque" &&
          efeito.usosRestantes > 0
        );
      }) ?? false;

    const possuiDesvantagemTemporaria =
      combate.efeitosTemporarios?.some(function verificarDesvantagem(efeito) {
        return (
          efeito.tipo === "desvantagem" &&
          efeito.participanteId === atacante.id &&
          efeito.rolagemAfetada === "ataque" &&
          efeito.usosRestantes > 0
        );
      }) ?? false;

    const possuiVantagemBase = resultadoSelecao.tipoRolagem === "vantagem";

    const possuiDesvantagemBase = resultadoSelecao.tipoRolagem === "desvantagem";

    const tipoRolagem = resolverTipoRolagem({
      vantagem: possuiVantagemBase || possuiVantagemTemporaria || ataqueProximoContraCaido,

      desvantagem:
        possuiDesvantagemBase ||
        possuiDesvantagemTemporaria ||
        atacanteEstaCaido ||
        ataqueDistanteContraCaido ||
        naoAtendeRequisitoArmaPesada,
    });

    combate.ataquePendente = {
      atacanteId: atacante.id,
      alvoId: alvo.id,
      ataqueId: obterIdentificadorAtaque(ataque),
      custo: custoAtaque,
      tipoEspecial: opcoes.tipoEspecial ?? null,
      tipoRolagem: tipoRolagem,
      cobertura: resultadoSelecao.cobertura ?? null,
      bonusCobertura: Number(resultadoSelecao.bonusCobertura) || 0,
      vantagemTemporaria: possuiVantagemTemporaria,
      desvantagemTemporaria: possuiDesvantagemTemporaria,
    };

    return {
      sucesso: true,
      atacante,
      alvo,
      ataque,
      distancia: resultadoSelecao.distancia,
      tipoRolagem,
      custo: custoAtaque,
      cobertura: resultadoSelecao.cobertura ?? null,
      bonusCobertura: Number(resultadoSelecao.bonusCobertura) || 0,
    };
  }

  function resolverAtaque(combate, resultadoRolagem) {
    const ataquePendente = combate.ataquePendente;

    if (!ataquePendente) {
      return {
        sucesso: false,
        motivo: "nenhumAtaquePendente",
      };
    }

    const atacante = combate.participantes.find(
      (participante) => participante.id === ataquePendente.atacanteId,
    );

    const alvo = combate.participantes.find(
      (participante) => participante.id === ataquePendente.alvoId,
    );

    const ataque = encontrarAtaque(atacante, ataquePendente.ataqueId);

    if (!atacante || !alvo || !ataque) {
      combate.ataquePendente = null;

      return {
        sucesso: false,
        motivo: "dadosDoAtaqueInvalidos",
      };
    }

    const grupoD20 = resultadoRolagem.gruposRolados.find((grupo) => grupo.numeroDeFaces === 20);

    const tipoRolagem = ataquePendente.tipoRolagem ?? "normal";

    const resultadoNatural = grupoD20
      ? SistemaTestes.selecionarResultadoD20(grupoD20.resultados, tipoRolagem)
      : null;

    const total = SistemaTestes.calcularTotalTesteD20(resultadoRolagem, tipoRolagem);

    if (resultadoNatural === null) {
      return {
        sucesso: false,
        motivo: "d20NaoEncontrado",
      };
    }

    const acertoCritico = resultadoNatural === 20;

    const falhaAutomatica = resultadoNatural === 1;

    const bonusCobertura = Number(ataquePendente.bonusCobertura) || 0;

    const classeArmaduraEfetiva = alvo.classeArmadura + bonusCobertura;

    const acertou = !falhaAutomatica && (acertoCritico || total >= classeArmaduraEfetiva);

    if (ataquePendente.custo === "acaoBonus") {
      consumirAcaoBonus(atacante);
    } else if (ataquePendente.custo === "reacao") {
      consumirReacao(atacante);
    } else if (ataquePendente.custo !== "nenhum") {
      consumirAcao(atacante);
    }

    const identificadorAtaque = obterIdentificadorAtaque(ataque);
    const ataqueEhLeve = ataque.propriedades?.includes("leve") ?? false;

    if (ataquePendente.tipoEspecial === "cleave") {
      atacante.maestriasUsadasTurno ??= [];

      if (!atacante.maestriasUsadasTurno.includes("cleave")) {
        atacante.maestriasUsadasTurno.push("cleave");
      }
    } else if (ataquePendente.custo === "acao" && ataqueEhLeve) {
      atacante.ataqueAdicionalLeve = {
        ataqueId: identificadorAtaque,
      };
    } else if (
      (ataquePendente.custo === "acaoBonus" || ataquePendente.custo === "nenhum") &&
      atacante.ataqueAdicionalLeve
    ) {
      atacante.ataqueAdicionalLeve = null;
    }

    combate.ataquePendente = null;

    if (ataquePendente.vantagemTemporaria) {
      const efeito = combate.efeitosTemporarios?.find(function encontrarVantagem(efeito) {
        return (
          efeito.tipo === "vantagem" &&
          efeito.participanteId === atacante.id &&
          efeito.alvoId === alvo.id &&
          efeito.rolagemAfetada === "ataque" &&
          efeito.usosRestantes > 0
        );
      });

      if (efeito) {
        efeito.usosRestantes -= 1;
      }

      combate.efeitosTemporarios = (combate.efeitosTemporarios ?? []).filter(
        (efeito) => efeito.usosRestantes !== 0,
      );
    }

    if (ataquePendente.desvantagemTemporaria) {
      const efeito = combate.efeitosTemporarios?.find(function encontrarDesvantagem(efeito) {
        return (
          efeito.tipo === "desvantagem" &&
          efeito.participanteId === atacante.id &&
          efeito.rolagemAfetada === "ataque" &&
          efeito.usosRestantes > 0
        );
      });

      if (efeito) {
        efeito.usosRestantes -= 1;
      }

      combate.efeitosTemporarios = (combate.efeitosTemporarios ?? []).filter(
        (efeito) => efeito.usosRestantes !== 0,
      );
    }

    let efeitosAposErro = [];

    if (!acertou) {
      efeitosAposErro = window.TradutorRegras.prepararOperacoes({
        gatilho: "aposErrarAtaque",

        participante: atacante,

        ataque,

        alvo,
      });
    }

    if (acertou) {
      const operacoesAposAcerto = window.TradutorRegras.prepararOperacoes({
        gatilho: "aposAcertarAtaque",

        participante: atacante,

        ataque,

        alvo,
      });

      for (const operacao of operacoesAposAcerto) {
        if (operacao.tipo !== "concederDesvantagem") {
          continue;
        }

        aplicarDesvantagemTemporaria(combate, operacao);
      }
      const efeitosDano = window.TradutorRegras.prepararOperacoes({
        gatilho: "aoRolarDano",

        participante: atacante,

        ataque: ataque,

        alvo: alvo,
      });

      const efeitosOpcionaisAposAcerto = operacoesAposAcerto.filter(
        (operacao) =>
          operacao.tipo === "deslocarAlvo" ||
          operacao.tipo === "solicitarSalvaguarda" ||
          (operacao.tipo === "permitirAtaqueAdicional" &&
            !(atacante.maestriasUsadasTurno ?? []).includes("cleave")),
      );

      combate.danoPendente = {
        atacanteId: atacante.id,
        alvoId: alvo.id,
        ataqueId: identificadorAtaque,
        critico: acertoCritico,
        efeitos: [...efeitosDano, ...efeitosOpcionaisAposAcerto],
      };
    }

    return {
      sucesso: true,
      acertou,
      acertoCritico,
      resultadoNatural,
      total,
      tipoRolagem,
      classeArmadura: classeArmaduraEfetiva,
      classeArmaduraBase: alvo.classeArmadura,
      cobertura: ataquePendente.cobertura ?? null,
      bonusCobertura,
      atacante,
      alvo,
      ataque:
        ataquePendente.tipoEspecial === "cleave"
          ? (() => {
              const ataqueCleave = structuredClone(ataque);
              const modificadorAtributo = SistemaTestes.calcularModificadorAtributo(
                atacante.atributos?.[ataque.atributoId],
              );

              ataqueCleave.dano.modificador = Math.min(0, modificadorAtributo);

              return ataqueCleave;
            })()
          : ataque,
      efeitosAposErro,
    };
  }

  function listarAlvosCleave(combate, atacanteId, primeiroAlvoId, ataqueId) {
    const atacante = combate?.participantes?.find((participante) => participante.id === atacanteId);
    const primeiroAlvo = combate?.participantes?.find(
      (participante) => participante.id === primeiroAlvoId,
    );
    const ataque = encontrarAtaque(atacante, ataqueId);

    if (!atacante || !primeiroAlvo || !ataque) {
      return [];
    }

    return combate.participantes.filter((candidato) => {
      if (
        candidato.id === primeiroAlvo.id ||
        candidato.id === atacante.id ||
        candidato.estado === "derrotado" ||
        candidato.tipo === atacante.tipo
      ) {
        return false;
      }

      const proximoDoPrimeiroAlvo = calcularDistancia(primeiroAlvo.posicao, candidato.posicao) <= 1;

      return (
        proximoDoPrimeiroAlvo && validarSelecaoAcao(atacante, candidato, ataque, combate).sucesso
      );
    });
  }

  function prepararAtaqueCleave(combate, atacanteId, primeiroAlvoId, novoAlvoId, ataqueId) {
    const atacante = combate?.participantes?.find((participante) => participante.id === atacanteId);

    if ((atacante?.maestriasUsadasTurno ?? []).includes("cleave")) {
      return {
        sucesso: false,
        motivo: "cleaveJaUtilizado",
      };
    }

    const alvoValido = listarAlvosCleave(combate, atacanteId, primeiroAlvoId, ataqueId).some(
      (alvo) => alvo.id === novoAlvoId,
    );

    if (!alvoValido) {
      return {
        sucesso: false,
        motivo: "alvoCleaveInvalido",
      };
    }

    return prepararAtaque(combate, atacanteId, novoAlvoId, ataqueId, {
      custo: "nenhum",
      tipoEspecial: "cleave",
    });
  }

  function removerParticipanteDaOrdem(combate, idParticipante) {
    const participanteAtivoId = combate.participanteAtivoId;

    combate.ordemTurnos = combate.ordemTurnos.filter((id) => id !== idParticipante);

    const novoIndiceAtivo = combate.ordemTurnos.indexOf(participanteAtivoId);

    combate.indiceTurno = novoIndiceAtivo >= 0 ? novoIndiceAtivo : 0;
  }

  function verificarFimCombate(combate) {
    const jogadoresAtivos = combate.participantes.filter(
      (participante) => participante.tipo === "jogador" && participante.estado !== "derrotado",
    );

    if (jogadoresAtivos.length === 0) {
      combate.status = "derrota";
      combate.resultadoId = "derrota";

      combate.participanteAtivoId = null;

      return "derrota";
    }

    return verificarObjetivosCombate(combate);
  }

  const avaliadoresObjetivos = Object.create(null);

  function obterParticipanteObjetivo(combate, participanteId) {
    if (participanteId === "jogador") {
      return combate.participantes.find((participante) => participante.tipo === "jogador") ?? null;
    }

    return combate.participantes.find((participante) => participante.id === participanteId) ?? null;
  }

  function participanteEstaNaArea(combate, participante, areaId) {
    const area = combate.areas?.[areaId];

    if (!participante || !area) {
      return false;
    }

    const colunaInicial = Number(area.colunaInicial);
    const colunaFinal = Number(area.colunaFinal ?? area.colunaInicial);
    const linhaInicial = Number(area.linhaInicial);
    const linhaFinal = Number(area.linhaFinal ?? area.linhaInicial);

    if (
      !Number.isFinite(colunaInicial) ||
      !Number.isFinite(colunaFinal) ||
      !Number.isFinite(linhaInicial) ||
      !Number.isFinite(linhaFinal)
    ) {
      return false;
    }

    return (
      participante.posicao.coluna >= Math.min(colunaInicial, colunaFinal) &&
      participante.posicao.coluna <= Math.max(colunaInicial, colunaFinal) &&
      participante.posicao.linha >= Math.min(linhaInicial, linhaFinal) &&
      participante.posicao.linha <= Math.max(linhaInicial, linhaFinal)
    );
  }

  avaliadoresObjetivos.inimigosDerrotados = function inimigosDerrotados(combate, condicao) {
    const inimigos = combate.participantes.filter(
      (participante) =>
        participante.tipo === "inimigo" &&
        (!condicao.grupoId ||
          condicao.grupoId === "todos" ||
          participante.grupoId === condicao.grupoId),
    );

    return (
      inimigos.length > 0 && inimigos.every((participante) => participante.estado === "derrotado")
    );
  };

  avaliadoresObjetivos.participanteDerrotado = function participanteDerrotado(combate, condicao) {
    return obterParticipanteObjetivo(combate, condicao.participanteId)?.estado === "derrotado";
  };

  avaliadoresObjetivos.participanteAtivo = function participanteAtivo(combate, condicao) {
    const participante = obterParticipanteObjetivo(combate, condicao.participanteId);
    return Boolean(participante && participante.estado !== "derrotado");
  };

  avaliadoresObjetivos.participanteNaArea = function participanteNaArea(combate, condicao) {
    return participanteEstaNaArea(
      combate,
      obterParticipanteObjetivo(combate, condicao.participanteId),
      condicao.areaId,
    );
  };

  avaliadoresObjetivos.participanteComCondicao = function participanteComCondicao(
    combate,
    condicao,
  ) {
    const participante = obterParticipanteObjetivo(combate, condicao.participanteId);
    return Boolean(participante?.condicoes?.some((item) => item.id === condicao.condicaoId));
  };

  avaliadoresObjetivos.rodadaAlcancada = function rodadaAlcancada(combate, condicao) {
    return combate.rodada >= Number(condicao.rodada);
  };

  avaliadoresObjetivos.marcador = function marcador(combate, condicao) {
    const valorEsperado = condicao.valor ?? true;
    return combate.marcadores?.[condicao.marcadorId] === valorEsperado;
  };

  function registrarAvaliadorObjetivo(tipo, avaliador) {
    if (typeof tipo !== "string" || typeof avaliador !== "function") {
      return false;
    }

    avaliadoresObjetivos[tipo] = avaliador;
    return true;
  }

  function avaliarCondicaoObjetivo(combate, condicao) {
    if (!condicao || typeof condicao !== "object") {
      return false;
    }

    if (Array.isArray(condicao.todas)) {
      return condicao.todas.every((item) => avaliarCondicaoObjetivo(combate, item));
    }

    if (Array.isArray(condicao.qualquer)) {
      return condicao.qualquer.some((item) => avaliarCondicaoObjetivo(combate, item));
    }

    if (condicao.nao) {
      return !avaliarCondicaoObjetivo(combate, condicao.nao);
    }

    const avaliador = avaliadoresObjetivos[condicao.tipo];
    return avaliador ? Boolean(avaliador(combate, condicao)) : false;
  }

  function concluirCombatePorObjetivo(combate, objetivo) {
    const categoria = objetivo.categoria ?? "sucesso";

    combate.status = categoria === "derrota" ? "derrota" : "vitoria";
    combate.resultadoId = objetivo.resultadoId ?? combate.status;
    combate.objetivoConcluidoId = objetivo.id;
    combate.participanteAtivoId = null;

    return combate.resultadoId;
  }

  function verificarObjetivosCombate(combate) {
    if (!combate || combate.status !== "ativo") {
      return combate?.resultadoId ?? null;
    }

    for (const objetivo of combate.objetivos ?? []) {
      const concluido = avaliarCondicaoObjetivo(combate, objetivo.condicao);

      if (objetivo.tipo === "secundario") {
        objetivo.estado = concluido ? "concluido" : "pendente";
        continue;
      }

      if (concluido) {
        objetivo.estado = "concluido";
        return concluirCombatePorObjetivo(combate, objetivo);
      }
    }

    return null;
  }

  function definirMarcadorCombate(combate, marcadorId, valor = true) {
    if (!combate || typeof marcadorId !== "string") {
      return null;
    }

    combate.marcadores[marcadorId] = valor;
    return verificarObjetivosCombate(combate);
  }

  function validarConfiguracaoObjetivos(configuracao = {}) {
    const erros = [];
    const objetivos = configuracao.objetivos;
    const areas = configuracao.areas ?? {};

    if (objetivos !== undefined && !Array.isArray(objetivos)) {
      erros.push("`objetivos` deve ser uma lista.");
      return erros;
    }

    const ids = new Set();

    function validarCondicao(condicao, caminho) {
      if (!condicao || typeof condicao !== "object") {
        erros.push(`${caminho} precisa declarar uma condição válida.`);
        return;
      }

      for (const operador of ["todas", "qualquer"]) {
        if (condicao[operador] !== undefined) {
          if (!Array.isArray(condicao[operador]) || condicao[operador].length === 0) {
            erros.push(`${caminho}.${operador} deve ser uma lista não vazia.`);
          } else {
            condicao[operador].forEach((item, indice) =>
              validarCondicao(item, `${caminho}.${operador}[${indice}]`),
            );
          }
          return;
        }
      }

      if (condicao.nao !== undefined) {
        validarCondicao(condicao.nao, `${caminho}.nao`);
        return;
      }

      if (!avaliadoresObjetivos[condicao.tipo]) {
        erros.push(`${caminho} usa o tipo desconhecido "${condicao.tipo}".`);
      }

      if (condicao.tipo === "participanteNaArea" && !areas[condicao.areaId]) {
        erros.push(`${caminho} aponta para a área inexistente "${condicao.areaId}".`);
      }
    }

    for (const [indice, objetivo] of (objetivos ?? []).entries()) {
      const caminho = `objetivos[${indice}]`;

      if (!objetivo?.id || ids.has(objetivo.id)) {
        erros.push(`${caminho} precisa ter um id único.`);
      } else {
        ids.add(objetivo.id);
      }

      if (objetivo.tipo !== "secundario" && !objetivo.resultadoId) {
        erros.push(`${caminho} precisa declarar resultadoId.`);
      }

      if (objetivo.categoria && !["sucesso", "derrota"].includes(objetivo.categoria)) {
        erros.push(`${caminho} possui categoria inválida.`);
      }

      validarCondicao(objetivo.condicao, `${caminho}.condicao`);
    }

    return erros;
  }

  function escolherAtaqueInimigo(combate, inimigo, alvo) {
    let ataqueComDesvantagem = null;

    for (const ataque of inimigo.ataques) {
      const resultadoSelecao = validarSelecaoAcao(inimigo, alvo, ataque, combate);

      if (!resultadoSelecao.sucesso) {
        continue;
      }

      if (resultadoSelecao.tipoRolagem === "normal") {
        return ataque;
      }

      ataqueComDesvantagem = ataque;
    }

    return ataqueComDesvantagem;
  }

  function moverInimigoEmDirecaoAoAlvo(combate, inimigo, alvo) {
    let celulasPercorridas = 0;

    const caminho = [];

    while (inimigo.movimentoRestante > 0) {
      const ataqueDisponivel = escolherAtaqueInimigo(combate, inimigo, alvo);

      if (ataqueDisponivel) {
        break;
      }

      const direcaoColuna = Math.sign(alvo.posicao.coluna - inimigo.posicao.coluna);

      const direcaoLinha = Math.sign(alvo.posicao.linha - inimigo.posicao.linha);

      const destinosPossiveis = [
        {
          coluna: inimigo.posicao.coluna + direcaoColuna,

          linha: inimigo.posicao.linha + direcaoLinha,
        },

        {
          coluna: inimigo.posicao.coluna + direcaoColuna,

          linha: inimigo.posicao.linha,
        },

        {
          coluna: inimigo.posicao.coluna,

          linha: inimigo.posicao.linha + direcaoLinha,
        },
      ];

      let conseguiuMover = false;

      for (const destino of destinosPossiveis) {
        const resultadoMovimento = movimentarParticipante(
          combate,
          inimigo.id,
          destino.coluna,
          destino.linha,
        );

        if (resultadoMovimento.reacaoPendente) {
          return {
            sucesso: false,

            motivo: "reacaoJogadorPendente",

            turnoPausado: true,

            reacaoPendente: true,

            decisao: resultadoMovimento.decisao,

            celulasPercorridas,

            caminho,

            destinoPendente: structuredClone(destino),
          };
        }

        if (resultadoMovimento.sucesso) {
          celulasPercorridas++;

          caminho.push({
            coluna: destino.coluna,

            linha: destino.linha,
          });
          conseguiuMover = true;

          break;
        }
      }

      if (!conseguiuMover) {
        break;
      }
    }

    return {
      sucesso: celulasPercorridas > 0,

      celulasPercorridas,
      caminho,
    };
  }

  function executarTurnoInimigo(combate) {
    const inimigo = combate.participantes.find(
      (participante) => participante.id === combate.participanteAtivoId,
    );

    if (!inimigo || inimigo.tipo !== "inimigo" || inimigo.estado === "derrotado") {
      return {
        sucesso: false,
        motivo: "inimigoInvalido",
      };
    }

    const alvo = combate.participantes.find(
      (participante) => participante.tipo === "jogador" && participante.estado !== "derrotado",
    );

    if (!alvo) {
      return {
        sucesso: false,
        motivo: "nenhumAlvoDisponivel",
      };
    }

    let ataque = escolherAtaqueInimigo(combate, inimigo, alvo);

    let resultadoMovimento = null;

    if (!ataque) {
      resultadoMovimento = moverInimigoEmDirecaoAoAlvo(combate, inimigo, alvo);

      if (resultadoMovimento?.turnoPausado) {
        return {
          sucesso: true,

          turnoPausado: true,

          reacaoPendente: true,

          inimigo,
          alvo,

          resultadoMovimento,

          decisao: resultadoMovimento.decisao,
        };
      }

      ataque = escolherAtaqueInimigo(combate, inimigo, alvo);
    }

    if (!ataque) {
      return {
        sucesso: false,
        motivo: "nenhumAtaqueNoAlcance",
        inimigo,
        alvo,
        resultadoMovimento,
      };
    }

    const ataquePreparado = prepararAtaque(
      combate,
      inimigo.id,
      alvo.id,
      obterIdentificadorAtaque(ataque),
    );

    if (!ataquePreparado.sucesso) {
      return ataquePreparado;
    }

    const quantidadeD20 = ataquePreparado.tipoRolagem === "normal" ? 1 : 2;

    const resultadoRolagemAtaque = realizarRolagemComposta({
      gruposDeDados: [
        {
          quantidade: quantidadeD20,
          numeroDeFaces: 20,
        },
      ],

      modificador: ataque.bonusAtaque,
    });

    const resultadoAtaque = resolverAtaque(combate, resultadoRolagemAtaque);

    let resultadoDano = null;

    if (resultadoAtaque.acertou) {
      const gruposDano = structuredClone(ataque.dano.gruposDeDados);

      if (resultadoAtaque.acertoCritico) {
        for (const grupo of gruposDano) {
          grupo.quantidade *= 2;
        }
      }

      const resultadoRolagemDano = realizarRolagemComposta({
        gruposDeDados: gruposDano,

        modificador: ataque.dano.modificador,
      });

      resultadoDano = resolverDano(combate, resultadoRolagemDano);
    }

    const resultadoCombate = verificarFimCombate(combate);

    return {
      sucesso: true,
      inimigo,
      alvo,
      ataque,
      resultadoMovimento,
      resultadoAtaque,
      resultadoDano,
      resultadoCombate,
    };
  }

  function aplicarCondicaoCombate(participante, condicaoId, dados = {}) {
    if (!participante || !condicaoId) {
      return {
        sucesso: false,
        motivo: "dadosInvalidos",
      };
    }

    participante.condicoes ??= [];

    const condicaoExistente = participante.condicoes.find((condicao) => condicao.id === condicaoId);

    if (condicaoExistente) {
      return {
        sucesso: true,
        aplicada: false,
        motivo: "condicaoJaExistente",
        condicao: condicaoExistente,
      };
    }

    const condicao = {
      id: condicaoId,

      origem: structuredClone(dados.origem ?? null),

      aplicadoPorId: dados.aplicadoPorId ?? null,

      rodadaAplicacao: dados.rodadaAplicacao ?? null,
    };

    participante.condicoes.push(condicao);

    return {
      sucesso: true,
      aplicada: true,
      condicao,
    };
  }

  function resolverSalvaguardaCombate(combate, operacao, resultadoRolagem = null) {
    if (!combate || operacao?.tipo !== "solicitarSalvaguarda") {
      return {
        sucesso: false,
        motivo: "operacaoInvalida",
      };
    }

    const alvo = combate.participantes.find((participante) => participante.id === operacao.alvoId);

    if (!alvo) {
      return {
        sucesso: false,
        motivo: "alvoInexistente",
      };
    }

    const origem = combate.participantes.find(
      (participante) => participante.id === operacao.participanteId,
    );

    const salvaguardaDeDestreza = operacao.atributoId === "destreza";

    const exigeLinhaVisao = operacao.exigeLinhaVisao !== false;

    const resultadoCobertura = origem
      ? verificarLinhaVisao(combate, origem.posicao, alvo.posicao)
      : null;

    const cobertura = resultadoCobertura?.cobertura ?? null;

    const bonusCobertura = salvaguardaDeDestreza ? (resultadoCobertura?.bonusCobertura ?? 0) : 0;

    if (exigeLinhaVisao && resultadoCobertura?.sucesso && !resultadoCobertura.linhaLivre) {
      return {
        sucesso: false,
        motivo: "semLinhaDeVisao",
        alvo,
        cobertura,
        resultadoCobertura,
      };
    }

    const bonusSalvaguardaBase = window.SistemaTestes.calcularBonusSalvaguarda(
      alvo,
      operacao.atributoId,
    );

    const bonusSalvaguarda = bonusSalvaguardaBase + bonusCobertura;

    const rolagemBase =
  resultadoRolagem ??
  realizarRolagemComposta({
    gruposDeDados: [
      {
        quantidade: 1,
        numeroDeFaces: 20,
      },
    ],

    modificador: bonusSalvaguarda,
  });

const rolagem =
  resultadoRolagem && bonusCobertura > 0
    ? {
        ...rolagemBase,

        modificador:
          (Number(rolagemBase.modificador) || 0) +
          bonusCobertura,

        total:
          (Number(rolagemBase.total) || 0) +
          bonusCobertura,
      }
    : rolagemBase;

    const resultadoTeste = window.SistemaTestes.resolverTesteContraCd(
      rolagem,
      operacao.dificuldade,
    );

    let resultadoCondicao = null;

    const efeitoDoResultado = resultadoTeste.sucesso
      ? operacao.resultados?.sucesso
      : operacao.resultados?.fracasso;

    if (efeitoDoResultado?.tipo === "aplicarCondicao") {
      resultadoCondicao = aplicarCondicaoCombate(alvo, efeitoDoResultado.condicaoId, {
        origem: operacao.origem,

        aplicadoPorId: operacao.participanteId,

        rodadaAplicacao: combate.rodada,
      });
    }

    return {
      sucesso: true,

      alvo,

      atributoId: operacao.atributoId,

      cobertura,

      bonusCobertura,

      dificuldade: operacao.dificuldade,

      bonusSalvaguardaBase,

      bonusSalvaguarda,

      rolagem,

      resultadoTeste,

      passou: resultadoTeste.sucesso,

      resultadoCondicao,

      resultadoCombate: verificarObjetivosCombate(combate),
    };
  }

  function aplicarDeslocamentoForcado(combate, operacao) {
    if (!combate || operacao?.tipo !== "deslocarAlvo") {
      return {
        sucesso: false,
        motivo: "operacaoInvalida",
      };
    }

    const atacante = combate.participantes.find(
      (participante) => participante.id === operacao.participanteId,
    );

    const alvo = combate.participantes.find((participante) => participante.id === operacao.alvoId);

    if (!atacante || !alvo) {
      return {
        sucesso: false,
        motivo: "participanteInexistente",
      };
    }

    const direcaoColuna = Math.sign(alvo.posicao.coluna - atacante.posicao.coluna);

    const direcaoLinha = Math.sign(alvo.posicao.linha - atacante.posicao.linha);

    if (direcaoColuna === 0 && direcaoLinha === 0) {
      return {
        sucesso: false,
        motivo: "participantesNaMesmaCelula",
      };
    }

    const distanciaMaxima = Math.max(0, Number(operacao.distanciaCelulas) || 0);

    let distanciaPercorrida = 0;

    for (let passo = 1; passo <= distanciaMaxima; passo++) {
      const proximaColuna = alvo.posicao.coluna + direcaoColuna;

      const proximaLinha = alvo.posicao.linha + direcaoLinha;

      const foraDoTabuleiro =
        proximaColuna < 1 ||
        proximaColuna > combate.tabuleiro.colunas ||
        proximaLinha < 1 ||
        proximaLinha > combate.tabuleiro.linhas;

      if (foraDoTabuleiro) {
        break;
      }

      const terrenoBloqueado =
        obterTipoTerreno(combate, proximaColuna, proximaLinha) === "bloqueado";

      const diagonalBloqueada = movimentoDiagonalCruzaCantoBloqueado(combate, alvo.posicao, {
        coluna: proximaColuna,
        linha: proximaLinha,
      });

      if (terrenoBloqueado || diagonalBloqueada) {
        break;
      }

      const celulaOcupada = combate.participantes.some(
        (participante) =>
          participante.id !== alvo.id &&
          participante.estado !== "derrotado" &&
          participante.posicao.coluna === proximaColuna &&
          participante.posicao.linha === proximaLinha,
      );

      if (celulaOcupada) {
        break;
      }

      alvo.posicao.coluna = proximaColuna;

      alvo.posicao.linha = proximaLinha;

      distanciaPercorrida++;
    }

    const resultadoCombate = verificarObjetivosCombate(combate);

    return {
      sucesso: true,

      aplicado: distanciaPercorrida > 0,

      distanciaPercorrida,

      alvo,

      posicaoFinal: structuredClone(alvo.posicao),

      resultadoCombate,
    };
  }

  function aplicarDesvantagemTemporaria(combate, operacao) {
    if (!combate || operacao?.tipo !== "concederDesvantagem") {
      return {
        sucesso: false,
        motivo: "operacaoInvalida",
      };
    }

    combate.efeitosTemporarios ??= [];

    const efeitoTemporario = {
      tipo: "desvantagem",

      participanteId: operacao.participanteId,

      origemParticipanteId: operacao.origemParticipanteId,

      rolagemAfetada: operacao.rolagemAfetada,

      usosRestantes: operacao.quantidadeDeUsos ?? 1,

      expiracao: operacao.expiracao ?? null,

      origem: structuredClone(operacao.origem ?? null),
    };

    combate.efeitosTemporarios.push(efeitoTemporario);

    return {
      sucesso: true,
      efeito: efeitoTemporario,
    };
  }

  function aplicarModificadorDeslocamentoTemporario(combate, operacao) {
    if (!combate || operacao?.tipo !== "modificarDeslocamento") {
      return {
        sucesso: false,
        motivo: "operacaoInvalida",
      };
    }

    const participante = combate.participantes.find(
      (participante) => participante.id === operacao.participanteId,
    );

    if (!participante) {
      return {
        sucesso: false,
        motivo: "participanteInexistente",
      };
    }

    combate.efeitosTemporarios ??= [];

    const chaveAcumulacao = operacao.acumulacao?.chave ?? null;

    const efeitoExistente = combate.efeitosTemporarios.find(
      (efeito) =>
        efeito.tipo === "modificadorDeslocamento" &&
        efeito.participanteId === participante.id &&
        chaveAcumulacao !== null &&
        efeito.chaveAcumulacao === chaveAcumulacao,
    );

    if (efeitoExistente) {
      return {
        sucesso: true,
        efeito: efeitoExistente,
        aplicado: false,
        motivo: "efeitoNaoAcumula",
      };
    }

    const valorCelulas = Number(operacao.valorCelulas) || 0;

    const efeitoTemporario = {
      tipo: "modificadorDeslocamento",

      participanteId: participante.id,

      origemParticipanteId: operacao.origemParticipanteId,

      valorCelulas,

      chaveAcumulacao,

      limiteTotalCelulas: operacao.acumulacao?.limiteTotalCelulas ?? null,

      expiracao: operacao.expiracao ?? null,

      origem: structuredClone(operacao.origem ?? null),
    };

    combate.efeitosTemporarios.push(efeitoTemporario);

    participante.movimentoRestante = Math.max(0, participante.movimentoRestante + valorCelulas);

    return {
      sucesso: true,
      efeito: efeitoTemporario,
      aplicado: true,
    };
  }

  function aplicarVantagemTemporaria(combate, operacao) {
    if (!combate || !operacao) {
      return {
        sucesso: false,
        motivo: "dadosInvalidos",
      };
    }

    combate.efeitosTemporarios ??= [];

    const efeitoTemporario = {
      tipo: "vantagem",

      participanteId: operacao.participanteId,

      alvoId: operacao.alvoId,

      rolagemAfetada: operacao.rolagemAfetada,

      usosRestantes: operacao.quantidadeDeUsos ?? 1,

      expiracao: operacao.expiracao ?? null,

      turnoCriacao: combate.rodada,

      turnoExpiracao:
        operacao.expiracao === "fimDoProximoTurno" ||
        operacao.expiracao === "fimDoProximoTurnoDoAtacante"
          ? combate.rodada + 1
          : null,
    };

    combate.efeitosTemporarios.push(efeitoTemporario);

    return {
      sucesso: true,
      efeito: efeitoTemporario,
    };
  }

  function aplicarDanoSemAcerto(combate, operacao) {
    if (!combate || operacao?.tipo !== "causarDanoSemAcerto") {
      return {
        sucesso: false,
        motivo: "operacaoInvalida",
      };
    }

    const atacante = combate.participantes.find(
      (participante) => participante.id === operacao.participanteId,
    );

    const alvo = combate.participantes.find((participante) => participante.id === operacao.alvoId);

    const ataque = encontrarAtaque(atacante, operacao.ataqueId);

    if (!atacante || !alvo || !ataque) {
      return {
        sucesso: false,
        motivo: "participantesOuAtaqueInexistentes",
      };
    }

    combate.danoPendente = {
      atacanteId: atacante.id,
      alvoId: alvo.id,
      ataqueId: obterIdentificadorAtaque(ataque),
      critico: false,
      efeitos: [],
    };

    return resolverDano(combate, {
      total: Math.max(0, Number(operacao.quantidade) || 0),
    });
  }

  function resolverDano(combate, resultadoRolagem) {
    const danoPendente = combate.danoPendente;

    const efeitosAplicados = [];

    const efeitosDisponiveis = [];

    if (!danoPendente) {
      return {
        sucesso: false,
        motivo: "nenhumDanoPendente",
      };
    }

    for (const efeito of danoPendente.efeitos ?? []) {
      if (
        efeito.tipo === "deslocarAlvo" ||
        efeito.tipo === "solicitarSalvaguarda" ||
        efeito.tipo === "permitirAtaqueAdicional"
      ) {
        efeitosDisponiveis.push(structuredClone(efeito));
      }
    }

    const alvo = combate.participantes.find(
      (participante) => participante.id === danoPendente.alvoId,
    );

    if (!alvo) {
      combate.danoPendente = null;

      return {
        sucesso: false,
        motivo: "alvoInexistente",
      };
    }

    const atacante = combate.participantes.find(
      (participante) => participante.id === danoPendente.atacanteId,
    );

    const ataque = encontrarAtaque(atacante, danoPendente.ataqueId);

    const danoOriginal = Math.max(0, resultadoRolagem.total);

    const tipoDano = ataque?.dano?.tipo ?? ataque?.dano?.tipoDano ?? ataque?.tipoDano ?? null;

    const operacoesDefensivas =
      window.TradutorRegras?.prepararOperacoes({
        gatilho: "passivo",

        participante: alvo,
      }) ?? [];

    const possuiResistencia = operacoesDefensivas.some(function verificarResistencia(operacao) {
      return operacao.tipo === "concederResistenciaDano" && operacao.tipoDano === tipoDano;
    });

    const dano = possuiResistencia ? Math.floor(danoOriginal / 2) : danoOriginal;

    alvo.pontosDeVida.atuais = Math.max(0, alvo.pontosDeVida.atuais - dano);

    if (dano > 0 && atacante && ataque) {
      const operacoesAposDano = window.TradutorRegras.prepararOperacoes({
        gatilho: "aposCausarDano",

        participante: atacante,

        ataque: ataque,

        alvo: alvo,
      });

      for (const operacao of operacoesAposDano) {
        if (operacao.tipo === "concederVantagem") {
          const resultadoEfeito = aplicarVantagemTemporaria(combate, operacao);

          if (resultadoEfeito.sucesso) {
            efeitosAplicados.push({
              origem: structuredClone(operacao.origem),

              tipo: operacao.tipo,

              participanteId: operacao.participanteId,

              alvoId: operacao.alvoId,
            });
          }

          continue;
        }

        if (operacao.tipo === "modificarDeslocamento") {
          efeitosDisponiveis.push(structuredClone(operacao));
        }
      }
    }

    const foiDerrotado = alvo.pontosDeVida.atuais === 0;

    let resultadoCombate = null;

    if (foiDerrotado) {
      alvo.estado = "derrotado";

      removerParticipanteDaOrdem(combate, alvo.id);

      resultadoCombate = verificarFimCombate(combate);
    }

    combate.danoPendente = null;

    return {
      sucesso: true,

      danoOriginal,
      dano,
      tipoDano,
      resistenciaAplicada: possuiResistencia,

      alvo,
      foiDerrotado,
      resultadoCombate,
      pontosDeVidaRestantes: alvo.pontosDeVida.atuais,

      efeitosAplicados,
      efeitosDisponiveis,
    };
  }

  function executarAtaqueOportunidade(combate, oportunidade) {
    if (!combate || !oportunidade) {
      return {
        sucesso: false,
        motivo: "oportunidadeInvalida",
      };
    }

    const ameacador = combate.participantes.find(
      (participante) => participante.id === oportunidade.ameacadorId,
    );

    const alvo = combate.participantes.find(
      (participante) => participante.id === oportunidade.alvoId,
    );

    if (!ameacador || !alvo) {
      return {
        sucesso: false,
        motivo: "participanteInexistente",
      };
    }

    if (ameacador.estado === "derrotado" || alvo.estado === "derrotado") {
      return {
        sucesso: false,
        motivo: "participanteDerrotado",
      };
    }

    if (!ameacador.reacaoDisponivel) {
      return {
        sucesso: false,
        motivo: "reacaoIndisponivel",
      };
    }

    const ataquePreparado = prepararAtaque(
      combate,
      ameacador.id,
      alvo.id,
      obterIdentificadorAtaque(oportunidade.ataque),
      {
        custo: "reacao",
        tipoEspecial: "ataqueOportunidade",
        ignorarTurno: true,
      },
    );

    if (!ataquePreparado.sucesso) {
      return ataquePreparado;
    }

    const quantidadeD20 = ataquePreparado.tipoRolagem === "normal" ? 1 : 2;

    const rolagemAtaque = realizarRolagemComposta({
      gruposDeDados: [
        {
          quantidade: quantidadeD20,
          numeroDeFaces: 20,
        },
      ],

      modificador: oportunidade.ataque.bonusAtaque,
    });

    const resultadoAtaque = resolverAtaque(combate, rolagemAtaque);

    if (!resultadoAtaque.sucesso) {
      return resultadoAtaque;
    }

    let resultadoDano = null;

    if (resultadoAtaque.acertou) {
      const gruposDano = structuredClone(oportunidade.ataque.dano.gruposDeDados);

      if (resultadoAtaque.acertoCritico) {
        for (const grupo of gruposDano) {
          grupo.quantidade *= 2;
        }
      }

      const rolagemDano = realizarRolagemComposta({
        gruposDeDados: gruposDano,

        modificador: oportunidade.ataque.dano.modificador,
      });

      resultadoDano = resolverDano(combate, rolagemDano);
    }

    const resultadoCombate = verificarFimCombate(combate);

    return {
      sucesso: true,

      ameacador,
      alvo,

      ataque: oportunidade.ataque,

      resultadoAtaque,
      resultadoDano,
      resultadoCombate,
    };
  }

  function aplicarCura(participante, quantidade) {
    if (!participante?.pontosDeVida) {
      return {
        sucesso: false,
        motivo: "pontosDeVidaInexistentes",
      };
    }

    const pontosAtuais = Number(participante.pontosDeVida.atuais) || 0;

    const pontosMaximos = Number(participante.pontosDeVida.maximo) || 0;

    const curaSolicitada = Math.max(0, Number(quantidade) || 0);

    const novosPontos = Math.min(pontosMaximos, pontosAtuais + curaSolicitada);

    participante.pontosDeVida.atuais = novosPontos;

    return {
      sucesso: true,
      motivo: null,
      participante: participante,
      curaSolicitada: curaSolicitada,
      curaAplicada: novosPontos - pontosAtuais,
      pontosDeVidaAtuais: novosPontos,
      pontosDeVidaMaximos: pontosMaximos,
    };
  }

  function iniciarTurnoAtual(combate) {
    const idParticipante = combate.ordemTurnos[combate.indiceTurno];

    const participante = combate.participantes.find(
      (participante) => participante.id === idParticipante,
    );

    if (!participante) {
      combate.participanteAtivoId = null;
      combate.alvoSelecionadoId = null;

      return null;
    }

    atualizarExpiracaoEfeitosTemporarios(combate, participante, "inicioTurno");

    window.TradutorRegras.recarregarRegras(participante, "turno");

    combate.participanteAtivoId = participante.id;
    const modificadorDeslocamento = (combate.efeitosTemporarios ?? [])
      .filter(
        (efeito) =>
          efeito.tipo === "modificadorDeslocamento" && efeito.participanteId === participante.id,
      )
      .reduce(
        (total, efeito) => total + (Number(efeito.valorCelulas) || 0),

        0,
      );

    participante.movimentoRestante = Math.max(
      0,
      participante.movimentoMaximo + modificadorDeslocamento,
    );

    const indiceCondicaoCaido =
      participante.condicoes?.findIndex((condicao) => condicao.id === "caido") ?? -1;

    if (indiceCondicaoCaido >= 0) {
      const custoParaLevantar = Math.ceil(participante.movimentoMaximo / 2);

      participante.movimentoRestante = Math.max(
        0,
        participante.movimentoRestante - custoParaLevantar,
      );

      participante.condicoes.splice(indiceCondicaoCaido, 1);
    }
    participante.acaoDisponivel = true;
    participante.acaoBonusDisponivel = true;
    participante.reacaoDisponivel = true;
    participante.desengajando = false;
    participante.ataqueAdicionalLeve = null;
    participante.maestriasUsadasTurno = [];

    return participante;
  }

  function encerrarTurno(combate) {
    if (combate.ordemTurnos.length === 0) {
      console.warn("A ordem dos turnos ainda não foi definida.");

      return null;
    }

    const participanteAtual = combate.participantes.find(
      (participante) => participante.id === combate.participanteAtivoId,
    );

    if (participanteAtual) {
      atualizarExpiracaoEfeitosTemporarios(combate, participanteAtual, "fimTurno");

      participanteAtual.desengajando = false;
    }

    combate.indiceTurno++;

    if (combate.indiceTurno >= combate.ordemTurnos.length) {
      combate.indiceTurno = 0;

      combate.rodada++;
    }

    return iniciarTurnoAtual(combate);
  }

  function ordenarTurnos(combate) {
    const possuiIniciativaPendente = combate.participantes.some(
      (participante) => participante.iniciativa === null,
    );

    if (possuiIniciativaPendente) {
      console.warn("Ainda existem iniciativas pendentes.");

      return false;
    }

    combate.fase = "combate";

    const participantesOrdenados = [...combate.participantes].sort(
      function (participanteA, participanteB) {
        const diferencaIniciativa = participanteB.iniciativa - participanteA.iniciativa;

        if (diferencaIniciativa !== 0) {
          return diferencaIniciativa;
        }

        return participanteB.bonusIniciativa - participanteA.bonusIniciativa;
      },
    );

    combate.ordemTurnos = participantesOrdenados.map((participante) => participante.id);

    combate.indiceTurno = 0;

    iniciarTurnoAtual(combate);

    return combate.ordemTurnos;
  }

  function atualizarExpiracaoEfeitosTemporarios(combate, participante, momento) {
    const efeitos = combate.efeitosTemporarios ?? [];

    combate.efeitosTemporarios = efeitos.filter(function manterEfeito(efeito) {
      const expiraNoFimDoProximoTurno =
        efeito.expiracao === "fimDoProximoTurno" ||
        efeito.expiracao === "fimDoProximoTurnoDoAtacante";

      const expiraNoInicioDoTurno = efeito.expiracao === "inicioDoProximoTurnoDoAtacante";

      if (expiraNoInicioDoTurno) {
        if (momento !== "inicioTurno" || efeito.origemParticipanteId !== participante.id) {
          return true;
        }

        return false;
      }

      if (!expiraNoFimDoProximoTurno) {
        return true;
      }
      if (efeito.participanteId !== participante.id) {
        return true;
      }

      if (momento !== "fimTurno") {
        return true;
      }

      if (efeito.turnoExpiracao === undefined) {
        return true;
      }

      return combate.rodada < efeito.turnoExpiracao;
    });
  }

  return {
    criarParticipanteCombate,
    criarEstadoCombate,
    iniciarCombate,
    registrarIniciativa,
    rolarIniciativasInimigos,
    calcularDistancia,

    participantesSaoHostis,
    obterAlcanceAmeaca,
    listarAmeacadoresDaPosicao,
    listarSaidasDeZonaInfluencia,
    escolherAtaqueOportunidade,
    prepararAtaquesOportunidadeMovimento,
    executarAtaqueOportunidade,

    listarCelulasLinhaVisao,
    verificarLinhaVisao,
    obterTipoTerreno,
    calcularCaminhoMovimento,

    validarSelecaoCriatura,
    validarSelecaoAcao,
    obterCustoAtaque,
    listarAlvosCleave,
    prepararAtaqueCleave,
    movimentarParticipante,

    consumirAcao,
    consumirAcaoBonus,
    consumirReacao,
    usarAcaoDesengajar,

    prepararAtaque,
    resolverAtaque,
    aplicarDanoSemAcerto,
    aplicarCondicaoCombate,
    resolverSalvaguardaCombate,
    aplicarDeslocamentoForcado,
    aplicarDesvantagemTemporaria,
    aplicarModificadorDeslocamentoTemporario,
    removerParticipanteDaOrdem,

    verificarFimCombate,
    verificarObjetivosCombate,
    avaliarCondicaoObjetivo,
    registrarAvaliadorObjetivo,
    definirMarcadorCombate,
    validarConfiguracaoObjetivos,
    resolverDano,
    aplicarCura,
    iniciarTurnoAtual,
    ordenarTurnos,
    escolherAtaqueInimigo,
    moverInimigoEmDirecaoAoAlvo,
    executarTurnoInimigo,
    encerrarTurno,
  };
})();
