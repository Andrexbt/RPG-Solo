import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const caminho = relativo => path.join(raiz, relativo);
const ler = relativo => fs.readFileSync(caminho(relativo), "utf8");
const escrever = (relativo, conteudo) => fs.writeFileSync(caminho(relativo), conteudo, "utf8");
const linhas = itens => itens.join("\n") + "\n";

function substituirExato(arquivo, antes, depois, rotulo) {
  const conteudo = ler(arquivo);
  const quantidade = conteudo.split(antes).length - 1;

  if (quantidade !== 1) {
    throw new Error(`${rotulo}: esperado 1 trecho em ${arquivo}, encontrado ${quantidade}.`);
  }

  escrever(arquivo, conteudo.replace(antes, depois));
}

function substituirEntre(arquivo, inicio, fim, substituto, rotulo) {
  const conteudo = ler(arquivo);
  const indiceInicio = conteudo.indexOf(inicio);
  const indiceFim = conteudo.indexOf(fim, indiceInicio + inicio.length);

  if (indiceInicio < 0 || indiceFim < 0) {
    throw new Error(`${rotulo}: marcadores não encontrados em ${arquivo}.`);
  }

  escrever(
    arquivo,
    conteudo.slice(0, indiceInicio) + substituto + conteudo.slice(indiceFim),
  );
}

function removerArquivo(relativo) {
  const arquivo = caminho(relativo);

  if (fs.existsSync(arquivo)) {
    fs.rmSync(arquivo);
  }
}

function limparEspacosFinais(relativo) {
  const conteudo = ler(relativo);
  const limpo = conteudo
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(linha => linha.replace(/[ \t]+$/g, ""))
    .join("\n");

  if (limpo !== conteudo) {
    escrever(relativo, limpo);
  }
}

// =====================================================
// AVENTURA: HTML
// =====================================================

substituirExato(
  "aventuras.html",
  linhas([
    '                <div class="interface-aventura-legada">',
    '  <div id="contextoCena"></div>',
    '',
    '  <p',
    '    id="solicitacaoTeste"',
    '    hidden',
    '  ></p>',
    '',
    '  <div class="area-escolhas">',
    '',
    '    <div id="listaEscolhas"',
    '    class="lista-escolhas"></div>',
    '  </div>',
    '',
    '  <div',
    '    id="areaResultado"',
    '    hidden',
    '  >',
    '    <p id="resultadoTeste"></p>',
    '    <p id="consequenciaCena"></p>',
    '  </div>',
    '                </div>',
  ]),
  linhas([
    '                <div class="area-escolhas">',
    '                  <div id="listaEscolhas" class="lista-escolhas"></div>',
    '                </div>',
  ]),
  "remove interface narrativa legada",
);

substituirExato(
  "aventuras.html",
  linhas([
    '                <div',
    '  class="controles-rolagem-pergaminho"',
    '  aria-label="Controles de rolagem"',
    '>',
  ]),
  linhas([
    '                <div',
    '  class="controles-rolagem-pergaminho"',
    '  role="group"',
    '  aria-label="Controles de rolagem"',
    '>',
  ]),
  "torna controles de rolagem acessíveis",
);

substituirExato(
  "aventuras.html",
  '            <aside class="adendos-aventura">\n',
  '            <aside class="adendos-aventura" aria-label="Ferramentas da aventura">\n',
  "nomeia landmark de ferramentas",
);

substituirExato(
  "aventuras.html",
  linhas([
    '            </aside>',
    '            ',
    '          </div>',
    '',
    '        <section',
  ]),
  linhas([
    '            </aside>',
    '',
    '          </div>',
    '        </div>',
    '',
    '        <section',
  ]),
  "fecha visualização da aventura",
);

substituirExato(
  "aventuras.html",
  '    <script src="motor-fluxo-cena.js" defer></script>\n',
  "",
  "remove motor de fluxo substituído",
);

substituirExato(
  "aventuras.html",
  linhas([
    '    <script src="narrador-aventura.js" defer></script>',
    '    <script src="aventuras.js" defer></script>',
    '    <script src="motor-aventura.js" defer></script>',
  ]),
  linhas([
    '    <script src="narrador-aventura.js" defer></script>',
    '    <script src="motor-aventura.js" defer></script>',
    '    <script src="aventuras.js" defer></script>',
  ]),
  "ordena motor antes do controlador",
);

