"use strict";

// =====================================================
// Renderizador da ficha de personagem
// -----------------------------------------------------
// Este arquivo conhece a estrutura visual da ficha.
// As páginas apenas entregam um personagem e uma raiz.
// =====================================================

(function () {
  function buscar(raiz, seletor) {
    return raiz.querySelector(seletor);
  }

  function definirTexto(raiz, seletor, valor) {
    const elemento = buscar(raiz, seletor);

    if (elemento !== null) {
      elemento.textContent = valor ?? "";
    }
  }

  function obterRaizFicha(raiz) {
    if (raiz === undefined || raiz === null) {
      return document.querySelector("[data-ficha-personagem]") ?? document;
    }

    return raiz;
  }

  function preencherAvatar(raiz, personagem) {
    const imagem = buscar(raiz, "#fichaImagemAvatar");
    const frame = buscar(raiz, "#fichaFrameAvatar");
    const avatar = personagem.avatar;

    if (imagem === null || frame === null) {
      return;
    }

    if (avatar?.imagem === undefined || avatar?.frame === undefined) {
      imagem.classList.add("escondida");
      frame.classList.add("escondida");
      return;
    }

    imagem.src = avatar.imagem;
    imagem.alt = "Avatar de " + (personagem.detalhes?.nome ?? "personagem");
    frame.src = avatar.frame;
    imagem.classList.remove("escondida");
    frame.classList.remove("escondida");
  }

  function preencherInformacoesBasicas(raiz, personagem) {
    const idiomas = (personagem.idiomas || []).map(function (idIdioma) {
      return window.bancoIdiomas?.[idIdioma]?.nome ?? idIdioma;
    });

    definirTexto(raiz, "#fichaNome", personagem.detalhes?.nome);

    const classeENivel =
  personagem.classe
    ? personagem.classe +
      " " +
      personagem.nivel
    : "";

definirTexto(
  raiz,
  "#fichaClasseNivel",
  classeENivel
);

    definirTexto(raiz, "#fichaAntecedente", personagem.antecedente);
    definirTexto(raiz, "#fichaEspecie", personagem.especie);
    definirTexto(raiz, "#fichaIdiomas", idiomas.join(", "));
    preencherAvatar(raiz, personagem);
  }

  function preencherUmAtributo(raiz, nome, idValor, idModificador, personagem) {
    const valor = personagem.atributos?.[nome];

    definirTexto(raiz, "#" + idValor, valor);
    definirTexto(
      raiz,
      "#" + idModificador,
      valor === undefined || valor === ""
        ? ""
        : window.formatarModificador(window.calcularModificador(valor)),
    );
  }

  function preencherAtributos(raiz, personagem) {
    preencherUmAtributo(raiz, "forca", "valfor", "modfor", personagem);
    preencherUmAtributo(raiz, "destreza", "valdes", "moddes", personagem);
    preencherUmAtributo(raiz, "constituicao", "valcon", "modcon", personagem);
    preencherUmAtributo(raiz, "inteligencia", "valint", "modint", personagem);
    preencherUmAtributo(raiz, "sabedoria", "valsab", "modsab", personagem);
    preencherUmAtributo(raiz, "carisma", "valcar", "modcar", personagem);
  }

  function obterDadosEspecie(personagem) {
    return window.bancoEspecies?.especies?.[personagem.especieId];
  }

  function preencherCombate(raiz, personagem) {
    const pontosDeVida = personagem.combate?.pontosDeVida ?? personagem.detalhes?.pontosDeVida ?? {};
    const especie = obterDadosEspecie(personagem);
    const destreza = personagem.atributos?.destreza;

    definirTexto(raiz, "#fichaClasseArmadura", window.calcularClasseArmadura(personagem));
    definirTexto(raiz, "#pvAtuais", pontosDeVida.atuais);
    definirTexto(raiz, "#pvMaximo", pontosDeVida.maximo);
    definirTexto(raiz, "#dadosVidaUsados", pontosDeVida.dadosVidaUsados);
    definirTexto(raiz, "#dadosVidaMaximos", pontosDeVida.dadoVida);
    definirTexto(
      raiz,
      "#fichaIniciativa",
      destreza === undefined || destreza === ""
        ? ""
        : window.formatarModificador(window.calcularModificador(destreza)),
    );
    definirTexto(raiz, "#fichaVelocidade", especie?.velocidade);
    definirTexto(raiz, "#fichaTamanho", especie?.tamanho);
    definirTexto(raiz, "#fichaPercepcaoPassiva", window.calcularPercepcaoPassiva(personagem));
  }

  function obterNomeEquipamento(id) {
    const banco = window.bancoEquipamentos;
    const dados =
      banco?.itensGerais?.[id] ??
      banco?.armas?.[id] ??
      banco?.armaduras?.[id] ??
      banco?.itensSecundarios?.[id];

    return dados?.nome ?? id;
  }

  function obterTextoProficiencias(personagem) {
    const salvas = personagem.detalhes?.equipamentos?.proficiencias;

    if (salvas !== undefined) {
      return salvas.join(", ");
    }

    const proficiencias = window.bancoClasses?.[personagem.classeId]?.proficiencias;

    if (proficiencias === undefined) {
      return "";
    }

    return [
      ...(proficiencias.armaduras || []),
      ...(proficiencias.armas || []),
      ...(proficiencias.armasEspecificas || []).map(window.obterNomeArma),
      ...(proficiencias.ferramentas || []),
    ].join(", ");
  }

  function preencherEquipamentos(raiz, personagem) {
    const equipamentoAntecedente = personagem.equipamentoAntecedente;
    const itens = equipamentoAntecedente?.itens ?? [];

    definirTexto(
      raiz,
      "#fichaItensAntecedente",
      itens
        .map(function (item) {
          const nome = obterNomeEquipamento(item.id);
          return (item.quantidade ?? 1) > 1 ? `${item.quantidade}× ${nome}` : nome;
        })
        .join(", "),
    );
    definirTexto(
      raiz,
      "#fichaMoedasAntecedente",
      equipamentoAntecedente ? `${equipamentoAntecedente.moedas?.ouro ?? 0} peças de ouro` : "",
    );

    const equipamentos = personagem.detalhes?.equipamentos;

    if (equipamentos === undefined) {
      return;
    }

    definirTexto(raiz, "#fichaArmadura", window.obterNomeArmadura(equipamentos.armadura));
    definirTexto(raiz, "#fichaArmaPrincipal", window.obterNomeArma(equipamentos.armaPrincipal));
    definirTexto(
      raiz,
      "#fichaItemSecundario",
      equipamentos.itemSecundario === "armaSecundaria"
        ? window.obterNomeArma(equipamentos.armaSecundaria)
        : window.obterNomeItemSecundario(equipamentos.itemSecundario),
    );
    definirTexto(raiz, "#fichaProficiencias", obterTextoProficiencias(personagem));
  }

  function preencherAtaques(raiz, personagem) {
    const lista = buscar(raiz, "#fichaArmasAtaques");
    const equipamentos = personagem.detalhes?.equipamentos;

    if (lista === null) {
      return;
    }

    lista.innerHTML = "";

    if (equipamentos === undefined) {
      return;
    }

    const armas = [equipamentos.armaPrincipal];

    if (equipamentos.itemSecundario === "armaSecundaria") {
      armas.push(equipamentos.armaSecundaria);
    }

    armas.filter(Boolean).forEach(function (idArma) {
      const resumo = window.obterResumoArma(personagem, idArma);

      if (resumo !== undefined) {
        lista.appendChild(window.criarLinhaAtaque(resumo));
      }
    });
  }

  function criarItemMagia(idMagia) {
    const magia = window.bancoMagias?.magias?.[idMagia];
    const item = document.createElement("li");

    if (magia === undefined) {
      item.textContent = idMagia;
      return item;
    }

    const nome = document.createElement("strong");
    nome.textContent = magia.nome;

    const detalhes = document.createElement("span");
    detalhes.textContent =
      ` — ${magia.nivel === 0 ? "Truque" : magia.nivel + "º círculo"}, ` +
      `${magia.escola}, ${magia.tempoConjuracao}, alcance: ${magia.alcance}.`;

    const descricao = document.createElement("p");
    descricao.classList.add("texto-explicativo");
    descricao.textContent = magia.descricaoCurta;

    item.append(nome, detalhes, descricao);
    return item;
  }

  function criarItemTextoMagia(texto, classe) {
    const item = document.createElement("li");
    item.textContent = texto;

    if (classe !== undefined) {
      item.classList.add(classe);
    }

    return item;
  }

  function preencherMagias(raiz, personagem) {
    const lista = buscar(raiz, "#fichaMagias");
    const magias = personagem.magias;

    if (lista === null) {
      return;
    }

    lista.innerHTML = "";

    if (magias?.atributoConjuracao === undefined) {
      return;
    }

    const nomesAtributos = {
      forca: "Força",
      destreza: "Destreza",
      constituicao: "Constituição",
      inteligencia: "Inteligência",
      sabedoria: "Sabedoria",
      carisma: "Carisma",
    };
    const bonusAtaque = magias.bonusAtaqueMagico;
    const truques = magias.truquesConhecidos || [];
    const preparadas = magias.magiasPreparadas || [];

    lista.appendChild(
      criarItemTextoMagia(
        "Atributo de conjuração: " +
          (nomesAtributos[magias.atributoConjuracao] ?? magias.atributoConjuracao),
      ),
    );
    lista.appendChild(criarItemTextoMagia("CD das magias: " + (magias.cdSalvamento || "-")));
    lista.appendChild(
      criarItemTextoMagia(
        "Ataque mágico: " +
          (bonusAtaque === "" || bonusAtaque === undefined
            ? "-"
            : window.formatarModificador(bonusAtaque)),
      ),
    );

    if (magias.espacosMagia?.nivel1 !== undefined) {
      lista.appendChild(
        criarItemTextoMagia(
          "Espaços de magia de 1º círculo: " +
            magias.espacosMagia.nivel1.usados +
            " / " +
            magias.espacosMagia.nivel1.maximos +
            " usados",
        ),
      );
    }

    if (truques.length > 0) {
      lista.appendChild(criarItemTextoMagia("Truques:", "titulo-lista-magias"));

      truques.forEach(function (idMagia) {
        lista.appendChild(criarItemMagia(idMagia));
      });
    }

    if (preparadas.length > 0) {
      lista.appendChild(criarItemTextoMagia("Magias preparadas:", "titulo-lista-magias"));

      preparadas.forEach(function (idMagia) {
        lista.appendChild(criarItemMagia(idMagia));
      });
    }
  }

  function criarBotaoDetalhe(tipo, id, nome) {
    const item = document.createElement("li");
    const botao = document.createElement("button");
    const texto = document.createElement("span");

    botao.type = "button";
    botao.classList.add("botao-habilidade-ficha");
    texto.classList.add("nome-habilidade-ficha");
    texto.textContent = nome;
    botao.appendChild(texto);
    botao.addEventListener("click", function (evento) {
      evento.stopPropagation();
      window.abrirPopoverDetalhe?.(tipo, id, botao);
    });
    item.appendChild(botao);

    return item;
  }

  function preencherTalentos(raiz, personagem) {
    const lista = buscar(raiz, "#fichaTalentos");

    if (lista === null) {
      return;
    }

    lista.innerHTML = "";

    (personagem.talentos || []).forEach(function (idTalento) {
      const talento = window.bancoTalentos?.[idTalento];

      if (talento !== undefined) {
        lista.appendChild(criarBotaoDetalhe("talento", idTalento, talento.nome));
      }
    });
  }

  function atualizarMarcadores(raiz, personagem) {
    raiz.querySelectorAll("[data-pericia]").forEach(function (linha) {
      const id = linha.dataset.pericia;

      linha.classList.toggle("proficiente", window.personagemTemProficienciaEmPericia(personagem, id));
      linha.classList.toggle("especializada", window.personagemTemEspecializacaoEmPericia(personagem, id));
    });

    const salvaguardas = window.bancoClasses?.[personagem.classeId]?.salvaguardas ?? [];

    raiz.querySelectorAll("[data-salvaguarda]").forEach(function (linha) {
      linha.classList.toggle("proficiente", salvaguardas.includes(linha.dataset.salvaguarda));
    });
  }

  function deveRenderizar(secao, secoes) {
    return secoes === null || secoes.includes(secao);
  }

  function renderizar(personagem, raizInformada, opcoes = {}) {
    const raiz = obterRaizFicha(raizInformada);
    const secoes = Array.isArray(opcoes.secoes) ? opcoes.secoes : null;

    if (personagem === undefined || personagem === null) {
      return false;
    }

    if (deveRenderizar("informacoesBasicas", secoes)) {
      preencherInformacoesBasicas(raiz, personagem);
    }

    if (deveRenderizar("atributos", secoes)) {
      preencherAtributos(raiz, personagem);
    }

    if (deveRenderizar("combate", secoes)) {
      preencherCombate(raiz, personagem);
    }

    if (deveRenderizar("equipamentos", secoes)) {
      preencherEquipamentos(raiz, personagem);
    }

    if (deveRenderizar("habilidades", secoes)) {
      window.preencherHabilidades(personagem, raiz);
    }

    if (deveRenderizar("ataques", secoes)) {
      preencherAtaques(raiz, personagem);
    }

    if (deveRenderizar("magias", secoes)) {
      preencherMagias(raiz, personagem);
    }

    if (deveRenderizar("talentos", secoes)) {
      preencherTalentos(raiz, personagem);
    }

    if (deveRenderizar("marcadores", secoes)) {
      atualizarMarcadores(raiz, personagem);
    }

    return true;
  }

  window.RenderizadorFicha = {
    renderizar,
  };

  window.FichaPersonagem.renderizar = renderizar;
})();
