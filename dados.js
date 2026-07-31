"use strict";

const resultadoDado = document.querySelector("#resultadoDado");
const dadosDisponiveis = document.querySelectorAll(".dado-disponivel");
const camadaDadosLancados = document.querySelector("#camadaDadosLancados");

const estadoCaixaDados = {
  proximoId: 1,
  dadosLancados: [],
};

let arrasteDadoAtual = null;

function rolarDado(numeroDeFaces) {
  return Math.floor(Math.random() * numeroDeFaces) + 1;
}

function rolarGrupoDeDados(quantidade, numeroDeFaces) {
  const resultados = [];

  for (let indice = 0; indice < quantidade; indice += 1) {
    resultados.push(rolarDado(numeroDeFaces));
  }

  return resultados;
}

function somarResultados(resultados) {
  return resultados.reduce(function somar(total, resultado) {
    return total + resultado;
  }, 0);
}

function realizarRolagem(quantidade, numeroDeFaces) {
  const resultados = rolarGrupoDeDados(quantidade, numeroDeFaces);

  return {
    quantidade: quantidade,
    numeroDeFaces: numeroDeFaces,
    resultados: resultados,
    total: somarResultados(resultados),
  };
}

function rolarGruposDeDados(configuracao) {
  return configuracao.gruposDeDados.map(function rolarGrupo(grupoDeDados) {
    return realizarRolagem(grupoDeDados.quantidade, grupoDeDados.numeroDeFaces);
  });
}

function realizarRolagemComposta(configuracao) {
  const gruposRolados = rolarGruposDeDados(configuracao);

  const subtotal = gruposRolados.reduce(function somarGrupos(total, grupo) {
    return total + grupo.total;
  }, 0);

  const modificador = Number(configuracao.modificador) || 0;

  return {
    gruposRolados: gruposRolados,
    subtotal: subtotal,
    modificador: modificador,
    total: subtotal + modificador,
  };
}

function formatarResultadoRolagem(rolagem) {
  const textoDosDados = rolagem.gruposRolados
    .map(function descreverGrupo(grupo) {
      return `${grupo.quantidade}d${grupo.numeroDeFaces} [${grupo.resultados.join(", ")}]`;
    })
    .join(" + ");

  const textoDoModificador =
    rolagem.modificador >= 0
      ? ` + ${rolagem.modificador}`
      : ` - ${Math.abs(rolagem.modificador)}`;

  return `${textoDosDados}${textoDoModificador} = ${rolagem.total}`;
}

function buscarDadoLancado(idDado) {
  return estadoCaixaDados.dadosLancados.find(function encontrarDado(dado) {
    return dado.id === idDado;
  });
}

function criarFantasmaArraste(numeroDeFaces, x, y) {
  const fantasma = document.createElement("div");

  fantasma.classList.add("dado-em-arraste");
  fantasma.textContent = `d${numeroDeFaces}`;

  const quantidade = document.createElement("span");

  quantidade.classList.add("quantidade-dados-arraste");
  quantidade.textContent = "1";

  fantasma.append(quantidade);
  camadaDadosLancados.append(fantasma);

  posicionarFantasmaArraste(fantasma, x, y);

  return fantasma;
}

function posicionarFantasmaArraste(fantasma, x, y) {
  fantasma.style.left = `${x}px`;
  fantasma.style.top = `${y}px`;
}

function iniciarArrasteManualDado(evento) {
  if (evento.button !== 0 || arrasteDadoAtual) {
    return;
  }

  const elementoDado = evento.currentTarget;
  const numeroDeFaces = Number(elementoDado.dataset.faces);

  if (!numeroDeFaces || !camadaDadosLancados) {
    return;
  }

  evento.preventDefault();

  arrasteDadoAtual = {
    elementoOrigem: elementoDado,
    numeroDeFaces: numeroDeFaces,
    quantidade: 1,
    dadoExistenteId: elementoDado.dataset.idDado ?? null,
    x: evento.clientX,
    y: evento.clientY,
    fantasma: criarFantasmaArraste(numeroDeFaces, evento.clientX, evento.clientY),
  };

  elementoDado.classList.add("dado-sendo-arrastado");
  document.body.classList.add("arrastando-dado");

  atualizarMensagemPreparacao();
}

function moverArrasteManualDado(evento) {
  if (!arrasteDadoAtual) {
    return;
  }

  arrasteDadoAtual.x = evento.clientX;
  arrasteDadoAtual.y = evento.clientY;

  posicionarFantasmaArraste(
    arrasteDadoAtual.fantasma,
    arrasteDadoAtual.x,
    arrasteDadoAtual.y,
  );
}

