// =====================================================
// Visualização de personagem salvo
// -----------------------------------------------------
// Este arquivo controla ver-personagem.html. Ele busca um
// personagem salvo no localStorage, preenche a ficha na tela
// e gera a versão PDF editável da ficha.
// =====================================================

// =====================================================
// 1. Elementos do HTML
// =====================================================

const botaoImprimirFicha = document.getElementById("botaoImprimirFicha");
const botaoBaixarPdfEditavel = document.getElementById("botaoBaixarPdfEditavel");

const fichaArmasAtaques = document.getElementById("fichaArmasAtaques");
const fichaArmadura = document.getElementById("fichaArmadura");
const fichaArmaPrincipal = document.getElementById("fichaArmaPrincipal");
const fichaItemSecundario = document.getElementById("fichaItemSecundario");
const fichaProficiencias = document.getElementById("fichaProficiencias");
const fichaTalentos = document.getElementById("fichaTalentos");

// =====================================================
// 2. Mapeamento dos campos da ficha PDF
// -----------------------------------------------------
// Estes nomes vêm do PDF editável. Se o PDF for trocado,
// estes identificadores podem precisar ser atualizados.
// =====================================================

const camposFichaPdf = {
  nome: "Text1",
  antecedente: "Text6",
  classe: "Text7",
  especie: "Text8",
  subclasse: "Text9",
  nivel: "Text11",
  xp: "Text12",

  classeArmadura: "Text13",
  pvAtual: "Text14",
  pvTemporario: "Text15",
  pvMaximo: "Text16",
  dadosVidaMaximos: "Text17",
  dadosVidaUsados: "Text18",

  bonusProficiencia: "Text19",

  inteligenciaMod: "Text20",
  forcaMod: "Text21",
  destrezaMod: "Text22",
  sabedoriaMod: "Text23",
  constituicaoMod: "Text24",
  carismaMod: "Text25",

  iniciativa: "Text26",
  velocidade: "Text27",
  tamanho: "Text28",
  percepcaoPassiva: "Text29",

  inteligenciaValor: "Text63",
  forcaValor: "Text64",
  sabedoriaValor: "Text65",
  destrezaValor: "Text66",
  constituicaoValor: "Text67",
  carismaValor: "Text68",

  equipamentosArmas: "Text59",
  equipamentosFerramentas: "Text60",

  caracteristicasClasse1: "Text54",
  caracteristicasClasse2: "Text55",
  tracosEspecie: "Text57",
  talentos: "Text58",

  aparencia: "Text96",
  historiaPersonalidade: "Text97",
  idiomas: "Text98",
  equipamento: "Text99",
  alinhamento: "Text100",

  magiaAtributoConjuracao: "Text111",
  magiaModificadorConjuracao: "Text93",
  magiaCdSalvamento: "Text94",
  magiaBonusAtaque: "Text95",

  magiaEspacosNivel1Total: "Text112",

  linhasMagias: [
    { nivel: "Text105.0", nome: "Text106.0", tempo: "Text107.0", alcance: "Text109.0", notas: "Text108" },
    { nivel: "Text105.1", nome: "Text106.1", tempo: "Text107.1", alcance: "Text109.1", notas: "Text208" },
    { nivel: "Text105.2", nome: "Text106.2", tempo: "Text107.2", alcance: "Text109.2", notas: "Text209" },
    { nivel: "Text105.3", nome: "Text106.3", tempo: "Text107.3", alcance: "Text109.3", notas: "Text210" },
    { nivel: "Text105.4", nome: "Text106.4", tempo: "Text107.4", alcance: "Text109.4", notas: "Text211" },
    { nivel: "Text105.5", nome: "Text106.5", tempo: "Text107.5", alcance: "Text109.5", notas: "Text212" },
    { nivel: "Text105.6", nome: "Text106.6", tempo: "Text107.6", alcance: "Text109.6", notas: "Text213" },
    { nivel: "Text105.7", nome: "Text106.7", tempo: "Text107.7", alcance: "Text109.7", notas: "Text214" },
    { nivel: "Text105.8", nome: "Text106.8", tempo: "Text107.8", alcance: "Text109.8", notas: "Text215" },
    { nivel: "Text105.9", nome: "Text106.9", tempo: "Text107.9", alcance: "Text109.9", notas: "Text216" },
    { nivel: "Text105.10", nome: "Text106.10", tempo: "Text107.10", alcance: "Text109.10", notas: "Text217" },
    { nivel: "Text105.11", nome: "Text106.11", tempo: "Text107.11", alcance: "Text109.11", notas: "Text218" },
    { nivel: "Text105.12", nome: "Text106.12", tempo: "Text107.12", alcance: "Text109.12", notas: "Text219" },
    { nivel: "Text105.13", nome: "Text106.13", tempo: "Text107.13", alcance: "Text109.13", notas: "Text220" },
    { nivel: "Text105.14", nome: "Text106.14", tempo: "Text107.14", alcance: "Text109.14", notas: "Text221" },
    { nivel: "Text105.15", nome: "Text106.15", tempo: "Text107.15", alcance: "Text109.15", notas: "Text222" },
    { nivel: "Text105.16", nome: "Text106.16", tempo: "Text107.16", alcance: "Text109.16", notas: "Text223" },
    { nivel: "Text105.17", nome: "Text106.17", tempo: "Text107.17", alcance: "Text109.17", notas: "Text224" },
    { nivel: "Text105.18", nome: "Text106.18", tempo: "Text107.18", alcance: "Text109.18", notas: "Text225" },
    { nivel: "Text105.19", nome: "Text106.19", tempo: "Text107.19", alcance: "Text109.19", notas: "Text227" },
    { nivel: "Text105.20", nome: "Text106.20", tempo: "Text107.20", alcance: "Text109.20", notas: "Text228" },
    { nivel: "Text105.21", nome: "Text106.21", tempo: "Text107.21", alcance: "Text109.21", notas: "Text229" },
    { nivel: "Text105.22", nome: "Text106.22", tempo: "Text107.22", alcance: "Text109.22", notas: "Text230" },
    { nivel: "Text105.23", nome: "Text106.23", tempo: "Text107.23", alcance: "Text109.23", notas: "Text244" },
    { nivel: "Text105.24", nome: "Text106.24", tempo: "Text107.24", alcance: "Text109.24", notas: "Text231" },
    { nivel: "Text105.25", nome: "Text106.25", tempo: "Text107.25", alcance: "Text109.25", notas: "Text232" },
    { nivel: "Text105.26", nome: "Text106.26", tempo: "Text107.26", alcance: "Text109.26", notas: "Text233" },
    { nivel: "Text105.27", nome: "Text106.27", tempo: "Text107.27", alcance: "Text109.27", notas: "Text234" },
    { nivel: "Text105.28", nome: "Text106.28", tempo: "Text107.28", alcance: "Text109.28", notas: "Text235" },
    { nivel: "Text105.29", nome: "Text106.29", tempo: "Text107.29", alcance: "Text109.29", notas: "Text236" }
  ],
};

