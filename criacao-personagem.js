// =====================================================
// 1. ELEMENTOS DO HTML
// -----------------------------------------------------
// Referências aos elementos da página usados pelo JavaScript.
// Estes consts ligam o código aos botões, campos, cards,
// áreas da ficha lateral, mensagens e seções da criação.
// =====================================================

// =====================================================
// Arquivo: criacao-personagem.js
// -----------------------------------------------------
// Controla o fluxo de criação: seleção, validação, ficha lateral, revisão e salvamento.
// =====================================================

// Atenção: neste arquivo a ordem das funções e dos eventos importa.
// Por isso, a organização abaixo usa comentários sem mover blocos de código.

const cardsClasse = document.querySelectorAll(".card-classe");
const modalClasse = document.getElementById("modalClasse");
const botaoVoltarModal = document.getElementById("botaoVoltarModal");
const modalTituloClasse = document.getElementById("modalTituloClasse");
const modalImagemClasse = document.getElementById("modalImagemClasse");
const modalDescricaoClasse = document.getElementById("modalDescricaoClasse");
const modalEstiloJogoClasse = document.getElementById("modalEstiloJogoClasse");
const modalHabilidadesClasse = document.getElementById("modalHabilidadesClasse");

// =====================================================
// 2. DADOS FIXOS DA TELA DE CRIAÇÃO
// -----------------------------------------------------
// Dados usados apenas para exibir informações na interface,
// como nome, imagem e descrição das classes no modal.
// As regras completas das classes ficam em banco-classes.js.
// =====================================================

const dadosClasses = {
  guerreiro: {
    nome: "Guerreiro",
    dadoVida: 10,
    imagem: "Imagens/Classes/guerreiro-modal.webp",
    funcionamento: "O Guerreiro é uma classe voltada ao domínio do combate físico. Ele se destaca pelo uso de armas, armaduras e treinamento marcial, podendo atuar como linha de frente, defensor ou atacante principal.",
    estilo: "Recomendado para jogadores que gostam de combate direto, resistência, presença constante em batalha e domínio de armas e armaduras.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Guerreiro conforme as regras usadas pelo jogo."
  },

  mago: {
    nome: "Mago",
    dadoVida: 6,
    imagem: "Imagens/Classes/mago-modal.webp",
    funcionamento: "O Mago é uma classe voltada ao domínio da magia. Ele se destaca pelo estudo e manipulação de feitiços, podendo atuar como suporte, controlador de campo ou atacante mágico.",
    estilo: "Recomendado para jogadores que gostam de magia, estratégias complexas, controle do ambiente e uso de poderes sobrenaturais.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Mago conforme as regras usadas pelo jogo."
  },

  ladino: {
    nome: "Ladino",
    dadoVida: 8,
    imagem: "Imagens/Classes/ladino-modal.webp",
    funcionamento: "O Ladino é uma classe voltada ao roubo, intrusão e combate desarmado. Ele se destaca pela agilidade, precisão e habilidades de furtividade, podendo atuar como explorador, assasino ou ladrão.",
    estilo: "Recomendado para jogadores que gostam de ação rápida, furtividade, estratégias de engano e uso de armas leves.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Ladino conforme as regras usadas pelo jogo."
  },

  clerigo: {
    nome: "Clérigo",
    dadoVida: 8,
    imagem: "Imagens/Classes/clerigo-modal.webp",
    funcionamento: "O Clérigo é uma classe voltada ao domínio da fé e da cura. Ele se destaca pela capacidade de canalizar os poderes de sua divindade, podendo atuar como curandeiro, defensor ou atacante divino.",
    estilo: "Recomendado para jogadores que gostam de apoio, cura, proteção e uso de poderes divinos.",
    habilidades: "Aqui entrarão os bônus, proficiências, magias e habilidades do Clérigo conforme as regras usadas pelo jogo."
  }
};
const botoesPasso = document.querySelectorAll(".passo");
const conteudosPasso = document.querySelectorAll(".conteudo-passo");
const botaoProximoPasso = document.querySelectorAll(".botao-proximo");

// =====================================================
// 3. CONTROLE DAS ETAPAS DA CRIAÇÃO
// -----------------------------------------------------
// Define a ordem dos passos do criador e controla em qual
// etapa o jogador está. Também guarda até qual etapa já foi
// liberada durante a criação do personagem.
// =====================================================

// =====================================================
// 1. Controle de etapas
// -----------------------------------------------------
// Define a ordem dos passos e controla quais etapas já foram liberadas.
// =====================================================

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

// Modo temporário para testar livremente a interface.
// Troque para false antes da versão final.
const MODO_TESTE_PASSOS_LIVRES = true;

let passoAtual = "classe";
let maiorPassoLiberado = MODO_TESTE_PASSOS_LIVRES
? ordemPassos.length - 1
: 0;

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

const areaPericiasClasse = document.getElementById("areaPericiasClasse");

const botaoSelecionarClasse = document.getElementById("botaoSelecionarClasse");
const fichaClasseNivel = document.getElementById("fichaClasseNivel");
const areaHabilidadesClasse = document.getElementById("areaHabilidadesClasse");
const nomePersonagem = document.getElementById("nomePersonagem");
const fichaNome = document.getElementById("fichaNome");
const historiaPersonagem = document.getElementById("historiaPersonagem");
const personalidadePersonagem = document.getElementById("personalidadePersonagem");

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

const fichaArmasAtaques = document.getElementById("fichaArmasAtaques");

const grupoArmaSecundaria = document.getElementById("grupoArmaSecundaria");
const armaSecundaria = document.getElementById("armaSecundaria");

const avisoEquipamentos = document.getElementById("avisoEquipamentos");

const fichaTalentos = document.getElementById("fichaTalentos");

const modalDetalheFicha = document.getElementById("modalDetalheFicha");
const botaoFecharModalDetalheFicha = document.getElementById("botaoFecharModalDetalheFicha");
const modalDetalheTitulo = document.getElementById("modalDetalheTitulo");
const modalDetalheDescricao = document.getElementById("modalDetalheDescricao");
const modalDetalheMecanica = document.getElementById("modalDetalheMecanica");

// =====================================================
// 4. ESTADO DO PERSONAGEM EM CRIAÇÃO
// -----------------------------------------------------
// Objeto principal que guarda tudo o que o jogador escolheu
// durante a criação: classe, atributos, antecedente, espécie,
// idiomas, perícias, talentos, habilidades, magias e detalhes.
// No final, este objeto é salvo no localStorage.
// =====================================================

// =====================================================
// 2. Estado central do personagem
// -----------------------------------------------------
// Objeto principal atualizado durante toda a criação.
// =====================================================

const personagem = {

  classeId:"",
  classe: "",
  atributos: {},

  antecedenteId: "",
  antecedente: "",

  especieId: "",
  especie:"",

  idiomasBase: ["comum"],
  idiomasEspecie: [],
  idiomasAntecedente: [],
  idiomasEscolhidos: [],
  idiomas: [],

  periciasClasse: [],
  periciasAntecedente: [],
  pericias: [],

  talentos: [],

  habilidades:{
     escolhas:{},
     recursos: {},
  },

  magias:{},

  detalhes:{
    nome:"",
    historia:"",
    personalidade:"",
    equipamentos:{
      armadura: "...",
      armaPrincipal: "...",
      itemSecundario: "...",
      armaSecundaria: "..."
    },
  },
};

