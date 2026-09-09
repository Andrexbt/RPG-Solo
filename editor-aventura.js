"use strict";

const seletorAventura = document.querySelector("#seletorAventura");
const grafoAventura = document.querySelector("#grafoAventura");
const rolagemGrafo = document.querySelector("#rolagemGrafo");
const layoutEditor = document.querySelector(".layout-editor-aventura");
const painelComparacao = document.querySelector("#painelComparacao");
const painelNarrativa = document.querySelector("#painelNarrativa");
const painelPropriedades = document.querySelector("#painelPropriedades");
const rotuloEscala = document.querySelector("#rotuloEscala");
const botaoReenquadrar = document.querySelector("#botaoReenquadrar");
const botaoSalvarAlteracoes = document.querySelector("#botaoSalvarAlteracoes");
const botaoDesfazerAlteracoes = document.querySelector("#botaoDesfazerAlteracoes");
const botaoEnviarAventura = document.querySelector("#botaoEnviarAventura");
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
let memoriaEditorSalvaEm = null;
let mensagemEnvioAventura = null;
const valoresOriginais = new Map();
const alteracoesPendentes = new Map();
const caminhosSalvos = new Map();
const paineisExpandidos = new Set(["teia", "narrativa"]);

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

function tituloVisual(item) {
  return item.valor?.titulo?.trim() || item.rotulo;
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

function chaveMemoriaEditor(aventuraId) {
  return `rpg-solo:editor-aventura:memoria:${aventuraId}`;
}

function caminhoPodeSerAplicado(raiz, caminho) {
  if (!Array.isArray(caminho) || !caminho.length) return false;
  if (caminho.some((parte) => ["__proto__", "prototype", "constructor"].includes(String(parte)))) {
    return false;
  }
  const pai = obterNoCaminho(raiz, caminho.slice(0, -1));
  return pai !== null && typeof pai === "object";
}

function persistirMemoriaEditor() {
  const alteracoes = listarDiferencasSalvas().map(({ caminho, atual }) => ({
    caminho,
    valor: atual,
  }));
  memoriaEditorSalvaEm = new Date().toISOString();
  const memoria = {
    versao: 1,
    aventuraId: aventuraOriginal.id,
    salvoEm: memoriaEditorSalvaEm,
    alteracoes,
  };
  localStorage.setItem(chaveMemoriaEditor(aventuraOriginal.id), JSON.stringify(memoria));
}

function restaurarMemoriaEditor() {
  memoriaEditorSalvaEm = null;
  const conteudo = localStorage.getItem(chaveMemoriaEditor(aventuraOriginal.id));
  if (!conteudo) return;

  try {
    const memoria = JSON.parse(conteudo);
    if (
      memoria?.versao !== 1 ||
      memoria.aventuraId !== aventuraOriginal.id ||
      !Array.isArray(memoria.alteracoes)
    )
      return;

    memoria.alteracoes.forEach((alteracao) => {
      const caminho = alteracao?.caminho;
      if (!caminhoPodeSerAplicado(aventuraEditavel, caminho)) return;
      definirNoCaminho(aventuraEditavel, caminho, alteracao.valor);
      const original = obterNoCaminho(aventuraOriginal, caminho);
      if (!Object.is(original, alteracao.valor)) {
        caminhosSalvos.set(caminhoComoChave(caminho), [...caminho]);
      }
    });
    memoriaEditorSalvaEm = memoria.salvoEm ?? null;
  } catch (erro) {
    console.warn("Não foi possível restaurar a memória do editor.", erro);
  }
}

function registrarAlteracaoPendente(caminho, novoValor) {
  const chave = caminhoComoChave(caminho);
  const valorSalvo = obterNoCaminho(aventuraEditavel, caminho);
  if (Object.is(valorSalvo, novoValor)) {
    alteracoesPendentes.delete(chave);
  } else {
    alteracoesPendentes.set(chave, {
      caminho: [...caminho],
      valorAnterior: valorSalvo,
      novoValor,
    });
  }
  atualizarBotoesEdicao();
  atualizarComparacao();
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
        if (typeof filho !== "string" || !filho.trim())
          erros.push(`Destino vazio em ${caminhoFilho}.`);
        else if (!cenas[filho]) erros.push(`Cena inexistente: ${filho}.`);
      }
      if (chave === "proximaEtapa") {
        if (typeof filho !== "string" || !filho.trim())
          erros.push(`Destino vazio em ${caminhoFilho}.`);
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
      caminho: ["cenas", cenaId],
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
        caminho: ["cenas", cenaId, "etapas", etapaId],
        batalha: false,
      });
    }
  }

  function classificarResultado(caminho) {
    const termos = caminho.map(String).map((parte) => parte.toLowerCase());
    if (termos.some((parte) => ["sucesso", "acerto", "vitoria", "sobreviveu"].includes(parte)))
      return "sucesso";
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
      const rotulo =
        tipo === "escolha"
          ? (valor?.id ?? `escolha-${indice + 1}`)
          : (valor?.periciaId ?? valor?.atributoId ?? valor?.tipo ?? "Teste");
      nos.set(id, {
        id,
        tipo,
        cenaId,
        rotulo: String(rotulo),
        valor,
        caminho: [...caminho],
        batalha: false,
      });
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
        const destinoNoId =
          tipoDestino === "cena" ? chaveCena(destinoId) : chaveEtapa(cenaId, destinoId);
        const referencia = {
          origemId: origemConteudo,
          cenaId,
          caminho: caminhoFilho,
          chave,
          tipoDestino,
          destinoId,
          destinoNoId,
          valida: Boolean(
            destinoId &&
              (tipoDestino === "cena" ? cenas[destinoId] : cenas[cenaId]?.etapas?.[destinoId]),
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
  grafoAventura.style.transform = `translate(${deslocamentoX}px, ${deslocamentoY}px) scale(${escalaAtual})`;
  rotuloEscala.textContent = `${Math.round(escalaAtual * 100)}%`;
}

function reenquadrarGrafo() {
  const larguraDisponivel = Math.max(200, rolagemGrafo.clientWidth - 48);
  const alturaDisponivel = Math.max(200, rolagemGrafo.clientHeight - 48);
  const larguraGrafo = parseFloat(grafoAventura.style.width) || larguraDisponivel;
  const alturaGrafo = parseFloat(grafoAventura.style.height) || alturaDisponivel;
  escalaAtual = Math.max(
    0.12,
    Math.min(0.7, larguraDisponivel / larguraGrafo, alturaDisponivel / alturaGrafo),
  );
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

  const pares = fluxo.arestas.map((aresta) => [
    posicoes.get(aresta.origem),
    posicoes.get(aresta.destino),
  ]);
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
    no.title = item.valor?.titulo ? `${item.valor.titulo} (${item.rotulo})` : item.rotulo;
    no.dataset.noId = noId;
    no.style.left = `${ponto.x - ponto.largura / 2}px`;
    no.style.top = `${ponto.y - ponto.altura / 2}px`;
    no.classList.add(invalido ? "status-erro" : `status-${analise?.status ?? "completo"}`);
    no.classList.toggle("batalha", item.batalha);
    no.classList.toggle("selecionado", noId === noSelecionadoId);
    no.append(
      criarElemento("strong", null, tituloVisual(item)),
      criarElemento(
        "span",
        null,
        `${item.tipo === "cena" && item.batalha ? "Batalha" : item.tipo} · ${item.rotulo}`,
      ),
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
    linha.setAttribute(
      "d",
      `M ${x1} ${y1} C ${x1 - (dy / Math.max(1, Math.hypot(dx, dy))) * deslocamento} ${y1 + (dx / Math.max(1, Math.hypot(dx, dy))) * deslocamento}, ${x2 - (dy / Math.max(1, Math.hypot(dx, dy))) * deslocamento} ${y2 + (dx / Math.max(1, Math.hypot(dx, dy))) * deslocamento}, ${x2} ${y2}`,
    );
    svg.append(linha);
  });

  aplicarTransformacao();

  validarFluxo();
  atualizarBotoesEdicao();
}

function rotuloReferencia(referencia) {
  const final = referencia.caminho.slice(-4).join(" › ");
  return `${referencia.chave} — ${final}`;
}

function criarSeletorDestino(referencia) {
  const caixa = criarElemento("div", `conexao${referencia.valida ? "" : " erro"}`);
  const rotulo = criarElemento("label", null, rotuloReferencia(referencia));
  const seletor = document.createElement("select");
  const destinos =
    referencia.tipoDestino === "cena"
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
  const chaveReferencia = caminhoComoChave(referencia.caminho);
  seletor.value = alteracoesPendentes.get(chaveReferencia)?.novoValor ?? referencia.destinoId;
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
  nos.set(raizId, {
    id: raizId,
    tipo: "cena",
    rotulo: cenaId,
    valor: cena,
    caminho: ["cenas", cenaId],
  });
  Object.entries(etapas).forEach(([etapaId, etapa]) => {
    const id = chaveEtapa(cenaId, etapaId);
    nos.set(id, {
      id,
      tipo: "etapa",
      rotulo: etapaId,
      valor: etapa,
      etapaId,
      caminho: ["cenas", cenaId, "etapas", etapaId],
    });
  });

  const adicionarAresta = (origem, destino, resultado = null) => {
    if (!origem || !destino || !nos.has(origem) || !nos.has(destino)) return;
    const chave = `${origem}->${destino}:${resultado ?? "neutro"}`;
    if (!arestas.some((item) => item.chave === chave))
      arestas.push({ chave, origem, destino, resultado });
  };

  function resultadoDoCaminho(caminho) {
    const termos = caminho.map(String).map((parte) => parte.toLowerCase());
    if (termos.some((parte) => ["sucesso", "acerto", "vitoria", "sobreviveu"].includes(parte)))
      return "sucesso";
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
          caminho: caminhoTeste,
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
            caminho: caminhoEscolha,
          });
          adicionarAresta(origemConteudo, escolhaId, resultadoDoCaminho(caminhoEscolha));
          percorrer(escolha, escolhaId, caminhoEscolha, false);
        });
        continue;
      }
      if (["proximaEtapa", "etapaInicial"].includes(chave) && typeof filho === "string") {
        adicionarAresta(
          origemConteudo,
          chaveEtapa(cenaId, filho),
          resultadoDoCaminho(caminhoFilho),
        );
      }
      if (filho && typeof filho === "object")
        percorrer(filho, origemConteudo, caminhoFilho, ignorarEtapas);
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
    arestas
      .filter((item) => item.origem === atual)
      .forEach((item) => {
        if (!niveis.has(item.destino)) {
          niveis.set(item.destino, niveis.get(atual) + 1);
          fila.push(item.destino);
        }
      });
  }
  const maior = Math.max(0, ...niveis.values());
  nos.forEach((item, id) => {
    if (!niveis.has(id)) niveis.set(id, maior + 1);
  });
  const colunas = new Map();
  for (const [id, nivel] of niveis) {
    if (!colunas.has(nivel)) colunas.set(nivel, []);
    colunas.get(nivel).push(id);
  }

  const largura = (Math.max(...colunas.keys()) + 1) * 132 + 24;
  const altura = Math.max(
    190,
    Math.max(...[...colunas.values()].map((itens) => itens.length)) * 72 + 28,
  );
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
      const no = criarElemento(
        "button",
        `mini-etapa ${item.tipo}${item.tipo === "cena" ? " raiz" : ""}`,
      );
      no.type = "button";
      no.textContent = tituloVisual(item);
      no.title = item.valor?.titulo ? `${item.valor.titulo} (${item.rotulo})` : item.rotulo;
      no.style.left = `${x}px`;
      no.style.top = `${y}px`;
      const analise = analisesCena.get(cenaId);
      no.classList.add(
        analise?.status === "erro"
          ? "status-erro"
          : textoAusente
            ? "status-aviso"
            : "status-completo",
      );
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
    linha.setAttribute(
      "d",
      `M ${origem.x + origem.largura} ${origem.y + origem.altura / 2} C ${origem.x + origem.largura + 16} ${origem.y + origem.altura / 2}, ${destino.x - 16} ${destino.y + destino.altura / 2}, ${destino.x} ${destino.y + destino.altura / 2}`,
    );
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
  paineisExpandidos.add("narrativa");
  atualizarLayoutPaineis();
  document
    .querySelectorAll(".no-fluxo.selecionado")
    .forEach((no) => no.classList.remove("selecionado"));
  grafoAventura
    .querySelector(`[data-no-id="${CSS.escape(chaveCena(cenaId))}"]`)
    ?.classList.add("selecionado");
  painelPropriedades.replaceChildren(criarLegendaStatus());
  painelPropriedades.append(
    criarElemento("span", "tipo-no", `${item.tipo} interno de ${cenaId} · ID: ${item.rotulo}`),
    criarElemento("h2", null, tituloVisual(item)),
    criarElemento("p", null, textoResumo(item.valor)),
  );
  const editorPropriedades = criarEditorPropriedades(item);
  if (editorPropriedades) painelPropriedades.append(editorPropriedades);
  const editorTextos = criarEditorTextos(item);
  if (editorTextos) painelPropriedades.append(editorTextos);
  painelPropriedades.append(criarElemento("h3", null, "Conexões deste bloco"));
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
    painelPropriedades.append(
      criarElemento("p", "aviso-vazio", "Este bloco não possui conexões editáveis."),
    );
  }
  painelPropriedades.append(
    criarElemento("h3", null, "Mini-teia das etapas"),
    criarMiniTeiaCena(cenaId),
  );
}

