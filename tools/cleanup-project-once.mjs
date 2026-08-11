import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();

function caminho(relativo) {
  return path.join(raiz, relativo);
}

function ler(relativo) {
  return fs.readFileSync(caminho(relativo), "utf8");
}

function escrever(relativo, conteudo) {
  fs.writeFileSync(caminho(relativo), conteudo, "utf8");
}

function remover(relativo) {
  const arquivo = caminho(relativo);

  if (fs.existsSync(arquivo)) {
    fs.rmSync(arquivo);
  }
}

// HTML da aventura: elimina DOM e módulos legados.
{
  const arquivo = "aventuras.html";
  let html = ler(arquivo);

  html = html.replace(
    /\n\s*<div class="interface-aventura-legada">[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<\/div>\s*\n\s*<\/section>/,
    `\n\n                <div class="area-escolhas">\n                  <div id="listaEscolhas" class="lista-escolhas"></div>\n                </div>\n              </div>\n            </div>\n          </section>`,
  );

  html = html
    .replace(/\s*<script src="motor-fluxo-cena\.js"><\/script>\s*/g, "\n")
    .replace(/\s*<script src="confirmacao-combate\.js"><\/script>\s*/g, "\n");

  escrever(arquivo, html);
}

// estado-jogo.js: estado puro, sem carregamento dinâmico de outros scripts.
{
  const arquivo = "estado-jogo.js";
  const js = `"use strict";\n\nfunction criarEstadoInicialJogo() {\n  return {\n    aventuraId: null,\n\n    personagem: {\n      id: null,\n      dados: null,\n      condicoes: [],\n    },\n\n    progresso: {\n      cenaId: null,\n      etapaId: null,\n      escolhasRemovidas: {},\n      contadores: {},\n      flags: {},\n    },\n\n    npcs: {},\n    testePendente: null,\n    combateAtual: null,\n\n    tempo: {\n      segundosTotais: 0,\n    },\n\n    efeitosTemporarios: [],\n    diario: [],\n  };\n}\n\nfunction registrarEscolhaRemovida(cenaId, escolhaId) {\n  const escolhasRemovidas = window.estadoJogo.progresso.escolhasRemovidas;\n\n  if (!escolhasRemovidas[cenaId]) {\n    escolhasRemovidas[cenaId] = [];\n  }\n\n  if (!escolhasRemovidas[cenaId].includes(escolhaId)) {\n    escolhasRemovidas[cenaId].push(escolhaId);\n  }\n}\n\nfunction obterEscolhasDisponiveis(cenaId, escolhas = []) {\n  const removidas = window.estadoJogo.progresso.escolhasRemovidas[cenaId] ?? [];\n\n  return escolhas.filter(function (escolha) {\n    return !removidas.includes(escolha.id);\n  });\n}\n\nfunction carregarNpcsDaAventura(aventuraId) {\n  const npcsDaAventura = window.bancoNpcs?.[aventuraId];\n\n  if (!npcsDaAventura) {\n    console.warn("NPCs não encontrados para a aventura:", aventuraId);\n    window.estadoJogo.npcs = {};\n    return;\n  }\n\n  window.estadoJogo.npcs = structuredClone(npcsDaAventura);\n}\n\nwindow.estadoJogo = criarEstadoInicialJogo();\nwindow.criarEstadoInicialJogo = criarEstadoInicialJogo;\nwindow.registrarEscolhaRemovida = registrarEscolhaRemovida;\nwindow.obterEscolhasDisponiveis = obterEscolhasDisponiveis;\nwindow.carregarNpcsDaAventura = carregarNpcsDaAventura;\n`;

  escrever(arquivo, js);
}

// Remove referências a arquivo inexistente.
for (const arquivo of ["criacao-personagem.html", "ver-personagem.html"]) {
  const html = ler(arquivo).replace(/\s*<script src="banco-efeitos\.js"><\/script>/g, "");
  escrever(arquivo, html);
}

// CSS: corrige os hacks recentes mais claros.
{
  const arquivo = "aventuras.css";
  let css = ler(arquivo);

  css = css.replace(/\.bloco-narrativo\s*\{\s*margin:\s*0\s+0\s+-20px;\s*\}/g, ".bloco-narrativo {\n  margin: 0 0 14px;\n}");
  css = css.replace(/\.bloco-narrativo p\s*\{\s*margin:\s*0\s+0\s+8px;\s*\}/g, ".bloco-narrativo p {\n  margin: 0 0 8px;\n  white-space: normal;\n}");
  css = css.replace(/\n\.bloco-narrativo p\s*\{\s*white-space:\s*pre-line;\s*\}/g, "");

  escrever(arquivo, css);
}

// Módulos substituídos pela arquitetura consolidada.
remover("motor-fluxo-cena.js");
remover("confirmacao-combate.js");

// HTML vazio sem uso funcional.
if (fs.existsSync(caminho("ficha-personagem.html")) && ler("ficha-personagem.html").trim() === "") {
  remover("ficha-personagem.html");
}

console.log("Limpeza arquitetural básica aplicada.");
