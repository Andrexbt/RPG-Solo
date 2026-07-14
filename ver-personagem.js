const botaoImprimirFicha = document.getElementById("botaoImprimirFicha");
const botaoBaixarPdfEditavel = document.getElementById("botaoBaixarPdfEditavel");

const fichaArmasAtaques = document.getElementById("fichaArmasAtaques");
const fichaArmadura = document.getElementById("fichaArmadura");
const fichaArmaPrincipal = document.getElementById("fichaArmaPrincipal");
const fichaItemSecundario = document.getElementById("fichaItemSecundario");
const fichaProficiencias = document.getElementById("fichaProficiencias");
const fichaTalentos = document.getElementById("fichaTalentos");

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
  alinhamento: "Text100"
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

function preencherMagias(personagem) {
  const lista = document.getElementById("fichaMagias");

  if (lista === null) {
    return;
  }

  lista.innerHTML = "";

  const dadosMagiaClasse = window.bancoMagias.progressaoMagias[personagem.classeId];

  if (dadosMagiaClasse === undefined || dadosMagiaClasse.nivel1 === undefined) {
    return;
  }

  const item = document.createElement("li");
  item.textContent = "Magias a definir";
  lista.appendChild(item);
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
