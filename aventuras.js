"use strict";

function buscarPersonagemSalvo(idPersonagem) {
  if (!idPersonagem) {
    return null;
  }

  try {
    const dadosSalvos = localStorage.getItem("personagensRpgSolo");

    if (!dadosSalvos) {
      return null;
    }

    const personagens = JSON.parse(dadosSalvos);

    if (!Array.isArray(personagens)) {
      return null;
    }

    const personagem = personagens.find(function (personagemSalvo) {
      return personagemSalvo.id === idPersonagem;
    });

    if (personagem === undefined) {
      return null;
    }

    return window.PersonagemDados.normalizar(personagem);
  } catch (erro) {
    console.error("Não foi possível carregar o personagem.", erro);

    return null;
  }
}

const parametrosAventura = new URLSearchParams(window.location.search);

const idAventuraSelecionada = parametrosAventura.get("aventura") ?? "aFuga";

const idPersonagemSelecionado = parametrosAventura.get("personagem");

const aventuraAtual = bancoAventuras[idAventuraSelecionada];

const conteudoPergaminho = document.querySelector(".conteudo-pergaminho-cena");

const botaoRolarCima = document.querySelector("#rolarPergaminhoCima");

const botaoRolarBaixo = document.querySelector("#rolarPergaminhoBaixo");

const seletorVelocidadeTexto = document.querySelector("#velocidadeTexto");

if (!aventuraAtual) {
  throw new Error(`Aventura não encontrada: ${idAventuraSelecionada}`);
}

const personagemSelecionado = buscarPersonagemSalvo(idPersonagemSelecionado);

const estadoAtualJogo = window.estadoJogo;

estadoAtualJogo.personagem.id = personagemSelecionado?.id ?? null;

estadoAtualJogo.personagem.dados = personagemSelecionado
  ? structuredClone(personagemSelecionado)
  : null;

function renderizarFichaDaAventura() {
  const areaFicha = document.getElementById("conteudoFicha");

  if (personagemSelecionado === null) {
    areaFicha.innerHTML = "<p>Nenhum personagem foi selecionado.</p>";
    return;
  }

  window.FichaPersonagem.renderizar(personagemSelecionado, areaFicha);
}

document.addEventListener("fichaPersonagemCarregada", renderizarFichaDaAventura, {
  once: true,
});

const idCenaInicial = aventuraAtual.cenaInicial;

estadoAtualJogo.aventuraId = aventuraAtual.id;
estadoAtualJogo.progresso.cenaId = idCenaInicial;
let cenaAtual = aventuraAtual.cenas[idCenaInicial];
let testePendente = null;
let caminhoAtual = null;
let etapaAtual = null;
let tokenArrastado = null;
let inicioArraste = null;
let escolhasAtuais = [];

const cameraCombate = {
  deslocamentoX: 0,

  deslocamentoY: 0,

  zoom: 1,

  zoomMinimo: 0.5,

  zoomMaximo: 1.6,
};

let arrasteCamera = null;

const tabuleiroCombate = document.querySelector("#tabuleiroCombate");
const painelTurnoCombate = document.querySelector("#painelTurnoCombate");
const painelComandosCombate = document.querySelector("#painelComandosCombate");

const numeroRodadaCombate = document.querySelector("#numeroRodadaCombate");

const filaIniciativaCombate = document.querySelector("#filaIniciativaCombate");

const movimentoRestanteCombate = document.querySelector("#movimentoRestanteCombate");
const acaoDisponivelCombate = document.querySelector("#acaoDisponivelCombate");
const acaoBonusDisponivelCombate = document.querySelector("#acaoBonusDisponivelCombate");

const listaAcoesTurno = document.querySelector("#listaAcoesTurno");

const listaAcoesBonusTurno = document.querySelector("#listaAcoesBonusTurno");

const painelAtaquesCombate = document.querySelector("#painelAtaquesCombate");

const botaoFecharAtaquesCombate = document.querySelector("#botaoFecharAtaquesCombate");

const mensagemAtaquesCombate = document.querySelector("#mensagemAtaquesCombate");

const listaAtaquesCombate = document.querySelector("#listaAtaquesCombate");

const painelHistoricoCombate = document.querySelector("#painelHistoricoCombate");

const listaHistoricoCombate = document.querySelector("#listaHistoricoCombate");

const botaoExpandirHistorico = document.querySelector("#botaoExpandirHistorico");

const botaoEncerrarTurno = document.querySelector("#botaoEncerrarTurno");
const acoesCombate = document.querySelector("#acoesCombate");

const tituloAventura = document.querySelector("#tituloAventura");
const contextoCena = document.querySelector("#contextoCena");
const listaEscolhas = document.querySelector("#listaEscolhas");
const tituloEscolhas = document.querySelector("#tituloEscolhas");

const painelFicha = document.querySelector("#painelFicha");
const painelExplicativo = document.querySelector("#painelExplicativo");

const botaoRecolherFicha = document.querySelector("#botaoRecolherFicha");
const botaoRecolherPainelExplicativo = document.querySelector("#botaoRecolherPainelExplicativo");

const layoutAventura = document.querySelector(".layout-aventura");
const visualizacaoAventura = document.querySelector("#visualizacaoAventura");

const visualizacaoCombate = document.querySelector("#visualizacaoCombate");

const solicitacaoTeste = document.querySelector("#solicitacaoTeste");
const solicitacaoCombate = document.querySelector("#solicitacaoCombate");

const areaEscolhas = document.querySelector(".area-escolhas");

const painelAcaoAtualCombate = document.querySelector("#painelAcaoAtualCombate");

const mensagemAcaoAtualCombate = document.querySelector("#mensagemAcaoAtualCombate");

carregarNpcsDaAventura(aventuraAtual.id);

function alternarFicha() {
  const recolhida = layoutAventura.classList.toggle("ficha-recolhida");

  botaoRecolherFicha.setAttribute("aria-expanded", String(!recolhida));
}

function alternarPainelExplicativo() {
  const recolhido = layoutAventura.classList.toggle("painelExplicativo-recolhido");

  botaoRecolherPainelExplicativo.setAttribute("aria-expanded", String(!recolhido));
}

function encaixarFerramentasDaAventura() {
  const janelaAcao = document.querySelector(".janela-acao");

  const janelaAnotacoes = document.querySelector(".janela-anotacoes");

  const janelaDados = document.querySelector(".janela-dados");

  if (!janelaAcao || !janelaAnotacoes || !janelaDados) {
    return;
  }

  const espacamento = 14;

  const posicaoAcao = janelaAcao.getBoundingClientRect();

  janelaAnotacoes.style.left = `${posicaoAcao.left}px`;

  janelaAnotacoes.style.top = `${posicaoAcao.bottom + espacamento}px`;

  janelaAnotacoes.style.right = "auto";
  janelaAnotacoes.style.bottom = "auto";

  janelaAnotacoes.style.width = `${posicaoAcao.width}px`;

  const posicaoAnotacoes = janelaAnotacoes.getBoundingClientRect();

  janelaDados.style.left = `${posicaoAcao.left}px`;

  janelaDados.style.top = `${posicaoAnotacoes.bottom + espacamento}px`;

  janelaDados.style.right = "auto";
  janelaDados.style.bottom = "auto";
}

