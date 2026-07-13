const botaoImprimirFicha = document.getElementById("botaoImprimirFicha");
const idPersonagem = pegarIdDaUrl();
const personagemEncontrado = buscarPersonagemPorId(idPersonagem);
const botaoBaixarPdfEditavel = document.getElementById("botaoBaixarPdfEditavel");

console.log("Botão PDF:", botaoBaixarPdfEditavel);
console.log("PDFLib:", window.PDFLib);

const fichaArmasAtaques = document.getElementById("fichaArmasAtaques");
const fichaArmadura = document.getElementById("fichaArmadura");
const fichaArmaPrincipal = document.getElementById("fichaArmaPrincipal");
const fichaItemSecundario = document.getElementById("fichaItemSecundario");
const fichaProficiencias = document.getElementById("fichaProficiencias");

const modalDetalheFicha = document.getElementById("modalDetalheFicha");
const botaoFecharModalDetalheFicha = document.getElementById("botaoFecharModalDetalheFicha");
const modalDetalheTitulo = document.getElementById("modalDetalheTitulo");
const modalDetalheDescricao = document.getElementById("modalDetalheDescricao");
const modalDetalheMecanica = document.getElementById("modalDetalheMecanica");

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

  arma1Nome: "Text30",
  arma1Ataque: "Text31",
  arma1Dano: "Text32",
  arma1Notas: "Text33"
};

const linhasArmasPdf = [
  {
    nome: "Text30",
    ataque: "Text31",
    dano: "Text32",
    notas: "Text33"
  },
  {
    nome: "Text34",
    ataque: "Text35",
    dano: "Text36",
    notas: "Text37"
  },
  {
    nome: "Text38",
    ataque: "Text39",
    dano: "Text40",
    notas: "Text41"
  },
  {
    nome: "Text42",
    ataque: "Text43",
    dano: "Text44",
    notas: "Text45"
  },
  {
    nome: "Text46",
    ataque: "Text47",
    dano: "Text48",
    notas: "Text49"
  },
  {
    nome: "Text50",
    ataque: "Text51",
    dano: "Text52",
    notas: "Text53"
  }
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

const fichaTalentos = document.getElementById("fichaTalentos");

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
  document.getElementById("fichaIdiomas").textContent = personagem.idiomas.join(", ");
}

function preencherAtributos(personagem) {
  preencherUmAtributo("forca", "valfor", "modfor", personagem);
  preencherUmAtributo("destreza", "valdes", "moddes", personagem);
  preencherUmAtributo("constituicao", "valcon", "modcon", personagem);
  preencherUmAtributo("inteligencia", "valint", "modint", personagem);
  preencherUmAtributo("sabedoria", "valsab", "modsab", personagem);
  preencherUmAtributo("carisma", "valcar", "modcar", personagem);
}

function preencherCombate(personagem) {
  const pontosDeVida = personagem.detalhes.pontosDeVida || {};

  document.getElementById("fichaClasseArmadura").textContent =
    calcularClasseArmadura(personagem);

  document.getElementById("pvAtuais").textContent = pontosDeVida.atuais || "";
  document.getElementById("pvTemporarios").textContent = pontosDeVida.temporarios ?? "";
  document.getElementById("pvMaximo").textContent = pontosDeVida.maximo || "";

  document.getElementById("dadosVidaUsados").textContent =
    pontosDeVida.dadosVidaUsados ?? "";

  document.getElementById("dadosVidaMaximos").textContent =
    pontosDeVida.dadoVida || "";

  document.getElementById("fichaIniciativa").textContent =
    calcularIniciativa(personagem);

  document.getElementById("fichaVelocidade").textContent =
    obterVelocidade(personagem);

  document.getElementById("fichaTamanho").textContent =
    obterTamanho(personagem);

  document.getElementById("fichaPercepcaoPassiva").textContent =
    calcularPercepcaoPassiva(personagem);
}

function calcularIniciativa(personagem) {
  const destreza = personagem.atributos.destreza;

  if (destreza === undefined || destreza === "") {
    return "";
  }

  return formatarModificador(calcularModificador(destreza));
}

function calcularPercepcaoPassiva(personagem) {
  const valorPercepcao = calcularValorPericia(personagem, "percepcao");

  if (valorPercepcao === "") {
    return "";
  }

  return 10 + valorPercepcao;
}

