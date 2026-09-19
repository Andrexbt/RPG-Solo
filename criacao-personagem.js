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

const modalEquipamentos = document.getElementById("modalEquipamentos");

const modalConfiguracaoEquipamento = document.getElementById(
  "modalConfiguracaoEquipamento",
);

const botaoFecharConfiguracaoEquipamento = document.getElementById(
  "botaoFecharConfiguracaoEquipamento",
);

const tituloModalConfiguracaoEquipamento = document.getElementById(
  "tituloModalConfiguracaoEquipamento",
);

const descricaoModalConfiguracaoEquipamento = document.getElementById(
  "descricaoModalConfiguracaoEquipamento",
);

const listaConfiguracaoEquipamento = document.getElementById(
  "listaConfiguracaoEquipamento",
);

const botaoEsvaziarSlotEquipamento = document.getElementById(
  "botaoEsvaziarSlotEquipamento",
);

const botaoConfigurarArmadura = document.getElementById(
  "botaoConfigurarArmadura",
);

const botaoConfigurarMao1 = document.getElementById(
  "botaoConfigurarMao1",
);

const botaoConfigurarMao2 = document.getElementById(
  "botaoConfigurarMao2",
);

const nomeArmaduraConfigurada = document.getElementById(
  "nomeArmaduraConfigurada",
);

const nomeEquipamentoMao1 = document.getElementById(
  "nomeEquipamentoMao1",
);

const nomeEquipamentoMao2 = document.getElementById(
  "nomeEquipamentoMao2",
);

const botaoEscolherEquipamento = document.getElementById("botaoEscolherEquipamento");

const botaoFecharModalEquipamentos = document.getElementById("botaoFecharModalEquipamentos");

const detalheArmaLoja = document.getElementById("detalheArmaLoja");
const botaoFecharDetalheArma = document.getElementById("botaoFecharDetalheArma");
const imagemDetalheEquipamento = document.getElementById("imagemDetalheEquipamento");
const nomeDetalheEquipamento = document.getElementById("nomeDetalheEquipamento");
const dadosDetalheEquipamento = document.getElementById("dadosDetalheEquipamento");
const estadoCompatibilidadeEquipamento = document.getElementById(
  "estadoCompatibilidadeEquipamento",
);
const botaoAdicionarEquipamentoLoja = document.getElementById("botaoAdicionarEquipamentoLoja");
const botaoEquiparEquipamentoLoja = document.getElementById("botaoEquiparEquipamentoLoja");
const botaoRemoverEquipamentoLoja = document.getElementById("botaoRemoverEquipamentoLoja");
const mensagemDetalheEquipamento = document.getElementById("mensagemDetalheEquipamento");
const orcamentoTotalLoja = document.getElementById("orcamentoTotalLoja");
const saldoOrcamentoLoja = document.getElementById("saldoOrcamentoLoja");
const ouroRetidoLoja = document.getElementById("ouroRetidoLoja");

let equipamentoDetalhado = null;

let slotConfiguracaoAtual = null;

const trilhoVistasLoja = document.getElementById("trilhoVistasLoja");

const botaoVistaAnteriorLoja = document.getElementById("botaoVistaAnteriorLoja");

const botaoProximaVistaLoja = document.getElementById("botaoProximaVistaLoja");

const vistasLoja = ["compactas", "longas", "armaduras"];
let indiceVistaLoja = 0;

function mostrarVistaLoja(vista) {
  indiceVistaLoja = Math.max(0, vistasLoja.indexOf(vista));

  trilhoVistasLoja.dataset.vista = vista;

  botaoVistaAnteriorLoja.classList.toggle("escondida", indiceVistaLoja === 0);

  botaoProximaVistaLoja.classList.toggle("escondida", indiceVistaLoja === vistasLoja.length - 1);
}

const posicoesArmasVitrine = window.ConfiguracaoVitrineEquipamentos.armas;

const posicoesArmadurasVitrine = window.ConfiguracaoVitrineEquipamentos.armaduras;

function aplicarTransformacaoVitrine(elemento, posicao) {
  elemento.style.setProperty("--escala-visual-vitrine", Number(posicao.escalaVisual ?? 1));

  const propriedades = {
    "--rotacao-arma-vitrine": posicao.rotacao,
    "--inclinacao-horizontal-vitrine": posicao.inclinacaoHorizontal,
    "--inclinacao-vertical-vitrine": posicao.inclinacaoVertical,
    "--perspectiva-horizontal-vitrine": posicao.perspectivaHorizontal,
    "--perspectiva-vertical-vitrine": posicao.perspectivaVertical,
  };

  for (const [propriedade, valor] of Object.entries(propriedades)) {
    elemento.style.setProperty(propriedade, `${Number(valor ?? 0)}deg`);
  }
}

function criarNomeEquipamentoVitrine(
  nome,
  posicao = {},
  estadoCompatibilidade = "",
  categoria = "",
  itemId = "",
) {
  const interativo = Boolean(categoria && itemId);
  const rotulo = document.createElement(interativo ? "button" : "span");
  const rotuloX = Number(posicao.rotuloX ?? 0);
  const rotuloY = Number(posicao.rotuloY ?? 0);
  const centroHorizontal = Number(posicao.x) + Number(posicao.largura) / 2;
  const baseVertical = Number(posicao.y) + Number(posicao.altura);

  rotulo.className = "nome-equipamento-vitrine";
  if (interativo) {
    rotulo.type = "button";
    rotulo.dataset.categoriaEquipamento = categoria;
    rotulo.dataset.itemId = itemId;
    rotulo.setAttribute("aria-label", `Ver detalhes de ${nome}`);
  }
  if (estadoCompatibilidade) {
    rotulo.classList.add(`proficiencia-${estadoCompatibilidade}`);
  }
  rotulo.textContent = posicao.rotuloTexto ?? nome;
  rotulo.style.left = `calc(${centroHorizontal}% + ${rotuloX}px)`;
  rotulo.style.top = `calc(${baseVertical}% + 4px + ${rotuloY}px)`;

  return rotulo;
}

