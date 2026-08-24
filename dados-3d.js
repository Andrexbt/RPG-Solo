import DiceBox from
  "./vendor/dice-box/dist/dice-box.es.js";

const camadaDados3D =
  document.querySelector(
    "#camadaDados3D",
  );

  const temasVisuaisDados = {
  madeiraEscura: {
    nome:
      "Madeira escura",

    corPrincipal:
      "#79552f",

    corNumeros:
      "#f4ead2",

    corResultado:
      "#dbbd83",

    corSombra:
      "#1b1009",

    texturaResultado:
      "linear-gradient(" +
      "135deg, " +
      "#f0d49c 0%, " +
      "#9b6c3c 35%, " +
      "#e4c181 62%, " +
      "#79552f 100%" +
      ")",
  },

  rubi: {
    nome:
      "Rubi",

    corPrincipal:
      "#7a1f2b",

    corNumeros:
      "#ffe9dc",

    corResultado:
      "#ef8d86",

    corSombra:
      "#260609",

    texturaResultado:
      "linear-gradient(" +
      "135deg, " +
      "#ffd2c5 0%, " +
      "#b52e3c 35%, " +
      "#ff9089 60%, " +
      "#65131d 100%" +
      ")",
  },

  safira: {
    nome:
      "Safira",

    corPrincipal:
      "#244f72",

    corNumeros:
      "#eef8ff",

    corResultado:
      "#8dcced",

    corSombra:
      "#071723",

    texturaResultado:
      "linear-gradient(" +
      "135deg, " +
      "#d5f2ff 0%, " +
      "#397bab 35%, " +
      "#8fd8f5 60%, " +
      "#163a59 100%" +
      ")",
  },
};

let temaVisualDadosAtual =
  "madeiraEscura";

  function obterTemaVisualDadosAtual() {
  return {
    id:
      temaVisualDadosAtual,

    ...temasVisuaisDados[
      temaVisualDadosAtual
    ],
  };
}

function aplicarTemaDadosNoDocumento(
  tema,
) {
  const raiz =
    document.documentElement;

  raiz.style.setProperty(
    "--cor-principal-dados",
    tema.corPrincipal,
  );

  raiz.style.setProperty(
    "--cor-numeros-dados",
    tema.corNumeros,
  );

  raiz.style.setProperty(
    "--cor-resultado-dados",
    tema.corResultado,
  );

  raiz.style.setProperty(
    "--cor-sombra-dados",
    tema.corSombra,
  );

  raiz.style.setProperty(
    "--textura-resultado-dados",
    tema.texturaResultado,
  );
}

aplicarTemaDadosNoDocumento(
  obterTemaVisualDadosAtual(),
);

let caixaDados3D = null;
let inicializacaoDados3D = null;
let previewsDados3DCriados =
  false;
  let quadroReposicionamentoPreviews =
  null;

let observadorJanelaDados =
  null;

let observadorTamanhoJanelaDados =
  null;

const dados3DAtivos = new Map();

const posicoesFinaisDados3D =
  new Map();

const posicoesFinaisTransicoes3D =
  new Map();

document.addEventListener(
  "dado3DParou",

  function registrarPosicaoFinalDado(
    evento,
  ) {
    const dadoId =
      String(
        evento.detail?.dadoId ??
        "",
      );

    if (!dadoId) {
      return;
    }

    posicoesFinaisDados3D.set(
      dadoId,
      {
        clientX:
          Number(
            evento.detail.clientX,
          ),

        clientY:
          Number(
            evento.detail.clientY,
          ),
      },
    );

    const idTransicao =
      evento.detail?.idTransicao;

    if (idTransicao) {
      posicoesFinaisTransicoes3D.set(
        String(idTransicao),
        {
          clientX:
            Number(
              evento.detail.clientX,
            ),

          clientY:
            Number(
              evento.detail.clientY,
            ),
        },
      );
    }
  },
);

const esperasResultadosFisicos =
  new Map();

function receberDado3DConcluido(
  dado,
) {
  const dadoId =
    String(dado?.rollId ?? "");

  const espera =
    esperasResultadosFisicos.get(
      dadoId,
    );

  if (!espera) {
    return;
  }

  esperasResultadosFisicos.delete(
    dadoId,
  );

  window.clearTimeout(
    espera.temporizador,
  );

  espera.resolver({
    numeroDeFaces:
      Number(dado.sides),

    resultado:
      Number(
        dado.value ??
        dado.result,
      ),

    grupoId:
      dado.groupId ?? null,

    dadoId,
  });
}