window.camposFichaPdf = camposFichaPdf;

const linhasArmasPdf = [
  { nome: "Text30", ataque: "Text31", dano: "Text32", notas: "Text33" },
  { nome: "Text34", ataque: "Text35", dano: "Text36", notas: "Text37" },
  { nome: "Text38", ataque: "Text39", dano: "Text40", notas: "Text41" },
  { nome: "Text42", ataque: "Text43", dano: "Text44", notas: "Text45" },
  { nome: "Text46", ataque: "Text47", dano: "Text48", notas: "Text49" },
  { nome: "Text50", ataque: "Text51", dano: "Text52", notas: "Text53" }
];

const camposCheckboxPdf = {
  salvaguardas: {
    forca: "Check Box37",
    destreza: "Check Box33",
    constituicao: "Check Box32",
    inteligencia: "Check Box4",
    sabedoria: "Check Box21",
    carisma: "Check Box26"
  },

  pericias: {
    atletismo: "Check Box38",
    acrobacia: "Check Box34",
    prestidigitacao: "Check Box35",
    furtividade: "Check Box36",
    arcanismo: "Check Box16",
    historia: "Check Box17",
    investigacao: "Check Box19",
    natureza: "Check Box20",
    religiao: "Check Box18",
    adestrarAnimais: "Check Box22",
    intuicao: "Check Box23",
    medicina: "Check Box25",
    percepcao: "Check Box31",
    sobrevivencia: "Check Box24",
    enganacao: "Check Box27",
    intimidacao: "Check Box28",
    performance: "Check Box30",
    persuasao: "Check Box29"
  },

  treinoArmadura: {
    leve: "Check Box13",
    media: "Check Box14",
    pesada: "Check Box15",
    escudos: "Check Box12"
  }
};

// =====================================================
// 3. Busca do personagem pela URL
// =====================================================

const idPersonagem = pegarIdDaUrl();
const personagemEncontrado = buscarPersonagemPorId(idPersonagem);

function carregarPersonagensSalvos() {
  return JSON.parse(localStorage.getItem("personagensRpgSolo")) || [];
}

function pegarIdDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function buscarPersonagemPorId(idPersonagem) {
  const personagens = carregarPersonagensSalvos();

  return personagens.find(function(personagem) {
    return personagem.id === idPersonagem;
  });
}

// =====================================================
// 4. Preenchimento geral da ficha na tela
// =====================================================

