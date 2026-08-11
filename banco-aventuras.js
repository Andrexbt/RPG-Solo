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

        descricao: [
          `Você está fugindo da cidade onde viveu pelos últimos dois anos.

          Nem em suas previsões mais pessimistas você imaginou que as coisas chegariam a esse ponto. Agora é tarde, e o perigo é grande demais. Depois de tudo que fez, todos que desafiou, chegou a hora de fugir.
          
          De um lado, os guardas do Conde Debminster, cuja autoridade você desafiou ao questionar sobre o alto valor dos impostos, incitando a população a um pequeno levante contra as políticas autoritárias do conde. Rapidamente, tanto a população quanto o Conde passaram a ver em você uma figura de liderança que você nunca pretendeu ser.
          
          Do outro, a milícia dos Lagartos de Bronze. Inicialmente, a milícia havia se unido à causa e se prontificado a oferecer segurança para a população durante os protestos. Agora, havia decidido que, para tomar para si o poder que seria deixado pela inevitável queda da autoridade local, precisariam tirar você do tabuleiro político.
          
          Tudo aconteceu rápido demais. Agora, carregando os poucos pertences que consegue em sua mochila, você se encontra esgueirando-se por um beco, olhando pelas sombras uma multidão raivosa, se preparando para o confronto derradeiro contra a guarda real.
          
          Do outro lado da multidão, a ponte pela qual você precisa passar para escapar da cidade. Em suas duas cabeceiras, grupos de soldados atentos, impedindo qualquer entrada ou saída da cidade.`,
        ],

        escolhas: [

          {
            id: "telhado",

            texto: `Subir para o telhado.
            Uma pilha de caixas empilhadas próximas à parede chama a sua atenção, parecendo oferecer um caminho até o telhado de um casebre próximo.`,

            etapaInicial: "subirTelhado",

            etapas: {

              subirTelhado: {

                texto: [
                  `Apesar de mal empilhadas e sem uma base muito sólida, você calcula que as caixas devem ser fortes o suficiente para conter o seu peso.`,
                ],

                instrucao: "subir no telhado.",

                teste: {
                  tipo: "pericia",
                  periciaId: "acrobacia",
                  dificuldade: 12,
                },

                resultados: {

                  sucesso: {

                    texto: `Você consegue alcançar o telhado. As caixas que usou como suporte cedem debaixo dos seus pés, e você rapidamente se abaixa para não chamar a atenção.

                    Do alto, agora você consegue ver mais da multidão se dirigindo até o castelo do Conde. Ao longe, uma fileira de guardas já se posiciona para impedir a passagem. O conflito parece inevitável.
                    Você vê também a torre de embarcações próxima à margem do rio. Em teoria, ela lhe concederia acesso fácil a um pequeno cais por onde você poderia buscar uma saída. Chegar à torre pulando pelos telhados parece perfeitamente possível.
                    
                    Porém, talvez sua melhor escolha seja esperar. É pouco provável que alguém {o|a} procure no alto das casas, e uma boa oportunidade pode aparecer depois que o conflito se iniciar de fato. Por outro lado, talvez seja melhor se aproveitar da crescente tensão ao redor do conflito iminente e escapar o mais rápido possível, enquanto os guardas estão distraídos.`,

                      escolhas: [

                      {
                        id: "esperar",

                        texto: `Esperar parece ser a opção mais segura.`,

                        proximaCena: "esperaNoTelhado",

                      },

                      {
                        id: "ir",

                        texto: `Cada segundo de espera é um risco em potencial. Melhor se mover agora em direção à torre.`,

                          escolhas: [

                            id: "movimentacaoTelhado",

                            texto: `Você decide se mover e considera suas opções de caminho até a torre.

                            Uma das rotas parece ser muito mais rápida, mas também mais perigosa. Sem muita cobertura disponível, você precisaria contar com a sorte para não ser visto/a.

                            A outra rota dá a volta nos casebres e chega em um ponto um pouco mais baixo por trás da torre. Pode demorar mais e ser mais difícil, mas, com um pouco de habilidade e paciência, é possível, e potencialmente mais seguro.

                            Qual rota você vai escolher?`,

                            {

                            id: "irFurtivo",

                            texto: "A rota mais segura.",

                            proximaEtapa: "movimentacaoFurtiva",

                            },

                            {

                            id: "irRapido",

                            texto: "A rota mais rápida.",

                            proximaCena: "movimentacaoTelhadoRapida",

                            },

                          ],

                      },

                    ],

                  },

                  fracasso: {

                    texto: `As caixas não aguentam seu peso a tempo de alcançar o telhado. Hora de pensar em um plano B.`,

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

            texto: `Se misturar na multidão.
            Apesar de conhecer muitos dos rostos na multidão, talvez você consiga se misturar e passar despercebido.`,

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
            texto: `Continuar pelos becos.
            Melhor permanecer nas sombras e tentar encontrar uma saída da cidade investigando as vielas.`,
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
            texto:
              `Enfrentar os guardas.
              Você decide se aproveitar da confusão e tentar enfrentar os guardas de frente. De um jeito ou de outro, isso acaba agora.`,
            proximaCena: "batalha",
          },

        ],

      },
      
    },

  },

};