function aguardarResultadoFisico(
  dadoId,
) {
  const chave =
    String(dadoId);

  return new Promise(
    function criarEspera(
      resolver,
      rejeitar,
    ) {
      const temporizador =
        window.setTimeout(
          function expirarEspera() {
            esperasResultadosFisicos
              .delete(chave);

            rejeitar(
              new Error(
                "O dado 3D demorou demais para concluir o lançamento.",
              ),
            );
          },
          12000,
        );

      esperasResultadosFisicos.set(
        chave,
        {
          resolver,
          temporizador,
        },
      );
    },
  );
}

function inicializarDados3D() {
  if (inicializacaoDados3D) {
    return inicializacaoDados3D;
  }

  caixaDados3D = new DiceBox({
  id: "canvasDados3D",

  container:
    "#camadaDados3D",

  assetPath:
    "assets/",

  origin:
  new URL(
    "./vendor/dice-box/dist/",
    window.location.href,
  ).href,

  theme:
    "default",

  themeColor:
  obterTemaVisualDadosAtual()
    .corPrincipal,

  scale:
    6,

  enableShadows:
    true,

  onDieComplete:
    receberDado3DConcluido,

    offscreen:
  false,
});

  inicializacaoDados3D =
    caixaDados3D.init();

  return inicializacaoDados3D;
}

async function criarPreviewsDados3D() {
  if (previewsDados3DCriados) {
    return;
  }

  await inicializarDados3D();

  await caixaDados3D.updateConfig({
  delay: 0,
  settleTimeout: 150,
});

  camadaDados3D.style.visibility =
    "hidden";

  const facesDisponiveis =
    [4, 6, 8, 10, 12, 20];

  const configuracoes =
    facesDisponiveis.map(
      function criarPreview(
        numeroDeFaces,
      ) {
        return {
          qty:
            1,

          sides:
            numeroDeFaces,

          data: {
            tipo:
              "preview",

            numeroDeFaces,
          },
        };
      },
    );

  await caixaDados3D.add(
    configuracoes,
    {
      newStartPoint:
        false,
    },
  );

  await caixaDados3D.updateConfig({
  delay: 10,
  settleTimeout: 4000,
});

  document.dispatchEvent(
    new CustomEvent(
      "posicionarPreviewsDados3D",
    ),
  );

  previewsDados3DCriados =
    true;

    observarPosicaoJanelaDados();

  document.documentElement
    .classList.add(
      "previews-dados-3d-prontos",
    );

  camadaDados3D.style.visibility =
    "visible";

  camadaDados3D.setAttribute(
    "aria-hidden",
    "false",
  );
}

async function criarPreviewReposicao(
  numeroDeFaces,
) {
  await inicializarDados3D();

  await caixaDados3D.add(
    {
      qty:
        1,

      sides:
        numeroDeFaces,

      data: {
        tipo:
          "previewReposicao",

        numeroDeFaces,
      },
    },
    {
      newStartPoint:
        false,
    },
  );
}

function solicitarReposicionamentoPreviews() {
  if (
    !previewsDados3DCriados ||
    quadroReposicionamentoPreviews
  ) {
    return;
  }

  quadroReposicionamentoPreviews =
    window.requestAnimationFrame(
      function reposicionarPreviews() {
        quadroReposicionamentoPreviews =
          null;

        document.dispatchEvent(
          new CustomEvent(
            "posicionarPreviewsDados3D",
          ),
        );
      },
    );
}

function observarPosicaoJanelaDados() {
  const janelaDados =
    document.querySelector(
      ".janela-dados",
    );

  if (
    !janelaDados ||
    observadorJanelaDados
  ) {
    return;
  }

  observadorJanelaDados =
    new MutationObserver(
      solicitarReposicionamentoPreviews,
    );

  observadorJanelaDados.observe(
    janelaDados,
    {
      attributes:
        true,

      subtree:
        true,

      attributeFilter: [
        "style",
        "class",
        "hidden",
      ],
    },
  );

  observadorTamanhoJanelaDados =
    new ResizeObserver(
      solicitarReposicionamentoPreviews,
    );

  observadorTamanhoJanelaDados.observe(
    janelaDados,
  );

  window.addEventListener(
    "resize",
    solicitarReposicionamentoPreviews,
  );

  document.addEventListener(
    "scroll",
    solicitarReposicionamentoPreviews,
    true,
  );
}

