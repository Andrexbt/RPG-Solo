(function() {
  function calcularModificador(valor) {
    return Math.floor((Number(valor) - 10) / 2);
  }

  function formatarModificador(modificador) {
    if (modificador >= 0) {
      return "+" + modificador;
    }

    return String(modificador);
  }

  function calcularBonusProficiencia() {
    return 2;
  }

  function obterDadosPericia(idPericia) {
    if (window.bancoPericias === undefined) {
      return undefined;
    }

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

  function personagemTemProficienciaEmPericia(personagemAtual, idPericia) {
    if (personagemAtual === undefined || personagemAtual.pericias === undefined) {
      return false;
    }

    return personagemAtual.pericias.includes(idPericia);
  }

  function obterEspecializacoesPericiasPersonagem(personagemAtual) {
    if (
      personagemAtual === undefined ||
      personagemAtual.habilidades === undefined ||
      personagemAtual.habilidades.escolhas === undefined
    ) {
      return [];
    }

    const especializacoes =
      personagemAtual.habilidades.escolhas.especializacoesPericias;

    if (Array.isArray(especializacoes) === false) {
      return [];
    }

    return especializacoes;
  }

  function personagemTemEspecializacaoEmPericia(personagemAtual, idPericia) {
    return obterEspecializacoesPericiasPersonagem(personagemAtual).includes(idPericia);
  }

  function calcularValorPericia(personagemAtual, idPericia) {
    const atributo = obterAtributoDaPericia(idPericia);

    if (atributo === undefined) {
      return "";
    }

    const valorAtributo = personagemAtual.atributos[atributo];

    if (valorAtributo === undefined || valorAtributo === "") {
      return "";
    }

    let valorFinal = calcularModificador(valorAtributo);

    if (personagemTemProficienciaEmPericia(personagemAtual, idPericia)) {
      valorFinal = valorFinal + calcularBonusProficiencia();

      if (personagemTemEspecializacaoEmPericia(personagemAtual, idPericia)) {
        valorFinal = valorFinal + calcularBonusProficiencia();
      }
    }

    return valorFinal;
  }

  function calcularPercepcaoPassiva(personagemAtual) {
    const valorPercepcao = calcularValorPericia(personagemAtual, "percepcao");

    if (valorPercepcao === "") {
      return "";
    }

    return 10 + valorPercepcao;
  }

  function obterDadosArma(idArma) {
    if (
      idArma === undefined ||
      idArma === "" ||
      window.bancoEquipamentos === undefined ||
      window.bancoEquipamentos.armas === undefined
    ) {
      return undefined;
    }

    return window.bancoEquipamentos.armas[idArma];
  }

  function obterNomeArma(idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined) {
      return idArma || "";
    }

    if (typeof arma === "string") {
      return arma;
    }

    return arma.nome;
  }

  function obterDadosArmadura(idArmadura) {
    if (
      idArmadura === undefined ||
      idArmadura === "" ||
      window.bancoEquipamentos === undefined ||
      window.bancoEquipamentos.armaduras === undefined
    ) {
      return undefined;
    }

    return window.bancoEquipamentos.armaduras[idArmadura];
  }

  function obterNomeArmadura(idArmadura) {
    const armadura = obterDadosArmadura(idArmadura);

    if (armadura === undefined) {
      return idArmadura || "";
    }

    return armadura.nome;
  }

  function obterNomeItemSecundario(idItem) {
    if (
      idItem === undefined ||
      idItem === "" ||
      window.bancoEquipamentos === undefined ||
      window.bancoEquipamentos.itensSecundarios === undefined ||
      window.bancoEquipamentos.itensSecundarios[idItem] === undefined
    ) {
      return idItem || "";
    }

    return window.bancoEquipamentos.itensSecundarios[idItem].nome;
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
      return idMaestria || "";
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
      return idPropriedade || "";
    }

    return propriedade.nome;
  }

  function personagemTemProficienciaComArma(personagemAtual, idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return false;
    }

    if (window.bancoClasses === undefined) {
      return false;
    }

    const dadosClasse = window.bancoClasses[personagemAtual.classeId];

    if (dadosClasse === undefined || dadosClasse.proficiencias === undefined) {
      return false;
    }

    const proficienciasArmas = dadosClasse.proficiencias.armas || [];
    const armasEspecificas = dadosClasse.proficiencias.armasEspecificas || [];

    if (armasEspecificas.includes(idArma)) {
      return true;
    }

    if (arma.tipo === "simples" && proficienciasArmas.includes("Armas simples")) {
      return true;
    }

    if (arma.tipo === "marcial" && proficienciasArmas.includes("Armas marciais")) {
      return true;
    }

    return false;
  }

  function personagemTemEstiloDeLuta(personagemAtual, idEstilo) {
    if (
      personagemAtual === undefined ||
      personagemAtual.habilidades === undefined ||
      personagemAtual.habilidades.escolhas === undefined
    ) {
      return false;
    }

    return personagemAtual.habilidades.escolhas.estilosDeLuta === idEstilo;
  }

  function obterAtributoAtaqueDaArma(personagemAtual, idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return undefined;
    }

    const propriedades = arma.propriedades || [];

    if (propriedades.includes("acuidade") === false) {
      return arma.atributoAtaque;
    }

    const forca = personagemAtual.atributos.forca;
    const destreza = personagemAtual.atributos.destreza;

    if (
      (forca === undefined || forca === "") &&
      (destreza === undefined || destreza === "")
    ) {
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

  function calcularBonusAtaqueArma(personagemAtual, idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return "";
    }

    const atributoAtaque = obterAtributoAtaqueDaArma(personagemAtual, idArma);
    const valorAtributo = personagemAtual.atributos[atributoAtaque];

    if (valorAtributo === undefined || valorAtributo === "") {
      return "";
    }

    let bonusAtaque = calcularModificador(valorAtributo);

    if (personagemTemProficienciaComArma(personagemAtual, idArma)) {
      bonusAtaque = bonusAtaque + calcularBonusProficiencia();
    }

    if (
      personagemTemEstiloDeLuta(personagemAtual, "arquearia") &&
      arma.categoria === "distancia"
    ) {
      bonusAtaque = bonusAtaque + 2;
    }

    return bonusAtaque;
  }

  function armaEhSecundaria(personagemAtual, idArma) {
    const equipamentos = personagemAtual.detalhes.equipamentos;

    if (equipamentos === undefined) {
      return false;
    }

    return (
      equipamentos.itemSecundario === "armaSecundaria" &&
      equipamentos.armaSecundaria === idArma
    );
  }

  function calcularBonusDanoArma(personagemAtual, idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return "";
    }

    const atributoAtaque = obterAtributoAtaqueDaArma(personagemAtual, idArma);
    const valorAtributo = personagemAtual.atributos[atributoAtaque];

    if (valorAtributo === undefined || valorAtributo === "") {
      return "";
    }

    const modificadorAtributo = calcularModificador(valorAtributo);
    const equipamentos = personagemAtual.detalhes.equipamentos;
    const ehArmaSecundaria = armaEhSecundaria(personagemAtual, idArma);

    let bonusDano = modificadorAtributo;

    if (
      ehArmaSecundaria &&
      personagemTemEstiloDeLuta(personagemAtual, "combateDuasArmas") === false
    ) {
      bonusDano = 0;
    }

    const usaDuelismo =
      personagemTemEstiloDeLuta(personagemAtual, "duelismo") &&
      equipamentos !== undefined &&
      equipamentos.armaPrincipal === idArma &&
      arma.categoria === "corpo-a-corpo" &&
      equipamentos.itemSecundario !== "armaSecundaria";

    if (usaDuelismo) {
      bonusDano = bonusDano + 2;
    }

    return bonusDano;
  }

  function formatarDanoArma(personagemAtual, idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return "";
    }

    const bonusDano = calcularBonusDanoArma(personagemAtual, idArma);

    if (bonusDano === "") {
      return arma.dano + " " + arma.tipoDano;
    }

    if (bonusDano > 0) {
      return arma.dano + " +" + bonusDano + " " + arma.tipoDano;
    }

    if (bonusDano < 0) {
      return arma.dano + " " + bonusDano + " " + arma.tipoDano;
    }

    return arma.dano + " " + arma.tipoDano;
  }

  function armaPermiteAtaqueFurtivo(idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return false;
    }

    const propriedades = arma.propriedades || [];

    if (arma.categoria === "distancia") {
      return true;
    }

    if (propriedades.includes("acuidade")) {
      return true;
    }

    return false;
  }

  function obterTextoAtaqueFurtivo(personagemAtual, idArma) {
    if (personagemAtual.classeId !== "ladino") {
      return "";
    }

    if (armaPermiteAtaqueFurtivo(idArma) === false) {
      return "";
    }

    return "Ataque Furtivo: +1d6 quando aplicável";
  }

  function obterResumoArma(personagemAtual, idArma) {
    const arma = obterDadosArma(idArma);

    if (arma === undefined || typeof arma === "string") {
      return undefined;
    }

    const bonusAtaque = calcularBonusAtaqueArma(personagemAtual, idArma);

    return {
      nome: arma.nome,
      ataque: bonusAtaque === "" ? "" : formatarModificador(bonusAtaque),
      dano: formatarDanoArma(personagemAtual, idArma),
      maestria: obterNomeMaestria(arma.maestria),
      maestriaId: arma.maestria,
      propriedades: arma.propriedades || [],
      ataqueFurtivo: obterTextoAtaqueFurtivo(personagemAtual, idArma)
    };
  }

  function criarReferenciaDetalheSegura(tipo, id, texto) {
    if (typeof window.criarReferenciaDetalhe === "function") {
      return window.criarReferenciaDetalhe(tipo, id, texto);
    }

    const span = document.createElement("span");
    span.textContent = texto || id || "";
    return span;
  }

  function criarLinhaPropriedadesArma(propriedades) {
    const linha = document.createElement("span");
    linha.classList.add("linha-propriedades-arma");

    linha.textContent = "Propriedades: ";

    const propriedadesSeguras = propriedades || [];

    propriedadesSeguras.forEach(function(idPropriedade, indice) {
      const propriedade = obterDadosPropriedadeArma(idPropriedade);

      if (propriedade === undefined) {
        return;
      }

      const referencia = criarReferenciaDetalheSegura(
        "propriedadeArma",
        idPropriedade,
        propriedade.nome
      );

      linha.appendChild(referencia);

      if (indice < propriedadesSeguras.length - 1) {
        linha.appendChild(document.createTextNode(", "));
      }
    });

    return linha;
  }

  function criarLinhaAtaque(resumo) {
    const linhaAtaque = document.createElement("p");
    linhaAtaque.classList.add("linha-ataque");

    const nomeArma = document.createElement("span");
    nomeArma.classList.add("ataque-rotulo");
    nomeArma.textContent = resumo.nome + ": ";

    const valoresAtaque = document.createElement("span");
    valoresAtaque.classList.add("ataque-valor");
    valoresAtaque.textContent = resumo.ataque + " / " + resumo.dano + " / ";

    const botaoMaestria = criarReferenciaDetalheSegura(
      "maestria",
      resumo.maestriaId,
      resumo.maestria
    );

    linhaAtaque.appendChild(nomeArma);
    linhaAtaque.appendChild(valoresAtaque);
    linhaAtaque.appendChild(botaoMaestria);

    const propriedades = resumo.propriedades || [];

    if (propriedades.length > 0) {
      linhaAtaque.appendChild(document.createElement("br"));
      linhaAtaque.appendChild(criarLinhaPropriedadesArma(propriedades));
    }

    if (resumo.ataqueFurtivo !== undefined && resumo.ataqueFurtivo !== "") {
      linhaAtaque.appendChild(document.createElement("br"));

      const linhaAtaqueFurtivo = document.createElement("span");
      linhaAtaqueFurtivo.classList.add("linha-ataque-furtivo");
      linhaAtaqueFurtivo.textContent = resumo.ataqueFurtivo;

      linhaAtaque.appendChild(linhaAtaqueFurtivo);
    }

    return linhaAtaque;
  }

  function calcularClasseArmadura(personagemAtual) {
    const equipamentos = personagemAtual.detalhes.equipamentos;

    if (equipamentos === undefined) {
      return "-";
    }

    const idArmadura = equipamentos.armadura;
    const idItemSecundario = equipamentos.itemSecundario;

    const armadura = obterDadosArmadura(idArmadura);

    if (armadura === undefined) {
      return "-";
    }

    let classeArmadura = armadura.caBase;
    const destreza = personagemAtual.atributos.destreza;

    if (armadura.usaDestreza === true && destreza !== undefined && destreza !== "") {
      const modificadorDestreza = calcularModificador(destreza);

      if (armadura.limiteDestreza === null) {
        classeArmadura += modificadorDestreza;
      } else {
        classeArmadura += Math.min(modificadorDestreza, armadura.limiteDestreza);
      }
    }

    if (
      window.bancoEquipamentos !== undefined &&
      window.bancoEquipamentos.itensSecundarios !== undefined
    ) {
      const itemSecundario = window.bancoEquipamentos.itensSecundarios[idItemSecundario];

      if (itemSecundario !== undefined && itemSecundario.bonusCA !== undefined) {
        classeArmadura += itemSecundario.bonusCA;
      }
    }

    if (
      personagemTemEstiloDeLuta(personagemAtual, "defesa") &&
      idArmadura !== "semArmadura"
    ) {
      classeArmadura += 1;
    }

    return classeArmadura;
  }

  function obterDadosHabilidade(idHabilidade) {
    if (window.bancoHabilidades === undefined) {
      return undefined;
    }

    if (
      window.bancoHabilidades.classFeatures !== undefined &&
      window.bancoHabilidades.classFeatures[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.classFeatures[idHabilidade];
    }

    if (
      window.bancoHabilidades.feats !== undefined &&
      window.bancoHabilidades.feats[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.feats[idHabilidade];
    }

    if (
      window.bancoHabilidades.traits !== undefined &&
      window.bancoHabilidades.traits[idHabilidade] !== undefined
    ) {
      return window.bancoHabilidades.traits[idHabilidade];
    }

    return undefined;
  }

  function formatarFormulaRecurso(formula) {
    if (formula === undefined || formula === "") {
      return "";
    }

    return formula.replace("nivelClasse", "1");
  }

  function obterRecursosHabilidadesPersonagem(personagemAtual) {
    if (
      personagemAtual.habilidades !== undefined &&
      personagemAtual.habilidades.recursos !== undefined
    ) {
      return personagemAtual.habilidades.recursos;
    }

    const recursos = {};

    if (
      window.bancoHabilidades === undefined ||
      window.bancoHabilidades.progressaoClasses === undefined
    ) {
      return recursos;
    }

    const dadosDaClasse =
      window.bancoHabilidades.progressaoClasses[personagemAtual.classeId];

    if (dadosDaClasse === undefined || dadosDaClasse.nivel1 === undefined) {
      return recursos;
    }

    const dadosNivel1 = dadosDaClasse.nivel1;
    const habilidadesAutomaticas =
      dadosNivel1.classFeaturesAutomaticas || dadosNivel1.habilidadesAutomaticas || [];

    habilidadesAutomaticas.forEach(function(idHabilidade) {
      const habilidade = obterDadosHabilidade(idHabilidade);

      if (habilidade === undefined || habilidade.recurso === undefined) {
        return;
      }

      const recurso = habilidade.recurso;

      recursos[recurso.id] = {
        id: recurso.id,
        nome: recurso.nome,
        usosAtuais: recurso.usosMaximos,
        usosMaximos: recurso.usosMaximos,
        recuperaEm: recurso.recuperaEm,
        efeito: recurso.efeito,
        formula: formatarFormulaRecurso(recurso.formula)
      };
    });

    return recursos;
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

  function obterNomeEscolhaHabilidade(grupo, idEscolhido) {
    if (grupo.origemDasOpcoes === "periciasProficientes") {
      return obterNomePericia(idEscolhido);
    }

    if (grupo.origemDasOpcoes === "armas") {
      return obterNomeArma(idEscolhido);
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

  function obterTextoHabilidadesParaPdf(personagemAtual) {
    const linhas = [];

    if (
      personagemAtual === undefined ||
      personagemAtual.habilidades === undefined ||
      personagemAtual.habilidades.escolhas === undefined ||
      window.bancoHabilidades === undefined ||
      window.bancoHabilidades.progressaoClasses === undefined
    ) {
      return "";
    }

    const dadosDaClasse =
      window.bancoHabilidades.progressaoClasses[personagemAtual.classeId];

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

      const habilidade = obterDadosHabilidade(idHabilidade);

      if (habilidade !== undefined) {
        linhas.push(habilidade.nome);
      }
    });

    if (Array.isArray(dadosNivel1.escolhas) === false) {
      return linhas.join("\n");
    }

    dadosNivel1.escolhas.forEach(function(escolha) {
      if (escolha.grupo === "especializacoesPericias") {
        return;
      }

      const grupo = window.bancoHabilidades.gruposDeEscolha[escolha.grupo];
      const valorEscolhido = personagemAtual.habilidades.escolhas[escolha.grupo];

      if (grupo === undefined || valorEscolhido === undefined) {
        return;
      }

      const idsEscolhidos = Array.isArray(valorEscolhido)
        ? valorEscolhido
        : [valorEscolhido];

      const nomesEscolhidos = idsEscolhidos.map(function(idEscolhido) {
        return obterNomeEscolhaHabilidade(grupo, idEscolhido);
      });

      if (nomesEscolhidos.length > 0) {
        linhas.push(grupo.nome + ": " + nomesEscolhidos.join(", "));
      }
    });

    return linhas.join("\n");
  }

  function obterTextoEspecializacoesParaPdf(personagemAtual) {
    const especializacoes = obterEspecializacoesPericiasPersonagem(personagemAtual);

    if (especializacoes.length === 0) {
      return "";
    }

    const nomesEspecializacoes = especializacoes.map(function(idPericia) {
      return obterNomePericia(idPericia);
    });

    return "Especialização: " + nomesEspecializacoes.join(", ");
  }

  function adicionarTextoAoCampoPdf(formulario, nomeCampo, textoNovo) {
    if (textoNovo === undefined || textoNovo === "") {
      return;
    }

    const camposParaTentar = [nomeCampo];

    if (
      window.camposFichaPdf !== undefined &&
      window.camposFichaPdf.caracteristicasClasse1 !== undefined
    ) {
      camposParaTentar.push(window.camposFichaPdf.caracteristicasClasse1);
    }

    camposParaTentar.push("Text54");

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
          return;
        }

        if (textoAtual.includes(textoNovo) === false) {
          campo.setText(textoAtual + "\n" + textoNovo);
        }

        return;
      } catch (erro) {
        console.warn("Campo não encontrado para texto adicional no PDF:", campoAtual);
      }
    }
  }

  function preencherHabilidades(personagemAtual) {
    const fichaHabilidadesElemento = document.getElementById("fichaHabilidades");

    if (fichaHabilidadesElemento === null) {
      return;
    }

    fichaHabilidadesElemento.innerHTML = "";

    if (
      window.bancoHabilidades === undefined ||
      window.bancoHabilidades.progressaoClasses === undefined
    ) {
      return;
    }

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

      const habilidade = obterDadosHabilidade(idHabilidade);

      if (habilidade === undefined) {
        return;
      }

      const item = document.createElement("li");
      const botao = criarReferenciaDetalheSegura(
        "habilidade",
        idHabilidade,
        habilidade.nome
      );

      item.appendChild(botao);

      const recursos = obterRecursosHabilidadesPersonagem(personagemAtual);
      const recurso = recursos[idHabilidade];

      if (recurso !== undefined) {
        item.appendChild(
          document.createTextNode(" — " + obterTextoResumoRecurso(recurso))
        );
      }

      fichaHabilidadesElemento.appendChild(item);
    });

    if (Array.isArray(dadosNivel1.escolhas)) {
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
          itemEscolha.textContent = obterNomeEscolhaHabilidade(grupo, idEscolhido);
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

  function instalarGlobaisFichaPersonagem() {
    window.calcularModificador = calcularModificador;
    window.formatarModificador = formatarModificador;
    window.calcularBonusProficiencia = calcularBonusProficiencia;

    window.obterDadosPericia = obterDadosPericia;
    window.obterNomePericia = obterNomePericia;
    window.obterAtributoDaPericia = obterAtributoDaPericia;
    window.personagemTemProficienciaEmPericia = personagemTemProficienciaEmPericia;
    window.obterEspecializacoesPericiasPersonagem = obterEspecializacoesPericiasPersonagem;
    window.personagemTemEspecializacaoEmPericia = personagemTemEspecializacaoEmPericia;
    window.calcularValorPericia = calcularValorPericia;
    window.calcularPercepcaoPassiva = calcularPercepcaoPassiva;

    window.obterDadosArma = obterDadosArma;
    window.obterNomeArma = obterNomeArma;
    window.obterNomeArmadura = obterNomeArmadura;
    window.obterNomeItemSecundario = obterNomeItemSecundario;
    window.obterDadosMaestria = obterDadosMaestria;
    window.obterNomeMaestria = obterNomeMaestria;
    window.obterDadosPropriedadeArma = obterDadosPropriedadeArma;
    window.obterNomePropriedadeArma = obterNomePropriedadeArma;
    window.personagemTemProficienciaComArma = personagemTemProficienciaComArma;
    window.personagemTemEstiloDeLuta = personagemTemEstiloDeLuta;
    window.obterAtributoAtaqueDaArma = obterAtributoAtaqueDaArma;
    window.calcularBonusAtaqueArma = calcularBonusAtaqueArma;
    window.armaEhSecundaria = armaEhSecundaria;
    window.calcularBonusDanoArma = calcularBonusDanoArma;
    window.formatarDanoArma = formatarDanoArma;
    window.armaPermiteAtaqueFurtivo = armaPermiteAtaqueFurtivo;
    window.obterTextoAtaqueFurtivo = obterTextoAtaqueFurtivo;
    window.obterResumoArma = obterResumoArma;
    window.criarLinhaPropriedadesArma = criarLinhaPropriedadesArma;
    window.criarLinhaAtaque = criarLinhaAtaque;
    window.calcularClasseArmadura = calcularClasseArmadura;

    window.obterDadosHabilidade = obterDadosHabilidade;
    window.obterRecursosHabilidadesPersonagem = obterRecursosHabilidadesPersonagem;
    window.obterTextoResumoRecurso = obterTextoResumoRecurso;
    window.obterTextoHabilidadesParaPdf = obterTextoHabilidadesParaPdf;
    window.obterTextoHabilidades = obterTextoHabilidadesParaPdf;
    window.obterTextoEspecializacoesParaPdf = obterTextoEspecializacoesParaPdf;
    window.adicionarTextoAoCampoPdf = adicionarTextoAoCampoPdf;
    window.preencherHabilidades = preencherHabilidades;
  }

  window.FichaPersonagem = {
    calcularModificador,
    formatarModificador,
    calcularBonusProficiencia,
    obterDadosPericia,
    obterNomePericia,
    obterAtributoDaPericia,
    personagemTemProficienciaEmPericia,
    obterEspecializacoesPericiasPersonagem,
    personagemTemEspecializacaoEmPericia,
    calcularValorPericia,
    calcularPercepcaoPassiva,
    obterDadosArma,
    obterNomeArma,
    obterNomeArmadura,
    obterNomeItemSecundario,
    obterDadosMaestria,
    obterNomeMaestria,
    obterDadosPropriedadeArma,
    obterNomePropriedadeArma,
    personagemTemProficienciaComArma,
    personagemTemEstiloDeLuta,
    obterAtributoAtaqueDaArma,
    calcularBonusAtaqueArma,
    armaEhSecundaria,
    calcularBonusDanoArma,
    formatarDanoArma,
    armaPermiteAtaqueFurtivo,
    obterTextoAtaqueFurtivo,
    obterResumoArma,
    criarLinhaPropriedadesArma,
    criarLinhaAtaque,
    calcularClasseArmadura,
    obterDadosHabilidade,
    obterRecursosHabilidadesPersonagem,
    obterTextoResumoRecurso,
    obterTextoHabilidadesParaPdf,
    obterTextoEspecializacoesParaPdf,
    adicionarTextoAoCampoPdf,
    preencherHabilidades,
    instalarGlobaisFichaPersonagem
  };

  instalarGlobaisFichaPersonagem();

  window.addEventListener("load", function() {
    instalarGlobaisFichaPersonagem();

    try {
      if (
        typeof personagemEncontrado !== "undefined" &&
        personagemEncontrado !== undefined &&
        typeof preencherFichaPersonagem === "function"
      ) {
        preencherFichaPersonagem(personagemEncontrado);
      }
    } catch (erro) {
      console.warn("Não foi possível reaplicar a ficha compartilhada:", erro);
    }
  });
})();
