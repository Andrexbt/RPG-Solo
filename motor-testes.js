"use strict";

function realizarRolagemComposta(
  configuracao,
) {
  return window.MotorDados
    .realizarRolagemComposta(
      configuracao,
    );
}

function formatarResultadoRolagem(rolagem) {
  const subtotal = Number(rolagem?.subtotal) || 0;
  const modificador = Number(rolagem?.modificador) || 0;
  const total = Number(rolagem?.total) || subtotal + modificador;

  if (modificador < 0) {
    return `${subtotal} - ${Math.abs(modificador)} = ${total}`;
  }

  return `${subtotal} + ${modificador} = ${total}`;
}

window.realizarRolagemComposta = realizarRolagemComposta;
window.formatarResultadoRolagem = formatarResultadoRolagem;

window.SistemaTestes = (function () {

  function obterArmaduraEquipada(entidade) {
  const idArmadura =
    entidade?.detalhes?.equipamentos?.armadura;

  if (!idArmadura) {
    return null;
  }

  return window.bancoEquipamentos
    ?.armaduras
    ?.[idArmadura] ?? null;
}

function armaduraCausaDesvantagemFurtividade(entidade) {
  const armadura = obterArmaduraEquipada(entidade);

  return armadura?.desvantagemFurtividade === true;
}

function armaduraCausaDesvantagemNado(entidade) {
  const armadura = obterArmaduraEquipada(entidade);

  if (!armadura) {
    return false;
  }

  return Number(armadura.caBase) >= 14;
}

function possuiDesvantagemSituacional(entidade, descritor) {
  if (
    descritor?.tipo === "pericia" &&
    descritor.periciaId === "furtividade"
  ) {
    return armaduraCausaDesvantagemFurtividade(entidade);
  }

  if (descritor?.situacao === "nadarAguasRevoltas") {
    return armaduraCausaDesvantagemNado(entidade);
  }

  return false;
}

function combinarTipoRolagem(
  tipoOriginal = "normal",
  desvantagemAdicional = false,
) {
  if (!desvantagemAdicional) {
    return tipoOriginal;
  }

  if (tipoOriginal === "vantagem") {
    return "normal";
  }

  return "desvantagem";
}

function determinarTipoRolagem(
  entidade,
  descritor,
  teste = descritor,
) {
  const tipoOriginal =
    descritor?.tipoRolagem ??
    teste?.tipoRolagem ??
    "normal";

  const desvantagemSituacional =
    possuiDesvantagemSituacional(
      entidade,
      descritor,
    );

  return combinarTipoRolagem(
    tipoOriginal,
    desvantagemSituacional,
  );
}
  function calcularModificadorAtributo(valor) {
    return Math.floor((Number(valor) - 10) / 2);
  }

  function obterBonusProficiencia(entidade) {
    if (entidade.bonusProficiencia !== undefined) {
      return entidade.bonusProficiencia;
    }

    return 2;
  }

  function calcularBonusPericia(entidade, idPericia) {
    const pericia = window.bancoPericias[idPericia];

    if (!pericia) {
      console.warn("Perícia não encontrada:", idPericia);

      return 0;
    }

    const valorAtributo = entidade.atributos[pericia.atributo];

    let bonus = calcularModificadorAtributo(valorAtributo);

    const possuiProficiencia = entidade.pericias.includes(idPericia);

    if (possuiProficiencia) {
      bonus += obterBonusProficiencia(entidade);
    }

    return bonus;
  }

  function calcularBonusSalvaguarda(entidade, idAtributo) {
    const valorAtributo = entidade.atributos[idAtributo];

    let bonus = calcularModificadorAtributo(valorAtributo);

    const possuiProficiencia = entidade.salvaguardas.includes(idAtributo);

    if (possuiProficiencia) {
      bonus += obterBonusProficiencia(entidade);
    }

    return bonus;
  }

  function resolverTesteContraCd(resultadoRolagem, dificuldade, tipoRolagem = "normal") {
    let total = resultadoRolagem.total;

    if (tipoRolagem !== "normal") {
      total = calcularTotalTesteD20(resultadoRolagem, tipoRolagem);
    }

    const sucesso = total >= dificuldade;

    const margem = total - dificuldade;

    return {
      tipo: "testeContraCd",
      tipoRolagem,
      total,
      dificuldade,
      sucesso,
      margem,
    };
  }

  function resolverTesteOposto(resultadoAtivo, resultadoOponente) {
    const totalAtivo = resultadoAtivo.total;

    const totalOponente = resultadoOponente.total;

    const margem = totalAtivo - totalOponente;

    return {
      tipo: "testeOposto",
      totalAtivo,
      totalOponente,
      sucesso: margem > 0,
      empate: margem === 0,
      margem,
    };
  }

  function selecionarResultadoD20(resultados, tipoRolagem = "normal") {
    if (tipoRolagem === "vantagem") {
      return Math.max(...resultados);
    }

    if (tipoRolagem === "desvantagem") {
      return Math.min(...resultados);
    }

    return resultados[0];
  }

  function calcularTotalTesteD20(resultadoRolagem, tipoRolagem = "normal") {
    const grupoD20 = resultadoRolagem.gruposRolados.find((grupo) => grupo.numeroDeFaces === 20);

    if (!grupoD20) {
      console.warn("Nenhum d20 foi encontrado na rolagem.");

      return null;
    }

    const resultadoD20 = selecionarResultadoD20(grupoD20.resultados, tipoRolagem);

    return resultadoD20 + resultadoRolagem.modificador;
  }

  return {
    obterArmaduraEquipada,
  armaduraCausaDesvantagemFurtividade,
  armaduraCausaDesvantagemNado,
  possuiDesvantagemSituacional,
  combinarTipoRolagem,
  determinarTipoRolagem,
    calcularModificadorAtributo,
    calcularBonusPericia,
    calcularBonusSalvaguarda,
    resolverTesteContraCd,
    resolverTesteOposto,
    selecionarResultadoD20,
    calcularTotalTesteD20,
  };
})();
