"use strict";

const aventuraAtual = bancoAventuras.aFuga;
const idCenaInicial = aventuraAtual.cenaInicial;
let cenaAtual = aventuraAtual.cenas[idCenaInicial];
let testePendente = null;
let caminhoAtual = null;
let etapaAtual = null;
let escolhasAtuais = [];

const tituloAventura =document.querySelector("#tituloAventura");
const contextoCena =document.querySelector("#contextoCena");
const listaEscolhas = document.querySelector("#listaEscolhas");
const tituloEscolhas = document.querySelector("#tituloEscolhas");

const painelFicha = document.querySelector("#painelFicha");
const painelExplicativo = document.querySelector("#painelExplicativo");

const botaoRecolherFicha = document.querySelector("#botaoRecolherFicha");
const botaoRecolherPainelExplicativo = document.querySelector("#botaoRecolherPainelExplicativo");

const layoutAventura = document.querySelector(".layout-aventura");

const solicitacaoTeste = document.querySelector("#solicitacaoTeste");

const areaEscolhas = document.querySelector(".area-escolhas");

function alternarFicha() {

  layoutAventura.classList.toggle("ficha-recolhida");

}

function alternarPainelExplicativo() {

  layoutAventura.classList.toggle("painelExplicativo-recolhido");

}

function exibirEscolhas(escolhas) {

  escolhasAtuais = escolhas;

  const possuiEscolhas = escolhas.length > 0;

  areaEscolhas.hidden = !possuiEscolhas;

  tituloEscolhas.hidden = !possuiEscolhas;

  listaEscolhas.hidden = !possuiEscolhas;

  listaEscolhas.innerHTML =
    "";

    for (const escolha of escolhas) {

    const botaoEscolha =
      document.createElement(
        "button"
      );


    botaoEscolha.type =
      "button";


    botaoEscolha.classList.add(
      "botao-escolha"
    );


    botaoEscolha.dataset.idEscolha =
      escolha.id;


    botaoEscolha.textContent =
      escolha.texto;


    listaEscolhas.append(
      botaoEscolha
    );

    }
}

function exibirContexto(contexto) {

  contextoCena.replaceChildren();


  const paragrafos =
    Array.isArray(contexto)
      ? contexto
      : [contexto];


  for (const texto of paragrafos) {

    const paragrafo =
      document.createElement(
        "p"
      );


    paragrafo.textContent =
      texto;


    contextoCena.append(
      paragrafo
    );

  }

}

function exibirCena(aventura,cena) {

  tituloAventura.textContent = aventura.titulo;

  exibirContexto(cena.contexto);

  solicitacaoTeste.textContent ="";

  solicitacaoTeste.hidden = true;

  exibirEscolhas(cena.escolhas);
}

function ocultarEscolhas() {

  areaEscolhas.hidden =
    true;

}

function iniciarCaminho(
  escolha
) {

  caminhoAtual =
    escolha;


  iniciarEtapa(
    escolha.etapaInicial
  );

}

function iniciarEtapa(
  idEtapa
) {

  const etapa =
    caminhoAtual.etapas[
      idEtapa
    ];


  if (!etapa) {

    console.warn(
      "Etapa não encontrada:",
      idEtapa
    );

    return;

  }


  etapaAtual =
    etapa;

    exibirContexto( etapa.descricao);


  testePendente =
    etapa.teste;


  ocultarEscolhas();


  solicitacaoTeste.textContent =
    etapa.instrucao;


  solicitacaoTeste.hidden =
    false;


  console.log(
    "Etapa atual:",
    etapaAtual
  );

}

function resolverTeste(resultadoRolagem) {

  const testeResolvido = testePendente;

  const testeFoiBemSucedido = resultadoRolagem.total >= testeResolvido.dificuldade;

  const tipoResultado =
    testeFoiBemSucedido
      ? "sucesso"
      : "fracasso";

  const consequencia = etapaAtual.resultados[tipoResultado];

  testePendente = null;

  solicitacaoTeste.textContent = "";

  solicitacaoTeste.hidden = true;

  exibirContexto(consequencia.texto);

  console.log("Consequência:",consequencia);

  if (consequencia.escolhas) {

    exibirEscolhas(
      consequencia.escolhas
    );
    return;
  }

  if (
    consequencia.voltarParaEscolhas) {

      if (
  consequencia.removerEscolha &&
  caminhoAtual
) {

  cenaAtual.escolhas =
    cenaAtual.escolhas.filter(
      function (escolha) {

        return escolha.id !==
          caminhoAtual.id;

      }
    );

}

    caminhoAtual =
      null;


    etapaAtual =
      null;

    exibirEscolhas(cenaAtual.escolhas);

    return;
    }

    if (consequencia.proximaEtapa) {

    exibirEscolhas(
      [

        {

          id:
            "continuarEtapa",

          texto:
            "Continuar.",

          proximaEtapa:
            consequencia.proximaEtapa

        }

      ]
    );

    return;

  }


  if (consequencia.proximaCena) {

    exibirEscolhas(
      [

        {

          id:
            "continuarCena",

          texto:
            "Continuar.",

          proximaCena:
            consequencia.proximaCena

        }

      ]
    );

    return;

  }


  console.warn(
    "A consequência não possui um destino:",
    consequencia
  );

}

function receberResultadoRolagem(evento) {

  if (!testePendente) {return;}

  const resultadoRolagem = evento.detail;

  console.log("Resultado recebido pela aventura:", resultadoRolagem);

  resolverTeste(resultadoRolagem);
}

function selecionarEscolha(evento) {

  if (testePendente) {return;}

  const botaoEscolha = evento.target.closest(".botao-escolha");

  if (!botaoEscolha) {return;}

  const idEscolha = botaoEscolha.dataset.idEscolha;

  const escolhaSelecionada =
    escolhasAtuais.find(
      function (escolha) {

        return escolha.id === idEscolha;

      }
    );

    if (!escolhaSelecionada) {

  console.warn(
    "Escolha não encontrada:",
    idEscolha
  );

  return;

 }


  console.log(
    "Escolha selecionada:",
    escolhaSelecionada
  );

  if (escolhaSelecionada.etapaInicial) {

  iniciarCaminho(escolhaSelecionada);

  return;

  }

  if (escolhaSelecionada.proximaEtapa) {

  iniciarEtapa(escolhaSelecionada.proximaEtapa);

  return;

  }

  if (!escolhaSelecionada.proximaCena) {

  console.log( "Esta escolha ainda não possui uma próxima cena.");

  return;

  }


  mudarCena(
  escolhaSelecionada.proximaCena
  );

}

function mudarCena(idProximaCena) {

  const proximaCena = aventuraAtual.cenas[idProximaCena];


  if (!proximaCena) {

    console.warn(
      "Cena não encontrada:",
      idProximaCena
    );

    return;

  }


  cenaAtual =
    proximaCena;

    caminhoAtual =
  null;


etapaAtual =
  null;


testePendente =
  null;


  exibirCena(
    aventuraAtual,
    cenaAtual
  );

}

botaoRecolherFicha.addEventListener(
  "click",
  alternarFicha
);

botaoRecolherPainelExplicativo.addEventListener(
  "click",
  alternarPainelExplicativo
);

listaEscolhas.addEventListener("click",selecionarEscolha);

exibirCena(aventuraAtual,cenaAtual);

document.addEventListener("rolagemConcluida",receberResultadoRolagem);