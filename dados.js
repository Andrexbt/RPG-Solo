"use strict";

const botaoRolarDado = document.querySelector("#botaoRolarDado");

const resultadoDado = document.querySelector("#resultadoDado");

const campoModificadorDados = document.querySelector("#modificadorDados");

const listaGruposDados = document.querySelector("#listaGruposDados");

const botaoAdicionarGrupoDado = document.querySelector("#botaoAdicionarGrupoDado");

const colecaoDados = document.querySelector("#colecaoDados");

const bandejaDados = document.querySelector("#bandejaDados");

const dadosDisponiveis = document.querySelectorAll(".dado-disponivel",);

const camadaDadosLancados = document.querySelector(
  "#camadaDadosLancados",
);

const estadoCaixaDados = {
  proximoId: 1,
  dadosLancados: [],
};

let lancamentoEmPreparacao = null;
let arrasteDadoAtual = null;

function rolarDado(numeroDeFaces) {
  const resultado = Math.floor(Math.random() * numeroDeFaces) + 1;

  return resultado;
}

function iniciarArrasteManualDado(evento) {
  if (evento.button !== 0) {
    return;
  }

  evento.preventDefault();

  const elementoDado = evento.currentTarget;

  const numeroDeFaces = Number(
    elementoDado.dataset.faces,
  );

  if (!numeroDeFaces) {
    return;
  }

  const dadoExistenteId =
    elementoDado.dataset.idDado ?? null;

  lancamentoEmPreparacao = {
    numeroDeFaces: numeroDeFaces,
    quantidade: 1,
    dadoExistenteId: dadoExistenteId,
  };

  arrasteDadoAtual = {
    elementoOrigem: elementoDado,
    ponteiroId: evento.pointerId,
    x: evento.clientX,
    y: evento.clientY,
  };

  elementoDado.classList.add(
    "dado-sendo-arrastado",
  );

  elementoDado.setPointerCapture(
    evento.pointerId,
  );

  document.body.classList.add(
    "arrastando-dado",
  );

  resultadoDado.textContent =
    `1d${numeroDeFaces} preparado para lançamento.`;
}

function moverArrasteManualDado(evento) {
  if (!arrasteDadoAtual) {
    return;
  }

  if (
    evento.pointerId !==
    arrasteDadoAtual.ponteiroId
  ) {
    return;
  }

  arrasteDadoAtual.x = evento.clientX;
  arrasteDadoAtual.y = evento.clientY;
}

