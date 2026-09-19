"use strict";

// =====================================================
// Dados compartilhados do personagem
// -----------------------------------------------------
// Define o formato atual do personagem e adapta personagens
// antigos para que as páginas possam continuar usando-os.
// =====================================================


function criarPersonagemInicial() {
  return {
    schemaVersion: 1,
    rulesVersion: "2024",
    nivel: 1,

    niveisPorClasse: {},

    xp: 0,

    classeId: "",
    classe: "",

    atributosBase: {},
    bonusAtributosAntecedente: {},
    atributos: {},

    combate: {
      classeArmadura: null,

      pontosDeVida: {
        atuais: null,
        temporarios: 0,
        maximo: null,
        dadoVida: "",
        dadosVidaUsados: 0,
      },

      ataques: [],
    },

    antecedenteId: "",
    antecedente: "",
    equipamentoAntecedenteId: "",
    equipamentoAntecedente: null,
    equipamentoClasseId: "",
    equipamentoClasse: null,

    especieId: "",
    especie: "",

    avatar: {
      imagem: "",
      frame: "",
    },

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

    inventario: {
      itens: [],
      moedas: {
        ouro: 0,
      },
    },

    economiaCriacao: {
      ouroFixoClasse: 0,
      ouroFixoAntecedente: 0,
      orcamentoEquipamentos: 0,
      saldoOrcamentoEquipamentos: 0,
      percentualRetencao: 0,
      ouroRetidoOrcamento: 0,
      finalizada: false,
    },

    configuracaoInicialCombate: {
  armadura: null,
  mao1: null,
  mao2: null,
},

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
}

function adicionarItemInventario(personagem, { categoria, id, quantidade = 1, origem = "" }) {
  if (!personagem || typeof personagem !== "object") {
    throw new TypeError("O personagem é obrigatório.");
  }

  if (typeof categoria !== "string" || typeof id !== "string") {
    throw new TypeError("Categoria e id do item são obrigatórios.");
  }

  const quantidadeNumerica = Number(quantidade);

  if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica <= 0) {
    throw new RangeError("A quantidade precisa ser um número inteiro positivo.");
  }

  personagem.inventario ??= { itens: [], moedas: { ouro: 0 } };
  personagem.inventario.itens ??= [];
  personagem.inventario.moedas ??= {};
  personagem.inventario.moedas.ouro ??= 0;

  const itemExistente = personagem.inventario.itens.find(
    (item) =>
      item.categoria === categoria &&
      item.id === id &&
      (item.origem ?? "") === origem,
  );

  if (itemExistente) {
    itemExistente.quantidade += quantidadeNumerica;
    return itemExistente;
  }

  const novoItem = { categoria, id, quantidade: quantidadeNumerica };

  if (origem) {
    novoItem.origem = origem;
  }

  personagem.inventario.itens.push(novoItem);
  return novoItem;
}

function sincronizarBeneficiosIniciais(personagem, { classe = null, antecedente = null } = {}) {
  if (!personagem || typeof personagem !== "object") {
    throw new TypeError("O personagem é obrigatório.");
  }

  personagem.inventario ??= { itens: [], moedas: { ouro: 0 } };
  personagem.inventario.itens = (personagem.inventario.itens ?? []).filter(
    (item) => item.origem !== "concessaoInicial",
  );
  personagem.inventario.moedas ??= { ouro: 0 };

  const economiaClasse = classe?.economiaInicial ?? {};
  const ouroFixoClasse = Number(economiaClasse.ouroFixo) || 0;
  const ouroFixoAntecedente = Number(antecedente?.ouroInicial) || 0;
  const orcamentoEquipamentos = Number(economiaClasse.orcamentoEquipamentos) || 0;
  const percentualRetencao = Number(economiaClasse.percentualRetencao) || 0;

  personagem.economiaCriacao = {
    ouroFixoClasse,
    ouroFixoAntecedente,
    orcamentoEquipamentos,
    saldoOrcamentoEquipamentos: orcamentoEquipamentos,
    percentualRetencao,
    ouroRetidoOrcamento: 0,
    finalizada: false,
  };

  personagem.inventario.moedas.ouro = ouroFixoClasse + ouroFixoAntecedente;

  adicionarItemInventario(personagem, {
    categoria: "itensGerais",
    id: "equipamentoAventura",
    quantidade: 1,
    origem: "concessaoInicial",
  });

  const ferramentas = new Set([
    ...(classe?.proficiencias?.ferramentas ?? []),
    ...(antecedente?.proficiencias?.ferramentas ?? antecedente?.ferramentas ?? []),
  ]);

  for (const ferramentaId of ferramentas) {
    adicionarItemInventario(personagem, {
      categoria: "itensGerais",
      id: ferramentaId,
      quantidade: 1,
      origem: "concessaoInicial",
    });
  }

  return personagem;
}