function prepararRolagemTesteAventura(teste) {
  const personagem = estadoAtualJogo.personagem.dados;

  if (!personagem || !teste) {
    return null;
  }

  let modificador = 0;
  let descricao = "Teste";

  if (teste.tipo === "pericia") {
    modificador = SistemaTestes.calcularBonusPericia(personagem, teste.periciaId);

    const pericia = window.bancoPericias?.[teste.periciaId];

    descricao = pericia?.nome ? `Teste de ${pericia.nome}` : "Teste de perícia";
  }

  const tipoRolagem = teste.tipoRolagem ?? "normal";

  const quantidadeD20 = tipoRolagem === "vantagem" || tipoRolagem === "desvantagem" ? 2 : 1;

  return {
    gruposDeDados: [
      {
        quantidade: quantidadeD20,
        numeroDeFaces: 20,
      },
    ],

    modificador,
    descricao,
    quantidadeDeRolagens: 1,
    critico: false,
  };
}

function formatarModificadorTeste(modificador) {
  const valor = Number(modificador) || 0;

  if (valor > 0) {
    return `+ ${valor}`;
  }

  if (valor < 0) {
    return `- ${Math.abs(valor)}`;
  }

  return "+ 0";
}

function criarInstrucaoTesteAventura(teste, modificador, complemento = "") {
  if (!teste) {
    return "";
  }

  if (teste.tipo === "pericia") {
    const pericia = window.bancoPericias?.[teste.periciaId];

    const nomePericia = pericia?.nome ?? teste.periciaId;

    const modificadorFormatado = formatarModificadorTeste(modificador);

    return `Faça um teste de ${nomePericia} ` + `(1d20 ${modificadorFormatado}) ` + complemento;
  }

  return complemento;
}

async function animarMovimentoInimigo(participante, caminho) {
  if (!Array.isArray(caminho) || caminho.length === 0) {
    return;
  }

  const token = tabuleiroCombate.querySelector(`[data-id-participante="${participante.id}"]`);

  if (!token) {
    return;
  }

  for (const posicao of caminho) {
    const posicaoAnterior = token.getBoundingClientRect();

    token.style.gridColumn = posicao.coluna;

    token.style.gridRow = posicao.linha;

    const novaPosicao = token.getBoundingClientRect();

    const zoom = cameraCombate.zoom || 1;

    const deslocamentoX = (posicaoAnterior.left - novaPosicao.left) / zoom;

    const deslocamentoY = (posicaoAnterior.top - novaPosicao.top) / zoom;

    const animacao = token.animate(
      [
        {
          translate: `${deslocamentoX}px ` + `${deslocamentoY}px`,
        },

        {
          translate: "0 0",
        },
      ],
      {
        duration: 700,

        easing: "ease-in-out",

        fill: "both",
      },
    );

    try {
      await animacao.finished;
    } catch (erro) {
      console.warn("A animação do movimento foi interrompida.", erro);
    }

    animacao.cancel();

    await esperar(200);
  }
}

function esperar(milissegundos) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milissegundos);
  });
}

async function registrarResultadoTurnoInimigo(resultado, participante) {
  const resultadoMovimento = resultado.resultadoMovimento;

  if (resultadoMovimento?.celulasPercorridas > 0) {
    exibirAcaoAtualCombate(`${participante.nome} está se movimentando.`);

    adicionarEventoHistoricoCombate(
      `${participante.nome} se movimentou`,
      `${participante.nome} avançou pelo campo de batalha.`,
    );

    await animarMovimentoInimigo(participante, resultadoMovimento.caminho);

    atualizarInterfaceTurno(estadoAtualJogo.combateAtual);

    await esperar(900);
  }

  if (!resultado.sucesso) {
    exibirAcaoAtualCombate(`${participante.nome} encerrou sua movimentação.`);

    await esperar(1200);

    return;
  }

  exibirAcaoAtualCombate(`${participante.nome} está atacando ` + `${resultado.alvo.nome}.`);

  await esperar(1000);

  if (!resultado.resultadoAtaque.acertou) {
    exibirAcaoAtualCombate(`${participante.nome} errou o ataque.`);

    adicionarEventoHistoricoCombate(
      `${participante.nome} errou o ataque`,
      `${participante.nome} tentou atingir ` +
        `${resultado.alvo.nome} com ` +
        `${resultado.ataque.nome}, mas errou.`,
    );

    await esperar(1400);

    return;
  }

  exibirAcaoAtualCombate(`${participante.nome} acertou o ataque.`);

  if (resultado.alvo.tipo === "jogador") {
    adicionarEventoHistoricoCombate(
      `${participante.nome} acertou o ataque`,
      `Você sofreu ` +
        `${resultado.resultadoDano.dano} de dano. ` +
        `Seus pontos de vida restantes são ` +
        `${resultado.resultadoDano.pontosDeVidaRestantes}.`,
    );
  } else {
    adicionarEventoHistoricoCombate(
      `${participante.nome} acertou o ataque`,
      `${participante.nome} atingiu ` + `${resultado.alvo.nome} com ` + `${resultado.ataque.nome}.`,
    );
  }

  await esperar(1400);
}

const observadorSolicitacaoCombate = new MutationObserver(verificarNovaSolicitacaoCombate);

observadorSolicitacaoCombate.observe(solicitacaoCombate, {
  attributes: true,

  attributeFilter: ["hidden"],

  childList: true,

  characterData: true,

  subtree: true,
});

function selecionarTokenJogador(evento) {
  const token = evento.target.closest(".token-combate");

  if (!token) {
    return;
  }

  const combate = estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const participante = combate.participantes.find(
    (participante) => participante.id === token.dataset.idParticipante,
  );

  if (!participante || participante.tipo !== "jogador") {
    return;
  }

  combate.participanteSelecionadoId = participante.id;

  const tokens = tabuleiroCombate.querySelectorAll(".token-combate");

  for (const tokenAtual of tokens) {
    tokenAtual.classList.remove("token-selecionado");
  }

  token.classList.add("token-selecionado");
}

