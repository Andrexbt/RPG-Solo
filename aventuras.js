"use strict";

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

const personagemSelecionado =
  window.PersonagemDados.buscarSalvoPorId(
    idPersonagemSelecionado,
  );

const estadoAtualJogo = window.estadoJogo;

estadoAtualJogo.personagem.id = personagemSelecionado?.id ?? null;

estadoAtualJogo.personagem.dados = personagemSelecionado
  ? structuredClone(personagemSelecionado)
  : null;


function renderizarFichaDaAventura() {
  const areaFicha =
    document.getElementById("conteudoFicha");

  const personagemAtual =
    estadoAtualJogo.personagem.dados;

  if (!personagemAtual) {
    areaFicha.innerHTML =
      "<p>Nenhum personagem foi selecionado.</p>";

    return;
  }

  window.FichaPersonagem.renderizar(
    personagemAtual,
    areaFicha
  );
}

document.addEventListener(
  "personagemAtualizado",
  renderizarFichaDaAventura
);

window.FichaPersonagem
  .iniciarComponente()
  .then(function () {
    renderizarFichaDaAventura();
  })
  .catch(function (erro) {
    console.error(
      "Não foi possível carregar a ficha do personagem.",
      erro,
    );
  });

const idCenaInicial = aventuraAtual.cenaInicial;

estadoAtualJogo.aventuraId = aventuraAtual.id;
estadoAtualJogo.progresso.cenaId = idCenaInicial;
let cenaAtual = aventuraAtual.cenas[idCenaInicial];
let tokenArrastado = null;
let inicioArraste = null;
let escolhasAtuais = [];

const tabuleiroCombate = document.querySelector("#tabuleiroCombate");
const cameraCombateElemento =
  document.querySelector("#cameraCombate");

const imagemMapaCombate =
  document.querySelector("#imagemMapaCombate");
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
const listaEscolhas = document.querySelector("#listaEscolhas");

const painelFicha = document.querySelector("#painelFicha");
const painelExplicativo = document.querySelector("#painelExplicativo");

const botaoRecolherFicha = document.querySelector("#botaoRecolherFicha");
const botaoRecolherPainelExplicativo = document.querySelector("#botaoRecolherPainelExplicativo");

const layoutAventura = document.querySelector(".layout-aventura");
const visualizacaoAventura = document.querySelector("#visualizacaoAventura");

const visualizacaoCombate = document.querySelector("#visualizacaoCombate");

const telaResultadoCombate =
  document.querySelector("#telaResultadoCombate");

const rotuloResultadoCombate =
  document.querySelector("#rotuloResultadoCombate");

const tituloResultadoCombate =
  document.querySelector("#tituloResultadoCombate");

const textoResultadoCombate =
  document.querySelector("#textoResultadoCombate");

const recompensasResultadoCombate =
  document.querySelector("#recompensasResultadoCombate");

const xpRecebidoResultadoCombate =
  document.querySelector("#xpRecebidoResultadoCombate");

const xpAtualResultadoCombate =
  document.querySelector("#xpAtualResultadoCombate");

const botaoContinuarResultadoCombate =
  document.querySelector("#botaoContinuarResultadoCombate");

  const telaFimAventura =
  document.querySelector("#telaFimAventura");

const rotuloFimAventura =
  document.querySelector("#rotuloFimAventura");

const tituloFimAventura =
  document.querySelector("#tituloFimAventura");

const textoFimAventura =
  document.querySelector("#textoFimAventura");

const resumoFimAventura =
  document.querySelector("#resumoFimAventura");

const resultadoFimAventura =
  document.querySelector("#resultadoFimAventura");

const linhaXpFimAventura =
  document.querySelector("#linhaXpFimAventura");

const xpFimAventura =
  document.querySelector("#xpFimAventura");

const linkFichaFimAventura =
  document.querySelector("#linkFichaFimAventura");

const janelaDados =
  document.querySelector(".janela-dados");

const adendosAventura =
  document.querySelector(".adendos-aventura");

const marcadorOriginalJanelaDados =
  document.createComment("janela-dados-original");

janelaDados.parentNode.insertBefore(
  marcadorOriginalJanelaDados,
  janelaDados,
);

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
  const janelaAnotacoes = document.querySelector(".janela-anotacoes");
  const janelaDados = document.querySelector(".janela-dados");

  for (const janela of [janelaAnotacoes, janelaDados]) {
    if (!janela) {
      continue;
    }

    janela.classList.add("janela-encaixada");
    janela.style.left = "";
    janela.style.top = "";
    janela.style.right = "";
    janela.style.bottom = "";
    janela.style.width = "";
  }
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

  atualizarDestaquesMovimentoCombate(
  combate,
);