function calcularClasseArmadura(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return "-";
  }

  const idArmadura = equipamentos.armadura;
  const idItemSecundario = equipamentos.itemSecundario;

  const armadura = window.bancoEquipamentos.armaduras[idArmadura];
  const itemSecundario = window.bancoEquipamentos.itensSecundarios[idItemSecundario];

  if (armadura === undefined) {
    return "-";
  }

  let classeArmadura = armadura.caBase;

  const destreza = personagem.atributos.destreza;

  if (armadura.usaDestreza === true && destreza !== undefined && destreza !== "") {
    const modificadorDestreza = calcularModificador(destreza);

    if (armadura.limiteDestreza === null) {
      classeArmadura += modificadorDestreza;
    } else {
      classeArmadura += Math.min(modificadorDestreza, armadura.limiteDestreza);
    }
  }

  if (itemSecundario !== undefined && itemSecundario.bonusCA !== undefined) {
    classeArmadura += itemSecundario.bonusCA;
  }

  if (
    personagemTemEstiloDeLuta(personagem, "defesa") &&
    idArmadura !== "semArmadura"
  ) {
    classeArmadura += 1;
  }

  return classeArmadura;
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

  if (equipamentos.proficiencias !== undefined) {
    fichaProficiencias.textContent = equipamentos.proficiencias.join(", ");
    return;
  }

  const dadosClasse = window.bancoClasses[personagem.classeId];

  if (dadosClasse !== undefined && dadosClasse.proficiencias !== undefined) {
    const proficiencias = [
      ...(dadosClasse.proficiencias.armaduras || []),
      ...(dadosClasse.proficiencias.armas || [])
    ];

    fichaProficiencias.textContent = proficiencias.join(", ");
  }
}

function obterNomeArmadura(idArmadura) {
  const armadura = window.bancoEquipamentos.armaduras[idArmadura];

  if (armadura === undefined) {
    return "";
  }

  return armadura.nome;
}

function obterNomeArma(idArma) {
  const arma = window.bancoEquipamentos.armas[idArma];

  if (arma === undefined) {
    return "";
  }

  if (typeof arma === "string") {
    return arma;
  }

  return arma.nome;
}

function obterNomeItemSecundario(idItem) {
  const item = window.bancoEquipamentos.itensSecundarios[idItem];

  if (item === undefined) {
    return "";
  }

  return item.nome;
}