function criarEditorTextos(item) {
  if (!item.caminho) return null;
  const chavesTexto = new Set(["contexto", "texto", "descricao", "instrucao"]);
  const descritores = [];

  function registrarValor(rotulo, caminho, valor) {
    if (typeof valor === "string") {
      descritores.push({ rotulo, caminho, valor });
      return;
    }
    if (Array.isArray(valor)) {
      valor.forEach((parte, indice) => {
        if (typeof parte === "string") {
          descritores.push({
            rotulo: `${rotulo} · parágrafo ${indice + 1}`,
            caminho: [...caminho, indice],
            valor: parte,
          });
        }
      });
    }
  }

  for (const chave of chavesTexto) {
    registrarValor(chave, [...item.caminho, chave], item.valor?.[chave]);
  }

  if (item.tipo === "teste") {
    const caminhoBloco = item.caminho.slice(0, -1);
    const bloco = obterNoCaminho(aventuraEditavel, caminhoBloco);
    function percorrerResultados(valor, caminho, rotulo) {
      if (!valor || typeof valor !== "object") return;
      for (const [chave, filho] of Object.entries(valor)) {
        if (["escolhas", "teste", "etapas"].includes(chave)) continue;
        const caminhoFilho = [...caminho, chave];
        const rotuloFilho = [...rotulo, chave];
        if (chavesTexto.has(chave)) registrarValor(rotuloFilho.join(" › "), caminhoFilho, filho);
        else if (filho && typeof filho === "object")
          percorrerResultados(filho, caminhoFilho, rotuloFilho);
      }
    }
    for (const chaveResultados of ["resultados", "resultadosPorAcertos"]) {
      if (bloco?.[chaveResultados]) {
        percorrerResultados(
          bloco[chaveResultados],
          [...caminhoBloco, chaveResultados],
          [chaveResultados],
        );
      }
    }
  }

  if (!descritores.length) return null;
  const secao = criarElemento("section", "editor-textos");
  secao.append(
    criarElemento("h3", null, item.tipo === "teste" ? "Textos e resultados" : "Texto do elemento"),
  );

  function adicionarCampo(rotuloTexto, caminhoCampo, valor) {
    const rotulo = document.createElement("label");
    rotulo.append(criarElemento("span", null, rotuloTexto));
    const campo = document.createElement("textarea");
    const chaveCampo = caminhoComoChave(caminhoCampo);
    campo.value = alteracoesPendentes.get(chaveCampo)?.novoValor ?? valor;
    campo.rows = Math.min(9, Math.max(3, campo.value.split("\n").length + 1));
    campo.addEventListener("input", () => {
      registrarAlteracaoPendente(caminhoCampo, campo.value);
    });
    rotulo.append(campo);
    secao.append(rotulo);
  }

  descritores.forEach(({ rotulo, caminho, valor }) => adicionarCampo(rotulo, caminho, valor));
  return secao;
}

