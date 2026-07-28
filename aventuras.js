"use strict";

function buscarPersonagemSalvo(
  idPersonagem
) {

  if (!idPersonagem) {
    return null;
  }

  try {

    const dadosSalvos =
      localStorage.getItem(
        "personagensRpgSolo"
      );

    if (!dadosSalvos) {
      return null;
    }

    const personagens =
      JSON.parse(
        dadosSalvos
      );

    if (!Array.isArray(personagens)) {
      return null;
    }

    const personagem =
      personagens.find(
        function(
          personagemSalvo
        ) {

          return (
            personagemSalvo.id ===
            idPersonagem
          );

        }
      );

    return personagem ?? null;

  } catch (erro) {

    console.error(
      "Não foi possível carregar o personagem.",
      erro
    );

    return null;

  }

}

const parametrosAventura =
  new URLSearchParams(
    window.location.search
  );

const idAventuraSelecionada =
  parametrosAventura.get(
    "aventura"
  ) ?? "aFuga";

const idPersonagemSelecionado =
  parametrosAventura.get(
    "personagem"
  );

const aventuraAtual =
  bancoAventuras[
    idAventuraSelecionada
  ];

if (!aventuraAtual) {

  throw new Error(
    `Aventura não encontrada: ${idAventuraSelecionada}`
  );

}

const personagemSelecionado =
  buscarPersonagemSalvo(
    idPersonagemSelecionado
  );

const estadoAtualJogo =
  window.estadoJogo;

estadoAtualJogo.personagem.id =
  personagemSelecionado?.id ?? null;

estadoAtualJogo.personagem.dados =
  personagemSelecionado
    ? structuredClone(
        personagemSelecionado
      )
    : null;

const idCenaInicial =
  aventuraAtual.cenaInicial;
  
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

  deslocamentoX:
    0,

  deslocamentoY:
    0,

  zoom:
    1,

  zoomMinimo:
    0.5,

  zoomMaximo:
    1.6

};

let arrasteCamera = null;

const tabuleiroCombate = document.querySelector("#tabuleiroCombate");
const painelTurnoCombate = document.querySelector("#painelTurnoCombate");
const numeroRodadaCombate = document.querySelector("#numeroRodadaCombate");
const participanteAtivoCombate = document.querySelector("#participanteAtivoCombate");
const movimentoRestanteCombate = document.querySelector("#movimentoRestanteCombate");
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

carregarNpcsDaAventura( aventuraAtual.id);

function obterZoomMinimoVisivel() {

  if (
    visualizacaoCombate.clientWidth === 0 ||
    visualizacaoCombate.clientHeight === 0 ||
    tabuleiroCombate.offsetWidth === 0 ||
    tabuleiroCombate.offsetHeight === 0
  ) {

    return cameraCombate.zoomMinimo;

  }

  const zoomMinimoHorizontal =
    visualizacaoCombate.clientWidth /
    tabuleiroCombate.offsetWidth;

  const zoomMinimoVertical =
    visualizacaoCombate.clientHeight /
    tabuleiroCombate.offsetHeight;

  return Math.min(
    cameraCombate.zoomMaximo,
    Math.max(
      cameraCombate.zoomMinimo,
      zoomMinimoHorizontal,
      zoomMinimoVertical
    )
  );

}

function limitarCameraCombate() {

  const larguraTabuleiro =
    tabuleiroCombate.offsetWidth *
    cameraCombate.zoom;

  const alturaTabuleiro =
    tabuleiroCombate.offsetHeight *
    cameraCombate.zoom;

  const limiteHorizontal =
    Math.max(
      0,
      (
        larguraTabuleiro -
        visualizacaoCombate.clientWidth
      ) / 2
    );

  const limiteVertical =
    Math.max(
      0,
      (
        alturaTabuleiro -
        visualizacaoCombate.clientHeight
      ) / 2
    );

  cameraCombate.deslocamentoX =
    Math.min(
      limiteHorizontal,
      Math.max(
        -limiteHorizontal,
        cameraCombate.deslocamentoX
      )
    );

  cameraCombate.deslocamentoY =
    Math.min(
      limiteVertical,
      Math.max(
        -limiteVertical,
        cameraCombate.deslocamentoY
      )
    );

}

function atualizarCameraCombate() {

  tabuleiroCombate.style.setProperty(
    "--camera-x",
    `${cameraCombate.deslocamentoX}px`
  );

  tabuleiroCombate.style.setProperty(
    "--camera-y",
    `${cameraCombate.deslocamentoY}px`
  );

  tabuleiroCombate.style.setProperty(
    "--camera-zoom",
    cameraCombate.zoom
  );

}

function controlarZoomCombate(
  evento
) {

  evento.preventDefault();

  const variacaoZoom =
    evento.deltaY < 0
      ? 0.1
      : -0.1;

  const novoZoom =
    cameraCombate.zoom +
    variacaoZoom;

  cameraCombate.zoom =
    Math.min(
      cameraCombate.zoomMaximo,
      Math.max(
        obterZoomMinimoVisivel(),
        Number(
          novoZoom.toFixed(
            2
          )
        )
      )
    );

  limitarCameraCombate();
  atualizarCameraCombate();

}