async function definirTemaDados3D(
  temaId,
) {
  const novoTema =
    temasVisuaisDados[
      temaId
    ];

  if (!novoTema) {
    throw new Error(
      `Tema de dados desconhecido: ${temaId}`,
    );
  }

  temaVisualDadosAtual =
    temaId;

  aplicarTemaDadosNoDocumento(
    obterTemaVisualDadosAtual(),
  );

  if (caixaDados3D) {
    await caixaDados3D.updateConfig({
      themeColor:
        novoTema.corPrincipal,
    });
  }

  return obterTemaVisualDadosAtual();
}

function listarTemasVisuaisDados() {
  return Object.entries(
    temasVisuaisDados,
  ).map(
    function converterTema(
      [id, tema],
    ) {
      return {
        id,
        nome:
          tema.nome,

        corPrincipal:
          tema.corPrincipal,
      };
    },
  );
}

function converterResultadosDiceBox(
  resultadoDiceBox,
) {
  if (!Array.isArray(resultadoDiceBox)) {
    return [];
  }

  const dadosConvertidos = [];

  for (
    const item of resultadoDiceBox
  ) {
    /*
     * Formato agrupado:
     * [{ rolls: [{ sides, value }] }]
     */
    if (Array.isArray(item?.rolls)) {
      for (const dado of item.rolls) {
        const numeroDeFaces =
          Number(dado.sides);

        const resultado =
          Number(
            dado.value ??
            dado.result,
          );

        if (
          !Number.isInteger(
            numeroDeFaces,
          ) ||
          !Number.isFinite(resultado)
        ) {
          continue;
        }

        dadosConvertidos.push({
          numeroDeFaces,
          resultado,
          grupoId:
            dado.groupId ??
            item.id ??
            item.groupId ??
            null,

          dadoId:
            dado.rollId ??
            null,
        });
      }

      continue;
    }

    /*
     * Formato direto:
     * [{ sides, value }]
     */
    const numeroDeFaces =
      Number(item?.sides);

    const resultado =
      Number(
        item?.value ??
        item?.result,
      );

    if (
      !Number.isInteger(numeroDeFaces) ||
      !Number.isFinite(resultado)
    ) {
      continue;
    }

    dadosConvertidos.push({
      numeroDeFaces,
      resultado,
      grupoId:
        item.groupId ??
        null,

      dadoId:
        item.rollId ??
        null,
    });
  }

  return dadosConvertidos;
}

function registrarDados3D(
  dadosConvertidos,
) {
  for (const dado of dadosConvertidos) {
    if (
      dado.dadoId === null ||
      dado.dadoId === undefined
    ) {
      continue;
    }

    const dadoId =
      String(dado.dadoId);

    dados3DAtivos.set(dadoId, {
      ...dado,
      dadoId,
    });
  }
}

function listarDados3D() {
  return Array.from(
    dados3DAtivos.values(),
  ).map(function copiarDado(dado) {
    return {
      ...dado,
    };
  });
}

async function removerDado3D(
  dadoId,
) {
  const chaveDado =
    String(dadoId);

  const dado =
    dados3DAtivos.get(
      chaveDado,
    );

  if (!dado || !caixaDados3D) {
    return false;
  }

  await caixaDados3D.remove({
    rollId:
      dado.dadoId,
  });

  dados3DAtivos.delete(
    chaveDado,
  );

  document.dispatchEvent(
    new CustomEvent(
      "dado3DRemovido",
      {
        detail: {
          dadoId:
            chaveDado,
        },
      },
    ),
  );

  if (dados3DAtivos.size === 0) {
    camadaDados3D.setAttribute(
      "aria-hidden",
      "true",
    );
  }

  return true;
}

async function relancarDado3D(
  dadoId,
  configuracao = {},
) {
  const chaveDado =
    String(dadoId);

  const dadoAnterior =
    dados3DAtivos.get(
      chaveDado,
    );

  if (
    !dadoAnterior ||
    !caixaDados3D
  ) {
    return null;
  }

  const quantidade =
    Math.max(
      1,
      Number(
        configuracao.quantidade,
      ) || 1,
    );

  const pontoSoltura =
    configuracao.pontoSoltura;

  const possuiPontoSoltura =
    Number.isFinite(
      pontoSoltura?.x,
    ) &&
    Number.isFinite(
      pontoSoltura?.z,
    );

  if (possuiPontoSoltura) {
    await caixaDados3D.updateConfig({
      startPosition: [
        pontoSoltura.x,
        3,
        pontoSoltura.z,
      ],

      startingHeight:
        3,

      throwForce:
        0.15,

      linearDamping:
        0.72,
    });
  }

  await caixaDados3D.remove({
    rollId:
      dadoAnterior.dadoId,
  });

  const resultadoOriginal =
    await caixaDados3D.add(
      `${quantidade}d${dadoAnterior.numeroDeFaces}`,
      {
        newStartPoint:
          !possuiPontoSoltura,
      },
    );

  if (possuiPontoSoltura) {
    await caixaDados3D.updateConfig({
      startingHeight:
        8,

      throwForce:
        5,

      linearDamping:
        0.5,
    });
  }

  const dadosConvertidos =
    converterResultadosDiceBox(
      resultadoOriginal,
    );

  if (dadosConvertidos.length === 0) {
    throw new Error(
      "O relançamento 3D não retornou um resultado válido.",
    );
  }

  dados3DAtivos.delete(
    chaveDado,
  );

  registrarDados3D(
    dadosConvertidos,
  );

  return {
    original:
      resultadoOriginal,

    dados:
      dadosConvertidos,
  };
}

