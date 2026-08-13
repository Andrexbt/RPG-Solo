"use strict";

window.SistemaQueda = (function () {
  function calcularDadosDanoQueda(distanciaMetros) {
    const distancia = Number(distanciaMetros) || 0;

    const quantidadeD6 = Math.min(
      20,
      Math.floor(distancia / 3),
    );

    return {
      quantidade: quantidadeD6,
      numeroDeFaces: 6,
    };
  }

  function rolarDanoQueda(distanciaMetros) {
  const grupoDano =
    calcularDadosDanoQueda(
      distanciaMetros
    );

  if (grupoDano.quantidade <= 0) {
    return {
      gruposRolados: [],
      subtotal: 0,
      modificador: 0,
      total: 0,
    };
  }

  return realizarRolagemComposta({
    gruposDeDados: [
      grupoDano,
    ],

    modificador: 0,
  });
}

  return {
    calcularDadosDanoQueda,
    rolarDanoQueda,
  };
})();