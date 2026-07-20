from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_CRIACAO = ROOT / "criacao-personagem.css"
CSS_FICHA = ROOT / "ficha-personagem.css"

INICIO = """/* =====================================================
   Ficha lateral
   ===================================================== */"""

FIM = """/* =====================================================
   Etapa: atributos
   ===================================================== */"""


def mover_estilos_da_ficha() -> None:
    css_criacao = CSS_CRIACAO.read_text(encoding="utf-8")
    css_ficha = CSS_FICHA.read_text(encoding="utf-8")

    indice_inicio = css_criacao.find(INICIO)
    indice_fim = css_criacao.find(FIM, indice_inicio)

    if indice_inicio == -1:
        print("Os estilos da ficha já foram movidos ou o marcador inicial não existe.")
        return

    if indice_fim == -1:
        raise RuntimeError("Marcador final da seção da ficha não encontrado.")

    secao_ficha = css_criacao[indice_inicio:indice_fim].strip()

    if secao_ficha not in css_ficha:
        cabecalho = """/* =====================================================
   Estilos visuais da ficha
   -----------------------------------------------------
   Regras antes mantidas em criacao-personagem.css.
   ===================================================== */"""
        css_ficha = cabecalho + "\n\n" + secao_ficha + "\n\n" + css_ficha.lstrip()
        CSS_FICHA.write_text(css_ficha.rstrip() + "\n", encoding="utf-8")

    css_criacao = (
        css_criacao[:indice_inicio].rstrip()
        + "\n\n"
        + css_criacao[indice_fim:].lstrip()
    )
    CSS_CRIACAO.write_text(css_criacao.rstrip() + "\n", encoding="utf-8")


if __name__ == "__main__":
    mover_estilos_da_ficha()
