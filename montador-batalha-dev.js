"use strict";

(function configurarMontadorBatalhaDev() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
    window.location.hostname,
  );

  if (!ambienteLocal) {
    return;
  }

  let camada = null;
  let seletorMapa = null;
  let imagemMapa = null;
  let identificadorMapa = null;
  let tabuleiroVisual = null;
  let tokenJogador = null;
  let mensagemRodape = null;
  let prateleiraInimigos = null;
  let campoNomeCenario = null;
  let seletorCenarioSalvo = null;
  let cenarioAtualId = null;
  let posicaoJogador = null;
  let arrasteAtual = null;
  let proximoIdInimigo = 1;
  let inimigosPosicionados = [];

  const COLUNAS_TABULEIRO = 48;
  const LINHAS_TABULEIRO = 27;
  const CHAVE_CENARIOS_SALVOS = "rpgSoloCenariosTesteBatalhaV1";

  function lerCenariosSalvos() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE_CENARIOS_SALVOS));
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      console.warn("Não foi possível ler os cenários de batalha salvos.", erro);
      return [];
    }
  }

  function salvarCenarioAtual() {
    const nome = campoNomeCenario?.value.trim();
    const mapa = obterMapaSelecionado();

    if (!nome) {
      atualizarMensagemRodape("Dê um nome ao cenário antes de salvá-lo.");
      campoNomeCenario?.focus();
      return;
    }

    if (!mapa) {
      atualizarMensagemRodape("Selecione um mapa antes de salvar o cenário.");
      return;
    }

    const agora = new Date().toISOString();
    const cenarios = lerCenariosSalvos();
    const indiceExistente = cenarios.findIndex(
      (cenario) => cenario.id === cenarioAtualId,
    );
    const cenario = {
      id: cenarioAtualId ?? `cenario-${Date.now()}`,
      nome,
      mapaCenaId: mapa.cenaId,
      posicaoJogador: structuredClone(posicaoJogador),
      inimigos: structuredClone(inimigosPosicionados),
      criadoEm:
        indiceExistente >= 0 ? cenarios[indiceExistente].criadoEm : agora,
      atualizadoEm: agora,
    };

    if (indiceExistente >= 0) {
      cenarios[indiceExistente] = cenario;
    } else {
      cenarios.push(cenario);
    }

    try {
      localStorage.setItem(CHAVE_CENARIOS_SALVOS, JSON.stringify(cenarios));
      cenarioAtualId = cenario.id;
      preencherSeletorCenariosSalvos(cenario.id);
      atualizarMensagemRodape(`Cenário “${nome}” salvo neste navegador.`);
    } catch (erro) {
      console.error("Não foi possível salvar o cenário de batalha.", erro);
      atualizarMensagemRodape("Não foi possível salvar o cenário neste navegador.");
    }
  }

  function preencherSeletorCenariosSalvos(valorSelecionado = null) {
    if (!seletorCenarioSalvo) {
      return;
    }

    const valorAnterior = valorSelecionado ?? seletorCenarioSalvo.value;
    seletorCenarioSalvo.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um cenário";
    seletorCenarioSalvo.append(opcaoInicial);

    for (const cenario of lerCenariosSalvos()) {
      const opcao = document.createElement("option");
      opcao.value = cenario.id;
      opcao.textContent = cenario.nome;
      seletorCenarioSalvo.append(opcao);
    }

    if (
      valorAnterior &&
      Array.from(seletorCenarioSalvo.options).some(
        (opcao) => opcao.value === valorAnterior,
      )
    ) {
      seletorCenarioSalvo.value = valorAnterior;
    }
  }

  function carregarCenarioSelecionado() {
    const cenario = lerCenariosSalvos().find(
      (item) => item.id === seletorCenarioSalvo?.value,
    );

    if (!cenario) {
      atualizarMensagemRodape("Selecione um cenário salvo para carregá-lo.");
      return;
    }

    const mapaExiste = Array.from(seletorMapa.options).some(
      (opcao) => opcao.value === cenario.mapaCenaId,
    );

    if (!mapaExiste) {
      atualizarMensagemRodape(
        `O mapa-base “${cenario.mapaCenaId}” não existe mais na aventura.`,
      );
      return;
    }

    seletorMapa.value = cenario.mapaCenaId;
    atualizarMapaExibido();

    cenarioAtualId = cenario.id;
    campoNomeCenario.value = cenario.nome;
    posicaoJogador = structuredClone(cenario.posicaoJogador);
    inimigosPosicionados = structuredClone(cenario.inimigos ?? []);
    proximoIdInimigo =
      inimigosPosicionados.reduce((maiorId, inimigo) => {
        const numero = Number(inimigo.instanciaId?.match(/(\d+)$/)?.[1]);
        return Number.isFinite(numero) ? Math.max(maiorId, numero) : maiorId;
      }, 0) + 1;

    atualizarTokenJogador();
    renderizarInimigosPosicionados();
    atualizarMensagemRodape(`Cenário “${cenario.nome}” carregado.`);
  }

  function excluirCenarioSelecionado() {
    const cenarios = lerCenariosSalvos();
    const cenario = cenarios.find(
      (item) => item.id === seletorCenarioSalvo?.value,
    );

    if (!cenario) {
      atualizarMensagemRodape("Selecione um cenário salvo para excluí-lo.");
      return;
    }

    if (!window.confirm(`Excluir o cenário de teste “${cenario.nome}”?`)) {
      return;
    }

    try {
      localStorage.setItem(
        CHAVE_CENARIOS_SALVOS,
        JSON.stringify(cenarios.filter((item) => item.id !== cenario.id)),
      );

      if (cenarioAtualId === cenario.id) {
        cenarioAtualId = null;
      }

      preencherSeletorCenariosSalvos();
      atualizarMensagemRodape(
        `Cenário “${cenario.nome}” excluído. A montagem visível foi preservada.`,
      );
    } catch (erro) {
      console.error("Não foi possível excluir o cenário de batalha.", erro);
      atualizarMensagemRodape("Não foi possível excluir o cenário salvo.");
    }
  }

  function iniciarBatalhaMontada() {
    const mapa = obterMapaSelecionado();

    if (!mapa) {
      atualizarMensagemRodape("Selecione um mapa antes de iniciar a batalha.");
      return;
    }

    if (!estadoAtualJogo.personagem?.dados) {
      atualizarMensagemRodape("Carregue um personagem antes de iniciar a batalha.");
      return;
    }

    if (!inimigosPosicionados.length) {
      atualizarMensagemRodape("Posicione ao menos um inimigo no mapa.");
      return;
    }

    const inimigosAgrupados = new Map();

    for (const inimigo of inimigosPosicionados) {
      const configuracaoBase = mapa.combate.inimigos?.find(
        (configuracao) => configuracao.npcId === inimigo.npcId,
      );
      const grupo = inimigosAgrupados.get(inimigo.npcId) ?? {
        npcId: inimigo.npcId,
        quantidade: 0,
        posicoes: [],
        grupoId: configuracaoBase?.grupoId ?? inimigo.npcId,
        inteligencia: structuredClone(
          configuracaoBase?.inteligencia ?? { perfil: "equilibrado" },
        ),
        movimentoMaximo: configuracaoBase?.movimentoMaximo ?? 6,
        representacao: structuredClone(configuracaoBase?.representacao ?? null),
      };

      grupo.quantidade += 1;
      grupo.posicoes.push(structuredClone(inimigo.posicao));
      inimigosAgrupados.set(inimigo.npcId, grupo);
    }

    const participanteJogador = criarParticipanteJogadorCombate({
      posicao: structuredClone(posicaoJogador),
      movimentoMaximo: mapa.combate.jogador?.movimentoMaximo ?? 6,
    });
    const participantesInimigos = criarParticipantesNpcsCombate(
      Array.from(inimigosAgrupados.values()),
    );

    if (!participanteJogador || !participantesInimigos.length) {
      atualizarMensagemRodape("Não foi possível criar os participantes da batalha.");
      return;
    }

    estadoAtualJogo.combateAtual = null;
    estadoAtualJogo.progresso.cenaId = mapa.cenaId;
    cenaAtual = mapa.cena;

    iniciarCombateDaAventura({
      id: `dev-visual-${mapa.cenaId}-${Date.now()}`,
      participantes: [participanteJogador, ...participantesInimigos],
      mapa: mapa.combate.mapa,
      introducao: {
        titulo: campoNomeCenario?.value.trim() || "Batalha de teste",
        descricao: `Cenário montado no mapa ${mapa.cenaId}.`,
      },
      objetivos: mapa.combate.objetivos,
      terreno: mapa.combate.terreno,
      visao: mapa.combate.visao,
      areas: mapa.combate.areas,
      marcadores: mapa.combate.marcadores,
    });

    introducaoCombateConfirmada = true;

    if (modalIntroducaoCombate.open) {
      modalIntroducaoCombate.close();
    }

    fechar();
    iniciarEtapaIniciativaCombate(estadoAtualJogo.combateAtual);
  }

  function listarMapasDisponiveis() {
    return Object.entries(aventuraAtual?.cenas ?? {})
      .filter(([, cena]) => Boolean(cena?.combate?.mapa))
      .map(([cenaId, cena]) => ({
        cenaId,
        cena,
        combate: cena.combate,
      }));
  }

  function obterMapaSelecionado() {
    return listarMapasDisponiveis().find(
      (mapa) => mapa.cenaId === seletorMapa?.value,
    ) ?? null;
  }

  function atualizarMapaExibido() {
    const mapa = obterMapaSelecionado();

    imagemMapa.src = mapa?.combate?.mapa ?? "";
    imagemMapa.alt = mapa
      ? `Mapa de teste: ${mapa.cenaId}`
      : "Nenhum mapa de batalha disponível";

    identificadorMapa.textContent = mapa
      ? `Mapa-base: ${mapa.cenaId}`
      : "Nenhum mapa de batalha disponível.";

    posicaoJogador = mapa?.combate?.jogador?.posicao
      ? structuredClone(mapa.combate.jogador.posicao)
      : { coluna: 1, linha: 1 };

    inimigosPosicionados = [];
    cenarioAtualId = null;

    atualizarTokenJogador();
    renderizarInimigosPosicionados();
    atualizarMensagemRodape();
  }

  function atualizarMensagemRodape(mensagem = null) {
    if (!mensagemRodape) {
      return;
    }

    mensagemRodape.textContent = mensagem ??
      `Jogador: coluna ${posicaoJogador?.coluna ?? "—"}, ` +
      `linha ${posicaoJogador?.linha ?? "—"}. ` +
      `Inimigos posicionados: ${inimigosPosicionados.length}.`;
  }

  function atualizarTokenJogador() {
    if (!tokenJogador || !posicaoJogador) {
      return;
    }

    tokenJogador.style.gridColumn = String(posicaoJogador.coluna);
    tokenJogador.style.gridRow = String(posicaoJogador.linha);
    tokenJogador.title =
      `Jogador — coluna ${posicaoJogador.coluna}, linha ${posicaoJogador.linha}`;
  }

  function criarTokenJogador() {
    const token = document.createElement("button");
    token.type = "button";
    token.className = "token-montador-batalha-dev token-jogador-montador-batalha-dev";
    token.draggable = true;
    token.setAttribute("aria-label", "Posição inicial do jogador");

    const avatar = estadoAtualJogo.personagem?.dados?.avatar;

    if (avatar?.imagem) {
      const imagem = document.createElement("img");
      imagem.src = avatar.imagem;
      imagem.alt = "";
      imagem.draggable = false;
      token.append(imagem);
    } else {
      token.textContent = "P";
    }

    token.addEventListener("dragstart", function iniciarArrasteJogador(evento) {
      arrasteAtual = { tipo: "jogador" };
      token.classList.add("token-em-arraste");
      evento.dataTransfer.effectAllowed = "move";
      evento.dataTransfer.setData("text/plain", "jogador");
    });

    token.addEventListener("dragend", function encerrarArrasteJogador() {
      arrasteAtual = null;
      token.classList.remove("token-em-arraste");
    });

    return token;
  }

  function obterAvatarNpc(npc) {
    return npc?.avatar ?? npc?.representacao ?? null;
  }

  function criarImagemToken(avatar) {
    if (!avatar?.imagem) {
      return null;
    }

    const imagem = document.createElement("img");
    imagem.src = avatar.imagem;
    imagem.alt = "";
    imagem.draggable = false;

    return imagem;
  }

  function criarTokenInimigo(inimigoPosicionado) {
    const npc = estadoAtualJogo.npcs?.[inimigoPosicionado.npcId];
    const token = document.createElement("button");
    token.type = "button";
    token.className = "token-montador-batalha-dev token-inimigo-montador-batalha-dev";
    token.dataset.instanciaInimigo = inimigoPosicionado.instanciaId;
    token.draggable = true;
    token.style.gridColumn = String(inimigoPosicionado.posicao.coluna);
    token.style.gridRow = String(inimigoPosicionado.posicao.linha);
    token.title =
      `${npc?.nome ?? inimigoPosicionado.npcId} — ` +
      `coluna ${inimigoPosicionado.posicao.coluna}, ` +
      `linha ${inimigoPosicionado.posicao.linha}. ` +
      "Arraste para mover; clique duas vezes para remover.";

    const imagem = criarImagemToken(obterAvatarNpc(npc));
    token.append(imagem ?? document.createTextNode("I"));

    token.addEventListener("dragstart", function iniciarArrasteInimigo(evento) {
      arrasteAtual = {
        tipo: "inimigo",
        instanciaId: inimigoPosicionado.instanciaId,
      };
      token.classList.add("token-em-arraste");
      evento.dataTransfer.effectAllowed = "move";
      evento.dataTransfer.setData("text/plain", inimigoPosicionado.instanciaId);
    });

    token.addEventListener("dragend", function encerrarArrasteInimigo() {
      arrasteAtual = null;
      token.classList.remove("token-em-arraste");
    });

    token.addEventListener("dblclick", function removerInimigo() {
      inimigosPosicionados = inimigosPosicionados.filter(
        (inimigo) => inimigo.instanciaId !== inimigoPosicionado.instanciaId,
      );
      renderizarInimigosPosicionados();
      atualizarMensagemRodape();
    });

    return token;
  }

  function renderizarInimigosPosicionados() {
    if (!tabuleiroVisual) {
      return;
    }

    for (const token of tabuleiroVisual.querySelectorAll("[data-instancia-inimigo]")) {
      token.remove();
    }

    for (const inimigo of inimigosPosicionados) {
      tabuleiroVisual.append(criarTokenInimigo(inimigo));
    }
  }

  function preencherPrateleiraInimigos() {
    if (!prateleiraInimigos) {
      return;
    }

    prateleiraInimigos.innerHTML = "";

    for (const [npcId, npc] of Object.entries(estadoAtualJogo.npcs ?? {})) {
      if (npc.tipo !== "inimigo") {
        continue;
      }

      const card = document.createElement("button");
      card.type = "button";
      card.className = "card-prateleira-inimigo-dev";
      card.draggable = true;
      card.title = "Arraste para o mapa para adicionar este inimigo.";

      const imagem = criarImagemToken(obterAvatarNpc(npc));
      const nome = document.createElement("span");
      nome.textContent = npc.nome;

      if (imagem) {
        card.append(imagem);
      }

      card.append(nome);

      card.addEventListener("dragstart", function iniciarNovoInimigo(evento) {
        arrasteAtual = { tipo: "novoInimigo", npcId };
        evento.dataTransfer.effectAllowed = "copy";
        evento.dataTransfer.setData("text/plain", npcId);
      });

      card.addEventListener("dragend", function encerrarNovoInimigo() {
        arrasteAtual = null;
      });

      prateleiraInimigos.append(card);
    }
  }

  function obterPosicaoSoltura(evento) {
    const area = tabuleiroVisual.getBoundingClientRect();
    const proporcaoX = (evento.clientX - area.left) / area.width;
    const proporcaoY = (evento.clientY - area.top) / area.height;

    return {
      coluna: Math.floor(proporcaoX * COLUNAS_TABULEIRO) + 1,
      linha: Math.floor(proporcaoY * LINHAS_TABULEIRO) + 1,
    };
  }

  function posicaoEstaDentroDoMapa(posicao) {
    return (
      posicao.coluna >= 1 &&
      posicao.coluna <= COLUNAS_TABULEIRO &&
      posicao.linha >= 1 &&
      posicao.linha <= LINHAS_TABULEIRO
    );
  }

  function posicaoEstaOcupada(posicao, instanciaIgnorada = null) {
    if (
      posicaoJogador?.coluna === posicao.coluna &&
      posicaoJogador?.linha === posicao.linha &&
      instanciaIgnorada !== "jogador"
    ) {
      return true;
    }

    return inimigosPosicionados.some(
      (inimigo) =>
        inimigo.instanciaId !== instanciaIgnorada &&
        inimigo.posicao.coluna === posicao.coluna &&
        inimigo.posicao.linha === posicao.linha,
    );
  }

  function validarPosicaoNoMapa(mapa, posicao, instanciaIgnorada = null) {
    if (!mapa || !posicaoEstaDentroDoMapa(posicao)) {
      return "Não é possível posicionar um token fora do mapa.";
    }

    if (posicaoEstaOcupada(posicao, instanciaIgnorada)) {
      return `A célula ${posicao.coluna}, ${posicao.linha} já está ocupada.`;
    }

    const tipoTerreno = SistemaCombate.obterTipoTerreno(
      { terreno: mapa.combate.terreno },
      posicao.coluna,
      posicao.linha,
    );

    if (tipoTerreno === "bloqueado") {
      return `A célula ${posicao.coluna}, ${posicao.linha} está bloqueada.`;
    }

    return null;
  }

  function soltarTokenNoMapa(evento) {
    if (!arrasteAtual) {
      return;
    }

    evento.preventDefault();

    const mapa = obterMapaSelecionado();
    const novaPosicao = obterPosicaoSoltura(evento);

    const instanciaIgnorada =
      arrasteAtual.tipo === "jogador"
        ? "jogador"
        : arrasteAtual.instanciaId;
    const erroPosicao = validarPosicaoNoMapa(
      mapa,
      novaPosicao,
      instanciaIgnorada,
    );

    if (erroPosicao) {
      atualizarMensagemRodape(erroPosicao);
      return;
    }

    if (arrasteAtual.tipo === "jogador") {
      posicaoJogador = novaPosicao;
      atualizarTokenJogador();
    } else if (arrasteAtual.tipo === "novoInimigo") {
      inimigosPosicionados.push({
        instanciaId: `inimigo-dev-${proximoIdInimigo++}`,
        npcId: arrasteAtual.npcId,
        posicao: novaPosicao,
      });
      renderizarInimigosPosicionados();
    } else if (arrasteAtual.tipo === "inimigo") {
      const inimigo = inimigosPosicionados.find(
        (item) => item.instanciaId === arrasteAtual.instanciaId,
      );

      if (inimigo) {
        inimigo.posicao = novaPosicao;
        renderizarInimigosPosicionados();
      }
    }

    atualizarMensagemRodape();
  }

  function preencherSeletorMapas() {
    const valorAnterior = seletorMapa.value;
    seletorMapa.innerHTML = "";

    for (const mapa of listarMapasDisponiveis()) {
      const opcao = document.createElement("option");
      opcao.value = mapa.cenaId;
      opcao.textContent = mapa.combate.introducao?.titulo
        ? `${mapa.combate.introducao.titulo} (${mapa.cenaId})`
        : mapa.cenaId;
      seletorMapa.append(opcao);
    }

    if (
      valorAnterior &&
      Array.from(seletorMapa.options).some(
        (opcao) => opcao.value === valorAnterior,
      )
    ) {
      seletorMapa.value = valorAnterior;
    }

    atualizarMapaExibido();
  }

  function fechar() {
    camada?.setAttribute("hidden", "");
  }

  function abrir() {
    if (!camada) {
      criarInterface();
    }

    preencherPrateleiraInimigos();
    preencherSeletorMapas();
    preencherSeletorCenariosSalvos();
    camada.removeAttribute("hidden");
  }

  function criarInterface() {
    camada = document.createElement("section");
    camada.id = "camadaMontadorBatalhaDev";
    camada.className = "camada-montador-batalha-dev";
    camada.setAttribute("hidden", "");

    const janela = document.createElement("div");
    janela.className = "janela-montador-batalha-dev";
    janela.setAttribute("role", "dialog");
    janela.setAttribute("aria-modal", "true");
    janela.setAttribute("aria-labelledby", "tituloMontadorBatalhaDev");

    const cabecalho = document.createElement("header");
    cabecalho.className = "cabecalho-montador-batalha-dev";

    const grupoTitulo = document.createElement("div");

    const rotulo = document.createElement("span");
    rotulo.className = "rotulo-montador-batalha-dev";
    rotulo.textContent = "FERRAMENTA DE DESENVOLVIMENTO";

    const titulo = document.createElement("h2");
    titulo.id = "tituloMontadorBatalhaDev";
    titulo.textContent = "Montar batalha";

    grupoTitulo.append(rotulo, titulo);

    const botaoFechar = document.createElement("button");
    botaoFechar.type = "button";
    botaoFechar.className = "botao-fechar-montador-batalha-dev";
    botaoFechar.textContent = "×";
    botaoFechar.setAttribute("aria-label", "Fechar montador de batalha");
    botaoFechar.addEventListener("click", fechar);

    cabecalho.append(grupoTitulo, botaoFechar);

    const barra = document.createElement("div");
    barra.className = "barra-montador-batalha-dev";

    const grupoMapa = document.createElement("label");
    grupoMapa.className = "campo-montador-batalha-dev";

    const textoMapa = document.createElement("span");
    textoMapa.textContent = "Mapa";

    seletorMapa = document.createElement("select");
    seletorMapa.id = "seletorMapaMontadorBatalhaDev";
    seletorMapa.addEventListener("change", atualizarMapaExibido);

    grupoMapa.append(textoMapa, seletorMapa);

    const grupoNome = document.createElement("label");
    grupoNome.className = "campo-montador-batalha-dev";

    const textoNome = document.createElement("span");
    textoNome.textContent = "Nome do cenário de teste";

    campoNomeCenario = document.createElement("input");
    campoNomeCenario.type = "text";
    campoNomeCenario.placeholder = "Ex.: Adaga contra guarda distante";
    campoNomeCenario.autocomplete = "off";
    grupoNome.append(textoNome, campoNomeCenario);

    const botaoSalvar = document.createElement("button");
    botaoSalvar.type = "button";
    botaoSalvar.className = "botao-acao-montador-batalha-dev";
    botaoSalvar.textContent = "Salvar cenário";
    botaoSalvar.addEventListener("click", salvarCenarioAtual);

    const grupoCenarioSalvo = document.createElement("label");
    grupoCenarioSalvo.className = "campo-montador-batalha-dev campo-cenario-salvo-dev";

    const textoCenarioSalvo = document.createElement("span");
    textoCenarioSalvo.textContent = "Cenários salvos";

    seletorCenarioSalvo = document.createElement("select");
    seletorCenarioSalvo.id = "seletorCenarioSalvoMontadorBatalhaDev";
    grupoCenarioSalvo.append(textoCenarioSalvo, seletorCenarioSalvo);

    const botaoCarregar = document.createElement("button");
    botaoCarregar.type = "button";
    botaoCarregar.className = "botao-acao-montador-batalha-dev";
    botaoCarregar.textContent = "Carregar";
    botaoCarregar.addEventListener("click", carregarCenarioSelecionado);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className =
      "botao-acao-montador-batalha-dev botao-excluir-cenario-dev";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", excluirCenarioSelecionado);

    const botaoIniciar = document.createElement("button");
    botaoIniciar.type = "button";
    botaoIniciar.className =
      "botao-acao-montador-batalha-dev botao-iniciar-batalha-dev";
    botaoIniciar.textContent = "Iniciar batalha";
    botaoIniciar.addEventListener("click", iniciarBatalhaMontada);

    barra.append(
      grupoMapa,
      grupoNome,
      botaoSalvar,
      grupoCenarioSalvo,
      botaoCarregar,
      botaoExcluir,
      botaoIniciar,
    );

    const corpo = document.createElement("div");
    corpo.className = "corpo-montador-batalha-dev";

    const lateral = document.createElement("aside");
    lateral.className = "prateleira-inimigos-dev";

    const tituloPrateleira = document.createElement("h3");
    tituloPrateleira.textContent = "Inimigos";

    const instrucaoPrateleira = document.createElement("p");
    instrucaoPrateleira.textContent = "Arraste um inimigo para o mapa.";

    prateleiraInimigos = document.createElement("div");
    prateleiraInimigos.className = "lista-prateleira-inimigos-dev";
    lateral.append(tituloPrateleira, instrucaoPrateleira, prateleiraInimigos);

    const areaMapa = document.createElement("div");
    areaMapa.className = "area-mapa-montador-batalha-dev";

    imagemMapa = document.createElement("img");
    imagemMapa.className = "imagem-mapa-montador-batalha-dev";

    tabuleiroVisual = document.createElement("div");
    tabuleiroVisual.className = "tabuleiro-montador-batalha-dev";
    tabuleiroVisual.addEventListener("dragover", function permitirSoltura(evento) {
      if (arrasteAtual) {
        evento.preventDefault();
        evento.dataTransfer.dropEffect =
          arrasteAtual.tipo === "novoInimigo" ? "copy" : "move";
      }
    });
    tabuleiroVisual.addEventListener("drop", soltarTokenNoMapa);

    tokenJogador = criarTokenJogador();
    tabuleiroVisual.append(tokenJogador);

    identificadorMapa = document.createElement("span");
    identificadorMapa.className = "identificador-mapa-montador-batalha-dev";

    areaMapa.append(imagemMapa, tabuleiroVisual, identificadorMapa);
    corpo.append(lateral, areaMapa);

    mensagemRodape = document.createElement("footer");
    mensagemRodape.className = "rodape-montador-batalha-dev";

    janela.append(cabecalho, barra, corpo, mensagemRodape);
    camada.append(janela);
    document.body.append(camada);
  }

  document.addEventListener("keydown", function fecharComEscape(evento) {
    if (evento.key === "Escape" && !camada?.hasAttribute("hidden")) {
      fechar();
    }
  });

  window.MontadorBatalhaDev = Object.freeze({
    abrir,
    fechar,
    obterMapaSelecionado,
  });
})();
