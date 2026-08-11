"use strict";

const bancoAventuras = {
  aFuga: {
    id: "aFuga",
    titulo: "A Fuga",

    descricao:
      `Fuja de uma cidade em conflito enquanto diferentes forças buscam a sua eliminação.`,

    disponivel: true,
    cenaInicial: "inicio",

    cenas: {
      inicio: {
        numeroFonte: 1,

        contexto: [
          `Você está fugindo da cidade onde viveu pelos últimos dois anos.

          Nem em suas previsões mais pessimistas você imaginou que as coisas chegariam a esse ponto. Agora é tarde, e o perigo é grande demais. Depois de tudo que fez, todos que desafiou, chegou a hora de fugir.

          De um lado, os guardas do Conde Debminster, cuja autoridade você desafiou ao questionar sobre o alto valor dos impostos, incitando a população a um pequeno levante contra as políticas autoritárias do conde. Rapidamente, tanto a população quanto o Conde passaram a ver em você uma figura de liderança que você nunca pretendeu ser.

          Do outro, a milícia dos Lagartos de Bronze. Inicialmente, a milícia havia se unido à causa e se prontificado a oferecer segurança para a população durante os protestos. Agora, havia decidido que, para tomar para si o poder que seria deixado pela inevitável queda da autoridade local, precisariam tirar você do tabuleiro político.

          Tudo aconteceu rápido demais. Agora, carregando os poucos pertences que consegue em sua mochila, você se encontra esgueirando-se por um beco, olhando pelas sombras uma multidão raivosa, se preparando para o confronto derradeiro contra a guarda real.

          Do outro lado da multidão, a ponte pela qual você precisa passar para escapar da cidade. Em suas duas cabeceiras, grupos de soldados atentos, impedindo qualquer entrada ou saída da cidade.

          O que você fará?`,
        ],

        escolhas: [
          {
            id: "telhado",

            texto: `Uma pilha de caixas empilhadas próximas à parede chama a sua atenção, parecendo oferecer um caminho até o telhado de um casebre próximo.

            Esconder-se ali em cima parece uma ótima opção. Além de lhe conceder um melhor ponto de observação, dificilmente alguém {o|a} procurará no alto das casas.`,

            etapaInicial: "subirTelhado",
          },

          {
            id: "multidao",

            texto: `Apesar de conhecer muitos dos rostos na multidão, talvez você consiga se misturar e passar {despercebido|despercebida}.

            Uma vez {escondido|escondida} na multidão, talvez seja possível observar melhor seus arredores e formular um plano.`,

            etapaInicial: "misturarMultidao",
          },

          {
            id: "becos",

            texto: `Expor-se é arriscado demais. A melhor alternativa é permanecer nas sombras e tentar encontrar uma saída da cidade investigando as vielas.

            Rumores dizem que os Lagartos de Bronze têm diversas saídas escondidas em seus territórios, pelos becos que passam pela parte de trás do castelo.`,

            etapaInicial: "investigarBecos",
          },

          {
            id: "batalha",

            texto: `Você decide não se esconder e se aproveitar da confusão para enfrentar os guardas de frente. De um jeito ou de outro, isso acaba agora.`,

            proximaCena: "batalha1",
          },
        ],

        etapas: {

          subirTelhado: {
            descricao: [
              `Apesar de mal empilhadas e sem uma base muito sólida, você calcula que as caixas devem ser fortes o suficiente para conter o seu peso.`,
            ],

            instrucao: "para subir no telhado.",

            teste: {
              tipo: "pericia",
              periciaId: "acrobacia",
              dificuldade: 12,
            },

            resultados: {
              sucesso: {
                texto: ``,

                proximaEtapa: "decidirNoTelhado",
              },

              fracasso: {
                texto: `As caixas não aguentam seu peso a tempo de alcançar o telhado. Hora de pensar em um plano B.`,

                voltarParaEscolhas: true,
                removerEscolha: true,
              },
            },
          },

          decidirNoTelhado: {
            descricao: [`Você consegue alcançar o telhado. As caixas que usou como suporte cedem debaixo dos seus pés, e você rapidamente se abaixa para não chamar a atenção.

                Do alto, agora você consegue ver mais da multidão se dirigindo até o castelo do Conde. Ao longe, uma fileira de guardas já se posiciona para impedir a passagem. O conflito parece inevitável.

                Você vê também a torre de embarcações próxima à margem do rio. Em teoria, ela lhe concederia acesso fácil a um pequeno cais por onde você poderia buscar uma saída. Chegar à torre pulando pelos telhados parece perfeitamente possível.

                Porém, talvez sua melhor escolha seja esperar. É pouco provável que alguém {o|a} procure no alto das casas, e uma boa oportunidade pode aparecer depois que o conflito se iniciar de fato. Por outro lado, talvez seja melhor se aproveitar da crescente tensão ao redor do conflito iminente e escapar o mais rápido possível, enquanto os guardas estão distraídos.`],

            escolhas: [
              {
                id: "esperarNoTelhado",
                texto: `Esperar parece ser a opção mais segura.`,
                proximaCena: "esperaNoTelhado",
              },

              {
                id: "seguirParaTorre",
                texto: `Cada segundo de espera é um risco em potencial. Melhor se mover agora em direção à torre.`,
                proximaEtapa: "escolherRotaTelhado",
              },
            ],
          },

          escolherRotaTelhado: {
            descricao: [
              `Você decide se mover e considera suas opções de caminho até a torre.

              Uma das rotas parece ser muito mais rápida, mas também mais perigosa. Sem muita cobertura disponível, você precisaria contar com a sorte para não ser {visto|vista}.

              A outra rota dá a volta nos casebres e chega em um ponto um pouco mais baixo por trás da torre. Pode demorar mais e ser mais difícil, mas, com um pouco de habilidade e paciência, é possível, e potencialmente mais seguro.

              Qual rota você vai escolher?`,
            ],

            escolhas: [
              {
                id: "rotaSegura",
                texto: "A rota mais segura.",
                proximaEtapa: "movimentacaoFurtiva",
              },

              {
                id: "rotaRapida",
                texto: "A rota mais rápida.",
                proximaCena: "movimentacaoTelhadoRapida",
              },
            ],
          },

          movimentacaoFurtiva: {
            descricao: [],

            instrucao: "para avançar pelos telhados sem ser {visto|vista}.",

            teste: {
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: "Você avança sem ser {percebido|percebida}.",
                proximaCena: "movimentacaoTelhadoFurtiva",
              },

              fracasso: {
                texto: "Sua movimentação chama atenção.",
                proximaCena: "movimentacaoTelhadoRapida",
              },
            },
          },

          /* =========================================================
             RAMO: MULTIDÃO
             ========================================================= */

          misturarMultidao: {
            descricao: [],

            teste: {
              tipo: "periciaEscolha",
              periciasIds: ["furtividade", "enganacao"],
              dificuldade: 12,
            },

            resultados: {
              sucesso: {
                texto: "",
                proximaEtapa: "decidirNaMultidao",
              },

              fracasso: {
                texto: "",
                proximaEtapa: "reagirNaMultidao",
              },
            },
          },

          decidirNaMultidao: {
            descricao: [],

            escolhas: [
              {
                id: "acompanharTorre",
                texto: "Acompanhar a multidão até a torre.",
                proximaCena: "torreChao",
              },

              {
                id: "acompanharPonte",
                texto: "Acompanhar a multidão até o início da ponte.",
                proximaCena: "margemRioPonte",
              },

              {
                id: "distrairGuardas",
                texto: "Tentar usar a população para distrair os guardas.",
                proximaCena: "guardasDistraidos",
              },
            ],
          },

          reagirNaMultidao: {
            descricao: [],

            escolhas: [
              {
                id: "pedirAjuda",
                texto: "Pedir ajuda.",
                proximaEtapa: "pedirAjudaMultidao",
              },

              {
                id: "sairCorrendo",
                texto: "Sair correndo.",
                proximaEtapa: "sairCorrendoMultidao",
              },
            ],
          },

          pedirAjudaMultidao: {
            descricao: [],

            instrucao: "para conseguir ajuda.",

            teste: {
              tipo: "pericia",
              periciaId: "persuasao",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: "",
                proximaEtapa: "decidirPedidoAjuda",
              },

              /*
               * TODO: preencher o resultado de fracasso.
               * O banco anterior não definia o destino desse resultado.
               */
              fracasso: {
                texto: "[PREENCHER: consequência da falha ao pedir ajuda.]",
              },
            },
          },

          decidirPedidoAjuda: {
            descricao: [],

            escolhas: [
              {
                id: "pedirDistracao",
                texto: "Pedir para distrair os guardas.",
                proximaCena: "guardasDistraidos",
              },

              {
                id: "perguntarSaida",
                texto: "Perguntar se alguém sabe de outra saída para a cidade.",
                proximaEtapa: "perguntarOutraSaida",
              },
            ],
          },

          perguntarOutraSaida: {
            descricao: [],

            pendenciaFonte:
              "A fonte indica apenas 'Teste de NPC', sem especificar NPC, atributo, perícia ou CD.",

            /*
             * TODO: quando a informação do teste estiver definida,
             * adicionar aqui `teste` e `resultados`.
             *
             * Destinos existentes no banco anterior:
             * sucesso -> becosOpostos
             * fracasso -> becosLagartos
             */
          },

          sairCorrendoMultidao: {
            descricao: [],

            instrucao: "para sair correndo sem ser impedido.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: "",
                proximaCena: "becosLagartos",
              },

              fracasso: {
                texto: "",
                proximaCena: "batalha",
              },
            },
          },

          /* =========================================================
             RAMO: BECOS
             ========================================================= */

          investigarBecos: {
            descricao: [],

            teste: {
              tipo: "periciaEscolha",
              periciasIds: ["natureza", "sobrevivencia"],
              dificuldade: 11,
            },

            resultados: {
              sucesso: {
                texto: "",
                proximaCena: "becosOpostos",
              },

              fracasso: {
                texto: "",
                proximaCena: "becosLagartos",
              },
            },
          },
        },
      },
    },
  },
};