function criarArmaVitrine(armaId, arma, posicao) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.className = "arma-vitrine";
  botao.dataset.armaId = armaId;
  botao.setAttribute("aria-label", arma.nome);
  botao.title = `${arma.nome} — ${arma.dano} ${arma.tipoDano}`;

  const avaliacao = window.RegrasEquipamentos.avaliarUsoArma(personagem, armaId);
  botao.dataset.categoriaEquipamento = "armas";
  botao.dataset.itemId = armaId;
  botao.dataset.adequado = String(avaliacao.adequado);

  botao.style.left = `${posicao.x}%`;
  botao.style.top = `${posicao.y}%`;
  botao.style.width = `${posicao.largura}%`;
  botao.style.height = `${posicao.altura}%`;
  aplicarTransformacaoVitrine(botao, posicao);

  const imagem = document.createElement("img");

  imagem.src = arma.visual.icone.src;
  imagem.alt = "";
  imagem.draggable = false;

  botao.append(imagem);

  return botao;
}

function preencherPrateleiraArmas() {
  const armas = Object.entries(window.bancoEquipamentos.armas);

  prateleiraArmasCompactas.replaceChildren();
  prateleiraArmasLongas.replaceChildren();

  for (const [armaId, arma] of armas) {
    const posicao = posicoesArmasVitrine[armaId];

    if (!arma.visual?.icone?.src || !posicao) {
      continue;
    }

    const elementoArma = criarArmaVitrine(armaId, arma, posicao);
    const estadoCompatibilidade = window.RegrasEquipamentos.avaliarUsoArma(
      personagem,
      armaId,
    ).adequado
      ? "permitida"
      : "nao-permitida";

    const paredeLongas = window.ConfiguracaoVitrineEquipamentos.paredesArmas.longas;
    const prateleira = paredeLongas.includes(armaId)
      ? prateleiraArmasLongas
      : prateleiraArmasCompactas;

    prateleira.append(
      elementoArma,
      criarNomeEquipamentoVitrine(
        arma.nome,
        posicao,
        estadoCompatibilidade,
        "armas",
        armaId,
      ),
    );
  }
}

function adicionarDadoDetalheEquipamento(rotulo, valor) {
  const termo = document.createElement("dt");
  termo.textContent = rotulo;

  const descricao = document.createElement("dd");
  descricao.textContent = valor || "—";

  dadosDetalheEquipamento.append(termo, descricao);
}

function formatarAlcanceArma(arma) {
  if (arma.alcanceDistanciaPes) {
    const normal = arma.alcanceDistanciaPes.normal;
    const longo = arma.alcanceDistanciaPes.longo;
    return `${normal / 5} / ${longo / 5} células (${normal} / ${longo} pés)`;
  }

  return `${(arma.alcanceCorpoACorpoPes ?? 5) / 5} célula(s)`;
}

function obterQuantidadeNoInventario(categoria, id) {
  return (personagem.inventario?.itens ?? []).reduce(
    (total, item) =>
      item.categoria === categoria && item.id === id ? total + (item.quantidade ?? 0) : total,
    0,
  );
}

function sincronizarBeneficiosIniciaisPersonagem() {
  const classe = window.bancoClasses?.[personagem.classeId] ?? null;
  const antecedente = window.bancoAntecedentes?.[personagem.antecedenteId] ?? null;

  window.PersonagemDados.sincronizarBeneficiosIniciais(personagem, {
    classe,
    antecedente,
  });
}

function atualizarMarcacaoEquipamentosSelecionados() {
  document.querySelectorAll("[data-categoria-equipamento][data-item-id]").forEach(function (elemento) {
    const selecionada =
      obterQuantidadeNoInventario(
        elemento.dataset.categoriaEquipamento,
        elemento.dataset.itemId,
      ) > 0;

    elemento.classList.toggle("selecionada", selecionada);
  });
}

function formatarMoeda(valor) {
  return `${Number(valor ?? 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} PO`;
}

function obterDadosEquipamentoDetalhado() {
  if (!equipamentoDetalhado) {
    return null;
  }

  return window.bancoEquipamentos[equipamentoDetalhado.categoria]?.[equipamentoDetalhado.id] ?? null;
}

function atualizarResumoOrcamentoLoja() {
  const economia = personagem.economiaCriacao ?? {};
  orcamentoTotalLoja.textContent = formatarMoeda(economia.orcamentoEquipamentos);
  saldoOrcamentoLoja.textContent = formatarMoeda(economia.saldoOrcamentoEquipamentos);
  ouroRetidoLoja.textContent = `${formatarMoeda(economia.ouroRetidoOrcamento)} (${
    economia.percentualRetencao ?? 0
  }%)`;

  const equipamento = obterDadosEquipamentoDetalhado();
  const quantidadeNoInventario = equipamentoDetalhado
  ? obterQuantidadeNoInventario(
      equipamentoDetalhado.categoria,
      equipamentoDetalhado.id,
    )
  : 0;
  const quantidadeComprada = (personagem.inventario?.itens ?? [])
    .filter(
      (item) =>
        item.categoria === equipamentoDetalhado?.categoria &&
        item.id === equipamentoDetalhado?.id &&
        item.origem === "compraInicial",
    )
    .reduce((total, item) => total + item.quantidade, 0);

  botaoAdicionarEquipamentoLoja.disabled =
    !equipamento ||
    Number(equipamento.precoPO ?? 0) > Number(economia.saldoOrcamentoEquipamentos ?? 0);
  botaoRemoverEquipamentoLoja.disabled = quantidadeComprada === 0;
}

