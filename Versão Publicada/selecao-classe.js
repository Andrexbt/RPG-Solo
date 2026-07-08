const cardsClasse = document.querySelectorAll(".card-classe");
const modalClasse = document.getElementById("modalClasse");
const botaoVoltarModal = document.getElementById("botaoVoltarModal");
const modalTituloClasse = document.getElementById("modalTituloClasse");
const modalImagemClasse = document.getElementById("modalImagemClasse");
const modalDescricaoClasse = document.getElementById("modalDescricaoClasse");
const modalEstiloJogoClasse = document.getElementById("modalEstiloJogoClasse");
const modalHabilidadesClasse = document.getElementById("modalHabilidadesClasse");
const dadosClasses = {
  guerreiro: {
    nome: "Guerreiro",
    dadoVida: 10,
    imagem: "imagens/classes/guerreiro.png",
    funcionamento: "O Guerreiro é uma classe voltada ao domínio do combate físico. Ele se destaca pelo uso de armas, armaduras e treinamento marcial, podendo atuar como linha de frente, defensor ou atacante principal.",
    estilo: "Recomendado para jogadores que gostam de combate direto, resistência, presença constante em batalha e domínio de armas e armaduras.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Guerreiro conforme as regras usadas pelo jogo."
  },

  mago: {
    nome: "Mago",
    dadoVida: 6,
    imagem: "imagens/classes/mago.png",
    funcionamento: "O Mago é uma classe voltada ao domínio da magia. Ele se destaca pelo estudo e manipulação de feitiços, podendo atuar como suporte, controlador de campo ou atacante mágico.",
    estilo: "Recomendado para jogadores que gostam de magia, estratégias complexas, controle do ambiente e uso de poderes sobrenaturais.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Mago conforme as regras usadas pelo jogo."
  },

  ladino: {
    nome: "Ladino",
    dadoVida: 8,
    imagem: "imagens/classes/ladino.png",
    funcionamento: "O Ladino é uma classe voltada ao roubo, intrusão e combate desarmado. Ele se destaca pela agilidade, precisão e habilidades de furtividade, podendo atuar como explorador, assasino ou ladrão.",
    estilo: "Recomendado para jogadores que gostam de ação rápida, furtividade, estratégias de engano e uso de armas leves.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Ladino conforme as regras usadas pelo jogo."
  },

  clerigo: {
    nome: "Clérigo",
    dadoVida: 8,
    imagem: "imagens/classes/clérigo.png",
    funcionamento: "O Clérigo é uma classe voltada ao domínio da fé e da cura. Ele se destaca pela capacidade de canalizar os poderes de sua divindade, podendo atuar como curandeiro, defensor ou atacante divino.",
    estilo: "Recomendado para jogadores que gostam de apoio, cura, proteção e uso de poderes divinos.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Clérigo conforme as regras usadas pelo jogo."
  }
};
const botoesPasso = document.querySelectorAll(".passo");
const conteudosPasso = document.querySelectorAll(".conteudo-passo");
const botaoProximoPasso = document.querySelectorAll(".botao-proximo");

const ordemPassos =[
  "classe",
  "atributos",
  "antecedente",
  "especie",
  "habilidades",
  "magias",
  "detalhes",
  "revisao",
];
let passoAtual = "classe";
let maiorPassoLiberado = 0;
let temporizadorMensagemNavegacao = null;
const mensagemNavegacao = document.getElementById("mensagemNavegacao");

const cardsAntecedente = document.querySelectorAll("[data-antecedente]");
const fichaAntecedente = document.getElementById("fichaAntecedente");
const fichaHabilidades = document.getElementById("fichaHabilidades");
const cardsEspecie = document.querySelectorAll("[data-especie]")
const fichaEspecie = document.getElementById("fichaEspecie")
const areaMagias = document.getElementById("areaMagias");
const gerarAtributos = document.getElementById("gerar-atributos");
const dadosAtributo = document.querySelectorAll(".dado");
const rolagemAtual = document.getElementById("rolagemAtual");
const resultadosAtributos = document.querySelectorAll("#resultadosAtributos span");
let atributosRolados = [];
let rolando = false;
const seletoresAtributos = document.querySelectorAll("[data-atributo]")
const armaduraInicial = document.getElementById("armaduraInicial");
const armaPrincipal = document.getElementById("armaPrincipal");
const itemSecundario = document.getElementById("itemSecundario");
const proficienciasClasse = document.getElementById("proficienciasClasse");
const fichaArmadura = document.getElementById("fichaArmadura");
const fichaArmaPrincipal = document.getElementById("fichaArmaPrincipal");
const fichaItemSecundario = document.getElementById("fichaItemSecundario");
const fichaProficiencias = document.getElementById("fichaProficiencias");
let classeAtualNaModal = "";
const botaoSelecionarClasse = document.getElementById("botaoSelecionarClasse");
const fichaClasseNivel = document.getElementById("fichaClasseNivel");
const areaHabilidadesClasse = document.getElementById("areaHabilidadesClasse");
const nomePersonagem = document.getElementById("nomePersonagem");
const fichaNome = document.getElementById("fichaNome");

const seletorIdioma1 = document.getElementById("idioma1");
const seletorIdioma2 = document.getElementById("idioma2");
const fichaIdiomas = document.getElementById("fichaIdiomas");
let idiomasEscolhidos = ["", ""];