function preencherFichaPersonagem(personagem) {
  preencherInformacoesBasicas(personagem);
  preencherAtributos(personagem);
  preencherCombate(personagem);
  preencherEquipamentos(personagem);
  preencherHabilidades(personagem);
  preencherArmasAtaques(personagem);
  preencherMagias(personagem);
  preencherTalentos(personagem);

  atualizarMarcadoresPericias(personagem);
  atualizarMarcadoresSalvaguardas(personagem);
}

function preencherInformacoesBasicas(personagem) {
  document.getElementById("fichaNome").textContent = personagem.detalhes.nome;
  document.getElementById("fichaClasseNivel").textContent = personagem.classe + " 1";
  document.getElementById("fichaAntecedente").textContent = personagem.antecedente;
  document.getElementById("fichaEspecie").textContent = personagem.especie;
  document.getElementById("fichaIdiomas").textContent = (personagem.idiomas || []).join(", ");
}

function preencherAtributos(personagem) {
  preencherUmAtributo("forca", "valfor", "modfor", personagem);
  preencherUmAtributo("destreza", "valdes", "moddes", personagem);
  preencherUmAtributo("constituicao", "valcon", "modcon", personagem);
  preencherUmAtributo("inteligencia", "valint", "modint", personagem);
  preencherUmAtributo("sabedoria", "valsab", "modsab", personagem);
  preencherUmAtributo("carisma", "valcar", "modcar", personagem);
}

function preencherUmAtributo(nomeAtributo, idValor, idModificador, personagem) {
  const valor = personagem.atributos[nomeAtributo];
  const campoValor = document.getElementById(idValor);
  const campoModificador = document.getElementById(idModificador);

  if (valor === undefined || valor === "") {
    campoValor.textContent = "";
    campoModificador.textContent = "";
    return;
  }

  campoValor.textContent = valor;
  campoModificador.textContent = formatarModificador(calcularModificador(valor));
}

// =====================================================
// 5. Combate, espécie e valores derivados
// =====================================================

function preencherCombate(personagem) {
  const pontosDeVida = personagem.detalhes.pontosDeVida || {};

  document.getElementById("fichaClasseArmadura").textContent =
    calcularClasseArmadura(personagem);

  document.getElementById("pvAtuais").textContent = pontosDeVida.atuais || "";
  document.getElementById("pvTemporarios").textContent = pontosDeVida.temporarios ?? "";
  document.getElementById("pvMaximo").textContent = pontosDeVida.maximo || "";
  document.getElementById("dadosVidaUsados").textContent = pontosDeVida.dadosVidaUsados ?? "";
  document.getElementById("dadosVidaMaximos").textContent = pontosDeVida.dadoVida || "";

  document.getElementById("fichaIniciativa").textContent = calcularIniciativa(personagem);
  document.getElementById("fichaVelocidade").textContent = obterVelocidade(personagem);
  document.getElementById("fichaTamanho").textContent = obterTamanho(personagem);
  document.getElementById("fichaPercepcaoPassiva").textContent = calcularPercepcaoPassiva(personagem);
}

function calcularIniciativa(personagem) {
  const destreza = personagem.atributos.destreza;

  if (destreza === undefined || destreza === "") {
    return "";
  }

  return formatarModificador(calcularModificador(destreza));
}

function obterDadosEspecie(personagem) {
  if (personagem.especieId === undefined || personagem.especieId === "") {
    return undefined;
  }

  return window.bancoEspecies.especies[personagem.especieId];
}

function obterVelocidade(personagem) {
  const dadosEspecie = obterDadosEspecie(personagem);

  if (dadosEspecie === undefined) {
    return "";
  }

  return dadosEspecie.velocidade;
}

function obterTamanho(personagem) {
  const dadosEspecie = obterDadosEspecie(personagem);

  if (dadosEspecie === undefined) {
    return "";
  }

  return dadosEspecie.tamanho;
}

// =====================================================
// 6. Equipamentos, armas e ataques na ficha
// =====================================================

function preencherEquipamentos(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return;
  }

  fichaArmadura.textContent = obterNomeArmadura(equipamentos.armadura);
  fichaArmaPrincipal.textContent = obterNomeArma(equipamentos.armaPrincipal);

  if (equipamentos.itemSecundario === "armaSecundaria") {
    fichaItemSecundario.textContent = obterNomeArma(equipamentos.armaSecundaria);
  } else {
    fichaItemSecundario.textContent = obterNomeItemSecundario(equipamentos.itemSecundario);
  }

  fichaProficiencias.textContent = obterTextoProficiencias(personagem);
}

function obterTextoProficiencias(personagem) {
  if (
    personagem.detalhes !== undefined &&
    personagem.detalhes.equipamentos !== undefined &&
    personagem.detalhes.equipamentos.proficiencias !== undefined
  ) {
    return personagem.detalhes.equipamentos.proficiencias.join(", ");
  }

  const dadosClasse = window.bancoClasses[personagem.classeId];

  if (dadosClasse === undefined || dadosClasse.proficiencias === undefined) {
    return "";
  }

  const proficiencias = [
    ...(dadosClasse.proficiencias.armaduras || []),
    ...(dadosClasse.proficiencias.armas || []),
    ...(dadosClasse.proficiencias.armasEspecificas || []).map(obterNomeArma),
    ...(dadosClasse.proficiencias.ferramentas || [])
  ];

  return proficiencias.join(", ");
}

