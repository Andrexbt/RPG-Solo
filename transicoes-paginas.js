// =====================================================
// Transições entre páginas
// -----------------------------------------------------
// Aplica uma animação breve antes de navegar para links
// internos do próprio site.
// =====================================================

// Carrega a folha responsiva específica do criador por último,
// garantindo que ela tenha prioridade sobre regras antigas.
if (window.location.pathname.endsWith("criacao-personagem.html")) {
  const folhaResponsiva = document.createElement("link");
  folhaResponsiva.rel = "stylesheet";
  folhaResponsiva.href = "criacao-personagem-responsivo.css";
  document.head.appendChild(folhaResponsiva);
}

document.addEventListener("DOMContentLoaded", function() {
  const links = document.querySelectorAll("a[href]");

  links.forEach(function(link) {
    link.addEventListener("click", function(evento) {
      const href = link.getAttribute("href");

      if (href === null) {
        return;
      }

      const ehAncoraDaMesmaPagina = href.startsWith("#");
      const abreNovaAba = link.target === "_blank";
      const ehDownload = link.hasAttribute("download");
      const ehLinkExterno = href.startsWith("http") || href.startsWith("mailto:");
      const cliqueComAtalho =
        evento.ctrlKey === true ||
        evento.metaKey === true ||
        evento.shiftKey === true ||
        evento.altKey === true;

      if (
        ehAncoraDaMesmaPagina === true ||
        abreNovaAba === true ||
        ehDownload === true ||
        ehLinkExterno === true ||
        cliqueComAtalho === true
      ) {
        return;
      }

      evento.preventDefault();

      document.body.classList.add("saindo-pagina");

      setTimeout(function() {
        window.location.href = href;
      }, 340);
    });
  });
});