function abrirDetalheArmaLoja(armaId) {
  const arma = window.bancoEquipamentos.armas[armaId];

  if (!arma) {
    return;
  }

  equipamentoDetalhado = { categoria: "armas", id: armaId };
  const avaliacao = window.RegrasEquipamentos.avaliarUsoArma(personagem, armaId);

  imagemDetalheEquipamento.src = arma.visual?.icone?.src ?? "";
  imagemDetalheEquipamento.alt = arma.nome;
  nomeDetalheEquipamento.textContent = arma.nome;
  dadosDetalheEquipamento.replaceChildren();

  adicionarDadoDetalheEquipamento("Categoria", `${arma.tipo ?? ""} — ${arma.categoria ?? ""}`);
  adicionarDadoDetalheEquipamento("Dano", `${arma.dano} ${arma.tipoDano}`);
  adicionarDadoDetalheEquipamento(
    "Propriedades",
    (arma.propriedades ?? [])
      .map((id) => window.bancoPropriedadesArmas?.[id]?.nome ?? id)
      .join(", "),
  );
  adicionarDadoDetalheEquipamento("Alcance", formatarAlcanceArma(arma));
  adicionarDadoDetalheEquipamento(
    "Maestria",
    window.bancoMaestrias?.[arma.maestria]?.nome ?? arma.maestria,
  );
  adicionarDadoDetalheEquipamento("Preço", `${arma.precoPO ?? 0} PO`);
  adicionarDadoDetalheEquipamento(
    "No equipamento",
    String(obterQuantidadeNoInventario("armas", armaId)),
  );

  estadoCompatibilidadeEquipamento.textContent = avaliacao.adequado
    ? "Uso sem penalidades."
    : "Esta arma possui ressalvas para o personagem.";
  estadoCompatibilidadeEquipamento.className = `estado-proficiencia-arma ${
    avaliacao.adequado ? "proficiencia-permitida" : "proficiencia-nao-permitida"
  }`;
  mensagemDetalheEquipamento.textContent =
    avaliacao.problemas.length > 0
      ? avaliacao.problemas.join(" ")
      : "Nenhuma penalidade identificada para o uso desta arma.";

  detalheArmaLoja.classList.remove("escondida");
  atualizarResumoOrcamentoLoja();
}

function abrirDetalheArmaduraLoja(armaduraId) {
  const armadura = window.bancoEquipamentos.armaduras[armaduraId];

  if (!armadura) {
    return;
  }

  equipamentoDetalhado = { categoria: "armaduras", id: armaduraId };
  const avaliacao = window.RegrasEquipamentos.avaliarUsoArmadura(personagem, armaduraId);

  imagemDetalheEquipamento.src = armadura.visual?.vitrine?.src ?? armadura.visual?.icone?.src ?? "";
  imagemDetalheEquipamento.alt = armadura.nome;
  nomeDetalheEquipamento.textContent = armadura.nome;
  dadosDetalheEquipamento.replaceChildren();

  adicionarDadoDetalheEquipamento("Categoria", armadura.categoria);
  adicionarDadoDetalheEquipamento("Classe de Armadura", String(armadura.caBase));
  adicionarDadoDetalheEquipamento(
    "Destreza",
    armadura.usaDestreza
      ? armadura.limiteDestreza === null
        ? "Modificador completo"
        : `Modificador limitado a +${armadura.limiteDestreza}`
      : "Não adiciona o modificador",
  );
  adicionarDadoDetalheEquipamento(
    "Furtividade",
    armadura.desvantagemFurtividade ? "Desvantagem" : "Sem penalidade",
  );
  adicionarDadoDetalheEquipamento(
    "Força mínima",
    armadura.forcaMinima ? String(armadura.forcaMinima) : "Nenhuma",
  );
  adicionarDadoDetalheEquipamento("Peso", `${armadura.pesoLb ?? 0} lb`);
  adicionarDadoDetalheEquipamento("Preço", `${armadura.precoPO ?? 0} PO`);
  adicionarDadoDetalheEquipamento(
    "Vestir / remover",
    `${armadura.tempoVestirMinutos ?? 0} / ${armadura.tempoRemoverMinutos ?? 0} minuto(s)`,
  );
  adicionarDadoDetalheEquipamento(
    "No equipamento",
    String(obterQuantidadeNoInventario("armaduras", armaduraId)),
  );

  estadoCompatibilidadeEquipamento.textContent = avaliacao.adequado
    ? "Uso sem penalidades."
    : "Esta armadura possui ressalvas para o personagem.";
  estadoCompatibilidadeEquipamento.className = `estado-proficiencia-arma ${
    avaliacao.adequado ? "proficiencia-permitida" : "proficiencia-nao-permitida"
  }`;
  mensagemDetalheEquipamento.textContent =
    avaliacao.problemas.length > 0
      ? avaliacao.problemas.join(" ")
      : "Nenhuma penalidade identificada para o uso desta armadura.";

  detalheArmaLoja.classList.remove("escondida");
  atualizarResumoOrcamentoLoja();
}

function fecharDetalheArmaLoja() {
  detalheArmaLoja.classList.add("escondida");
  equipamentoDetalhado = null;
}

