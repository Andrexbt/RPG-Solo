"use strict";

const cameraCombate = {
  deslocamentoX: 0,
  deslocamentoY: 0,
  zoom: 1,
  zoomMinimo: 0,
  zoomMaximo: 1,
};

let arrasteCamera = null;

function obterZoomMinimoVisivel() {
  if (
    visualizacaoCombate.clientWidth === 0 ||
    visualizacaoCombate.clientHeight === 0 ||
    tabuleiroCombate.offsetWidth === 0 ||
    tabuleiroCombate.offsetHeight === 0
  ) {
    return cameraCombate.zoomMinimo;
  }

  const zoomHorizontal =
    visualizacaoCombate.clientWidth /
    tabuleiroCombate.offsetWidth;

  const zoomVertical =
    visualizacaoCombate.clientHeight /
    tabuleiroCombate.offsetHeight;

  return Math.min(
    Math.max(
      zoomHorizontal,
      zoomVertical,
    ),
    cameraCombate.zoomMaximo,
  );
}

function enquadrarParticipantesCombate(
  combate,
) {
  const participantesComPosicao =
    combate?.participantes?.filter(
      function (participante) {
        return (
          participante.posicao &&
          Number.isFinite(
            participante.posicao.coluna,
          ) &&
          Number.isFinite(
            participante.posicao.linha,
          )
        );
      },
    ) ?? [];

  const jogador =
    participantesComPosicao.find(
      function encontrarJogador(
        participante,
      ) {
        return participante.tipo ===
          "jogador";
      },
    );

  const participantes = jogador
    ? participantesComPosicao.filter(
        function manterAreaInicial(
          participante,
        ) {
          const distanciaColuna =
            Math.abs(
              participante.posicao.coluna -
                jogador.posicao.coluna,
            );

          const distanciaLinha =
            Math.abs(
              participante.posicao.linha -
                jogador.posicao.linha,
            );

          return (
            participante === jogador ||
            Math.max(
              distanciaColuna,
              distanciaLinha,
            ) <= 6
          );
        },
      )
    : participantesComPosicao;

  if (participantes.length === 0) {
    cameraCombate.zoom =
      obterZoomMinimoVisivel();

    cameraCombate.deslocamentoX = 0;
    cameraCombate.deslocamentoY = 0;

    atualizarCameraCombate();
    return;
  }

  const tamanhoCelula = 140;

  const colunas = participantes.map(
    function (participante) {
      return participante.posicao.coluna;
    },
  );

  const linhas = participantes.map(
    function (participante) {
      return participante.posicao.linha;
    },
  );

  const menorColuna = Math.min(...colunas);
  const maiorColuna = Math.max(...colunas);
  const menorLinha = Math.min(...linhas);
  const maiorLinha = Math.max(...linhas);

  /*
   * Espaço adicional ao redor dos participantes.
   * No início, enquadra a vizinhança útil do jogador
   * sem revelar o mapa inteiro ou inimigos distantes.
   */
  const margem =
    tamanhoCelula *
    (jogador ? 1.5 : 2.5);

  const esquerdaGrupo =
    (menorColuna - 1) *
      tamanhoCelula -
    margem;

  const direitaGrupo =
    maiorColuna *
      tamanhoCelula +
    margem;

  const topoGrupo =
    (menorLinha - 1) *
      tamanhoCelula -
    margem;

  const baseGrupo =
    maiorLinha *
      tamanhoCelula +
    margem;

  const larguraGrupo =
    direitaGrupo - esquerdaGrupo;

  const alturaGrupo =
    baseGrupo - topoGrupo;

  /*
   * Reserva espaço horizontal para o painel
   * de ações que fica no lado esquerdo.
   */
  const margemPainelEsquerdo =
    Math.min(
      340,
      visualizacaoCombate.clientWidth *
        0.28,
    );

  const margemDireita = 24;
  const margemSuperior = 110;
  const margemInferior = 24;

  const larguraUtil =
    visualizacaoCombate.clientWidth -
    margemPainelEsquerdo -
    margemDireita;

  const alturaUtil =
    visualizacaoCombate.clientHeight -
    margemSuperior -
    margemInferior;

  const zoomHorizontal =
    larguraUtil / larguraGrupo;

  const zoomVertical =
    alturaUtil / alturaGrupo;

  cameraCombate.zoom = Math.min(
    cameraCombate.zoomMaximo,
    Math.max(
      obterZoomMinimoVisivel(),
      Math.min(
        zoomHorizontal,
        zoomVertical,
      ),
    ),
  );

  const centroGrupoX =
    (esquerdaGrupo + direitaGrupo) / 2;

  const centroGrupoY =
    (topoGrupo + baseGrupo) / 2;

  const centroTabuleiroX =
    tabuleiroCombate.offsetWidth / 2;

  const centroTabuleiroY =
    tabuleiroCombate.offsetHeight / 2;

  const centroAreaUtilX =
    margemPainelEsquerdo +
    larguraUtil / 2;

  const centroAreaUtilY =
    margemSuperior +
    alturaUtil / 2;

  const centroTelaX =
    visualizacaoCombate.clientWidth / 2;

  const centroTelaY =
    visualizacaoCombate.clientHeight / 2;

  cameraCombate.deslocamentoX =
    (
      centroTabuleiroX -
      centroGrupoX
    ) *
      cameraCombate.zoom +
    (
      centroAreaUtilX -
      centroTelaX
    );

  cameraCombate.deslocamentoY =
    (
      centroTabuleiroY -
      centroGrupoY
    ) *
      cameraCombate.zoom +
    (
      centroAreaUtilY -
      centroTelaY
    );

  limitarCameraCombate();
  atualizarCameraCombate();
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
      ) / 2,
    );

  const limiteVertical =
    Math.max(
      0,
      (
        alturaTabuleiro -
        visualizacaoCombate.clientHeight
      ) / 2,
    );

  cameraCombate.deslocamentoX =
    Math.min(
      limiteHorizontal,
      Math.max(
        -limiteHorizontal,
        cameraCombate.deslocamentoX,
      ),
    );

  cameraCombate.deslocamentoY =
    Math.min(
      limiteVertical,
      Math.max(
        -limiteVertical,
        cameraCombate.deslocamentoY,
      ),
    );
}