function criarEditorPropriedades(item) {
  if (!item.caminho || !item.valor || typeof item.valor !== "object") return null;
  const ignoradas = new Set([
    "contexto",
    "texto",
    "descricao",
    "instrucao",
    "id",
    "__editorId",
    "proximaCena",
    "proximaEtapa",
    "etapaInicial",
  ]);
  const propriedades = Object.entries(item.valor).filter(
    ([chave, valor]) =>
      !ignoradas.has(chave) && ["string", "number", "boolean"].includes(typeof valor),
  );
  if (!Object.prototype.hasOwnProperty.call(item.valor, "titulo")) {
    propriedades.unshift(["titulo", ""]);
  }
  if (!propriedades.length) return null;

  const secao = criarElemento("section", "editor-propriedades");
  secao.append(criarElemento("h3", null, "Propriedades"));
  const caminhoId = [...item.caminho, "__editorId"];
  const chaveId = caminhoComoChave(caminhoId);
  const idOriginal = ["cena", "etapa"].includes(item.tipo)
    ? item.caminho.at(-1)
    : (item.valor.id ?? "");
  const rotuloId = document.createElement("label");
  rotuloId.append(criarElemento("span", null, "ID"));
  const campoId = document.createElement("input");
  campoId.type = "text";
  campoId.value =
    alteracoesPendentes.get(chaveId)?.novoValor ?? item.valor.__editorId ?? idOriginal;
  const avisoId = criarElemento(
    "small",
    null,
    "A renomeação e suas referências serão aplicadas ao enviar para a aventura.",
  );
  campoId.addEventListener("input", () => {
    const novo = campoId.value.trim();
    const erro = validarNovoId(item, novo);
    campoId.setCustomValidity(erro);
    avisoId.textContent = erro || "ID válido. Salve e envie para aplicar a renomeação.";
    if (novo === idOriginal && !item.valor.__editorId) alteracoesPendentes.delete(chaveId);
    else registrarAlteracaoPendente(caminhoId, novo);
    atualizarBotoesEdicao();
    atualizarComparacao();
  });
  rotuloId.append(campoId, avisoId);
  secao.append(rotuloId);
  propriedades.forEach(([chave, valor]) => {
    const caminho = [...item.caminho, chave];
    const chaveCaminho = caminhoComoChave(caminho);
    const valorAtual = alteracoesPendentes.get(chaveCaminho)?.novoValor ?? valor;
    const rotulo = document.createElement("label");
    rotulo.append(criarElemento("span", null, chave));
    const campo = document.createElement("input");

    if (typeof valor === "boolean") {
      campo.type = "checkbox";
      campo.checked = Boolean(valorAtual);
      rotulo.classList.add("campo-booleano");
      campo.addEventListener("change", () => registrarAlteracaoPendente(caminho, campo.checked));
    } else if (typeof valor === "number") {
      campo.type = "number";
      campo.value = String(valorAtual);
      campo.addEventListener("input", () => {
        if (campo.value !== "") registrarAlteracaoPendente(caminho, Number(campo.value));
      });
    } else {
      campo.type = "text";
      campo.value = String(valorAtual);
      campo.placeholder = chave === "titulo" ? "Título para organização" : "";
      campo.addEventListener("input", () => {
        if (
          chave === "titulo" &&
          !Object.prototype.hasOwnProperty.call(item.valor, "titulo") &&
          !campo.value.trim()
        ) {
          alteracoesPendentes.delete(chaveCaminho);
          atualizarBotoesEdicao();
          atualizarComparacao();
          return;
        }
        registrarAlteracaoPendente(caminho, campo.value);
      });
    }
    rotulo.append(campo);
    secao.append(rotulo);
  });
  return secao;
}