function iniciarArrasteCamera(
  evento
) {

  const iniciouEmToken =
    evento.target.closest(
      ".token-combate"
    );

  if (
    iniciouEmToken ||
    evento.button !== 2
  ) {
    return;
  }

  arrasteCamera = {

    ponteiroId:
      evento.pointerId,

    inicioX:
      evento.clientX,

    inicioY:
      evento.clientY,

    deslocamentoInicialX:
      cameraCombate.deslocamentoX,

    deslocamentoInicialY:
      cameraCombate.deslocamentoY

  };

  visualizacaoCombate.setPointerCapture(
    evento.pointerId
  );

  visualizacaoCombate.classList.add(
    "camera-arrastando"
  );

  evento.preventDefault();

}

function continuarArrasteCamera(
  evento
) {

  if (
    !arrasteCamera ||
    evento.pointerId !==
      arrasteCamera.ponteiroId
  ) {
    return;
  }

  cameraCombate.deslocamentoX =
    arrasteCamera.deslocamentoInicialX +
    evento.clientX -
    arrasteCamera.inicioX;

  cameraCombate.deslocamentoY =
    arrasteCamera.deslocamentoInicialY +
    evento.clientY -
    arrasteCamera.inicioY;

  limitarCameraCombate();
  atualizarCameraCombate();

}

function finalizarArrasteCamera(
  evento
) {

  if (
    !arrasteCamera ||
    evento.pointerId !==
      arrasteCamera.ponteiroId
  ) {
    return;
  }

  if (
    visualizacaoCombate.hasPointerCapture(
      evento.pointerId
    )
  ) {

    visualizacaoCombate.releasePointerCapture(
      evento.pointerId
    );

  }

  visualizacaoCombate.classList.remove(
    "camera-arrastando"
  );

  arrasteCamera =
    null;

}

function alternarFicha() {

  layoutAventura.classList.toggle("ficha-recolhida");

}

function alternarPainelExplicativo() {

  layoutAventura.classList.toggle("painelExplicativo-recolhido");

}

function exibirTelaCombate() {

  visualizacaoAventura.hidden =
    true;

  visualizacaoCombate.hidden =
    false;

  layoutAventura.classList.add(
    "modo-combate"
  );

}

function exibirTelaAventura() {

  visualizacaoCombate.hidden =
    true;

  visualizacaoAventura.hidden =
    false;

  layoutAventura.classList.remove(
    "modo-combate"
  );

}

function criarTokenCombate(
  participante
) {

  const token =
    document.createElement(
      "button"
    );

  token.type =
    "button";

  token.classList.add(
    "token-combate",
    `token-${participante.tipo}`
  );

  token.dataset.idParticipante =
    participante.id;

  token.style.gridColumn =
    participante.posicao.coluna;

  token.style.gridRow =
    participante.posicao.linha;

  const representacao =
  participante.representacao;

if (
  representacao?.imagem
) {

  token.classList.add(
    "token-com-imagem"
  );

  const imagemAvatar =
    document.createElement(
      "img"
    );

  imagemAvatar.classList.add(
    "imagem-token-combate"
  );

  imagemAvatar.src =
    representacao.imagem;

  imagemAvatar.alt =
    "";

  token.append(
    imagemAvatar
  );

  if (
    representacao.frame
  ) {

    const imagemFrame =
      document.createElement(
        "img"
      );

    imagemFrame.classList.add(
      "frame-token-combate"
    );

    imagemFrame.src =
      representacao.frame;

    imagemFrame.alt =
      "";

    token.append(
      imagemFrame
    );

  }

} else {

  token.textContent =
    participante.tipo === "jogador"
      ? "P"
      : "I";

}

  token.setAttribute(
    "aria-label",
    participante.id
  );

  return token;

}

function criarCelulasTabuleiro(
  combate
) {

  const quantidadeColunas =
    combate.tabuleiro.colunas;

  const quantidadeLinhas =
    combate.tabuleiro.linhas;

  for (
    let linha = 1;
    linha <= quantidadeLinhas;
    linha++
  ) {

    for (
      let coluna = 1;
      coluna <= quantidadeColunas;
      coluna++
    ) {

      const celula =
        document.createElement(
          "button"
        );

      celula.type =
        "button";

      celula.classList.add(
        "celula-combate"
      );

      celula.dataset.coluna =
        coluna;

      celula.dataset.linha =
        linha;

      celula.style.gridColumn =
        coluna;

      celula.style.gridRow =
        linha;

      celula.setAttribute(
        "aria-label",
        `Coluna ${coluna}, linha ${linha}`
      );

      tabuleiroCombate.append(
        celula
      );

    }

  }

}

function renderizarParticipantesCombate(
  participantes
) {

  for (const participante of participantes) {

    const token =
      criarTokenCombate(
        participante
      );

    tabuleiroCombate.append(
      token
    );

  }

}

