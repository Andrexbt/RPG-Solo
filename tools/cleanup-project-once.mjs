import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const caminho = nome => path.join(raiz, nome);
const ler = nome => fs.readFileSync(caminho(nome), "utf8");
const escrever = (nome, conteudo) => fs.writeFileSync(caminho(nome), conteudo.replace(/\r\n/g, "\n"));
const linhas = itens => itens.join("\n") + "\n";

function substituirExato(nome, antes, depois, rotulo) {
  const conteudo = ler(nome);
  const quantidade = conteudo.split(antes).length - 1;

  if (quantidade !== 1) {
    throw new Error(`${rotulo}: esperado 1 trecho em ${nome}, encontrado ${quantidade}.`);
  }

  escrever(nome, conteudo.replace(antes, depois));
}

function substituirEntre(nome, inicio, fim, substituto, rotulo) {
  const conteudo = ler(nome);
  const a = conteudo.indexOf(inicio);
  const b = conteudo.indexOf(fim, a + inicio.length);

  if (a < 0 || b < 0) {
    throw new Error(`${rotulo}: marcadores não encontrados em ${nome}.`);
  }

  escrever(nome, conteudo.slice(0, a) + substituto + conteudo.slice(b));
}

// aventuras.js: elimina o motor narrativo antigo e deixa um único controlador de fluxo.
substituirExato(
  "aventuras.js",
  "let testePendente = null;\nlet caminhoAtual = null;\nlet etapaAtual = null;\n",
  "",
  "remove variáveis narrativas legadas",
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
  "",
  "remove helpers duplicados de teste",
);