function validarNovoId(item, novo) {
  if (
    !/^[a-z][a-zA-Z0-9_]*$/.test(novo) ||
    ["constructor", "prototype", "__proto__"].includes(novo)
  ) {
    return "Use uma letra minúscula no início, seguida de letras sem acento, números ou sublinhado.";
  }
  const pai = obterNoCaminho(aventuraEditavel, item.caminho.slice(0, -1));
  const outros = ["cena", "etapa"].includes(item.tipo)
    ? Object.entries(pai)
        .filter(([id]) => id !== item.caminho.at(-1))
        .map(([id, valor]) => valor.__editorId ?? id)
    : Array.isArray(pai)
      ? pai.filter((v) => v !== item.valor).map((v) => v.__editorId ?? v.id)
      : [];
  return outros.includes(novo) ? "Este ID já existe neste grupo." : "";
}

function selecionarNo(noId) {
  paineisExpandidos.add("narrativa");
  atualizarLayoutPaineis();
  noSelecionadoId = noId;
  const item = fluxoAtual.nos.get(noId);
  document
    .querySelectorAll(".no-fluxo.selecionado")
    .forEach((no) => no.classList.remove("selecionado"));
  grafoAventura.querySelector(`[data-no-id="${CSS.escape(noId)}"]`)?.classList.add("selecionado");
  painelPropriedades.replaceChildren(criarLegendaStatus());

  const nomesTipos = {
    cena: item.batalha ? "Batalha" : "Cena narrativa",
    etapa: `Etapa de ${item.cenaId}`,
    escolha: `Escolha de ${item.cenaId}`,
    teste: `Teste de ${item.cenaId}`,
  };
  const tipo = criarElemento("span", "tipo-no", `${nomesTipos[item.tipo]} · ID: ${item.rotulo}`);
  const titulo = criarElemento("h2", null, tituloVisual(item));
  const resumo = criarElemento("p", null, textoResumo(item.valor));
  painelPropriedades.append(tipo, titulo, resumo);
  const editorPropriedades = criarEditorPropriedades(item);
  if (editorPropriedades) painelPropriedades.append(editorPropriedades);
  const editorTextos = criarEditorTextos(item);
  if (editorTextos) painelPropriedades.append(editorTextos);
  painelPropriedades.append(criarElemento("h3", null, "Conexões de saída"));

  const analise = analisesCena.get(item.cenaId);
  if (analise && item.tipo === "cena") {
    const estado = criarElemento(
      "p",
      `estado-cena status-${analise.status}`,
      analise.status === "erro"
        ? "Esta cena contém erros."
        : analise.status === "aviso"
          ? "Esta cena contém avisos."
          : "Esta cena está completa.",
    );
    painelPropriedades.append(estado);
  }

  const saidas = fluxoAtual.referencias.filter((referencia) => referencia.origemId === noId);
  if (!saidas.length) {
    painelPropriedades.append(
      criarElemento("p", "aviso-vazio", "Este bloco não possui conexões editáveis."),
    );
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
      analise.avisos.forEach((aviso) =>
        lista.append(criarElemento("li", "aviso-validacao", aviso)),
      );
      painelPropriedades.append(lista);
    }
  }
}

