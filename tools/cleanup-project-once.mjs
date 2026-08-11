import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();

function arquivo(caminho) {
  return path.join(raiz, caminho);
}

function ler(caminho) {
  return fs.readFileSync(arquivo(caminho), "utf8");
}

function escrever(caminho, conteudo) {
  fs.writeFileSync(arquivo(caminho), conteudo.replace(/\r\n/g, "\n"));
}

function substituirExato(caminho, antes, depois, rotulo) {
  const conteudo = ler(caminho);
  const ocorrencias = conteudo.split(antes).length - 1;

  if (ocorrencias !== 1) {
    throw new Error(`${rotulo}: esperado 1 trecho em ${caminho}, encontrado ${ocorrencias}.`);
  }

  escrever(caminho, conteudo.replace(antes, depois));
}

function substituirEntre(caminho, inicio, fim, substituto, rotulo) {
  const conteudo = ler(caminho);
  const indiceInicio = conteudo.indexOf(inicio);
  const indiceFim = conteudo.indexOf(fim, indiceInicio + inicio.length);

  if (indiceInicio < 0 || indiceFim < 0) {
    throw new Error(`${rotulo}: marcadores não encontrados em ${caminho}.`);
  }

  const novoConteudo =
    conteudo.slice(0, indiceInicio) +
    substituto +
    conteudo.slice(indiceFim);

  escrever(caminho, novoConteudo);
}

function removerSeExistir(caminho) {
  if (fs.existsSync(arquivo(caminho))) {
    fs.unlinkSync(arquivo(caminho));
  }
}

// -----------------------------------------------------------------------------
// 1. Estado: somente estado e helpers. Nenhum carregamento dinâmico de scripts.
// -----------------------------------------------------------------------------

escrever(
  "estado-jogo.js",
  `"use strict";

function criarEstadoInicialJogo() {
  return {
    aventuraId: null,

    personagem: {
      id: null,
      dados: null,
      condicoes: [],
    },

    progresso: {
      cenaId: null,
      caminhoId: null,
      etapaId: null,
      escolhasRemovidas: {},
      contadores: {},
      flags: {},
    },

    npcs: {},
    testePendente: null,
    combateAtual: null,

    tempo: {
      segundosTotais: 0,
    },

    efeitosTemporarios: [],
    diario: [],
  };
}

function registrarEscolhaRemovida(cenaId, escolhaId) {
  if (!cenaId || !escolhaId) {
    return;
  }

  const escolhasRemovidas = window.estadoJogo.progresso.escolhasRemovidas;
  escolhasRemovidas[cenaId] ??= [];

  if (!escolhasRemovidas[cenaId].includes(escolhaId)) {
    escolhasRemovidas[cenaId].push(escolhaId);
  }
}

function obterEscolhasDisponiveis(cenaId, escolhas = []) {
  const removidas = window.estadoJogo.progresso.escolhasRemovidas[cenaId] ?? [];

  return escolhas.filter(function (escolha) {
    return !removidas.includes(escolha.id);
  });
}

function carregarNpcsDaAventura(aventuraId) {
  const npcsDaAventura = window.bancoNpcs?.[aventuraId];

  if (!npcsDaAventura) {
    console.warn("NPCs não encontrados para a aventura:", aventuraId);
    window.estadoJogo.npcs = {};
    return;
  }

  window.estadoJogo.npcs = structuredClone(npcsDaAventura);
}

window.estadoJogo = criarEstadoInicialJogo();
window.criarEstadoInicialJogo = criarEstadoInicialJogo;
window.registrarEscolhaRemovida = registrarEscolhaRemovida;
window.obterEscolhasDisponiveis = obterEscolhasDisponiveis;
window.carregarNpcsDaAventura = carregarNpcsDaAventura;
`,
);

// -----------------------------------------------------------------------------
// 2. Narrador: somente apresentação. CSS fica no CSS; nada de MutationObserver.
// -----------------------------------------------------------------------------