async function rolarDados3D(
  notacao,
  configuracao = {},
) {
  await inicializarDados3D();

  camadaDados3D.setAttribute(
    "aria-hidden",
    "false",
  );

  const pontoSoltura =
    configuracao.pontoSoltura;

  const idTransicao =
    configuracao.idTransicao ??
    null;

  const possuiPontoSoltura =
    Number.isFinite(
      pontoSoltura?.x,
    ) &&
    Number.isFinite(
      pontoSoltura?.z,
    );

  if (possuiPontoSoltura) {
    await caixaDados3D.updateConfig({
      startPosition: [
        pontoSoltura.x,
        3,
        pontoSoltura.z,
      ],

      startingHeight:
        3,

      throwForce:
        0,

      spinForce:
        12,

      linearDamping:
        0.62,

      angularDamping:
        0.35,
    });
  }

  let notacaoDiceBox =
    notacao;

  if (
    idTransicao &&
    typeof notacao === "string"
  ) {
    const correspondencia =
      notacao.trim().match(
        /^(\d+)d(\d+)$/i,
      );

    if (correspondencia) {
      notacaoDiceBox = {
        qty:
          Number(correspondencia[1]),
        sides:
          Number(correspondencia[2]),
        data: {
          tipo:
            "lancamentoEstatico",
          idTransicao,
          pontoSoltura,
        },
      };
    }
  }

  const resultadoOriginal =
    await caixaDados3D.add(
      notacaoDiceBox,
      {
        newStartPoint:
          !possuiPontoSoltura,
      },
    );

  if (possuiPontoSoltura) {
    await caixaDados3D.updateConfig({
      startingHeight:
        8,

      throwForce:
        5,

      spinForce:
        6,

      linearDamping:
        0.5,

      angularDamping:
        0.4,
    });
  }

  const dadosConvertidos =
    converterResultadosDiceBox(
      resultadoOriginal,
    );

  if (dadosConvertidos.length === 0) {
    throw new Error(
      "O lançamento 3D não retornou dados válidos.",
    );
  }

  registrarDados3D(
  dadosConvertidos,
);

  const primeiroDado =
    dadosConvertidos[0];

  const posicaoFinal =
    (
      idTransicao
        ? posicoesFinaisTransicoes3D.get(
            String(idTransicao),
          )
        : null
    ) ??
    (primeiroDado?.dadoId
      ? posicoesFinaisDados3D.get(
          String(
            primeiroDado.dadoId,
          ),
        ) ?? null
      : null);

  if (idTransicao) {
    posicoesFinaisTransicoes3D.delete(
      String(idTransicao),
    );
  }

  for (const dado of dadosConvertidos) {
    if (dado.dadoId) {
      posicoesFinaisDados3D.delete(
        String(dado.dadoId),
      );
    }
  }

  return {
    original:
      resultadoOriginal,

    dados:
      dadosConvertidos,

    posicaoFinal,
  };
}

async function converterPontoTelaParaMesa3D(
  clientX,
  clientY,
) {
  await inicializarDados3D();

  const detalhe = {
    clientX,
    clientY,
    ponto:
      null,
  };

  document.dispatchEvent(
    new CustomEvent(
      "obterPontoMesa3D",
      {
        detail:
          detalhe,
      },
    ),
  );

  return detalhe.ponto;
}

async function testarDado3D(
  notacao = "1d20",
) {
  try {
  const lancamento =
    await rolarDados3D(
      notacao,
    );

  const resultadoProjeto =
    window.MotorDados.criarResultado(
      lancamento.dados,
      {
        modificador: 0,
        descricao:
          "Teste experimental 3D",
        quantidadeDeRolagens: 1,
        critico: false,
      },
    );

  console.log(
    "Resultado original do Dice Box:",
    lancamento.original,
  );

  console.table(
    lancamento.dados,
  );

  console.log(
    "Resultado convertido para o RPG Solo:",
    resultadoProjeto,
  );

  return {
    original:
      lancamento.original,

    dados:
      lancamento.dados,

    resultado:
      resultadoProjeto,
  };
    

  } catch (erro) {
    console.error(
      "Não foi possível lançar os dados 3D.",
      erro,
    );

    return null;
  }
}