function alterarDestino(caminho, novoValor) {
  registrarAlteracaoPendente(caminho, novoValor);
}

function atualizarBotoesEdicao() {
  const temPendentes = alteracoesPendentes.size > 0;
  botaoSalvarAlteracoes.disabled = !temPendentes;
  botaoDesfazerAlteracoes.disabled = !temPendentes;
  botaoEnviarAventura.disabled = temPendentes;
}

function nomeArquivoAventura() {
  const nomes = {
    aFuga: "a-fuga.js",
  };
  return nomes[aventuraOriginal.id] ?? `${aventuraOriginal.id}.js`;
}

async function enviarAlteracoesParaAventura() {
  if (alteracoesPendentes.size) return;
  if (!("showOpenFilePicker" in window)) {
    mensagemEnvioAventura = "Este navegador não permite gravar o arquivo diretamente.";
    atualizarComparacao();
    return;
  }

  const nomeEsperado = nomeArquivoAventura();
  try {
    const [arquivoHandle] = await window.showOpenFilePicker({
      id: `rpg-solo-editor-${aventuraOriginal.id}`,
      suggestedName: nomeEsperado,
      types: [
        {
          description: "Arquivo JavaScript da aventura",
          accept: { "text/javascript": [".js"] },
        },
      ],
      multiple: false,
    });
    if (arquivoHandle.name !== nomeEsperado) {
      mensagemEnvioAventura = `Arquivo não enviado: selecione ${nomeEsperado}.`;
      atualizarComparacao();
      return;
    }

    const arquivo = await arquivoHandle.getFile();
    const conteudo = await arquivo.text();
    const assinatura = `bancoAventuras.${aventuraOriginal.id} = {`;
    if (!conteudo.includes(assinatura)) {
      mensagemEnvioAventura = `Arquivo não enviado: ${nomeEsperado} não contém a aventura esperada.`;
      atualizarComparacao();
      return;
    }

    const fonteEditor = await import("./editor-aventura-fonte.mjs?v=3");
    const alteracoesDoBloco = fonteEditor.extrairAlteracoesDoBlocoGerado(
      conteudo,
      aventuraOriginal.id,
    );
    const alteracoesAtuais = listarDiferencasSalvas().map(({ caminho, atual }) => ({
      caminho,
      valor: atual,
    }));
    const alteracoes = [...alteracoesDoBloco, ...alteracoesAtuais];
    if (!alteracoes.length) {
      mensagemEnvioAventura = "O arquivo já está sincronizado; não há alterações para enviar.";
      atualizarComparacao();
      return;
    }

    let novoConteudo = fonteEditor.aplicarAlteracoesNoObjeto(
      conteudo,
      aventuraOriginal.id,
      alteracoes,
    );
    novoConteudo = fonteEditor.removerBlocoGerado(novoConteudo);
    const gravador = await arquivoHandle.createWritable();
    await gravador.write(novoConteudo);
    await gravador.close();

    if (alteracoes.some((a) => a.caminho.at(-1) === "__editorId")) {
      localStorage.removeItem(chaveMemoriaEditor(aventuraOriginal.id));
      window.location.reload();
      return;
    }

    listarDiferencasSalvas().forEach(({ caminho, atual }) =>
      definirNoCaminho(aventuraOriginal, caminho, clonar(atual)),
    );
    caminhosSalvos.clear();
    memoriaEditorSalvaEm = null;
    localStorage.removeItem(chaveMemoriaEditor(aventuraOriginal.id));
    mensagemEnvioAventura = `Alterações aplicadas nos locais originais de aventuras/${nomeEsperado}.`;
    atualizarComparacao();
    atualizarBotoesEdicao();
  } catch (erro) {
    if (erro?.name === "AbortError") return;
    console.error("Não foi possível enviar as alterações para a aventura.", erro);
    mensagemEnvioAventura = "Não foi possível gravar o arquivo da aventura.";
    atualizarComparacao();
  }
}

