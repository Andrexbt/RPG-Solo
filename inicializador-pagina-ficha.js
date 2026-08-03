"use strict";

// =====================================================
// Inicializador de páginas que utilizam a ficha
// -----------------------------------------------------
// A página informa seu controlador no atributo
// data-controlador. O controlador só é carregado depois
// que o componente da ficha estiver pronto.
// =====================================================

(function () {
  const scriptInicializador = document.currentScript;
  const caminhoControlador = scriptInicializador?.dataset.controlador;

  function carregarControlador() {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");

      script.src = caminhoControlador;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener(
        "error",
        function () {
          reject(new Error("Não foi possível carregar o controlador: " + caminhoControlador));
        },
        { once: true },
      );

      document.head.appendChild(script);
    });
  }

  async function iniciarPagina() {
    if (!caminhoControlador) {
      throw new Error("A página não informou seu controlador da ficha.");
    }

    await window.FichaPersonagem.iniciarComponente();
    await carregarControlador();
  }

  function iniciarQuandoDocumentoEstiverPronto() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", iniciarPagina, { once: true });
      return;
    }

    iniciarPagina();
  }

  iniciarQuandoDocumentoEstiverPronto();
})();