const fichaClasseArmadura = document.getElementById("fichaClasseArmadura");
const resultadoClasseArmadura = document.getElementById("resultadoClasseArmadura");
const idiomasDisponiveis = [
  "Anão",
  "Élfico",
  "Gigante",
  "Gnomo",
  "Goblin",
  "Halfling",
  "Orc",
  "Dracônico"
];
const proficienciasPorClasse = {
  guerreiro: [
    "Armaduras leves",
    "Armaduras médias",
    "Armaduras pesadas",
    "Escudos",
    "Armas simples",
    "Armas marciais"
  ],

  mago: [
    "Adagas",
    "Cajados",
    "Bestas leves"
  ],

  ladino: [
    "Armaduras leves",
    "Armas simples",
    "Bestas de mão",
    "Espadas curtas"
  ],

  clerigo: [
    "Armaduras leves",
    "Armaduras médias",
    "Escudos",
    "Armas simples"
  ]
};

const pvAtuais = document.getElementById("pvAtuais");
const pvTemporarios = document.getElementById("pvTemporarios");
const pvMaximo = document.getElementById("pvMaximo");
const dadosVidaUsados = document.getElementById("dadosVidaUsados");
const dadosVidaMaximos = document.getElementById("dadosVidaMaximos");

const fichaIniciativa = document.getElementById("fichaIniciativa");
const fichaVelocidade = document.getElementById("fichaVelocidade");
const fichaTamanho = document.getElementById("fichaTamanho");
const fichaPercepcaoPassiva = document.getElementById("fichaPercepcaoPassiva");

const areaRevisao = document.getElementById("areaRevisao");
let personagemJaFoiSalvo = false;
const botaoFinalizarPersonagem = document.getElementById("botaoFinalizarPersonagem");
const acoesPersonagemSalvo = document.getElementById("acoesPersonagemSalvo");

const personagem = {
  classeId:"",
  classe: "",
  atributos: {},
  antecedente: "",
  especieId: "",
  especie:"",
  idiomas: [],

  habilidades:{
     escolhas:{},
  },

  magias:{},

  detalhes:{
    nome:"",
    equipamentos:{},
  },
};

function selecionarClasse(){
  const dados = dadosClasses[classeAtualNaModal];

  personagem.classeId = classeAtualNaModal;
  personagem.classe = dados.nome;

  fichaClasseNivel.textContent = dados.nome + " 1";

  atualizarFichaHabilidades();
  atualizarEquipamentos();
  atualizarPontosDeVida();

  cardsClasse.forEach(function(card){
    card.classList.remove("selecionado");

    if (card.dataset.classe === classeAtualNaModal){
      card.classList.add("selecionado");
    }
  });

  fecharModal();
}

botaoSelecionarClasse.addEventListener("click", selecionarClasse);

function abrirModal(classeEscolhida) {
  classeAtualNaModal = classeEscolhida;

    const dados = dadosClasses[classeEscolhida];

    modalTituloClasse.textContent = dados.nome;
    modalImagemClasse.src = dados.imagem;
    modalImagemClasse.alt = dados.nome;
    modalDescricaoClasse.textContent = dados.funcionamento;
    modalEstiloJogoClasse.textContent = dados.estilo;
    modalHabilidadesClasse.textContent = dados.habilidades;
    

  modalClasse.classList.remove("escondida");
}

function fecharModal() {
  modalClasse.classList.add("escondida");
}

cardsClasse.forEach(function(card) {
  card.addEventListener("click", function() {
    const classeEscolhida = card.dataset.classe;

    abrirModal(classeEscolhida);
  });
});

botaoVoltarModal.addEventListener("click", function() {
  fecharModal();
});

function irParaPasso(nomePasso) {
  passoAtual = nomePasso;

  conteudosPasso.forEach(function(conteudo) {
    conteudo.classList.add("escondida");
  });

  const conteudoAtual = document.getElementById("passo-" + nomePasso);
  
  if (conteudoAtual !== null) {
    conteudoAtual.classList.remove("escondida");
  }

  botoesPasso.forEach(function(botao) {
    botao.classList.remove("atual");

    if (botao.dataset.passo === nomePasso) {
      botao.classList.add("atual");
    }
  });

    if (nomePasso === "habilidades") {
    montarTelaHabilidades();
  }

  if (nomePasso === "magias") {
  montarTelaMagias();
  }

  if (nomePasso === "revisao") {
  montarTelaRevisao();
}

}

atualizarEstadoNavegacao();

botoesPasso.forEach(function(botao) {
  botao.addEventListener("click", function() {
    const passoEscolhido = botao.dataset.passo;
    const indiceEscolhido = ordemPassos.indexOf(passoEscolhido);

    if (indiceEscolhido > maiorPassoLiberado) {
      mostrarMensagemNavegacao("Complete os passos anteriores antes de acessar esta etapa.");
      return;
    }
    
      mostrarMensagemNavegacao("");
      irParaPasso(passoEscolhido);
  });
});

botaoProximoPasso.forEach(function(botao) {
  botao.addEventListener("click", function() {
    if (podeAvancarDoPassoAtual() === false) {
      return;
    }

    const indiceAtual = ordemPassos.indexOf(passoAtual);
    const proximoIndice = indiceAtual + 1;
    const proximoPasso = ordemPassos[proximoIndice];

    if (proximoPasso !== undefined) {
      liberarPasso(proximoPasso);
      mostrarMensagemNavegacao("");
      irParaPasso(proximoPasso);

      atualizarEstadoNavegacao();
    }
  });
});

