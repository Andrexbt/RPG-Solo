"use strict";

function obterProgressaoMagiasAtual() {
  const classeId = personagem.classeId;

  if (window.bancoMagias === undefined || window.bancoMagias.progressaoMagias === undefined) {
    return undefined;
  }

  const dadosClasse = window.bancoMagias.progressaoMagias[classeId];

  if (dadosClasse === undefined || dadosClasse.nivel1 === undefined) {
    return undefined;
  }

  return dadosClasse.nivel1;
}

function obterDadosMagia(idMagia) {
  if (window.bancoMagias === undefined || window.bancoMagias.magias === undefined) {
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

function obterMagiasDaClassePorNivel(classeId, nivelMagia) {
  if (window.bancoMagias === undefined || window.bancoMagias.magias === undefined) {
    return [];
  }

  return Object.values(window.bancoMagias.magias).filter(function (magia) {
    return (
      magia.nivel === nivelMagia && Array.isArray(magia.classes) && magia.classes.includes(classeId)
    );
  });
}

function calcularCdSalvamentoMagiaPersonagem() {
  const progressao = obterProgressaoMagiasAtual();

  if (progressao === undefined || progressao.atributoConjuracao === undefined) {
    return "";
  }

  const valorAtributo = personagem.atributos[progressao.atributoConjuracao];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  return 8 + calcularBonusProficiencia() + calcularModificador(valorAtributo);
}

function calcularBonusAtaqueMagicoPersonagem() {
  const progressao = obterProgressaoMagiasAtual();

  if (progressao === undefined || progressao.atributoConjuracao === undefined) {
    return "";
  }

  const valorAtributo = personagem.atributos[progressao.atributoConjuracao];

  if (valorAtributo === undefined || valorAtributo === "") {
    return "";
  }

  return calcularBonusProficiencia() + calcularModificador(valorAtributo);
}

function inicializarMagiasPersonagem() {
  const progressao = obterProgressaoMagiasAtual();

  if (progressao === undefined || progressao.temMagias !== true) {
    personagem.magias = {};
    atualizarFichaMagias();
    return;
  }

  let espacosNivel1 = 0;

  if (progressao.espacosMagia !== undefined && progressao.espacosMagia.nivel1 !== undefined) {
    espacosNivel1 = progressao.espacosMagia.nivel1;
  }

  personagem.magias = {
    atributoConjuracao: progressao.atributoConjuracao,
    cdSalvamento: calcularCdSalvamentoMagiaPersonagem(),
    bonusAtaqueMagico: calcularBonusAtaqueMagicoPersonagem(),

    truquesConhecidos: [],
    magiasPreparadas: [],

    espacosMagia: {
      nivel1: {
        maximos: espacosNivel1,
        usados: 0,
      },
    },
  };

  atualizarFichaMagias();
}

function atualizarNumerosMagiasPersonagem() {
  if (personagem.magias === undefined || personagem.magias.atributoConjuracao === undefined) {
    return;
  }

  personagem.magias.cdSalvamento = calcularCdSalvamentoMagiaPersonagem();
  personagem.magias.bonusAtaqueMagico = calcularBonusAtaqueMagicoPersonagem();
}

function obterNomeAtributoConjuracao(idAtributo) {
  const nomes = {
    forca: "Força",
    destreza: "Destreza",
    constituicao: "Constituição",
    inteligencia: "Inteligência",
    sabedoria: "Sabedoria",
    carisma: "Carisma",
  };

  return nomes[idAtributo] || idAtributo;
}

function criarResumoConjuracao(progressao) {
  const resumo = document.createElement("section");
  resumo.classList.add("bloco-magias");

  const titulo = document.createElement("h3");
  titulo.textContent = "Conjuração";
  resumo.appendChild(titulo);

  const atributo = document.createElement("p");
  atributo.innerHTML =
    "<strong>Atributo de conjuração:</strong> " +
    obterNomeAtributoConjuracao(progressao.atributoConjuracao);
  resumo.appendChild(atributo);

  const cd = document.createElement("p");
  cd.innerHTML = "<strong>CD das magias:</strong> " + (personagem.magias.cdSalvamento || "-");
  resumo.appendChild(cd);

  const bonusAtaque = personagem.magias.bonusAtaqueMagico;

  const ataque = document.createElement("p");
  ataque.innerHTML =
    "<strong>Ataque mágico:</strong> " +
    (bonusAtaque === "" ? "-" : formatarModificador(bonusAtaque));
  resumo.appendChild(ataque);

  const espacos = document.createElement("p");

  if (
    personagem.magias.espacosMagia !== undefined &&
    personagem.magias.espacosMagia.nivel1 !== undefined
  ) {
    espacos.innerHTML =
      "<strong>Espaços de magia de 1º círculo:</strong> " +
      personagem.magias.espacosMagia.nivel1.maximos;
  } else {
    espacos.innerHTML = "<strong>Espaços de magia:</strong> -";
  }

  resumo.appendChild(espacos);

  return resumo;
}

function selecionarMagia(grupo, idMagia, limite) {
  let escolhas = personagem.magias[grupo];

  if (Array.isArray(escolhas) === false) {
    escolhas = [];
  }

  const jaEscolhida = escolhas.includes(idMagia);

  if (jaEscolhida) {
    escolhas = escolhas.filter(function (idEscolhido) {
      return idEscolhido !== idMagia;
    });
  } else {
    if (escolhas.length >= limite) {
      const mensagem = document.getElementById("mensagemMagias");

      if (mensagem !== null) {
        mensagem.textContent = "Você já escolheu o número máximo de magias deste grupo.";
      }

      return;
    }

    escolhas.push(idMagia);
  }

  personagem.magias[grupo] = escolhas;

  const mensagem = document.getElementById("mensagemMagias");

  if (mensagem !== null) {
    mensagem.textContent = "";
  }

  montarTelaMagias();
  atualizarFichaMagias();
}

function criarCardMagia(magia, grupo, limite) {
  const card = document.createElement("article");
  card.classList.add("card-opcao");
  card.setAttribute("role", "button");
  card.tabIndex = 0;

  const escolhas = personagem.magias[grupo] || [];

  if (escolhas.includes(magia.id)) {
    card.classList.add("selecionado");
  }

  const titulo = document.createElement("h4");
  titulo.textContent = magia.nome;
  card.appendChild(titulo);

  const dados = document.createElement("p");
  dados.classList.add("texto-explicativo");

  const nivelTexto = magia.nivel === 0 ? "Truque" : magia.nivel + "º círculo";

  dados.textContent =
    nivelTexto +
    " • " +
    magia.escola +
    " • " +
    magia.tempoConjuracao +
    " • Alcance: " +
    magia.alcance;

  card.appendChild(dados);

  const descricao = document.createElement("p");
  descricao.textContent = magia.descricaoCurta;
  card.appendChild(descricao);

  if (magia.exigeAtaqueMagico === true) {
    const ataque = document.createElement("p");
    ataque.classList.add("texto-explicativo");
    ataque.textContent = "Usa ataque mágico.";
    card.appendChild(ataque);
  }

  if (magia.exigeSalvaguarda === true) {
    const salvaguarda = document.createElement("p");
    salvaguarda.classList.add("texto-explicativo");
    salvaguarda.textContent =
      "Exige salvaguarda de " + obterNomeAtributoConjuracao(magia.salvaguarda) + ".";
    card.appendChild(salvaguarda);
  }

  card.addEventListener("click", function () {
    selecionarMagia(grupo, magia.id, limite);
  });

  card.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      selecionarMagia(grupo, magia.id, limite);
    }
  });

  return card;
}

