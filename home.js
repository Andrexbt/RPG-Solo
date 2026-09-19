const faixaDestaques = document.querySelector(".lista-experiencias");
const botaoAnterior = document.querySelector("#botaoDestaqueAnterior");
const botaoProximo = document.querySelector("#botaoDestaqueProximo");
const indicadores = document.querySelectorAll(
  ".indicadores-destaque [data-destaque]"
);

if (faixaDestaques && botaoAnterior && botaoProximo) {
  const totalDestaques = faixaDestaques.querySelectorAll(".experiencia").length;

  function irParaDestaque(indice) {
    faixaDestaques.scrollTo({
      left: indice * faixaDestaques.clientWidth,
      behavior: "smooth",
    });
  }

  function moverDestaque(direcao) {
    const indiceAtual = Math.round(
      faixaDestaques.scrollLeft / faixaDestaques.clientWidth
    );
    const proximoIndice =
      (indiceAtual + direcao + totalDestaques) % totalDestaques;

    irParaDestaque(proximoIndice);
  }

  botaoAnterior.addEventListener("click", () => moverDestaque(-1));
  botaoProximo.addEventListener("click", () => moverDestaque(1));

  indicadores.forEach((indicador) => {
    indicador.addEventListener("click", () => {
      irParaDestaque(Number(indicador.dataset.destaque));
    });
  });

  faixaDestaques.addEventListener("scroll", () => {
    const indiceAtual = Math.round(
      faixaDestaques.scrollLeft / faixaDestaques.clientWidth
    );

    indicadores.forEach((indicador) => {
      if (Number(indicador.dataset.destaque) === indiceAtual) {
        indicador.setAttribute("aria-current", "true");
      } else {
        indicador.removeAttribute("aria-current");
      }
    });
  });
}