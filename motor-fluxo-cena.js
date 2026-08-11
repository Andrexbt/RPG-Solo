"use strict";

(function inicializarMotorFluxoCena() {
  let tentativas = 0;

  function aguardarDependencias() {
    tentativas += 1;

    if (
      !window.MotorAventura ||
      typeof iniciarEtapa !== "function" ||
      typeof exibirEscolhas !== "function"
    ) {
      if (tentativas > 250) {
        console.warn(
          "O motor de fluxo da cena não encontrou as dependências necessárias.",
        );
        return;
      }

      window.setTimeout(aguardarDependencias, 40);
      return;
    }

    substituirIniciarEtapa();
  }

  function substituirIniciarEtapa() {
    iniciarEtapa = function iniciarEtapaDaCena(idEtapa) {
      const etapa = cenaAtual?.etapas?.[idEtapa];

      if (!etapa) {
        console.warn(
          `Etapa não encontrada na cena atual: ${idEtapa}`,
        );
        return;
      }

      etapaAtual = etapa;
      estadoAtualJogo.progresso.etapaId = idEtapa;

      if (etapa.descricao !== undefined) {
        exibirContexto(etapa.descricao);
      }

      if (
        etapa.pendenciaFonte &&
        (!etapa.teste || etapa.teste.dificuldade == null)
      ) {
        testePendente = null;
        estadoAtualJogo.testePendente = null;
        ocultarEscolhas();

        solicitacaoTeste.textContent = etapa.pendenciaFonte;
        solicitacaoTeste.hidden = false;
        return;
      }

      if (etapa.teste) {
        window.MotorAventura.iniciarTeste({
          teste: etapa.teste,
          resultados: etapa.resultados,
          instrucao: etapa.instrucao,
          origem: etapa,
        });
        return;
      }

      if (Array.isArray(etapa.escolhas)) {
        exibirEscolhas(etapa.escolhas);
        return;
      }

      window.MotorAventura.aplicarConsequencia(etapa);
    };
  }

  aguardarDependencias();
})();