function montarGrupoMagias(tituloGrupo, nivelMagia, grupo, quantidadeEscolhas) {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-magias");

  const titulo = document.createElement("h3");
  titulo.textContent = tituloGrupo;
  bloco.appendChild(titulo);

  const escolhasAtuais = personagem.magias[grupo] || [];

  const explicacao = document.createElement("p");
  explicacao.classList.add("texto-explicativo");
  explicacao.textContent =
    "Escolha " +
    quantidadeEscolhas +
    ". Selecionadas: " +
    escolhasAtuais.length +
    " / " +
    quantidadeEscolhas +
    ".";

  bloco.appendChild(explicacao);

  const magias = obterMagiasDaClassePorNivel(personagem.classeId, nivelMagia);

  if (magias.length === 0) {
    const aviso = document.createElement("p");
    aviso.classList.add("texto-explicativo");
    aviso.textContent = "Nenhuma magia cadastrada para este grupo.";
    bloco.appendChild(aviso);

    areaMagias.appendChild(bloco);
    return;
  }

  const grade = document.createElement("div");
  grade.classList.add("grade-opcoes");

  magias.forEach(function (magia) {
    const card = criarCardMagia(magia, grupo, quantidadeEscolhas);
    grade.appendChild(card);
  });

  bloco.appendChild(grade);
  areaMagias.appendChild(bloco);
}

function montarTelaMagias() {
  areaMagias.innerHTML = "";

  const classeId = personagem.classeId;

  if (classeId === "") {
    areaMagias.textContent = "Escolha uma classe antes de visualizar magias.";
    return;
  }

  const progressao = obterProgressaoMagiasAtual();

  if (progressao === undefined || progressao.temMagias !== true) {
    const aviso = document.createElement("p");
    aviso.classList.add("texto-explicativo");
    aviso.textContent =
      "Este personagem não possui escolhas de magia cadastradas para o nível atual.";

    areaMagias.appendChild(aviso);

    personagem.magias = {};
    atualizarFichaMagias();

    return;
  }

  if (personagem.magias === undefined || personagem.magias.atributoConjuracao === undefined) {
    inicializarMagiasPersonagem();
  }

  atualizarNumerosMagiasPersonagem();

  if (progressao.mensagem !== undefined && progressao.mensagem !== "") {
    const aviso = document.createElement("p");
    aviso.classList.add("texto-explicativo");
    aviso.textContent = progressao.mensagem;
    areaMagias.appendChild(aviso);
  }

  areaMagias.appendChild(criarResumoConjuracao(progressao));

  montarGrupoMagias("Truques", 0, "truquesConhecidos", progressao.truquesConhecidos);

  montarGrupoMagias(
    "Magias preparadas de 1º círculo",
    1,
    "magiasPreparadas",
    progressao.magiasPreparadas,
  );

  atualizarFichaMagias();
}

function atualizarFichaMagias() {
  atualizarNumerosMagiasPersonagem();
  atualizarFichaPersonagem(["magias"]);
}

function magiasEstaoEscolhidas() {
  const progressao = obterProgressaoMagiasAtual();

  if (progressao === undefined || progressao.temMagias !== true) {
    return true;
  }

  if (personagem.magias === undefined || personagem.magias.atributoConjuracao === undefined) {
    return false;
  }

  const truques = personagem.magias.truquesConhecidos || [];
  const magiasPreparadas = personagem.magias.magiasPreparadas || [];

  return (
    truques.length === progressao.truquesConhecidos &&
    magiasPreparadas.length === progressao.magiasPreparadas
  );
}

