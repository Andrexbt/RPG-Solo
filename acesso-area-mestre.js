"use strict";

(function controlarAcessoAreaMestre() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);

  const paginaAtual = window.location.pathname.toLowerCase();
  const paginaPrivada = [
    "/area-mestre.html",
    "/editor-mensagens.html",
    "/laboratorio-dev.html",
  ].some((pagina) => paginaAtual.endsWith(pagina));

  if (!ambienteLocal && paginaPrivada) {
    window.location.replace("index.html");
    return;
  }

  if (!ambienteLocal) {
    return;
  }

  document.addEventListener("DOMContentLoaded", function liberarAcessosLocais() {
    for (const acesso of document.querySelectorAll("[data-acesso-area-mestre]")) {
      acesso.removeAttribute("hidden");
    }
  });
})();
