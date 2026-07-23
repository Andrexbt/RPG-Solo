"use strict";

const cenaInicial = {

  titulo: "A Fuga",

  contexto:
    "Por algum motivo, você está fugindo da cidade onde viveu pelos últimos 4 anos.",

  objetivo:
    "Escapar da cidade."
};

const painelFicha = document.querySelector("#painelFicha");
const painelExplicativo = document.querySelector("#painelExplicativo");

const botaoRecolherFicha = document.querySelector("#botaoRecolherFicha");
const botaoRecolherPainelExplicativo = document.querySelector("#botaoRecolherPainelExplicativo");

const layoutAventura = document.querySelector(".layout-aventura");

function alternarFicha() {

  layoutAventura.classList.toggle("ficha-recolhida");

}

function alternarPainelExplicativo() {

  layoutAventura.classList.toggle("painelExplicativo-recolhido");

}

botaoRecolherFicha.addEventListener(
  "click",
  alternarFicha
);

botaoRecolherPainelExplicativo.addEventListener(
  "click",
  alternarPainelExplicativo
);