function renderizarTabuleiroCombate(
  combate
) {

  tabuleiroCombate.innerHTML =
    "";

  criarCelulasTabuleiro(
    combate
  );

  renderizarParticipantesCombate(
    combate.participantes
  );

}

function renderizarAcoesCombate(
  participante
) {

  acoesCombate.innerHTML =
    "";

  if (
    !participante ||
    participante.tipo !== "jogador"
  ) {
    return;
  }

  for (
    const ataque of
      participante.ataques
  ) {

    const botao =
      document.createElement(
        "button"
      );

    botao.type =
      "button";

    botao.classList.add(
      "botao-ataque-combate"
    );

    botao.dataset.idAtaque =
      ataque.id;

    botao.textContent =
      ataque.nome;

    botao.disabled =
      !participante.acaoDisponivel;

    acoesCombate.append(
      botao
    );

  }

}

function atualizarInterfaceTurno(
  combate
) {

  const participanteAtivo =
    combate.participantes.find(
      participante =>
        participante.id ===
        combate.participanteAtivoId
    );

  botaoEncerrarTurno.disabled =
    !participanteAtivo ||
    participanteAtivo.tipo !== "jogador" ||
    combate.status !== "ativo";

  numeroRodadaCombate.textContent =
    combate.rodada;

  participanteAtivoCombate.textContent =
    participanteAtivo
      ? participanteAtivo.nome ??
        participanteAtivo.id
      : "—";

  movimentoRestanteCombate.textContent =
    participanteAtivo
      ? participanteAtivo.movimentoRestante
      : "—";

  renderizarAcoesCombate(
    participanteAtivo
  );

  const tokens =
    tabuleiroCombate.querySelectorAll(
      ".token-combate"
    );

  for (const token of tokens) {

    const participanteDoToken =
      combate.participantes.find(
        participante =>
          participante.id ===
          token.dataset.idParticipante
      );

    if (participanteDoToken) {

      token.style.gridColumn =
        participanteDoToken.posicao.coluna;

      token.style.gridRow =
        participanteDoToken.posicao.linha;

    }

    token.classList.toggle(
      "token-turno-ativo",
      token.dataset.idParticipante ===
        combate.participanteAtivoId
    );

    token.classList.toggle(
      "token-alvo-selecionado",
      token.dataset.idParticipante ===
        combate.alvoSelecionadoId
    );

    token.classList.toggle(
      "token-derrotado",
      participanteDoToken?.estado ===
        "derrotado"
    );

  }

  painelTurnoCombate.hidden =
    false;

}

function selecionarTokenJogador(evento) {

  const token =
    evento.target.closest(
      ".token-combate"
    );

  if (!token) {
    return;
  }

  const combate =
    estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        token.dataset.idParticipante
    );

  if (
    !participante ||
    participante.tipo !== "jogador"
  ) {
    return;
  }

  combate.participanteSelecionadoId =
    participante.id;

  const tokens =
    tabuleiroCombate.querySelectorAll(
      ".token-combate"
    );

  for (const tokenAtual of tokens) {

    tokenAtual.classList.remove(
      "token-selecionado"
    );

  }

  token.classList.add(
    "token-selecionado"
  );

}

function selecionarAlvoCombate(
  evento
) {

  const token =
    evento.target.closest(
      ".token-combate"
    );

  if (!token) {
    return;
  }

  const combate =
    estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const participanteAtivo =
    combate.participantes.find(
      participante =>
        participante.id ===
        combate.participanteAtivoId
    );

  if (
    !participanteAtivo ||
    participanteAtivo.tipo !== "jogador"
  ) {
    return;
  }

  const alvo =
    combate.participantes.find(
      participante =>
        participante.id ===
        token.dataset.idParticipante
    );

  if (
    !alvo ||
    alvo.tipo !== "inimigo"
  ) {
    return;
  }

  combate.alvoSelecionadoId =
    alvo.id;

  atualizarInterfaceTurno(
    combate
  );

}

function selecionarAtaqueCombate(
  evento
) {

  const botao =
    evento.target.closest(
      ".botao-ataque-combate"
    );

  if (!botao) {
    return;
  }

  const combate =
    estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  if (!combate.alvoSelecionadoId) {

    let instrucaoD20 =
  "Role 1d20";

if (
  resultado.tipoRolagem ===
  "vantagem"
) {
  instrucaoD20 =
    "Role 2d20 e use o maior resultado";
}

if (
  resultado.tipoRolagem ===
  "desvantagem"
) {
  instrucaoD20 =
    "Role 2d20 e use o menor resultado";
}

solicitacaoCombate.textContent =
  `${instrucaoD20} ${sinalBonus}` +
  `${resultado.ataque.bonusAtaque} ` +
  `para atacar ${resultado.alvo.nome}.`;

    solicitacaoCombate.hidden =
      false;

    return;

  }

  const resultado =
    SistemaCombate.prepararAtaque(
      combate,
      combate.participanteAtivoId,
      combate.alvoSelecionadoId,
      botao.dataset.idAtaque
    );

  if (!resultado.sucesso) {

    console.warn(
      "Ataque recusado:",
      resultado.motivo
    );

    return;

  }

  const sinalBonus =
    resultado.ataque.bonusAtaque >= 0
      ? "+"
      : "";

  solicitacaoCombate.textContent =
    `Role 1d20 ${sinalBonus}` +
    `${resultado.ataque.bonusAtaque} ` +
    `para atacar ${resultado.alvo.nome}.`;

  solicitacaoCombate.hidden =
    false;

}

