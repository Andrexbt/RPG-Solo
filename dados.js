"use strict";

if (!document.currentScript) {
  const scriptDadosClassico = document.createElement("script");

  scriptDadosClassico.src = "dados.js?modo=classico";
  scriptDadosClassico.defer = true;

  document.head.append(scriptDadosClassico);
} else {
  (function iniciarSistemaDados() {
    const resultadoDado = document.querySelector("#resultadoDado");
    const dadosDisponiveis = document.querySelectorAll(".dado-disponivel");
    const camadaDadosLancados = document.querySelector("#camadaDadosLancados");
    const tabuleiroCombate = document.querySelector("#tabuleiroCombate");
    const solicitacaoCaixaDados = document.querySelector("#solicitacaoCaixaDados");

    const estadoCaixaDados = {
      proximoId: 1,
      dadosLancados: [],
    };

    let arrasteDadoAtual = null;
    let solicitacaoRolagemAtual = null;
    let ultimaPosicaoResultado = null;

    function prepararCamadaDados() {
      if (!camadaDadosLancados || !tabuleiroCombate) {
        return;
      }

      tabuleiroCombate.append(camadaDadosLancados);

      if (resultadoDado) {
        camadaDadosLancados.append(resultadoDado);
      }
    }

    prepararCamadaDados();

    function obterPosicaoNoTabuleiro(clientX, clientY) {
      if (!tabuleiroCombate) {
        return { x: clientX, y: clientY };
      }

      const retangulo = tabuleiroCombate.getBoundingClientRect();
      const escalaX = retangulo.width / tabuleiroCombate.offsetWidth || 1;
      const escalaY = retangulo.height / tabuleiroCombate.offsetHeight || 1;

      return {
        x: (clientX - retangulo.left) / escalaX,
        y: (clientY - retangulo.top) / escalaY,
      };
    }

    function calcularRaioLancamento(quantidadeTotal) {
      if (quantidadeTotal <= 1) {
        return 0;
      }

      const ultimoAnel = Math.floor((quantidadeTotal - 1) / 8);
      return 82 + ultimoAnel * 72;
    }

    function posicionarResultadoRolagem(x, y, quantidadeTotal) {
      if (!resultadoDado) {
        return;
      }

      const raio = calcularRaioLancamento(quantidadeTotal);
      const distanciaVertical = Math.max(84, raio + 68);

      ultimaPosicaoResultado = {
        x: x,
        y: y + distanciaVertical,
      };

      resultadoDado.style.left = `${ultimaPosicaoResultado.x}px`;
      resultadoDado.style.top = `${ultimaPosicaoResultado.y}px`;
    }

    function formatarExpressaoResultado(subtotal, modificador, total) {
      if (modificador < 0) {
        return `${subtotal} - ${Math.abs(modificador)} = ${total}`;
      }

      return `${subtotal} + ${modificador} = ${total}`;
    }

    function exibirResultadoFinal(resultado) {
      if (!resultadoDado) {
        return;
      }

      resultadoDado.textContent = formatarExpressaoResultado(
        resultado.subtotal,
        resultado.modificador,
        resultado.total,
      );

      resultadoDado.classList.remove("resultado-rolagem-erro");
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

      const dadosSolicitados = solicitacaoRolagemAtual.gruposDeDados
        .map(function formatarGrupo(grupo) {
          return `${grupo.quantidade}d${grupo.numeroDeFaces}`;
        })
        .join(" + ");

      const modificador = solicitacaoRolagemAtual.modificador;
      const textoModificador =
        modificador > 0
          ? ` + ${modificador}`
          : modificador < 0
            ? ` - ${Math.abs(modificador)}`
            : "";

      solicitacaoCaixaDados.textContent = `${dadosSolicitados}${textoModificador}`;
      solicitacaoCaixaDados.hidden = false;
    }

    function configurarRolagemSolicitada(configuracao) {
      if (!configuracao) {
        solicitacaoRolagemAtual = null;
        atualizarSolicitacaoCaixaDados();
        return;
      }

      solicitacaoRolagemAtual = {
        gruposDeDados: structuredClone(configuracao.gruposDeDados ?? []),
        modificador: Number(configuracao.modificador) || 0,
        descricao: configuracao.descricao ?? "Rolagem solicitada",
      };

      atualizarSolicitacaoCaixaDados();
      console.log("Rolagem solicitada:", solicitacaoRolagemAtual);
    }

    window.configurarRolagemSolicitada = configurarRolagemSolicitada;

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
      return formatarExpressaoResultado(
        rolagem.subtotal,
        rolagem.modificador,
        rolagem.total,
      );
    }

    function buscarDadoLancado(idDado) {
      return estadoCaixaDados.dadosLancados.find(function encontrarDado(dado) {
        return dado.id === idDado;
      });
    }

    function criarMiniaturaDadoArraste(numeroDeFaces, indice) {
      const miniatura = document.createElement("span");

      miniatura.classList.add("miniatura-dado-arraste");
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
        const x = Math.cos(angulo) * raio;
        const y = Math.sin(angulo) * raio;
        const rotacao = -18 + ((indice * 17) % 37);

        miniatura.style.setProperty("--miniatura-x", `${x}px`);
        miniatura.style.setProperty("--miniatura-y", `${y}px`);
        miniatura.style.setProperty("--miniatura-rotacao", `${rotacao}deg`);
        miniatura.style.zIndex = String(quantidade - indice);
      });
    }

    function criarFantasmaArraste(numeroDeFaces, x, y) {
      const grupo = document.createElement("div");

      grupo.classList.add("grupo-dados-em-arraste");
      grupo.append(criarMiniaturaDadoArraste(numeroDeFaces, 0));

      camadaDadosLancados.append(grupo);
      posicionarMiniaturasArraste(grupo);
      posicionarFantasmaArraste(grupo, x, y);

      return grupo;
    }

    function adicionarMiniaturaAoArraste() {
      if (!arrasteDadoAtual) {
        return;
      }

      const indice = arrasteDadoAtual.quantidade - 1;
      const miniatura = criarMiniaturaDadoArraste(
        arrasteDadoAtual.numeroDeFaces,
        indice,
      );

      arrasteDadoAtual.fantasma.append(miniatura);
      posicionarMiniaturasArraste(arrasteDadoAtual.fantasma);
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

      const posicao = obterPosicaoNoTabuleiro(evento.clientX, evento.clientY);

      arrasteDadoAtual = {
        elementoOrigem: elementoDado,
        numeroDeFaces: numeroDeFaces,
        quantidade: 1,
        dadoExistenteId: elementoDado.dataset.idDado ?? null,
        x: posicao.x,
        y: posicao.y,
        fantasma: criarFantasmaArraste(numeroDeFaces, posicao.x, posicao.y),
      };

      elementoDado.classList.add("dado-sendo-arrastado");
      document.body.classList.add("arrastando-dado");
    }

    function moverArrasteManualDado(evento) {
      if (!arrasteDadoAtual) {
        return;
      }

      const posicao = obterPosicaoNoTabuleiro(evento.clientX, evento.clientY);

      arrasteDadoAtual.x = posicao.x;
      arrasteDadoAtual.y = posicao.y;

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
      adicionarMiniaturaAoArraste();
    }

    function concluirArrasteManualDado(evento) {
      if (!arrasteDadoAtual || evento.button !== 0) {
        return;
      }

      evento.preventDefault();

      const lancamento = arrasteDadoAtual;
      const posicao = obterPosicaoNoTabuleiro(evento.clientX, evento.clientY);

      arrasteDadoAtual = null;

      lancamento.elementoOrigem.classList.remove("dado-sendo-arrastado");
      lancamento.fantasma.remove();
      document.body.classList.remove("arrastando-dado");

      executarLancamentoPreparado(lancamento, posicao.x, posicao.y);
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
      posicionarResultadoRolagem(x, y, lancamento.quantidade);

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

          posicionarDadoLancado(
            elementoExistente,
            x,
            y,
            0,
            lancamento.quantidade,
          );
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
        emitirRolagemConcluida(dadosDoLancamento);
      }, 560);
    }

    function criarNovoDadoLancado(numeroDeFaces, x, y, indice, quantidadeTotal) {
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

      posicionarDadoLancado(elementoDado, x, y, indice, quantidadeTotal);
      animarDadoLancado(elementoDado, dadoLancado);

      return dadoLancado;
    }

    function calcularDeslocamentoLancamento(indice, quantidadeTotal) {
      if (quantidadeTotal <= 1) {
        return { x: 0, y: 0 };
      }

      const quantidadePrimeiroAnel = Math.min(8, quantidadeTotal);
      const anel = Math.floor(indice / 8);
      const posicaoNoAnel = indice % 8;
      const itensNesteAnel =
        anel === 0
          ? quantidadePrimeiroAnel
          : Math.min(8, quantidadeTotal - anel * 8);
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
    }

    function agruparDadosLancadosPorFaces(dadosDoLancamento) {
      const gruposPorFaces = new Map();

      for (const dado of dadosDoLancamento) {
        const resultados = gruposPorFaces.get(dado.numeroDeFaces) ?? [];

        resultados.push(dado.resultado);
        gruposPorFaces.set(dado.numeroDeFaces, resultados);
      }

      return gruposPorFaces;
    }

    function validarDadosDaRolagem(dadosDoLancamento, solicitacao) {
      if (!solicitacao) {
        return { sucesso: true, motivo: null };
      }

      const gruposLancados = agruparDadosLancadosPorFaces(dadosDoLancamento);
      const gruposEsperados = solicitacao.gruposDeDados;
      const quantidadeEsperada = gruposEsperados.reduce(
        function somarQuantidade(total, grupo) {
          return total + grupo.quantidade;
        },
        0,
      );

      if (dadosDoLancamento.length !== quantidadeEsperada) {
        return {
          sucesso: false,
          motivo: "quantidadeIncorreta",
          quantidadeEsperada: quantidadeEsperada,
          quantidadeRecebida: dadosDoLancamento.length,
        };
      }

      for (const grupoEsperado of gruposEsperados) {
        const resultadosLancados = gruposLancados.get(grupoEsperado.numeroDeFaces) ?? [];

        if (resultadosLancados.length !== grupoEsperado.quantidade) {
          return {
            sucesso: false,
            motivo: "tipoDeDadoIncorreto",
            numeroDeFacesEsperado: grupoEsperado.numeroDeFaces,
            quantidadeEsperada: grupoEsperado.quantidade,
            quantidadeRecebida: resultadosLancados.length,
          };
        }
      }

      const tiposEsperados = new Set(
        gruposEsperados.map(function obterFaces(grupo) {
          return grupo.numeroDeFaces;
        }),
      );

      for (const numeroDeFaces of gruposLancados.keys()) {
        if (!tiposEsperados.has(numeroDeFaces)) {
          return {
            sucesso: false,
            motivo: "dadoNaoSolicitado",
            numeroDeFaces: numeroDeFaces,
          };
        }
      }

      return { sucesso: true, motivo: null };
    }

    function formatarGruposDeDados(grupos) {
      return grupos
        .map(function formatarGrupo(grupo) {
          return `${grupo.quantidade}d${grupo.numeroDeFaces}`;
        })
        .join(" + ");
    }

    function exibirErroRolagemIncorreta(validacao, solicitacao) {
      if (!resultadoDado) {
        return;
      }

      const dadosEsperados = formatarGruposDeDados(solicitacao.gruposDeDados);

      resultadoDado.textContent = `Use ${dadosEsperados}`;
      resultadoDado.classList.add("resultado-rolagem-erro");

      console.warn("Rolagem incorreta:", validacao);
    }

    function emitirRolagemConcluida(dadosDoLancamento) {
      if (!Array.isArray(dadosDoLancamento) || dadosDoLancamento.length === 0) {
        return;
      }

      const validacao = validarDadosDaRolagem(
        dadosDoLancamento,
        solicitacaoRolagemAtual,
      );

      if (!validacao.sucesso) {
        exibirErroRolagemIncorreta(validacao, solicitacaoRolagemAtual);
        return;
      }

      const gruposPorFaces = agruparDadosLancadosPorFaces(dadosDoLancamento);
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
      const modificador = solicitacaoRolagemAtual?.modificador ?? 0;
      const resultado = {
        gruposRolados: gruposRolados,
        subtotal: subtotal,
        modificador: modificador,
        total: subtotal + modificador,
      };

      exibirResultadoFinal(resultado);

      document.dispatchEvent(
        new CustomEvent("rolagemConcluida", {
          detail: resultado,
        }),
      );

      console.log("Rolagem concluída pela caixa de dados:", resultado);

      solicitacaoRolagemAtual = null;
      atualizarSolicitacaoCaixaDados();
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
  })();
}