function selecionarAlvoCombate(evento) {
  const token = evento.target.closest(".token-combate");

  if (!token) {
    return;
  }

  const combate = estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const participanteAtivo = combate.participantes.find(
    (participante) => participante.id === combate.participanteAtivoId,
  );

  if (!participanteAtivo || participanteAtivo.tipo !== "jogador") {
    return;
  }

  const alvo = combate.participantes.find(
    (participante) => participante.id === token.dataset.idParticipante,
  );

  if (!alvo || alvo.tipo !== "inimigo") {
    return;
  }

  combate.alvoSelecionadoId = alvo.id;

  atualizarInterfaceTurno(combate);
}

function selecionarAtaqueCombate(evento) {
  const botao = evento.target.closest(".botao-ataque-combate");

  if (!botao || botao.disabled) {
    return;
  }

  const combate = estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  if (!combate.alvoSelecionadoId) {
    exibirMensagemNarrativa(solicitacaoCombate, mensagensNarrativas.ataque.selecionarAlvo);

    solicitacaoCombate.hidden = false;

    return;
  }

  const resultado = SistemaCombate.prepararAtaque(
    combate,
    combate.participanteAtivoId,
    combate.alvoSelecionadoId,
    botao.dataset.idAtaque,
  );

  if (!resultado.sucesso) {
    console.warn("Ataque recusado:", resultado.motivo);

    atualizarInterfaceTurno(combate);

    return;
  }

  let quantidadeD20 = 1;

  if (resultado.tipoRolagem === "vantagem" || resultado.tipoRolagem === "desvantagem") {
    quantidadeD20 = 2;
  }

  let mensagemAtaque;

  if (resultado.tipoRolagem === "vantagem") {
    mensagemAtaque = mensagensNarrativas.ataque.pedirVantagem(
      resultado.ataque.bonusAtaque,
      resultado.alvo.nome,
    );
  } else if (resultado.tipoRolagem === "desvantagem") {
    mensagemAtaque = mensagensNarrativas.ataque.pedirDesvantagem(
      resultado.ataque.bonusAtaque,
      resultado.alvo.nome,
    );
  } else {
    mensagemAtaque = mensagensNarrativas.ataque.pedirNormal(
      resultado.ataque.bonusAtaque,
      resultado.alvo.nome,
    );
  }

  exibirMensagemNarrativa(solicitacaoCombate, mensagemAtaque);

  solicitarRolagemNaCaixa(
    [
      {
        quantidade: quantidadeD20,
        numeroDeFaces: 20,
      },
    ],
    resultado.ataque.bonusAtaque,
    "Rolagem de ataque",
    1,
    false,
  );

  solicitacaoCombate.hidden = false;

  fecharPainelAtaquesCombate();
}

function criarParticipanteJogadorCombate(configuracao) {
  const personagem = estadoAtualJogo.personagem.dados;

  if (!personagem) {
    console.warn("Nenhum personagem foi selecionado para o combate.");

    return null;
  }

  const entidadeJogador = structuredClone(personagem);

  entidadeJogador.nome = personagem.detalhes?.nome ?? "Jogador";

  entidadeJogador.ataques = structuredClone(personagem.combate?.ataques ?? []);

  const configuracaoParticipante = {
    id: personagem.id ?? "jogador",

    tipo: "jogador",

    posicao: configuracao.posicao,

    movimentoMaximo: configuracao.movimentoMaximo ?? 6,
  };

  return SistemaCombate.criarParticipanteCombate(entidadeJogador, configuracaoParticipante);
}

function criarParticipantesNpcsCombate(configuracoes) {
  const participantes = [];

  for (const configuracao of configuracoes) {
    const npc = estadoAtualJogo.npcs[configuracao.npcId];

    if (!npc) {
      console.warn("NPC não encontrado:", configuracao.npcId);

      continue;
    }

    const quantidade = configuracao.quantidade ?? 1;

    for (let indice = 0; indice < quantidade; indice += 1) {
      const posicao = configuracao.posicoes?.[indice];

      if (!posicao) {
        console.warn("Posição não encontrada para:", configuracao.npcId, indice);

        continue;
      }

      const configuracaoParticipante = {
        id: `${configuracao.npcId}-${indice + 1}`,

        nome: quantidade > 1 ? `${npc.nome} ${indice + 1}` : npc.nome,

        tipo: npc.tipo,

        posicao: posicao,

        movimentoMaximo: configuracao.movimentoMaximo ?? 6,

        representacao: configuracao.representacao ?? null,
      };

      const participante = SistemaCombate.criarParticipanteCombate(npc, configuracaoParticipante);

      participantes.push(participante);
    }
  }

  return participantes;
}

function iniciarCombateDaAventura(configuracao) {
  const configuracaoCombate = structuredClone(configuracao);

  const participanteJogador = configuracaoCombate.participantes.find(
    (participante) => participante.tipo === "jogador",
  );

  if (participanteJogador) {
    participanteJogador.representacao = structuredClone(
      estadoAtualJogo.personagem.dados?.avatar ?? null,
    );
  }

  const combate = SistemaCombate.iniciarCombate(configuracaoCombate);

  const jogador = combate.participantes.find((participante) => participante.tipo === "jogador");

  combate.iniciativaPendenteId = jogador ? jogador.id : null;

  SistemaCombate.rolarIniciativasInimigos(combate);

  if (jogador) {
    exibirMensagemNarrativa(
      solicitacaoCombate,
      mensagensNarrativas.iniciativa.pedir(jogador.bonusIniciativa),
    );

    solicitarRolagemNaCaixa(
      [
        {
          quantidade: 1,
          numeroDeFaces: 20,
        },
      ],
      jogador.bonusIniciativa,
      "Rolagem de iniciativa",
    );

    solicitacaoCombate.hidden = false;
  }

  renderizarTabuleiroCombate(combate);

  exibirTelaCombate();

  console.log("Combate iniciado:", combate);
}

function moverParticipante(participante, coluna, linha) {
  const resultadoMovimento = SistemaCombate.movimentarParticipante(
    estadoAtualJogo.combateAtual,
    participante.id,
    coluna,
    linha,
  );

  if (!resultadoMovimento.sucesso) {
    console.warn("Movimento recusado:", resultadoMovimento.motivo);

    return false;
  }

  if (participante.tipo === "jogador") {
    adicionarEventoHistoricoCombate(
      `${participante.nome} se movimentou`,
      "Você mudou de posição no campo de batalha.",
    );

    exibirAcaoAtualCombate("Você se movimentou.");
  }

  const token = tabuleiroCombate.querySelector(`[data-id-participante="${participante.id}"]`);

  if (!token) {
    return;
  }

  token.style.gridColumn = coluna;

  token.style.gridRow = linha;

  atualizarInterfaceTurno(estadoAtualJogo.combateAtual);

  return true;
}

