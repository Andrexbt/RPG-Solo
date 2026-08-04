"use strict";

// =====================================================
// Dados compartilhados do personagem
// -----------------------------------------------------
// Define o formato atual do personagem e adapta personagens
// antigos para que as páginas possam continuar usando-os.
// =====================================================

function normalizarPersonagem(personagemOriginal) {
  if (
    personagemOriginal === undefined ||
    personagemOriginal === null
  ) {
    return personagemOriginal;
  }

  const personagemNormalizado =
    structuredClone(personagemOriginal);

  if (personagemNormalizado.schemaVersion === undefined) {
    personagemNormalizado.schemaVersion =
      1;
  }

  if (personagemNormalizado.rulesVersion === undefined) {
    personagemNormalizado.rulesVersion =
      "2024";
  }

  if (personagemNormalizado.nivel === undefined) {
    personagemNormalizado.nivel =
      1;
  }

  if (personagemNormalizado.xp === undefined) {
    personagemNormalizado.xp =
      0;
  }

  if (
    personagemNormalizado.niveisPorClasse === undefined ||
    personagemNormalizado.niveisPorClasse === null ||
    Array.isArray(personagemNormalizado.niveisPorClasse)
  ) {
    personagemNormalizado.niveisPorClasse =
      {};
  }

  const classeId =
    personagemNormalizado.classeId;

  if (
    classeId !== undefined &&
    classeId !== "" &&
    personagemNormalizado.niveisPorClasse[classeId] === undefined
  ) {
    personagemNormalizado.niveisPorClasse[classeId] =
      personagemNormalizado.nivel;
  }

  return personagemNormalizado;
}

function obterNivelClasse(
  personagem,
  classeId
) {
  if (
    personagem === undefined ||
    personagem === null
  ) {
    return 0;
  }

  const classeProcurada =
    classeId ??
    personagem.classeId;

  if (
    classeProcurada === undefined ||
    classeProcurada === ""
  ) {
    return 0;
  }

  const nivelSalvo =
    personagem
      .niveisPorClasse
      ?.[classeProcurada];

  if (
    Number.isFinite(
      Number(nivelSalvo)
    )
  ) {
    return Number(
      nivelSalvo
    );
  }

  if (
    classeProcurada ===
    personagem.classeId
  ) {
    return Number(
      personagem.nivel
    ) || 0;
  }

  return 0;
}

function migrarPersonagensSalvos() {
  const chavePersonagens =
    "personagensRpgSolo";

  const dadosOriginais =
    localStorage.getItem(
      chavePersonagens
    );

  if (dadosOriginais === null) {
    return {
      sucesso:
        true,

      quantidade:
        0,

      mensagem:
        "Nenhum personagem precisava ser migrado."
    };
  }

  let personagens;

  try {
    personagens =
      JSON.parse(dadosOriginais);
  } catch (erro) {
    return {
      sucesso:
        false,

      quantidade:
        0,

      mensagem:
        "Os personagens salvos não puderam ser interpretados.",

      erro:
        erro
    };
  }

  if (Array.isArray(personagens) === false) {
    return {
      sucesso:
        false,

      quantidade:
        0,

      mensagem:
        "Os dados salvos não possuem o formato esperado."
    };
  }

  const personagensNormalizados =
    personagens.map(function (personagem) {
      return normalizarPersonagem(
        personagem
      );
    });

  const dataBackup =
    new Date()
      .toISOString()
      .replaceAll(":", "-");

  const chaveBackup =
    "personagensRpgSoloBackup-" +
    dataBackup;

  localStorage.setItem(
    chaveBackup,
    dadosOriginais
  );

  localStorage.setItem(
    chavePersonagens,
    JSON.stringify(
      personagensNormalizados
    )
  );

  return {
    sucesso:
      true,

    quantidade:
      personagensNormalizados.length,

    chaveBackup:
      chaveBackup,

    mensagem:
      "Personagens migrados com sucesso."
  };
}

window.PersonagemDados = {
  normalizar:
    normalizarPersonagem,

    obterNivelClasse:
    obterNivelClasse,

    migrarSalvos:
    migrarPersonagensSalvos
};