exibirAcaoAtualCombate(
  participante.movimentoRestante > 0
    ? "Escolha uma célula alcançável para se movimentar."
    : "Seu movimento deste turno já foi utilizado.",
);
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

  if (
  !painelAtaquesCombate.hidden &&
  !alvoDisponivelParaAtaque(
    combate,
    participanteAtivo,
    alvo,
  )
) {
  exibirAcaoAtualCombate(
    `${alvo.nome} está fora do alcance ` +
    "dos seus ataques disponíveis.",
  );

  return;
}

  combate.alvoSelecionadoId = alvo.id;

atualizarInterfaceTurno(combate);

if (!painelAtaquesCombate.hidden) {
  exibirAcaoAtualCombate(
    `Escolha um ataque contra ${alvo.nome}.`,
  );
}
}

function iniciarRolagemAtaquePreparado(resultado) {
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

  iniciarRolagemAtaquePreparado(resultado);
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

function aplicarMapaCombate(caminhoImagem) {
  imagemMapaCombate.src =
    caminhoImagem ?? "";
}

function iniciarCombateDaAventura(configuracao) {

  reiniciarLinhaTempoCombate();

  aplicarMapaCombate(
    configuracao.mapa
  );
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

    adicionarEventoHistoricoCombate(
      "Lance de iniciativa",
      mensagensNarrativas.iniciativa.pedir(
        jogador.bonusIniciativa,
      ),
    );

    solicitacaoCombate.hidden = false;
  }

  renderizarTabuleiroCombate(combate);

  exibirTelaCombate();

  cameraCombate.zoomMinimo =
  obterZoomMinimoVisivel();

enquadrarParticipantesCombate(
  combate,
);
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

function oferecerGrazeAposErro(
  combate,
  resultadoAtaque,
) {
  const operacao =
    resultadoAtaque
      .efeitosAposErro
      ?.find(
        efeito =>
          efeito.tipo ===
            "causarDanoSemAcerto" &&
          efeito.origem?.tipo ===
            "maestria" &&
          efeito.origem?.id ===
            "graze",
      );

  if (!operacao) {
    return false;
  }

  acoesCombate.innerHTML = "";

  const botaoUsar =
    document.createElement("button");

  botaoUsar.type = "button";
  botaoUsar.textContent =
    "Usar Graze";

  const botaoIgnorar =
    document.createElement("button");

  botaoIgnorar.type = "button";
  botaoIgnorar.textContent =
    "Ignorar";

  botaoUsar.addEventListener(
    "click",
    function usarGraze() {
      const resultadoDano =
        SistemaCombate
          .aplicarDanoSemAcerto(
            combate,
            operacao,
          );

      if (!resultadoDano.sucesso) {
        console.warn(
          "Não foi possível aplicar Graze:",
          resultadoDano.motivo,
        );

        return;
      }

      acoesCombate.innerHTML = "";

      adicionarEventoHistoricoCombate(
        resultadoDano.foiDerrotado
          ? `${resultadoDano.alvo.nome} foi derrotado`
          : `${resultadoDano.alvo.nome} sofreu dano de Graze`,

        resultadoDano.foiDerrotado
          ? `Graze derrotou ${resultadoDano.alvo.nome}.`
          : `Graze causou ${resultadoDano.dano} de dano.`,
      );

      exibirAcaoAtualCombate(
        resultadoDano.foiDerrotado
          ? `Graze derrotou ${resultadoDano.alvo.nome}.`
          : `Graze causou ${resultadoDano.dano} de dano.`,
      );

      atualizarInterfaceTurno(combate);

      if (resultadoDano.resultadoCombate) {
        notificarFimCombate(combate);
      }

      solicitacaoCombate.textContent =
        resultadoDano.foiDerrotado
          ? `${resultadoDano.alvo.nome} foi derrotado.`
          : `${resultadoDano.alvo.nome} sofreu ${resultadoDano.dano} de dano de Graze.`;

      solicitacaoCombate.hidden = false;
    },
  );

  botaoIgnorar.addEventListener(
    "click",
    function ignorarGraze() {
      acoesCombate.innerHTML = "";

      solicitacaoCombate.textContent =
        "O ataque errou e Graze não foi utilizado.";

      solicitacaoCombate.hidden = false;
    },
  );

  acoesCombate.append(
    botaoUsar,
    botaoIgnorar,
  );

  solicitacaoCombate.textContent =
    `O ataque errou. Usar Graze para causar ${operacao.quantidade} de dano?`;

  solicitacaoCombate.hidden = false;

  return true;
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

    const grazeFoiOferecido =
  oferecerGrazeAposErro(
    combate,
    resultadoAtaque,
  );

if (grazeFoiOferecido) {
  return;
}

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

function oferecerCleaveAposDano(
  combate,
  resultadoDano,
) {
  const operacao = resultadoDano.efeitosDisponiveis?.find(
    (efeito) =>
      efeito.tipo === "permitirAtaqueAdicional" &&
      efeito.origem?.tipo === "maestria" &&
      efeito.origem?.id === "cleave",
  );

  if (!operacao) {
    return false;
  }

  const alvos = SistemaCombate.listarAlvosCleave(
    combate,
    operacao.participanteId,
    operacao.alvoId,
    operacao.ataqueId,
  );

  if (alvos.length === 0) {
    return false;
  }

  acoesCombate.innerHTML = "";

  for (const alvo of alvos) {
    const botaoAlvo = document.createElement("button");

    botaoAlvo.type = "button";
    botaoAlvo.textContent = `Usar Cleave contra ${alvo.nome}`;

    botaoAlvo.addEventListener("click", function usarCleave() {
      const resultadoAtaque = SistemaCombate.prepararAtaqueCleave(
        combate,
        operacao.participanteId,
        operacao.alvoId,
        alvo.id,
        operacao.ataqueId,
      );

      if (!resultadoAtaque.sucesso) {
        console.warn("Não foi possível usar Cleave:", resultadoAtaque.motivo);
        return;
      }

      acoesCombate.innerHTML = "";
      combate.alvoSelecionadoId = alvo.id;
      atualizarInterfaceTurno(combate);
      iniciarRolagemAtaquePreparado(resultadoAtaque);
    });

    acoesCombate.append(botaoAlvo);
  }

  const botaoIgnorar = document.createElement("button");

  botaoIgnorar.type = "button";
  botaoIgnorar.textContent = "Ignorar";
  botaoIgnorar.addEventListener("click", function ignorarCleave() {
    acoesCombate.innerHTML = "";
    solicitacaoCombate.textContent = "Cleave não foi utilizado.";
    solicitacaoCombate.hidden = false;
  });

  acoesCombate.append(botaoIgnorar);
  solicitacaoCombate.textContent =
    "Cleave permite atacar outra criatura próxima ao primeiro alvo.";
  solicitacaoCombate.hidden = false;

  return true;
}

function oferecerToppleAposDano(
  combate,
  resultadoDano,
) {
  if (resultadoDano.foiDerrotado) {
    return false;
  }

  const operacao =
    resultadoDano
      .efeitosDisponiveis
      ?.find(
        efeito =>
          efeito.tipo ===
            "solicitarSalvaguarda" &&

          efeito.origem?.tipo ===
            "maestria" &&

          efeito.origem?.id ===
            "topple",
      );

  if (!operacao) {
    return false;
  }

  acoesCombate.innerHTML = "";

  const botaoUsar =
    document.createElement("button");

  botaoUsar.type = "button";
  botaoUsar.textContent =
    "Usar Topple";

  const botaoIgnorar =
    document.createElement("button");

  botaoIgnorar.type = "button";
  botaoIgnorar.textContent =
    "Ignorar";

  botaoUsar.addEventListener(
    "click",
    function usarTopple() {
      const resultado =
        SistemaCombate
          .resolverSalvaguardaCombate(
            combate,
            operacao,
          );

      if (!resultado.sucesso) {
        console.warn(
          "Não foi possível resolver Topple:",
          resultado.motivo,
        );

        return;
      }

      acoesCombate.innerHTML = "";

      const total =
        resultado
          .resultadoTeste
          .total;

      if (resultado.passou) {
        adicionarEventoHistoricoCombate(
          `${resultadoDano.alvo.nome} resistiu a Topple`,

          `${resultadoDano.alvo.nome} obteve ${total} contra CD ${resultado.dificuldade} e permaneceu de pé.`,
        );

        exibirAcaoAtualCombate(
          `${resultadoDano.alvo.nome} resistiu a Topple.`,
        );

        solicitacaoCombate.textContent =
          `Salvaguarda: ${total} contra CD ${resultado.dificuldade}. Sucesso.`;
      } else {
        adicionarEventoHistoricoCombate(
          `${resultadoDano.alvo.nome} caiu`,

          `${resultadoDano.alvo.nome} obteve ${total} contra CD ${resultado.dificuldade} e ficou Caído.`,
        );

        exibirAcaoAtualCombate(
          `${resultadoDano.alvo.nome} ficou Caído.`,
        );

        solicitacaoCombate.textContent =
          `Salvaguarda: ${total} contra CD ${resultado.dificuldade}. O alvo ficou Caído.`;
      }

      atualizarInterfaceTurno(
        combate,
      );

      solicitacaoCombate.hidden =
        false;
    },
  );

  botaoIgnorar.addEventListener(
    "click",
    function ignorarTopple() {
      acoesCombate.innerHTML = "";

      solicitacaoCombate.textContent =
        "Topple não foi utilizado.";

      solicitacaoCombate.hidden =
        false;
    },
  );

  acoesCombate.append(
    botaoUsar,
    botaoIgnorar,
  );

  solicitacaoCombate.textContent =
    `Usar Topple? O alvo fará uma salvaguarda de Constituição contra CD ${operacao.dificuldade}.`;

  solicitacaoCombate.hidden = false;

  return true;
}

function oferecerPushAposDano(
  combate,
  resultadoDano,
) {
  if (resultadoDano.foiDerrotado) {
    return false;
  }

  const operacao =
    resultadoDano
      .efeitosDisponiveis
      ?.find(
        efeito =>
          efeito.tipo ===
            "deslocarAlvo" &&

          efeito.origem?.tipo ===
            "maestria" &&

          efeito.origem?.id ===
            "push",
      );

  if (!operacao) {
    return false;
  }

  acoesCombate.innerHTML = "";

  const botaoUsar =
    document.createElement("button");

  botaoUsar.type = "button";
  botaoUsar.textContent =
    "Usar Push";

  const botaoIgnorar =
    document.createElement("button");

  botaoIgnorar.type = "button";
  botaoIgnorar.textContent =
    "Ignorar";

  botaoUsar.addEventListener(
    "click",
    function usarPush() {
      const resultado =
        SistemaCombate
          .aplicarDeslocamentoForcado(
            combate,
            operacao,
          );

      if (!resultado.sucesso) {
        console.warn(
          "Não foi possível aplicar Push:",
          resultado.motivo,
        );

        return;
      }

      acoesCombate.innerHTML = "";

      atualizarInterfaceTurno(
        combate,
      );

      if (resultado.aplicado) {
        adicionarEventoHistoricoCombate(
          `${resultadoDano.alvo.nome} foi empurrado`,

          `${resultadoDano.alvo.nome} foi afastado em ${resultado.distanciaPercorrida} célula(s).`,
        );

        exibirAcaoAtualCombate(
          `${resultadoDano.alvo.nome} foi empurrado em ${resultado.distanciaPercorrida} célula(s).`,
        );

        solicitacaoCombate.textContent =
          `Push deslocou o alvo em ${resultado.distanciaPercorrida} célula(s).`;
      } else {
        exibirAcaoAtualCombate(
          `${resultadoDano.alvo.nome} não pôde ser empurrado.`,
        );

        solicitacaoCombate.textContent =
          "O caminho estava bloqueado e Push não deslocou o alvo.";
      }

      solicitacaoCombate.hidden =
        false;
    },
  );

  botaoIgnorar.addEventListener(
    "click",
    function ignorarPush() {
      acoesCombate.innerHTML = "";

      solicitacaoCombate.textContent =
        "Push não foi utilizado.";

      solicitacaoCombate.hidden =
        false;
    },
  );

  acoesCombate.append(
    botaoUsar,
    botaoIgnorar,
  );

  solicitacaoCombate.textContent =
    "Usar Push para afastar o alvo em até 2 células?";

  solicitacaoCombate.hidden = false;

  return true;
}

function oferecerSlowAposDano(
  combate,
  resultadoDano,
) {
  if (resultadoDano.foiDerrotado) {
    return false;
  }

  const operacao =
    resultadoDano
      .efeitosDisponiveis
      ?.find(
        efeito =>
          efeito.tipo ===
            "modificarDeslocamento" &&

          efeito.origem?.tipo ===
            "maestria" &&

          efeito.origem?.id ===
            "slow",
      );

  if (!operacao) {
    return false;
  }

  acoesCombate.innerHTML = "";

  const botaoUsar =
    document.createElement("button");

  botaoUsar.type = "button";
  botaoUsar.textContent =
    "Usar Slow";

  const botaoIgnorar =
    document.createElement("button");

  botaoIgnorar.type = "button";
  botaoIgnorar.textContent =
    "Ignorar";

  botaoUsar.addEventListener(
    "click",
    function usarSlow() {
      const resultado =
        SistemaCombate
          .aplicarModificadorDeslocamentoTemporario(
            combate,
            operacao,
          );

      if (!resultado.sucesso) {
        console.warn(
          "Não foi possível aplicar Slow:",
          resultado.motivo,
        );

        return;
      }

      acoesCombate.innerHTML = "";

      if (resultado.aplicado) {
        adicionarEventoHistoricoCombate(
          `Slow afetou ${resultadoDano.alvo.nome}`,

          `${resultadoDano.alvo.nome} teve seu deslocamento reduzido em 2 células.`,
        );

        exibirAcaoAtualCombate(
          `${resultadoDano.alvo.nome} teve seu deslocamento reduzido.`,
        );
      } else {
        exibirAcaoAtualCombate(
          "Slow já estava afetando esse alvo.",
        );
      }

      atualizarInterfaceTurno(
        combate,
      );

      solicitacaoCombate.textContent =
        resultado.aplicado
          ? "Slow foi aplicado."
          : "Slow não se acumula.";

      solicitacaoCombate.hidden =
        false;
    },
  );

  botaoIgnorar.addEventListener(
    "click",
    function ignorarSlow() {
      acoesCombate.innerHTML = "";

      solicitacaoCombate.textContent =
        "Slow não foi utilizado.";

      solicitacaoCombate.hidden =
        false;
    },
  );

  acoesCombate.append(
    botaoUsar,
    botaoIgnorar,
  );

  solicitacaoCombate.textContent =
    "Usar Slow para reduzir o deslocamento do alvo em 2 células?";

  solicitacaoCombate.hidden = false;

  return true;
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

  const cleaveFoiOferecido = oferecerCleaveAposDano(
    combate,
    resultadoDano,
  );

  if (cleaveFoiOferecido) {
    return;
  }

  const toppleFoiOferecido =
  oferecerToppleAposDano(
    combate,
    resultadoDano,
  );

if (toppleFoiOferecido) {
  return;
}

  const pushFoiOferecido =
  oferecerPushAposDano(
    combate,
    resultadoDano,
  );

if (pushFoiOferecido) {
  return;
}

  const slowFoiOferecido =
  oferecerSlowAposDano(
    combate,
    resultadoDano,
  );

if (slowFoiOferecido) {
  return;
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

    return;
  }

  concluirDanoJogador(combate, resultadoRolagem);
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

void exibirCena(aventuraAtual, cenaAtual);

document.addEventListener("rolagemConcluida", receberResultadoRolagem);

botaoContinuarResultadoCombate.addEventListener(
  "click",
  continuarAposResultadoCombate
);

document.addEventListener("combateEncerrado", processarResultadoCombate);

painelHistoricoCombate.addEventListener(
  "wheel",
  function impedirZoomAoRolarLinhaTempo(
    evento,
  ) {
    evento.stopPropagation();
  },
  {
    passive: true,
  },
);

visualizacaoCombate.addEventListener("wheel", controlarZoomCombate, {
  passive: false,
});

visualizacaoCombate.addEventListener("pointerdown", iniciarArrasteCamera);

visualizacaoCombate.addEventListener(
  "contextmenu",
  function bloquearMenuContexto(evento) {
    evento.preventDefault();
  },
);

visualizacaoCombate.addEventListener("pointermove", continuarArrasteCamera);

visualizacaoCombate.addEventListener("pointerup", finalizarArrasteCamera);

visualizacaoCombate.addEventListener("pointercancel", finalizarArrasteCamera);

window.addEventListener("resize", function () {
  cameraCombate.zoomMinimo =
    obterZoomMinimoVisivel();

  cameraCombate.zoom =
    Math.min(
      cameraCombate.zoomMaximo,
      Math.max(
        cameraCombate.zoomMinimo,
        cameraCombate.zoom,
      ),
    );

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
