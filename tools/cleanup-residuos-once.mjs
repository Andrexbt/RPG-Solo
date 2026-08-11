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

function remover(relativo) {
  if (fs.existsSync(caminho(relativo))) {
    fs.rmSync(caminho(relativo));
  }
}

// Remove carregamento de um módulo que já não existe.
{
  const arquivo = "janelas-flutuantes.js";
  let js = ler(arquivo);
  const marcador = '\nconst scriptIntegracaoRolagens = document.createElement("script");';
  const indice = js.indexOf(marcador);

  if (indice < 0) {
    throw new Error("Bloco legado de integracao-rolagens.js não encontrado.");
  }

  js = js.slice(0, indice).trimEnd() + "\n";
  escrever(arquivo, js);
}

// As duas implementações são idênticas; mantém apenas uma.
{
  const arquivo = "interface-combate.js";
  let js = ler(arquivo);
  const marcador = "function atualizarPontosDeVidaFichaCombate(";
  const primeira = js.indexOf(marcador);
  const segunda = js.indexOf(marcador, primeira + marcador.length);
  const terceira = js.indexOf(marcador, segunda + marcador.length);

  if (primeira < 0 || segunda < 0 || terceira >= 0) {
    throw new Error("Esperadas exatamente duas implementações de atualizarPontosDeVidaFichaCombate.");
  }

  js = js.slice(0, primeira) + js.slice(segunda);
  escrever(arquivo, js);
}

// Helper de desenvolvimento sem qualquer referência restante no projeto.
remover("testes-dev.js");

// Remove a infraestrutura temporária usada exclusivamente nesta auditoria/faxina.
remover("tools/audit-project-once.mjs");
remover(".github/workflows/audit-project-once.yml");
remover("tools/cleanup-residuos-once.mjs");
remover(".github/workflows/cleanup-residuos-once.yml");

console.log("Resíduos técnicos removidos.");