function adicionarEquipamentoPelaLoja() {
  if (!equipamentoDetalhado) {
    return;
  }

  const equipamento = obterDadosEquipamentoDetalhado();
  const resultado = window.PersonagemDados.comprarEquipamentoInicial(personagem, {
    ...equipamentoDetalhado,
    precoPO: equipamento?.precoPO ?? 0,
    quantidade: 1,
  });

  if (!resultado.sucesso) {
    mensagemDetalheEquipamento.textContent = "Orçamento insuficiente para esta compra.";
    return;
  }

  atualizarMarcacaoEquipamentosSelecionados();
  atualizarResumoOrcamentoLoja();
  mensagemDetalheEquipamento.textContent = `Compra adicionada. Quantidade comprada: ${resultado.item.quantidade}.`;
}

function removerEquipamentoPelaLoja() {
  if (!equipamentoDetalhado) {
    return;
  }

  const resultado = window.PersonagemDados.devolverEquipamentoInicial(personagem, {
    ...equipamentoDetalhado,
    quantidade: 1,
  });

  if (!resultado.sucesso) {
    mensagemDetalheEquipamento.textContent = "Este item não foi comprado na loja inicial.";
    return;
  }

  sincronizarConfiguracaoComInventario(
  equipamentoDetalhado.categoria,
  equipamentoDetalhado.id,
);

  atualizarMarcacaoEquipamentosSelecionados();
  atualizarResumoOrcamentoLoja();
  mensagemDetalheEquipamento.textContent = `Item devolvido. Reembolso: ${formatarMoeda(
    resultado.reembolso,
  )}.`;
}

function criarArmaduraVitrine(armaduraId, armadura, posicao) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.className = "arma-vitrine armadura-vitrine";
  botao.dataset.armaduraId = armaduraId;
  botao.dataset.categoriaEquipamento = "armaduras";
  botao.dataset.itemId = armaduraId;
  botao.dataset.adequado = String(
    window.RegrasEquipamentos.avaliarUsoArmadura(personagem, armaduraId).adequado,
  );
  botao.setAttribute("aria-label", armadura.nome);
  botao.title = `${armadura.nome} — CA ${armadura.caBase}`;
  botao.style.left = `${posicao.x}%`;
  botao.style.top = `${posicao.y}%`;
  botao.style.width = `${posicao.largura}%`;
  botao.style.height = `${posicao.altura}%`;
  aplicarTransformacaoVitrine(botao, posicao);

  const imagem = document.createElement("img");
  imagem.src = armadura.visual.vitrine?.src ?? armadura.visual.icone.src;
  imagem.alt = "";
  imagem.draggable = false;
  botao.append(imagem);

  return botao;
}

function preencherVitrineArmaduras() {
  vitrineArmaduras.replaceChildren();

  for (const [armaduraId, armadura] of Object.entries(window.bancoEquipamentos.armaduras)) {
    const posicao = posicoesArmadurasVitrine[armaduraId];

    if (!armadura.visual?.icone?.src || !posicao) {
      continue;
    }

    const estadoCompatibilidade = window.RegrasEquipamentos.avaliarUsoArmadura(
      personagem,
      armaduraId,
    ).adequado
      ? "permitida"
      : "nao-permitida";

    vitrineArmaduras.append(
      criarArmaduraVitrine(armaduraId, armadura, posicao),
      criarNomeEquipamentoVitrine(
        armadura.nome,
        posicao,
        estadoCompatibilidade,
        "armaduras",
        armaduraId,
      ),
    );
  }
}

function obterItensDisponiveisParaSlot(slot) {
  const categoriasPermitidas =
    slot === "armadura"
      ? ["armaduras"]
      : ["armas", "itensSecundarios"];

  const itensAgrupados = new Map();

  for (const item of personagem.inventario?.itens ?? []) {
    if (!categoriasPermitidas.includes(item.categoria)) {
      continue;
    }

    if (
      item.categoria === "itensSecundarios" &&
      item.id !== "escudo"
    ) {
      continue;
    }

    const chave = `${item.categoria}:${item.id}`;
    const itemExistente = itensAgrupados.get(chave);

    if (itemExistente) {
      itemExistente.quantidade += item.quantidade ?? 0;
      continue;
    }

    itensAgrupados.set(chave, {
      categoria: item.categoria,
      id: item.id,
      quantidade: item.quantidade ?? 0,
    });
  }

  return Array.from(itensAgrupados.values());
}

function contarUnidadesUsadasEmOutrasMaos(item, slotIgnorado) {
  const configuracao = personagem.configuracaoInicialCombate;
  let quantidadeUsada = 0;

  for (const slot of ["mao1", "mao2"]) {
    if (slot === slotIgnorado) {
      continue;
    }

    const itemEquipado = configuracao[slot];

    if (
      itemEquipado &&
      !itemEquipado.ocupadaPor &&
      itemEquipado.categoria === item.categoria &&
      itemEquipado.id === item.id
    ) {
      quantidadeUsada += 1;
    }
  }

  return quantidadeUsada;
}

function obterNomeItemConfigurado(item) {
  if (!item) {
    return "Vazia";
  }

  if (item.ocupadaPor) {
    const itemResponsavel =
      personagem.configuracaoInicialCombate[item.ocupadaPor];

    const equipamentoResponsavel =
      window.bancoEquipamentos[
        itemResponsavel?.categoria
      ]?.[itemResponsavel?.id];

    return equipamentoResponsavel
      ? `Ocupada por ${equipamentoResponsavel.nome}`
      : "Ocupada";
  }

  return (
    window.bancoEquipamentos[item.categoria]?.[item.id]?.nome ??
    item.id
  );
}