function criarParticipanteJogadorCombate(
  configuracao
) {

  const personagem =
    estadoAtualJogo
      .personagem
      .dados;

  if (
    !personagem
  ) {

    console.warn(
      "Nenhum personagem foi selecionado para o combate."
    );

    return null;

  }

  const entidadeJogador =
    structuredClone(
      personagem
    );

  entidadeJogador.nome =
    personagem
      .detalhes
      ?.nome ??
    "Jogador";

  entidadeJogador.ataques =
    structuredClone(
      personagem
        .combate
        ?.ataques ??
      []
    );

  const configuracaoParticipante = {

    id:
      personagem.id ??
      "jogador",

    tipo:
      "jogador",

    posicao:
      configuracao.posicao,

    movimentoMaximo:
      configuracao.movimentoMaximo ??
      6

  };

  return SistemaCombate
    .criarParticipanteCombate(
      entidadeJogador,
      configuracaoParticipante
    );

}

function criarParticipantesNpcsCombate(
  configuracoes
) {

  const participantes =
    [];

  for (
    const configuracao of
      configuracoes
  ) {

    const npc =
      estadoAtualJogo.npcs[
        configuracao.npcId
      ];

    if (!npc) {

      console.warn(
        "NPC não encontrado:",
        configuracao.npcId
      );

      continue;

    }

    const quantidade =
      configuracao.quantidade ?? 1;

    for (
      let indice = 0;
      indice < quantidade;
      indice += 1
    ) {

      const posicao =
        configuracao.posicoes?.[
          indice
        ];

      if (!posicao) {

        console.warn(
          "Posição não encontrada para:",
          configuracao.npcId,
          indice
        );

        continue;

      }

      const configuracaoParticipante = {

        id:
          `${configuracao.npcId}-${indice + 1}`,

        tipo:
          npc.tipo,

        posicao:
          posicao,

        movimentoMaximo:
          configuracao.movimentoMaximo ?? 6,

        representacao:
          configuracao.representacao ?? null

      };

      const participante =
        SistemaCombate.criarParticipanteCombate(
          npc,
          configuracaoParticipante
        );

      participantes.push(
        participante
      );

    }

  }

  return participantes;

}

function iniciarCombateDaAventura(configuracao) {

  const configuracaoCombate =
    structuredClone(
      configuracao
    );

  const participanteJogador =
    configuracaoCombate
      .participantes.find(
        participante =>
          participante.tipo ===
          "jogador"
      );

  if (
    participanteJogador
  ) {

    participanteJogador.representacao =
      structuredClone(
        estadoAtualJogo
          .personagem
          .dados
          ?.avatar ??
        null
      );

  }

  const combate =
    SistemaCombate.iniciarCombate(
      configuracaoCombate
    );



  const jogador =
  combate.participantes.find(
    participante =>
      participante.tipo === "jogador"
  );

combate.iniciativaPendenteId =
  jogador
    ? jogador.id
    : null;

SistemaCombate.rolarIniciativasInimigos(
  combate
);

if (jogador) {

  solicitacaoCombate.textContent =
    "Role 1d20 e adicione seu modificador de iniciativa.";

  solicitacaoCombate.hidden =
    false;

}

  renderizarTabuleiroCombate(combate);

  exibirTelaCombate();

  console.log(
    "Combate iniciado:",
    combate
  );

}

function moverParticipante(
  participante,
  coluna,
  linha
) {

  const resultadoMovimento =
  SistemaCombate.movimentarParticipante(
    estadoAtualJogo.combateAtual,
    participante.id,
    coluna,
    linha
  );

if (!resultadoMovimento.sucesso) {

  console.warn(
    "Movimento recusado:",
    resultadoMovimento.motivo
  );

  return false;

}

  const token =
    tabuleiroCombate.querySelector(
      `[data-id-participante="${participante.id}"]`
    );

  if (!token) {
    return;
  }

  token.style.gridColumn =
    coluna;

  token.style.gridRow =
    linha;

    atualizarInterfaceTurno(
  estadoAtualJogo.combateAtual
);

    return true;

}

function iniciarArrasteToken(
  evento
) {

  const token =
    evento.target.closest(
      ".token-combate"
    );

  if (!token) {
    return;
  }

  const combate =
    estadoAtualJogo.combateAtual;

  if (!combate) {
    return;
  }

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        token.dataset.idParticipante
    );

  if (
    !participante ||
    participante.tipo !== "jogador"
  ) {
    return;
  }

  selecionarTokenJogador(
    evento
  );

  tokenArrastado =
    token;

  inicioArraste = {
    x: evento.clientX,
    y: evento.clientY,
    ponteiroId: evento.pointerId
  };

  tokenArrastado.classList.add(
    "token-arrastando"
  );

  tokenArrastado.setPointerCapture(
    evento.pointerId
  );

  evento.preventDefault();

}

