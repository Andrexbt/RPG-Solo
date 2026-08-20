"use strict";

function calcularBonusProficiencia() {
  return 2;
}

function personagemTemProficienciaEmPericia(idPericia) {
  return personagem.pericias.includes(idPericia);
}

function personagemTemProficienciaEmSalvaguarda(idAtributo) {
  const classeId = personagem.classeId;

  if (classeId === "") {
    return false;
  }

  const dadosClasse = window.bancoClasses[classeId];

  if (dadosClasse === undefined || dadosClasse.salvaguardas === undefined) {
    return false;
  }

  return dadosClasse.salvaguardas.includes(idAtributo);
}

function calcularValorPericia(idPericia) {
  const atributo = obterAtributoDaPericia(idPericia);

  if (atributo === undefined) {
    return "";
  }

  const valorAtributo = personagem.atributos[atributo];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  let valorFinal = calcularModificador(valorAtributo);

  if (personagemTemProficienciaEmPericia(idPericia)) {
    valorFinal = valorFinal + calcularBonusProficiencia();

    if (personagemTemEspecializacaoEmPericia(idPericia)) {
      valorFinal = valorFinal + calcularBonusProficiencia();
    }
  }

  return valorFinal;
}

function calcularValorSalvaguarda(idAtributo) {
  const valorAtributo = personagem.atributos[idAtributo];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  let valorFinal = calcularModificador(valorAtributo);

  if (personagemTemProficienciaEmSalvaguarda(idAtributo)) {
    valorFinal = valorFinal + calcularBonusProficiencia();
  }

  return valorFinal;
}

function obterDadosArma(idArma) {
  if (idArma === undefined || idArma === "") {
    return undefined;
  }

  return window.bancoEquipamentos.armas[idArma];
}

function personagemTemProficienciaComArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return false;
  }

  const dadosClasse = window.bancoClasses[personagemAtual.classeId];

  if (dadosClasse === undefined || dadosClasse.proficiencias === undefined) {
    return false;
  }

  const proficienciasArmas = dadosClasse.proficiencias.armas || [];
  const armasEspecificas = dadosClasse.proficiencias.armasEspecificas || [];

  if (armasEspecificas.includes(idArma)) {
    return true;
  }

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
    bonusAtaque = bonusAtaque + calcularBonusProficiencia();
  }

  bonusAtaque +=
  window.TradutorRegras
    .calcularModificadorPassivo(
      {
        participante: personagemAtual,
        arma,
      },
      "modificarAtaqueArma"
    );

  return bonusAtaque;
}

function calcularBonusDanoArma(personagemAtual, idArma, origemEquipamento = null) {
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

  const ehArmaSecundaria =
    origemEquipamento !== null
      ? origemEquipamento === "armaSecundaria"
      : armaEhSecundaria(personagemAtual, idArma);

  let bonusDano = modificadorAtributo;

const armaEmpunhadaEmUmaMao =
  !arma.propriedades?.includes(
    "duasMaos"
  );

const nenhumaOutraArmaEmpunhada =
  equipamentos?.itemSecundario
    !== "armaSecundaria";

const contextoEstilo = {
  participante: personagemAtual,
  arma,
  ataqueComArmaSecundaria:
    ehArmaSecundaria,
  armaEmpunhadaEmUmaMao,
  nenhumaOutraArmaEmpunhada,
};

const incluiModificadorNaArmaSecundaria =
  window.TradutorRegras
    .possuiEfeitoPassivo(
      contextoEstilo,
      "incluirModificadorAtributoNoDano"
    );

if (
  ehArmaSecundaria
  && !incluiModificadorNaArmaSecundaria
) {
  bonusDano = 0;
}

bonusDano +=
  window.TradutorRegras
    .calcularModificadorPassivo(
      contextoEstilo,
      "modificarDanoArma"
    );

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
    maestriaId: arma.maestria,
    propriedades: arma.propriedades || [],
    ataqueFurtivo: obterTextoAtaqueFurtivo(personagemAtual, idArma),
  };
}

function armaPermiteAtaqueFurtivo(idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return false;
  }

  const propriedades = arma.propriedades || [];

  if (arma.categoria === "distancia") {
    return true;
  }

  if (propriedades.includes("acuidade")) {
    return true;
  }

  return false;
}

function obterTextoAtaqueFurtivo(personagemAtual, idArma) {
  if (personagemAtual.classeId !== "ladino") {
    return "";
  }

  if (armaPermiteAtaqueFurtivo(idArma) === false) {
    return "";
  }

  return "Ataque Furtivo: +1d6 quando aplicável";
}

