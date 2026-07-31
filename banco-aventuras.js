"use strict";

const bancoAventuras = {
  aFuga: {
    id: "aFuga",
    titulo: "A Fuga",

    descricao:
      "Fuja de uma cidade em conflito enquanto diferentes forças tentam impedir sua passagem.",

    disponivel: true,

    cenaInicial: "inicio",

    cenas: {
      inicio: {
        titulo: "O Começo",

        contexto: [
          "Você está fugindo da cidade onde viveu pelos últimos quatro anos.",

          "Nem em suas previsões mais pessimistas você imaginou que as coisas chegariam a esse ponto. Agora é tarde, e o perigo é grande demais. Depois de tudo que fez, todos que desafiou, chegou a hora de fugir.",

          "De um lado, os guardas do Conde Debminster, cuja autoridade você desafiou ao questionar sobre o alto valor dos impostos e, sem querer, acabou incitando a população a um pequeno levante contra as políticas autoritárias do conde. Do outro, a milícia dos Lagartos de Bronze, que se prontificou a oferecer segurança para a população durante os protestos. No entanto, aparentemente, agora haviam decidido que para tomar para si o poder que seria deixado pela inevitável queda da autoridade local, precisariam tirar você do tabuleiro político.",

          "Tudo aconteceu rápido demais. Lhe colocaram em uma posição que você nunca quis preencher. Agora, carregando os poucos pertences que você consegue em sua mochila, você se encontra esgueirando-se por um beco, olhado pelas sombras uma multidão raivosa. Muitos rostos os quais você conhece. Do outro lado da multidão, a ponte pela qual você precisa passar para escapar da cidade. E em suas duas cabeceiras, grupos de soldados atentos, impedindo qualquer entrada ou saída da cidade.",
        ],

        escolhas: [
          {
            id: "1",
            texto:
              "Tentar atravessar pelos telhados. Uma pilha de caixas empilhadas próximas à parede chama a sua atenção, parecendo oferecer um caminho até o telhado. Com alguma sorte e habilidade, talvez ninguém o veja e você consiga andar pelhos telhado até alcançar uma pequena torre próxima à ponte.",
            etapaInicial: "noTelhado",

            etapas: {
              noTelhado: {
                descricao: [
                  "Apesar de mal empilhadas e sem uma base muito sólida, você calcula que as caixas devem ser fortes o suficiente para conter o seu peso.",
                ],

                instrucao: "Faça um teste de Acrobacia para subir no telhado.",
                teste: { nome: "Acrobacia", dificuldade: 12 },

                resultados: {
                  sucesso: {
                    texto: [
                      "Você consegue subir com certa tranquilidade.",

                      "Agora, do alto do telhado, é possível ver melhor a multidão. Eles marcham em direção ao castelo, onde já é possível ver uma movimentação de soldados. Em breve, haverá conflito, e talvez esse conflito seja uma boa distração para sua fuga.",
                    ],

                    escolhas: [
                      {
                        id: "noTelhadoEsp",
                        texto:
                          "Esperar. Talvez o melhor seja esperar e tentar usar o conflito a seu favor.",
                        proximaCena: "esperaNoTelhado",
                      },

                      {
                        id: "noTelhadoIr",
                        texto:
                          "Continuar. Cada segundo se torna mais perigoso, e nada garante que sua fuga vá se tornar menos perigosa no meio de uma batalha.",
                        proximaEtapa: "movimentoNoTelhado",
                      },
                    ],
                  },

                  fracasso: {
                    texto: [
                      "As caixas não aguentam seu peso, e não parece haver nenhum outro modo de alcançar o telhado. Hora de pensar em outro plano.",
                    ],

                    voltarParaEscolhas: true,
                    removerEscolha: true,
                  },
                },
              },

              movimentoNoTelhado: {
                instrucao: "Faça um teste de Furtividade para avançar sem ser visto.",
                teste: { nome: "Furtividade", dificuldade: 13 },

                resultados: {
                  sucesso: {
                    texto: "Você avança sem ser percebido",
                    proximaEtapa: "saltoFinal",
                  },

                  fracasso: {
                    texto: "Os guardas identificam sua posição.",
                    proximaEtapa: "saltoFinal",
                  },
                },
              },
            },
          },

          {
            id: "2",
            texto:
              "Se misturar na multidão. Correndo o risco de ser reconhecido, você pode tentar seguir o fluxo do protesto e buscar uma alternativa de escapada.",
            proximaCena: "naMultidao",
          },

          {
            id: "3",
            texto:
              "Continuar se esgueirando pelos becos. Você pode continuar nas sombras, caminhando por vielas na busca de um caminho menos direto para sair da cidade, apesar de a chance de ser encontrado por um dos Lagartos de Bronze ser alta.",
            proximaCena: "nosBecos",
          },

          {
            id: "4",
            texto:
              "Enfrentar os guardas de frente. De um jeito ou de outro, tudo acaba aqui e agora. Talvez o seu embate honesto com os guardas o torne menos covarde aos olhos da população que você está deixando para trás. Talvez eles o ajudem, talvez o impeçam de fugir...",
            proximaCena: "batalha",
          },
        ],
      },

      esperaNoTelhado: {
        titulo: "Eespera no telhado",
        contexto: "Você está nos telhados.",

        escolhas: [
          {
            id: "1",
            texto: "Sair correndo pelos telhados o mais rápido possível.",

            teste: {
              nome: "Acrobacia",
              dificuldade: 12,
              instrucao:
                "Faça um teste de Acrobacia. Role 1d20 e adicione seu modificador de Destreza.",
              cenaSucesso: "saltoBemSucedido",
              cenaFracasso: "saltoFracassado",
            },
          },

          {
            id: "2",
            texto:
              "Pular de um telhado para o outro devagar, apenas quando tiver certeza de que não está sendo observado.",
            proximaCena: "multidao",
          },

          {
            id: "3",
            texto: "Manter vigia até a noite.",
            proximaCena: "becos",
          },
        ],
      },

      saltoBemSucedido: {
        titulo: "Salto bem-sucedido",
        contexto:
          "Você salta no último instante e alcança o telhado seguinte. Os perseguidores ficam para trás por alguns segundos.",

        escolhas: [
          {
            id: "1",
            texto: "a fazer.",

            teste: {
              nome: "Acrobacia",
              dificuldade: 12,
              instrucao:
                "Faça um teste de Acrobacia. Role 1d20 e adicione seu modificador de Destreza.",
              cenaSucesso: "saltoBemSucedido",
              cenaFracasso: "saltoFracassado",
            },
          },

          {
            id: "2",
            texto: "a fazer",
            proximaCena: "multidao",
          },

          {
            id: "3",
            texto: "afazer",
            proximaCena: "becos",
          },
        ],
      },

      saltoFracassado: {
        titulo: "Salto bem-sucedido",
        contexto:
          "Você não alcança completamente o outro telhado e se agarra à borda. Os perseguidores estão cada vez mais próximos.",

        escolhas: [
          {
            id: "1",
            texto: "a fazer.",

            teste: {
              nome: "Acrobacia",
              dificuldade: 12,
              instrucao:
                "Faça um teste de Acrobacia. Role 1d20 e adicione seu modificador de Destreza.",
              cenaSucesso: "saltoBemSucedido",
              cenaFracasso: "saltoFracassado",
            },
          },

          {
            id: "2",
            texto: "a fazer",
            proximaCena: "multidao",
          },

          {
            id: "3",
            texto: "afazer",
            proximaCena: "becos",
          },
        ],
      },

      batalha: {
        titulo: "Confronto na ponte",

        contexto: [
          "Você abandona qualquer tentativa de passar despercebido e caminha em direção aos guardas.",

          "Ao perceberem sua aproximação, eles sacam suas armas e bloqueiam o caminho até a ponte.",
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
                "O último guarda cai, deixando livre o caminho até a ponte.",

                "Por alguns instantes, você tem uma oportunidade para continuar sua fuga.",
              ],
            },

            derrota: {
              contexto: [
                "Seus ferimentos finalmente cobram seu preço. Sem forças, você cai diante dos guardas.",

                "Sua fuga termina antes que você consiga alcançar a ponte.",
              ],
            },
          },
        },
      },
    },
  },
};