function atualizarOuroRetidoOrcamento(personagem) {
  const economia = personagem.economiaCriacao;
  economia.ouroRetidoOrcamento = Math.floor(
    economia.saldoOrcamentoEquipamentos * (economia.percentualRetencao / 100),
  );
  return economia.ouroRetidoOrcamento;
}

function comprarEquipamentoInicial(
  personagem,
  { categoria, id, precoPO, quantidade = 1 },
) {
  const preco = Number(precoPO);
  const quantidadeNumerica = Number(quantidade);

  if (!Number.isFinite(preco) || preco < 0) {
    throw new RangeError("O preço do equipamento precisa ser válido.");
  }

  if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica <= 0) {
    throw new RangeError("A quantidade precisa ser um número inteiro positivo.");
  }

  const custo = preco * quantidadeNumerica;
  const economia = personagem?.economiaCriacao;

  if (!economia || economia.saldoOrcamentoEquipamentos < custo) {
    return { sucesso: false, motivo: "saldo-insuficiente" };
  }

  const item = adicionarItemInventario(personagem, {
    categoria,
    id,
    quantidade: quantidadeNumerica,
    origem: "compraInicial",
  });
  item.precoUnitarioPO = preco;
  economia.saldoOrcamentoEquipamentos -= custo;
  atualizarOuroRetidoOrcamento(personagem);

  return { sucesso: true, item, custo };
}

function devolverEquipamentoInicial(personagem, { categoria, id, quantidade = 1 }) {
  const quantidadeNumerica = Number(quantidade);
  const itens = personagem?.inventario?.itens ?? [];
  const item = itens.find(
    (candidato) =>
      candidato.categoria === categoria &&
      candidato.id === id &&
      candidato.origem === "compraInicial",
  );

  if (!item || !Number.isInteger(quantidadeNumerica) || quantidadeNumerica <= 0) {
    return { sucesso: false, motivo: "item-nao-comprado" };
  }

  const quantidadeDevolvida = Math.min(quantidadeNumerica, item.quantidade);
  const reembolso = quantidadeDevolvida * (Number(item.precoUnitarioPO) || 0);
  item.quantidade -= quantidadeDevolvida;

  if (item.quantidade === 0) {
    personagem.inventario.itens = itens.filter((candidato) => candidato !== item);
  }

  personagem.economiaCriacao.saldoOrcamentoEquipamentos += reembolso;
  atualizarOuroRetidoOrcamento(personagem);

  return { sucesso: true, quantidade: quantidadeDevolvida, reembolso };
}

function finalizarEconomiaCriacao(personagem) {
  const economia = personagem?.economiaCriacao;

  if (!economia || economia.finalizada) {
    return personagem;
  }

  atualizarOuroRetidoOrcamento(personagem);
  personagem.inventario ??= { itens: [], moedas: { ouro: 0 } };
  personagem.inventario.moedas ??= { ouro: 0 };
  personagem.inventario.moedas.ouro =
    (Number(economia.ouroFixoClasse) || 0) +
    (Number(economia.ouroFixoAntecedente) || 0) +
    (Number(economia.ouroRetidoOrcamento) || 0);
  economia.finalizada = true;

  return personagem;
}

function aplicarEquipamentoInicialClasse(personagem, opcao) {
  if (!personagem || typeof personagem !== "object") {
    throw new TypeError("O personagem é obrigatório.");
  }

  personagem.equipamentoClasseId = opcao?.id ?? "";
  personagem.equipamentoClasse = opcao ? structuredClone(opcao) : null;

  if (!personagem.detalhes || typeof personagem.detalhes !== "object") {
    personagem.detalhes = {};
  }

  const equipados = opcao?.equipados;

  personagem.detalhes.equipamentos = equipados
    ? structuredClone(equipados)
    : {
        armadura: "",
        armaPrincipal: "",
        itemSecundario: "",
        armaSecundaria: "",
      };

  return personagem;
}

