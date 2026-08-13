"use strict";

window.MotorAventura = (function () {
  const estado = {
    testeAtivo: null,
  };

  function obterPersonagem() {
    return window.estadoJogo?.personagem?.dados ?? null;
  }

  function obterEntidadeDoTeste(teste) {
  if (teste?.tipo === "npc") {
    return (
      window.estadoJogo
        ?.npcs
        ?.[teste.npcId]
      ?? null
    );
  }

  return obterPersonagem();
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

    if (descritor.tipo === "pericia") {
      return SistemaTestes.calcularBonusPericia(entidade, descritor.periciaId);
    }

    if (descritor.tipo === "salvaguarda") {
      return SistemaTestes.calcularBonusSalvaguarda(entidade, descritor.atributoId);
    }

    if (descritor.tipo === "atributo") {
      return SistemaTestes.calcularModificadorAtributo(
        entidade.atributos?.[descritor.atributoId],
      );
    }

    return 0;
  }

  function obterRotuloTeste(teste) {
    if (teste.tipo === "pericia") {
      const nome = window.bancoPericias?.[teste.periciaId]?.nome;
      return nome ? `um teste de ${nome}` : "um teste de perícia";
    }

    if (teste.tipo === "salvaguarda") {
      return `uma salvaguarda de ${obterNomeAtributo(teste.atributoId)}`;
    }

    if (teste.tipo === "atributo") {
      return `um teste de ${obterNomeAtributo(teste.atributoId)}`;
    }

    return "um teste";
  }

  function obterNomeTeste(teste) {
    const descritor =
  teste.tipo === "oposto"
    ? teste.jogador
    : teste.tipo === "npc"
      ? teste.teste
      : teste;

    if (descritor.tipo === "pericia") {
      return window.bancoPericias?.[descritor.periciaId]?.nome ?? descritor.periciaId;
    }

    return obterNomeAtributo(descritor.atributoId);
  }

  function formatarModificador(valor) {
    const numero = Number(valor) || 0;
    return numero < 0 ? `- ${Math.abs(numero)}` : `+ ${numero}`;
  }

  function prepararRolagem(teste) {
    const entidade = obterEntidadeDoTeste(teste);

if (!entidade || !teste) {
  return null;
}

    const descritor =
  teste.tipo === "oposto"
    ? teste.jogador
    : teste.tipo === "npc"
      ? teste.teste
      : teste;
    const modificador = calcularBonusDescritor(entidade, descritor);
    const tipoRolagem = descritor.tipoRolagem ?? teste.tipoRolagem ?? "normal";
    const quantidadeD20 =
      tipoRolagem === "vantagem" || tipoRolagem === "desvantagem" ? 2 : 1;

    return {
      gruposDeDados: [
        {
          quantidade: quantidadeD20,
          numeroDeFaces: 20,
        },
      ],
      modificador,
      descricao: obterNomeTeste(teste),
      quantidadeDeRolagens: 1,
      critico: false,
    };
  }

  function criarInstrucaoTeste(teste, modificador, complemento = "") {
    const descritor = teste.tipo === "oposto" ? teste.jogador : teste;
    const tipoRolagem = descritor.tipoRolagem ?? teste.tipoRolagem ?? "normal";
    const quantidadeD20 =
      tipoRolagem === "vantagem" || tipoRolagem === "desvantagem" ? 2 : 1;
    const aviso =
      tipoRolagem === "vantagem"
        ? ", use o maior"
        : tipoRolagem === "desvantagem"
          ? ", use o menor"
          : "";

    return (
      `Faça ${obterRotuloTeste(descritor)} ` +
      `(${quantidadeD20}d20 ${formatarModificador(modificador)}${aviso}) ` +
      `para ${complemento}`
    ).trim();
  }

  function limparTesteAtivo() {
    estado.testeAtivo = null;
    window.estadoJogo.testePendente = null;
  }

  function cancelarTeste() {
    limparTesteAtivo();
  }

  function temTesteAtivo() {
    return Boolean(estado.testeAtivo);
  }

  async function mostrarPendenciaFonte(no) {
    limparTesteAtivo();
    ocultarEscolhas();

    await NarradorAventura.adicionarTeste(
      no?.pendenciaFonte ??
        "Este trecho da aventura ainda depende de uma informação ausente na fonte.",
    );
  }

  async function oferecerEscolhaDePericia(configuracao) {
    const teste = configuracao.teste;
    const personagem = obterPersonagem();

    if (!personagem) {
      return false;
    }

    await NarradorAventura.adicionarTeste("Escolha qual perícia usar neste teste.");

    const escolhas = (teste.periciasIds ?? []).map(function (idPericia) {
      const nome = window.bancoPericias?.[idPericia]?.nome ?? idPericia;
      const bonus = SistemaTestes.calcularBonusPericia(personagem, idPericia);

      return {
        id: `motor-pericia-${idPericia}`,
        texto: `${nome} (${formatarModificador(bonus)})`,
        registrarNarrativa: false,
        __acaoMotor: async function selecionarPericia() {
          await iniciarTeste({
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
    });

    exibirEscolhas(escolhas);
    return true;
  }

  async function iniciarTeste(configuracao) {
    const teste = configuracao?.teste;

    if (!teste) {
      return false;
    }

    if (teste.tipo === "npc") {
      return resolverTesteNpc(
      configuracao
      );
    }

    if (teste.tipo === "periciaEscolha") {
      return oferecerEscolhaDePericia(configuracao);
    }

    if (
      teste.tipo !== "oposto" &&
      (teste.dificuldade === undefined || teste.dificuldade === null)
    ) {
      await mostrarPendenciaFonte(configuracao.origem ?? teste);
      return false;
    }

    const rolagem = prepararRolagem(teste);

    if (!rolagem) {
      console.warn("Não foi possível preparar o teste da aventura:", teste);
      return false;
    }

    let resultadoOponente = null;

    if (teste.tipo === "oposto") {
      const npc = window.estadoJogo.npcs?.[teste.oponente?.npcId];

      if (!npc) {
        console.warn("NPC do teste oposto não encontrado:", teste.oponente?.npcId);
        return false;
      }

      const tipoRolagemOponente =
    teste.oponente.tipoRolagem ?? "normal";

  const quantidadeD20Oponente =
    tipoRolagemOponente === "vantagem" ||
    tipoRolagemOponente === "desvantagem"
      ? 2
      : 1;

      resultadoOponente = realizarRolagemComposta({
        gruposDeDados: [
          {
            quantidade: quantidadeD20Oponente,
            numeroDeFaces: 20,
          },
        ],
        modificador: calcularBonusDescritor(npc, teste.oponente),
      });

      if (tipoRolagemOponente !== "normal") {
    resultadoOponente = {
      ...resultadoOponente,

      total:
        SistemaTestes.calcularTotalTesteD20(
          resultadoOponente,
          tipoRolagemOponente,
        ),
    };
  }
    }

    estado.testeAtivo = {
      teste,
      resultados: configuracao.resultados ?? {},
      instrucao: configuracao.instrucao ?? teste.acao ?? "",
      resultadoOponente,
    };

    window.estadoJogo.testePendente = teste;
    ocultarEscolhas();

    const instrucao = criarInstrucaoTeste(
      teste,
      rolagem.modificador,
      configuracao.instrucao ?? teste.acao ?? "",
    );

    await NarradorAventura.adicionarTeste(instrucao);

    if (typeof window.configurarRolagemSolicitada !== "function") {
      console.warn("A caixa de dados não está disponível.");
      return false;
    }

    window.configurarRolagemSolicitada(rolagem);
    return true;
  }

  async function resolverTesteNpc(configuracao) {
  const teste = configuracao?.teste;

  if (!teste || teste.tipo !== "npc") {
    return false;
  }

  const npc =
    window.estadoJogo
      ?.npcs
      ?.[teste.npcId];

  if (!npc) {
    console.warn(
      "NPC do teste não encontrado:",
      teste.npcId,
    );
    return false;
  }

  const rolagem = prepararRolagem(teste);

  if (!rolagem) {
    console.warn(
      "Não foi possível preparar o teste do NPC:",
      teste,
    );
    return false;
  }

  const resultadoRolagem =
    realizarRolagemComposta(rolagem);

  const descritor =
    teste.teste;

  const tipoRolagem =
    descritor?.tipoRolagem ??
    teste.tipoRolagem ??
    "normal";

  const resultadoTeste =
    SistemaTestes.resolverTesteContraCd(
      resultadoRolagem,
      teste.dificuldade,
      tipoRolagem,
    );

  const consequencia =
    configuracao.resultados?.[
      resultadoTeste.sucesso
        ? "sucesso"
        : "fracasso"
    ];

  await aplicarConsequencia(
    consequencia
  );

  return true;
}

  async function aplicarConsequencia(consequencia) {
    if (!consequencia) {
      console.warn("Consequência da aventura não encontrada.");
      return;
    }

    if (consequencia.texto !== undefined && consequencia.texto !== "") {
      await exibirContexto(consequencia.texto);
    }

    if (consequencia.contexto !== undefined && consequencia.contexto !== "") {
      await exibirContexto(consequencia.contexto);
    }

    if (consequencia.pendenciaFonte) {
      await mostrarPendenciaFonte(consequencia);
      return;
    }

    if (consequencia.teste) {
      await iniciarTeste({
        teste: consequencia.teste,
        resultados: consequencia.resultados,
        instrucao: consequencia.instrucao,
        origem: consequencia,
      });
      return;
    }

    if (Array.isArray(consequencia.escolhas)) {
      exibirEscolhas(consequencia.escolhas);
      return;
    }

    if (consequencia.voltarParaEscolhas) {
      const cenaId = window.estadoJogo.progresso.cenaId;
      const caminhoId = window.estadoJogo.progresso.caminhoId;

      if (consequencia.removerEscolha && caminhoId) {
        registrarEscolhaRemovida(cenaId, caminhoId);
      }

      window.estadoJogo.progresso.caminhoId = null;
      window.estadoJogo.progresso.etapaId = null;

      exibirEscolhas(obterEscolhasDisponiveis(cenaId, cenaAtual.escolhas ?? []));
      return;
    }

    if (consequencia.proximaEtapa) {
      await iniciarEtapa(consequencia.proximaEtapa);
      return;
    }

    if (consequencia.proximaCena) {
      mudarCena(consequencia.proximaCena);
      return;
    }

    console.warn("Consequência sem destino executável:", consequencia);
  }

  async function resolverResultadoTeste(resultadoRolagem) {
    const ativo = estado.testeAtivo;

    if (!ativo) {
      return;
    }

    const teste = ativo.teste;
    const resultadoTeste =
      teste.tipo === "oposto"
        ? SistemaTestes.resolverTesteOposto(resultadoRolagem, ativo.resultadoOponente)
        : SistemaTestes.resolverTesteContraCd(
            resultadoRolagem,
            teste.dificuldade,
            teste.tipoRolagem ?? "normal",
          );

    const consequencia = ativo.resultados[
      resultadoTeste.sucesso ? "sucesso" : "fracasso"
    ];

    const acao =
      ativo.instrucao
        ?.replace(/^para\s+/i, "")
        .replace(/\.$/, "") || "realizar a ação";

    await NarradorAventura.adicionarResultadoTeste({
      sucesso: resultadoTeste.sucesso,
      nomeTeste: obterNomeTeste(teste),
      acao,
    });

    limparTesteAtivo();
    await aplicarConsequencia(consequencia);
  }

  document.addEventListener(
    "rolagemConcluida",
    function (evento) {
      if (!estado.testeAtivo) {
        return;
      }

      evento.stopImmediatePropagation();
      void resolverResultadoTeste(evento.detail);
    },
    true,
  );

  return {
    iniciarTeste,
    aplicarConsequencia,
    mostrarPendenciaFonte,
    cancelarTeste,
    temTesteAtivo,
    estado,
  };
})();