escrever(
  "narrador-aventura.js",
  `"use strict";

window.NarradorAventura = (function () {
  const CHAVE_VELOCIDADE = "rpgSoloVelocidadeTexto";

  const velocidades = {
    instantaneo: 0,
    rapido: 10,
    normal: 25,
    lento: 40,
  };

  let velocidadeAtual = localStorage.getItem(CHAVE_VELOCIDADE) ?? "normal";
  let escrevendo = false;

  function obterFluxo() {
    return document.querySelector("#fluxoNarrativo");
  }

  function obterAreaRolagem() {
    return document.querySelector(".conteudo-pergaminho-cena");
  }

  function obterIntervalo() {
    return velocidades[velocidadeAtual] ?? velocidades.normal;
  }

  function definirVelocidade(valor) {
    if (!(valor in velocidades)) {
      return;
    }

    velocidadeAtual = valor;
    localStorage.setItem(CHAVE_VELOCIDADE, valor);
  }

  function obterVelocidade() {
    return velocidadeAtual;
  }

  function esperar(ms) {
    return new Promise(function (resolver) {
      window.setTimeout(resolver, ms);
    });
  }

  async function escreverNoElemento(elemento, texto) {
    escrevendo = true;
    elemento.textContent = "";

    for (let indice = 0; indice < texto.length; indice += 1) {
      const intervalo = obterIntervalo();

      if (intervalo === 0) {
        elemento.textContent += texto.slice(indice);
        break;
      }

      elemento.textContent += texto[indice];
      await esperar(intervalo);
    }

    escrevendo = false;
  }

  function obterGeneroGramatical() {
    return window.estadoJogo?.personagem?.dados?.avatar?.generoGramatical ?? null;
  }

  function normalizarTexto(texto) {
    if (typeof texto !== "string") {
      return texto;
    }

    return texto
      .replace(/\\r\\n?/g, "\\n")
      .split("\\n")
      .map(function (linha) {
        return linha.trim();
      })
      .join("\\n")
      .replace(/\\n{3,}/g, "\\n\\n")
      .trim();
  }

  function adaptarGenero(texto) {
    if (typeof texto !== "string") {
      return texto;
    }

    const genero = obterGeneroGramatical();

    return normalizarTexto(
      texto.replace(
        /\\{([^|{}]+)\\|([^{}]+)\\}/g,
        function (_correspondencia, masculino, feminino) {
          return genero === "feminino" ? feminino : masculino;
        },
      ),
    );
  }

  function separarParagrafos(texto) {
    if (typeof texto !== "string") {
      return [];
    }

    return normalizarTexto(texto)
      .split(/\\n\\s*\\n/)
      .map(function (paragrafo) {
        return paragrafo.replace(/\\s*\\n\\s*/g, " ").trim();
      })
      .filter(Boolean);
  }

  function preencherElementoComParagrafos(
    elemento,
    texto,
    classeParagrafo = "paragrafo-escolha",
  ) {
    const paragrafos = separarParagrafos(adaptarGenero(texto));
    elemento.replaceChildren();

    for (const textoParagrafo of paragrafos) {
      const paragrafo = document.createElement("span");
      paragrafo.className = classeParagrafo;
      paragrafo.textContent = textoParagrafo;
      elemento.append(paragrafo);
    }
  }

  async function adicionarNarracao(texto) {
    if (texto === undefined || texto === null || texto === "") {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const trechos = Array.isArray(texto) ? texto : [texto];
    const bloco = document.createElement("div");
    bloco.className = "bloco-narrativo";
    fluxo.append(bloco);

    for (const trecho of trechos) {
      const paragrafos = separarParagrafos(adaptarGenero(trecho));

      for (const textoParagrafo of paragrafos) {
        const paragrafo = document.createElement("p");
        bloco.append(paragrafo);
        await escreverNoElemento(paragrafo, textoParagrafo);
      }
    }
  }

  async function adicionarTeste(texto) {
    if (!texto) {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const paragrafo = document.createElement("p");
    paragrafo.className = "linha-teste-narrativo";
    fluxo.append(paragrafo);

    await escreverNoElemento(paragrafo, adaptarGenero(texto));
  }

  function adicionarDivisor() {
    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const divisor = document.createElement("hr");
    divisor.className = "divisor-narrativo";
    fluxo.append(divisor);
  }

  function rolarParaEscolha(elemento) {
    const area = obterAreaRolagem();

    if (!area || !elemento) {
      return;
    }

    const areaRect = area.getBoundingClientRect();
    const elementoRect = elemento.getBoundingClientRect();
    const destino = area.scrollTop + elementoRect.top - areaRect.top;

    area.scrollTo({
      top: destino,
      behavior: "smooth",
    });
  }

  function adicionarEscolhaRealizada(escolha) {
    if (!escolha?.texto) {
      return;
    }

    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    adicionarDivisor();

    const bloco = document.createElement("div");
    bloco.className = "escolha-realizada";
    preencherElementoComParagrafos(bloco, escolha.texto);
    fluxo.append(bloco);

    rolarParaEscolha(bloco);
  }

  async function adicionarResultadoTeste({ sucesso, nomeTeste, acao }) {
    const fluxo = obterFluxo();

    if (!fluxo) {
      return;
    }

    const paragrafo = document.createElement("p");
    paragrafo.className = sucesso
      ? "resultado-teste sucesso"
      : "resultado-teste falha";
    fluxo.append(paragrafo);

    const texto = sucesso
      ? `Sucesso no teste de \${nomeTeste}. Você conseguiu \${acao}.`
      : `Falha no teste de \${nomeTeste}. Você não conseguiu \${acao}.`;

    await escreverNoElemento(paragrafo, adaptarGenero(texto));
    adicionarDivisor();
  }

  function limpar() {
    obterFluxo()?.replaceChildren();
  }

  function estaEscrevendo() {
    return escrevendo;
  }

  return {
    adaptarGenero,
    separarParagrafos,
    preencherElementoComParagrafos,
    adicionarNarracao,
    adicionarTeste,
    adicionarResultadoTeste,
    adicionarEscolhaRealizada,
    definirVelocidade,
    obterVelocidade,
    limpar,
    estaEscrevendo,
  };
})();
`,
);