function limparDados3D() {
  if (!caixaDados3D) {
    return;
  }

  caixaDados3D.clear();
  dados3DAtivos.clear();

  camadaDados3D.setAttribute(
    "aria-hidden",
    "true",
  );
}

document.addEventListener(
  "dado3DSelecionado",

  async function removerDadoSelecionado(
    evento,
  ) {
    const dadoId =
      evento.detail?.dadoId;

    try {
      const removeu =
        await removerDado3D(
          dadoId,
        );

      if (removeu) {
        console.log(
          "Dado 3D removido:",
          dadoId,
        );
      }
    } catch (erro) {
      console.error(
        "Não foi possível remover o dado 3D.",
        erro,
      );
    }
  },
);

document.addEventListener(
  "dado3DRelancamentoSolicitado",

  async function relancarDadoArrastado(
    evento,
  ) {
    const dadoId =
      evento.detail?.dadoId;

    try {
      const lancamento =
        await relancarDado3D(
          dadoId,
          {
            quantidade:
              evento.detail
                ?.quantidade ??
              1,

            pontoSoltura:
              evento.detail
                ?.pontoSoltura ??
              null,
          },
        );

      if (lancamento) {
  document.dispatchEvent(
    new CustomEvent(
      "dado3DRelancado",
      {
        detail: {
          dados:
            lancamento.dados,
        },
      },
    ),
  );
}
    } catch (erro) {
      console.error(
        "Não foi possível relançar o dado 3D.",
        erro,
      );
    }
  },
);

document.addEventListener(
  "dado3DFisicoLancado",

  async function concluirDadoFisicoLancado(
    evento,
  ) {
    const detalhe =
      evento.detail ?? {};

    const dadoId =
      String(detalhe.dadoId ?? "");

    const numeroDeFaces =
      Number(detalhe.numeroDeFaces);

    const quantidade =
      Math.max(
        1,
        Number(detalhe.quantidade) ||
          1,
      );

    if (
      !dadoId ||
      !Number.isInteger(numeroDeFaces)
    ) {
      return;
    }

    try {
      const resultadoPrincipal =
        aguardarResultadoFisico(
          dadoId,
        );

      if (detalhe.eraPreview) {
        void criarPreviewReposicao(
          numeroDeFaces,
        ).catch(
          function tratarFalhaReposicao(
            erro,
          ) {
            console.warn(
              "Não foi possível repor o dado na bandeja.",
              erro,
            );
          },
        );
      }

      let dadosAdicionais = [];

      if (quantidade > 1) {
        const lancamentoAdicional =
          await rolarDados3D(
            `${quantidade - 1}d${numeroDeFaces}`,
            {
              pontoSoltura:
                detalhe.pontoSoltura ??
                null,
            },
          );

        dadosAdicionais =
          lancamentoAdicional.dados;
      }

      const dadoPrincipal =
        await resultadoPrincipal;

        const posicaoFinal =
  posicoesFinaisDados3D.get(
    dadoId,
  ) ?? {
    clientX:
      detalhe.clientX,

    clientY:
      detalhe.clientY,
  };

posicoesFinaisDados3D.delete(
  dadoId,
);

      registrarDados3D([
        dadoPrincipal,
      ]);

      document.dispatchEvent(
        new CustomEvent(
          "dado3DFisicoConcluido",
          {
            detail: {
              dados: [
                dadoPrincipal,
                ...dadosAdicionais,
              ],

              clientX:
                posicaoFinal.clientX,

              clientY:
                posicaoFinal.clientY,
            },
          },
        ),
      );
    } catch (erro) {
      console.error(
        "Não foi possível concluir o lançamento do dado segurado.",
        erro,
      );
    }
  },
);

window.Dados3D = {
  inicializar:
    inicializarDados3D,

  converterPontoTela:
    converterPontoTelaParaMesa3D,

    definirTema:
  definirTemaDados3D,

listarTemas:
  listarTemasVisuaisDados,

obterConfiguracaoVisual:
  obterTemaVisualDadosAtual,

    rolar:
    rolarDados3D,

  testar:
    testarDado3D,

  limpar:
    limparDados3D,

    listar:
    listarDados3D,

    remover:
  removerDado3D,

  relancar:
  relancarDado3D,
};