function atualizarPainelConfiguracaoInicial() {
  const configuracao = personagem.configuracaoInicialCombate;
  const armadura = configuracao.armadura;

  nomeArmaduraConfigurada.textContent = armadura
    ? window.bancoEquipamentos[armadura.categoria]?.[armadura.id]
        ?.nome ?? armadura.id
    : "Nenhuma";

  nomeEquipamentoMao1.textContent =
    obterNomeItemConfigurado(configuracao.mao1);

  nomeEquipamentoMao2.textContent =
    obterNomeItemConfigurado(configuracao.mao2);
}

function preencherListaConfiguracaoEquipamento() {
  listaConfiguracaoEquipamento.replaceChildren();

  const itensDisponiveis =
    obterItensDisponiveisParaSlot(slotConfiguracaoAtual);

  if (itensDisponiveis.length === 0) {
    const mensagem = document.createElement("p");

    mensagem.textContent =
      slotConfiguracaoAtual === "armadura"
        ? "Nenhuma armadura foi comprada."
        : "Nenhuma arma ou escudo foi comprado.";

    listaConfiguracaoEquipamento.appendChild(mensagem);
    return;
  }

  for (const item of itensDisponiveis) {
    const equipamento =
      window.bancoEquipamentos[item.categoria]?.[item.id];

    if (!equipamento) {
      continue;
    }

    const botao = document.createElement("button");
    const quantidadeUsada =
      slotConfiguracaoAtual === "armadura"
        ? 0
        : contarUnidadesUsadasEmOutrasMaos(
            item,
            slotConfiguracaoAtual,
          );

    botao.type = "button";
    botao.className = "opcao-configuracao-equipamento";
    botao.dataset.categoria = item.categoria;
    botao.dataset.itemId = item.id;
    botao.disabled = quantidadeUsada >= item.quantidade;

    const quantidadeDisponivel =
      item.quantidade - quantidadeUsada;

    botao.textContent =
      item.quantidade > 1
        ? `${equipamento.nome} — ${quantidadeDisponivel} disponível`
        : equipamento.nome;

    listaConfiguracaoEquipamento.appendChild(botao);
  }
}

function obterOutroSlotMao(slot) {
  return slot === "mao1" ? "mao2" : "mao1";
}

function liberarSlotConfiguracao(slot) {
  const configuracao = personagem.configuracaoInicialCombate;
  const itemAtual = configuracao[slot];

  if (itemAtual?.ocupadaPor) {
    configuracao[itemAtual.ocupadaPor] = null;
  }

  const outroSlot = obterOutroSlotMao(slot);

  if (configuracao[outroSlot]?.ocupadaPor === slot) {
    configuracao[outroSlot] = null;
  }

  configuracao[slot] = null;
}

function sincronizarConfiguracaoComInventario(categoria, itemId) {
  const configuracao = personagem.configuracaoInicialCombate;
  const quantidadePossuida =
    obterQuantidadeNoInventario(categoria, itemId);

  if (
    configuracao.armadura?.categoria === categoria &&
    configuracao.armadura?.id === itemId &&
    quantidadePossuida === 0
  ) {
    configuracao.armadura = null;
  }

  const slotsComItem = ["mao1", "mao2"].filter(function (slot) {
    const itemEquipado = configuracao[slot];

    return (
      itemEquipado &&
      !itemEquipado.ocupadaPor &&
      itemEquipado.categoria === categoria &&
      itemEquipado.id === itemId
    );
  });

  while (slotsComItem.length > quantidadePossuida) {
    const slotRemovido = slotsComItem.pop();

    liberarSlotConfiguracao(slotRemovido);
  }

  atualizarEquipamentos();
  atualizarPainelConfiguracaoInicial();
}

function selecionarItemConfiguracao(categoria, itemId) {
  const configuracao = personagem.configuracaoInicialCombate;

  if (slotConfiguracaoAtual === "armadura") {
    configuracao.armadura = {
      categoria,
      id: itemId,
    };

    atualizarEquipamentos();
    atualizarPainelConfiguracaoInicial();
    fecharModalConfiguracaoEquipamento();
    return;
  }

  if (
    slotConfiguracaoAtual !== "mao1" &&
    slotConfiguracaoAtual !== "mao2"
  ) {
    return;
  }

  const slotEscolhido = slotConfiguracaoAtual;
  const outroSlot = obterOutroSlotMao(slotEscolhido);
  const equipamento =
    window.bancoEquipamentos[categoria]?.[itemId];

  liberarSlotConfiguracao(slotEscolhido);

  const exigeDuasMaos =
    categoria === "armas" &&
    equipamento?.propriedades?.includes("duasMaos");

  if (exigeDuasMaos) {
    liberarSlotConfiguracao(outroSlot);

    configuracao[slotEscolhido] = {
      categoria,
      id: itemId,
    };

    configuracao[outroSlot] = {
      ocupadaPor: slotEscolhido,
    };
  } else {
    configuracao[slotEscolhido] = {
      categoria,
      id: itemId,
    };
  }

  atualizarEquipamentos();
  atualizarPainelConfiguracaoInicial();
  fecharModalConfiguracaoEquipamento();
}