function adicionarDadoAoLancamento(evento) {
  if (!arrasteDadoAtual || evento.button !== 2) {
    return;
  }

  evento.preventDefault();
  evento.stopPropagation();

  arrasteDadoAtual.quantidade += 1;

  const indicador = arrasteDadoAtual.fantasma.querySelector(
    ".quantidade-dados-arraste",
  );

  if (indicador) {
    indicador.textContent = String(arrasteDadoAtual.quantidade);
  }

  atualizarMensagemPreparacao();
}

function atualizarMensagemPreparacao() {
  if (!resultadoDado || !arrasteDadoAtual) {
    return;
  }

  resultadoDado.textContent =
    `${arrasteDadoAtual.quantidade}d${arrasteDadoAtual.numeroDeFaces} ` +
    "preparados para lançamento.";
}

function concluirArrasteManualDado(evento) {
  if (!arrasteDadoAtual || evento.button !== 0) {
    return;
  }

  evento.preventDefault();

  const lancamento = arrasteDadoAtual;

  arrasteDadoAtual = null;

  lancamento.elementoOrigem.classList.remove("dado-sendo-arrastado");
  lancamento.fantasma.remove();
  document.body.classList.remove("arrastando-dado");

  executarLancamentoPreparado(lancamento, evento.clientX, evento.clientY);
}

function cancelarArrasteManualDado() {
  if (!arrasteDadoAtual) {
    return;
  }

  arrasteDadoAtual.elementoOrigem.classList.remove("dado-sendo-arrastado");
  arrasteDadoAtual.fantasma.remove();
  arrasteDadoAtual = null;

  document.body.classList.remove("arrastando-dado");
}

function executarLancamentoPreparado(lancamento, x, y) {
  const dadosDoLancamento = [];
  let primeiroIndiceNovo = 0;

  if (lancamento.dadoExistenteId) {
    const dadoExistente = buscarDadoLancado(lancamento.dadoExistenteId);
    const elementoExistente = camadaDadosLancados.querySelector(
      `[data-id-dado="${lancamento.dadoExistenteId}"]`,
    );

    if (dadoExistente && elementoExistente) {
      dadoExistente.x = x;
      dadoExistente.y = y;
      dadoExistente.resultado = rolarDado(dadoExistente.numeroDeFaces);

      posicionarDadoLancado(elementoExistente, x, y, 0);
      animarDadoLancado(elementoExistente, dadoExistente);

      dadosDoLancamento.push(dadoExistente);
      primeiroIndiceNovo = 1;
    }
  }

  for (
    let indice = primeiroIndiceNovo;
    indice < lancamento.quantidade;
    indice += 1
  ) {
    const dadoNovo = criarNovoDadoLancado(
      lancamento.numeroDeFaces,
      x,
      y,
      indice,
    );

    if (dadoNovo) {
      dadosDoLancamento.push(dadoNovo);
    }
  }

  window.setTimeout(function concluirLancamento() {
    atualizarResultadoDadosLancados();
    emitirRolagemConcluida(dadosDoLancamento);
  }, 560);
}

function criarNovoDadoLancado(numeroDeFaces, x, y, indice) {
  const dadoLancado = {
    id: `dado-${estadoCaixaDados.proximoId}`,
    numeroDeFaces: numeroDeFaces,
    resultado: rolarDado(numeroDeFaces),
    x: x,
    y: y,
  };

  estadoCaixaDados.proximoId += 1;
  estadoCaixaDados.dadosLancados.push(dadoLancado);

  const elementoDado = criarElementoDadoLancado(dadoLancado);

  if (!elementoDado) {
    return null;
  }

  posicionarDadoLancado(elementoDado, x, y, indice);
  animarDadoLancado(elementoDado, dadoLancado);

  return dadoLancado;
}

function criarElementoDadoLancado(dado) {
  if (!camadaDadosLancados) {
    return null;
  }

  const elementoDado = document.createElement("button");

  elementoDado.type = "button";
  elementoDado.classList.add("dado-lancado-na-tela");
  elementoDado.dataset.idDado = dado.id;
  elementoDado.dataset.faces = String(dado.numeroDeFaces);
  elementoDado.textContent = `d${dado.numeroDeFaces}`;

  const rotacao = Math.floor(Math.random() * 81) - 40;

  elementoDado.style.setProperty("--rotacao-dado", `${rotacao}deg`);

  elementoDado.addEventListener("mousedown", iniciarArrasteManualDado);
  elementoDado.addEventListener("contextmenu", removerDadoLancado);

  camadaDadosLancados.append(elementoDado);

  return elementoDado;
}

