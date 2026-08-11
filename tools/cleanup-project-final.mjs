import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const caminho = relativo => path.join(raiz, relativo);

function ler(relativo) {
  return fs.readFileSync(caminho(relativo), "utf8");
}

function escrever(relativo, conteudo) {
  fs.writeFileSync(caminho(relativo), conteudo, "utf8");
}

function substituirUmaVez(conteudo, busca, substituicao, rotulo) {
  const quantidade = conteudo.split(busca).length - 1;

  if (quantidade !== 1) {
    throw new Error(`${rotulo}: esperado 1 trecho, encontrado ${quantidade}.`);
  }

  return conteudo.replace(busca, substituicao);
}

function substituirEntre(conteudo, inicio, fim, substituicao, rotulo) {
  const indiceInicio = conteudo.indexOf(inicio);
  const indiceFim = conteudo.indexOf(fim, indiceInicio + inicio.length);

  if (indiceInicio < 0 || indiceFim < 0) {
    throw new Error(`${rotulo}: marcadores não encontrados.`);
  }

  return conteudo.slice(0, indiceInicio) + substituicao + conteudo.slice(indiceFim);
}

function removerArquivo(relativo) {
  if (fs.existsSync(caminho(relativo))) {
    fs.rmSync(caminho(relativo));
  }
}

function limparEspacosFinais(conteudo) {
  return conteudo
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(linha => linha.replace(/[ \t]+$/g, ""))
    .join("\n");
}

// =====================================================
// aventuras.html
// =====================================================

{
  const arquivo = "aventuras.html";
  let html = ler(arquivo);

  const legado = `                <div class="interface-aventura-legada">
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
                </div>
`;

  html = substituirUmaVez(
    html,
    legado,
    `                <div class="area-escolhas">
                  <div id="listaEscolhas" class="lista-escolhas"></div>
                </div>
`,
    "remove interface narrativa legada",
  );

  html = substituirUmaVez(
    html,
    `                <div
  class="controles-rolagem-pergaminho"
  aria-label="Controles de rolagem"
>`,
    `                <div
  class="controles-rolagem-pergaminho"
  role="group"
  aria-label="Controles de rolagem"
>`,
    "corrige grupo de controles de rolagem",
  );

  html = substituirUmaVez(
    html,
    `            <aside class="adendos-aventura">`,
    `            <aside class="adendos-aventura" aria-label="Ferramentas da aventura">`,
    "nomeia ferramentas da aventura",
  );

  html = substituirUmaVez(
    html,
    `            </aside>
            
          </div>

        <section`,
    `            </aside>

          </div>
        </div>

        <section`,
    "fecha visualização narrativa",
  );

  html = substituirUmaVez(
    html,
    `    <script src="narrador-aventura.js" defer></script>
    <script src="aventuras.js" defer></script>
    <script src="motor-aventura.js" defer></script>
    <script src="motor-fluxo-cena.js" defer></script>`,
    `    <script src="narrador-aventura.js" defer></script>
    <script src="motor-aventura.js" defer></script>
    <script src="aventuras.js" defer></script>`,
    "consolida scripts narrativos",
  );

  escrever(arquivo, limparEspacosFinais(html));
}

for (const arquivo of ["criacao-personagem.html", "ver-personagem.html"]) {
  let html = ler(arquivo);
  html = html.replace(/\s*<script src="banco-efeitos\.js"><\/script>/g, "");
  escrever(arquivo, limparEspacosFinais(html));
}

// =====================================================
// aventuras.js
// =====================================================

