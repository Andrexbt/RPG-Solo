(function() {
  function obterDetalheHabilidade(idHabilidade) {
    if (window.bancoHabilidades === undefined) {
      return undefined;
    }

    if (
      window.bancoHabilidades.classFeatures !== undefined &&
      window.bancoHabilidades.classFeatures[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.classFeatures[idHabilidade];
    }

    if (
      window.bancoHabilidades.feats !== undefined &&
      window.bancoHabilidades.feats[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.feats[idHabilidade];
    }

    if (
      window.bancoHabilidades.traits !== undefined &&
      window.bancoHabilidades.traits[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.traits[idHabilidade];
    }

    return undefined;
  }

  function obterDetalheFicha(tipo, id) {
    if (tipo === "habilidade") {
      return obterDetalheHabilidade(id);
    }

    if (tipo === "talento") {
      if (window.bancoTalentos === undefined) {
        return undefined;
      }

      return window.bancoTalentos[id];
    }

    if (tipo === "maestria") {
      if (window.bancoMaestrias === undefined) {
        return undefined;
      }

      return window.bancoMaestrias[id];
    }

    if (tipo === "propriedadeArma") {
      if (window.bancoPropriedadesArmas === undefined) {
        return undefined;
      }

      return window.bancoPropriedadesArmas[id];
    }

    return undefined;
  }

  function obterTipoLegivelDetalhe(tipo, detalhe) {
    if (tipo === "habilidade") {
      return "Habilidade";
    }

    if (tipo === "talento") {
      if (detalhe.tipo !== undefined && detalhe.tipo !== "") {
        return "Talento de " + detalhe.tipo;
      }

      return "Talento";
    }

    if (tipo === "maestria") {
      return "Maestria de arma";
    }

    if (tipo === "propriedadeArma") {
      return "Propriedade de arma";
    }

    return "Detalhe da ficha";
  }

  function adicionarParagrafoMecanica(container, rotulo, valor) {
    if (valor === undefined || valor === "") {
      return;
    }

    const paragrafo = document.createElement("p");
    paragrafo.innerHTML = "<strong>" + rotulo + ":</strong> " + valor;

    container.appendChild(paragrafo);
  }

  function preencherMecanicaHabilidade(container, id, contexto) {
    if (contexto === undefined || contexto.recursos === undefined) {
      return;
    }

    const recurso = contexto.recursos[id];

    if (recurso === undefined) {
      return;
    }

    adicionarParagrafoMecanica(
      container,
      "Usos",
      recurso.usosAtuais + " / " + recurso.usosMaximos
    );

    if (recurso.efeito === "cura") {
      adicionarParagrafoMecanica(container, "Cura", recurso.formula);
    }

    if (recurso.recuperaEm === "descansoLongo") {
      adicionarParagrafoMecanica(container, "Recupera em", "descanso longo");
    } else {
      adicionarParagrafoMecanica(container, "Recupera em", recurso.recuperaEm);
    }
  }

  function preencherMecanicaDetalhe(container, tipo, id, detalhe, contexto) {
    adicionarParagrafoMecanica(
      container,
      "Tipo",
      obterTipoLegivelDetalhe(tipo, detalhe)
    );

    if (tipo === "habilidade") {
      preencherMecanicaHabilidade(container, id, contexto);
    }
  }

  function abrirModalDetalhe(tipo, id, contexto) {
    const detalhe = obterDetalheFicha(tipo, id);

    const modalDetalheFicha = document.getElementById("modalDetalheFicha");
    const modalDetalheTitulo = document.getElementById("modalDetalheTitulo");
    const modalDetalheDescricao = document.getElementById("modalDetalheDescricao");
    const modalDetalheMecanica = document.getElementById("modalDetalheMecanica");

    if (
      detalhe === undefined ||
      modalDetalheFicha === null ||
      modalDetalheTitulo === null ||
      modalDetalheDescricao === null ||
      modalDetalheMecanica === null
    ) {
      return;
    }

    modalDetalheTitulo.textContent = detalhe.nome;
    modalDetalheDescricao.textContent =
      detalhe.descricaoLonga || detalhe.descricaoCurta || "";

    modalDetalheMecanica.innerHTML = "";

    preencherMecanicaDetalhe(
      modalDetalheMecanica,
      tipo,
      id,
      detalhe,
      contexto || {}
    );

    modalDetalheFicha.classList.remove("escondida");
  }

  function fecharModalDetalhe() {
    const modalDetalheFicha = document.getElementById("modalDetalheFicha");

    if (modalDetalheFicha === null) {
      return;
    }

    modalDetalheFicha.classList.add("escondida");
  }

  function criarReferenciaDetalhe(tipo, id, texto, contexto) {
    const detalhe = obterDetalheFicha(tipo, id);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("botao-detalhe-inline");

    if (texto !== undefined && texto !== "") {
      botao.textContent = texto;
    } else if (detalhe !== undefined) {
      botao.textContent = detalhe.nome;
    } else {
      botao.textContent = id;
    }

    botao.addEventListener("click", function(evento) {
      evento.stopPropagation();
      abrirPopoverDetalhe(
    tipo,
    id,
    botao,
    contexto || {}
  );
});

    return botao;
  }

  function inicializarModalDetalhe() {
  const modalDetalheFicha = document.getElementById("modalDetalheFicha");
  const botaoFecharModalDetalheFicha =
    document.getElementById("botaoFecharModalDetalheFicha");

  if (
    modalDetalheFicha !== null &&
    modalDetalheFicha.dataset.inicializado !== "true"
  ) {
    modalDetalheFicha.dataset.inicializado = "true";

    modalDetalheFicha.addEventListener("click", function(evento) {
      if (evento.target === modalDetalheFicha) {
        fecharModalDetalhe();
      }
    });
  }

  if (
    botaoFecharModalDetalheFicha !== null &&
    botaoFecharModalDetalheFicha.dataset.inicializado !== "true"
  ) {
    botaoFecharModalDetalheFicha.dataset.inicializado = "true";

    botaoFecharModalDetalheFicha.addEventListener("click", function() {
      fecharModalDetalhe();
    });
  }

  if (document.body.dataset.popoverDetalheInicializado !== "true") {
    document.body.dataset.popoverDetalheInicializado = "true";

    document.addEventListener("click", function(evento) {
      const popoverAtual = document.getElementById("popoverDetalheFicha");

      if (popoverAtual === null) {
        return;
      }

      if (popoverAtual.contains(evento.target)) {
        return;
      }

      if (
        evento.target.closest !== undefined &&
        evento.target.closest(".botao-detalhe-inline") !== null
      ) {
        return;
      }

      fecharPopoverDetalhe();
    });

    document.addEventListener("keydown", function(evento) {
      if (evento.key === "Escape") {
        fecharPopoverDetalhe();
        fecharModalDetalhe();
      }
    });
  }
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarModalDetalhe);
  } else {
    inicializarModalDetalhe();
  }

  window.obterDetalheFicha = obterDetalheFicha;
  window.abrirModalDetalhe = abrirModalDetalhe;
  window.fecharModalDetalhe = fecharModalDetalhe;
  window.abrirPopoverDetalhe = abrirPopoverDetalhe;
  window.fecharPopoverDetalhe = fecharPopoverDetalhe;
  window.criarReferenciaDetalhe = criarReferenciaDetalhe;
})();

function fecharPopoverDetalhe() {
  const popoverAtual = document.getElementById("popoverDetalheFicha");

  if (popoverAtual !== null) {
    popoverAtual.remove();
  }
}

function posicionarPopoverDetalhe(popover, elementoReferencia) {
  const retangulo = elementoReferencia.getBoundingClientRect();

  let esquerda = retangulo.left + window.scrollX;
  let topo = retangulo.bottom + window.scrollY + 8;

  document.body.appendChild(popover);

  const larguraPopover = popover.offsetWidth;
  const alturaPopover = popover.offsetHeight;

  const limiteDireito = window.scrollX + window.innerWidth - 16;
  const limiteInferior = window.scrollY + window.innerHeight - 16;

  if (esquerda + larguraPopover > limiteDireito) {
    esquerda = limiteDireito - larguraPopover;
  }

  if (esquerda < window.scrollX + 16) {
    esquerda = window.scrollX + 16;
  }

  if (topo + alturaPopover > limiteInferior) {
    topo = retangulo.top + window.scrollY - alturaPopover - 8;
  }

  if (topo < window.scrollY + 16) {
    topo = window.scrollY + 16;
  }

  popover.style.left = esquerda + "px";
  popover.style.top = topo + "px";
}

function abrirPopoverDetalhe(tipo, id, elementoReferencia, contexto) {
  const detalhe = obterDetalheFicha(tipo, id);

  if (detalhe === undefined || elementoReferencia === undefined) {
    return;
  }

  fecharPopoverDetalhe();

  const popover = document.createElement("div");
  popover.id = "popoverDetalheFicha";
  popover.classList.add("popover-detalhe-ficha");

  const titulo = document.createElement("h3");
  titulo.textContent = detalhe.nome;

  const descricao = document.createElement("p");
  descricao.textContent = detalhe.descricaoCurta || detalhe.descricaoLonga || "";

  const botaoDetalhes = document.createElement("button");
  botaoDetalhes.type = "button";
  botaoDetalhes.classList.add("botao-popover-detalhes");
  botaoDetalhes.textContent = "Ver detalhes";

  botaoDetalhes.addEventListener("click", function(evento) {
    evento.stopPropagation();

    fecharPopoverDetalhe();

    abrirModalDetalhe(tipo, id, contexto || {});
  });

  popover.appendChild(titulo);
  popover.appendChild(descricao);
  popover.appendChild(botaoDetalhes);

  posicionarPopoverDetalhe(popover, elementoReferencia);
}