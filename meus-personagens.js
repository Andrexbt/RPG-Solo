// =====================================================
// Lista de personagens salvos
// -----------------------------------------------------
// Este arquivo controla a tela meus-personagens.html.
// Ele lê os personagens salvos no localStorage, monta os
// cards de resumo e permite abrir ou excluir uma ficha.
// =====================================================

// =====================================================
// 1. Elementos do HTML
// =====================================================

const listaPersonagens = document.getElementById("listaPersonagens");

// =====================================================
// 2. Leitura e gravação no localStorage
// =====================================================

function carregarPersonagensSalvos() {
  return JSON.parse(localStorage.getItem("personagensRpgSolo")) || [];
}

function salvarListaPersonagens(personagens) {
  localStorage.setItem(
    "personagensRpgSolo",
    JSON.stringify(personagens)
  );
}

// =====================================================
// 3. Funções auxiliares de texto e cálculo
// =====================================================

function textoOuTraco(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "-";
  }

  return valor;
}

function calcularModificador(valor) {
  return Math.floor((valor - 10) / 2);
}

function calcularClasseArmadura(personagem) {
  const equipamentos = personagem.detalhes.equipamentos;

  if (equipamentos === undefined || window.bancoEquipamentos === undefined) {
    return "-";
  }

  const armadura = window.bancoEquipamentos.armaduras[equipamentos.armadura];
  const itemSecundario = window.bancoEquipamentos.itensSecundarios[equipamentos.itemSecundario];

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

  return classeArmadura;
}

function obterPontosDeVidaMaximos(personagem) {
  if (
    personagem.detalhes === undefined ||
    personagem.detalhes.pontosDeVida === undefined
  ) {
    return "-";
  }

  return textoOuTraco(personagem.detalhes.pontosDeVida.maximo);
}

// =====================================================
// 4. Montagem dos cards de personagens
// =====================================================

function montarTelaPersonagens() {
  const personagens = carregarPersonagensSalvos();

  listaPersonagens.innerHTML = "";

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
    nome.textContent = textoOuTraco(personagem.detalhes.nome);

    const classe = document.createElement("p");
    classe.classList.add("resumo-personagem");
    classe.textContent = textoOuTraco(personagem.classe) + " 1";

    cabecalho.appendChild(nome);
    cabecalho.appendChild(classe);

    const informacoes = document.createElement("div");
    informacoes.classList.add("card-personagem-info");

    const especie = document.createElement("p");
    especie.innerHTML = "<strong>Espécie:</strong> " + textoOuTraco(personagem.especie);

    const antecedente = document.createElement("p");
    antecedente.innerHTML = "<strong>Antecedente:</strong> " + textoOuTraco(personagem.antecedente);

    informacoes.appendChild(especie);
    informacoes.appendChild(antecedente);

    const valores = document.createElement("div");
    valores.classList.add("card-personagem-valores");

    const ca = document.createElement("div");
    ca.classList.add("valor-card-personagem");
    ca.innerHTML = "<span>CA</span><strong>" + calcularClasseArmadura(personagem) + "</strong>";

    const pv = document.createElement("div");
    pv.classList.add("valor-card-personagem");
    pv.innerHTML = "<span>PV</span><strong>" + obterPontosDeVidaMaximos(personagem) + "</strong>";

    valores.appendChild(ca);
    valores.appendChild(pv);

    const acoes = document.createElement("div");
    acoes.classList.add("card-personagem-acoes");

    const linkVerFicha = document.createElement("a");
    linkVerFicha.classList.add("botao-link-card");
    linkVerFicha.href = "ver-personagem.html?id=" + personagem.id;
    linkVerFicha.textContent = "Ver ficha";

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function() {
      confirmarExclusaoPersonagem(personagem.id, personagem.detalhes.nome);
    });

    acoes.appendChild(linkVerFicha);
    acoes.appendChild(botaoExcluir);

    card.appendChild(cabecalho);
    card.appendChild(informacoes);
    card.appendChild(valores);
    card.appendChild(acoes);

    listaPersonagens.appendChild(card);
  });
}

// =====================================================
// 5. Exclusão de personagens
// =====================================================

function excluirPersonagem(idPersonagem) {
  const personagens = carregarPersonagensSalvos();

  const personagensAtualizados = personagens.filter(function(personagem) {
    return personagem.id !== idPersonagem;
  });

  salvarListaPersonagens(personagensAtualizados);
  montarTelaPersonagens();
}

function confirmarExclusaoPersonagem(idPersonagem, nomePersonagem) {
  const confirmou = confirm(
    "Tem certeza que deseja excluir " + textoOuTraco(nomePersonagem) + "?"
  );

  if (confirmou === false) {
    return;
  }

  excluirPersonagem(idPersonagem);
}

// =====================================================
// 6. Inicialização
// =====================================================

montarTelaPersonagens();
