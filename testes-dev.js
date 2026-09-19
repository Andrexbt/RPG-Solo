"use strict";

(function configurarTestesDev() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);

  if (!ambienteLocal) {
    return;
  }

  let saidaPainel = null;
  let seletorEncerramento = null;
  let seletorMapaBatalha = null;
  let colunaJogadorBatalha = null;
  let linhaJogadorBatalha = null;
  let listaInimigosBatalha = null;
  const testesRegistrados = new Map();

  function registrarTeste(teste) {
    if (!teste || typeof teste !== "object") {
      throw new TypeError("O teste deve ser um objeto.");
    }

    if (typeof teste.id !== "string" || teste.id.trim() === "") {
      throw new TypeError("O teste precisa de um id.");
    }

    if (typeof teste.nome !== "string" || teste.nome.trim() === "") {
      throw new TypeError("O teste precisa de um nome.");
    }

    if (typeof teste.executar !== "function") {
      throw new TypeError("O teste precisa de uma função executar.");
    }

    if (testesRegistrados.has(teste.id)) {
      throw new Error(`Já existe um teste com o id "${teste.id}".`);
    }

    testesRegistrados.set(teste.id, Object.freeze({ ...teste }));

    return teste;
  }

  function listarTestes() {
    return Array.from(testesRegistrados.values());
  }

  async function executarTeste(id, contexto = {}) {
    const teste = testesRegistrados.get(id);

    if (!teste) {
      return {
        id,
        status: "erro",
        mensagem: "Teste não encontrado.",
      };
    }

    const inicio = Date.now();

    try {
      const resultado = await teste.executar(contexto);

      return {
        id: teste.id,
        nome: teste.nome,
        categoria: teste.categoria ?? "geral",
        status: resultado?.passou ? "aprovado" : "falhou",
        detalhes: resultado?.detalhes ?? [],
        duracaoMs: Date.now() - inicio,
      };
    } catch (erro) {
      return {
        id: teste.id,
        nome: teste.nome,
        categoria: teste.categoria ?? "geral",
        status: "erro",
        mensagem: erro.message,
        duracaoMs: Date.now() - inicio,
      };
    }
  }

  async function executarTodos(filtro = {}) {
    const resultados = [];

    for (const teste of listarTestes()) {
      if (filtro.categoria && teste.categoria !== filtro.categoria) {
        continue;
      }

      resultados.push(await executarTeste(teste.id, filtro.contexto));
    }

    return resultados;
  }

  function executarContratoFormacaoGuerreiroNivel1() {
    const classe = window.bancoClasses?.guerreiro;
    const progressao = window.bancoHabilidades?.progressaoClasses?.guerreiro?.nivel1;
    const grupos = window.bancoHabilidades?.gruposDeEscolha;
    const estilos = grupos?.estilosDeLuta;
    const maestrias = grupos?.maestriasArmas;
    const verificacoes = [];

    function verificar(descricao, condicao) {
      verificacoes.push({ descricao, passou: Boolean(condicao) });
    }

    verificar("Guerreiro está cadastrado como classe.", classe?.id === "guerreiro");
    verificar("Dado de Vida do Guerreiro é d10.", classe?.dadoVida === 10);
    verificar(
      "Habilidades primárias são Força e Destreza.",
      JSON.stringify(classe?.habilidadePrimaria) === JSON.stringify(["Força", "Destreza"]),
    );
    verificar(
      "Salvaguardas proficientes são Força e Constituição.",
      JSON.stringify(classe?.salvaguardas) === JSON.stringify(["forca", "constituicao"]),
    );
    verificar(
      "Guerreiro escolhe duas perícias de classe.",
      classe?.pericias?.quantidade === 2,
    );
    verificar(
      "Opções de perícia não possuem duplicatas.",
      Array.isArray(classe?.pericias?.opcoes) &&
        new Set(classe.pericias.opcoes).size === classe.pericias.opcoes.length,
    );
    verificar(
      "Guerreiro possui proficiência com armas simples e marciais.",
      classe?.proficiencias?.armas?.includes("Armas simples") &&
        classe.proficiencias.armas.includes("Armas marciais"),
    );
    verificar(
      "Guerreiro possui proficiência com armaduras leves, médias, pesadas e escudos.",
      ["Armaduras leves", "Armaduras médias", "Armaduras pesadas", "Escudos"].every(
        (proficiencia) => classe?.proficiencias?.armaduras?.includes(proficiencia),
      ),
    );
    verificar(
      "Segundo Fôlego e Maestria com Armas são características automáticas.",
      ["segundoFolego", "maestriaComArmas"].every((habilidadeId) =>
        progressao?.classFeaturesAutomaticas?.includes(habilidadeId),
      ),
    );

    const escolhaEstilo = progressao?.escolhas?.find(
      (escolha) => escolha.grupo === "estilosDeLuta",
    );
    const escolhaMaestrias = progressao?.escolhas?.find(
      (escolha) => escolha.grupo === "maestriasArmas",
    );

    verificar(
      "A progressão exige exatamente um Estilo de Luta.",
      escolhaEstilo?.quantidade === 1 && estilos?.quantidadeEscolhas === 1,
    );
    verificar(
      "As opções de Estilo de Luta possuem identificadores únicos.",
      Array.isArray(estilos?.opcoes) &&
        estilos.opcoes.length > 0 &&
        new Set(estilos.opcoes.map((opcao) => opcao.id)).size === estilos.opcoes.length,
    );
    verificar(
      "A progressão exige exatamente três escolhas de Maestria em Armas.",
      classe?.maestriasArmas?.quantidade === 3 &&
        escolhaMaestrias?.quantidade === 3 &&
        maestrias?.quantidadeEscolhas === 3,
    );

    const constituicaoExemplo = 16;
    const pontosDeVidaEsperados = window.PersonagemDados?.calcularPontosDeVidaIniciais({
      dadoVida: classe?.dadoVida,
      constituicao: constituicaoExemplo,
    });

    verificar(
      "PV inicial usa o d10 cheio mais o modificador de Constituição.",
      pontosDeVidaEsperados === 13,
    );

    const detalhes = verificacoes.map(
      (verificacao) => `${verificacao.passou ? "✓" : "✗"} ${verificacao.descricao}`,
    );

    detalhes.push(
      "◐ Integração da formação com a tela de criação ainda requer um cenário automatizado próprio.",
    );

    return {
      passou: verificacoes.every((verificacao) => verificacao.passou),
      detalhes,
    };
  }

  registrarTeste({
    id: "guerreiro.formacao.nivel1",
    nome: "Formação do Guerreiro N1",
    categoria: "guerreiro-n1",
    executar: executarContratoFormacaoGuerreiroNivel1,
  });

  function executarAuditoriaClasseArmaduraGuerreiro() {
    function criarGuerreiro({
      destreza = 14,
      armadura = "semArmadura",
      itemSecundario = "nada",
      estilo = null,
    } = {}) {
      return {
        classeId: "guerreiro",
        atributos: { destreza },
        habilidades: { escolhas: { estilosDeLuta: estilo } },
        detalhes: { equipamentos: { armadura, itemSecundario } },
      };
    }

    const casos = [
      ["Sem armadura com Destreza 14", criarGuerreiro(), 12],
      [
        "Armadura leve soma toda a Destreza",
        criarGuerreiro({ destreza: 18, armadura: "couro" }),
        15,
      ],
      [
        "Armadura média limita a Destreza a +2",
        criarGuerreiro({ destreza: 18, armadura: "peitoral" }),
        16,
      ],
      [
        "Armadura pesada ignora a Destreza",
        criarGuerreiro({ destreza: 8, armadura: "cotaDeMalha" }),
        16,
      ],
      [
        "Escudo acrescenta +2",
        criarGuerreiro({ armadura: "cotaDeMalha", itemSecundario: "escudo" }),
        18,
      ],
      [
        "Estilo Defesa acrescenta +1 com armadura",
        criarGuerreiro({ armadura: "cotaDeMalha", estilo: "defesa" }),
        17,
      ],
      [
        "Estilo Defesa não funciona sem armadura",
        criarGuerreiro({ armadura: "semArmadura", estilo: "defesa" }),
        12,
      ],
    ];

    const resultados = casos.map(([nome, personagem, esperado]) => {
      const obtido = window.calcularClasseArmadura(personagem);

      return {
        nome,
        passou: obtido === esperado,
        esperado,
        obtido,
      };
    });

    return {
      passou: resultados.every((resultado) => resultado.passou),
      detalhes: resultados.map(
        (resultado) =>
          `${resultado.passou ? "✓" : "✗"} ${resultado.nome}: ${resultado.obtido} (esperado ${resultado.esperado}).`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.classeArmadura",
    nome: "Classe de Armadura do Guerreiro",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaClasseArmaduraGuerreiro,
  });

  function executarAuditoriaEquipamentoInicialGuerreiro() {
    const classe = window.bancoClasses?.guerreiro;
    const antecedente = window.bancoAntecedentes?.soldado;
    const personagemTeste = window.PersonagemDados?.criarInicial();
    const verificacoes = [];

    function verificar(descricao, condicao) {
      verificacoes.push({ descricao, passou: Boolean(condicao) });
    }

    verificar("Guerreiro recebe 155 PO fixos.", classe?.economiaInicial?.ouroFixo === 155);
    verificar(
      "Guerreiro recebe 2.015 PO de orçamento exclusivo.",
      classe?.economiaInicial?.orcamentoEquipamentos === 2015,
    );
    verificar(
      "Guerreiro retém 5% do saldo do orçamento.",
      classe?.economiaInicial?.percentualRetencao === 5,
    );
    verificar(
      "Guerreiro é proficiente com armas simples e marciais exibidas na loja.",
      Object.keys(window.bancoEquipamentos?.armas ?? {}).every((idArma) =>
        window.RegrasEquipamentos?.personagemTemProficienciaComArma(
          { classeId: "guerreiro" },
          idArma,
        ),
      ),
    );
    verificar(
      "Uma classe sem treinamento marcial é identificada como não proficiente.",
      window.RegrasEquipamentos?.personagemTemProficienciaComArma(
        { classeId: "ladino" },
        "espadaGrande",
      ) === false,
    );
    verificar(
      "Arma Pesada corpo a corpo consulta Força 13.",
      window.RegrasEquipamentos?.avaliarUsoArma(
        { classeId: "guerreiro", atributos: { forca: 12, destreza: 18 } },
        "espadaGrande",
      ).adequado === false &&
        window.RegrasEquipamentos?.avaliarUsoArma(
          { classeId: "guerreiro", atributos: { forca: 13, destreza: 8 } },
          "espadaGrande",
        ).adequado === true,
    );
    verificar(
      "Arma Pesada à distância consulta Destreza 13.",
      window.RegrasEquipamentos?.avaliarUsoArma(
        { classeId: "guerreiro", atributos: { forca: 18, destreza: 12 } },
        "arcoLongo",
      ).adequado === false,
    );
    verificar(
      "Armadura considera treinamento e requisito de Força.",
      window.RegrasEquipamentos?.avaliarUsoArmadura(
        { classeId: "guerreiro", atributos: { forca: 13 } },
        "cotaDeMalha",
      ).adequado === true &&
        window.RegrasEquipamentos?.avaliarUsoArmadura(
          { classeId: "ladino", atributos: { forca: 13 } },
          "cotaDeMalha",
        ).adequado === false,
    );

    if (personagemTeste && classe && antecedente) {
      window.PersonagemDados.sincronizarBeneficiosIniciais(personagemTeste, {
        classe,
        antecedente,
      });
      window.PersonagemDados.comprarEquipamentoInicial(personagemTeste, {
        categoria: "armas",
        id: "espadaGrande",
        precoPO: window.bancoEquipamentos.armas.espadaGrande.precoPO,
      });
      personagemTeste.configuracaoInicialCombate.mao1 = {
        categoria: "armas",
        id: "espadaGrande",
      };
      personagemTeste.configuracaoInicialCombate.mao2 = { ocupadaPor: "mao1" };

      const personagemRecarregado = window.PersonagemDados.normalizar(personagemTeste);

      verificar(
        "Equipamento de Aventura é concedido automaticamente.",
        personagemTeste.inventario.itens.some((item) => item.id === "equipamentoAventura"),
      );
      verificar(
        "A ferramenta do antecedente é concedida automaticamente.",
        personagemTeste.inventario.itens.some((item) => item.id === "conjuntoJogos"),
      );
      verificar(
        "Compras são registradas no inventário canônico.",
        personagemTeste.inventario.itens.some((item) => item.id === "espadaGrande"),
      );
      verificar(
        "Configuração inicial de duas mãos persiste após recarregamento.",
        personagemRecarregado.configuracaoInicialCombate.mao1?.id === "espadaGrande" &&
          personagemRecarregado.configuracaoInicialCombate.mao2?.ocupadaPor === "mao1",
      );
    }

    const detalhes = verificacoes.map(
      (verificacao) => `${verificacao.passou ? "✓" : "✗"} ${verificacao.descricao}`,
    );
    detalhes.push("◐ Pendente: adicionar escudos e munições ao fluxo visual da loja.");

    return {
      passou: verificacoes.every((verificacao) => verificacao.passou),
      detalhes,
    };
  }

  registrarTeste({
    id: "guerreiro.equipamentoInicial",
    nome: "Equipamento inicial do Guerreiro",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaEquipamentoInicialGuerreiro,
  });

  let cenarioSapAtual = null;

  function criarEstadoCenarioSap() {
    const guerreiro = {
      id: "guerreiro-sap-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 5, linha: 5 },
      habilidades: {
        escolhas: {
          maestriasArmas: ["espadaLonga"],
        },
      },
      ataques: [],
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
    };

    const inimigo = {
      id: "inimigo-sap-dev",
      nome: "Inimigo",
      tipo: "inimigo",
      estado: "ativo",
      classeArmadura: 12,
      posicao: { coluna: 6, linha: 5 },
      atributos: { forca: 14, destreza: 10 },
      habilidades: { escolhas: {} },
      ataques: [
        {
          id: "clava-inimigo-sap-dev",
          armaId: "clava",
          nome: "Clava",
          categoria: "corpoACorpo",
          propriedades: [],
          bonusAtaque: 3,
          custoPadrao: "acao",
          selecao: {
            tipo: "criatura",
            alcance: { normal: 1, longo: null },
          },
          dano: {
            gruposDeDados: [{ quantidade: 1, numeroDeFaces: 4 }],
            modificador: 2,
            tipo: "contundente",
          },
        },
      ],
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
    };

    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [inimigo.id, guerreiro.id],
      participanteAtivoId: inimigo.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes: [guerreiro, inimigo],
      efeitosTemporarios: [],
      objetivos: [],
      ataquePendente: null,
      danoPendente: null,
    };

    const ataqueSap = {
      id: "espadaLonga:principal",
      armaId: "espadaLonga",
      maestriaId: "sap",
    };

    const operacaoSap = window.TradutorRegras.prepararOperacoes({
      gatilho: "aposAcertarAtaque",
      participante: guerreiro,
      ataque: ataqueSap,
      alvo: inimigo,
    }).find((operacao) => operacao.tipo === "concederDesvantagem");

    if (!operacaoSap) {
      throw new Error("Sap não foi preparado para a arma dominada.");
    }

    const aplicacao = window.SistemaCombate.aplicarDesvantagemTemporaria(combate, operacaoSap);

    if (!aplicacao.sucesso) {
      throw new Error(`Sap não foi aplicado: ${aplicacao.motivo}.`);
    }

    return { combate, guerreiro, inimigo, ataqueSap, operacaoSap };
  }

  function prepararCenarioSap() {
    cenarioSapAtual = criarEstadoCenarioSap();

    return {
      passou: cenarioSapAtual.combate.efeitosTemporarios.length === 1,
      detalhes: [
        "Guerreiro acertou com Espada Longa dominada.",
        "Inimigo recebeu Sap e está pronto para atacar.",
      ],
      estado: cenarioSapAtual,
    };
  }

  function executarAtaqueCenarioSap() {
    if (!cenarioSapAtual) {
      return {
        passou: false,
        detalhes: ["Prepare o cenário de Sap antes de executar o ataque."],
      };
    }

    const { combate, guerreiro, inimigo } = cenarioSapAtual;
    const ataque = inimigo.ataques[0];
    const preparacao = window.SistemaCombate.prepararAtaque(
      combate,
      inimigo.id,
      guerreiro.id,
      ataque.id,
    );

    if (!preparacao.sucesso) {
      return {
        passou: false,
        detalhes: [`O ataque não pôde ser preparado: ${preparacao.motivo}.`],
      };
    }

    const resultado = window.SistemaCombate.resolverAtaque(combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [17, 4] }],
      modificador: ataque.bonusAtaque,
    });
    const sapFoiConsumido = !combate.efeitosTemporarios.some(
      (efeito) => efeito.origem?.id === "sap",
    );

    return {
      passou:
        preparacao.tipoRolagem === "desvantagem" &&
        resultado.resultadoNatural === 4 &&
        sapFoiConsumido,
      detalhes: [
        `Rolagem preparada como ${preparacao.tipoRolagem}.`,
        `Entre 17 e 4, o resultado usado foi ${resultado.resultadoNatural}.`,
        sapFoiConsumido ? "Sap foi consumido." : "Sap permaneceu ativo indevidamente.",
      ],
      estado: cenarioSapAtual,
    };
  }

  function executarExpiracaoCenarioSap() {
    const contexto = criarEstadoCenarioSap();
    contexto.combate.ordemTurnos = [contexto.guerreiro.id, contexto.inimigo.id];
    contexto.combate.indiceTurno = 0;

    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);

    const sapExpirou = !contexto.combate.efeitosTemporarios.some(
      (efeito) => efeito.origem?.id === "sap",
    );

    return {
      passou: sapExpirou,
      detalhes: [
        sapExpirou
          ? "Sap expirou no início do próximo turno do Guerreiro."
          : "Sap permaneceu ativo além do limite.",
      ],
    };
  }

  function executarAplicacoesRepetidasCenarioSap() {
    cenarioSapAtual = criarEstadoCenarioSap();
    window.SistemaCombate.aplicarDesvantagemTemporaria(
      cenarioSapAtual.combate,
      cenarioSapAtual.operacaoSap,
    );

    const primeiroAtaque = executarAtaqueCenarioSap();
    cenarioSapAtual.inimigo.acaoDisponivel = true;

    const segundaPreparacao = window.SistemaCombate.prepararAtaque(
      cenarioSapAtual.combate,
      cenarioSapAtual.inimigo.id,
      cenarioSapAtual.guerreiro.id,
      cenarioSapAtual.inimigo.ataques[0].id,
    );
    const voltouAoNormal = segundaPreparacao.tipoRolagem === "normal";

    return {
      passou: primeiroAtaque.passou && voltouAoNormal,
      detalhes: [
        "Duas aplicações simultâneas foram consumidas pelo mesmo ataque.",
        voltouAoNormal
          ? "O ataque seguinte voltou ao modo normal."
          : "O ataque seguinte permaneceu com desvantagem indevidamente.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.sap",
    nome: "Maestria Sap",
    categoria: "guerreiro-n1",
    executar() {
      const preparacao = prepararCenarioSap();
      const ataque = executarAtaqueCenarioSap();
      const expiracao = executarExpiracaoCenarioSap();
      const repeticoes = executarAplicacoesRepetidasCenarioSap();

      return {
        passou: preparacao.passou && ataque.passou && expiracao.passou && repeticoes.passou,
        detalhes: [
          ...preparacao.detalhes,
          ...ataque.detalhes,
          ...expiracao.detalhes,
          ...repeticoes.detalhes,
        ],
      };
    },
  });

  function criarEstadoCenarioVex() {
    const ataque = {
      id: "rapieira-vex-dev",
      armaId: "rapieira",
      maestriaId: "vex",
      nome: "Rapieira",
      categoria: "corpoACorpo",
      atributoId: "forca",
      propriedades: [],
      bonusAtaque: 5,
      custoPadrao: "acao",
      selecao: { tipo: "criatura", alcance: { normal: 1, longo: null } },
      dano: {
        gruposDeDados: [{ quantidade: 1, numeroDeFaces: 8 }],
        modificador: 3,
        tipo: "perfurante",
      },
    };
    const guerreiro = {
      id: "guerreiro-vex-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 5, linha: 5 },
      atributos: { forca: 16, destreza: 10 },
      habilidades: { escolhas: { maestriasArmas: ["rapieira"] } },
      ataques: [ataque],
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
    };
    const alvo = {
      id: "alvo-vex-dev",
      nome: "Alvo de Vex",
      tipo: "inimigo",
      estado: "ativo",
      classeArmadura: 12,
      posicao: { coluna: 6, linha: 5 },
      pontosDeVida: { atuais: 20, maximo: 20 },
      habilidades: { escolhas: {} },
      ataques: [],
    };
    const outroAlvo = {
      ...structuredClone(alvo),
      id: "outro-alvo-vex-dev",
      nome: "Outro alvo",
      posicao: { coluna: 5, linha: 6 },
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [guerreiro.id, alvo.id, outroAlvo.id],
      participanteAtivoId: guerreiro.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes: [guerreiro, alvo, outroAlvo],
      efeitosTemporarios: [],
      objetivos: [],
    };

    return { combate, guerreiro, alvo, outroAlvo, ataque };
  }

  function aplicarVexNoCenario(contexto) {
    contexto.combate.danoPendente = {
      atacanteId: contexto.guerreiro.id,
      alvoId: contexto.alvo.id,
      ataqueId: contexto.ataque.id,
      critico: false,
      efeitos: [],
    };

    return window.SistemaCombate.resolverDano(contexto.combate, { total: 1 });
  }

  function executarCenarioCompletoVex() {
    const contexto = criarEstadoCenarioVex();
    aplicarVexNoCenario(contexto);

    const contraOutroAlvo = window.SistemaCombate.prepararAtaque(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.outroAlvo.id,
      contexto.ataque.id,
      { custo: "nenhum" },
    );
    contexto.combate.ataquePendente = null;

    aplicarVexNoCenario(contexto);
    const contraAlvoCorreto = window.SistemaCombate.prepararAtaque(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.alvo.id,
      contexto.ataque.id,
      { custo: "nenhum" },
    );
    const resultadoAtaque = window.SistemaCombate.resolverAtaque(contexto.combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [4, 17] }],
      modificador: 5,
    });
    contexto.guerreiro.acaoDisponivel = true;
    const ataquePosterior = window.SistemaCombate.prepararAtaque(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.alvo.id,
      contexto.ataque.id,
      { custo: "nenhum" },
    );

    const contextoExpiracao = criarEstadoCenarioVex();
    aplicarVexNoCenario(contextoExpiracao);
    contextoExpiracao.combate.rodada = 2;
    contextoExpiracao.combate.ordemTurnos = [contextoExpiracao.guerreiro.id];
    contextoExpiracao.combate.indiceTurno = 0;
    contextoExpiracao.combate.participanteAtivoId = contextoExpiracao.guerreiro.id;
    window.SistemaCombate.encerrarTurno(contextoExpiracao.combate);
    const expirou = contextoExpiracao.combate.efeitosTemporarios.length === 0;

    const passou =
      contraOutroAlvo.tipoRolagem === "normal" &&
      contraAlvoCorreto.tipoRolagem === "vantagem" &&
      resultadoAtaque.resultadoNatural === 17 &&
      contexto.combate.efeitosTemporarios.length === 0 &&
      ataquePosterior.tipoRolagem === "normal" &&
      expirou;

    return {
      passou,
      detalhes: [
        "Vex foi aplicado após causar dano com Rapieira dominada.",
        `Ataque contra outro alvo: ${contraOutroAlvo.tipoRolagem}.`,
        `Ataque contra o alvo de Vex: ${contraAlvoCorreto.tipoRolagem}.`,
        `Entre 4 e 17, o resultado usado foi ${resultadoAtaque.resultadoNatural}.`,
        contexto.combate.efeitosTemporarios.length === 0
          ? "Todas as aplicações simultâneas foram consumidas."
          : "Uma aplicação de Vex permaneceu indevidamente.",
        `Ataque posterior contra o mesmo alvo: ${ataquePosterior.tipoRolagem}.`,
        expirou ? "Vex expirou ao fim do próximo turno." : "Vex não expirou corretamente.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.vex",
    nome: "Maestria Vex",
    categoria: "guerreiro-n1",
    executar: executarCenarioCompletoVex,
  });

  function criarEstadoCenarioSlow({ dominaArma = true } = {}) {
    const ataque = {
      id: "azagaia-slow-dev",
      armaId: "azagaia",
      maestriaId: "slow",
    };
    const guerreiro = {
      id: "guerreiro-slow-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      habilidades: {
        escolhas: {
          maestriasArmas: dominaArma ? ["azagaia"] : [],
        },
      },
    };
    const alvo = {
      id: "alvo-slow-dev",
      nome: "Alvo de Slow",
      tipo: "inimigo",
      estado: "ativo",
      movimentoMaximo: 6,
      movimentoRestante: 6,
      habilidades: { escolhas: {} },
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [guerreiro.id, alvo.id],
      participanteAtivoId: guerreiro.id,
      participantes: [guerreiro, alvo],
      efeitosTemporarios: [],
    };

    return { combate, guerreiro, alvo, ataque };
  }

  function prepararSlowNoCenario(contexto, gatilho = "aposCausarDano") {
    return window.TradutorRegras.prepararOperacoes({
      gatilho,
      participante: contexto.guerreiro,
      ataque: contexto.ataque,
      alvo: contexto.alvo,
    }).find((operacao) => operacao.tipo === "modificarDeslocamento");
  }

  function executarCenarioCompletoSlow() {
    const contexto = criarEstadoCenarioSlow();
    const operacao = prepararSlowNoCenario(contexto);

    if (!operacao) {
      return {
        passou: false,
        detalhes: ["Slow não foi preparado após causar dano com a arma dominada."],
      };
    }

    const primeiraAplicacao = window.SistemaCombate.aplicarModificadorDeslocamentoTemporario(
      contexto.combate,
      operacao,
    );
    const movimentoAposAplicacao = contexto.alvo.movimentoRestante;
    const segundaAplicacao = window.SistemaCombate.aplicarModificadorDeslocamentoTemporario(
      contexto.combate,
      operacao,
    );
    const movimentoAposRepeticao = contexto.alvo.movimentoRestante;

    contexto.combate.indiceTurno = 1;
    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);
    const movimentoNoTurnoDoAlvo = contexto.alvo.movimentoRestante;

    contexto.combate.indiceTurno = 0;
    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);
    const expirou = contexto.combate.efeitosTemporarios.length === 0;

    contexto.combate.indiceTurno = 1;
    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);
    const movimentoRestaurado = contexto.alvo.movimentoRestante;

    const contextoSemDominio = criarEstadoCenarioSlow({ dominaArma: false });
    const semDominio = prepararSlowNoCenario(contextoSemDominio) === undefined;
    const gatilhoAntecipado = prepararSlowNoCenario(criarEstadoCenarioSlow(), "aposAcertarAtaque");
    const respeitouGatilho = gatilhoAntecipado === undefined;

    const passou =
      primeiraAplicacao.sucesso &&
      primeiraAplicacao.aplicado &&
      movimentoAposAplicacao === 4 &&
      segundaAplicacao.sucesso &&
      !segundaAplicacao.aplicado &&
      segundaAplicacao.motivo === "efeitoNaoAcumula" &&
      movimentoAposRepeticao === 4 &&
      contexto.combate.efeitosTemporarios.length === 0 &&
      movimentoNoTurnoDoAlvo === 4 &&
      expirou &&
      movimentoRestaurado === 6 &&
      semDominio &&
      respeitouGatilho;

    return {
      passou,
      detalhes: [
        `Movimento após Slow: ${movimentoAposAplicacao} de 6 células.`,
        segundaAplicacao.aplicado
          ? "Slow acumulou indevidamente na segunda aplicação."
          : "A segunda aplicação não acumulou.",
        `Movimento no turno do alvo: ${movimentoNoTurnoDoAlvo} células.`,
        expirou
          ? "Slow expirou no início do próximo turno do Guerreiro."
          : "Slow permaneceu ativo além do limite.",
        `Movimento restaurado no turno seguinte do alvo: ${movimentoRestaurado} células.`,
        semDominio ? "Arma não dominada não ativou Slow." : "Arma não dominada ativou Slow.",
        respeitouGatilho
          ? "Slow só foi oferecido após causar dano."
          : "Slow foi oferecido antes de causar dano.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.slow",
    nome: "Maestria Slow",
    categoria: "guerreiro-n1",
    executar: executarCenarioCompletoSlow,
  });

  function criarEstadoCenarioTopple({ dominaArma = true } = {}) {
    const ataque = {
      id: "machado-batalha-topple-dev",
      armaId: "machadoDeBatalha",
      maestriaId: "topple",
      nome: "Machado de Batalha",
      categoria: "corpoACorpo",
      atributoId: "forca",
      propriedades: [],
      bonusAtaque: 5,
      custoPadrao: "acao",
      selecao: { tipo: "criatura", alcance: { normal: 1, longo: null } },
      dano: {
        gruposDeDados: [{ quantidade: 1, numeroDeFaces: 8 }],
        modificador: 3,
        tipo: "cortante",
      },
    };
    const guerreiro = {
      id: "guerreiro-topple-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 5, linha: 5 },
      atributos: { forca: 16, destreza: 10, constituicao: 14 },
      bonusProficiencia: 2,
      salvaguardas: ["forca", "constituicao"],
      habilidades: {
        escolhas: {
          maestriasArmas: dominaArma ? ["machadoDeBatalha"] : [],
        },
      },
      ataques: [ataque],
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
      movimentoMaximo: 6,
      movimentoRestante: 6,
    };
    const alvo = {
      id: "alvo-topple-dev",
      nome: "Alvo de Topple",
      tipo: "inimigo",
      estado: "ativo",
      classeArmadura: 12,
      posicao: { coluna: 6, linha: 5 },
      atributos: { forca: 12, destreza: 12, constituicao: 14 },
      bonusProficiencia: 2,
      salvaguardas: [],
      habilidades: { escolhas: {} },
      ataques: [],
      condicoes: [],
      movimentoMaximo: 6,
      movimentoRestante: 6,
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [guerreiro.id, alvo.id],
      participanteAtivoId: guerreiro.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes: [guerreiro, alvo],
      efeitosTemporarios: [],
      objetivos: [],
    };

    return { combate, guerreiro, alvo, ataque };
  }

  function prepararToppleNoCenario(contexto, gatilho = "aposAcertarAtaque") {
    return window.TradutorRegras.prepararOperacoes({
      gatilho,
      participante: contexto.guerreiro,
      ataque: contexto.ataque,
      alvo: contexto.alvo,
    }).find((operacao) => operacao.tipo === "solicitarSalvaguarda");
  }

  function criarRolagemSalvaguarda(total) {
    return {
      tipo: "rolagemComposta",
      grupos: [{ numeroDeFaces: 20, resultados: [total - 2] }],
      modificador: 2,
      total,
    };
  }

  function executarCenarioCompletoTopple() {
    const contextoFracasso = criarEstadoCenarioTopple();
    const operacao = prepararToppleNoCenario(contextoFracasso);

    if (!operacao) {
      return {
        passou: false,
        detalhes: ["Topple não foi preparado após o acerto com a arma dominada."],
      };
    }

    const resultadoFracasso = window.SistemaCombate.resolverSalvaguardaCombate(
      contextoFracasso.combate,
      operacao,
      criarRolagemSalvaguarda(12),
    );
    const ficouCaido = contextoFracasso.alvo.condicoes.some(
      (condicao) => condicao.id === "caido",
    );

    const ataqueProximo = window.SistemaCombate.prepararAtaque(
      contextoFracasso.combate,
      contextoFracasso.guerreiro.id,
      contextoFracasso.alvo.id,
      contextoFracasso.ataque.id,
      { custo: "nenhum" },
    );
    contextoFracasso.combate.ataquePendente = null;
    contextoFracasso.alvo.posicao = { coluna: 8, linha: 5 };
    contextoFracasso.ataque.selecao.alcance = { normal: 6, longo: 12 };
    contextoFracasso.ataque.categoria = "distancia";
    const ataqueDistante = window.SistemaCombate.prepararAtaque(
      contextoFracasso.combate,
      contextoFracasso.guerreiro.id,
      contextoFracasso.alvo.id,
      contextoFracasso.ataque.id,
      { custo: "nenhum" },
    );

    contextoFracasso.combate.indiceTurno = 1;
    window.SistemaCombate.iniciarTurnoAtual(contextoFracasso.combate);
    const movimentoAoLevantar = contextoFracasso.alvo.movimentoRestante;
    const levantou = !contextoFracasso.alvo.condicoes.some((condicao) => condicao.id === "caido");

    const contextoSucesso = criarEstadoCenarioTopple();
    const resultadoSucesso = window.SistemaCombate.resolverSalvaguardaCombate(
      contextoSucesso.combate,
      prepararToppleNoCenario(contextoSucesso),
      criarRolagemSalvaguarda(13),
    );
    const permaneceuEmPe = contextoSucesso.alvo.condicoes.length === 0;

    const contextoSemDominio = criarEstadoCenarioTopple({ dominaArma: false });
    const semDominio = prepararToppleNoCenario(contextoSemDominio) === undefined;
    const respeitouGatilho =
      prepararToppleNoCenario(criarEstadoCenarioTopple(), "aposErrarAtaque") === undefined;

    const passou =
      operacao.dificuldade === 13 &&
      operacao.opcional === true &&
      resultadoFracasso.sucesso &&
      !resultadoFracasso.passou &&
      ficouCaido &&
      ataqueProximo.tipoRolagem === "vantagem" &&
      ataqueDistante.tipoRolagem === "desvantagem" &&
      levantou &&
      movimentoAoLevantar === 3 &&
      resultadoSucesso.sucesso &&
      resultadoSucesso.passou &&
      permaneceuEmPe &&
      semDominio &&
      respeitouGatilho;

    return {
      passou,
      detalhes: [
        `CD de Topple: ${operacao.dificuldade}.`,
        operacao.opcional ? "Topple é uma escolha opcional." : "Topple deixou de ser opcional.",
        ficouCaido
          ? "O alvo falhou com 12 e recebeu a condição Caído."
          : "O alvo falhou, mas não recebeu a condição Caído.",
        `Ataque a 1 célula contra o alvo Caído: ${ataqueProximo.tipoRolagem}.`,
        `Ataque distante contra o alvo Caído: ${ataqueDistante.tipoRolagem}.`,
        levantou
          ? `O alvo se levantou usando metade do movimento: restaram ${movimentoAoLevantar} células.`
          : "O alvo não se levantou no início do turno.",
        permaneceuEmPe
          ? "O alvo obteve 13, igualou a CD e permaneceu de pé."
          : "O alvo foi derrubado mesmo após igualar a CD.",
        semDominio ? "Arma não dominada não ativou Topple." : "Arma não dominada ativou Topple.",
        respeitouGatilho ? "Um ataque errado não ativou Topple." : "Um ataque errado ativou Topple.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.topple",
    nome: "Maestria Topple",
    categoria: "guerreiro-n1",
    executar: executarCenarioCompletoTopple,
  });

  function criarEstadoCenarioCleave({ forca = 16, dominaArma = true } = {}) {
    const ataque = {
      id: "glaive-cleave-dev",
      armaId: "glaive",
      maestriaId: "cleave",
      nome: "Glaive",
      categoria: "corpoACorpo",
      atributoId: "forca",
      propriedades: ["pesada", "alcance", "duasMaos"],
      bonusAtaque: 5,
      custoPadrao: "acao",
      selecao: { tipo: "criatura", alcance: { normal: 2, longo: null } },
      dano: {
        gruposDeDados: [{ quantidade: 1, numeroDeFaces: 10 }],
        modificador: 3,
        tipo: "cortante",
      },
    };
    const guerreiro = {
      id: "guerreiro-cleave-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 5, linha: 5 },
      atributos: { forca, destreza: 10 },
      habilidades: {
        escolhas: {
          maestriasArmas: dominaArma ? ["glaive"] : [],
        },
      },
      ataques: [ataque],
      acaoDisponivel: false,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
      maestriasUsadasTurno: [],
    };
    const criarAlvo = (id, nome, coluna, linha, tipo = "inimigo") => ({
      id,
      nome,
      tipo,
      estado: "ativo",
      classeArmadura: 12,
      posicao: { coluna, linha },
      pontosDeVida: { atuais: 20, maximo: 20 },
      habilidades: { escolhas: {} },
      ataques: [],
    });
    const primeiroAlvo = criarAlvo("primeiro-cleave-dev", "Primeiro alvo", 6, 5);
    const segundoAlvo = criarAlvo("segundo-cleave-dev", "Segundo alvo", 7, 5);
    const longeDoPrimeiro = criarAlvo("longe-primeiro-cleave-dev", "Longe do primeiro", 5, 7);
    const foraDoAlcance = criarAlvo("fora-alcance-cleave-dev", "Fora do alcance", 8, 5);
    const aliado = criarAlvo("aliado-cleave-dev", "Aliado", 6, 6, "jogador");
    const participantes = [
      guerreiro,
      primeiroAlvo,
      segundoAlvo,
      longeDoPrimeiro,
      foraDoAlcance,
      aliado,
    ];
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: participantes.map((participante) => participante.id),
      participanteAtivoId: guerreiro.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes,
      efeitosTemporarios: [],
      objetivos: [],
    };

    return {
      combate,
      guerreiro,
      primeiroAlvo,
      segundoAlvo,
      longeDoPrimeiro,
      foraDoAlcance,
      aliado,
      ataque,
    };
  }

  function prepararCleaveNoCenario(contexto, gatilho = "aposAcertarAtaque") {
    return window.TradutorRegras.prepararOperacoes({
      gatilho,
      participante: contexto.guerreiro,
      ataque: contexto.ataque,
      alvo: contexto.primeiroAlvo,
    }).find((operacao) => operacao.tipo === "permitirAtaqueAdicional");
  }

  function executarCenarioCompletoCleave() {
    const contexto = criarEstadoCenarioCleave();
    const operacao = prepararCleaveNoCenario(contexto);
    const alvos = window.SistemaCombate.listarAlvosCleave(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.primeiroAlvo.id,
      contexto.ataque.id,
    );
    const idsAlvos = alvos.map((alvo) => alvo.id);
    const somenteSegundoAlvoElegivel =
      idsAlvos.length === 1 && idsAlvos[0] === contexto.segundoAlvo.id;

    const preparacao = window.SistemaCombate.prepararAtaqueCleave(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.primeiroAlvo.id,
      contexto.segundoAlvo.id,
      contexto.ataque.id,
    );
    const acaoAntesDoAtaque = contexto.guerreiro.acaoDisponivel;
    const resultadoAtaque = window.SistemaCombate.resolverAtaque(contexto.combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [15] }],
      modificador: contexto.ataque.bonusAtaque,
    });
    const modificadorDanoCleave = resultadoAtaque.ataque.dano.modificador;
    const acaoDepoisDoAtaque = contexto.guerreiro.acaoDisponivel;
    const marcouUso = contexto.guerreiro.maestriasUsadasTurno.includes("cleave");
    const segundaTentativa = window.SistemaCombate.prepararAtaqueCleave(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.primeiroAlvo.id,
      contexto.segundoAlvo.id,
      contexto.ataque.id,
    );

    contexto.combate.indiceTurno = 0;
    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);
    const recarregouNoTurno = !contexto.guerreiro.maestriasUsadasTurno.includes("cleave");

    const contextoNegativo = criarEstadoCenarioCleave({ forca: 8 });
    contextoNegativo.ataque.bonusAtaque = 1;
    const preparacaoNegativa = window.SistemaCombate.prepararAtaqueCleave(
      contextoNegativo.combate,
      contextoNegativo.guerreiro.id,
      contextoNegativo.primeiroAlvo.id,
      contextoNegativo.segundoAlvo.id,
      contextoNegativo.ataque.id,
    );
    const resultadoNegativo = window.SistemaCombate.resolverAtaque(contextoNegativo.combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [15] }],
      modificador: 1,
    });
    const modificadorNegativoMantido = resultadoNegativo.ataque.dano.modificador === -1;

    const contextoSemDominio = criarEstadoCenarioCleave({ dominaArma: false });
    const semDominio = prepararCleaveNoCenario(contextoSemDominio) === undefined;
    const contextoDistancia = criarEstadoCenarioCleave();
    contextoDistancia.ataque.categoria = "distancia";
    const somenteCorpoACorpo = prepararCleaveNoCenario(contextoDistancia) === undefined;

    const passou =
      Boolean(operacao) &&
      operacao.opcional === true &&
      somenteSegundoAlvoElegivel &&
      preparacao.sucesso &&
      acaoAntesDoAtaque === false &&
      resultadoAtaque.sucesso &&
      resultadoAtaque.acertou &&
      modificadorDanoCleave === 0 &&
      acaoDepoisDoAtaque === false &&
      marcouUso &&
      !segundaTentativa.sucesso &&
      segundaTentativa.motivo === "cleaveJaUtilizado" &&
      recarregouNoTurno &&
      preparacaoNegativa.sucesso &&
      modificadorNegativoMantido &&
      semDominio &&
      somenteCorpoACorpo;

    return {
      passou,
      detalhes: [
        operacao?.opcional ? "Cleave é uma escolha opcional." : "Cleave não foi preparado.",
        somenteSegundoAlvoElegivel
          ? "Somente o segundo inimigo próximo e ao alcance foi listado."
          : `Alvos listados incorretamente: ${idsAlvos.join(", ") || "nenhum"}.`,
        preparacao.sucesso
          ? "O ataque adicional foi preparado sem exigir outra ação."
          : `O ataque adicional falhou: ${preparacao.motivo}.`,
        `Modificador de dano com Força positiva: ${modificadorDanoCleave}.`,
        marcouUso ? "Cleave marcou seu único uso no turno." : "O uso de Cleave não foi marcado.",
        segundaTentativa.motivo === "cleaveJaUtilizado"
          ? "Uma segunda utilização no mesmo turno foi impedida."
          : "Uma segunda utilização no mesmo turno foi permitida.",
        recarregouNoTurno
          ? "Cleave ficou disponível no início do turno seguinte."
          : "Cleave não recarregou no turno seguinte.",
        modificadorNegativoMantido
          ? "Um modificador negativo de Força foi mantido no dano."
          : "O modificador negativo de Força não foi mantido.",
        semDominio ? "Arma não dominada não ativou Cleave." : "Arma não dominada ativou Cleave.",
        somenteCorpoACorpo
          ? "Um ataque à distância não ativou Cleave."
          : "Um ataque à distância ativou Cleave.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.cleave",
    nome: "Maestria Cleave",
    categoria: "guerreiro-n1",
    executar: executarCenarioCompletoCleave,
  });

  function criarEstadoCenarioGraze({ forca = 16, dominaArma = true, pontosAlvo = 10 } = {}) {
    const ataque = {
      id: "espada-grande-graze-dev",
      armaId: "espadaGrande",
      maestriaId: "graze",
      nome: "Espada Grande",
      categoria: "corpoACorpo",
      atributoId: "forca",
      propriedades: ["pesada", "duasMaos"],
      bonusAtaque: 5,
      custoPadrao: "acao",
      selecao: { tipo: "criatura", alcance: { normal: 1, longo: null } },
      dano: {
        gruposDeDados: [{ quantidade: 2, numeroDeFaces: 6 }],
        modificador: 3,
        tipo: "cortante",
      },
    };
    const guerreiro = {
      id: "guerreiro-graze-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 5, linha: 5 },
      atributos: { forca, destreza: 10 },
      habilidades: {
        escolhas: {
          maestriasArmas: dominaArma ? ["espadaGrande"] : [],
        },
      },
      ataques: [ataque],
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
    };
    const alvo = {
      id: "alvo-graze-dev",
      nome: "Alvo de Graze",
      tipo: "inimigo",
      estado: "ativo",
      classeArmadura: 18,
      posicao: { coluna: 6, linha: 5 },
      pontosDeVida: { atuais: pontosAlvo, maximo: pontosAlvo },
      habilidades: { escolhas: {} },
      ataques: [],
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [guerreiro.id, alvo.id],
      participanteAtivoId: guerreiro.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes: [guerreiro, alvo],
      efeitosTemporarios: [],
      objetivos: [],
    };

    return { combate, guerreiro, alvo, ataque };
  }

  function executarErroGraze(contexto) {
    const preparacao = window.SistemaCombate.prepararAtaque(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.alvo.id,
      contexto.ataque.id,
    );

    if (!preparacao.sucesso) {
      return { preparacao, resultadoAtaque: null, operacao: null };
    }

    const resultadoAtaque = window.SistemaCombate.resolverAtaque(contexto.combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [2] }],
      modificador: contexto.ataque.bonusAtaque,
    });
    const operacao = resultadoAtaque.efeitosAposErro.find(
      (efeito) => efeito.tipo === "causarDanoSemAcerto",
    );

    return { preparacao, resultadoAtaque, operacao };
  }

  function executarCenarioCompletoGraze() {
    const contexto = criarEstadoCenarioGraze();
    const erro = executarErroGraze(contexto);
    const pontosAntes = contexto.alvo.pontosDeVida.atuais;
    const resultadoDano = window.SistemaCombate.aplicarDanoSemAcerto(
      contexto.combate,
      erro.operacao,
    );

    const contextoNegativo = criarEstadoCenarioGraze({ forca: 8 });
    contextoNegativo.ataque.bonusAtaque = 1;
    const erroNegativo = executarErroGraze(contextoNegativo);

    const contextoDerrota = criarEstadoCenarioGraze({ pontosAlvo: 3 });
    const erroDerrota = executarErroGraze(contextoDerrota);
    const resultadoDerrota = window.SistemaCombate.aplicarDanoSemAcerto(
      contextoDerrota.combate,
      erroDerrota.operacao,
    );

    const contextoAcerto = criarEstadoCenarioGraze();
    contextoAcerto.alvo.classeArmadura = 10;
    window.SistemaCombate.prepararAtaque(
      contextoAcerto.combate,
      contextoAcerto.guerreiro.id,
      contextoAcerto.alvo.id,
      contextoAcerto.ataque.id,
    );
    const resultadoAcerto = window.SistemaCombate.resolverAtaque(contextoAcerto.combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [15] }],
      modificador: 5,
    });
    const semGrazeNoAcerto = resultadoAcerto.efeitosAposErro.length === 0;

    const contextoSemDominio = criarEstadoCenarioGraze({ dominaArma: false });
    const erroSemDominio = executarErroGraze(contextoSemDominio);
    const semDominio = erroSemDominio.operacao === undefined;

    const passou =
      erro.preparacao.sucesso &&
      erro.resultadoAtaque.sucesso &&
      !erro.resultadoAtaque.acertou &&
      erro.operacao?.opcional === true &&
      erro.operacao.quantidade === 3 &&
      erro.operacao.tipoDano === "cortante" &&
      erro.operacao.permiteOutrosBonus === false &&
      resultadoDano.sucesso &&
      resultadoDano.dano === 3 &&
      contexto.alvo.pontosDeVida.atuais === pontosAntes - 3 &&
      erroNegativo.operacao?.quantidade === 0 &&
      resultadoDerrota.foiDerrotado &&
      contextoDerrota.alvo.estado === "derrotado" &&
      semGrazeNoAcerto &&
      semDominio;

    return {
      passou,
      detalhes: [
        erro.resultadoAtaque?.acertou === false
          ? "O erro do ataque disponibilizou Graze."
          : "O ataque não produziu o cenário de erro esperado.",
        erro.operacao?.opcional ? "Graze é uma escolha opcional." : "Graze não é opcional.",
        `Dano de Graze com Força 16: ${resultadoDano.dano}.`,
        `Tipo do dano: ${resultadoDano.tipoDano}.`,
        erro.operacao?.permiteOutrosBonus === false
          ? "Graze não permite outros bônus de dano."
          : "Graze permitiu bônus indevidos.",
        `Dano preparado com Força 8: ${erroNegativo.operacao?.quantidade}.`,
        resultadoDerrota.foiDerrotado
          ? "Graze reduziu o alvo a 0 PV e o derrotou."
          : "Graze não concluiu a derrota do alvo.",
        semGrazeNoAcerto ? "Um ataque que acertou não ativou Graze." : "Um acerto ativou Graze.",
        semDominio ? "Arma não dominada não ativou Graze." : "Arma não dominada ativou Graze.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.graze",
    nome: "Maestria Graze",
    categoria: "guerreiro-n1",
    executar: executarCenarioCompletoGraze,
  });

  function criarEstadoCenarioNick({
    dominaArma = true,
    estilo = null,
    modificadorAtributo = 3,
  } = {}) {
    const criarAtaque = ({ id, armaId, maestriaId, nome, modificadorDano }) => ({
      id,
      equipamentoInstanciaId: id,
      armaId,
      maestriaId,
      nome,
      categoria: "corpoACorpo",
      atributoId: "forca",
      propriedades: ["leve"],
      bonusAtaque: 5,
      custoPadrao: "acao",
      selecao: { tipo: "criatura", alcance: { normal: 1, longo: null } },
      dano: {
        gruposDeDados: [{ quantidade: 1, numeroDeFaces: 6 }],
        modificador: modificadorDano,
        modificadorAtributo,
        tipo: "cortante",
      },
    });
    const ataquePrincipal = criarAtaque({
      id: "espada-curta-principal-nick-dev",
      armaId: "espadaCurta",
      maestriaId: "vex",
      nome: "Espada Curta",
      modificadorDano: 3,
    });
    const ataqueNick = criarAtaque({
      id: "cimitarra-secundaria-nick-dev",
      armaId: "cimitarra",
      maestriaId: "nick",
      nome: "Cimitarra",
      modificadorDano: modificadorAtributo,
    });
    const guerreiro = {
      id: "guerreiro-nick-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 5, linha: 5 },
      atributos: {
        forca: modificadorAtributo < 0 ? 8 : 16,
        destreza: 10,
      },
      habilidades: {
        escolhas: {
          maestriasArmas: dominaArma ? ["cimitarra"] : [],
          estilosDeLuta: estilo,
        },
      },
      ataques: [ataquePrincipal, ataqueNick],
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
      movimentoMaximo: 6,
      movimentoRestante: 6,
      maestriasUsadasTurno: [],
    };
    const alvo = {
      id: "alvo-nick-dev",
      nome: "Alvo de Nick",
      tipo: "inimigo",
      estado: "ativo",
      classeArmadura: 12,
      posicao: { coluna: 6, linha: 5 },
      pontosDeVida: { atuais: 30, maximo: 30 },
      habilidades: { escolhas: {} },
      ataques: [],
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [guerreiro.id, alvo.id],
      participanteAtivoId: guerreiro.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes: [guerreiro, alvo],
      efeitosTemporarios: [],
      objetivos: [],
    };

    return { combate, guerreiro, alvo, ataquePrincipal, ataqueNick };
  }

  function resolverAtaqueFixoNick(contexto, ataqueId) {
    const preparacao = window.SistemaCombate.prepararAtaque(
      contexto.combate,
      contexto.guerreiro.id,
      contexto.alvo.id,
      ataqueId,
    );

    if (!preparacao.sucesso) {
      return { preparacao, resultado: null };
    }

    const resultado = window.SistemaCombate.resolverAtaque(contexto.combate, {
      gruposRolados: [{ numeroDeFaces: 20, resultados: [15] }],
      modificador: 5,
    });

    return { preparacao, resultado };
  }

  function executarCenarioCompletoNick() {
    const contexto = criarEstadoCenarioNick();
    const primeiroAtaque = resolverAtaqueFixoNick(contexto, contexto.ataquePrincipal.id);
    const bonusAntesDeNick = contexto.guerreiro.acaoBonusDisponivel;
    const ataqueComNick = resolverAtaqueFixoNick(contexto, contexto.ataqueNick.id);
    const bonusDepoisDeNick = contexto.guerreiro.acaoBonusDisponivel;
    const nickRegistrado = contexto.guerreiro.maestriasUsadasTurno.includes("nick");

    contexto.guerreiro.acaoDisponivel = true;
    const novaAcaoDeAtaque = resolverAtaqueFixoNick(contexto, contexto.ataquePrincipal.id);
    const custoSegundaTentativa = window.SistemaCombate.obterCustoAtaque(
      contexto.guerreiro,
      contexto.ataqueNick,
    );

    contexto.combate.indiceTurno = 0;
    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);
    const recarregouNoTurno = !contexto.guerreiro.maestriasUsadasTurno.includes("nick");

    const contextoSemDominio = criarEstadoCenarioNick({ dominaArma: false });
    resolverAtaqueFixoNick(contextoSemDominio, contextoSemDominio.ataquePrincipal.id);
    const custoSemDominio = window.SistemaCombate.obterCustoAtaque(
      contextoSemDominio.guerreiro,
      contextoSemDominio.ataqueNick,
    );

    const contextoMesmaArma = criarEstadoCenarioNick();
    resolverAtaqueFixoNick(contextoMesmaArma, contextoMesmaArma.ataquePrincipal.id);
    const custoMesmaArma = window.SistemaCombate.obterCustoAtaque(
      contextoMesmaArma.guerreiro,
      contextoMesmaArma.ataquePrincipal,
    );

    const contextoOrdemInversa = criarEstadoCenarioNick();
    const nickPrimeiro = resolverAtaqueFixoNick(
      contextoOrdemInversa,
      contextoOrdemInversa.ataqueNick.id,
    );
    const principalAdicional = resolverAtaqueFixoNick(
      contextoOrdemInversa,
      contextoOrdemInversa.ataquePrincipal.id,
    );

    const contextoComEstilo = criarEstadoCenarioNick({
      estilo: "combateDuasArmas",
    });
    resolverAtaqueFixoNick(contextoComEstilo, contextoComEstilo.ataquePrincipal.id);
    const nickComEstilo = resolverAtaqueFixoNick(
      contextoComEstilo,
      contextoComEstilo.ataqueNick.id,
    );

    const contextoModificadorNegativo = criarEstadoCenarioNick({
      modificadorAtributo: -1,
    });
    resolverAtaqueFixoNick(
      contextoModificadorNegativo,
      contextoModificadorNegativo.ataquePrincipal.id,
    );
    const nickComModificadorNegativo = resolverAtaqueFixoNick(
      contextoModificadorNegativo,
      contextoModificadorNegativo.ataqueNick.id,
    );

    const passou =
      primeiroAtaque.preparacao.sucesso &&
      primeiroAtaque.preparacao.custo === "acao" &&
      ataqueComNick.preparacao.sucesso &&
      ataqueComNick.preparacao.custo === "nenhum" &&
      bonusAntesDeNick &&
      bonusDepoisDeNick &&
      nickRegistrado &&
      ataqueComNick.resultado.ataque.dano.modificador === 0 &&
      novaAcaoDeAtaque.preparacao.sucesso &&
      custoSegundaTentativa === "acaoBonus" &&
      recarregouNoTurno &&
      custoSemDominio === "acaoBonus" &&
      custoMesmaArma === "acao" &&
      nickPrimeiro.resultado.ataque.dano.modificador === 3 &&
      principalAdicional.preparacao.custo === "acaoBonus" &&
      principalAdicional.resultado.ataque.dano.modificador === 0 &&
      nickComEstilo.resultado.ataque.dano.modificador === 3 &&
      nickComModificadorNegativo.resultado.ataque.dano.modificador === -1;

    return {
      passou,
      detalhes: [
        `Primeiro ataque com arma Leve: ${primeiroAtaque.preparacao.custo}.`,
        `Ataque adicional com Nick: ${ataqueComNick.preparacao.custo}.`,
        bonusDepoisDeNick
          ? "Nick preservou a ação bônus."
          : "Nick consumiu a ação bônus indevidamente.",
        nickRegistrado ? "O uso de Nick foi registrado." : "O uso de Nick não foi registrado.",
        `Modificador de dano do ataque adicional: ${ataqueComNick.resultado?.ataque.dano.modificador}.`,
        `Nova tentativa no mesmo turno: ${custoSegundaTentativa}.`,
        recarregouNoTurno
          ? "Nick ficou disponível no início do turno seguinte."
          : "Nick não recarregou no turno seguinte.",
        `Sem domínio de Nick, o ataque adicional custa: ${custoSemDominio}.`,
        `Repetir a mesma arma custa: ${custoMesmaArma}.`,
        `Ordem inversa — primeiro ataque: ${nickPrimeiro.resultado?.ataque.dano.modificador}; ataque adicional: ${principalAdicional.resultado?.ataque.dano.modificador}.`,
        `Com Combate com Duas Armas: ${nickComEstilo.resultado?.ataque.dano.modificador}.`,
        `Com modificador negativo: ${nickComModificadorNegativo.resultado?.ataque.dano.modificador}.`,
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.maestria.nick",
    nome: "Maestria Nick",
    categoria: "guerreiro-n1",
    executar: executarCenarioCompletoNick,
  });

  function executarCenarioPropriedadeLeve() {
    const contexto = criarEstadoCenarioNick({ dominaArma: false });
    const primeiroAtaque = resolverAtaqueFixoNick(contexto, contexto.ataquePrincipal.id);
    const ataqueAdicional = resolverAtaqueFixoNick(contexto, contexto.ataqueNick.id);
    const acaoBonusFoiConsumida = !contexto.guerreiro.acaoBonusDisponivel;
    const terceiraTentativa = resolverAtaqueFixoNick(contexto, contexto.ataquePrincipal.id);

    const contextoNaoLeve = criarEstadoCenarioNick({ dominaArma: false });
    resolverAtaqueFixoNick(contextoNaoLeve, contextoNaoLeve.ataquePrincipal.id);
    contextoNaoLeve.ataqueNick.propriedades = [];
    const custoArmaNaoLeve = window.SistemaCombate.obterCustoAtaque(
      contextoNaoLeve.guerreiro,
      contextoNaoLeve.ataqueNick,
    );

    const contextoMesmaInstancia = criarEstadoCenarioNick({ dominaArma: false });
    resolverAtaqueFixoNick(
      contextoMesmaInstancia,
      contextoMesmaInstancia.ataquePrincipal.id,
    );
    const custoMesmaInstancia = window.SistemaCombate.obterCustoAtaque(
      contextoMesmaInstancia.guerreiro,
      contextoMesmaInstancia.ataquePrincipal,
    );

    const contextoDuasAdagas = criarEstadoCenarioNick({ dominaArma: false });
    const segundaAdaga = structuredClone(contextoDuasAdagas.ataquePrincipal);
    segundaAdaga.id = "adaga-segunda-leve-dev";
    segundaAdaga.instanciaId = "adaga-segunda-leve-dev";
    segundaAdaga.equipamentoInstanciaId = "adaga-segunda-leve-dev";
    contextoDuasAdagas.guerreiro.ataques.push(segundaAdaga);
    resolverAtaqueFixoNick(
      contextoDuasAdagas,
      contextoDuasAdagas.ataquePrincipal.id,
    );
    const custoSegundaAdaga = window.SistemaCombate.obterCustoAtaque(
      contextoDuasAdagas.guerreiro,
      segundaAdaga,
    );

    const contextoComEstilo = criarEstadoCenarioNick({
      dominaArma: false,
      estilo: "combateDuasArmas",
    });
    resolverAtaqueFixoNick(contextoComEstilo, contextoComEstilo.ataquePrincipal.id);
    const ataqueAdicionalComEstilo = resolverAtaqueFixoNick(
      contextoComEstilo,
      contextoComEstilo.ataqueNick.id,
    );

    const contextoNegativo = criarEstadoCenarioNick({
      dominaArma: false,
      modificadorAtributo: -1,
    });
    resolverAtaqueFixoNick(contextoNegativo, contextoNegativo.ataquePrincipal.id);
    const ataqueAdicionalNegativo = resolverAtaqueFixoNick(
      contextoNegativo,
      contextoNegativo.ataqueNick.id,
    );

    contexto.combate.indiceTurno = 0;
    window.SistemaCombate.iniciarTurnoAtual(contexto.combate);
    const reiniciouNoTurno =
      contexto.guerreiro.acaoDisponivel &&
      contexto.guerreiro.acaoBonusDisponivel &&
      !contexto.guerreiro.ataqueAdicionalLeve;

    const passou =
      primeiroAtaque.preparacao.sucesso &&
      primeiroAtaque.preparacao.custo === "acao" &&
      primeiroAtaque.resultado.ataque.dano.modificador === 3 &&
      ataqueAdicional.preparacao.sucesso &&
      ataqueAdicional.preparacao.custo === "acaoBonus" &&
      ataqueAdicional.resultado.ataque.dano.modificador === 0 &&
      acaoBonusFoiConsumida &&
      !terceiraTentativa.preparacao.sucesso &&
      terceiraTentativa.preparacao.motivo === "acaoIndisponivel" &&
      custoArmaNaoLeve === "acao" &&
      custoMesmaInstancia === "acao" &&
      custoSegundaAdaga === "acaoBonus" &&
      ataqueAdicionalComEstilo.resultado.ataque.dano.modificador === 3 &&
      ataqueAdicionalNegativo.resultado.ataque.dano.modificador === -1 &&
      reiniciouNoTurno;

    return {
      passou,
      detalhes: [
        `Primeiro ataque Leve: ${primeiroAtaque.preparacao.custo}, dano ${primeiroAtaque.resultado?.ataque.dano.modificador}.`,
        `Ataque adicional Leve: ${ataqueAdicional.preparacao.custo}, dano ${ataqueAdicional.resultado?.ataque.dano.modificador}.`,
        `Terceira tentativa: ${terceiraTentativa.preparacao.motivo}.`,
        `Arma não Leve após o primeiro ataque: ${custoArmaNaoLeve}.`,
        `Mesma instância física: ${custoMesmaInstancia}.`,
        `Segunda instância do mesmo tipo de arma: ${custoSegundaAdaga}.`,
        `Com Combate com Duas Armas: dano ${ataqueAdicionalComEstilo.resultado?.ataque.dano.modificador}.`,
        `Com modificador negativo: dano ${ataqueAdicionalNegativo.resultado?.ataque.dano.modificador}.`,
        reiniciouNoTurno
          ? "A economia de ações foi reiniciada no turno seguinte."
          : "A economia de ações não foi reiniciada corretamente.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.propriedade.leve",
    nome: "Combate com Duas Armas — propriedade Leve",
    categoria: "guerreiro-n1",
    executar: executarCenarioPropriedadeLeve,
  });

  function executarIntegracaoProficienciaDuasArmas() {
    const criarPersonagemTeste = (classeId) => ({
      classeId,
      atributos: {
        forca: 16,
        destreza: 16,
      },
      habilidades: {
        escolhas: {},
      },
      detalhes: {
        equipamentos: {
          armaPrincipal: "espadaCurta",
          armaSecundaria: "cimitarra",
          itemSecundario: "armaSecundaria",
        },
      },
    });

    const guerreiro = criarPersonagemTeste("guerreiro");
    const clerigo = criarPersonagemTeste("clerigo");
    const criarAtaque = window.RegrasFichaCriacao?.criarAtaqueCombateArma;

    const ataquesGuerreiro =
      typeof criarAtaque === "function"
        ? [
            criarAtaque(guerreiro, "espadaCurta", "armaPrincipal"),
            criarAtaque(guerreiro, "cimitarra", "armaSecundaria"),
          ]
        : [];

    const ataquesClerigo =
      typeof criarAtaque === "function"
        ? [
            criarAtaque(clerigo, "espadaCurta", "armaPrincipal"),
            criarAtaque(clerigo, "cimitarra", "armaSecundaria"),
          ]
        : [];

    const guerreiroRecebeProficiencia = ataquesGuerreiro.every(
      (ataque) => ataque?.bonusAtaque === 5,
    );
    const clerigoNaoRecebeProficiencia = ataquesClerigo.every(
      (ataque) => ataque?.bonusAtaque === 3,
    );
    const danoMantemSomenteAtributo = [...ataquesGuerreiro, ...ataquesClerigo].every(
      (ataque) =>
        ataque?.dano.modificador === 3 &&
        ataque?.dano.modificadorAtributo === 3,
    );

    return {
      passou:
        ataquesGuerreiro.length === 2 &&
        ataquesClerigo.length === 2 &&
        guerreiroRecebeProficiencia &&
        clerigoNaoRecebeProficiencia &&
        danoMantemSomenteAtributo,
      detalhes: [
        `Guerreiro — espada curta: ${ataquesGuerreiro[0]?.bonusAtaque}; cimitarra: ${ataquesGuerreiro[1]?.bonusAtaque}.`,
        `Clérigo — espada curta: ${ataquesClerigo[0]?.bonusAtaque}; cimitarra: ${ataquesClerigo[1]?.bonusAtaque}.`,
        `Dano-base das quatro armas: ${[...ataquesGuerreiro, ...ataquesClerigo]
          .map((ataque) => ataque?.dano.modificador)
          .join(", ")}.`,
        guerreiroRecebeProficiencia
          ? "As duas armas do Guerreiro receberam o bônus de proficiência."
          : "Uma das armas do Guerreiro não recebeu o bônus de proficiência.",
        clerigoNaoRecebeProficiencia
          ? "As armas marciais do Clérigo não receberam proficiência indevida."
          : "O Clérigo recebeu proficiência indevida com uma arma marcial.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.integracao.proficiencia-duas-armas",
    nome: "Ficha → Combate — proficiência com duas armas",
    categoria: "guerreiro-n1",
    executar: executarIntegracaoProficienciaDuasArmas,
  });

  function executarAuditoriaEstilosLutaGuerreiro() {
    const criarGuerreiro = ({
      estilo,
      armadura = "semArmadura",
      armaPrincipal = "espadaLonga",
      armaSecundaria = null,
      itemSecundario = "nada",
    }) => ({
      classeId: "guerreiro",
      atributos: {
        forca: 16,
        destreza: 16,
      },
      habilidades: {
        escolhas: {
          estilosDeLuta: estilo,
        },
      },
      detalhes: {
        equipamentos: {
          armadura,
          armaPrincipal,
          armaSecundaria,
          itemSecundario,
        },
      },
    });

    const criarAtaque = window.RegrasFichaCriacao?.criarAtaqueCombateArma;

    const arqueiro = criarGuerreiro({
      estilo: "arquearia",
      armaPrincipal: "arcoLongo",
    });
    const ataqueArco = criarAtaque?.(arqueiro, "arcoLongo", "armaPrincipal");
    const ataqueCorpoArqueiro = criarAtaque?.(
      arqueiro,
      "espadaLonga",
      "armaPrincipal",
    );

    const defensorComArmadura = criarGuerreiro({
      estilo: "defesa",
      armadura: "cotaDeMalha",
    });
    const defensorSemArmadura = criarGuerreiro({
      estilo: "defesa",
    });
    const caDefesaComArmadura = window.calcularClasseArmadura?.(
      defensorComArmadura,
    );
    const caDefesaSemArmadura = window.calcularClasseArmadura?.(
      defensorSemArmadura,
    );

    const duelistaLivre = criarGuerreiro({ estilo: "duelismo" });
    const duelistaComEscudo = criarGuerreiro({
      estilo: "duelismo",
      itemSecundario: "escudo",
    });
    const duelistaComOutraArma = criarGuerreiro({
      estilo: "duelismo",
      armaSecundaria: "espadaCurta",
      itemSecundario: "armaSecundaria",
    });
    const danoDueloLivre = criarAtaque?.(
      duelistaLivre,
      "espadaLonga",
      "armaPrincipal",
    )?.dano.modificador;
    const danoDueloComEscudo = criarAtaque?.(
      duelistaComEscudo,
      "espadaLonga",
      "armaPrincipal",
    )?.dano.modificador;
    const danoDueloComOutraArma = criarAtaque?.(
      duelistaComOutraArma,
      "espadaLonga",
      "armaPrincipal",
    )?.dano.modificador;

    const especialistaArremesso = criarGuerreiro({
      estilo: "combateArmasArremessaveis",
      armaPrincipal: "adaga",
    });
    const danoAdagaArremessada = criarAtaque?.(
      especialistaArremesso,
      "adaga",
      "armaPrincipal",
      "arremesso",
    )?.dano.modificador;
    const danoAdagaCorpoACorpo = criarAtaque?.(
      especialistaArremesso,
      "adaga",
      "armaPrincipal",
    )?.dano.modificador;
    const danoArcoSemArremesso = criarAtaque?.(
      especialistaArremesso,
      "arcoLongo",
      "armaPrincipal",
    )?.dano.modificador;

    const versatilComMaoLivre = criarGuerreiro({
      estilo: "duelismo",
      armaPrincipal: "espadaLonga",
    });
    const versatilComEscudo = criarGuerreiro({
      estilo: "duelismo",
      armaPrincipal: "espadaLonga",
      itemSecundario: "escudo",
    });
    const ataqueVersatilUmaMao = criarAtaque?.(
      versatilComMaoLivre,
      "espadaLonga",
      "armaPrincipal",
    );
    const ataqueVersatilDuasMaos = criarAtaque?.(
      versatilComMaoLivre,
      "espadaLonga",
      "armaPrincipal",
      "versatilDuasMaos",
    );
    const ataqueVersatilDuasMaosComEscudo = criarAtaque?.(
      versatilComEscudo,
      "espadaLonga",
      "armaPrincipal",
      "versatilDuasMaos",
    );

    function resolverCasoArmasGrandes({
      estilo = "combateArmasGrandes",
      categoria = "corpoACorpo",
      empunhadaComDuasMaos = true,
    } = {}) {
      const ataque = {
        id: "ataque-armas-grandes-dev",
        instanciaId: "ataque-armas-grandes-dev",
        categoria,
        empunhadaComDuasMaos,
        dano: { tipo: "cortante" },
      };
      const atacante = {
        id: "guerreiro-armas-grandes-dev",
        classeId: "guerreiro",
        habilidades: { escolhas: { estilosDeLuta: estilo } },
        ataques: [ataque],
      };
      const alvo = {
        id: "alvo-armas-grandes-dev",
        estado: "ativo",
        pontosDeVida: { atuais: 20, maximo: 20, temporarios: 0 },
        habilidades: { escolhas: {} },
      };
      const combate = {
        status: "ativo",
        participantes: [atacante, alvo],
        efeitosTemporarios: [],
        objetivos: [],
        danoPendente: {
          atacanteId: atacante.id,
          alvoId: alvo.id,
          ataqueId: ataque.instanciaId,
          efeitos: [],
        },
      };

      const resultado = window.SistemaCombate.resolverDano(combate, {
        gruposRolados: [
          {
            origem: "arma",
            numeroDeFaces: 6,
            resultados: [1, 2],
            total: 3,
          },
          {
            origem: "adicional",
            numeroDeFaces: 4,
            resultados: [1],
            total: 1,
          },
        ],
        subtotal: 4,
        modificador: 3,
        total: 7,
      });

      return resultado?.dano;
    }

    const danoArmasGrandes = resolverCasoArmasGrandes();
    const danoArmasGrandesSemEstilo = resolverCasoArmasGrandes({ estilo: "defesa" });
    const danoArmasGrandesUmaMao = resolverCasoArmasGrandes({
      empunhadaComDuasMaos: false,
    });
    const danoArmasGrandesDistancia = resolverCasoArmasGrandes({
      categoria: "distancia",
    });

    const alcanceVisaoAsCegas = window.SistemaCombate.obterAlcanceSentidoEmCelulas(
      { sentidos: { visaoAsCegas: { alcance: 3 } } },
      "visaoAsCegas",
    );
    const alcanceVisaoNoEscuro = window.SistemaCombate.obterAlcanceSentidoEmCelulas(
      { sentidos: { visaoNoEscuro: { alcance: 36 } } },
      "visaoNoEscuro",
    );
    const alcanceSentidoAusente = window.SistemaCombate.obterAlcanceSentidoEmCelulas(
      { sentidos: {} },
      "visaoAsCegas",
    );
    const entidadeComSentido = {
      id: "entidade-sentido-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      atributos: { destreza: 10 },
      combate: {
        classeArmadura: 10,
        pontosDeVida: { atuais: 10, maximo: 10, temporarios: 0 },
      },
      ataques: [],
      sentidos: { visaoAsCegas: { alcance: 3 } },
      habilidades: { escolhas: { estilosDeLuta: "combateAsCegas" } },
    };
    const participanteComSentido = window.SistemaCombate.criarParticipanteCombate(
      entidadeComSentido,
      { id: entidadeComSentido.id, posicao: { coluna: 1, linha: 1 } },
    );
    participanteComSentido.sentidos.visaoAsCegas.alcance = 6;
    const observadorVisaoAsCegas = {
      posicao: { coluna: 1, linha: 1 },
      sentidos: { visaoAsCegas: { alcance: 3 } },
    };
    const percebeAdjacente = window.SistemaCombate.participantePercebeAlvoSemVisao(
      observadorVisaoAsCegas,
      { posicao: { coluna: 2, linha: 1 } },
    );
    const percebeNoLimite = window.SistemaCombate.participantePercebeAlvoSemVisao(
      observadorVisaoAsCegas,
      { posicao: { coluna: 3, linha: 1 } },
    );
    const percebeForaDoLimite = window.SistemaCombate.participantePercebeAlvoSemVisao(
      observadorVisaoAsCegas,
      { posicao: { coluna: 4, linha: 1 } },
    );
    const percebeSemSentido = window.SistemaCombate.participantePercebeAlvoSemVisao(
      { posicao: { coluna: 1, linha: 1 }, sentidos: {} },
      { posicao: { coluna: 2, linha: 1 } },
    );

    function prepararCasoVisao({
      distancia = 1,
      condicoesAtacante = [],
      condicoesAlvo = [],
      visaoAtacante = false,
      visaoAlvo = false,
    } = {}) {
      const ataque = {
        id: "ataque-visao-dev",
        instanciaId: "ataque-visao-dev",
        categoria: "corpoACorpo",
        custoPadrao: "acao",
        propriedades: [],
        selecao: { tipo: "criatura", alcance: { normal: 10, longo: null } },
      };
      const atacante = {
        id: "atacante-visao-dev",
        tipo: "jogador",
        grupoId: "jogadores",
        estado: "ativo",
        posicao: { coluna: 1, linha: 1 },
        atributos: { forca: 16 },
        condicoes: structuredClone(condicoesAtacante),
        sentidos: visaoAtacante ? { visaoAsCegas: { alcance: 3 } } : {},
        acaoDisponivel: true,
        acaoBonusDisponivel: true,
        reacaoDisponivel: true,
        ataques: [ataque],
        habilidades: { escolhas: {} },
      };
      const alvo = {
        id: "alvo-visao-dev",
        tipo: "inimigo",
        grupoId: "inimigos",
        estado: "ativo",
        posicao: { coluna: 1 + distancia, linha: 1 },
        condicoes: structuredClone(condicoesAlvo),
        sentidos: visaoAlvo ? { visaoAsCegas: { alcance: 3 } } : {},
        habilidades: { escolhas: {} },
      };
      const combate = {
        status: "ativo",
        participanteAtivoId: atacante.id,
        participantes: [atacante, alvo],
        tabuleiro: { colunas: 12, linhas: 12 },
        terreno: { bloqueado: [], dificil: [] },
        visao: { bloqueios: [], barreiras: [] },
        efeitosTemporarios: [],
        objetivos: [],
      };

      return window.SistemaCombate.prepararAtaque(
        combate,
        atacante.id,
        alvo.id,
        ataque.instanciaId,
      );
    }

    const ataqueContraInvisivel = prepararCasoVisao({
      condicoesAlvo: [{ id: "invisivel" }],
    });
    const ataqueContraInvisivelPercebido = prepararCasoVisao({
      condicoesAlvo: [{ id: "invisivel" }],
      visaoAtacante: true,
      distancia: 2,
    });
    const ataqueContraInvisivelDistante = prepararCasoVisao({
      condicoesAlvo: [{ id: "invisivel" }],
      visaoAtacante: true,
      distancia: 3,
    });
    const ataqueCegoComPercepcao = prepararCasoVisao({
      condicoesAtacante: [{ id: "cego" }],
      visaoAtacante: true,
    });
    const ataqueInvisivel = prepararCasoVisao({
      condicoesAtacante: [{ id: "invisivel" }],
    });
    const ataqueInvisivelPercebido = prepararCasoVisao({
      condicoesAtacante: [{ id: "invisivel" }],
      visaoAlvo: true,
    });
    const ataqueEntreInvisiveis = prepararCasoVisao({
      condicoesAtacante: [{ id: "invisivel" }],
      condicoesAlvo: [{ id: "invisivel" }],
    });

    const resultadoDuasArmas = executarCenarioPropriedadeLeve();

    const verificacoes = [
      ["Arquearia acrescenta +2 ao arco longo", ataqueArco?.bonusAtaque === 7],
      [
        "Arquearia não altera arma corpo a corpo",
        ataqueCorpoArqueiro?.bonusAtaque === 5,
      ],
      ["Defesa acrescenta +1 com armadura", caDefesaComArmadura === 17],
      ["Defesa não funciona sem armadura", caDefesaSemArmadura === 13],
      ["Duelo acrescenta +2 com uma arma", danoDueloLivre === 5],
      ["Duelo permite o uso de escudo", danoDueloComEscudo === 5],
      ["Duelo não funciona com outra arma", danoDueloComOutraArma === 3],
      ["Arma arremessada recebe +2 no dano", danoAdagaArremessada === 5],
      ["A mesma arma corpo a corpo não recebe +2", danoAdagaCorpoACorpo === 3],
      ["Arma à distância sem Arremesso não recebe +2", danoArcoSemArremesso === 3],
      [
        "Arma Versátil usa o dado normal com uma mão",
        ataqueVersatilUmaMao?.dano?.gruposDeDados?.[0]?.numeroDeFaces === 8,
      ],
      [
        "Arma Versátil usa o dado maior com duas mãos",
        ataqueVersatilDuasMaos?.dano?.gruposDeDados?.[0]?.numeroDeFaces === 10 &&
          ataqueVersatilDuasMaos?.empunhadaComDuasMaos === true,
      ],
      [
        "Arma Versátil não usa duas mãos com escudo",
        ataqueVersatilDuasMaosComEscudo === null,
      ],
      ["Armas Grandes transforma 1 e 2 da arma em 3", danoArmasGrandes === 10],
      ["Armas Grandes não altera dados adicionais", danoArmasGrandes === 10],
      ["Sem o estilo, os dados permanecem iguais", danoArmasGrandesSemEstilo === 7],
      ["Armas Grandes não funciona com uma mão", danoArmasGrandesUmaMao === 7],
      ["Armas Grandes não funciona à distância", danoArmasGrandesDistancia === 7],
      ["Visão às Cegas de 3 metros alcança 2 células", alcanceVisaoAsCegas === 2],
      ["Sentidos usam a conversão central de metros", alcanceVisaoNoEscuro === 24],
      ["Sentido ausente possui alcance zero", alcanceSentidoAusente === 0],
      [
        "Os sentidos do combate não compartilham referência com a ficha",
        entidadeComSentido.sentidos.visaoAsCegas.alcance === 3 &&
          participanteComSentido.sentidos.visaoAsCegas.alcance === 6,
      ],
      ["Visão às Cegas percebe alvo adjacente", percebeAdjacente],
      ["Visão às Cegas percebe alvo exatamente no limite", percebeNoLimite],
      ["Visão às Cegas não percebe além do alcance", !percebeForaDoLimite],
      ["Sem Visão às Cegas não há percepção alternativa", !percebeSemSentido],
      ["Atacar alvo invisível não percebido impõe desvantagem", ataqueContraInvisivel?.tipoRolagem === "desvantagem"],
      ["Visão às Cegas percebe alvo invisível no alcance", ataqueContraInvisivelPercebido?.tipoRolagem === "normal"],
      ["Visão às Cegas não percebe alvo invisível distante", ataqueContraInvisivelDistante?.tipoRolagem === "desvantagem"],
      ["Visão às Cegas compensa a condição Cego no alcance", ataqueCegoComPercepcao?.tipoRolagem === "normal"],
      ["Atacante invisível não percebido recebe vantagem", ataqueInvisivel?.tipoRolagem === "vantagem"],
      ["Visão às Cegas impede vantagem de atacante invisível", ataqueInvisivelPercebido?.tipoRolagem === "normal"],
      ["Vantagem e desvantagem por invisibilidade se anulam", ataqueEntreInvisiveis?.tipoRolagem === "normal"],
      [
        "Combate com Duas Armas mantém o modificador no ataque adicional",
        resultadoDuasArmas.passou,
      ],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: [
        ...verificacoes.map(
          ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
        ),
        `Arquearia — distância ${ataqueArco?.bonusAtaque}; corpo a corpo ${ataqueCorpoArqueiro?.bonusAtaque}.`,
        `Defesa — com armadura ${caDefesaComArmadura}; sem armadura ${caDefesaSemArmadura}.`,
        `Duelo — livre ${danoDueloLivre}; com escudo ${danoDueloComEscudo}; com outra arma ${danoDueloComOutraArma}.`,
        `Arremesso — adaga lançada ${danoAdagaArremessada}; adaga corpo a corpo ${danoAdagaCorpoACorpo}; arco ${danoArcoSemArremesso}.`,
        `Versátil — uma mão d${ataqueVersatilUmaMao?.dano?.gruposDeDados?.[0]?.numeroDeFaces}; duas mãos d${ataqueVersatilDuasMaos?.dano?.gruposDeDados?.[0]?.numeroDeFaces}; com escudo ${ataqueVersatilDuasMaosComEscudo === null ? "bloqueado" : "permitido"}.`,
        `Armas Grandes — válido ${danoArmasGrandes}; sem estilo ${danoArmasGrandesSemEstilo}; uma mão ${danoArmasGrandesUmaMao}; distância ${danoArmasGrandesDistancia}.`,
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.estilos-luta",
    nome: "Estilos de Luta do Guerreiro",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaEstilosLutaGuerreiro,
  });

  function executarContratoInterceptacao() {
    const interceptador = {
      id: "guerreiro-interceptacao-dev",
      classeId: "guerreiro",
      bonusProficiencia: 2,
      reacaoDisponivel: true,
      habilidades: { escolhas: { estilosDeLuta: "interceptacao" } },
    };
    const atacante = { id: "atacante-interceptacao-dev" };
    const alvo = { id: "alvo-interceptacao-dev" };
    const contexto = {
      gatilho: "aposAcertoAntesDoDano",
      modo: "combate",
      participante: interceptador,
      alvo,
      atacante,
      distanciaAlvoCelulas: 1,
      percebeAtacante: true,
      empunhaEscudoOuArma: true,
    };
    const preparar = (alteracoes = {}) =>
      window.TradutorRegras.prepararOperacoes({ ...contexto, ...alteracoes });
    const operacao = preparar()[0];
    const empunha = window.SistemaCombate?.participanteEmpunhaEscudoOuArma;
    const configurarMaos = (mao1, mao2 = null, equipamentosArremessados = []) => ({
      configuracaoEquipamentos: { mao1, mao2 },
      equipamentosArremessados,
    });
    const adaga = { categoria: "armas", id: "adaga" };
    const escudo = { categoria: "itensSecundarios", id: "escudo" };
    const percebe = window.SistemaCombate?.participantePercebeAtacanteParaInterceptacao;
    const observador = { posicao: { coluna: 1, linha: 1 }, condicoes: [], sentidos: {} };
    const agressor = { posicao: { coluna: 2, linha: 1 }, condicoes: [] };
    const combateVisivel = { visao: { bloqueios: [], barreiras: [] } };
    const combateBloqueado = { visao: {
      bloqueios: [],
      barreiras: [{ coluna: 2, linha: 1, lado: "oeste", tipo: "bloqueioTotal" }],
    } };
    const visaoAsCegas = { visaoAsCegas: { alcance: 3 } };
    const listarInterceptacoes = window.SistemaCombate?.listarInterceptacoesAposAcerto;
    function criarCenarioLista(opcoes = {}) {
      const defensor = {
        ...interceptador,
        ...configurarMaos(adaga),
        posicao: { coluna: 2, linha: 2 },
        estado: "ativo",
        ...(opcoes.defensor ?? {}),
      };
      const protegido = {
        ...alvo,
        posicao: opcoes.proprioAlvo
          ? defensor.posicao
          : { coluna: 3, linha: 2 },
      };
      const agressorLista = {
        ...atacante,
        posicao: { coluna: 4, linha: 2 },
        ...(opcoes.atacante ?? {}),
      };
      const alvoAtaque = opcoes.proprioAlvo ? defensor : protegido;
      const combate = {
        participantes: [agressorLista, defensor, ...(
          opcoes.proprioAlvo ? [] : [protegido]
        )],
        visao: opcoes.visao ?? { bloqueios: [], barreiras: [] },
      };
      const resultadoAtaque = {
        acertou: opcoes.acertou ?? true,
        atacante: agressorLista,
        alvo: alvoAtaque,
        ataque: { id: "adaga" },
      };
      return listarInterceptacoes?.(combate, resultadoAtaque) ?? [];
    }
    function resolverAtaqueComInterceptador(resultadoNatural, opcoes = {}) {
      const ataque = {
        id: "golpe-interceptacao-dev",
        instanciaId: "golpe-interceptacao-dev",
        nome: "Golpe de teste",
        categoria: "corpoACorpo",
        bonusAtaque: 3,
        dano: {
          gruposDeDados: [{ quantidade: 1, numeroDeFaces: 6 }],
          modificador: 1,
          tipo: opcoes.tipoDano ?? "contundente",
        },
        propriedades: [],
      };
      const agressorAtaque = {
        id: "agressor-ataque-interceptacao-dev",
        posicao: { coluna: 4, linha: 2 },
        ataques: [ataque],
        acaoDisponivel: true,
        habilidades: { escolhas: {} },
      };
      const protegidoAtaque = {
        id: "protegido-ataque-interceptacao-dev",
        posicao: { coluna: 3, linha: 2 },
        classeArmadura: 12,
        pontosDeVida: { atuais: 20, maximo: 20 },
        especieId: opcoes.especieAlvo ?? null,
      };
      const defensorAtaque = {
        ...interceptador,
        ...configurarMaos(adaga),
        posicao: { coluna: 2, linha: 2 },
      };
      const combate = {
        participantes: [agressorAtaque, protegidoAtaque, defensorAtaque],
        ataquePendente: {
          atacanteId: agressorAtaque.id,
          alvoId: protegidoAtaque.id,
          ataqueId: ataque.instanciaId,
          custo: "acao",
        },
        visao: { bloqueios: [], barreiras: [] },
        efeitosTemporarios: [],
      };
      const resultadoAtaque = window.SistemaCombate.resolverAtaque(combate, {
        gruposRolados: [{ numeroDeFaces: 20, resultados: [resultadoNatural] }],
        modificador: ataque.bonusAtaque,
      });
      return opcoes.retornarContexto
        ? { combate, resultadoAtaque, defensorAtaque, protegidoAtaque }
        : resultadoAtaque;
    }
    const ataqueRealAcertou = resolverAtaqueComInterceptador(15);
    const ataqueRealErrou = resolverAtaqueComInterceptador(2);
    const casoAtivacao = resolverAtaqueComInterceptador(15, { retornarContexto: true });
    const ativar = window.SistemaCombate?.ativarInterceptacao;
    const resultadoAtivacao = ativar?.(
      casoAtivacao.combate,
      casoAtivacao.resultadoAtaque,
      casoAtivacao.defensorAtaque.id,
    );
    const resultadoDanoPausado = window.SistemaCombate.resolverDano(
      casoAtivacao.combate,
      { total: 7 },
    );
    const resultadoAtivacaoRepetida = ativar?.(
      casoAtivacao.combate,
      casoAtivacao.resultadoAtaque,
      casoAtivacao.defensorAtaque.id,
    );
    const casoErroAtivacao = resolverAtaqueComInterceptador(2, { retornarContexto: true });
    const resultadoAtivacaoErro = ativar?.(
      casoErroAtivacao.combate,
      casoErroAtivacao.resultadoAtaque,
      casoErroAtivacao.defensorAtaque.id,
    );
    const registrarRolagem = window.SistemaCombate?.registrarRolagemInterceptacao;
    function prepararRolagemInterceptacao(valorDado) {
      const caso = resolverAtaqueComInterceptador(15, { retornarContexto: true });
      ativar?.(caso.combate, caso.resultadoAtaque, caso.defensorAtaque.id);
      const resultado = registrarRolagem?.(caso.combate, {
        gruposRolados: [{ numeroDeFaces: 10, resultados: [valorDado] }],
        total: 999,
      });
      return { caso, resultado };
    }
    const rolagemMinima = prepararRolagemInterceptacao(1);
    const rolagemMaxima = prepararRolagemInterceptacao(10);
    const rolagemInvalida = prepararRolagemInterceptacao(0);
    const rolagemRepetida = registrarRolagem?.(rolagemMinima.caso.combate, {
      gruposRolados: [{ numeroDeFaces: 10, resultados: [10] }],
    });
    function resolverDanoInterceptado({ valorDado, danoOriginal, tipoDano, especieAlvo } = {}) {
      const caso = resolverAtaqueComInterceptador(15, {
        retornarContexto: true,
        tipoDano,
        especieAlvo,
      });
      ativar?.(caso.combate, caso.resultadoAtaque, caso.defensorAtaque.id);
      registrarRolagem?.(caso.combate, {
        gruposRolados: [{ numeroDeFaces: 10, resultados: [valorDado] }],
      });
      const resultado = window.SistemaCombate.resolverDano(caso.combate, {
        gruposRolados: [],
        subtotal: 0,
        modificador: danoOriginal,
        total: danoOriginal,
      });
      return { caso, resultado };
    }
    const danoParcialInterceptado = resolverDanoInterceptado({
      valorDado: 2,
      danoOriginal: 9,
    });
    const danoTotalInterceptado = resolverDanoInterceptado({
      valorDado: 10,
      danoOriginal: 7,
    });
    const danoResistenteInterceptado = resolverDanoInterceptado({
      valorDado: 2,
      danoOriginal: 15,
      tipoDano: "veneno",
      especieAlvo: "anao",
    });
    const verificacoes = [
      ["Interceptação prepara 1d10 mais proficiência", operacao?.tipo === "solicitarReducaoDano" &&
        operacao?.gruposDeDados?.[0]?.quantidade === 1 &&
        operacao?.gruposDeDados?.[0]?.numeroDeFaces === 10 &&
        operacao?.modificador === 2],
      ["A operação identifica interceptador e protegido", operacao?.participanteId === interceptador.id &&
        operacao?.alvoId === alvo.id && operacao?.custo === "reacao" && operacao?.opcional === true],
      ["Sem reação não há Interceptação", preparar({ participante: { ...interceptador, reacaoDisponivel: false } }).length === 0],
      ["Fora do alcance não há Interceptação", preparar({ distanciaAlvoCelulas: 2 }).length === 0],
      ["Distância ausente não é aceita como zero", preparar({ distanciaAlvoCelulas: null }).length === 0],
      ["Sem perceber o atacante não há Interceptação", preparar({ percebeAtacante: false }).length === 0],
      ["Sem arma ou escudo empunhado não há Interceptação", preparar({ empunhaEscudoOuArma: false }).length === 0],
      ["Outro estilo não prepara Interceptação", preparar({ participante: {
        ...interceptador,
        habilidades: { escolhas: { estilosDeLuta: "defesa" } },
      } }).length === 0],
      ["Escudo empunhado satisfaz o requisito", empunha?.(configurarMaos(escudo)) === true],
      ["Arma simples empunhada satisfaz o requisito", empunha?.(configurarMaos(adaga)) === true],
      ["Arma arremessada não satisfaz o requisito", empunha?.(configurarMaos(
        adaga, null, ["adaga:armaPrincipal"],
      )) === false],
      ["Segunda arma ainda serve após arremessar a primeira", empunha?.(configurarMaos(
        adaga, { categoria: "armas", id: "clava" }, ["adaga:armaPrincipal"],
      )) === true],
      ["Mãos vazias não satisfazem o requisito", empunha?.(configurarMaos(null)) === false],
      ["Inventário sem arma empunhada não satisfaz o requisito", empunha?.({
        ...configurarMaos(null),
        inventario: { armas: ["adaga"] },
      }) === false],
      ["Interceptador vê atacante com linha livre", percebe?.(
        combateVisivel, observador, agressor,
      ) === true],
      ["Cobertura total impede perceber atacante", percebe?.(
        combateBloqueado, observador, agressor,
      ) === false],
      ["Atacante invisível exige percepção alternativa", percebe?.(
        combateVisivel, observador, { ...agressor, condicoes: [{ id: "invisivel" }] },
      ) === false],
      ["Visão às Cegas percebe atacante invisível próximo", percebe?.(
        combateVisivel, { ...observador, sentidos: visaoAsCegas },
        { ...agressor, condicoes: [{ id: "invisivel" }] },
      ) === true],
      ["Interceptador cego exige percepção alternativa", percebe?.(
        combateVisivel, { ...observador, condicoes: [{ id: "cego" }] }, agressor,
      ) === false],
      ["Visão às Cegas compensa cegueira no alcance", percebe?.(
        combateVisivel, { ...observador, condicoes: [{ id: "cego" }], sentidos: visaoAsCegas },
        agressor,
      ) === true],
      ["Visão às Cegas não atravessa cobertura total", percebe?.(
        combateBloqueado, { ...observador, sentidos: visaoAsCegas },
        { ...agressor, condicoes: [{ id: "invisivel" }] },
      ) === false],
      ["Acerto oferece Interceptação ao Guerreiro próximo", criarCenarioLista().length === 1],
      ["Erro de ataque não oferece Interceptação", criarCenarioLista({ acertou: false }).length === 0],
      ["Guerreiro atingido pode interceptar o próprio dano", criarCenarioLista({
        proprioAlvo: true,
      })[0]?.alvoId === interceptador.id],
      ["Guerreiro distante não pode interceptar", criarCenarioLista({
        defensor: { posicao: { coluna: 1, linha: 5 } },
      }).length === 0],
      ["Sem reação não aparece opção de Interceptação", criarCenarioLista({
        defensor: { reacaoDisponivel: false },
      }).length === 0],
      ["Arma arremessada remove opção de Interceptação", criarCenarioLista({
        defensor: { equipamentosArremessados: ["adaga:armaPrincipal"] },
      }).length === 0],
      ["Atacante invisível não percebido remove opção", criarCenarioLista({
        atacante: { condicoes: [{ id: "invisivel" }] },
      }).length === 0],
      ["Resultado de ataque real expõe Interceptação após acerto",
        ataqueRealAcertou.acertou === true &&
        ataqueRealAcertou.interceptacoesDisponiveis?.length === 1 &&
        ataqueRealAcertou.interceptacoesDisponiveis[0].participanteId === interceptador.id],
      ["Resultado de ataque real não expõe Interceptação após erro",
        ataqueRealErrou.acertou === false &&
        ataqueRealErrou.interceptacoesDisponiveis?.length === 0],
      ["Ativar Interceptação consome exatamente a reação do Guerreiro",
        resultadoAtivacao?.sucesso === true &&
        casoAtivacao.defensorAtaque.reacaoDisponivel === false &&
        casoAtivacao.combate.danoPendente?.interceptacao?.modificador === 2],
      ["Dano aguarda a rolagem de Interceptação sem reduzir PV",
        resultadoDanoPausado.motivo === "interceptacaoPendente" &&
        casoAtivacao.protegidoAtaque.pontosDeVida.atuais === 20 &&
        casoAtivacao.combate.danoPendente !== null],
      ["Intercepção não pode ser ativada duas vezes no mesmo dano",
        resultadoAtivacaoRepetida?.motivo === "interceptacaoJaAtiva"],
      ["Erro de ataque não consome reação de Interceptação",
        resultadoAtivacaoErro?.sucesso === false &&
        casoErroAtivacao.defensorAtaque.reacaoDisponivel === true],
      ["Resultado mínimo do d10 reduz 1 mais proficiência",
        rolagemMinima.resultado?.reducao === 3],
      ["Resultado máximo do d10 reduz 10 mais proficiência",
        rolagemMaxima.resultado?.reducao === 12],
      ["Total externo não duplica o bônus de proficiência",
        rolagemMaxima.resultado?.reducao === 12],
      ["Resultado inválido não resolve a Interceptação",
        rolagemInvalida.resultado?.motivo === "d10Invalido" &&
        rolagemInvalida.caso.combate.danoPendente?.interceptacao?.reducao === null],
      ["Rolagem de Interceptação não pode ser registrada duas vezes",
        rolagemRepetida?.motivo === "interceptacaoNaoPendente"],
      ["Interceptação parcial reduz o dano antes de afetar PV",
        danoParcialInterceptado.resultado?.danoOriginal === 9 &&
        danoParcialInterceptado.resultado?.reducaoInterceptacao === 4 &&
        danoParcialInterceptado.resultado?.danoAposInterceptacao === 5 &&
        danoParcialInterceptado.resultado?.dano === 5 &&
        danoParcialInterceptado.caso.protegidoAtaque.pontosDeVida.atuais === 15],
      ["Interceptação acima do dano zera a perda de PV",
        danoTotalInterceptado.resultado?.danoOriginal === 7 &&
        danoTotalInterceptado.resultado?.danoAposInterceptacao === 0 &&
        danoTotalInterceptado.resultado?.dano === 0 &&
        danoTotalInterceptado.caso.protegidoAtaque.pontosDeVida.atuais === 20],
      ["Resistência é aplicada após a redução da Interceptação",
        danoResistenteInterceptado.resultado?.resistenciaAplicada === true &&
        danoResistenteInterceptado.resultado?.danoAposInterceptacao === 11 &&
        danoResistenteInterceptado.resultado?.dano === 5],
    ];
    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: [
        ...verificacoes.map(([descricao, passou]) =>
          `${passou ? "✓" : "✗"} ${descricao}.`),
        `Dano parcial: ${JSON.stringify(danoParcialInterceptado.resultado)}; PV ${danoParcialInterceptado.caso.protegidoAtaque.pontosDeVida.atuais}.`,
        `Dano zerado: ${JSON.stringify(danoTotalInterceptado.resultado)}; PV ${danoTotalInterceptado.caso.protegidoAtaque.pontosDeVida.atuais}.`,
        `Dano resistente: ${JSON.stringify(danoResistenteInterceptado.resultado)}.`,
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.interceptacao-contrato",
    nome: "Interceptação — contrato da reação",
    categoria: "guerreiro-n1",
    executar: executarContratoInterceptacao,
  });

  function executarPausaInterceptacaoTurnoInimigo() {
    const inteligenciaOriginal = window.InteligenciaInimigos;
    const aleatorioOriginal = Math.random;

    function executarCenario(estilo) {
      const ataque = {
        id: "golpe-inimigo-interceptacao-dev",
        instanciaId: "golpe-inimigo-interceptacao-dev",
        nome: "Golpe inimigo",
        categoria: "corpoACorpo",
        selecao: { tipo: "criatura", alcance: { normal: 1 }, area: null },
        bonusAtaque: 4,
        dano: {
          gruposDeDados: [{ quantidade: 1, numeroDeFaces: 6 }],
          modificador: 2,
          tipo: "contundente",
        },
        propriedades: [],
      };
      const inimigo = {
        id: "inimigo-interceptacao-dev",
        nome: "Inimigo",
        tipo: "inimigo",
        estado: "ativo",
        posicao: { coluna: 2, linha: 1 },
        ataques: [ataque],
        atributos: { forca: 14, destreza: 10 },
        acaoDisponivel: true,
        acaoBonusDisponivel: true,
        reacaoDisponivel: true,
        movimentoRestante: 6,
        habilidades: { escolhas: {} },
      };
      const jogador = {
        id: "guerreiro-interceptacao-inimigo-dev",
        nome: "Guerreiro",
        tipo: "jogador",
        classeId: "guerreiro",
        estado: "ativo",
        posicao: { coluna: 1, linha: 1 },
        atributos: { forca: 16, destreza: 10 },
        classeArmadura: 12,
        pontosDeVida: { atuais: 20, maximo: 20 },
        bonusProficiencia: 2,
        reacaoDisponivel: true,
        configuracaoEquipamentos: {
          armadura: null,
          mao1: { categoria: "armas", id: "adaga" },
          mao2: null,
        },
        habilidades: { escolhas: { estilosDeLuta: estilo } },
        ataques: [],
      };
      const combate = {
        status: "ativo",
        participantes: [inimigo, jogador],
        participanteAtivoId: inimigo.id,
        ordemTurnos: [inimigo.id, jogador.id],
        tabuleiro: { colunas: 8, linhas: 8 },
        terreno: { bloqueado: [], dificil: [] },
        visao: { bloqueios: [], barreiras: [] },
        efeitosTemporarios: [],
        objetivos: [],
      };
      const resultado = window.SistemaCombate.executarTurnoInimigo(combate);
      return { combate, inimigo, jogador, resultado };
    }

    try {
      window.InteligenciaInimigos = {
        planejarTurnoTatico() { return { sucesso: false }; },
      };
      Math.random = () => 0.75;
      const comInterceptacao = executarCenario("interceptacao");
      const semInterceptacao = executarCenario("defesa");
      const ignorado = executarCenario("interceptacao");
      const resultadoIgnorado = window.SistemaCombate.concluirDanoTurnoInimigo(
        ignorado.combate,
        ignorado.resultado.decisao.resultadoAtaque,
      );
      const usado = executarCenario("interceptacao");
      const ativacao = window.SistemaCombate.ativarInterceptacao(
        usado.combate,
        usado.resultado.decisao.resultadoAtaque,
        usado.jogador.id,
      );
      const resultadoAntesD10 = window.SistemaCombate.concluirDanoTurnoInimigo(
        usado.combate,
        usado.resultado.decisao.resultadoAtaque,
      );
      const rolagemReducao = window.SistemaCombate.registrarRolagemInterceptacao(
        usado.combate,
        { gruposRolados: [{ numeroDeFaces: 10, resultados: [10] }] },
      );
      const resultadoUsado = window.SistemaCombate.concluirDanoTurnoInimigo(
        usado.combate,
        usado.resultado.decisao.resultadoAtaque,
      );
      const resultadoRepetido = window.SistemaCombate.concluirDanoTurnoInimigo(
        usado.combate,
        usado.resultado.decisao.resultadoAtaque,
      );
      const verificacoes = [
        ["Acerto inimigo pausa antes do dano para oferecer Interceptação",
          comInterceptacao.resultado?.turnoPausado === true &&
          comInterceptacao.resultado?.decisao?.tipo === "oferecerInterceptacao" &&
          comInterceptacao.combate.danoPendente !== null],
        ["A pausa mantém os PV e a reação do Guerreiro",
          comInterceptacao.jogador.pontosDeVida.atuais === 20 &&
          comInterceptacao.jogador.reacaoDisponivel === true],
        ["A decisão identifica o interceptador e guarda o acerto",
          comInterceptacao.resultado?.decisao?.participantesIds?.includes(
            comInterceptacao.jogador.id,
          ) && comInterceptacao.resultado?.decisao?.resultadoAtaque?.acertou === true],
        ["Sem o estilo, o inimigo resolve o dano sem pausa",
          semInterceptacao.resultado?.turnoPausado !== true &&
          semInterceptacao.resultado?.resultadoDano?.sucesso === true &&
          semInterceptacao.jogador.pontosDeVida.atuais < 20],
        ["Ignorar Interceptação conclui só o dano pendente",
          resultadoIgnorado?.sucesso === true &&
          ignorado.jogador.pontosDeVida.atuais < 20 &&
          ignorado.jogador.reacaoDisponivel === true &&
          ignorado.combate.danoPendente === null],
        ["Usar Interceptação aguarda o d10 antes do dano",
          ativacao?.sucesso === true &&
          resultadoAntesD10?.motivo === "interceptacaoPendente" &&
          usado.jogador.pontosDeVida.atuais === 20],
        ["D10 conclui o dano sem repetir o d20",
          rolagemReducao?.sucesso === true &&
          resultadoUsado?.sucesso === true &&
          resultadoUsado?.resultadoDano?.dano === 0 &&
          usado.jogador.pontosDeVida.atuais === 20 &&
          usado.jogador.reacaoDisponivel === false],
        ["Dano do turno inimigo não pode ser concluído duas vezes",
          resultadoRepetido?.motivo === "danoInimigoNaoPendente"],
      ];
      return {
        passou: verificacoes.every(([, passou]) => passou),
        detalhes: verificacoes.map(([descricao, passou]) =>
          `${passou ? "✓" : "✗"} ${descricao}.`),
      };
    } finally {
      window.InteligenciaInimigos = inteligenciaOriginal;
      Math.random = aleatorioOriginal;
    }
  }

  registrarTeste({
    id: "guerreiro.interceptacao-turno-inimigo",
    nome: "Interceptação — pausa no turno inimigo",
    categoria: "guerreiro-n1",
    executar: executarPausaInterceptacaoTurnoInimigo,
  });

  if (window.location.pathname?.endsWith("/laboratorio-dev.html")) {
    async function executarRoteamentoRolagemInterceptacao() {
      const estadoAnterior = window.estadoAtualJogo;
      const concluirAnterior = window.concluirDecisaoInterceptacao;
      const danoComumAnterior = window.resolverDanoJogador;
      let finalizacoes = 0;
      let rolagensDanoComum = 0;
      const combate = {
        decisaoPendente: { tipo: "oferecerInterceptacao" },
        danoPendente: {
          interceptacao: { reducao: null, modificador: 2 },
        },
      };

      try {
        window.estadoAtualJogo = { combateAtual: combate };
        window.concluirDecisaoInterceptacao = async function concluirTeste() {
          finalizacoes += 1;
          return true;
        };
        window.resolverDanoJogador = function danoComumTeste() {
          rolagensDanoComum += 1;
        };

        window.receberResultadoRolagem({
          detail: {
            gruposRolados: [{ numeroDeFaces: 10, resultados: [3] }],
          },
        });
        await Promise.resolve();

        const verificacoes = [
          ["D10 de Interceptação registra 3 mais proficiência",
            combate.danoPendente.interceptacao.reducao === 5],
          ["D10 chama a finalização da decisão uma vez", finalizacoes === 1],
          ["D10 não chega ao resolvedor de dano comum", rolagensDanoComum === 0],
        ];
        return {
          passou: verificacoes.every(([, passou]) => passou),
          detalhes: verificacoes.map(([descricao, passou]) =>
            `${passou ? "✓" : "✗"} ${descricao}.`),
        };
      } finally {
        window.estadoAtualJogo = estadoAnterior;
        window.concluirDecisaoInterceptacao = concluirAnterior;
        window.resolverDanoJogador = danoComumAnterior;
      }
    }

    registrarTeste({
      id: "guerreiro.interceptacao-roteamento-d10",
      nome: "Interceptação — encaminhamento do d10",
      categoria: "guerreiro-n1",
      executar: executarRoteamentoRolagemInterceptacao,
    });
  }

  function executarAuditoriaSegundoFolegoBasica() {
    const guerreiro = {
      id: "guerreiro-segundo-folego-dev",
      classeId: "guerreiro",
      nivel: 1,
      atributos: {
        constituicao: 14,
      },
      pontosDeVida: {
        atuais: 4,
        maximo: 12,
      },
      habilidades: {
        escolhas: {},
      },
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
    };

    guerreiro.habilidades.recursos =
      window.obterRecursosHabilidadesPersonagem?.(guerreiro) ?? {};

    const recurso = guerreiro.habilidades.recursos.segundoFolego;
    const operacao = window.TradutorRegras.prepararOperacoes({
      gatilho: "aoAtivar",
      participante: guerreiro,
      modo: "combate",
    }).find((item) => item.origem?.id === "segundoFolego");

    const custoConsumido = operacao
      ? window.SistemaCombate.consumirAcaoBonus(guerreiro)
      : false;
    const recursoConsumido = operacao
      ? window.TradutorRegras.consumirRecurso(guerreiro, operacao)
      : { sucesso: false };
    const cura = operacao
      ? window.SistemaCombate.aplicarCura(
          guerreiro,
          10 + Number(operacao.rolagem?.modificador ?? 0),
        )
      : { sucesso: false };

    const operacoesExibidasPeloPainel = window.TradutorRegras.prepararOperacoes({
      gatilho: "aoAtivar",
      participante: guerreiro,
      modo: "combate",
    });
    const painelAindaExibeSegundoFolego = operacoesExibidasPeloPainel.some(
      (item) => item.origem?.id === "segundoFolego",
    );
    const expressaoCura = window.formatarExpressaoRolagemNarrativa?.(
      operacao?.rolagem,
    );
    const mensagemCura = window.mensagensNarrativas?.habilidades?.pedirCura?.(
      operacao?.origem?.nome,
      expressaoCura,
    );

    const guerreiroEsgotamento = structuredClone(guerreiro);
    guerreiroEsgotamento.pontosDeVida.atuais = 6;
    guerreiroEsgotamento.habilidades.recursos.segundoFolego.usosAtuais = 2;
    guerreiroEsgotamento.acaoBonusDisponivel = true;

    const prepararSegundoFolego = () =>
      window.TradutorRegras.prepararOperacoes({
        gatilho: "aoAtivar",
        participante: guerreiroEsgotamento,
        modo: "combate",
      }).find((item) => item.origem?.id === "segundoFolego");

    const primeiroUso = prepararSegundoFolego();
    const consumoPrimeiroUso = window.TradutorRegras.consumirRecurso(
      guerreiroEsgotamento,
      primeiroUso,
    );
    guerreiroEsgotamento.acaoBonusDisponivel = true;
    const segundoUso = prepararSegundoFolego();
    const consumoSegundoUso = window.TradutorRegras.consumirRecurso(
      guerreiroEsgotamento,
      segundoUso,
    );
    guerreiroEsgotamento.acaoBonusDisponivel = true;
    const terceiroUso = prepararSegundoFolego();

    const personagemRecarregado = window.PersonagemDados.normalizar(
      guerreiroEsgotamento,
    );
    const recursoRecarregado =
      personagemRecarregado.habilidades.recursos.segundoFolego;

    const estadoJogoExistente = Boolean(window.estadoJogo);
    const combateOriginal = window.estadoJogo?.combateAtual;

    if (estadoJogoExistente) {
      window.estadoJogo.combateAtual = null;
    }

    let descansoLongo;

    try {
      descansoLongo = window.SistemaDescansos.prepararDescansoLongo(
        personagemRecarregado,
        {
          tempoAtual: 100000,
          ultimoDescansoLongoConcluidoEm: null,
        },
      );
    } finally {
      if (estadoJogoExistente) {
        window.estadoJogo.combateAtual = combateOriginal;
      }
    }

    const recursoAposDescansoLongo =
      descansoLongo?.personagem?.habilidades?.recursos?.segundoFolego;

    const casosDescansoCurto = [
      { inicial: 0, esperado: 1 },
      { inicial: 1, esperado: 2 },
      { inicial: 2, esperado: 2 },
    ].map(function testarRecuperacaoDescansoCurto(caso) {
      const personagemTeste = structuredClone(personagemRecarregado);
      const recursoTeste =
        personagemTeste.habilidades.recursos.segundoFolego;
      recursoTeste.usosAtuais = caso.inicial;

      const recuperados =
        window.SistemaDescansos.aplicarRecuperacaoDeRecursos(
          personagemTeste,
          "descansoCurto",
        );

      return {
        ...caso,
        obtido: recursoTeste.usosAtuais,
        recuperados,
      };
    });

    const descansoCurtoCorreto = casosDescansoCurto.every(
      (caso) =>
        caso.obtido === caso.esperado &&
        (caso.inicial === 2
          ? caso.recuperados.length === 0
          : caso.recuperados.some(
              (recursoRecuperado) =>
                recursoRecuperado.id === "segundoFolego" &&
                recursoRecuperado.recuperado === 1,
            )),
    );

    const passou =
      recurso?.usosMaximos === 2 &&
      operacao?.custo === "acaoBonus" &&
      operacao?.rolagem?.gruposDeDados?.[0]?.numeroDeFaces === 10 &&
      operacao?.rolagem?.modificador === 1 &&
      custoConsumido &&
      guerreiro.acaoDisponivel &&
      !guerreiro.acaoBonusDisponivel &&
      recursoConsumido.sucesso &&
      recurso.usosAtuais === 1 &&
      cura.sucesso &&
      cura.curaSolicitada === 11 &&
      cura.curaAplicada === 8 &&
      guerreiro.pontosDeVida.atuais === 12 &&
      expressaoCura === "1d10 + 1" &&
      mensagemCura ===
        "Role <strong>1d10 + 1</strong> para recuperar pontos de vida com Segundo Fôlego." &&
      consumoPrimeiroUso.sucesso &&
      consumoSegundoUso.sucesso &&
      guerreiroEsgotamento.habilidades.recursos.segundoFolego.usosAtuais === 0 &&
      terceiroUso === undefined &&
      recursoRecarregado.usosAtuais === 0 &&
      recursoRecarregado.recuperacao?.descansoCurto?.quantidade === 1 &&
      recursoRecarregado.recuperacao?.descansoLongo?.restaurarTodos === true &&
      descansoLongo?.sucesso &&
      recursoAposDescansoLongo?.usosAtuais === 2 &&
      descansoCurtoCorreto &&
      !painelAindaExibeSegundoFolego;

    return {
      passou,
      detalhes: [
        `Usos iniciais: ${recurso?.usosAtuais} de ${recurso?.usosMaximos} após uma ativação.`,
        `Custo preparado: ${operacao?.custo}.`,
        `Fórmula preparada: 1d${operacao?.rolagem?.gruposDeDados?.[0]?.numeroDeFaces} + ${operacao?.rolagem?.modificador}.`,
        `Ação normal disponível: ${guerreiro.acaoDisponivel}; ação bônus disponível: ${guerreiro.acaoBonusDisponivel}.`,
        `Cura solicitada: ${cura.curaSolicitada}; aplicada: ${cura.curaAplicada}; PV atuais: ${guerreiro.pontosDeVida.atuais}.`,
        `Mensagem apresentada: ${mensagemCura}`,
        `Após dois usos: ${guerreiroEsgotamento.habilidades.recursos.segundoFolego.usosAtuais} de 2.`,
        terceiroUso
          ? "✗ Um terceiro uso foi oferecido indevidamente."
          : "✓ O terceiro uso foi bloqueado.",
        `Após normalizar/recarregar: ${recursoRecarregado.usosAtuais} de ${recursoRecarregado.usosMaximos}.`,
        `Recuperação registrada: curto +${recursoRecarregado.recuperacao?.descansoCurto?.quantidade}; longo restaura todos = ${recursoRecarregado.recuperacao?.descansoLongo?.restaurarTodos}.`,
        `Após descanso longo: ${recursoAposDescansoLongo?.usosAtuais} de ${recursoAposDescansoLongo?.usosMaximos}.`,
        ...casosDescansoCurto.map(
          (caso) =>
            `Descanso curto: ${caso.inicial} → ${caso.obtido} (esperado ${caso.esperado}).`,
        ),
        painelAindaExibeSegundoFolego
          ? "✗ O painel ainda oferece Segundo Fôlego sem ação bônus disponível."
          : "✓ O painel oculta Segundo Fôlego sem ação bônus disponível.",
      ],
    };
  }

  registrarTeste({
    id: "guerreiro.segundo-folego.basico",
    nome: "Segundo Fôlego — ativação e cura",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaSegundoFolegoBasica,
  });

  function executarAuditoriaEconomiaTurno() {
    const guerreiro = {
      id: "guerreiro-economia-turno-dev",
      nome: "Guerreiro",
      tipo: "jogador",
      estado: "ativo",
      posicao: { coluna: 2, linha: 2 },
      movimentoMaximo: 6,
      movimentoRestante: 0,
      acaoDisponivel: false,
      acaoBonusDisponivel: false,
      reacaoDisponivel: false,
      desengajando: true,
      habilidades: { escolhas: {} },
      ataques: [],
      condicoes: [],
    };
    const aliado = {
      id: "aliado-economia-turno-dev",
      nome: "Aliado",
      tipo: "aliado",
      estado: "ativo",
      posicao: { coluna: 10, linha: 10 },
      movimentoMaximo: 6,
      movimentoRestante: 0,
      acaoDisponivel: false,
      acaoBonusDisponivel: false,
      reacaoDisponivel: false,
      habilidades: { escolhas: {} },
      ataques: [],
      condicoes: [],
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [guerreiro.id, aliado.id],
      participanteAtivoId: guerreiro.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: { bloqueios: [], barreiras: [] },
      participantes: [guerreiro, aliado],
      efeitosTemporarios: [],
      objetivos: [],
    };

    window.SistemaCombate.iniciarTurnoAtual(combate);
    const iniciouCompleto =
      guerreiro.acaoDisponivel &&
      guerreiro.acaoBonusDisponivel &&
      guerreiro.reacaoDisponivel &&
      guerreiro.movimentoRestante === 6 &&
      !guerreiro.desengajando;

    const movimento = window.SistemaCombate.movimentarParticipante(
      combate,
      guerreiro.id,
      4,
      2,
    );
    const movimentoPreservouAcoes =
      movimento.sucesso &&
      guerreiro.movimentoRestante === 4 &&
      guerreiro.acaoDisponivel &&
      guerreiro.acaoBonusDisponivel &&
      guerreiro.reacaoDisponivel;

    const consumiuAcao = window.SistemaCombate.consumirAcao(guerreiro);
    const movimentoDepoisDaAcao = window.SistemaCombate.movimentarParticipante(
      combate,
      guerreiro.id,
      5,
      2,
    );
    const acaoIndependenteDoMovimento =
      consumiuAcao &&
      movimentoDepoisDaAcao.sucesso &&
      guerreiro.movimentoRestante === 3;

    const consumiuBonus = window.SistemaCombate.consumirAcaoBonus(guerreiro);
    const consumiuReacao = window.SistemaCombate.consumirReacao(guerreiro);
    const repetiuAcao = window.SistemaCombate.consumirAcao(guerreiro);
    const repetiuBonus = window.SistemaCombate.consumirAcaoBonus(guerreiro);
    const repetiuReacao = window.SistemaCombate.consumirReacao(guerreiro);

    const movimentoExcessivo = window.SistemaCombate.movimentarParticipante(
      combate,
      guerreiro.id,
      9,
      2,
    );
    const posicaoAposFalha = structuredClone(guerreiro.posicao);

    const turnoAliado = window.SistemaCombate.encerrarTurno(combate);
    const recursosGuerreiroContinuamGastos =
      !guerreiro.acaoDisponivel &&
      !guerreiro.acaoBonusDisponivel &&
      !guerreiro.reacaoDisponivel;
    const turnoGuerreiroSeguinte = window.SistemaCombate.encerrarTurno(combate);
    const reiniciouTurnoSeguinte =
      turnoGuerreiroSeguinte?.id === guerreiro.id &&
      combate.rodada === 2 &&
      guerreiro.acaoDisponivel &&
      guerreiro.acaoBonusDisponivel &&
      guerreiro.reacaoDisponivel &&
      guerreiro.movimentoRestante === 6;

    const resultadoDesengajar = window.SistemaCombate.usarAcaoDesengajar(
      combate,
      guerreiro.id,
    );
    const desengajarCorreto =
      resultadoDesengajar.sucesso &&
      guerreiro.desengajando &&
      !guerreiro.acaoDisponivel &&
      guerreiro.acaoBonusDisponivel &&
      guerreiro.reacaoDisponivel;

    const verificacoes = [
      ["O turno começa com todos os recursos disponíveis", iniciouCompleto],
      ["Mover não consome ação, ação bônus ou reação", movimentoPreservouAcoes],
      ["É possível mover depois de gastar a ação", acaoIndependenteDoMovimento],
      ["Ação, ação bônus e reação são independentes", consumiuBonus && consumiuReacao],
      ["Cada recurso só pode ser consumido uma vez", !repetiuAcao && !repetiuBonus && !repetiuReacao],
      [
        "Movimento insuficiente bloqueia o deslocamento sem mudar a posição",
        !movimentoExcessivo.sucesso &&
          movimentoExcessivo.motivo === "movimentoInsuficiente" &&
          posicaoAposFalha.coluna === 5 &&
          posicaoAposFalha.linha === 2,
      ],
      ["Encerrar o turno não recarrega o participante anterior", recursosGuerreiroContinuamGastos],
      ["Os recursos recarregam no próximo turno próprio", reiniciouTurnoSeguinte],
      ["Desengajar consome somente a ação", desengajarCorreto],
      ["A ordem de turnos avançou para o aliado", turnoAliado?.id === aliado.id],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: verificacoes.map(
        ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.economia-turno",
    nome: "Economia do turno — ação, bônus, reação e movimento",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaEconomiaTurno,
  });

  function criarCenarioAtaqueOportunidade({
    reacaoDisponivel = true,
    desengajando = false,
    alcance = 1,
    semVisao = false,
  } = {}) {
    const ameacador = {
      id: "ameacador-oportunidade-dev",
      nome: "Guerreiro ameaçador",
      tipo: "inimigo",
      grupoId: "inimigos",
      estado: "ativo",
      classeArmadura: 16,
      posicao: { coluna: 2, linha: 2 },
      atributos: { forca: 16, destreza: 10 },
      pontosDeVida: { atuais: 100, maximo: 100 },
      movimentoMaximo: 6,
      movimentoRestante: 6,
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel,
      habilidades: { escolhas: {} },
      ataques: [
        {
          id: "ataque-oportunidade-dev",
          instanciaId: "ataque-oportunidade-dev",
          equipamentoInstanciaId: "ataque-oportunidade-dev",
          armaId: "espadaLonga",
          nome: "Espada Longa",
          categoria: "corpoACorpo",
          atributoId: "forca",
          propriedades: [],
          bonusAtaque: 5,
          custoPadrao: "acao",
          selecao: {
            tipo: "criatura",
            alcance: { normal: alcance, longo: null },
          },
          dano: {
            gruposDeDados: [{ quantidade: 1, numeroDeFaces: 8 }],
            modificador: 3,
            modificadorAtributo: 3,
            tipo: "cortante",
          },
        },
      ],
      condicoes: [],
    };
    const alvo = {
      id: "alvo-oportunidade-dev",
      nome: "Alvo em movimento",
      tipo: "jogador",
      grupoId: "jogadores",
      estado: "ativo",
      classeArmadura: 12,
      posicao: { coluna: alcance === 1 ? 3 : 4, linha: 2 },
      atributos: { forca: 10, destreza: 14 },
      pontosDeVida: { atuais: 100, maximo: 100 },
      movimentoMaximo: 6,
      movimentoRestante: 6,
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
      desengajando,
      habilidades: { escolhas: {} },
      ataques: [],
      condicoes: [],
    };
    const combate = {
      status: "ativo",
      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [alvo.id, ameacador.id],
      participanteAtivoId: alvo.id,
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: { bloqueado: [], dificil: [] },
      visao: {
        bloqueios: [],
        barreiras: semVisao
          ? [
              {
                coluna: alvo.posicao.coluna,
                linha: alvo.posicao.linha,
                lado: "oeste",
                tipo: "bloqueioTotal",
              },
            ]
          : [],
      },
      participantes: [alvo, ameacador],
      efeitosTemporarios: [],
      objetivos: [],
    };

    return { combate, alvo, ameacador };
  }

  function executarAuditoriaAtaquesOportunidade() {
    const contexto = criarCenarioAtaqueOportunidade();
    const pediuConfirmacao = window.SistemaCombate.movimentarParticipante(
      contexto.combate,
      contexto.alvo.id,
      5,
      2,
    );
    const posicaoAntesConfirmacao = structuredClone(contexto.alvo.posicao);
    const movimentoConfirmado = window.SistemaCombate.movimentarParticipante(
      contexto.combate,
      contexto.alvo.id,
      5,
      2,
      { confirmarSaidaZona: true },
    );

    const semReacao = criarCenarioAtaqueOportunidade({
      reacaoDisponivel: false,
    });
    const movimentoSemReacao = window.SistemaCombate.movimentarParticipante(
      semReacao.combate,
      semReacao.alvo.id,
      5,
      2,
    );

    const desengajando = criarCenarioAtaqueOportunidade({ desengajando: true });
    const movimentoDesengajando = window.SistemaCombate.movimentarParticipante(
      desengajando.combate,
      desengajando.alvo.id,
      5,
      2,
    );

    const alcanceEstendido = criarCenarioAtaqueOportunidade({ alcance: 2 });
    const saidaAlcanceEstendido = window.SistemaCombate.movimentarParticipante(
      alcanceEstendido.combate,
      alcanceEstendido.alvo.id,
      6,
      2,
    );

    const semVisao = criarCenarioAtaqueOportunidade({ semVisao: true });
    const movimentoSemVisao = window.SistemaCombate.movimentarParticipante(
      semVisao.combate,
      semVisao.alvo.id,
      5,
      2,
    );

    const deslocamentoForcado = criarCenarioAtaqueOportunidade();
    const reacaoAntesDeslocamento = deslocamentoForcado.ameacador.reacaoDisponivel;
    const resultadoDeslocamentoForcado =
      window.SistemaCombate.aplicarDeslocamentoForcado(
        deslocamentoForcado.combate,
        {
          tipo: "deslocarAlvo",
          participanteId: deslocamentoForcado.ameacador.id,
          alvoId: deslocamentoForcado.alvo.id,
          distanciaCelulas: 2,
        },
      );

    const ataqueDesarmado = criarCenarioAtaqueOportunidade();
    ataqueDesarmado.ameacador.ataques[0] = {
      ...ataqueDesarmado.ameacador.ataques[0],
      id: "ataque-desarmado-oportunidade-dev",
      instanciaId: "ataque-desarmado-oportunidade-dev",
      equipamentoInstanciaId: null,
      armaId: null,
      nome: "Ataque Desarmado",
      dano: {
        gruposDeDados: [],
        modificador: 4,
        modificadorAtributo: 3,
        tipo: "contundente",
      },
    };
    const saidaContraAtaqueDesarmado =
      window.SistemaCombate.movimentarParticipante(
        ataqueDesarmado.combate,
        ataqueDesarmado.alvo.id,
        5,
        2,
      );

    const verificacoes = [
      [
        "Sair do alcance pede confirmação antes de mover",
        !pediuConfirmacao.sucesso &&
          pediuConfirmacao.motivo === "confirmacaoSaidaZonaNecessaria" &&
          posicaoAntesConfirmacao.coluna === 3,
      ],
      [
        "Confirmar executa um ataque imediatamente antes da saída",
        movimentoConfirmado.sucesso &&
          movimentoConfirmado.ataquesOportunidade.length === 1 &&
          movimentoConfirmado.ataquesOportunidade[0].oportunidade.origem.coluna === 3,
      ],
      [
        "O ataque consome somente a reação do ameaçador",
        !contexto.ameacador.reacaoDisponivel &&
          contexto.ameacador.acaoDisponivel &&
          contexto.ameacador.acaoBonusDisponivel,
      ],
      [
        "Sem reação disponível não há ataque de oportunidade",
        movimentoSemReacao.sucesso && movimentoSemReacao.ataquesOportunidade.length === 0,
      ],
      [
        "Desengajar evita o ataque de oportunidade",
        movimentoDesengajando.sucesso &&
          movimentoDesengajando.ataquesOportunidade.length === 0,
      ],
      [
        "Armas com alcance estendido ameaçam até seu alcance",
        !saidaAlcanceEstendido.sucesso &&
          saidaAlcanceEstendido.motivo === "confirmacaoSaidaZonaNecessaria",
      ],
      [
        "Sem linha de visão não há ataque nem pedido de confirmação",
        movimentoSemVisao.sucesso &&
          movimentoSemVisao.ataquesOportunidade.length === 0,
      ],
      [
        "Deslocamento forçado não provoca ataque de oportunidade",
        resultadoDeslocamentoForcado.sucesso &&
          resultadoDeslocamentoForcado.distanciaPercorrida === 2 &&
          deslocamentoForcado.ameacador.reacaoDisponivel ===
            reacaoAntesDeslocamento,
      ],
      [
        "O motor aceita Ataque Desarmado como ataque de oportunidade",
        !saidaContraAtaqueDesarmado.sucesso &&
          saidaContraAtaqueDesarmado.motivo ===
            "confirmacaoSaidaZonaNecessaria" &&
          saidaContraAtaqueDesarmado.decisao?.ameacadores?.some(
            (ameacador) => ameacador.id === ataqueDesarmado.ameacador.id,
          ),
      ],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: verificacoes.map(
        ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.ataques-oportunidade",
    nome: "Ataques de oportunidade",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaAtaquesOportunidade,
  });

  function executarAuditoriaArmasArremessaveis() {
    function criarCombateTeste() {
      return {
        tabuleiro: { colunas: 48, linhas: 27 },
        terreno: { bloqueado: [] },
        participantes: [],
        itensNoChao: [],
      };
    }

    function criarContextoDestino() {
      const combate = criarCombateTeste();
      const atacante = {
        id: "jogador-arremesso-dev",
        estado: "ativo",
        posicao: { coluna: 5, linha: 5 },
      };
      const alvo = {
        id: "alvo-arremesso-dev",
        estado: "ativo",
        posicao: { coluna: 10, linha: 10 },
      };
      const ataque = {
        armaId: "adaga",
        equipamentoInstanciaId: "adaga:mao2",
        modoUso: "arremesso",
        nome: "Adaga (arremesso)",
      };

      combate.participantes.push(atacante, alvo);
      return { combate, atacante, alvo, ataque };
    }

    const centro = { coluna: 10, linha: 10 };
    const combateLivre = criarCombateTeste();
    const celulasLivres = window.SistemaCombate.listarCelulasAdjacentesLivres(
      combateLivre,
      centro,
    );

    const combateComRestricoes = criarCombateTeste();
    combateComRestricoes.terreno.bloqueado.push({ coluna: 9, linha: 9 });
    combateComRestricoes.participantes.push({
      id: "ocupante-arremesso-dev",
      estado: "ativo",
      posicao: { coluna: 10, linha: 9 },
    });
    combateComRestricoes.itensNoChao.push({
      id: "item-existente-arremesso-dev",
      posicao: { coluna: 11, linha: 9 },
    });
    const celulasFiltradas = window.SistemaCombate.listarCelulasAdjacentesLivres(
      combateComRestricoes,
      centro,
    );

    const combateRegistro = criarCombateTeste();
    const atacanteRegistro = { id: "jogador-registro-arremesso-dev" };
    const adaga = {
      armaId: "adaga",
      equipamentoInstanciaId: "adaga:mao2",
      modoUso: "arremesso",
      nome: "Adaga (arremesso)",
    };
    const registro = window.SistemaCombate.registrarArmaArremessadaNoChao(
      combateRegistro,
      atacanteRegistro,
      adaga,
      centro,
    );
    const registroDuplicado = window.SistemaCombate.registrarArmaArremessadaNoChao(
      combateRegistro,
      atacanteRegistro,
      adaga,
      centro,
    );
    const registroInvalido = window.SistemaCombate.registrarArmaArremessadaNoChao(
      criarCombateTeste(),
      atacanteRegistro,
      { ...adaga, modoUso: "padrao" },
      centro,
    );

    const contextoErro = criarContextoDestino();
    const destinoErro = window.SistemaCombate.resolverDestinoArmaArremessada({
      ...contextoErro,
      acertou: false,
    });
    const contextoDanoComum = criarContextoDestino();
    const destinoDanoComum = window.SistemaCombate.resolverDestinoArmaArremessada({
      ...contextoDanoComum,
      acertou: true,
      resultadoRolagemDano: {
        gruposRolados: [{ numeroDeFaces: 4, resultados: [3] }],
      },
    });
    const contextoDanoMaximo = criarContextoDestino();
    const destinoDanoMaximo = window.SistemaCombate.resolverDestinoArmaArremessada({
      ...contextoDanoMaximo,
      acertou: true,
      resultadoRolagemDano: {
        gruposRolados: [{ numeroDeFaces: 4, resultados: [4] }],
      },
    });

    const primeiroSorteio = window.SistemaCombate.sortearCelulaAdjacenteLivre(
      combateLivre,
      centro,
      () => 0,
    );
    const ultimoSorteio = window.SistemaCombate.sortearCelulaAdjacenteLivre(
      combateLivre,
      centro,
      () => 0.999999,
    );
    const verificacoes = [
      ["O valor máximo de um dado é reconhecido", window.SistemaCombate.algumDadoRolouMaximo({ gruposRolados: [{ numeroDeFaces: 4, resultados: [4] }] })],
      ["Resultados abaixo do máximo não são confundidos", !window.SistemaCombate.algumDadoRolouMaximo({ gruposRolados: [{ numeroDeFaces: 4, resultados: [3] }] })],
      ["Uma célula central possui oito destinos adjacentes", celulasLivres.length === 8],
      ["O sorteio alcança a primeira e a última célula", JSON.stringify(primeiroSorteio) === JSON.stringify(celulasLivres[0]) && JSON.stringify(ultimoSorteio) === JSON.stringify(celulasLivres.at(-1))],
      ["Terreno, criatura e item removem células indisponíveis", celulasFiltradas.length === 5],
      ["A arma é registrada uma única vez no chão", registro.sucesso && combateRegistro.itensNoChao.length === 1 && registroDuplicado.motivo === "itemJaEstaNoChao"],
      ["O nome armazenado remove o sufixo de arremesso", registro.item?.nome === "Adaga"],
      ["Uso corpo a corpo não é registrado como arremesso", registroInvalido.motivo === "ataqueNaoEhArremesso"],
      ["Um ataque errado envia a arma ao chão", destinoErro.destino === "chao" && contextoErro.combate.itensNoChao.length === 1],
      ["Acerto sem dano máximo envia a arma ao chão", destinoDanoComum.destino === "chao" && contextoDanoComum.alvo.itensCravados === undefined],
      ["Acerto com dano máximo crava a arma no alvo", destinoDanoMaximo.destino === "alvo" && contextoDanoMaximo.alvo.itensCravados?.length === 1],
      ["A arma cravada preserva sua identidade", contextoDanoMaximo.alvo.itensCravados?.[0]?.equipamentoInstanciaId === contextoDanoMaximo.ataque.equipamentoInstanciaId],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: verificacoes.map(
        ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.armas-arremessaveis",
    nome: "Armas arremessáveis — queda e arma cravada",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaArmasArremessaveis,
  });

  function executarAuditoriaDanoFixo() {
    function criarContexto(critico) {
      const atacante = {
        id: `atacante-dano-fixo-${critico}`,
        nome: "Guerreiro",
        tipo: "jogador",
        estado: "ativo",
        habilidades: { escolhas: {} },
        ataques: [
          {
            id: "ataque-desarmado-dano-fixo-dev",
            instanciaId: "ataque-desarmado-dano-fixo-dev",
            nome: "Ataque Desarmado",
            dano: {
              gruposDeDados: [],
              fixo: 4,
              modificador: 4,
              tipo: "contundente",
            },
          },
        ],
      };
      const alvo = {
        id: `alvo-dano-fixo-${critico}`,
        nome: "Alvo",
        tipo: "inimigo",
        estado: "ativo",
        pontosDeVida: { atuais: 10, maximo: 10, temporarios: 0 },
        habilidades: { escolhas: {} },
      };
      const combate = {
        status: "ativo",
        participantes: [atacante, alvo],
        efeitosTemporarios: [],
        objetivos: [],
        danoPendente: {
          atacanteId: atacante.id,
          alvoId: alvo.id,
          ataqueId: atacante.ataques[0].instanciaId,
          critico,
          efeitos: [],
        },
      };

      return { combate, alvo };
    }

    function resolverContexto(critico) {
      const contexto = criarContexto(critico);
      const resultado = window.SistemaCombate.resolverDano(contexto.combate, {
        gruposRolados: [],
        subtotal: 0,
        modificador: 4,
        total: 4,
        critico,
      });

      return { ...contexto, resultado };
    }

    const normal = resolverContexto(false);
    const critico = resolverContexto(true);
    const verificacoes = [
      [
        "Dano fixo normal causa exatamente 4 pontos",
        normal.resultado.sucesso &&
          normal.resultado.dano === 4 &&
          normal.alvo.pontosDeVida.atuais === 6,
      ],
      [
        "Acerto crítico não dobra dano fixo sem dados",
        critico.resultado.sucesso &&
          critico.resultado.dano === 4 &&
          critico.alvo.pontosDeVida.atuais === 6,
      ],
      [
        "A pendência de dano é encerrada após a aplicação",
        normal.combate.danoPendente === null &&
          critico.combate.danoPendente === null,
      ],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: verificacoes.map(
        ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.dano-fixo",
    nome: "Dano fixo — normal e crítico",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaDanoFixo,
  });

  function executarAuditoriaAtaqueDesarmado() {
    const criarPersonagem = (
      forca,
      { estilo = null, mao1 = null, mao2 = null } = {},
    ) => ({
      classeId: "guerreiro",
      nivel: 1,
      atributos: { forca },
      habilidades: { escolhas: { estilosDeLuta: estilo } },
      detalhes: { equipamentos: {} },
      configuracaoInicialCombate: {
        armadura: null,
        mao1,
        mao2,
      },
    });
    const criarAtaque =
      window.RegrasFichaCriacao?.criarAtaqueCombateDesarmado;
    const ataqueForca16 = criarAtaque?.(criarPersonagem(16));
    const ataqueForca8 = criarAtaque?.(criarPersonagem(8));
    const ataqueSemForca = criarAtaque?.(criarPersonagem(""));
    const ataqueDesarmadoSemItens = criarAtaque?.(
      criarPersonagem(16, { estilo: "combateDesarmado" }),
    );
    const ataqueDesarmadoComArma = criarAtaque?.(
      criarPersonagem(16, {
        estilo: "combateDesarmado",
        mao1: { categoria: "armas", id: "espadaLonga" },
      }),
    );
    const ataqueDesarmadoComEscudo = criarAtaque?.(
      criarPersonagem(16, {
        estilo: "combateDesarmado",
        mao2: { categoria: "escudos", id: "escudo" },
      }),
    );

    const contextoOportunidade = criarCenarioAtaqueOportunidade();
    contextoOportunidade.ameacador.ataques = [
      structuredClone(ataqueForca16),
    ];
    const oportunidadeDesarmada = window.SistemaCombate.movimentarParticipante(
      contextoOportunidade.combate,
      contextoOportunidade.alvo.id,
      5,
      2,
    );

    function prepararInicioTurnoCombateDesarmado({
      estilo = "combateDesarmado",
      aplicadoPorId = "guerreiro-combate-desarmado-dev",
      incluirAgarramento = true,
    } = {}) {
      const guerreiro = {
        id: "guerreiro-combate-desarmado-dev",
        classeId: "guerreiro",
        estado: "ativo",
        movimentoMaximo: 6,
        condicoes: [],
        habilidades: { escolhas: { estilosDeLuta: estilo } },
      };
      const alvo = {
        id: "alvo-combate-desarmado-dev",
        estado: "ativo",
        condicoes: incluirAgarramento
          ? [{ id: "agarrado", aplicadoPorId }]
          : [],
      };
      const combate = {
        participantes: [guerreiro, alvo],
        ordemTurnos: [guerreiro.id, alvo.id],
        indiceTurno: 0,
        rodada: 1,
        efeitosTemporarios: [],
      };

      window.SistemaCombate.iniciarTurnoAtual(combate);

      return combate.operacoesInicioTurnoDisponiveis ?? [];
    }

    const operacoesAgarramentoProprio = prepararInicioTurnoCombateDesarmado();
    const operacoesSemAgarramento = prepararInicioTurnoCombateDesarmado({
      incluirAgarramento: false,
    });
    const operacoesAgarramentoAlheio = prepararInicioTurnoCombateDesarmado({
      aplicadoPorId: "outra-criatura-dev",
    });
    const operacoesSemEstilo = prepararInicioTurnoCombateDesarmado({
      estilo: "defesa",
    });
    const operacaoDanoAgarrado = operacoesAgarramentoProprio[0];

    const atacanteDanoAgarrado = {
      id: "guerreiro-combate-desarmado-dev",
      classeId: "guerreiro",
      estado: "ativo",
      acaoDisponivel: true,
      acaoBonusDisponivel: true,
      reacaoDisponivel: true,
      habilidades: { escolhas: { estilosDeLuta: "combateDesarmado" } },
      ataques: [],
    };
    const alvoDanoAgarrado = {
      id: "alvo-combate-desarmado-dev",
      estado: "ativo",
      pontosDeVida: { atuais: 10, maximo: 10, temporarios: 0 },
      habilidades: { escolhas: {} },
    };
    const combateDanoAgarrado = {
      status: "ativo",
      participantes: [atacanteDanoAgarrado, alvoDanoAgarrado],
      efeitosTemporarios: [],
      objetivos: [],
    };
    const preparacaoDanoAgarrado =
      window.SistemaCombate.prepararDanoRoladoSemAcerto(
        combateDanoAgarrado,
        operacaoDanoAgarrado,
      );
    const resultadoDanoAgarrado = window.SistemaCombate.resolverDano(
      combateDanoAgarrado,
      {
        gruposRolados: [
          {
            numeroDeFaces: 4,
            resultados: [3],
            total: 3,
          },
        ],
        subtotal: 3,
        modificador: 0,
        total: 3,
      },
    );

    const verificacoes = [
      ["A fábrica pública está disponível", typeof criarAtaque === "function"],
      [
        "Força 16 produz ataque +5 e dano fixo 4",
        ataqueForca16?.bonusAtaque === 5 &&
          ataqueForca16?.dano.fixo === 4 &&
          ataqueForca16?.dano.modificador === 4,
      ],
      [
        "Força 8 produz ataque +1 e dano mínimo 0",
        ataqueForca8?.bonusAtaque === 1 &&
          ataqueForca8?.dano.fixo === 0,
      ],
      [
        "A criação incompleta não gera Ataque Desarmado inválido",
        ataqueSemForca === null,
      ],
      [
        "Combate Desarmado usa d8 sem armas nem escudo",
        ataqueDesarmadoSemItens?.dano?.gruposDeDados?.[0]?.numeroDeFaces === 8 &&
          ataqueDesarmadoSemItens?.dano?.modificador === 3 &&
          ataqueDesarmadoSemItens?.dano?.fixo === null,
      ],
      [
        "Combate Desarmado usa d6 quando empunha uma arma",
        ataqueDesarmadoComArma?.dano?.gruposDeDados?.[0]?.numeroDeFaces === 6,
      ],
      [
        "Combate Desarmado usa d6 quando empunha um escudo",
        ataqueDesarmadoComEscudo?.dano?.gruposDeDados?.[0]?.numeroDeFaces === 6,
      ],
      [
        "O dado desarmado não é identificado como dado de arma",
        ataqueDesarmadoSemItens?.dano?.gruposDeDados?.[0]?.origem ===
          "ataqueDesarmado",
      ],
      [
        "O início do turno oferece 1d4 contra alvo agarrado pelo Guerreiro",
        operacoesAgarramentoProprio.length === 1 &&
          operacaoDanoAgarrado?.tipo === "solicitarDanoSemAcerto" &&
          operacaoDanoAgarrado?.alvoId === "alvo-combate-desarmado-dev" &&
          operacaoDanoAgarrado?.gruposDeDados?.[0]?.quantidade === 1 &&
          operacaoDanoAgarrado?.gruposDeDados?.[0]?.numeroDeFaces === 4,
      ],
      [
        "Sem alvo agarrado não há dano opcional no início do turno",
        operacoesSemAgarramento.length === 0,
      ],
      [
        "Agarramento feito por outra criatura não oferece a operação",
        operacoesAgarramentoAlheio.length === 0,
      ],
      [
        "Sem Combate Desarmado não há operação no início do turno",
        operacoesSemEstilo.length === 0,
      ],
      [
        "O dano opcional preparado usa o sistema normal de rolagem",
        preparacaoDanoAgarrado?.sucesso === true &&
          preparacaoDanoAgarrado?.rolagem?.gruposDeDados?.[0]?.numeroDeFaces === 4 &&
          resultadoDanoAgarrado?.dano === 3 &&
          alvoDanoAgarrado.pontosDeVida.atuais === 7,
      ],
      [
        "O dano no agarramento não consome ação, ação bônus ou reação",
        atacanteDanoAgarrado.acaoDisponivel === true &&
          atacanteDanoAgarrado.acaoBonusDisponivel === true &&
          atacanteDanoAgarrado.reacaoDisponivel === true,
      ],
      [
        "O ataque criado pode ameaçar uma saída de alcance",
        !oportunidadeDesarmada.sucesso &&
          oportunidadeDesarmada.motivo ===
            "confirmacaoSaidaZonaNecessaria",
      ],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: verificacoes.map(
        ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.ataque-desarmado",
    nome: "Ataque Desarmado — criação e oportunidade",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaAtaqueDesarmado,
  });

  function executarAuditoriaAgarrar() {
    function criarContexto({
      tamanhoAlvo = "medio",
      posicaoAlvo = { coluna: 3, linha: 2 },
      mao1 = null,
      mao2 = null,
    } = {}) {
      const atacante = {
        id: "guerreiro-agarrar-dev",
        nome: "Guerreiro",
        tipo: "jogador",
        estado: "ativo",
        tamanho: "medio",
        atributos: { forca: 16 },
        bonusProficiencia: 2,
        posicao: { coluna: 2, linha: 2 },
        configuracaoEquipamentos: { mao1, mao2 },
        condicoes: [],
      };
      const alvo = {
        id: "alvo-agarrar-dev",
        nome: "Alvo",
        tipo: "inimigo",
        estado: "ativo",
        tamanho: tamanhoAlvo,
        atributos: { forca: 12, destreza: 14 },
        salvaguardas: [],
        pericias: ["acrobacia"],
        posicao: posicaoAlvo,
        condicoes: [],
      };
      const combate = window.SistemaCombate.criarEstadoCombate({
        id: "combate-agarrar-dev",
        participantes: [atacante, alvo],
        terreno: { bloqueado: [], dificil: [] },
        visao: { bloqueios: [], barreiras: [] },
      });
      combate.participanteAtivoId = atacante.id;

      return {
        combate,
        atacante: combate.participantes[0],
        alvo: combate.participantes[1],
      };
    }

    const contextoFracasso = criarContexto();
    const preparacaoDestreza = window.SistemaCombate.prepararAgarrar(
      contextoFracasso.combate,
      contextoFracasso.atacante.id,
      contextoFracasso.alvo.id,
      "destreza",
    );
    const resultadoFracasso = window.SistemaCombate.resolverAgarrar(
      contextoFracasso.combate,
      preparacaoDestreza.operacao,
      { modificador: 2, total: 12 },
    );
    contextoFracasso.combate.participanteAtivoId =
      contextoFracasso.alvo.id;
    const posicaoAntesMovimento = structuredClone(
      contextoFracasso.alvo.posicao,
    );
    const movimentoAntesTentativa =
      contextoFracasso.alvo.movimentoRestante;
    const movimentoAgarrado = window.SistemaCombate.movimentarParticipante(
      contextoFracasso.combate,
      contextoFracasso.alvo.id,
      4,
      2,
    );

    const contextoMovimentoForcado = criarContexto();
    contextoMovimentoForcado.alvo.condicoes.push({
      id: "agarrado",
      aplicadoPorId: contextoMovimentoForcado.atacante.id,
    });
    const movimentoForcado =
      window.SistemaCombate.aplicarDeslocamentoForcado(
        contextoMovimentoForcado.combate,
        {
          tipo: "deslocarAlvo",
          participanteId: contextoMovimentoForcado.atacante.id,
          alvoId: contextoMovimentoForcado.alvo.id,
          distanciaCelulas: 1,
        },
      );

    const contextoAgarradorAfasta = criarContexto();
    contextoAgarradorAfasta.alvo.condicoes.push({
      id: "agarrado",
      aplicadoPorId: contextoAgarradorAfasta.atacante.id,
    });
    const movimentoAgarradorAfasta =
      window.SistemaCombate.movimentarParticipante(
        contextoAgarradorAfasta.combate,
        contextoAgarradorAfasta.atacante.id,
        1,
        2,
      );

    const contextoAgarradorAdjacente = criarContexto();
    contextoAgarradorAdjacente.alvo.condicoes.push({
      id: "agarrado",
      aplicadoPorId: contextoAgarradorAdjacente.atacante.id,
    });
    const movimentoAgarradorAdjacente =
      window.SistemaCombate.movimentarParticipante(
        contextoAgarradorAdjacente.combate,
        contextoAgarradorAdjacente.atacante.id,
        2,
        3,
      );

    const contextoIncapacitado = criarContexto();
    contextoIncapacitado.alvo.condicoes.push({
      id: "agarrado",
      aplicadoPorId: contextoIncapacitado.atacante.id,
    });
    const resultadoIncapacitado =
      window.SistemaCombate.aplicarCondicaoCombate(
        contextoIncapacitado.atacante,
        "incapacitado",
        { combate: contextoIncapacitado.combate },
      );

    const contextoDerrotado = criarContexto();
    contextoDerrotado.alvo.condicoes.push({
      id: "agarrado",
      aplicadoPorId: contextoDerrotado.atacante.id,
    });
    contextoDerrotado.atacante.pontosDeVida = {
      atuais: 5,
      maximo: 12,
      temporarios: 0,
    };
    contextoDerrotado.alvo.ataques = [
      {
        id: "golpe-teste-agarrar",
        dano: { tipo: "contundente" },
      },
    ];
    contextoDerrotado.combate.ordemTurnos = [
      contextoDerrotado.atacante.id,
      contextoDerrotado.alvo.id,
    ];
    contextoDerrotado.combate.danoPendente = {
      atacanteId: contextoDerrotado.alvo.id,
      alvoId: contextoDerrotado.atacante.id,
      ataqueId: "golpe-teste-agarrar",
      efeitos: [],
    };
    const resultadoDerrotaAgarrador =
      window.SistemaCombate.resolverDano(
        contextoDerrotado.combate,
        { total: 5 },
      );

    function prepararContextoEscape() {
      const contexto = criarContexto();
      contexto.combate.participanteAtivoId = contexto.alvo.id;
      contexto.alvo.condicoes.push({
        id: "agarrado",
        aplicadoPorId: contexto.atacante.id,
        dificuldade: 13,
      });
      return contexto;
    }

    const contextoEscapeAcrobacia = prepararContextoEscape();
    const escapeAcrobacia = window.SistemaCombate.resolverEscaparAgarrar(
      contextoEscapeAcrobacia.combate,
      contextoEscapeAcrobacia.alvo.id,
      "acrobacia",
      { modificador: 4, total: 13 },
    );

    const contextoEscapeAtletismo = prepararContextoEscape();
    const escapeAtletismo = window.SistemaCombate.resolverEscaparAgarrar(
      contextoEscapeAtletismo.combate,
      contextoEscapeAtletismo.alvo.id,
      "atletismo",
      { modificador: 1, total: 12 },
    );

    const contextoEscapeInvalido = prepararContextoEscape();
    const escapeInvalido = window.SistemaCombate.resolverEscaparAgarrar(
      contextoEscapeInvalido.combate,
      contextoEscapeInvalido.alvo.id,
      "furtividade",
      { modificador: 4, total: 20 },
    );

    const contextoLiberacao = prepararContextoEscape();
    const liberacaoVoluntaria = window.SistemaCombate.liberarAlvoAgarrado(
      contextoLiberacao.combate,
      contextoLiberacao.atacante.id,
      contextoLiberacao.alvo.id,
    );

    const contextoLiberacaoInvalida = prepararContextoEscape();
    const liberacaoPorOutro = window.SistemaCombate.liberarAlvoAgarrado(
      contextoLiberacaoInvalida.combate,
      "outro-participante",
      contextoLiberacaoInvalida.alvo.id,
    );

    function prepararAtaqueEnquantoAgarrado({
      contraAgarrador = false,
      comVantagem = false,
    } = {}) {
      const contexto = criarContexto();
      const agarrado = contexto.alvo;
      const agarrador = contexto.atacante;
      const outroAlvo = {
        id: "outro-alvo-agarrar-dev",
        nome: "Outro alvo",
        tipo: "jogador",
        estado: "ativo",
        posicao: { coluna: 3, linha: 3 },
        classeArmadura: 10,
        condicoes: [],
      };

      agarrado.ataques = [
        {
          id: "ataque-agarrado-dev",
          instanciaId: "ataque-agarrado-dev",
          nome: "Ataque do agarrado",
          categoria: "corpoACorpo",
          selecao: {
            tipo: "criatura",
            alcance: {
              normal: 1,
              longo: null,
            },
            area: null,
          },
          bonusAtaque: 3,
          dano: {
            gruposDeDados: [{ quantidade: 1, numeroDeFaces: 4 }],
            modificador: 1,
            tipo: "contundente",
          },
          propriedades: [],
        },
      ];
      agarrado.condicoes.push({
        id: "agarrado",
        aplicadoPorId: agarrador.id,
        dificuldade: 13,
      });
      contexto.combate.participantes.push(outroAlvo);
      contexto.combate.participanteAtivoId = agarrado.id;

      const alvoEscolhido = contraAgarrador ? agarrador : outroAlvo;

      if (comVantagem) {
        contexto.combate.efeitosTemporarios ??= [];
        contexto.combate.efeitosTemporarios.push({
          tipo: "vantagem",
          participanteId: agarrado.id,
          alvoId: alvoEscolhido.id,
          rolagemAfetada: "ataque",
          usosRestantes: 1,
        });
      }

      return window.SistemaCombate.prepararAtaque(
        contexto.combate,
        agarrado.id,
        alvoEscolhido.id,
        "ataque-agarrado-dev",
      );
    }

    const ataqueContraAgarrador = prepararAtaqueEnquantoAgarrado({
      contraAgarrador: true,
    });
    const ataqueContraOutro = prepararAtaqueEnquantoAgarrado();
    const ataqueContraOutroComVantagem = prepararAtaqueEnquantoAgarrado({
      comVantagem: true,
    });

    const contextoSucesso = criarContexto();
    const preparacaoForca = window.SistemaCombate.prepararAgarrar(
      contextoSucesso.combate,
      contextoSucesso.atacante.id,
      contextoSucesso.alvo.id,
      "forca",
    );
    const resultadoSucesso = window.SistemaCombate.resolverAgarrar(
      contextoSucesso.combate,
      preparacaoForca.operacao,
      { modificador: 1, total: 13 },
    );

    const contextoReacao = criarContexto();
    const preparacaoReacao = window.SistemaCombate.prepararAgarrar(
      contextoReacao.combate,
      contextoReacao.atacante.id,
      contextoReacao.alvo.id,
      "forca",
    );
    contextoReacao.combate.participanteAtivoId = contextoReacao.alvo.id;
    const resultadoReacao = window.SistemaCombate.resolverAgarrar(
      contextoReacao.combate,
      preparacaoReacao.operacao,
      { modificador: 1, total: 13 },
      { custo: "reacao", ignorarTurno: true },
    );

    const contextoSemCusto = criarContexto();
    const preparacaoSemCusto = window.SistemaCombate.prepararAgarrar(
      contextoSemCusto.combate,
      contextoSemCusto.atacante.id,
      contextoSemCusto.alvo.id,
      "forca",
    );
    const resultadoSemCusto = window.SistemaCombate.resolverAgarrar(
      contextoSemCusto.combate,
      preparacaoSemCusto.operacao,
      { modificador: 1, total: 13 },
      { custo: "nenhum" },
    );

    const contextoOperacaoObsoleta = criarContexto();
    const preparacaoObsoleta = window.SistemaCombate.prepararAgarrar(
      contextoOperacaoObsoleta.combate,
      contextoOperacaoObsoleta.atacante.id,
      contextoOperacaoObsoleta.alvo.id,
      "forca",
    );
    contextoOperacaoObsoleta.alvo.posicao = { coluna: 5, linha: 2 };
    const resultadoOperacaoObsoleta = window.SistemaCombate.resolverAgarrar(
      contextoOperacaoObsoleta.combate,
      preparacaoObsoleta.operacao,
      { modificador: 1, total: 13 },
    );

    const semMaoLivre = criarContexto({
      mao1: { categoria: "armas", id: "espadaLonga" },
      mao2: { categoria: "itensSecundarios", id: "escudo" },
    });
    const alvoMuitoGrande = criarContexto({ tamanhoAlvo: "enorme" });
    const alvoDistante = criarContexto({
      posicaoAlvo: { coluna: 4, linha: 2 },
    });
    const atributoInvalido = criarContexto();

    const verificacoes = [
      [
        "Força 16 e proficiência +2 produzem CD 13",
        preparacaoDestreza.sucesso &&
          preparacaoDestreza.operacao.dificuldade === 13,
      ],
      [
        "O alvo pode escolher salvaguarda de Destreza",
        preparacaoDestreza.operacao?.atributoId === "destreza",
      ],
      [
        "O alvo pode escolher salvaguarda de Força",
        preparacaoForca.operacao?.atributoId === "forca",
      ],
      [
        "Fracassar na salvaguarda aplica Agarrado",
        resultadoFracasso.sucesso &&
          !resultadoFracasso.passou &&
          contextoFracasso.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "A condição Agarrado preserva a CD da tentativa",
        contextoFracasso.alvo.condicoes.find(
          (condicao) => condicao.id === "agarrado",
        )?.dificuldade === 13,
      ],
      [
        "Agarrado impede movimento voluntário",
        !movimentoAgarrado.sucesso &&
          movimentoAgarrado.motivo === "participanteAgarrado",
      ],
      [
        "Movimento bloqueado preserva posição e deslocamento restante",
        contextoFracasso.alvo.posicao.coluna ===
          posicaoAntesMovimento.coluna &&
          contextoFracasso.alvo.posicao.linha ===
            posicaoAntesMovimento.linha &&
          contextoFracasso.alvo.movimentoRestante ===
            movimentoAntesTentativa,
      ],
      [
        "Agarrado ainda pode sofrer movimento forçado",
        movimentoForcado.sucesso &&
          movimentoForcado.distanciaPercorrida === 1 &&
          contextoMovimentoForcado.alvo.posicao.coluna === 4,
      ],
      [
        "Afastar o alvo por movimento forçado encerra Agarrado",
        movimentoForcado.agarramentosEncerrados === 1 &&
          !contextoMovimentoForcado.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "O agarrador que se afasta encerra Agarrado",
        movimentoAgarradorAfasta.sucesso &&
          movimentoAgarradorAfasta.agarramentosEncerrados === 1 &&
          !contextoAgarradorAfasta.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "O agarrador pode se mover mantendo-se adjacente",
        movimentoAgarradorAdjacente.sucesso &&
          movimentoAgarradorAdjacente.agarramentosEncerrados === 0 &&
          contextoAgarradorAdjacente.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Incapacitar o agarrador encerra Agarrado",
        resultadoIncapacitado.sucesso &&
          resultadoIncapacitado.agarramentosEncerrados === 1 &&
          !contextoIncapacitado.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Derrotar o agarrador encerra Agarrado",
        resultadoDerrotaAgarrador.sucesso &&
          contextoDerrotado.atacante.estado === "derrotado" &&
          !contextoDerrotado.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Acrobacia proficiente usa Destreza e proficiência",
        escapeAcrobacia.sucesso && escapeAcrobacia.bonusPericia === 4,
      ],
      [
        "Igualar a CD com Acrobacia encerra Agarrado e gasta a ação",
        escapeAcrobacia.escapou &&
          contextoEscapeAcrobacia.alvo.acaoDisponivel === false &&
          !contextoEscapeAcrobacia.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Falhar com Atletismo mantém Agarrado e também gasta a ação",
        escapeAtletismo.sucesso &&
          escapeAtletismo.bonusPericia === 1 &&
          !escapeAtletismo.escapou &&
          contextoEscapeAtletismo.alvo.acaoDisponivel === false &&
          contextoEscapeAtletismo.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Perícia inválida não consome a ação",
        !escapeInvalido.sucesso &&
          escapeInvalido.motivo === "periciaInvalida" &&
          contextoEscapeInvalido.alvo.acaoDisponivel === true,
      ],
      [
        "Agarrado ataca o próprio agarrador normalmente",
        ataqueContraAgarrador.sucesso &&
          ataqueContraAgarrador.tipoRolagem === "normal",
      ],
      [
        "Agarrado ataca outra criatura com desvantagem",
        ataqueContraOutro.sucesso &&
          ataqueContraOutro.tipoRolagem === "desvantagem",
      ],
      [
        "Vantagem e desvantagem do Agarrado se anulam",
        ataqueContraOutroComVantagem.sucesso &&
          ataqueContraOutroComVantagem.tipoRolagem === "normal",
      ],
      [
        "O agarrador pode liberar voluntariamente o alvo",
        liberacaoVoluntaria.sucesso &&
          liberacaoVoluntaria.custo === "nenhum" &&
          !contextoLiberacao.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Liberar o alvo não consome ação, ação bônus ou reação",
        contextoLiberacao.atacante.acaoDisponivel === true &&
          contextoLiberacao.atacante.acaoBonusDisponivel === true &&
          contextoLiberacao.atacante.reacaoDisponivel === true,
      ],
      [
        "Outro participante não pode liberar o agarramento",
        !liberacaoPorOutro.sucesso &&
          liberacaoPorOutro.motivo === "agarramentoInexistente" &&
          contextoLiberacaoInvalida.alvo.condicoes.some(
            (condicao) => condicao.id === "agarrado",
          ),
      ],
      [
        "Igualar a CD evita Agarrado",
        resultadoSucesso.sucesso &&
          resultadoSucesso.passou &&
          contextoSucesso.alvo.condicoes.length === 0,
      ],
      [
        "A tentativa resolvida consome a ação mesmo quando o alvo passa",
        contextoSucesso.atacante.acaoDisponivel === false &&
          resultadoSucesso.custo === "acao",
      ],
      [
        "O custo de reação consome somente a reação",
        resultadoReacao.sucesso &&
          contextoReacao.atacante.reacaoDisponivel === false &&
          contextoReacao.atacante.acaoDisponivel === true,
      ],
      [
        "O custo nenhum preserva ação e reação",
        resultadoSemCusto.sucesso &&
          contextoSemCusto.atacante.acaoDisponivel === true &&
          contextoSemCusto.atacante.reacaoDisponivel === true,
      ],
      [
        "Uma operação obsoleta é revalidada sem consumir a ação",
        !resultadoOperacaoObsoleta.sucesso &&
          resultadoOperacaoObsoleta.motivo === "alvoForaDeAlcance" &&
          contextoOperacaoObsoleta.atacante.acaoDisponivel === true,
      ],
      [
        "Duas mãos ocupadas impedem Agarrar",
        window.SistemaCombate.prepararAgarrar(
          semMaoLivre.combate,
          semMaoLivre.atacante.id,
          semMaoLivre.alvo.id,
          "forca",
        ).motivo === "semMaoLivre",
      ],
      [
        "Uma criatura Média não agarra uma Enorme",
        window.SistemaCombate.prepararAgarrar(
          alvoMuitoGrande.combate,
          alvoMuitoGrande.atacante.id,
          alvoMuitoGrande.alvo.id,
          "forca",
        ).motivo === "alvoMuitoGrande",
      ],
      [
        "Alvos além de uma célula ficam fora de alcance",
        window.SistemaCombate.prepararAgarrar(
          alvoDistante.combate,
          alvoDistante.atacante.id,
          alvoDistante.alvo.id,
          "forca",
        ).motivo === "alvoForaDeAlcance",
      ],
      [
        "Somente Força ou Destreza são aceitas",
        window.SistemaCombate.prepararAgarrar(
          atributoInvalido.combate,
          atributoInvalido.atacante.id,
          atributoInvalido.alvo.id,
          "constituicao",
        ).motivo === "atributoSalvaguardaInvalido",
      ],
    ];

    return {
      passou: verificacoes.every(([, passou]) => passou),
      detalhes: verificacoes.map(
        ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
      ),
    };
  }

  registrarTeste({
    id: "guerreiro.ataque-desarmado.agarrar",
    nome: "Ataque Desarmado — Agarrar",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaAgarrar,
  });

  function executarAuditoriaContinuidadeGuerreiro() {
    const chaveArmazenamento = "personagensRpgSolo";
    const conteudoAnterior = localStorage.getItem(chaveArmazenamento);

    try {
      const personagem = window.PersonagemDados.criarInicial();
      personagem.id = `guerreiro-continuidade-dev-${Date.now()}`;
      personagem.classeId = "guerreiro";
      personagem.classe = "Guerreiro";
      personagem.nivel = 1;
      personagem.niveisPorClasse = { guerreiro: 1 };
      personagem.atributos = {
        forca: 16,
        destreza: 14,
        constituicao: 14,
        inteligencia: 10,
        sabedoria: 12,
        carisma: 8,
      };
      personagem.bonusProficiencia = 2;
      personagem.periciasClasse = ["atletismo", "percepcao"];
      personagem.pericias = ["atletismo", "percepcao"];
      personagem.habilidades.escolhas = {
        estilosDeLuta: "duelismo",
        maestriasArmas: ["espadaLonga", "arcoLongo", "machadoBatalha"],
      };
      personagem.habilidades.recursos.segundoFolego = {
        id: "segundoFolego",
        nome: "Segundo Fôlego",
        usosAtuais: 1,
        usosMaximos: 2,
        recuperacao: {
          descansoCurto: { quantidade: 1 },
          descansoLongo: { restaurarTodos: true },
        },
      };
      personagem.combate.classeArmadura = 18;
      personagem.combate.pontosDeVida = {
        atuais: 7,
        temporarios: 0,
        maximo: 12,
        dadoVida: "d10",
        dadosVidaUsados: 0,
      };
      personagem.inventario = {
        itens: [
          { categoria: "armas", id: "espadaLonga", quantidade: 1 },
          { categoria: "armaduras", id: "cotaDeMalha", quantidade: 1 },
          { categoria: "itensSecundarios", id: "escudo", quantidade: 1 },
        ],
        moedas: { ouro: 27 },
      };
      personagem.configuracaoInicialCombate = {
        armadura: { categoria: "armaduras", id: "cotaDeMalha" },
        mao1: { categoria: "armas", id: "espadaLonga" },
        mao2: { categoria: "itensSecundarios", id: "escudo" },
      };
      personagem.detalhes.nome = "Guerreiro de Continuidade";
      personagem.detalhes.equipamentos = {
        armadura: "cotaDeMalha",
        armaPrincipal: "espadaLonga",
        itemSecundario: "escudo",
        armaSecundaria: "",
      };

      const salvou = window.PersonagemDados.adicionarSalvo(personagem);
      const recarregado = window.PersonagemDados.buscarSalvoPorId(
        personagem.id,
      );
      const ataqueRecalculado =
        window.RegrasFichaCriacao?.criarAtaqueCombateArma(
          recarregado,
          "espadaLonga",
          "armaPrincipal",
        );
      const pontosDeVidaPrimeiraLeitura = structuredClone(
        recarregado.combate.pontosDeVida,
      );

      recarregado.habilidades.recursos.segundoFolego.usosAtuais = 0;
      recarregado.combate.pontosDeVida.atuais = 4;
      const atualizou = window.PersonagemDados.atualizarSalvo(recarregado);
      const recarregadoNovamente =
        window.PersonagemDados.buscarSalvoPorId(personagem.id);

      const verificacoes = [
        ["O Guerreiro foi salvo e localizado pelo mesmo id", salvou && recarregado?.id === personagem.id],
        ["Classe, nível e atributos foram preservados", recarregado?.classeId === "guerreiro" && recarregado?.nivel === 1 && recarregado?.atributos?.forca === 16],
        ["PV atuais, máximos e Dado de Vida foram preservados", pontosDeVidaPrimeiraLeitura.atuais === 7 && pontosDeVidaPrimeiraLeitura.maximo === 12 && pontosDeVidaPrimeiraLeitura.dadoVida === "d10"],
        ["Perícias e Estilo de Luta foram preservados", recarregado?.pericias?.includes("atletismo") && recarregado?.habilidades?.escolhas?.estilosDeLuta === "duelismo"],
        ["As três Maestrias em Armas foram preservadas", recarregado?.habilidades?.escolhas?.maestriasArmas?.length === 3 && recarregado.habilidades.escolhas.maestriasArmas.includes("espadaLonga")],
        ["Inventário e moedas foram preservados", recarregado?.inventario?.itens?.length === 3 && recarregado?.inventario?.moedas?.ouro === 27],
        ["Armadura e ambas as mãos foram preservadas", recarregado?.configuracaoInicialCombate?.armadura?.id === "cotaDeMalha" && recarregado?.configuracaoInicialCombate?.mao1?.id === "espadaLonga" && recarregado?.configuracaoInicialCombate?.mao2?.id === "escudo"],
        ["O ataque pode ser reconstruído com bônus e dano corretos", ataqueRecalculado?.bonusAtaque === 5 && ataqueRecalculado?.dano?.modificador === 5],
        ["Atualizações posteriores também persistem", atualizou && recarregadoNovamente?.habilidades?.recursos?.segundoFolego?.usosAtuais === 0 && recarregadoNovamente?.combate?.pontosDeVida?.atuais === 4],
      ];

      return {
        passou: verificacoes.every(([, passou]) => passou),
        detalhes: verificacoes.map(
          ([descricao, passou]) => `${passou ? "✓" : "✗"} ${descricao}.`,
        ),
      };
    } finally {
      if (conteudoAnterior === null) {
        localStorage.removeItem(chaveArmazenamento);
      } else {
        localStorage.setItem(chaveArmazenamento, conteudoAnterior);
      }
    }
  }

  registrarTeste({
    id: "guerreiro.continuidade",
    nome: "Guerreiro N1 — salvamento e continuidade",
    categoria: "guerreiro-n1",
    executar: executarAuditoriaContinuidadeGuerreiro,
  });

  function clonar(valor) {
    return structuredClone(valor);
  }

  function exibirResultado(titulo, valor) {
    const resultado = {
      titulo,
      ...valor,
    };

    if (saidaPainel) {
      saidaPainel.textContent = JSON.stringify(resultado, null, 2);
    }

    console.log("[TestesDev]", resultado);

    return resultado;
  }

  function obterCenaRuasD() {
    return aventuraAtual?.cenas?.batalhaRuasD ?? null;
  }

  function abrirBatalhaRuasD() {
    const cena = obterCenaRuasD();

    if (!cena?.combate) {
      return exibirResultado("Abrir Ruas D", {
        sucesso: false,
        motivo: "batalhaRuasDNaoEncontrada",
      });
    }

    if (!estadoAtualJogo.personagem?.dados) {
      return exibirResultado("Abrir Ruas D", {
        sucesso: false,
        motivo: "personagemNaoCarregado",
      });
    }

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = "batalhaRuasD";
    cenaAtual = cena;

    verificarCombateDaCena(cena);

    const combate = estadoAtualJogo.combateAtual;

    if (!combate) {
      return exibirResultado("Abrir Ruas D", {
        sucesso: false,
        motivo: "combateNaoIniciado",
      });
    }

    introducaoCombateConfirmada = true;

    if (modalIntroducaoCombate.open) {
      modalIntroducaoCombate.close();
    }

    solicitacaoCombate.textContent = "";
    solicitacaoCombate.hidden = true;

    return exibirResultado("Abrir Ruas D", {
      sucesso: true,
      combateId: combate.id,
      participantes: combate.participantes.map(function resumirParticipante(participante) {
        return {
          id: participante.id,
          nome: participante.nome,
          tipo: participante.tipo,
        };
      }),
    });
  }

  function garantirBatalhaRuasD() {
    const combateAtual = estadoAtualJogo.combateAtual;

    if (combateAtual?.id?.includes("batalhaRuasD")) {
      return combateAtual;
    }

    abrirBatalhaRuasD();

    return estadoAtualJogo.combateAtual;
  }

  function configurarParticipantes(combate, configuracao) {
    const jogador = combate.participantes.find((participante) => participante.tipo === "jogador");

    const inimigos = combate.participantes.filter(
      (participante) => participante.tipo === "inimigo",
    );

    const inimigo = inimigos[0];

    if (!jogador || !inimigo) {
      return null;
    }

    jogador.estado = "ativo";
    jogador.posicao = clonar(configuracao.posicaoJogador);
    jogador.reacaoDisponivel = true;

    inimigo.estado = "ativo";
    inimigo.posicao = clonar(configuracao.posicaoInimigo);
    inimigo.inteligencia = {
      perfil: configuracao.perfil,
    };
    inimigo.pontosDeVida.atuais = inimigo.pontosDeVida.maximo;

    for (const outroInimigo of inimigos.slice(1)) {
      outroInimigo.estado = "derrotado";
    }

    combate.status = "ativo";
    combate.resultadoId = null;
    combate.objetivoConcluidoId = null;
    combate.decisaoPendente = null;
    combate.ataquePendente = null;
    combate.danoPendente = null;
    combate.ordemTurnos = [inimigo.id, jogador.id];
    combate.indiceTurno = 0;
    combate.rodada = 1;

    SistemaCombate.iniciarTurnoAtual(combate);

    atualizarInterfaceTurno(combate);

    return {
      jogador,
      inimigo,
    };
  }

  function prepararCenario(cenarioId) {
    const configuracoes = {
      adjacente: {
        perfil: "agressivo",
        posicaoJogador: { coluna: 22, linha: 14 },
        posicaoInimigo: { coluna: 22, linha: 13 },
      },

      distante: {
        perfil: "agressivo",
        posicaoJogador: { coluna: 22, linha: 14 },
        posicaoInimigo: { coluna: 23, linha: 5 },
      },

      ameacado: {
        perfil: "covarde",
        posicaoJogador: { coluna: 22, linha: 14 },
        posicaoInimigo: { coluna: 22, linha: 13 },
      },

      semLinhaDeVisao: {
        perfil: "agressivo",
        posicaoJogador: { coluna: 22, linha: 13 },
        posicaoInimigo: { coluna: 20, linha: 13 },
        bloqueioVisao: { coluna: 21, linha: 13 },
      },
    };

    const configuracao = configuracoes[cenarioId];

    if (!configuracao) {
      return exibirResultado("Preparar cenário", {
        sucesso: false,
        motivo: "cenarioDesconhecido",
        cenarioId,
      });
    }

    const combate = garantirBatalhaRuasD();

    if (!combate) {
      return exibirResultado(cenarioId, {
        sucesso: false,
        motivo: "combateIndisponivel",
      });
    }

    combate.visao.bloqueios = configuracao.bloqueioVisao
      ? [clonar(configuracao.bloqueioVisao)]
      : [];

    const participantes = configurarParticipantes(combate, configuracao);

    if (!participantes) {
      return exibirResultado(cenarioId, {
        sucesso: false,
        motivo: "participantesIndisponiveis",
      });
    }

    const plano = InteligenciaInimigos.planejarTurnoTatico(
      combate,
      participantes.inimigo,
      participantes.jogador,
    );

    renderizarTabuleiroCombate(combate);
    atualizarInterfaceTurno(combate);

    const resumo = exibirResultado(cenarioId, {
      sucesso: plano.sucesso,
      perfil: participantes.inimigo.inteligencia.perfil,
      posicaoJogador: clonar(participantes.jogador.posicao),
      posicaoInimigo: clonar(participantes.inimigo.posicao),
      tipoPlano: plano.planoEscolhido?.tipo ?? null,
      ataque: plano.planoEscolhido?.ataque?.nome ?? null,
      destino: clonar(plano.planoEscolhido?.posicao?.posicao ?? null),
      custoMovimento: plano.planoEscolhido?.custoMovimento ?? null,
      caminho: clonar(plano.planoEscolhido?.posicao?.caminho ?? []),
    });

    processarTurnoAtual(combate);

    return resumo;
  }

  function obterVariacoesEncerramento() {
    return aventuraAtual?.cenas?.encerramentoAventura?.variacoes ?? [];
  }

  function obterResultadoFinalVariacao(variacao) {
    return (
      variacao.escolhas?.find((escolha) => escolha.fimAventura)?.fimAventura?.resultadoId ??
      "indefinido"
    );
  }

  function criarRotuloVariacaoEncerramento(variacao, indice) {
    const origem = variacao.se?.veioDe ?? {};
    const resultadoFinal = obterResultadoFinalVariacao(variacao);
    const local = [origem.cenaId, origem.etapaId].filter(Boolean).join(" / ");
    const evento = [origem.tipo, origem.resultado].filter(Boolean).join(": ");

    return (
      `${indice + 1}. ${resultadoFinal} — ${local || "sem origem"}` + (evento ? ` — ${evento}` : "")
    );
  }

  function abrirEncerramentoAventura(indiceVariacao) {
    const cenaEncerramento = aventuraAtual?.cenas?.encerramentoAventura;

    if (!cenaEncerramento) {
      return exibirResultado("Abrir encerramento", {
        sucesso: false,
        motivo: "encerramentoAventuraNaoEncontrado",
      });
    }

    if (!estadoAtualJogo.personagem?.dados) {
      return exibirResultado("Abrir encerramento", {
        sucesso: false,
        motivo: "personagemNaoCarregado",
      });
    }

    const variacao = cenaEncerramento.variacoes?.[indiceVariacao];
    const origem = variacao?.se?.veioDe;

    if (!origem) {
      return exibirResultado("Abrir encerramento", {
        sucesso: false,
        motivo: "variacaoSemProcedencia",
        indiceVariacao,
      });
    }

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = origem.cenaId;
    estadoAtualJogo.progresso.etapaId = origem.etapaId ?? null;
    estadoAtualJogo.progresso.caminhoId = origem.caminhoId ?? null;

    registrarEventoNarrativo({
      tipo: origem.tipo ?? null,
      resultado: origem.resultado ?? null,
      quantidadeAcertos: origem.quantidadeAcertos ?? null,
    });

    exibirTelaAventura();
    NarradorAventura.limpar();
    mudarCena("encerramentoAventura");

    return exibirResultado("Abrir encerramento", {
      sucesso: true,
      indiceVariacao,
      resultadoFinal: obterResultadoFinalVariacao(variacao),
      procedencia: clonar(origem),
      cenaId: "encerramentoAventura",
    });
  }

  function abrirEncerramentoSelecionado() {
    return abrirEncerramentoAventura(Number(seletorEncerramento?.value ?? 0));
  }

  function abrirPrimeiroEncerramentoDoTipo(resultadoId) {
    const indice = obterVariacoesEncerramento().findIndex(
      (variacao) => obterResultadoFinalVariacao(variacao) === resultadoId,
    );

    return abrirEncerramentoAventura(indice);
  }

  function criarBotao(rotulo, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = rotulo;
    botao.style.padding = "7px 8px";
    botao.style.cursor = "pointer";
    botao.addEventListener("click", acao);

    return botao;
  }

  function listarBatalhasDisponiveis() {
    return Object.entries(aventuraAtual?.cenas ?? {})
      .filter(([, cena]) => Boolean(cena?.combate?.mapa))
      .map(([cenaId, cena]) => ({
        cenaId,
        cena,
        combate: cena.combate,
      }));
  }

  function criarCampoNumero(valorInicial) {
    const campo = document.createElement("input");
    campo.type = "number";
    campo.min = "1";
    campo.step = "1";
    campo.value = String(valorInicial ?? 1);
    campo.style.width = "68px";
    campo.style.padding = "6px";

    return campo;
  }

  function criarSeletorNpc(npcIdSelecionado) {
    const seletor = document.createElement("select");
    seletor.style.minWidth = "0";
    seletor.style.padding = "6px";

    for (const [npcId, npc] of Object.entries(estadoAtualJogo.npcs ?? {})) {
      if (npc.tipo !== "inimigo") {
        continue;
      }

      const opcao = document.createElement("option");
      opcao.value = npcId;
      opcao.textContent = `${npc.nome} (${npcId})`;
      opcao.selected = npcId === npcIdSelecionado;
      seletor.append(opcao);
    }

    return seletor;
  }

  function adicionarInimigoBatalha(npcId = null, posicao = { coluna: 1, linha: 1 }) {
    if (!listaInimigosBatalha) {
      return;
    }

    const linha = document.createElement("div");
    linha.dataset.inimigoBatalhaDev = "";
    linha.style.display = "grid";
    linha.style.gridTemplateColumns = "minmax(0, 1fr) auto auto auto";
    linha.style.gap = "5px";
    linha.style.alignItems = "center";

    const seletorNpc = criarSeletorNpc(npcId);
    seletorNpc.dataset.campo = "npcId";

    const coluna = criarCampoNumero(posicao.coluna);
    coluna.dataset.campo = "coluna";
    coluna.title = "Coluna";

    const linhaPosicao = criarCampoNumero(posicao.linha);
    linhaPosicao.dataset.campo = "linha";
    linhaPosicao.title = "Linha";

    const remover = criarBotao("×", () => linha.remove());
    remover.title = "Remover inimigo";

    linha.append(seletorNpc, coluna, linhaPosicao, remover);
    listaInimigosBatalha.append(linha);
  }

  function obterBatalhaSelecionada() {
    return (
      listarBatalhasDisponiveis().find((batalha) => batalha.cenaId === seletorMapaBatalha?.value) ??
      null
    );
  }

  function carregarPosicoesOriginaisBatalha() {
    const batalha = obterBatalhaSelecionada();

    if (!batalha) {
      return;
    }

    colunaJogadorBatalha.value = String(batalha.combate.jogador?.posicao?.coluna ?? 1);
    linhaJogadorBatalha.value = String(batalha.combate.jogador?.posicao?.linha ?? 1);

    listaInimigosBatalha.innerHTML = "";

    for (const configuracao of batalha.combate.inimigos ?? []) {
      for (const posicao of configuracao.posicoes ?? []) {
        adicionarInimigoBatalha(configuracao.npcId, posicao);
      }
    }

    if (!listaInimigosBatalha.children.length) {
      adicionarInimigoBatalha();
    }
  }

  function lerPosicao(coluna, linha) {
    return {
      coluna: Number(coluna),
      linha: Number(linha),
    };
  }

  function validarPosicoesBatalha(combateBase, posicoes) {
    const ocupadas = new Set();

    for (const item of posicoes) {
      const { coluna, linha } = item.posicao;

      if (
        !Number.isInteger(coluna) ||
        !Number.isInteger(linha) ||
        coluna < 1 ||
        coluna > 48 ||
        linha < 1 ||
        linha > 27
      ) {
        return `Posição inválida para ${item.nome}: coluna ${coluna}, linha ${linha}.`;
      }

      const chave = `${coluna},${linha}`;

      if (ocupadas.has(chave)) {
        return `Mais de um participante ocupa a célula ${chave}.`;
      }

      ocupadas.add(chave);

      const tipoTerreno = SistemaCombate.obterTipoTerreno(
        { terreno: combateBase.terreno },
        coluna,
        linha,
      );

      if (tipoTerreno === "bloqueado") {
        return `${item.nome} foi colocado em terreno bloqueado (${chave}).`;
      }
    }

    return null;
  }

  function iniciarBatalhaPersonalizada() {
    const batalha = obterBatalhaSelecionada();

    if (!batalha) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "mapaNaoSelecionado",
      });
    }

    if (!estadoAtualJogo.personagem?.dados) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "personagemNaoCarregado",
      });
    }

    const posicaoJogador = lerPosicao(colunaJogadorBatalha.value, linhaJogadorBatalha.value);

    const inimigosInformados = Array.from(
      listaInimigosBatalha.querySelectorAll("[data-inimigo-batalha-dev]"),
    ).map((linha, indice) => ({
      npcId: linha.querySelector('[data-campo="npcId"]').value,
      nome: `Inimigo ${indice + 1}`,
      posicao: lerPosicao(
        linha.querySelector('[data-campo="coluna"]').value,
        linha.querySelector('[data-campo="linha"]').value,
      ),
    }));

    if (!inimigosInformados.length) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "nenhumInimigo",
      });
    }

    const erroPosicao = validarPosicoesBatalha(batalha.combate, [
      { nome: "Jogador", posicao: posicaoJogador },
      ...inimigosInformados,
    ]);

    if (erroPosicao) {
      return exibirResultado("Batalha personalizada", {
        sucesso: false,
        motivo: "posicaoInvalida",
        mensagem: erroPosicao,
      });
    }

    const inimigosAgrupados = new Map();

    for (const inimigo of inimigosInformados) {
      const grupo = inimigosAgrupados.get(inimigo.npcId) ?? {
        npcId: inimigo.npcId,
        quantidade: 0,
        posicoes: [],
        inteligencia: { perfil: "equilibrado" },
        movimentoMaximo: 6,
      };

      grupo.quantidade += 1;
      grupo.posicoes.push(inimigo.posicao);
      inimigosAgrupados.set(inimigo.npcId, grupo);
    }

    const participanteJogador = criarParticipanteJogadorCombate({
      posicao: posicaoJogador,
      movimentoMaximo: batalha.combate.jogador?.movimentoMaximo ?? 6,
    });

    const participantesInimigos = criarParticipantesNpcsCombate(
      Array.from(inimigosAgrupados.values()),
    );

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = batalha.cenaId;
    cenaAtual = batalha.cena;

    iniciarCombateDaAventura({
      id: `dev-${batalha.cenaId}-${Date.now()}`,
      participantes: [participanteJogador, ...participantesInimigos],
      mapa: batalha.combate.mapa,
      introducao: {
        titulo: "Batalha de teste",
        descricao: `Mapa: ${batalha.cenaId}`,
      },
      objetivos: batalha.combate.objetivos,
      terreno: batalha.combate.terreno,
      visao: batalha.combate.visao,
      areas: batalha.combate.areas,
      marcadores: batalha.combate.marcadores,
    });

    introducaoCombateConfirmada = true;

    if (modalIntroducaoCombate.open) {
      modalIntroducaoCombate.close();
    }

    iniciarEtapaIniciativaCombate(estadoAtualJogo.combateAtual);

    return exibirResultado("Batalha personalizada", {
      sucesso: true,
      mapa: batalha.cenaId,
      posicaoJogador,
      inimigos: inimigosInformados,
    });
  }

  function criarConstrutorBatalha() {
    const area = document.createElement("fieldset");
    area.style.display = "grid";
    area.style.gap = "7px";
    area.style.margin = "10px 0 0";
    area.style.padding = "8px";
    area.style.border = "1px solid rgba(184, 138, 74, 0.55)";

    const legenda = document.createElement("legend");
    legenda.textContent = "Montar batalha";
    legenda.style.fontWeight = "700";

    seletorMapaBatalha = document.createElement("select");
    seletorMapaBatalha.style.width = "100%";
    seletorMapaBatalha.style.padding = "7px";

    for (const batalha of listarBatalhasDisponiveis()) {
      const opcao = document.createElement("option");
      opcao.value = batalha.cenaId;
      opcao.textContent = batalha.cena.titulo
        ? `${batalha.cena.titulo} (${batalha.cenaId})`
        : batalha.cenaId;
      seletorMapaBatalha.append(opcao);
    }

    const posicaoJogador = document.createElement("div");
    posicaoJogador.style.display = "flex";
    posicaoJogador.style.alignItems = "center";
    posicaoJogador.style.gap = "6px";

    const rotuloJogador = document.createElement("span");
    rotuloJogador.textContent = "Jogador — coluna / linha";
    rotuloJogador.style.flex = "1";

    colunaJogadorBatalha = criarCampoNumero(1);
    linhaJogadorBatalha = criarCampoNumero(1);
    posicaoJogador.append(rotuloJogador, colunaJogadorBatalha, linhaJogadorBatalha);

    const cabecalhoInimigos = document.createElement("div");
    cabecalhoInimigos.style.display = "flex";
    cabecalhoInimigos.style.alignItems = "center";
    cabecalhoInimigos.style.justifyContent = "space-between";

    const rotuloInimigos = document.createElement("span");
    rotuloInimigos.textContent = "Inimigos — NPC / coluna / linha";

    const adicionar = criarBotao("+ Inimigo", () => adicionarInimigoBatalha());
    cabecalhoInimigos.append(rotuloInimigos, adicionar);

    listaInimigosBatalha = document.createElement("div");
    listaInimigosBatalha.style.display = "grid";
    listaInimigosBatalha.style.gap = "5px";

    seletorMapaBatalha.addEventListener("change", carregarPosicoesOriginaisBatalha);

    area.append(
      legenda,
      seletorMapaBatalha,
      posicaoJogador,
      cabecalhoInimigos,
      listaInimigosBatalha,
      criarBotao("Iniciar e rolar iniciativa", iniciarBatalhaPersonalizada),
    );

    carregarPosicoesOriginaisBatalha();

    return area;
  }

  function criarPainel() {
    if (document.querySelector("#painelTestesDev")) {
      return;
    }

    const painel = document.createElement("details");
    painel.id = "painelTestesDev";
    painel.style.position = "fixed";
    painel.style.left = "12px";
    painel.style.bottom = "12px";
    painel.style.zIndex = "100000";
    painel.style.width = "min(460px, calc(100vw - 24px))";
    painel.style.maxHeight = "85vh";
    painel.style.overflow = "auto";
    painel.style.padding = "10px";
    painel.style.border = "1px solid #b88a4a";
    painel.style.borderRadius = "8px";
    painel.style.background = "#211710";
    painel.style.color = "#f4ead2";
    painel.style.boxShadow = "0 5px 22px rgba(0, 0, 0, 0.55)";
    painel.style.font = "13px/1.4 system-ui, sans-serif";

    const titulo = document.createElement("summary");
    titulo.textContent = "Modo DEV — Aventura e IA";
    titulo.style.cursor = "pointer";
    titulo.style.fontWeight = "700";

    const instrucoes = document.createElement("p");
    instrucoes.textContent =
      "Use os cenários rápidos ou monte uma batalha escolhendo mapa, participantes e posições.";

    const botoes = document.createElement("div");
    botoes.style.display = "grid";
    botoes.style.gridTemplateColumns = "1fr 1fr";
    botoes.style.gap = "6px";

    botoes.append(
      criarBotao("Abrir Ruas D", abrirBatalhaRuasD),
      criarBotao("Adjacente", () => prepararCenario("adjacente")),
      criarBotao("Distante", () => prepararCenario("distante")),
      criarBotao("Ameaçado", () => prepararCenario("ameacado")),
      criarBotao("Sem visão", () => prepararCenario("semLinhaDeVisao")),
    );

    const areaEncerramento = document.createElement("div");
    areaEncerramento.style.display = "grid";
    areaEncerramento.style.gap = "6px";
    areaEncerramento.style.marginTop = "10px";

    const rotuloEncerramento = document.createElement("strong");
    rotuloEncerramento.textContent = "Encerramentos";

    seletorEncerramento = document.createElement("select");
    seletorEncerramento.style.width = "100%";
    seletorEncerramento.style.padding = "7px";

    obterVariacoesEncerramento().forEach(function adicionarOpcao(variacao, indice) {
      const opcao = document.createElement("option");
      opcao.value = String(indice);
      opcao.textContent = criarRotuloVariacaoEncerramento(variacao, indice);
      seletorEncerramento.append(opcao);
    });

    areaEncerramento.append(
      rotuloEncerramento,
      seletorEncerramento,
      criarBotao("Abrir final selecionado", abrirEncerramentoSelecionado),
    );

    saidaPainel = document.createElement("pre");
    saidaPainel.style.margin = "10px 0 0";
    saidaPainel.style.padding = "8px";
    saidaPainel.style.maxHeight = "240px";
    saidaPainel.style.overflow = "auto";
    saidaPainel.style.whiteSpace = "pre-wrap";
    saidaPainel.style.wordBreak = "break-word";
    saidaPainel.style.background = "rgba(255, 255, 255, 0.07)";
    saidaPainel.textContent = "Aguardando cenário.";

    painel.append(
      titulo,
      instrucoes,
      botoes,
      criarBotao("Montar batalha", function abrirMontadorBatalha() {
        window.MontadorBatalhaDev?.abrir();
      }),
      areaEncerramento,
      saidaPainel,
    );
    document.body.append(painel);

    if (new URLSearchParams(window.location.search).get("ferramenta") === "montador-batalha") {
      window.MontadorBatalhaDev?.abrir();
    }
  }

  window.TestesDev = Object.freeze({
    registrarTeste,
    listarTestes,
    executarTeste,
    executarTodos,
    executarContratoFormacaoGuerreiroNivel1,
    executarAuditoriaClasseArmaduraGuerreiro,
    executarAuditoriaEquipamentoInicialGuerreiro,
    prepararCenarioSap,
    executarAtaqueCenarioSap,
    executarExpiracaoCenarioSap,
    executarAplicacoesRepetidasCenarioSap,
    executarCenarioCompletoVex,
    executarCenarioCompletoSlow,
    executarCenarioCompletoTopple,
    executarCenarioCompletoCleave,
    executarCenarioCompletoGraze,
    executarCenarioCompletoNick,
    criarEstadoCenarioNick,
    executarCenarioPropriedadeLeve,
    executarIntegracaoProficienciaDuasArmas,
    executarAuditoriaEstilosLutaGuerreiro,
    executarAuditoriaSegundoFolegoBasica,
    executarAuditoriaEconomiaTurno,
    executarAuditoriaAtaquesOportunidade,
    executarAuditoriaDanoFixo,
    executarAuditoriaAtaqueDesarmado,
    abrirBatalhaRuasD,
    prepararCenario,
    adjacente: () => prepararCenario("adjacente"),
    distante: () => prepararCenario("distante"),
    ameacado: () => prepararCenario("ameacado"),
    semLinhaDeVisao: () => prepararCenario("semLinhaDeVisao"),
    abrirFinal: abrirEncerramentoAventura,
    finalVitoria: () => abrirPrimeiroEncerramentoDoTipo("vitoria"),
    finalDerrota: () => abrirPrimeiroEncerramentoDoTipo("derrota"),
  });

  function iniciarInterfaceTestesDev() {
    const paginaDeAventura = document.querySelector(".pagina-aventura");

    if (paginaDeAventura) {
      criarPainel();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarInterfaceTestesDev, {
      once: true,
    });
  } else {
    iniciarInterfaceTestesDev();
  }
})();