function gerarCodigoAlteracoes() {
  const alteracoes = [];
  const caminhos = new Map();
  fluxoAtual.referencias.forEach((referencia) =>
    caminhos.set(caminhoComoChave(referencia.caminho), referencia.caminho),
  );
  caminhosSalvos.forEach((caminho, chave) => caminhos.set(chave, caminho));
  for (const caminho of caminhos.values()) {
    const original = obterNoCaminho(aventuraOriginal, caminho);
    const atual = obterNoCaminho(aventuraEditavel, caminho);
    if (original !== atual) alteracoes.push({ caminho, original, atual });
  }

  const idAventura = aventuraEditavel.id;
  const linhas = alteracoes.map(
    ({ caminho, original, atual }) =>
      `// Antes: ${JSON.stringify(original)}\n` +
      `bancoAventuras[${JSON.stringify(idAventura)}]${caminhoComoCodigo(caminho)} = ${JSON.stringify(atual)};`,
  );
  saidaCodigo.value = linhas.length ? linhas.join("\n\n") : "// Nenhuma alteração foi feita.";
  mensagemCopia.textContent = `${alteracoes.length} alteração(ões).`;
  modalCodigo.showModal();
}

function listarDiferencasSalvas() {
  const diferencas = [];
  for (const [chave, caminho] of caminhosSalvos) {
    const original = obterNoCaminho(aventuraOriginal, caminho);
    const atual = obterNoCaminho(aventuraEditavel, caminho);
    if (original !== atual) diferencas.push({ chave, caminho, original, atual });
  }
  return diferencas;
}

