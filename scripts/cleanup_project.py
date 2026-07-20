from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TEXT_EXTENSIONS = {".html", ".css", ".js"}


def normalize_text_files() -> None:
    """Remove espaços finais, excesso de linhas vazias e garante newline final."""
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if ".git" in path.parts:
            continue

        original = path.read_text(encoding="utf-8-sig")
        lines = [line.rstrip() for line in original.replace("\r\n", "\n").split("\n")]
        normalized = "\n".join(lines)
        normalized = re.sub(r"\n{4,}", "\n\n\n", normalized).rstrip() + "\n"

        if normalized != original:
            path.write_text(normalized, encoding="utf-8")


def clean_ficha_html() -> None:
    path = ROOT / "ficha-personagem.html"
    if not path.exists():
        return

    html = path.read_text(encoding="utf-8")
    html = re.sub(r'class\s*=\s*"', 'class="', html)
    html = re.sub(r"\n\s*<li></li>", "", html)

    # O fragmento precisa fechar .ficha, .ficha-corpo e .ficha-componente.
    open_divs = len(re.findall(r"<div(?:\s|>)", html))
    close_divs = html.count("</div>")
    missing_divs = max(0, open_divs - close_divs)

    if missing_divs:
        final_section = html.rfind("</section>")
        if final_section != -1:
            closures = "".join("  </div>\n" for _ in range(missing_divs))
            html = html[:final_section] + closures + html[final_section:]

    path.write_text(html.rstrip() + "\n", encoding="utf-8")


def patch_ficha_javascript() -> None:
    path = ROOT / "ficha-personagem.js"
    if not path.exists():
        return

    source = path.read_text(encoding="utf-8-sig")
    marker = "// Componente visual da ficha"
    marker_index = source.find(marker)

    if marker_index == -1:
        raise RuntimeError("Marcador do componente visual não encontrado em ficha-personagem.js")

    section_start = source.rfind("  // =====================================================", 0, marker_index)
    if section_start == -1:
        raise RuntimeError("Início da seção visual não encontrado")

    prefix = source[:section_start].rstrip()

    component_section = r'''

  // =====================================================
  // 10. Componente visual e interface da ficha
  // -----------------------------------------------------
  // Carrega o fragmento HTML, configura o botão retrátil e
  // só então inicia o script específico da página atual.
  // =====================================================

  function configurarFichaRetratil(ficha) {
    const botao = ficha.querySelector(".botao-retrair-ficha");
    const corpo = ficha.querySelector(".ficha-corpo");

    if (botao === null || corpo === null) {
      return;
    }

    botao.addEventListener("click", function() {
      const ficouRetraida = ficha.classList.toggle("ficha-retraida");

      botao.setAttribute("aria-expanded", String(ficouRetraida === false));
      botao.setAttribute(
        "aria-label",
        ficouRetraida
          ? "Expandir ficha do personagem"
          : "Recolher ficha do personagem"
      );
    });
  }

  async function carregarHtmlFichaPersonagem() {
    const areasFicha = document.querySelectorAll("[data-ficha-personagem]");

    if (areasFicha.length === 0) {
      return [];
    }

    const caminhoFicha = new URL("ficha-personagem.html", document.baseURI);
    const resposta = await fetch(caminhoFicha);

    if (resposta.ok === false) {
      throw new Error(
        "Não foi possível carregar ficha-personagem.html. Status: " +
        resposta.status
      );
    }

    const htmlFicha = await resposta.text();
    const fichasInseridas = [];

    areasFicha.forEach(function(areaFicha) {
      areaFicha.innerHTML = htmlFicha;

      const fichaInserida = areaFicha.querySelector("[data-ficha-componente]");

      if (fichaInserida !== null) {
        configurarFichaRetratil(fichaInserida);
        fichasInseridas.push(fichaInserida);
      }
    });

    document.dispatchEvent(
      new CustomEvent("fichaPersonagemCarregada", {
        detail: { fichas: fichasInseridas }
      })
    );

    return fichasInseridas;
  }

  function carregarScriptDepoisDaFicha(caminhoScript) {
    return new Promise(function(resolve, reject) {
      const caminhoAbsoluto = new URL(caminhoScript, document.baseURI).href;
      const scriptExistente = Array.from(document.scripts).find(function(script) {
        return script.src === caminhoAbsoluto;
      });

      if (scriptExistente !== undefined) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = caminhoScript;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener(
        "error",
        function() {
          reject(new Error("Não foi possível carregar o script: " + caminhoScript));
        },
        { once: true }
      );

      document.head.appendChild(script);
    });
  }

  function obterScriptDaPaginaAtual() {
    const nomePagina = window.location.pathname.split("/").pop() || "index.html";
    const scriptsPorPagina = {
      "criacao-personagem.html": "criacao-personagem.js",
      "ver-personagem.html": "ver-personagem.js"
    };

    return scriptsPorPagina[nomePagina] || null;
  }

  async function iniciarComponenteFichaPersonagem() {
    const fichas = await carregarHtmlFichaPersonagem();
    const scriptDaPagina = obterScriptDaPaginaAtual();

    if (fichas.length > 0 && scriptDaPagina !== null) {
      await carregarScriptDepoisDaFicha(scriptDaPagina);
    }

    return fichas;
  }

  function iniciarQuandoDocumentoEstiverPronto() {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        function() {
          window.fichaPersonagemPronta = iniciarComponenteFichaPersonagem();
        },
        { once: true }
      );
      return;
    }

    window.fichaPersonagemPronta = iniciarComponenteFichaPersonagem();
  }

  window.FichaPersonagem.configurarFichaRetratil = configurarFichaRetratil;
  window.FichaPersonagem.carregarHtml = carregarHtmlFichaPersonagem;
  window.FichaPersonagem.iniciarComponente = iniciarComponenteFichaPersonagem;

  iniciarQuandoDocumentoEstiverPronto();
})();
'''

    path.write_text(prefix + component_section, encoding="utf-8")


def main() -> None:
    clean_ficha_html()
    patch_ficha_javascript()
    normalize_text_files()


if __name__ == "__main__":
    main()
