"use strict";

(function iniciarMotorDados() {
  function rolarDado(numeroDeFaces) {
    const faces = Number(numeroDeFaces);

    if (
      !Number.isInteger(faces) ||
      faces < 2
    ) {
      throw new TypeError(
        "O número de faces do dado é inválido.",
      );
    }

    return (
      Math.floor(Math.random() * faces) +
      1
    );
  }

  function somarResultados(resultados) {
    if (!Array.isArray(resultados)) {
      return 0;
    }

    return resultados.reduce(
      function somar(total, resultado) {
        return (
          total +
          (Number(resultado) || 0)
        );
      },
      0,
    );
  }

  function agruparDadosPorFaces(
    dadosDoLancamento,
  ) {
    const grupos = new Map();

    if (!Array.isArray(dadosDoLancamento)) {
      return grupos;
    }

    for (const dado of dadosDoLancamento) {
      const numeroDeFaces =
        Number(dado?.numeroDeFaces);

      const resultado =
        Number(dado?.resultado);

      if (
        !Number.isInteger(numeroDeFaces) ||
        !Number.isFinite(resultado)
      ) {
        continue;
      }

      const resultados =
        grupos.get(numeroDeFaces) ?? [];

      resultados.push(resultado);

      grupos.set(
        numeroDeFaces,
        resultados,
      );
    }

    return grupos;
  }

  function validarDadosDaRolagem(
    dadosDoLancamento,
    solicitacao,
  ) {
    if (!solicitacao) {
      return {
        sucesso: true,
      };
    }

    if (
      !Array.isArray(dadosDoLancamento) ||
      !Array.isArray(
        solicitacao.gruposDeDados,
      )
    ) {
      return {
        sucesso: false,
      };
    }

    const gruposLancados =
      agruparDadosPorFaces(
        dadosDoLancamento,
      );

    const quantidadeEsperada =
      solicitacao.gruposDeDados.reduce(
        function somarQuantidade(
          total,
          grupo,
        ) {
          return (
            total +
            (Number(grupo.quantidade) || 0)
          );
        },
        0,
      );

    if (
      dadosDoLancamento.length !==
      quantidadeEsperada
    ) {
      return {
        sucesso: false,
      };
    }

    for (
      const grupoEsperado of
      solicitacao.gruposDeDados
    ) {
      const resultados =
        gruposLancados.get(
          Number(
            grupoEsperado.numeroDeFaces,
          ),
        ) ?? [];

      if (
        resultados.length !==
        Number(grupoEsperado.quantidade)
      ) {
        return {
          sucesso: false,
        };
      }
    }

    const facesEsperadas =
      new Set(
        solicitacao.gruposDeDados.map(
          function obterFaces(grupo) {
            return Number(
              grupo.numeroDeFaces,
            );
          },
        ),
      );

    for (
      const numeroDeFaces of
      gruposLancados.keys()
    ) {
      if (
        !facesEsperadas.has(
          numeroDeFaces,
        )
      ) {
        return {
          sucesso: false,
        };
      }
    }

    return {
      sucesso: true,
    };
  }

  function separarResultadosPorRolagem(
  gruposRolados,
  quantidadeDeRolagens,
  modificador,
) {
  const quantidade =
    Math.max(
      1,
      Number(quantidadeDeRolagens) || 1,
    );

  const bonus =
    Number(modificador) || 0;

  if (!Array.isArray(gruposRolados)) {
    return [];
  }

  function criarResultadoUnico() {
    const subtotal =
      gruposRolados.reduce(
        function somarGrupos(
          total,
          grupo,
        ) {
          return (
            total +
            (Number(grupo.total) || 0)
          );
        },
        0,
      );

    return [
      {
        subtotal:
          subtotal,

        modificador:
          bonus,

        total:
          subtotal + bonus,
      },
    ];
  }

  if (quantidade <= 1) {
    return criarResultadoUnico();
  }

  const divisaoValida =
    gruposRolados.every(
      function verificarGrupo(grupo) {
        return (
          Array.isArray(
            grupo.resultados,
          ) &&
          grupo.resultados.length %
            quantidade ===
            0
        );
      },
    );

  if (!divisaoValida) {
    return criarResultadoUnico();
  }

  const resultadosSeparados = [];

  for (
    let indiceRolagem = 0;
    indiceRolagem < quantidade;
    indiceRolagem += 1
  ) {
    let subtotal = 0;

    for (const grupo of gruposRolados) {
      const quantidadePorRolagem =
        grupo.resultados.length /
        quantidade;

      const inicio =
        indiceRolagem *
        quantidadePorRolagem;

      const resultadosDestaRolagem =
        grupo.resultados.slice(
          inicio,
          inicio + quantidadePorRolagem,
        );

      subtotal +=
        somarResultados(
          resultadosDestaRolagem,
        );
    }

    resultadosSeparados.push({
      subtotal:
        subtotal,

      modificador:
        bonus,

      total:
        subtotal + bonus,
    });
  }

  return resultadosSeparados;
}

function criarResultadoRolagem(
  dadosDoLancamento,
  configuracao,
) {
  const gruposRolados =
    Array.from(
      agruparDadosPorFaces(
        dadosDoLancamento,
      ).entries(),
    ).map(
      function criarGrupo(
        [numeroDeFaces, resultados],
      ) {
        return {
          quantidade:
            resultados.length,

          numeroDeFaces:
            numeroDeFaces,

          resultados:
            resultados,

          total:
            somarResultados(
              resultados,
            ),
        };
      },
    );

  const subtotal =
    gruposRolados.reduce(
      function somarGrupos(
        total,
        grupo,
      ) {
        return total + grupo.total;
      },
      0,
    );

  const modificador =
    Number(
      configuracao?.modificador,
    ) || 0;

  return {
    gruposRolados:
      gruposRolados,

    subtotal:
      subtotal,

    modificador:
      modificador,

    total:
      subtotal + modificador,

    contexto: {
      descricao:
        configuracao?.descricao ??
        null,

      quantidadeDeRolagens:
        Math.max(
          1,
          Number(
            configuracao
              ?.quantidadeDeRolagens,
          ) || 1,
        ),

      critico:
        Boolean(
          configuracao?.critico,
        ),
    },
  };
}

function realizarRolagemComposta(
  configuracao,
) {
  const gruposDeDados =
    Array.isArray(
      configuracao?.gruposDeDados,
    )
      ? configuracao.gruposDeDados
      : [];

  const gruposRolados =
    gruposDeDados.map(
      function rolarGrupo(grupo) {
        const quantidade =
          Math.max(
            0,
            Number(grupo.quantidade) ||
              0,
          );

        const numeroDeFaces =
          Number(
            grupo.numeroDeFaces,
          ) || 0;

        const resultados = [];

        for (
          let indice = 0;
          indice < quantidade;
          indice += 1
        ) {
          resultados.push(
            rolarDado(numeroDeFaces),
          );
        }

        return {
          quantidade:
            quantidade,

          numeroDeFaces:
            numeroDeFaces,

          resultados:
            resultados,

          total:
            somarResultados(
              resultados,
            ),
        };
      },
    );

  const subtotal =
    gruposRolados.reduce(
      function somarGrupos(
        total,
        grupo,
      ) {
        return total + grupo.total;
      },
      0,
    );

  const modificador =
    Number(
      configuracao?.modificador,
    ) || 0;

  return {
    gruposRolados:
      gruposRolados,

    subtotal:
      subtotal,

    modificador:
      modificador,

    total:
      subtotal + modificador,
  };
}

  window.MotorDados = {
    rolarDado:
      rolarDado,

    somarResultados:
      somarResultados,

    agruparPorFaces:
      agruparDadosPorFaces,

    validarRolagem:
      validarDadosDaRolagem,

      separarResultados:
  separarResultadosPorRolagem,

  criarResultado:
  criarResultadoRolagem,

realizarRolagemComposta:
  realizarRolagemComposta,
  };
})();