"use strict";

(function () {
  function ehObjetoSimples(valor) {
    return (
      valor !== null &&
      typeof valor === "object" &&
      !Array.isArray(valor)
    );
  }

  function mesclarDados(dadosBase, sobrescritas) {
    const resultado = structuredClone(dadosBase);

    for (const [chave, valor] of Object.entries(sobrescritas)) {
      if (
        ehObjetoSimples(valor) &&
        ehObjetoSimples(resultado[chave])
      ) {
        resultado[chave] = mesclarDados(
          resultado[chave],
          valor,
        );

        continue;
      }

      resultado[chave] = structuredClone(valor);
    }

    return resultado;
  }

  function criarNpcAPartirDoBloco(configuracaoNpc) {
    if (!ehObjetoSimples(configuracaoNpc)) {
      console.warn(
        "Configuração inválida ao criar NPC:",
        configuracaoNpc,
      );

      return null;
    }

    const blocoCriaturaId =
      configuracaoNpc.blocoCriaturaId;

    if (!blocoCriaturaId) {
      return structuredClone(configuracaoNpc);
    }

    const blocoCriatura =
      window.bancoCriaturas
        ?.blocos
        ?.[blocoCriaturaId];

    if (!blocoCriatura) {
      console.warn(
        "Bloco de criatura não encontrado:",
        blocoCriaturaId,
      );

      return null;
    }

    const npc = mesclarDados(
      blocoCriatura,
      configuracaoNpc,
    );

    npc.blocoCriaturaId = blocoCriaturaId;

    return npc;
  }

  window.CriaturaDados = Object.freeze({
    criarNpcAPartirDoBloco,
  });
})();