function selecionarAntecedente(cardClicado) {
  cardsAntecedente.forEach(function(card) {
    card.classList.remove("selecionado");
  });

  cardClicado.classList.add("selecionado");

  const antecedenteEscolhido = cardClicado.dataset.antecedente;
  const nomeAntecedente = cardClicado.querySelector("h4").textContent;

  personagem.antecedente = nomeAntecedente;

  fichaAntecedente.textContent = nomeAntecedente;
}

cardsAntecedente.forEach(function(card) {
  card.addEventListener("click", function() {
    selecionarAntecedente(card);
  });
});

cardsEspecie.forEach(function(card) {
  card.addEventListener("click", function() {
    selecionarEspecie(card);
  });
});

function selecionarEspecie(cardClicado) {
  cardsEspecie.forEach(function(card) {
    card.classList.remove("selecionado");
  });

  cardClicado.classList.add("selecionado");

  const especieId = cardClicado.dataset.especie;
  const nomeEspecie = cardClicado.querySelector("h4").textContent;

  personagem.especie = nomeEspecie;
  personagem.especieId = especieId;

  fichaEspecie.textContent = nomeEspecie;

  atualizarValoresDerivados();
}

gerarAtributos.addEventListener("click", dadosRolando);

function rolarD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function resultadoAtributo(valoresDados) {
  const menorValor = Math.min(...valoresDados);
  const valorDescartado = valoresDados.indexOf(menorValor);

  let soma = 0;

  valoresDados.forEach(function(valor, indice) {
    if (indice !== valorDescartado) {
      soma = soma + valor;
    }
  });

  return {
    soma: soma,
    valorDescartado: valorDescartado
  };
}

function dadosRolando() {
  if (rolando === true) {
    return;
  }

  if (atributosRolados.length >= 6) {
    return;
  }

  rolando = true;

  dadosAtributo.forEach(function(dado) {
    dado.classList.remove("descartado");
    dado.classList.add("rolando");
  });

  rolagemAtual.textContent = "Rolando...";

  const animacao = setInterval(function() {
    dadosAtributo.forEach(function(dado) {
      dado.textContent = rolarD6() ;
    });
  },80);

  setTimeout(function() {
    clearInterval(animacao);

    const valoresFinais = [
      rolarD6(),
      rolarD6(),
      rolarD6(),
      rolarD6(),
    ];

    dadosAtributo.forEach(function(dado, indice){
      dado.textContent = valoresFinais[indice];
      dado.classList.remove("rolando");
    });

    const resultado = resultadoAtributo(valoresFinais);

    dadosAtributo[resultado.valorDescartado].classList.add("descartado");

    rolagemAtual.textContent = "Resultado: " + resultado.soma;

    atributosRolados.push(resultado.soma);

    atualizarResultadosAtributos();

    rolando = false;
  }, 1000);
}

function atualizarResultadosAtributos() {
  resultadosAtributos.forEach(function(casa, indice) {
    if (atributosRolados[indice] !== undefined) {
      casa.textContent = atributosRolados[indice];
    } else {
      casa.textContent = "—";
    }
  });

  if (atributosRolados.length >= 6) {
    gerarAtributos.disabled = true;
    gerarAtributos.textContent = "Atributos Rolados";

    preencherSeletoresAtributos();
  }
}

function atualizarFichaHabilidades() {
  fichaHabilidades.innerHTML = "";

  const classeId = personagem.classeId;

  if (classeId === "") {
    fichaHabilidades.innerHTML = "<li>—</li>";
    return;
  }

  const dadosDaClasse = window.bancoHabilidades.progressaoClasses[classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    fichaHabilidades.innerHTML = "<li>—</li>";
    return;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  dadosNivel1.habilidadesAutomaticas.forEach(function(idHabilidade) {
    const habilidade = window.bancoHabilidades.habilidades[idHabilidade];

    const item = document.createElement("li");
    item.textContent = habilidade.nome;

    fichaHabilidades.appendChild(item);
  });

  dadosNivel1.escolhas.forEach(function(escolha) {
    const idOpcaoEscolhida = personagem.habilidades.escolhas[escolha.grupo];

    if (idOpcaoEscolhida !== undefined) {
      const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];

      const opcao = grupo.opcoes.find(function(opcao) {
        return opcao.id === idOpcaoEscolhida;
      });

      const item = document.createElement("li");
      item.textContent = grupo.nome + ": " + opcao.nome;

      fichaHabilidades.appendChild(item);
    }
  });

  if (fichaHabilidades.children.length === 0) {
    fichaHabilidades.innerHTML = "<li>—</li>";
  }
}

