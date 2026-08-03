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

const botaoEscolherAvatar = document.getElementById("botaoEscolherAvatar");

const modalAvatar = document.getElementById("modalAvatar");

const botaoFecharModalAvatar = document.getElementById("botaoFecharModalAvatar");

const botaoCancelarAvatar = document.getElementById("botaoCancelarAvatar");

const botaoConfirmarAvatar = document.getElementById("botaoConfirmarAvatar");

const galeriaAvatares = document.getElementById("galeriaAvatares");

const galeriaFramesAvatar = document.getElementById("galeriaFramesAvatar");

const filtrosAvatar = document.querySelectorAll("[data-genero-avatar]");

const prefixosAvatarPorEspecie = {
  humano: "Human",

  anao: "Dwarf",

  elfo: "Elf",

  halfling: "Halfling",

  aasimar: "Aasimar",

  draconato: "Dragonborn",

  gnomo: "Gnome",

  golias: "Goliath",

  orc: "Orc",

  tiefling: "Tiefling",
};

let avatarTemporario = {
  imagem: "",

  frame: "",
};

let generoAvatarAtivo = "All";

const arquetiposAvatar = [
  "Alchemist",
  "Artificer",
  "Assassin",
  "Barbarian",
  "Bard",
  "Berserker",
  "Blacksmith",
  "Cleric",
  "Druid",
  "Enchanter",
  "Gladiator",
  "Illusionist",
  "Knight",
  "Monk",
  "Necromancer",
  "Ninja",
  "Paladin",
  "Pirate",
  "Ranger",
  "Samurai",
  "Sorcerer",
  "Summoner",
  "Thief",
  "Warrior",
  "Wizard",
];

function criarListaAvataresDisponiveis() {
  const especieId = personagem.especieId;

  const prefixoEspecie = prefixosAvatarPorEspecie[especieId];

  if (prefixoEspecie === undefined) {
    return [];
  }

  const generos = ["Female", "Male"];

  const avataresDisponiveis = [];

  for (const genero of generos) {
    for (const arquetipo of arquetiposAvatar) {
      const nomeArquivo = prefixoEspecie + "_" + genero + "_" + arquetipo + ".webp";

      avataresDisponiveis.push({
        genero: genero,

        arquetipo: arquetipo,

        caminho: "Imagens/Avatares/" + especieId + "/" + genero + "/" + nomeArquivo,
      });
    }
  }

  return avataresDisponiveis;
}

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
    funcionamento:
      "O Guerreiro é uma classe voltada ao domínio do combate físico. Ele se destaca pelo uso de armas, armaduras e treinamento marcial, podendo atuar como linha de frente, defensor ou atacante principal.",
    estilo:
      "Recomendado para jogadores que gostam de combate direto, resistência, presença constante em batalha e domínio de armas e armaduras.",
    habilidades:
      "Aqui entrarão os bônus, proficiências, magias e habilidades do Guerreiro conforme as regras usadas pelo jogo.",
  },

  mago: {
    nome: "Mago",
    dadoVida: 6,
    imagem: "Imagens/Classes/mago-modal.webp",
    funcionamento:
      "O Mago é uma classe voltada ao domínio da magia. Ele se destaca pelo estudo e manipulação de feitiços, podendo atuar como suporte, controlador de campo ou atacante mágico.",
    estilo:
      "Recomendado para jogadores que gostam de magia, estratégias complexas, controle do ambiente e uso de poderes sobrenaturais.",
    habilidades:
      "Aqui entrarão os bônus, proficiências, magias e habilidades do Mago conforme as regras usadas pelo jogo.",
  },

  ladino: {
    nome: "Ladino",
    dadoVida: 8,
    imagem: "Imagens/Classes/ladino-modal.webp",
    funcionamento:
      "O Ladino é uma classe voltada ao roubo, intrusão e combate desarmado. Ele se destaca pela agilidade, precisão e habilidades de furtividade, podendo atuar como explorador, assasino ou ladrão.",
    estilo:
      "Recomendado para jogadores que gostam de ação rápida, furtividade, estratégias de engano e uso de armas leves.",
    habilidades:
      "Aqui entrarão os bônus, proficiências, magias e habilidades do Ladino conforme as regras usadas pelo jogo.",
  },

  clerigo: {
    nome: "Clérigo",
    dadoVida: 8,
    imagem: "Imagens/Classes/clerigo-modal.webp",
    funcionamento:
      "O Clérigo é uma classe voltada ao domínio da fé e da cura. Ele se destaca pela capacidade de canalizar os poderes de sua divindade, podendo atuar como curandeiro, defensor ou atacante divino.",
    estilo:
      "Recomendado para jogadores que gostam de apoio, cura, proteção e uso de poderes divinos.",
    habilidades:
      "Aqui entrarão os bônus, proficiências, magias e habilidades do Clérigo conforme as regras usadas pelo jogo.",
  },
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

const ordemPassos = [
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
let maiorPassoLiberado = MODO_TESTE_PASSOS_LIVRES ? ordemPassos.length - 1 : 0;

let temporizadorMensagemNavegacao = null;
const mensagemNavegacao = document.getElementById("mensagemNavegacao");

const cardsAntecedente = document.querySelectorAll("[data-antecedente]");

const modalAntecedente = document.getElementById("modalAntecedente");

const tituloModalAntecedente = document.getElementById("tituloModalAntecedente");

const descricaoModalAntecedente = document.getElementById("descricaoModalAntecedente");

const resumoModalAntecedente = document.getElementById("resumoModalAntecedente");

const etapaDetalhesAntecedente = document.getElementById("etapaDetalhesAntecedente");

const etapaAtributosAntecedente = document.getElementById("etapaAtributosAntecedente");

const botaoFecharModalAntecedente = document.getElementById("botaoFecharModalAntecedente");

const botaoCancelarAntecedente = document.getElementById("botaoCancelarAntecedente");

const botaoAvancarAntecedente = document.getElementById("botaoAvancarAntecedente");

const escolhaEquipamentoAntecedente = document.getElementById("escolhaEquipamentoAntecedente");

const opcoesEquipamentoAntecedente = document.getElementById("opcoesEquipamentoAntecedente");

const mensagemEquipamentoAntecedente = document.getElementById("mensagemEquipamentoAntecedente");

const opcoesDistribuicaoAntecedente = document.getElementById("opcoesDistribuicaoAntecedente");

const seletoresBonusAntecedente = document.getElementById("seletoresBonusAntecedente");

const mensagemBonusAntecedente = document.getElementById("mensagemBonusAntecedente");

let cardAntecedenteTemporario = null;

let etapaAtualModalAntecedente = "detalhes";

let equipamentoAntecedenteTemporario = null;

let antecedentePreviewAnterior = "";

let bonusAntecedenteAnterior = {};

let antecedenteModalConfirmado = false;

let indiceDistribuicaoTemporaria = null;

let bonusAtributosTemporarios = {};

// =====================================================
// Pré-visualização guiada da ficha
// -----------------------------------------------------
// Mantém a ficha visível, leva o jogador até o bloco que
// está sendo alterado e aplica um destaque temporário.
// =====================================================

const camposFichaPorPasso = {
  classe: "fichaClasseNivel",

  atributos: "valfor",

  antecedente: "fichaAntecedente",

  especie: "fichaEspecie",

  habilidades: "fichaHabilidades",

  magias: "fichaMagias",

  detalhes: "fichaNome",

  equipamentos: "fichaArmadura",

  revisao: "fichaNome",
};

let temporizadorDestaqueFicha = null;

function destacarAreaFicha(nomePasso) {
  const campoId = camposFichaPorPasso[nomePasso];

  if (!campoId) {
    return;
  }

  const campo = document.getElementById(campoId);

  const colunaFicha = document.querySelector(".coluna-ficha");

  if (!campo || !colunaFicha) {
    return;
  }

  const blocoFicha = campo.closest(".ficha-bloco") ?? campo;

  const retanguloColuna = colunaFicha.getBoundingClientRect();

  const retanguloBloco = blocoFicha.getBoundingClientRect();

  const destino =
    colunaFicha.scrollTop +
    retanguloBloco.top -
    retanguloColuna.top -
    (colunaFicha.clientHeight - retanguloBloco.height) / 2;

  colunaFicha.scrollTo({
    top: Math.max(0, destino),

    behavior: "smooth",
  });

  document.querySelectorAll(".ficha-bloco-destacado").forEach(function (bloco) {
    bloco.classList.remove("ficha-bloco-destacado");
  });

  window.clearTimeout(temporizadorDestaqueFicha);

  void blocoFicha.offsetWidth;

  blocoFicha.classList.add("ficha-bloco-destacado");

  temporizadorDestaqueFicha = window.setTimeout(function () {
    blocoFicha.classList.remove("ficha-bloco-destacado");
  }, 1300);
}

function agendarDestaqueFicha(nomePasso) {
  window.requestAnimationFrame(function () {
    destacarAreaFicha(nomePasso);
  });
}

const fichaAntecedente = document.getElementById("fichaAntecedente");
const cardsEspecie = document.querySelectorAll("[data-especie]");
const fichaEspecie = document.getElementById("fichaEspecie");
const areaMagias = document.getElementById("areaMagias");
const gerarAtributos = document.getElementById("gerar-atributos");
const dadosAtributo = document.querySelectorAll(".dado");
const rolagemAtual = document.getElementById("rolagemAtual");
const resultadosAtributos = document.querySelectorAll("#resultadosAtributos span");
let atributosRolados = [];
let rolando = false;
const seletoresAtributos = document.querySelectorAll("[data-atributo]");
const armaduraInicial = document.getElementById("armaduraInicial");
const armaPrincipal = document.getElementById("armaPrincipal");
const itemSecundario = document.getElementById("itemSecundario");
const proficienciasClasse = document.getElementById("proficienciasClasse");
const fichaItensAntecedente = document.getElementById("fichaItensAntecedente");

const fichaMoedasAntecedente = document.getElementById("fichaMoedasAntecedente");

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
  "Dracônico",
];
const proficienciasPorClasse = {
  guerreiro: [
    "Armaduras leves",
    "Armaduras médias",
    "Armaduras pesadas",
    "Escudos",
    "Armas simples",
    "Armas marciais",
  ],

  mago: ["Adagas", "Cajados", "Bestas leves"],

  ladino: ["Armaduras leves", "Armas simples", "Bestas de mão", "Espadas curtas"],

  clerigo: ["Armaduras leves", "Armaduras médias", "Escudos", "Armas simples"],
};

