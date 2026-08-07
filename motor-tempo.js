window.MotorTempo = (function () {

  function converterParaSegundos(
    quantidade,
    unidade,
  ) {
    const valor =
      Number(quantidade) || 0;

    if (unidade === "segundos") {
      return valor;
    }

    if (unidade === "minutos") {
      return valor * 60;
    }

    if (unidade === "horas") {
      return valor * 60 * 60;
    }

    if (unidade === "dias") {
      return valor * 24 * 60 * 60;
    }

    return 0;
  }

  function obterTempoAtual() {
    return (
      Number(
        window.estadoJogo
          ?.tempo
          ?.segundosTotais,
      ) || 0
    );
  }

  function avancar(duracao) {
    const segundos =
      converterParaSegundos(
        duracao?.quantidade,
        duracao?.unidade,
      );

    window.estadoJogo.tempo ??= {
      segundosTotais: 0,
    };

    window.estadoJogo
      .tempo
      .segundosTotais +=
      segundos;

      const efeitosAtualizados =
  removerEfeitosExpirados();

    return {
      sucesso: true,
      segundosAvancados:
        segundos,
      tempoAtual:
        obterTempoAtual(),
      efeitosExpirados: efeitosAtualizados.expirados,
    };
  }

  function calcularExpiracao(
  duracao,
) {
  const inicioEm =
    obterTempoAtual();

  const duracaoSegundos =
    converterParaSegundos(
      duracao?.quantidade,
      duracao?.unidade,
    );

  return {
    inicioEm,

    expiraEm:
      inicioEm +
      duracaoSegundos,

    duracaoSegundos,
  };
  }

  function efeitoExpirou(
  efeito,
) {
  if (
    efeito?.expiraEm ===
      undefined ||
    efeito?.expiraEm ===
      null
  ) {
    return false;
  }

  return (
    obterTempoAtual() >=
    efeito.expiraEm
  );
  }

  function obterTempoRestante(
  efeito,
) {
  if (
    efeito?.expiraEm ===
      undefined ||
    efeito?.expiraEm ===
      null
  ) {
    return null;
  }

  return Math.max(
    0,
    efeito.expiraEm -
      obterTempoAtual(),
  );
  }

  function removerEfeitosExpirados() {
  const efeitos =
    window.estadoJogo
      ?.efeitosTemporarios ?? [];

  const ativos = [];
  const expirados = [];

  for (const efeito of efeitos) {
    if (efeitoExpirou(efeito)) {
      expirados.push(efeito);
      continue;
    }

    ativos.push(efeito);
  }

  window.estadoJogo
    .efeitosTemporarios = ativos;

  return {
    ativos,
    expirados,
  };
  }

  return {
    converterParaSegundos,
    obterTempoAtual,
    avancar,
    calcularExpiracao,
    efeitoExpirou,
    obterTempoRestante,
    removerEfeitosExpirados,
  };
})();