function preencherArmasAtaques(personagem) {
  if (fichaArmasAtaques === null) {
    return;
  }

  fichaArmasAtaques.innerHTML = "";

  const armasParaMostrar = obterArmasDoPersonagem(personagem);

  if (armasParaMostrar.length === 0) {
    fichaArmasAtaques.textContent = "";
    return;
  }

  armasParaMostrar.forEach(function(idArma) {
    const resumo = obterResumoArma(personagem, idArma);

    if (resumo !== undefined) {
      fichaArmasAtaques.appendChild(criarLinhaAtaque(resumo));
    }
  });
}

function obterArmasDoPersonagem(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return [];
  }

  const armas = [];

  if (equipamentos.armaPrincipal !== undefined && equipamentos.armaPrincipal !== "") {
    armas.push(equipamentos.armaPrincipal);
  }

  if (
    equipamentos.itemSecundario === "armaSecundaria" &&
    equipamentos.armaSecundaria !== undefined &&
    equipamentos.armaSecundaria !== ""
  ) {
    armas.push(equipamentos.armaSecundaria);
  }

  return armas;
}

// =====================================================
// 6. Magias na ficha salva
// -----------------------------------------------------
// Mostra na tela Ver Personagem as magias escolhidas
// durante a criação do personagem.
// =====================================================

function obterDadosMagia(idMagia) {
  if (
    window.bancoMagias === undefined ||
    window.bancoMagias.magias === undefined
  ) {
    return undefined;
  }

  return window.bancoMagias.magias[idMagia];
}

function obterNomeMagia(idMagia) {
  const magia = obterDadosMagia(idMagia);

  if (magia === undefined) {
    return idMagia;
  }

  return magia.nome;
}

function obterNomeAtributoConjuracao(idAtributo) {
  const nomes = {
    forca: "Força",
    destreza: "Destreza",
    constituicao: "Constituição",
    inteligencia: "Inteligência",
    sabedoria: "Sabedoria",
    carisma: "Carisma"
  };

  return nomes[idAtributo] || idAtributo;
}

function criarItemTextoMagia(texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  return item;
}

function criarItemMagiaFicha(idMagia) {
  const magia = obterDadosMagia(idMagia);

  if (magia === undefined) {
    return criarItemTextoMagia(idMagia);
  }

  const item = document.createElement("li");

  const nome = document.createElement("strong");
  nome.textContent = magia.nome;

  const nivelTexto = magia.nivel === 0 ? "Truque" : magia.nivel + "º círculo";

  const detalhes = document.createElement("span");
  detalhes.textContent =
    " — " +
    nivelTexto +
    ", " +
    magia.escola +
    ", " +
    magia.tempoConjuracao +
    ", alcance: " +
    magia.alcance +
    ".";

  const descricao = document.createElement("p");
  descricao.classList.add("texto-explicativo");
  descricao.textContent = magia.descricaoCurta;

  item.appendChild(nome);
  item.appendChild(detalhes);
  item.appendChild(descricao);

  return item;
}

function preencherMagias(personagem) {
  const lista = document.getElementById("fichaMagias");

  if (lista === null) {
    return;
  }

  lista.innerHTML = "";

  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
    lista.appendChild(criarItemTextoMagia("Este personagem não possui magias."));
    return;
  }

  const magias = personagem.magias;
  const truques = magias.truquesConhecidos || [];
  const preparadas = magias.magiasPreparadas || [];

  const bonusAtaque = magias.bonusAtaqueMagico;
  const bonusAtaqueTexto =
    bonusAtaque === "" || bonusAtaque === undefined
      ? "-"
      : formatarModificador(bonusAtaque);

  lista.appendChild(
    criarItemTextoMagia(
      "Atributo de conjuração: " +
      obterNomeAtributoConjuracao(magias.atributoConjuracao)
    )
  );

  lista.appendChild(
    criarItemTextoMagia(
      "CD das magias: " + (magias.cdSalvamento || "-")
    )
  );

  lista.appendChild(
    criarItemTextoMagia(
      "Ataque mágico: " + bonusAtaqueTexto
    )
  );

  if (
    magias.espacosMagia !== undefined &&
    magias.espacosMagia.nivel1 !== undefined
  ) {
    lista.appendChild(
      criarItemTextoMagia(
        "Espaços de magia de 1º círculo: " +
        magias.espacosMagia.nivel1.usados +
        " / " +
        magias.espacosMagia.nivel1.maximos +
        " usados"
      )
    );
  }

  if (truques.length > 0) {
    const tituloTruques = criarItemTextoMagia("Truques:");
    tituloTruques.classList.add("titulo-lista-magias");
    lista.appendChild(tituloTruques);

    truques.forEach(function(idMagia) {
      lista.appendChild(criarItemMagiaFicha(idMagia));
    });
  }

  if (preparadas.length > 0) {
    const tituloPreparadas = criarItemTextoMagia("Magias preparadas:");
    tituloPreparadas.classList.add("titulo-lista-magias");
    lista.appendChild(tituloPreparadas);

    preparadas.forEach(function(idMagia) {
      lista.appendChild(criarItemMagiaFicha(idMagia));
    });
  }
}

