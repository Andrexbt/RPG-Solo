const fs = require("fs");
const path = require("path");

const raizProjeto = path.join(__dirname, "..");

function caminhoArquivo(nomeArquivo) {
  return path.join(raizProjeto, nomeArquivo);
}

function lerArquivo(nomeArquivo) {
  return fs.readFileSync(caminhoArquivo(nomeArquivo), "utf8");
}

function salvarArquivo(nomeArquivo, conteudo) {
  fs.writeFileSync(caminhoArquivo(nomeArquivo), conteudo, "utf8");
}

function inserirAntesUmaVez(conteudo, marcador, comentario) {
  if (conteudo.includes(comentario.trim())) {
    return conteudo;
  }

  if (conteudo.includes(marcador) === false) {
    console.warn("Marcador não encontrado:", marcador);
    return conteudo;
  }

  return conteudo.replace(marcador, comentario + "\n" + marcador);
}

function inserirDepoisUmaVez(conteudo, marcador, comentario) {
  if (conteudo.includes(comentario.trim())) {
    return conteudo;
  }

  if (conteudo.includes(marcador) === false) {
    console.warn("Marcador não encontrado:", marcador);
    return conteudo;
  }

  return conteudo.replace(marcador, marcador + "\n\n" + comentario);
}

function comentarioHtml(titulo, descricao) {
  return [
    "  <!-- =====================================================",
    "       " + titulo,
    descricao === undefined ? "       ===================================================== -->" : "       -----------------------------------------------------",
    descricao === undefined ? "" : "       " + descricao,
    descricao === undefined ? "" : "       ===================================================== -->"
  ].filter(Boolean).join("\n");
}

function comentarioCss(titulo, descricao) {
  return [
    "/* =====================================================",
    "   " + titulo,
    descricao === undefined ? "   ===================================================== */" : "   -----------------------------------------------------",
    descricao === undefined ? "" : "   " + descricao,
    descricao === undefined ? "" : "   ===================================================== */"
  ].filter(Boolean).join("\n");
}

function organizarHtmlCriacao() {
  const arquivo = "criacao-personagem.html";
  let conteudo = lerArquivo(arquivo);

  conteudo = inserirDepoisUmaVez(
    conteudo,
    "<!DOCTYPE html>",
    "<!-- =====================================================\n     Arquivo: criacao-personagem.html\n     -----------------------------------------------------\n     Estrutura visual da criação de personagem. A lógica fica\n     em criacao-personagem.js e nos arquivos compartilhados.\n     ===================================================== -->"
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<main class=\"criador-personagem\">",
    comentarioHtml("Layout principal", "Divide a tela entre ficha lateral e passos de criação.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"coluna-ficha\">",
    comentarioHtml("Ficha lateral", "Mostra o resumo do personagem enquanto ele é criado.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"area-passo\">",
    comentarioHtml("Área dos passos", "Cada seção abaixo representa uma etapa da criação.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo\" id=\"passo-classe\">",
    comentarioHtml("Passo: classe")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-atributos\">",
    comentarioHtml("Passo: atributos")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-antecedente\">",
    comentarioHtml("Passo: antecedente")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-especie\">",
    comentarioHtml("Passo: espécie")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-habilidades\">",
    comentarioHtml("Passo: habilidades, perícias e maestrias")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-magias\">",
    comentarioHtml("Passo: magias")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-detalhes\">",
    comentarioHtml("Passo: detalhes finais", "Nome, idiomas, equipamentos e valores derivados.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<section class=\"conteudo-passo escondida\" id=\"passo-revisao\">",
    comentarioHtml("Passo: revisão e salvamento")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<nav class=\"navegacao-passos\">",
    comentarioHtml("Navegação entre passos")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<div class=\"modal-overlay escondida\" id=\"modalClasse\">",
    comentarioHtml("Modal de classe", "Mostra detalhes da classe antes da confirmação.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<div id=\"modalDetalheFicha\" class=\"modal-detalhe-ficha escondida\">",
    comentarioHtml("Modal de detalhes da ficha", "Usada para habilidades, talentos, maestrias e propriedades.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "<script src=\"banco-pericias.js\"></script>",
    comentarioHtml("Scripts", "Bancos primeiro, arquivos compartilhados depois, script principal por último.")
  );

  salvarArquivo(arquivo, conteudo);
  console.log("Organizado:", arquivo);
}

function organizarCssCriacao() {
  const arquivo = "criacao-personagem.css";
  let conteudo = lerArquivo(arquivo);

  conteudo = inserirAntesUmaVez(
    conteudo,
    "body {",
    comentarioCss("Arquivo: criacao-personagem.css", "Estilos da tela de criação de personagem e da ficha lateral.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".grade-classes {",
    comentarioCss("Cards de classe")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".modal-overlay {",
    comentarioCss("Modal de escolha de classe")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".criador-personagem {",
    comentarioCss("Layout principal da criação")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".ficha {",
    comentarioCss("Ficha lateral")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".grade-atributos-ficha {",
    comentarioCss("Atributos, perícias e salvaguardas")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".navegacao-passos {",
    comentarioCss("Navegação entre etapas")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".grade-opcoes {",
    comentarioCss("Cards de escolhas gerais", "Antecedentes, espécies e opções geradas dinamicamente.")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".caixa-rolagem-dados {",
    comentarioCss("Rolagem de atributos")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".bloco-revisao {",
    comentarioCss("Tela de revisão")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".modal-detalhe-ficha {",
    comentarioCss("Modal e popover de detalhes da ficha")
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    ".linha-pericia.especializada::after {",
    comentarioCss("Marcadores especiais", "Exibe a estrela de especialização do Ladino.")
  );

  salvarArquivo(arquivo, conteudo);
  console.log("Organizado:", arquivo);
}

organizarHtmlCriacao();
organizarCssCriacao();

console.log("Organização concluída. Teste a criação de personagem antes de fazer commit.");
