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

(function() {
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
    if (typeof obterDadosHabilidade === "function") {
      const habilidade = obterDadosHabilidade(idHabilidade);

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

  function obterTextoHabilidadesParaPdfCorrigido(personagem) {
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
  }

  function adicionarTextoAoCampoPdfCorrigido(formulario, nomeCampo, textoNovo) {
    if (textoNovo === undefined || textoNovo === "") {
      return;
    }

    const camposParaTentar = [nomeCampo, "Text54"];

    for (let indice = 0; indice < camposParaTentar.length; indice++) {
      const campoAtual = camposParaTentar[indice];

      if (campoAtual === undefined || campoAtual === "") {
        continue;
      }

      try {
        const campo = formulario.getTextField(campoAtual);
        const textoAtual = campo.getText();

        if (textoAtual === undefined || textoAtual === "") {
          campo.setText(textoNovo);
        } else if (textoAtual.includes(textoNovo) === false) {
          campo.setText(textoAtual + "\n" + textoNovo);
        }

        return;
      } catch (erro) {
        console.warn("Campo não encontrado para texto adicional no PDF:", campoAtual);
      }
    }
  }

  function obterRecursosPersonagemSeguro(personagemAtual) {
    if (typeof obterRecursosHabilidadesPersonagem === "function") {
      return obterRecursosHabilidadesPersonagem(personagemAtual);
    }

    if (
      personagemAtual.habilidades !== undefined &&
      personagemAtual.habilidades.recursos !== undefined
    ) {
      return personagemAtual.habilidades.recursos;
    }

    return {};
  }

  function preencherHabilidadesCorrigido(personagemAtual) {
    const fichaHabilidadesElemento = document.getElementById("fichaHabilidades");

    if (fichaHabilidadesElemento === null) {
      return;
    }

    fichaHabilidadesElemento.innerHTML = "";

    const dadosDaClasse =
      window.bancoHabilidades.progressaoClasses[personagemAtual.classeId];

    if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
      const item = document.createElement("li");
      item.textContent = "Nenhuma habilidade cadastrada.";
      fichaHabilidadesElemento.appendChild(item);
      return;
    }

    const dadosNivel1 = dadosDaClasse.nivel1;

    const habilidadesAutomaticas =
      dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

    habilidadesAutomaticas.forEach(function(idHabilidade) {
      if (idHabilidade === "maestriaComArmas") {
        return;
      }

      const item = document.createElement("li");
      const nomeHabilidade = obterNomeHabilidadeParaTexto(idHabilidade);

      if (typeof window.criarReferenciaDetalhe === "function") {
        const botao = window.criarReferenciaDetalhe(
          "habilidade",
          idHabilidade,
          nomeHabilidade,
          {
            recursos: obterRecursosPersonagemSeguro(personagemAtual)
          }
        );

        item.appendChild(botao);
      } else {
        item.textContent = nomeHabilidade;
      }

      const recursos = obterRecursosPersonagemSeguro(personagemAtual);
      const recurso = recursos[idHabilidade];

      if (
        recurso !== undefined &&
        typeof obterTextoResumoRecurso === "function"
      ) {
        item.appendChild(
          document.createTextNode(" — " + obterTextoResumoRecurso(recurso))
        );
      }

      fichaHabilidadesElemento.appendChild(item);
    });

    if (Array.isArray(dadosNivel1.escolhas) === true) {
      dadosNivel1.escolhas.forEach(function(escolha) {
        const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
        const valorEscolhido = personagemAtual.habilidades.escolhas[escolha.grupo];

        if (grupo === undefined || valorEscolhido === undefined) {
          return;
        }

        const itemGrupo = document.createElement("li");
        itemGrupo.textContent = grupo.nome + ":";

        const sublista = document.createElement("ul");

        const idsEscolhidos = Array.isArray(valorEscolhido)
          ? valorEscolhido
          : [valorEscolhido];

        idsEscolhidos.forEach(function(idEscolhido) {
          const itemEscolha = document.createElement("li");
          itemEscolha.textContent = obterNomeEscolhaParaTexto(grupo, idEscolhido);
          sublista.appendChild(itemEscolha);
        });

        itemGrupo.appendChild(sublista);
        fichaHabilidadesElemento.appendChild(itemGrupo);
      });
    }

    if (fichaHabilidadesElemento.children.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Nenhuma habilidade registrada.";
      fichaHabilidadesElemento.appendChild(item);
    }
  }

  window.addEventListener("load", function() {
    try {
      obterTextoHabilidadesParaPdf = obterTextoHabilidadesParaPdfCorrigido;
      obterTextoHabilidades = obterTextoHabilidadesParaPdfCorrigido;
      preencherHabilidades = preencherHabilidadesCorrigido;
      adicionarTextoAoCampoPdf = adicionarTextoAoCampoPdfCorrigido;
    } catch (erro) {
      console.warn("Não foi possível substituir funções da ficha salva:", erro);
    }

    window.obterTextoHabilidadesParaPdf = obterTextoHabilidadesParaPdfCorrigido;
    window.obterTextoHabilidades = obterTextoHabilidadesParaPdfCorrigido;
    window.preencherHabilidades = preencherHabilidadesCorrigido;
    window.adicionarTextoAoCampoPdf = adicionarTextoAoCampoPdfCorrigido;

    try {
      if (
        typeof personagemEncontrado !== "undefined" &&
        personagemEncontrado !== undefined &&
        typeof preencherFichaPersonagem === "function"
      ) {
        preencherFichaPersonagem(personagemEncontrado);
      }
    } catch (erro) {
      console.error("Erro ao reaplicar correção da ficha salva:", erro);
    }
  });
})();