function atualizarComparacao() {
  painelComparacao.replaceChildren(criarElemento("h2", null, "Comparação"));
  if (mensagemEnvioAventura) {
    painelComparacao.append(criarElemento("p", "aviso-comparacao", mensagemEnvioAventura));
  }
  if (memoriaEditorSalvaEm) {
    const dataSalva = new Date(memoriaEditorSalvaEm);
    const rotuloData = Number.isNaN(dataSalva.getTime())
      ? "em um momento anterior"
      : dataSalva.toLocaleString("pt-BR");
    painelComparacao.append(
      criarElemento(
        "p",
        "aviso-vazio",
        `Memória deste editor salva neste navegador em ${rotuloData}.`,
      ),
    );
  }
  if (alteracoesPendentes.size) {
    painelComparacao.append(
      criarElemento(
        "p",
        "aviso-comparacao",
        `${alteracoesPendentes.size} alteração(ões) ainda não salva(s) na memória do editor.`,
      ),
    );
  }
  const diferencas = listarDiferencasSalvas();
  if (!diferencas.length) {
    painelComparacao.append(
      criarElemento("p", "aviso-vazio", "A memória do editor ainda é igual à aventura."),
    );
    return;
  }
  painelComparacao.append(
    criarElemento("p", null, `${diferencas.length} diferença(s) salva(s) na memória do editor.`),
  );
  diferencas.forEach(({ caminho, original, atual }) => {
    const bloco = criarElemento("article", "diferenca-editor");
    bloco.append(
      criarElemento(
        "strong",
        null,
        caminho
          .map((parte) => (parte === "__editorId" ? "ID (renomear ao enviar)" : parte))
          .join(" › "),
      ),
      criarElemento("span", null, `Na aventura: ${JSON.stringify(original)}`),
      criarElemento("span", null, `No editor: ${JSON.stringify(atual)}`),
    );
    painelComparacao.append(bloco);
  });
}