function calcularPontosDeVidaIniciais({
  dadoVida,
  constituicao,
  bonus = 0,
}) {
  if (
    dadoVida === "" ||
    dadoVida === null ||
    dadoVida === undefined ||
    constituicao === "" ||
    constituicao === null ||
    constituicao === undefined
  ) {
    return null;
  }

  const dadoVidaNumerico = Number(dadoVida);
  const constituicaoNumerica = Number(constituicao);
  const bonusNumerico = Number(bonus) || 0;

  if (
    !Number.isFinite(dadoVidaNumerico) ||
    dadoVidaNumerico <= 0 ||
    !Number.isFinite(constituicaoNumerica)
  ) {
    return null;
  }

  const modificadorConstituicao = Math.floor(
    (constituicaoNumerica - 10) / 2,
  );

  return Math.max(
    1,
    dadoVidaNumerico + modificadorConstituicao + bonusNumerico,
  );
}

function normalizarAtaquesPersonagem(personagem) {
  const ataques = personagem?.combate?.ataques;

  if (!Array.isArray(ataques)) {
    return;
  }

  for (const [indice, ataque] of ataques.entries()) {
    if (!ataque) {
      continue;
    }

    if (typeof ataque.id === "string") {
      ataque.id = ataque.id.replace(/Secundaria$/, "");
    }

    if (typeof ataque.nome === "string") {
      ataque.nome = ataque.nome.replace(/ \(secundária\)$/i, "");
    }

    if (!ataque.atributoId && typeof window.obterAtributoAtaqueDaArma === "function") {
      ataque.atributoId = window.obterAtributoAtaqueDaArma(personagem, ataque.id);
    }

    ataque.armaId ??= ataque.id;

    ataque.origemEquipamento ??= indice === 0 ? "armaPrincipal" : "armaSecundaria";

    ataque.instanciaId ??= `${ataque.armaId}:${ataque.origemEquipamento}`;

    ataque.equipamentoInstanciaId ??= `${ataque.armaId}:${ataque.origemEquipamento}`;

    ataque.modoUso ??= "padrao";

    ataque.custoPadrao ??= "acao";
  }

  const ataquesArremessados = [];

  for (const ataque of ataques) {
    const arma = window.bancoEquipamentos?.armas?.[ataque.armaId];

    if (
      !arma ||
      arma.categoria !== "corpo-a-corpo" ||
      !arma.propriedades?.includes("arremesso") ||
      ataque.modoUso !== "padrao"
    ) {
      continue;
    }

    const instanciaIdArremesso = `${ataque.equipamentoInstanciaId}:arremesso`;

    const varianteJaExiste = ataques.some(function (outroAtaque) {
      return outroAtaque?.instanciaId === instanciaIdArremesso;
    });

    if (varianteJaExiste) {
      continue;
    }

    ataquesArremessados.push({
      ...structuredClone(ataque),

      instanciaId: instanciaIdArremesso,

      modoUso: "arremesso",

      nome: `${arma.nome} (arremesso)`,

      categoria: "distancia",

      selecao: {
        tipo: "criatura",

        alcance: {
          normal: arma.alcanceDistanciaPes.normal / 5,
          longo: arma.alcanceDistanciaPes.longo / 5,
        },

        area: null,
      },
    });
  }

  ataques.push(...ataquesArremessados);
}

function normalizarRecursosPersonagem(personagem) {
  const recursos = personagem?.habilidades?.recursos;

  if (!recursos || typeof recursos !== "object" || Array.isArray(recursos)) {
    return;
  }

  for (const recurso of Object.values(recursos)) {
    if (!recurso || typeof recurso !== "object") {
      continue;
    }

    if (recurso.id === "segundoFolego") {
      recurso.recuperacao = {
        descansoCurto: {
          quantidade: 1,
        },

        descansoLongo: {
          restaurarTodos: true,
        },
      };

      delete recurso.recuperaEm;

      continue;
    }

    if (recurso.recuperacao || !recurso.recuperaEm) {
      continue;
    }

    if (recurso.recuperaEm === "descansoLongo") {
      recurso.recuperacao = {
        descansoLongo: {
          restaurarTodos: true,
        },
      };
    } else if (recurso.recuperaEm === "descansoCurto") {
      recurso.recuperacao = {
        descansoCurto: {
          restaurarTodos: true,
        },

        descansoLongo: {
          restaurarTodos: true,
        },
      };
    }

    delete recurso.recuperaEm;
  }
}

