"use strict";

const listaAventuras = document.querySelector("#listaAventuras");

const framesRoloInferior = Array.from(
  { length: 6 },
  (_, indice) =>
    `assets/aventuras/pergaminho-animacao/rolo-inferior-frames/rolo-inferior-frame-${String(indice + 1).padStart(2, "0")}.webp`,
);

for (const caminhoFrame of framesRoloInferior) {
  const imagem = new Image();
  imagem.src = caminhoFrame;
}

const animacoesRoloAtivas = new WeakMap();

function criarDivisorFicha() {
  const divisor = document.createElement("span");
  divisor.className = "divisor-ficha-aventura";
  divisor.setAttribute("aria-hidden", "true");
  return divisor;
}

function criarListaDadosAventura(aventura) {
  const dados = [
    ["Cenário", aventura.cenario],
    ["Estilo de jogo", aventura.estiloJogo],
    ["Dificuldade", aventura.dificuldade],
    ["Nível recomendado", aventura.nivelRecomendado],
    ["Duração média", aventura.duracaoMedia],
    ["XP narrativo", aventura.xpNarrativo == null ? null : `${aventura.xpNarrativo} XP`],
  ];

  const lista = document.createElement("dl");
  lista.className = "dados-card-aventura";

  for (const [rotulo, valor] of dados) {
    const item = document.createElement("div");
    const termo = document.createElement("dt");
    const descricao = document.createElement("dd");
    termo.textContent = rotulo;
    descricao.textContent = valor ?? "A definir";
    item.append(termo, descricao);
    lista.append(item);
  }

  return lista;
}





function criarCardAventura(id, aventura) {
  const card = document.createElement("article");
  card.className = "card-aventura";
  card.dataset.idAventura = id;
  card.setAttribute("aria-expanded", "false");

  if (aventura.disponivel) {
    card.classList.add("card-aventura-disponivel");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
  } else {
    card.classList.add("card-aventura-indisponivel");
  }

  const pergaminho = document.createElement("div");
  pergaminho.className = "pergaminho-aventura";

  const folha = document.createElement("img");
  folha.className = "pergaminho-folha";
  folha.src =
    aventura.imagemFolha ??
    "assets/aventuras/pergaminho-animacao/pergaminho-folha.webp";
  folha.classList.toggle("pergaminho-folha-ilustrada", Boolean(aventura.imagemFolha));
  folha.alt = "";

  const recorteFolha = document.createElement("div");
  recorteFolha.className = "recorte-folha-aventura";
  recorteFolha.append(folha);

  const roloSuperior = document.createElement("img");
  roloSuperior.className = "pergaminho-rolo pergaminho-rolo-superior";
  roloSuperior.src = "assets/aventuras/pergaminho-animacao/pergaminho-rolo-superior-v2.webp";
  roloSuperior.alt = "";

  const roloInferior = document.createElement("img");
  roloInferior.className = "pergaminho-rolo pergaminho-rolo-inferior";
  roloInferior.src = framesRoloInferior[0];
  roloInferior.alt = "";

  pergaminho.append(recorteFolha, roloSuperior, roloInferior);

  const corpoPergaminho = document.createElement("div");
  corpoPergaminho.className = "corpo-pergaminho-aventura";

  const resumo = document.createElement("header");
  resumo.className = "resumo-card-aventura";

  const titulo = document.createElement("h2");
  titulo.textContent = aventura.titulo;

  const descricao = document.createElement("p");
  descricao.className = "card-aventura-descricao";
  descricao.textContent = aventura.descricao;
  resumo.append(titulo, descricao);

  const layoutInterno = document.createElement("div");
  layoutInterno.className = "layout-interno-aventura";

  const colunaInformacoes = document.createElement("div");
  colunaInformacoes.className = "coluna-informacoes-aventura";

  const conteudoExpandido = document.createElement("div");
  conteudoExpandido.className = "conteudo-expandido-aventura";

  conteudoExpandido.append(
    criarDivisorFicha(),
    criarListaDadosAventura(aventura),
  );

  colunaInformacoes.append(resumo, conteudoExpandido);
  layoutInterno.append(colunaInformacoes);
  corpoPergaminho.append(layoutInterno);
  card.append(pergaminho, corpoPergaminho);

  return card;
}

function animarRoloInferior(card, abrindo) {
  const rolo = card.querySelector(".pergaminho-rolo-inferior");
  if (!rolo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const animacaoAnterior = animacoesRoloAtivas.get(rolo);
  if (animacaoAnterior) cancelAnimationFrame(animacaoAnterior);

  const duracao = 600;
  const quantidadeVoltas = 2;
  const totalPassos = framesRoloInferior.length * quantidadeVoltas;
  const inicio = performance.now();

  function atualizarQuadro(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const passo = Math.min(Math.floor(progresso * totalPassos), totalPassos - 1);
    const fase = passo % framesRoloInferior.length;
    const indiceFrame = abrindo ? fase : framesRoloInferior.length - 1 - fase;
    rolo.src = framesRoloInferior[indiceFrame];

    if (progresso < 1) {
      const idAnimacao = requestAnimationFrame(atualizarQuadro);
      animacoesRoloAtivas.set(rolo, idAnimacao);
      return;
    }

    rolo.src = framesRoloInferior[0];
    animacoesRoloAtivas.delete(rolo);
  }

  const idAnimacao = requestAnimationFrame(atualizarQuadro);
  animacoesRoloAtivas.set(rolo, idAnimacao);
}

function esperar(tempo) {
  return new Promise((resolver) => window.setTimeout(resolver, tempo));
}

async function alternarCardAventura(card) {
  if (card.dataset.animando === "true") return;

  const estavaAberto = card.classList.contains("card-aventura-aberto");
  card.dataset.animando = "true";

  if (!estavaAberto) {
    card.classList.add("card-aventura-em-foco");
    document.body.classList.add("aventura-em-foco");
    card.setAttribute("aria-expanded", "true");

    await esperar(320);
    card.classList.add("card-aventura-aberto");
    
    animarRoloInferior(card, true);
    await esperar(900);
  } else {
    document.body.classList.remove("aventura-em-foco");
    animarRoloInferior(card, false);
    card.classList.remove("card-aventura-aberto");
    card.setAttribute("aria-expanded", "false");

    await esperar(900);

    card.classList.remove("card-aventura-em-foco");

    // O fundo começa a clarear enquanto o card ainda está recuando.
    // Isso preserva a suavidade sem manter a tela escura por mais 450 ms.
    await esperar(100);
    

    await esperar(350);
  }

  card.dataset.animando = "false";
}

listaAventuras.addEventListener("click", (evento) => {
  if (evento.target.closest(".conteudo-expandido-aventura a")) return;

  const card = evento.target.closest(".card-aventura-disponivel");
  if (!card || evento.button !== 0) return;
  alternarCardAventura(card);
});

listaAventuras.addEventListener("keydown", (evento) => {
  if (evento.target.closest("button, a")) return;
  const card = evento.target.closest(".card-aventura-disponivel");
  if (!card || (evento.key !== "Enter" && evento.key !== " ")) return;

  evento.preventDefault();
  alternarCardAventura(card);
});

for (const [id, aventura] of Object.entries(bancoAventuras)) {
  listaAventuras.append(criarCardAventura(id, aventura));
}