{
  const arquivo = "aventuras.js";
  let js = ler(arquivo);

  js = substituirUmaVez(
    js,
    `let cenaAtual = aventuraAtual.cenas[idCenaInicial];
let testePendente = null;
let caminhoAtual = null;
let etapaAtual = null;
let tokenArrastado = null;`,
    `let cenaAtual = aventuraAtual.cenas[idCenaInicial];
let tokenArrastado = null;`,
    "remove estado narrativo duplicado",
  );

  js = js.replace('const contextoCena = document.querySelector("#contextoCena");\n', "");
  js = js.replace('const solicitacaoTeste = document.querySelector("#solicitacaoTeste");\n', "");

  js = substituirEntre(
    js,
    "function prepararRolagemTesteAventura(teste) {",
    "async function animarMovimentoInimigo(participante, caminho) {",
    "",
    "remove motor de testes duplicado",
  );

  const fluxoNarrativo = `function exibirEscolhas(escolhas = []) {
  escolhasAtuais = Array.isArray(escolhas) ? escolhas : [];

  listaEscolhas.replaceChildren();

  for (const escolha of escolhasAtuais) {
    const botaoEscolha = document.createElement("button");
    botaoEscolha.type = "button";
    botaoEscolha.className = "botao-escolha";
    botaoEscolha.dataset.idEscolha = escolha.id;

    NarradorAventura.preencherElementoComParagrafos(
      botaoEscolha,
      escolha.texto ?? "",
    );

    listaEscolhas.append(botaoEscolha);
  }

  const possuiEscolhas = escolhasAtuais.length > 0;
  areaEscolhas.hidden = !possuiEscolhas;
  listaEscolhas.hidden = !possuiEscolhas;
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

  if (cena.combate) {
    verificarCombateDaCena(cena);
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

  await exibirContexto(etapa.descricao);

  if (etapa.pendenciaFonte && !etapa.teste) {
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

  js = substituirEntre(
    js,
    "function exibirEscolhas(escolhas) {",
    "function resolverIniciativaJogador(resultadoRolagem) {",
    fluxoNarrativo,
    "consolida fluxo narrativo",
  );

  js = js.replace(
    /\n  if \(!testePendente\) \{\n    return;\n  \}\n\n  console\.log\("Resultado recebido pela aventura:", resultadoRolagem\);\n\n  resolverTeste\(resultadoRolagem\);/,
    "",
  );

  const selecionarEscolha = `async function selecionarEscolha(evento) {
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

  js = substituirEntre(
    js,
    "async function selecionarEscolha(evento) {",
    "function mudarCena(idProximaCena) {",
    selecionarEscolha,
    "simplifica escolha narrativa",
  );

  const mudarCena = `function mudarCena(idProximaCena) {
  const proximaCena = aventuraAtual.cenas[idProximaCena];

  if (!proximaCena) {
    console.warn("Cena não encontrada:", idProximaCena);
    return;
  }

  cenaAtual = proximaCena;
  estadoAtualJogo.progresso.cenaId = idProximaCena;
  estadoAtualJogo.progresso.caminhoId = null;
  estadoAtualJogo.progresso.etapaId = null;

  MotorAventura.cancelarTeste();
  void exibirCena(aventuraAtual, cenaAtual);
}

`;

  js = substituirEntre(
    js,
    "function mudarCena(idProximaCena) {",
    "function processarTurnoAtual(combate) {",
    mudarCena,
    "simplifica mudança de cena",
  );

  js = js.replace(
    /\n    solicitacaoTeste\.textContent = "";\n\n    solicitacaoTeste\.hidden = true;/g,
    "",
  );

  js = substituirUmaVez(
    js,
    `NarradorAventura.limpar();

exibirCena(aventuraAtual, cenaAtual);`,
    `NarradorAventura.limpar();

void exibirCena(aventuraAtual, cenaAtual);`,
    "corrige inicialização assíncrona",
  );

  escrever(arquivo, limparEspacosFinais(js));
}

// =====================================================
// aventuras.css
// =====================================================

{
  const arquivo = "aventuras.css";
  let css = ler(arquivo);

  css = css.replace(/\.contexto-cena \{[\s\S]*?\}\n\n/, "");
  css = css.replace(/\.conteudo-cena \{[\s\S]*?\}\n\n/, "");
  css = css.replace(/\.area-resultado \{[\s\S]*?\}\n\n/, "");

  css = substituirUmaVez(
    css,
    `.area-escolhas {
  margin-top: 6px;
}`,
    `.area-escolhas {
  margin-top: 6px;
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}`,
    "consolida area de escolhas",
  );

  css = css.replace(
    /\n\.area-escolhas \{\n  transition:\n    opacity 220ms ease,\n    transform 220ms ease;\n\}\n/,
    "\n",
  );

  css = substituirUmaVez(
    css,
    `  cursor: pointer;
  white-space: pre-line;
}`,
    `  cursor: pointer;
  white-space: normal;
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}`,
    "consolida botão de escolha",
  );

  css = css.replace(
    /\n\.botao-escolha \{\n  transition:[\s\S]*?\n\}\n/,
    "\n",
  );

  css = substituirUmaVez(
    css,
    `.bloco-narrativo {
  margin: 0 0 -20px;
}`,
    `.bloco-narrativo {
  margin: 0 0 14px;
}`,
    "remove margem narrativa negativa",
  );

  css = css.replace(
    /\n\.bloco-narrativo p \{\n  white-space: pre-line;\n\}\n/,
    "\n",
  );

  css = substituirUmaVez(
    css,
    `.bloco-narrativo p {
  margin: 0 0 8px;
}

.linha-teste-narrativo`,
    `.bloco-narrativo p {
  margin: 0 0 8px;
}

.bloco-narrativo p:last-child {
  margin-bottom: 0;
}

.escolha-realizada {
  margin: 0 0 10px;
}

.escolha-realizada .paragrafo-escolha,
.botao-escolha .paragrafo-escolha {
  display: block;
  margin: 0 0 8px;
}

.escolha-realizada .paragrafo-escolha:last-child,
.botao-escolha .paragrafo-escolha:last-child {
  margin-bottom: 0;
}

.linha-teste-narrativo`,
    "organiza estilos narrativos",
  );

  escrever(arquivo, limparEspacosFinais(css));
}

// =====================================================
// Limpeza de módulos substituídos e ferramentas temporárias
// =====================================================

removerArquivo("motor-fluxo-cena.js");
removerArquivo("confirmacao-combate.js");

for (const entrada of fs.readdirSync(raiz, { withFileTypes: true })) {
  if (!entrada.isFile()) {
    continue;
  }

  if (/\.(?:html|css|js|md|json|yml|yaml)$/i.test(entrada.name)) {
    escrever(entrada.name, limparEspacosFinais(ler(entrada.name)));
  }
}

removerArquivo("tools/cleanup-project-once.mjs");
removerArquivo(".github/workflows/cleanup-project-once.yml");
removerArquivo("tools/cleanup-project-final.mjs");
removerArquivo(".github/workflows/cleanup-project-final.yml");

console.log("Limpeza arquitetural final aplicada.");