function normalizarPersonagem(personagemOriginal) {
  if (personagemOriginal === undefined || personagemOriginal === null) {
    return personagemOriginal;
  }

  const personagemNormalizado = structuredClone(personagemOriginal);

  if (personagemNormalizado.schemaVersion === undefined) {
    personagemNormalizado.schemaVersion = 1;
  }

  if (personagemNormalizado.rulesVersion === undefined) {
    personagemNormalizado.rulesVersion = "2024";
  }

  if (personagemNormalizado.nivel === undefined) {
    personagemNormalizado.nivel = 1;
  }

  if (personagemNormalizado.xp === undefined) {
    personagemNormalizado.xp = 0;
  }

  personagemNormalizado.equipamentoClasseId ??= "";
  personagemNormalizado.equipamentoClasse ??= null;

  if (!personagemNormalizado.inventario || typeof personagemNormalizado.inventario !== "object") {
    personagemNormalizado.inventario = { itens: [], moedas: {} };
  }

  personagemNormalizado.inventario.itens = Array.isArray(personagemNormalizado.inventario.itens)
    ? personagemNormalizado.inventario.itens
    : [];
  personagemNormalizado.inventario.moedas ??= {};
  personagemNormalizado.inventario.moedas.ouro ??= 0;

  personagemNormalizado.economiaCriacao ??= {
    ouroFixoClasse: 0,
    ouroFixoAntecedente: 0,
    orcamentoEquipamentos: 0,
    saldoOrcamentoEquipamentos: 0,
    percentualRetencao: 0,
    ouroRetidoOrcamento: 0,
    finalizada: false,
  };

  personagemNormalizado.configuracaoInicialCombate ??= {
  armadura: null,
  mao1: null,
  mao2: null,
};

personagemNormalizado.configuracaoInicialCombate.armadura ??= null;
personagemNormalizado.configuracaoInicialCombate.mao1 ??= null;
personagemNormalizado.configuracaoInicialCombate.mao2 ??= null;

  personagemNormalizado.economiaCriacao.ouroFixoClasse ??= 0;
  personagemNormalizado.economiaCriacao.ouroFixoAntecedente ??= 0;
  personagemNormalizado.economiaCriacao.orcamentoEquipamentos ??= 0;
  personagemNormalizado.economiaCriacao.saldoOrcamentoEquipamentos ??= 0;
  personagemNormalizado.economiaCriacao.percentualRetencao ??= 0;
  personagemNormalizado.economiaCriacao.ouroRetidoOrcamento ??= 0;
  personagemNormalizado.economiaCriacao.finalizada ??= false;

  if (!Array.isArray(personagemNormalizado.recompensasRecebidas)) {
    personagemNormalizado.recompensasRecebidas = [];
  }

  if (!Array.isArray(personagemNormalizado.aventurasConcluidas)) {
    personagemNormalizado.aventurasConcluidas = [];
  }

  personagemNormalizado.aventurasConcluidas = personagemNormalizado.aventurasConcluidas.filter(
    function (registro) {
      return (
        registro &&
        typeof registro === "object" &&
        typeof registro.aventuraId === "string" &&
        registro.aventuraId.trim() !== ""
      );
    },
  );

  if (
    personagemNormalizado.niveisPorClasse === undefined ||
    personagemNormalizado.niveisPorClasse === null ||
    Array.isArray(personagemNormalizado.niveisPorClasse)
  ) {
    personagemNormalizado.niveisPorClasse = {};
  }

  const classeId = personagemNormalizado.classeId;

  if (
    classeId !== undefined &&
    classeId !== "" &&
    personagemNormalizado.niveisPorClasse[classeId] === undefined
  ) {
    personagemNormalizado.niveisPorClasse[classeId] = personagemNormalizado.nivel;
  }

  // Personagens salvos antes da centralização ainda apontam para a pasta antiga.
  if (personagemNormalizado.avatar) {
    for (const campo of ["imagem", "frame"]) {
      const caminho = personagemNormalizado.avatar[campo];
      if (typeof caminho === "string" && caminho.startsWith("Imagens/Avatares/")) {
        personagemNormalizado.avatar[campo] = caminho.replace(
          "Imagens/Avatares/",
          "assets/avatares/",
        ).toLowerCase();
      } else if (typeof caminho === "string" && caminho.startsWith("assets/avatares/")) {
        personagemNormalizado.avatar[campo] = caminho.toLowerCase();
      }
    }
  }

  if (personagemNormalizado.avatar && !personagemNormalizado.avatar.generoGramatical) {
    const caminhoAvatar = personagemNormalizado.avatar.imagem ?? "";

    if (caminhoAvatar.includes("/female/")) {
      personagemNormalizado.avatar.generoGramatical = "feminino";
    } else if (caminhoAvatar.includes("/male/")) {
      personagemNormalizado.avatar.generoGramatical = "masculino";
    }
  }

  normalizarRecursosPersonagem(personagemNormalizado);

  normalizarAtaquesPersonagem(personagemNormalizado);

  return personagemNormalizado;
}