function preencherHabilidades(personagem) {
  const lista = document.getElementById("fichaHabilidades");
  lista.innerHTML = "";

  const dadosDaClasse =
    window.bancoHabilidades.progressaoClasses[personagem.classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    return;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  const habilidadesAutomaticas =
  dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

  habilidadesAutomaticas.forEach(function(idHabilidade) {
  if (idHabilidade === "maestriaComArmas") {
    return;
  }

  const item = criarItemHabilidadeAutomaticaFicha(personagem, idHabilidade);

  if (item !== undefined) {
    lista.appendChild(item);
  }
 });

  dadosNivel1.escolhas.forEach(function(escolha) {
    const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
    const valorEscolhido = personagem.habilidades.escolhas[escolha.grupo];

    if (grupo === undefined || valorEscolhido === undefined) {
      return;
    }

    const opcoes = obterOpcoesDoGrupoEscolha(grupo);

    if (Array.isArray(valorEscolhido)) {
      const nomesEscolhidos = [];

      valorEscolhido.forEach(function(idEscolhido) {
        const opcaoEscolhida = opcoes.find(function(opcao) {
          return opcao.id === idEscolhido;
        });

        if (opcaoEscolhida !== undefined) {
          nomesEscolhidos.push(opcaoEscolhida.nome);
        }
      });

      if (nomesEscolhidos.length > 0) {
        const item = criarItemHabilidadeComEscolha(
       grupo.nome,
       nomesEscolhidos.join(", ")
      );

fichaHabilidades.appendChild(item);
      }

      return;
    }

    const opcaoEscolhida = opcoes.find(function(opcao) {
      return opcao.id === valorEscolhido;
    });

    if (opcaoEscolhida !== undefined) {
      const item = criarItemHabilidadeComEscolha(
  grupo.nome,
  opcaoEscolhida.nome
);

fichaHabilidades.appendChild(item);
    }
  });
}

function preencherMagias(personagem) {
  const lista = document.getElementById("fichaMagias");
  lista.innerHTML = "";

  const dadosMagiaClasse =
    window.bancoMagias.progressaoMagias[personagem.classeId];

  if (dadosMagiaClasse === undefined || dadosMagiaClasse.nivel1 === undefined) {
    return;
  }

  const item = document.createElement("li");
  item.textContent = "Magias a definir";
  lista.appendChild(item);
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

  const modificador = calcularModificador(valor);

  campoValor.textContent = valor;
  campoModificador.textContent = formatarModificador(modificador);
}

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

function calcularModificador(valor) {
  return Math.floor((valor - 10) / 2);
}

function formatarModificador(modificador) {
  if (modificador >= 0) {
    return "+" + modificador;
  }

  return String(modificador);
}

if (botaoImprimirFicha !== null) {
  botaoImprimirFicha.addEventListener("click", function() {
    window.print();
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

function obterTextoHabilidades(personagem) {
  const linhas = [];

  const dadosDaClasse =
    window.bancoHabilidades.progressaoClasses[personagem.classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    return "";
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  const habilidadesAutomaticas =
  dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

habilidadesAutomaticas.forEach(function(idHabilidade) {
    const habilidade = obterDadosHabilidade(idHabilidade);

    if (habilidade !== undefined) {
      linhas.push(habilidade.nome);
    }
  });

  dadosNivel1.escolhas.forEach(function(escolha) {
    const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
    const idOpcaoEscolhida = personagem.habilidades.escolhas[escolha.grupo];

    if (grupo === undefined || idOpcaoEscolhida === undefined) {
      return;
    }

    const opcaoEscolhida = grupo.opcoes.find(function(opcao) {
      return opcao.id === idOpcaoEscolhida;
    });

    if (opcaoEscolhida !== undefined) {
      linhas.push(grupo.nome + ": " + opcaoEscolhida.nome);
    }
  });

  return linhas.join("\n");
}

function obterTextoEquipamento(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return "";
  }

  const linhas = [];

  linhas.push("Armadura: " + obterNomeArmadura(equipamentos.armadura));
  linhas.push("Arma principal: " + obterNomeArma(equipamentos.armaPrincipal));
  linhas.push("Item secundário: " + obterNomeItemSecundario(equipamentos.itemSecundario));

  return linhas.join("\n");
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

  preencherCampoTexto(
    formulario,
    camposFichaPdf.forcaMod,
    formatarModificador(calcularModificador(personagem.atributos.forca))
  );

  preencherCampoTexto(
    formulario,
    camposFichaPdf.destrezaMod,
    formatarModificador(calcularModificador(personagem.atributos.destreza))
  );

  preencherCampoTexto(
    formulario,
    camposFichaPdf.constituicaoMod,
    formatarModificador(calcularModificador(personagem.atributos.constituicao))
  );

  preencherCampoTexto(
    formulario,
    camposFichaPdf.inteligenciaMod,
    formatarModificador(calcularModificador(personagem.atributos.inteligencia))
  );

  preencherCampoTexto(
    formulario,
    camposFichaPdf.sabedoriaMod,
    formatarModificador(calcularModificador(personagem.atributos.sabedoria))
  );

  preencherCampoTexto(
    formulario,
    camposFichaPdf.carismaMod,
    formatarModificador(calcularModificador(personagem.atributos.carisma))
  );

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

  preencherCampoTexto(formulario, camposFichaPdf.idiomas, personagem.idiomas.join(", "));

  preencherCampoTexto(
  formulario,
  camposFichaPdf.caracteristicasClasse1,
  obterTextoHabilidadesParaPdf(personagem)
  );

  preencherCampoTexto(
  formulario,
  camposFichaPdf.talentos,
  obterTextoTalentosParaPdf(personagem)
  );
  
  preencherArmasPdf(formulario, personagem);
  marcarCheckboxesPersonagemPdf(formulario, personagem);
  formulario.updateFieldAppearances();

  const pdfFinal = await pdfDoc.save();

  const blob = new Blob([pdfFinal], {
    type: "application/pdf"
  });

  const url = URL.createObjectURL(blob);

  const nomeArquivo =
    "ficha-" +
    personagem.detalhes.nome.toLowerCase().replaceAll(" ", "-") +
    ".pdf";

  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();

  URL.revokeObjectURL(url);
}

if (botaoBaixarPdfEditavel !== null) {
  botaoBaixarPdfEditavel.addEventListener("click", function() {
    console.log("Cliquei em baixar PDF editável");

    if (personagemEncontrado === undefined) {
      alert("Personagem não encontrado. Não foi possível gerar o PDF.");
      return;
    }

    baixarPdfFichaEditavel(personagemEncontrado);
  });
}

if (personagemEncontrado === undefined) {
  alert("Personagem não encontrado.");
} else {
  preencherFichaPersonagem(personagemEncontrado);
}

function calcularBonusProficiencia(personagem) {
  return 2;
}

function personagemTemProficienciaEmPericia(personagem, idPericia) {
  if (personagem.pericias === undefined) {
    return false;
  }

  return personagem.pericias.includes(idPericia);
}

function personagemTemProficienciaEmSalvaguarda(personagem, idAtributo) {
  const classeId = personagem.classeId;

  if (classeId === undefined || classeId === "") {
    return false;
  }

  const dadosClasse = window.bancoClasses[classeId];

  if (dadosClasse === undefined || dadosClasse.salvaguardas === undefined) {
    return false;
  }

  return dadosClasse.salvaguardas.includes(idAtributo);
}

function calcularValorPericia(personagem, idPericia) {
  const atributoBase = obterAtributoDaPericia(idPericia);

  if (atributoBase === undefined) {
    return "";
  }

  const valorAtributo = personagem.atributos[atributoBase];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  let valorFinal = calcularModificador(valorAtributo);

  if (personagemTemProficienciaEmPericia(personagem, idPericia)) {
    valorFinal = valorFinal + calcularBonusProficiencia(personagem);
  }

  return valorFinal;
}

function calcularValorSalvaguarda(personagem, idAtributo) {
  const valorAtributo = personagem.atributos[idAtributo];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  let valorFinal = calcularModificador(valorAtributo);

  if (personagemTemProficienciaEmSalvaguarda(personagem, idAtributo)) {
    valorFinal = valorFinal + calcularBonusProficiencia(personagem);
  }

  return valorFinal;
}

function atualizarMarcadoresPericias(personagem) {
  const linhasPericia = document.querySelectorAll("[data-pericia]");

  linhasPericia.forEach(function(linha) {
    const idPericia = linha.dataset.pericia;

    if (
      personagem.pericias !== undefined &&
      personagem.pericias.includes(idPericia)
    ) {
      linha.classList.add("proficiente");
    } else {
      linha.classList.remove("proficiente");
    }
  });
}

function atualizarMarcadoresSalvaguardas(personagem) {
  const linhasSalvaguarda = document.querySelectorAll("[data-salvaguarda]");

  linhasSalvaguarda.forEach(function(linha) {
    linha.classList.remove("proficiente");
  });

  const classeId = personagem.classeId;

  if (classeId === undefined || classeId === "") {
    return;
  }

  const dadosClasse = window.bancoClasses[classeId];

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

function obterOpcoesDoGrupoEscolha(grupo) {
  if (grupo.origemDasOpcoes === "armas") {
    return Object.keys(window.bancoEquipamentos.armas).map(function(idArma) {
      const arma = window.bancoEquipamentos.armas[idArma];

      if (typeof arma === "string") {
        return {
          id: idArma,
          nome: arma,
          descricaoCurta: ""
        };
      }

      return {
        id: idArma,
        nome: arma.nome,
        descricaoCurta: "Maestria: " + arma.maestria
      };
    });
  }

  return grupo.opcoes;
}

function obterTextoHabilidadesParaPdf(personagem) {
  const linhas = [];

  const dadosDaClasse =
    window.bancoHabilidades.progressaoClasses[personagem.classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    return "";
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  const habilidadesAutomaticas =
    dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

  habilidadesAutomaticas.forEach(function(idHabilidade) {
  if (idHabilidade === "maestriaComArmas") {
    return;
  }

  const habilidade = obterDadosHabilidade(idHabilidade);

  if (habilidade !== undefined) {
    linhas.push(habilidade.nome);
  }
 });

  dadosNivel1.escolhas.forEach(function(escolha) {
    const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
    const valorEscolhido = personagem.habilidades.escolhas[escolha.grupo];

    if (grupo === undefined || valorEscolhido === undefined) {
      return;
    }

    const opcoes = obterOpcoesDoGrupoEscolha(grupo);

    if (Array.isArray(valorEscolhido)) {
      const nomesEscolhidos = [];

      valorEscolhido.forEach(function(idEscolhido) {
        const opcaoEscolhida = opcoes.find(function(opcao) {
          return opcao.id === idEscolhido;
        });

        if (opcaoEscolhida !== undefined) {
          nomesEscolhidos.push(opcaoEscolhida.nome);
        }
      });

      if (nomesEscolhidos.length > 0) {
        linhas.push(grupo.nome + ": " + nomesEscolhidos.join(", "));
      }

      return;
    }

    const opcaoEscolhida = opcoes.find(function(opcao) {
      return opcao.id === valorEscolhido;
    });

    if (opcaoEscolhida !== undefined) {
      linhas.push(grupo.nome + ": " + opcaoEscolhida.nome);
    }
  });

  return linhas.join("\n");
}

function criarItemHabilidadeComEscolha(rotulo, valor) {
  const item = document.createElement("li");
  item.classList.add("item-habilidade-escolha");

  const spanRotulo = document.createElement("span");
  spanRotulo.classList.add("habilidade-rotulo");
  spanRotulo.textContent = rotulo + ": ";

  const spanValor = document.createElement("span");
  spanValor.classList.add("habilidade-valor");
  spanValor.textContent = valor;

  item.appendChild(spanRotulo);
  item.appendChild(spanValor);

  return item;
}





async function gerarMapaCheckboxesPdf() {
  const resposta = await fetch("pdfs/ficha-dnd-editavel.pdf");

  if (resposta.ok === false) {
    console.error("PDF não encontrado. Status:", resposta.status);
    return;
  }

  const bytesPdf = await resposta.arrayBuffer();

  const pdfDoc = await PDFLib.PDFDocument.load(bytesPdf);
  const formulario = pdfDoc.getForm();
  const campos = formulario.getFields();
  const paginas = pdfDoc.getPages();

  let totalCheckboxes = 0;

  campos.forEach(function(campo) {
    const nomeCampo = campo.getName();

    console.log(
      nomeCampo,
      "tipo:",
      campo.constructor.name,
      "tem check:",
      typeof campo.check
    );

    if (typeof campo.check !== "function") {
      return;
    }

    totalCheckboxes = totalCheckboxes + 1;

    campo.check();

    const widgets = campo.acroField.getWidgets();

    widgets.forEach(function(widget) {
      const retangulo = widget.getRectangle();

      let pagina = paginas[0];

      const paginaDoWidget = widget.P();

      const paginaEncontrada = paginas.find(function(paginaAtual) {
        return paginaAtual.ref === paginaDoWidget;
      });

      if (paginaEncontrada !== undefined) {
        pagina = paginaEncontrada;
      }

      pagina.drawText(nomeCampo, {
        x: retangulo.x + 8,
        y: retangulo.y,
        size: 6,
        color: PDFLib.rgb(1, 0, 0)
      });

      pagina.drawRectangle({
        x: retangulo.x - 1,
        y: retangulo.y - 1,
        width: retangulo.width + 2,
        height: retangulo.height + 2,
        borderColor: PDFLib.rgb(1, 0, 0),
        borderWidth: 0.5
      });
    });
  });

  console.log("Total de checkboxes encontrados:", totalCheckboxes);

  formulario.updateFieldAppearances();

  const pdfFinal = await pdfDoc.save();

  const blob = new Blob([pdfFinal], {
    type: "application/pdf"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "mapa-checkboxes-ficha-dnd.pdf";
  link.click();

  URL.revokeObjectURL(url);
}

function marcarCheckboxPdf(formulario, nomeCampo) {
  if (nomeCampo === undefined || nomeCampo === "") {
    return;
  }

  try {
    const checkbox = formulario.getCheckBox(nomeCampo);
    checkbox.check();
  } catch (erro) {
    console.warn("Checkbox não encontrado no PDF:", nomeCampo);
  }
}

function marcarCheckboxesPersonagemPdf(formulario, personagem) {
  const dadosClasse = window.bancoClasses[personagem.classeId];

  if (dadosClasse !== undefined && dadosClasse.salvaguardas !== undefined) {
    dadosClasse.salvaguardas.forEach(function(idSalvaguarda) {
      marcarCheckboxPdf(
        formulario,
        camposCheckboxPdf.salvaguardas[idSalvaguarda]
      );
    });
  }

  if (personagem.pericias !== undefined) {
    personagem.pericias.forEach(function(idPericia) {
      marcarCheckboxPdf(
        formulario,
        camposCheckboxPdf.pericias[idPericia]
      );
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

function obterDadosArma(idArma) {
  if (idArma === undefined || idArma === "") {
    return undefined;
  }

  return window.bancoEquipamentos.armas[idArma];
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

    preencherCampoTexto(formulario, linhaPdf.nome, resumo.nome);
    preencherCampoTexto(formulario, linhaPdf.ataque, resumo.ataque);
    preencherCampoTexto(formulario, linhaPdf.dano, resumo.dano);
    preencherCampoTexto(formulario, linhaPdf.notas, "Maestria: " + resumo.maestria);
  });
}

function personagemTemProficienciaComArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return false;
  }

  const dadosClasse = window.bancoClasses[personagemAtual.classeId];

  if (
    dadosClasse === undefined ||
    dadosClasse.proficiencias === undefined ||
    dadosClasse.proficiencias.armas === undefined
  ) {
    return false;
  }

  const proficienciasArmas = dadosClasse.proficiencias.armas;

  if (arma.tipo === "simples" && proficienciasArmas.includes("Armas simples")) {
    return true;
  }

  if (arma.tipo === "marcial" && proficienciasArmas.includes("Armas marciais")) {
    return true;
  }

  return false;
}

function calcularBonusAtaqueArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return "";
  }

  const atributoAtaque = obterAtributoAtaqueDaArma(personagemAtual, idArma);
  const valorAtributo = personagemAtual.atributos[atributoAtaque];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  let bonusAtaque = calcularModificador(valorAtributo);

  if (personagemTemProficienciaComArma(personagemAtual, idArma)) {
    bonusAtaque = bonusAtaque + calcularBonusProficiencia(personagemAtual);
  }

  if (
    personagemAtual.habilidades.escolhas.estilosDeLuta === "arquearia" &&
    arma.categoria === "distancia"
  ) {
    bonusAtaque = bonusAtaque + 2;
  }

  return bonusAtaque;
}

function calcularBonusDanoArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return "";
  }

  const atributoAtaque = obterAtributoAtaqueDaArma(personagemAtual, idArma);
  const valorAtributo = personagemAtual.atributos[atributoAtaque];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  const modificadorAtributo = calcularModificador(valorAtributo);
  const equipamentos = personagemAtual.detalhes.equipamentos;

  const ehArmaSecundaria = armaEhSecundaria(personagemAtual, idArma);

  let bonusDano = modificadorAtributo;

  if (
    ehArmaSecundaria &&
    personagemAtual.habilidades.escolhas.estilosDeLuta !== "combateDuasArmas"
  ) {
    bonusDano = 0;
  }

  const usaDuelismo =
    personagemAtual.habilidades.escolhas.estilosDeLuta === "duelismo" &&
    equipamentos !== undefined &&
    equipamentos.armaPrincipal === idArma &&
    arma.categoria === "corpo-a-corpo" &&
    equipamentos.itemSecundario !== "armaSecundaria";

  if (usaDuelismo) {
    bonusDano = bonusDano + 2;
  }

  return bonusDano;
}

function formatarDanoArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return "";
  }

  const bonusDano = calcularBonusDanoArma(personagemAtual, idArma);

  if (bonusDano === "") {
    return arma.dano + " " + arma.tipoDano;
  }

  if (bonusDano > 0) {
    return arma.dano + " +" + bonusDano + " " + arma.tipoDano;
  }

  if (bonusDano < 0) {
    return arma.dano + " " + bonusDano + " " + arma.tipoDano;
  }

  return arma.dano + " " + arma.tipoDano;
}

function obterResumoArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return undefined;
  }

  const bonusAtaque = calcularBonusAtaqueArma(personagemAtual, idArma);

  return {
    nome: arma.nome,
    ataque: bonusAtaque === "" ? "" : formatarModificador(bonusAtaque),
    dano: formatarDanoArma(personagemAtual, idArma),
    maestria: obterNomeMaestria(arma.maestria),
    maestriaId: arma.maestria
  };
}

