"use strict";

(function configurarRegrasEquipamentos() {
  function personagemTemProficienciaComArma(personagem, idArma) {
    const arma = window.bancoEquipamentos?.armas?.[idArma];
    const classe = window.bancoClasses?.[personagem?.classeId];

    if (!arma || typeof arma === "string" || !classe?.proficiencias) {
      return false;
    }

    const categorias = classe.proficiencias.armas ?? [];
    const armasEspecificas = classe.proficiencias.armasEspecificas ?? [];

    return (
      armasEspecificas.includes(idArma) ||
      (arma.tipo === "simples" && categorias.includes("Armas simples")) ||
      (arma.tipo === "marcial" && categorias.includes("Armas marciais"))
    );
  }

  function avaliarUsoArma(personagem, idArma) {
    const arma = window.bancoEquipamentos?.armas?.[idArma];

    if (!arma) {
      return { adequado: false, problemas: ["Arma não encontrada."] };
    }

    const proficiente = personagemTemProficienciaComArma(personagem, idArma);
    const problemas = [];

    if (!proficiente) {
      problemas.push("Sem proficiência: o bônus de proficiência não é somado aos ataques.");
    }

    let atendeRequisitoPesada = true;

    if (arma.propriedades?.includes("pesada")) {
      const atributoId = arma.categoria === "distancia" ? "destreza" : "forca";
      const valorAtributo = Number(personagem?.atributos?.[atributoId]);
      atendeRequisitoPesada = Number.isFinite(valorAtributo) && valorAtributo >= 13;

      if (!atendeRequisitoPesada) {
        const nomeAtributo = atributoId === "destreza" ? "Destreza" : "Força";
        problemas.push(
          `Propriedade Pesada: ataques terão desvantagem enquanto ${nomeAtributo} for menor que 13.`,
        );
      }
    }

    return {
      adequado: problemas.length === 0,
      proficiente,
      atendeRequisitoPesada,
      problemas,
    };
  }

  function personagemTemTreinamentoComArmadura(personagem, idArmadura) {
    const armadura = window.bancoEquipamentos?.armaduras?.[idArmadura];
    const classe = window.bancoClasses?.[personagem?.classeId];

    if (!armadura || armadura.categoria === "nenhuma") {
      return armadura?.categoria === "nenhuma";
    }

    const nomesCategoria = {
      leve: "Armaduras leves",
      media: "Armaduras médias",
      pesada: "Armaduras pesadas",
    };

    return classe?.proficiencias?.armaduras?.includes(nomesCategoria[armadura.categoria]) === true;
  }

  function avaliarUsoArmadura(personagem, idArmadura) {
    const armadura = window.bancoEquipamentos?.armaduras?.[idArmadura];

    if (!armadura) {
      return { adequado: false, problemas: ["Armadura não encontrada."] };
    }

    const treinado = personagemTemTreinamentoComArmadura(personagem, idArmadura);
    const problemas = [];

    if (!treinado) {
      problemas.push(
        "Sem treinamento: desvantagem em testes de d20 envolvendo Força ou Destreza e impossibilidade de conjurar magias.",
      );
    }

    const forca = Number(personagem?.atributos?.forca);
    const atendeRequisitoForca =
      !armadura.forcaMinima || (Number.isFinite(forca) && forca >= armadura.forcaMinima);

    if (!atendeRequisitoForca) {
      problemas.push(
        `Força insuficiente: a velocidade será reduzida em 10 pés enquanto a armadura estiver vestida (requer Força ${armadura.forcaMinima}).`,
      );
    }

    return {
      adequado: problemas.length === 0,
      treinado,
      atendeRequisitoForca,
      problemas,
    };
  }

  window.RegrasEquipamentos = Object.freeze({
    personagemTemProficienciaComArma,
    avaliarUsoArma,
    personagemTemTreinamentoComArmadura,
    avaliarUsoArmadura,
  });
})();