// -----------------------------------------------------------------------------
// 3. Motor de aventura: interpreta testes e consequências; não navega por patch.
// -----------------------------------------------------------------------------

escrever(
  "motor-aventura.js",
  `"use strict";

window.MotorAventura = (function () {
  const estado = {
    testeAtivo: null,
  };

  function obterPersonagem() {
    return window.estadoJogo?.personagem?.dados ?? null;
  }

  function obterNomeAtributo(idAtributo) {
    const nomes = {
      forca: "Força",
      destreza: "Destreza",
      constituicao: "Constituição",
      inteligencia: "Inteligência",
      sabedoria: "Sabedoria",
      carisma: "Carisma",
    };

    return nomes[idAtributo] ?? idAtributo ?? "atributo";
  }

  function calcularBonusDescritor(entidade, descritor) {
    if (!entidade || !descritor) {
      return 0;
    }

    if (descritor.tipo === "pericia") {
      return SistemaTestes.calcularBonusPericia(entidade, descritor.periciaId);
    }

    if (descritor.tipo === "salvaguarda") {
      return SistemaTestes.calcularBonusSalvaguarda(entidade, descritor.atributoId);
    }

    if (descritor.tipo === "atributo") {
      return SistemaTestes.calcularModificadorAtributo(
        entidade.atributos?.[descritor.atributoId],
      );
    }

    return 0;
  }

  function obterRotuloTeste(teste) {
    if (teste.tipo === "pericia") {
      const nome = window.bancoPericias?.[teste.periciaId]?.nome;
      return nome ? `um teste de \${nome}` : "um teste de perícia";
    }

    if (teste.tipo === "salvaguarda") {
      return `uma salvaguarda de \${obterNomeAtributo(teste.atributoId)}`;
    }

    if (teste.tipo === "atributo") {
      return `um teste de \${obterNomeAtributo(teste.atributoId)}`;
    }

    return "um teste";
  }

  function obterNomeTeste(teste) {
    const descritor = teste.tipo === "oposto" ? teste.jogador : teste;

    if (descritor.tipo === "pericia") {
      return window.bancoPericias?.[descritor.periciaId]?.nome ?? descritor.periciaId;
    }

    return obterNomeAtributo(descritor.atributoId);
  }

  function formatarModificador(valor) {
    const numero = Number(valor) || 0;
    return numero < 0 ? `- \${Math.abs(numero)}` : `+ \${numero}`;
  }

  function prepararRolagem(teste) {
    const personagem = obterPersonagem();

    if (!personagem || !teste) {
      return null;
    }

    const descritor = teste.tipo === "oposto" ? teste.jogador : teste;
    const modificador = calcularBonusDescritor(personagem, descritor);
    const tipoRolagem = descritor.tipoRolagem ?? teste.tipoRolagem ?? "normal";
    const quantidadeD20 =
      tipoRolagem === "vantagem" || tipoRolagem === "desvantagem" ? 2 : 1;

    return {
      gruposDeDados: [
        {
          quantidade: quantidadeD20,
          numeroDeFaces: 20,
        },
      ],
      modificador,
      descricao: obterNomeTeste(teste),
      quantidadeDeRolagens: 1,
      critico: false,
    };
  }

  function criarInstrucaoTeste(teste, modificador, complemento = "") {
    const descritor = teste.tipo === "oposto" ? teste.jogador : teste;
    const tipoRolagem = descritor.tipoRolagem ?? teste.tipoRolagem ?? "normal";
    const quantidadeD20 =
      tipoRolagem === "vantagem" || tipoRolagem === "desvantagem" ? 2 : 1;
    const aviso =
      tipoRolagem === "vantagem"
        ? ", use o maior"
        : tipoRolagem === "desvantagem"
          ? ", use o menor"
          : "";

    return (
      `Faça \${obterRotuloTeste(descritor)} ` +
      `(\${quantidadeD20}d20 \${formatarModificador(modificador)}\${aviso}) ` +
      complemento
    ).trim();
  }

  function limparTesteAtivo() {
    estado.testeAtivo = null;
    window.estadoJogo.testePendente = null;
  }

  function cancelarTeste() {
    limparTesteAtivo();
  }

  function temTesteAtivo() {
    return Boolean(estado.testeAtivo);
  }

  async function mostrarPendenciaFonte(no) {
    limparTesteAtivo();
    ocultarEscolhas();

    await NarradorAventura.adicionarTeste(
      no?.pendenciaFonte ??
        "Este trecho da aventura ainda depende de uma informação ausente na fonte.",
    );
  }

  async function oferecerEscolhaDePericia(configuracao) {
    const teste = configuracao.teste;
    const personagem = obterPersonagem();

    if (!personagem) {
      return false;
    }

    await NarradorAventura.adicionarTeste("Escolha qual perícia usar neste teste.");

    const escolhas = (teste.periciasIds ?? []).map(function (idPericia) {
      const nome = window.bancoPericias?.[idPericia]?.nome ?? idPericia;
      const bonus = SistemaTestes.calcularBonusPericia(personagem, idPericia);

      return {
        id: `motor-pericia-\${idPericia}`,
        texto: `\${nome} (\${formatarModificador(bonus)})`,
        registrarNarrativa: false,
        __acaoMotor: async function selecionarPericia() {
          await iniciarTeste({
            ...configuracao,
            teste: {
              ...teste,
              tipo: "pericia",
              periciaId: idPericia,
              periciasIds: undefined,
            },
          });
        },
      };
    });

    exibirEscolhas(escolhas);
    return true;
  }

  async function iniciarTeste(configuracao) {
    const teste = configuracao?.teste;

    if (!teste) {
      return false;
    }

    if (teste.tipo === "periciaEscolha") {
      return oferecerEscolhaDePericia(configuracao);
    }

    if (
      teste.tipo !== "oposto" &&
      (teste.dificuldade === undefined || teste.dificuldade === null)
    ) {
      await mostrarPendenciaFonte(configuracao.origem ?? teste);
      return false;
    }

    const rolagem = prepararRolagem(teste);

    if (!rolagem) {
      console.warn("Não foi possível preparar o teste da aventura:", teste);
      return false;
    }

    let resultadoOponente = null;

    if (teste.tipo === "oposto") {
      const npc = window.estadoJogo.npcs?.[teste.oponente?.npcId];

      if (!npc) {
        console.warn("NPC do teste oposto não encontrado:", teste.oponente?.npcId);
        return false;
      }

      resultadoOponente = realizarRolagemComposta({
        gruposDeDados: [
          {
            quantidade: 1,
            numeroDeFaces: 20,
          },
        ],
        modificador: calcularBonusDescritor(npc, teste.oponente),
      });
    }

    estado.testeAtivo = {
      teste,
      resultados: configuracao.resultados ?? {},
      instrucao: configuracao.instrucao ?? teste.acao ?? "",
      resultadoOponente,
    };

    window.estadoJogo.testePendente = teste;
    ocultarEscolhas();

    const instrucao = criarInstrucaoTeste(
      teste,
      rolagem.modificador,
      configuracao.instrucao ?? teste.acao ?? "",
    );

    await NarradorAventura.adicionarTeste(instrucao);

    if (typeof window.configurarRolagemSolicitada !== "function") {
      console.warn("A caixa de dados não está disponível.");
      return false;
    }

    window.configurarRolagemSolicitada(rolagem);
    return true;
  }

  async function aplicarConsequencia(consequencia) {
    if (!consequencia) {
      console.warn("Consequência da aventura não encontrada.");
      return;
    }

    if (consequencia.texto !== undefined && consequencia.texto !== "") {
      await exibirContexto(consequencia.texto);
    }

    if (consequencia.contexto !== undefined && consequencia.contexto !== "") {
      await exibirContexto(consequencia.contexto);
    }

    if (consequencia.pendenciaFonte) {
      await mostrarPendenciaFonte(consequencia);
      return;
    }

    if (consequencia.teste) {
      await iniciarTeste({
        teste: consequencia.teste,
        resultados: consequencia.resultados,
        instrucao: consequencia.instrucao,
        origem: consequencia,
      });
      return;
    }

    if (Array.isArray(consequencia.escolhas)) {
      exibirEscolhas(consequencia.escolhas);
      return;
    }

    if (consequencia.voltarParaEscolhas) {
      const cenaId = window.estadoJogo.progresso.cenaId;
      const caminhoId = window.estadoJogo.progresso.caminhoId;

      if (consequencia.removerEscolha && caminhoId) {
        registrarEscolhaRemovida(cenaId, caminhoId);
      }

      window.estadoJogo.progresso.caminhoId = null;
      window.estadoJogo.progresso.etapaId = null;

      exibirEscolhas(obterEscolhasDisponiveis(cenaId, cenaAtual.escolhas ?? []));
      return;
    }

    if (consequencia.proximaEtapa) {
      await iniciarEtapa(consequencia.proximaEtapa);
      return;
    }

    if (consequencia.proximaCena) {
      mudarCena(consequencia.proximaCena);
      return;
    }

    console.warn("Consequência sem destino executável:", consequencia);
  }

  async function resolverResultadoTeste(resultadoRolagem) {
    const ativo = estado.testeAtivo;

    if (!ativo) {
      return;
    }

    const teste = ativo.teste;
    const resultadoTeste =
      teste.tipo === "oposto"
        ? SistemaTestes.resolverTesteOposto(resultadoRolagem, ativo.resultadoOponente)
        : SistemaTestes.resolverTesteContraCd(
            resultadoRolagem,
            teste.dificuldade,
            teste.tipoRolagem ?? "normal",
          );

    const consequencia = ativo.resultados[
      resultadoTeste.sucesso ? "sucesso" : "fracasso"
    ];

    const acao =
      ativo.instrucao
        ?.replace(/^para\\s+/i, "")
        .replace(/\\.$/, "") || "realizar a ação";

    await NarradorAventura.adicionarResultadoTeste({
      sucesso: resultadoTeste.sucesso,
      nomeTeste: obterNomeTeste(teste),
      acao,
    });

    limparTesteAtivo();
    await aplicarConsequencia(consequencia);
  }

  document.addEventListener(
    "rolagemConcluida",
    function (evento) {
      if (!estado.testeAtivo) {
        return;
      }

      evento.stopImmediatePropagation();
      void resolverResultadoTeste(evento.detail);
    },
    true,
  );

  return {
    iniciarTeste,
    aplicarConsequencia,
    mostrarPendenciaFonte,
    cancelarTeste,
    temTesteAtivo,
    estado,
  };
})();
`,
);

