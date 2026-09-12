"use strict";

(function iniciarLaboratorioDev() {
  const seletorArma = document.querySelector("#armaArremessoDev");

  const seletorDestino = document.querySelector("#destinoArremessoDev");

  const controleTamanho = document.querySelector("#tamanhoArmaDev");

  const valorTamanho = document.querySelector("#valorTamanhoArmaDev");

  const previaArma = document.querySelector("#previaArmaDev");

  const nomeArma = document.querySelector("#nomeArmaDev");

  const botaoLancar = document.querySelector("#botaoLancarArmaDev");

  const resultado = document.querySelector("#resultadoArremessoDev");

  const campo = document.querySelector("#campoArremessoDev");

  const marcadores = campo.querySelectorAll("[data-id-participante]");

  const marcadorAlvo = campo.querySelector('[data-id-participante="alvo-dev"]');

  const botaoTestarDestinos = document.querySelector("#botaoTestarDestinosDev");

  const listaResultadosTestes = document.querySelector("#resultadosTestesDestinosDev");

  const botaoTestarPush = document.querySelector("#botaoTestarPushDev");

  const listaResultadosPush = document.querySelector("#resultadosTestesPushDev");

  const botaoPrepararSap = document.querySelector("#botaoPrepararSapDev");

  const botaoAtacarSap = document.querySelector("#botaoAtacarSapDev");

  const botaoTestarSap = document.querySelector("#botaoTestarSapDev");

  const listaResultadosSap = document.querySelector("#resultadosTestesSapDev");

  const botaoTestarVex = document.querySelector("#botaoTestarVexDev");

  const listaResultadosVex = document.querySelector("#resultadosTestesVexDev");

  const botaoTestarSlow = document.querySelector("#botaoTestarSlowDev");

  const listaResultadosSlow = document.querySelector("#resultadosTestesSlowDev");

  const botaoTestarTopple = document.querySelector("#botaoTestarToppleDev");

  const listaResultadosTopple = document.querySelector("#resultadosTestesToppleDev");

  const botaoTestarCleave = document.querySelector("#botaoTestarCleaveDev");

  const listaResultadosCleave = document.querySelector("#resultadosTestesCleaveDev");

  const botaoTestarGraze = document.querySelector("#botaoTestarGrazeDev");

  const listaResultadosGraze = document.querySelector("#resultadosTestesGrazeDev");

  const botaoTestarNick = document.querySelector("#botaoTestarNickDev");

  const listaResultadosNick = document.querySelector("#resultadosTestesNickDev");

  const botaoTestarFormacaoGuerreiro = document.querySelector(
    "#botaoTestarFormacaoGuerreiroDev",
  );

  const listaResultadosFormacaoGuerreiro = document.querySelector(
    "#resultadosFormacaoGuerreiroDev",
  );

  const botaoTestarClasseArmadura = document.querySelector("#botaoTestarClasseArmaduraDev");

  const listaResultadosClasseArmadura = document.querySelector(
    "#resultadosClasseArmaduraDev",
  );

  const botaoTestarEquipamentoInicial = document.querySelector(
    "#botaoTestarEquipamentoInicialDev",
  );

  const listaResultadosEquipamentoInicial = document.querySelector(
    "#resultadosEquipamentoInicialDev",
  );

  const seletorAreaTurno = document.querySelector("#areaTesteTurnoDev");

  const seletorCenarioTurno = document.querySelector("#cenarioTurnoDev");

  const botaoMontarTurno = document.querySelector("#botaoMontarTurnoDev");

  const botaoReiniciarTurno = document.querySelector("#botaoReiniciarTurnoDev");

  const arenaTurno = document.querySelector("#arenaTurnoDev");

  const tituloArenaTurno = document.querySelector("#tituloArenaTurnoDev");

  const movimentoTurno = document.querySelector("#movimentoTurnoDev");

  const acaoTurno = document.querySelector("#acaoTurnoDev");

  const acaoBonusTurno = document.querySelector("#acaoBonusTurnoDev");

  const reacaoTurno = document.querySelector("#reacaoTurnoDev");

  const tabuleiroTurno = document.querySelector("#tabuleiroTurnoDev");

  const instrucaoTurno = document.querySelector("#instrucaoTurnoDev");

  const acoesTurno = document.querySelector("#acoesTurnoDev");

  const resultadosTurno = document.querySelector("#resultadosTurnoDev");

  const catalogoCenariosTurno = Object.freeze({
    "guerreiro-n1": Object.freeze({
      nome: "Guerreiro — nível 1",

      cenarios: Object.freeze({
        nick: Object.freeze({
          id: "nick",
          nome: "Nick com duas armas Leves",

          descricao:
            "Faça um ataque com a Espada Curta e depois use a Cimitarra sem consumir a ação bônus.",

          criarEstado() {
            return window.TestesDev.criarEstadoCenarioNick();
          },

          etapas: Object.freeze([
            "Faça o primeiro ataque com a Espada Curta.",
            "Faça o ataque adicional com a Cimitarra.",
            "Confirme que a ação bônus continua disponível.",
          ]),
        }),
      }),
    }),
  });

  let contextoTurnoAtual = null;

  let progressoTurnoAtual = null;

  function obterCenarioTurnoSelecionado() {
    const area = catalogoCenariosTurno[seletorAreaTurno.value];

    if (!area) {
      return null;
    }

    return area.cenarios[seletorCenarioTurno.value] ?? null;
  }

  function renderizarEtapasTurno(cenario) {
    resultadosTurno.innerHTML = "";

    for (const [indice, etapa] of cenario.etapas.entries()) {
      const item = document.createElement("li");
      const concluida = progressoTurnoAtual?.etapas?.[indice] ?? false;

      item.className = concluida ? "etapa-turno-dev concluida" : "etapa-turno-dev";
      item.textContent = `${concluida ? "✓" : "○"} ${etapa}`;

      resultadosTurno.append(item);
    }
  }

  function atualizarProgressoTurno(ataqueId) {
    if (!contextoTurnoAtual || !progressoTurnoAtual) {
      return;
    }

    const { guerreiro, ataquePrincipal, ataqueNick } = contextoTurnoAtual;

    if (ataqueId === ataquePrincipal.id) {
      progressoTurnoAtual.etapas[0] = true;
    }

    if (ataqueId === ataqueNick.id && guerreiro.maestriasUsadasTurno.includes("nick")) {
      progressoTurnoAtual.etapas[1] = true;
      progressoTurnoAtual.etapas[2] = guerreiro.acaoBonusDisponivel;
    }

    renderizarEtapasTurno(obterCenarioTurnoSelecionado());
  }

  function formatarDisponibilidade(disponivel) {
    return disponivel ? "Disponível" : "Utilizada";
  }

  function atualizarEconomiaTurno() {
    const guerreiro = contextoTurnoAtual?.guerreiro;

    if (!guerreiro) {
      movimentoTurno.textContent = "—";
      acaoTurno.textContent = "—";
      acaoBonusTurno.textContent = "—";
      reacaoTurno.textContent = "—";

      return;
    }

    movimentoTurno.textContent = `${guerreiro.movimentoRestante} células`;
    acaoTurno.textContent = formatarDisponibilidade(guerreiro.acaoDisponivel);
    acaoBonusTurno.textContent = formatarDisponibilidade(guerreiro.acaoBonusDisponivel);
    reacaoTurno.textContent = formatarDisponibilidade(guerreiro.reacaoDisponivel);
  }

  function criarTokenTurno(participante) {
    const token = document.createElement("button");

    token.type = "button";
    token.className = `token-turno-dev token-${participante.tipo}-turno-dev`;
    token.dataset.participanteId = participante.id;
    token.style.gridColumn = participante.posicao.coluna;
    token.style.gridRow = participante.posicao.linha;
    token.setAttribute(
      "aria-label",
      participante.pontosDeVida
        ? `${participante.nome}, ${participante.pontosDeVida.atuais} de ${participante.pontosDeVida.maximo} pontos de vida`
        : participante.nome,
    );

    const nome = document.createElement("span");
    nome.className = "nome-token-turno-dev";
    nome.textContent = participante.nome;

    token.append(nome);

    if (participante.pontosDeVida) {
      const pontosDeVida = document.createElement("span");

      pontosDeVida.className = "pv-token-turno-dev";
      pontosDeVida.textContent =
        `${participante.pontosDeVida.atuais}/${participante.pontosDeVida.maximo} PV`;

      token.append(pontosDeVida);
    }

    return token;
  }

  function renderizarTabuleiroTurno() {
    tabuleiroTurno.innerHTML = "";

    const participantes = contextoTurnoAtual?.combate?.participantes ?? [];

    for (const participante of participantes) {
      tabuleiroTurno.append(criarTokenTurno(participante));
    }
  }

  function executarAtaqueTurno(ataqueId) {
    if (!contextoTurnoAtual) {
      return;
    }

    const { combate, guerreiro, alvo } = contextoTurnoAtual;

    const preparacao = window.SistemaCombate.prepararAtaque(
      combate,
      guerreiro.id,
      alvo.id,
      ataqueId,
    );

    if (!preparacao.sucesso) {
      instrucaoTurno.textContent = `Ataque indisponível: ${preparacao.motivo}.`;

      return;
    }

    const resultadoAtaque = window.SistemaCombate.resolverAtaque(combate, {
      gruposRolados: [
        {
          numeroDeFaces: 20,
          resultados: [15],
        },
      ],
      modificador: preparacao.ataque.bonusAtaque,
    });

    let danoCausado = 0;

    if (resultadoAtaque.acertou) {
      const resultadoDado = 4;
      const modificadorDano = Number(resultadoAtaque.ataque.dano.modificador) || 0;

      danoCausado = Math.max(0, resultadoDado + modificadorDano);

      window.SistemaCombate.resolverDano(combate, {
        total: danoCausado,
      });
    }

    atualizarEconomiaTurno();
    atualizarProgressoTurno(ataqueId);
    renderizarTabuleiroTurno();
    renderizarAcoesTurno();

    instrucaoTurno.textContent = resultadoAtaque.acertou
      ? `${resultadoAtaque.ataque.nome} acertou e causou ${danoCausado} de dano.`
      : `${resultadoAtaque.ataque.nome} errou o ataque.`;
  }

  function renderizarAcoesTurno() {
    acoesTurno.innerHTML = "";

    const ataques = contextoTurnoAtual?.guerreiro?.ataques ?? [];

    for (const ataque of ataques) {
      const botao = document.createElement("button");
      const custo = window.SistemaCombate.obterCustoAtaque(
        contextoTurnoAtual.guerreiro,
        ataque,
      );
      const disponivel =
        custo === "nenhum" ||
        (custo === "acao" && contextoTurnoAtual.guerreiro.acaoDisponivel) ||
        (custo === "acaoBonus" && contextoTurnoAtual.guerreiro.acaoBonusDisponivel) ||
        (custo === "reacao" && contextoTurnoAtual.guerreiro.reacaoDisponivel);

      botao.type = "button";
      botao.className = "acao-ferramenta acao-turno-dev";
      botao.disabled = !disponivel;
      botao.textContent = `Atacar com ${ataque.nome}`;
      botao.title = disponivel
        ? `Custo: ${custo === "nenhum" ? "sem ação" : custo}`
        : `Indisponível: ${custo}`;

      botao.addEventListener("click", function executarAtaqueSelecionado() {
        executarAtaqueTurno(ataque.id);
      });

      acoesTurno.append(botao);
    }
  }

  function montarCenarioTurno() {
    const cenario = obterCenarioTurnoSelecionado();

    if (!cenario) {
      console.warn("O cenário selecionado não foi encontrado.");

      return;
    }

    tituloArenaTurno.textContent = cenario.nome;
    instrucaoTurno.textContent = cenario.descricao;

    contextoTurnoAtual = cenario.criarEstado();
    progressoTurnoAtual = {
      etapas: cenario.etapas.map(() => false),
    };

    atualizarEconomiaTurno();
    renderizarTabuleiroTurno();

    renderizarAcoesTurno();

    renderizarEtapasTurno(cenario);

    arenaTurno.hidden = false;
  }

  const editorVitrine = document.querySelector("#editorVitrineDev");

  const estadoEditorVitrine = document.querySelector("#estadoEditorVitrineDev");

  const nomeArmaSelecionadaVitrine = document.querySelector("#armaSelecionadaVitrineDev");

  const controleTamanhoVitrine = document.querySelector("#tamanhoVitrineDev");

  const valorTamanhoVitrine = document.querySelector("#valorTamanhoVitrineDev");

  const controleRotacaoVitrine = document.querySelector("#rotacaoVitrineDev");

  const valorRotacaoVitrine = document.querySelector("#valorRotacaoVitrineDev");

  const controleRotuloXVitrine = document.querySelector("#rotuloXVitrineDev");

  const valorRotuloXVitrine = document.querySelector("#valorRotuloXVitrineDev");

  const controleRotuloYVitrine = document.querySelector("#rotuloYVitrineDev");

  const valorRotuloYVitrine = document.querySelector("#valorRotuloYVitrineDev");

  let armaSelecionadaEditorId = null;

  const botaoDesfazerVitrine = document.querySelector("#botaoDesfazerVitrineDev");

  const botaoRestaurarArmaVitrine = document.querySelector("#botaoRestaurarArmaVitrineDev");

  const botaoRestaurarTudoVitrine = document.querySelector("#botaoRestaurarTudoVitrineDev");

  const botaoSalvarVitrine = document.querySelector("#botaoSalvarVitrineDev");

  const botaoGerarConfiguracaoVitrine = document.querySelector("#botaoGerarConfiguracaoVitrineDev");

  const botaoVitrineArmasCompactas = document.querySelector("#botaoVitrineArmasCompactasDev");

  const botaoVitrineArmasLongas = document.querySelector("#botaoVitrineArmasLongasDev");

  const botaoVitrineArmaduras = document.querySelector("#botaoVitrineArmadurasDev");

  let arrasteAtual = null;

  const posicoesArmasOriginais = structuredClone(window.ConfiguracaoVitrineEquipamentos.armas);

  const controlesTransformacaoVitrine = {
    inclinacaoHorizontal: {
      controle: document.querySelector("#inclinacaoHorizontalVitrineDev"),
      valor: document.querySelector("#valorInclinacaoHorizontalVitrineDev"),
      propriedadeCss: "--inclinacao-horizontal-editor",
    },
    inclinacaoVertical: {
      controle: document.querySelector("#inclinacaoVerticalVitrineDev"),
      valor: document.querySelector("#valorInclinacaoVerticalVitrineDev"),
      propriedadeCss: "--inclinacao-vertical-editor",
    },
    perspectivaHorizontal: {
      controle: document.querySelector("#perspectivaHorizontalVitrineDev"),
      valor: document.querySelector("#valorPerspectivaHorizontalVitrineDev"),
      propriedadeCss: "--perspectiva-horizontal-editor",
    },
    perspectivaVertical: {
      controle: document.querySelector("#perspectivaVerticalVitrineDev"),
      valor: document.querySelector("#valorPerspectivaVerticalVitrineDev"),
      propriedadeCss: "--perspectiva-vertical-editor",
    },
  };

  const posicoesArmasEditor = structuredClone(posicoesArmasOriginais);

  const posicoesArmadurasOriginais = structuredClone(
    window.ConfiguracaoVitrineEquipamentos.armaduras,
  );

  const posicoesArmadurasEditor = structuredClone(posicoesArmadurasOriginais);

  let tipoVitrineEditor = "armasCompactas";

  const chaveRascunhoVitrine = "rpgSolo:editorVitrine:armas:v6";

  const chaveRascunhoArmadurasVitrine = "rpgSolo:editorVitrine:armaduras";

  const historicoVitrine = [];

  const controlesVitrine = document.querySelector("#controlesVitrineDev");

  const botaoFecharControlesVitrine = document.querySelector("#botaoFecharControlesVitrineDev");

  function mesclarRascunhoVitrine(posicoes, rascunho) {
    for (const [equipamentoId, valoresSalvos] of Object.entries(rascunho)) {
      posicoes[equipamentoId] = {
        ...(posicoes[equipamentoId] ?? {}),
        ...valoresSalvos,
      };
    }
  }

  try {
    const rascunhoSalvo = JSON.parse(localStorage.getItem(chaveRascunhoVitrine));

    if (rascunhoSalvo && typeof rascunhoSalvo === "object") {
      mesclarRascunhoVitrine(posicoesArmasEditor, rascunhoSalvo);
    }

    const rascunhoArmaduras = JSON.parse(localStorage.getItem(chaveRascunhoArmadurasVitrine));

    if (rascunhoArmaduras && typeof rascunhoArmaduras === "object") {
      mesclarRascunhoVitrine(posicoesArmadurasEditor, rascunhoArmaduras);
    }
  } catch (erro) {
    console.warn("Não foi possível carregar o rascunho da vitrine.", erro);
  }

  function obterPosicoesEditorAtuais() {
    return tipoVitrineEditor === "armaduras" ? posicoesArmadurasEditor : posicoesArmasEditor;
  }

  function obterPosicoesOriginaisAtuais() {
    return tipoVitrineEditor === "armaduras" ? posicoesArmadurasOriginais : posicoesArmasOriginais;
  }

  function obterCatalogoVitrineAtual() {
    return tipoVitrineEditor === "armaduras"
      ? window.bancoEquipamentos.armaduras
      : window.bancoEquipamentos.armas;
  }

  function equipamentoPertenceVistaAtual(equipamentoId) {
    if (tipoVitrineEditor === "armaduras") return true;

    const parede = tipoVitrineEditor === "armasLongas" ? "longas" : "compactas";
    return window.ConfiguracaoVitrineEquipamentos.paredesArmas[parede].includes(equipamentoId);
  }

  function obterImagemVitrineAtual(equipamento) {
    if (tipoVitrineEditor === "armaduras") {
      return equipamento.visual?.vitrine?.src ?? equipamento.visual?.icone?.src;
    }

    return equipamento.visual?.icone?.src;
  }

  function criarNomeEquipamentoEditor(nome, equipamentoId, posicao = {}) {
    const rotulo = document.createElement("span");

    const rotuloX = Number(posicao.rotuloX ?? posicao.x + posicao.largura / 2);

    const rotuloY = Number(posicao.rotuloY ?? posicao.y + posicao.altura);

    rotulo.className = "nome-equipamento-editor-vitrine";

    rotulo.dataset.rotuloEquipamentoId = equipamentoId;

    rotulo.textContent = posicao.rotuloTexto ?? nome;
    rotulo.style.left = `${rotuloX}%`;
    rotulo.style.top = `${rotuloY}%`;

    return rotulo;
  }

  let arrasteArmaEditor = null;

  function listarArmasArremessaveis() {
    return Object.entries(window.bancoEquipamentos?.armas ?? {}).filter(
      ([, arma]) => arma.propriedades?.includes("arremesso") && arma.visual?.arremesso?.src,
    );
  }

  function obterArmaSelecionada() {
    const armaId = seletorArma.value;
    const arma = window.bancoEquipamentos.armas[armaId];

    return {
      id: armaId,
      ...arma,
    };
  }

  function criarContextoDestinoTeste(armaId) {
    const arma = window.bancoEquipamentos.armas[armaId];

    const atacante = {
      id: "jogador-teste",
      estado: "ativo",
      posicao: {
        coluna: 5,
        linha: 5,
      },
    };

    const alvo = {
      id: "alvo-teste",
      estado: "ativo",
      posicao: {
        coluna: 10,
        linha: 10,
      },
    };

    const combate = {
      tabuleiro: {
        colunas: 48,
        linhas: 27,
      },

      terreno: {
        bloqueado: [],
      },

      participantes: [atacante, alvo],

      itensNoChao: [],
    };

    const ataque = {
      armaId,
      equipamentoInstanciaId: `${armaId}:teste-${crypto.randomUUID()}`,

      modoUso: "arremesso",
      nome: `${arma.nome} (arremesso)`,

      arremesso: structuredClone(arma.arremesso ?? {}),
    };

    return {
      combate,
      atacante,
      alvo,
      ataque,
    };
  }

  function executarTesteDestino(configuracao) {
    const contexto = criarContextoDestinoTeste(configuracao.armaId);

    const resultadoTeste = window.SistemaCombate.resolverDestinoArmaArremessada({
      ...contexto,
      acertou: configuracao.acertou,
      resultadoRolagemDano: configuracao.resultadoRolagemDano,
    });

    return {
      ...configuracao,
      resultadoObtido: resultadoTeste.destino,
      passou: resultadoTeste.sucesso && resultadoTeste.destino === configuracao.destinoEsperado,
    };
  }

  function executarTestesDestinos() {
    const armasTestadas = [
      "adaga",
      "machadinha",
      "azagaia",
      "marteloLeve",
      "lanca",
      "dardo",
      "tridente",
    ];

    const testes = armasTestadas
      .flatMap((armaId) => {
        const arma = window.bancoEquipamentos.armas[armaId];

        const numeroDeFaces = Number(arma.dano.match(/d(\d+)/)?.[1]);

        const destinoComDanoMaximo = arma.arremesso.podeFicarCravada ? "alvo" : "chao";

        const criarRolagemDano = (resultado) => ({
          gruposRolados: [
            {
              numeroDeFaces,
              resultados: [resultado],
            },
          ],
        });

        return [
          {
            nome: `${arma.nome} com dano máximo`,
            armaId,
            acertou: true,
            resultadoRolagemDano: criarRolagemDano(numeroDeFaces),
            destinoEsperado: destinoComDanoMaximo,
          },
          {
            nome: `${arma.nome} sem dano máximo`,
            armaId,
            acertou: true,
            resultadoRolagemDano: criarRolagemDano(numeroDeFaces - 1),
            destinoEsperado: "chao",
          },
          {
            nome: `${arma.nome} que errou o ataque`,
            armaId,
            acertou: false,
            resultadoRolagemDano: null,
            destinoEsperado: "chao",
          },
        ];
      })
      .map(executarTesteDestino);

    listaResultadosTestes.innerHTML = "";

    for (const teste of testes) {
      const item = document.createElement("li");

      item.className = teste.passou ? "teste-dev-passou" : "teste-dev-falhou";

      item.textContent = teste.passou
        ? `✓ ${teste.nome} → ${teste.resultadoObtido}`
        : `✕ ${teste.nome}: esperado ` +
          `${teste.destinoEsperado}, recebeu ` +
          `${teste.resultadoObtido ?? "nenhum"}`;

      listaResultadosTestes.append(item);
    }
    const dardo = window.bancoEquipamentos.armas.dardo;

    const modoDardo = window.RegrasFichaCriacao.normalizarModoUsoArma(dardo, "padrao");

    const itemModoDardo = document.createElement("li");

    const dardoFoiNormalizado = modoDardo === "arremesso";

    itemModoDardo.className = dardoFoiNormalizado ? "teste-dev-passou" : "teste-dev-falhou";

    itemModoDardo.textContent = dardoFoiNormalizado
      ? "✓ Dardo de distância → modo arremesso"
      : "✕ Dardo de distância: esperado " + `"arremesso", recebeu "${modoDardo}"`;

    listaResultadosTestes.append(itemModoDardo);
  }

  function criarContextoPush({ dominaArma = true, tamanhoAlvo = "medio", bloqueado = false } = {}) {
    const atacante = {
      id: "guerreiro-push-dev",
      tipo: "jogador",
      estado: "ativo",
      posicao: { coluna: 5, linha: 5 },
      habilidades: {
        escolhas: {
          maestriasArmas: dominaArma ? ["marteloGuerra"] : ["espadaLonga"],
        },
      },
    };

    const alvo = {
      id: "alvo-push-dev",
      tipo: "inimigo",
      estado: "ativo",
      tamanho: tamanhoAlvo,
      posicao: { coluna: 6, linha: 5 },
    };

    const combate = {
      status: "ativo",
      tabuleiro: { colunas: 12, linhas: 12 },
      terreno: {
        bloqueado: bloqueado ? [{ coluna: 7, linha: 5 }] : [],
        dificil: [],
      },
      participantes: [atacante, alvo],
      objetivos: [],
    };

    const ataque = {
      id: "marteloGuerra:principal",
      armaId: "marteloGuerra",
      maestriaId: "push",
    };

    return { atacante, alvo, ataque, combate };
  }

  function prepararPush(contexto, gatilho = "aposAcertarAtaque") {
    return window.TradutorRegras.prepararOperacoes({
      gatilho,
      participante: contexto.atacante,
      ataque: contexto.ataque,
      alvo: contexto.alvo,
    }).find((operacao) => operacao.tipo === "deslocarAlvo");
  }

  function executarTestesPush() {
    const testes = [];

    const contextoValido = criarContextoPush();
    const operacaoValida = prepararPush(contextoValido);
    const resultadoValido = window.SistemaCombate.aplicarDeslocamentoForcado(
      contextoValido.combate,
      operacaoValida,
    );
    testes.push({
      nome: "acerto válido desloca o alvo por 2 células",
      passou:
        resultadoValido.sucesso &&
        resultadoValido.distanciaPercorrida === 2 &&
        contextoValido.alvo.posicao.coluna === 8,
    });

    const contextoErro = criarContextoPush();
    testes.push({
      nome: "erro no ataque não oferece Push",
      passou: prepararPush(contextoErro, "aposErrarAtaque") === undefined,
    });

    const contextoSemDominio = criarContextoPush({ dominaArma: false });
    testes.push({
      nome: "arma não dominada não oferece Push",
      passou: prepararPush(contextoSemDominio) === undefined,
    });

    const contextoEnorme = criarContextoPush({ tamanhoAlvo: "enorme" });
    testes.push({
      nome: "criatura Enorme não pode ser empurrada",
      passou: prepararPush(contextoEnorme) === undefined,
    });

    const contextoBloqueado = criarContextoPush({ bloqueado: true });
    const operacaoBloqueada = prepararPush(contextoBloqueado);
    const resultadoBloqueado = window.SistemaCombate.aplicarDeslocamentoForcado(
      contextoBloqueado.combate,
      operacaoBloqueada,
    );
    testes.push({
      nome: "terreno bloqueado impede o deslocamento",
      passou:
        resultadoBloqueado.sucesso &&
        !resultadoBloqueado.aplicado &&
        contextoBloqueado.alvo.posicao.coluna === 6,
    });

    listaResultadosPush.innerHTML = "";

    for (const teste of testes) {
      const item = document.createElement("li");
      item.className = teste.passou ? "teste-dev-passou" : "teste-dev-falhou";
      item.textContent = `${teste.passou ? "✓" : "✕"} ${teste.nome}`;
      listaResultadosPush.append(item);
    }
  }

  function exibirResultadoSap(resultado) {
    listaResultadosSap.innerHTML = "";

    const resumo = document.createElement("li");
    resumo.className = resultado.passou ? "teste-dev-passou" : "teste-dev-falhou";
    resumo.textContent = resultado.passou ? "✓ Etapa concluída" : "✕ Etapa falhou";
    listaResultadosSap.append(resumo);

    for (const detalhe of resultado.detalhes ?? []) {
      const item = document.createElement("li");
      item.textContent = detalhe;
      listaResultadosSap.append(item);
    }
  }

  function prepararSapDev() {
    exibirResultadoSap(window.TestesDev.prepararCenarioSap());
  }

  function executarAtaqueSapDev() {
    exibirResultadoSap(window.TestesDev.executarAtaqueCenarioSap());
  }

  async function executarTesteCompletoSapDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.sap");

    exibirResultadoSap({
      passou: resultado.status === "aprovado",
      detalhes:
        resultado.detalhes?.length > 0
          ? resultado.detalhes
          : [resultado.mensagem ?? "O teste não retornou detalhes."],
    });
  }

  async function executarTesteCompletoVexDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.vex");

    listaResultadosVex.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Teste completo aprovado" : "✕ Teste completo falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");
      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }
      item.textContent = texto;
      listaResultadosVex.append(item);
    }
  }

  async function executarTesteCompletoSlowDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.slow");

    listaResultadosSlow.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Teste completo aprovado" : "✕ Teste completo falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");
      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }
      item.textContent = texto;
      listaResultadosSlow.append(item);
    }
  }

  async function executarTesteCompletoToppleDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.topple");

    listaResultadosTopple.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Teste completo aprovado" : "✕ Teste completo falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");
      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }
      item.textContent = texto;
      listaResultadosTopple.append(item);
    }
  }

  async function executarTesteCompletoCleaveDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.cleave");

    listaResultadosCleave.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Teste completo aprovado" : "✕ Teste completo falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");
      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }
      item.textContent = texto;
      listaResultadosCleave.append(item);
    }
  }

  async function executarTesteCompletoGrazeDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.graze");

    listaResultadosGraze.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Teste completo aprovado" : "✕ Teste completo falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");
      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }
      item.textContent = texto;
      listaResultadosGraze.append(item);
    }
  }

  async function executarTesteCompletoNickDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.maestria.nick");

    listaResultadosNick.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Teste completo aprovado" : "✕ Teste completo falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");
      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }
      item.textContent = texto;
      listaResultadosNick.append(item);
    }
  }

  async function executarTesteFormacaoGuerreiroDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.formacao.nivel1");

    listaResultadosFormacaoGuerreiro.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado"
        ? "✓ Contrato básico aprovado"
        : "✕ Contrato básico falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");

      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }

      item.textContent = texto;
      listaResultadosFormacaoGuerreiro.append(item);
    }
  }

  async function executarTesteClasseArmaduraDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.classeArmadura");

    listaResultadosClasseArmadura.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado" ? "✓ Matriz de CA aprovada" : "✕ Matriz de CA falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");

      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }

      item.textContent = texto;
      listaResultadosClasseArmadura.append(item);
    }
  }

  async function executarTesteEquipamentoInicialDev() {
    const resultado = await window.TestesDev.executarTeste("guerreiro.equipamentoInicial");

    listaResultadosEquipamentoInicial.innerHTML = "";

    const linhas = [
      resultado.status === "aprovado"
        ? "✓ Cadastro dos conjuntos aprovado"
        : "✕ Cadastro dos conjuntos falhou",
      ...(resultado.detalhes ?? [resultado.mensagem ?? "O teste não retornou detalhes."]),
    ];

    for (const [indice, texto] of linhas.entries()) {
      const item = document.createElement("li");

      if (indice === 0) {
        item.className = resultado.status === "aprovado" ? "teste-dev-passou" : "teste-dev-falhou";
      }

      item.textContent = texto;
      listaResultadosEquipamentoInicial.append(item);
    }
  }

  function formatarTamanhoEmCelulas(tamanho) {
    return `${tamanho} ${tamanho === 1 ? "célula" : "células"}`;
  }

  function carregarDimensoesArma() {
    const arma = obterArmaSelecionada();
    const configuracao = arma.visual.arremesso;

    controleTamanho.value = String(configuracao.tamanhoEmCelulas);

    valorTamanho.textContent = formatarTamanhoEmCelulas(configuracao.tamanhoEmCelulas);
  }

  function atualizarDimensoesArma() {
    const arma = obterArmaSelecionada();
    const configuracao = arma.visual.arremesso;

    configuracao.tamanhoEmCelulas = Number(controleTamanho.value);

    valorTamanho.textContent = formatarTamanhoEmCelulas(configuracao.tamanhoEmCelulas);

    removerResultadoAnterior();

    resultado.textContent = "Dimensões temporárias atualizadas. Lance novamente.";
  }

  function removerResultadoAnterior() {
    campo.querySelector("[data-resultado-arremesso-dev]")?.remove();
  }

  function obterCentroAlvoNoCampo() {
    const posicaoCampo = campo.getBoundingClientRect();

    const posicaoAlvo = marcadorAlvo.getBoundingClientRect();

    return {
      x: posicaoAlvo.left - posicaoCampo.left + posicaoAlvo.width / 2,

      y: posicaoAlvo.top - posicaoCampo.top + posicaoAlvo.height / 2,
    };
  }

  function apresentarDestinoArremesso(arma) {
    removerResultadoAnterior();

    const destino = seletorDestino.value;

    if (destino === "nenhum") {
      return;
    }

    const configuracao = arma.visual.arremesso;

    const centroAlvo = obterCentroAlvoNoCampo();

    const imagem = document.createElement("img");

    imagem.src = arma.visual.icone?.src ?? configuracao.src;

    imagem.alt = arma.nome;
    imagem.draggable = false;

    if (destino === "chao") {
      imagem.className = "item-no-chao-combate arma-resultado-dev";

      imagem.dataset.resultadoArremessoDev = "chao";
      imagem.style.left = `${centroAlvo.x + 70}px`;

      imagem.style.top = `${centroAlvo.y + 45}px`;

      imagem.style.width = "auto";
      imagem.style.height = `${64 * configuracao.tamanhoEmCelulas}px`;

      campo.append(imagem);
      return;
    }

    const indicador = document.createElement("span");

    indicador.className = "itens-cravados-token arma-resultado-dev";

    indicador.dataset.resultadoArremessoDev = "alvo";
    indicador.style.left = `${centroAlvo.x}px`;

    indicador.style.top = `${centroAlvo.y}px`;

    indicador.style.width = "auto";
    indicador.style.height = `${64 * configuracao.tamanhoEmCelulas}px`;

    indicador.append(imagem);
    campo.append(indicador);
  }

  function atualizarPrevia() {
    const arma = obterArmaSelecionada();

    previaArma.src = arma.visual.icone.src;
    previaArma.alt = arma.nome;
    nomeArma.textContent = arma.nome;

    carregarDimensoesArma();
    removerResultadoAnterior();

    resultado.textContent = "Arma pronta para o teste.";
  }

  async function lancarArma() {
    const arma = obterArmaSelecionada();
    removerResultadoAnterior();

    botaoLancar.disabled = true;
    resultado.textContent = `Lançando ${arma.nome.toLowerCase()}...`;

    const sucesso = await window.AnimacoesCombate.animarArremessoArma(
      "origem-dev",
      "alvo-dev",
      arma.id,
      {
        raiz: campo,
        zoom: 1,
      },
    );

    if (sucesso) {
      apresentarDestinoArremesso(arma);
    }

    resultado.textContent = sucesso
      ? `${arma.nome} percorreu o trajeto.`
      : "Não foi possível executar a animação.";

    botaoLancar.disabled = false;
  }

  function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
  }

  function iniciarArrasteMarcador(evento) {
    const marcador = evento.currentTarget;
    const posicaoMarcador = marcador.getBoundingClientRect();

    arrasteAtual = {
      marcador,
      ponteiroId: evento.pointerId,
      deslocamentoX: evento.clientX - posicaoMarcador.left,
      deslocamentoY: evento.clientY - posicaoMarcador.top,
    };

    marcador.setPointerCapture(evento.pointerId);
    marcador.classList.add("arrastando");
  }

  function continuarArrasteMarcador(evento) {
    if (!arrasteAtual || arrasteAtual.ponteiroId !== evento.pointerId) {
      return;
    }

    const { marcador } = arrasteAtual;
    const posicaoCampo = campo.getBoundingClientRect();

    const esquerda = limitar(
      evento.clientX - posicaoCampo.left - arrasteAtual.deslocamentoX,
      0,
      campo.clientWidth - marcador.offsetWidth,
    );

    const topo = limitar(
      evento.clientY - posicaoCampo.top - arrasteAtual.deslocamentoY,
      0,
      campo.clientHeight - marcador.offsetHeight,
    );

    marcador.style.left = `${esquerda}px`;
    marcador.style.top = `${topo}px`;
    marcador.style.right = "auto";
    marcador.style.transform = "none";
  }

  function encerrarArrasteMarcador(evento) {
    if (!arrasteAtual || arrasteAtual.ponteiroId !== evento.pointerId) {
      return;
    }

    const { marcador } = arrasteAtual;

    marcador.classList.remove("arrastando");

    if (marcador.hasPointerCapture(evento.pointerId)) {
      marcador.releasePointerCapture(evento.pointerId);
    }

    arrasteAtual = null;
    resultado.textContent = "Posições atualizadas. A arma está pronta.";
  }

  for (const [armaId, arma] of listarArmasArremessaveis()) {
    const opcao = document.createElement("option");

    opcao.value = armaId;
    opcao.textContent = arma.nome;

    seletorArma.append(opcao);
  }

  for (const marcador of marcadores) {
    marcador.addEventListener("pointerdown", iniciarArrasteMarcador);

    marcador.addEventListener("pointermove", continuarArrasteMarcador);

    marcador.addEventListener("pointerup", encerrarArrasteMarcador);

    marcador.addEventListener("pointercancel", encerrarArrasteMarcador);
  }

  function fecharControlesVitrine() {
    controlesVitrine.classList.remove("visivel");
  }

  function posicionarControlesVitrine(elemento) {
    controlesVitrine.classList.add("visivel");

    const caixaArma = elemento.getBoundingClientRect();

    const larguraPainel = controlesVitrine.offsetWidth;

    const alturaPainel = controlesVitrine.offsetHeight;

    const margem = 12;

    let esquerda = caixaArma.right + margem;

    let topo = caixaArma.top;

    // Se não houver espaço à direita,
    // tenta abrir à esquerda da arma.
    if (esquerda + larguraPainel > window.innerWidth - margem) {
      esquerda = caixaArma.left - larguraPainel - margem;
    }

    // Impede que o painel saia da tela.
    esquerda = limitar(esquerda, margem, window.innerWidth - larguraPainel - margem);

    topo = limitar(topo, margem, window.innerHeight - alturaPainel - margem);

    controlesVitrine.style.left = `${esquerda}px`;

    controlesVitrine.style.top = `${topo}px`;
  }

  function selecionarArmaEditor(elemento) {
    editorVitrine.querySelector(".selecionada")?.classList.remove("selecionada");

    elemento.classList.add("selecionada");

    armaSelecionadaEditorId = elemento.dataset.armaId;

    const arma = obterCatalogoVitrineAtual()[armaSelecionadaEditorId];

    const posicao = obterPosicoesEditorAtuais()[armaSelecionadaEditorId];

    const rotuloX = Number(posicao.rotuloX ?? posicao.x + posicao.largura / 2);

    const rotuloY = Number(posicao.rotuloY ?? posicao.y + posicao.altura);

    posicao.rotuloX = rotuloX;
    posicao.rotuloY = rotuloY;

    nomeArmaSelecionadaVitrine.textContent = arma.nome;

    controleTamanhoVitrine.disabled = false;
    controleRotacaoVitrine.disabled = false;

    controleRotuloXVitrine.disabled = false;
    controleRotuloYVitrine.disabled = false;

    controleRotuloXVitrine.value = String(rotuloX);
    controleRotuloYVitrine.value = String(rotuloY);

    valorRotuloXVitrine.textContent = `${rotuloX.toFixed(2)}%`;

    valorRotuloYVitrine.textContent = `${rotuloY.toFixed(2)}%`;

    for (const [campo, referencia] of Object.entries(controlesTransformacaoVitrine)) {
      const valor = Number(posicao[campo] ?? 0);
      referencia.controle.disabled = false;
      referencia.controle.value = String(valor);
      referencia.valor.textContent = `${valor}°`;
    }

    controleTamanhoVitrine.value = String(posicao.largura);

    controleRotacaoVitrine.value = String(posicao.rotacao);

    posicionarControlesVitrine(elemento);

    valorTamanhoVitrine.textContent = `${posicao.largura.toFixed(2)}%`;

    valorRotacaoVitrine.textContent = `${posicao.rotacao}°`;
  }

  function iniciarArrasteArmaEditor(evento) {
    const elemento = evento.currentTarget;
    selecionarArmaEditor(elemento);
    registrarHistoricoVitrine();

    const posicaoEditor = editorVitrine.getBoundingClientRect();

    arrasteArmaEditor = {
      elemento,
      armaId: elemento.dataset.armaId,
      ponteiroId: evento.pointerId,

      deslocamentoX: evento.clientX - posicaoEditor.left - elemento.offsetLeft,

      deslocamentoY: evento.clientY - posicaoEditor.top - elemento.offsetTop,
    };

    elemento.setPointerCapture(evento.pointerId);
    elemento.classList.add("arrastando");
  }

  function continuarArrasteArmaEditor(evento) {
    if (!arrasteArmaEditor || arrasteArmaEditor.ponteiroId !== evento.pointerId) {
      return;
    }

    evento.preventDefault();

    const { elemento, armaId } = arrasteArmaEditor;

    const posicaoEditor = editorVitrine.getBoundingClientRect();

    const esquerdaPx = limitar(
      evento.clientX - posicaoEditor.left - arrasteArmaEditor.deslocamentoX,
      0,
      editorVitrine.clientWidth - elemento.offsetWidth,
    );

    const topoPx = limitar(
      evento.clientY - posicaoEditor.top - arrasteArmaEditor.deslocamentoY,
      0,
      editorVitrine.clientHeight - elemento.offsetHeight,
    );

    const x = (esquerdaPx / editorVitrine.clientWidth) * 100;

    const y = (topoPx / editorVitrine.clientHeight) * 100;

    obterPosicoesEditorAtuais()[armaId].x = x;
    obterPosicoesEditorAtuais()[armaId].y = y;

    elemento.style.left = `${x}%`;
    elemento.style.top = `${y}%`;

    posicionarControlesVitrine(elemento);

    estadoEditorVitrine.textContent =
      `${obterCatalogoVitrineAtual()[armaId].nome}: ` + `x ${x.toFixed(2)}%, y ${y.toFixed(2)}%.`;
  }

  function encerrarArrasteArmaEditor(evento) {
    if (!arrasteArmaEditor || arrasteArmaEditor.ponteiroId !== evento.pointerId) {
      return;
    }

    const { elemento, armaId } = arrasteArmaEditor;

    elemento.classList.remove("arrastando");

    if (elemento.hasPointerCapture(evento.pointerId)) {
      elemento.releasePointerCapture(evento.pointerId);
    }

    const posicao = obterPosicoesEditorAtuais()[armaId];

    estadoEditorVitrine.textContent =
      `${obterCatalogoVitrineAtual()[armaId].nome} ` +
      `movida para x ${posicao.x.toFixed(2)}%, ` +
      `y ${posicao.y.toFixed(2)}%.`;

    arrasteArmaEditor = null;
  }

  function criarArmaEditorVitrine(armaId, arma, posicao) {
    const elemento = document.createElement("button");

    elemento.type = "button";
    elemento.className = "arma-editor-vitrine-dev";
    elemento.dataset.armaId = armaId;
    elemento.title = arma.nome;

    elemento.style.left = `${posicao.x}%`;
    elemento.style.top = `${posicao.y}%`;
    elemento.style.width = `${posicao.largura}%`;
    elemento.style.height = `${posicao.altura}%`;

    elemento.style.setProperty("--rotacao-arma-editor", `${posicao.rotacao}deg`);
    elemento.style.setProperty("--escala-visual-editor", Number(posicao.escalaVisual ?? 1));

    for (const [campo, referencia] of Object.entries(controlesTransformacaoVitrine)) {
      elemento.style.setProperty(referencia.propriedadeCss, `${Number(posicao[campo] ?? 0)}deg`);
    }

    const imagem = document.createElement("img");

    imagem.src = obterImagemVitrineAtual(arma);
    imagem.alt = arma.nome;
    imagem.draggable = false;

    elemento.append(imagem);

    elemento.addEventListener("pointerdown", iniciarArrasteArmaEditor);

    elemento.addEventListener("pointermove", continuarArrasteArmaEditor);

    elemento.addEventListener("pointerup", encerrarArrasteArmaEditor);

    elemento.addEventListener("pointercancel", encerrarArrasteArmaEditor);

    return elemento;
  }

  function atualizarPosicaoRotulo(campo) {
    if (!armaSelecionadaEditorId) {
      return;
    }

    const posicao = obterPosicoesEditorAtuais()[armaSelecionadaEditorId];

    const alterandoHorizontal = campo === "rotuloX";

    const controle = alterandoHorizontal ? controleRotuloXVitrine : controleRotuloYVitrine;

    const exibicao = alterandoHorizontal ? valorRotuloXVitrine : valorRotuloYVitrine;

    const propriedadeCss = alterandoHorizontal ? "left" : "top";

    const novoValor = Number(controle.value);

    posicao[campo] = novoValor;

    const idSeguro = CSS.escape(armaSelecionadaEditorId);

    const rotulo = editorVitrine.querySelector(`[data-rotulo-equipamento-id="${idSeguro}"]`);

    if (!rotulo) {
      return;
    }

    rotulo.style[propriedadeCss] = `${novoValor}%`;

    exibicao.textContent = `${novoValor.toFixed(2)}%`;
  }

  function atualizarTamanhoArmaEditor() {
    if (!armaSelecionadaEditorId) {
      return;
    }

    const posicao = obterPosicoesEditorAtuais()[armaSelecionadaEditorId];

    const novaLargura = Number(controleTamanhoVitrine.value);

    const proporcao = novaLargura / posicao.largura;

    posicao.largura = novaLargura;
    posicao.altura *= proporcao;

    const elemento = editorVitrine.querySelector(`[data-arma-id="${armaSelecionadaEditorId}"]`);

    elemento.style.width = `${posicao.largura}%`;

    elemento.style.height = `${posicao.altura}%`;

    valorTamanhoVitrine.textContent = `${posicao.largura.toFixed(2)}%`;
  }

  function atualizarRotacaoArmaEditor() {
    if (!armaSelecionadaEditorId) {
      return;
    }

    const posicao = obterPosicoesEditorAtuais()[armaSelecionadaEditorId];

    posicao.rotacao = Number(controleRotacaoVitrine.value);

    const elemento = editorVitrine.querySelector(`[data-arma-id="${armaSelecionadaEditorId}"]`);

    elemento.style.setProperty("--rotacao-arma-editor", `${posicao.rotacao}deg`);

    valorRotacaoVitrine.textContent = `${posicao.rotacao}°`;
  }

  function atualizarTransformacaoEquipamento(campo) {
    if (!armaSelecionadaEditorId) {
      return;
    }

    const referencia = controlesTransformacaoVitrine[campo];
    const posicao = obterPosicoesEditorAtuais()[armaSelecionadaEditorId];
    const valor = Number(referencia.controle.value);
    const elemento = editorVitrine.querySelector(`[data-arma-id="${armaSelecionadaEditorId}"]`);

    posicao[campo] = valor;
    elemento.style.setProperty(referencia.propriedadeCss, `${valor}deg`);
    referencia.valor.textContent = `${valor}°`;
  }

  function preencherEditorVitrine() {
    editorVitrine.replaceChildren();

    for (const [armaId, posicao] of Object.entries(obterPosicoesEditorAtuais())) {
      const arma = obterCatalogoVitrineAtual()[armaId];

      if (!arma || !equipamentoPertenceVistaAtual(armaId) || !obterImagemVitrineAtual(arma)) {
        continue;
      }

      const elemento = criarArmaEditorVitrine(armaId, arma, posicao);

      const rotulo = criarNomeEquipamentoEditor(arma.nome, armaId, posicao);

      editorVitrine.append(elemento, rotulo);
    }

    estadoEditorVitrine.textContent = `${
      editorVitrine.querySelectorAll(".arma-editor-vitrine-dev").length
    } equipamentos carregados nesta parede.`;
  }

  function registrarHistoricoVitrine() {
    historicoVitrine.push({
      tipo: tipoVitrineEditor,
      posicoes: structuredClone(obterPosicoesEditorAtuais()),
    });

    if (historicoVitrine.length > 50) {
      historicoVitrine.shift();
    }
  }

  function substituirPosicoesEditor(novasPosicoes) {
    const posicoesAtuais = obterPosicoesEditorAtuais();

    for (const armaId of Object.keys(posicoesAtuais)) {
      delete posicoesAtuais[armaId];
    }

    Object.assign(posicoesAtuais, structuredClone(novasPosicoes));

    preencherEditorVitrine();
    armaSelecionadaEditorId = null;
    nomeArmaSelecionadaVitrine.textContent = "Selecione um equipamento";
    controleTamanhoVitrine.disabled = true;
    controleRotacaoVitrine.disabled = true;
    valorTamanhoVitrine.textContent = "—";
    valorRotacaoVitrine.textContent = "—";
    for (const referencia of Object.values(controlesTransformacaoVitrine)) {
      referencia.controle.disabled = true;
      referencia.valor.textContent = "—";
    }
  }

  function desfazerAlteracaoVitrine() {
    const estadoAnterior = historicoVitrine.pop();

    if (!estadoAnterior) {
      estadoEditorVitrine.textContent = "Não há alterações para desfazer.";
      return;
    }

    tipoVitrineEditor = estadoAnterior.tipo;
    atualizarVistaEditorVitrine();
    substituirPosicoesEditor(estadoAnterior.posicoes);
    estadoEditorVitrine.textContent = "Última alteração desfeita.";
  }

  function restaurarArmaSelecionadaVitrine() {
    if (!armaSelecionadaEditorId) {
      estadoEditorVitrine.textContent = "Selecione um equipamento para restaurar.";
      return;
    }

    const armaId = armaSelecionadaEditorId;
    registrarHistoricoVitrine();

    obterPosicoesEditorAtuais()[armaId] = structuredClone(obterPosicoesOriginaisAtuais()[armaId]);

    preencherEditorVitrine();
    selecionarArmaEditor(editorVitrine.querySelector(`[data-arma-id="${armaId}"]`));
    estadoEditorVitrine.textContent = `${obterCatalogoVitrineAtual()[armaId].nome} restaurado.`;
  }

  function restaurarTodaVitrine() {
    registrarHistoricoVitrine();
    substituirPosicoesEditor(obterPosicoesOriginaisAtuais());
    estadoEditorVitrine.textContent = "Todas as posições foram restauradas.";
  }

  function salvarRascunhoVitrine() {
    localStorage.setItem(
      tipoVitrineEditor === "armaduras" ? chaveRascunhoArmadurasVitrine : chaveRascunhoVitrine,
      JSON.stringify(obterPosicoesEditorAtuais()),
    );

    estadoEditorVitrine.textContent = "Rascunho salvo neste navegador.";
  }

  function arredondarPosicaoVitrine(posicao) {
    return Object.fromEntries(
      Object.entries(posicao).map(([chave, valor]) => [chave, Number(Number(valor).toFixed(2))]),
    );
  }

  async function copiarConfiguracaoVitrine() {
    const armas = Object.fromEntries(
      Object.entries(posicoesArmasEditor).map(([armaId, posicao]) => [
        armaId,
        arredondarPosicaoVitrine(posicao),
      ]),
    );

    const armaduras = Object.fromEntries(
      Object.entries(posicoesArmadurasEditor).map(([id, posicao]) => [
        id,
        arredondarPosicaoVitrine(posicao),
      ]),
    );

    const texto =
      '"use strict";\n\n' +
      "window.ConfiguracaoVitrineEquipamentos = " +
      `${JSON.stringify(
        {
          paredesArmas: window.ConfiguracaoVitrineEquipamentos.paredesArmas,
          armas,
          armaduras,
        },
        null,
        2,
      )};\n`;

    try {
      await navigator.clipboard.writeText(texto);
      estadoEditorVitrine.textContent =
        "Configuração copiada. Cole-a em configuracao-vitrine-equipamentos.js.";
    } catch (erro) {
      console.error("Não foi possível copiar a configuração.", erro);
      estadoEditorVitrine.textContent = "O navegador não permitiu copiar a configuração.";
    }
  }

  function atualizarVistaEditorVitrine() {
    const mostrandoArmaduras = tipoVitrineEditor === "armaduras";

    editorVitrine.classList.toggle("mostrando-armaduras", mostrandoArmaduras);
    editorVitrine.classList.toggle("mostrando-armas-longas", tipoVitrineEditor === "armasLongas");
    botaoVitrineArmasCompactas.classList.toggle("ativo", tipoVitrineEditor === "armasCompactas");
    botaoVitrineArmasLongas.classList.toggle("ativo", tipoVitrineEditor === "armasLongas");
    botaoVitrineArmaduras.classList.toggle("ativo", mostrandoArmaduras);

    armaSelecionadaEditorId = null;
    nomeArmaSelecionadaVitrine.textContent = "Selecione um equipamento";
    controleTamanhoVitrine.disabled = true;
    controleRotacaoVitrine.disabled = true;
    valorTamanhoVitrine.textContent = "—";
    valorRotacaoVitrine.textContent = "—";
    for (const referencia of Object.values(controlesTransformacaoVitrine)) {
      referencia.controle.disabled = true;
      referencia.valor.textContent = "—";
    }
    preencherEditorVitrine();
  }

  botaoVitrineArmasCompactas.addEventListener("click", () => {
    tipoVitrineEditor = "armasCompactas";
    atualizarVistaEditorVitrine();
  });

  botaoVitrineArmasLongas.addEventListener("click", () => {
    tipoVitrineEditor = "armasLongas";
    atualizarVistaEditorVitrine();
  });

  botaoVitrineArmaduras.addEventListener("click", () => {
    tipoVitrineEditor = "armaduras";
    atualizarVistaEditorVitrine();
  });

  controleTamanhoVitrine.addEventListener("pointerdown", registrarHistoricoVitrine);

  controleRotacaoVitrine.addEventListener("pointerdown", registrarHistoricoVitrine);

  for (const [campo, referencia] of Object.entries(controlesTransformacaoVitrine)) {
    referencia.controle.addEventListener("pointerdown", registrarHistoricoVitrine);
    referencia.controle.addEventListener("input", () => {
      atualizarTransformacaoEquipamento(campo);
    });
  }

  botaoDesfazerVitrine.addEventListener("click", desfazerAlteracaoVitrine);

  botaoRestaurarArmaVitrine.addEventListener("click", restaurarArmaSelecionadaVitrine);

  botaoRestaurarTudoVitrine.addEventListener("click", restaurarTodaVitrine);

  botaoSalvarVitrine.addEventListener("click", salvarRascunhoVitrine);

  botaoGerarConfiguracaoVitrine.addEventListener("click", copiarConfiguracaoVitrine);

  controleRotuloXVitrine.addEventListener("pointerdown", registrarHistoricoVitrine);

  controleRotuloYVitrine.addEventListener("pointerdown", registrarHistoricoVitrine);

  controleRotuloXVitrine.addEventListener("input", () => {
    atualizarPosicaoRotulo("rotuloX");
  });

  controleRotuloYVitrine.addEventListener("input", () => {
    atualizarPosicaoRotulo("rotuloY");
  });

  controleTamanhoVitrine.addEventListener("input", atualizarTamanhoArmaEditor);

  controleRotacaoVitrine.addEventListener("input", atualizarRotacaoArmaEditor);

  seletorArma.addEventListener("change", atualizarPrevia);

  controleTamanho.addEventListener("input", atualizarDimensoesArma);

  botaoLancar.addEventListener("click", lancarArma);

  botaoFecharControlesVitrine.addEventListener("click", fecharControlesVitrine);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharControlesVitrine();
    }
  });

  botaoMontarTurno.addEventListener("click", montarCenarioTurno);

  botaoReiniciarTurno.addEventListener("click", montarCenarioTurno);

  botaoTestarDestinos.addEventListener("click", executarTestesDestinos);

  botaoTestarPush.addEventListener("click", executarTestesPush);

  botaoPrepararSap.addEventListener("click", prepararSapDev);

  botaoAtacarSap.addEventListener("click", executarAtaqueSapDev);

  botaoTestarSap.addEventListener("click", executarTesteCompletoSapDev);

  botaoTestarVex.addEventListener("click", executarTesteCompletoVexDev);

  botaoTestarSlow.addEventListener("click", executarTesteCompletoSlowDev);

  botaoTestarTopple.addEventListener("click", executarTesteCompletoToppleDev);

  botaoTestarCleave.addEventListener("click", executarTesteCompletoCleaveDev);

  botaoTestarGraze.addEventListener("click", executarTesteCompletoGrazeDev);

  botaoTestarNick.addEventListener("click", executarTesteCompletoNickDev);

  botaoTestarFormacaoGuerreiro.addEventListener("click", executarTesteFormacaoGuerreiroDev);

  botaoTestarClasseArmadura.addEventListener("click", executarTesteClasseArmaduraDev);

  botaoTestarEquipamentoInicial.addEventListener("click", executarTesteEquipamentoInicialDev);
  atualizarVistaEditorVitrine();
  atualizarPrevia();
})();
