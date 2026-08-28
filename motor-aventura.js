"use strict";

window.MotorAventura = (function () {
  const estado = {
    testeAtivo: null,
    descansoCurtoPendente: null,
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
    const tipoRolagem =
  SistemaTestes.determinarTipoRolagem(
    entidade,
    descritor,
    teste,
  );
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
      tipoRolagem,
    };
  }

  function criarInstrucaoTeste(teste, modificador, complemento = "") {
    const descritor = teste.tipo === "oposto" ? teste.jogador : teste;
    const entidade = obterEntidadeDoTeste(teste);

const tipoRolagem =
  SistemaTestes.determinarTipoRolagem(
    entidade,
    descritor,
    teste,
  );
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

    const descritorJogador =
  teste.tipo === "oposto"
    ? teste.jogador
    : teste;

const entidadeJogador =
  obterEntidadeDoTeste(teste);

const tipoRolagemJogador =
  SistemaTestes.determinarTipoRolagem(
    entidadeJogador,
    descritorJogador,
    teste,
  );

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
      tipoRolagemJogador,
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

  registrarEventoNarrativo({
    tipo: "teste",
    resultado: resultadoTeste.sucesso
      ? "sucesso"
      : "fracasso",
  });

  await aplicarConsequencia(
    consequencia
  );

  return true;
}

function normalizarTipoRolagemAtaque(tipoRolagem) {
  if (tipoRolagem === "vantagem" || tipoRolagem === "desvantagem") {
    return tipoRolagem;
  }

  return "normal";
}

function resolverAtaqueNpcIndividual(ataque, personagem, configuracao = {}) {
  const tipoRolagem = normalizarTipoRolagemAtaque(configuracao.tipoRolagem);
  const quantidadeD20 = tipoRolagem === "normal" ? 1 : 2;
  const resultadoRolagem = realizarRolagemComposta({
    gruposDeDados: [
      {
        quantidade: quantidadeD20,
        numeroDeFaces: 20,
      },
    ],

    modificador: ataque.bonusAtaque ?? 0,
  });

  const grupoD20 = resultadoRolagem.gruposRolados.find(
    (grupo) => grupo.numeroDeFaces === 20,
  );
  const resultadosD20 = grupoD20?.resultados ?? [];
  const resultadoNatural = SistemaTestes.selecionarResultadoD20(
    resultadosD20,
    tipoRolagem,
  );
  const totalAtaque = resultadoNatural + (Number(ataque.bonusAtaque) || 0);
  const classeArmadura = personagem.combate?.classeArmadura ?? 10;
  const acertoCritico = resultadoNatural === 20;
  const falhaAutomatica = resultadoNatural === 1;
  const acertou =
    !falhaAutomatica && (acertoCritico || totalAtaque >= classeArmadura);

  let dano = 0;

  if (acertou) {
    const modificadorDano =
      configuracao.dano?.substituirModificador ?? ataque.dano?.modificador ?? 0;
    const resultadoDano = realizarRolagemComposta({
      gruposDeDados: ataque.dano?.gruposDeDados ?? [],
      modificador: modificadorDano,
    });
    const subtotal = Number(resultadoDano.subtotal) || 0;
    const modificador = Number(resultadoDano.modificador) || 0;

    dano = acertoCritico ? subtotal * 2 + modificador : subtotal + modificador;
    dano = Math.max(configuracao.dano?.minimo ?? 0, dano);
  }

  return {
    acertou,
    acertoCritico,
    falhaAutomatica,
    tipoRolagem,
    resultadosD20,
    resultadoNatural,
    totalAtaque,
    dano,
  };
}

function aplicarDanoNarrativo(personagem, dano) {
  const pontosDeVida = personagem.combate?.pontosDeVida;

  if (!pontosDeVida || dano <= 0) {
    return;
  }

  pontosDeVida.atuais = Math.max(0, pontosDeVida.atuais - dano);
}

function personagemEstaSemPontosDeVida() {
  const pontosDeVida =
    window.estadoJogo
      ?.personagem
      ?.dados
      ?.combate
      ?.pontosDeVida;

  if (!pontosDeVida) {
    return false;
  }

  return Number(pontosDeVida.atuais) <= 0;
}

async function encaminharParaFimDerrotaSeNecessario() {
  if (!personagemEstaSemPontosDeVida()) {
    return false;
  }

  await aplicarConsequencia({
    proximaCena: "fimDerrota",
  });

  return true;
}

function obterAtaqueNpc(configuracao) {
  const npc = window.estadoJogo?.npcs?.[configuracao.npcId];
  const ataque = npc?.ataques?.find((item) => item.id === configuracao.ataqueId);

  return {
    npc,
    ataque,
    personagem: window.estadoJogo?.personagem?.dados,
  };
}

async function resolverAtaqueNpc(configuracao) {
  const { npc, ataque, personagem } = obterAtaqueNpc(configuracao);

  if (!npc || !personagem) {
    console.warn(
      "NPC ou personagem não encontrado para ataque narrativo.",
    );

    return false;
  }

  if (!ataque) {
    console.warn(
      "Ataque do NPC não encontrado:",
      configuracao.ataqueId,
    );

    return false;
  }

  const resultado = resolverAtaqueNpcIndividual(ataque, personagem, configuracao);

  aplicarDanoNarrativo(personagem, resultado.dano);

  if (resultado.dano > 0) {
    await exibirContexto(
      `Você sofreu ${resultado.dano} pontos de dano.`,
    );
  }

  const consequencia =
    configuracao.resultados?.[resultado.acertou ? "acerto" : "erro"];

    registrarEventoNarrativo({
  tipo: "ataqueNpc",
  resultado: resultado.acertou
    ? "acerto"
    : "erro",
  quantidadeAcertos: resultado.acertou ? 1 : 0,
});

if (
  await encaminharParaFimDerrotaSeNecessario()
) {
  return true;
}

  await aplicarConsequencia(consequencia);

  return true;
}

async function resolverAtaquesNpc(configuracao) {
  const { npc, ataque, personagem } = obterAtaqueNpc(configuracao);

  if (!npc || !personagem) {
    console.warn("NPC ou personagem não encontrado para ataques narrativos.");
    return false;
  }

  if (!ataque) {
    console.warn("Ataque do NPC não encontrado:", configuracao.ataqueId);
    return false;
  }

  const quantidade = Math.max(1, Math.floor(Number(configuracao.quantidade) || 1));
  const ataques = Array.from({ length: quantidade }, function () {
    return resolverAtaqueNpcIndividual(ataque, personagem, configuracao);
  });
  const quantidadeAcertos = ataques.filter((resultado) => resultado.acertou).length;
  const quantidadeErros = quantidade - quantidadeAcertos;
  const quantidadeCriticos = ataques.filter(
    (resultado) => resultado.acertoCritico,
  ).length;
  const danoTotal = ataques.reduce((total, resultado) => total + resultado.dano, 0);

  aplicarDanoNarrativo(personagem, danoTotal);

  if (danoTotal > 0) {
    await exibirContexto(`Você sofreu ${danoTotal} pontos de dano.`);
  }

  const consequencia = configuracao.resultadosPorAcertos?.[quantidadeAcertos];

  registrarEventoNarrativo({
    tipo: "ataquesNpc",
    resultado: quantidadeAcertos > 0
      ? "acerto"
      : "erro",
    quantidadeAcertos,
  });

  if (
  await encaminharParaFimDerrotaSeNecessario()
) {
  return {
    quantidadeAtaques: quantidade,
    quantidadeAcertos,
    quantidadeErros,
    quantidadeCriticos,
    danoTotal,
    ataques,
    personagemDerrotado: true,
  };
}

  await aplicarConsequencia(consequencia);

  return {
    quantidadeAtaques: quantidade,
    quantidadeAcertos,
    quantidadeErros,
    quantidadeCriticos,
    danoTotal,
    ataques,
  };
}

async function resolverDescansoCurto(configuracao = {}) {
    const resultadoInicial =
        window.SistemaDescansos?.iniciarDescansoCurto?.();

    if (!resultadoInicial?.sucesso) {
        console.warn(
            "Não foi possível iniciar o descanso curto:",
            resultadoInicial
        );

        await exibirContexto(
            "Você não pode realizar um descanso curto neste momento."
        );

        return;
    }

    await exibirContexto(
        "Após uma hora de repouso, você conclui um descanso curto."
    );

    async function mostrarDecisoesDoDescanso() {
        const personagem =
            window.estadoJogo?.personagem?.dados;

        const pontosDeVida =
            personagem?.combate?.pontosDeVida;

        const vidaAtual =
            Number(pontosDeVida?.atuais ?? 0);

        const vidaMaxima =
            Number(pontosDeVida?.maximo ?? vidaAtual);

        const dadosUsados =
            Number(pontosDeVida?.dadosVidaUsados ?? 0);

        const dadosMaximos =
            Math.max(1, Number(personagem?.nivel) || 1);

        const escolhas = [];

        if (
            vidaAtual < vidaMaxima
            && dadosUsados < dadosMaximos
        ) {
            escolhas.push({
                id: "descanso-curto-gastar-dado-vida",
                texto: `Gastar um Dado de Vida (${dadosUsados}/${dadosMaximos} usados)`,
                registrarNarrativa: false,

                __acaoMotor: async function gastarDadoVidaNoDescanso() {
    const preparacao =
        window.SistemaDescansos
            .prepararGastoDadoVida();

    if (!preparacao?.sucesso) {
        console.warn(
            "Não foi possível preparar o Dado de Vida:",
            preparacao
        );

        await exibirContexto(
            "Você não pode gastar outro Dado de Vida."
        );

        await mostrarDecisoesDoDescanso();
        return;
    }

    if (
        typeof window.configurarRolagemSolicitada
        !== "function"
    ) {
        console.warn(
            "A caixa de dados não está disponível."
        );

        return;
    }

    exibirEscolhas([]);

    await NarradorAventura.adicionarTeste(
        `Lance ${preparacao.dado} para recuperar pontos de vida.`
    );

    estado.descansoCurtoPendente = {
        resolver: async function resolverDadoVida(
            resultadoRolagem
        ) {
            const resultado =
                window.SistemaDescansos
                    .aplicarResultadoDadoVida(
                        resultadoRolagem
                    );

            if (!resultado?.sucesso) {
                console.warn(
                    "Não foi possível aplicar o Dado de Vida:",
                    resultado
                );

                await exibirContexto(
                    "Não foi possível aplicar o resultado do Dado de Vida."
                );

                await mostrarDecisoesDoDescanso();
                return;
            }

            const dados = resultado.resultado;

            const sinalModificador =
                dados.modificadorConstituicao >= 0
                    ? "+"
                    : "";

            await exibirContexto(
                `Você rolou ${dados.dado}: `
                + `${dados.resultadoDado} `
                + `${sinalModificador}`
                + `${dados.modificadorConstituicao} `
                + `de Constituição e recuperou `
                + `${dados.curaAplicada} pontos de vida. `
                + `Seus PV agora são `
                + `${dados.vidaAtual}/${dados.vidaMaxima}.`
            );

            await mostrarDecisoesDoDescanso();
        }
    };

    window.configurarRolagemSolicitada(
        preparacao.solicitacao
    );
}
            });
        }

        escolhas.push({
            id: "descanso-curto-encerrar",
            texto: "Continuar a aventura",
            registrarNarrativa: false,

            __acaoMotor: async function encerrarDescansoCurtoNarrativo() {
                const resultado =
                    window.SistemaDescansos.encerrarDescansoCurto();

                if (!resultado?.sucesso) {
                    console.warn(
                        "Não foi possível encerrar o descanso curto:",
                        resultado
                    );

                    return;
                }

                exibirEscolhas([]);

                if (configuracao.aoConcluir) {
                    await aplicarConsequencia(
                        configuracao.aoConcluir
                    );
                }
            }
        });

        exibirEscolhas(escolhas);
    }

    await mostrarDecisoesDoDescanso();
}

async function resolverDescansoLongo(configuracao = {}) {
    const resultado =
        window.SistemaDescansos
            ?.realizarDescansoLongo?.();

    if (!resultado?.sucesso) {
        const mensagensPorMotivo = {
            personagemAusente:
                "Nenhum personagem está disponível para descansar.",

            combateAtivo:
                "Você não pode realizar um descanso longo durante um combate.",

            personagemSemPontosDeVida:
                "Você precisa ter pelo menos 1 ponto de vida para iniciar um descanso longo.",

            intervaloDescansoLongo:
                "Ainda não passou tempo suficiente desde seu último descanso longo.",

            erroAoSalvarPersonagem:
                "Não foi possível salvar os efeitos do descanso longo."
        };

        await exibirContexto(
            mensagensPorMotivo[resultado?.motivo]
            ?? "Você não pode realizar um descanso longo neste momento."
        );

        console.warn(
            "Não foi possível realizar o descanso longo:",
            resultado
        );

        return;
    }

    const recuperacao = resultado.recuperacao;

    const partesMensagem = [
        "Após oito horas de repouso, você conclui um descanso longo.",
        `Seus pontos de vida foram restaurados para ${
            recuperacao.pontosDeVida.atual
        }.`
    ];

    if (recuperacao.dadosVidaRecuperados > 0) {
        partesMensagem.push(
            `Você recuperou ${
                recuperacao.dadosVidaRecuperados
            } Dado(s) de Vida.`
        );
    }

    if (recuperacao.recursos.length > 0) {
        const nomesRecursos =
            recuperacao.recursos
                .map(function (recurso) {
                    return recurso.nome;
                })
                .join(", ");

        partesMensagem.push(
            `Recursos recuperados: ${nomesRecursos}.`
        );
    }

    await exibirContexto(
        partesMensagem.join(" ")
    );

    if (configuracao.aoConcluir) {
        await aplicarConsequencia(
            configuracao.aoConcluir
        );
    }
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

    if (consequencia.queda) {
  const resultadoQueda =
    SistemaQueda.aplicarDanoQueda(
      window.estadoJogo.personagem.dados,
      consequencia.queda.distanciaMetros,
    );

  if (resultadoQueda?.dano > 0) {
    await exibirContexto(
      `Você sofreu ${resultadoQueda.dano} pontos de dano.`,
    );
  }

  if (resultadoQueda?.dano > 0) {
  await exibirContexto(
    `Você sofreu ${resultadoQueda.dano} pontos de dano.`,
  );

  registrarEventoNarrativo({
    tipo: "queda",
    resultado: personagemEstaSemPontosDeVida()
      ? "derrota"
      : "sobreviveu",
  });

  if (
    await encaminharParaFimDerrotaSeNecessario()
  ) {
    return;
  }
}
}

if (consequencia.memorias) {
  registrarMemorias(
    consequencia.memorias
  );
}

    if (consequencia.fimAventura) {
      exibirTelaFimAventura(
        consequencia.fimAventura
      );

      return;
    }

    if (consequencia.pendenciaFonte) {
      await mostrarPendenciaFonte(consequencia);
      return;
    }

    if (consequencia.ataquesNpc) {
      await resolverAtaquesNpc(consequencia.ataquesNpc);
      return;
    }

    if (consequencia.ataqueNpc) {
  await resolverAtaqueNpc(
    consequencia.ataqueNpc,
  );

  return;
}

if (consequencia.descanso) {
    const descanso = consequencia.descanso;

    if (descanso.tipo === "curto") {
        await resolverDescansoCurto(descanso);
        return;
    }

    if (descanso.tipo === "longo") {
    await resolverDescansoLongo(descanso);
    return;
}

    console.warn(
        "Tipo de descanso desconhecido.",
        descanso.tipo
    );

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

    if (
  consequencia.texto !== undefined
  || consequencia.contexto !== undefined
) {
  return;
}

console.warn(
  "Consequência sem destino executável:",
  consequencia
);
  }

  async function resolverResultadoTeste(resultadoRolagem) {
    const ativo = estado.testeAtivo;

    if (!ativo) {
      return;
    }

    const teste = ativo.teste;

const tipoRolagem =
  ativo.tipoRolagemJogador ?? "normal";

const resultadoRolagemAjustado =
  tipoRolagem === "normal"
    ? resultadoRolagem
    : {
        ...resultadoRolagem,
        total:
          SistemaTestes.calcularTotalTesteD20(
            resultadoRolagem,
            tipoRolagem,
          ),
      };

const resultadoTeste =
  teste.tipo === "oposto"
    ? SistemaTestes.resolverTesteOposto(
        resultadoRolagemAjustado,
        ativo.resultadoOponente,
      )
    : SistemaTestes.resolverTesteContraCd(
        resultadoRolagem,
        teste.dificuldade,
        tipoRolagem,
      );

    const consequencia = ativo.resultados[
      resultadoTeste.sucesso ? "sucesso" : "fracasso"
    ];

    registrarEventoNarrativo({
  tipo: "teste",
  resultado: resultadoTeste.sucesso
    ? "sucesso"
    : "fracasso",
});

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
    const combate =
      window.estadoJogo?.combateAtual;

    const rolagemPertenceAoCombate =
      Boolean(
        combate &&
          (
            combate.efeitoPendente ||
            combate.iniciativaPendenteId ||
            combate.ataquePendente ||
            combate.danoPendente
          ),
      );

      if (
  estado.descansoCurtoPendente
  && !rolagemPertenceAoCombate
) {
  evento.stopImmediatePropagation();

  const pendencia =
    estado.descansoCurtoPendente;

  estado.descansoCurtoPendente = null;

  void pendencia.resolver(
    evento.detail
  );

  return;
}

    if (
      !estado.testeAtivo ||
      rolagemPertenceAoCombate
    ) {
      return;
    }

    evento.stopImmediatePropagation();

    void resolverResultadoTeste(
      evento.detail,
    );
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