// -----------------------------------------------------------------------------
// 4. Controlador da aventura: uma única navegação, sem motor concorrente.
// -----------------------------------------------------------------------------

substituirExato(
  "aventuras.js",
  'let testePendente = null;\nlet caminhoAtual = null;\nlet etapaAtual = null;\n',
  "",
  "remove estado narrativo legado",
);

substituirExato(
  "aventuras.js",
  'const contextoCena = document.querySelector("#contextoCena");\n',
  "",
  "remove contextoCena legado",
);

substituirEntre(
  "aventuras.js",
  "function prepararRolagemTesteAventura(teste) {",
  "async function animarMovimentoInimigo(participante, caminho) {",
  "async function animarMovimentoInimigo(participante, caminho) {",
  "remove helpers duplicados de teste",
);

const blocoNarrativo = `function exibirEscolhas(escolhas = []) {
  escolhasAtuais = escolhas;

  const possuiEscolhas = escolhas.length > 0;
  areaEscolhas.hidden = !possuiEscolhas;
  listaEscolhas.hidden = !possuiEscolhas;
  listaEscolhas.replaceChildren();

  for (const escolha of escolhas) {
    const botaoEscolha = document.createElement("button");
    botaoEscolha.type = "button";
    botaoEscolha.classList.add("botao-escolha");
    botaoEscolha.dataset.idEscolha = escolha.id;

    NarradorAventura.preencherElementoComParagrafos(
      botaoEscolha,
      escolha.texto ?? "",
    );

    listaEscolhas.append(botaoEscolha);
  }
}

function ocultarEscolhas() {
  areaEscolhas.hidden = true;
}

async function exibirContexto(contexto) {
  if (contexto === undefined || contexto === null || contexto === "") {
    return;
  }

  await NarradorAventura.adicionarNarracao(contexto);
}

async function exibirCena(aventura, cena) {
  tituloAventura.textContent = aventura.titulo;
  ocultarEscolhas();

  await exibirContexto(cena.contexto);

  solicitacaoTeste.textContent = "";
  solicitacaoTeste.hidden = true;

  verificarCombateDaCena(cena);

  if (cena.combate) {
    return;
  }

  exibirEscolhas(
    obterEscolhasDisponiveis(
      estadoAtualJogo.progresso.cenaId,
      cena.escolhas ?? [],
    ),
  );
}

async function iniciarEtapa(idEtapa) {
  const etapa = cenaAtual?.etapas?.[idEtapa];

  if (!etapa) {
    console.warn("Etapa não encontrada na cena atual:", idEtapa);
    return;
  }

  estadoAtualJogo.progresso.etapaId = idEtapa;
  ocultarEscolhas();

  if (etapa.descricao !== undefined) {
    await exibirContexto(etapa.descricao);
  }

  if (
    etapa.pendenciaFonte &&
    (!etapa.teste || etapa.teste.dificuldade == null)
  ) {
    await MotorAventura.mostrarPendenciaFonte(etapa);
    return;
  }

  if (etapa.teste) {
    await MotorAventura.iniciarTeste({
      teste: etapa.teste,
      resultados: etapa.resultados,
      instrucao: etapa.instrucao,
      origem: etapa,
    });
    return;
  }

  if (Array.isArray(etapa.escolhas) && etapa.escolhas.length > 0) {
    exibirEscolhas(etapa.escolhas);
    return;
  }

  if (etapa.proximaEtapa) {
    await iniciarEtapa(etapa.proximaEtapa);
    return;
  }

  if (etapa.proximaCena) {
    mudarCena(etapa.proximaCena);
    return;
  }

  console.warn("Etapa concluída sem destino:", idEtapa, etapa);
}

`;

