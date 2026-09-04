"use strict";

(function configurarMapaAventuraDev() {
  const ambienteLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
    window.location.hostname,
  );

  if (!ambienteLocal) {
    return;
  }

  const chavesTexto = new Set(["contexto", "texto", "descricao", "instrucao"]);
  let modal = null;
  let areaGrafo = null;
  let rolagemGrafo = null;
  let painelDetalhes = null;
  let analiseAtual = null;
  let escalaGrafo = 0.7;

  function textoPreenchido(valor) {
    return typeof valor === "string" && valor.trim().length > 0;
  }

  function cenaTemConteudo(cena) {
    if (!cena || typeof cena !== "object" || Object.keys(cena).length === 0) {
      return false;
    }

    let encontrou = Boolean(cena.combate?.mapa);

    percorrer(cena, function verificarTexto(valor, chave) {
      if (chavesTexto.has(chave) && textoPreenchido(valor)) {
        encontrou = true;
      }
    });

    return encontrou;
  }

  function percorrer(valor, visitante, caminho = "cena", visitados = new WeakSet()) {
    if (!valor || typeof valor !== "object") {
      return;
    }

    if (visitados.has(valor)) {
      return;
    }

    visitados.add(valor);

    for (const [chave, filho] of Object.entries(valor)) {
      const caminhoFilho = `${caminho}.${chave}`;
      visitante(filho, chave, valor, caminhoFilho);

      if (filho && typeof filho === "object") {
        percorrer(filho, visitante, caminhoFilho, visitados);
      }
    }
  }

  function resumirTexto(cena) {
    const trechos = [];

    percorrer(cena, function coletarTexto(valor, chave) {
      if (trechos.length >= 3 || !chavesTexto.has(chave)) {
        return;
      }

      if (textoPreenchido(valor)) {
        trechos.push(valor.replace(/\s+/g, " ").trim());
      } else if (Array.isArray(valor)) {
        const texto = valor.find(textoPreenchido);
        if (texto) {
          trechos.push(texto.replace(/\s+/g, " ").trim());
        }
      }
    });

    return trechos.join(" ").slice(0, 520) || "Nenhum texto narrativo preenchido.";
  }

  function rotuloCaminho(caminho) {
    return caminho
      .replace(/^cena\./, "")
      .replace(/\.proxima(Cena|Etapa)$/, "")
      .replace(/\.(\d+)\./g, " $1 — ");
  }

  function analisarCena(cenaId, cena, cenas) {
    const erros = [];
    const avisos = [];
    const destinos = [];
    const etapas = Object.keys(cena?.etapas ?? {});
    const testes = [];
    const escolhas = [];

    if (!cena || Object.keys(cena).length === 0) {
      erros.push("Cena declarada, mas ainda sem conteúdo.");
    } else if (!cenaTemConteudo(cena)) {
      avisos.push("A cena ainda não possui texto narrativo nem mapa de combate.");
    }

    if (cena?.combate) {
      if (!textoPreenchido(cena.combate.mapa)) erros.push("Combate sem mapa.");
      if (!(cena.combate.inimigos?.length > 0)) erros.push("Combate sem inimigos.");
      if (!cena.combate.resultados || Object.keys(cena.combate.resultados).length === 0) {
        erros.push("Combate sem resultados configurados.");
      }
      if (!(cena.combate.objetivos?.length > 0)) {
        avisos.push("Combate sem objetivos explícitos.");
      }
    }

    percorrer(cena, function inspecionar(valor, chave, pai, caminho) {
      if (chave === "proximaCena") {
        const destino = typeof valor === "string" ? valor.trim() : "";
        destinos.push({ tipo: "cena", destino, origem: rotuloCaminho(caminho) });

        if (!destino) {
          erros.push(`Destino de cena vazio em ${rotuloCaminho(caminho)}.`);
        } else if (!cenas[destino]) {
          erros.push(`O caminho aponta para a cena inexistente “${destino}”.`);
        } else if (!cenaTemConteudo(cenas[destino])) {
          avisos.push(`O caminho chega a “${destino}”, que ainda não tem conteúdo.`);
        }
      }

      if (chave === "proximaEtapa") {
        const destino = typeof valor === "string" ? valor.trim() : "";
        destinos.push({ tipo: "etapa", destino, origem: rotuloCaminho(caminho) });

        if (!destino) {
          erros.push(`Destino de etapa vazio em ${rotuloCaminho(caminho)}.`);
        } else if (!cena?.etapas?.[destino]) {
          erros.push(`O caminho aponta para a etapa inexistente “${destino}”.`);
        }
      }

      if (chave === "teste" && valor && typeof valor === "object") {
        testes.push({ caminho: rotuloCaminho(caminho), teste: valor });
      }

      if (chave === "escolhas" && Array.isArray(valor)) {
        valor.forEach(function registrarEscolha(escolha, indice) {
          escolhas.push({
            caminho: `${rotuloCaminho(caminho)} ${indice + 1}`,
            texto: escolha?.texto ?? escolha?.id ?? `Escolha ${indice + 1}`,
          });

          if (
            escolha &&
            !escolha.proximaCena &&
            !escolha.proximaEtapa &&
            !escolha.fimAventura &&
            !escolha.teste
          ) {
            erros.push(`Escolha sem consequência em ${rotuloCaminho(caminho)} ${indice + 1}.`);
          }
        });
      }
    });

    return {
      cenaId,
      cena,
      erros: [...new Set(erros)],
      avisos: [...new Set(avisos)],
      destinos,
      etapas,
      testes,
      escolhas,
      resumo: resumirTexto(cena),
      combate: Boolean(cena?.combate),
      incompleta: !cenaTemConteudo(cena),
    };
  }

  function analisarAventura(aventura) {
    const cenas = aventura?.cenas ?? {};
    const cenasAnalisadas = Object.fromEntries(
      Object.entries(cenas).map(([cenaId, cena]) => [
        cenaId,
        analisarCena(cenaId, cena, cenas),
      ]),
    );
    const arestas = [];

    for (const analise of Object.values(cenasAnalisadas)) {
      for (const destino of analise.destinos) {
        if (destino.tipo === "cena" && destino.destino && cenas[destino.destino]) {
          arestas.push({ origem: analise.cenaId, destino: destino.destino });
        }
      }
    }

    return { aventura, cenas: cenasAnalisadas, arestas };
  }

  function criarFluxoAventura(analise) {
    const nos = new Map();
    const arestas = [];
    const chaveCena = (cenaId) => `cena:${cenaId}`;
    const chaveEtapa = (cenaId, etapaId) => `etapa:${cenaId}:${etapaId}`;

    for (const [cenaId, analiseCena] of Object.entries(analise.cenas)) {
      nos.set(chaveCena(cenaId), {
        id: chaveCena(cenaId),
        tipo: "cena",
        cenaId,
        rotulo: cenaId,
        analise: analiseCena,
      });

      for (const etapaId of analiseCena.etapas) {
        nos.set(chaveEtapa(cenaId, etapaId), {
          id: chaveEtapa(cenaId, etapaId),
          tipo: "etapa",
          cenaId,
          etapaId,
          rotulo: etapaId,
          analise: analiseCena,
        });
      }
    }

    function percorrerSaidas(valor, origem, cenaId, ignorarEtapas = false) {
      if (!valor || typeof valor !== "object") return;

      for (const [chave, filho] of Object.entries(valor)) {
        if (ignorarEtapas && chave === "etapas") continue;

        const destino = typeof filho === "string" ? filho.trim() : "";
        let alvo = null;
        if (chave === "proximaCena" && destino) alvo = chaveCena(destino);
        if ((chave === "proximaEtapa" || chave === "etapaInicial") && destino) {
          alvo = chaveEtapa(cenaId, destino);
        }

        if (alvo && nos.has(alvo) && alvo !== origem) {
          arestas.push({ origem, destino: alvo });
        }

        if (filho && typeof filho === "object") {
          percorrerSaidas(filho, origem, cenaId, ignorarEtapas);
        }
      }
    }

    for (const [cenaId, analiseCena] of Object.entries(analise.cenas)) {
      percorrerSaidas(analiseCena.cena, chaveCena(cenaId), cenaId, true);

      for (const etapaId of analiseCena.etapas) {
        percorrerSaidas(
          analiseCena.cena.etapas[etapaId],
          chaveEtapa(cenaId, etapaId),
          cenaId,
        );
      }
    }

    const vistas = new Set();
    return {
      nos,
      inicio: chaveCena(analise.aventura.cenaInicial),
      arestas: arestas.filter(function removerDuplicada(aresta) {
        const chave = `${aresta.origem}->${aresta.destino}`;
        if (vistas.has(chave)) return false;
        vistas.add(chave);
        return true;
      }),
    };
  }

  function calcularProfundidades(fluxo) {
    const profundidades = new Map();
    const semConexao = new Set();
    const fila = [{ id: fluxo.inicio, profundidade: 0 }];

    while (fila.length > 0) {
      const atual = fila.shift();
      if (!fluxo.nos.has(atual.id) || profundidades.has(atual.id)) continue;
      profundidades.set(atual.id, atual.profundidade);

      for (const aresta of fluxo.arestas.filter((item) => item.origem === atual.id)) {
        fila.push({ id: aresta.destino, profundidade: atual.profundidade + 1 });
      }
    }

    const maior = Math.max(0, ...profundidades.values());
    for (const noId of fluxo.nos.keys()) {
      if (!profundidades.has(noId)) {
        profundidades.set(noId, maior + 1);
        semConexao.add(noId);
      }
    }

    return { valores: profundidades, semConexao };
  }

  function organizarPorRamificacoes(fluxo, profundidades) {
    const grupos = new Map();
    const ordemDescoberta = new Map();
    let proximaOrdem = 0;

    for (const noId of fluxo.nos.keys()) {
      const profundidade = profundidades.get(noId) ?? 0;
      if (!grupos.has(profundidade)) grupos.set(profundidade, []);
      grupos.get(profundidade).push(noId);
    }

    const fila = [fluxo.inicio];
    while (fila.length > 0) {
      const cenaId = fila.shift();
      if (ordemDescoberta.has(cenaId)) continue;
      ordemDescoberta.set(cenaId, proximaOrdem++);
      fluxo.arestas
        .filter((aresta) => aresta.origem === cenaId)
        .forEach((aresta) => fila.push(aresta.destino));
    }

    for (const cenaId of fluxo.nos.keys()) {
      if (!ordemDescoberta.has(cenaId)) ordemDescoberta.set(cenaId, proximaOrdem++);
    }

    grupos.forEach((cenas) =>
      cenas.sort((a, b) => ordemDescoberta.get(a) - ordemDescoberta.get(b)),
    );

    const niveis = [...grupos.keys()].sort((a, b) => a - b);
    for (let repeticao = 0; repeticao < 4; repeticao++) {
      for (const nivel of niveis.slice(1)) {
        const anterior = grupos.get(nivel - 1) ?? [];
        const indices = new Map(anterior.map((id, indice) => [id, indice]));
        grupos.get(nivel).sort((a, b) => {
          function peso(cenaId) {
            const pais = fluxo.arestas
              .filter((aresta) => aresta.destino === cenaId && indices.has(aresta.origem))
              .map((aresta) => indices.get(aresta.origem));
            return pais.length
              ? pais.reduce((total, indice) => total + indice, 0) / pais.length
              : ordemDescoberta.get(cenaId) + 1000;
          }
          return peso(a) - peso(b);
        });
      }
    }

    return grupos;
  }

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  function abrirCena(cenaId) {
    if (!aventuraAtual?.cenas?.[cenaId]) return;
    estadoAtualJogo.combateAtual = null;
    exibirTelaAventura();
    NarradorAventura.limpar();
    modal.close();
    mudarCena(cenaId);
  }

  function adicionarLista(secao, titulo, itens, vazio) {
    secao.append(criarElemento("h4", null, titulo));
    if (itens.length === 0) {
      secao.append(criarElemento("p", "mapa-dev-vazio", vazio));
      return;
    }

    const lista = criarElemento("ul");
    itens.forEach(function adicionarItem(item) {
      const linha = criarElemento("li");
      linha.append(item instanceof Node ? item : document.createTextNode(item));
      lista.append(linha);
    });
    secao.append(lista);
  }

  function criarLinkInterno(rotulo, acao) {
    const botao = criarElemento("button", "mapa-dev-link", rotulo);
    botao.type = "button";
    botao.addEventListener("click", acao);
    return botao;
  }

  function centralizarCena(cenaId) {
    const no = areaGrafo.querySelector(`[data-cena-id="${CSS.escape(cenaId)}"]`);
    if (!no || !rolagemGrafo) return;
    no.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }

  function mostrarDetalhes(cenaId, etapaId = null) {
    const analise = analiseAtual.cenas[cenaId];
    const etapa = etapaId ? analise.cena.etapas?.[etapaId] : null;
    const blocoExibido = etapa ?? analise.cena;
    painelDetalhes.replaceChildren();

    const topo = criarElemento("div", "mapa-dev-detalhes-topo");
    const titulo = criarElemento("h3", null, etapaId ? `${cenaId} › ${etapaId}` : cenaId);
    const tipo = criarElemento(
      "span",
      `mapa-dev-tipo ${analise.combate ? "combate" : "narrativa"}`,
      analise.combate ? "Batalha" : "Cena narrativa",
    );
    topo.append(titulo, tipo);

    const resumo = criarElemento(
      "p",
      "mapa-dev-resumo",
      etapaId ? resumirTexto(blocoExibido) : analise.resumo,
    );
    const acoes = criarElemento("div", "mapa-dev-acoes");
    const abrir = criarElemento("button", null, "Abrir cena");
    abrir.type = "button";
    abrir.addEventListener("click", () => abrirCena(cenaId));
    acoes.append(abrir);

    if (etapaId) {
      acoes.append(criarLinkInterno("Voltar à cena", () => mostrarDetalhes(cenaId)));
    }

    if (analise.cena.combate?.mapa) {
      const editor = criarElemento("a", null, "Editar mapa");
      editor.href = `editor-terreno.html?batalha=${encodeURIComponent(
        `${aventuraAtual.id}:${cenaId}`,
      )}`;
      editor.target = "_blank";
      editor.rel = "noopener";
      acoes.append(editor);
    }

    const conteudo = criarElemento("div", "mapa-dev-detalhes-conteudo");
    adicionarLista(
      conteudo,
      `Etapas (${analise.etapas.length})`,
      analise.etapas.map((id) =>
        criarLinkInterno(id, () => mostrarDetalhes(cenaId, id)),
      ),
      "Esta cena não possui etapas internas.",
    );
    adicionarLista(
      conteudo,
      `Testes (${analise.testes.length})`,
      analise.testes.map(({ caminho, teste }) => {
        const regra = teste.periciaId ?? teste.atributoId ?? teste.tipo ?? "teste";
        const dificuldade = teste.dificuldade ?? "dificuldade não indicada aqui";
        return `${caminho}: ${regra} — ${dificuldade}`;
      }),
      "Nenhum teste encontrado.",
    );
    adicionarLista(
      conteudo,
      `Escolhas (${analise.escolhas.length})`,
      analise.escolhas.map(({ texto }) => String(texto).replace(/\s+/g, " ").trim()),
      "Nenhuma escolha encontrada.",
    );
    adicionarLista(
      conteudo,
      "Caminhos para outras cenas",
      analise.destinos
        .filter((item) => item.tipo === "cena")
        .map(function criarDestinoCena(item) {
          const grupo = criarElemento("span");
          grupo.append(document.createTextNode(`${item.origem} → `));
          if (analiseAtual.cenas[item.destino]) {
            grupo.append(
              criarLinkInterno(item.destino, () => {
                mostrarDetalhes(item.destino);
                centralizarCena(item.destino);
              }),
            );
          } else {
            grupo.append(document.createTextNode(item.destino || "destino vazio"));
          }
          return grupo;
        }),
      "Nenhuma saída para outra cena encontrada.",
    );
    adicionarLista(
      conteudo,
      "Caminhos entre etapas",
      analise.destinos
        .filter((item) => item.tipo === "etapa")
        .map(function criarDestinoEtapa(item) {
          const grupo = criarElemento("span");
          grupo.append(document.createTextNode(`${item.origem} → `));
          if (analise.cena.etapas?.[item.destino]) {
            grupo.append(
              criarLinkInterno(item.destino, () => mostrarDetalhes(cenaId, item.destino)),
            );
          } else {
            grupo.append(document.createTextNode(item.destino || "destino vazio"));
          }
          return grupo;
        }),
      "Nenhum salto entre etapas encontrado.",
    );
    adicionarLista(conteudo, "Erros", analise.erros, "Nenhum erro estrutural encontrado.");
    adicionarLista(conteudo, "Avisos", analise.avisos, "Nenhum aviso.");

    painelDetalhes.append(topo, resumo, acoes, conteudo);
    document.querySelectorAll(".mapa-dev-no.selecionado").forEach((no) =>
      no.classList.remove("selecionado"),
    );
    const noSelecionado = etapaId
      ? `etapa:${cenaId}:${etapaId}`
      : `cena:${cenaId}`;
    areaGrafo
      .querySelector(`[data-no-id="${CSS.escape(noSelecionado)}"]`)
      ?.classList.add("selecionado");
  }

  function desenharGrafo() {
    areaGrafo.replaceChildren();
    const fluxo = criarFluxoAventura(analiseAtual);
    const profundidadesCalculadas = calcularProfundidades(fluxo);
    const profundidades = profundidadesCalculadas.valores;
    const grupos = organizarPorRamificacoes(fluxo, profundidades);

    const larguraColuna = 250;
    const alturaLinha = 104;
    const margem = 55;
    const posicoes = new Map();
    const maximoItens = Math.max(...[...grupos.values()].map((itens) => itens.length));
    const largura = (Math.max(...grupos.keys()) + 1) * larguraColuna + margem * 2;
    const altura = maximoItens * alturaLinha + margem * 2;
    areaGrafo.style.width = `${largura}px`;
    areaGrafo.style.height = `${altura}px`;
    areaGrafo.style.zoom = escalaGrafo;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("mapa-dev-linhas");
    svg.setAttribute("width", largura);
    svg.setAttribute("height", altura);
    areaGrafo.append(svg);

    for (const [profundidade, cenas] of [...grupos.entries()].sort((a, b) => a[0] - b[0])) {
      const grupoSemConexao = cenas.every((noId) =>
        profundidadesCalculadas.semConexao.has(noId),
      );
      const tituloNivel = criarElemento(
        "div",
        "mapa-dev-nivel",
        grupoSemConexao ? "Sem conexão" : `Nível ${profundidade}`,
      );
      tituloNivel.style.left = `${margem + profundidade * larguraColuna}px`;
      areaGrafo.append(tituloNivel);
      cenas.forEach(function criarNo(noId, indice) {
        const itemFluxo = fluxo.nos.get(noId);
        const analise = itemFluxo.analise;
        const x = margem + profundidade * larguraColuna;
        const deslocamento = 0;
        const y = margem + deslocamento + indice * alturaLinha;
        posicoes.set(noId, { x, y });

        const no = criarElemento("button", "mapa-dev-no");
        no.type = "button";
        no.dataset.noId = noId;
        if (itemFluxo.tipo === "cena") no.dataset.cenaId = itemFluxo.cenaId;
        no.style.left = `${x}px`;
        no.style.top = `${y}px`;
        no.classList.toggle("tem-erros", analise.erros.length > 0);
        no.classList.toggle("tem-avisos", analise.erros.length === 0 && analise.avisos.length > 0);
        no.classList.toggle("batalha", itemFluxo.tipo === "cena" && analise.combate);
        no.classList.toggle("etapa", itemFluxo.tipo === "etapa");
        no.append(
          criarElemento("strong", null, itemFluxo.rotulo),
          criarElemento(
            "span",
            null,
            itemFluxo.tipo === "etapa"
              ? `Etapa de ${itemFluxo.cenaId} · ${grupoSemConexao ? "sem conexão" : `nível ${profundidade}`}`
              : `Cena · ${grupoSemConexao ? "sem conexão" : `nível ${profundidade}`} · ${analise.etapas.length} etapas`,
          ),
        );
        no.addEventListener("click", () =>
          mostrarDetalhes(itemFluxo.cenaId, itemFluxo.etapaId ?? null),
        );
        areaGrafo.append(no);
      });
    }

    fluxo.arestas.forEach(function desenharAresta(aresta) {
      const origem = posicoes.get(aresta.origem);
      const destino = posicoes.get(aresta.destino);
      if (!origem || !destino) return;

      const linha = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const x1 = origem.x + 210;
      const y1 = origem.y + 32;
      const x2 = destino.x;
      const y2 = destino.y + 32;
      const curva = Math.max(35, Math.abs(x2 - x1) / 2);
      linha.setAttribute("d", `M ${x1} ${y1} C ${x1 + curva} ${y1}, ${x2 - curva} ${y2}, ${x2} ${y2}`);
      svg.append(linha);
    });

    mostrarDetalhes(analiseAtual.aventura.cenaInicial);
  }

  function abrirMapa() {
    analiseAtual = analisarAventura(aventuraAtual);
    desenharGrafo();
    modal.showModal();
  }

  function criarInterface() {
    if (document.querySelector("#mapaAventuraDev")) return;

    modal = document.createElement("dialog");
    modal.id = "mapaAventuraDev";
    const cabecalho = criarElemento("header", "mapa-dev-cabecalho");
    const textos = criarElemento("div");
    textos.append(
      criarElemento("span", "mapa-dev-sobretitulo", "Ferramenta de desenvolvimento"),
      criarElemento("h2", null, "Mapa da aventura"),
    );
    const fechar = criarElemento("button", "mapa-dev-fechar", "Fechar");
    fechar.type = "button";
    fechar.addEventListener("click", () => modal.close());
    const acoesCabecalho = criarElemento("div", "mapa-dev-acoes");
    const abrirEditor = criarElemento("a", null, "Abrir editor visual");
    abrirEditor.href = `editor-aventura.html?aventura=${encodeURIComponent(aventuraAtual.id)}`;
    abrirEditor.target = "_blank";
    abrirEditor.rel = "noopener";
    acoesCabecalho.append(abrirEditor, fechar);
    cabecalho.append(textos, acoesCabecalho);

    const barraMapa = criarElemento("div", "mapa-dev-barra");
    const legenda = criarElemento("div", "mapa-dev-legenda");
    legenda.innerHTML =
      '<span class="ok">Completa</span><span class="aviso">Com avisos</span>' +
      '<span class="erro">Com erros</span><span class="combate">Batalha</span>';
    const controleEscala = criarElemento("label", "mapa-dev-escala");
    const rotuloEscala = criarElemento("span", null, "Escala: 70%");
    const escala = document.createElement("input");
    escala.type = "range";
    escala.min = "45";
    escala.max = "130";
    escala.step = "5";
    escala.value = "70";
    escala.addEventListener("input", function alterarEscala() {
      escalaGrafo = Number(escala.value) / 100;
      rotuloEscala.textContent = `Escala: ${escala.value}%`;
      if (areaGrafo) areaGrafo.style.zoom = escalaGrafo;
    });
    controleEscala.append(rotuloEscala, escala);
    barraMapa.append(legenda, controleEscala);

    const corpo = criarElemento("div", "mapa-dev-corpo");
    rolagemGrafo = criarElemento("div", "mapa-dev-rolagem");
    areaGrafo = criarElemento("div", "mapa-dev-grafo");
    painelDetalhes = criarElemento("aside", "mapa-dev-detalhes");
    rolagemGrafo.append(areaGrafo);
    corpo.append(rolagemGrafo, painelDetalhes);
    modal.append(cabecalho, barraMapa, corpo);
    document.body.append(modal);

    const painelExistente = document.querySelector("#painelTestesDev");
    if (painelExistente) {
      const botao = criarElemento("button", "mapa-dev-abrir", "Abrir mapa da aventura");
      botao.type = "button";
      botao.addEventListener("click", abrirMapa);
      painelExistente.insertBefore(botao, painelExistente.lastElementChild);
    }
  }

  window.MapaAventuraDev = Object.freeze({ abrir: abrirMapa, analisar: () => analisarAventura(aventuraAtual) });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", criarInterface, { once: true });
  } else {
    criarInterface();
  }
})();