function iniciarArrasteToken(evento) {
  const token = evento.target.closest(".token-combate");

  if (!token) {
    return;
  }

  const combate = estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const participante = combate.participantes.find(
    (participante) => participante.id === token.dataset.idParticipante,
  );

  if (!participante || participante.tipo !== "jogador") {
    return;
  }

  selecionarTokenJogador(evento);

  tokenArrastado = token;

  inicioArraste = {
    x: evento.clientX,
    y: evento.clientY,
    ponteiroId: evento.pointerId,
  };

  tokenArrastado.classList.add("token-arrastando");

  tokenArrastado.setPointerCapture(evento.pointerId);

  evento.preventDefault();
}

function continuarArrasteToken(evento) {
  if (!tokenArrastado || evento.pointerId !== inicioArraste.ponteiroId) {
    return;
  }

  const deslocamentoX = evento.clientX - inicioArraste.x;

  const deslocamentoY = evento.clientY - inicioArraste.y;

  tokenArrastado.style.transform = `translate(
      ${deslocamentoX}px,
      ${deslocamentoY}px
    )`;
}

function finalizarArrasteToken(evento) {
  if (!tokenArrastado || evento.pointerId !== inicioArraste.ponteiroId) {
    return;
  }

  tokenArrastado.style.pointerEvents = "none";

  const elementoDestino = document.elementFromPoint(evento.clientX, evento.clientY);

  tokenArrastado.style.pointerEvents = "";

  const celula = elementoDestino ? elementoDestino.closest(".celula-combate") : null;

  const combate = estadoAtualJogo.combateAtual;

  const participante = combate.participantes.find(
    (participante) => participante.id === tokenArrastado.dataset.idParticipante,
  );

  if (celula && participante) {
    const coluna = Number(celula.dataset.coluna);

    const linha = Number(celula.dataset.linha);

    moverParticipante(participante, coluna, linha);
  }

  tokenArrastado.style.transform = "";

  tokenArrastado.classList.remove("token-arrastando");

  tokenArrastado.releasePointerCapture(evento.pointerId);

  tokenArrastado = null;

  inicioArraste = null;
}

function moverTokenSelecionado(evento) {
  const celula = evento.target.closest(".celula-combate");

  if (!celula) {
    return;
  }

  const combate = estadoAtualJogo.combateAtual;

  if (!combate || !combate.participanteSelecionadoId) {
    return;
  }

  const participante = combate.participantes.find(
    (participante) => participante.id === combate.participanteSelecionadoId,
  );

  if (!participante) {
    return;
  }

  const coluna = Number(celula.dataset.coluna);

  const linha = Number(celula.dataset.linha);

  moverParticipante(participante, coluna, linha);
}

function exibirEscolhas(escolhas) {
  escolhasAtuais = escolhas;

  const possuiEscolhas = escolhas.length > 0;

  areaEscolhas.hidden = !possuiEscolhas;

  tituloEscolhas.hidden = !possuiEscolhas;

  listaEscolhas.hidden = !possuiEscolhas;

  listaEscolhas.innerHTML = "";

  for (const escolha of escolhas) {
    const botaoEscolha = document.createElement("button");

    botaoEscolha.type = "button";

    botaoEscolha.classList.add("botao-escolha");

    botaoEscolha.dataset.idEscolha = escolha.id;

    botaoEscolha.textContent = escolha.texto;

    listaEscolhas.append(botaoEscolha);
  }
}

async function exibirContexto(contexto) {
  if (contexto === undefined || contexto === null) {
    return;
  }

  await NarradorAventura.adicionarNarracao(contexto);
}

async function exibirCena(aventura, cena) {
  tituloAventura.textContent = aventura.titulo;

  await exibirContexto(cena.contexto);

  verificarCombateDaCena(cena);

  solicitacaoTeste.textContent = "";

  solicitacaoTeste.hidden = true;

  const escolhasDisponiveis = obterEscolhasDisponiveis(
    estadoAtualJogo.progresso.cenaId,
    cena.escolhas,
  );

  exibirEscolhas(escolhasDisponiveis);
}

function ocultarEscolhas() {
  areaEscolhas.hidden = true;
}

function iniciarCaminho(escolha) {
  caminhoAtual = escolha;

  estadoAtualJogo.progresso.caminhoId = escolha.id;

  iniciarEtapa(escolha.etapaInicial);
}

function obterAvisoTipoRolagem(teste) {
  if (teste.tipoRolagem === "vantagem") {
    return " Role 2d20 e use o maior resultado.";
  }

  if (teste.tipoRolagem === "desvantagem") {
    return " Role 2d20 e use o menor resultado.";
  }

  return "";
}

function iniciarEtapa(idEtapa) {
  const etapa = caminhoAtual.etapas[idEtapa];

  if (!etapa) {
    console.warn("Etapa não encontrada:", idEtapa);

    return;
  }

  etapaAtual = etapa;

  estadoAtualJogo.progresso.etapaId = idEtapa;

  exibirContexto(etapa.descricao);

  testePendente = etapa.teste;

  estadoAtualJogo.testePendente = etapa.teste;

  const configuracaoRolagem = prepararRolagemTesteAventura(etapa.teste);

  if (configuracaoRolagem) {
    solicitarRolagemNaCaixa(
      configuracaoRolagem.gruposDeDados,
      configuracaoRolagem.modificador,
      configuracaoRolagem.descricao,
      configuracaoRolagem.quantidadeDeRolagens,
      configuracaoRolagem.critico,
    );

    if (configuracaoRolagem) {
      solicitacaoTeste.textContent = criarInstrucaoTesteAventura(
        etapa.teste,
        configuracaoRolagem.modificador,
        etapa.instrucao,
      );

      solicitacaoTeste.hidden = false;

      solicitarRolagemNaCaixa(
        configuracaoRolagem.gruposDeDados,
        configuracaoRolagem.modificador,
        configuracaoRolagem.descricao,
        configuracaoRolagem.quantidadeDeRolagens,
        configuracaoRolagem.critico,
      );
    }
  }

  ocultarEscolhas();

  const avisoTipoRolagem = obterAvisoTipoRolagem(etapa.teste);

  solicitacaoTeste.hidden = false;

  console.log("Etapa atual:", etapaAtual);
}