const fluxoNarrativo = linhas([
  'function exibirEscolhas(escolhas = []) {',
  '  escolhasAtuais = escolhas;',
  '',
  '  const possuiEscolhas = escolhas.length > 0;',
  '  areaEscolhas.hidden = !possuiEscolhas;',
  '  listaEscolhas.hidden = !possuiEscolhas;',
  '  listaEscolhas.replaceChildren();',
  '',
  '  for (const escolha of escolhas) {',
  '    const botaoEscolha = document.createElement("button");',
  '    botaoEscolha.type = "button";',
  '    botaoEscolha.classList.add("botao-escolha");',
  '    botaoEscolha.dataset.idEscolha = escolha.id;',
  '',
  '    NarradorAventura.preencherElementoComParagrafos(',
  '      botaoEscolha,',
  '      escolha.texto ?? "",',
  '    );',
  '',
  '    listaEscolhas.append(botaoEscolha);',
  '  }',
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
  '  solicitacaoTeste.textContent = "";',
  '  solicitacaoTeste.hidden = true;',
  '',
  '  verificarCombateDaCena(cena);',
  '',
  '  if (cena.combate) {',
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
  '  if (etapa.descricao !== undefined) {',
  '    await exibirContexto(etapa.descricao);',
  '  }',
  '',
  '  if (',
  '    etapa.pendenciaFonte &&',
  '    (!etapa.teste || etapa.teste.dificuldade == null)',
  '  ) {',
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
  "consolida fluxo narrativo",
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
  "remove resolução duplicada de teste",
);

const novaSelecao = linhas([
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
  novaSelecao,
  "simplifica seleção narrativa",
);

let aventuras = ler("aventuras.js");
aventuras = aventuras
  .replace(/\n\s*caminhoAtual = null;\n/g, "\n")
  .replace(/\n\s*etapaAtual = null;\n/g, "\n")
  .replace(/\n\s*testePendente = null;\n/g, "\n");

aventuras = aventuras.replace(
  "  estadoAtualJogo.testePendente = null;\n\n  exibirCena(aventuraAtual, cenaAtual);",
  "  estadoAtualJogo.testePendente = null;\n  MotorAventura.cancelarTeste();\n\n  void exibirCena(aventuraAtual, cenaAtual);",
);

escrever("aventuras.js", aventuras);

for (const nome of ["testePendente", "caminhoAtual", "etapaAtual"]) {
  if (new RegExp(`\\b${nome}\\b`).test(ler("aventuras.js"))) {
    throw new Error(`aventuras.js ainda contém referência legada a ${nome}.`);
  }
}

// aventuras.html: remove a interface antiga e declara cada dependência uma única vez.
const htmlAntes = linhas([
  '                <div',
  '                  id="fluxoNarrativo"',
  '                  class="fluxo-narrativo"',
  '                  aria-live="polite">',
  '                </div>',
  '',
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
]);

const htmlDepois = linhas([
  '                <div',
  '                  id="fluxoNarrativo"',
  '                  class="fluxo-narrativo"',
  '                  aria-live="polite"',
  '                ></div>',
  '',
  '                <p id="solicitacaoTeste" hidden></p>',
  '',
  '                <div class="area-escolhas">',
  '                  <div id="listaEscolhas" class="lista-escolhas"></div>',
  '                </div>',
]);

substituirExato("aventuras.html", htmlAntes, htmlDepois, "remove DOM legado da aventura");

substituirExato(
  "aventuras.html",
  linhas([
    '    <script src="narrador-aventura.js" defer></script>',
    '    <script src="aventuras.js" defer></script>',
    '    <script src="motor-aventura.js" defer></script>',
    '    <script src="motor-fluxo-cena.js" defer></script>',
  ]).trimEnd(),
  linhas([
    '    <script src="narrador-aventura.js" defer></script>',
    '    <script src="motor-aventura.js" defer></script>',
    '    <script src="aventuras.js" defer></script>',
    '    <script src="testes-dev.js" defer></script>',
  ]).trimEnd(),
  "organiza scripts da aventura",
);

for (const nome of ["criacao-personagem.html", "ver-personagem.html"]) {
  substituirExato(
    nome,
    '    <script src="banco-efeitos.js"></script>\n',
    "",
    `remove banco-efeitos inexistente de ${nome}`,
  );
}

// CSS: centraliza estilos narrativos e remove hacks surgidos durante as mudanças recentes.
let css = ler("aventuras.css");

if (!css.includes("--espaco-paragrafos-aventura")) {
  css = css.replace(
    "  --cor-aventura-borda-suave: rgba(105, 72, 47, 0.3);\n",
    "  --cor-aventura-borda-suave: rgba(105, 72, 47, 0.3);\n  --espaco-paragrafos-aventura: 8px;\n",
  );
}

css = css.replace(
  linhas([
    '.botao-escolha {',
    '  width: 100%;',
    '  padding: 14px 18px;',
    '  border: 1px solid var(--cor-aventura-borda);',
    '  border-radius: 8px;',
    '  background: transparent;',
    '  color: inherit;',
    '  font-family: Georgia, "Times New Roman", serif;',
    '  text-align: left;',
    '  cursor: pointer;',
    '  white-space: pre-line;',
    '}',
    '',
    '.botao-escolha:hover {',
    '  background: rgba(105, 72, 47, 0.1);',
    '}',
    '',
    '.botao-escolha {',
    '  transition:',
    '    opacity 180ms ease,',
    '    transform 180ms ease,',
    '    background-color 180ms ease,',
    '    border-color 180ms ease;',
    '}',
  ]),
  linhas([
    '.botao-escolha {',
    '  width: 100%;',
    '  padding: 14px 18px;',
    '  border: 1px solid var(--cor-aventura-borda);',
    '  border-radius: 8px;',
    '  background: transparent;',
    '  color: inherit;',
    '  font-family: Georgia, "Times New Roman", serif;',
    '  text-align: left;',
    '  cursor: pointer;',
    '  white-space: normal;',
    '  transition:',
    '    opacity 180ms ease,',
    '    transform 180ms ease,',
    '    background-color 180ms ease,',
    '    border-color 180ms ease;',
    '}',
    '',
    '.botao-escolha:hover {',
    '  background: rgba(105, 72, 47, 0.1);',
    '}',
  ]),
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

const inicioNarrativa = css.indexOf(".fluxo-narrativo {");
const fimNarrativa = css.indexOf(".controles-rolagem-pergaminho {", inicioNarrativa);

if (inicioNarrativa < 0 || fimNarrativa < 0) {
  throw new Error("Bloco narrativo não encontrado em aventuras.css.");
}

const cssNarrativo = linhas([
  '.fluxo-narrativo {',
  '  padding-bottom: 30px;',
  '  color: var(--cor-aventura-tinta);',
  '  font-family: Georgia, "Times New Roman", serif;',
  '  font-size: 1rem;',
  '  line-height: 1.6;',
  '}',
  '',
  '.bloco-narrativo {',
  '  margin: 0;',
  '}',
  '',
  '.bloco-narrativo p {',
  '  margin: 0 0 var(--espaco-paragrafos-aventura);',
  '}',
  '',
  '.bloco-narrativo p:last-child {',
  '  margin-bottom: 0;',
  '}',
  '',
  '.botao-escolha .paragrafo-escolha,',
  '.escolha-realizada .paragrafo-escolha {',
  '  display: block;',
  '  margin: 0 0 var(--espaco-paragrafos-aventura);',
  '}',
  '',
  '.botao-escolha .paragrafo-escolha:last-child,',
  '.escolha-realizada .paragrafo-escolha:last-child {',
  '  margin-bottom: 0;',
  '}',
  '',
  '.escolha-realizada {',
  '  margin: 0;',
  '  font-weight: inherit;',
  '}',
  '',
  '.escolha-realizada::before {',
  '  content: none;',
  '}',
  '',
  '.linha-teste-narrativo {',
  '  margin: 18px 0;',
  '  font-style: italic;',
  '}',
  '',
]);

css = css.slice(0, inicioNarrativa) + cssNarrativo + css.slice(fimNarrativa);
css = css.replace(
  linhas([
    '.bloco-narrativo p {',
    '  white-space: pre-line;',
    '}',
    '',
  ]),
  "",
);

escrever("aventuras.css", css);

// Arquivos que existiam apenas para monkey-patch de funções já consolidadas.
for (const nome of ["motor-fluxo-cena.js", "confirmacao-combate.js"]) {
  if (fs.existsSync(caminho(nome))) {
    fs.unlinkSync(caminho(nome));
  }
}

// Documentação curta da regra arquitetural atual.
let readme = ler("README.md");

if (!readme.includes("## Arquitetura do código")) {
  readme += "\n\n" + linhas([
    '## Arquitetura do código',
    '',
    'O projeto segue a regra: **dados descrevem; motores interpretam; interfaces exibem**.',
    '',
    '- arquivos `banco-*.js` contêm dados declarativos;',
    '- `estado-jogo.js` mantém somente o estado compartilhado e seus helpers;',
    '- os arquivos `motor-*.js`, `testes.js` e `combate.js` interpretam regras;',
    '- `aventuras.js` controla a página da aventura e a navegação entre cenas e etapas;',
    '- `narrador-aventura.js` apresenta a narrativa no pergaminho;',
    '- arquivos de interface renderizam dados e recebem interação.',
    '',
    '### Fluxo narrativo',
    '',
    'As etapas pertencem diretamente à cena em `cena.etapas`. Escolhas não contêm outras escolhas: apontam para `etapaInicial`, `proximaEtapa` ou `proximaCena`. A ordem física das etapas no banco não determina o fluxo; os IDs determinam as conexões.',
  ]);
}

escrever("README.md", readme);

// Auditoria de todos os HTML: nenhuma referência local a script/CSS pode apontar para arquivo inexistente.
function listarArquivos(diretorio) {
  return fs.readdirSync(diretorio, { withFileTypes: true }).flatMap(entrada => {
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

const quebradas = [];
const htmls = listarArquivos(raiz).filter(nome => nome.endsWith(".html"));

for (const html of htmls) {
  const conteudo = fs.readFileSync(html, "utf8");
  const regex = /<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g;
  let match;

  while ((match = regex.exec(conteudo))) {
    const ref = match[1];

    if (/^(?:https?:|data:|#)/.test(ref)) {
      continue;
    }

    const local = path.resolve(path.dirname(html), ref.split(/[?#]/)[0]);

    if (!fs.existsSync(local)) {
      quebradas.push(`${path.relative(raiz, html)} -> ${ref}`);
    }
  }
}

if (quebradas.length) {
  throw new Error(`Referências locais quebradas:\n${quebradas.join("\n")}`);
}

console.log("Limpeza concluída e referências HTML locais auditadas.");
