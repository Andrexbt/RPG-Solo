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
    1.25 / cameraCombate.zoom;

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