function resolverTeste(resultadoRolagem) {
  const testeResolvido = testePendente;

  const resultadoTeste = SistemaTestes.resolverTesteContraCd(
    resultadoRolagem,
    testeResolvido.dificuldade,
    testeResolvido.tipoRolagem || "normal",
  );

  const testeFoiBemSucedido = resultadoTeste.sucesso;

  const tipoResultado = testeFoiBemSucedido ? "sucesso" : "fracasso";

  const consequencia = etapaAtual.resultados[tipoResultado];

  testePendente = null;

  estadoAtualJogo.testePendente = null;

  solicitacaoTeste.textContent = "";

  solicitacaoTeste.hidden = true;

  exibirContexto(consequencia.texto);

  console.log("Consequência:", consequencia);

  if (consequencia.escolhas) {
    exibirEscolhas(consequencia.escolhas);
    return;
  }

  if (consequencia.voltarParaEscolhas) {
    if (consequencia.removerEscolha && caminhoAtual) {
      registrarEscolhaRemovida(estadoAtualJogo.progresso.cenaId, caminhoAtual.id);
    }
    const escolhasDisponiveis = obterEscolhasDisponiveis(
      estadoAtualJogo.progresso.cenaId,
      cenaAtual.escolhas,
    );
    caminhoAtual = null;

    etapaAtual = null;

    estadoAtualJogo.progresso.caminhoId = null;
    estadoAtualJogo.progresso.etapaId = null;

    exibirEscolhas(escolhasDisponiveis);

    return;
  }

  if (consequencia.proximaEtapa) {
    exibirEscolhas([
      {
        id: "continuarEtapa",

        texto: "Continuar.",

        proximaEtapa: consequencia.proximaEtapa,
      },
    ]);

    return;
  }

  if (consequencia.proximaCena) {
    exibirEscolhas([
      {
        id: "continuarCena",

        texto: "Continuar.",

        proximaCena: consequencia.proximaCena,
      },
    ]);

    return;
  }

  console.warn("A consequência não possui um destino:", consequencia);
}

function resolverIniciativaJogador(resultadoRolagem) {
  const combate = estadoAtualJogo.combateAtual;

  if (!combate || !combate.iniciativaPendenteId) {
    return;
  }

  SistemaCombate.registrarIniciativa(combate, combate.iniciativaPendenteId, resultadoRolagem.total);

  combate.iniciativaPendenteId = null;

  const ordemTurnos = SistemaCombate.ordenarTurnos(combate);

  processarTurnoAtual(combate);

  solicitacaoCombate.textContent = "";

  solicitacaoCombate.hidden = true;

  console.log("Ordem dos turnos:", ordemTurnos);

  console.log("Participante ativo:", combate.participanteAtivoId);
}

function formatarRolagemDano(ataque) {
  const partes = [];

  for (const grupo of ataque.dano.gruposDeDados) {
    partes.push(`${grupo.quantidade}d${grupo.numeroDeFaces}`);
  }

  const modificador = Number(ataque.dano.modificador) || 0;

  if (modificador > 0) {
    partes.push(`+ ${modificador}`);
  }

  if (modificador < 0) {
    partes.push(`- ${Math.abs(modificador)}`);
  }

  return partes.join(" ");
}

function oferecerEfeitoDano(combate, textoDano, ataque, critico) {
  const danoPendente = combate.danoPendente;

  const operacao = danoPendente?.efeitos?.find((efeito) => efeito.tipo === "rolarNovamente");

  if (!operacao) {
    return false;
  }

  const atacante = combate.participantes.find(
    (participante) => participante.id === danoPendente.atacanteId,
  );

  if (!atacante) {
    return false;
  }

  const origem = operacao.origem;

  if (!origem) {
    return false;
  }

  let fonte = null;

  if (origem.tipo === "talento") {
    fonte = window.bancoTalentos?.[origem.id] ?? null;
  }

  if (origem.tipo === "habilidade") {
    fonte = window.bancoHabilidades?.classFeatures?.[origem.id] ?? null;
  }

  if (origem.tipo === "maestria") {
    fonte = window.bancoMaestrias?.[origem.id] ?? null;
  }

  if (!fonte) {
    return false;
  }

  acoesCombate.innerHTML = "";

  const botaoUsar = document.createElement("button");

  botaoUsar.type = "button";

  botaoUsar.textContent = `Usar ${fonte.nome}`;

  const botaoIgnorar = document.createElement("button");

  botaoIgnorar.type = "button";

  botaoIgnorar.textContent = "Rolar dano normal";

  botaoUsar.addEventListener("click", function () {
    const resultado = ativarEfeitoPendente(atacante, danoPendente, origem.id);

    if (!resultado.sucesso) {
      console.warn("Não foi possível ativar o efeito:", resultado.motivo);

      return;
    }

    acoesCombate.innerHTML = "";

    const gruposDuasRolagens = obterGruposDanoParaRolagem(ataque, critico, 2);

    solicitarRolagemNaCaixa(
      gruposDuasRolagens,
      ataque.dano.modificador,
      "Duas rolagens de dano do Atacante Selvagem",
      2,
      critico,
    );

    const dadosDaArma = ataque.dano.gruposDeDados
      .map(function (grupo) {
        return `${grupo.quantidade}` + `d${grupo.numeroDeFaces}`;
      })
      .join(" + ");

    exibirMensagemNarrativa(
      solicitacaoCombate,
      critico
        ? mensagensNarrativas.efeitos.atacanteSelvagemCritico(dadosDaArma, ataque.dano.modificador)
        : mensagensNarrativas.efeitos.atacanteSelvagemNormal(dadosDaArma, ataque.dano.modificador),
    );

    solicitacaoCombate.hidden = false;
  });

  botaoIgnorar.addEventListener("click", function () {
    acoesCombate.innerHTML = "";

    solicitacaoCombate.textContent = `Role ${textoDano} de dano.`;

    solicitacaoCombate.hidden = false;

    solicitarRolagemNaCaixa(
      obterGruposDanoParaRolagem(ataque, critico),

      ataque.dano.modificador,

      "Rolagem de dano",

      1,

      critico,
    );
  });

  acoesCombate.append(botaoUsar, botaoIgnorar);

  exibirMensagemNarrativa(solicitacaoCombate, mensagensNarrativas.efeitos.disponivel(fonte.nome));

  solicitacaoCombate.hidden = false;

  return true;
}

function obterGruposDanoParaRolagem(ataque, critico, multiplicador = 1) {
  return ataque.dano.gruposDeDados.map(function prepararGrupo(grupo) {
    return {
      quantidade: grupo.quantidade * multiplicador,

      numeroDeFaces: grupo.numeroDeFaces,
    };
  });
}