for (const arquivo of ["criacao-personagem.html", "ver-personagem.html"]) {
  substituirExato(
    arquivo,
    '    <script src="banco-efeitos.js"></script>\n',
    "",
    `remove referência inexistente de ${arquivo}`,
  );
}

// =====================================================
// AVENTURA: CONTROLADOR
// =====================================================

substituirExato(
  "aventuras.js",
  linhas([
    'let cenaAtual = aventuraAtual.cenas[idCenaInicial];',
    'let testePendente = null;',
    'let caminhoAtual = null;',
    'let etapaAtual = null;',
    'let tokenArrastado = null;',
  ]),
  linhas([
    'let cenaAtual = aventuraAtual.cenas[idCenaInicial];',
    'let tokenArrastado = null;',
  ]),
  "remove estado narrativo duplicado",
);

substituirExato(
  "aventuras.js",
  'const contextoCena = document.querySelector("#contextoCena");\n',
  "",
  "remove referência a contexto legado",
);

substituirExato(
  "aventuras.js",
  'const solicitacaoTeste = document.querySelector("#solicitacaoTeste");\n',
  "",
  "remove solicitação de teste legada",
);

substituirEntre(
  "aventuras.js",
  "function prepararRolagemTesteAventura(teste) {",
  "async function animarMovimentoInimigo(participante, caminho) {",
  "",
  "remove implementação duplicada dos testes narrativos",
);

const fluxoNarrativo = linhas([
  'function exibirEscolhas(escolhas = []) {',
  '  escolhasAtuais = Array.isArray(escolhas) ? escolhas : [];',
  '',
  '  listaEscolhas.replaceChildren();',
  '',
  '  for (const escolha of escolhasAtuais) {',
  '    const botaoEscolha = document.createElement("button");',
  '    botaoEscolha.type = "button";',
  '    botaoEscolha.className = "botao-escolha";',
  '    botaoEscolha.dataset.idEscolha = escolha.id;',
  '',
  '    NarradorAventura.preencherElementoComParagrafos(',
  '      botaoEscolha,',
  '      escolha.texto ?? "",',
  '    );',
  '',
  '    listaEscolhas.append(botaoEscolha);',
  '  }',
  '',
  '  const possuiEscolhas = escolhasAtuais.length > 0;',
  '  areaEscolhas.hidden = !possuiEscolhas;',
  '  listaEscolhas.hidden = !possuiEscolhas;',
  '}',
  '',
  'function ocultarEscolhas() {',
  '  areaEscolhas.hidden = true;',
  '}',
  '',
  'async function exibirContexto(contexto) {',
  '  if (contexto === undefined || contexto === null || contexto === "") {',
  '    return;',
  '  }',
  '',
  '  await NarradorAventura.adicionarNarracao(contexto);',
  '}',
  '',
  'async function exibirCena(aventura, cena) {',
  '  tituloAventura.textContent = aventura.titulo;',
  '  ocultarEscolhas();',
  '',
  '  await exibirContexto(cena.contexto);',
  '',
  '  if (cena.combate) {',
  '    verificarCombateDaCena(cena);',
  '    return;',
  '  }',
  '',
  '  exibirEscolhas(',
  '    obterEscolhasDisponiveis(',
  '      estadoAtualJogo.progresso.cenaId,',
  '      cena.escolhas ?? [],',
  '    ),',
  '  );',
  '}',
  '',
  'async function iniciarEtapa(idEtapa) {',
  '  const etapa = cenaAtual?.etapas?.[idEtapa];',
  '',
  '  if (!etapa) {',
  '    console.warn("Etapa não encontrada na cena atual:", idEtapa);',
  '    return;',
  '  }',
  '',
  '  estadoAtualJogo.progresso.etapaId = idEtapa;',
  '  ocultarEscolhas();',
  '',
  '  await exibirContexto(etapa.descricao);',
  '',
  '  if (etapa.pendenciaFonte && !etapa.teste) {',
  '    await MotorAventura.mostrarPendenciaFonte(etapa);',
  '    return;',
  '  }',
  '',
  '  if (etapa.teste) {',
  '    await MotorAventura.iniciarTeste({',
  '      teste: etapa.teste,',
  '      resultados: etapa.resultados,',
  '      instrucao: etapa.instrucao,',
  '      origem: etapa,',
  '    });',
  '    return;',
  '  }',
  '',
  '  if (Array.isArray(etapa.escolhas) && etapa.escolhas.length > 0) {',
  '    exibirEscolhas(etapa.escolhas);',
  '    return;',
  '  }',
  '',
  '  if (etapa.proximaEtapa) {',
  '    await iniciarEtapa(etapa.proximaEtapa);',
  '    return;',
  '  }',
  '',
  '  if (etapa.proximaCena) {',
  '    mudarCena(etapa.proximaCena);',
  '    return;',
  '  }',
  '',
  '  console.warn("Etapa concluída sem destino:", idEtapa, etapa);',
  '}',
  '',
]);

