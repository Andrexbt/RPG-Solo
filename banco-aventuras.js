"use strict";

const bancoAventuras = {

  aFuga: {

    id: "aFuga",
    titulo: "A Fuga",

    descricao:
      "Fuja de uma cidade em conflito enquanto diferentes forças tentam impedir sua passagem.",

    disponivel: true,
    cenaInicial: "inicio",

    metadadosImplementacao: {
      fonte: "Aventuras RPG Solo",
      totalCenasFonte: 20,
      status: "estruturaCompletaConteudoParcialmenteExecutavel",
      observacao:
        "O banco descreve integralmente o fluxo disponível na fonte. Recursos ainda não suportados pelo motor são marcados em requerSistema ou pendenciaFonte.",
    },

    cenas: {

      inicio: {
        numeroFonte: 1,
        titulo: "O Começo",

        contexto: [
          "Você está fugindo da cidade onde viveu pelos últimos quatro anos.",
          "Nem em suas previsões mais pessimistas você imaginou que as coisas chegariam a esse ponto. Agora é tarde, e o perigo é grande demais. Depois de tudo que fez, todos que desafiou, chegou a hora de fugir.",
          "De um lado, os guardas do Conde Debminster, cuja autoridade você desafiou ao questionar sobre o alto valor dos impostos e, sem querer, acabou incitando a população a um pequeno levante contra as políticas autoritárias do conde. Do outro, a milícia dos Lagartos de Bronze, que se prontificou a oferecer segurança para a população durante os protestos. No entanto, aparentemente, agora haviam decidido que para tomar para si o poder que seria deixado pela inevitável queda da autoridade local, precisariam tirar você do tabuleiro político.",
          "Tudo aconteceu rápido demais. Lhe colocaram em uma posição que você nunca quis preencher. Agora, carregando os poucos pertences que você consegue em sua mochila, você se encontra esgueirando-se por um beco, olhado pelas sombras uma multidão raivosa. Muitos rostos os quais você conhece. Do outro lado da multidão, a ponte pela qual você precisa passar para escapar da cidade. E em suas duas cabeceiras, grupos de soldados atentos, impedindo qualquer entrada ou saída da cidade.",
        ],

        escolhas: [
          {
            id: "telhado",
            texto:
              `Tentar atravessar pelos telhados.\nUma pilha de caixas empilhadas próximas à parede chama a sua atenção, parecendo oferecer um caminho até o telhado.`,
            etapaInicial: "subirTelhado",
            etapas: {
              subirTelhado: {
                descricao: [
                  "Apesar de mal empilhadas e sem uma base muito sólida, você calcula que as caixas devem ser fortes o suficiente para conter o seu peso.",
                ],
                instrucao:"para subir no telhado.",
                teste: {
                  tipo: "pericia",
                  periciaId: "acrobacia",
                  dificuldade: 12,
                },
                resultados: {
                  sucesso: {
                    texto: `Você consegue alcançar os telhados. As caixas que você usou como suporte cedem debaixo dos seus pés, e rapidamente se abaixa para não chamar a atenção.\nDo alto, agora você consegue ver mais da multidão se dirigindo até o castelo do Conde. Ao longe, uma fileira de guardas reais já se posiciona para impedir a passagem. O conflito parece inevitável.\nVocê vê também a torre de embarcações próxima, lhe concedendo acesso fácil a um pequeno cais por onde você pode buscar uma saída. Chegar na torre pulando pelos telhados parece perfeitamente possível.\nPorém, talvez sua melhor escolha seja esperar até a noite, onde você vai ter as sombras como vantagem. Por outro lado, talvez seja melhor se aproveitar do conflito eminente e escapar o mais rápido possível, enquanto os guardas estão distraídos.`,
                    escolhas: [
                      { id: "esperar",
                        texto: `Esperar. Antes de tomar qualquer decisão, o melhor é esperar o conflito de fato se iniciar, e torcer para que ele proporcione uma brecha para sua fuga.`, proximaCena: "esperaNoTelhado" },
                      {
                        id: "ir",
                        texto: `Esperar parece arriscado, mas se mover abertamente também. Talvez o melhor seja uma aparoximação mais lenta e sorrateira, escolhendo com cuidado o caminho até a torre.`,
                        proximaEtapa: "movimentacaoFurtiva",
                      },
                      {
                        id: "movimentacaoRapida",
                        texto: `Esperar é arriscado demais. Você não sabe exatamente o quão ativamente estão procurando por você, e cada segundo de espera pode ser fatal. O melhor é se deslocar pulando de telhado em telhado o mais rápido possível.`,
                        proximaCena: "movimentacaoTelhadoRapida",
                      },
                    ],
                  },
                  fracasso: {
                    texto: `As caixas não aguentam seu peso a tempo de alcançar o telhado.\nHora de pensar em um plano B.`,
                    voltarParaEscolhas: true,
                    removerEscolha: true,
                  },
                },
              },

              movimentacaoFurtiva: {
                instrucao: "para avançar pelos telhados sem ser visto.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 13,
                },
                resultados: {
                  sucesso: {
                    texto: "Você avança sem ser percebido.",
                    proximaCena: "movimentacaoTelhadoFurtiva",
                  },
                  fracasso: {
                    texto: "Sua movimentação chama atenção.",
                    proximaCena: "movimentacaoTelhadoRapida",
                  },
                },
              },
            },
          },

          {
            id: "multidao",
            texto: `Se misturar na multidão. Apesar de conhecer algumas das pessoas na multidão, talvez você consiga se misturar e passar despercebido.`,
            requerSistema: "escolhaEntrePericias",
            teste: {
              tipo: "periciaEscolha",
              periciasIds: ["furtividade", "enganacao"],
              dificuldade: 12,
            },
            resultados: {
              sucesso: {
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
              fracasso: {
                escolhas: [
                  {
                    id: "pedirAjuda",
                    texto: "Pedir ajuda.",
                    requerSistema: "testeSequencial",
                    teste: {
                      tipo: "pericia",
                      periciaId: "persuasao",
                      dificuldade: 13,
                    },
                    resultados: {
                      sucesso: {
                        escolhas: [
                          {
                            id: "pedirDistracao",
                            texto: "Pedir para distrair os guardas.",
                            proximaCena: "guardasDistraidos",
                          },
                          {
                            id: "perguntarSaida",
                            texto: "Perguntar se alguém sabe de outra saída para a cidade.",
                            requerSistema: "testeNpc",
                            pendenciaFonte:
                              "A fonte indica apenas 'Teste de NPC', sem especificar NPC, atributo, perícia ou CD.",
                            resultados: {
                              sucesso: { proximaCena: "becosOpostos" },
                              fracasso: { proximaCena: "becosLagartos" },
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    id: "sairCorrendo",
                    texto: "Sair correndo.",
                    requerSistema: "testeEmEscolha",
                    teste: {
                      tipo: "pericia",
                      periciaId: "atletismo",
                      dificuldade: 13,
                    },
                    resultados: {
                      sucesso: { proximaCena: "becosLagartos" },
                      fracasso: { proximaCena: "batalha" },
                    },
                  },
                ],
              },
            },
          },

          {
            id: "becos",
            texto: `Continuar pelos becos. Melhor permanecer nas sombras e tentar encontrar uma saída da cidade investigando as vielas.`,
            requerSistema: "escolhaEntrePericias",
            teste: {
              tipo: "periciaEscolha",
              periciasIds: ["natureza", "sobrevivencia"],
              dificuldade: 11,
            },
            resultados: {
              sucesso: { proximaCena: "becosOpostos" },
              fracasso: { proximaCena: "becosLagartos" },
            },
          },

          {
            id: "batalha",
            texto: "Enfrentar os guardas. Você decide se aproveitar da confusão e tentar enfrentar os guardas de frente. De um jeito ou de outro, isso acaba agora.",
            proximaCena: "batalha",
          },
        ],

      },

      esperaNoTelhado: {
        numeroFonte: 2,
        titulo: "Espera no Telhado",
        contexto: [`Após alguns minutos nervosos de espera, um alvoroço repentino na multidão chama sua atenção, pontuado pelo som metálico de espadas se chocando. O confronto finalmente começou.`],
        escolhas: [
          {
            id: "irFurtivo",
            texto: `Essa é a sua chance. Com todo o tumulto, ninguém vai o perceber `,
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para avançar furtivamente.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 13,
                },
                resultados: {
                  sucesso: { proximaCena: "movimentacaoTelhadoFurtiva" },
                  fracasso: { proximaCena: "movimentacaoTelhadoRapida" },
                },
              },
            },
          },
          {
            id: "irRapido",
            texto: "Ir com movimentação rápida.",
            proximaCena: "movimentacaoTelhadoRapida",
          },
          {
            id: "aproximarConfrontoFurtivo",
            texto: "Se aproximar do confronto com movimentação furtiva.",
            etapaInicial: "testeFurtividadeConfronto",
            etapas: {
              testeFurtividadeConfronto: {
                instrucao: "para se aproximar do confronto sem ser visto.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 14,
                },
                resultados: {
                  sucesso: { proximaCena: "confronto" },
                  fracasso: { proximaCena: "movimentacaoTelhadoRapida" },
                },
              },
            },
          },
          {
            id: "aproximarConfrontoRapido",
            texto: "Se aproximar do confronto com movimentação rápida.",
            proximaCena: "movimentacaoTelhadoRapida",
          },
          {
            id: "esperarNoite",
            texto: `Esperar até a noite. Pode ser arriscado, talvez até lá o conflita já tenha se dissipado e os guardas estejam ativamente buscando por você. Ainda assim, essa parece a opção mais segura.`,
            proximaCena: "telhadosNoite",
          },
        ],
      },

      movimentacaoTelhadoFurtiva: {
        numeroFonte: 3,
        titulo: "Movimentação Telhado Furtiva",
        contexto: [],
        requerSistema: "testeOposto",
        testeInicial: {
          tipo: "oposto",
          jogador: { tipo: "pericia", periciaId: "furtividade" },
          oponente: {
            npcId: "guardaConde",
            tipo: "pericia",
            periciaId: "percepcao",
          },
        },
        resultadosTesteInicial: {
          sucesso: {
            escolhas: [
              {
                id: "pularTorre",
                texto: "Pular para a torre.",
                requerSistema: "testeEmEscolha",
                teste: {
                  tipo: "pericia",
                  periciaId: "atletismo",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "torreTetoSemGuardas" },
                  fracasso: {
                    efeitos: [{ tipo: "danoQueda", requerSistema: "danoQueda" }],
                    requerSistema: "escolhaEntrePericias",
                    teste: {
                      tipo: "periciaEscolha",
                      periciasIds: ["furtividade", "enganacao"],
                      dificuldade: 14,
                    },
                    resultados: {
                      sucesso: {
                        escolhas: [
                          {
                            id: "acompanharTorre",
                            texto: "Se misturar e acompanhar até a torre.",
                            proximaCena: "torreChao",
                          },
                        ],
                      },
                      fracasso: {
                        escolhas: [
                          {
                            id: "pedirAjuda",
                            texto: "Pedir ajuda.",
                            requerSistema: "testeSequencial",
                            teste: {
                              tipo: "pericia",
                              periciaId: "persuasao",
                              dificuldade: 13,
                            },
                            resultados: {
                              sucesso: { proximaCena: "torreChao" },
                              fracasso: {
                                teste: {
                                  tipo: "pericia",
                                  periciaId: "atletismo",
                                  dificuldade: 13,
                                },
                                resultados: {
                                  sucesso: { proximaCena: "becosOpostos" },
                                  fracasso: { proximaCena: "batalha" },
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                id: "descerRua",
                texto: "Descer e ir pela rua.",
                proximaCena: "torreChao",
              },
            ],
          },
          fracasso: { proximaCena: "movimentacaoTelhadoRapida" },
        },
      },

      movimentacaoTelhadoRapida: {
        numeroFonte: 4,
        titulo: "Movimentação Telhado Rápida",
        contexto: [],
        requerSistema: "ataqueNarrativo",
        sequencia: {
          ataquesMaximos: 2,
          atacanteNpcId: "guardaConde",
          aoAcertar: {
            efeito: { tipo: "danoAtaque", requerSistema: "ataqueNarrativo" },
            teste: {
              tipo: "salvaguarda",
              atributoId: "constituicao",
              dificuldade: 14,
            },
            resultados: {
              sucesso: { continuarSequencia: true },
              fracasso: {
                teste: {
                  tipo: "atributo",
                  atributoId: "forca",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { continuarSequencia: true },
                  fracasso: {
                    efeitos: [{ tipo: "danoQueda", requerSistema: "danoQueda" }],
                    proximaCena: "batalha",
                  },
                },
              },
            },
          },
          aoConcluirSemQueda: { proximaCena: "torreTetoComGuardas" },
        },
      },

      guardasDistraidos: {
        numeroFonte: 5,
        titulo: "Guardas Distraídos",
        contexto: [],
        escolhas: [
          {
            id: "ponteDisfarcado",
            texto: "Tentar passar disfarçado pela ponte.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para passar disfarçado pela ponte.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
          {
            id: "atravessarRio",
            texto: "Tentar atravessar o rio.",
            etapaInicial: "testeAtletismo",
            etapas: {
              testeAtletismo: {
                instrucao: "para atravessar o rio.",
                teste: {
                  tipo: "pericia",
                  periciaId: "atletismo",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "torreChaoMolhado" },
                },
              },
            },
          },
        ],
      },

      becosOpostos: {
        numeroFonte: 6,
        titulo: "Becos Opostos",
        contexto: [],
        escolhas: [
          {
            id: "darVoltaCastelo",
            texto: "Tentar dar a volta no castelo.",
            etapaInicial: "testeSobrevivencia",
            etapas: {
              testeSobrevivencia: {
                instrucao: "para dar a volta no castelo.",
                teste: {
                  tipo: "pericia",
                  periciaId: "sobrevivencia",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { proximaCena: "margemRioLonge" },
                  fracasso: { proximaCena: "becosLagartos" },
                },
              },
            },
          },
          {
            id: "buscarOutraSaida",
            texto: "Buscar por outra saída.",
            requerSistema: "testeSequencial",
            teste: {
              tipo: "pericia",
              periciaId: "sobrevivencia",
              dificuldade: 17,
            },
            resultados: {
              sucesso: {
                texto: "Você encontra uma saída, mas ela está bloqueada por Lagartos de Bronze.",
                escolhas: [
                  {
                    id: "passarDespercebido",
                    texto: "Tentar passar despercebido.",
                    teste: {
                      tipo: "pericia",
                      periciaId: "furtividade",
                      dificuldade: 17,
                    },
                    pendenciaFonte:
                      "A fonte não explicita o destino de sucesso/falha deste teste antes da opção 'Voltar'.",
                  },
                  {
                    id: "voltar",
                    texto: "Voltar.",
                    proximaCena: "becosLagartos",
                  },
                ],
              },
              fracasso: { proximaCena: "batalha" },
            },
          },
        ],
      },

      becosLagartos: {
        numeroFonte: 7,
        titulo: "Becos Lagartos",
        contexto: [],
        escolhas: [
          {
            id: "voltarTorre",
            texto: "Voltar para a torre.",
            etapaInicial: "testeSobrevivencia",
            etapas: {
              testeSobrevivencia: {
                instrucao: "para voltar para a torre.",
                teste: {
                  tipo: "pericia",
                  periciaId: "sobrevivencia",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { proximaCena: "torreChao" },
                  fracasso: { proximaCena: "confronto" },
                },
              },
            },
          },
          {
            id: "buscarOutraSaida",
            texto: "Buscar por outra saída.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para buscar outra saída sem ser percebido.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "margemRioLonge" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
        ],
      },

      confronto: {
        numeroFonte: 8,
        titulo: "Confronto",
        contexto: [],
        incompleta: true,
        pendenciaFonte:
          "A Cena 08 aparece na fonte apenas como '1.', sem conteúdo, escolhas, testes ou destinos.",
        escolhas: [],
      },

      telhadosNoite: {
        numeroFonte: 9,
        titulo: "Telhados Noite",
        contexto: [],
        escolhas: [
          {
            id: "irTelhadosFurtivo",
            texto: "Ir pelos telhados com movimentação furtiva.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para avançar furtivamente pelos telhados.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 9,
                },
                resultados: {
                  sucesso: { proximaCena: "movimentacaoTelhadoNoite" },
                  fracasso: {
                    efeitos: [{ tipo: "danoQueda", requerSistema: "danoQueda" }],
                    proximaCena: "movimentacaoNoite",
                  },
                },
              },
            },
          },
          {
            id: "irTelhadosRapido",
            texto: "Ir pelos telhados com movimentação rápida.",
            proximaCena: "movimentacaoNoite",
          },
          {
            id: "irSombras",
            texto: "Descer e ir pelas sombras.",
            proximaCena: "movimentacaoNoiteFurtiva",
          },
        ],
      },

      torreChao: {
        numeroFonte: 10,
        titulo: "Torre Chão",
        contexto: [],
        escolhas: [
          {
            id: "atravessarRio",
            texto: "Tentar atravessar o rio.",
            requerSistema: "testeComPendenciaFonte",
            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: null,
            },
            pendenciaFonte: "A fonte não informa a CD deste teste de Atletismo.",
            resultados: {
              sucesso: { proximaCena: "fim" },
              fracasso: { proximaCena: "margemRioLongeMolhado" },
            },
          },
        ],
      },

      torreTetoSemGuardas: {
        numeroFonte: 11,
        titulo: "Torre Teto Sem Guardas",
        contexto: [],
        escolhas: [
          {
            id: "barcos",
            texto: "Tentar pular de barco em barco.",
            requerSistema: "sequenciaTresSucessosComTesteOposto",
            progresso: { sucessosNecessarios: 3 },
            testes: [
              {
                tipo: "pericia",
                periciaId: "atletismo",
                dificuldade: 17,
              },
              {
                tipo: "oposto",
                jogador: { tipo: "pericia", periciaId: "furtividade" },
                oponente: {
                  npcId: "guardaConde",
                  tipo: "pericia",
                  periciaId: "percepcao",
                },
              },
            ],
            resultados: {
              tresSucessos: { proximaCena: "fim" },
              qualquerFalha: { proximaCena: "batalha" },
            },
          },
          {
            id: "passarDespercebido",
            texto: "Tentar passar despercebido.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para passar despercebido.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
        ],
      },

      margemRioPonte: {
        numeroFonte: 12,
        titulo: "Margem Rio Ponte",
        contexto: [],
        escolhas: [
          {
            id: "nadar",
            texto: "Tentar atravessar nadando.",
            etapaInicial: "testeAtletismo",
            etapas: {
              testeAtletismo: {
                instrucao: "para atravessar o rio nadando.",
                teste: {
                  tipo: "pericia",
                  periciaId: "atletismo",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "torreChaoMolhado" },
                },
              },
            },
          },
        ],
      },

      torreTetoComGuardas: {
        numeroFonte: 13,
        titulo: "Torre Teto Com Guardas",
        contexto: [],
        escolhas: [
          {
            id: "barcosSobAtaque",
            texto: "Tentar pular de barco em barco.",
            requerSistema: "sequenciaTresSucessosComAtaquesNarrativos",
            progresso: { sucessosNecessarios: 3 },
            testePrincipal: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 17,
            },
            aposCadaSucesso: {
              ataques: 2,
              atacanteNpcId: "guardaConde",
              aoAcertar: {
                teste: {
                  tipo: "salvaguarda",
                  atributoId: "constituicao",
                  dificuldade: 14,
                },
                falha: { proximaCena: "batalha" },
              },
            },
            resultados: {
              tresSucessosSemCair: { proximaCena: "fim" },
              qualquerFalha: { proximaCena: "batalha" },
            },
          },
          {
            id: "passarDespercebido",
            texto: "Tentar passar despercebido.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para passar despercebido.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 20,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
        ],
      },

      torreChaoMolhado: {
        numeroFonte: 14,
        titulo: "Torre Chão Molhado",
        contexto: [],
        escolhas: [
          {
            id: "passarDespercebido",
            texto: "Tentar passar despercebido.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para passar despercebido.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
          { id: "lutar", texto: "Lutar.", proximaCena: "batalha" },
        ],
      },

      margemRioLonge: {
        numeroFonte: 15,
        titulo: "Margem Rio Longe",
        contexto: [],
        escolhas: [
          {
            id: "nadar",
            texto: "Tentar atravessar nadando.",
            etapaInicial: "testeAtletismo",
            etapas: {
              testeAtletismo: {
                instrucao: "para atravessar o rio nadando.",
                teste: {
                  tipo: "pericia",
                  periciaId: "atletismo",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "margemRioLongeMolhado" },
                },
              },
            },
          },
          {
            id: "passarDespercebido",
            texto: "Tentar passar despercebido.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para passar despercebido.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
        ],
      },

      margemRioLongeMolhado: {
        numeroFonte: 16,
        titulo: "Margem Rio Longe Molhado",
        contexto: [],
        escolhas: [
          {
            id: "passarDespercebido",
            texto: "Tentar passar despercebido.",
            etapaInicial: "testeFurtividade",
            etapas: {
              testeFurtividade: {
                instrucao: "para passar despercebido.",
                teste: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "batalha" },
                },
              },
            },
          },
        ],
      },

      movimentacaoTelhadoNoite: {
        numeroFonte: 17,
        titulo: "Movimentação Telhado Noite",
        contexto: [],
        requerSistema: "testeOpostoComModificadorContextual",
        testeInicial: {
          tipo: "oposto",
          jogador: {
            tipo: "pericia",
            periciaId: "furtividade",
            modificadorContextual: 5,
          },
          oponente: {
            npcId: "guardaConde",
            tipo: "pericia",
            periciaId: "percepcao",
          },
        },
        resultadosTesteInicial: {
          sucesso: {
            escolhas: [
              {
                id: "pularTorre",
                texto: "Pular para a torre.",
                teste: {
                  tipo: "pericia",
                  periciaId: "atletismo",
                  dificuldade: 17,
                },
                resultados: {
                  sucesso: { proximaCena: "torreTetoSemGuardas" },
                  fracasso: {
                    efeitos: [{ tipo: "danoQueda", requerSistema: "danoQueda" }],
                    teste: {
                      tipo: "pericia",
                      periciaId: "furtividade",
                      dificuldade: 14,
                    },
                    resultados: {
                      sucesso: { proximaCena: "movimentacaoNoiteFurtiva" },
                      fracasso: { proximaCena: "batalha" },
                    },
                  },
                },
              },
            ],
          },
          fracasso: { proximaCena: "movimentacaoNoite" },
        },
      },

      movimentacaoNoite: {
        numeroFonte: 18,
        titulo: "Movimentação Noite",
        contexto: [],
        escolhas: [
          {
            id: "irTorre",
            texto: "Ir para a torre.",
            requerSistema: "testeOposto",
            teste: {
              tipo: "oposto",
              jogador: { tipo: "pericia", periciaId: "furtividade" },
              oponente: {
                npcId: "guardaConde",
                tipo: "pericia",
                periciaId: "percepcao",
              },
            },
            resultados: {
              sucesso: {
                escolhas: [
                  {
                    id: "nadar",
                    texto: "Tentar atravessar nadando.",
                    teste: {
                      tipo: "pericia",
                      periciaId: "atletismo",
                      dificuldade: 15,
                    },
                    resultados: {
                      sucesso: { proximaCena: "fim" },
                      fracasso: { proximaCena: "margemRioLongeMolhado" },
                    },
                  },
                  {
                    id: "passarDespercebido",
                    texto: "Tentar passar despercebido.",
                    teste: {
                      tipo: "pericia",
                      periciaId: "furtividade",
                      dificuldade: 17,
                    },
                    resultados: {
                      sucesso: { proximaCena: "fim" },
                      fracasso: { proximaCena: "batalha" },
                    },
                  },
                  {
                    id: "barcos",
                    texto: "Tentar pular de barco em barco.",
                    requerSistema: "sequenciaTresSucessosComTesteOposto",
                    progresso: { sucessosNecessarios: 3 },
                    resultados: {
                      tresSucessos: { proximaCena: "fim" },
                      qualquerFalha: { proximaCena: "batalha" },
                    },
                  },
                ],
              },
              fracasso: { proximaCena: "batalha" },
            },
          },
          {
            id: "irPonte",
            texto: "Dar a volta e tentar ir pela ponte.",
            requerSistema: "testeOpostoComModificadorContextual",
            teste: {
              tipo: "oposto",
              jogador: { tipo: "pericia", periciaId: "furtividade" },
              oponente: {
                npcId: "guardaConde",
                tipo: "pericia",
                periciaId: "percepcao",
                modificadorContextual: 3,
              },
            },
            resultados: {
              sucesso: {
                escolhas: [
                  {
                    id: "carroca",
                    texto: "Se esconder em uma das carroças.",
                    teste: {
                      tipo: "atributo",
                      atributoId: "forca",
                      dificuldade: 15,
                    },
                    resultados: {
                      sucesso: { proximaCena: "fim" },
                      fracasso: { proximaCena: "batalha" },
                    },
                  },
                ],
              },
              fracasso: { proximaCena: "batalha" },
            },
          },
        ],
      },

      movimentacaoNoiteFurtiva: {
        numeroFonte: 19,
        titulo: "Movimentação Noite Furtiva",
        contexto: [],
        escolhas: [
          {
            id: "carroca",
            texto: "Se esconder em uma das carroças.",
            requerSistema: "testeDeAtributo",
            teste: {
              tipo: "atributo",
              atributoId: "forca",
              dificuldade: 17,
            },
            resultados: {
              sucesso: { proximaCena: "fim" },
              fracasso: { proximaCena: "batalha" },
            },
          },
          {
            id: "nadar",
            texto: "Descer até a margem do rio e tentar atravessar nadando.",
            etapaInicial: "testeAtletismo",
            etapas: {
              testeAtletismo: {
                instrucao: "para atravessar o rio nadando.",
                teste: {
                  tipo: "pericia",
                  periciaId: "atletismo",
                  dificuldade: 15,
                },
                resultados: {
                  sucesso: { proximaCena: "fim" },
                  fracasso: { proximaCena: "torreChaoMolhado" },
                },
              },
            },
          },
        ],
      },

      fim: {
        numeroFonte: 20,
        titulo: "Fim",
        contexto: [],
        fimAventura: true,
        pendenciaFonte:
          "A fonte identifica a Cena 20 apenas como 'Fim' e não fornece texto narrativo adicional.",
        escolhas: [],
      },

      batalha: {
        titulo: "Batalha",
        cenaTecnica: true,
        contexto: [
          "Você entra em confronto com os guardas que bloqueiam sua fuga.",
        ],
        combate: {
          jogador: {
            posicao: { coluna: 16, linha: 15 },
          },
          inimigos: [
            {
              npcId: "guardaConde",
              quantidade: 2,
              posicoes: [
                { coluna: 24, linha: 13 },
                { coluna: 23, linha: 17 },
              ],
            },
          ],
          resultados: {
            vitoria: {
              contexto: [
                "O último guarda cai, deixando livre o caminho para continuar sua fuga.",
              ],
            },
            derrota: {
              contexto: [
                "Seus ferimentos finalmente cobram seu preço e sua fuga é interrompida.",
              ],
            },
          },
        },
      },

    },

  },

};