function salvarAlteracoesNaMemoria() {
  if (!alteracoesPendentes.size) return;
  for (const operacao of alteracoesPendentes.values()) {
    if (operacao.caminho.at(-1) !== "__editorId") continue;
    const caminho = operacao.caminho.slice(0, -1);
    const tipo =
      caminho.length === 2
        ? "cena"
        : caminho.length === 4 && caminho[2] === "etapas"
          ? "etapa"
          : caminho.at(-1) === "teste"
            ? "teste"
            : "escolha";
    const erro = validarNovoId(
      { caminho, tipo, valor: obterNoCaminho(aventuraEditavel, caminho) },
      operacao.novoValor,
    );
    if (erro) {
      window.alert(erro);
      return;
    }
  }
  const selecionado = noSelecionadoId;
  for (const [chave, operacao] of alteracoesPendentes) {
    definirNoCaminho(aventuraEditavel, operacao.caminho, operacao.novoValor);
    const original = obterNoCaminho(aventuraOriginal, operacao.caminho);
    if (original === operacao.novoValor) caminhosSalvos.delete(chave);
    else caminhosSalvos.set(chave, [...operacao.caminho]);
  }
  alteracoesPendentes.clear();
  persistirMemoriaEditor();
  desenharGrafo();
  if (fluxoAtual.nos.has(selecionado)) selecionarNo(selecionado);
  atualizarComparacao();
  atualizarBotoesEdicao();
}

function desfazerAlteracoesPendentes() {
  if (!alteracoesPendentes.size) return;
  alteracoesPendentes.clear();
  if (fluxoAtual.nos.has(noSelecionadoId)) selecionarNo(noSelecionadoId);
  atualizarComparacao();
  atualizarBotoesEdicao();
}

function atualizarLayoutPaineis() {
  const ordem = ["comparacao", "teia", "narrativa"];
  layoutEditor.style.gridTemplateColumns = ordem
    .map((painel) => (paineisExpandidos.has(painel) ? "minmax(0, 1fr)" : "48px"))
    .join(" ");
  document
    .querySelectorAll("[data-area]")
    .forEach((elemento) =>
      elemento.classList.toggle("recolhido", !paineisExpandidos.has(elemento.dataset.area)),
    );
  document
    .querySelectorAll("[data-painel]")
    .forEach((botao) =>
      botao.setAttribute("aria-pressed", String(paineisExpandidos.has(botao.dataset.painel))),
    );
}

function carregarAventura() {
  aventuraOriginal = bancoAventuras[seletorAventura.value];
  aventuraEditavel = clonar(aventuraOriginal);
  mensagemEnvioAventura = null;
  valoresOriginais.clear();
  alteracoesPendentes.clear();
  caminhosSalvos.clear();
  restaurarMemoriaEditor();
  noSelecionadoId = chaveCena(aventuraEditavel.cenaInicial);
  desenharGrafo();
  selecionarNo(noSelecionadoId);
  reenquadrarGrafo();
  atualizarComparacao();
  atualizarBotoesEdicao();
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
rolagemGrafo.addEventListener(
  "wheel",
  function alterarZoom(evento) {
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
  },
  { passive: false },
);
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
botaoSalvarAlteracoes.addEventListener("click", salvarAlteracoesNaMemoria);
botaoDesfazerAlteracoes.addEventListener("click", desfazerAlteracoesPendentes);
botaoEnviarAventura.addEventListener("click", enviarAlteracoesParaAventura);
document.querySelectorAll("[data-painel]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const painel = botao.dataset.painel;
    if (paineisExpandidos.has(painel)) {
      if (paineisExpandidos.size > 1) paineisExpandidos.delete(painel);
    } else {
      paineisExpandidos.add(painel);
    }
    atualizarLayoutPaineis();
  });
});
document.querySelector("#botaoFecharCodigo").addEventListener("click", () => modalCodigo.close());
document.querySelector("#botaoCopiarCodigo").addEventListener("click", async function copiar() {
  await navigator.clipboard.writeText(saidaCodigo.value);
  mensagemCopia.textContent = "Código copiado.";
});

atualizarLayoutPaineis();
iniciarEditor();