function preencherSeletoresAtributos(){
  seletoresAtributos.forEach(function(seletor){
    seletor.innerHTML = "";

    const opcaoInicial = document.createElement("option")
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Escolha";
    seletor.appendChild(opcaoInicial);

    atributosRolados.forEach(function(valor, indice) {
      const opcao = document.createElement("option");

      opcao.value = indice;
      opcao.textContent = valor;

      seletor.appendChild(opcao);
    });
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

const camposFichaAtributos = {
  forca: {
    valor: document.getElementById("valfor"),
    modificador: document.getElementById("modfor")
  },
  destreza: {
    valor: document.getElementById("valdes"),
    modificador: document.getElementById("moddes")
  },
  constituicao: {
    valor: document.getElementById("valcon"),
    modificador: document.getElementById("modcon")
  },
  inteligencia: {
    valor: document.getElementById("valint"),
    modificador: document.getElementById("modint")
  },
  sabedoria: {
    valor: document.getElementById("valsab"),
    modificador: document.getElementById("modsab")
  },
  carisma: {
    valor: document.getElementById("valcar"),
    modificador: document.getElementById("modcar")
  }
};

function selecionarAtributo(seletor) {
  const nomeAtributo = seletor.dataset.atributo;
  const campoFicha = camposFichaAtributos[nomeAtributo];

  if (seletor.value === "") {
    personagem.atributos[nomeAtributo] = "";

    campoFicha.valor.textContent = "—";
    campoFicha.modificador.textContent = "mod —";

    atualizarOpcoesDisponiveis();
    atualizarClasseArmadura();
    atualizarPontosDeVida();
    atualizarValoresDerivados();

    return;
  }

   const indiceValorEscolhido = Number(seletor.value);
  const valorEscolhido = atributosRolados[indiceValorEscolhido];

  personagem.atributos[nomeAtributo] = valorEscolhido;

  const modificador = calcularModificador(valorEscolhido);

  campoFicha.valor.textContent = valorEscolhido;
  campoFicha.modificador.textContent = formatarModificador(modificador);

  atualizarOpcoesDisponiveis();
    atualizarClasseArmadura();
    atualizarPontosDeVida();
    atualizarValoresDerivados();
}

function atualizarOpcoesDisponiveis() {
  const indicesUsados = [];

  seletoresAtributos.forEach(function(seletor) {
    if (seletor.value !== "") {
      indicesUsados.push(seletor.value);
    }
  });

  seletoresAtributos.forEach(function(seletor) {
    const valorAtualDoSeletor = seletor.value;

    const opcoes = seletor.querySelectorAll("option");

    opcoes.forEach(function(opcao) {
      if (opcao.value === "") {
        opcao.disabled = false;
        return;
      }

      if (opcao.value === valorAtualDoSeletor) {
        opcao.disabled = false;
        return;
      }

      opcao.disabled = indicesUsados.includes(opcao.value);
    });
  });
}

seletoresAtributos.forEach(function(seletor) {
  seletor.addEventListener("change", function() {
    selecionarAtributo(seletor);
  });
});

function atributosEstaoCompletos(){
  const nomesAtributos = [
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma"
  ];

  return nomesAtributos.every(function(nomeAtributo){
  return personagem.atributos[nomeAtributo] !== undefined &&
         personagem.atributos[nomeAtributo] !== "";
  });
}

function classeEstaEscolhida(){
  return personagem.classe !== "";
}

function antecedenteEstaEscolhido() {
  return personagem.antecedente !== "";
}

function especieEstaEscolhida(){
  return personagem.especie !== "";
}

function habilidadesEstaoEscolhidas(){
  const classeId = personagem.classeId;

  if (classeId === "") {
    return false;
  }

  const dadosDaClasse = window.bancoHabilidades.progressaoClasses[classeId];

  if (dadosDaClasse === undefined) {
    return true;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  if (dadosNivel1 === undefined) {
    return true;
  }

  const escolhasObrigatorias = dadosNivel1.escolhas;

  return escolhasObrigatorias.every(function(escolha) {
    return personagem.habilidades.escolhas[escolha.grupo] !== undefined;
  });
}

function podeAvancarDoPassoAtual() {

  
  if (passoAtual === "classe") {
    const mensagem = document.getElementById("mensagemClasse");

    if (classeEstaEscolhida() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Escolha uma classe antes de continuar.";
      }

      return false;
    }

    if (mensagem !== null) {
      mensagem.textContent = "";
    }
  }

  if (passoAtual === "atributos") {
    const mensagem = document.getElementById("mensagemAtributos");

    if (atributosEstaoCompletos() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Distribua todos os atributos antes de continuar.";
      }

      return false;
    }

    if (mensagem !== null) {
      mensagem.textContent = "";
    }
  }

  if (passoAtual === "antecedente") {
    const mensagem = document.getElementById("mensagemAntecedente");

    if (antecedenteEstaEscolhido() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Escolha um antecedente antes de continuar.";
      }

      return false;
    }

    if (mensagem !== null) {
      mensagem.textContent = "";
    }
  }

  if (passoAtual === "especie") {
    const mensagem = document.getElementById("mensagemEspecie");

    if (especieEstaEscolhida() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Escolha uma espécie antes de continuar.";
      }

      return false;
    }

    if (mensagem !== null) {
      mensagem.textContent = "";
    }
  }

  if (passoAtual === "habilidades") {
    const mensagem = document.getElementById("mensagemHabilidades");

    if (habilidadesEstaoEscolhidas() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Escolha suas habilidades antes de continuar.";
      }

      return false;
    }

    if (mensagem !== null) {
      mensagem.textContent = "";
    }
  }

  if (passoAtual === "detalhes") {
  const mensagem = document.getElementById("mensagemDetalhes");

  if (detalhesEstaoCompletos() === false) {
    if (mensagem !== null) {
      mensagem.textContent =
        "Faça todas as escolhas antes de continuar.";
    }

    return false;
  }

  if (mensagem !== null) {
    mensagem.textContent = "";
  }
}

  return true;
}

