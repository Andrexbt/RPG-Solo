"use strict";

(function configurarAreaMestre() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
    window.location.hostname,
  );
  const ferramentaDev = document.querySelector("[data-ferramenta-dev]");

  if (ambienteLocal) {
    ferramentaDev?.removeAttribute("hidden");
  }
})();
