// =====================================================
// Lista de personagens salvos
// -----------------------------------------------------
// Este arquivo controla a tela meus-personagens.html.
// Ele lê os personagens salvos no localStorage, monta os
// cards de resumo e permite abrir ou excluir uma ficha.
// =====================================================

const CHAVE_PERSONAGENS = "personagensRpgSolo";
const listaPersonagens = document.getElementById("listaPersonagens");

function carregarPersonagensSalvos() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_PERSONAGENS);
    const personagens = dadosSalvos === null ? [] : JSON.parse(dadosSalvos);

    return Array.isArray(personagens) ? personagens : [];
  } catch (erro) {
    console.error("Não foi possível ler os personagens salvos.", erro);
    return [];
  }
}

function salvarListaPersonagens(personagens) {
  localStorage.setItem(CHAVE_PERSONAGENS, JSON.stringify(personagens));
}

function textoOuTraco(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "-";
  }

  return String(valor);
}

function calcularModificador(valor) {
  return Math.floor((Number(valor) - 10) / 2);
}

function calcularClasseArmadura(personagem) {
  const equipamentos = personagem?.detalhes?.equipamentos;
  const atributos = personagem?.atributos;
  const banco = window.bancoEquipamentos;

  if (equipamentos === undefined || atributos === undefined || banco === undefined) {
    return "-";
  }

  const armadura = banco.armaduras?.[equipamentos.armadura];
  const itemSecundario = banco.itensSecundarios?.[equipamentos.itemSecundario];

  if (armadura === undefined) {
    return "-";
  }

  let classeArmadura = armadura.caBase;
  const destreza = atributos.destreza;

  if (armadura.usaDestreza === true && destreza !== undefined && destreza !== "") {
    const modificadorDestreza = calcularModificador(destreza);

    if (armadura.limiteDestreza === null) {
      classeArmadura += modificadorDestreza;
    } else {
      classeArmadura += Math.min(modificadorDestreza, armadura.limiteDestreza);
    }
  }

  if (itemSecundario?.bonusCA !== undefined) {
    classeArmadura += itemSecundario.bonusCA;
  }

  return classeArmadura;
}

function obterPontosDeVidaMaximos(personagem) {
  return textoOuTraco(personagem?.detalhes?.pontosDeVida?.maximo);
}

function criarParagrafoComRotulo(rotulo, valor) {
  const paragrafo = document.createElement("p");
  const destaque = document.createElement("strong");

  destaque.textContent = rotulo + ": ";
  paragrafo.append(destaque, document.createTextNode(textoOuTraco(valor)));

  return paragrafo;
}

function criarValorResumo(rotulo, valor) {
  const caixa = document.createElement("div");
  const rotuloElemento = document.createElement("span");
  const valorElemento = document.createElement("strong");

  caixa.classList.add("valor-card-personagem");
  rotuloElemento.textContent = rotulo;
  valorElemento.textContent = textoOuTraco(valor);
  caixa.append(rotuloElemento, valorElemento);

  return caixa;
}

function montarTelaPersonagens() {
  if (listaPersonagens === null) {
    return;
  }

  const personagens = carregarPersonagensSalvos();
  listaPersonagens.replaceChildren();

  if (personagens.length === 0) {
    const aviso = document.createElement("p");
    aviso.classList.add("texto-explicativo");
    aviso.textContent = "Nenhum personagem salvo ainda.";
    listaPersonagens.appendChild(aviso);
    return;
  }

  personagens.forEach(function(personagem) {
    const card = document.createElement("article");
    card.classList.add("card-personagem");

    const cabecalho = document.createElement("div");
    cabecalho.classList.add("card-personagem-cabecalho");

    const nome = document.createElement("h3");
    nome.textContent = textoOuTraco(personagem?.detalhes?.nome);

    const classe = document.createElement("p");
    classe.classList.add("resumo-personagem");
    classe.textContent = textoOuTraco(personagem?.classe) + " 1";

    cabecalho.append(nome, classe);

    const informacoes = document.createElement("div");
    informacoes.classList.add("card-personagem-info");
    informacoes.append(
      criarParagrafoComRotulo("Espécie", personagem?.especie),
      criarParagrafoComRotulo("Antecedente", personagem?.antecedente)
    );

    const valores = document.createElement("div");
    valores.classList.add("card-personagem-valores");
    valores.append(
      criarValorResumo("CA", calcularClasseArmadura(personagem)),
      criarValorResumo("PV", obterPontosDeVidaMaximos(personagem))
    );

    const acoes = document.createElement("div");
    acoes.classList.add("card-personagem-acoes");

    const linkVerFicha = document.createElement("a");
    linkVerFicha.classList.add("botao-link-card");
    linkVerFicha.href = "ver-personagem.html?id=" + encodeURIComponent(personagem.id);
    linkVerFicha.textContent = "Ver ficha";

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", function() {
      confirmarExclusaoPersonagem(personagem.id, personagem?.detalhes?.nome);
    });

    acoes.append(linkVerFicha, botaoExcluir);
    card.append(cabecalho, informacoes, valores, acoes);
    listaPersonagens.appendChild(card);
  });
}

function excluirPersonagem(idPersonagem) {
  const personagensAtualizados = carregarPersonagensSalvos().filter(function(personagem) {
    return personagem.id !== idPersonagem;
  });

  salvarListaPersonagens(personagensAtualizados);
  montarTelaPersonagens();
}

function confirmarExclusaoPersonagem(idPersonagem, nomePersonagem) {
  const confirmou = window.confirm(
    "Tem certeza que deseja excluir " + textoOuTraco(nomePersonagem) + "?"
  );

  if (confirmou === true) {
    excluirPersonagem(idPersonagem);
  }
}

montarTelaPersonagens();