function atualizarCameraCombate() {
  cameraCombateElemento.style.setProperty(
    "--camera-x",
    `${cameraCombate.deslocamentoX}px`,
  );

  cameraCombateElemento.style.setProperty(
    "--camera-y",
    `${cameraCombate.deslocamentoY}px`,
  );

  cameraCombateElemento.style.setProperty(
    "--camera-zoom",
    cameraCombate.zoom,
  );

  const espessuraLinhaGrid =
  1.1 / cameraCombate.zoom;

  const zoomInicioGrid = 0.35;
const zoomCompletoGrid = 0.55;

const progressoGrid = Math.min(
  1,
  Math.max(
    0,
    (
      cameraCombate.zoom -
      zoomInicioGrid
    ) /
    (
      zoomCompletoGrid -
      zoomInicioGrid
    ),
  ),
);

const opacidadeGrid =
  0.32 * progressoGrid;

cameraCombateElemento.style.setProperty(
  "--opacidade-grid",
  opacidadeGrid.toFixed(3),
);

  cameraCombateElemento.style.setProperty(
    "--espessura-linha-grid",
    `${espessuraLinhaGrid}px`,
  );
}

function controlarZoomCombate(evento) {
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
          novoZoom.toFixed(2),
        ),
      ),
    );

  limitarCameraCombate();
  atualizarCameraCombate();
}

function iniciarArrasteCamera(evento) {
  const iniciouEmToken =
    evento.target.closest(
      ".token-combate",
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
      cameraCombate.deslocamentoY,
  };

  visualizacaoCombate.setPointerCapture(
    evento.pointerId,
  );

  visualizacaoCombate.classList.add(
    "camera-arrastando",
  );

  evento.preventDefault();
}

function continuarArrasteCamera(evento) {
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

function finalizarArrasteCamera(evento) {
  if (
    !arrasteCamera ||
    evento.pointerId !==
      arrasteCamera.ponteiroId
  ) {
    return;
  }

  if (
    visualizacaoCombate.hasPointerCapture(
      evento.pointerId,
    )
  ) {
    visualizacaoCombate.releasePointerCapture(
      evento.pointerId,
    );
  }

  visualizacaoCombate.classList.remove(
    "camera-arrastando",
  );

  arrasteCamera = null;
}