substituirEntre(
  "aventuras.js",
  "function exibirEscolhas(escolhas) {",
  "function resolverIniciativaJogador(resultadoRolagem) {",
  fluxoNarrativo,
  "consolida navegação narrativa",
);

substituirExato(
  "aventuras.js",
  linhas([
    '  if (!testePendente) {',
    '    return;',
    '  }',
    '',
    '  console.log("Resultado recebido pela aventura:", resultadoRolagem);',
    '',
    '  resolverTeste(resultadoRolagem);',
  ]),
  "",
  "delega resultado narrativo ao motor",
);

const selecionarEscolha = linhas([
  'async function selecionarEscolha(evento) {',
  '  if (MotorAventura.temTesteAtivo()) {',
  '    return;',
  '  }',
  '',
  '  const botaoEscolha = evento.target.closest(".botao-escolha");',
  '',
  '  if (!botaoEscolha) {',
  '    return;',
  '  }',
  '',
  '  const escolhaSelecionada = escolhasAtuais.find(function (escolha) {',
  '    return escolha.id === botaoEscolha.dataset.idEscolha;',
  '  });',
  '',
  '  if (!escolhaSelecionada) {',
  '    console.warn("Escolha não encontrada:", botaoEscolha.dataset.idEscolha);',
  '    return;',
  '  }',
  '',
  '  await confirmarEscolhaVisualmente(botaoEscolha);',
  '',
  '  if (typeof escolhaSelecionada.__acaoMotor === "function") {',
  '    await escolhaSelecionada.__acaoMotor();',
  '    return;',
  '  }',
  '',
  '  if (escolhaSelecionada.registrarNarrativa !== false) {',
  '    NarradorAventura.adicionarEscolhaRealizada(escolhaSelecionada);',
  '    await esperar(250);',
  '  }',
  '',
  '  if (escolhaSelecionada.etapaInicial) {',
  '    estadoAtualJogo.progresso.caminhoId = escolhaSelecionada.id;',
  '    await iniciarEtapa(escolhaSelecionada.etapaInicial);',
  '    return;',
  '  }',
  '',
  '  if (escolhaSelecionada.proximaEtapa) {',
  '    await iniciarEtapa(escolhaSelecionada.proximaEtapa);',
  '    return;',
  '  }',
  '',
  '  if (escolhaSelecionada.proximaCena) {',
  '    mudarCena(escolhaSelecionada.proximaCena);',
  '    return;',
  '  }',
  '',
  '  console.warn("A escolha não possui destino:", escolhaSelecionada);',
  '}',
  '',
]);

substituirEntre(
  "aventuras.js",
  "async function selecionarEscolha(evento) {",
  "function mudarCena(idProximaCena) {",
  selecionarEscolha,
  "simplifica seleção de escolhas",
);

const mudarCena = linhas([
  'function mudarCena(idProximaCena) {',
  '  const proximaCena = aventuraAtual.cenas[idProximaCena];',
  '',
  '  if (!proximaCena) {',
  '    console.warn("Cena não encontrada:", idProximaCena);',
  '    return;',
  '  }',
  '',
  '  cenaAtual = proximaCena;',
  '  estadoAtualJogo.progresso.cenaId = idProximaCena;',
  '  estadoAtualJogo.progresso.caminhoId = null;',
  '  estadoAtualJogo.progresso.etapaId = null;',
  '',
  '  MotorAventura.cancelarTeste();',
  '  void exibirCena(aventuraAtual, cenaAtual);',
  '}',
  '',
]);

substituirEntre(
  "aventuras.js",
  "function mudarCena(idProximaCena) {",
  "function processarTurnoAtual(combate) {",
  mudarCena,
  "simplifica mudança de cena",
);