const pvAtuais = document.getElementById("pvAtuais");
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

const grupoArmaSecundaria = document.getElementById("grupoArmaSecundaria");
const armaSecundaria = document.getElementById("armaSecundaria");

const avisoEquipamentos = document.getElementById("avisoEquipamentos");

const modalDetalheFicha = document.getElementById("modalDetalheFicha");
const botaoFecharModalDetalheFicha = document.getElementById("botaoFecharModalDetalheFicha");
const modalDetalheTitulo = document.getElementById("modalDetalheTitulo");
const modalDetalheDescricao = document.getElementById("modalDetalheDescricao");
const modalDetalheMecanica = document.getElementById("modalDetalheMecanica");
const fichaImagemAvatar = document.getElementById("fichaImagemAvatar");

const fichaFrameAvatar = document.getElementById("fichaFrameAvatar");

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
  classeId: "",
  classe: "",

  atributosBase: {},
  bonusAtributosAntecedente: {},
  atributos: {},

  combate: {
    classeArmadura: null,
    pontosDeVida: { atuais: null, temporarios: 0, maximo: null, dadoVida: "", dadosVidaUsados: 0 },

    ataques: [],
  },

  antecedenteId: "",
  antecedente: "",
  equipamentoAntecedenteId: "",
  equipamentoAntecedente: null,

  especieId: "",
  especie: "",

  avatar: { imagem: "", frame: "" },

  idiomasBase: ["comum"],
  idiomasEspecie: [],
  idiomasAntecedente: [],
  idiomasEscolhidos: [],
  idiomas: [],

  periciasClasse: [],
  periciasAntecedente: [],
  pericias: [],

  ferramentasAntecedente: [],
  ferramentas: [],

  talentos: [],
  configuracoesTalentos: {},

  habilidades: {
    escolhas: {},
    recursos: {},
  },

  magias: {},

  detalhes: {
    nome: "",
    historia: "",
    personalidade: "",
    equipamentos: {
      armadura: "...",
      armaPrincipal: "...",
      itemSecundario: "...",
      armaSecundaria: "...",
    },
  },
};

function atualizarFichaPersonagem(secoes) {
  const raizFicha = document.querySelector("[data-ficha-personagem]");

  window.FichaPersonagem.renderizar(personagem, raizFicha, {
    secoes: secoes,
  });
}

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

function selecionarClasse() {
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

  cardsClasse.forEach(function (card) {
    card.classList.remove("selecionado");

    if (card.dataset.classe === classeAtualNaModal) {
      card.classList.add("selecionado");
    }
  });

  atualizarFichaPersonagem(["informacoesBasicas", "marcadores"]);

  fecharModal();
}