function preencherArmasAtaques(personagemAtual) {
  if (fichaArmasAtaques === null) {
    return;
  }

  fichaArmasAtaques.innerHTML = "";

  const equipamentos = personagemAtual.detalhes.equipamentos;

  if (equipamentos === undefined) {
    fichaArmasAtaques.textContent = "";
    return;
  }

  const armasParaMostrar = [];

  if (
    equipamentos.armaPrincipal !== undefined &&
    equipamentos.armaPrincipal !== ""
  ) {
    armasParaMostrar.push(equipamentos.armaPrincipal);
  }

  if (
    equipamentos.itemSecundario === "armaSecundaria" &&
    equipamentos.armaSecundaria !== undefined &&
    equipamentos.armaSecundaria !== ""
  ) {
    armasParaMostrar.push(equipamentos.armaSecundaria);
  }

  if (armasParaMostrar.length === 0) {
    fichaArmasAtaques.textContent = "";
    return;
  }

  armasParaMostrar.forEach(function(idArma) {
    const resumo = obterResumoArma(personagemAtual, idArma);

    if (resumo !== undefined) {
      const linhaAtaque = criarLinhaAtaque(resumo);
      fichaArmasAtaques.appendChild(linhaAtaque);
    }
  });
}

function criarLinhaAtaque(resumo) {
  const linhaAtaque = document.createElement("p");
  linhaAtaque.classList.add("linha-ataque");

  const nomeArma = document.createElement("span");
  nomeArma.classList.add("ataque-rotulo");
  nomeArma.textContent = resumo.nome + ": ";

  const valoresAtaque = document.createElement("span");
  valoresAtaque.classList.add("ataque-valor");
  valoresAtaque.textContent = resumo.ataque + " / " + resumo.dano + " / ";

  const botaoMaestria = window.criarReferenciaDetalhe(
    "maestria",
    resumo.maestriaId,
    resumo.maestria
  );

  linhaAtaque.appendChild(nomeArma);
  linhaAtaque.appendChild(valoresAtaque);
  linhaAtaque.appendChild(botaoMaestria);

  return linhaAtaque;
}