function resolverAtaqueJogador(resultadoRolagem) {
  const combate = estadoAtualJogo.combateAtual;

  const resultadoAtaque = SistemaCombate.resolverAtaque(combate, resultadoRolagem);

  if (!resultadoAtaque.sucesso) {
    console.warn("Não foi possível resolver o ataque:", resultadoAtaque.motivo);

    return;
  }

  atualizarInterfaceTurno(combate);

  if (!resultadoAtaque.acertou) {
    adicionarEventoHistoricoCombate(
      `${resultadoAtaque.atacante.nome} errou o ataque`,
      `Você tentou atingir ` +
        `${resultadoAtaque.alvo.nome} com ` +
        `${resultadoAtaque.ataque.nome}, mas errou.`,
    );

    exibirAcaoAtualCombate("Você errou o ataque.");

    solicitacaoCombate.textContent = "O ataque errou.";

    solicitacaoCombate.hidden = false;

    return;
  }

  adicionarEventoHistoricoCombate(
    resultadoAtaque.acertoCritico
      ? `${resultadoAtaque.atacante.nome} conseguiu um acerto crítico`
      : `${resultadoAtaque.atacante.nome} acertou o ataque`,

    `Você atingiu ` + `${resultadoAtaque.alvo.nome} com ` + `${resultadoAtaque.ataque.nome}.`,
  );

  exibirAcaoAtualCombate(
    resultadoAtaque.acertoCritico ? "Você conseguiu um acerto crítico." : "Você acertou o ataque.",
  );

  const textoDano = formatarRolagemDano(resultadoAtaque.ataque);

  const gruposDano = obterGruposDanoParaRolagem(
    resultadoAtaque.ataque,
    resultadoAtaque.acertoCritico,
  );

  const efeitoFoiOferecido = oferecerEfeitoDano(
    combate,
    textoDano,
    resultadoAtaque.ataque,
    resultadoAtaque.acertoCritico,
  );

  if (efeitoFoiOferecido) {
    return;
  }

  solicitarRolagemNaCaixa(
    gruposDano,
    resultadoAtaque.ataque.dano.modificador,
    "Rolagem de dano",
    1,
    resultadoAtaque.acertoCritico,
  );

  exibirMensagemNarrativa(
    solicitacaoCombate,
    resultadoAtaque.acertoCritico
      ? mensagensNarrativas.dano.acertoCritico()
      : mensagensNarrativas.dano.acertoNormal(textoDano),
  );

  solicitacaoCombate.hidden = false;
}

function aplicarCriticoNaRolagem(resultadoRolagem, critico) {
  if (!critico) {
    return resultadoRolagem;
  }

  const subtotal = Number(resultadoRolagem.subtotal) || 0;

  const modificador = Number(resultadoRolagem.modificador) || 0;

  const subtotalCritico = subtotal * 2;

  return {
    ...resultadoRolagem,

    subtotalOriginal: subtotal,

    subtotal: subtotalCritico,

    modificador: modificador,

    total: subtotalCritico + modificador,

    critico: true,
  };
}

function concluirDanoJogador(combate, resultadoRolagem) {
  const critico = Boolean(combate.danoPendente?.critico);

  const resultadoFinal = aplicarCriticoNaRolagem(resultadoRolagem, critico);

  const resultadoDano = SistemaCombate.resolverDano(combate, resultadoFinal);

  if (!resultadoDano.sucesso) {
    console.warn("Não foi possível resolver o dano:", resultadoDano.motivo);

    return;
  }

  adicionarEventoHistoricoCombate(
    resultadoDano.foiDerrotado
      ? `${resultadoDano.alvo.nome} foi derrotado`
      : `${resultadoDano.alvo.nome} sofreu dano`,

    resultadoDano.foiDerrotado
      ? `Seu ataque derrotou ${resultadoDano.alvo.nome}.`
      : `Seu ataque causou ${resultadoDano.dano} de dano.`,
  );

  exibirAcaoAtualCombate(
    resultadoDano.foiDerrotado
      ? `Você derrotou ${resultadoDano.alvo.nome}.`
      : `Você causou ${resultadoDano.dano} de dano.`,
  );

  solicitacaoCombate.hidden = false;

  atualizarInterfaceTurno(combate);

  if (resultadoDano.resultadoCombate) {
    notificarFimCombate(combate);
  }

  if (resultadoDano.resultadoCombate === "vitoria") {
    solicitacaoCombate.textContent = "O inimigo foi derrotado. Vitória!";
  } else if (resultadoDano.resultadoCombate === "derrota") {
    solicitacaoCombate.textContent = "O personagem foi derrotado.";
  } else if (resultadoDano.foiDerrotado) {
    solicitacaoCombate.textContent = `${resultadoDano.alvo.nome} foi derrotado.`;
  } else {
    solicitacaoCombate.textContent =
      `${resultadoDano.alvo.nome} sofreu ` + `${resultadoDano.dano} de dano.`;
  }

  const vexAplicado = resultadoDano.efeitosAplicados?.find(function encontrarVex(efeito) {
    return efeito.origem?.tipo === "maestria" && efeito.origem?.id === "vex";
  });

  if (vexAplicado && !resultadoDano.foiDerrotado) {
    setTimeout(
      function exibirMensagemVex() {
        exibirMensagemNarrativa(
          solicitacaoCombate,

          mensagensNarrativas.efeitos.vexAplicado(resultadoDano.alvo.nome),
        );

        solicitacaoCombate.hidden = false;
      },

      0,
    );
  }
}

function separarRolagensSimultaneasEfeito(resultadoRolagem, quantidadeDeRolagens) {
  if (
    !resultadoRolagem ||
    !Array.isArray(resultadoRolagem.gruposRolados) ||
    quantidadeDeRolagens <= 1
  ) {
    return [resultadoRolagem];
  }

  const gruposPodemSerDivididos = resultadoRolagem.gruposRolados.every(
    function verificarGrupo(grupo) {
      return (
        Array.isArray(grupo.resultados) && grupo.resultados.length % quantidadeDeRolagens === 0
      );
    },
  );

  if (!gruposPodemSerDivididos) {
    return [resultadoRolagem];
  }

  const rolagensSeparadas = [];

  for (let indiceRolagem = 0; indiceRolagem < quantidadeDeRolagens; indiceRolagem += 1) {
    const gruposRolados = resultadoRolagem.gruposRolados.map(function separarGrupo(grupo) {
      const quantidadePorRolagem = grupo.resultados.length / quantidadeDeRolagens;

      const inicio = indiceRolagem * quantidadePorRolagem;

      const fim = inicio + quantidadePorRolagem;

      const resultados = grupo.resultados.slice(inicio, fim);

      return {
        quantidade: resultados.length,
        numeroDeFaces: grupo.numeroDeFaces,
        resultados: resultados,
        total: resultados.reduce(function somarResultado(total, resultado) {
          return total + resultado;
        }, 0),
      };
    });

    const subtotal = gruposRolados.reduce(function somarGrupos(total, grupo) {
      return total + grupo.total;
    }, 0);

    const modificador = Number(resultadoRolagem.modificador) || 0;

    rolagensSeparadas.push({
      gruposRolados: gruposRolados,
      subtotal: subtotal,
      modificador: modificador,
      total: subtotal + modificador,
    });
  }

  return rolagensSeparadas;
}