function rolarGrupoDeDados(quantidade, numeroDeFaces) {
  const resultados = [];

  for (let indice = 0; indice < quantidade; indice += 1) {
    const resultado = rolarDado(numeroDeFaces);

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

function realizarRolagem(quantidade, numeroDeFaces) {
  const resultados = rolarGrupoDeDados(quantidade, numeroDeFaces);

  const total = somarResultados(resultados);

  return {
    quantidade: quantidade,

    numeroDeFaces: numeroDeFaces,

    resultados: resultados,

    total: total,
  };
}

function rolarGruposDeDados(configuracao) {
  const resultadosDosGrupos = [];

  for (const grupoDeDados of configuracao.gruposDeDados) {
    const resultadoDoGrupo = realizarRolagem(grupoDeDados.quantidade, grupoDeDados.numeroDeFaces);

    resultadosDosGrupos.push(resultadoDoGrupo);
  }
  return resultadosDosGrupos;
}

function realizarRolagemComposta(configuracao) {
  const gruposRolados = rolarGruposDeDados(configuracao);

  let subtotal = 0;

  for (const grupoRolado of gruposRolados) {
    subtotal += grupoRolado.total;
  }

  const modificador = configuracao.modificador;

  const total = subtotal + modificador;

  return {
    gruposRolados: gruposRolados,

    subtotal: subtotal,

    modificador: modificador,

    total: total,
  };
}

function formatarResultadoRolagem(rolagem) {
  let textoDosDados = "";

  for (const grupo of rolagem.gruposRolados) {
    const descricaoDoGrupo = `${grupo.quantidade}d${grupo.numeroDeFaces} [${grupo.resultados.join(", ")}]`;

    if (textoDosDados !== "") {
      textoDosDados += " + ";
    }

    textoDosDados += descricaoDoGrupo;
  }

  const textoDoModificador =
    rolagem.modificador >= 0 ? ` + ${rolagem.modificador}` : ` - ${Math.abs(rolagem.modificador)}`;

  return `${textoDosDados}${textoDoModificador} = ${rolagem.total}`;
}

function executarRolagemConfigurada() {
  if (
    !listaGruposDados ||
    !campoModificadorDados ||
    !resultadoDado
  ) {
    console.warn(
      "A interface antiga de dados não está disponível.",
    );

    return;
  }
  const elementosDosGrupos = listaGruposDados.querySelectorAll(".grupo-dado");

  const gruposDeDados = [];

  for (const elementoDoGrupo of elementosDosGrupos) {
    const campoQuantidade = elementoDoGrupo.querySelector(".quantidade-dados");

    const campoNumeroDeFaces = elementoDoGrupo.querySelector(".numero-de-faces");

    const grupoDeDados = {
      quantidade: Number(campoQuantidade.value),
      numeroDeFaces: Number(campoNumeroDeFaces.value),
    };

    gruposDeDados.push(grupoDeDados);
  }

  const modificador = Number(campoModificadorDados.value);

  const configuracao = {
    gruposDeDados: gruposDeDados,
    modificador: modificador,
  };

  const resultado = realizarRolagemComposta(configuracao);

  resultadoDado.textContent = resultado.total;

  const eventoRolagem = new CustomEvent("rolagemConcluida", {
    detail: resultado,
  });

  document.dispatchEvent(eventoRolagem);

  console.log("Rolagem solicitada pela interface:", resultado);

  const resultadoFormatado = formatarResultadoRolagem(resultado);

  console.log(resultadoFormatado);
}

function removerGrupoDado(evento) {
  const botaoRemover = evento.currentTarget;

  const grupoDado = botaoRemover.closest(".grupo-dado");

  grupoDado.remove();
}

function adicionarGrupoDado() {
  const grupoOriginal = listaGruposDados.querySelector(".grupo-dado");

  const novoGrupo = grupoOriginal.cloneNode(true);

  const novaQuantidade = novoGrupo.querySelector(".quantidade-dados");

  const novoNumeroDeFaces = novoGrupo.querySelector(".numero-de-faces");

  novaQuantidade.value = 1;

  novoNumeroDeFaces.value = 20;

  const botaoRemover = document.createElement("button");

  botaoRemover.type = "button";

  botaoRemover.classList.add("botao-remover-grupo-dado");

  botaoRemover.textContent = "Remover";

  botaoRemover.addEventListener("click", removerGrupoDado);

  novoGrupo.append(botaoRemover);

  listaGruposDados.append(novoGrupo);
}



function permitirSoltarDado(evento) {
  evento.preventDefault();

  bandejaDados.classList.add("bandeja-recebendo-dado");
}

function sairDaAreaDeSoltura(evento) {
  if (evento.currentTarget.contains(evento.relatedTarget)) {
    return;
  }

  bandejaDados.classList.remove("bandeja-recebendo-dado");
}


function iniciarArrasteDado(evento) {
  const elementoDado = evento.currentTarget;

  const numeroDeFaces = Number(
    elementoDado.dataset.faces,
  );

  if (!numeroDeFaces) {
    return;
  }

  const dadoExistenteId =
    elementoDado.dataset.idDado ?? null;

  lancamentoEmPreparacao = {
    numeroDeFaces: numeroDeFaces,
    quantidade: 1,
    dadoExistenteId: dadoExistenteId,
  };

  evento.dataTransfer.effectAllowed = "copyMove";

  evento.dataTransfer.setData(
    "application/x-dado-rpg",
    String(numeroDeFaces),
  );

  if (dadoExistenteId) {
    evento.dataTransfer.setData(
      "application/x-dado-existente",
      dadoExistenteId,
    );
  }

  elementoDado.classList.add(
    "dado-sendo-arrastado",
  );
}

function encerrarArrasteDado(evento) {
  evento.currentTarget.classList.remove(
    "dado-sendo-arrastado",
  );

  lancamentoEmPreparacao = null;
}

function adicionarDadoAoLancamento(evento) {
  if (
    !arrasteDadoAtual ||
    !lancamentoEmPreparacao
  ) {
    return;
  }

  if (evento.button !== 2) {
    return;
  }

  evento.preventDefault();
  evento.stopPropagation();

  lancamentoEmPreparacao.quantidade += 1;

  const quantidade =
    lancamentoEmPreparacao.quantidade;

  const faces =
    lancamentoEmPreparacao.numeroDeFaces;

  resultadoDado.textContent =
    `${quantidade}d${faces} preparados para lançamento.`;
}

function concluirArrasteManualDado(evento) {
  if (!arrasteDadoAtual) {
    return;
  }

  if (
    evento.pointerId !==
    arrasteDadoAtual.ponteiroId
  ) {
    return;
  }

  const elementoOrigem =
    arrasteDadoAtual.elementoOrigem;

  elementoOrigem.classList.remove(
    "dado-sendo-arrastado",
  );

  document.body.classList.remove(
    "arrastando-dado",
  );

  const x = evento.clientX;
  const y = evento.clientY;

  executarLancamentoPreparado(x, y);

  arrasteDadoAtual = null;
  lancamentoEmPreparacao = null;
}

function permitirSoltarDadoNaTela(evento) {
  const tipos = Array.from(
    evento.dataTransfer.types,
  );

  if (!tipos.includes("application/x-dado-rpg")) {
    return;
  }

  evento.preventDefault();

  evento.dataTransfer.dropEffect = "copy";
}

function executarLancamentoPreparado(x, y) {
  if (!lancamentoEmPreparacao) {
    return;
  }

  const numeroDeFaces =
    lancamentoEmPreparacao.numeroDeFaces;

  const quantidade =
    lancamentoEmPreparacao.quantidade;

  const dadoExistenteId =
    lancamentoEmPreparacao.dadoExistenteId;

  let primeiroIndice = 0;

  if (dadoExistenteId) {
    const dadoExistente =
      buscarDadoLancado(dadoExistenteId);

    const elementoExistente =
      document.querySelector(
        `[data-id-dado="${dadoExistenteId}"]`,
      );

    if (dadoExistente && elementoExistente) {
      dadoExistente.x = x;
      dadoExistente.y = y;

      dadoExistente.resultado =
        rolarDado(
          dadoExistente.numeroDeFaces,
        );

      posicionarDadoLancado(
        elementoExistente,
        x,
        y,
        0,
      );

      animarDadoLancado(
        elementoExistente,
        dadoExistente,
      );

      primeiroIndice = 1;
    }
  }

  for (
    let indice = primeiroIndice;
    indice < quantidade;
    indice += 1
  ) {
    criarNovoDadoLancado(
      numeroDeFaces,
      x,
      y,
      indice,
    );
  }
}

function criarNovoDadoLancado(
  numeroDeFaces,
  x,
  y,
  indice,
) {
  const dadoLancado = {
    id: `dado-${estadoCaixaDados.proximoId}`,
    numeroDeFaces: numeroDeFaces,
    resultado: rolarDado(numeroDeFaces),
    x: x,
    y: y,
  };

  estadoCaixaDados.proximoId += 1;

  estadoCaixaDados.dadosLancados.push(
    dadoLancado,
  );

  const elementoDado =
    criarElementoDadoLancado(dadoLancado);

  posicionarDadoLancado(
    elementoDado,
    x,
    y,
    indice,
  );

  animarDadoLancado(
    elementoDado,
    dadoLancado,
  );
}

function posicionarDadoLancado(
  elementoDado,
  x,
  y,
  indice,
) {
  const deslocamentos = [
    { x: 0, y: 0 },
    { x: 34, y: 16 },
    { x: -34, y: 16 },
    { x: 34, y: -16 },
    { x: -34, y: -16 },
    { x: 0, y: 38 },
    { x: 0, y: -38 },
  ];

  const deslocamento =
    deslocamentos[indice % deslocamentos.length];

  elementoDado.style.left =
    `${x + deslocamento.x}px`;

  elementoDado.style.top =
    `${y + deslocamento.y}px`;
}

function criarElementoDadoLancado(dado) {
  if (!camadaDadosLancados) {
    return null;
  }

  const elementoDado =
    document.createElement("button");

  elementoDado.type = "button";
  elementoDado.draggable = false;

  elementoDado.classList.add(
    "dado-lancado-na-tela",
  );

  elementoDado.dataset.idDado = dado.id;

  elementoDado.dataset.faces = String(
    dado.numeroDeFaces,
  );

  elementoDado.textContent =
    `d${dado.numeroDeFaces}`;

  const rotacao =
    Math.floor(Math.random() * 81) - 40;

  elementoDado.style.setProperty(
    "--rotacao-dado",
    `${rotacao}deg`,
  );

  elementoDado.addEventListener(
    "contextmenu",
    removerDadoLancado,
  );

  camadaDadosLancados.append(
    elementoDado,
  );

  elementoDado.addEventListener(
  "pointerdown",
  iniciarArrasteManualDado,
);

elementoDado.addEventListener(
  "contextmenu",
  removerDadoLancado,
);

  return elementoDado;
}

function removerDadoLancado(evento) {
  /*
   * Durante um arraste, o botão direito adiciona
   * outro dado. Portanto, não removemos nada.
   */
  if (lancamentoEmPreparacao) {
    return;
  }

  evento.preventDefault();
  evento.stopPropagation();

  const elementoDado = evento.currentTarget;

  const idDado =
    elementoDado.dataset.idDado;

  const indiceDado =
    estadoCaixaDados.dadosLancados.findIndex(
      function encontrarIndice(dado) {
        return dado.id === idDado;
      },
    );

  if (indiceDado >= 0) {
    estadoCaixaDados.dadosLancados.splice(
      indiceDado,
      1,
    );
  }

  elementoDado.remove();

  atualizarResultadoDadosLancados();
}

function animarDadoLancado(
  elementoDado,
  dado,
) {
  elementoDado.draggable = false;

  elementoDado.textContent = "?";

  elementoDado.classList.remove(
    "dado-girando",
  );

  /*
   * Força o navegador a reiniciar a animação,
   * inclusive quando o mesmo dado é rolado de novo.
   */
  void elementoDado.offsetWidth;

  elementoDado.classList.add(
    "dado-girando",
  );

  window.setTimeout(function finalizarAnimacao() {
    elementoDado.classList.remove(
      "dado-girando",
    );

    elementoDado.textContent = String(
      dado.resultado,
    );

    elementoDado.setAttribute(
      "aria-label",
      `d${dado.numeroDeFaces}: resultado ${dado.resultado}`,
    );

    elementoDado.draggable = true;

    atualizarResultadoDadosLancados();
  }, 550);
}

function atualizarResultadoDadosLancados() {
  const dadosComResultado =
    estadoCaixaDados.dadosLancados.filter(
      function filtrarDados(dado) {
        return Number.isFinite(
          dado.resultado,
        );
      },
    );

  if (dadosComResultado.length === 0) {
    resultadoDado.textContent = "";

    return;
  }

  const subtotal =
    dadosComResultado.reduce(
      function somarDados(total, dado) {
        return total + dado.resultado;
      },
      0,
    );

  const descricao =
    dadosComResultado
      .map(function descreverDado(dado) {
        return (
          `d${dado.numeroDeFaces}: ` +
          `${dado.resultado}`
        );
      })
      .join(" • ");

  resultadoDado.textContent =
    `${descricao} | Total: ${subtotal}`;
}


for (const dadoDisponivel of dadosDisponiveis) {
  dadoDisponivel.addEventListener(
    "pointerdown",
    iniciarArrasteManualDado,
  );
}





function atualizarResultadoDadosSelecionados() {
  const dadosLancados =
    estadoCaixaDados.dadosSelecionados.filter(
      (dado) => dado.estado === "lancado",
    );

  if (dadosLancados.length === 0) {
    resultadoDado.textContent = "";

    return;
  }

  const subtotal = dadosLancados.reduce(
    (total, dado) => total + dado.resultado,
    0,
  );

  const descricao = dadosLancados
    .map(
      (dado) =>
        `d${dado.numeroDeFaces}: ${dado.resultado}`,
    )
    .join(" • ");

  resultadoDado.textContent =
    `${descricao} | Total: ${subtotal}`;
}

function buscarDadoLancado(idDado) {
  return estadoCaixaDados.dadosLancados.find(
    function encontrarDado(dado) {
      return dado.id === idDado;
    },
  );
}



if (botaoRolarDado) {
  botaoRolarDado.addEventListener(
    "click",
    executarRolagemConfigurada,
  );
}

if (botaoAdicionarGrupoDado) {
  botaoAdicionarGrupoDado.addEventListener(
    "click",
    adicionarGrupoDado,
  );
}

if (bandejaDados) {
  bandejaDados.addEventListener(
    "dragover",
    permitirSoltarDado,
  );

  bandejaDados.addEventListener(
    "dragleave",
    sairDaAreaDeSoltura,
  );

  
}

document.addEventListener(
  "pointermove",
  moverArrasteManualDado,
);

document.addEventListener(
  "pointerup",
  concluirArrasteManualDado,
);

document.addEventListener(
  "pointerdown",
  adicionarDadoAoLancamento,
  true,
);

document.addEventListener(
  "contextmenu",
  function impedirMenuDuranteLancamento(evento) {
    if (!arrasteDadoAtual) {
      return;
    }

    evento.preventDefault();
  },
);

