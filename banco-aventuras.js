"use strict";

const bancoAventuras = {
  aFuga: {
    id: "aFuga",
    titulo: "A Fuga",

    descricao: `Fuja de uma cidade em conflito enquanto diferentes forças buscam a sua eliminação.`,

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

            descricao: `Saindo das sombras, você atravessa a multidão, caminhando em direção aos guardas na cabeceira da ponte.
            
            "{personagem}!" Você ouve alguém clamando na multidão.
            
            Muitos se voltam para você, enquanto você continua abrindo caminho.
            
            Da cabeceira da ponte, os guardas percebem a comoção, rapidamente sacam suas armas, e correm em sua direção.`,

            proximaCena: "batalhaRuasD",
          },
        ],

        etapas: {
          subirTelhado: {
            descricao: [
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
            descricao: [
              `Você consegue alcançar o telhado. As caixas que usou como suporte cedem debaixo dos seus pés, e você rapidamente se abaixa para não chamar a atenção.

                Do alto, agora você consegue ver mais da multidão se dirigindo até o castelo do Conde. Ao longe, uma fileira de guardas já se posiciona para impedir a passagem. O conflito parece inevitável.

                Você vê também a torre de embarcações próxima à margem do rio. Em teoria, ela lhe concederia acesso fácil a um pequeno cais por onde você poderia buscar uma saída. Chegar à torre pulando pelos telhados parece perfeitamente possível.

                Porém, talvez sua melhor escolha seja esperar. É pouco provável que alguém {o|a} procure no alto das casas, e uma boa oportunidade pode aparecer depois que o conflito se iniciar de fato. Por outro lado, talvez seja melhor se aproveitar da crescente tensão ao redor do conflito iminente e escapar o mais rápido possível, enquanto os guardas estão distraídos.`,
            ],

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
                memorias: { origemMovimentacaoTelhadoRapida: "rotaRapidaTelhado" },
              },
            ],
          },

          movimentacaoFurtiva: {
            descricao: [],

            instrucao: "avançar pelos telhados sem ser {visto|vista}.",

            teste: {
              tipo: "oposto",

              jogador: {
                tipo: "pericia",
                periciaId: "furtividade",
              },

              oponente: {
                npcId: "guardaConde",
                tipo: "pericia",
                periciaId: "percepcao",
              },
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoFurtiva",
              },

              fracasso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoRapida",
                memorias: { origemMovimentacaoTelhadoRapida: "telhadosTorreFalhaFurtiva" },
              },
            },
          },

          /* =========================================================
             RAMO: MULTIDÃO
             ========================================================= */

          misturarMultidao: {
            descricao: [
              `Você sai do beco escuro, cobrindo seu rosto e tomando o máximo de cuidado para esconder suas armas e roupas por baixo de um longo manto preto.`,
            ],

            instrucao: "entrar {escondido|escondida} na multidão.",

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
            descricao: [
              `Caminhando ao lado da multidão, você divide sua atenção entre observar os guardas e procurar por pequenas brechas para conseguir se inserir na massa de pessoas.

              Finalmente, depois de forçar alguns passos, você consegue se misturar e agora se encontra no centro da massa de pessoas.

              O barulho dos gritos e o esmagamento da aglomeração o deixam desnorteado por um momento, mas logo você consegue se recompor, se localizar em meio à balbúrdia e ponderar suas opções.`,
            ],

            escolhas: [
              {
                id: "acompanharPonte",

                texto: `Seguindo o fluxo da multidão, você conseguiria chegar até próximo da cabeceira da ponte pela qual precisa atravessar, apesar de ela estar fortemente vigiada por um grupo de guardas.`,

                descricao: `Sentindo que a multidão começa a se mover mais rapidamente, você consegue forçar sua passagem para o outro lado e rapidamente se joga em direção ao pequeno declive na margem do rio.
                
                Correndo imediatamente para baixo da ponte, você prende a respiração ao tentar ouvir se alguém se aproxima atrás de você.
                
                Nada. Você passou {despercebido|despercebida}.`,

                proximaCena: "margemRioPonte",
              },

              {
                id: "acompanharTorre",

                texto: `Também parece possível acompanhar a multidão até a torre de embarcações próxima à margem do rio. Em dias comuns, ela estaria pouco vigiada e ofereceria acesso a um pequeno cais por onde você poderia buscar uma saída.`,

                descricao: `Você segue o ritmo da multidão por um tempo e percebe que os ânimos começam a se acirrar.
                
                Aqueles que estão melhor armados estão agora tomando a dianteira, e uma certa resistência começa a vir das linhas de frente, indicando que a população finalmente chegou à linha defensiva de guardas.
                
                Você consegue forçar sua passagem pelos últimos metros e então rapidamente se move em direção à torre, cuja base fica em um pequeno declive na margem do rio.`,

                proximaCena: "torreChao",
              },

              {
                id: "distrairGuardas",

                texto: `Agora, no meio da multidão, uma outra ideia surge. Talvez seja possível causar alguma confusão dentro da própria multidão e usá-la de alguma forma para distrair os guardas.`,

                descricao: `Além dos guardas formando a linha defensiva, outros começam a aparecer pelas pequenas ruas laterais, em uma clara tentativa de cercar o motim. Alguns, inclusive, caminham, com olhar apreensivo, do lado da multidão.
                
                Isso lhe dá uma ideia.
                
                Forçando sua passagem para as laterais, você espera um momento oportuno e empurra uma pessoa na direção de um dos guardas, que prontamente empurra a pessoa de volta.
                
                O caos se instaura rapidamente. Guardas avançam pelas laterais enquanto você corre na direção oposta.
                
                Com eles distraídos, agora você tem uma chance.`,

                memorias: { origemGuardasDistraidos: "multidao" },

                proximaCena: "guardasDistraidos",
              },
            ],
          },

          reagirNaMultidao: {
            descricao: [
              `Você se força para dentro da multidão, sendo obrigado a empurrar as pessoas para abrir caminho.

              Agora que você está de fato {inserido|inserida} no coração do levante, a fúria da população é quase palpável. Muitos estão mais armados do que você imaginava inicialmente. Armas essas, muito provavelmente, ofertadas pelos Lagartos.

              Você sente uma mão em seu ombro, {puxando-o|puxando-a} para trás. {Aterrorizado|Aterrorizada}, você se vira.

              "{personagem}?" Diz um rosto que o susto {o|a} impede inicialmente de reconhecer. "Por que está {vestido|vestida} assim?" Ele pergunta com certo divertimento na voz.

              Uma torrente de alívio {o|a} percorre ao reconhecer o dono da voz. É Ned, um velho conhecido que, após se unir às revoltas, se tornou um grande aliado.

              Você sorri, mas percebe que ele não está sorrindo de volta. {Olhando-o|Olhando-a} dos pés à cabeça, ele parece lentamente perceber o que está acontecendo. Ao encontrar seu olhar, você vê incredulidade e uma pontada de decepção.

              "Você está fugindo?"

              O que você faz?`,
            ],

            escolhas: [
              {
                id: "pedirAjuda",
                texto: `Pedir a ajuda de Ned.

                Ele sempre soube que você nunca se viu como liderança e nunca quis um conflito aberto. Se você se explicar, ele vai entender os motivos da sua fuga.`,
                proximaEtapa: "pedirAjudaMultidao",
              },

              {
                id: "sairCorrendo",
                texto: `Desvencilha-se de Ned e foge.

                Não há tempo para explicações. Só lhe resta agora tentar despistar Ned pela multidão e se esconder em algum beco próximo.`,
                proximaEtapa: "sairCorrendoMultidao",
              },
            ],
          },

          pedirAjudaMultidao: {
            descricao: [
              `Você puxa Ned pelo colarinho e o aproxima de si. Ele força os pés no chão e oferece resistência ao seu puxão, tentando fazer com que você o solte.
              
              Você segura firme e sussurra suas explicações desesperadamente. Algumas pessoas ao redor estão começando a olhar, intrigadas.`,
            ],

            instrucao: "convencer Ned.",

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

              fracasso: {
                texto: `Ele finalmente consegue se soltar e se afasta alguns passos, seu olhar se tornando cada vez mais frio.
                
                Você ouve seu nome sendo sussurrado vindo de outra direção e encontra um olhar de reconhecimento de um aldeão que passa próximo de Ned.
                
                Logo você vai chamar a atenção da multidão. Sua única saída agora é sair dali o mais rápido possível.`,
                proximaEtapa: "sairCorrendoMultidao",
              },
            },
          },

          decidirPedidoAjuda: {
            descricao: [
              `Conforme você se explica, sente a resistência de Ned diminuir. Por fim, ele repousa a mão em seu ombro e começa a caminhar devagar, forçando você a fazer o mesmo, para que não chamem a atenção.
              
              Ao fim do seu discurso, ele se aproxima e pergunta, com urgência na voz.
              
              "Do que você precisa?"`,
            ],

            escolhas: [
              {
                id: "pedirDistracao",
                texto: `"Me ajude a distrair os guardas da ponte."
                
                Uma distração pode ser tudo que você precisa para conseguir passar pela ponte sem ser {visto|vista}.`,

                descricao: `"Pode contar comigo." Ele responde incisivo.
                
                "Vá para perto da ponte e me espere. Eu vou chamar alguns amigos para ajudar."
                
                Rapidamente ele se afasta, caminhando em outra direção. Você segue a multidão e, ao se aproximar da ponte, força sua saída e se esconde em uma esquina próxima, entre caixas e barris.`,

                memorias: { origemGuardasDistraidos: "ned" },

                proximaCena: "guardasDistraidos",
              },

              {
                id: "perguntarSaida",
                texto: `"Você conhece alguma outra saída da cidade?"
                
                Tentar atravessar a ponte é arriscado demais. Talvez Ned conheça uma saída menos exposta.`,
                proximaEtapa: "perguntarOutraSaida",
              },
            ],
          },

          perguntarOutraSaida: {
            descricao: [
              `Ainda caminhando ao seu lado, o olhar de Ned lentamente se desvia ao chão enquanto ele pensa.
              
              Após alguns segundos, ele volta a olhar para cima e muda repentinamente de direção, novamente forçando você a caminhar com ele.
              
              "Não tenho certeza, mas sei onde pode ter uma possível saída." Ele responde em voz baixa, olhando ao redor.
              
              Você o acompanha até a entrada de uma pequena viela escura, pela qual vocês entram rapidamente.
              
              "No final dessa rua e seguindo pela esquerda..." Ele fala, indicando com uma das mãos. "Você vai chegar em território dos Lagartos, onde eu já ouvi dizer várias vezes que tem uma saída semi-escondida."
              
              Você se vira na direção para a qual Ned aponta, já pensando em como seguir em frente.
              
              "Tome cuidado." Ele continua, fazendo você se virar para ele. "Você sabe que eles estão atrás de você."
              
              "Procure um jeito de dar notícias. Vamos deixar a cidade segura para a sua volta" Ele diz sorrindo.
              
              Você sorri de volta, e, com uma pontada de culpa, dispara na direção indicada por ele.`,
            ],

            teste: {
              tipo: "npc",
              npcId: "ned",

              teste: {
                tipo: "pericia",
                periciaId: "historia",
              },

              dificuldade: 12,
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "becosOpostos",
              },

              fracasso: {
                texto: ``,
                proximaCena: "becosLagartos",
              },
            },
          },

          sairCorrendoMultidao: {
            descricao: `Você se esforça para correr pela multidão, forçando a passagem e esbarrando pelas pessoas no seu caminho, causando um pequeno alvoroço no processo.
            
            Além de ser difícil manter a velocidade enquanto esbarra nas pessoas, você percebe que está chamando a atenção de alguns dos guardas.
            
            O nervosismo se prova maior do que seu foco, fazendo você tropeçar e perder completamente o equilíbrio.`,

            instrucao: "manter o equilíbrio e continuar correndo.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: `Você consegue se recompor em meio ao caos e recuperar seu equilíbrio.
                
                Abrindo caminho entre a multidão, você se dirige rapidamente a uma rua próxima.
                
                Para seu espanto, um grupo de guardas vem correndo do outro lado do beco. Antes que eles {o|a} percebam, você entra em um pequeno beco à sua direita.
                
                Das sombras, você vê os guardas passarem por você, correndo em direção à multidão, e agora recalcula sua rota de como escapar da cidade.
                
                Sua melhor opção no momento, apesar de perigosa, é buscar a saída pelos becos atrás do castelo, como você havia cogitado antes.`,

                proximaCena: "becosLagartos",
              },

              fracasso: {
                texto: `Incapaz de se localizar em meio ao caos e reencontrar seu equilíbrio, você vai ao chão.
                
                Enquanto se levanta, um círculo de pessoas se afastando se forma ao seu redor.
                
                "É {personagem}!" Você ouve alguém gritando.

                Antes que pudesse pensar em voltar a correr, dois guardas já caminham em sua direção. Um deles com uma flecha já armada no arco, apontando para você; outro desembainhando a espada.
                
                Não há escapatória, você precisa lutar.`,

                proximaCena: "batalhaRuasF",
              },
            },
          },

          /* =========================================================
             RAMO: BECOS
             ========================================================= */

          investigarBecos: {
            descricao: `Você vira as costas para a multidão e começa a caminhar pelos becos.
            
            Manter-se {escondido|escondida} nas vielas é sua prioridade, atravessando as ruas maiores apenas quando estritamente necessário e com a certeza de que ninguém está próximo.
            
            Enquanto caminha, você tenta se lembrar de mais detalhes dos rumores para ter certeza de qual caminho seguir.`,

            teste: {
              tipo: "periciaEscolha",
              periciasIds: ["historia", "sobrevivencia"],
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

      esperaNoTelhado: {
        numeroFonte: 2,

        contexto: [
          `Deitado de bruços no telhado, você observa a movimentação por um tempo.
          
          A multidão finalmente entra em choque com a linha de guardas, que a impede de seguir em direção ao castelo. A cada segundo os ânimos se acirram mais, e já é possível ouvir o choque de espadas e ver a poeira levantada pela luta.
          
          O conflito começou, mas, para sua decepção, os guardas da ponte se mantêm firmes em suas posições.
          
          A torre permanece sendo uma opção viável, mas, agora que o conflito de fato começou, talvez se aproveitar do caos e se aproximar dele ofereça outra oportunidade de passar {despercebido|despercebida}.`,
        ],

        escolhas: [
          {
            id: "telhadoAteNoite",

            texto: `Apesar do risco de ser {encontrado|encontrada}, talvez a melhor opção seja permanecer {escondido|escondida} até a noite, em que você terá as sombras como proteção.`,

            proximaCena: "telhadosNoite",
          },

          {
            id: "irConflito",

            texto: `Agora que o conflito de fato se iniciou, quem sabe se aproximar dele possa revelar alguma outra oportunidade de sair da cidade.
            
            Talvez se aproximar mais seja uma boa ideia.`,

            proximaEtapa: "decidirIrConflito",
          },

          {
            id: "irTorre",

            texto: `Você já esperou o suficiente. Melhor se mover agora em direção à torre.`,

            proximaEtapa: "escolherRotaTelhado",
          },
        ],

        etapas: {
          decidirIrConflito: {
            descricao: [
              `Há duas rotas possíveis até o conflito.
              
              Uma mais direta, porém mais exposta, seguindo por telhados que estão quase paralelos às ruas.
              
              A outra dá a volta pelas ruas, fazendo com que você chegasse ao conflito pela parte de trás, mais próximo dos guardas, e bem mais {escondido|escondida}.
              
              Qual rota você escolhe?`,
            ],

            escolhas: [
              {
                id: "irConflitoFurtivo",
                texto: `A mais escondida.`,
                proximaEtapa: "irConflitoFurtivoTeste",
              },

              {
                id: "irConflitoRapido",
                texto: `A mais direta.`,
                proximaCena: "movimentacaoTelhadoRapida",
                memorias: { origemMovimentacaoTelhadoRapida: "irConflitoRapido" },
              },
            ],
          },

          irConflitoFurtivoTeste: {
            instrucao: "se aproximar do conflito sem ser {visto|vista}.",

            teste: {
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 14,
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoFurtiva",
                memorias: { origemMovimentacaoFurtiva: "conflitoFurtivo" },
              },

              fracasso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoRapida",
                memorias: { origemMovimentacaoTelhadoRapida: "conflitoFalhaFurtiva" },
              },
            },
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
                memorias: { origemMovimentacaoTelhadoRapida: "rotaRapidaEspera" },
              },
            ],
          },

          movimentacaoFurtiva: {
            descricao: [],

            instrucao: "avançar pelos telhados sem ser {visto|vista}.",

            teste: {
              tipo: "oposto",

              jogador: {
                tipo: "pericia",
                periciaId: "furtividade",
              },

              oponente: {
                npcId: "guardaConde",
                tipo: "pericia",
                periciaId: "percepcao",
              },
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoFurtiva",
              },

              fracasso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoRapida",
                memorias: { origemMovimentacaoTelhadoRapida: "esperaTorreFalhaFurtiva" },
              },
            },
          },
        },
      },

      guardasDistraidos: {
        numeroFonte: 5,

        variacoes: [
          {
            se: {
              flag: "origemGuardasDistraidos",
              igualA: "multidao",
            },

            contexto: [
              `Vendo a comoção, os dois guardas na ponte saem do posto e correm em direção ao conflito.

              Essa é a sua chance.`,
            ],
          },

          {
            se: {
              flag: "origemGuardasDistraidos",
              igualA: "ned",
            },

            contexto: [
              `Você observa os arredores com nervosismo, esperando algum sinal de Ned. Poucos minutos depois, ele surge do meio da multidão, acompanhado por outros três homens armados.

              Eles se aproximam dos dois guardas na ponte e começam alguma discussão, a qual você não consegue ouvir direito. Mais guardas se aproximam, os ânimos se exaltam, e uma pequena confusão começa.

              Essa é a sua oportunidade.`,
            ],
          },
        ],

        contexto: [
          `Com os guardas agora distraídos, você identifica duas possíveis rotas.

          A primeira delas envolve tentar passar {despercebido|despercebida} pela ponte. Você ainda vai precisar lidar com os outros dois guardas do outro lado da ponte, mas talvez você tenha tempo o suficiente antes que eles recebam reforços.

          A outra possibilidade é tentar atravessar pelo rio. Isso lhe daria uma chance de tentar passar {despercebido|despercebida} pelos guardas do outro lado.`,

          {
            se: {
              desvantagemNadoAguasRevoltas: true,
            },

            texto: `Nadar nas águas revoltas do rio com sua armadura vai ser um desafio, mas ainda assim menos perigoso do que atravessar a ponte.`,
          },

          `Qual você considera a melhor opção?`,
        ],

        escolhas: [
          {
            id: "atravessarPonteFurtivo",
            texto: `Passar {escondido|escondida} pela ponte.`,
            etapaInicial: "atravessarPonteFurtivo",
          },

          {
            id: "atravessarRio",
            texto: `Atravessar o rio.`,
            etapaInicial: "atravessarRio",
          },
        ],

        etapas: {
          atravessarPonteFurtivo: {
            descricao: [],
            instrucao: "passar {escondido|escondida} pela ponte.",

            teste: {
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "batalhaPonteF",
              },

              fracasso: {
                texto: ``,
                proximaCena: "batalhaPonteD",
              },
            },
          },

          atravessarRio: {
            descricao: [],
            instrucao: "atravessar o rio em águas revoltas.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              situacao: "nadarAguasRevoltas",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "torreChaoMolhado",
              },

              fracasso: {
                texto: ``,
                memorias: {
                  origemTorreChaoMolhado: "guardasDistraidos",
                },
                proximaCena: "torreChaoMolhado",
              },
            },
          },
        },
      },

      movimentacaoTelhadoFurtiva: {
        numeroFonte: 3,
        contexto: [
          `Você pula de telhado em telhado, sempre buscando uma linha de cobertura antes de qualquer movimento.
          
          Guardas se aproximam por todos os lados, atraídos pelo conflito central que, pelo som de espadas se chocando e pela nuvem de poeira que agora se ergue ao longe, havia finalmente começado.
          
          Alcançando o telhado mais próximo possível da torre, você sente um calafrio ao perceber que a distância é muito maior do que você imaginava inicialmente. O pulo ainda parece possível, mas bem mais perigoso.
          
          Você tenta o pulo ou desce dos telhados e tenta buscar por uma rota até a torre pelo chão?`,
        ],

        escolhas: [
          {
            id: "pularTorre",

            texto: `Tentar pular até a torre.`,

            proximaEtapa: "pularAteTorre",
          },

          {
            id: "irChao",

            texto: `Descer e buscar uma rota pelo chão.`,

            proximaCena: "torreChao",
            memorias: { origemTorreChao: "chaoSemDano" },
          },
        ],

        etapas: {
          pularAteTorre: {
            descricao: [
              `Pode ser arriscado tentar o pulo, mas ainda assim é menos arriscado do que se expor pelas ruas tão próximo do conflito.
              
              Você dá alguns passos para trás, aproveitando ao máximo o pequeno espaço que o telhado oferece.
              
              Então respira fundo e parte em disparada à torre, usando toda sua força para realizar o salto no último momento possível.`,
            ],

            instrucao: "pular para a torre.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 16,
            },

            resultados: {
              sucesso: {
                texto: `VER SE PRECISA`,
                proximaCena: "torreTetoSemGuardas",
              },

              fracasso: {
                texto: `Ainda no alto, você percebe com desespero que não vai alcançar a torre. Você não calculou bem a distância e precisou diminuir a velocidade, perdendo potência no pulo.
                
                Você estica os braços em uma tentativa pífia de se agarrar a alguma parte da torre, mas sem sucesso. O choque com a torre tira completamente o seu fôlego enquanto você vai ao chão, caindo entre caixas e ferramentas.`,
                proximaEtapa: "fracassoPulo",
                queda: {
                  distanciaMetros: 3,
                },
              },
            },
          },

          fracassoPulo: {
            descricao: [
              `{Dolorido|Dolorida}, você começa a se levantar em meio aos escombros e congela ao ouvir uma voz próxima.
              
              "Eu acho que o barulho veio daqui. Rápido!"
              
              Para sua sorte, a base da torre está agora a uma pequena distância e, entre você e ela, uma carruagem coberta, que pode ser um bom esconderijo.
              
              Movendo-se o mais rápido possível, mas tomando cuidado para não fazer muito barulho, você se levanta e corre em direção à carruagem.`,
            ],

            instrucao: "se esconder na carruagem.",

            teste: {
              tipo: "periciaEscolha",
              periciasIds: ["furtividade", "sobrevivencia"],
              dificuldade: 14,
            },

            resultados: {
              sucesso: {
                texto: ``,
                proximaCena: "torreChao",
                memorias: { origemTorreChao: "chaoComDano" },
              },

              fracasso: {
                texto: ``,
                proximaCena: "becosOpostos",
                memorias: { origemBecosOpostos: "chaoComDano" },
              },
            },
          },
        },
      },

      movimentacaoTelhadoRapida: {
        numeroFonte: 4,

        variacoes: [
          {
            se: {
              flag: "origemMovimentacaoTelhadoRapida",
              igualA: "telhadosTorreFalhaFurtiva",
            },

            contexto: [
              `Você se desloca pelos telhados com paciência, esperando a oportunidade certa, e sempre tendo a certeza de qual será sua próxima cobertura.
              
              Mas você comete um erro, calculando mal a distância de um dos pulos e sendo {obrigado|obrigada} a se apoiar em um pequeno andaime de madeira contendo alguns materiais de construção. Uma pequena pilha de tijolos desaba, e alguns vão ao chão.
              
              O barulho que se segue indica que os tijolos caíram em algum tipo de vaso de cerâmica. E, antes que você pudesse reagir, um grupo de três guardas, passando pela entrada da rua, se volta para trás, um deles percebendo você imediatamente.
              
              Durante dois segundos, vocês se encaram.
              
              "Ei!" Ele finalmente grita, puxando um arco.
              
              Você dispara pelos telhados. Correndo o mais rápido possível em direção à torre.`,
            ],
          },

          {
            se: {
              flag: "origemMovimentacaoTelhadoRapida",
              igualA: "esperaTorreFalhaFurtiva",
            },

            contexto: [
              `Você se desloca pelos telhados com paciência, esperando a oportunidade certa, e sempre tendo a certeza de qual será sua próxima cobertura.
              
              Mas você comete um erro, calculando mal a distância de um dos pulos e sendo {obrigado|obrigada} a se apoiar em um pequeno andaime de madeira contendo alguns materiais de construção. Uma pequena pilha de tijolos desaba, e alguns vão ao chão.
              
              O barulho que se segue indica que os tijolos caíram em algum tipo de vaso de cerâmica. E, antes que você pudesse reagir, um grupo de três guardas, passando pela entrada da rua, se volta para trás, um deles percebendo você imediatamente.
              
              Durante dois segundos, vocês se encaram.
              
              "Ei!" Ele finalmente grita, puxando um arco.
              
              Você dispara pelos telhados. Continuar em direção ao conflito agora é perigoso demais, e você parte o mais rápido possível em direção à torre.`,
            ],
          },

          {
            se: {
              flag: "origemMovimentacaoTelhadoRapida",
              igualA: "rotaRapidaEspera",
            },

            contexto: [
              `Você pula entre os telhados assim que encontra uma abertura, contando que a atenção dos guardas vai estar voltada para a multidão, em vez de para o alto.
              
              Mas então, o pior acontece.
              
              "Ei!" Você ouve uma voz gritando conforme você pula de um telhado para outro. "Pare já!"
              
              Você olha para trás a tempo de desviar de uma flecha atirada em sua direção.
              
              Do chão, um grupo de três guardas agora o observa e corre em sua direção, dois deles já armando outras duas flechas.
              
              Continuar em direção ao conflito agora se tornou perigoso demais. Você parte em disparada para a torre o mais rápido possível.`,
            ],
          },

          {
            se: {
              flag: "origemMovimentacaoTelhadoRapida",
              igualA: "rotaRapidaTelhado",
            },

            contexto: [
              `Você pula entre os telhados assim que encontra uma abertura, contando que a atenção dos guardas vai estar voltada para a multidão, em vez de para o alto.
              
              Mas então, o pior acontece.
              
              "Ei!" Você ouve uma voz gritando conforme você pula de um telhado para outro. "Pare já!"
              
              Você olha para trás a tempo de desviar de uma flecha atirada em sua direção.
              
              Do chão, um grupo de três guardas agora o observa e corre em sua direção, dois deles já armando outras duas flechas.
              
              Você parte em disparada para a torre o mais rápido possível.`,
            ],
          },
        ],

        contexto: [``],

        escolhas: [],

        etapaInicial: "primeiroDisparo",

        etapas: {
          primeiroDisparo: {
            descricao: [
              `Às suas costas, você continua ouvindo os guardas e os aterrorizadores silvos das flechas sendo lançadas em sua direção.`,
            ],

            ataqueNpc: {
              npcId: "guardaConde",
              ataqueId: "bestaLeve",

              resultados: {
                erro: {
                  texto: `Uma delas passa a centímetros do seu corpo conforme você faz uma repentina mudança de rota para a direita.`,
                  proximaEtapa: "segundoDisparo",
                },

                acerto: {
                  texto: `Basta um momento de hesitação entre um pulo particularmente difícil entre telhados para que uma delas atinja diretamente seu ombro esquerdo.`,
                  proximaEtapa: "impactoPrimeiroDisparo",
                },
              },
            },
          },

          impactoPrimeiroDisparo: {
            descricao: [
              `O impacto da flecha {o|a} pega {desprevenido|desprevenida} e joga você para frente.`,
            ],

            instrucao: "se manter de pé após o impacto.",

            teste: {
              tipo: "salvaguarda",
              atributoId: "constituicao",
              dificuldade: 12,
            },

            resultados: {
              sucesso: {
                texto: `Apesar da dor e do impacto, você consegue manter o foco e continuar correndo, mesmo se vendo {forçado|forçada} a mudar de rota para evitar os guardas.`,
                proximaEtapa: "segundoDisparo",
              },

              fracasso: {
                texto: `Você perde completamente o equilíbrio e cai, mas consegue se virar e se segurar no telhado no último momento.`,
                proximaEtapa: "testeQueda",
              },
            },
          },

          segundoDisparo: {
            descricao: [
              `A sua mudança de rota parece ter despistado os guardas momentaneamente, e você finalmente consegue chegar à torre.
              
              Porém, um calafrio sobe pela sua espinha ao perceber que a distância do pulo é muito maior do que você imaginava inicialmente. O pulo ainda parece possível, mas bem mais perigoso.`,
            ],

            ataqueNpc: {
              npcId: "guardaConde",
              ataqueId: "bestaLeve",
              dano: {
                substituirModificador: -3,
                minimo: 1,
              },

              resultados: {
                erro: {
                  texto: `Outra flecha passa voando acima da sua cabeça. Ao longe, os guardas que o perseguiam agora correm em sua direção.
                  
                  Se você se mover agora, ainda tem tempo de descer do telhado e tentar despistar os guardas pelas ruas.`,
                  proximaEtapa: "pularAteTorreFlechaEscolha",
                },

                acerto: {
                  texto: `
                  Outra flecha o atinge de raspão na coxa. Você contém um grito de dor, e, olhando na direção de onde veio a flecha, vê os guardas correndo em sua direção.
                  
                  Se você se mover agora, ainda tem tempo de descer do telhado e tentar despistar os guardas pelas ruas.`,
                  proximaEtapa: "pularAteTorreFlechaEscolha",
                },
              },
            },
          },

          testeQueda: {
            descricao: `Com os guardas agora perigosamente próximos, você junta toda a sua força para tentar se puxar de volta para o telhado.`,

            instrucao: "voltar para o telhado.",

            teste: {
              tipo: "atributo",
              atributoId: "forca",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Você consegue se erguer de volta ao telhado, os músculos do seu braço tremendo com o esforço.
                
                Outra flecha quase o atinge, fazendo você perceber que não há tempo nem para recuperar o fôlego.
                
                Você sai em disparada novamente, mudando a rota para tentar despistar os guardas.`,
                proximaEtapa: "segundoDisparo",
              },

              fracasso: {
                texto: `Os músculos do seu braço tremem enquanto você se força para cima, mas sua força não é suficiente.
                
                Você vai ao chão e se prepara para a inevitável batalha contra os guardas que {o|a} perseguem.`,
                proximaCena: "batalhaRuasM",
              },
            },
          },

          pularAteTorreFlechaEscolha: {
            descricao: [
              `Você tenta o pulo ou desce dos telhados e tenta buscar por uma rota até a torre pelo chão?`,
            ],

            escolhas: [
              {
                id: "pularTorre",

                texto: `Tentar pular até a torre.`,

                proximaEtapa: "pularAteTorreFlechada",
              },

              {
                id: "irChao",

                texto: `Descer e buscar uma rota pelo chão.`,

                proximaCena: "torreChao",
                memorias: { origemTorreChao: "flechada" },
              },
            ],
          },

          pularAteTorreFlechada: {
            descricao: [],

            instrucao: "pular para a torre.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 16,
            },

            resultados: {
              sucesso: {
                texto: `VER SE PRECISA`,
                proximaCena: "torreTetoComGuardas",
              },

              fracasso: {
                texto: `Ainda no alto, você percebe com desespero que não vai alcançar a torre. Você não calculou bem a distância e precisou diminuir a velocidade, perdendo potência no pulo.
                
                Você estica os braços em uma tentativa pífia de se agarrar a alguma parte da torre, mas sem sucesso. O choque com a torre tira completamente o seu fôlego enquanto você vai ao chão, caindo entre caixas e ferramentas.`,
                proximaCena: "batalha2torre",
                queda: {
                  distanciaMetros: 3,
                },
              },
            },
          },
        },
      },

      batalhaRuasD: {
        contexto: [
          `Os guardas avançam sobre você pelas ruas próximas à ponte. Não há mais como evitar o confronto.`,
        ],

        combate: {
          dificuldadePretendida: "alta",
          mapa: "Imagens/Mapas/A Fuga/batalha1ruas.webp",

          jogador: {
            posicao: {
              coluna: 22,
              linha: 14,
            },

            movimentoMaximo: 6,
          },

          inimigos: [
            {
              npcId: "guardaConde",

              quantidade: 4,

              posicoes: [
                {
                  coluna: 23,
                  linha: 5,
                },
                {
                  coluna: 22,
                  linha: 10,
                },

                {
                  coluna: 27,
                  linha: 10,
                },
                {
                  coluna: 25,
                  linha: 3,
                },
              ],

              movimentoMaximo: 6,
            },
          ],

                    resultados: {
            vitoria: {
              tela: {
                titulo: "Vitória",

                texto: `Os guardas tombam diante de você. Por alguns instantes, a rua está livre e a multidão observa em silêncio.`,
              },

              proximaCena:
                "batalhaRuasDVitoria",
            },

            derrota: {
              tela: {
                titulo: "Derrota",

                texto: `Suas forças chegam ao fim. Cercado pelos guardas, você já não consegue continuar lutando.`,
              },

              proximaCena:
                "batalhaRuasDDerrota",
            },
          },
        },
      },

      batalhaRuasDVitoria: {
        numeroFonte: null,

        contexto: [
          `Por alguns instantes, ninguém se move.

          Os guardas estão caídos na rua, e os olhares da multidão se voltam para você. O choque inicial logo dá lugar a murmúrios, gritos e uma agitação crescente.

          Permanecer ali seria perigoso. Outros soldados certamente virão quando souberem o que aconteceu.

          Você precisa aproveitar os poucos instantes conquistados pela vitória e decidir como continuará sua fuga.`,
        ],

                escolhas: [
          {
            id: "concluirAventuraVitoriaRuas",

            texto: `Concluir A Fuga.`,

            registrarNarrativa: false,

            fimAventura: {
              resultadoId: "vitoria",
              rotulo: "A Fuga",

              titulo:
                "A liberdade tem um preço",

              texto:
                `Você conquistou sua liberdade pela força. Os guardas foram derrotados, mas os acontecimentos nas ruas certamente não serão esquecidos.`,

              resultado: "Vitória",
            },
          },
        ],
      },

      batalhaRuasDDerrota: {
        numeroFonte: null,

        contexto: [
          `Sua visão se torna turva enquanto suas forças abandonam seu corpo.

          As vozes dos guardas parecem cada vez mais distantes. Você sente suas armas sendo retiradas e seus braços sendo presos antes de perder completamente a consciência.

          Quando voltar a despertar, sua fuga terá tomado um rumo muito diferente.`,
        ],

                escolhas: [
          {
            id: "concluirAventuraDerrotaRuas",

            texto: `Concluir A Fuga.`,

            registrarNarrativa: false,

            fimAventura: {
              resultadoId: "derrota",
              rotulo: "A Fuga",

              titulo:
                "A fuga chega ao fim",

              texto:
                `Sua tentativa de escapar termina nas ruas da cidade. Desarmado e capturado pelos guardas, seu destino volta a estar nas mãos do conde.`,

              resultado: "Derrota",
            },
          },
        ],
      },
    },
  },
};
