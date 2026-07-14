window.bancoMagias = {
  progressaoMagias: {
    mago: {
      nivel1: {
        temMagias: true,
        mensagem: "Esta classe possui escolhas de magia no nível atual.",
        escolhas: []
      }
    },

    clerigo: {
      nivel1: {
        temMagias: true,
        mensagem: "Esta classe possui escolhas de magia no nível atual.",
        escolhas: []
      }
    }
  }
};

window.addEventListener("load", function() {
  if (typeof window.obterTextoHabilidadesParaPdf !== "function") {
    return;
  }

  function obterNomePericiaParaTexto(idPericia) {
    if (
      window.bancoPericias === undefined ||
      window.bancoPericias[idPericia] === undefined
    ) {
      return idPericia;
    }

    return window.bancoPericias[idPericia].nome;
  }

  function obterNomeArmaParaTexto(idArma) {
    if (
      window.bancoEquipamentos === undefined ||
      window.bancoEquipamentos.armas === undefined ||
      window.bancoEquipamentos.armas[idArma] === undefined
    ) {
      return idArma;
    }

    const arma = window.bancoEquipamentos.armas[idArma];

    if (typeof arma === "string") {
      return arma;
    }

    return arma.nome;
  }

  function obterNomeHabilidadeParaTexto(idHabilidade) {
    if (typeof window.obterDadosHabilidade === "function") {
      const habilidade = window.obterDadosHabilidade(idHabilidade);

      if (habilidade !== undefined) {
        return habilidade.nome;
      }
    }

    if (
      window.bancoHabilidades !== undefined &&
      window.bancoHabilidades.classFeatures !== undefined &&
      window.bancoHabilidades.classFeatures[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.classFeatures[idHabilidade].nome;
    }

    return idHabilidade;
  }

  function obterNomeEscolhaParaTexto(grupo, idEscolhido) {
    if (grupo.origemDasOpcoes === "periciasProficientes") {
      return obterNomePericiaParaTexto(idEscolhido);
    }

    if (grupo.origemDasOpcoes === "armas") {
      return obterNomeArmaParaTexto(idEscolhido);
    }

    if (Array.isArray(grupo.opcoes) === false) {
      return idEscolhido;
    }

    const opcaoEscolhida = grupo.opcoes.find(function(opcao) {
      return opcao.id === idEscolhido;
    });

    if (opcaoEscolhida === undefined) {
      return idEscolhido;
    }

    return opcaoEscolhida.nome;
  }

  window.obterTextoHabilidadesParaPdf = function(personagem) {
    const linhas = [];

    if (
      personagem === undefined ||
      personagem.habilidades === undefined ||
      personagem.habilidades.escolhas === undefined ||
      window.bancoHabilidades === undefined ||
      window.bancoHabilidades.progressaoClasses === undefined
    ) {
      return "";
    }

    const dadosDaClasse =
      window.bancoHabilidades.progressaoClasses[personagem.classeId];

    if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
      return "";
    }

    const dadosNivel1 = dadosDaClasse.nivel1;

    const habilidadesAutomaticas =
      dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

    habilidadesAutomaticas.forEach(function(idHabilidade) {
      if (idHabilidade === "maestriaComArmas") {
        return;
      }

      linhas.push(obterNomeHabilidadeParaTexto(idHabilidade));
    });

    if (Array.isArray(dadosNivel1.escolhas) === false) {
      return linhas.join("\n");
    }

    dadosNivel1.escolhas.forEach(function(escolha) {
      const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
      const valorEscolhido = personagem.habilidades.escolhas[escolha.grupo];

      if (grupo === undefined || valorEscolhido === undefined) {
        return;
      }

      const idsEscolhidos = Array.isArray(valorEscolhido)
        ? valorEscolhido
        : [valorEscolhido];

      const nomesEscolhidos = idsEscolhidos.map(function(idEscolhido) {
        return obterNomeEscolhaParaTexto(grupo, idEscolhido);
      });

      if (nomesEscolhidos.length > 0) {
        linhas.push(grupo.nome + ": " + nomesEscolhidos.join(", "));
      }
    });

    return linhas.join("\n");
  };

  window.obterTextoHabilidades = window.obterTextoHabilidadesParaPdf;
});