function obterArmasDoPersonagem(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return [];
  }

  const armas = [];

  if (
    equipamentos.armaPrincipal !== undefined &&
    equipamentos.armaPrincipal !== ""
  ) {
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

function personagemTemEstiloDeLuta(personagemAtual, idEstilo) {
  if (
    personagemAtual.habilidades === undefined ||
    personagemAtual.habilidades.escolhas === undefined
  ) {
    return false;
  }

  return personagemAtual.habilidades.escolhas.estilosDeLuta === idEstilo;
}

function armaEhSecundaria(personagemAtual, idArma) {
  const equipamentos = personagemAtual.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return false;
  }

  return (
    equipamentos.itemSecundario === "armaSecundaria" &&
    equipamentos.armaSecundaria === idArma
  );
}

function obterDadosPericia(idPericia) {
  return window.bancoPericias[idPericia];
}

function obterAtributoDaPericia(idPericia) {
  const pericia = obterDadosPericia(idPericia);

  if (pericia === undefined) {
    return undefined;
  }

  return pericia.atributo;
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

  if (
    personagem.talentos === undefined ||
    personagem.talentos.length === 0
  ) {
    const item = document.createElement("li");
    item.textContent = "";
    fichaTalentos.appendChild(item);
    return;
  }

  personagem.talentos.forEach(function(idTalento) {
    const item = criarItemTalentoFicha(idTalento);

  if (item !== undefined) {
    fichaTalentos.appendChild(item);
  }
  });
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

function obterDadosMaestria(idMaestria) {
  if (window.bancoMaestrias === undefined) {
    return undefined;
  }

  return window.bancoMaestrias[idMaestria];
}

function obterNomeMaestria(idMaestria) {
  const maestria = obterDadosMaestria(idMaestria);

  if (maestria === undefined) {
    return idMaestria;
  }

  return maestria.nome;
}function obterDadosPropriedadeArma(idPropriedade) {
  if (window.bancoPropriedadesArmas === undefined) {
    return undefined;
  }

  return window.bancoPropriedadesArmas[idPropriedade];
}

function obterNomePropriedadeArma(idPropriedade) {
  const propriedade = obterDadosPropriedadeArma(idPropriedade);

  if (propriedade === undefined) {
    return idPropriedade;
  }

  return propriedade.nome;
}

function obterTextoPropriedadesArma(propriedades) {
  if (propriedades === undefined || propriedades.length === 0) {
    return "";
  }

  const nomesPropriedades = propriedades.map(function(idPropriedade) {
    return obterNomePropriedadeArma(idPropriedade);
  });

  return nomesPropriedades.join(", ");
}

function obterAtributoAtaqueDaArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return undefined;
  }

  const propriedades = arma.propriedades || [];

  if (propriedades.includes("acuidade") === false) {
    return arma.atributoAtaque;
  }

  const forca = personagemAtual.atributos.forca;
  const destreza = personagemAtual.atributos.destreza;

  if (
    (forca === undefined || forca === "") &&
    (destreza === undefined || destreza === "")
  ) {
    return arma.atributoAtaque;
  }

  if (forca === undefined || forca === "") {
    return "destreza";
  }

  if (destreza === undefined || destreza === "") {
    return "forca";
  }

  const modificadorForca = calcularModificador(forca);
  const modificadorDestreza = calcularModificador(destreza);

  if (modificadorForca > modificadorDestreza) {
    return "forca";
  }

  return "destreza";
}