function continuarArrasteToken(
  evento
) {

  if (
    !tokenArrastado ||
    evento.pointerId !==
      inicioArraste.ponteiroId
  ) {
    return;
  }

  const deslocamentoX =
    evento.clientX -
    inicioArraste.x;

  const deslocamentoY =
    evento.clientY -
    inicioArraste.y;

  tokenArrastado.style.transform =
    `translate(
      ${deslocamentoX}px,
      ${deslocamentoY}px
    )`;

}

function finalizarArrasteToken(
  evento
) {

  if (
    !tokenArrastado ||
    evento.pointerId !==
      inicioArraste.ponteiroId
  ) {
    return;
  }

  tokenArrastado.style.pointerEvents =
    "none";

  const elementoDestino =
    document.elementFromPoint(
      evento.clientX,
      evento.clientY
    );

  tokenArrastado.style.pointerEvents =
    "";

  const celula =
    elementoDestino
      ? elementoDestino.closest(
          ".celula-combate"
        )
      : null;

  const combate =
    estadoAtualJogo.combateAtual;

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        tokenArrastado.dataset.idParticipante
    );

  if (
    celula &&
    participante
  ) {

    const coluna =
      Number(
        celula.dataset.coluna
      );

    const linha =
      Number(
        celula.dataset.linha
      );

    moverParticipante(
      participante,
      coluna,
      linha
    );

  }

  tokenArrastado.style.transform =
    "";

  tokenArrastado.classList.remove(
    "token-arrastando"
  );

  tokenArrastado.releasePointerCapture(
    evento.pointerId
  );

  tokenArrastado =
    null;

  inicioArraste =
    null;

}

function moverTokenSelecionado(
  evento
) {

  const celula =
    evento.target.closest(
      ".celula-combate"
    );

  if (!celula) {
    return;
  }

  const combate =
    estadoAtualJogo.combateAtual;

  if (
    !combate ||
    !combate.participanteSelecionadoId
  ) {
    return;
  }

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        combate.participanteSelecionadoId
    );

  if (!participante) {
    return;
  }

  const coluna =
    Number(
      celula.dataset.coluna
    );

  const linha =
    Number(
      celula.dataset.linha
    );

  moverParticipante(
  participante,
  coluna,
  linha
);

}

function exibirEscolhas(escolhas) {

  escolhasAtuais = escolhas;

  const possuiEscolhas = escolhas.length > 0;

  areaEscolhas.hidden = !possuiEscolhas;

  tituloEscolhas.hidden = !possuiEscolhas;

  listaEscolhas.hidden = !possuiEscolhas;

  listaEscolhas.innerHTML =
    "";

    for (const escolha of escolhas) {

    const botaoEscolha =
      document.createElement(
        "button"
      );


    botaoEscolha.type =
      "button";


    botaoEscolha.classList.add(
      "botao-escolha"
    );


    botaoEscolha.dataset.idEscolha =
      escolha.id;


    botaoEscolha.textContent =
      escolha.texto;


    listaEscolhas.append(
      botaoEscolha
    );

    }
}

function exibirContexto(contexto) {

  contextoCena.replaceChildren();


  const paragrafos =
    Array.isArray(contexto)
      ? contexto
      : [contexto];


  for (const texto of paragrafos) {

    const paragrafo =
      document.createElement(
        "p"
      );


    paragrafo.textContent =
      texto;


    contextoCena.append(
      paragrafo
    );

  }

}

function exibirCena(aventura, cena) {

  tituloAventura.textContent = aventura.titulo;

  exibirContexto(cena.contexto);

  verificarCombateDaCena(cena);

  solicitacaoTeste.textContent ="";

  solicitacaoTeste.hidden = true;

  const escolhasDisponiveis =
  obterEscolhasDisponiveis(
    estadoAtualJogo.progresso.cenaId,
    cena.escolhas
  );

exibirEscolhas(
  escolhasDisponiveis
);
}

function ocultarEscolhas() {

  areaEscolhas.hidden =
    true;

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

    console.warn(
      "Etapa não encontrada:",
      idEtapa
    );

    return;

  }


  etapaAtual = etapa;

  estadoAtualJogo.progresso.etapaId = idEtapa;

    exibirContexto( etapa.descricao);


  testePendente = etapa.teste;

  estadoAtualJogo.testePendente = etapa.teste;


  ocultarEscolhas();


  const avisoTipoRolagem =
  obterAvisoTipoRolagem(etapa.teste);

solicitacaoTeste.textContent =
  etapa.instrucao +
  avisoTipoRolagem;


  solicitacaoTeste.hidden =
    false;


  console.log(
    "Etapa atual:",
    etapaAtual
  );

}

