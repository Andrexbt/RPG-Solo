"use strict";

(function iniciarEditorMensagens() {
  const CHAVE_RASCUNHO = "rpg-solo:mensagens-jogabilidade:rascunho:v1";
  const listaMensagens = document.querySelector("#listaMensagens");
  const buscaMensagens = document.querySelector("#buscaMensagens");
  const quantidadeMensagens = document.querySelector("#quantidadeMensagens");
  const estadoRascunho = document.querySelector("#estadoRascunho");
  const botaoSalvar = document.querySelector("#botaoSalvarMensagens");
  const botaoDescartar = document.querySelector("#botaoDescartarEdicoes");
  const botaoRestaurar = document.querySelector("#botaoRestaurarOriginais");

  const botoesAbas = document.querySelectorAll("[data-aba-textos]");
  let abaAtiva = "regras";

  const rotulosCanais = {
    acaoAtual: "Ação atual",
    solicitacao: "Solicitação",
    historicoTitulo: "Histórico — título",
    historicoDescricao: "Histórico — descrição",
  };

  const rotulosCategorias = {
    narracoes: "Narrações",
    regras: "Regras",
    interface: "Interface",
  };

  function normalizarCategoria(categoria) {
    if (categoria === "descricoesNarrativas") {
      return "narracoes";
    }

    return categoria;
  }

  function listarEntradas(objeto, caminho = []) {
    const entradas = [];

    for (const [chave, valor] of Object.entries(objeto ?? {})) {
      const novoCaminho = [...caminho, chave];

      if (valor?.canais) {
        entradas.push({ id: novoCaminho.join("."), ...valor });
      } else if (valor && typeof valor === "object") {
        entradas.push(...listarEntradas(valor, novoCaminho));
      }
    }

    return entradas;
  }

  function listarNarracoesCombate() {
    const entradas = [];

    for (const grupo of ["ataques", "categorias"]) {
      for (const [referencia, eventos] of Object.entries(window.narracaoCombate?.[grupo] ?? {})) {
        for (const [evento, variacoes] of Object.entries(eventos)) {
          entradas.push({
            id: `narracoes.combate.${grupo}.${referencia}.${evento}`,
            grupo,
            referencia,
            evento,
            variacoes,
          });
        }
      }
    }

    for (const [evento, variacoes] of Object.entries(window.narracaoCombate?.fallbacks ?? {})) {
      entradas.push({
        id: `narracoes.combate.fallbacks.${evento}`,
        grupo: "fallbacks",
        referencia: "qualquer ataque sem narração específica",
        evento,
        variacoes,
      });
    }

    return entradas;
  }

  const entradasOriginais = listarEntradas(window.mensagensNarrativas.eventos);
  const narracoesCombate = listarNarracoesCombate();

  function criarCardMensagem(entrada) {
    const card = document.createElement("article");
    card.className = "card-mensagem";
    card.dataset.idMensagem = entrada.id;

    const cabecalho = document.createElement("header");
    cabecalho.className = "cabecalho-card-mensagem";

    const id = document.createElement("strong");
    id.className = "id-mensagem";
    id.textContent = entrada.id;

    const momento = document.createElement("span");
    momento.className = "momento-mensagem";
    momento.textContent = entrada.momento;

    const variaveis = document.createElement("div");
    variaveis.className = "variaveis-mensagem";

    for (const nomeVariavel of entrada.variaveis ?? []) {
      const marcador = document.createElement("code");
      marcador.textContent = `{${nomeVariavel}}`;
      variaveis.append(marcador);
    }

    cabecalho.append(id, momento, variaveis);

    const canais = document.createElement("div");
    canais.className = "canais-mensagem";

    for (const [canal, texto] of Object.entries(entrada.canais)) {
      const campo = document.createElement("label");
      campo.className = "campo-canal";

      const rotulo = document.createElement("span");
      rotulo.textContent = rotulosCanais[canal] ?? canal;

      const editor = document.createElement("textarea");
      editor.value = texto;
      editor.dataset.canal = canal;
      editor.spellcheck = true;

      campo.append(rotulo, editor);
      canais.append(campo);
    }

    card.append(cabecalho, canais);
    return card;
  }

  function criarCardNarracaoCombate(entrada) {
    const card = document.createElement("article");
    card.className = "card-mensagem";
    card.dataset.idMensagem = entrada.id;

    const cabecalho = document.createElement("header");
    cabecalho.className = "cabecalho-card-mensagem";

    const id = document.createElement("strong");
    id.className = "id-mensagem";
    id.textContent = entrada.id;

    const momento = document.createElement("span");
    momento.className = "momento-mensagem";
    momento.textContent =
      `Quando ${entrada.referencia} resulta em “${entrada.evento}”. ` +
      "Uma das variações é escolhida aleatoriamente.";

    const variaveis = document.createElement("div");
    variaveis.className = "variaveis-mensagem";

    for (const nome of ["atacante", "alvo", "ataque", "dano"]) {
      const marcador = document.createElement("code");
      marcador.textContent = `{${nome}}`;
      variaveis.append(marcador);
    }

    cabecalho.append(id, momento, variaveis);

    const campos = document.createElement("div");
    campos.className = "canais-mensagem";

    entrada.variacoes.forEach(function criarVariacao(texto, indice) {
      const campo = document.createElement("label");
      campo.className = "campo-canal";

      const rotulo = document.createElement("span");
      rotulo.textContent = `Variação ${indice + 1}`;

      const editor = document.createElement("textarea");
      editor.value = texto;
      editor.dataset.variacao = String(indice);
      editor.spellcheck = true;

      campo.append(rotulo, editor);
      campos.append(campo);
    });

    card.append(cabecalho, campos);
    return card;
  }

  function renderizarCatalogo() {
    listaMensagens.innerHTML = "";

    const entradasPorCategoria = entradasOriginais.reduce((grupos, entrada) => {
      const categoria = normalizarCategoria(entrada.id.split(".")[0]);
      grupos[categoria] ??= [];
      grupos[categoria].push(entrada);
      return grupos;
    }, {});

    for (const [categoria, entradas] of Object.entries(entradasPorCategoria)) {
      const grupo = document.createElement("section");
      grupo.className = "grupo-categoria-mensagens";
      grupo.dataset.categoriaMensagens = categoria;

      const titulo = document.createElement("h2");
      titulo.textContent = rotulosCategorias[categoria] ?? categoria;
      grupo.append(titulo);

      for (const entrada of entradas) {
        grupo.append(criarCardMensagem(entrada));
      }

      listaMensagens.append(grupo);
    }

    let grupoNarracoes = listaMensagens.querySelector('[data-categoria-mensagens="narracoes"]');

    if (!grupoNarracoes) {
      grupoNarracoes = document.createElement("section");
      grupoNarracoes.className = "grupo-categoria-mensagens";
      grupoNarracoes.dataset.categoriaMensagens = "narracoes";

      const titulo = document.createElement("h2");
      titulo.textContent = "Narrações";

      grupoNarracoes.append(titulo);
      listaMensagens.append(grupoNarracoes);
    }

    for (const entrada of narracoesCombate) {
      grupoNarracoes.append(criarCardNarracaoCombate(entrada));
    }

    const quantidadeTotal = entradasOriginais.length + narracoesCombate.length;

    quantidadeMensagens.textContent =
      `${quantidadeTotal} ` +
      `${quantidadeTotal === 1 ? "mensagem catalogada" : "mensagens catalogadas"}`;
  }

  function lerEdicoesDaTela() {
    const edicoes = {};

    for (const card of listaMensagens.querySelectorAll("[data-id-mensagem]")) {
      const camposVariacoes = card.querySelectorAll("[data-variacao]");

      if (camposVariacoes.length > 0) {
        edicoes[card.dataset.idMensagem] = {
          variacoes: Array.from(camposVariacoes, (campo) => campo.value),
        };

        continue;
      }

      edicoes[card.dataset.idMensagem] = {
        canais: Object.fromEntries(
          Array.from(card.querySelectorAll("[data-canal]"), (campo) => [
            campo.dataset.canal,
            campo.value,
          ]),
        ),
      };
    }

    return edicoes;
  }

  function atualizarEstadoRascunho() {
    const possuiRascunho = Boolean(localStorage.getItem(CHAVE_RASCUNHO));
    estadoRascunho.textContent = possuiRascunho ? "Rascunho local ativo" : "Código original em uso";
    estadoRascunho.classList.toggle("ativo", possuiRascunho);
  }

  function salvarRascunho() {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(lerEdicoesDaTela()));
    atualizarEstadoRascunho();
  }

  function recarregarTela() {
    window.location.reload();
  }

  function restaurarOriginais() {
    if (!window.confirm("Remover todas as personalizações locais das mensagens?")) {
      return;
    }

    localStorage.removeItem(CHAVE_RASCUNHO);
    recarregarTela();
  }

  function filtrarMensagens() {
    const termo = buscaMensagens.value.trim().toLocaleLowerCase("pt-BR");

    for (const grupo of listaMensagens.querySelectorAll("[data-categoria-mensagens]")) {
      const pertenceAbaAtiva = grupo.dataset.categoriaMensagens === abaAtiva;

      for (const card of grupo.querySelectorAll("[data-id-mensagem]")) {
        const correspondeBusca =
          !termo || card.textContent.toLocaleLowerCase("pt-BR").includes(termo);

        card.hidden = !pertenceAbaAtiva || !correspondeBusca;
      }

      grupo.hidden = !pertenceAbaAtiva || !grupo.querySelector("[data-id-mensagem]:not([hidden])");
    }
  }

  function selecionarAba(evento) {
    const botao = evento.currentTarget;
    abaAtiva = botao.dataset.abaTextos;

    for (const outroBotao of botoesAbas) {
      const estaAtivo = outroBotao === botao;

      outroBotao.classList.toggle("ativa", estaAtivo);
      outroBotao.setAttribute("aria-selected", String(estaAtivo));
    }

    filtrarMensagens();
  }

  renderizarCatalogo();
  atualizarEstadoRascunho();
  filtrarMensagens();

  buscaMensagens.addEventListener("input", filtrarMensagens);
  for (const botaoAba of botoesAbas) {
    botaoAba.addEventListener("click", selecionarAba);
  }
  botaoSalvar.addEventListener("click", salvarRascunho);
  botaoDescartar.addEventListener("click", recarregarTela);
  botaoRestaurar.addEventListener("click", restaurarOriginais);
})();