function esvaziarSlotConfiguracaoAtual() {
  const configuracao = personagem.configuracaoInicialCombate;

  if (slotConfiguracaoAtual === "armadura") {
    configuracao.armadura = null;
  } else if (
    slotConfiguracaoAtual === "mao1" ||
    slotConfiguracaoAtual === "mao2"
  ) {
    liberarSlotConfiguracao(slotConfiguracaoAtual);
  }

  atualizarEquipamentos();
  atualizarPainelConfiguracaoInicial();
  fecharModalConfiguracaoEquipamento();
}

const configuracoesSlotsEquipamento = {
  armadura: {
    titulo: "Escolher armadura",
    descricao: "Selecione uma armadura presente no inventário.",
  },

  mao1: {
    titulo: "Configurar Mão 1",
    descricao: "Selecione uma arma ou escudo presente no inventário.",
  },

  mao2: {
    titulo: "Configurar Mão 2",
    descricao: "Selecione uma arma ou escudo presente no inventário.",
  },
};

function abrirModalConfiguracaoEquipamento(slot) {
  const configuracao = configuracoesSlotsEquipamento[slot];

  if (!configuracao) {
    return;
  }

  slotConfiguracaoAtual = slot;

  tituloModalConfiguracaoEquipamento.textContent =
    configuracao.titulo;

  descricaoModalConfiguracaoEquipamento.textContent =
    configuracao.descricao;

  listaConfiguracaoEquipamento.replaceChildren();

  preencherListaConfiguracaoEquipamento();

  modalConfiguracaoEquipamento.classList.remove("escondida");
  document.body.classList.add("modal-aberta");
}

function fecharModalConfiguracaoEquipamento() {
  modalConfiguracaoEquipamento.classList.add("escondida");
  document.body.classList.remove("modal-aberta");

  slotConfiguracaoAtual = null;
  listaConfiguracaoEquipamento.replaceChildren();
}

function abrirModalEquipamentos() {
  modalEquipamentos.classList.remove("escondida");
  document.body.classList.add("modal-aberta");
  preencherPrateleiraArmas();
  preencherVitrineArmaduras();
  mostrarVistaLoja("compactas");
  fecharDetalheArmaLoja();
  atualizarMarcacaoEquipamentosSelecionados();
  atualizarResumoOrcamentoLoja();
}

function fecharModalEquipamentos() {
  modalEquipamentos.classList.add("escondida");
  document.body.classList.remove("modal-aberta");
}

botaoEscolherEquipamento.addEventListener("click", abrirModalEquipamentos);

botaoFecharModalEquipamentos.addEventListener("click", fecharModalEquipamentos);

botaoFecharDetalheArma.addEventListener("click", fecharDetalheArmaLoja);
botaoAdicionarEquipamentoLoja.addEventListener("click", adicionarEquipamentoPelaLoja);

listaConfiguracaoEquipamento.addEventListener(
  "click",
  function (evento) {
    const botao = evento.target.closest(
      ".opcao-configuracao-equipamento",
    );

    if (!botao || botao.disabled) {
      return;
    }

    selecionarItemConfiguracao(
      botao.dataset.categoria,
      botao.dataset.itemId,
    );
  },
);

botaoEsvaziarSlotEquipamento.addEventListener(
  "click",
  esvaziarSlotConfiguracaoAtual,
);

botaoRemoverEquipamentoLoja.addEventListener("click", removerEquipamentoPelaLoja);

botaoProximaVistaLoja.addEventListener("click", () => {
  mostrarVistaLoja(vistasLoja[indiceVistaLoja + 1]);
});

botaoVistaAnteriorLoja.addEventListener("click", () => {
  mostrarVistaLoja(vistasLoja[indiceVistaLoja - 1]);
});

modalEquipamentos.addEventListener("click", (evento) => {
  const equipamentoSelecionado = evento.target.closest(
    "[data-categoria-equipamento][data-item-id]",
  );

  if (equipamentoSelecionado) {
    const categoria = equipamentoSelecionado.dataset.categoriaEquipamento;
    const itemId = equipamentoSelecionado.dataset.itemId;

    if (categoria === "armas") {
      abrirDetalheArmaLoja(itemId);
    } else if (categoria === "armaduras") {
      abrirDetalheArmaduraLoja(itemId);
    }

    return;
  }

  if (evento.target === modalEquipamentos) {
    fecharModalEquipamentos();
  }
});

botaoConfigurarArmadura.addEventListener("click", function () {
  abrirModalConfiguracaoEquipamento("armadura");
});

botaoConfigurarMao1.addEventListener("click", function () {
  abrirModalConfiguracaoEquipamento("mao1");
});

botaoConfigurarMao2.addEventListener("click", function () {
  abrirModalConfiguracaoEquipamento("mao2");
});

botaoFecharConfiguracaoEquipamento.addEventListener(
  "click",
  fecharModalConfiguracaoEquipamento,
);

modalConfiguracaoEquipamento.addEventListener("click", function (evento) {
  if (evento.target === modalConfiguracaoEquipamento) {
    fecharModalConfiguracaoEquipamento();
  }
});

const prateleiraArmasCompactas = document.getElementById("prateleiraArmasCompactas");

const prateleiraArmasLongas = document.getElementById("prateleiraArmasLongas");

