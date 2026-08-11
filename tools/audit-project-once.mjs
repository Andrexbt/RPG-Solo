import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const ignorarDiretorios = new Set([".git", "node_modules", "Imagens", "Fontes"]);

function listarArquivos(diretorio = raiz, relativos = []) {
  for (const entrada of fs.readdirSync(diretorio, { withFileTypes: true })) {
    if (entrada.isDirectory() && ignorarDiretorios.has(entrada.name)) {
      continue;
    }

    const absoluto = path.join(diretorio, entrada.name);
    const relativo = path.relative(raiz, absoluto).replaceAll("\\", "/");

    if (entrada.isDirectory()) {
      listarArquivos(absoluto, relativos);
    } else {
      relativos.push(relativo);
    }
  }

  return relativos;
}

const arquivos = listarArquivos();
const textos = arquivos.filter(arquivo => /\.(?:html|css|js|md|json|yml|yaml)$/i.test(arquivo));
const conteudos = new Map(textos.map(arquivo => [arquivo, fs.readFileSync(path.join(raiz, arquivo), "utf8")]));

function existe(relativo) {
  return fs.existsSync(path.join(raiz, relativo));
}

function normalizarReferencia(origem, referencia) {
  if (
    !referencia ||
    referencia.startsWith("http://") ||
    referencia.startsWith("https://") ||
    referencia.startsWith("//") ||
    referencia.startsWith("data:") ||
    referencia.startsWith("#") ||
    referencia.startsWith("mailto:") ||
    referencia.startsWith("javascript:")
  ) {
    return null;
  }

  const semConsulta = referencia.split(/[?#]/)[0];
  return path
    .normalize(path.join(path.dirname(origem), semConsulta))
    .replaceAll("\\", "/");
}

const referenciasAusentes = [];

for (const arquivo of textos) {
  const conteudo = conteudos.get(arquivo);
  const regexes = [
    /\b(?:src|href)\s*=\s*["']([^"']+)["']/g,
    /\b(?:src|href)\s*=\s*`([^`]+)`/g,
    /\bfetch\(\s*["']([^"']+)["']/g,
    /\.src\s*=\s*["']([^"']+)["']/g,
  ];

  for (const regex of regexes) {
    for (const correspondencia of conteudo.matchAll(regex)) {
      const destino = normalizarReferencia(arquivo, correspondencia[1]);

      if (destino && !destino.includes("${") && !existe(destino)) {
        referenciasAusentes.push({ origem: arquivo, referencia: correspondencia[1], destino });
      }
    }
  }
}

const arquivosCodigoRaiz = arquivos.filter(
  arquivo => !arquivo.includes("/") && /\.(?:js|css|html)$/i.test(arquivo),
);

const referenciasPorArquivo = new Map();
for (const alvo of arquivosCodigoRaiz) {
  const nome = path.basename(alvo);
  const origens = [];

  for (const [origem, conteudo] of conteudos) {
    if (origem === alvo) {
      continue;
    }

    if (conteudo.includes(nome)) {
      origens.push(origem);
    }
  }

  referenciasPorArquivo.set(alvo, origens);
}

const possiveisOrfaos = [...referenciasPorArquivo]
  .filter(([arquivo, origens]) => origens.length === 0 && !/^(?:index\.html|README)/i.test(arquivo))
  .map(([arquivo]) => arquivo);

const funcoesDuplicadas = [];
for (const [arquivo, conteudo] of conteudos) {
  if (!arquivo.endsWith(".js")) {
    continue;
  }

  const nomes = new Map();
  const regex = /^function\s+([A-Za-z_$][\w$]*)\s*\(/gm;

  for (const correspondencia of conteudo.matchAll(regex)) {
    nomes.set(correspondencia[1], (nomes.get(correspondencia[1]) ?? 0) + 1);
  }

  for (const [nome, quantidade] of nomes) {
    if (quantidade > 1) {
      funcoesDuplicadas.push({ arquivo, nome, quantidade });
    }
  }
}

const marcadoresLegados = [
  "interface-aventura-legada",
  "contextoCena",
  "solicitacaoTeste",
  "areaResultado",
  "tituloEscolhas",
  "motor-fluxo-cena.js",
  "confirmacao-combate.js",
  "banco-efeitos.js",
];

const legadosEncontrados = [];
for (const marcador of marcadoresLegados) {
  for (const [arquivo, conteudo] of conteudos) {
    if (conteudo.includes(marcador)) {
      legadosEncontrados.push({ marcador, arquivo });
    }
  }
}

const todos = [...conteudos.entries()].map(([arquivo, conteudo]) => `${arquivo}\n${conteudo}`).join("\n");
const cssRaiz = arquivos.filter(arquivo => !arquivo.includes("/") && arquivo.endsWith(".css"));
const jsRaiz = arquivos.filter(arquivo => !arquivo.includes("/") && arquivo.endsWith(".js"));

const htmls = arquivos.filter(arquivo => arquivo.endsWith(".html"));
const scriptsDuplicadosHtml = [];

for (const arquivo of htmls) {
  const conteudo = conteudos.get(arquivo) ?? fs.readFileSync(path.join(raiz, arquivo), "utf8");
  const scripts = [...conteudo.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g)].map(item => item[1]);
  const contagem = new Map();

  for (const script of scripts) {
    contagem.set(script, (contagem.get(script) ?? 0) + 1);
  }

  for (const [script, quantidade] of contagem) {
    if (quantidade > 1) {
      scriptsDuplicadosHtml.push({ arquivo, script, quantidade });
    }
  }
}

const todosTodos = todos;
const todosEncontrados = [];
for (const [arquivo, conteudo] of conteudos) {
  for (const correspondencia of conteudo.matchAll(/\b(?:TODO|FIXME|HACK)\b[^\n]*/g)) {
    todosEncontrados.push({ arquivo, texto: correspondencia[0].trim() });
  }
}

console.log("=== AUDITORIA PROFUNDA DO RPG SOLO ===");
console.log(`Arquivos analisados: ${arquivos.length}`);
console.log(`Arquivos textuais analisados: ${textos.length}`);
console.log(`JS raiz: ${jsRaiz.length} | CSS raiz: ${cssRaiz.length} | HTML: ${htmls.length}`);

console.log("\n=== REFERÊNCIAS LOCAIS AUSENTES ===");
console.log(referenciasAusentes.length ? JSON.stringify(referenciasAusentes, null, 2) : "Nenhuma.");

console.log("\n=== POSSÍVEIS ARQUIVOS ÓRFÃOS (HEURÍSTICA; NÃO APAGAR AUTOMATICAMENTE) ===");
console.log(possiveisOrfaos.length ? possiveisOrfaos.join("\n") : "Nenhum.");

console.log("\n=== FUNÇÕES TOP-LEVEL DUPLICADAS ===");
console.log(funcoesDuplicadas.length ? JSON.stringify(funcoesDuplicadas, null, 2) : "Nenhuma.");

console.log("\n=== SCRIPTS DUPLICADOS EM HTML ===");
console.log(scriptsDuplicadosHtml.length ? JSON.stringify(scriptsDuplicadosHtml, null, 2) : "Nenhum.");

console.log("\n=== MARCADORES LEGADOS REMANESCENTES ===");
console.log(legadosEncontrados.length ? JSON.stringify(legadosEncontrados, null, 2) : "Nenhum.");

console.log("\n=== TODO / FIXME / HACK ===");
console.log(todosEncontrados.length ? JSON.stringify(todosEncontrados, null, 2) : "Nenhum.");