function montarTelaHabilidades() {
  areaHabilidadesClasse.innerHTML = "";

  const classeId = personagem.classeId;

  if (classeId === "") {
    areaHabilidadesClasse.textContent = "Escolha uma classe antes de visualizar as habilidades.";
    return;
  }

  const dadosDaClasse = window.bancoHabilidades.progressaoClasses[classeId];

  if (dadosDaClasse === undefined) {
    areaHabilidadesClasse.textContent = "Ainda não há habilidades cadastradas para esta classe.";
    return;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  if (dadosNivel1 === undefined) {
    areaHabilidadesClasse.textContent = "Ainda não há habilidades cadastradas para este nível.";
    return;
  }

  const titulo = document.createElement("h3");
  titulo.textContent = "Habilidades de " + personagem.classe;
  areaHabilidadesClasse.appendChild(titulo);

  montarHabilidadesAutomaticas(dadosNivel1);
  montarEscolhasDeHabilidades(dadosNivel1);
}

function montarHabilidadesAutomaticas(dadosNivel) {
  const habilidadesAutomaticas = dadosNivel.habilidadesAutomaticas;

  if (habilidadesAutomaticas.length === 0) {
    return;
  }

  const bloco = document.createElement("section");
  bloco.classList.add("bloco-habilidades");

  const subtitulo = document.createElement("h4");
  subtitulo.textContent = "Habilidades automáticas";
  bloco.appendChild(subtitulo);

  const grade = document.createElement("div");
  grade.classList.add("grade-opcoes");

  habilidadesAutomaticas.forEach(function(idHabilidade) {
    const habilidade = window.bancoHabilidades.habilidades[idHabilidade];

    const card = document.createElement("article");
    card.classList.add("card-opcao");

    const nome = document.createElement("h4");
    nome.textContent = habilidade.nome;

    const descricao = document.createElement("p");
    descricao.textContent = habilidade.descricaoCurta;

    card.appendChild(nome);
    card.appendChild(descricao);

    grade.appendChild(card);
  });

  bloco.appendChild(grade);
  areaHabilidadesClasse.appendChild(bloco);
}

function montarEscolhasDeHabilidades(dadosNivel) {
  const escolhas = dadosNivel.escolhas;

  if (escolhas.length === 0) {
    return;
  }

  escolhas.forEach(function(escolha) {
    const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];

    const bloco = document.createElement("section");
    bloco.classList.add("bloco-habilidades");

    const subtitulo = document.createElement("h4");
    subtitulo.textContent = grupo.nome + " — escolha " + escolha.quantidade;
    bloco.appendChild(subtitulo);

    const grade = document.createElement("div");
    grade.classList.add("grade-opcoes");

    grupo.opcoes.forEach(function(opcao) {
      const card = document.createElement("article");
      card.classList.add("card-opcao");
      card.dataset.grupoEscolha = grupo.id;
      card.dataset.opcaoEscolha = opcao.id;

      const nome = document.createElement("h4");
      nome.textContent = opcao.nome;

      const descricao = document.createElement("p");
      descricao.textContent = opcao.descricaoCurta;

      card.appendChild(nome);
      card.appendChild(descricao);

      card.addEventListener("click", function() {
           selecionarOpcaoDeHabilidade(card);
      });

      grade.appendChild(card);
    });

    bloco.appendChild(grade);
    areaHabilidadesClasse.appendChild(bloco);
  });
}

function selecionarOpcaoDeHabilidade(cardClicado) {
  const grupoEscolha = cardClicado.dataset.grupoEscolha;
  const opcaoEscolha = cardClicado.dataset.opcaoEscolha;

  const cardsDoMesmoGrupo = document.querySelectorAll(
    '[data-grupo-escolha="' + grupoEscolha + '"]'
  );

  cardsDoMesmoGrupo.forEach(function(card) {
    card.classList.remove("selecionado");
  });

  cardClicado.classList.add("selecionado");

  personagem.habilidades.escolhas[grupoEscolha] = opcaoEscolha;

  atualizarFichaHabilidades();
}

function montarTelaMagias() {
  areaMagias.innerHTML = "";

  const classeId = personagem.classeId;

  if (classeId === "") {
    areaMagias.textContent = "Escolha uma classe antes de visualizar magias.";
    return;
  }

  const dadosMagiaClasse = window.bancoMagias.progressaoMagias[classeId];

  if (dadosMagiaClasse === undefined || dadosMagiaClasse.nivel1 === undefined) {
    const aviso = document.createElement("p");
    aviso.classList.add("texto-explicativo");
    aviso.textContent =
      "Este personagem não possui escolhas de magia cadastradas para o nível atual.";

    areaMagias.appendChild(aviso);
    return;
  }

  const dadosNivel1 = dadosMagiaClasse.nivel1;

  const aviso = document.createElement("p");
  aviso.classList.add("texto-explicativo");
  aviso.textContent = dadosNivel1.mensagem;

  areaMagias.appendChild(aviso);

  const bloco = document.createElement("div");
  bloco.classList.add("bloco-magias");

  bloco.textContent = "A seleção detalhada de magias será implementada depois.";

  areaMagias.appendChild(bloco);
}

