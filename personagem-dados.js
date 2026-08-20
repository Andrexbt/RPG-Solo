"use strict";

// =====================================================
// Dados compartilhados do personagem
// -----------------------------------------------------
// Define o formato atual do personagem e adapta personagens
// antigos para que as páginas possam continuar usando-os.
// =====================================================

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

    if (
  !ataque.atributoId &&
  typeof window.obterAtributoAtaqueDaArma === "function"
) {
  ataque.atributoId = window.obterAtributoAtaqueDaArma(
    personagem,
    ataque.id,
  );
}

    ataque.armaId ??= ataque.id;

    ataque.origemEquipamento ??=
      indice === 0
        ? "armaPrincipal"
        : "armaSecundaria";

    ataque.instanciaId ??=
      `${ataque.armaId}:${ataque.origemEquipamento}`;

    ataque.custoPadrao ??= "acao";
  }
}

function normalizarRecursosPersonagem(
  personagem,
) {
  const recursos =
    personagem
      ?.habilidades
      ?.recursos;

  if (
    !recursos ||
    typeof recursos !== "object" ||
    Array.isArray(recursos)
  ) {
    return;
  }

  for (
    const recurso
    of Object.values(recursos)
  ) {
    if (
      !recurso ||
      typeof recurso !== "object"
    ) {
      continue;
    }

    if (
      recurso.id ===
      "segundoFolego"
    ) {
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

    if (
      recurso.recuperacao ||
      !recurso.recuperaEm
    ) {
      continue;
    }

    if (
      recurso.recuperaEm ===
      "descansoLongo"
    ) {
      recurso.recuperacao = {
        descansoLongo: {
          restaurarTodos: true,
        },
      };
    } else if (
      recurso.recuperaEm ===
      "descansoCurto"
    ) {
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

  if (!Array.isArray(personagemNormalizado.recompensasRecebidas)) {
    personagemNormalizado.recompensasRecebidas = [];
  }

    if (
    !Array.isArray(
      personagemNormalizado
        .aventurasConcluidas
    )
  ) {
    personagemNormalizado
      .aventurasConcluidas = [];
  }

  personagemNormalizado
    .aventurasConcluidas =
      personagemNormalizado
        .aventurasConcluidas
        .filter(
          function (registro) {
            return (
              registro &&
              typeof registro === "object" &&
              typeof registro.aventuraId ===
                "string" &&
              registro.aventuraId.trim() !== ""
            );
          }
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

  if (personagemNormalizado.avatar && !personagemNormalizado.avatar.generoGramatical) {
    const caminhoAvatar = personagemNormalizado.avatar.imagem ?? "";

    if (caminhoAvatar.includes("/Female/")) {
      personagemNormalizado.avatar.generoGramatical = "feminino";
    } else if (caminhoAvatar.includes("/Male/")) {
      personagemNormalizado.avatar.generoGramatical = "masculino";
    }
  }

  normalizarRecursosPersonagem(
    personagemNormalizado,
  );

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

function personagemVenceuAventura(
  personagemOriginal,
  aventuraId
) {
  if (
    !personagemOriginal ||
    typeof aventuraId !== "string" ||
    aventuraId.trim() === ""
  ) {
    return false;
  }

  const personagem =
    normalizarPersonagem(
      personagemOriginal
    );

  return personagem
    .aventurasConcluidas
    .some(
      function (registro) {
        return (
          registro.aventuraId ===
            aventuraId &&
          registro.resultado ===
            "vitoria"
        );
      }
    );
}

function registrarVitoriaAventura(
  personagemOriginal,
  aventuraId
) {
  if (
    !personagemOriginal?.id ||
    typeof aventuraId !== "string" ||
    aventuraId.trim() === ""
  ) {
    return {
      sucesso: false,
      registrada: false,
      motivo: "dadosInvalidos",
    };
  }

  const personagem =
    normalizarPersonagem(
      personagemOriginal
    );

  if (
    personagemVenceuAventura(
      personagem,
      aventuraId
    )
  ) {
    return {
      sucesso: true,
      registrada: false,
      motivo:
        "aventuraJaConcluida",
      personagem,
    };
  }

  personagem
    .aventurasConcluidas
    .push({
      aventuraId,
      resultado: "vitoria",
      concluidaEm:
        new Date().toISOString(),
    });

  const personagemSalvo =
    atualizarPersonagemSalvo(
      personagem
    );

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
    personagem:
      personagemSalvo,
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
  normalizar: normalizarPersonagem,

  obterNivelClasse: obterNivelClasse,

    venceuAventura:
    personagemVenceuAventura,

  registrarVitoriaAventura:
    registrarVitoriaAventura,

  listarSalvos: listarPersonagensSalvos,

  buscarSalvoPorId: buscarPersonagemSalvoPorId,

  salvarLista: salvarPersonagensSalvos,

  adicionarSalvo: adicionarPersonagemSalvo,

  atualizarSalvo: atualizarPersonagemSalvo,

  excluirSalvoPorId: excluirPersonagemSalvoPorId,

  migrarSalvos: migrarPersonagensSalvos,
};