function converterDanoArma(dano) {
  const partes = dano.split("d");

  if (partes.length !== 2) {
    return null;
  }

  const quantidade = Number(partes[0]);

  const numeroDeFaces = Number(partes[1]);

  if (!Number.isInteger(quantidade) || !Number.isInteger(numeroDeFaces)) {
    return null;
  }

  return {
    quantidade: quantidade,

    numeroDeFaces: numeroDeFaces,
  };
}

function criarAtaqueCombateArma(
  personagemAtual,
  idArma,
  origemEquipamento = "armaPrincipal",
) {
  const arma = obterDadosArma(idArma);

  if (!arma) {
    return null;
  }

  const grupoDano = converterDanoArma(arma.dano);

  if (!grupoDano) {
    return null;
  }

  const bonusAtaque = calcularBonusAtaqueArma(personagemAtual, idArma);

  const bonusDano = calcularBonusDanoArma(
    personagemAtual,
    idArma,
    origemEquipamento,
  );

  const atributoAtaque = obterAtributoAtaqueDaArma(
  personagemAtual,
  idArma,
);

  const ataqueDistancia = arma.categoria === "distancia";

  return {
    id: idArma,

    instanciaId: `${idArma}:${origemEquipamento}`,

    armaId: idArma,

    nome: arma.nome,

    atributoId: atributoAtaque,

    origemEquipamento,

    custoPadrao: "acao",

    categoria: ataqueDistancia ? "distancia" : "corpoACorpo",

    selecao: {
      tipo: "criatura",

      alcance: ataqueDistancia
        ? {
            normal: 16,
            longo: 64,
          }
        : {
            normal: 1,
          },

      area: null,
    },

    bonusAtaque: bonusAtaque === "" ? 0 : bonusAtaque,

    dano: {
      gruposDeDados: [grupoDano],

      modificador: bonusDano === "" ? 0 : bonusDano,

      tipo: arma.tipoDano,
    },

    maestriaId: arma.maestria,

    propriedades: structuredClone(arma.propriedades ?? []),
  };
}

function atualizarAtaquesCombatePersonagem() {
  const equipamentos = personagem.detalhes.equipamentos;

  const ataques = [];

  if (!equipamentos) {
    personagem.combate.ataques = ataques;

    return;
  }

  if (equipamentos.armaPrincipal) {
    const ataquePrincipal = criarAtaqueCombateArma(
      personagem,
      equipamentos.armaPrincipal,
      "armaPrincipal",
    );

    if (ataquePrincipal) {
      ataques.push(ataquePrincipal);
    }
  }

  if (equipamentos.itemSecundario === "armaSecundaria" && equipamentos.armaSecundaria) {
    const ataqueSecundario = criarAtaqueCombateArma(
      personagem,
      equipamentos.armaSecundaria,
      "armaSecundaria",
    );

    if (ataqueSecundario) {
      ataques.push(ataqueSecundario);
    }
  }

  personagem.combate.ataques = ataques;
}

function atualizarFichaArmasAtaques() {
  atualizarAtaquesCombatePersonagem();
  atualizarFichaPersonagem(["ataques"]);
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

function preencherSelectArmaSecundaria() {
  if (armaSecundaria === null) {
    return;
  }

  armaSecundaria.innerHTML = "";

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Escolha uma arma";
  armaSecundaria.appendChild(opcaoInicial);

  Object.keys(bancoEquipamentos.armas).forEach(function (idArma) {
    const arma = bancoEquipamentos.armas[idArma];

    const opcao = document.createElement("option");
    opcao.value = idArma;

    if (typeof arma === "string") {
      opcao.textContent = arma;
    } else {
      opcao.textContent = arma.nome;
    }

    armaSecundaria.appendChild(opcao);
  });
}

function atualizarVisibilidadeArmaSecundaria() {
  if (grupoArmaSecundaria === null || armaSecundaria === null) {
    return;
  }

  if (itemSecundario.value === "armaSecundaria") {
    grupoArmaSecundaria.classList.remove("escondida");
  } else {
    grupoArmaSecundaria.classList.add("escondida");
    armaSecundaria.value = "";
  }
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
    resumo.maestria,
  );

  linhaAtaque.appendChild(nomeArma);
  linhaAtaque.appendChild(valoresAtaque);
  linhaAtaque.appendChild(botaoMaestria);

  if (resumo.propriedades.length > 0) {
    linhaAtaque.appendChild(document.createElement("br"));
    linhaAtaque.appendChild(criarLinhaPropriedadesArma(resumo.propriedades));
  }
  if (resumo.ataqueFurtivo !== undefined && resumo.ataqueFurtivo !== "") {
    linhaAtaque.appendChild(document.createElement("br"));

    const linhaAtaqueFurtivo = document.createElement("span");
    linhaAtaqueFurtivo.classList.add("linha-ataque-furtivo");
    linhaAtaqueFurtivo.textContent = resumo.ataqueFurtivo;

    linhaAtaque.appendChild(linhaAtaqueFurtivo);
  }

  return linhaAtaque;
}