substituirEntre(
  "aventuras.js",
  "function exibirEscolhas(escolhas) {",
  "function resolverIniciativaJogador(resultadoRolagem) {",
  blocoNarrativo + "function resolverIniciativaJogador(resultadoRolagem) {",
  "consolida fluxo narrativo",
);

substituirExato(
  "aventuras.js",
  `  if (!testePendente) {
    return;
  }

  console.log("Resultado recebido pela aventura:", resultadoRolagem);

  resolverTeste(resultadoRolagem);
`,
  "",
  "remove resolução duplicada de teste",
);

const novaSelecao = `async function selecionarEscolha(evento) {
  if (MotorAventura.temTesteAtivo()) {
    return;
  }

  const botaoEscolha = evento.target.closest(".botao-escolha");

  if (!botaoEscolha) {
    return;
  }

  const escolhaSelecionada = escolhasAtuais.find(function (escolha) {
    return escolha.id === botaoEscolha.dataset.idEscolha;
  });

  if (!escolhaSelecionada) {
    console.warn("Escolha não encontrada:", botaoEscolha.dataset.idEscolha);
    return;
  }

  await confirmarEscolhaVisualmente(botaoEscolha);

  if (typeof escolhaSelecionada.__acaoMotor === "function") {
    await escolhaSelecionada.__acaoMotor();
    return;
  }

  if (escolhaSelecionada.registrarNarrativa !== false) {
    NarradorAventura.adicionarEscolhaRealizada(escolhaSelecionada);
    await esperar(250);
  }

  if (escolhaSelecionada.etapaInicial) {
    estadoAtualJogo.progresso.caminhoId = escolhaSelecionada.id;
    await iniciarEtapa(escolhaSelecionada.etapaInicial);
    return;
  }

  if (escolhaSelecionada.proximaEtapa) {
    await iniciarEtapa(escolhaSelecionada.proximaEtapa);
    return;
  }

  if (escolhaSelecionada.proximaCena) {
    mudarCena(escolhaSelecionada.proximaCena);
    return;
  }

  console.warn("A escolha não possui destino:", escolhaSelecionada);
}

`;

