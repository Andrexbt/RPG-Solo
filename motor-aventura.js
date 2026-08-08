"use strict";

(function inicializarModuloMotorAventura() {
  const estadoMotor = {
    testeAtivo: null,
    desafioAtivo: null,
    inicializado: false,
    tentativasInicializacao: 0,
  };

  function aguardarAventura() {
    estadoMotor.tentativasInicializacao += 1;

    if (
      typeof window.exibirCena !== "function" ||
      typeof window.SistemaTestes !== "object" ||
      typeof window.realizarRolagemComposta !== "function"
    ) {
      if (estadoMotor.tentativasInicializacao > 250) {
        console.warn("O motor avançado da aventura não encontrou as dependências necessárias.");
        return;
      }

      setTimeout(aguardarAventura, 40);
      return;
    }

    inicializarMotor();
  }

  function inicializarMotor() {
    if (estadoMotor.inicializado) {
      return;
    }

    estadoMotor.inicializado = true;

    substituirIniciarEtapa();
    substituirMudarCena();

    listaEscolhas.addEventListener(
      "click",
      interceptarEscolhaAvancada,
      true,
    );

    document.addEventListener(
      "rolagemConcluida",
      interceptarRolagemAventura,
      true,
    );

    processarEntradaCenaAvancada(cenaAtual);
  }

  function obterPersonagem() {
    return estadoAtualJogo.personagem.dados;
  }

  function obterEntidadeNpc(idNpc) {
    return estadoAtualJogo.npcs?.[idNpc] ?? null;
  }

  function obterNomeAtributo(idAtributo) {
    const nomes = {
      forca: "Força",
      destreza: "Destreza",
      constituicao: "Constituição",
      inteligencia: "Inteligência",
      sabedoria: "Sabedoria",
      carisma: "Carisma",
    };

    return nomes[idAtributo] ?? idAtributo ?? "atributo";
  }

  function calcularBonusDescritor(entidade, descritor) {
    if (!entidade || !descritor) {
      return 0;
    }

    let bonus = 0;

    if (descritor.tipo === "pericia") {
      bonus = SistemaTestes.calcularBonusPericia(
        entidade,
        descritor.periciaId,
      );
    } else if (descritor.tipo === "salvaguarda") {
      bonus = SistemaTestes.calcularBonusSalvaguarda(
        entidade,
        descritor.atributoId,
      );
    } else if (descritor.tipo === "atributo") {
      bonus = SistemaTestes.calcularModificadorAtributo(
        entidade.atributos?.[descritor.atributoId],
      );
    }

    return bonus + (Number(descritor.modificadorContextual) || 0);
  }

  function obterRotuloTeste(teste) {
    if (!teste) {
      return "um teste";
    }

    if (teste.tipo === "pericia") {
      const pericia = window.bancoPericias?.[teste.periciaId];

      return pericia?.nome
        ? `um teste de ${pericia.nome}`
        : "um teste de perícia";
    }

    if (teste.tipo === "salvaguarda") {
      return `uma salvaguarda de ${obterNomeAtributo(teste.atributoId)}`;
    }

    if (teste.tipo === "atributo") {
      return `um teste de ${obterNomeAtributo(teste.atributoId)}`;
    }

    return "um teste";
  }

  function obterDescricaoRolagem(teste) {
    if (teste?.tipo === "oposto") {
      return obterDescricaoRolagem(teste.jogador);
    }

    if (teste?.tipo === "pericia") {
      const pericia = window.bancoPericias?.[teste.periciaId];
      return pericia?.nome
        ? `Teste de ${pericia.nome}`
        : "Teste de perícia";
    }

    if (teste?.tipo === "salvaguarda") {
      return `Salvaguarda de ${obterNomeAtributo(teste.atributoId)}`;
    }

    if (teste?.tipo === "atributo") {
      return `Teste de ${obterNomeAtributo(teste.atributoId)}`;
    }

    return "Teste";
  }

  function formatarModificador(modificador) {
    const valor = Number(modificador) || 0;

    if (valor < 0) {
      return `- ${Math.abs(valor)}`;
    }

    return `+ ${valor}`;
  }

  function criarInstrucaoTeste(teste, modificador, complemento = "") {
    const descritorJogador =
      teste.tipo === "oposto"
        ? teste.jogador
        : teste;

    const tipoRolagem = descritorJogador.tipoRolagem ?? teste.tipoRolagem ?? "normal";

    const quantidadeD20 =
      tipoRolagem === "vantagem" ||
      tipoRolagem === "desvantagem"
        ? 2
        : 1;

    const avisoRolagem =
      tipoRolagem === "vantagem"
        ? ", use o maior"
        : tipoRolagem === "desvantagem"
          ? ", use o menor"
          : "";

    const rotulo = obterRotuloTeste(descritorJogador);

    return (
      `Faça ${rotulo} ` +
      `(${quantidadeD20}d20 ${formatarModificador(modificador)}${avisoRolagem}) ` +
      complemento
    ).trim();
  }

  function prepararRolagem(teste) {
    const personagem = obterPersonagem();

    if (!personagem || !teste) {
      return null;
    }

    const descritorJogador =
      teste.tipo === "oposto"
        ? teste.jogador
        : teste;

    const modificador = calcularBonusDescritor(
      personagem,
      descritorJogador,
    );

    const tipoRolagem = descritorJogador.tipoRolagem ?? teste.tipoRolagem ?? "normal";

    const quantidadeD20 =
      tipoRolagem === "vantagem" ||
      tipoRolagem === "desvantagem"
        ? 2
        : 1;

    return {
      gruposDeDados: [
        {
          quantidade: quantidadeD20,
          numeroDeFaces: 20,
        },
      ],
      modificador,
      descricao: obterDescricaoRolagem(teste),
      quantidadeDeRolagens: 1,
      critico: false,
    };
  }

  function limparTesteAtivo() {
    estadoMotor.testeAtivo = null;
    testePendente = null;
    estadoAtualJogo.testePendente = null;
  }

  function mostrarPendenciaFonte(no) {
    limparTesteAtivo();
    ocultarEscolhas();

    solicitacaoTeste.textContent =
      no?.pendenciaFonte ??
      "Este trecho da aventura ainda depende de uma informação ausente na fonte.";

    solicitacaoTeste.hidden = false;
  }

  function iniciarTesteGenerico(configuracao) {
    const teste = configuracao?.teste;

    if (!teste) {
      return false;
    }

    if (teste.tipo === "periciaEscolha") {
      oferecerEscolhaDePericia(configuracao);
      return true;
    }

    if (
      teste.tipo !== "oposto" &&
      (teste.dificuldade === null || teste.dificuldade === undefined)
    ) {
      mostrarPendenciaFonte(configuracao.origem ?? teste);
      return false;
    }

    const configuracaoRolagem = prepararRolagem(teste);

    if (!configuracaoRolagem) {
      console.warn("Não foi possível preparar o teste da aventura:", teste);
      return false;
    }

    let resultadoOponente = null;

    if (teste.tipo === "oposto") {
      const npc = obterEntidadeNpc(teste.oponente?.npcId);

      if (!npc) {
        console.warn("NPC do teste oposto não encontrado:", teste.oponente?.npcId);
        return false;
      }

      const bonusOponente = calcularBonusDescritor(
        npc,
        teste.oponente,
      );

      resultadoOponente = realizarRolagemComposta({
        gruposDeDados: [
          {
            quantidade: 1,
            numeroDeFaces: 20,
          },
        ],
        modificador: bonusOponente,
      });
    }

    estadoMotor.testeAtivo = {
      teste,
      resultados: configuracao.resultados ?? {},
      instrucao: configuracao.instrucao ?? "",
      origem: configuracao.origem ?? null,
      aoResolver: configuracao.aoResolver ?? null,
      resultadoOponente,
    };

    testePendente = teste;
    estadoAtualJogo.testePendente = teste;

    ocultarEscolhas();

    solicitacaoTeste.textContent = criarInstrucaoTeste(
      teste,
      configuracaoRolagem.modificador,
      configuracao.instrucao ?? "",
    );

    solicitacaoTeste.hidden = false;

    solicitarRolagemNaCaixa(
      configuracaoRolagem.gruposDeDados,
      configuracaoRolagem.modificador,
      configuracaoRolagem.descricao,
      configuracaoRolagem.quantidadeDeRolagens,
      configuracaoRolagem.critico,
    );

    return true;
  }

  function oferecerEscolhaDePericia(configuracao) {
    const teste = configuracao.teste;
    const personagem = obterPersonagem();

    if (!personagem) {
      return;
    }

    const escolhasPericia = (teste.periciasIds ?? []).map(
      function criarEscolha(idPericia) {
        const pericia = window.bancoPericias?.[idPericia];
        const bonus = SistemaTestes.calcularBonusPericia(
          personagem,
          idPericia,
        );

        return {
          id: `motor-pericia-${idPericia}`,
          texto: `${pericia?.nome ?? idPericia} (${formatarModificador(bonus)})`,
          __acaoMotor: function selecionarPericia() {
            iniciarTesteGenerico({
              ...configuracao,
              teste: {
                ...teste,
                tipo: "pericia",
                periciaId: idPericia,
                periciasIds: undefined,
              },
            });
          },
        };
      },
    );

    solicitacaoTeste.textContent = "Escolha qual perícia usar neste teste.";
    solicitacaoTeste.hidden = false;

    exibirEscolhas(escolhasPericia);
  }

  function resolverResultadoTeste(resultadoRolagem) {
    const ativo = estadoMotor.testeAtivo;

    if (!ativo) {
      return;
    }

    const teste = ativo.teste;
    let resultadoTeste;

    if (teste.tipo === "oposto") {
      resultadoTeste = SistemaTestes.resolverTesteOposto(
        resultadoRolagem,
        ativo.resultadoOponente,
      );
    } else {
      resultadoTeste = SistemaTestes.resolverTesteContraCd(
        resultadoRolagem,
        teste.dificuldade,
        teste.tipoRolagem ?? "normal",
      );
    }

    const chaveResultado = resultadoTeste.sucesso
      ? "sucesso"
      : "fracasso";

    const consequencia = ativo.resultados?.[chaveResultado] ?? null;
    const aoResolver = ativo.aoResolver;

    limparTesteAtivo();

    solicitacaoTeste.textContent = "";
    solicitacaoTeste.hidden = true;

    if (typeof aoResolver === "function") {
      aoResolver(resultadoTeste, consequencia);
      return;
    }

    aplicarConsequencia(consequencia);
  }

  function interceptarRolagemAventura(evento) {
    if (!estadoMotor.testeAtivo) {
      return;
    }

    evento.stopImmediatePropagation();
    resolverResultadoTeste(evento.detail);
  }

  function aplicarConsequencia(consequencia) {
    if (!consequencia) {
      console.warn("Consequência da aventura não encontrada.");
      return;
    }

    if (consequencia.texto !== undefined) {
      exibirContexto(consequencia.texto);
    }

    if (consequencia.contexto !== undefined) {
      exibirContexto(consequencia.contexto);
    }

    if (Array.isArray(consequencia.efeitos) && consequencia.efeitos.length > 0) {
      aplicarEfeitosNarrativos(consequencia.efeitos);
    }

    if (consequencia.teste) {
      iniciarTesteGenerico({
        teste: consequencia.teste,
        resultados: consequencia.resultados,
        origem: consequencia,
      });
      return;
    }

    if (consequencia.escolhas) {
      exibirEscolhas(consequencia.escolhas);
      return;
    }

    if (consequencia.voltarParaEscolhas) {
      if (consequencia.removerEscolha && caminhoAtual) {
        registrarEscolhaRemovida(
          estadoAtualJogo.progresso.cenaId,
          caminhoAtual.id,
        );
      }

      caminhoAtual = null;
      etapaAtual = null;
      estadoAtualJogo.progresso.caminhoId = null;
      estadoAtualJogo.progresso.etapaId = null;

      exibirEscolhas(
        obterEscolhasDisponiveis(
          estadoAtualJogo.progresso.cenaId,
          cenaAtual.escolhas,
        ),
      );
      return;
    }

    if (consequencia.proximaEtapa) {
      exibirEscolhas([
        {
          id: "motor-continuar-etapa",
          texto: "Continuar.",
          __acaoMotor: function continuarEtapa() {
            iniciarEtapa(consequencia.proximaEtapa);
          },
        },
      ]);
      return;
    }

    if (consequencia.proximaCena) {
      exibirEscolhas([
        {
          id: "motor-continuar-cena",
          texto: "Continuar.",
          __acaoMotor: function continuarCena() {
            mudarCena(consequencia.proximaCena);
          },
        },
      ]);
      return;
    }

    if (consequencia.continuarSequencia && estadoMotor.desafioAtivo) {
      continuarDesafioAtivo();
      return;
    }

    console.warn("Consequência sem destino executável:", consequencia);
  }

  function interceptarEscolhaAvancada(evento) {
    const botao = evento.target.closest(".botao-escolha");

    if (!botao) {
      return;
    }

    const escolha = escolhasAtuais.find(
      (item) => item.id === botao.dataset.idEscolha,
    );

    if (!escolha) {
      return;
    }

    if (typeof escolha.__acaoMotor === "function") {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      escolha.__acaoMotor();
      return;
    }

    if (
      escolha.teste ||
      escolha.testes ||
      escolha.testePrincipal ||
      escolha.pendenciaFonte ||
      escolha.requerSistema === "sequenciaTresSucessosComTesteOposto" ||
      escolha.requerSistema === "sequenciaTresSucessosComAtaquesNarrativos"
    ) {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      processarEscolhaAvancada(escolha);
    }
  }

  function processarEscolhaAvancada(escolha) {
    if (
      escolha.pendenciaFonte &&
      (
        !escolha.teste ||
        escolha.teste.dificuldade == null ||
        !escolha.resultados
      )
    ) {
      mostrarPendenciaFonte(escolha);
      return;
    }

    if (escolha.requerSistema === "sequenciaTresSucessosComTesteOposto") {
      iniciarDesafioTresSucessosComTestes(escolha);
      return;
    }

    if (escolha.requerSistema === "sequenciaTresSucessosComAtaquesNarrativos") {
      iniciarDesafioTresSucessosComAtaques(escolha);
      return;
    }

    if (escolha.teste) {
      iniciarTesteGenerico({
        teste: escolha.teste,
        resultados: escolha.resultados,
        origem: escolha,
      });
      return;
    }

    mostrarPendenciaFonte(escolha);
  }

  function substituirIniciarEtapa() {
    iniciarEtapa = function iniciarEtapaGenerica(idEtapa) {
      const etapa = caminhoAtual?.etapas?.[idEtapa];

      if (!etapa) {
        console.warn("Etapa não encontrada:", idEtapa);
        return;
      }

      etapaAtual = etapa;
      estadoAtualJogo.progresso.etapaId = idEtapa;

      if (etapa.descricao !== undefined) {
        exibirContexto(etapa.descricao);
      }

      if (etapa.pendenciaFonte && etapa.teste?.dificuldade == null) {
        mostrarPendenciaFonte(etapa);
        return;
      }

      if (etapa.teste) {
        iniciarTesteGenerico({
          teste: etapa.teste,
          resultados: etapa.resultados,
          instrucao: etapa.instrucao,
          origem: etapa,
        });
        return;
      }

      if (etapa.escolhas) {
        exibirEscolhas(etapa.escolhas);
        return;
      }

      aplicarConsequencia(etapa);
    };
  }

  function substituirMudarCena() {
    const mudarCenaOriginal = mudarCena;

    mudarCena = function mudarCenaComMotor(idProximaCena) {
      mudarCenaOriginal(idProximaCena);
      processarEntradaCenaAvancada(cenaAtual);
    };
  }

  function processarEntradaCenaAvancada(cena) {
    if (!cena) {
      return;
    }

    if (
      cena.incompleta ||
      (cena.pendenciaFonte && cena.escolhas?.length === 0)
    ) {
      if (cena.pendenciaFonte) {
        solicitacaoTeste.textContent = cena.pendenciaFonte;
        solicitacaoTeste.hidden = false;
      }
      return;
    }

    if (cena.testeInicial) {
      iniciarTesteGenerico({
        teste: cena.testeInicial,
        resultados: cena.resultadosTesteInicial,
        origem: cena,
      });
      return;
    }

    if (cena.sequencia) {
      iniciarSequenciaAtaquesCena(cena.sequencia);
    }
  }

  function obterTestesDesafio(escolha) {
    if (Array.isArray(escolha.testes) && escolha.testes.length > 0) {
      return escolha.testes;
    }

    if (escolha.requerSistema === "sequenciaTresSucessosComTesteOposto") {
      return [
        {
          tipo: "pericia",
          periciaId: "atletismo",
          dificuldade: 17,
        },
        {
          tipo: "oposto",
          jogador: {
            tipo: "pericia",
            periciaId: "furtividade",
          },
          oponente: {
            npcId: "guardaConde",
            tipo: "pericia",
            periciaId: "percepcao",
          },
        },
      ];
    }

    return [];
  }

  function iniciarDesafioTresSucessosComTestes(escolha) {
    const testes = obterTestesDesafio(escolha);

    if (testes.length === 0) {
      console.warn("Desafio sem testes definidos:", escolha);
      return;
    }

    estadoMotor.desafioAtivo = {
      tipo: "testes",
      escolha,
      testes,
      sucessos: 0,
      necessarios: Number(escolha.progresso?.sucessosNecessarios) || 3,
      indiceTeste: 0,
    };

    executarProximoTesteDesafio();
  }

  function executarProximoTesteDesafio() {
    const desafio = estadoMotor.desafioAtivo;

    if (!desafio || desafio.tipo !== "testes") {
      return;
    }

    const teste = desafio.testes[desafio.indiceTeste];

    if (!teste) {
      desafio.sucessos += 1;
      desafio.indiceTeste = 0;

      if (desafio.sucessos >= desafio.necessarios) {
        const consequencia =
          desafio.escolha.resultados?.tresSucessos ??
          desafio.escolha.resultados?.tresSucessosSemCair;

        estadoMotor.desafioAtivo = null;
        aplicarConsequencia(consequencia);
        return;
      }

      solicitacaoTeste.textContent =
        `Sucesso ${desafio.sucessos}/${desafio.necessarios}. Continue.`;

      executarProximoTesteDesafio();
      return;
    }

    iniciarTesteGenerico({
      teste,
      resultados: {
        sucesso: { continuarSequencia: true },
        fracasso:
          desafio.escolha.resultados?.qualquerFalha ??
          { proximaCena: "batalha" },
      },
      origem: desafio.escolha,
      aoResolver: function resolverTesteDoDesafio(resultadoTeste, consequencia) {
        if (!resultadoTeste.sucesso) {
          estadoMotor.desafioAtivo = null;
          aplicarConsequencia(consequencia);
          return;
        }

        desafio.indiceTeste += 1;
        executarProximoTesteDesafio();
      },
    });
  }

  function continuarDesafioAtivo() {
    const desafio = estadoMotor.desafioAtivo;

    if (!desafio) {
      return;
    }

    if (desafio.tipo === "testes") {
      executarProximoTesteDesafio();
    }
  }

  function iniciarDesafioTresSucessosComAtaques(escolha) {
    estadoMotor.desafioAtivo = {
      tipo: "testesComAtaques",
      escolha,
      sucessos: 0,
      necessarios: Number(escolha.progresso?.sucessosNecessarios) || 3,
    };

    executarRodadaDesafioComAtaques();
  }

  function executarRodadaDesafioComAtaques() {
    const desafio = estadoMotor.desafioAtivo;

    if (!desafio || desafio.tipo !== "testesComAtaques") {
      return;
    }

    iniciarTesteGenerico({
      teste: desafio.escolha.testePrincipal,
      resultados: {
        sucesso: { continuarSequencia: true },
        fracasso:
          desafio.escolha.resultados?.qualquerFalha ??
          { proximaCena: "batalha" },
      },
      origem: desafio.escolha,
      aoResolver: function resolverTestePrincipal(resultadoTeste, consequencia) {
        if (!resultadoTeste.sucesso) {
          estadoMotor.desafioAtivo = null;
          aplicarConsequencia(consequencia);
          return;
        }

        executarAtaquesNarrativos(
          desafio.escolha.aposCadaSucesso,
          function concluirAtaques(continuar) {
            if (!continuar) {
              estadoMotor.desafioAtivo = null;
              return;
            }

            desafio.sucessos += 1;

            if (desafio.sucessos >= desafio.necessarios) {
              const final =
                desafio.escolha.resultados?.tresSucessosSemCair ??
                desafio.escolha.resultados?.tresSucessos;

              estadoMotor.desafioAtivo = null;
              aplicarConsequencia(final);
              return;
            }

            executarRodadaDesafioComAtaques();
          },
        );
      },
    });
  }

  function iniciarSequenciaAtaquesCena(sequencia) {
    const total = Number(sequencia.ataquesMaximos) || 0;
    let realizados = 0;

    function executarAtaqueSeguinte() {
      if (realizados >= total) {
        aplicarConsequencia(sequencia.aoConcluirSemQueda);
        return;
      }

      realizados += 1;

      executarAtaqueNarrativo(
        sequencia.atacanteNpcId,
        sequencia.aoAcertar,
        function concluirAtaque(continuar) {
          if (!continuar) {
            return;
          }

          executarAtaqueSeguinte();
        },
      );
    }

    executarAtaqueSeguinte();
  }

  function executarAtaquesNarrativos(configuracao, aoConcluir) {
    const quantidade = Number(configuracao?.ataques) || 0;
    const atacanteNpcId = configuracao?.atacanteNpcId;
    let realizados = 0;

    function proximo() {
      if (realizados >= quantidade) {
        aoConcluir(true);
        return;
      }

      realizados += 1;

      executarAtaqueNarrativo(
        atacanteNpcId,
        configuracao.aoAcertar,
        function finalizarAtaque(continuar) {
          if (!continuar) {
            aoConcluir(false);
            return;
          }

          proximo();
        },
      );
    }

    proximo();
  }

  function executarAtaqueNarrativo(idNpc, aoAcertar, aoConcluir) {
    const npc = obterEntidadeNpc(idNpc);
    const personagem = obterPersonagem();

    if (!npc || !personagem) {
      console.warn("Entidades do ataque narrativo não encontradas.");
      aoConcluir(false);
      return;
    }

    const ataque =
      npc.ataques?.find((item) => item.categoria === "distancia") ??
      npc.ataques?.[0];

    if (!ataque) {
      console.warn("NPC sem ataque disponível:", idNpc);
      aoConcluir(false);
      return;
    }

    const resultadoAtaque = realizarRolagemComposta({
      gruposDeDados: [
        {
          quantidade: 1,
          numeroDeFaces: 20,
        },
      ],
      modificador: ataque.bonusAtaque,
    });

    const resultadoNatural =
      resultadoAtaque.gruposRolados?.[0]?.resultados?.[0] ?? null;

    const classeArmadura = Number(personagem.combate?.classeArmadura) || 10;
    const acertoCritico = resultadoNatural === 20;
    const falhaAutomatica = resultadoNatural === 1;
    const acertou =
      !falhaAutomatica &&
      (acertoCritico || resultadoAtaque.total >= classeArmadura);

    solicitacaoTeste.textContent = acertou
      ? `${npc.nome} acerta você com ${ataque.nome}.`
      : `${npc.nome} erra o ataque com ${ataque.nome}.`;
    solicitacaoTeste.hidden = false;

    if (!acertou) {
      aoConcluir(true);
      return;
    }

    const gruposDano = structuredClone(ataque.dano?.gruposDeDados ?? []);

    if (acertoCritico) {
      for (const grupo of gruposDano) {
        grupo.quantidade *= 2;
      }
    }

    const dano = realizarRolagemComposta({
      gruposDeDados: gruposDano,
      modificador: ataque.dano?.modificador ?? 0,
    });

    aplicarDanoAoPersonagem(dano.total, ataque.dano?.tipo ?? "dano");

    if (!aoAcertar?.teste) {
      aoConcluir(true);
      return;
    }

    iniciarTesteGenerico({
      teste: aoAcertar.teste,
      resultados: aoAcertar.resultados ?? {
        sucesso: { continuarSequencia: true },
        fracasso: aoAcertar.falha ?? { continuarSequencia: true },
      },
      origem: aoAcertar,
      aoResolver: function resolverSalvaguardaAtaque(resultadoTeste, consequencia) {
        if (resultadoTeste.sucesso) {
          aoConcluir(true);
          return;
        }

        if (consequencia?.teste) {
          iniciarTesteGenerico({
            teste: consequencia.teste,
            resultados: consequencia.resultados,
            origem: consequencia,
            aoResolver: function resolverTesteSecundario(resultadoSecundario, consequenciaSecundaria) {
              if (resultadoSecundario.sucesso) {
                aoConcluir(true);
                return;
              }

              aplicarEfeitosNarrativos(
                consequenciaSecundaria?.efeitos ?? [],
              );

              if (consequenciaSecundaria?.proximaCena) {
                mudarCena(consequenciaSecundaria.proximaCena);
              }

              aoConcluir(false);
            },
          });
          return;
        }

        if (consequencia?.proximaCena) {
          mudarCena(consequencia.proximaCena);
          aoConcluir(false);
          return;
        }

        aoConcluir(true);
      },
    });
  }

  function aplicarDanoAoPersonagem(valor, tipo = "dano") {
    const personagem = obterPersonagem();
    const pontosDeVida = personagem?.combate?.pontosDeVida;

    if (!pontosDeVida) {
      console.warn("Pontos de vida do personagem não encontrados.");
      return false;
    }

    const dano = Math.max(0, Number(valor) || 0);
    pontosDeVida.atuais = Math.max(0, Number(pontosDeVida.atuais) - dano);

    solicitacaoTeste.textContent =
      `Você sofre ${dano} de ${tipo}. PV restantes: ${pontosDeVida.atuais}.`;
    solicitacaoTeste.hidden = false;

    const areaFicha = document.getElementById("conteudoFicha");

    if (areaFicha && window.FichaPersonagem?.renderizar) {
      window.FichaPersonagem.renderizar(personagem, areaFicha);
    }

    return true;
  }

  function aplicarEfeitosNarrativos(efeitos) {
    for (const efeito of efeitos) {
      if (!efeito) {
        continue;
      }

      if (efeito.tipo === "causarDano") {
        const resultado = realizarRolagemComposta({
          gruposDeDados: efeito.gruposDeDados ?? [],
          modificador: efeito.modificador ?? 0,
        });

        aplicarDanoAoPersonagem(resultado.total, efeito.tipoDano ?? "dano");
        continue;
      }

      if (efeito.tipo === "danoQueda") {
        if (!Array.isArray(efeito.gruposDeDados) || efeito.gruposDeDados.length === 0) {
          estadoAtualJogo.progresso.flags.danoQuedaPendente = true;

          console.warn(
            "A fonte determina dano de queda, mas não informa altura ou dados. " +
            "O caminho continua sem atribuir um valor inventado.",
            efeito,
          );

          continue;
        }

        const resultado = realizarRolagemComposta({
          gruposDeDados: efeito.gruposDeDados,
          modificador: efeito.modificador ?? 0,
        });

        aplicarDanoAoPersonagem(resultado.total, "dano de queda");
        continue;
      }

      console.warn("Efeito narrativo não implementado:", efeito);
      return false;
    }

    return true;
  }

  window.MotorAventura = {
    iniciarTeste: iniciarTesteGenerico,
    aplicarConsequencia,
    aplicarEfeitosNarrativos,
    executarAtaqueNarrativo,
    aplicarDanoAoPersonagem,
    estado: estadoMotor,
  };

  aguardarAventura();
})();
