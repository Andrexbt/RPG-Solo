"use strict";

function exibirEscolhas(escolhas = []) {
  NarradorAventura.removerRespiroNarrativo();

  escolhasAtuais = Array.isArray(escolhas) ? escolhas : [];

  listaEscolhas.replaceChildren();

  for (const escolha of escolhasAtuais) {
    const botaoEscolha = document.createElement("button");

    botaoEscolha.type = "button";
    botaoEscolha.className = "botao-escolha";
    botaoEscolha.dataset.idEscolha = escolha.id;

    NarradorAventura.preencherElementoComParagrafos(
      botaoEscolha,
      escolha.texto ?? "",
    );

    listaEscolhas.append(botaoEscolha);
  }

  const possuiEscolhas = escolhasAtuais.length > 0;

  areaEscolhas.hidden = !possuiEscolhas;
  listaEscolhas.hidden = !possuiEscolhas;
}

function ocultarEscolhas() {
  areaEscolhas.hidden = true;
}

async function exibirContexto(contexto) {
  if (contexto === undefined || contexto === null || contexto === "") {
    return;
  }

  await NarradorAventura.adicionarNarracao(contexto);
}

function condicaoNarrativaAtendida(condicao) {
  if (!condicao) {
    return true;
  }

  if (condicao.flag) {
    return estadoAtualJogo.progresso.flags[condicao.flag] === condicao.igualA;
  }

  return false;
}

function obterContextoCena(cena) {
  const contexto = [];

  for (const variacao of cena.variacoes ?? []) {
    if (!condicaoNarrativaAtendida(variacao.se)) {
      continue;
    }

    if (Array.isArray(variacao.contexto)) {
      contexto.push(...variacao.contexto);
    } else if (variacao.contexto) {
      contexto.push(variacao.contexto);
    }
  }

  if (Array.isArray(cena.contexto)) {
    contexto.push(...cena.contexto);
  } else if (cena.contexto) {
    contexto.push(cena.contexto);
  }

  return contexto;
}

async function exibirCena(aventura, cena) {
  tituloAventura.textContent = aventura.titulo;

  ocultarEscolhas();

  await exibirContexto(obterContextoCena(cena));

  if (cena.combate) {
    verificarCombateDaCena(cena);
    return;
  }

  if (cena.etapaInicial) {
    await iniciarEtapa(cena.etapaInicial);
    return;
  }

  exibirEscolhas(
    obterEscolhasDisponiveis(
      estadoAtualJogo.progresso.cenaId,
      cena.escolhas ?? [],
    ),
  );
}

async function iniciarEtapa(idEtapa) {
  const etapa = cenaAtual?.etapas?.[idEtapa];

  if (!etapa) {
    console.warn("Etapa não encontrada na cena atual:", idEtapa);
    return;
  }

  estadoAtualJogo.progresso.etapaId = idEtapa;

  ocultarEscolhas();

  await exibirContexto(etapa.descricao);

  if (etapa.pendenciaFonte && !etapa.teste) {
    await MotorAventura.mostrarPendenciaFonte(etapa);
    return;
  }

  if (etapa.ataqueNpc) {
    await MotorAventura.aplicarConsequencia({
      ataqueNpc: etapa.ataqueNpc,
    });

    return;
  }

  if (etapa.teste) {
    await MotorAventura.iniciarTeste({
      teste: etapa.teste,
      resultados: etapa.resultados,
      instrucao: etapa.instrucao,
      origem: etapa,
    });

    return;
  }

  if (Array.isArray(etapa.escolhas) && etapa.escolhas.length > 0) {
    exibirEscolhas(etapa.escolhas);
    return;
  }

  if (etapa.proximaEtapa) {
    await iniciarEtapa(etapa.proximaEtapa);
    return;
  }

  if (etapa.proximaCena) {
    mudarCena(etapa.proximaCena);
    return;
  }

  console.warn("Etapa concluída sem destino:", idEtapa, etapa);
}

async function confirmarEscolhaVisualmente(botaoEscolha) {
  const botoes = listaEscolhas.querySelectorAll(".botao-escolha");

  for (const botao of botoes) {
    if (botao === botaoEscolha) {
      botao.classList.add("escolha-confirmada");
    } else {
      botao.classList.add("escolha-descartada");
    }

    botao.disabled = true;
  }

  await esperar(300);

  areaEscolhas.classList.add("area-escolhas-saindo");

  await esperar(220);

  ocultarEscolhas();

  areaEscolhas.classList.remove("area-escolhas-saindo");

  for (const botao of botoes) {
    botao.classList.remove(
      "escolha-confirmada",
      "escolha-descartada",
    );
  }
}

async function selecionarEscolha(evento) {
  if (MotorAventura.temTesteAtivo()) {
    return;
  }

  const botaoEscolha = evento.target.closest(".botao-escolha");

  if (!botaoEscolha) {
    return;
  }

  const escolhaSelecionada = escolhasAtuais.find(
    (escolha) => escolha.id === botaoEscolha.dataset.idEscolha,
  );

  if (!escolhaSelecionada) {
    console.warn("Escolha não encontrada:", botaoEscolha.dataset.idEscolha);
    return;
  }

  await confirmarEscolhaVisualmente(botaoEscolha);

  if (typeof escolhaSelecionada.__acaoMotor === "function") {
    await escolhaSelecionada.__acaoMotor();
    return;
  }

  if (escolhaSelecionada.registrarNarrativa !== false) {
    NarradorAventura.adicionarEscolhaRealizada(escolhaSelecionada);
    await esperar(250);
  }

  if (
    escolhaSelecionada.descricao !== undefined &&
    escolhaSelecionada.descricao !== null &&
    escolhaSelecionada.descricao !== ""
  ) {
    await exibirContexto(escolhaSelecionada.descricao);
  }

  if (escolhaSelecionada.memorias) {
    registrarMemorias(escolhaSelecionada.memorias);
  }

  if (escolhaSelecionada.etapaInicial) {
    estadoAtualJogo.progresso.caminhoId = escolhaSelecionada.id;
    await iniciarEtapa(escolhaSelecionada.etapaInicial);
    return;
  }

  if (escolhaSelecionada.proximaEtapa) {
    await iniciarEtapa(escolhaSelecionada.proximaEtapa);
    return;
  }

  if (escolhaSelecionada.proximaCena) {
    mudarCena(escolhaSelecionada.proximaCena);
    return;
  }

  console.warn("A escolha não possui destino:", escolhaSelecionada);
}

function mudarCena(idProximaCena) {
  const proximaCena = aventuraAtual.cenas[idProximaCena];

  if (!proximaCena) {
    console.warn("Cena não encontrada:", idProximaCena);
    return;
  }

  cenaAtual = proximaCena;
  estadoAtualJogo.progresso.cenaId = idProximaCena;
  estadoAtualJogo.progresso.caminhoId = null;
  estadoAtualJogo.progresso.etapaId = null;

  MotorAventura.cancelarTeste();

  void exibirCena(aventuraAtual, cenaAtual);
}
