(function () {
    const DURACAO_DESCANSO_CURTO = {
    quantidade: 1,
    unidade: "horas"
};
    const DURACAO_DESCANSO_LONGO = {
        quantidade: 8,
        unidade: "horas"
    };

    const INTERVALO_ENTRE_DESCANSOS_LONGOS = 16 * 60 * 60;

    function copiar(valor) {
        return structuredClone(valor);
    }

    function obterPersonagemAtual() {
        return window.estadoJogo?.personagem?.dados ?? null;
    }

    function atualizarPersonagemEmJogo(personagem) {
    window.estadoJogo.personagem.dados = personagem;

    document.dispatchEvent(
        new CustomEvent("personagemAtualizado", {
            detail: {
                personagem
            }
        })
    );
}

    function obterTempoAtual() {
        return window.MotorTempo?.obterTempoAtual?.() ?? 0;
    }

    function obterRegistroDescansos() {
        if (!window.estadoJogo.descansos) {
            window.estadoJogo.descansos = {
                ultimoDescansoLongoConcluidoEm: null
            };
        }

        return window.estadoJogo.descansos;
    }

    function obterPontosDeVida(personagem) {
        return personagem?.combate?.pontosDeVida
            ?? personagem?.pontosDeVida
            ?? null;
    }

    function aplicarRecuperacaoDeRecursos(personagem, tipoDescanso) {
        const recursos = personagem?.habilidades?.recursos ?? {};
        const recuperados = [];

        Object.entries(recursos).forEach(([recursoId, recurso]) => {
            const recuperacao = recurso?.recuperacao?.[tipoDescanso];

            if (!recuperacao) {
                return;
            }

            const maximo = Number(recurso.usosMaximos ?? 0);
            const atual = Number(recurso.usosAtuais ?? 0);
            let novoValor = atual;

            if (recuperacao.restaurarTodos) {
                novoValor = maximo;
            } else {
                const quantidade = Number(recuperacao.quantidade ?? 0);

                if (quantidade > 0) {
                    novoValor = Math.min(maximo, atual + quantidade);
                }
            }

            recurso.usosAtuais = novoValor;

            if (novoValor !== atual) {
                recuperados.push({
                    id: recursoId,
                    nome: recurso.nome ?? recursoId,
                    anterior: atual,
                    atual: novoValor,
                    recuperado: novoValor - atual
                });
            }
        });

        return recuperados;
    }

    function validarDescansoLongo(personagem, contexto = {}) {
        if (!personagem) {
            return {
                valido: false,
                motivo: "personagemAusente"
            };
        }

        if (window.estadoJogo?.combateAtual?.status === "ativo") {
            return {
                valido: false,
                motivo: "combateAtivo"
            };
        }

        const pontosDeVida = obterPontosDeVida(personagem);

        if (!pontosDeVida) {
            return {
                valido: false,
                motivo: "pontosDeVidaAusentes"
            };
        }

        if (Number(pontosDeVida.atuais ?? 0) < 1) {
            return {
                valido: false,
                motivo: "personagemSemPontosDeVida"
            };
        }

        const tempoAtual = Number(
            contexto.tempoAtual ?? obterTempoAtual()
        );

        const ultimoDescanso =
            contexto.ultimoDescansoLongoConcluidoEm ?? null;

        if (
            ultimoDescanso !== null
            && tempoAtual - ultimoDescanso < INTERVALO_ENTRE_DESCANSOS_LONGOS
        ) {
            return {
                valido: false,
                motivo: "intervaloDescansoLongo",
                segundosRestantes:
                    INTERVALO_ENTRE_DESCANSOS_LONGOS
                    - (tempoAtual - ultimoDescanso)
            };
        }

        return {
            valido: true
        };
    }

    function prepararDescansoLongo(personagem, contexto = {}) {
        const validacao = validarDescansoLongo(personagem, contexto);

        if (!validacao.valido) {
            return {
                sucesso: false,
                ...validacao
            };
        }

        const personagemAtualizado = copiar(personagem);
        const pontosDeVida = obterPontosDeVida(personagemAtualizado);

        const vidaAnterior = Number(pontosDeVida.atuais ?? 0);
        const vidaMaxima = Number(pontosDeVida.maximo ?? vidaAnterior);
        const vidaTemporariaAnterior = Number(
            pontosDeVida.temporarios ?? 0
        );

        pontosDeVida.atuais = vidaMaxima;
        pontosDeVida.temporarios = 0;

        const dadosVidaUsadosAnterior = Number(
            pontosDeVida.dadosVidaUsados ?? 0
        );

        pontosDeVida.dadosVidaUsados = 0;

        const recursosRecuperados = aplicarRecuperacaoDeRecursos(
            personagemAtualizado,
            "descansoLongo"
        );

        return {
            sucesso: true,
            personagem: personagemAtualizado,
            duracao: copiar(DURACAO_DESCANSO_LONGO),
            recuperacao: {
                pontosDeVida: {
                    anterior: vidaAnterior,
                    atual: vidaMaxima,
                    recuperados: Math.max(0, vidaMaxima - vidaAnterior)
                },
                pontosDeVidaTemporariosRemovidos:
                    vidaTemporariaAnterior,
                dadosVidaRecuperados:
                    dadosVidaUsadosAnterior,
                recursos: recursosRecuperados
            }
        };
    }

    function realizarDescansoLongo() {
        const personagem = obterPersonagemAtual();
        const registroDescansos = obterRegistroDescansos();
        const tempoAtual = obterTempoAtual();

        const preparacao = prepararDescansoLongo(personagem, {
            tempoAtual,
            ultimoDescansoLongoConcluidoEm:
                registroDescansos.ultimoDescansoLongoConcluidoEm
        });

        if (!preparacao.sucesso) {
            return preparacao;
        }

        const personagemSalvo =
            window.PersonagemDados?.atualizarSalvo?.(
                preparacao.personagem
            );

        if (!personagemSalvo) {
            return {
                sucesso: false,
                motivo: "erroAoSalvarPersonagem"
            };
        }

        atualizarPersonagemEmJogo(personagemSalvo);

        window.MotorTempo.avancar(preparacao.duracao);

        const tempoConclusao = obterTempoAtual();

        registroDescansos.ultimoDescansoLongoConcluidoEm =
            tempoConclusao;

        return {
            ...preparacao,
            personagem: personagemSalvo,
            tempoInicio: tempoAtual,
            tempoConclusao
        };
    }

    function calcularModificadorAtributo(valor) {
    return Math.floor((Number(valor) - 10) / 2);
}

function obterFacesDadoVida(pontosDeVida) {
    const dadoVida = String(pontosDeVida?.dadoVida ?? "");
    const correspondencia = dadoVida.match(/^1d(\d+)$/i);

    if (!correspondencia) {
        return null;
    }

    const faces = Number(correspondencia[1]);

    return Number.isInteger(faces) && faces >= 2
        ? faces
        : null;
}

function validarDescansoCurto(personagem) {
    if (!personagem) {
        return {
            valido: false,
            motivo: "personagemAusente"
        };
    }

    if (window.estadoJogo?.combateAtual?.status === "ativo") {
        return {
            valido: false,
            motivo: "combateAtivo"
        };
    }

    const pontosDeVida = obterPontosDeVida(personagem);

    if (!pontosDeVida) {
        return {
            valido: false,
            motivo: "pontosDeVidaAusentes"
        };
    }

    if (Number(pontosDeVida.atuais ?? 0) < 1) {
        return {
            valido: false,
            motivo: "personagemSemPontosDeVida"
        };
    }

    return {
        valido: true
    };
}

function iniciarDescansoCurto() {
    const personagem = obterPersonagemAtual();
    const validacao = validarDescansoCurto(personagem);

    if (!validacao.valido) {
        return {
            sucesso: false,
            ...validacao
        };
    }

    const registroDescansos = obterRegistroDescansos();

    if (registroDescansos.descansoCurtoAtual?.ativo) {
        return {
            sucesso: false,
            motivo: "descansoCurtoJaIniciado"
        };
    }

    const personagemAtualizado = copiar(personagem);

    const recursosRecuperados = aplicarRecuperacaoDeRecursos(
        personagemAtualizado,
        "descansoCurto"
    );

    const personagemSalvo =
        window.PersonagemDados?.atualizarSalvo?.(
            personagemAtualizado
        );

    if (!personagemSalvo) {
        return {
            sucesso: false,
            motivo: "erroAoSalvarPersonagem"
        };
    }

    const tempoInicio = obterTempoAtual();

    atualizarPersonagemEmJogo(personagemSalvo);

    window.MotorTempo.avancar(DURACAO_DESCANSO_CURTO);

    const tempoConclusao = obterTempoAtual();

    registroDescansos.descansoCurtoAtual = {
        ativo: true,
        tempoInicio,
        tempoConclusao,
        dadosVidaGastos: []
    };

    return {
        sucesso: true,
        personagem: personagemSalvo,
        duracao: copiar(DURACAO_DESCANSO_CURTO),
        tempoInicio,
        tempoConclusao,
        recursosRecuperados
    };
}

function prepararGastoDadoVida() {
    const registroDescansos = obterRegistroDescansos();
    const descanso = registroDescansos.descansoCurtoAtual;

    if (!descanso?.ativo) {
        return {
            sucesso: false,
            motivo: "descansoCurtoNaoIniciado"
        };
    }

    const personagem = obterPersonagemAtual();
    const pontosDeVida = obterPontosDeVida(personagem);

    if (!pontosDeVida) {
        return {
            sucesso: false,
            motivo: "pontosDeVidaAusentes"
        };
    }

    const vidaAtual = Number(pontosDeVida.atuais ?? 0);
    const vidaMaxima = Number(
        pontosDeVida.maximo ?? vidaAtual
    );

    if (vidaAtual >= vidaMaxima) {
        return {
            sucesso: false,
            motivo: "pontosDeVidaCheios"
        };
    }

    const nivel = Math.max(
        1,
        Number(personagem.nivel) || 1
    );

    const dadosVidaUsados = Number(
        pontosDeVida.dadosVidaUsados ?? 0
    );

    if (dadosVidaUsados >= nivel) {
        return {
            sucesso: false,
            motivo: "semDadosVidaDisponiveis"
        };
    }

    const faces = obterFacesDadoVida(pontosDeVida);

    if (!faces) {
        return {
            sucesso: false,
            motivo: "dadoVidaInvalido"
        };
    }

    const constituicao = Number(
        personagem.atributos?.constituicao ?? 10
    );

    const modificadorConstituicao =
        calcularModificadorAtributo(constituicao);

    return {
        sucesso: true,
        dado: `d${faces}`,
        faces,
        modificadorConstituicao,

        solicitacao: {
            gruposDeDados: [
                {
                    quantidade: 1,
                    numeroDeFaces: faces
                }
            ],
            modificador: modificadorConstituicao,
            descricao: "Dado de Vida",
            quantidadeDeRolagens: 1
        }
    };
}

function aplicarResultadoDadoVida(resultadoRolagem) {
    const preparacao = prepararGastoDadoVida();

    if (!preparacao.sucesso) {
        return preparacao;
    }

    const resultadoDado = Number(
        resultadoRolagem?.subtotal
    );

    if (!Number.isInteger(resultadoDado)) {
        return {
            sucesso: false,
            motivo: "resultadoDadoInvalido"
        };
    }

    const personagemAtualizado = copiar(
        obterPersonagemAtual()
    );

    const pontosDeVida = obterPontosDeVida(
        personagemAtualizado
    );

    const vidaAtual = Number(
        pontosDeVida.atuais ?? 0
    );

    const vidaMaxima = Number(
        pontosDeVida.maximo ?? vidaAtual
    );

    const dadosVidaUsados = Number(
        pontosDeVida.dadosVidaUsados ?? 0
    );

    const curaCalculada = Math.max(
        0,
        resultadoDado
            + preparacao.modificadorConstituicao
    );

    const novaVida = Math.min(
        vidaMaxima,
        vidaAtual + curaCalculada
    );

    const curaAplicada = novaVida - vidaAtual;

    pontosDeVida.atuais = novaVida;
    pontosDeVida.dadosVidaUsados =
        dadosVidaUsados + 1;

    const personagemSalvo =
        window.PersonagemDados?.atualizarSalvo?.(
            personagemAtualizado
        );

    if (!personagemSalvo) {
        return {
            sucesso: false,
            motivo: "erroAoSalvarPersonagem"
        };
    }

    atualizarPersonagemEmJogo(personagemSalvo);

    const resultado = {
        dado: preparacao.dado,
        resultadoDado,
        modificadorConstituicao:
            preparacao.modificadorConstituicao,
        curaCalculada,
        curaAplicada,
        vidaAnterior: vidaAtual,
        vidaAtual: novaVida,
        vidaMaxima,
        dadosVidaUsados: dadosVidaUsados + 1,
        dadosVidaMaximos:
            Math.max(
                1,
                Number(personagemSalvo.nivel) || 1
            )
    };

    const registroDescansos =
        obterRegistroDescansos();

    registroDescansos
        .descansoCurtoAtual
        .dadosVidaGastos
        .push(resultado);

    return {
        sucesso: true,
        personagem: personagemSalvo,
        resultado
    };
}

function encerrarDescansoCurto() {
    const registroDescansos = obterRegistroDescansos();
    const descanso = registroDescansos.descansoCurtoAtual;

    if (!descanso?.ativo) {
        return {
            sucesso: false,
            motivo: "descansoCurtoNaoIniciado"
        };
    }

    descanso.ativo = false;

    return {
        sucesso: true,
        descanso: copiar(descanso)
    };
}

    window.SistemaDescansos = {
        validarDescansoCurto,
    iniciarDescansoCurto,
    prepararGastoDadoVida,
aplicarResultadoDadoVida,
    encerrarDescansoCurto,
    validarDescansoLongo,
    prepararDescansoLongo,
    realizarDescansoLongo
    };
})();