substituirExato(
  "aventuras.js",
  linhas([
    '    ocultarEscolhas();',
    '',
    '    solicitacaoTeste.textContent = "";',
    '',
    '    solicitacaoTeste.hidden = true;',
  ]),
  linhas([
    '    ocultarEscolhas();',
  ]),
  "remove limpeza de elemento narrativo legado",
);

substituirExato(
  "aventuras.js",
  'exibirCena(aventuraAtual, cenaAtual);\n',
  'void exibirCena(aventuraAtual, cenaAtual);\n',
  "marca inicialização assíncrona",
);

// =====================================================
// CSS DA AVENTURA
// =====================================================

let css = ler("aventuras.css");

css = css.replace(
  linhas([
    '.contexto-cena {',
    '  white-space: pre-line;',
    '}',
    '',
  ]),
  "",
);

css = css.replace(
  linhas([
    '.conteudo-cena {',
    '  font-family: Georgia, "Times New Roman", serif;',
    '  line-height: 1.6;',
    '}',
    '',
  ]),
  "",
);

css = css.replace(
  linhas([
    '.area-escolhas {',
    '  margin-top: 6px;',
    '}',
  ]),
  linhas([
    '.area-escolhas {',
    '  margin-top: 6px;',
    '  transition:',
    '    opacity 220ms ease,',
    '    transform 220ms ease;',
    '}',
  ]).trimEnd(),
);

css = css.replace(
  linhas([
    '.area-escolhas {',
    '  transition:',
    '    opacity 220ms ease,',
    '    transform 220ms ease;',
    '}',
    '',
  ]),
  "",
);

css = css.replace(
  linhas([
    '  cursor: pointer;',
    '  white-space: pre-line;',
    '}',
  ]),
  linhas([
    '  cursor: pointer;',
    '  white-space: normal;',
    '  transition:',
    '    opacity 180ms ease,',
    '    transform 180ms ease,',
    '    background-color 180ms ease,',
    '    border-color 180ms ease;',
    '}',
  ]).trimEnd(),
);

css = css.replace(
  linhas([
    '.botao-escolha {',
    '  transition:',
    '    opacity 180ms ease,',
    '    transform 180ms ease,',
    '    background-color 180ms ease,',
    '    border-color 180ms ease;',
    '}',
    '',
  ]),
  "",
);

css = css.replace(
  linhas([
    '.area-resultado {',
    '  margin-top: 24px;',
    '  padding-top: 20px;',
    '  border-top: 1px solid var(--cor-aventura-borda-suave);',
    '}',
    '',
  ]),
  "",
);

css = css.replace(
  lines = linhas([
    '.bloco-narrativo {',
    '  margin: 0 0 -20px;',
    '}',
  ]).trimEnd(),
  linhas([
    '.bloco-narrativo {',
    '  margin: 0 0 14px;',
    '}',
  ]).trimEnd(),
);

css = css.replace(
  linhas([
    '.bloco-narrativo p {',
    '  margin: 0 0 8px;',
    '}',
  ]).trimEnd(),
  linhas([
    '.bloco-narrativo p {',
    '  margin: 0 0 8px;',
    '}',
  ]).trimEnd(),
);

css = css.replace(
  linhas([
    '.bloco-narrativo p {',
    '  white-space: pre-line;',
    '}',
    '',
  ]),
  "",
);

css += "\n.escolha-realizada {\n  margin: 0 0 10px;\n}\n\n.escolha-realizada .paragrafo-escolha {\n  display: block;\n  margin: 0 0 8px;\n}\n\n.escolha-realizada .paragrafo-escolha:last-child,\n.botao-escolha .paragrafo-escolha:last-child {\n  margin-bottom: 0;\n}\n\n.botao-escolha .paragrafo-escolha {\n  display: block;\n  margin: 0 0 8px;\n}\n";

escrever("aventuras.css", css);

// =====================================================
// ARQUIVOS SUBSTITUÍDOS
// =====================================================

removerArquivo("motor-fluxo-cena.js");
removerArquivo("confirmacao-combate.js");

// =====================================================
// HIGIENE GERAL DE TEXTO
// =====================================================

for (const entrada of fs.readdirSync(raiz, { withFileTypes: true })) {
  if (!entrada.isFile()) {
    continue;
  }

  if (/\.(?:html|css|js|md|json|yml|yaml)$/i.test(entrada.name)) {
    limparEspacosFinais(entrada.name);
  }
}

console.log("Limpeza arquitetural principal aplicada.");