substituirEntre(
  "aventuras.js",
  "async function selecionarEscolha(evento) {",
  "function mudarCena(idProximaCena) {",
  novaSelecao + "function mudarCena(idProximaCena) {",
  "simplifica seleção narrativa",
);

let aventurasJs = ler("aventuras.js");
aventurasJs = aventurasJs
  .replace(/\n\s*caminhoAtual = null;\n/g, "\n")
  .replace(/\n\s*etapaAtual = null;\n/g, "\n")
  .replace(/\n\s*testePendente = null;\n/g, "\n");

aventurasJs = aventurasJs.replace(
  "  estadoAtualJogo.testePendente = null;\n\n  exibirCena(aventuraAtual, cenaAtual);",
  "  estadoAtualJogo.testePendente = null;\n  MotorAventura.cancelarTeste();\n\n  void exibirCena(aventuraAtual, cenaAtual);",
);

escrever("aventuras.js", aventurasJs);

for (const nome of ["testePendente", "caminhoAtual", "etapaAtual"]) {
  if (new RegExp(`\\b\${nome}\\b`).test(ler("aventuras.js"))) {
    throw new Error(`aventuras.js ainda contém referência legada a \${nome}.`);
  }
}

// -----------------------------------------------------------------------------
// 5. HTML: dependências explícitas, sem DOM legado e sem arquivos inexistentes.
// -----------------------------------------------------------------------------

