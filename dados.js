"use strict";

const botaoRolarDado = document.querySelector("#botaoRolarDado");

const resultadoDado = document.querySelector("#resultadoDado");

const campoModificadorDados =document.querySelector("#modificadorDados");

const listaGruposDados = document.querySelector("#listaGruposDados");

const botaoAdicionarGrupoDado = document.querySelector("#botaoAdicionarGrupoDado");

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
  numeroDeFaces) {

  const resultados =
    rolarGrupoDeDados(
      quantidade,
      numeroDeFaces
    );

  const total =
    somarResultados(resultados);

  return {

    quantidade:
      quantidade,

    numeroDeFaces:
      numeroDeFaces,

    resultados:
      resultados,

    total:
      total
  };
}

function rolarGruposDeDados(configuracao) {

  const resultadosDosGrupos = [];

  for (
    const grupoDeDados
    of configuracao.gruposDeDados) {

    const resultadoDoGrupo =
      realizarRolagem(
        grupoDeDados.quantidade,
        grupoDeDados.numeroDeFaces
      );

    resultadosDosGrupos.push(
      resultadoDoGrupo
    );
  }
  return resultadosDosGrupos;
}

function realizarRolagemComposta(configuracao){
  const gruposRolados = rolarGruposDeDados(configuracao);

  let subtotal = 0;

  for (const grupoRolado of gruposRolados) {
  subtotal += grupoRolado.total;
  }

  const modificador =
    configuracao.modificador;

  const total =
    subtotal + modificador;

  return {

    gruposRolados:
      gruposRolados,

    subtotal:
      subtotal,

    modificador:
      modificador,

    total:
      total
  };
}

function executarRolagemConfigurada() {

  const elementosDosGrupos = listaGruposDados.querySelectorAll(".grupo-dado");

  const gruposDeDados = [];

  for (const elementoDoGrupo of elementosDosGrupos) {

    const campoQuantidade = elementoDoGrupo.querySelector(".quantidade-dados");

    const campoNumeroDeFaces = elementoDoGrupo.querySelector(".numero-de-faces");

    const grupoDeDados = {
      quantidade: Number(campoQuantidade.value),
      numeroDeFaces: Number(campoNumeroDeFaces.value)
    };
    gruposDeDados.push(grupoDeDados);
  }

  const modificador = Number(campoModificadorDados.value);

  const configuracao = {
    gruposDeDados: gruposDeDados,
    modificador: modificador
  };

  const resultado = realizarRolagemComposta(configuracao);

  resultadoDado.textContent = resultado.total;

  console.log(
    "Rolagem solicitada pela interface:",
    resultado
  );
}

function adicionarGrupoDado() {

  const grupoOriginal =
    listaGruposDados.querySelector(
      ".grupo-dado"
    );


  const novoGrupo =
    grupoOriginal.cloneNode(true);


  const novaQuantidade =
    novoGrupo.querySelector(
      ".quantidade-dados"
    );


  const novoNumeroDeFaces =
    novoGrupo.querySelector(
      ".numero-de-faces"
    );


  novaQuantidade.value =
    1;


  novoNumeroDeFaces.value =
    20;


  listaGruposDados.append(
    novoGrupo
  );

}

botaoRolarDado.addEventListener("click", executarRolagemConfigurada);

botaoAdicionarGrupoDado.addEventListener("click",adicionarGrupoDado);