function criarLinhaPropriedadesArma(propriedades) {
  const linha = document.createElement("span");
  linha.classList.add("linha-propriedades-arma");

  linha.textContent = "Propriedades: ";

  propriedades.forEach(function (idPropriedade, indice) {
    const propriedade = obterDadosPropriedadeArma(idPropriedade);

    if (propriedade === undefined) {
      return;
    }

    const referencia = window.criarReferenciaDetalhe(
      "propriedadeArma",
      idPropriedade,
      propriedade.nome,
    );

    linha.appendChild(referencia);

    if (indice < propriedades.length - 1) {
      linha.appendChild(document.createTextNode(", "));
    }
  });

  return linha;
}

function personagemTemEstiloDeLuta(idEstilo) {
  return personagem.habilidades.escolhas.estilosDeLuta === idEstilo;
}

function armaEhSecundaria(personagemAtual, idArma) {
  const equipamentos = personagemAtual.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return false;
  }

  return equipamentos.itemSecundario === "armaSecundaria" && equipamentos.armaSecundaria === idArma;
}

function obterPropriedadesArma(idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined || arma.propriedades === undefined) {
    return [];
  }

  return arma.propriedades;
}

function armaTemPropriedade(idArma, propriedade) {
  const propriedades = obterPropriedadesArma(idArma);

  return propriedades.includes(propriedade);
}

function obterAvisosEquipamentos() {
  const equipamentos = personagem.detalhes.equipamentos;
  const avisos = [];

  if (equipamentos === undefined) {
    return avisos;
  }

  const armaPrincipalId = equipamentos.armaPrincipal;
  const armaSecundariaId = equipamentos.armaSecundaria;
  const itemSecundarioId = equipamentos.itemSecundario;

  const armaPrincipal = obterDadosArma(armaPrincipalId);

  if (
    armaPrincipalId !== undefined &&
    armaPrincipalId !== "" &&
    armaTemPropriedade(armaPrincipalId, "duasMaos") &&
    itemSecundarioId === "escudo"
  ) {
    avisos.push(
      "A arma principal parece exigir duas mãos, então ela pode não combinar com escudo.",
    );
  }

  if (
    armaPrincipalId !== undefined &&
    armaPrincipalId !== "" &&
    armaTemPropriedade(armaPrincipalId, "duasMaos") &&
    itemSecundarioId === "armaSecundaria"
  ) {
    avisos.push(
      "A arma principal parece exigir duas mãos, então ela pode não combinar com uma arma secundária.",
    );
  }

  if (
    itemSecundarioId === "armaSecundaria" &&
    armaSecundariaId !== undefined &&
    armaSecundariaId !== "" &&
    armaTemPropriedade(armaSecundariaId, "leve") === false
  ) {
    avisos.push(
      "Para lutar com duas armas, a arma secundária normalmente deveria ter a propriedade leve.",
    );
  }

  if (
    personagem.habilidades.escolhas.estilosDeLuta === "combateDuasArmas" &&
    itemSecundarioId !== "armaSecundaria"
  ) {
    avisos.push("Você escolheu Combate com Duas Armas, mas não escolheu uma arma secundária.");
  }

  if (
    personagem.habilidades.escolhas.estilosDeLuta === "duelismo" &&
    itemSecundarioId === "armaSecundaria"
  ) {
    avisos.push("Duelismo normalmente não se aplica quando você está usando uma arma secundária.");
  }

  if (
    personagem.habilidades.escolhas.estilosDeLuta === "duelismo" &&
    armaPrincipal !== undefined &&
    armaPrincipal.categoria !== "corpo-a-corpo"
  ) {
    avisos.push("Duelismo normalmente se aplica a armas corpo a corpo.");
  }

  return avisos;
}

function atualizarAvisosEquipamentos() {
  if (avisoEquipamentos === null) {
    return;
  }

  const avisos = obterAvisosEquipamentos();

  avisoEquipamentos.innerHTML = "";

  if (avisos.length === 0) {
    avisoEquipamentos.textContent = "";
    return;
  }

  avisos.forEach(function (textoAviso) {
    const linha = document.createElement("div");
    linha.textContent = "⚠ " + textoAviso;
    avisoEquipamentos.appendChild(linha);
  });
}