nomePersonagem.addEventListener("input", function() {
  personagem.detalhes.nome = nomePersonagem.value;

  if (nomePersonagem.value === "") {
    fichaNome.textContent = "-";
  } else {
    fichaNome.textContent = nomePersonagem.value;
  }
});

function montarSeletorIdioma(seletor, indiceDoSeletor) {
  const valorAtual = idiomasEscolhidos[indiceDoSeletor];
  const indiceDoOutroSeletor = indiceDoSeletor === 0 ? 1 : 0;
  const valorDoOutroSeletor = idiomasEscolhidos[indiceDoOutroSeletor];

  seletor.innerHTML = "";

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Escolha";
  seletor.appendChild(opcaoInicial);

  idiomasDisponiveis.forEach(function(idioma) {
    if (idioma === valorDoOutroSeletor) {
      return;
    }

    const opcao = document.createElement("option");
    opcao.value = idioma;
    opcao.textContent = idioma;

    seletor.appendChild(opcao);
  });

  seletor.value = valorAtual;
}

function montarSeletoresIdiomas() {
  montarSeletorIdioma(seletorIdioma1, 0);
  montarSeletorIdioma(seletorIdioma2, 1);
}

function salvarIdiomasNoPersonagem() {
  personagem.idiomas = [];

  idiomasEscolhidos.forEach(function(idioma) {
    if (idioma !== "") {
      personagem.idiomas.push(idioma);
    }
  });
}

function atualizarFichaIdiomas() {
  if (personagem.idiomas.length === 0) {
    fichaIdiomas.textContent = "-";
    return;
  }

  fichaIdiomas.textContent = personagem.idiomas.join(", ");
}

function atualizarIdiomas() {
  salvarIdiomasNoPersonagem();
  atualizarFichaIdiomas();
  montarSeletoresIdiomas();
}

seletorIdioma1.addEventListener("change", function() {
  idiomasEscolhidos[0] = seletorIdioma1.value;

  if (idiomasEscolhidos[0] === idiomasEscolhidos[1]) {
    idiomasEscolhidos[1] = "";
  }

  atualizarIdiomas();
});

seletorIdioma2.addEventListener("change", function() {
  idiomasEscolhidos[1] = seletorIdioma2.value;

  if (idiomasEscolhidos[1] === idiomasEscolhidos[0]) {
    idiomasEscolhidos[0] = "";
  }

  atualizarIdiomas();
});

montarSeletoresIdiomas();

function atualizarEquipamentos() {
  personagem.detalhes.equipamentos = {
    armadura: armaduraInicial.value,
    armaPrincipal: armaPrincipal.value,
    itemSecundario: itemSecundario.value,
    proficiencias: proficienciasPorClasse[personagem.classeId] || []
  };

  atualizarFichaEquipamentos();
  atualizarClasseArmadura();
}

function atualizarFichaEquipamentos() {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    fichaArmadura.textContent = "";
    fichaArmaPrincipal.textContent = "";
    fichaItemSecundario.textContent = "";
    fichaProficiencias.textContent = "";
    return;
  }
  const armadura = bancoEquipamentos.armaduras[equipamentos.armadura];

if (armadura === undefined) {
  fichaArmadura.textContent = "";
} else {
  fichaArmadura.textContent = armadura.nome;
}

  fichaArmaPrincipal.textContent =
    bancoEquipamentos.armas[equipamentos.armaPrincipal] || "";

  const item = bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

if (item === undefined) {
  fichaItemSecundario.textContent = "";
} else {
  fichaItemSecundario.textContent = item.nome;
}

  if (equipamentos.proficiencias.length === 0) {
    fichaProficiencias.textContent = "";
  } else {
    fichaProficiencias.textContent = equipamentos.proficiencias.join(", ");
  }

  if (proficienciasClasse !== null) {
    proficienciasClasse.textContent = fichaProficiencias.textContent;
  }
}

armaduraInicial.addEventListener("change", function() {
  atualizarEquipamentos();
});

armaPrincipal.addEventListener("change", function() {
  atualizarEquipamentos();
});

itemSecundario.addEventListener("change", function() {
  atualizarEquipamentos();
});

function calcularClasseArmadura() {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    return "";
  }

  const idArmadura = equipamentos.armadura;
  const idItemSecundario = equipamentos.itemSecundario;

  const armadura = window.bancoEquipamentos.armaduras[idArmadura];
  const itemSecundario = window.bancoEquipamentos.itensSecundarios[idItemSecundario];

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
      classeArmadura = classeArmadura + Math.min(modificadorDestreza, armadura.limiteDestreza);
    }
  }

  if (itemSecundario !== undefined && itemSecundario.bonusCA !== undefined) {
    classeArmadura = classeArmadura + itemSecundario.bonusCA;
  }

  return classeArmadura;
}

function atualizarClasseArmadura() {
  const classeArmadura = calcularClasseArmadura();

  fichaClasseArmadura.textContent = classeArmadura;

  if (resultadoClasseArmadura !== null) {
    resultadoClasseArmadura.textContent = classeArmadura;
  }
}