function obterTextoMagiasParaPdf(personagem) {
  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
    return "";
  }

  const magias = personagem.magias;
  const linhas = [];

  const nomesAtributos = {
    forca: "Força",
    destreza: "Destreza",
    constituicao: "Constituição",
    inteligencia: "Inteligência",
    sabedoria: "Sabedoria",
    carisma: "Carisma"
  };

  const nomeAtributo =
    nomesAtributos[magias.atributoConjuracao] || magias.atributoConjuracao;

  const bonusAtaque = magias.bonusAtaqueMagico;
  const bonusAtaqueTexto =
    bonusAtaque === "" || bonusAtaque === undefined
      ? "-"
      : formatarModificador(bonusAtaque);

  linhas.push("Conjuração");
  linhas.push("Atributo: " + nomeAtributo);
  linhas.push("CD das magias: " + (magias.cdSalvamento || "-"));
  linhas.push("Ataque mágico: " + bonusAtaqueTexto);

  if (
    magias.espacosMagia !== undefined &&
    magias.espacosMagia.nivel1 !== undefined
  ) {
    linhas.push(
      "Espaços de 1º círculo: " +
      magias.espacosMagia.nivel1.maximos
    );
  }

  const truques = magias.truquesConhecidos || [];
  const preparadas = magias.magiasPreparadas || [];

  if (truques.length > 0) {
    linhas.push(
      "Truques: " +
      truques.map(obterNomeMagia).join(", ")
    );
  }

  if (preparadas.length > 0) {
    linhas.push(
      "Magias preparadas: " +
      preparadas.map(obterNomeMagia).join(", ")
    );
  }

  return linhas.join("\n");
}

function definirTextoCampoPdf(formulario, nomeCampo, texto) {
  if (nomeCampo === undefined || nomeCampo === "") {
    return;
  }

  try {
    const campo = formulario.getTextField(nomeCampo);
    campo.setText(String(texto));
  } catch (erro) {
    console.warn("Campo de texto não encontrado no PDF:", nomeCampo);
  }
}

function obterTextoNotasMagiaPdf(magia, personagem) {
  const partes = [];

  if (Array.isArray(magia.componentes)) {
    partes.push("Componentes: " + magia.componentes.join(", "));
  }

  if (magia.duracao !== undefined && magia.duracao !== "") {
    partes.push("Duração: " + magia.duracao);
  }

  if (magia.exigeAtaqueMagico === true) {
    partes.push("Ataque mágico");
  }

  if (magia.exigeSalvaguarda === true) {
    partes.push(
      "Salv. " +
      obterNomeAtributoConjuracao(magia.salvaguarda) +
      " CD " +
      personagem.magias.cdSalvamento
    );
  }

  return partes.join(" | ");
}

function obterListaMagiasParaPdf(personagem) {
  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
    return [];
  }

  const truques = personagem.magias.truquesConhecidos || [];
  const preparadas = personagem.magias.magiasPreparadas || [];

  return [...truques, ...preparadas];
}

function preencherMagiasNoPdf(formulario, personagem) {
  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
    return;
  }

  const magias = personagem.magias;

  definirTextoCampoPdf(
    formulario,
    camposFichaPdf.magiaAtributoConjuracao,
    obterNomeAtributoConjuracao(magias.atributoConjuracao)
  );

  const valorAtributo = personagem.atributos[magias.atributoConjuracao];

  if (valorAtributo !== undefined && valorAtributo !== "") {
    definirTextoCampoPdf(
      formulario,
      camposFichaPdf.magiaModificadorConjuracao,
      formatarModificador(calcularModificador(valorAtributo))
    );
  }

  definirTextoCampoPdf(
    formulario,
    camposFichaPdf.magiaCdSalvamento,
    magias.cdSalvamento || "-"
  );

  definirTextoCampoPdf(
    formulario,
    camposFichaPdf.magiaBonusAtaque,
    magias.bonusAtaqueMagico === "" || magias.bonusAtaqueMagico === undefined
      ? "-"
      : formatarModificador(magias.bonusAtaqueMagico)
  );

  if (
    magias.espacosMagia !== undefined &&
    magias.espacosMagia.nivel1 !== undefined
  ) {
    definirTextoCampoPdf(
      formulario,
      camposFichaPdf.magiaEspacosNivel1Total,
      magias.espacosMagia.nivel1.maximos
    );
  }

  const idsMagias = obterListaMagiasParaPdf(personagem);

  idsMagias.forEach(function(idMagia, indice) {
    const linha = camposFichaPdf.linhasMagias[indice];

    if (linha === undefined) {
      return;
    }

    const magia = obterDadosMagia(idMagia);

    if (magia === undefined) {
      return;
    }

    definirTextoCampoPdf(
      formulario,
      linha.nivel,
      magia.nivel === 0 ? "0" : magia.nivel
    );

    definirTextoCampoPdf(formulario, linha.nome, magia.nome);
    definirTextoCampoPdf(formulario, linha.tempo, magia.tempoConjuracao);
    definirTextoCampoPdf(formulario, linha.alcance, magia.alcance);

    definirTextoCampoPdf(
      formulario,
      linha.notas,
      obterTextoNotasMagiaPdf(magia, personagem)
    );
  });
}

