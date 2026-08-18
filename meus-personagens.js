// =====================================================
// Lista de personagens salvos
// -----------------------------------------------------
// Este arquivo controla a tela meus-personagens.html.
// Ele lê os personagens salvos no localStorage, monta os
// cards de resumo e permite abrir ou excluir uma ficha.
// =====================================================


const listaPersonagens = document.getElementById("listaPersonagens");

function carregarPersonagensSalvos() {
  return window.PersonagemDados.listarSalvos();
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
  const classeArmaduraSalva = personagem?.combate?.classeArmadura;

  if (
    classeArmaduraSalva !== undefined &&
    classeArmaduraSalva !== null &&
    classeArmaduraSalva !== ""
  ) {
    return classeArmaduraSalva;
  }

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
  const pontosDeVida = personagem?.combate?.pontosDeVida ?? personagem?.detalhes?.pontosDeVida;

  return textoOuTraco(pontosDeVida?.maximo);
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

function criarAvatarCardPersonagem(personagem) {
  const avatar = personagem?.avatar;

  if (avatar === undefined || avatar.imagem === undefined || avatar.frame === undefined) {
    return null;
  }

  const avatarCard = document.createElement("div");

  avatarCard.classList.add("avatar-card-personagem");

  const imagemAvatar = document.createElement("img");

  imagemAvatar.classList.add("imagem-avatar-card");

  imagemAvatar.src = avatar.imagem;

  imagemAvatar.alt = "Avatar de " + textoOuTraco(personagem?.detalhes?.nome);

  imagemAvatar.loading = "lazy";

  const frameAvatar = document.createElement("img");

  frameAvatar.classList.add("frame-avatar-card");

  frameAvatar.src = avatar.frame;

  frameAvatar.alt = "";

  frameAvatar.setAttribute("aria-hidden", "true");

  avatarCard.append(imagemAvatar, frameAvatar);

  return avatarCard;
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

  personagens.forEach(function (personagem) {
    const card = document.createElement("article");
    card.classList.add("card-personagem");

    const avatarCard = criarAvatarCardPersonagem(personagem);

    if (avatarCard !== null) {
      card.classList.add("com-avatar");

      card.appendChild(avatarCard);
    }

    const cabecalho = document.createElement("div");
    cabecalho.classList.add("card-personagem-cabecalho");

    const nome = document.createElement("h3");
    nome.textContent = textoOuTraco(personagem?.detalhes?.nome);

    const classe = document.createElement("p");
    classe.classList.add("resumo-personagem");
    classe.textContent =
  textoOuTraco(
    personagem?.classe
  ) +
  " " +
  textoOuTraco(
    personagem?.nivel
  );

    cabecalho.append(nome, classe);

    const informacoes = document.createElement("div");
    informacoes.classList.add("card-personagem-info");
    informacoes.append(
      criarParagrafoComRotulo("Espécie", personagem?.especie),
      criarParagrafoComRotulo("Antecedente", personagem?.antecedente),
    );

    const valores = document.createElement("div");
    valores.classList.add("card-personagem-valores");
    valores.append(
      criarValorResumo("CA", calcularClasseArmadura(personagem)),
      criarValorResumo("PV", obterPontosDeVidaMaximos(personagem)),
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
    botaoExcluir.addEventListener("click", function () {
      confirmarExclusaoPersonagem(personagem.id, personagem?.detalhes?.nome);
    });

    acoes.append(linkVerFicha, botaoExcluir);
    card.append(cabecalho, informacoes, valores, acoes);
    listaPersonagens.appendChild(card);
  });
}

function excluirPersonagem(idPersonagem) {
  const personagemExcluido =
    window.PersonagemDados.excluirSalvoPorId(
      idPersonagem,
    );

  if (!personagemExcluido) {
    console.error(
      "O personagem não pôde ser excluído.",
    );

    return;
  }

  montarTelaPersonagens();
}

function confirmarExclusaoPersonagem(idPersonagem, nomePersonagem) {
  const confirmou = window.confirm(
    "Tem certeza que deseja excluir " + textoOuTraco(nomePersonagem) + "?",
  );

  if (confirmou === true) {
    excluirPersonagem(idPersonagem);
  }
}

montarTelaPersonagens();
