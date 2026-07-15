const fs = require("fs");
const path = require("path");

const raizProjeto = path.join(__dirname, "..");
const arquivo = path.join(raizProjeto, "criacao-personagem.js");

function lerArquivo() {
  return fs.readFileSync(arquivo, "utf8");
}

function salvarArquivo(conteudo) {
  fs.writeFileSync(arquivo, conteudo, "utf8");
}

function blocoComentario(titulo, descricao) {
  const linhas = [
    "// =====================================================",
    "// " + titulo
  ];

  if (descricao !== undefined && descricao !== "") {
    linhas.push("// -----------------------------------------------------");
    linhas.push("// " + descricao);
  }

  linhas.push("// =====================================================");

  return linhas.join("\n");
}

function inserirAntesUmaVez(conteudo, marcador, comentario) {
  if (conteudo.includes(comentario)) {
    return conteudo;
  }

  if (conteudo.includes(marcador) === false) {
    console.warn("Marcador não encontrado:", marcador);
    return conteudo;
  }

  return conteudo.replace(marcador, comentario + "\n\n" + marcador);
}

function inserirDepoisUmaVez(conteudo, marcador, comentario) {
  if (conteudo.includes(comentario)) {
    return conteudo;
  }

  if (conteudo.includes(marcador) === false) {
    console.warn("Marcador não encontrado:", marcador);
    return conteudo;
  }

  return conteudo.replace(marcador, marcador + "\n\n" + comentario);
}

function organizarCriacaoPersonagemJs() {
  let conteudo = lerArquivo();

  conteudo = inserirAntesUmaVez(
    conteudo,
    "const cardsClasse",
    blocoComentario(
      "Arquivo: criacao-personagem.js",
      "Controla o fluxo de criação: seleção, validação, ficha lateral, revisão e salvamento."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "const ordemPassos",
    blocoComentario(
      "1. Controle de etapas",
      "Define a ordem dos passos e controla quais etapas já foram liberadas."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "const personagem = {",
    blocoComentario(
      "2. Estado central do personagem",
      "Objeto principal atualizado durante toda a criação."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function irParaPasso",
    blocoComentario(
      "3. Navegação entre passos",
      "Mostra, esconde e valida as etapas do criador."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function selecionarClasse",
    blocoComentario(
      "4. Seleção de classe",
      "Atualiza classe, proficiências, recursos, habilidades e ficha lateral."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function abrirModalClasse",
    blocoComentario(
      "5. Modal de classe",
      "Exibe explicações antes de confirmar a classe escolhida."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function selecionarAntecedente",
    blocoComentario(
      "6. Antecedente, talentos e perícias automáticas",
      "Aplica dados vindos do banco de antecedentes."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function selecionarEspecie",
    blocoComentario(
      "7. Espécie e idiomas fixos",
      "Aplica espécie, tamanho, velocidade e idiomas automáticos."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function rolarDado",
    blocoComentario(
      "8. Rolagem e distribuição de atributos",
      "Gera valores por dados e permite distribuir nos seis atributos."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function montarTelaPericiasClasse",
    blocoComentario(
      "9. Escolhas de perícias de classe",
      "Monta opções, impede duplicações com o antecedente e atualiza a ficha."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function montarTelaHabilidadesClasse",
    blocoComentario(
      "10. Habilidades e escolhas de classe",
      "Monta estilos de luta, maestrias, especializações e recursos."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function atualizarRecursosHabilidadesPersonagem",
    blocoComentario(
      "11. Recursos de habilidades",
      "Cria usos de habilidades como Segundo Fôlego quando aplicável."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function montarTelaMagias",
    blocoComentario(
      "12. Magias",
      "Prepara a área de magias quando a classe tiver escolhas mágicas."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function obterDadosIdioma",
    blocoComentario(
      "13. Idiomas",
      "Controla idiomas fixos e escolhas livres feitas nos detalhes."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function atualizarEquipamentosPersonagem",
    blocoComentario(
      "14. Equipamentos, armas e cálculos derivados",
      "Atualiza armadura, armas, CA, ataques, dano e proficiências."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function atualizarPontosDeVida",
    blocoComentario(
      "15. Pontos de vida, dados de vida e valores derivados",
      "Calcula PV, iniciativa, velocidade, tamanho e percepção passiva."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function montarRevisaoPersonagem",
    blocoComentario(
      "16. Revisão final",
      "Monta o resumo antes de salvar o personagem."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "function salvarPersonagemLocal",
    blocoComentario(
      "17. Salvamento local",
      "Salva o personagem no localStorage e gera o identificador da ficha."
    )
  );

  conteudo = inserirAntesUmaVez(
    conteudo,
    "cardsClasse.forEach",
    blocoComentario(
      "18. Eventos e inicialização da tela",
      "Liga os botões, cards, selects e inicia o primeiro estado visual."
    )
  );

  conteudo = inserirDepoisUmaVez(
    conteudo,
    "// =====================================================\n// Arquivo: criacao-personagem.js\n// -----------------------------------------------------\n// Controla o fluxo de criação: seleção, validação, ficha lateral, revisão e salvamento.\n// =====================================================",
    "// Atenção: neste arquivo a ordem das funções e dos eventos importa.\n// Por isso, a organização abaixo usa comentários sem mover blocos de código."
  );

  salvarArquivo(conteudo);
}

organizarCriacaoPersonagemJs();
console.log("criacao-personagem.js organizado com comentários.");