// =====================================================
// 7. Talentos
// =====================================================

function obterDadosTalento(idTalento) {
  if (window.bancoTalentos === undefined) {
    return undefined;
  }

  return window.bancoTalentos[idTalento];
}

function obterNomeTalento(idTalento) {
  const talento = obterDadosTalento(idTalento);

  if (talento === undefined) {
    return idTalento;
  }

  return talento.nome;
}

function preencherTalentos(personagem) {
  if (fichaTalentos === null) {
    return;
  }

  fichaTalentos.innerHTML = "";

  if (personagem.talentos === undefined || personagem.talentos.length === 0) {
    return;
  }

  personagem.talentos.forEach(function(idTalento) {
    const item = criarItemTalentoFicha(idTalento);

    if (item !== undefined) {
      fichaTalentos.appendChild(item);
    }
  });
}

function criarItemTalentoFicha(idTalento) {
  const talento = obterDadosTalento(idTalento);

  if (talento === undefined) {
    return undefined;
  }

  const item = document.createElement("li");
  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("botao-habilidade-ficha");

  const nome = document.createElement("span");
  nome.classList.add("nome-habilidade-ficha");
  nome.textContent = talento.nome;

  botao.appendChild(nome);

  botao.addEventListener("click", function(evento) {
    evento.stopPropagation();

    if (typeof window.abrirPopoverDetalhe === "function") {
      window.abrirPopoverDetalhe("talento", idTalento, botao);
    }
  });

  item.appendChild(botao);
  return item;
}

function obterTextoTalentosParaPdf(personagem) {
  if (personagem.talentos === undefined || personagem.talentos.length === 0) {
    return "";
  }

  const nomesTalentos = personagem.talentos.map(function(idTalento) {
    return obterNomeTalento(idTalento);
  });

  return nomesTalentos.join("\n");
}

// =====================================================
// 8. Marcadores visuais de proficiência
// =====================================================

function atualizarMarcadoresPericias(personagem) {
  const linhasPericia = document.querySelectorAll("[data-pericia]");

  linhasPericia.forEach(function(linha) {
    const idPericia = linha.dataset.pericia;

    linha.classList.remove("proficiente");
    linha.classList.remove("especializada");

    if (personagemTemProficienciaEmPericia(personagem, idPericia)) {
      linha.classList.add("proficiente");
    }

    if (personagemTemEspecializacaoEmPericia(personagem, idPericia)) {
      linha.classList.add("especializada");
    }
  });
}

function atualizarMarcadoresSalvaguardas(personagem) {
  const linhasSalvaguarda = document.querySelectorAll("[data-salvaguarda]");

  linhasSalvaguarda.forEach(function(linha) {
    linha.classList.remove("proficiente");
  });

  const dadosClasse = window.bancoClasses[personagem.classeId];

  if (dadosClasse === undefined || dadosClasse.salvaguardas === undefined) {
    return;
  }

  linhasSalvaguarda.forEach(function(linha) {
    const idSalvaguarda = linha.dataset.salvaguarda;

    if (dadosClasse.salvaguardas.includes(idSalvaguarda)) {
      linha.classList.add("proficiente");
    }
  });
}

// =====================================================
// 9. Funções auxiliares para o PDF
// =====================================================

function preencherCampoTexto(formulario, nomeCampo, valor) {
  if (nomeCampo === undefined || nomeCampo === "") {
    return;
  }

  const texto = valor === undefined || valor === null ? "" : String(valor);

  try {
    formulario.getTextField(nomeCampo).setText(texto);
  } catch (erro) {
    console.warn("Campo não encontrado no PDF:", nomeCampo);
  }
}

function obterModificadorFormatado(personagem, idAtributo) {
  const valor = personagem.atributos[idAtributo];

  if (valor === undefined || valor === "") {
    return "";
  }

  return formatarModificador(calcularModificador(valor));
}

