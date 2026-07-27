"use strict";

const aventuraAtual = bancoAventuras.aFuga;
const estadoAtualJogo = window.estadoJogo;
const idCenaInicial = aventuraAtual.cenaInicial;
estadoAtualJogo.aventuraId = aventuraAtual.id;
estadoAtualJogo.progresso.cenaId = idCenaInicial;
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
const visualizacaoAventura = document.querySelector("#visualizacaoAventura");

const visualizacaoCombate = document.querySelector("#visualizacaoCombate");

const solicitacaoTeste = document.querySelector("#solicitacaoTeste");

const areaEscolhas = document.querySelector(".area-escolhas");

carregarNpcsDaAventura( aventuraAtual.id);

function alternarFicha() {

  layoutAventura.classList.toggle("ficha-recolhida");

}

function alternarPainelExplicativo() {

  layoutAventura.classList.toggle("painelExplicativo-recolhido");

}

function exibirTelaCombate() {

  visualizacaoAventura.hidden =
    true;

  visualizacaoCombate.hidden =
    false;

  layoutAventura.classList.add(
    "modo-combate"
  );

}

function exibirTelaAventura() {

  visualizacaoCombate.hidden =
    true;

  visualizacaoAventura.hidden =
    false;

  layoutAventura.classList.remove(
    "modo-combate"
  );

}

function iniciarCombateDaAventura(
  configuracao
) {

  const combate =
    SistemaCombate.iniciarCombate(
      configuracao
    );

  exibirTelaCombate();

  console.log(
    "Combate iniciado:",
    combate
  );

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

  const escolhasDisponiveis =
  obterEscolhasDisponiveis(
    estadoAtualJogo.progresso.cenaId,
    cena.escolhas
  );

exibirEscolhas(
  escolhasDisponiveis
);
}

function ocultarEscolhas() {

  areaEscolhas.hidden =
    true;

}

function iniciarCaminho(escolha) {

  caminhoAtual = escolha;

  estadoAtualJogo.progresso.caminhoId = escolha.id;

  iniciarEtapa(escolha.etapaInicial);

}

function obterAvisoTipoRolagem(teste) {

  if (teste.tipoRolagem === "vantagem") {
    return " Role 2d20 e use o maior resultado.";
  }

  if (teste.tipoRolagem === "desvantagem") {
    return " Role 2d20 e use o menor resultado.";
  }

  return "";

}

function iniciarEtapa(idEtapa) {

  const etapa = caminhoAtual.etapas[idEtapa];


  if (!etapa) {

    console.warn(
      "Etapa não encontrada:",
      idEtapa
    );

    return;

  }


  etapaAtual = etapa;

  estadoAtualJogo.progresso.etapaId = idEtapa;

    exibirContexto( etapa.descricao);


  testePendente = etapa.teste;

  estadoAtualJogo.testePendente = etapa.teste;


  ocultarEscolhas();


  const avisoTipoRolagem =
  obterAvisoTipoRolagem(etapa.teste);

solicitacaoTeste.textContent =
  etapa.instrucao +
  avisoTipoRolagem;


  solicitacaoTeste.hidden =
    false;


  console.log(
    "Etapa atual:",
    etapaAtual
  );

}

function resolverTeste(resultadoRolagem) {

  const testeResolvido = testePendente;

  const resultadoTeste =
  SistemaTestes.resolverTesteContraCd(
    resultadoRolagem,
    testeResolvido.dificuldade,
    testeResolvido.tipoRolagem || "normal"
  );

  const testeFoiBemSucedido = resultadoTeste.sucesso;

  const tipoResultado =
    testeFoiBemSucedido
      ? "sucesso"
      : "fracasso";

  const consequencia = etapaAtual.resultados[tipoResultado];

  testePendente = null;

  estadoAtualJogo.testePendente = null;

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

  registrarEscolhaRemovida(
  estadoAtualJogo.progresso.cenaId,
  caminhoAtual.id
);

}
const escolhasDisponiveis =
  obterEscolhasDisponiveis(
    estadoAtualJogo.progresso.cenaId,
    cenaAtual.escolhas
  );
    caminhoAtual =
      null;


    etapaAtual =
      null;

      estadoAtualJogo.progresso.caminhoId = null;
      estadoAtualJogo.progresso.etapaId = null;

    exibirEscolhas(
  escolhasDisponiveis
);

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


  cenaAtual = proximaCena;

  estadoAtualJogo.progresso.cenaId = idProximaCena;
  estadoAtualJogo.progresso.caminhoId = null;
  estadoAtualJogo.progresso.etapaId = null;
  estadoAtualJogo.testePendente = null;

   caminhoAtual = null;


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




console.log(
  "Estado inicial:",
  estadoAtualJogo
);