function obterDadosHabilidade(idHabilidade) {
  if (window.bancoHabilidades === undefined) {
    return undefined;
  }

  if (
    window.bancoHabilidades.classFeatures !== undefined &&
    window.bancoHabilidades.classFeatures[idHabilidade] !== undefined
  ) {
    return window.bancoHabilidades.classFeatures[idHabilidade];
  }

  if (
    window.bancoHabilidades.feats !== undefined &&
    window.bancoHabilidades.feats[idHabilidade] !== undefined
  ) {
    return window.bancoHabilidades.feats[idHabilidade];
  }

  if (
    window.bancoHabilidades.traits !== undefined &&
    window.bancoHabilidades.traits[idHabilidade] !== undefined
  ) {
    return window.bancoHabilidades.traits[idHabilidade];
  }

  return undefined;
}

function formatarFormulaRecurso(formula) {
  if (formula === undefined || formula === "") {
    return "";
  }

  return formula.replace("nivelClasse", "1");
}

function obterRecursosHabilidadesPersonagem(personagem) {
  if (
    personagem.habilidades !== undefined &&
    personagem.habilidades.recursos !== undefined
  ) {
    return personagem.habilidades.recursos;
  }

  const recursos = {};

  const dadosDaClasse =
    window.bancoHabilidades.progressaoClasses[personagem.classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    return recursos;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  const habilidadesAutomaticas =
    dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

  habilidadesAutomaticas.forEach(function(idHabilidade) {
    const habilidade = obterDadosHabilidade(idHabilidade);

    if (habilidade === undefined || habilidade.recurso === undefined) {
      return;
    }

    const recurso = habilidade.recurso;

    recursos[recurso.id] = {
      id: recurso.id,
      nome: recurso.nome,
      usosAtuais: recurso.usosMaximos,
      usosMaximos: recurso.usosMaximos,
      recuperaEm: recurso.recuperaEm,
      efeito: recurso.efeito,
      formula: formatarFormulaRecurso(recurso.formula)
    };
  });

  return recursos;
}

function obterTextoResumoRecurso(recurso) {
  if (recurso === undefined) {
    return "";
  }

  let texto = "Usos: " + recurso.usosAtuais + " / " + recurso.usosMaximos;

  if (recurso.efeito === "cura" && recurso.formula !== "") {
    texto = texto + " — Cura: " + recurso.formula;
  }

  return texto;
}

function criarItemHabilidadeAutomaticaFicha(personagem, idHabilidade) {
  const habilidade = obterDadosHabilidade(idHabilidade);

  if (habilidade === undefined) {
    return undefined;
  }

  const item = document.createElement("li");

  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("botao-habilidade-ficha");

  const nome = document.createElement("span");
  nome.classList.add("nome-habilidade-ficha");
  nome.textContent = habilidade.nome;

  botao.appendChild(nome);

  const recursos = obterRecursosHabilidadesPersonagem(personagem);
  const recurso = recursos[idHabilidade];

  if (recurso !== undefined) {
    const resumoRecurso = document.createElement("span");
    resumoRecurso.classList.add("resumo-recurso-habilidade");
    resumoRecurso.textContent = obterTextoResumoRecurso(recurso);

    botao.appendChild(resumoRecurso);
  }

  botao.addEventListener("click", function(evento) {
  evento.stopPropagation();

  window.abrirPopoverDetalhe(
    "habilidade",
    idHabilidade,
    botao,
    {
      recursos: personagem.habilidades.recursos
    }
  );
  });

  item.appendChild(botao);

  return item;
}

function abrirModalDetalheHabilidade(personagem, idHabilidade) {
  window.abrirModalDetalhe("habilidade", idHabilidade, {
    recursos: obterRecursosHabilidadesPersonagem(personagem)
  });
}

function fecharModalDetalheFicha() {
  if (modalDetalheFicha === null) {
    return;
  }

  modalDetalheFicha.classList.add("escondida");
}

if (botaoFecharModalDetalheFicha !== null) {
  botaoFecharModalDetalheFicha.addEventListener("click", function() {
    fecharModalDetalheFicha();
  });
}

if (modalDetalheFicha !== null) {
  modalDetalheFicha.addEventListener("click", function(evento) {
    if (evento.target === modalDetalheFicha) {
      fecharModalDetalheFicha();
    }
  });
}

function abrirModalDetalheTalento(idTalento) {
  window.abrirModalDetalhe("talento", idTalento);
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

  window.abrirPopoverDetalhe(
    "talento",
    idTalento,
    botao
  );
  });

  item.appendChild(botao);

  return item;
}

function abrirModalDetalheMaestria(idMaestria) {
  window.abrirModalDetalhe("maestria", idMaestria);
}