function resolverTeste(resultadoRolagem) {

  const testeResolvido = testePendente;

  const resultadoTeste =
  SistemaTestes.resolverTesteContraCd(
    resultadoRolagem,
    testeResolvido.dificuldade,
    testeResolvido.tipoRolagem || "normal"
  );

  const testeFoiBemSucedido = resultadoTeste.sucesso;

  const tipoResultado =
    testeFoiBemSucedido
      ? "sucesso"
      : "fracasso";

  const consequencia = etapaAtual.resultados[tipoResultado];

  testePendente = null;

  estadoAtualJogo.testePendente = null;

  solicitacaoTeste.textContent = "";

  solicitacaoTeste.hidden = true;

  exibirContexto(consequencia.texto);

  console.log(
    "Consequência:",
    consequencia
  );

  if (consequencia.escolhas) {

    exibirEscolhas(
      consequencia.escolhas
    );
    return;
  }

  if (
    consequencia.voltarParaEscolhas) {

      if (
  consequencia.removerEscolha &&
  caminhoAtual
) {

  registrarEscolhaRemovida(
  estadoAtualJogo.progresso.cenaId,
  caminhoAtual.id
);

}
const escolhasDisponiveis =
  obterEscolhasDisponiveis(
    estadoAtualJogo.progresso.cenaId,
    cenaAtual.escolhas
  );
    caminhoAtual =
      null;


    etapaAtual =
      null;

      estadoAtualJogo.progresso.caminhoId = null;
      estadoAtualJogo.progresso.etapaId = null;

    exibirEscolhas(
  escolhasDisponiveis
);

    return;
    }

    if (consequencia.proximaEtapa) {

    exibirEscolhas(
      [

        {

          id:
            "continuarEtapa",

          texto:
            "Continuar.",

          proximaEtapa:
            consequencia.proximaEtapa

        }

      ]
    );

    return;

  }


  if (consequencia.proximaCena) {

    exibirEscolhas(
      [

        {

          id:
            "continuarCena",

          texto:
            "Continuar.",

          proximaCena:
            consequencia.proximaCena

        }

      ]
    );

    return;

  }


  console.warn(
    "A consequência não possui um destino:",
    consequencia
  );

}

function resolverIniciativaJogador(
  resultadoRolagem
) {

  const combate =
    estadoAtualJogo.combateAtual;

  if (
    !combate ||
    !combate.iniciativaPendenteId
  ) {
    return;
  }

  SistemaCombate.registrarIniciativa(
    combate,
    combate.iniciativaPendenteId,
    resultadoRolagem.total
  );

  combate.iniciativaPendenteId =
    null;

  const ordemTurnos =
    SistemaCombate.ordenarTurnos(
      combate
    );

    processarTurnoAtual(
  combate
);

  solicitacaoCombate.textContent =
    "";

  solicitacaoCombate.hidden =
    true;

  console.log(
    "Ordem dos turnos:",
    ordemTurnos
  );

  console.log(
    "Participante ativo:",
    combate.participanteAtivoId
  );

}

function formatarRolagemDano(
  ataque,
  critico
) {

  const partes =
    [];

  for (
    const grupo of
      ataque.dano.gruposDeDados
  ) {

    const quantidade =
      critico
        ? grupo.quantidade * 2
        : grupo.quantidade;

    partes.push(
      `${quantidade}d${grupo.numeroDeFaces}`
    );

  }

  const modificador =
    ataque.dano.modificador;

  if (modificador > 0) {
    partes.push(
      `+ ${modificador}`
    );
  }

  if (modificador < 0) {
    partes.push(
      `- ${Math.abs(modificador)}`
    );
  }

  return partes.join(
    " "
  );

}

function resolverAtaqueJogador(
  resultadoRolagem
) {

  const combate =
    estadoAtualJogo.combateAtual;

  const resultadoAtaque =
    SistemaCombate.resolverAtaque(
      combate,
      resultadoRolagem
    );

  if (!resultadoAtaque.sucesso) {

    console.warn(
      "Não foi possível resolver o ataque:",
      resultadoAtaque.motivo
    );

    return;

  }

  atualizarInterfaceTurno(
    combate
  );

  if (!resultadoAtaque.acertou) {

    solicitacaoCombate.textContent =
      "O ataque errou.";

    solicitacaoCombate.hidden =
      false;

    return;

  }

  const textoDano =
    formatarRolagemDano(
      resultadoAtaque.ataque,
      resultadoAtaque.acertoCritico
    );

  solicitacaoCombate.textContent =
    resultadoAtaque.acertoCritico
      ? `Acerto crítico! Role ${textoDano} de dano.`
      : `O ataque acertou! Role ${textoDano} de dano.`;

  solicitacaoCombate.hidden =
    false;

}