preencherSelectArmaSecundaria();
atualizarVisibilidadeArmaSecundaria();

// =====================================================
// 5. SELEÇÃO DE CLASSE
// -----------------------------------------------------
// Controla a escolha da classe no modal, salva a classe no
// objeto personagem, atualiza a ficha lateral e recalcula
// perícias, habilidades, equipamentos, ataques, CA e PV.
// =====================================================

// =====================================================
// 4. Seleção de classe
// -----------------------------------------------------
// Atualiza classe, proficiências, recursos, habilidades e ficha lateral.
// =====================================================

function selecionarClasse(){
  const dados = dadosClasses[classeAtualNaModal];

  personagem.classeId = classeAtualNaModal;
  personagem.classe = dados.nome;

  fichaClasseNivel.textContent = dados.nome + " 1";

  personagem.periciasClasse = [];
  atualizarPericiasPersonagem();

  personagem.habilidades.escolhas = {};
  personagem.habilidades.recursos = {};
  atualizarRecursosHabilidadesPersonagem();
  inicializarMagiasPersonagem();
  atualizarMarcadoresPericias();
  atualizarMarcadoresSalvaguardas();
  atualizarPercepcaoPassiva();
  atualizarFichaHabilidades();
  atualizarFichaMagias();
  atualizarEquipamentos();
  atualizarFichaArmasAtaques();
  atualizarPontosDeVida();

  // =====================================================
// 18. Eventos e inicialização da tela
// -----------------------------------------------------
// Liga os botões, cards, selects e inicia o primeiro estado visual.
// =====================================================

cardsClasse.forEach(function(card){
    card.classList.remove("selecionado");

    if (card.dataset.classe === classeAtualNaModal){
      card.classList.add("selecionado");
    }
  });

  fecharModal();
}

