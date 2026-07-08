const botaoImprimirFicha = document.getElementById("botaoImprimirFicha");
const idPersonagem = pegarIdDaUrl();
const personagemEncontrado = buscarPersonagemPorId(idPersonagem);
const botaoBaixarPdfEditavel = document.getElementById("botaoBaixarPdfEditavel");

console.log("Botão PDF:", botaoBaixarPdfEditavel);
console.log("PDFLib:", window.PDFLib);

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

function preencherFichaPersonagem(personagem) {
  preencherInformacoesBasicas(personagem);
  preencherAtributos(personagem);
  preencherCombate(personagem);
  preencherEquipamentos(personagem);
  preencherHabilidades(personagem);
  preencherMagias(personagem);
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
  const sabedoria = personagem.atributos.sabedoria;

  if (sabedoria === undefined || sabedoria === "") {
    return "";
  }

  return 10 + calcularModificador(sabedoria);
}

function calcularClasseArmadura(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return "";
  }

  const armadura =
    window.bancoEquipamentos.armaduras[equipamentos.armadura];

  const itemSecundario =
    window.bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

  if (armadura === undefined) {
    return "";
  }

  let classeArmadura = armadura.caBase;

  const destreza = personagem.atributos.destreza;

  if (armadura.usaDestreza === true && destreza !== undefined && destreza !== "") {
    const modificadorDestreza = calcularModificador(destreza);

    if (armadura.limiteDestreza === null) {
      classeArmadura = classeArmadura + modificadorDestreza;
    } else {
      classeArmadura =
        classeArmadura + Math.min(modificadorDestreza, armadura.limiteDestreza);
    }
  }

  if (itemSecundario !== undefined && itemSecundario.bonusCA !== undefined) {
    classeArmadura = classeArmadura + itemSecundario.bonusCA;
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

  document.getElementById("fichaArmadura").textContent =
    obterNomeArmadura(equipamentos.armadura);

  document.getElementById("fichaArmaPrincipal").textContent =
    obterNomeArma(equipamentos.armaPrincipal);

  document.getElementById("fichaItemSecundario").textContent =
    obterNomeItemSecundario(equipamentos.itemSecundario);

  if (equipamentos.proficiencias !== undefined) {
    document.getElementById("fichaProficiencias").textContent =
      equipamentos.proficiencias.join(", ");
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

  dadosNivel1.habilidadesAutomaticas.forEach(function(idHabilidade) {
    const habilidade = window.bancoHabilidades.habilidades[idHabilidade];

    if (habilidade !== undefined) {
      const item = document.createElement("li");
      item.textContent = habilidade.nome;
      lista.appendChild(item);
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
      const item = document.createElement("li");
      item.textContent = grupo.nome + ": " + opcaoEscolhida.nome;
      lista.appendChild(item);
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

  dadosNivel1.habilidadesAutomaticas.forEach(function(idHabilidade) {
    const habilidade = window.bancoHabilidades.habilidades[idHabilidade];

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
  preencherCampoTexto(formulario, camposFichaPdf.equipamento, obterTextoEquipamento(personagem));
  preencherCampoTexto(formulario, camposFichaPdf.caracteristicasClasse1, obterTextoHabilidades(personagem));

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