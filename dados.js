"use strict";

(function iniciarSistemaDados() {

  const {
  rolarDado,
  
  validarRolagem:
    validarDadosDaRolagem,

    separarResultados:
    separarResultadosVisuais,

    criarResultado:
    criarResultadoRolagem,
    
} = window.MotorDados;

  const resultadoDado = document.querySelector("#resultadoDado");
  const dadosDisponiveis = document.querySelectorAll(".dado-disponivel");
  const camadaDadosLancados = document.querySelector("#camadaDadosLancados");

  const tabuleiroDados = document.querySelector("#tabuleiroCombate");
  const superficieAventura = document.querySelector(".layout-aventura");
  const visualizacaoCombate = document.querySelector("#visualizacaoCombate");

  const solicitacaoCaixaDados = document.querySelector("#solicitacaoCaixaDados");

  const estadoCaixaDados = {
    proximoId: 1,
    dadosLancados: [],
  };

  let arrasteDadoAtual = null;
  let solicitacaoRolagemAtual = null;
  let rolagemSolicitadaEmAndamento = false;
  let temporizadorResultadoDado = null;

  function limparResultadoDado() {
    if (temporizadorResultadoDado) {
      window.clearTimeout(
        temporizadorResultadoDado,
      );

      temporizadorResultadoDado = null;
    }

    if (resultadoDado) {
      resultadoDado.textContent = "";
      resultadoDado.classList.remove(
        "resultado-rolagem-erro",
      );
    }
  }

  function agendarOcultacaoResultadoDado() {
    if (temporizadorResultadoDado) {
      window.clearTimeout(
        temporizadorResultadoDado,
      );
    }

    temporizadorResultadoDado =
      window.setTimeout(
        function ocultarResultadoDado() {
          limparResultadoDado();
        },
        5000,
      );
  }

  function obterSuperficieDados() {
  const combateEstaVisivel =
    visualizacaoCombate &&
    !visualizacaoCombate.hidden;

  if (
    combateEstaVisivel &&
    tabuleiroDados
  ) {
    return tabuleiroDados;
  }

  return superficieAventura;
  }

  function prepararCamadaDados() {
  const superficieDados =
    obterSuperficieDados();

  if (
    !camadaDadosLancados ||
    !superficieDados
  ) {
    return false;
  }

  if (
    camadaDadosLancados.parentElement !==
    superficieDados
  ) {
    superficieDados.append(
      camadaDadosLancados
    );
  }

  if (
    resultadoDado &&
    resultadoDado.parentElement !==
      camadaDadosLancados
  ) {
    camadaDadosLancados.append(
      resultadoDado
    );
  }

  return true;
  }

  function obterPosicaoNaSuperficie(
  clientX,
  clientY
) {
  const superficieDados =
    obterSuperficieDados();

  if (!superficieDados) {
    return {
      x: clientX,
      y: clientY,
    };
  }

  const retangulo =
    superficieDados.getBoundingClientRect();

  const escalaX =
    retangulo.width /
      superficieDados.offsetWidth ||
    1;

  const escalaY =
    retangulo.height /
      superficieDados.offsetHeight ||
    1;

  return {
    x:
      (clientX - retangulo.left) /
      escalaX,

    y:
      (clientY - retangulo.top) /
      escalaY,
  };
  }

  function formatarExpressaoResultado(
  subtotal,
  modificador,
  total,
  critico = false,
) {
  if (critico) {
    return mensagensNarrativas
      .dados
      .resultadoCritico(
        subtotal,
        modificador,
      );
  }

  return mensagensNarrativas
    .dados
    .resultadoNormal(
      subtotal,
      modificador,
      total,
    );
}

  function atualizarSolicitacaoCaixaDados() {
    if (!solicitacaoCaixaDados) {
      return;
    }

    if (!solicitacaoRolagemAtual) {
      solicitacaoCaixaDados.textContent = "";
      solicitacaoCaixaDados.hidden = true;
      return;
    }

    const quantidadeDeRolagens =
  solicitacaoRolagemAtual
    .quantidadeDeRolagens ?? 1;

const dadosSolicitados =
  solicitacaoRolagemAtual.gruposDeDados
    .map(function formatarGrupo(grupo) {
      const quantidadePorRolagem =
        grupo.quantidade /
        quantidadeDeRolagens;

      return (
        `${quantidadePorRolagem}` +
        `d${grupo.numeroDeFaces}`
      );
    })
    .join(" + ");

    const modificador = solicitacaoRolagemAtual.modificador;
    const textoModificador =
      modificador > 0
        ? ` + ${modificador}`
        : modificador < 0
          ? ` - ${Math.abs(modificador)}`
          : "";

    const textoRepeticao =
  quantidadeDeRolagens > 1
    ? ` — ${quantidadeDeRolagens} vezes`
    : "";

solicitacaoCaixaDados.textContent =
  `${dadosSolicitados}` +
  `${textoModificador}` +
  `${textoRepeticao}`;
    solicitacaoCaixaDados.hidden = false;
  }

  function configurarRolagemSolicitada(configuracao) {
    rolagemSolicitadaEmAndamento = false;

    if (!configuracao) {
      solicitacaoRolagemAtual = null;
      atualizarSolicitacaoCaixaDados();
      return;
    }

    solicitacaoRolagemAtual = {
  gruposDeDados:
    structuredClone(
      configuracao.gruposDeDados ?? [],
    ),

  modificador:
    Number(configuracao.modificador) || 0,

  descricao:
    configuracao.descricao ??
    "Rolagem solicitada",

  quantidadeDeRolagens:
    Math.max(
      1,
      Number(
        configuracao.quantidadeDeRolagens,
      ) || 1,
    ),

  critico:
    Boolean(configuracao.critico),

  tipoRolagem:
    configuracao.tipoRolagem ??
    "normal",
};

    atualizarSolicitacaoCaixaDados();
  }

  window.configurarRolagemSolicitada = configurarRolagemSolicitada;

  function criarMiniaturaDadoArraste(numeroDeFaces, indice) {
    const miniatura = document.createElement("span");

    miniatura.className = "miniatura-dado-arraste";
    miniatura.dataset.indice = String(indice);
    miniatura.textContent = `d${numeroDeFaces}`;

    return miniatura;
  }

  function posicionarMiniaturasArraste(grupo) {
    const miniaturas = grupo.querySelectorAll(".miniatura-dado-arraste");
    const quantidade = miniaturas.length;

    miniaturas.forEach(function posicionarMiniatura(miniatura, indice) {
      if (indice === 0) {
        miniatura.style.setProperty("--miniatura-x", "0px");
        miniatura.style.setProperty("--miniatura-y", "0px");
        miniatura.style.setProperty("--miniatura-rotacao", "8deg");
        miniatura.style.zIndex = String(quantidade + 1);
        return;
      }

      const indiceAoRedor = indice - 1;
      const quantidadeNoAnel = Math.min(8, Math.max(1, quantidade - 1));
      const anel = Math.floor(indiceAoRedor / 8);
      const posicaoNoAnel = indiceAoRedor % 8;
      const angulo = (Math.PI * 2 * posicaoNoAnel) / quantidadeNoAnel - Math.PI / 2;
      const raio = 46 + anel * 32;

      miniatura.style.setProperty("--miniatura-x", `${Math.cos(angulo) * raio}px`);
      miniatura.style.setProperty("--miniatura-y", `${Math.sin(angulo) * raio}px`);
      miniatura.style.setProperty("--miniatura-rotacao", `${-18 + ((indice * 17) % 37)}deg`);
      miniatura.style.zIndex = String(quantidade - indice);
    });
  }

  function criarFantasmaArraste(numeroDeFaces, clientX, clientY) {
    const grupo = document.createElement("div");

    grupo.className = "grupo-dados-em-arraste grupo-dados-em-arraste-fixo";
    grupo.append(criarMiniaturaDadoArraste(numeroDeFaces, 0));
    document.body.append(grupo);

    posicionarMiniaturasArraste(grupo);
    posicionarFantasmaArraste(grupo, clientX, clientY);

    return grupo;
  }

  function posicionarFantasmaArraste(fantasma, clientX, clientY) {
    fantasma.style.left = `${clientX}px`;
    fantasma.style.top = `${clientY}px`;
  }

  function iniciarArrasteManualDado(evento) {
    if (evento.button !== 0 || arrasteDadoAtual) {
      return;
    }

    if (rolagemSolicitadaEmAndamento) {
      if (resultadoDado) {
        resultadoDado.textContent =
          "Aguarde o resultado da rolagem solicitada.";

        resultadoDado.classList.add(
          "resultado-rolagem-erro",
        );
      }

      return;
    }

    const elementoDado = evento.currentTarget;
    const numeroDeFaces = Number(elementoDado.dataset.faces);

    if (!numeroDeFaces || !prepararCamadaDados()) {
      return;
    }

    evento.preventDefault();

    arrasteDadoAtual = {
      elementoOrigem: elementoDado,
      numeroDeFaces: numeroDeFaces,
      quantidade: 1,
      dadoExistenteId: elementoDado.dataset.idDado ?? null,
      fantasma: criarFantasmaArraste(numeroDeFaces, evento.clientX, evento.clientY),
    };

    elementoDado.classList.add("dado-sendo-arrastado");
    document.body.classList.add("arrastando-dado");
  }

  function moverArrasteManualDado(evento) {
    if (!arrasteDadoAtual) {
      return;
    }

    posicionarFantasmaArraste(
      arrasteDadoAtual.fantasma,
      evento.clientX,
      evento.clientY,
    );
  }

  function adicionarDadoAoLancamento(evento) {
    if (!arrasteDadoAtual || evento.button !== 2) {
      return;
    }

    evento.preventDefault();
    evento.stopPropagation();

    arrasteDadoAtual.quantidade += 1;
    arrasteDadoAtual.fantasma.append(
      criarMiniaturaDadoArraste(
        arrasteDadoAtual.numeroDeFaces,
        arrasteDadoAtual.quantidade - 1,
      ),
    );

    posicionarMiniaturasArraste(arrasteDadoAtual.fantasma);
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

  function concluirArrasteManualDado(
    evento
  ) {
    if (
      !arrasteDadoAtual ||
      evento.button !== 0
    ) {
      return;
    }

    evento.preventDefault();

    const lancamento =
      arrasteDadoAtual;

    if (solicitacaoRolagemAtual) {
  rolagemSolicitadaEmAndamento =
    true;
    }

    if (resultadoDado) {
      resultadoDado.classList.remove(
        "resultado-rolagem-erro"
      );
    }

    const posicao =
      obterPosicaoNaSuperficie(
        evento.clientX,
        evento.clientY
      );

    arrasteDadoAtual =
      null;

    lancamento
      .elementoOrigem
      .classList
      .remove(
        "dado-sendo-arrastado"
      );

    lancamento
      .fantasma
      .remove();

    document
      .body
      .classList
      .remove(
        "arrastando-dado"
      );

    void executarLancamentoPreparado(
  lancamento,
  posicao.x,
  posicao.y,
);
  }

  function calcularDeslocamentoLancamento(indice, quantidadeTotal) {
    if (quantidadeTotal <= 1) {
      return { x: 0, y: 0 };
    }

    const anel = Math.floor(indice / 8);
    const posicaoNoAnel = indice % 8;
    const itensNesteAnel = Math.min(8, quantidadeTotal - anel * 8);
    const angulo = (Math.PI * 2 * posicaoNoAnel) / itensNesteAnel - Math.PI / 2;
    const raio = 82 + anel * 72;

    return {
      x: Math.cos(angulo) * raio,
      y: Math.sin(angulo) * raio,
    };
  }

  function posicionarDadoLancado(elementoDado, x, y, indice, quantidadeTotal) {
    const deslocamento = calcularDeslocamentoLancamento(indice, quantidadeTotal);

    elementoDado.style.left = `${x + deslocamento.x}px`;
    elementoDado.style.top = `${y + deslocamento.y}px`;
  }

  function buscarDadoLancado(idDado) {
    return estadoCaixaDados.dadosLancados.find(function encontrarDado(dado) {
      return dado.id === idDado;
    });
  }

  function criarElementoDadoLancado(dado) {
    if (!prepararCamadaDados()) {
      return null;
    }

    const elementoDado = document.createElement("button");

    elementoDado.type = "button";
    elementoDado.className = "dado-lancado-na-tela";
    elementoDado.dataset.idDado = dado.id;
    elementoDado.dataset.faces = String(dado.numeroDeFaces);
    elementoDado.textContent = `d${dado.numeroDeFaces}`;
    elementoDado.style.setProperty(
      "--rotacao-dado",
      `${Math.floor(Math.random() * 81) - 40}deg`,
    );

    elementoDado.addEventListener("mousedown", iniciarArrasteManualDado);
    elementoDado.addEventListener("contextmenu", removerDadoLancado);
    camadaDadosLancados.append(elementoDado);

    return elementoDado;
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

  function criarNovoDadoLancado(numeroDeFaces, x, y, indice, quantidadeTotal) {
    const dado = {
      id: `dado-${estadoCaixaDados.proximoId}`,
      numeroDeFaces: numeroDeFaces,
      resultado: rolarDado(numeroDeFaces),
      x: x,
      y: y,
    };

    estadoCaixaDados.proximoId += 1;
    estadoCaixaDados.dadosLancados.push(dado);

    const elementoDado = criarElementoDadoLancado(dado);

    if (!elementoDado) {
      return null;
    }

    posicionarDadoLancado(elementoDado, x, y, indice, quantidadeTotal);
    animarDadoLancado(elementoDado, dado);

    return dado;
  }

  function posicionarResultadoRolagem(x, y, quantidadeTotal) {
    if (!resultadoDado || !prepararCamadaDados()) {
      return;
    }

    const ultimoAnel = Math.floor((Math.max(1, quantidadeTotal) - 1) / 8);
    const raio = quantidadeTotal <= 1 ? 0 : 82 + ultimoAnel * 72;

    resultadoDado.style.left = `${x}px`;
    resultadoDado.style.top = `${y + Math.max(84, raio + 68)}px`;
  }

  function removerDadoLancado(evento) {
    if (arrasteDadoAtual) {
      return;
    }

    evento.preventDefault();
    evento.stopPropagation();

    const elementoDado = evento.currentTarget;
    const indice = estadoCaixaDados.dadosLancados.findIndex(
      (dado) => dado.id === elementoDado.dataset.idDado,
    );

    if (indice >= 0) {
      estadoCaixaDados.dadosLancados.splice(indice, 1);
    }

    elementoDado.remove();

    if (resultadoDado) {
  resultadoDado.textContent = "";
  resultadoDado.classList.remove(
    "resultado-rolagem-erro",
  );
}
  }

  

  

  function emitirRolagemConcluida(
    dadosDoLancamento,
    solicitacaoResolvida,
  ) {
    const validacao =
      validarDadosDaRolagem(
        dadosDoLancamento,
        solicitacaoResolvida
      );

    if (!validacao.sucesso) {
      if (resultadoDado) {


        resultadoDado.textContent =
          mensagensNarrativas
    .dados
    .erroRolagem;

        resultadoDado.classList.add(
          "resultado-rolagem-erro",
        );
      }

      rolagemSolicitadaEmAndamento =
    false;

      agendarOcultacaoResultadoDado();

      return;
    }

    const resultado =
  criarResultadoRolagem(
    dadosDoLancamento,
    solicitacaoResolvida,
  );

    if (resultadoDado) {
      const quantidadeDeRolagens =
        solicitacaoResolvida
          ?.quantidadeDeRolagens ?? 1;

      const resultadosVisuais =
        separarResultadosVisuais(
          resultado.gruposRolados,
          quantidadeDeRolagens,
          resultado.modificador,
        );

      const tipoRolagem =
  solicitacaoResolvida?.tipoRolagem ??
  "normal";

const grupoD20 =
  resultado.gruposRolados.find(
    function encontrarD20(grupo) {
      return grupo.numeroDeFaces === 20;
    },
  );

if (
  (tipoRolagem === "vantagem" ||
    tipoRolagem === "desvantagem") &&
  grupoD20?.resultados?.length === 2
) {
  const resultadosD20 =
    grupoD20.resultados;

  const resultadoEscolhido =
    tipoRolagem === "vantagem"
      ? Math.max(...resultadosD20)
      : Math.min(...resultadosD20);

  const totalEscolhido =
    resultadoEscolhido +
    resultado.modificador;

  const nomeTipo =
    tipoRolagem === "vantagem"
      ? "vantagem"
      : "desvantagem";

  resultadoDado.textContent =
    `${resultadosD20.join(" e ")} → ` +
    `${resultadoEscolhido} ` +
    `${resultado.modificador >= 0 ? "+" : "-"} ` +
    `${Math.abs(resultado.modificador)} = ` +
    `${totalEscolhido} (${nomeTipo})`;
} else {
  resultadoDado.textContent =
    resultadosVisuais
      .map(function formatarResultado(
        resultadoVisual,
      ) {
        return formatarExpressaoResultado(
          resultadoVisual.subtotal,
          resultadoVisual.modificador,
          resultadoVisual.total,
          Boolean(
            solicitacaoResolvida?.critico,
          ),
        );
      })
      .join("\n");
}

      resultadoDado.classList.remove(
        "resultado-rolagem-erro",
      );

      agendarOcultacaoResultadoDado();
    }

    document.dispatchEvent(
      new CustomEvent("rolagemConcluida", {
        detail: resultado,
      }),
    );

    if (
      solicitacaoRolagemAtual ===
      solicitacaoResolvida
    ) {
      solicitacaoRolagemAtual = null;
    }

    rolagemSolicitadaEmAndamento = false;

    atualizarSolicitacaoCaixaDados();
  }

  async function executarLancamentoPreparado(lancamento, x, y) {
    prepararCamadaDados();
    posicionarResultadoRolagem(x, y, lancamento.quantidade);

    const solicitacaoDoLancamento =
  solicitacaoRolagemAtual;

if (
  window.Dados3D &&
  typeof window.Dados3D.rolar ===
    "function" &&
  !lancamento.dadoExistenteId
) {
  try {
    const notacao =
      `${lancamento.quantidade}` +
      `d${lancamento.numeroDeFaces}`;

    const lancamento3D =
      await window.Dados3D.rolar(
        notacao,
        {
          pontoSoltura:
            lancamento.pontoSoltura3D ??
            null,
        },
      );

    emitirRolagemConcluida(
      lancamento3D.dados,
      solicitacaoDoLancamento,
    );

    return;
  } catch (erro) {
    console.warn(
      "O dado 3D falhou. Usando a representação 2D.",
      erro,
    );
  }
}

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
        posicionarDadoLancado(elementoExistente, x, y, 0, lancamento.quantidade);
        animarDadoLancado(elementoExistente, dadoExistente);
        dadosDoLancamento.push(dadoExistente);
        primeiroIndiceNovo = 1;
      }
    }

    for (let indice = primeiroIndiceNovo; indice < lancamento.quantidade; indice += 1) {
      const dadoNovo = criarNovoDadoLancado(
        lancamento.numeroDeFaces,
        x,
        y,
        indice,
        lancamento.quantidade,
      );

      if (dadoNovo) {
        dadosDoLancamento.push(dadoNovo);
      }
    }

    window.setTimeout(function concluirLancamento() {
      emitirRolagemConcluida(
        dadosDoLancamento,
        solicitacaoDoLancamento,
      );
    }, 560);
  }

  for (const dadoDisponivel of dadosDisponiveis) {
    dadoDisponivel.addEventListener("mousedown", iniciarArrasteManualDado);
    dadoDisponivel.addEventListener("contextmenu", (evento) => evento.preventDefault());
  }

  document.addEventListener(
  "dado3DRelancado",

  function concluirRelancamento3D(
    evento,
  ) {
    const dados =
      evento.detail?.dados;

    if (
      !Array.isArray(dados) ||
      dados.length === 0
    ) {
      return;
    }

    const solicitacaoDoLancamento =
      solicitacaoRolagemAtual;

    emitirRolagemConcluida(
      dados,
      solicitacaoDoLancamento,
    );
  },
  );

  document.addEventListener(
    "dado3DFisicoConcluido",

    function concluirLancamentoFisico3D(
      evento,
    ) {
      const dados =
        evento.detail?.dados;

      if (
        !Array.isArray(dados) ||
        dados.length === 0
      ) {
        return;
      }

      const posicao =
        obterPosicaoNaSuperficie(
          evento.detail?.clientX,
          evento.detail?.clientY,
        );

      posicionarResultadoRolagem(
        posicao.x,
        posicao.y,
        dados.length,
      );

      emitirRolagemConcluida(
        dados,
        solicitacaoRolagemAtual,
      );
    },
  );

  document.addEventListener(
    "dado3DRemovido",
    limparResultadoDado,
  );

  document.addEventListener(
  "dado3DPreviewLancamentoSolicitado",

  function lancarPreviewDado3D(
    evento,
  ) {
    const numeroDeFaces =
      Number(
        evento.detail
          ?.numeroDeFaces,
      );

    if (
      !Number.isInteger(
        numeroDeFaces,
      )
    ) {
      return;
    }

    const posicao =
      obterPosicaoNaSuperficie(
        evento.detail.clientX,
        evento.detail.clientY,
      );

    if (solicitacaoRolagemAtual) {
      rolagemSolicitadaEmAndamento =
        true;
    }

    if (resultadoDado) {
      resultadoDado.classList.remove(
        "resultado-rolagem-erro",
      );
    }

    void executarLancamentoPreparado(
      {
        quantidade:
          Math.max(
            1,
            Number(
              evento.detail
                ?.quantidade,
            ) || 1,
          ),

        numeroDeFaces,

        dadoExistenteId:
          null,

        pontoSoltura3D:
          evento.detail
            ?.pontoSoltura ??
          null,
      },

      posicao.x,
      posicao.y,
    );
  },
);

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
})();