function obterNivelClasse(personagem, classeId) {
  if (personagem === undefined || personagem === null) {
    return 0;
  }

  const classeProcurada = classeId ?? personagem.classeId;

  if (classeProcurada === undefined || classeProcurada === "") {
    return 0;
  }

  const nivelSalvo = personagem.niveisPorClasse?.[classeProcurada];

  if (Number.isFinite(Number(nivelSalvo))) {
    return Number(nivelSalvo);
  }

  if (classeProcurada === personagem.classeId) {
    return Number(personagem.nivel) || 0;
  }

  return 0;
}

function personagemVenceuAventura(personagemOriginal, aventuraId) {
  if (!personagemOriginal || typeof aventuraId !== "string" || aventuraId.trim() === "") {
    return false;
  }

  const personagem = normalizarPersonagem(personagemOriginal);

  return personagem.aventurasConcluidas.some(function (registro) {
    return registro.aventuraId === aventuraId && registro.resultado === "vitoria";
  });
}

function registrarVitoriaAventura(personagemOriginal, aventuraId) {
  if (!personagemOriginal?.id || typeof aventuraId !== "string" || aventuraId.trim() === "") {
    return {
      sucesso: false,
      registrada: false,
      motivo: "dadosInvalidos",
    };
  }

  const personagem = normalizarPersonagem(personagemOriginal);

  if (personagemVenceuAventura(personagem, aventuraId)) {
    return {
      sucesso: true,
      registrada: false,
      motivo: "aventuraJaConcluida",
      personagem,
    };
  }

  personagem.aventurasConcluidas.push({
    aventuraId,
    resultado: "vitoria",
    concluidaEm: new Date().toISOString(),
  });

  const personagemSalvo = atualizarPersonagemSalvo(personagem);

  if (!personagemSalvo) {
    return {
      sucesso: false,
      registrada: false,
      motivo: "falhaAoPersistir",
    };
  }

  return {
    sucesso: true,
    registrada: true,
    motivo: null,
    personagem: personagemSalvo,
  };
}

const CHAVE_PERSONAGENS_SALVOS = "personagensRpgSolo";

function listarPersonagensSalvos() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_PERSONAGENS_SALVOS);

    if (dadosSalvos === null) {
      return [];
    }

    const personagens = JSON.parse(dadosSalvos);

    if (!Array.isArray(personagens)) {
      console.error("Os personagens salvos não possuem o formato esperado.");

      return [];
    }

    return personagens.map(function (personagem) {
      return normalizarPersonagem(personagem);
    });
  } catch (erro) {
    console.error("Não foi possível ler os personagens salvos.", erro);

    return [];
  }
}

function buscarPersonagemSalvoPorId(idPersonagem) {
  if (!idPersonagem) {
    return null;
  }

  const personagens = listarPersonagensSalvos();

  const personagemEncontrado = personagens.find(function (personagem) {
    return personagem.id === idPersonagem;
  });

  return personagemEncontrado ?? null;
}

function salvarPersonagensSalvos(personagens) {
  if (!Array.isArray(personagens)) {
    console.error("A lista de personagens possui um formato inválido.");

    return false;
  }

  try {
    const personagensNormalizados = personagens.map(function (personagem) {
      return normalizarPersonagem(personagem);
    });

    localStorage.setItem(CHAVE_PERSONAGENS_SALVOS, JSON.stringify(personagensNormalizados));

    return true;
  } catch (erro) {
    console.error("Não foi possível salvar os personagens.", erro);

    return false;
  }
}

function adicionarPersonagemSalvo(personagemOriginal) {
  if (personagemOriginal === null || typeof personagemOriginal !== "object") {
    console.error("O personagem informado é inválido.");

    return null;
  }

  const personagemParaSalvar = normalizarPersonagem(personagemOriginal);

  if (!personagemParaSalvar.id) {
    personagemParaSalvar.id = crypto.randomUUID();
  }

  if (!personagemParaSalvar.criadoEm) {
    personagemParaSalvar.criadoEm = new Date().toISOString();
  }

  const personagens = listarPersonagensSalvos();

  const idJaExiste = personagens.some(function (personagem) {
    return personagem.id === personagemParaSalvar.id;
  });

  if (idJaExiste) {
    console.error("Já existe um personagem com esse identificador.");

    return null;
  }

  personagens.push(personagemParaSalvar);

  const personagemFoiSalvo = salvarPersonagensSalvos(personagens);

  if (!personagemFoiSalvo) {
    return null;
  }

  return personagemParaSalvar;
}