const domLegado = `                <div
                  id="fluxoNarrativo"
                  class="fluxo-narrativo"
                  aria-live="polite">
                </div>

                <div class="interface-aventura-legada">
  <div id="contextoCena"></div>

  <p
    id="solicitacaoTeste"
    hidden
  ></p>

  <div class="area-escolhas">

    <div id="listaEscolhas"
    class="lista-escolhas"></div>
  </div>

  <div
    id="areaResultado"
    hidden
  >
    <p id="resultadoTeste"></p>
    <p id="consequenciaCena"></p>
  </div>
                </div>`;

const domLimpo = `                <div
                  id="fluxoNarrativo"
                  class="fluxo-narrativo"
                  aria-live="polite"
                ></div>

                <p id="solicitacaoTeste" hidden></p>

                <div class="area-escolhas">
                  <div id="listaEscolhas" class="lista-escolhas"></div>
                </div>`;

substituirExato(
  "aventuras.html",
  domLegado,
  domLimpo,
  "remove interface legada da aventura",
);

substituirExato(
  "aventuras.html",
  `    <script src="narrador-aventura.js" defer></script>
    <script src="aventuras.js" defer></script>
    <script src="motor-aventura.js" defer></script>
    <script src="motor-fluxo-cena.js" defer></script>`,
  `    <script src="narrador-aventura.js" defer></script>
    <script src="motor-aventura.js" defer></script>
    <script src="aventuras.js" defer></script>
    <script src="testes-dev.js" defer></script>`,
  "organiza scripts da aventura",
);

for (const caminho of ["criacao-personagem.html", "ver-personagem.html"]) {
  substituirExato(
    caminho,
    '    <script src="banco-efeitos.js"></script>\n',
    "",
    `remove banco-efeitos inexistente de \${caminho}`,
  );
}

// -----------------------------------------------------------------------------
// 6. CSS: remove hacks/duplicidades e centraliza espaçamento de parágrafos.
// -----------------------------------------------------------------------------

let css = ler("aventuras.css");

if (!css.includes("--espaco-paragrafos-aventura")) {
  css = css.replace(
    "  --cor-aventura-borda-suave: rgba(105, 72, 47, 0.3);\n",
    "  --cor-aventura-borda-suave: rgba(105, 72, 47, 0.3);\n  --espaco-paragrafos-aventura: 8px;\n",
  );
}

css = css.replace(
  `.botao-escolha {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--cor-aventura-borda);
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-family: Georgia, "Times New Roman", serif;
  text-align: left;
  cursor: pointer;
  white-space: pre-line;
}

.botao-escolha:hover {
  background: rgba(105, 72, 47, 0.1);
}

.botao-escolha {
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}`,
  `.botao-escolha {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--cor-aventura-borda);
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-family: Georgia, "Times New Roman", serif;
  text-align: left;
  cursor: pointer;
  white-space: normal;
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.botao-escolha:hover {
  background: rgba(105, 72, 47, 0.1);
}`,
);

css = css.replace(
  `.area-resultado {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--cor-aventura-borda-suave);
}

`,
  "",
);

const inicioNarrativa = css.indexOf(".fluxo-narrativo {");
const fimNarrativa = css.indexOf(".controles-rolagem-pergaminho {", inicioNarrativa);

if (inicioNarrativa < 0 || fimNarrativa < 0) {
  throw new Error("Não foi possível localizar o bloco narrativo em aventuras.css.");
}