function atualizarMarcadoresSalvaguardas() {
  const linhasSalvaguarda = document.querySelectorAll("[data-salvaguarda]");

  linhasSalvaguarda.forEach(function(linha) {
    linha.classList.remove("proficiente");
  });

  const classeId = personagem.classeId;

  if (classeId === "") {
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

botaoSelecionarClasse.addEventListener("click", selecionarClasse);

// =====================================================
// 6. MODAL DE INFORMAÇÕES DA CLASSE
// -----------------------------------------------------
// Abre e fecha a janela com detalhes da classe escolhida.
// Esta parte é visual: mostra imagem, descrição, estilo de
// jogo e texto explicativo antes de confirmar a classe.
// =====================================================

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

// =====================================================
// 7. NAVEGAÇÃO ENTRE ETAPAS
// -----------------------------------------------------
// Mostra a etapa atual, esconde as outras, controla botões
// de avanço e impede que o jogador pule etapas ainda não
// liberadas da criação de personagem.
// =====================================================

// =====================================================
// 3. Navegação entre passos
// -----------------------------------------------------
// Mostra, esconde e valida as etapas do criador.
// =====================================================

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
      montarTelaPericiasClasse();
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

// =====================================================
// 8. ANTECEDENTES, PERÍCIAS E TALENTOS
// -----------------------------------------------------
// Controla a escolha do antecedente. O antecedente define
// perícias automáticas, talento de origem e informações que
// aparecem na ficha lateral e depois na ficha salva.
// =====================================================

// =====================================================
// 6. Antecedente, talentos e perícias automáticas
// -----------------------------------------------------
// Aplica dados vindos do banco de antecedentes.
// =====================================================

function selecionarAntecedente(cardClicado) {
  const antecedenteId = cardClicado.dataset.antecedente;
  const dadosAntecedente = window.bancoAntecedentes[antecedenteId];

  if (dadosAntecedente === undefined) {
    console.warn("Antecedente não encontrado no banco:", antecedenteId);
    return;
  }

  cardsAntecedente.forEach(function(card) {
    card.classList.remove("selecionado");
  });

  cardClicado.classList.add("selecionado");

  personagem.antecedenteId = antecedenteId;
  personagem.antecedente = dadosAntecedente.nome;

  personagem.periciasAntecedente = [...dadosAntecedente.pericias];

  personagem.talentos = [];

  if (dadosAntecedente.talentoOrigem !== undefined) {
    personagem.talentos.push(dadosAntecedente.talentoOrigem);
  }

  atualizarPericiasPersonagem();
  limparEspecializacoesInvalidas();

  fichaAntecedente.textContent = dadosAntecedente.nome;

  atualizarMarcadoresPericias();
  atualizarPercepcaoPassiva();
  atualizarFichaTalentos();
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

// =====================================================
// 9. ESPÉCIE E IDIOMAS AUTOMÁTICOS
// -----------------------------------------------------
// Controla a escolha da espécie, atualiza tamanho,
// velocidade e idiomas fixos concedidos pela espécie.
// =====================================================

// =====================================================
// 7. Espécie e idiomas fixos
// -----------------------------------------------------
// Aplica espécie, tamanho, velocidade e idiomas automáticos.
// =====================================================

function selecionarEspecie(cardClicado) {
  cardsEspecie.forEach(function(card) {
    card.classList.remove("selecionado");
  });

  cardClicado.classList.add("selecionado");

  const especieId = cardClicado.dataset.especie;
  const dadosEspecie = window.bancoEspecies.especies[especieId];

  if (dadosEspecie === undefined) {
    return;
  }

  personagem.especieId = especieId;
  personagem.especie = dadosEspecie.nome;

  personagem.idiomasEspecie = [];

  if (dadosEspecie.idiomasFixos !== undefined) {
    personagem.idiomasEspecie = [...dadosEspecie.idiomasFixos];
  }

  fichaEspecie.textContent = dadosEspecie.nome;

  atualizarIdiomasPersonagem();
  atualizarFichaIdiomas();
  atualizarSelectsIdiomas();
  atualizarValoresDerivados();
}

// =====================================================
// 10. ROLAGEM E DISTRIBUIÇÃO DE ATRIBUTOS
// -----------------------------------------------------
// Controla a rolagem 4d6 descartando o menor dado, guarda
// os seis resultados e permite distribuir esses valores
// entre Força, Destreza, Constituição, Inteligência,
// Sabedoria e Carisma.
// =====================================================

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

// =====================================================
// 11. HABILIDADES DE CLASSE NA FICHA LATERAL
// -----------------------------------------------------
// Atualiza a lista de habilidades exibida na ficha lateral,
// incluindo habilidades automáticas, recursos como Segundo
// Fôlego e escolhas feitas pelo jogador.
// =====================================================

function atualizarFichaHabilidades() {
  fichaHabilidades.innerHTML = "";

  const classeId = personagem.classeId;

  if (classeId === "") {
    const item = document.createElement("li");
    item.textContent = "-";
    fichaHabilidades.appendChild(item);
    return;
  }

  const dadosDaClasse = window.bancoHabilidades.progressaoClasses[classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    const item = document.createElement("li");
    item.textContent = "-";
    fichaHabilidades.appendChild(item);
    return;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  const habilidadesAutomaticas =
  dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

  habilidadesAutomaticas.forEach(function(idHabilidade) {
  if (idHabilidade === "maestriaComArmas") {
    return;
  }

  const item = criarItemHabilidadeAutomaticaFicha(idHabilidade);

  if (item !== undefined) {
    fichaHabilidades.appendChild(item);
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
    atualizarFichaArmasAtaques();
    atualizarNumerosMagiasPersonagem();
    atualizarFichaMagias();

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
  atualizarNumerosMagiasPersonagem();
  atualizarFichaMagias();
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

function periciasClasseEstaoEscolhidas() {
  const classeId = personagem.classeId;

  if (classeId === "") {
    return false;
  }

  const dadosClasse = window.bancoClasses[classeId];

  if (dadosClasse === undefined || dadosClasse.pericias === undefined) {
    return true;
  }

  return personagem.periciasClasse.length === dadosClasse.pericias.quantidade;
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
    const valorEscolhido = personagem.habilidades.escolhas[escolha.grupo];

    if (escolha.quantidade === 1) {
      return valorEscolhido !== undefined && valorEscolhido !== "";
    }

    return (
      Array.isArray(valorEscolhido) &&
      valorEscolhido.length === escolha.quantidade
    );
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
    mensagem.textContent = "Escolha as habilidades da classe antes de continuar.";
    return false;
  }

  if (periciasClasseEstaoEscolhidas() === false) {
    mensagem.textContent = "Escolha as perícias da classe antes de continuar.";
    return false;
  }

  mensagem.textContent = "";
  }

  if (passoAtual === "magias") {
    const mensagem = document.getElementById("mensagemMagias");

    if (magiasEstaoEscolhidas() === false) {
      if (mensagem !== null) {
        mensagem.textContent =
          "Escolha todos os truques e magias preparadas antes de continuar.";
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

// =====================================================
// 12. TELA DE HABILIDADES DA CLASSE
// -----------------------------------------------------
// Monta a etapa de habilidades: mostra habilidades
// automáticas e cria os cards de escolhas do nível 1,
// como estilo de luta, maestrias e especializações.
// =====================================================

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
  const habilidadesAutomaticas =
    dadosNivel.classFeaturesAutomaticas || dadosNivel.habilidadesAutomaticas || [];

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
    const habilidade = obterDadosHabilidade(idHabilidade);

    if (habilidade === undefined) {
      console.warn("Habilidade não encontrada:", idHabilidade);
      return;
    }

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

function obterOpcoesDoGrupoEscolha(grupo) {
  if (grupo.origemDasOpcoes === "armas") {
    return Object.keys(window.bancoEquipamentos.armas)
      .filter(function(idArma) {
        return personagemTemProficienciaComArma(personagem, idArma);
      })
      .map(function(idArma) {
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
          descricaoCurta: "",
          maestriaId: arma.maestria,
          propriedades: arma.propriedades || []
        };
      });
  }

  if (grupo.origemDasOpcoes === "periciasProficientes") {
    return personagem.pericias.map(function(idPericia) {
      return {
        id: idPericia,
        nome: obterNomePericia(idPericia),
        descricaoCurta: "O bônus de proficiência desta perícia é dobrado."
      };
    });
  }

  return grupo.opcoes;
}

function criarDetalhesArmaOpcao(opcao) {
  const container = document.createElement("div");
  container.classList.add("detalhes-arma-opcao");

  if (opcao.maestriaId !== undefined && opcao.maestriaId !== "") {
    const linhaMaestria = document.createElement("p");

    linhaMaestria.appendChild(document.createTextNode("Maestria: "));

    const referenciaMaestria = window.criarReferenciaDetalhe(
      "maestria",
      opcao.maestriaId,
      obterNomeMaestria(opcao.maestriaId)
    );

    linhaMaestria.appendChild(referenciaMaestria);
    container.appendChild(linhaMaestria);
  }

  if (opcao.propriedades !== undefined && opcao.propriedades.length > 0) {
    const linhaPropriedades = document.createElement("p");

    linhaPropriedades.appendChild(document.createTextNode("Propriedades: "));

    opcao.propriedades.forEach(function(idPropriedade, indice) {
      const propriedade = obterDadosPropriedadeArma(idPropriedade);

      if (propriedade === undefined) {
        return;
      }

      const referenciaPropriedade = window.criarReferenciaDetalhe(
        "propriedadeArma",
        idPropriedade,
        propriedade.nome
      );

      linhaPropriedades.appendChild(referenciaPropriedade);

      if (indice < opcao.propriedades.length - 1) {
        linhaPropriedades.appendChild(document.createTextNode(", "));
      }
    });

    container.appendChild(linhaPropriedades);
  }

  return container;
}

function montarEscolhasDeHabilidades(dadosNivel1) {
  if (dadosNivel1.escolhas === undefined || dadosNivel1.escolhas.length === 0) {
    return;
  }

  dadosNivel1.escolhas.forEach(function(escolha) {
    const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];

    if (grupo === undefined) {
      return;
    }

    const quantidadeEscolhas = escolha.quantidade;
    const opcoes = obterOpcoesDoGrupoEscolha(grupo);

    const tituloGrupo = document.createElement("h3");
    tituloGrupo.textContent = grupo.nome;
    areaHabilidadesClasse.appendChild(tituloGrupo);

    const explicacao = document.createElement("p");
    explicacao.classList.add("texto-explicativo");

    if (quantidadeEscolhas === 1) {
      explicacao.textContent = "Escolha 1 opção.";
    } else {
      explicacao.textContent = "Escolha " + quantidadeEscolhas + " opções.";
    }

    areaHabilidadesClasse.appendChild(explicacao);

    const listaOpcoes = document.createElement("div");
    listaOpcoes.classList.add("grade-opcoes");
    areaHabilidadesClasse.appendChild(listaOpcoes);

    opcoes.forEach(function(opcao) {
      const card = document.createElement("div");
      card.classList.add("card-opcao");
      card.setAttribute("role", "button");
      card.tabIndex = 0;

      const escolhaAtual = personagem.habilidades.escolhas[escolha.grupo];

      if (quantidadeEscolhas === 1 && escolhaAtual === opcao.id) {
        card.classList.add("selecionado");
      }

      if (
        quantidadeEscolhas > 1 &&
        Array.isArray(escolhaAtual) &&
        escolhaAtual.includes(opcao.id)
      ) {
        card.classList.add("selecionado");
      }

      const titulo = document.createElement("h4");
      titulo.textContent = opcao.nome;
      card.appendChild(titulo);

      if (opcao.maestriaId !== undefined || opcao.propriedades !== undefined) {
        card.appendChild(criarDetalhesArmaOpcao(opcao));
      } else if (opcao.descricaoCurta !== undefined && opcao.descricaoCurta !== "") {
        const descricao = document.createElement("p");
        descricao.textContent = opcao.descricaoCurta;
         card.appendChild(descricao);
      }

      card.addEventListener("click", function(evento) {
  if (
    evento.target.closest !== undefined &&
    evento.target.closest(".botao-detalhe-inline") !== null
  ) {
    return;
  }

  selecionarOpcaoDeHabilidade(
    escolha.grupo,
    opcao.id,
    quantidadeEscolhas
  );
});

card.addEventListener("keydown", function(evento) {
  if (evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault();

    selecionarOpcaoDeHabilidade(
      escolha.grupo,
      opcao.id,
      quantidadeEscolhas
    );
  }
});

 listaOpcoes.appendChild(card);
    });
  });
}


function selecionarOpcaoDeHabilidade(grupoId, opcaoId, quantidadeEscolhas) {
  if (quantidadeEscolhas === 1) {
    personagem.habilidades.escolhas[grupoId] = opcaoId;

    montarTelaHabilidades();
    atualizarFichaHabilidades();
    atualizarClasseArmadura();
    atualizarFichaArmasAtaques();
    atualizarAvisosEquipamentos();
    atualizarMarcadoresPericias();
    atualizarPercepcaoPassiva();

    return;
  }

  let escolhasAtuais = personagem.habilidades.escolhas[grupoId];

  if (escolhasAtuais === undefined) {
    escolhasAtuais = [];
  }

  const jaEscolhida = escolhasAtuais.includes(opcaoId);

  if (jaEscolhida) {
    escolhasAtuais = escolhasAtuais.filter(function(idEscolhido) {
      return idEscolhido !== opcaoId;
    });
  } else {
    if (escolhasAtuais.length >= quantidadeEscolhas) {
      const mensagem = document.getElementById("mensagemHabilidades");
      mensagem.textContent =
        "Você já escolheu o número máximo de opções para este grupo.";
      return;
    }

    escolhasAtuais.push(opcaoId);
  }

  personagem.habilidades.escolhas[grupoId] = escolhasAtuais;

  const mensagem = document.getElementById("mensagemHabilidades");
  mensagem.textContent = "";

  montarTelaHabilidades();
  atualizarFichaHabilidades();
  atualizarClasseArmadura();
  atualizarFichaArmasAtaques();
  atualizarAvisosEquipamentos();
  atualizarMarcadoresPericias();
  atualizarPercepcaoPassiva();
}

// =====================================================
// 13. MAGIAS
// -----------------------------------------------------
// Monta a etapa de magias, controla as escolhas do jogador
// e salva truques, magias preparadas, CD, bônus de ataque
// mágico e espaços de magia no personagem.
// =====================================================

function obterProgressaoMagiasAtual() {
  const classeId = personagem.classeId;

  if (
    window.bancoMagias === undefined ||
    window.bancoMagias.progressaoMagias === undefined
  ) {
    return undefined;
  }

  const dadosClasse = window.bancoMagias.progressaoMagias[classeId];

  if (dadosClasse === undefined || dadosClasse.nivel1 === undefined) {
    return undefined;
  }

  return dadosClasse.nivel1;
}

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

function obterMagiasDaClassePorNivel(classeId, nivelMagia) {
  if (
    window.bancoMagias === undefined ||
    window.bancoMagias.magias === undefined
  ) {
    return [];
  }

  return Object.values(window.bancoMagias.magias).filter(function(magia) {
    return (
      magia.nivel === nivelMagia &&
      Array.isArray(magia.classes) &&
      magia.classes.includes(classeId)
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

  if (
    progressao.espacosMagia !== undefined &&
    progressao.espacosMagia.nivel1 !== undefined
  ) {
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
        usados: 0
      }
    }
  };

  atualizarFichaMagias();
}

function atualizarNumerosMagiasPersonagem() {
  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
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
    carisma: "Carisma"
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
  cd.innerHTML =
    "<strong>CD das magias:</strong> " +
    (personagem.magias.cdSalvamento || "-");
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
    escolhas = escolhas.filter(function(idEscolhido) {
      return idEscolhido !== idMagia;
    });
  } else {
    if (escolhas.length >= limite) {
      const mensagem = document.getElementById("mensagemMagias");

      if (mensagem !== null) {
        mensagem.textContent =
          "Você já escolheu o número máximo de magias deste grupo.";
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

  card.addEventListener("click", function() {
    selecionarMagia(grupo, magia.id, limite);
  });

  card.addEventListener("keydown", function(evento) {
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

  magias.forEach(function(magia) {
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

  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
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

  montarGrupoMagias(
    "Truques",
    0,
    "truquesConhecidos",
    progressao.truquesConhecidos
  );

  montarGrupoMagias(
    "Magias preparadas de 1º círculo",
    1,
    "magiasPreparadas",
    progressao.magiasPreparadas
  );

  atualizarFichaMagias();
}

function atualizarFichaMagias() {
  const fichaMagias = document.getElementById("fichaMagias");

  if (fichaMagias === null) {
    return;
  }

  fichaMagias.innerHTML = "";

  const progressao = obterProgressaoMagiasAtual();

  if (
    progressao === undefined ||
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
    const item = document.createElement("li");
    item.textContent = "-";
    fichaMagias.appendChild(item);
    return;
  }

  atualizarNumerosMagiasPersonagem();

  const itemConjuracao = document.createElement("li");

  const bonusAtaque = personagem.magias.bonusAtaqueMagico;

  itemConjuracao.textContent =
    "CD " +
    (personagem.magias.cdSalvamento || "-") +
    " • Ataque mágico " +
    (bonusAtaque === "" ? "-" : formatarModificador(bonusAtaque));

  fichaMagias.appendChild(itemConjuracao);

  const truques = personagem.magias.truquesConhecidos || [];
  const magiasPreparadas = personagem.magias.magiasPreparadas || [];

  const itemTruques = document.createElement("li");
  itemTruques.textContent =
    "Truques: " +
    (truques.length === 0
      ? "pendente"
      : truques.map(obterNomeMagia).join(", "));
  fichaMagias.appendChild(itemTruques);

  const itemPreparadas = document.createElement("li");
  itemPreparadas.textContent =
    "Preparadas: " +
    (magiasPreparadas.length === 0
      ? "pendente"
      : magiasPreparadas.map(obterNomeMagia).join(", "));
  fichaMagias.appendChild(itemPreparadas);

  if (
    personagem.magias.espacosMagia !== undefined &&
    personagem.magias.espacosMagia.nivel1 !== undefined
  ) {
    const itemEspacos = document.createElement("li");
    itemEspacos.textContent =
      "Espaços de 1º círculo: " +
      personagem.magias.espacosMagia.nivel1.maximos;
    fichaMagias.appendChild(itemEspacos);
  }
}

function magiasEstaoEscolhidas() {
  const progressao = obterProgressaoMagiasAtual();

  if (progressao === undefined || progressao.temMagias !== true) {
    return true;
  }

  if (
    personagem.magias === undefined ||
    personagem.magias.atributoConjuracao === undefined
  ) {
    return false;
  }

  const truques = personagem.magias.truquesConhecidos || [];
  const magiasPreparadas = personagem.magias.magiasPreparadas || [];

  return (
    truques.length === progressao.truquesConhecidos &&
    magiasPreparadas.length === progressao.magiasPreparadas
  );
}

nomePersonagem.addEventListener("input", function() {
  personagem.detalhes.nome = nomePersonagem.value;

  if (nomePersonagem.value === "") {
    fichaNome.textContent = "-";
  } else {
    fichaNome.textContent = nomePersonagem.value;
  }
});

if (historiaPersonagem !== null) {
  historiaPersonagem.addEventListener("input", function() {
    personagem.detalhes.historia = historiaPersonagem.value;
  });
}

if (personalidadePersonagem !== null) {
  personalidadePersonagem.addEventListener("input", function() {
    personagem.detalhes.personalidade = personalidadePersonagem.value;
  });
}

// =====================================================
// 14. IDIOMAS ESCOLHIDOS NO PASSO DE DETALHES
// -----------------------------------------------------
// Atualiza os idiomas finais do personagem combinando
// idioma base, idiomas da espécie, idiomas de antecedente
// e os idiomas escolhidos manualmente pelo jogador.
// =====================================================

function atualizarFichaIdiomas() {
  atualizarIdiomasPersonagem();

  if (personagem.idiomas.length === 0) {
    fichaIdiomas.textContent = "-";
    return;
  }

  const nomesIdiomas = personagem.idiomas.map(function(idIdioma) {
    return obterNomeIdioma(idIdioma);
  });

  fichaIdiomas.textContent = nomesIdiomas.join(", ");
}

seletorIdioma1.addEventListener("change", function() {
  atualizarIdiomasEscolhidos();
});


seletorIdioma2.addEventListener("change", function() {
  atualizarIdiomasEscolhidos();
});

atualizarSelectsIdiomas();
atualizarFichaIdiomas();

// =====================================================
// 15. EQUIPAMENTOS, ARMAS E PROFICIÊNCIAS
// -----------------------------------------------------
// Controla armadura, arma principal, item secundário,
// arma secundária e proficiências exibidas na ficha.
// Também recalcula CA, ataques e avisos de equipamento.
// =====================================================

function atualizarEquipamentos() {
  personagem.detalhes.equipamentos = {
    armadura: armaduraInicial.value,
    armaPrincipal: armaPrincipal.value,
    itemSecundario: itemSecundario.value,
    armaSecundaria: armaSecundaria.value,
    proficiencias: proficienciasPorClasse[personagem.classeId] || []
  };

  atualizarFichaEquipamentos();
  atualizarClasseArmadura();
  atualizarFichaArmasAtaques();
  atualizarAvisosEquipamentos();
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
    obterNomeArma(equipamentos.armaPrincipal);

  if (equipamentos.itemSecundario === "armaSecundaria") {
  const nomeArmaSecundaria = obterNomeArma(equipamentos.armaSecundaria);

  if (nomeArmaSecundaria === "") {
    fichaItemSecundario.textContent = "Arma secundária";
  } else {
    fichaItemSecundario.textContent = nomeArmaSecundaria;
  }
} else {
  const item = bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

  if (item === undefined) {
    fichaItemSecundario.textContent = "";
  } else {
    fichaItemSecundario.textContent = item.nome;
  }
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
  atualizarVisibilidadeArmaSecundaria();
  atualizarEquipamentos();
});

armaSecundaria.addEventListener("change", function() {
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

  if (
  personagemTemEstiloDeLuta("defesa") &&
  idArmadura !== "semArmadura"
) {
  classeArmadura = classeArmadura + 1;
}

  return classeArmadura;
}

function atualizarClasseArmadura() {
  const classeArmadura = calcularClasseArmadura(personagem);

  fichaClasseArmadura.textContent = classeArmadura;

  if (resultadoClasseArmadura !== null) {
    resultadoClasseArmadura.textContent = classeArmadura;
  }
}

// =====================================================
// 15. Pontos de vida, dados de vida e valores derivados
// -----------------------------------------------------
// Calcula PV, iniciativa, velocidade, tamanho e percepção passiva.
// =====================================================

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
  atualizarMarcadoresSalvaguardas();
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
  const valorPercepcao = calcularValorPericia(personagem,"percepcao");

  if (valorPercepcao === "") {
    fichaPercepcaoPassiva.textContent = "";
    return;
  }

  fichaPercepcaoPassiva.textContent = 10 + valorPercepcao;
}

function detalhesEstaoCompletos() {
  const nomePreenchido =
    personagem.detalhes.nome !== undefined &&
    personagem.detalhes.nome.trim() !== "";

  const idiomasPreenchidos =
    personagem.idiomasEscolhidos.length >= 2;

  const equipamentos = personagem.detalhes.equipamentos;

  const equipamentosPreenchidos =
    equipamentos !== undefined &&
    equipamentos.armadura !== undefined &&
    equipamentos.armadura !== "" &&
    equipamentos.armaPrincipal !== undefined &&
    equipamentos.armaPrincipal !== "" &&
    equipamentos.itemSecundario !== undefined &&
    equipamentos.itemSecundario !== "";

    const armaSecundariaPreenchida =
  equipamentos.itemSecundario !== "armaSecundaria" ||
  (
    equipamentos.armaSecundaria !== undefined &&
    equipamentos.armaSecundaria !== ""
  );

  return nomePreenchido && idiomasPreenchidos && equipamentosPreenchidos && armaSecundariaPreenchida;
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

  const tituloBasico = document.createElement("h3");
  tituloBasico.textContent = "Informações Básicas";

  blocoBasico.append(
    tituloBasico,
    criarParagrafoRevisao("Nome", personagem.detalhes.nome),
    criarParagrafoRevisao("Classe", personagem.classe + " 1"),
    criarParagrafoRevisao("Antecedente", personagem.antecedente),
    criarParagrafoRevisao("Espécie", personagem.especie),
    criarParagrafoRevisao(
      "Idiomas",
      personagem.idiomas.map(obterNomeIdioma).join(", ")
    )
  );

  areaRevisao.appendChild(blocoBasico);

  montarRevisaoNarrativa();
  montarRevisaoAtributos();
  montarRevisaoEquipamentos();
  montarRevisaoHabilidades();
  montarRevisaoTalentos();
  montarRevisaoMagias();
}

function montarRevisaoNarrativa() {
  const historia = personagem.detalhes.historia || "";
  const personalidade = personagem.detalhes.personalidade || "";

  if (historia.trim() === "" && personalidade.trim() === "") {
    return;
  }

  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "História e Personalidade";
  bloco.appendChild(titulo);

  if (historia.trim() !== "") {
    bloco.appendChild(criarParagrafoRevisao("História", historia));
  }

  if (personalidade.trim() !== "") {
    bloco.appendChild(criarParagrafoRevisao("Personalidade", personalidade));
  }

  areaRevisao.appendChild(bloco);
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

function criarParagrafoRevisao(rotulo, valor) {
  const paragrafo = document.createElement("p");

  const destaque = document.createElement("strong");
  destaque.textContent = rotulo + ": ";

  paragrafo.appendChild(destaque);
  paragrafo.appendChild(document.createTextNode(valor));

  return paragrafo;
}

function criarLinhaArmaRevisao(idArma, rotulo) {
  const container = document.createElement("div");
  container.classList.add("linha-arma-revisao");

  const titulo = document.createElement("p");

  const destaque = document.createElement("strong");
  destaque.textContent = rotulo + ": ";

  titulo.appendChild(destaque);
  titulo.appendChild(document.createTextNode(obterNomeArma(idArma)));

  container.appendChild(titulo);

  const resumo = obterResumoArma(personagem, idArma);

  if (resumo !== undefined) {
    const linhaAtaque = criarLinhaAtaque(resumo);
    container.appendChild(linhaAtaque);
  }

  return container;
}

function montarRevisaoEquipamentos() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Equipamentos e Valores";
  bloco.appendChild(titulo);

  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    bloco.appendChild(criarParagrafoRevisao("Equipamentos", "Nenhum equipamento selecionado."));
    areaRevisao.appendChild(bloco);
    return;
  }

  const armadura = window.bancoEquipamentos.armaduras[equipamentos.armadura];
  const itemSecundario =
    window.bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

  bloco.appendChild(
    criarParagrafoRevisao(
      "Armadura",
      armadura !== undefined ? armadura.nome : ""
    )
  );

  if (equipamentos.armaPrincipal !== undefined && equipamentos.armaPrincipal !== "") {
    bloco.appendChild(
      criarLinhaArmaRevisao(equipamentos.armaPrincipal, "Arma principal")
    );
  }

  if (equipamentos.itemSecundario === "armaSecundaria") {
    if (
      equipamentos.armaSecundaria !== undefined &&
      equipamentos.armaSecundaria !== ""
    ) {
      bloco.appendChild(
        criarLinhaArmaRevisao(equipamentos.armaSecundaria, "Arma secundária")
      );
    }
  } else {
    bloco.appendChild(
      criarParagrafoRevisao(
        "Item secundário",
        itemSecundario !== undefined ? itemSecundario.nome : ""
      )
    );
  }

  bloco.appendChild(
    criarParagrafoRevisao("Classe de Armadura", fichaClasseArmadura.textContent)
  );

  bloco.appendChild(
    criarParagrafoRevisao("Pontos de Vida", pvMaximo.textContent)
  );

  bloco.appendChild(
    criarParagrafoRevisao("Iniciativa", fichaIniciativa.textContent)
  );

  bloco.appendChild(
    criarParagrafoRevisao("Velocidade", fichaVelocidade.textContent)
  );

  bloco.appendChild(
    criarParagrafoRevisao("Tamanho", fichaTamanho.textContent)
  );

  bloco.appendChild(
    criarParagrafoRevisao("Percepção Passiva", fichaPercepcaoPassiva.textContent)
  );

  areaRevisao.appendChild(bloco);
}

function criarResumoArmaEscolhidaRevisao(idArma) {
  const arma = obterDadosArma(idArma);

  if (arma === undefined) {
    return undefined;
  }

  const item = document.createElement("li");

  item.appendChild(document.createTextNode(arma.nome));

  if (arma.maestria !== undefined && arma.maestria !== "") {
    item.appendChild(document.createTextNode(" — Maestria: "));

    item.appendChild(
      window.criarReferenciaDetalhe(
        "maestria",
        arma.maestria,
        obterNomeMaestria(arma.maestria)
      )
    );
  }

  if (arma.propriedades !== undefined && arma.propriedades.length > 0) {
    item.appendChild(document.createTextNode(" — Propriedades: "));

    arma.propriedades.forEach(function(idPropriedade, indice) {
      const propriedade = obterDadosPropriedadeArma(idPropriedade);

      if (propriedade === undefined) {
        return;
      }

      item.appendChild(
        window.criarReferenciaDetalhe(
          "propriedadeArma",
          idPropriedade,
          propriedade.nome
        )
      );

      if (indice < arma.propriedades.length - 1) {
        item.appendChild(document.createTextNode(", "));
      }
    });
  }

  return item;
}

function montarRevisaoHabilidades() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Habilidades";
  bloco.appendChild(titulo);

  const lista = document.createElement("ul");

  const dadosDaClasse =
    window.bancoHabilidades.progressaoClasses[personagem.classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma habilidade cadastrada.";
    lista.appendChild(item);

    bloco.appendChild(lista);
    areaRevisao.appendChild(bloco);
    return;
  }

  const dadosNivel1 = dadosDaClasse.nivel1;

  const habilidadesAutomaticas =
    dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

  habilidadesAutomaticas.forEach(function(idHabilidade) {
    if (idHabilidade === "maestriaComArmas") {
      return;
    }

    const habilidade = obterDadosHabilidade(idHabilidade);

    if (habilidade === undefined) {
      return;
    }

    const item = document.createElement("li");

    item.appendChild(
      window.criarReferenciaDetalhe(
        "habilidade",
        idHabilidade,
        habilidade.nome,
        {
          recursos: personagem.habilidades.recursos
        }
      )
    );

    const recurso = personagem.habilidades.recursos[idHabilidade];

    if (recurso !== undefined) {
      item.appendChild(
        document.createTextNode(" — " + obterTextoResumoRecurso(recurso))
      );
    }

    lista.appendChild(item);
  });

  if (dadosNivel1.escolhas !== undefined) {
    dadosNivel1.escolhas.forEach(function(escolha) {
      const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
      const valorEscolhido = personagem.habilidades.escolhas[escolha.grupo];

      if (grupo === undefined || valorEscolhido === undefined) {
        return;
      }

      if (grupo.origemDasOpcoes === "periciasProficientes") {
  const itemGrupo = document.createElement("li");
  itemGrupo.textContent = grupo.nome + ":";

  const sublista = document.createElement("ul");

  const periciasEscolhidas = Array.isArray(valorEscolhido)
    ? valorEscolhido
    : [valorEscolhido];

  periciasEscolhidas.forEach(function(idPericia) {
    const itemPericia = document.createElement("li");
    itemPericia.textContent = obterNomePericia(idPericia);
    sublista.appendChild(itemPericia);
  });

  itemGrupo.appendChild(sublista);
  lista.appendChild(itemGrupo);

  return;
}

      if (grupo.origemDasOpcoes === "armas") {
        const itemGrupo = document.createElement("li");
        itemGrupo.textContent = grupo.nome + ":";

        const sublista = document.createElement("ul");

        const armasEscolhidas = Array.isArray(valorEscolhido)
          ? valorEscolhido
          : [valorEscolhido];

        armasEscolhidas.forEach(function(idArma) {
          const itemArma = criarResumoArmaEscolhidaRevisao(idArma);

          if (itemArma !== undefined) {
            sublista.appendChild(itemArma);
          }
        });

        itemGrupo.appendChild(sublista);
        lista.appendChild(itemGrupo);

        return;
      }

      if (grupo.opcoes === undefined) {
        return;
      }

      const opcaoEscolhida = grupo.opcoes.find(function(opcao) {
        return opcao.id === valorEscolhido;
      });

      if (opcaoEscolhida !== undefined) {
        const item = document.createElement("li");
        item.textContent = grupo.nome + ": " + opcaoEscolhida.nome;
        lista.appendChild(item);
      }
    });
  }

  if (lista.children.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma habilidade selecionada.";
    lista.appendChild(item);
  }

  bloco.appendChild(lista);
  areaRevisao.appendChild(bloco);
}

function montarRevisaoTalentos() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Talentos";
  bloco.appendChild(titulo);

  const lista = document.createElement("ul");

  if (personagem.talentos.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhum talento selecionado.";
    lista.appendChild(item);
  } else {
    personagem.talentos.forEach(function(idTalento) {
      const talento = obterDadosTalento(idTalento);

      if (talento === undefined) {
        return;
      }

      const item = document.createElement("li");

      item.appendChild(
        window.criarReferenciaDetalhe(
          "talento",
          idTalento,
          talento.nome
        )
      );

      lista.appendChild(item);
    });
  }

  bloco.appendChild(lista);
  areaRevisao.appendChild(bloco);
}

function montarRevisaoMagias() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Magias";
  bloco.appendChild(titulo);

  const dadosMagiaClasse = window.bancoMagias.progressaoMagias[personagem.classeId];

  if (dadosMagiaClasse === undefined || dadosMagiaClasse.nivel1 === undefined) {
    const aviso = document.createElement("p");
    aviso.textContent =
      "Este personagem não possui escolhas de magia cadastradas para o nível atual.";
    bloco.appendChild(aviso);

    areaRevisao.appendChild(bloco);
    return;
  }

  const truques = personagem.magias.truquesConhecidos || [];
  const preparadas = personagem.magias.magiasPreparadas || [];
  const espacosNivel1 = personagem.magias.espacosMagia?.nivel1?.maximos ?? 0;

  bloco.append(
    criarParagrafoRevisao(
      "Atributo de conjuração",
      obterNomeAtributoConjuracao(personagem.magias.atributoConjuracao)
    ),
    criarParagrafoRevisao("CD das magias", personagem.magias.cdSalvamento || "-"),
    criarParagrafoRevisao(
      "Ataque mágico",
      personagem.magias.bonusAtaqueMagico === ""
        ? "-"
        : formatarModificador(personagem.magias.bonusAtaqueMagico)
    ),
    criarParagrafoRevisao(
      "Truques",
      truques.length === 0 ? "Nenhum" : truques.map(obterNomeMagia).join(", ")
    ),
    criarParagrafoRevisao(
      "Magias preparadas",
      preparadas.length === 0 ? "Nenhuma" : preparadas.map(obterNomeMagia).join(", ")
    ),
    criarParagrafoRevisao("Espaços de 1º círculo", espacosNivel1)
  );

  areaRevisao.appendChild(bloco);
}

function atualizarFichaTalentos() {
  fichaTalentos.innerHTML = "";

  if (personagem.talentos.length === 0) {
    const item = document.createElement("li");
    item.textContent = "-";
    fichaTalentos.appendChild(item);
    return;
  }

  personagem.talentos.forEach(function(idTalento) {
    const talento = obterDadosTalento(idTalento);
    const item = document.createElement("li");

    if (talento === undefined) {
      item.textContent = idTalento;
    } else {
      const referencia = window.criarReferenciaDetalhe(
        "talento",
        idTalento,
        talento.nome
      );

      item.appendChild(referencia);
    }

    fichaTalentos.appendChild(item);
  });
}

// =====================================================
// 17. Salvamento local
// -----------------------------------------------------
// Salva o personagem no localStorage e gera o identificador da ficha.
// =====================================================

function salvarPersonagemLocal() {

  atualizarPericiasPersonagem();
  atualizarIdiomasPersonagem();

  let personagensSalvos = [];

  try {
    const dadosSalvos = localStorage.getItem("personagensRpgSolo");
    const dadosConvertidos = dadosSalvos === null ? [] : JSON.parse(dadosSalvos);

    if (Array.isArray(dadosConvertidos)) {
      personagensSalvos = dadosConvertidos;
    }
  } catch (erro) {
    console.error("Não foi possível ler os personagens salvos.", erro);
  }

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

// =====================================================
// 9. Escolhas de perícias de classe
// -----------------------------------------------------
// Monta opções, impede duplicações com o antecedente e atualiza a ficha.
// =====================================================

function montarTelaPericiasClasse() {
  areaPericiasClasse.innerHTML = "";

  const classeId = personagem.classeId;

  if (classeId === "") {
    return;
  }

  const dadosClasse = window.bancoClasses[classeId];

  if (dadosClasse === undefined || dadosClasse.pericias === undefined) {
    return;
  }

  const titulo = document.createElement("h3");
  titulo.textContent = "Perícias da Classe";
  areaPericiasClasse.appendChild(titulo);

  const explicacao = document.createElement("p");
  explicacao.classList.add("texto-explicativo");
  explicacao.textContent =
    "Escolha " + dadosClasse.pericias.quantidade + " perícias para seu personagem.";
  areaPericiasClasse.appendChild(explicacao);

  const lista = document.createElement("div");
  lista.classList.add("grade-opcoes");
  areaPericiasClasse.appendChild(lista);

  dadosClasse.pericias.opcoes.forEach(function(idPericia) {
    const pericia = obterDadosPericia(idPericia);

    if (pericia === undefined) {
      return;
    }

    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("card-opcao");

    const vemDoAntecedente =
      personagem.periciasAntecedente.includes(idPericia);

    const foiEscolhidaNaClasse =
      personagem.periciasClasse.includes(idPericia);

    if (foiEscolhidaNaClasse) {
      card.classList.add("selecionado");
    }

    if (vemDoAntecedente) {
      card.classList.add("ja-proficiente");
      card.disabled = true;
      card.textContent = pericia.nome + " (Antecedente)";
    } else {
      card.textContent = pericia.nome;
    }

    card.addEventListener("click", function() {
      selecionarPericiaClasse(idPericia);
    });

    lista.appendChild(card);
  });
}

function selecionarPericiaClasse(idPericia) {
  const dadosClasse = window.bancoClasses[personagem.classeId];

  if (dadosClasse === undefined || dadosClasse.pericias === undefined) {
    return;
  }

  const quantidadeMaxima = dadosClasse.pericias.quantidade;

  if (personagem.periciasAntecedente.includes(idPericia)) {
    return;
  }

  const jaSelecionada = personagem.periciasClasse.includes(idPericia);

  if (jaSelecionada) {
    personagem.periciasClasse = personagem.periciasClasse.filter(function(pericia) {
      return pericia !== idPericia;
    });
  } else {
    if (personagem.periciasClasse.length >= quantidadeMaxima) {
      const mensagem = document.getElementById("mensagemHabilidades");

      if (mensagem !== null) {
        mensagem.textContent =
          "Você já escolheu o número máximo de perícias para esta classe.";
      }

      return;
    }

    personagem.periciasClasse.push(idPericia);
  }

  atualizarPericiasPersonagem();
  limparEspecializacoesInvalidas();
  montarTelaHabilidades();

  const mensagem = document.getElementById("mensagemHabilidades");

  if (mensagem !== null) {
    mensagem.textContent = "";
  }

  montarTelaPericiasClasse();
  atualizarMarcadoresPericias();
  atualizarPercepcaoPassiva();
}

function atualizarMarcadoresPericias() {
  const linhasPericia = document.querySelectorAll("[data-pericia]");

  linhasPericia.forEach(function(linha) {
    const idPericia = linha.dataset.pericia;

    linha.classList.remove("proficiente");
    linha.classList.remove("especializada");

    if (personagem.pericias.includes(idPericia)) {
      linha.classList.add("proficiente");
    }

    if (
  personagemTemEspecializacaoEmPericia(personagem, idPericia) ||
  personagemTemEspecializacaoEmPericia(idPericia)
) {
  linha.classList.add("especializada");
}
  });
}

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
    maestriaId: arma.maestria,
    propriedades: arma.propriedades || [],
    ataqueFurtivo: obterTextoAtaqueFurtivo(personagemAtual, idArma)
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

function atualizarFichaArmasAtaques() {
  if (fichaArmasAtaques === null) {
    return;
  }

  fichaArmasAtaques.innerHTML = "";

  const equipamentos = personagem.detalhes.equipamentos;

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
    const resumo = obterResumoArma(personagem, idArma);

    if (resumo !== undefined) {
      const linhaAtaque = criarLinhaAtaque(resumo);
      fichaArmasAtaques.appendChild(linhaAtaque);
    }
  });
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

  Object.keys(bancoEquipamentos.armas).forEach(function(idArma) {
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
    resumo.maestria
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

  propriedades.forEach(function(idPropriedade, indice) {
    const propriedade = obterDadosPropriedadeArma(idPropriedade);

    if (propriedade === undefined) {
      return;
    }

    const referencia = window.criarReferenciaDetalhe(
      "propriedadeArma",
      idPropriedade,
      propriedade.nome
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

  return (
    equipamentos.itemSecundario === "armaSecundaria" &&
    equipamentos.armaSecundaria === idArma
  );
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
    avisos.push("A arma principal parece exigir duas mãos, então ela pode não combinar com escudo.");
  }

  if (
    armaPrincipalId !== undefined &&
    armaPrincipalId !== "" &&
    armaTemPropriedade(armaPrincipalId, "duasMaos") &&
    itemSecundarioId === "armaSecundaria"
  ) {
    avisos.push("A arma principal parece exigir duas mãos, então ela pode não combinar com uma arma secundária.");
  }

  if (
    itemSecundarioId === "armaSecundaria" &&
    armaSecundariaId !== undefined &&
    armaSecundariaId !== "" &&
    armaTemPropriedade(armaSecundariaId, "leve") === false
  ) {
    avisos.push("Para lutar com duas armas, a arma secundária normalmente deveria ter a propriedade leve.");
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

  avisos.forEach(function(textoAviso) {
    const linha = document.createElement("div");
    linha.textContent = "⚠ " + textoAviso;
    avisoEquipamentos.appendChild(linha);
  });
}

function obterDadosPericia(idPericia) {
  return window.bancoPericias[idPericia];
}

function obterNomePericia(idPericia) {
  const pericia = obterDadosPericia(idPericia);

  if (pericia === undefined) {
    return idPericia;
  }

  return pericia.nome;
}

function obterAtributoDaPericia(idPericia) {
  const pericia = obterDadosPericia(idPericia);

  if (pericia === undefined) {
    return undefined;
  }

  return pericia.atributo;
}

function atualizarPericiasPersonagem() {
  const todasAsPericias = [
    ...personagem.periciasAntecedente,
    ...personagem.periciasClasse
  ];

  personagem.pericias = [...new Set(todasAsPericias)];
}

function obterNomeTalento(idTalento) {
  const talento = obterDadosTalento(idTalento);

  if (talento === undefined) {
    return idTalento;
  }

  return talento.nome;
}

function obterDadosTalento(idTalento) {
  if (window.bancoTalentos === undefined) {
    return undefined;
  }

  return window.bancoTalentos[idTalento];
}

atualizarFichaTalentos();

function obterDadosIdioma(idIdioma) {
  if (window.bancoIdiomas === undefined) {
    return undefined;
  }

  return window.bancoIdiomas[idIdioma];
}

function obterNomeIdioma(idIdioma) {
  const idioma = obterDadosIdioma(idIdioma);

  if (idioma === undefined) {
    return idIdioma;
  }

  return idioma.nome;
}

function atualizarIdiomasPersonagem() {
  const todosOsIdiomas = [
    ...personagem.idiomasBase,
    ...personagem.idiomasEspecie,
    ...personagem.idiomasAntecedente,
    ...personagem.idiomasEscolhidos
  ];

  personagem.idiomas = [...new Set(todosOsIdiomas)];
}

function obterIdiomasBloqueadosParaEscolha() {
  return [
    ...personagem.idiomasBase,
    ...personagem.idiomasEspecie,
    ...personagem.idiomasAntecedente
  ];
}

function preencherSelectIdioma(select, valorAtual, valoresEscolhidosEmOutrosSelects) {
  if (select === null) {
    return;
  }

  const idiomasBloqueados = obterIdiomasBloqueadosParaEscolha();

  select.innerHTML = "";

  const opcaoVazia = document.createElement("option");
  opcaoVazia.value = "";
  opcaoVazia.textContent = "Escolha um idioma";
  select.appendChild(opcaoVazia);

  Object.keys(window.bancoIdiomas).forEach(function(idIdioma) {
    const idioma = window.bancoIdiomas[idIdioma];

    if (idioma.tipo !== "padrao") {
      return;
    }

    if (
      idiomasBloqueados.includes(idIdioma) ||
      valoresEscolhidosEmOutrosSelects.includes(idIdioma)
    ) {
      return;
    }

    const opcao = document.createElement("option");
    opcao.value = idIdioma;
    opcao.textContent = idioma.nome;

    if (idIdioma === valorAtual) {
      opcao.selected = true;
    }

    select.appendChild(opcao);
  });
}

function atualizarSelectsIdiomas() {
  const valorIdioma1 = seletorIdioma1.value;
  const valorIdioma2 = seletorIdioma2.value;

  preencherSelectIdioma(
    seletorIdioma1,
    valorIdioma1,
    [valorIdioma2]
  );

  preencherSelectIdioma(
    seletorIdioma2,
    valorIdioma2,
    [valorIdioma1]
  );
}

function atualizarIdiomasEscolhidos() {
  personagem.idiomasEscolhidos = [];

  if (seletorIdioma1.value !== "") {
    personagem.idiomasEscolhidos.push(seletorIdioma1.value);
  }

  if (seletorIdioma2.value !== "") {
    personagem.idiomasEscolhidos.push(seletorIdioma2.value);
  }

  atualizarFichaIdiomas();
  atualizarSelectsIdiomas();
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
}

function obterDadosPropriedadeArma(idPropriedade) {
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

function obterNomeHabilidade(idHabilidade) {
  const habilidade = obterDadosHabilidade(idHabilidade);

  if (habilidade === undefined) {
    return idHabilidade;
  }

  return habilidade.nome;
}

function formatarFormulaRecurso(formula) {
  if (formula === undefined || formula === "") {
    return "";
  }

  return formula.replace("nivelClasse", "1");
}

function atualizarRecursosHabilidadesPersonagem() {
  personagem.habilidades.recursos = {};

  const classeId = personagem.classeId;

  if (classeId === "") {
    return;
  }

  const dadosDaClasse = window.bancoHabilidades.progressaoClasses[classeId];

  if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
    return;
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

    personagem.habilidades.recursos[recurso.id] = {
      id: recurso.id,
      nome: recurso.nome,
      usosAtuais: recurso.usosMaximos,
      usosMaximos: recurso.usosMaximos,
      recuperaEm: recurso.recuperaEm,
      efeito: recurso.efeito,
      formula: formatarFormulaRecurso(recurso.formula)
    };
  });
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

function criarItemHabilidadeAutomaticaFicha(idHabilidade) {
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

  const recurso = personagem.habilidades.recursos[idHabilidade];

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

function abrirModalDetalheHabilidade(idHabilidade) {
  window.abrirModalDetalhe("habilidade", idHabilidade, {
    recursos: personagem.habilidades.recursos
  });
}

function abrirModalDetalheMaestria(idMaestria) {
  window.abrirModalDetalhe("maestria", idMaestria);
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

function obterEspecializacoesPericias() {
  const especializacoes =
    personagem.habilidades.escolhas.especializacoesPericias;

  if (Array.isArray(especializacoes) === false) {
    return [];
  }

  return especializacoes;
}

function personagemTemEspecializacaoEmPericia(idPericia) {
  return obterEspecializacoesPericias().includes(idPericia);
}

function limparEspecializacoesInvalidas() {
  const especializacoes = obterEspecializacoesPericias();

  personagem.habilidades.escolhas.especializacoesPericias =
    especializacoes.filter(function(idPericia) {
      return personagem.pericias.includes(idPericia);
    });
}