function resolverDanoJogador(resultadoRolagem) {
  const combate = estadoAtualJogo.combateAtual;

  const danoPendente = combate.danoPendente;

  if (danoPendente?.efeitoAtivo) {
    const quantidadeNecessaria = danoPendente.efeitoAtivo.quantidadeDeRolagens;

    const quantidadeRegistrada = danoPendente.rolagensEfeito?.length ?? 0;

    const quantidadeRestante = quantidadeNecessaria - quantidadeRegistrada;

    const rolagensRecebidas = separarRolagensSimultaneasEfeito(
      resultadoRolagem,
      quantidadeRestante,
    );

    let ultimoRegistro = null;

    for (const rolagemRecebida of rolagensRecebidas) {
      ultimoRegistro = registrarRolagemEfeito(danoPendente, rolagemRecebida);

      if (!ultimoRegistro.sucesso) {
        console.warn("Não foi possível registrar a rolagem do efeito:", ultimoRegistro.motivo);

        return;
      }

      if (ultimoRegistro.concluida) {
        break;
      }
    }

    if (!ultimoRegistro.concluida) {
      const quantidadeAindaNecessaria =
        ultimoRegistro.quantidadeNecessaria - ultimoRegistro.quantidadeRegistrada;

      solicitacaoCombate.textContent =
        quantidadeAindaNecessaria === 1
          ? "Primeira rolagem registrada. Role novamente o dano."
          : `${ultimoRegistro.quantidadeRegistrada} ` +
            "rolagens registradas. " +
            `Ainda faltam ${quantidadeAindaNecessaria}.`;

      solicitacaoCombate.hidden = false;

      return;
    }

    if (!ultimoRegistro.exigeEscolhaDoJogador) {
      console.warn(
        "O critério de escolha do efeito ainda não foi implementado:",
        ultimoRegistro.criterioDeEscolha,
      );

      return;
    }

    const rolagens = ultimoRegistro.rolagens;

    exibirEscolhaEntreRolagens(rolagens, function concluirEscolhaRolagem(rolagemEscolhida) {
      solicitacaoCombate.textContent = `Resultado escolhido: ${rolagemEscolhida.total}.`;

      const resultadoFinalizacao = finalizarEfeitoPendente(danoPendente);

      if (!resultadoFinalizacao.sucesso) {
        console.warn("Não foi possível finalizar o efeito:", resultadoFinalizacao.motivo);

        return;
      }

      concluirDanoJogador(combate, rolagemEscolhida);
    });

    console.log("Rolagens do efeito:", rolagens);

    return;
  }

  concluirDanoJogador(combate, resultadoRolagem);
}

function receberResultadoRolagem(evento) {
  const resultadoRolagem = evento.detail;

  const combate = estadoAtualJogo.combateAtual;

  if (combate && combate.efeitoPendente) {
    resolverEfeitoPendente(resultadoRolagem);

    return;
  }

  if (combate && combate.iniciativaPendenteId) {
    resolverIniciativaJogador(resultadoRolagem);

    return;
  }

  if (combate && combate.ataquePendente) {
    resolverAtaqueJogador(resultadoRolagem);

    return;
  }

  if (combate && combate.danoPendente) {
    resolverDanoJogador(resultadoRolagem);

    return;
  }

  if (!testePendente) {
    return;
  }

  console.log("Resultado recebido pela aventura:", resultadoRolagem);

  resolverTeste(resultadoRolagem);
}

function resolverEfeitoPendente(resultadoRolagem) {
  const combate = estadoAtualJogo.combateAtual;

  const operacao = combate?.efeitoPendente;

  if (!combate || !operacao) {
    return false;
  }

  if (operacao.tipo !== "curar") {
    console.warn("Operação de efeito ainda não implementada:", operacao.tipo);

    return false;
  }

  const participante = combate.participantes.find(
    function encontrarParticipante(participanteAtual) {
      return participanteAtual.id === operacao.participanteId;
    },
  );

  if (!participante) {
    console.warn("Participante do efeito não encontrado:", operacao.participanteId);

    combate.efeitoPendente = null;

    return true;
  }

  const resultadoCura = SistemaCombate.aplicarCura(participante, resultadoRolagem.total);

  if (!resultadoCura.sucesso) {
    console.warn("Não foi possível aplicar a cura:", resultadoCura.motivo);

    combate.efeitoPendente = null;

    return true;
  }

  combate.efeitoPendente = null;

  atualizarInterfaceTurno(combate);

  return true;
}

function solicitarRolagemNaCaixa(
  gruposDeDados,
  modificador,
  descricao,
  quantidadeDeRolagens = 1,
  critico = false,
) {
  if (typeof window.configurarRolagemSolicitada !== "function") {
    console.warn("A caixa de dados não está disponível.");

    return;
  }

  window.configurarRolagemSolicitada({
    gruposDeDados: gruposDeDados,

    modificador: modificador,

    descricao: descricao,

    quantidadeDeRolagens: quantidadeDeRolagens,
    critico: critico,
  });
}

function selecionarEscolha(evento) {
  if (testePendente) {
    return;
  }

  const botaoEscolha = evento.target.closest(".botao-escolha");

  if (!botaoEscolha) {
    return;
  }

  const idEscolha = botaoEscolha.dataset.idEscolha;

  const escolhaSelecionada = escolhasAtuais.find(function (escolha) {
    return escolha.id === idEscolha;
  });

  if (!escolhaSelecionada) {
    console.warn("Escolha não encontrada:", idEscolha);

    return;
  }

  NarradorAventura
  .adicionarEscolhaRealizada(
    escolhaSelecionada
  );

  if (escolhaSelecionada.etapaInicial) {
    iniciarCaminho(escolhaSelecionada);

    return;
  }

  if (escolhaSelecionada.proximaEtapa) {
    iniciarEtapa(escolhaSelecionada.proximaEtapa);

    return;
  }

  if (!escolhaSelecionada.proximaCena) {
    console.log("Esta escolha ainda não possui uma próxima cena.");

    return;
  }

  mudarCena(escolhaSelecionada.proximaCena);
}

function mudarCena(idProximaCena) {
  const proximaCena = aventuraAtual.cenas[idProximaCena];

  if (!proximaCena) {
    console.warn("Cena não encontrada:", idProximaCena);

    return;
  }

  cenaAtual = proximaCena;

  estadoAtualJogo.progresso.cenaId = idProximaCena;
  estadoAtualJogo.progresso.caminhoId = null;
  estadoAtualJogo.progresso.etapaId = null;
  estadoAtualJogo.testePendente = null;

  caminhoAtual = null;

  etapaAtual = null;

  testePendente = null;

  exibirCena(aventuraAtual, cenaAtual);
}