const cssNarrativo = `.fluxo-narrativo {
  padding-bottom: 30px;
  color: var(--cor-aventura-tinta);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1rem;
  line-height: 1.6;
}

.bloco-narrativo {
  margin: 0;
}

.bloco-narrativo p {
  margin: 0 0 var(--espaco-paragrafos-aventura);
}

.bloco-narrativo p:last-child {
  margin-bottom: 0;
}

.botao-escolha .paragrafo-escolha,
.escolha-realizada .paragrafo-escolha {
  display: block;
  margin: 0 0 var(--espaco-paragrafos-aventura);
}

.botao-escolha .paragrafo-escolha:last-child,
.escolha-realizada .paragrafo-escolha:last-child {
  margin-bottom: 0;
}

.escolha-realizada {
  margin: 0;
  font-weight: inherit;
}

.escolha-realizada::before {
  content: none;
}

.linha-teste-narrativo {
  margin: 18px 0;
  font-style: italic;
}

`;

css = css.slice(0, inicioNarrativa) + cssNarrativo + css.slice(fimNarrativa);
css = css.replace(
  `.bloco-narrativo p {
  white-space: pre-line;
}

`,
  "",
);

escrever("aventuras.css", css);

// -----------------------------------------------------------------------------
// 7. Remove módulos de patch que ficaram obsoletos pela arquitetura consolidada.
// -----------------------------------------------------------------------------

removerSeExistir("motor-fluxo-cena.js");
removerSeExistir("confirmacao-combate.js");

// -----------------------------------------------------------------------------
// 8. Documenta a arquitetura atual e audita referências locais de HTML.
// -----------------------------------------------------------------------------

let readme = ler("README.md");

if (!readme.includes("## Arquitetura do código")) {
  readme += `

## Arquitetura do código

O projeto segue a regra: **dados descrevem; motores interpretam; interfaces exibem**.

- arquivos \`banco-*.js\` contêm dados declarativos e não controlam interface;
- \`estado-jogo.js\` mantém apenas o estado compartilhado e seus helpers;
- \`motor-aventura.js\`, \`motor-efeitos.js\`, \`motor-tempo.js\`, \`testes.js\` e \`combate.js\` interpretam regras;
- \`aventuras.js\` controla a página da aventura e a navegação entre cenas/etapas;
- \`narrador-aventura.js\` cuida apenas da apresentação da narrativa no pergaminho;
- \`interface-combate.js\` e os demais arquivos de interface renderizam dados e recebem interação.

### Fluxo narrativo

Cada cena pode declarar \`etapas\` independentes. Escolhas não contêm outras escolhas: elas apontam para \`etapaInicial\`, \`proximaEtapa\` ou \`proximaCena\`. A ordem física das etapas no banco não define o fluxo; os IDs definem as conexões.
`;
}

escrever("README.md", readme);

function listarArquivos(diretorio) {
  return fs.readdirSync(diretorio, { withFileTypes: true }).flatMap(function (entrada) {
    const completo = path.join(diretorio, entrada.name);

    if (entrada.isDirectory()) {
      if (entrada.name === ".git" || entrada.name === "node_modules") {
        return [];
      }

      return listarArquivos(completo);
    }

    return [completo];
  });
}

const htmls = listarArquivos(raiz).filter(function (caminho) {
  return caminho.endsWith(".html");
});

const referenciasQuebradas = [];

for (const caminhoHtml of htmls) {
  const conteudo = fs.readFileSync(caminhoHtml, "utf8");
  const regex = /<(?:script|link)\\b[^>]*(?:src|href)="([^"]+)"/g;
  let correspondencia;

  while ((correspondencia = regex.exec(conteudo))) {
    const referencia = correspondencia[1];

    if (
      referencia.startsWith("http://") ||
      referencia.startsWith("https://") ||
      referencia.startsWith("#") ||
      referencia.startsWith("data:")
    ) {
      continue;
    }

    const semParametros = referencia.split(/[?#]/)[0];
    const destino = path.resolve(path.dirname(caminhoHtml), semParametros);

    if (!fs.existsSync(destino)) {
      referenciasQuebradas.push(
        `${path.relative(raiz, caminhoHtml)} -> \${referencia}`,
      );
    }
  }
}

if (referenciasQuebradas.length > 0) {
  throw new Error(
    `Referências locais quebradas encontradas:\n\${referenciasQuebradas.join("\n")}`,
  );
}

console.log("Limpeza arquitetural concluída sem referências HTML locais quebradas.");