function posicionarDadoLancado(elementoDado, x, y, indice) {
  const deslocamentos = [
    { x: 0, y: 0 },
    { x: 38, y: 18 },
    { x: -38, y: 18 },
    { x: 38, y: -18 },
    { x: -38, y: -18 },
    { x: 0, y: 42 },
    { x: 0, y: -42 },
  ];

  const deslocamento = deslocamentos[indice % deslocamentos.length];

  elementoDado.style.left = `${x + deslocamento.x}px`;
  elementoDado.style.top = `${y + deslocamento.y}px`;
}

function animarDadoLancado(elementoDado, dado) {
  elementoDado.disabled = true;
  elementoDado.textContent = "?";
  elementoDado.classList.remove("dado-girando");

  void elementoDado.offsetWidth;

  elementoDado.classList.add("dado-girando");

  window.setTimeout(function finalizarAnimacao() {
    elementoDado.classList.remove("dado-girando");
    elementoDado.textContent = String(dado.resultado);
    elementoDado.disabled = false;
    elementoDado.setAttribute(
      "aria-label",
      `d${dado.numeroDeFaces}: resultado ${dado.resultado}`,
    );
  }, 550);
}

function removerDadoLancado(evento) {
  if (arrasteDadoAtual) {
    return;
  }

  evento.preventDefault();
  evento.stopPropagation();

  const elementoDado = evento.currentTarget;
  const idDado = elementoDado.dataset.idDado;
  const indiceDado = estadoCaixaDados.dadosLancados.findIndex(
    function encontrarIndice(dado) {
      return dado.id === idDado;
    },
  );

  if (indiceDado >= 0) {
    estadoCaixaDados.dadosLancados.splice(indiceDado, 1);
  }

  elementoDado.remove();
  atualizarResultadoDadosLancados();
}

function atualizarResultadoDadosLancados() {
  if (!resultadoDado) {
    return;
  }

  const dadosLancados = estadoCaixaDados.dadosLancados;

  if (dadosLancados.length === 0) {
    resultadoDado.textContent = "";
    return;
  }

  const subtotal = dadosLancados.reduce(function somarDados(total, dado) {
    return total + dado.resultado;
  }, 0);

  const descricao = dadosLancados
    .map(function descreverDado(dado) {
      return `d${dado.numeroDeFaces}: ${dado.resultado}`;
    })
    .join(" • ");

  resultadoDado.textContent = `${descricao} | Total: ${subtotal}`;
}

function emitirRolagemConcluida(dadosDoLancamento) {
  if (!Array.isArray(dadosDoLancamento) || dadosDoLancamento.length === 0) {
    return;
  }

  const gruposPorFaces = new Map();

  for (const dado of dadosDoLancamento) {
    const resultados = gruposPorFaces.get(dado.numeroDeFaces) ?? [];

    resultados.push(dado.resultado);
    gruposPorFaces.set(dado.numeroDeFaces, resultados);
  }

  const gruposRolados = Array.from(gruposPorFaces.entries()).map(
    function criarGrupo([numeroDeFaces, resultados]) {
      return {
        quantidade: resultados.length,
        numeroDeFaces: numeroDeFaces,
        resultados: resultados,
        total: somarResultados(resultados),
      };
    },
  );

  const subtotal = gruposRolados.reduce(function somarGrupos(total, grupo) {
    return total + grupo.total;
  }, 0);

  const resultado = {
    gruposRolados: gruposRolados,
    subtotal: subtotal,
    modificador: 0,
    total: subtotal,
  };

  document.dispatchEvent(
    new CustomEvent("rolagemConcluida", {
      detail: resultado,
    }),
  );

  console.log("Rolagem concluída pela caixa de dados:", resultado);
}

for (const dadoDisponivel of dadosDisponiveis) {
  dadoDisponivel.addEventListener("mousedown", iniciarArrasteManualDado);
  dadoDisponivel.addEventListener("contextmenu", function impedirMenu(evento) {
    evento.preventDefault();
  });
}

document.addEventListener("mousemove", moverArrasteManualDado);
document.addEventListener("mouseup", concluirArrasteManualDado);
document.addEventListener("mousedown", adicionarDadoAoLancamento, true);
document.addEventListener("keydown", function tratarTecla(evento) {
  if (evento.key === "Escape") {
    cancelarArrasteManualDado();
  }
});
document.addEventListener("contextmenu", function impedirMenuDuranteArraste(evento) {
  if (arrasteDadoAtual) {
    evento.preventDefault();
  }
});