function atualizarPontosDeVida() {
  const classeId = personagem.classeId;

  if (classeId === "") {
    pvAtuais.textContent = "";
    pvTemporarios.textContent = "";
    pvMaximo.textContent = "";
    dadosVidaUsados.textContent = "";
    dadosVidaMaximos.textContent = "";
    return;
  }

  const dadosClasse = dadosClasses[classeId];

  if (dadosClasse === undefined) {
    return;
  }

  const dadoVida = dadosClasse.dadoVida;
  const constituicao = personagem.atributos.constituicao;

  dadosVidaUsados.textContent = "0";
  dadosVidaMaximos.textContent = "1d" + dadoVida;

  if (constituicao === undefined || constituicao === "") {
    pvAtuais.textContent = "";
    pvTemporarios.textContent = "0";
    pvMaximo.textContent = "";
    return;
  }

  const modificadorConstituicao = calcularModificador(constituicao);
  const pontosDeVidaMaximos = dadoVida + modificadorConstituicao;

  pvMaximo.textContent = pontosDeVidaMaximos;
  pvAtuais.textContent = pontosDeVidaMaximos;
  pvTemporarios.textContent = "0";

  personagem.detalhes.pontosDeVida = {
    atuais: pontosDeVidaMaximos,
    temporarios: 0,
    maximo: pontosDeVidaMaximos,
    dadoVida: "1d" + dadoVida,
    dadosVidaUsados: 0
  };
}

function atualizarValoresDerivados() {
  atualizarIniciativa();
  atualizarVelocidadeETamanho();
  atualizarPercepcaoPassiva();
}

function atualizarIniciativa() {
  const destreza = personagem.atributos.destreza;

  if (destreza === undefined || destreza === "") {
    fichaIniciativa.textContent = "";
    return;
  }

  const modificadorDestreza = calcularModificador(destreza);

  fichaIniciativa.textContent = formatarModificador(modificadorDestreza);
}

function atualizarVelocidadeETamanho() {
  const especieId = personagem.especieId;

  if (especieId === "") {
    fichaVelocidade.textContent = "";
    fichaTamanho.textContent = "";
    return;
  }

  const dadosEspecie = window.bancoEspecies.especies[especieId];

  if (dadosEspecie === undefined) {
    fichaVelocidade.textContent = "";
    fichaTamanho.textContent = "";
    return;
  }

  fichaVelocidade.textContent = dadosEspecie.velocidade;
  fichaTamanho.textContent = dadosEspecie.tamanho;
}

function atualizarPercepcaoPassiva() {
  const sabedoria = personagem.atributos.sabedoria;

  if (sabedoria === undefined || sabedoria === "") {
    fichaPercepcaoPassiva.textContent = "";
    return;
  }

  const modificadorSabedoria = calcularModificador(sabedoria);
  const percepcaoPassiva = 10 + modificadorSabedoria;

  fichaPercepcaoPassiva.textContent = percepcaoPassiva;
}

function detalhesEstaoCompletos() {
  const nomePreenchido =
    personagem.detalhes.nome !== undefined &&
    personagem.detalhes.nome.trim() !== "";

  const idiomasPreenchidos =
    personagem.idiomas.length >= 2;

  const equipamentos = personagem.detalhes.equipamentos;

  const equipamentosPreenchidos =
    equipamentos !== undefined &&
    equipamentos.armadura !== undefined &&
    equipamentos.armadura !== "" &&
    equipamentos.armaPrincipal !== undefined &&
    equipamentos.armaPrincipal !== "" &&
    equipamentos.itemSecundario !== undefined &&
    equipamentos.itemSecundario !== "";

  return nomePreenchido && idiomasPreenchidos && equipamentosPreenchidos;
}

function atualizarEstadoNavegacao() {
  botoesPasso.forEach(function(botao) {
    const nomePasso = botao.dataset.passo;
    const indicePasso = ordemPassos.indexOf(nomePasso);

    if (indicePasso <= maiorPassoLiberado) {
      botao.classList.remove("bloqueado");
    } else {
      botao.classList.add("bloqueado");
    }
  });
}

function liberarPasso(nomePasso) {
  const indicePasso = ordemPassos.indexOf(nomePasso);

  if (indicePasso > maiorPassoLiberado) {
    maiorPassoLiberado = indicePasso;
  }

  atualizarEstadoNavegacao();
}

function mostrarMensagemNavegacao(texto) {
  if (mensagemNavegacao === null) {
    return;
  }

  mensagemNavegacao.textContent = texto;

  if (temporizadorMensagemNavegacao !== null) {
    clearTimeout(temporizadorMensagemNavegacao);
  }

  if (texto !== "") {
    temporizadorMensagemNavegacao = setTimeout(function() {
      mensagemNavegacao.textContent = "";
    }, 3000);
  }
}

function montarTelaRevisao() {
  areaRevisao.innerHTML = "";

  const blocoBasico = document.createElement("section");
  blocoBasico.classList.add("bloco-revisao");

  blocoBasico.innerHTML = `
    <h3>Informações Básicas</h3>
    <p><strong>Nome:</strong> ${personagem.detalhes.nome}</p>
    <p><strong>Classe:</strong> ${personagem.classe} 1</p>
    <p><strong>Antecedente:</strong> ${personagem.antecedente}</p>
    <p><strong>Espécie:</strong> ${personagem.especie}</p>
    <p><strong>Idiomas:</strong> ${personagem.idiomas.join(", ")}</p>
  `;

  areaRevisao.appendChild(blocoBasico);

  montarRevisaoAtributos();
  montarRevisaoEquipamentos();
  montarRevisaoHabilidades();
  montarRevisaoMagias();
}