function obterTextoEquipamento(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return "";
  }

  const linhas = [];
  linhas.push("Armadura: " + obterNomeArmadura(equipamentos.armadura));
  linhas.push("Arma principal: " + obterNomeArma(equipamentos.armaPrincipal));

  if (equipamentos.itemSecundario === "armaSecundaria") {
    linhas.push("Arma secundária: " + obterNomeArma(equipamentos.armaSecundaria));
  } else {
    linhas.push("Item secundário: " + obterNomeItemSecundario(equipamentos.itemSecundario));
  }

  return linhas.join("\n");
}

function marcarCheckboxPdf(formulario, nomeCampo) {
  if (nomeCampo === undefined || nomeCampo === "") {
    return;
  }

  try {
    formulario.getCheckBox(nomeCampo).check();
  } catch (erro) {
    console.warn("Checkbox não encontrado no PDF:", nomeCampo);
  }
}

function marcarCheckboxesPersonagemPdf(formulario, personagem) {
  const dadosClasse = window.bancoClasses[personagem.classeId];

  if (dadosClasse !== undefined && dadosClasse.salvaguardas !== undefined) {
    dadosClasse.salvaguardas.forEach(function(idSalvaguarda) {
      marcarCheckboxPdf(formulario, camposCheckboxPdf.salvaguardas[idSalvaguarda]);
    });
  }

  if (personagem.pericias !== undefined) {
    personagem.pericias.forEach(function(idPericia) {
      marcarCheckboxPdf(formulario, camposCheckboxPdf.pericias[idPericia]);
    });
  }

  if (
    dadosClasse !== undefined &&
    dadosClasse.proficiencias !== undefined &&
    dadosClasse.proficiencias.armaduras !== undefined
  ) {
    const armaduras = dadosClasse.proficiencias.armaduras;

    if (armaduras.includes("Armaduras leves")) {
      marcarCheckboxPdf(formulario, camposCheckboxPdf.treinoArmadura.leve);
    }

    if (armaduras.includes("Armaduras médias")) {
      marcarCheckboxPdf(formulario, camposCheckboxPdf.treinoArmadura.media);
    }

    if (armaduras.includes("Armaduras pesadas")) {
      marcarCheckboxPdf(formulario, camposCheckboxPdf.treinoArmadura.pesada);
    }

    if (armaduras.includes("Escudos")) {
      marcarCheckboxPdf(formulario, camposCheckboxPdf.treinoArmadura.escudos);
    }
  }
}

function preencherArmasPdf(formulario, personagem) {
  const armas = obterArmasDoPersonagem(personagem);

  armas.forEach(function(idArma, indice) {
    const linhaPdf = linhasArmasPdf[indice];

    if (linhaPdf === undefined) {
      return;
    }

    const resumo = obterResumoArma(personagem, idArma);

    if (resumo === undefined) {
      return;
    }

    const notas = [];

    if (resumo.maestria !== undefined && resumo.maestria !== "") {
      notas.push("Maestria: " + resumo.maestria);
    }

    if (resumo.ataqueFurtivo !== undefined && resumo.ataqueFurtivo !== "") {
      notas.push(resumo.ataqueFurtivo);
    }

    preencherCampoTexto(formulario, linhaPdf.nome, resumo.nome);
    preencherCampoTexto(formulario, linhaPdf.ataque, resumo.ataque);
    preencherCampoTexto(formulario, linhaPdf.dano, resumo.dano);
    preencherCampoTexto(formulario, linhaPdf.notas, notas.join("\n"));
  });
}

// =====================================================
// 10. Geração do PDF editável
// =====================================================