function atualizarMarcadoresSalvaguardas() {
  const linhasSalvaguarda = document.querySelectorAll("[data-salvaguarda]");

  linhasSalvaguarda.forEach(function (linha) {
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

  linhasSalvaguarda.forEach(function (linha) {
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

cardsClasse.forEach(function (card) {
  card.addEventListener("click", function () {
    const classeEscolhida = card.dataset.classe;

    abrirModal(classeEscolhida);
  });
});

botaoVoltarModal.addEventListener("click", function () {
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

  conteudosPasso.forEach(function (conteudo) {
    conteudo.classList.add("escondida");
  });

  const conteudoAtual = document.getElementById("passo-" + nomePasso);

  if (conteudoAtual !== null) {
    conteudoAtual.classList.remove("escondida");
  }

  botoesPasso.forEach(function (botao) {
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

  agendarDestaqueFicha(nomePasso);
}

atualizarEstadoNavegacao();

botoesPasso.forEach(function (botao) {
  botao.addEventListener("click", function () {
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

botaoProximoPasso.forEach(function (botao) {
  botao.addEventListener("click", function () {
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

const areaPassosCriacao = document.querySelector(".area-passo");

if (areaPassosCriacao) {
  areaPassosCriacao.addEventListener("change", function () {
    agendarDestaqueFicha(passoAtual);
  });

  areaPassosCriacao.addEventListener("click", function (evento) {
    const elementoInterativo = evento.target.closest(
      "button, [data-classe], [data-antecedente], [data-especie]",
    );

    if (!elementoInterativo) {
      return;
    }

    agendarDestaqueFicha(passoAtual);
  });
}

document.addEventListener("change", function (evento) {
  if (evento.target.closest("#modalAvatar")) {
    agendarDestaqueFicha("detalhes");
  }
});

document.addEventListener("click", function (evento) {
  if (evento.target.closest("#modalAvatar")) {
    agendarDestaqueFicha("detalhes");
  }

  if (evento.target.closest("#modalClasse")) {
    agendarDestaqueFicha("classe");
  }
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

function criarLinhaResumoAntecedente(rotulo, valor) {
  const paragrafo = document.createElement("p");

  const destaque = document.createElement("strong");

  destaque.textContent = `${rotulo}: `;

  paragrafo.append(destaque, document.createTextNode(valor));

  return paragrafo;
}

function obterNomeEquipamento(equipamentoId) {
  const banco = window.bancoEquipamentos;

  const dadosEquipamento =
    banco.itensGerais[equipamentoId] ??
    banco.armas[equipamentoId] ??
    banco.armaduras[equipamentoId] ??
    banco.itensSecundarios[equipamentoId];

  return dadosEquipamento?.nome ?? equipamentoId;
}

function atualizarFichaEquipamentoAntecedente() {
  const equipamento = personagem.equipamentoAntecedente;

  if (!fichaItensAntecedente || !fichaMoedasAntecedente) {
    return;
  }

  if (!equipamento) {
    fichaItensAntecedente.textContent = "";

    fichaMoedasAntecedente.textContent = "";

    return;
  }

  const itens = equipamento.itens ?? [];

  fichaItensAntecedente.textContent =
    itens.length > 0
      ? itens
          .map(function (item) {
            const nomeItem = obterNomeEquipamento(item.id);

            const quantidade = item.quantidade ?? 1;

            return quantidade > 1 ? `${quantidade}× ${nomeItem}` : nomeItem;
          })
          .join(", ")
      : "Nenhum";

  const quantidadeOuro = equipamento.moedas?.ouro ?? 0;

  fichaMoedasAntecedente.textContent = `${quantidadeOuro} peças de ouro`;
}

function criarTextoOpcaoEquipamento(opcao) {
  const partes = [];

  const itens = opcao.itens ?? [];

  for (const item of itens) {
    const nomeItem = obterNomeEquipamento(item.id);

    const quantidade = item.quantidade ?? 1;

    partes.push(quantidade > 1 ? `${quantidade}× ${nomeItem}` : nomeItem);
  }

  const quantidadeOuro = opcao.moedas?.ouro ?? 0;

  if (quantidadeOuro > 0) {
    if (itens.length === 0) {
      return opcao.nome;
    }

    partes.push(`${quantidadeOuro} peças de ouro`);
  }

  return `${opcao.nome}: ${partes.join(", ")}`;
}

function abrirModalAntecedente(card) {
  const antecedenteId = card.dataset.antecedente;

  const dadosAntecedente = window.bancoAntecedentes[antecedenteId];

  if (!dadosAntecedente) {
    return;
  }

  cardAntecedenteTemporario = card;

  antecedentePreviewAnterior = fichaAntecedente.textContent;

  bonusAntecedenteAnterior = structuredClone(personagem.bonusAtributosAntecedente);

  antecedenteModalConfirmado = false;

  equipamentoAntecedenteTemporario = null;

  etapaAtualModalAntecedente = "detalhes";

  indiceDistribuicaoTemporaria = null;

  bonusAtributosTemporarios = {};

  etapaDetalhesAntecedente.hidden = false;

  etapaAtributosAntecedente.hidden = true;

  botaoAvancarAntecedente.textContent = "Escolher este antecedente";

  mensagemBonusAntecedente.textContent = "";

  mensagemEquipamentoAntecedente.textContent = "";

  opcoesEquipamentoAntecedente.replaceChildren();

  opcoesDistribuicaoAntecedente.replaceChildren();

  seletoresBonusAntecedente.replaceChildren();

  tituloModalAntecedente.textContent = dadosAntecedente.nome;

  fichaAntecedente.textContent = dadosAntecedente.nome;

  agendarDestaqueFicha("antecedente");

  descricaoModalAntecedente.textContent =
    dadosAntecedente.descricao ?? dadosAntecedente.descricaoCurta ?? "";

  const atributos = dadosAntecedente.atributos?.opcoes ?? dadosAntecedente.atributosSugeridos ?? [];

  const pericias = dadosAntecedente.proficiencias?.pericias ?? dadosAntecedente.pericias ?? [];

  const ferramentas =
    dadosAntecedente.proficiencias?.ferramentas ?? dadosAntecedente.ferramentas ?? [];

  const talentoOrigem = dadosAntecedente.talentoOrigem;

  const idTalento = typeof talentoOrigem === "string" ? talentoOrigem : talentoOrigem?.id;

  const nomeTalento = window.bancoTalentos[idTalento]?.nome ?? idTalento ?? "Nenhum";

  const opcoesEquipamento = dadosAntecedente.equipamento?.opcoes ?? [];

  escolhaEquipamentoAntecedente.hidden = opcoesEquipamento.length === 0;

  for (const opcao of opcoesEquipamento) {
    const botaoOpcao = document.createElement("button");

    botaoOpcao.type = "button";

    botaoOpcao.classList.add("opcao-equipamento-antecedente");

    botaoOpcao.dataset.opcaoId = opcao.id;

    botaoOpcao.textContent = criarTextoOpcaoEquipamento(opcao);

    botaoOpcao.addEventListener("click", function () {
      opcoesEquipamentoAntecedente
        .querySelectorAll(".opcao-equipamento-antecedente")
        .forEach(function (botao) {
          botao.classList.remove("selecionado");
        });

      botaoOpcao.classList.add("selecionado");

      equipamentoAntecedenteTemporario = opcao.id;

      mensagemEquipamentoAntecedente.textContent = "";

      agendarDestaqueFicha("equipamentos");
    });

    opcoesEquipamentoAntecedente.appendChild(botaoOpcao);
  }

  resumoModalAntecedente.replaceChildren(
    criarLinhaResumoAntecedente("Atributos", atributos.map(obterNomeAtributo).join(", ")),

    criarLinhaResumoAntecedente("Perícias", pericias.map(obterNomePericia).join(", ")),

    criarLinhaResumoAntecedente(
      "Ferramentas",
      ferramentas.length > 0 ? ferramentas.map(obterNomeEquipamento).join(", ") : "Nenhuma",
    ),

    criarLinhaResumoAntecedente("Talento", nomeTalento),
  );
  modalAntecedente.classList.remove("escondida");
}

function fecharModalAntecedente() {
  modalAntecedente.classList.add("escondida");

  if (!antecedenteModalConfirmado) {
    fichaAntecedente.textContent = antecedentePreviewAnterior;

    personagem.bonusAtributosAntecedente = structuredClone(bonusAntecedenteAnterior);

    recalcularAtributosFinais();
  }

  cardAntecedenteTemporario = null;

  antecedenteModalConfirmado = false;
}

function obterNomeAtributo(atributoId) {
  const nomesAtributos = {
    forca: "Força",

    destreza: "Destreza",

    constituicao: "Constituição",

    inteligencia: "Inteligência",

    sabedoria: "Sabedoria",

    carisma: "Carisma",
  };

  return nomesAtributos[atributoId] ?? atributoId;
}

function atualizarOpcoesBonusAntecedente() {
  const seletores = seletoresBonusAntecedente.querySelectorAll("select");

  const atributosSelecionados = Array.from(seletores)
    .map((seletor) => seletor.value)
    .filter((valor) => valor !== "");

  seletores.forEach(function (seletor) {
    const valorAtual = seletor.value;

    seletor.querySelectorAll("option").forEach(function (opcao) {
      if (opcao.value === "" || opcao.value === valorAtual) {
        opcao.disabled = false;

        return;
      }

      opcao.disabled = atributosSelecionados.includes(opcao.value);
    });
  });
}

function atualizarPreviewBonusAntecedente() {
  const seletores = seletoresBonusAntecedente.querySelectorAll("select");

  bonusAtributosTemporarios = {};

  seletores.forEach(function (seletor) {
    const atributoId = seletor.value;

    if (atributoId === "") {
      return;
    }

    const bonus = Number(seletor.dataset.bonus);

    bonusAtributosTemporarios[atributoId] = (bonusAtributosTemporarios[atributoId] ?? 0) + bonus;
  });

  personagem.bonusAtributosAntecedente = {
    ...bonusAtributosTemporarios,
  };

  recalcularAtributosFinais();

  atualizarOpcoesBonusAntecedente();

  agendarDestaqueFicha("atributos");
}

function criarSeletoresBonusAntecedente(distribuicao, atributos) {
  seletoresBonusAntecedente.replaceChildren();

  distribuicao.valores.forEach(function (bonus, indice) {
    const grupo = document.createElement("label");

    grupo.classList.add("seletor-bonus-antecedente");

    const rotulo = document.createElement("span");

    rotulo.textContent = `Bônus +${bonus}`;

    const seletor = document.createElement("select");

    seletor.dataset.bonus = bonus;

    seletor.setAttribute("aria-label", `Atributo do bônus +${bonus}, opção ${indice + 1}`);

    const opcaoInicial = document.createElement("option");

    opcaoInicial.value = "";

    opcaoInicial.textContent = "Escolha um atributo";

    seletor.appendChild(opcaoInicial);

    atributos.forEach(function (atributoId) {
      const opcao = document.createElement("option");

      opcao.value = atributoId;

      opcao.textContent = obterNomeAtributo(atributoId);

      seletor.appendChild(opcao);
    });

    seletor.addEventListener("change", function () {
      mensagemBonusAntecedente.textContent = "";

      atualizarPreviewBonusAntecedente();
    });

    grupo.append(rotulo, seletor);

    seletoresBonusAntecedente.appendChild(grupo);
  });
}

function exibirEtapaAtributosAntecedente() {
  if (!cardAntecedenteTemporario) {
    return;
  }

  const antecedenteId = cardAntecedenteTemporario.dataset.antecedente;

  const dadosAntecedente = window.bancoAntecedentes[antecedenteId];

  const distribuicoes = dadosAntecedente.atributos?.distribuicoesPermitidas ?? [];

  const atributos = dadosAntecedente.atributos?.opcoes ?? [];

  etapaAtualModalAntecedente = "atributos";

  etapaDetalhesAntecedente.hidden = true;

  etapaAtributosAntecedente.hidden = false;

  botaoAvancarAntecedente.textContent = "Confirmar antecedente";

  opcoesDistribuicaoAntecedente.replaceChildren();

  seletoresBonusAntecedente.replaceChildren();

  agendarDestaqueFicha("atributos");

  for (let indice = 0; indice < distribuicoes.length; indice += 1) {
    const distribuicao = distribuicoes[indice];

    const botaoDistribuicao = document.createElement("button");

    botaoDistribuicao.type = "button";

    botaoDistribuicao.classList.add("opcao-distribuicao-antecedente");

    botaoDistribuicao.dataset.indice = indice;

    const textoValores = distribuicao.valores.map((valor) => `+${valor}`).join(" e ");

    botaoDistribuicao.textContent = textoValores;

    botaoDistribuicao.addEventListener("click", function () {
      opcoesDistribuicaoAntecedente
        .querySelectorAll(".opcao-distribuicao-antecedente")
        .forEach(function (botao) {
          botao.classList.remove("selecionado");
        });

      botaoDistribuicao.classList.add("selecionado");

      indiceDistribuicaoTemporaria = indice;

      bonusAtributosTemporarios = {};

      personagem.bonusAtributosAntecedente = {};

      recalcularAtributosFinais();

      seletoresBonusAntecedente.replaceChildren();

      mensagemBonusAntecedente.textContent = "";

      criarSeletoresBonusAntecedente(distribuicao, atributos);

      agendarDestaqueFicha("atributos");
    });

    opcoesDistribuicaoAntecedente.appendChild(botaoDistribuicao);
  }
}

function confirmarAntecedenteTemporario() {
  if (!cardAntecedenteTemporario) {
    return;
  }

  if (indiceDistribuicaoTemporaria === null) {
    mensagemBonusAntecedente.textContent = "Escolha uma forma de distribuir os bônus.";

    return;
  }

  const seletores = seletoresBonusAntecedente.querySelectorAll("select");

  const algumAtributoVazio = Array.from(seletores).some((seletor) => seletor.value === "");

  if (algumAtributoVazio) {
    mensagemBonusAntecedente.textContent = "Escolha um atributo para cada bônus.";

    return;
  }

  const antecedenteId = cardAntecedenteTemporario.dataset.antecedente;

  const dadosAntecedente = window.bancoAntecedentes[antecedenteId];

  const opcaoEquipamento =
    dadosAntecedente.equipamento?.opcoes?.find(
      (opcao) => opcao.id === equipamentoAntecedenteTemporario,
    ) ?? null;

  personagem.bonusAtributosAntecedente = {
    ...bonusAtributosTemporarios,
  };

  personagem.equipamentoAntecedenteId = equipamentoAntecedenteTemporario ?? "";

  personagem.equipamentoAntecedente = opcaoEquipamento ? structuredClone(opcaoEquipamento) : null;

  atualizarFichaEquipamentoAntecedente();

  selecionarAntecedente(cardAntecedenteTemporario);

  recalcularAtributosFinais();

  antecedenteModalConfirmado = true;

  fecharModalAntecedente();

  agendarDestaqueFicha("antecedente");
}

function selecionarAntecedente(cardClicado) {
  const antecedenteId = cardClicado.dataset.antecedente;
  const dadosAntecedente = window.bancoAntecedentes[antecedenteId];

  if (dadosAntecedente === undefined) {
    console.warn("Antecedente não encontrado no banco:", antecedenteId);
    return;
  }

  cardsAntecedente.forEach(function (card) {
    card.classList.remove("selecionado");
  });

  cardClicado.classList.add("selecionado");

  personagem.antecedenteId = antecedenteId;
  personagem.antecedente = dadosAntecedente.nome;

  antecedentePreviewAnterior = dadosAntecedente.nome;

  const periciasAntecedente =
    dadosAntecedente.proficiencias?.pericias ?? dadosAntecedente.pericias ?? [];

  personagem.periciasAntecedente = [...periciasAntecedente];

  const ferramentasAntecedente =
    dadosAntecedente.proficiencias?.ferramentas ?? dadosAntecedente.ferramentas ?? [];

  personagem.ferramentasAntecedente = [...ferramentasAntecedente];

  personagem.ferramentas = [...ferramentasAntecedente];

  personagem.talentos = [];

  personagem.configuracoesTalentos = {};

  const talentoOrigem = dadosAntecedente.talentoOrigem;

  if (talentoOrigem !== undefined) {
    const idTalentoOrigem = typeof talentoOrigem === "string" ? talentoOrigem : talentoOrigem.id;

    personagem.talentos.push(idTalentoOrigem);

    if (typeof talentoOrigem === "object" && talentoOrigem.configuracao) {
      personagem.configuracoesTalentos[idTalentoOrigem] = structuredClone(
        talentoOrigem.configuracao,
      );
    }
  }

  atualizarPericiasPersonagem();
  limparEspecializacoesInvalidas();

  fichaAntecedente.textContent = dadosAntecedente.nome;

  atualizarMarcadoresPericias();
  atualizarPercepcaoPassiva();
  atualizarFichaTalentos();
  atualizarFichaPersonagem([
    "informacoesBasicas",
    "equipamentos",
    "talentos",
    "marcadores",
  ]);
}

cardsAntecedente.forEach(function (card) {
  card.addEventListener("click", function () {
    abrirModalAntecedente(card);
  });
});

botaoAvancarAntecedente.addEventListener("click", function () {
  if (etapaAtualModalAntecedente === "detalhes") {
    const antecedenteId = cardAntecedenteTemporario?.dataset.antecedente;

    const dadosAntecedente = window.bancoAntecedentes[antecedenteId];

    const opcoesEquipamento = dadosAntecedente?.equipamento?.opcoes ?? [];

    if (opcoesEquipamento.length > 0 && equipamentoAntecedenteTemporario === null) {
      mensagemEquipamentoAntecedente.textContent =
        "Escolha uma opção de equipamento para continuar.";

      return;
    }

    exibirEtapaAtributosAntecedente();

    return;
  }

  if (etapaAtualModalAntecedente === "atributos") {
    confirmarAntecedenteTemporario();

    return;
  }
});

botaoFecharModalAntecedente.addEventListener("click", fecharModalAntecedente);

botaoCancelarAntecedente.addEventListener("click", fecharModalAntecedente);

cardsEspecie.forEach(function (card) {
  card.addEventListener("click", function () {
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
  cardsEspecie.forEach(function (card) {
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
  atualizarFichaPersonagem(["informacoesBasicas", "combate"]);
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

  valoresDados.forEach(function (valor, indice) {
    if (indice !== valorDescartado) {
      soma = soma + valor;
    }
  });

  return {
    soma: soma,
    valorDescartado: valorDescartado,
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

  dadosAtributo.forEach(function (dado) {
    dado.classList.remove("descartado");
    dado.classList.add("rolando");
  });

  rolagemAtual.textContent = "Rolando...";

  const animacao = setInterval(function () {
    dadosAtributo.forEach(function (dado) {
      dado.textContent = rolarD6();
    });
  }, 80);

  setTimeout(function () {
    clearInterval(animacao);

    const valoresFinais = [rolarD6(), rolarD6(), rolarD6(), rolarD6()];

    dadosAtributo.forEach(function (dado, indice) {
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
  resultadosAtributos.forEach(function (casa, indice) {
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
  atualizarFichaPersonagem(["habilidades"]);
}

function preencherSeletoresAtributos() {
  seletoresAtributos.forEach(function (seletor) {
    seletor.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Escolha";
    seletor.appendChild(opcaoInicial);

    atributosRolados.forEach(function (valor, indice) {
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
    modificador: document.getElementById("modfor"),
  },
  destreza: {
    valor: document.getElementById("valdes"),
    modificador: document.getElementById("moddes"),
  },
  constituicao: {
    valor: document.getElementById("valcon"),
    modificador: document.getElementById("modcon"),
  },
  inteligencia: {
    valor: document.getElementById("valint"),
    modificador: document.getElementById("modint"),
  },
  sabedoria: {
    valor: document.getElementById("valsab"),
    modificador: document.getElementById("modsab"),
  },
  carisma: {
    valor: document.getElementById("valcar"),
    modificador: document.getElementById("modcar"),
  },
};

function recalcularAtributosFinais() {
  const nomesAtributos = Object.keys(camposFichaAtributos);

  for (const nomeAtributo of nomesAtributos) {
    const valorBase = personagem.atributosBase[nomeAtributo];

    const campoFicha = camposFichaAtributos[nomeAtributo];

    if (valorBase === undefined || valorBase === "") {
      personagem.atributos[nomeAtributo] = "";

      campoFicha.valor.textContent = "—";

      campoFicha.modificador.textContent = "mod —";

      continue;
    }

    const bonusAntecedente = personagem.bonusAtributosAntecedente[nomeAtributo] ?? 0;

    const valorFinal = Math.min(20, Number(valorBase) + Number(bonusAntecedente));

    personagem.atributos[nomeAtributo] = valorFinal;

    campoFicha.valor.textContent = valorFinal;

    campoFicha.modificador.textContent = formatarModificador(calcularModificador(valorFinal));
  }

  atualizarClasseArmadura();
  atualizarPontosDeVida();
  atualizarValoresDerivados();
  atualizarFichaArmasAtaques();
  atualizarNumerosMagiasPersonagem();
  atualizarFichaMagias();
  atualizarFichaPersonagem(["atributos"]);
}

function selecionarAtributo(seletor) {
  const nomeAtributo = seletor.dataset.atributo;
  const campoFicha = camposFichaAtributos[nomeAtributo];

  if (seletor.value === "") {
    personagem.atributosBase[nomeAtributo] = "";
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
    atualizarFichaPersonagem(["atributos"]);

    return;
  }

  const indiceValorEscolhido = Number(seletor.value);
  const valorEscolhido = atributosRolados[indiceValorEscolhido];

  personagem.atributosBase[nomeAtributo] = valorEscolhido;
  const bonusAntecedente = personagem.bonusAtributosAntecedente[nomeAtributo] ?? 0;

  const valorFinal = valorEscolhido + bonusAntecedente;

  personagem.atributos[nomeAtributo] = valorFinal;

  const modificador = calcularModificador(valorFinal);

  campoFicha.valor.textContent = valorFinal;
  campoFicha.modificador.textContent = formatarModificador(modificador);

  atualizarOpcoesDisponiveis();
  atualizarClasseArmadura();
  atualizarPontosDeVida();
  atualizarValoresDerivados();
  atualizarNumerosMagiasPersonagem();
  atualizarFichaMagias();
  atualizarFichaPersonagem(["atributos"]);
}

function atualizarOpcoesDisponiveis() {
  const indicesUsados = [];

  seletoresAtributos.forEach(function (seletor) {
    if (seletor.value !== "") {
      indicesUsados.push(seletor.value);
    }
  });

  seletoresAtributos.forEach(function (seletor) {
    const valorAtualDoSeletor = seletor.value;

    const opcoes = seletor.querySelectorAll("option");

    opcoes.forEach(function (opcao) {
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

seletoresAtributos.forEach(function (seletor) {
  seletor.addEventListener("change", function () {
    selecionarAtributo(seletor);
  });
});

function atributosEstaoCompletos() {
  const nomesAtributos = [
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma",
  ];

  return nomesAtributos.every(function (nomeAtributo) {
    return (
      personagem.atributos[nomeAtributo] !== undefined && personagem.atributos[nomeAtributo] !== ""
    );
  });
}

function classeEstaEscolhida() {
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

function especieEstaEscolhida() {
  return personagem.especie !== "";
}

function habilidadesEstaoEscolhidas() {
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

  return escolhasObrigatorias.every(function (escolha) {
    const valorEscolhido = personagem.habilidades.escolhas[escolha.grupo];

    if (escolha.quantidade === 1) {
      return valorEscolhido !== undefined && valorEscolhido !== "";
    }

    return Array.isArray(valorEscolhido) && valorEscolhido.length === escolha.quantidade;
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
        mensagem.textContent = "Escolha todos os truques e magias preparadas antes de continuar.";
      }

      return false;
    }

    if (mensagem !== null) {
      mensagem.textContent = "";
    }
  }

  if (passoAtual === "detalhes") {
    const mensagem = document.getElementById("mensagemDetalhes");

    if (avatarEstaEscolhido() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Escolha e confirme um avatar antes de continuar.";
      }

      return false;
    }

    if (detalhesEstaoCompletos() === false) {
      if (mensagem !== null) {
        mensagem.textContent = "Faça todas as escolhas antes de continuar.";
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

  habilidadesAutomaticas.forEach(function (idHabilidade) {
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
      .filter(function (idArma) {
        return personagemTemProficienciaComArma(personagem, idArma);
      })
      .map(function (idArma) {
        const arma = window.bancoEquipamentos.armas[idArma];

        if (typeof arma === "string") {
          return {
            id: idArma,
            nome: arma,
            descricaoCurta: "",
          };
        }

        return {
          id: idArma,
          nome: arma.nome,
          descricaoCurta: "",
          maestriaId: arma.maestria,
          propriedades: arma.propriedades || [],
        };
      });
  }

  if (grupo.origemDasOpcoes === "periciasProficientes") {
    return personagem.pericias.map(function (idPericia) {
      return {
        id: idPericia,
        nome: obterNomePericia(idPericia),
        descricaoCurta: "O bônus de proficiência desta perícia é dobrado.",
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
      obterNomeMaestria(opcao.maestriaId),
    );

    linhaMaestria.appendChild(referenciaMaestria);
    container.appendChild(linhaMaestria);
  }

  if (opcao.propriedades !== undefined && opcao.propriedades.length > 0) {
    const linhaPropriedades = document.createElement("p");

    linhaPropriedades.appendChild(document.createTextNode("Propriedades: "));

    opcao.propriedades.forEach(function (idPropriedade, indice) {
      const propriedade = obterDadosPropriedadeArma(idPropriedade);

      if (propriedade === undefined) {
        return;
      }

      const referenciaPropriedade = window.criarReferenciaDetalhe(
        "propriedadeArma",
        idPropriedade,
        propriedade.nome,
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

  dadosNivel1.escolhas.forEach(function (escolha) {
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

    opcoes.forEach(function (opcao) {
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

      card.addEventListener("click", function (evento) {
        if (
          evento.target.closest !== undefined &&
          evento.target.closest(".botao-detalhe-inline") !== null
        ) {
          return;
        }

        selecionarOpcaoDeHabilidade(escolha.grupo, opcao.id, quantidadeEscolhas);
      });

      card.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();

          selecionarOpcaoDeHabilidade(escolha.grupo, opcao.id, quantidadeEscolhas);
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
    escolhasAtuais = escolhasAtuais.filter(function (idEscolhido) {
      return idEscolhido !== opcaoId;
    });
  } else {
    if (escolhasAtuais.length >= quantidadeEscolhas) {
      const mensagem = document.getElementById("mensagemHabilidades");
      mensagem.textContent = "Você já escolheu o número máximo de opções para este grupo.";
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

function atualizarBotaoConfirmarAvatar() {
  const imagemFoiEscolhida = avatarTemporario.imagem !== "";

  const frameFoiEscolhido = avatarTemporario.frame !== "";

  botaoConfirmarAvatar.disabled = imagemFoiEscolhida === false || frameFoiEscolhido === false;
}

function atualizarAvatarNaFicha(dadosAvatar) {
  if (dadosAvatar.imagem === "") {
    fichaImagemAvatar.removeAttribute("src");

    fichaImagemAvatar.classList.add("escondida");
  } else {
    fichaImagemAvatar.src = dadosAvatar.imagem;

    fichaImagemAvatar.classList.remove("escondida");
  }

  if (dadosAvatar.frame === "") {
    fichaFrameAvatar.removeAttribute("src");

    fichaFrameAvatar.classList.add("escondida");
  } else {
    fichaFrameAvatar.src = dadosAvatar.frame;

    fichaFrameAvatar.classList.remove("escondida");
  }
}

function selecionarImagemAvatar(botaoClicado) {
  const opcoesAvatar = galeriaAvatares.querySelectorAll(".opcao-avatar");

  for (const opcaoAvatar of opcoesAvatar) {
    opcaoAvatar.classList.remove("selecionado");
  }

  botaoClicado.classList.add("selecionado");

  avatarTemporario.imagem = botaoClicado.dataset.caminhoAvatar;

  atualizarBotaoConfirmarAvatar();

  atualizarAvatarNaFicha(avatarTemporario);
}

function renderizarAvatares(avataresDisponiveis) {
  galeriaAvatares.replaceChildren();

  for (const avatar of avataresDisponiveis) {
    const botaoAvatar = document.createElement("button");

    botaoAvatar.type = "button";

    botaoAvatar.classList.add("opcao-avatar");

    botaoAvatar.dataset.caminhoAvatar = avatar.caminho;

    if (avatar.caminho === avatarTemporario.imagem) {
      botaoAvatar.classList.add("selecionado");
    }

    botaoAvatar.dataset.generoAvatar = avatar.genero;

    const imagemAvatar = document.createElement("img");

    imagemAvatar.src = avatar.caminho;

    imagemAvatar.alt = "Avatar " + avatar.arquetipo;

    imagemAvatar.loading = "lazy";

    imagemAvatar.decoding = "async";

    botaoAvatar.appendChild(imagemAvatar);

    botaoAvatar.addEventListener("click", function () {
      selecionarImagemAvatar(botaoAvatar);
    });

    galeriaAvatares.appendChild(botaoAvatar);
  }
}

function renderizarFramesAvatar() {
  galeriaFramesAvatar.replaceChildren();

  const quantidadeFrames = 12;

  for (let numeroFrame = 1; numeroFrame <= quantidadeFrames; numeroFrame += 1) {
    const numeroFormatado = String(numeroFrame).padStart(2, "0");

    const caminhoFrame = "Imagens/Avatares/frame/" + "frame-" + numeroFormatado + ".webp";

    const botaoFrame = document.createElement("button");

    botaoFrame.type = "button";

    botaoFrame.classList.add("opcao-frame-avatar");

    botaoFrame.dataset.caminhoFrame = caminhoFrame;

    if (caminhoFrame === avatarTemporario.frame) {
      botaoFrame.classList.add("selecionado");
    }

    const imagemFrame = document.createElement("img");

    imagemFrame.src = caminhoFrame;

    imagemFrame.alt = "Frame " + numeroFrame;

    imagemFrame.loading = "lazy";

    botaoFrame.appendChild(imagemFrame);

    botaoFrame.addEventListener("click", function () {
      selecionarFrameAvatar(botaoFrame);
    });

    galeriaFramesAvatar.appendChild(botaoFrame);
  }
}

function selecionarFrameAvatar(botaoClicado) {
  const opcoesFrame = galeriaFramesAvatar.querySelectorAll(".opcao-frame-avatar");

  for (const opcaoFrame of opcoesFrame) {
    opcaoFrame.classList.remove("selecionado");
  }

  botaoClicado.classList.add("selecionado");

  avatarTemporario.frame = botaoClicado.dataset.caminhoFrame;

  atualizarBotaoConfirmarAvatar();

  atualizarAvatarNaFicha(avatarTemporario);
}

function filtrarAvataresPorGenero(generoEscolhido) {
  generoAvatarAtivo = generoEscolhido;

  for (const filtroAvatar of filtrosAvatar) {
    const filtroEstaAtivo = filtroAvatar.dataset.generoAvatar === generoEscolhido;

    filtroAvatar.classList.toggle("ativo", filtroEstaAtivo);
  }

  const opcoesAvatar = galeriaAvatares.querySelectorAll(".opcao-avatar");

  for (const opcaoAvatar of opcoesAvatar) {
    const mostrarAvatar =
      generoEscolhido === "All" || opcaoAvatar.dataset.generoAvatar === generoEscolhido;

    opcaoAvatar.classList.toggle("escondida", mostrarAvatar === false);
  }
}

for (const filtroAvatar of filtrosAvatar) {
  filtroAvatar.addEventListener("click", function () {
    const generoEscolhido = filtroAvatar.dataset.generoAvatar;

    filtrarAvataresPorGenero(generoEscolhido);
  });
}

function abrirModalAvatar() {
  avatarTemporario = {
    imagem: personagem.avatar.imagem,

    frame: personagem.avatar.frame,
  };

  const avataresDisponiveis = criarListaAvataresDisponiveis();

  renderizarAvatares(avataresDisponiveis);

  renderizarFramesAvatar();
  atualizarBotaoConfirmarAvatar();
  filtrarAvataresPorGenero(generoAvatarAtivo);

  modalAvatar.classList.remove("escondida");
}

function fecharModalAvatar() {
  atualizarAvatarNaFicha(personagem.avatar);

  modalAvatar.classList.add("escondida");
}

function confirmarAvatar() {
  if (avatarTemporario.imagem === "" || avatarTemporario.frame === "") {
    return;
  }

  personagem.avatar.imagem = avatarTemporario.imagem;

  personagem.avatar.frame = avatarTemporario.frame;

  fecharModalAvatar();
  atualizarFichaPersonagem(["informacoesBasicas"]);
}

botaoEscolherAvatar.addEventListener("click", abrirModalAvatar);

botaoConfirmarAvatar.addEventListener("click", confirmarAvatar);

botaoFecharModalAvatar.addEventListener("click", fecharModalAvatar);

botaoCancelarAvatar.addEventListener("click", fecharModalAvatar);

nomePersonagem.addEventListener("input", function () {
  personagem.detalhes.nome = nomePersonagem.value;

  if (nomePersonagem.value === "") {
    fichaNome.textContent = "-";
  } else {
    fichaNome.textContent = nomePersonagem.value;
  }

  atualizarFichaPersonagem(["informacoesBasicas"]);
});

if (historiaPersonagem !== null) {
  historiaPersonagem.addEventListener("input", function () {
    personagem.detalhes.historia = historiaPersonagem.value;
  });
}

if (personalidadePersonagem !== null) {
  personalidadePersonagem.addEventListener("input", function () {
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

  const nomesIdiomas = personagem.idiomas.map(function (idIdioma) {
    return obterNomeIdioma(idIdioma);
  });

  fichaIdiomas.textContent = nomesIdiomas.join(", ");
  atualizarFichaPersonagem(["informacoesBasicas"]);
}

seletorIdioma1.addEventListener("change", function () {
  atualizarIdiomasEscolhidos();
});

seletorIdioma2.addEventListener("change", function () {
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
    proficiencias: proficienciasPorClasse[personagem.classeId] || [],
  };

  atualizarFichaEquipamentos();
  atualizarClasseArmadura();
  atualizarFichaArmasAtaques();
  atualizarAvisosEquipamentos();
}

function atualizarFichaEquipamentos() {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    atualizarFichaPersonagem(["equipamentos"]);
    return;
  }

  if (proficienciasClasse !== null) {
    proficienciasClasse.textContent = (equipamentos.proficiencias || []).join(", ");
  }

  atualizarFichaPersonagem(["equipamentos"]);
}

armaduraInicial.addEventListener("change", function () {
  atualizarEquipamentos();
});

armaPrincipal.addEventListener("change", function () {
  atualizarEquipamentos();
});

itemSecundario.addEventListener("change", function () {
  atualizarVisibilidadeArmaSecundaria();
  atualizarEquipamentos();
});

armaSecundaria.addEventListener("change", function () {
  atualizarEquipamentos();
});

function calcularClasseArmaduraCriacao() {
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

  if (personagemTemEstiloDeLuta("defesa") && idArmadura !== "semArmadura") {
    classeArmadura = classeArmadura + 1;
  }

  return classeArmadura;
}

function atualizarClasseArmadura() {
  const classeArmadura = calcularClasseArmaduraCriacao();

  personagem.combate.classeArmadura = classeArmadura === "" ? null : classeArmadura;

  fichaClasseArmadura.textContent = classeArmadura;

  if (resultadoClasseArmadura !== null) {
    resultadoClasseArmadura.textContent = classeArmadura;
  }

  atualizarFichaPersonagem(["combate"]);
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
    pvMaximo.textContent = "";
    dadosVidaUsados.textContent = "";
    dadosVidaMaximos.textContent = "";
    atualizarFichaPersonagem(["combate"]);
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
    pvMaximo.textContent = "";
    atualizarFichaPersonagem(["combate"]);
    return;
  }

  const modificadorConstituicao = calcularModificador(constituicao);
  const pontosDeVidaMaximos = dadoVida + modificadorConstituicao;

  pvMaximo.textContent = pontosDeVidaMaximos;
  pvAtuais.textContent = pontosDeVidaMaximos;

  personagem.combate.pontosDeVida = {
    atuais: pontosDeVidaMaximos,
    temporarios: 0,
    maximo: pontosDeVidaMaximos,
    dadoVida: "1d" + dadoVida,
    dadosVidaUsados: 0,
  };

  atualizarFichaPersonagem(["combate"]);
}

function atualizarValoresDerivados() {
  atualizarMarcadoresSalvaguardas();
  atualizarIniciativa();
  atualizarVelocidadeETamanho();
  atualizarPercepcaoPassiva();
  atualizarFichaPersonagem(["combate", "marcadores"]);
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
  const valorPercepcao = calcularValorPericia(personagem, "percepcao");

  if (valorPercepcao === "") {
    fichaPercepcaoPassiva.textContent = "";
    return;
  }

  fichaPercepcaoPassiva.textContent = 10 + valorPercepcao;
}

function avatarEstaEscolhido() {
  const imagemFoiEscolhida = personagem.avatar.imagem !== "";

  const frameFoiEscolhido = personagem.avatar.frame !== "";

  return imagemFoiEscolhida && frameFoiEscolhido;
}

function detalhesEstaoCompletos() {
  const nomePreenchido =
    personagem.detalhes.nome !== undefined && personagem.detalhes.nome.trim() !== "";

  const idiomasPreenchidos = personagem.idiomasEscolhidos.length >= 2;

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
    (equipamentos.armaSecundaria !== undefined && equipamentos.armaSecundaria !== "");

  return (
    nomePreenchido && idiomasPreenchidos && equipamentosPreenchidos && armaSecundariaPreenchida
  );
}

function atualizarEstadoNavegacao() {
  botoesPasso.forEach(function (botao) {
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
    temporizadorMensagemNavegacao = setTimeout(function () {
      mensagemNavegacao.textContent = "";
    }, 3000);
  }
}

function criarAvatarRevisao() {
  const avatarRevisao = document.createElement("div");

  avatarRevisao.classList.add("avatar-revisao");

  const imagemAvatar = document.createElement("img");

  imagemAvatar.classList.add("imagem-avatar-revisao");

  imagemAvatar.src = personagem.avatar.imagem;

  imagemAvatar.alt = "Avatar de " + personagem.detalhes.nome;

  const frameAvatar = document.createElement("img");

  frameAvatar.classList.add("frame-avatar-revisao");

  frameAvatar.src = personagem.avatar.frame;

  frameAvatar.alt = "";

  frameAvatar.setAttribute("aria-hidden", "true");

  avatarRevisao.append(imagemAvatar, frameAvatar);

  return avatarRevisao;
}

function montarTelaRevisao() {
  areaRevisao.innerHTML = "";

  const blocoBasico = document.createElement("section");
  blocoBasico.classList.add("bloco-revisao");

  const tituloBasico = document.createElement("h3");
  tituloBasico.textContent = "Informações Básicas";
  const avatarBasico = criarAvatarRevisao();

  blocoBasico.append(
    tituloBasico,
    avatarBasico,
    criarParagrafoRevisao("Nome", personagem.detalhes.nome),
    criarParagrafoRevisao("Classe", personagem.classe + " 1"),
    criarParagrafoRevisao("Antecedente", personagem.antecedente),
    criarParagrafoRevisao("Espécie", personagem.especie),
    criarParagrafoRevisao("Idiomas", personagem.idiomas.map(obterNomeIdioma).join(", ")),
  );

  areaRevisao.appendChild(blocoBasico);

  montarRevisaoNarrativa();
  montarRevisaoAntecedente();
  montarRevisaoAtributos();
  montarRevisaoEquipamentos();
  montarRevisaoHabilidades();
  montarRevisaoTalentos();
  montarRevisaoMagias();
}

function montarRevisaoAntecedente() {
  if (!personagem.antecedenteId) {
    return;
  }

  const bloco = document.createElement("section");

  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");

  titulo.textContent = "Benefícios do Antecedente";

  const pericias = personagem.periciasAntecedente ?? [];

  const ferramentas = personagem.ferramentasAntecedente ?? [];

  const bonusAtributos = Object.entries(personagem.bonusAtributosAntecedente ?? {}).map(function ([
    atributoId,
    bonus,
  ]) {
    return `+${bonus} ` + obterNomeAtributo(atributoId);
  });

  const dadosAntecedente = window.bancoAntecedentes[personagem.antecedenteId];

  const talentoOrigem = dadosAntecedente?.talentoOrigem;

  const talentoId = typeof talentoOrigem === "string" ? talentoOrigem : talentoOrigem?.id;

  const nomeTalento = window.bancoTalentos[talentoId]?.nome ?? talentoId ?? "Nenhum";

  bloco.append(
    titulo,

    criarParagrafoRevisao(
      "Perícias",
      pericias.length > 0 ? pericias.map(obterNomePericia).join(", ") : "Nenhuma",
    ),

    criarParagrafoRevisao(
      "Ferramentas",
      ferramentas.length > 0 ? ferramentas.map(obterNomeEquipamento).join(", ") : "Nenhuma",
    ),

    criarParagrafoRevisao("Talento", nomeTalento),

    criarParagrafoRevisao(
      "Bônus de atributos",
      bonusAtributos.length > 0 ? bonusAtributos.join(", ") : "Nenhum",
    ),
  );

  areaRevisao.appendChild(bloco);
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

function adicionarEquipamentoAntecedenteRevisao(bloco) {
  const equipamentoAntecedente = personagem.equipamentoAntecedente;

  if (!equipamentoAntecedente) {
    return;
  }

  const subtitulo = document.createElement("h4");

  subtitulo.textContent = "Equipamento do antecedente";

  bloco.appendChild(subtitulo);

  const itens = equipamentoAntecedente.itens ?? [];

  if (itens.length > 0) {
    const lista = document.createElement("ul");

    lista.classList.add("lista-equipamento-antecedente-revisao");

    itens.forEach(function (item) {
      const nomeItem = obterNomeEquipamento(item.id);

      const quantidade = item.quantidade ?? 1;

      const linha = document.createElement("li");

      linha.textContent = quantidade > 1 ? `${quantidade}× ${nomeItem}` : nomeItem;

      lista.appendChild(linha);
    });

    bloco.appendChild(lista);
  }

  const moedas = equipamentoAntecedente.moedas ?? {};

  const quantidadeOuro = moedas.ouro ?? 0;

  bloco.appendChild(criarParagrafoRevisao("Moedas iniciais", `${quantidadeOuro} peças de ouro`));
}

function montarRevisaoEquipamentos() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Equipamentos e Valores";
  bloco.appendChild(titulo);

  adicionarEquipamentoAntecedenteRevisao(bloco);

  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined) {
    bloco.appendChild(criarParagrafoRevisao("Equipamentos", "Nenhum equipamento selecionado."));
    areaRevisao.appendChild(bloco);
    return;
  }

  const armadura = window.bancoEquipamentos.armaduras[equipamentos.armadura];
  const itemSecundario = window.bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

  bloco.appendChild(criarParagrafoRevisao("Armadura", armadura !== undefined ? armadura.nome : ""));

  if (equipamentos.armaPrincipal !== undefined && equipamentos.armaPrincipal !== "") {
    bloco.appendChild(criarLinhaArmaRevisao(equipamentos.armaPrincipal, "Arma principal"));
  }

  if (equipamentos.itemSecundario === "armaSecundaria") {
    if (equipamentos.armaSecundaria !== undefined && equipamentos.armaSecundaria !== "") {
      bloco.appendChild(criarLinhaArmaRevisao(equipamentos.armaSecundaria, "Arma secundária"));
    }
  } else {
    bloco.appendChild(
      criarParagrafoRevisao(
        "Item secundário",
        itemSecundario !== undefined ? itemSecundario.nome : "",
      ),
    );
  }

  bloco.appendChild(criarParagrafoRevisao("Classe de Armadura", fichaClasseArmadura.textContent));

  bloco.appendChild(criarParagrafoRevisao("Pontos de Vida", pvMaximo.textContent));

  bloco.appendChild(criarParagrafoRevisao("Iniciativa", fichaIniciativa.textContent));

  bloco.appendChild(criarParagrafoRevisao("Velocidade", fichaVelocidade.textContent));

  bloco.appendChild(criarParagrafoRevisao("Tamanho", fichaTamanho.textContent));

  bloco.appendChild(criarParagrafoRevisao("Percepção Passiva", fichaPercepcaoPassiva.textContent));

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
      window.criarReferenciaDetalhe("maestria", arma.maestria, obterNomeMaestria(arma.maestria)),
    );
  }

  if (arma.propriedades !== undefined && arma.propriedades.length > 0) {
    item.appendChild(document.createTextNode(" — Propriedades: "));

    arma.propriedades.forEach(function (idPropriedade, indice) {
      const propriedade = obterDadosPropriedadeArma(idPropriedade);

      if (propriedade === undefined) {
        return;
      }

      item.appendChild(
        window.criarReferenciaDetalhe("propriedadeArma", idPropriedade, propriedade.nome),
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

  const habilidadesAutomaticas =
    dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

  habilidadesAutomaticas.forEach(function (idHabilidade) {
    if (idHabilidade === "maestriaComArmas") {
      return;
    }

    const habilidade = obterDadosHabilidade(idHabilidade);

    if (habilidade === undefined) {
      return;
    }

    const item = document.createElement("li");

    item.appendChild(
      window.criarReferenciaDetalhe("habilidade", idHabilidade, habilidade.nome, {
        recursos: personagem.habilidades.recursos,
      }),
    );

    const recurso = personagem.habilidades.recursos[idHabilidade];

    if (recurso !== undefined) {
      item.appendChild(document.createTextNode(" — " + obterTextoResumoRecurso(recurso)));
    }

    lista.appendChild(item);
  });

  if (dadosNivel1.escolhas !== undefined) {
    dadosNivel1.escolhas.forEach(function (escolha) {
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

        periciasEscolhidas.forEach(function (idPericia) {
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

        const armasEscolhidas = Array.isArray(valorEscolhido) ? valorEscolhido : [valorEscolhido];

        armasEscolhidas.forEach(function (idArma) {
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

      const opcaoEscolhida = grupo.opcoes.find(function (opcao) {
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
    personagem.talentos.forEach(function (idTalento) {
      const talento = obterDadosTalento(idTalento);

      if (talento === undefined) {
        return;
      }

      const item = document.createElement("li");

      item.appendChild(window.criarReferenciaDetalhe("talento", idTalento, talento.nome));

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
      obterNomeAtributoConjuracao(personagem.magias.atributoConjuracao),
    ),
    criarParagrafoRevisao("CD das magias", personagem.magias.cdSalvamento || "-"),
    criarParagrafoRevisao(
      "Ataque mágico",
      personagem.magias.bonusAtaqueMagico === ""
        ? "-"
        : formatarModificador(personagem.magias.bonusAtaqueMagico),
    ),
    criarParagrafoRevisao(
      "Truques",
      truques.length === 0 ? "Nenhum" : truques.map(obterNomeMagia).join(", "),
    ),
    criarParagrafoRevisao(
      "Magias preparadas",
      preparadas.length === 0 ? "Nenhuma" : preparadas.map(obterNomeMagia).join(", "),
    ),
    criarParagrafoRevisao("Espaços de 1º círculo", espacosNivel1),
  );

  areaRevisao.appendChild(bloco);
}

function atualizarFichaTalentos() {
  atualizarFichaPersonagem(["talentos"]);
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

  localStorage.setItem("personagensRpgSolo", JSON.stringify(personagensSalvos));

  return personagemParaSalvar;
}

botaoFinalizarPersonagem.addEventListener("click", function () {
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

  dadosClasse.pericias.opcoes.forEach(function (idPericia) {
    const pericia = obterDadosPericia(idPericia);

    if (pericia === undefined) {
      return;
    }

    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("card-opcao");

    const vemDoAntecedente = personagem.periciasAntecedente.includes(idPericia);

    const foiEscolhidaNaClasse = personagem.periciasClasse.includes(idPericia);

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

    card.addEventListener("click", function () {
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
    personagem.periciasClasse = personagem.periciasClasse.filter(function (pericia) {
      return pericia !== idPericia;
    });
  } else {
    if (personagem.periciasClasse.length >= quantidadeMaxima) {
      const mensagem = document.getElementById("mensagemHabilidades");

      if (mensagem !== null) {
        mensagem.textContent = "Você já escolheu o número máximo de perícias para esta classe.";
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

  linhasPericia.forEach(function (linha) {
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

function criarAtaqueCombateArma(personagemAtual, idArma) {
  const arma = obterDadosArma(idArma);

  if (!arma) {
    return null;
  }

  const grupoDano = converterDanoArma(arma.dano);

  if (!grupoDano) {
    return null;
  }

  const bonusAtaque = calcularBonusAtaqueArma(personagemAtual, idArma);

  const bonusDano = calcularBonusDanoArma(personagemAtual, idArma);

  const ataqueDistancia = arma.categoria === "distancia";

  return {
    id: idArma,

    nome: arma.nome,

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
    const ataquePrincipal = criarAtaqueCombateArma(personagem, equipamentos.armaPrincipal);

    if (ataquePrincipal) {
      ataques.push(ataquePrincipal);
    }
  }

  if (equipamentos.itemSecundario === "armaSecundaria" && equipamentos.armaSecundaria) {
    const ataqueSecundario = criarAtaqueCombateArma(personagem, equipamentos.armaSecundaria);

    if (ataqueSecundario) {
      ataqueSecundario.id = ataqueSecundario.id + "Secundaria";

      ataqueSecundario.nome = ataqueSecundario.nome + " (secundária)";

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
  const todasAsPericias = [...personagem.periciasAntecedente, ...personagem.periciasClasse];

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
    ...personagem.idiomasEscolhidos,
  ];

  personagem.idiomas = [...new Set(todosOsIdiomas)];
}

function obterIdiomasBloqueadosParaEscolha() {
  return [
    ...personagem.idiomasBase,
    ...personagem.idiomasEspecie,
    ...personagem.idiomasAntecedente,
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

  Object.keys(window.bancoIdiomas).forEach(function (idIdioma) {
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

  preencherSelectIdioma(seletorIdioma1, valorIdioma1, [valorIdioma2]);

  preencherSelectIdioma(seletorIdioma2, valorIdioma2, [valorIdioma1]);
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

  const nomesPropriedades = propriedades.map(function (idPropriedade) {
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

  if ((forca === undefined || forca === "") && (destreza === undefined || destreza === "")) {
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

function obterDadosHabilidade(
  idHabilidade
) {
  if (
    window.bancoHabilidades
      ?.classFeatures ===
    undefined
  ) {
    return undefined;
  }

  return window.bancoHabilidades
    .classFeatures
    [idHabilidade];
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

  habilidadesAutomaticas.forEach(function (idHabilidade) {
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
      formula: formatarFormulaRecurso(recurso.formula),
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

function abrirModalDetalheHabilidade(idHabilidade) {
  window.abrirModalDetalhe("habilidade", idHabilidade, {
    recursos: personagem.habilidades.recursos,
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
  botaoFecharModalDetalheFicha.addEventListener("click", function () {
    fecharModalDetalheFicha();
  });
}

if (modalDetalheFicha !== null) {
  modalDetalheFicha.addEventListener("click", function (evento) {
    if (evento.target === modalDetalheFicha) {
      fecharModalDetalheFicha();
    }
  });
}

function abrirModalDetalheTalento(idTalento) {
  window.abrirModalDetalhe("talento", idTalento);
}

function obterEspecializacoesPericias() {
  const especializacoes = personagem.habilidades.escolhas.especializacoesPericias;

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

  personagem.habilidades.escolhas.especializacoesPericias = especializacoes.filter(
    function (idPericia) {
      return personagem.pericias.includes(idPericia);
    },
  );
}