function resolverDanoJogador(
  resultadoRolagem
) {

  const combate =
    estadoAtualJogo.combateAtual;

  const resultadoDano =
    SistemaCombate.resolverDano(
      combate,
      resultadoRolagem
    );

  if (!resultadoDano.sucesso) {

    console.warn(
      "Não foi possível resolver o dano:",
      resultadoDano.motivo
    );

    return;

  }

  solicitacaoCombate.textContent =
    resultadoDano.foiDerrotado
      ? `${resultadoDano.alvo.nome} foi derrotado.`
      : `${resultadoDano.alvo.nome} sofreu ` +
        `${resultadoDano.dano} de dano.`;

  solicitacaoCombate.hidden =
    false;

  atualizarInterfaceTurno(
    combate
  );

  if (
  resultadoDano.resultadoCombate
) {

  notificarFimCombate(
    combate
  );

}

  if (
  resultadoDano.resultadoCombate ===
  "vitoria"
) {

  solicitacaoCombate.textContent =
    "O inimigo foi derrotado. Vitória!";

} else if (
  resultadoDano.resultadoCombate ===
  "derrota"
) {

  solicitacaoCombate.textContent =
    "O personagem foi derrotado.";

} else if (
  resultadoDano.foiDerrotado
) {

  solicitacaoCombate.textContent =
    `${resultadoDano.alvo.nome} foi derrotado.`;

} else {

  solicitacaoCombate.textContent =
    `${resultadoDano.alvo.nome} sofreu ` +
    `${resultadoDano.dano} de dano.`;

}

}

function receberResultadoRolagem(
  evento
) {

  const resultadoRolagem =
    evento.detail;

  const combate =
    estadoAtualJogo.combateAtual;

  if (
    combate &&
    combate.iniciativaPendenteId
  ) {

    resolverIniciativaJogador(
      resultadoRolagem
    );

    return;

  }

  if (
  combate &&
  combate.ataquePendente
) {

  resolverAtaqueJogador(
    resultadoRolagem
  );

  return;
  }

  if (
  combate &&
  combate.danoPendente
) {

  resolverDanoJogador(
    resultadoRolagem
  );

  return;
  }

  if (!testePendente) {
    return;
  }

  console.log(
    "Resultado recebido pela aventura:",
    resultadoRolagem
  );

  resolverTeste(
    resultadoRolagem
  );

}

function selecionarEscolha(evento) {

  if (testePendente) {return;}

  const botaoEscolha = evento.target.closest(".botao-escolha");

  if (!botaoEscolha) {return;}

  const idEscolha = botaoEscolha.dataset.idEscolha;

  const escolhaSelecionada =
    escolhasAtuais.find(
      function (escolha) {

        return escolha.id === idEscolha;

      }
    );

    if (!escolhaSelecionada) {

  console.warn(
    "Escolha não encontrada:",
    idEscolha
  );

  return;

 }


  console.log(
    "Escolha selecionada:",
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

  console.log( "Esta escolha ainda não possui uma próxima cena.");

  return;

  }


  mudarCena(
  escolhaSelecionada.proximaCena
  );

}

function mudarCena(idProximaCena) {

  const proximaCena = aventuraAtual.cenas[idProximaCena];


  if (!proximaCena) {

    console.warn(
      "Cena não encontrada:",
      idProximaCena
    );

    return;

  }


  cenaAtual = proximaCena;

  estadoAtualJogo.progresso.cenaId = idProximaCena;
  estadoAtualJogo.progresso.caminhoId = null;
  estadoAtualJogo.progresso.etapaId = null;
  estadoAtualJogo.testePendente = null;

   caminhoAtual = null;


etapaAtual =
  null;


testePendente =
  null;


  exibirCena(
    aventuraAtual,
    cenaAtual
  );

}

function processarTurnoAtual(
  combate
) {

  atualizarInterfaceTurno(
    combate
  );

  if (combate.status !== "ativo") {
    return;
  }

  const participanteAtivo =
    combate.participantes.find(
      participante =>
        participante.id ===
        combate.participanteAtivoId
    );

  if (
    !participanteAtivo ||
    participanteAtivo.tipo !== "inimigo"
  ) {
    return;
  }

  solicitacaoCombate.textContent =
    `Turno de ${participanteAtivo.nome}.`;

  solicitacaoCombate.hidden =
    false;

  setTimeout(
    function() {

      const resultado =
        SistemaCombate.executarTurnoInimigo(
          combate
        );

      if (!resultado.sucesso) {

        solicitacaoCombate.textContent =
          `${participanteAtivo.nome} não conseguiu agir.`;

      } else if (
        resultado.resultadoAtaque.acertou
      ) {

        solicitacaoCombate.textContent =
          `${participanteAtivo.nome} atingiu ` +
          `${resultado.alvo.nome} e causou ` +
          `${resultado.resultadoDano.dano} de dano.`;

      } else {

        solicitacaoCombate.textContent =
          `${participanteAtivo.nome} errou o ataque.`;

      }

      atualizarInterfaceTurno(
        combate
      );

      if (combate.status !== "ativo") {

  notificarFimCombate(
    combate
  );

  return;

}

      SistemaCombate.encerrarTurno(
        combate
      );

      processarTurnoAtual(
        combate
      );

    },
    800
  );

}

