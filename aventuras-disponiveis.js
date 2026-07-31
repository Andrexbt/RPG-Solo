"use strict";

const listaAventuras = document.querySelector("#listaAventuras");
const secaoSelecaoPersonagem = document.querySelector("#secaoSelecaoPersonagem");
const aventuraSelecionada = document.querySelector("#aventuraSelecionada");
const listaPersonagensAventura = document.querySelector("#listaPersonagensAventura");

let idAventuraSelecionada = null;

function criarCardAventura(idAventura, aventura) {
  const card = document.createElement("article");

  card.classList.add("card-aventura");

  const etiqueta = document.createElement("p");

  etiqueta.classList.add("card-aventura-etiqueta");

  etiqueta.textContent = aventura.disponivel ? "Disponível" : "Em desenvolvimento";

  const titulo = document.createElement("h3");

  titulo.textContent = aventura.titulo;

  const descricao = document.createElement("p");

  descricao.classList.add("card-aventura-descricao");

  descricao.textContent = aventura.descricao;

  const botaoSelecionar = document.createElement("button");

  botaoSelecionar.type = "button";

  botaoSelecionar.classList.add("botao", "botao-secundario", "botao-selecionar-aventura");

  botaoSelecionar.dataset.idAventura = idAventura;

  botaoSelecionar.textContent = aventura.disponivel ? "Escolher aventura" : "Indisponível";

  botaoSelecionar.disabled = !aventura.disponivel;

  card.append(etiqueta, titulo, descricao, botaoSelecionar);

  return card;
}

function exibirAventuras() {
  listaAventuras.textContent = "";

  const aventuras = Object.entries(bancoAventuras);

  for (const [idAventura, aventura] of aventuras) {
    const card = criarCardAventura(idAventura, aventura);

    listaAventuras.append(card);
  }
}

function selecionarAventura(evento) {
  const botao = evento.target.closest(".botao-selecionar-aventura");

  if (!botao) {
    return;
  }

  const idAventura = botao.dataset.idAventura;

  const aventura = bancoAventuras[idAventura];

  if (!aventura || !aventura.disponivel) {
    return;
  }

  idAventuraSelecionada = idAventura;

  aventuraSelecionada.textContent = `Aventura selecionada: ${aventura.titulo}`;

  secaoSelecaoPersonagem.hidden = false;

  exibirPersonagensSalvos();

  console.log("Aventura selecionada:", idAventuraSelecionada);
}

function carregarPersonagensSalvos() {
  try {
    const dadosSalvos = localStorage.getItem("personagensRpgSolo");

    if (!dadosSalvos) {
      return [];
    }

    const personagens = JSON.parse(dadosSalvos);

    return Array.isArray(personagens) ? personagens : [];
  } catch (erro) {
    console.error("Não foi possível carregar os personagens.", erro);

    return [];
  }
}

function criarCardPersonagem(personagem) {
  const card = document.createElement("article");

  card.classList.add("card-personagem-aventura");

  const nome = document.createElement("h3");

  nome.textContent = personagem.detalhes?.nome || "Personagem sem nome";

  const classe = document.createElement("p");

  classe.classList.add("classe-personagem-aventura");

  classe.textContent = personagem.classe ? `${personagem.classe} — Nível 1` : "Classe não definida";

  const especie = document.createElement("p");

  especie.classList.add("especie-personagem-aventura");

  especie.textContent = personagem.especie
    ? `Espécie: ${personagem.especie}`
    : "Espécie não definida";

  const botaoSelecionar = document.createElement("button");

  botaoSelecionar.type = "button";

  botaoSelecionar.classList.add("botao", "botao-secundario", "botao-selecionar-personagem");

  botaoSelecionar.dataset.idPersonagem = personagem.id;

  botaoSelecionar.textContent = "Jogar com este personagem";

  card.append(nome, classe, especie, botaoSelecionar);

  return card;
}

function exibirPersonagensSalvos() {
  listaPersonagensAventura.textContent = "";

  const personagens = carregarPersonagensSalvos();

  if (personagens.length === 0) {
    const aviso = document.createElement("p");

    aviso.classList.add("aviso-sem-personagens");

    aviso.textContent = "Você ainda não possui personagens salvos.";

    const linkCriarPersonagem = document.createElement("a");

    linkCriarPersonagem.classList.add("botao", "botao-principal");

    linkCriarPersonagem.href = "criacao-personagem.html";

    linkCriarPersonagem.textContent = "Criar personagem";

    listaPersonagensAventura.append(aviso, linkCriarPersonagem);

    return;
  }

  for (const personagem of personagens) {
    const card = criarCardPersonagem(personagem);

    listaPersonagensAventura.append(card);
  }
}

function selecionarPersonagem(evento) {
  const botao = evento.target.closest(".botao-selecionar-personagem");

  if (!botao) {
    return;
  }

  const idPersonagem = botao.dataset.idPersonagem;

  if (!idAventuraSelecionada || !idPersonagem) {
    console.warn("A aventura ou o personagem não foi selecionado.");

    return;
  }

  const parametros = new URLSearchParams({
    aventura: idAventuraSelecionada,

    personagem: idPersonagem,
  });

  window.location.href = `aventuras.html?${parametros.toString()}`;
}

listaAventuras.addEventListener("click", selecionarAventura);
listaPersonagensAventura.addEventListener("click", selecionarPersonagem);

exibirAventuras();
