// =====================================================
// Transições entre páginas
// -----------------------------------------------------
// Aplica uma animação breve antes de navegar para links
// internos do próprio site.
// =====================================================

document.addEventListener("click", function (evento) {
  const link = evento.target.closest("a[href]");

  if (!link || evento.defaultPrevented) {
    return;
  }

  const href = link.getAttribute("href");

  if (href === null || href === "") {
    return;
  }

  const ehAncoraDaMesmaPagina = href.startsWith("#");
  const abreNovaAba = link.target === "_blank";
  const ehDownload = link.hasAttribute("download");
  const ehLinkExterno =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  const cliqueComAtalho =
    evento.ctrlKey ||
    evento.metaKey ||
    evento.shiftKey ||
    evento.altKey;

  if (
    ehAncoraDaMesmaPagina ||
    abreNovaAba ||
    ehDownload ||
    ehLinkExterno ||
    cliqueComAtalho
  ) {
    return;
  }

  evento.preventDefault();
  document.body.classList.add("saindo-pagina");

  window.setTimeout(function () {
    window.location.href = href;
  }, 340);
});
