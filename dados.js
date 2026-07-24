"use strict";


function rolarDado(numeroDeFaces) {

  const resultado =
    Math.floor(
      Math.random() * numeroDeFaces
    ) + 1;

  return resultado;
}

function rolarGrupoDeDados(
  quantidade,
  numeroDeFaces) {

  const resultados = [];

  for (
    let indice = 0;
    indice < quantidade;
    indice += 1) {

    const resultado =
      rolarDado(numeroDeFaces);

    resultados.push(resultado);
    }

    return resultados;
}

function somarResultados(resultados) {

  let total = 0;

  for (const resultado of resultados) {

    total += resultado;
  }

  return total;
}

function realizarRolagem(
  quantidade,
  numeroDeFaces,
  modificador = 0) {

  const resultados =
    rolarGrupoDeDados(
      quantidade,
      numeroDeFaces
    );

  const subtotal =
    somarResultados(resultados);

  const total =
    subtotal + modificador;

  return {

    quantidade:
      quantidade,

    numeroDeFaces:
      numeroDeFaces,

    resultados:
      resultados,

    subtotal:
      subtotal,

    modificador:
      modificador,

    total:
      total
  };
}

const rolagemCompostaExemplo = {

  gruposDeDados: [
    {
      quantidade:
        2,

      numeroDeFaces:
        6
    },

    {
      quantidade:
        1,

      numeroDeFaces:
        4
    }
  ],

  modificador:
    3
};




console.log(
  "Rolagem composta:",
  rolagemCompostaExemplo
);