function encerrarTurnoAtual() {

  const combate =
    estadoAtualJogo.combateAtual;

  if (
    !combate ||
    combate.status !== "ativo"
  ) {
    return;
  }

  const participanteAtivo =
    combate.participantes.find(
      participante =>
        participante.id ===
        combate.participanteAtivoId
    );

  if (
    !participanteAtivo ||
    participanteAtivo.tipo !== "jogador"
  ) {
    return;
  }

  SistemaCombate.encerrarTurno(
    combate
  );

  processarTurnoAtual(
    combate
  );

}

function notificarFimCombate(
  combate
) {

  if (
    combate.status === "ativo" ||
    combate.resultadoNotificado
  ) {
    return;
  }

  combate.resultadoNotificado =
    true;

  botaoEncerrarTurno.disabled =
    true;

  acoesCombate.innerHTML =
    "";

  const mensagem =
    combate.status === "vitoria"
      ? "Combate encerrado: vitória."
      : "Combate encerrado: derrota.";

  solicitacaoCombate.textContent =
    mensagem;

  solicitacaoCombate.hidden =
    false;

  const eventoFimCombate =
    new CustomEvent(
      "combateEncerrado",
      {
        detail: {
          combateId: combate.id,
          resultado: combate.status,
          combate
        }
      }
    );

  document.dispatchEvent(
    eventoFimCombate
  );

}

function processarResultadoCombate(
  evento
) {

  const idResultado =
    evento.detail
      ?.resultado;

  const resultado =
    cenaAtual
      .combate
      ?.resultados
      ?.[idResultado];

  if (
    !resultado
  ) {

    console.warn(
      "Consequência de combate não encontrada:",
      idResultado
    );

    return;

  }

  setTimeout(
    function() {

      exibirTelaAventura();

      exibirContexto(
        resultado.contexto
      );

      ocultarEscolhas();

      solicitacaoTeste.textContent =
        "";

      solicitacaoTeste.hidden =
        true;

    },
    1200
  );

}

function verificarCombateDaCena(
  cena
) {

  if (
    !cena.combate
  ) {
    return;
  }

  if (
    estadoAtualJogo
      .combateAtual
      ?.status ===
      "ativo"
  ) {
    return;
  }

  const participanteJogador =
    criarParticipanteJogadorCombate(
      cena.combate.jogador
    );

  if (
    !participanteJogador
  ) {
    return;
  }

  const participantesInimigos =
    criarParticipantesNpcsCombate(
      cena.combate.inimigos
    );

  const participantes = [

    participanteJogador,
    ...participantesInimigos

  ];

  const configuracaoCombate = {

    id:
      `${aventuraAtual.id}-` +
      `${estadoAtualJogo.progresso.cenaId}`,

    participantes:
      participantes

  };

  iniciarCombateDaAventura(
    configuracaoCombate
  );

}

botaoRecolherFicha.addEventListener(
  "click",
  alternarFicha
);

botaoRecolherPainelExplicativo.addEventListener(
  "click",
  alternarPainelExplicativo
);

listaEscolhas.addEventListener(
  "click",
  selecionarEscolha
);

tabuleiroCombate.addEventListener(
  "click",
  selecionarTokenJogador
);

tabuleiroCombate.addEventListener(
  "click",
  moverTokenSelecionado
);

tabuleiroCombate.addEventListener(
  "pointerdown",
  iniciarArrasteToken
);

tabuleiroCombate.addEventListener(
  "pointermove",
  continuarArrasteToken
);

tabuleiroCombate.addEventListener(
  "pointerup",
  finalizarArrasteToken
);

tabuleiroCombate.addEventListener(
  "pointercancel",
  finalizarArrasteToken
);

tabuleiroCombate.addEventListener(
  "click",
  selecionarAlvoCombate
);

acoesCombate.addEventListener(
  "click",
  selecionarAtaqueCombate
);

botaoEncerrarTurno.addEventListener(
  "click",
  encerrarTurnoAtual
);

exibirCena(
  aventuraAtual,
  cenaAtual
);

document.addEventListener(
  "rolagemConcluida",
  receberResultadoRolagem
);

document.addEventListener(
  "combateEncerrado",
  processarResultadoCombate
);

visualizacaoCombate.addEventListener(
  "wheel",
  controlarZoomCombate,
  {
    passive:
      false
  }
);

visualizacaoCombate.addEventListener(
  "pointerdown",
  iniciarArrasteCamera
);

visualizacaoCombate.addEventListener(
  "pointermove",
  continuarArrasteCamera
);

visualizacaoCombate.addEventListener(
  "pointerup",
  finalizarArrasteCamera
);

visualizacaoCombate.addEventListener(
  "pointercancel",
  finalizarArrasteCamera
);

window.addEventListener(
  "resize",
  function() {

    cameraCombate.zoom =
      Math.max(
        obterZoomMinimoVisivel(),
        cameraCombate.zoom
      );

    limitarCameraCombate();
    atualizarCameraCombate();

  }
);