function processarTurnoAtual(combate) {
  atualizarInterfaceTurno(combate);

  if (combate.status !== "ativo") {
    return;
  }

  const participanteAtivo = combate.participantes.find(
    (participante) => participante.id === combate.participanteAtivoId,
  );

  if (!participanteAtivo) {
    return;
  }

  if (participanteAtivo.tipo === "jogador") {
    exibirAcaoAtualCombate(mensagensNarrativas.turno.jogador);

    return;
  }

  exibirAcaoAtualCombate(`${participanteAtivo.nome} está decidindo o que fazer.`);

  solicitacaoCombate.textContent = "";

  solicitacaoCombate.hidden = true;

  setTimeout(async function () {
    try {
      await esperar(800);

      const resultado = SistemaCombate.executarTurnoInimigo(combate);

      await registrarResultadoTurnoInimigo(resultado, participanteAtivo);

      atualizarInterfaceTurno(combate);
    } catch (erro) {
      exibirAcaoAtualCombate(mensagensNarrativas.turno.erroInimigo(participanteAtivo.nome));

      await esperar(1200);
    }

    if (combate.status !== "ativo") {
      notificarFimCombate(combate);

      return;
    }

    if (combate.participanteAtivoId !== participanteAtivo.id) {
      return;
    }

    SistemaCombate.encerrarTurno(combate);

    processarTurnoAtual(combate);
  }, 1000);
}

function encerrarTurnoAtual() {
  const combate = estadoAtualJogo.combateAtual;

  if (!combate || combate.status !== "ativo") {
    return;
  }

  const participanteAtivo = combate.participantes.find(
    (participante) => participante.id === combate.participanteAtivoId,
  );

  if (!participanteAtivo || participanteAtivo.tipo !== "jogador") {
    return;
  }

  SistemaCombate.encerrarTurno(combate);

  processarTurnoAtual(combate);
}

function notificarFimCombate(combate) {
  if (combate.status === "ativo" || combate.resultadoNotificado) {
    return;
  }

  combate.resultadoNotificado = true;

  botaoEncerrarTurno.disabled = true;

  acoesCombate.innerHTML = "";

  const mensagem =
    combate.status === "vitoria" ? "Combate encerrado: vitória." : "Combate encerrado: derrota.";

  solicitacaoCombate.textContent = mensagem;

  solicitacaoCombate.hidden = false;

  const eventoFimCombate = new CustomEvent("combateEncerrado", {
    detail: {
      combateId: combate.id,
      resultado: combate.status,
      combate,
    },
  });

  document.dispatchEvent(eventoFimCombate);
}

function processarResultadoCombate(evento) {
  const idResultado = evento.detail?.resultado;

  const resultado = cenaAtual.combate?.resultados?.[idResultado];

  if (!resultado) {
    console.warn("Consequência de combate não encontrada:", idResultado);

    return;
  }

  setTimeout(function () {
    exibirTelaAventura();

    exibirContexto(resultado.contexto);

    ocultarEscolhas();

    solicitacaoTeste.textContent = "";

    solicitacaoTeste.hidden = true;
  }, 1200);
}

function verificarCombateDaCena(cena) {
  if (!cena.combate) {
    return;
  }

  if (estadoAtualJogo.combateAtual?.status === "ativo") {
    return;
  }

  const participanteJogador = criarParticipanteJogadorCombate(cena.combate.jogador);

  if (!participanteJogador) {
    return;
  }

  const participantesInimigos = criarParticipantesNpcsCombate(cena.combate.inimigos);

  const participantes = [participanteJogador, ...participantesInimigos];

  const configuracaoCombate = {
    id: `${aventuraAtual.id}-` + `${estadoAtualJogo.progresso.cenaId}`,

    participantes: participantes,
  };

  iniciarCombateDaAventura(configuracaoCombate);
}

botaoRecolherFicha.addEventListener("click", alternarFicha);

document.addEventListener("click", function (evento) {
  const parteMoldura = evento.target.closest(".gaveta-ficha .moldura-parte");

  if (parteMoldura === null) {
    return;
  }

  alternarFicha();
});

botaoRecolherPainelExplicativo.addEventListener("click", alternarPainelExplicativo);
document.addEventListener("click", function (evento) {
  const parteMolduraInformacoes = evento.target.closest(".gaveta-informacoes .moldura-parte");

  if (parteMolduraInformacoes === null) {
    return;
  }

  alternarPainelExplicativo();
});

listaEscolhas.addEventListener("click", selecionarEscolha);

tabuleiroCombate.addEventListener("click", selecionarTokenJogador);

tabuleiroCombate.addEventListener("click", moverTokenSelecionado);

tabuleiroCombate.addEventListener("pointerdown", iniciarArrasteToken);

tabuleiroCombate.addEventListener("pointermove", continuarArrasteToken);

tabuleiroCombate.addEventListener("pointerup", finalizarArrasteToken);

tabuleiroCombate.addEventListener("pointercancel", finalizarArrasteToken);

tabuleiroCombate.addEventListener("click", selecionarAlvoCombate);

listaAtaquesCombate.addEventListener("click", selecionarAtaqueCombate);

botaoEncerrarTurno.addEventListener("click", encerrarTurnoAtual);

NarradorAventura.limpar();

exibirCena(aventuraAtual, cenaAtual);

document.addEventListener("rolagemConcluida", receberResultadoRolagem);

document.addEventListener("combateEncerrado", processarResultadoCombate);

visualizacaoCombate.addEventListener("wheel", controlarZoomCombate, {
  passive: false,
});

visualizacaoCombate.addEventListener("pointerdown", iniciarArrasteCamera);

visualizacaoCombate.addEventListener("pointermove", continuarArrasteCamera);

visualizacaoCombate.addEventListener("pointerup", finalizarArrasteCamera);

visualizacaoCombate.addEventListener("pointercancel", finalizarArrasteCamera);

window.addEventListener("resize", function () {
  cameraCombate.zoom = Math.max(obterZoomMinimoVisivel(), cameraCombate.zoom);

  limitarCameraCombate();
  atualizarCameraCombate();
});

botaoFecharAtaquesCombate.addEventListener("click", fecharPainelAtaquesCombate);

botaoExpandirHistorico.addEventListener("click", alternarHistoricoCombate);

if (seletorVelocidadeTexto && window.NarradorAventura) {
  seletorVelocidadeTexto.value = NarradorAventura.obterVelocidade();

  seletorVelocidadeTexto.addEventListener("change", function () {
    NarradorAventura.definirVelocidade(seletorVelocidadeTexto.value);
  });
}

botaoRolarCima?.addEventListener("click", function () {
  conteudoPergaminho?.scrollBy({
    top: -220,
    behavior: "smooth",
  });
});

botaoRolarBaixo?.addEventListener("click", function () {
  conteudoPergaminho?.scrollBy({
    top: 220,
    behavior: "smooth",
  });
});

encaixarFerramentasDaAventura();
