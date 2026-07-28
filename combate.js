"use strict";

window.SistemaCombate = (function() {

  function criarParticipanteCombate(
  entidade,
  configuracao
) {

  return {
    id: configuracao.id ??
        entidade.id,
    nome: entidade.nome,
    tipo:
      configuracao.tipo ??
      entidade.tipo,

    bonusIniciativa:
      SistemaTestes.calcularModificadorAtributo(
        entidade.atributos.destreza
      ),

    movimentoMaximo:
      configuracao.movimentoMaximo ?? 6,

    posicao:
      structuredClone(
        configuracao.posicao
      ),

    classeArmadura:
      entidade.combate.classeArmadura,

    pontosDeVida:
      structuredClone(
        entidade.combate.pontosDeVida
      ),

    ataques:
      structuredClone(
        entidade.ataques
      ),

    representacao:
  structuredClone(
    configuracao.representacao ??
    entidade.avatar ??
    null
  )
  };

  }

  function criarEstadoCombate(configuracao) {

  const participantes = structuredClone(configuracao.participantes);

  for (const participante of participantes) {

    participante.estado = participante.estado ?? "ativo";

    participante.bonusIniciativa =
    participante.bonusIniciativa ?? 0;

    participante.iniciativa = null;

    participante.movimentoMaximo =
    participante.movimentoMaximo ?? 6;

    participante.movimentoRestante =
    participante.movimentoMaximo;

    participante.acaoDisponivel = true;
    participante.acaoBonusDisponivel = true;
    participante.reacaoDisponivel =true;
  } 

    return {
      id: configuracao.id,
      status: "ativo",

      rodada: 1,
      indiceTurno: 0,
      ordemTurnos: [],
      participanteAtivoId: null,
      participanteSelecionadoId: null,
      alvoSelecionadoId: null,
      iniciativaPendenteId: null,
      ataquePendente: null,
      danoPendente: null,
      resultadoNotificado: false,

      participantes,

      tabuleiro: {
        colunas: 40,
        linhas: 30
      }
    };

  }

  function iniciarCombate(configuracao) {

  const combate =
    criarEstadoCombate(
      configuracao
    );

  window.estadoJogo.combateAtual =
    combate;

  return combate;

  }

  function registrarIniciativa(
  combate,
  idParticipante,
  total
) {

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        idParticipante
    );

  if (!participante) {

    console.warn(
      "Participante não encontrado:",
      idParticipante
    );

    return false;

  }

  participante.iniciativa =
    Number(
      total
    );

  return true;

  }

  function rolarIniciativasInimigos(
  combate
) {

  for (
    const participante of
      combate.participantes
  ) {

    if (
      participante.tipo === "jogador"
    ) {
      continue;
    }

    const resultadoRolagem =
      realizarRolagemComposta({
        gruposDeDados: [
          {
            quantidade: 1,
            numeroDeFaces: 20
          }
        ],

        modificador:
          participante.bonusIniciativa
      });

    registrarIniciativa(
      combate,
      participante.id,
      resultadoRolagem.total
    );

  }

  }

  function calcularDistancia(
  origem,
  destino
) {

  const distanciaColunas =
    Math.abs(
      destino.coluna -
      origem.coluna
    );

  const distanciaLinhas =
    Math.abs(
      destino.linha -
      origem.linha
    );

  return Math.max(
    distanciaColunas,
    distanciaLinhas
  );

  }

  function validarSelecaoCriatura(
  atacante,
  alvo,
  acao
) {

  const distancia =
    calcularDistancia(
      atacante.posicao,
      alvo.posicao
    );

  const alcanceNormal =
    acao.selecao.alcance.normal;

  const alcanceLongo =
    acao.selecao.alcance.longo ??
    null;

  if (
    alcanceLongo !== null &&
    distancia > alcanceLongo
  ) {
    return {
      sucesso: false,
      motivo: "alvoForaDoAlcance"
    };
  }

  if (
    alcanceLongo === null &&
    distancia > alcanceNormal
  ) {
    return {
      sucesso: false,
      motivo: "alvoForaDoAlcance"
    };
  }

  const tipoRolagem =
    alcanceLongo !== null &&
    distancia > alcanceNormal
      ? "desvantagem"
      : "normal";

  return {
    sucesso: true,
    distancia,
    tipoRolagem
  };

  }

  function validarSelecaoAcao(
  atacante,
  alvo,
  acao
) {

  if (!acao.selecao) {
    return {
      sucesso: false,
      motivo: "selecaoNaoInformada"
    };
  }

  if (
    acao.selecao.tipo ===
    "criatura"
  ) {

    return validarSelecaoCriatura(
      atacante,
      alvo,
      acao
    );

  }

  return {
    sucesso: false,
    motivo: "tipoSelecaoNaoImplementado"
  };

  }

  function movimentarParticipante(
  combate,
  idParticipante,
  coluna,
  linha
) {

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        idParticipante
    );

  if (!participante) {
    return {
      sucesso: false,
      motivo: "participanteInexistente"
    };
  }

  if (
    combate.participanteAtivoId !==
    participante.id
  ) {
    return {
      sucesso: false,
      motivo: "foraDoTurno"
    };
  }

  const destinoForaDoTabuleiro =
    coluna < 1 ||
    coluna > combate.tabuleiro.colunas ||
    linha < 1 ||
    linha > combate.tabuleiro.linhas;

  if (destinoForaDoTabuleiro) {
    return {
      sucesso: false,
      motivo: "foraDoTabuleiro"
    };
  }

  const celulaOcupada =
    combate.participantes.some(
      outroParticipante =>
        outroParticipante.id !==
          participante.id &&
        outroParticipante.posicao.coluna ===
          coluna &&
        outroParticipante.posicao.linha ===
          linha
    );

  if (celulaOcupada) {
    return {
      sucesso: false,
      motivo: "celulaOcupada"
    };
  }

  const distancia =
    calcularDistancia(
      participante.posicao,
      {
        coluna,
        linha
      }
    );

  if (
    distancia >
    participante.movimentoRestante
  ) {
    return {
      sucesso: false,
      motivo: "movimentoInsuficiente"
    };
  }

  participante.posicao.coluna =
    coluna;

  participante.posicao.linha =
    linha;

  participante.movimentoRestante -=
    distancia;

  return {
    sucesso: true,
    distancia,
    movimentoRestante:
      participante.movimentoRestante
  };

  }

  function consumirRecurso(
  participante,
  nomeRecurso
) {

  if (!participante[nomeRecurso]) {
    return false;
  }

  participante[nomeRecurso] =
    false;

  return true;

  }

  function consumirAcao(
  participante
) {

  return consumirRecurso(
    participante,
    "acaoDisponivel"
  );

  }

  function consumirAcaoBonus(
  participante
) {

  return consumirRecurso(
    participante,
    "acaoBonusDisponivel"
  );

  }

  function consumirReacao(
  participante
) {

  return consumirRecurso(
    participante,
    "reacaoDisponivel"
  );

  }

  function prepararAtaque(
  combate,
  idAtacante,
  idAlvo,
  idAtaque) {

  const atacante =
    combate.participantes.find(
      participante =>
        participante.id ===
        idAtacante
    );

  if (!atacante) {
    return {
      sucesso: false,
      motivo: "atacanteInexistente"
    };
  }

  if (
    combate.participanteAtivoId !==
    atacante.id
  ) {
    return {
      sucesso: false,
      motivo: "foraDoTurno"
    };
  }

  if (!atacante.acaoDisponivel) {
    return {
      sucesso: false,
      motivo: "acaoIndisponivel"
    };
  }

  const alvo =
    combate.participantes.find(
      participante =>
        participante.id ===
        idAlvo
    );

  if (!alvo) {
    return {
      sucesso: false,
      motivo: "alvoInexistente"
    };
  }

  const ataque =
    atacante.ataques.find(
      ataque =>
        ataque.id ===
        idAtaque
    );

  if (!ataque) {
    return {
      sucesso: false,
      motivo: "ataqueInexistente"
    };
  }

  const resultadoSelecao =
  validarSelecaoAcao(
    atacante,
    alvo,
    ataque
  );

if (!resultadoSelecao.sucesso) {
  return resultadoSelecao;
}

  combate.ataquePendente = {
    atacanteId: atacante.id,
    alvoId: alvo.id,
    ataqueId: ataque.id,
    tipoRolagem: resultadoSelecao.tipoRolagem
  };

  return {
    sucesso: true,
    atacante,
    alvo,
    ataque,
    distancia: resultadoSelecao.distancia,
    tipoRolagem: resultadoSelecao.tipoRolagem
  };

  }

  function resolverAtaque(
  combate,
  resultadoRolagem
) {

  const ataquePendente =
    combate.ataquePendente;

  if (!ataquePendente) {
    return {
      sucesso: false,
      motivo: "nenhumAtaquePendente"
    };
  }

  const atacante =
    combate.participantes.find(
      participante =>
        participante.id ===
        ataquePendente.atacanteId
    );

  const alvo =
    combate.participantes.find(
      participante =>
        participante.id ===
        ataquePendente.alvoId
    );

  const ataque =
    atacante?.ataques.find(
      ataque =>
        ataque.id ===
        ataquePendente.ataqueId
    );

  if (
    !atacante ||
    !alvo ||
    !ataque
  ) {

    combate.ataquePendente =
      null;

    return {
      sucesso: false,
      motivo: "dadosDoAtaqueInvalidos"
    };

  }

  const grupoD20 =
    resultadoRolagem.gruposRolados.find(
      grupo =>
        grupo.numeroDeFaces === 20
    );

  const tipoRolagem =
  ataquePendente.tipoRolagem ??
  "normal";

const resultadoNatural =
  grupoD20
    ? SistemaTestes.selecionarResultadoD20(
        grupoD20.resultados,
        tipoRolagem
      )
    : null;

    const total =
  SistemaTestes.calcularTotalTesteD20(
    resultadoRolagem,
    tipoRolagem
  );

  if (resultadoNatural === null) {
    return {
      sucesso: false,
      motivo: "d20NaoEncontrado"
    };
  }

  const acertoCritico =
    resultadoNatural === 20;

  const falhaAutomatica =
    resultadoNatural === 1;

  const acertou =
    !falhaAutomatica &&
    (
      acertoCritico ||
      total >=
        alvo.classeArmadura
    );

  consumirAcao(
    atacante
  );

  combate.ataquePendente =
    null;

  if (acertou) {

    combate.danoPendente = {
      atacanteId: atacante.id,
      alvoId: alvo.id,
      ataqueId: ataque.id,
      critico: acertoCritico
    };

  }

  return {
    sucesso: true,
    acertou,
    acertoCritico,
    resultadoNatural,
    total,
    tipoRolagem,
    classeArmadura: alvo.classeArmadura,
    atacante,
    alvo,
    ataque
  };

  }

  function removerParticipanteDaOrdem(
  combate,
  idParticipante
) {

  const participanteAtivoId =
    combate.participanteAtivoId;

  combate.ordemTurnos =
    combate.ordemTurnos.filter(
      id =>
        id !== idParticipante
    );

  const novoIndiceAtivo =
    combate.ordemTurnos.indexOf(
      participanteAtivoId
    );

  combate.indiceTurno =
    novoIndiceAtivo >= 0
      ? novoIndiceAtivo
      : 0;

  }

  function verificarFimCombate(
  combate
) {

  const jogadoresAtivos =
    combate.participantes.filter(
      participante =>
        participante.tipo === "jogador" &&
        participante.estado !== "derrotado"
    );

  const inimigosAtivos =
    combate.participantes.filter(
      participante =>
        participante.tipo === "inimigo" &&
        participante.estado !== "derrotado"
    );

  if (jogadoresAtivos.length === 0) {

    combate.status =
      "derrota";

    combate.participanteAtivoId =
      null;

    return "derrota";

  }

  if (inimigosAtivos.length === 0) {

    combate.status =
      "vitoria";

    combate.participanteAtivoId =
      null;

    return "vitoria";

  }

  return null;

  }

  function escolherAtaqueInimigo(
  inimigo,
  alvo
) {

  let ataqueComDesvantagem =
    null;

  for (const ataque of inimigo.ataques) {

    const resultadoSelecao =
      validarSelecaoAcao(
        inimigo,
        alvo,
        ataque
      );

    if (!resultadoSelecao.sucesso) {
      continue;
    }

    if (
      resultadoSelecao.tipoRolagem ===
      "normal"
    ) {

      return ataque;

    }

    ataqueComDesvantagem =
      ataque;

  }

  return ataqueComDesvantagem;

  }

  function moverInimigoEmDirecaoAoAlvo(
  combate,
  inimigo,
  alvo
) {

  let celulasPercorridas =
    0;

  while (
    inimigo.movimentoRestante > 0
  ) {

    const ataqueDisponivel =
      escolherAtaqueInimigo(
        inimigo,
        alvo
      );

    if (ataqueDisponivel) {
      break;
    }

    const direcaoColuna =
      Math.sign(
        alvo.posicao.coluna -
        inimigo.posicao.coluna
      );

    const direcaoLinha =
      Math.sign(
        alvo.posicao.linha -
        inimigo.posicao.linha
      );

    const destinosPossiveis = [
      {
        coluna:
          inimigo.posicao.coluna +
          direcaoColuna,

        linha:
          inimigo.posicao.linha +
          direcaoLinha
      },

      {
        coluna:
          inimigo.posicao.coluna +
          direcaoColuna,

        linha:
          inimigo.posicao.linha
      },

      {
        coluna:
          inimigo.posicao.coluna,

        linha:
          inimigo.posicao.linha +
          direcaoLinha
      }
    ];

    let conseguiuMover =
      false;

    for (
      const destino of
        destinosPossiveis
    ) {

      const resultadoMovimento =
        movimentarParticipante(
          combate,
          inimigo.id,
          destino.coluna,
          destino.linha
        );

      if (resultadoMovimento.sucesso) {

        celulasPercorridas++;
        conseguiuMover =
          true;

        break;

      }

    }

    if (!conseguiuMover) {
      break;
    }

  }

  return {
    sucesso:
      celulasPercorridas > 0,

    celulasPercorridas
  };

  }

  function executarTurnoInimigo(
  combate
) {

  const inimigo =
    combate.participantes.find(
      participante =>
        participante.id ===
        combate.participanteAtivoId
    );

  if (
    !inimigo ||
    inimigo.tipo !== "inimigo" ||
    inimigo.estado === "derrotado"
  ) {
    return {
      sucesso: false,
      motivo: "inimigoInvalido"
    };
  }

  const alvo =
    combate.participantes.find(
      participante =>
        participante.tipo === "jogador" &&
        participante.estado !== "derrotado"
    );

  if (!alvo) {
    return {
      sucesso: false,
      motivo: "nenhumAlvoDisponivel"
    };
  }

  let ataque =
  escolherAtaqueInimigo(
    inimigo,
    alvo
  );

let resultadoMovimento =
  null;

if (!ataque) {

  resultadoMovimento =
    moverInimigoEmDirecaoAoAlvo(
      combate,
      inimigo,
      alvo
    );

  ataque =
    escolherAtaqueInimigo(
      inimigo,
      alvo
    );

}

  if (!ataque) {
    return {
      sucesso: false,
      motivo: "nenhumAtaqueNoAlcance"
    };
  }

  const ataquePreparado =
    prepararAtaque(
      combate,
      inimigo.id,
      alvo.id,
      ataque.id
    );

  if (!ataquePreparado.sucesso) {
    return ataquePreparado;
  }

  const quantidadeD20 =
    ataquePreparado.tipoRolagem ===
      "normal"
        ? 1
        : 2;

  const resultadoRolagemAtaque =
    realizarRolagemComposta({
      gruposDeDados: [
        {
          quantidade: quantidadeD20,
          numeroDeFaces: 20
        }
      ],

      modificador:
        ataque.bonusAtaque
    });

  const resultadoAtaque =
    resolverAtaque(
      combate,
      resultadoRolagemAtaque
    );

  let resultadoDano =
    null;

  if (resultadoAtaque.acertou) {

    const gruposDano =
      structuredClone(
        ataque.dano.gruposDeDados
      );

    if (
      resultadoAtaque.acertoCritico
    ) {

      for (const grupo of gruposDano) {
        grupo.quantidade *= 2;
      }

    }

    const resultadoRolagemDano =
      realizarRolagemComposta({
        gruposDeDados:
          gruposDano,

        modificador:
          ataque.dano.modificador
      });

    resultadoDano =
      resolverDano(
        combate,
        resultadoRolagemDano
      );

  }

  return {
    sucesso: true,
    inimigo,
    alvo,
    ataque,
    resultadoMovimento,
    resultadoAtaque,
    resultadoDano
  };

  }

  function resolverDano(
  combate,
  resultadoRolagem
) {

  const danoPendente =
    combate.danoPendente;

  if (!danoPendente) {
    return {
      sucesso: false,
      motivo: "nenhumDanoPendente"
    };
  }

  const alvo =
    combate.participantes.find(
      participante =>
        participante.id ===
        danoPendente.alvoId
    );

  if (!alvo) {

    combate.danoPendente =
      null;

    return {
      sucesso: false,
      motivo: "alvoInexistente"
    };

  }

  const dano =
    Math.max(
      0,
      resultadoRolagem.total
    );

  alvo.pontosDeVida.atuais =
    Math.max(
      0,
      alvo.pontosDeVida.atuais -
      dano
    );

  const foiDerrotado =
    alvo.pontosDeVida.atuais === 0;

    let resultadoCombate = null;

  if (foiDerrotado) {

  alvo.estado =
    "derrotado";

  removerParticipanteDaOrdem(
    combate,
    alvo.id
  );

  resultadoCombate =
    verificarFimCombate(
      combate
    );

}

  combate.danoPendente =
    null;

  return {
    sucesso: true,
    dano,
    alvo,
    foiDerrotado,
    resultadoCombate,
    pontosDeVidaRestantes:
    alvo.pontosDeVida.atuais
  };

  }

  function iniciarTurnoAtual(
  combate
) {

  const idParticipante =
    combate.ordemTurnos[
      combate.indiceTurno
    ];

  const participante =
    combate.participantes.find(
      participante =>
        participante.id ===
        idParticipante
    );

  if (!participante) {

    combate.participanteAtivoId = null;
    combate.alvoSelecionadoId = null;

    return null;

  }

  combate.participanteAtivoId = participante.id;
  participante.movimentoRestante = participante.movimentoMaximo;
  participante.acaoDisponivel = true;
  participante.acaoBonusDisponivel = true;
  participante.reacaoDisponivel = true;

  return participante;

  }

  function encerrarTurno(
  combate
) {

  if (
    combate.ordemTurnos.length === 0
  ) {

    console.warn(
      "A ordem dos turnos ainda não foi definida."
    );

    return null;

  }

  combate.indiceTurno++;

  if (
    combate.indiceTurno >=
    combate.ordemTurnos.length
  ) {

    combate.indiceTurno =
      0;

    combate.rodada++;

  }

  return iniciarTurnoAtual(
    combate
  );

  }

  function ordenarTurnos(
  combate
) {

  const possuiIniciativaPendente =
    combate.participantes.some(
      participante =>
        participante.iniciativa === null
    );

  if (possuiIniciativaPendente) {

    console.warn(
      "Ainda existem iniciativas pendentes."
    );

    return false;

  }

  const participantesOrdenados =
    [...combate.participantes].sort(
      function (
        participanteA,
        participanteB
      ) {

        const diferencaIniciativa =
          participanteB.iniciativa -
          participanteA.iniciativa;

        if (diferencaIniciativa !== 0) {
          return diferencaIniciativa;
        }

        return (
          participanteB.bonusIniciativa -
          participanteA.bonusIniciativa
        );

      }
    );

  combate.ordemTurnos =
    participantesOrdenados.map(
      participante =>
        participante.id
    );

  combate.indiceTurno =
    0;

  iniciarTurnoAtual(
  combate
);

  return combate.ordemTurnos;

  }

  return {
    criarParticipanteCombate,
    criarEstadoCombate,
    iniciarCombate,
    registrarIniciativa,
    rolarIniciativasInimigos,
    calcularDistancia,
    validarSelecaoCriatura,
    validarSelecaoAcao,
    movimentarParticipante,
    consumirAcao,
    consumirAcaoBonus,
    consumirReacao,
    prepararAtaque,
    resolverAtaque,
    removerParticipanteDaOrdem,
    verificarFimCombate,
    resolverDano,
    iniciarTurnoAtual,
    ordenarTurnos,
    escolherAtaqueInimigo,
    moverInimigoEmDirecaoAoAlvo,
    executarTurnoInimigo,
    encerrarTurno
  };

})();