function montarRevisaoAtributos() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  bloco.innerHTML = `
    <h3>Atributos</h3>

    <p><strong>Força:</strong> ${personagem.atributos.forca} (${formatarModificador(calcularModificador(personagem.atributos.forca))})</p>
    <p><strong>Destreza:</strong> ${personagem.atributos.destreza} (${formatarModificador(calcularModificador(personagem.atributos.destreza))})</p>
    <p><strong>Constituição:</strong> ${personagem.atributos.constituicao} (${formatarModificador(calcularModificador(personagem.atributos.constituicao))})</p>
    <p><strong>Inteligência:</strong> ${personagem.atributos.inteligencia} (${formatarModificador(calcularModificador(personagem.atributos.inteligencia))})</p>
    <p><strong>Sabedoria:</strong> ${personagem.atributos.sabedoria} (${formatarModificador(calcularModificador(personagem.atributos.sabedoria))})</p>
    <p><strong>Carisma:</strong> ${personagem.atributos.carisma} (${formatarModificador(calcularModificador(personagem.atributos.carisma))})</p>
  `;

  areaRevisao.appendChild(bloco);
}

function montarRevisaoEquipamentos() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const equipamentos = personagem.detalhes.equipamentos;

  const armadura = window.bancoEquipamentos.armaduras[equipamentos.armadura];
  const itemSecundario = window.bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

  bloco.innerHTML = `
    <h3>Equipamentos e Valores</h3>

    <p><strong>Armadura:</strong> ${armadura.nome}</p>
    <p><strong>Arma principal:</strong> ${window.bancoEquipamentos.armas[equipamentos.armaPrincipal]}</p>
    <p><strong>Item secundário:</strong> ${itemSecundario.nome}</p>

    <p><strong>Classe de Armadura:</strong> ${fichaClasseArmadura.textContent}</p>
    <p><strong>Pontos de Vida:</strong> ${pvMaximo.textContent}</p>
    <p><strong>Iniciativa:</strong> ${fichaIniciativa.textContent}</p>
    <p><strong>Velocidade:</strong> ${fichaVelocidade.textContent}</p>
    <p><strong>Tamanho:</strong> ${fichaTamanho.textContent}</p>
    <p><strong>Percepção Passiva:</strong> ${fichaPercepcaoPassiva.textContent}</p>
  `;

  areaRevisao.appendChild(bloco);
}

function montarRevisaoHabilidades() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Habilidades";
  bloco.appendChild(titulo);

  const lista = document.createElement("ul");

  const dadosDaClasse = window.bancoHabilidades.progressaoClasses[personagem.classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma habilidade cadastrada.";
    lista.appendChild(item);

    bloco.appendChild(lista);
    areaRevisao.appendChild(bloco);
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

  if (lista.children.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma habilidade selecionada.";
    lista.appendChild(item);
  }

  bloco.appendChild(lista);
  areaRevisao.appendChild(bloco);
}

function montarRevisaoMagias() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const dadosMagiaClasse = window.bancoMagias.progressaoMagias[personagem.classeId];

  if (dadosMagiaClasse === undefined || dadosMagiaClasse.nivel1 === undefined) {
    bloco.innerHTML = `
      <h3>Magias</h3>
      <p>Este personagem não possui escolhas de magia cadastradas para o nível atual.</p>
    `;

    areaRevisao.appendChild(bloco);
    return;
  }

  bloco.innerHTML = `
    <h3>Magias</h3>
    <p>${dadosMagiaClasse.nivel1.mensagem}</p>
    <p>A seleção detalhada de magias ainda será implementada.</p>
  `;

  areaRevisao.appendChild(bloco);
}

function salvarPersonagemLocal() {
  const personagensSalvos =
    JSON.parse(localStorage.getItem("personagensRpgSolo")) || [];

  const personagemParaSalvar = structuredClone(personagem);

  personagemParaSalvar.id = crypto.randomUUID();
  personagemParaSalvar.criadoEm = new Date().toISOString();

  personagensSalvos.push(personagemParaSalvar);

  localStorage.setItem(
    "personagensRpgSolo",
    JSON.stringify(personagensSalvos)
  );

  return personagemParaSalvar;
  
}

botaoFinalizarPersonagem.addEventListener("click", function() {
  if (personagemJaFoiSalvo === true) {
    return;
  }

  const personagemSalvo = salvarPersonagemLocal();

  personagemJaFoiSalvo = true;

  botaoFinalizarPersonagem.disabled = true;
  botaoFinalizarPersonagem.textContent = "Personagem salvo";

  const mensagem = document.getElementById("mensagemRevisao");

  if (mensagem !== null) {
    mensagem.textContent = "Personagem salvo com sucesso!";
  }

  acoesPersonagemSalvo.innerHTML = "";

  const linkVerFicha = document.createElement("a");
  linkVerFicha.classList.add("botao-link");
  linkVerFicha.href = "ver-personagem.html?id=" + personagemSalvo.id;
  linkVerFicha.textContent = "Ver ficha";

  const linkMeusPersonagens = document.createElement("a");
  linkMeusPersonagens.classList.add("botao-link");
  linkMeusPersonagens.href = "meus-personagens.html";
  linkMeusPersonagens.textContent = "Meus personagens";

  acoesPersonagemSalvo.appendChild(linkVerFicha);
  acoesPersonagemSalvo.appendChild(linkMeusPersonagens);

});