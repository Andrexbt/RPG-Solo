"use strict";

const seletorAventura = document.querySelector("#seletorAventura");
const grafoAventura = document.querySelector("#grafoAventura");
const rolagemGrafo = document.querySelector("#rolagemGrafo");
const painelPropriedades = document.querySelector("#painelPropriedades");
const rotuloEscala = document.querySelector("#rotuloEscala");
const botaoReenquadrar = document.querySelector("#botaoReenquadrar");
const botaoDesfazer = document.querySelector("#botaoDesfazer");
const botaoRefazer = document.querySelector("#botaoRefazer");
const botaoGerarCodigo = document.querySelector("#botaoGerarCodigo");
const resumoValidacao = document.querySelector("#resumoValidacao");
const modalCodigo = document.querySelector("#modalCodigo");
const saidaCodigo = document.querySelector("#saidaCodigo");
const mensagemCopia = document.querySelector("#mensagemCopia");

let aventuraOriginal = null;
let aventuraEditavel = null;
let fluxoAtual = null;
let noSelecionadoId = null;
let analisesCena = new Map();
let escalaAtual = 0.7;
let deslocamentoX = 24;
let deslocamentoY = 24;
let arrastandoGrafo = false;
let ponteiroAnterior = null;
const historicoDesfazer = [];
const historicoRefazer = [];
const valoresOriginais = new Map();