function atualizarPersonagemSalvo(personagemOriginal) {
  if (personagemOriginal === null || typeof personagemOriginal !== "object") {
    console.error("O personagem informado para atualização é inválido.");

    return null;
  }

  const personagemParaSalvar = normalizarPersonagem(personagemOriginal);

  if (!personagemParaSalvar.id) {
    console.error("Não é possível atualizar um personagem sem identificador.");

    return null;
  }

  const personagens = listarPersonagensSalvos();

  const indicePersonagem = personagens.findIndex(function (personagem) {
    return personagem.id === personagemParaSalvar.id;
  });

  if (indicePersonagem < 0) {
    console.error("Personagem não encontrado para atualização:", personagemParaSalvar.id);

    return null;
  }

  const personagemAnterior = personagens[indicePersonagem];

  personagemParaSalvar.criadoEm =
    personagemParaSalvar.criadoEm ?? personagemAnterior.criadoEm ?? new Date().toISOString();

  personagemParaSalvar.atualizadoEm = new Date().toISOString();

  personagens[indicePersonagem] = personagemParaSalvar;

  const personagemFoiSalvo = salvarPersonagensSalvos(personagens);

  if (!personagemFoiSalvo) {
    return null;
  }

  return personagemParaSalvar;
}

function excluirPersonagemSalvoPorId(idPersonagem) {
  if (!idPersonagem) {
    return false;
  }

  const personagens = listarPersonagensSalvos();

  const personagensRestantes = personagens.filter(function (personagem) {
    return personagem.id !== idPersonagem;
  });

  if (personagensRestantes.length === personagens.length) {
    return false;
  }

  return salvarPersonagensSalvos(personagensRestantes);
}

function migrarPersonagensSalvos() {
  const chavePersonagens = "personagensRpgSolo";

  const dadosOriginais = localStorage.getItem(chavePersonagens);

  if (dadosOriginais === null) {
    return {
      sucesso: true,

      quantidade: 0,

      mensagem: "Nenhum personagem precisava ser migrado.",
    };
  }

  let personagens;

  try {
    personagens = JSON.parse(dadosOriginais);
  } catch (erro) {
    return {
      sucesso: false,

      quantidade: 0,

      mensagem: "Os personagens salvos não puderam ser interpretados.",

      erro: erro,
    };
  }

  if (Array.isArray(personagens) === false) {
    return {
      sucesso: false,

      quantidade: 0,

      mensagem: "Os dados salvos não possuem o formato esperado.",
    };
  }

  const personagensNormalizados = personagens.map(function (personagem) {
    return normalizarPersonagem(personagem);
  });

  const dataBackup = new Date().toISOString().replaceAll(":", "-");

  const chaveBackup = "personagensRpgSoloBackup-" + dataBackup;

  localStorage.setItem(chaveBackup, dadosOriginais);

  localStorage.setItem(chavePersonagens, JSON.stringify(personagensNormalizados));

  return {
    sucesso: true,

    quantidade: personagensNormalizados.length,

    chaveBackup: chaveBackup,

    mensagem: "Personagens migrados com sucesso.",
  };
}

window.PersonagemDados = {
  criarInicial: criarPersonagemInicial,

  calcularPontosDeVidaIniciais,

  aplicarEquipamentoInicialClasse,

  adicionarItemInventario,

  sincronizarBeneficiosIniciais,

  comprarEquipamentoInicial,

  devolverEquipamentoInicial,

  finalizarEconomiaCriacao,

  normalizar: normalizarPersonagem,

  obterNivelClasse: obterNivelClasse,

  venceuAventura: personagemVenceuAventura,

  registrarVitoriaAventura: registrarVitoriaAventura,

  listarSalvos: listarPersonagensSalvos,

  buscarSalvoPorId: buscarPersonagemSalvoPorId,

  salvarLista: salvarPersonagensSalvos,

  adicionarSalvo: adicionarPersonagemSalvo,

  atualizarSalvo: atualizarPersonagemSalvo,

  excluirSalvoPorId: excluirPersonagemSalvoPorId,

  migrarSalvos: migrarPersonagensSalvos,
};