async function baixarPdfFichaEditavel(personagem) {
  const resposta = await fetch("pdfs/ficha-dnd-editavel.pdf");

  if (resposta.ok === false) {
    console.error("PDF não encontrado. Status:", resposta.status);
    return;
  }

  const bytesPdf = await resposta.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(bytesPdf);
  const formulario = pdfDoc.getForm();
  const pontosDeVida = personagem.detalhes.pontosDeVida || {};

  preencherCampoTexto(formulario, camposFichaPdf.nome, personagem.detalhes.nome);
  preencherCampoTexto(formulario, camposFichaPdf.classe, personagem.classe);
  preencherCampoTexto(formulario, camposFichaPdf.nivel, "1");
  preencherCampoTexto(formulario, camposFichaPdf.antecedente, personagem.antecedente);
  preencherCampoTexto(formulario, camposFichaPdf.especie, personagem.especie);
  preencherCampoTexto(formulario, camposFichaPdf.subclasse, "");
  preencherCampoTexto(formulario, camposFichaPdf.xp, "0");

  preencherCampoTexto(formulario, camposFichaPdf.forcaValor, personagem.atributos.forca);
  preencherCampoTexto(formulario, camposFichaPdf.destrezaValor, personagem.atributos.destreza);
  preencherCampoTexto(formulario, camposFichaPdf.constituicaoValor, personagem.atributos.constituicao);
  preencherCampoTexto(formulario, camposFichaPdf.inteligenciaValor, personagem.atributos.inteligencia);
  preencherCampoTexto(formulario, camposFichaPdf.sabedoriaValor, personagem.atributos.sabedoria);
  preencherCampoTexto(formulario, camposFichaPdf.carismaValor, personagem.atributos.carisma);

  preencherCampoTexto(formulario, camposFichaPdf.forcaMod, obterModificadorFormatado(personagem, "forca"));
  preencherCampoTexto(formulario, camposFichaPdf.destrezaMod, obterModificadorFormatado(personagem, "destreza"));
  preencherCampoTexto(formulario, camposFichaPdf.constituicaoMod, obterModificadorFormatado(personagem, "constituicao"));
  preencherCampoTexto(formulario, camposFichaPdf.inteligenciaMod, obterModificadorFormatado(personagem, "inteligencia"));
  preencherCampoTexto(formulario, camposFichaPdf.sabedoriaMod, obterModificadorFormatado(personagem, "sabedoria"));
  preencherCampoTexto(formulario, camposFichaPdf.carismaMod, obterModificadorFormatado(personagem, "carisma"));

  preencherCampoTexto(formulario, camposFichaPdf.classeArmadura, calcularClasseArmadura(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.pvAtual, pontosDeVida.atuais);
  preencherCampoTexto(formulario, camposFichaPdf.pvTemporario, pontosDeVida.temporarios);
  preencherCampoTexto(formulario, camposFichaPdf.pvMaximo, pontosDeVida.maximo);
  preencherCampoTexto(formulario, camposFichaPdf.dadosVidaMaximos, pontosDeVida.dadoVida);
  preencherCampoTexto(formulario, camposFichaPdf.dadosVidaUsados, pontosDeVida.dadosVidaUsados);

  preencherCampoTexto(formulario, camposFichaPdf.bonusProficiencia, "+2");
  preencherCampoTexto(formulario, camposFichaPdf.iniciativa, calcularIniciativa(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.velocidade, obterVelocidade(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.tamanho, obterTamanho(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.percepcaoPassiva, calcularPercepcaoPassiva(personagem));

  preencherCampoTexto(formulario, camposFichaPdf.idiomas, (personagem.idiomas || []).join(", "));
  preencherCampoTexto(formulario, camposFichaPdf.equipamento, obterTextoEquipamento(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.equipamentosArmas, obterTextoEquipamento(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.equipamentosFerramentas, obterTextoProficiencias(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.caracteristicasClasse1, obterTextoHabilidadesParaPdf(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.talentos, obterTextoTalentosParaPdf(personagem));

  adicionarTextoAoCampoPdf(
    formulario,
    camposFichaPdf.caracteristicasClasse2,
    obterTextoEspecializacoesParaPdf(personagem)
  );

  preencherMagiasNoPdf(formulario, personagem);

  preencherCampoTexto(formulario, camposFichaPdf.aparencia, personagem.detalhes.aparencia || "");
  preencherCampoTexto(
    formulario,
    camposFichaPdf.historiaPersonalidade,
    personagem.detalhes.historia || personagem.detalhes.personalidade || ""
  );
  preencherCampoTexto(formulario, camposFichaPdf.alinhamento, personagem.detalhes.alinhamento || "");

  preencherArmasPdf(formulario, personagem);
  marcarCheckboxesPersonagemPdf(formulario, personagem);
  formulario.updateFieldAppearances();

  const pdfFinal = await pdfDoc.save();
  const blob = new Blob([pdfFinal], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const nomePersonagem = personagem.detalhes.nome || "personagem";

  const link = document.createElement("a");
  link.href = url;
  link.download = "ficha-" + nomePersonagem.toLowerCase().replaceAll(" ", "-") + ".pdf";
  link.click();

  URL.revokeObjectURL(url);
}

// =====================================================
// 11. Eventos e inicialização da página
// =====================================================

if (botaoImprimirFicha !== null) {
  botaoImprimirFicha.addEventListener("click", function() {
    window.print();
  });
}

if (botaoBaixarPdfEditavel !== null) {
  botaoBaixarPdfEditavel.addEventListener("click", function() {
    if (personagemEncontrado === undefined) {
      alert("Personagem não encontrado. Não foi possível gerar o PDF.");
      return;
    }

    baixarPdfFichaEditavel(personagemEncontrado).catch(function(erro) {
      console.error("Erro ao baixar PDF editável:", erro);
    });
  });
}

if (personagemEncontrado === undefined) {
  alert("Personagem não encontrado.");
} else {
  preencherFichaPersonagem(personagemEncontrado);
}