function clonar(valor) {
  return structuredClone(valor);
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function chaveCena(cenaId) {
  return `cena:${cenaId}`;
}

function chaveEtapa(cenaId, etapaId) {
  return `etapa:${cenaId}:${etapaId}`;
}

function chaveIntermediario(tipo, caminho) {
  return `${tipo}:${caminhoComoChave(caminho)}`;
}

function caminhoComoChave(caminho) {
  return caminho.map(String).join("\u001f");
}

function caminhoComoCodigo(caminho) {
  return caminho.map((parte) => `[${JSON.stringify(parte)}]`).join("");
}

function obterNoCaminho(raiz, caminho) {
  return caminho.reduce((atual, parte) => atual?.[parte], raiz);
}

function definirNoCaminho(raiz, caminho, valor) {
  const pai = obterNoCaminho(raiz, caminho.slice(0, -1));
  pai[caminho.at(-1)] = valor;
}

function textoResumo(valor) {
  const encontrados = [];
  const chaves = new Set(["contexto", "texto", "descricao", "instrucao"]);

  function percorrer(item) {
    if (!item || typeof item !== "object" || encontrados.length >= 2) return;
    for (const [chave, filho] of Object.entries(item)) {
      if (chaves.has(chave)) {
        const textos = Array.isArray(filho) ? filho : [filho];
        for (const texto of textos) {
          if (typeof texto === "string" && texto.trim()) {
            encontrados.push(texto.replace(/\s+/g, " ").trim());
            if (encontrados.length >= 2) break;
          }
        }
      }
      if (filho && typeof filho === "object") percorrer(filho);
    }
  }

  percorrer(valor);
  return encontrados.join(" ").slice(0, 430) || "Nenhum texto preenchido neste bloco.";
}

function analisarQualidadeCena(cenaId, cena, cenas) {
  const erros = [];
  const avisos = [];
  let temTexto = false;

  function percorrer(valor, caminho = cenaId, visitados = new WeakSet()) {
    if (!valor || typeof valor !== "object" || visitados.has(valor)) return;
    visitados.add(valor);
    for (const [chave, filho] of Object.entries(valor)) {
      const caminhoFilho = `${caminho}.${chave}`;
      if (["contexto", "texto", "descricao", "instrucao"].includes(chave)) {
        const textos = Array.isArray(filho) ? filho : [filho];
        if (textos.some((item) => typeof item === "string" && item.trim())) temTexto = true;
      }
      if (chave === "proximaCena") {
        if (typeof filho !== "string" || !filho.trim()) erros.push(`Destino vazio em ${caminhoFilho}.`);
        else if (!cenas[filho]) erros.push(`Cena inexistente: ${filho}.`);
      }
      if (chave === "proximaEtapa") {
        if (typeof filho !== "string" || !filho.trim()) erros.push(`Destino vazio em ${caminhoFilho}.`);
        else if (!cena.etapas?.[filho]) erros.push(`Etapa inexistente: ${filho}.`);
      }
      if (filho && typeof filho === "object") percorrer(filho, caminhoFilho, visitados);
    }
  }

  percorrer(cena);
  if (!temTexto && !cena.combate?.mapa) avisos.push("Cena sem texto narrativo ou mapa.");
  if (cena.combate) {
    if (!cena.combate.mapa) erros.push("Batalha sem mapa.");
    if (!cena.combate.inimigos?.length) erros.push("Batalha sem inimigos.");
    if (!cena.combate.resultados || !Object.keys(cena.combate.resultados).length) {
      erros.push("Batalha sem resultados.");
    }
    if (!cena.combate.objetivos?.length) avisos.push("Batalha sem objetivos explícitos.");
  }
  return {
    erros: [...new Set(erros)],
    avisos: [...new Set(avisos)],
    status: erros.length ? "erro" : avisos.length ? "aviso" : "completo",
  };
}

function criarFluxo() {
  const nos = new Map();
  const referencias = [];
  const arestasProvisorias = [];
  const cenas = aventuraEditavel.cenas ?? {};
  analisesCena = new Map(
    Object.entries(cenas).map(([cenaId, cena]) => [
      cenaId,
      analisarQualidadeCena(cenaId, cena, cenas),
    ]),
  );

  for (const [cenaId, cena] of Object.entries(cenas)) {
    nos.set(chaveCena(cenaId), {
      id: chaveCena(cenaId),
      tipo: "cena",
      cenaId,
      rotulo: cenaId,
      valor: cena,
      batalha: Boolean(cena.combate),
    });
    for (const [etapaId, etapa] of Object.entries(cena.etapas ?? {})) {
      let possuiDecisaoExplicita = false;
      const destinos = new Set();
      const pilha = [etapa];
      const visitados = new WeakSet();
      while (pilha.length) {
        const atual = pilha.pop();
        if (!atual || typeof atual !== "object" || visitados.has(atual)) continue;
        visitados.add(atual);
        if (atual.teste || (Array.isArray(atual.escolhas) && atual.escolhas.length)) {
          possuiDecisaoExplicita = true;
        }
        Object.entries(atual).forEach(([chave, filho]) => {
          if (["proximaCena", "proximaEtapa"].includes(chave) && typeof filho === "string") {
            destinos.add(`${chave}:${filho}`);
          }
          if (filho && typeof filho === "object") pilha.push(filho);
        });
      }
      if (possuiDecisaoExplicita || destinos.size < 2) continue;
      nos.set(chaveEtapa(cenaId, etapaId), {
        id: chaveEtapa(cenaId, etapaId),
        tipo: "etapa",
        cenaId,
        etapaId,
        rotulo: etapaId,
        valor: etapa,
        batalha: false,
      });
    }
  }

  function classificarResultado(caminho) {
    const termos = caminho.map(String).map((parte) => parte.toLowerCase());
    if (termos.some((parte) => ["sucesso", "acerto", "vitoria", "sobreviveu"].includes(parte))) return "sucesso";
    if (termos.some((parte) => ["fracasso", "erro", "derrota"].includes(parte))) return "fracasso";
    return null;
  }

  function adicionarAresta(origem, destino, resultado = null) {
    if (origem && destino && origem !== destino && nos.has(origem) && nos.has(destino)) {
      arestasProvisorias.push({ origem, destino, resultado });
    }
  }

  function criarNoDecisao(tipo, valor, cenaId, caminho, indice = 0) {
    const id = chaveIntermediario(tipo, caminho);
    if (!nos.has(id)) {
      const rotulo = tipo === "escolha"
        ? valor?.id ?? `escolha-${indice + 1}`
        : valor?.periciaId ?? valor?.atributoId ?? valor?.tipo ?? "Teste";
      nos.set(id, { id, tipo, cenaId, rotulo: String(rotulo), valor, batalha: false });
    }
    return id;
  }

  const expansoesEtapa = new Set();
  function resolverEtapa(cenaId, etapaId, origemId, caminho, resultado) {
    const idVisivel = chaveEtapa(cenaId, etapaId);
    if (nos.has(idVisivel)) {
      adicionarAresta(origemId, idVisivel, resultado);
      return;
    }
    const etapa = cenas[cenaId]?.etapas?.[etapaId];
    if (!etapa) return;
    const chaveExpansao = `${origemId}->${cenaId}:${etapaId}`;
    if (expansoesEtapa.has(chaveExpansao)) return;
    expansoesEtapa.add(chaveExpansao);
    percorrer(etapa, origemId, cenaId, ["cenas", cenaId, "etapas", etapaId], false);
  }

  function percorrer(valor, origemId, cenaId, caminho, ignorarEtapas) {
    if (!valor || typeof valor !== "object") return;

    let origemConteudo = origemId;
    if (valor.teste && typeof valor.teste === "object" && !Array.isArray(valor.teste)) {
      const caminhoTeste = [...caminho, "teste"];
      const testeId = criarNoDecisao("teste", valor.teste, cenaId, caminhoTeste);
      adicionarAresta(origemId, testeId, classificarResultado(caminho));
      origemConteudo = testeId;
    }

    for (const [chave, filho] of Object.entries(valor)) {
      if (ignorarEtapas && chave === "etapas") continue;
      const caminhoFilho = [...caminho, chave];

      if (chave === "teste" && filho === valor.teste) continue;
      if (chave === "escolhas" && Array.isArray(filho)) {
        filho.forEach(function processarEscolha(escolha, indice) {
          const caminhoEscolha = [...caminhoFilho, indice];
          const escolhaId = criarNoDecisao("escolha", escolha, cenaId, caminhoEscolha, indice);
          adicionarAresta(origemConteudo, escolhaId, classificarResultado(caminhoEscolha));
          percorrer(escolha, escolhaId, cenaId, caminhoEscolha, false);
        });
        continue;
      }

      if (["proximaCena", "proximaEtapa", "etapaInicial"].includes(chave)) {
        const tipoDestino = chave === "proximaCena" ? "cena" : "etapa";
        const destinoId = typeof filho === "string" ? filho : "";
        const destinoNoId = tipoDestino === "cena"
          ? chaveCena(destinoId)
          : chaveEtapa(cenaId, destinoId);
        const referencia = {
          origemId: origemConteudo,
          cenaId,
          caminho: caminhoFilho,
          chave,
          tipoDestino,
          destinoId,
          destinoNoId,
          valida: Boolean(
            destinoId && (
              tipoDestino === "cena"
                ? cenas[destinoId]
                : cenas[cenaId]?.etapas?.[destinoId]
            )
          ),
        };
        referencias.push(referencia);
        const resultado = classificarResultado(caminhoFilho);
        if (tipoDestino === "cena") adicionarAresta(origemConteudo, destinoNoId, resultado);
        else resolverEtapa(cenaId, destinoId, origemConteudo, caminhoFilho, resultado);

        const chaveOriginal = caminhoComoChave(caminhoFilho);
        if (!valoresOriginais.has(chaveOriginal)) {
          valoresOriginais.set(chaveOriginal, filho);
        }
      }

      if (filho && typeof filho === "object") {
        percorrer(filho, origemConteudo, cenaId, caminhoFilho, ignorarEtapas);
      }
    }
  }

  for (const [cenaId, cena] of Object.entries(cenas)) {
    percorrer(cena, chaveCena(cenaId), cenaId, ["cenas", cenaId], true);
    for (const [etapaId, etapa] of Object.entries(cena.etapas ?? {})) {
      if (!nos.has(chaveEtapa(cenaId, etapaId))) continue;
      percorrer(
        etapa,
        chaveEtapa(cenaId, etapaId),
        cenaId,
        ["cenas", cenaId, "etapas", etapaId],
        false,
      );
    }
  }

  const arestas = [];
  const vistas = new Set();
  for (const aresta of arestasProvisorias) {
    const chave = `${aresta.origem}->${aresta.destino}:${aresta.resultado ?? "neutro"}`;
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    arestas.push(aresta);
  }

  return {
    nos,
    referencias,
    arestas,
    inicio: chaveCena(aventuraEditavel.cenaInicial),
  };
}

function calcularNiveis(fluxo) {
  const niveis = new Map();
  const fila = [{ id: fluxo.inicio, nivel: 0 }];

  while (fila.length) {
    const atual = fila.shift();
    if (!fluxo.nos.has(atual.id) || niveis.has(atual.id)) continue;
    niveis.set(atual.id, atual.nivel);
    fluxo.arestas
      .filter((aresta) => aresta.origem === atual.id)
      .forEach((aresta) => fila.push({ id: aresta.destino, nivel: atual.nivel + 1 }));
  }

  const maior = Math.max(0, ...niveis.values());
  const semConexao = new Set();
  for (const noId of fluxo.nos.keys()) {
    if (!niveis.has(noId)) {
      niveis.set(noId, maior + 1);
      semConexao.add(noId);
    }
  }

  return { niveis, semConexao };
}

function agruparNos(fluxo, niveis) {
  const grupos = new Map();
  for (const [noId, nivel] of niveis) {
    if (!grupos.has(nivel)) grupos.set(nivel, []);
    grupos.get(nivel).push(noId);
  }

  const ordem = new Map();
  const fila = [fluxo.inicio];
  let indiceOrdem = 0;
  while (fila.length) {
    const noId = fila.shift();
    if (ordem.has(noId)) continue;
    ordem.set(noId, indiceOrdem++);
    fluxo.arestas
      .filter((aresta) => aresta.origem === noId)
      .forEach((aresta) => fila.push(aresta.destino));
  }
  for (const noId of fluxo.nos.keys()) if (!ordem.has(noId)) ordem.set(noId, indiceOrdem++);
  grupos.forEach((itens) => itens.sort((a, b) => ordem.get(a) - ordem.get(b)));

  const chavesNiveis = [...grupos.keys()].sort((a, b) => a - b);
  for (let repeticao = 0; repeticao < 4; repeticao++) {
    for (const nivel of chavesNiveis.slice(1)) {
      const anteriores = grupos.get(nivel - 1) ?? [];
      const posicao = new Map(anteriores.map((id, indice) => [id, indice]));
      grupos.get(nivel).sort((a, b) => {
        function peso(id) {
          const pais = fluxo.arestas
            .filter((aresta) => aresta.destino === id && posicao.has(aresta.origem))
            .map((aresta) => posicao.get(aresta.origem));
          return pais.length
            ? pais.reduce((total, valor) => total + valor, 0) / pais.length
            : ordem.get(id) + 1000;
        }
        return peso(a) - peso(b);
      });
    }
  }
  return grupos;
}

function validarFluxo() {
  const erros = fluxoAtual.referencias.filter((referencia) => !referencia.valida);
  resumoValidacao.textContent = erros.length
    ? `${erros.length} conexão(ões) inválida(s)`
    : "Todas as conexões possuem destinos válidos";
  resumoValidacao.classList.toggle("tem-erros", erros.length > 0);
  return erros;
}

function aplicarTransformacao() {
  grafoAventura.style.transform =
    `translate(${deslocamentoX}px, ${deslocamentoY}px) scale(${escalaAtual})`;
  rotuloEscala.textContent = `${Math.round(escalaAtual * 100)}%`;
}

function reenquadrarGrafo() {
  const larguraDisponivel = Math.max(200, rolagemGrafo.clientWidth - 48);
  const alturaDisponivel = Math.max(200, rolagemGrafo.clientHeight - 48);
  const larguraGrafo = parseFloat(grafoAventura.style.width) || larguraDisponivel;
  const alturaGrafo = parseFloat(grafoAventura.style.height) || alturaDisponivel;
  escalaAtual = Math.max(0.12, Math.min(0.7, larguraDisponivel / larguraGrafo, alturaDisponivel / alturaGrafo));
  deslocamentoX = (rolagemGrafo.clientWidth - larguraGrafo * escalaAtual) / 2;
  deslocamentoY = (rolagemGrafo.clientHeight - alturaGrafo * escalaAtual) / 2;
  aplicarTransformacao();
}

function dimensoesNo(item) {
  if (item.tipo === "cena") return { largura: 118, altura: 118 };
  if (item.tipo === "escolha") return { largura: 92, altura: 92 };
  return { largura: 150, altura: 64 };
}

function calcularPosicoesTeia(fluxo) {
  const ids = [...fluxo.nos.keys()];
  const profundidades = calcularNiveis(fluxo).niveis;
  const posicoes = new Map();
  const grupos = new Map();
  ids.forEach((id) => {
    const nivel = profundidades.get(id) ?? 0;
    if (!grupos.has(nivel)) grupos.set(nivel, []);
    grupos.get(nivel).push(id);
  });

  for (const [nivel, itens] of grupos) {
    itens.forEach((id, indice) => {
      const angulo = nivel === 0 ? 0 : (indice / itens.length) * Math.PI * 2 + nivel * 0.67;
      const raio = nivel === 0 ? 0 : 210 + Math.sqrt(nivel) * 270;
      posicoes.set(id, {
        x: Math.cos(angulo) * raio + (indice % 3) * 18,
        y: Math.sin(angulo) * raio + (indice % 2) * 22,
        vx: 0,
        vy: 0,
      });
    });
  }

  const pares = fluxo.arestas.map((aresta) => [posicoes.get(aresta.origem), posicoes.get(aresta.destino)]);
  for (let iteracao = 0; iteracao < 260; iteracao++) {
    for (let a = 0; a < ids.length; a++) {
      const pa = posicoes.get(ids[a]);
      for (let b = a + 1; b < ids.length; b++) {
        const pb = posicoes.get(ids[b]);
        let dx = pb.x - pa.x;
        let dy = pb.y - pa.y;
        const distancia2 = Math.max(900, dx * dx + dy * dy);
        const distancia = Math.sqrt(distancia2);
        const forca = 13000 / distancia2;
        dx /= distancia;
        dy /= distancia;
        pa.vx -= dx * forca;
        pa.vy -= dy * forca;
        pb.vx += dx * forca;
        pb.vy += dy * forca;
      }
    }
    pares.forEach(([origem, destino]) => {
      const dx = destino.x - origem.x;
      const dy = destino.y - origem.y;
      const distancia = Math.max(1, Math.hypot(dx, dy));
      const forca = (distancia - 195) * 0.006;
      origem.vx += (dx / distancia) * forca;
      origem.vy += (dy / distancia) * forca;
      destino.vx -= (dx / distancia) * forca;
      destino.vy -= (dy / distancia) * forca;
    });
    ids.forEach((id) => {
      const ponto = posicoes.get(id);
      ponto.vx += -ponto.x * 0.00015;
      ponto.vy += -ponto.y * 0.00015;
      ponto.vx *= 0.82;
      ponto.vy *= 0.82;
      ponto.x += ponto.vx;
      ponto.y += ponto.vy;
    });
  }

  let minimoX = Infinity;
  let minimoY = Infinity;
  let maximoX = -Infinity;
  let maximoY = -Infinity;
  ids.forEach((id) => {
    const ponto = posicoes.get(id);
    const dimensoes = dimensoesNo(fluxo.nos.get(id));
    minimoX = Math.min(minimoX, ponto.x - dimensoes.largura / 2);
    minimoY = Math.min(minimoY, ponto.y - dimensoes.altura / 2);
    maximoX = Math.max(maximoX, ponto.x + dimensoes.largura / 2);
    maximoY = Math.max(maximoY, ponto.y + dimensoes.altura / 2);
  });
  const margem = 100;
  ids.forEach((id) => {
    const ponto = posicoes.get(id);
    const dimensoes = dimensoesNo(fluxo.nos.get(id));
    ponto.x = ponto.x - minimoX + margem;
    ponto.y = ponto.y - minimoY + margem;
    Object.assign(ponto, dimensoes);
  });
  return {
    posicoes,
    largura: Math.ceil(maximoX - minimoX + margem * 2),
    altura: Math.ceil(maximoY - minimoY + margem * 2),
  };
}

function desenharGrafo() {
  fluxoAtual = criarFluxo();
  const teia = calcularPosicoesTeia(fluxoAtual);
  const posicoes = teia.posicoes;
  grafoAventura.replaceChildren();
  grafoAventura.style.width = `${teia.largura}px`;
  grafoAventura.style.height = `${teia.altura}px`;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("linhas-grafo");
  svg.setAttribute("width", teia.largura);
  svg.setAttribute("height", teia.altura);
  grafoAventura.append(svg);

  for (const [noId, item] of fluxoAtual.nos) {
    const ponto = posicoes.get(noId);
    const analise = analisesCena.get(item.cenaId);
    const invalido = fluxoAtual.referencias.some(
      (referencia) => referencia.origemId === noId && !referencia.valida,
    );
    const no = criarElemento("button", `no-fluxo ${item.tipo}`);
    no.type = "button";
    no.title = item.rotulo;
    no.dataset.noId = noId;
    no.style.left = `${ponto.x - ponto.largura / 2}px`;
    no.style.top = `${ponto.y - ponto.altura / 2}px`;
    no.classList.add(invalido ? "status-erro" : `status-${analise?.status ?? "completo"}`);
    no.classList.toggle("batalha", item.batalha);
    no.classList.toggle("selecionado", noId === noSelecionadoId);
    no.append(
      criarElemento("strong", null, item.rotulo),
      criarElemento("span", null, item.tipo === "cena" && item.batalha ? "Batalha" : item.tipo),
    );
    no.addEventListener("click", () => selecionarNo(noId));
    grafoAventura.append(no);
  }

  fluxoAtual.arestas.forEach(function desenharAresta(aresta) {
    const origem = posicoes.get(aresta.origem);
    const destino = posicoes.get(aresta.destino);
    if (!origem || !destino) return;
    const x1 = origem.x;
    const y1 = origem.y;
    const x2 = destino.x;
    const y2 = destino.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const deslocamento = Math.min(55, Math.hypot(dx, dy) * 0.12);
    const linha = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (aresta.resultado) linha.classList.add(aresta.resultado);
    linha.setAttribute("d", `M ${x1} ${y1} C ${x1 - dy / Math.max(1, Math.hypot(dx, dy)) * deslocamento} ${y1 + dx / Math.max(1, Math.hypot(dx, dy)) * deslocamento}, ${x2 - dy / Math.max(1, Math.hypot(dx, dy)) * deslocamento} ${y2 + dx / Math.max(1, Math.hypot(dx, dy)) * deslocamento}, ${x2} ${y2}`);
    svg.append(linha);
  });

  aplicarTransformacao();

  validarFluxo();
  atualizarBotoesHistorico();
}

function rotuloReferencia(referencia) {
  const final = referencia.caminho.slice(-4).join(" › ");
  return `${referencia.chave} — ${final}`;
}

function criarSeletorDestino(referencia) {
  const caixa = criarElemento("div", `conexao${referencia.valida ? "" : " erro"}`);
  const rotulo = criarElemento("label", null, rotuloReferencia(referencia));
  const seletor = document.createElement("select");
  const destinos = referencia.tipoDestino === "cena"
    ? Object.keys(aventuraEditavel.cenas).map((cenaId) => ({
        cenaId,
        rotulo: cenaId,
        tipo: "cena",
      }))
    : Object.keys(aventuraEditavel.cenas[referencia.cenaId]?.etapas ?? {}).map((etapaId) => ({
        cenaId: referencia.cenaId,
        etapaId,
        rotulo: etapaId,
        tipo: "etapa",
      }));

  if (!referencia.valida) {
    const atual = document.createElement("option");
    atual.value = referencia.destinoId;
    atual.textContent = `${referencia.destinoId || "destino vazio"} — inválido`;
    seletor.append(atual);
  }

  destinos.forEach(function adicionarDestino(item) {
    const opcao = document.createElement("option");
    opcao.value = item.tipo === "cena" ? item.cenaId : item.etapaId;
    opcao.textContent = item.rotulo;
    seletor.append(opcao);
  });
  seletor.value = referencia.destinoId;
  seletor.addEventListener("change", () => alterarDestino(referencia.caminho, seletor.value));
  caixa.append(rotulo, seletor);
  return caixa;
}

function criarMiniTeiaCena(cenaId) {
  const cena = aventuraEditavel.cenas[cenaId];
  const etapas = cena?.etapas ?? {};
  const nos = new Map();
  const arestas = [];
  const raizId = chaveCena(cenaId);
  nos.set(raizId, { id: raizId, tipo: "cena", rotulo: cenaId, valor: cena });
  Object.entries(etapas).forEach(([etapaId, etapa]) => {
    const id = chaveEtapa(cenaId, etapaId);
    nos.set(id, { id, tipo: "etapa", rotulo: etapaId, valor: etapa, etapaId });
  });

  const adicionarAresta = (origem, destino, resultado = null) => {
    if (!origem || !destino || !nos.has(origem) || !nos.has(destino)) return;
    const chave = `${origem}->${destino}:${resultado ?? "neutro"}`;
    if (!arestas.some((item) => item.chave === chave)) arestas.push({ chave, origem, destino, resultado });
  };

  function resultadoDoCaminho(caminho) {
    const termos = caminho.map(String).map((parte) => parte.toLowerCase());
    if (termos.some((parte) => ["sucesso", "acerto", "vitoria", "sobreviveu"].includes(parte))) return "sucesso";
    if (termos.some((parte) => ["fracasso", "erro", "derrota"].includes(parte))) return "fracasso";
    return null;
  }

  function percorrer(valor, origemId, caminho, ignorarEtapas = false) {
    if (!valor || typeof valor !== "object") return;
    let origemConteudo = origemId;
    if (valor.teste && typeof valor.teste === "object" && !Array.isArray(valor.teste)) {
      const caminhoTeste = [...caminho, "teste"];
      const testeId = chaveIntermediario("teste", caminhoTeste);
      if (!nos.has(testeId)) {
        const teste = valor.teste;
        nos.set(testeId, {
          id: testeId,
          tipo: "teste",
          rotulo: String(teste.periciaId ?? teste.atributoId ?? teste.tipo ?? "Teste"),
          valor: teste,
        });
      }
      adicionarAresta(origemId, testeId, resultadoDoCaminho(caminho));
      origemConteudo = testeId;
    }

    for (const [chave, filho] of Object.entries(valor)) {
      if (ignorarEtapas && chave === "etapas") continue;
      const caminhoFilho = [...caminho, chave];
      if (chave === "teste" && filho === valor.teste) continue;
      if (chave === "escolhas" && Array.isArray(filho)) {
        filho.forEach((escolha, indice) => {
          const caminhoEscolha = [...caminhoFilho, indice];
          const escolhaId = chaveIntermediario("escolha", caminhoEscolha);
          nos.set(escolhaId, {
            id: escolhaId,
            tipo: "escolha",
            rotulo: escolha?.id ?? `escolha-${indice + 1}`,
            valor: escolha,
          });
          adicionarAresta(origemConteudo, escolhaId, resultadoDoCaminho(caminhoEscolha));
          percorrer(escolha, escolhaId, caminhoEscolha, false);
        });
        continue;
      }
      if (["proximaEtapa", "etapaInicial"].includes(chave) && typeof filho === "string") {
        adicionarAresta(origemConteudo, chaveEtapa(cenaId, filho), resultadoDoCaminho(caminhoFilho));
      }
      if (filho && typeof filho === "object") percorrer(filho, origemConteudo, caminhoFilho, ignorarEtapas);
    }
  }

  percorrer(cena, raizId, ["cenas", cenaId], true);
  Object.entries(etapas).forEach(([etapaId, etapa]) => {
    percorrer(etapa, chaveEtapa(cenaId, etapaId), ["cenas", cenaId, "etapas", etapaId], false);
  });

  const niveis = new Map([[raizId, 0]]);
  const fila = [raizId];
  while (fila.length) {
    const atual = fila.shift();
    arestas.filter((item) => item.origem === atual).forEach((item) => {
      if (!niveis.has(item.destino)) {
        niveis.set(item.destino, niveis.get(atual) + 1);
        fila.push(item.destino);
      }
    });
  }
  const maior = Math.max(0, ...niveis.values());
  nos.forEach((item, id) => { if (!niveis.has(id)) niveis.set(id, maior + 1); });
  const colunas = new Map();
  for (const [id, nivel] of niveis) {
    if (!colunas.has(nivel)) colunas.set(nivel, []);
    colunas.get(nivel).push(id);
  }

  const largura = (Math.max(...colunas.keys()) + 1) * 132 + 24;
  const altura = Math.max(190, Math.max(...[...colunas.values()].map((itens) => itens.length)) * 72 + 28);
  const caixa = criarElemento("div", "mini-teia");
  const conteudo = criarElemento("div");
  conteudo.style.position = "relative";
  conteudo.style.width = `${largura}px`;
  conteudo.style.height = `${altura}px`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", largura);
  svg.setAttribute("height", altura);
  conteudo.append(svg);
  const posicoes = new Map();
  for (const [nivel, itens] of [...colunas].sort((a, b) => a[0] - b[0])) {
    itens.forEach((id, indice) => {
      const item = nos.get(id);
      const larguraNo = item.tipo === "escolha" ? 58 : 112;
      const alturaNo = item.tipo === "escolha" ? 58 : 42;
      const x = 14 + nivel * 132 + (112 - larguraNo) / 2;
      const y = 14 + indice * 72;
      posicoes.set(id, { x, y, largura: larguraNo, altura: alturaNo });
      const textoAusente = textoResumo(item.valor) === "Nenhum texto preenchido neste bloco.";
      const no = criarElemento("button", `mini-etapa ${item.tipo}${item.tipo === "cena" ? " raiz" : ""}`);
      no.type = "button";
      no.textContent = item.rotulo;
      no.style.left = `${x}px`;
      no.style.top = `${y}px`;
      const analise = analisesCena.get(cenaId);
      no.classList.add(analise?.status === "erro" ? "status-erro" : textoAusente ? "status-aviso" : "status-completo");
      no.addEventListener("click", () => abrirNoDaMiniTeia(cenaId, item));
      conteudo.append(no);
    });
  }
  arestas.forEach((aresta) => {
    const origem = posicoes.get(aresta.origem);
    const destino = posicoes.get(aresta.destino);
    if (!origem || !destino) return;
    const linha = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (aresta.resultado) linha.classList.add(aresta.resultado);
    linha.setAttribute("d", `M ${origem.x + origem.largura} ${origem.y + origem.altura / 2} C ${origem.x + origem.largura + 16} ${origem.y + origem.altura / 2}, ${destino.x - 16} ${destino.y + destino.altura / 2}, ${destino.x} ${destino.y + destino.altura / 2}`);
    svg.append(linha);
  });
  caixa.append(conteudo);
  return caixa;
}

function criarLegendaStatus() {
  const legenda = criarElemento("div", "legenda-status");
  legenda.setAttribute("aria-label", "Legenda de validação");
  legenda.append(
    criarElemento("span", null, "Completo"),
    criarElemento("span", "aviso", "Com avisos"),
    criarElemento("span", "erro", "Com erros"),
  );
  return legenda;
}

function centralizarNoPrincipal(noId) {
  const no = grafoAventura.querySelector(`[data-no-id="${CSS.escape(noId)}"]`);
  if (!no) return;
  const centroX = parseFloat(no.style.left) + no.offsetWidth / 2;
  const centroY = parseFloat(no.style.top) + no.offsetHeight / 2;
  deslocamentoX = rolagemGrafo.clientWidth / 2 - centroX * escalaAtual;
  deslocamentoY = rolagemGrafo.clientHeight / 2 - centroY * escalaAtual;
  aplicarTransformacao();
}

function abrirNoDaMiniTeia(cenaId, item) {
  if (fluxoAtual.nos.has(item.id)) {
    selecionarNo(item.id);
    centralizarNoPrincipal(item.id);
    return;
  }
  mostrarBlocoInterno(cenaId, item);
  centralizarNoPrincipal(chaveCena(cenaId));
}

function mostrarBlocoInterno(cenaId, item) {
  document.querySelectorAll(".no-fluxo.selecionado").forEach((no) => no.classList.remove("selecionado"));
  grafoAventura.querySelector(`[data-no-id="${CSS.escape(chaveCena(cenaId))}"]`)?.classList.add("selecionado");
  painelPropriedades.replaceChildren(criarLegendaStatus());
  painelPropriedades.append(
    criarElemento("span", "tipo-no", `${item.tipo} interno de ${cenaId}`),
    criarElemento("h2", null, item.rotulo),
    criarElemento("p", null, textoResumo(item.valor)),
    criarElemento("h3", null, "Conexões deste bloco"),
  );
  const saidas = fluxoAtual.referencias.filter((referencia) => {
    if (referencia.cenaId !== cenaId) return false;
    if (item.tipo === "etapa") {
      const indiceEtapas = referencia.caminho.indexOf("etapas");
      return referencia.caminho[indiceEtapas + 1] === item.etapaId;
    }
    return referencia.origemId === item.id;
  });
  if (saidas.length) {
    const lista = criarElemento("div", "lista-conexoes");
    saidas.forEach((referencia) => lista.append(criarSeletorDestino(referencia)));
    painelPropriedades.append(lista);
  } else {
    painelPropriedades.append(criarElemento("p", "aviso-vazio", "Este bloco não possui conexões editáveis."));
  }
  painelPropriedades.append(criarElemento("h3", null, "Mini-teia das etapas"), criarMiniTeiaCena(cenaId));
}

function selecionarNo(noId) {
  noSelecionadoId = noId;
  const item = fluxoAtual.nos.get(noId);
  document.querySelectorAll(".no-fluxo.selecionado").forEach((no) => no.classList.remove("selecionado"));
  grafoAventura.querySelector(`[data-no-id="${CSS.escape(noId)}"]`)?.classList.add("selecionado");
  painelPropriedades.replaceChildren(criarLegendaStatus());

  const nomesTipos = {
    cena: item.batalha ? "Batalha" : "Cena narrativa",
    etapa: `Etapa de ${item.cenaId}`,
    escolha: `Escolha de ${item.cenaId}`,
    teste: `Teste de ${item.cenaId}`,
  };
  const tipo = criarElemento("span", "tipo-no", nomesTipos[item.tipo]);
  const titulo = criarElemento("h2", null, item.rotulo);
  const resumo = criarElemento("p", null, textoResumo(item.valor));
  painelPropriedades.append(tipo, titulo, resumo, criarElemento("h3", null, "Conexões de saída"));

  const analise = analisesCena.get(item.cenaId);
  if (analise && item.tipo === "cena") {
    const estado = criarElemento("p", `estado-cena status-${analise.status}`,
      analise.status === "erro" ? "Esta cena contém erros." : analise.status === "aviso" ? "Esta cena contém avisos." : "Esta cena está completa.");
    painelPropriedades.append(estado);
  }

  const saidas = fluxoAtual.referencias.filter((referencia) => referencia.origemId === noId);
  if (!saidas.length) {
    painelPropriedades.append(criarElemento("p", "aviso-vazio", "Este bloco não possui conexões editáveis."));
  } else {
    const lista = criarElemento("div", "lista-conexoes");
    saidas.forEach((referencia) => lista.append(criarSeletorDestino(referencia)));
    painelPropriedades.append(lista);
  }

  if (item.tipo === "cena") {
    painelPropriedades.append(criarElemento("h3", null, "Mini-teia das etapas"));
    painelPropriedades.append(criarMiniTeiaCena(item.cenaId));
    if (analise?.erros.length) {
      painelPropriedades.append(criarElemento("h3", null, "Erros"));
      const lista = document.createElement("ul");
      analise.erros.forEach((erro) => lista.append(criarElemento("li", "erro-validacao", erro)));
      painelPropriedades.append(lista);
    }
    if (analise?.avisos.length) {
      painelPropriedades.append(criarElemento("h3", null, "Avisos"));
      const lista = document.createElement("ul");
      analise.avisos.forEach((aviso) => lista.append(criarElemento("li", "aviso-validacao", aviso)));
      painelPropriedades.append(lista);
    }
  }
}

function alterarDestino(caminho, novoValor) {
  const valorAnterior = obterNoCaminho(aventuraEditavel, caminho);
  if (valorAnterior === novoValor) return;
  definirNoCaminho(aventuraEditavel, caminho, novoValor);
  historicoDesfazer.push({ caminho: [...caminho], valorAnterior, novoValor });
  historicoRefazer.length = 0;
  desenharGrafo();
  if (fluxoAtual.nos.has(noSelecionadoId)) selecionarNo(noSelecionadoId);
}

function aplicarHistorico(operacao, usarNovoValor) {
  definirNoCaminho(
    aventuraEditavel,
    operacao.caminho,
    usarNovoValor ? operacao.novoValor : operacao.valorAnterior,
  );
  desenharGrafo();
  if (fluxoAtual.nos.has(noSelecionadoId)) selecionarNo(noSelecionadoId);
}

function atualizarBotoesHistorico() {
  botaoDesfazer.disabled = historicoDesfazer.length === 0;
  botaoRefazer.disabled = historicoRefazer.length === 0;
}

function gerarCodigoAlteracoes() {
  const alteracoes = [];
  for (const referencia of fluxoAtual.referencias) {
    const chave = caminhoComoChave(referencia.caminho);
    const original = valoresOriginais.get(chave);
    const atual = obterNoCaminho(aventuraEditavel, referencia.caminho);
    if (original !== atual) alteracoes.push({ caminho: referencia.caminho, original, atual });
  }

  const idAventura = aventuraEditavel.id;
  const linhas = alteracoes.map(
    ({ caminho, original, atual }) =>
      `// Antes: ${JSON.stringify(original)}\n` +
      `bancoAventuras[${JSON.stringify(idAventura)}]${caminhoComoCodigo(caminho)} = ${JSON.stringify(atual)};`,
  );
  saidaCodigo.value = linhas.length
    ? linhas.join("\n\n")
    : "// Nenhuma conexão foi modificada.";
  mensagemCopia.textContent = `${alteracoes.length} alteração(ões).`;
  modalCodigo.showModal();
}

function carregarAventura() {
  aventuraOriginal = bancoAventuras[seletorAventura.value];
  aventuraEditavel = clonar(aventuraOriginal);
  valoresOriginais.clear();
  historicoDesfazer.length = 0;
  historicoRefazer.length = 0;
  noSelecionadoId = chaveCena(aventuraEditavel.cenaInicial);
  desenharGrafo();
  selecionarNo(noSelecionadoId);
  reenquadrarGrafo();
}

function iniciarEditor() {
  for (const [aventuraId, aventura] of Object.entries(bancoAventuras)) {
    const opcao = document.createElement("option");
    opcao.value = aventuraId;
    opcao.textContent = aventura.titulo ?? aventuraId;
    seletorAventura.append(opcao);
  }

  const solicitada = new URLSearchParams(window.location.search).get("aventura");
  if (solicitada && bancoAventuras[solicitada]) seletorAventura.value = solicitada;
  carregarAventura();
}

seletorAventura.addEventListener("change", carregarAventura);
botaoReenquadrar.addEventListener("click", reenquadrarGrafo);
rolagemGrafo.addEventListener("wheel", function alterarZoom(evento) {
  evento.preventDefault();
  const limiteInferior = 0.12;
  const limiteSuperior = 1.6;
  const novaEscala = Math.min(
    limiteSuperior,
    Math.max(limiteInferior, escalaAtual * (evento.deltaY < 0 ? 1.1 : 0.9)),
  );
  if (novaEscala === escalaAtual) return;

  const area = rolagemGrafo.getBoundingClientRect();
  const cursorX = evento.clientX - area.left;
  const cursorY = evento.clientY - area.top;
  const pontoGrafoX = (cursorX - deslocamentoX) / escalaAtual;
  const pontoGrafoY = (cursorY - deslocamentoY) / escalaAtual;
  deslocamentoX = cursorX - pontoGrafoX * novaEscala;
  deslocamentoY = cursorY - pontoGrafoY * novaEscala;
  escalaAtual = novaEscala;
  aplicarTransformacao();
}, { passive: false });
rolagemGrafo.addEventListener("pointerdown", function iniciarArraste(evento) {
  if (evento.button !== 0 || evento.target.closest("button, select, input, a")) return;
  arrastandoGrafo = true;
  ponteiroAnterior = { x: evento.clientX, y: evento.clientY };
  rolagemGrafo.classList.add("arrastando");
  rolagemGrafo.setPointerCapture(evento.pointerId);
});
rolagemGrafo.addEventListener("pointermove", function moverGrafo(evento) {
  if (!arrastandoGrafo || !ponteiroAnterior) return;
  deslocamentoX += evento.clientX - ponteiroAnterior.x;
  deslocamentoY += evento.clientY - ponteiroAnterior.y;
  ponteiroAnterior = { x: evento.clientX, y: evento.clientY };
  aplicarTransformacao();
});
function encerrarArraste(evento) {
  if (!arrastandoGrafo) return;
  arrastandoGrafo = false;
  ponteiroAnterior = null;
  rolagemGrafo.classList.remove("arrastando");
  if (rolagemGrafo.hasPointerCapture(evento.pointerId)) {
    rolagemGrafo.releasePointerCapture(evento.pointerId);
  }
}
rolagemGrafo.addEventListener("pointerup", encerrarArraste);
rolagemGrafo.addEventListener("pointercancel", encerrarArraste);
rolagemGrafo.addEventListener("dblclick", function reenquadrarComDuploClique(evento) {
  if (!evento.target.closest(".no-fluxo")) reenquadrarGrafo();
});
botaoDesfazer.addEventListener("click", function desfazer() {
  const operacao = historicoDesfazer.pop();
  if (!operacao) return;
  historicoRefazer.push(operacao);
  aplicarHistorico(operacao, false);
});
botaoRefazer.addEventListener("click", function refazer() {
  const operacao = historicoRefazer.pop();
  if (!operacao) return;
  historicoDesfazer.push(operacao);
  aplicarHistorico(operacao, true);
});
botaoGerarCodigo.addEventListener("click", gerarCodigoAlteracoes);
document.querySelector("#botaoFecharCodigo").addEventListener("click", () => modalCodigo.close());
document.querySelector("#botaoCopiarCodigo").addEventListener("click", async function copiar() {
  await navigator.clipboard.writeText(saidaCodigo.value);
  mensagemCopia.textContent = "Código copiado.";
});

iniciarEditor();