const vitrineArmaduras = document.getElementById("vitrineArmaduras");

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
  generoGramatical: null,
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
      const nomeArquivo = (prefixoEspecie + "_" + genero + "_" + arquetipo + ".webp").toLowerCase();

      avataresDisponiveis.push({
        genero: genero,

        arquetipo: arquetipo,

        caminho: "assets/avatares/" + especieId + "/" + genero.toLowerCase() + "/" + nomeArquivo,
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
    imagem: "assets/classes/guerreiro-modal.webp",
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
    imagem: "assets/classes/mago-modal.webp",
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
    imagem: "assets/classes/ladino-modal.webp",
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
    imagem: "assets/classes/clerigo-modal.webp",
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

const personagem = window.PersonagemDados.criarInicial();

atualizarPainelConfiguracaoInicial();

function atualizarFichaPersonagem(secoes) {
  const raizFicha = document.querySelector("[data-ficha-personagem]");

  window.FichaPersonagem.renderizar(personagem, raizFicha, {
    secoes: secoes,
  });
}

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
  personagem.niveisPorClasse = {
    [classeAtualNaModal]: 1,
  };

  sincronizarBeneficiosIniciaisPersonagem();

  fichaClasseNivel.textContent = dados.nome + " " + personagem.nivel;

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

  sincronizarBeneficiosIniciaisPersonagem();

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
  atualizarFichaPersonagem(["informacoesBasicas", "equipamentos", "talentos", "marcadores"]);
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

  atualizarPontosDeVida();

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

    const validacaoEquipamentos = validarCombinacaoEquipamentos();

    if (!validacaoEquipamentos.valido) {
      if (mensagem !== null) {
        mensagem.textContent = validacaoEquipamentos.erros[0];
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

  avatarTemporario.generoGramatical =
    botaoClicado.dataset.generoAvatar === "Female" ? "feminino" : "masculino";

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

    const caminhoFrame = "assets/avatares/frame/" + "frame-" + numeroFormatado + ".webp";

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
    generoGramatical: personagem.avatar.generoGramatical ?? null,
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
  personagem.avatar.generoGramatical = avatarTemporario.generoGramatical;

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

function sincronizarConfiguracaoInicialComCombate() {
  const configuracao = personagem.configuracaoInicialCombate ?? {
    armadura: null,
    mao1: null,
    mao2: null,
  };

  const itensNasMaos = [
    configuracao.mao1,
    configuracao.mao2,
  ].filter(function (item) {
    return item && !item.ocupadaPor;
  });

  const armasEmpunhadas = itensNasMaos.filter(function (item) {
    return item.categoria === "armas";
  });

  const escudoEmpunhado = itensNasMaos.some(function (item) {
    return (
      item.categoria === "itensSecundarios" &&
      item.id === "escudo"
    );
  });

  const primeiraArma = armasEmpunhadas[0] ?? null;
  const segundaArma = armasEmpunhadas[1] ?? null;

  personagem.detalhes.equipamentos = {
    armadura:
      configuracao.armadura?.id ?? "semArmadura",

    armaPrincipal:
      primeiraArma?.id ?? "",

    itemSecundario: escudoEmpunhado
      ? "escudo"
      : segundaArma
        ? "armaSecundaria"
        : "nada",

    armaSecundaria:
      segundaArma?.id ?? "",

    proficiencias:
      proficienciasPorClasse[personagem.classeId] || [],
  };
}

function atualizarEquipamentos() {
  sincronizarConfiguracaoInicialComCombate();

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

function calcularClasseArmaduraCriacao() {
  const classeArmadura = window.calcularClasseArmadura(personagem);

  return classeArmadura === "-" ? "" : classeArmadura;
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

  const operacoesPontosDeVida =
    window.TradutorRegras?.prepararOperacoes({
      gatilho: "aoCalcularPontosDeVidaMaximos",

      participante: personagem,
    }) ?? [];

  let bonusPontosDeVida = 0;

  for (const operacao of operacoesPontosDeVida) {
    if (operacao.tipo !== "aumentarPontosDeVidaMaximos") {
      continue;
    }

    bonusPontosDeVida += Number(operacao.quantidade) || 0;
  }

  const pontosDeVidaMaximos = window.PersonagemDados.calcularPontosDeVidaIniciais({
    dadoVida,
    constituicao,
    bonus: bonusPontosDeVida,
  });

  if (pontosDeVidaMaximos === null) {
    pvAtuais.textContent = "";
    pvMaximo.textContent = "";
    atualizarFichaPersonagem(["combate"]);
    return;
  }

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

function atualizarSentidosPersonagem() {
  const operacoesSentidos =
    window.TradutorRegras?.prepararOperacoes({
      gatilho: "passivo",

      participante: personagem,
    }) ?? [];

  const sentidos = {};

  for (const operacao of operacoesSentidos) {
    if (operacao.tipo !== "concederSentido") {
      continue;
    }

    const alcanceAtual = Number(sentidos[operacao.sentido]?.alcance) || 0;

    const novoAlcance = Number(operacao.alcance) || 0;

    sentidos[operacao.sentido] = {
      alcance: Math.max(alcanceAtual, novoAlcance),
    };
  }

  personagem.sentidos = sentidos;
}

function atualizarValoresDerivados() {
  atualizarMarcadoresSalvaguardas();
  atualizarIniciativa();
  atualizarVelocidadeETamanho();
  atualizarPercepcaoPassiva();
  atualizarSentidosPersonagem();

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
    personagem.detalhes.nome !== undefined &&
    personagem.detalhes.nome.trim() !== "";

  const idiomasPreenchidos =
    personagem.idiomasEscolhidos.length >= 2;

  const equipamentosValidos =
    validarCombinacaoEquipamentos().valido;

  return (
    nomePreenchido &&
    idiomasPreenchidos &&
    equipamentosValidos
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
    criarParagrafoRevisao("Classe", personagem.classe + " " + personagem.nivel),
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

function adicionarEquipamentoClasseRevisao(bloco) {
  const equipamentoClasse = personagem.equipamentoClasse;

  if (!equipamentoClasse) {
    return;
  }

  const subtitulo = document.createElement("h4");
  subtitulo.textContent = "Equipamento da classe";
  bloco.appendChild(subtitulo);

  bloco.appendChild(criarParagrafoRevisao("Escolha", equipamentoClasse.nome));

  const itens = equipamentoClasse.itens ?? [];

  if (itens.length > 0) {
    const lista = document.createElement("ul");
    lista.classList.add("lista-equipamento-antecedente-revisao");

    for (const item of itens) {
      const nomeItem = obterNomeEquipamento(item.id);
      const quantidade = item.quantidade ?? 1;
      const linha = document.createElement("li");
      linha.textContent = quantidade > 1 ? `${quantidade}× ${nomeItem}` : nomeItem;
      lista.appendChild(linha);
    }

    bloco.appendChild(lista);
  }

  bloco.appendChild(
    criarParagrafoRevisao(
      "Moedas da classe",
      `${equipamentoClasse.moedas?.ouro ?? 0} peças de ouro`,
    ),
  );
}

function adicionarMaoConfiguradaRevisao(
  bloco,
  slot,
  rotulo,
) {
  const item =
    personagem.configuracaoInicialCombate?.[slot];

  if (!item) {
    bloco.appendChild(
      criarParagrafoRevisao(rotulo, "Vazia"),
    );
    return;
  }

  if (item.ocupadaPor) {
    const itemResponsavel =
      personagem.configuracaoInicialCombate[
        item.ocupadaPor
      ];

    const nomeItemResponsavel =
      obterNomeItemConfigurado(itemResponsavel);

    bloco.appendChild(
      criarParagrafoRevisao(
        rotulo,
        `Ocupada por ${nomeItemResponsavel}`,
      ),
    );

    return;
  }

  if (item.categoria === "armas") {
    bloco.appendChild(
      criarLinhaArmaRevisao(item.id, rotulo),
    );
    return;
  }

  bloco.appendChild(
    criarParagrafoRevisao(
      rotulo,
      obterNomeItemConfigurado(item),
    ),
  );
}

function montarRevisaoEquipamentos() {
  const bloco = document.createElement("section");
  bloco.classList.add("bloco-revisao");

  const titulo = document.createElement("h3");
  titulo.textContent = "Equipamentos e Valores";
  bloco.appendChild(titulo);

  const economia = personagem.economiaCriacao ?? {};
  const ouroProjetado =
    (economia.ouroFixoClasse ?? 0) +
    (economia.ouroFixoAntecedente ?? 0) +
    (economia.ouroRetidoOrcamento ?? 0);

  bloco.append(
    criarParagrafoRevisao(
      "Orçamento gasto",
      formatarMoeda(
        (economia.orcamentoEquipamentos ?? 0) -
          (economia.saldoOrcamentoEquipamentos ?? 0),
      ),
    ),
    criarParagrafoRevisao(
      "Saldo do orçamento",
      formatarMoeda(economia.saldoOrcamentoEquipamentos),
    ),
    criarParagrafoRevisao(
      `Parcela guardada (${economia.percentualRetencao ?? 0}%)`,
      formatarMoeda(economia.ouroRetidoOrcamento),
    ),
    criarParagrafoRevisao("Moedas ao iniciar a aventura", formatarMoeda(ouroProjetado)),
  );

  const itensInventario = personagem.inventario?.itens ?? [];

  if (itensInventario.length > 0) {
    const subtituloInventario = document.createElement("h4");
    subtituloInventario.textContent = "Inventário inicial";
    const listaInventario = document.createElement("ul");
    listaInventario.classList.add("lista-equipamento-antecedente-revisao");

    for (const item of itensInventario) {
      const linha = document.createElement("li");
      const nome = obterNomeEquipamento(item.id);
      linha.textContent = item.quantidade > 1 ? `${item.quantidade}× ${nome}` : nome;
      listaInventario.appendChild(linha);
    }

    bloco.append(subtituloInventario, listaInventario);
  }

  const configuracao =
  personagem.configuracaoInicialCombate;

const armaduraConfigurada =
  configuracao?.armadura;

const nomeArmadura = armaduraConfigurada
  ? window.bancoEquipamentos[
      armaduraConfigurada.categoria
    ]?.[armaduraConfigurada.id]?.nome ??
    armaduraConfigurada.id
  : "Nenhuma";

bloco.appendChild(
  criarParagrafoRevisao(
    "Armadura",
    nomeArmadura,
  ),
);

adicionarMaoConfiguradaRevisao(
  bloco,
  "mao1",
  "Arma Principal",
);

adicionarMaoConfiguradaRevisao(
  bloco,
  "mao2",
  "Arma Secundária",
);

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

  const personagemParaSalvar = structuredClone(personagem);
  window.PersonagemDados.finalizarEconomiaCriacao(personagemParaSalvar);

  return window.PersonagemDados.adicionarSalvo(personagemParaSalvar);
}

botaoFinalizarPersonagem.addEventListener("click", function () {
  if (personagemJaFoiSalvo === true) {
    return;
  }

  const personagemSalvo = salvarPersonagemLocal();

  if (!personagemSalvo) {
    const mensagem = document.getElementById("mensagemRevisao");

    if (mensagem !== null) {
      mensagem.textContent = "Não foi possível salvar o personagem.";
    }

    return;
  }

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

function obterDadosHabilidade(idHabilidade) {
  if (window.bancoHabilidades?.classFeatures === undefined) {
    return undefined;
  }

  return window.bancoHabilidades.classFeatures[idHabilidade];
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

      recuperacao: structuredClone(recurso.recuperacao ?? null),

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
