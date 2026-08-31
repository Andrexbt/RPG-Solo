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
                texto: `Ainda caminhando ao seu lado, o olhar de Ned lentamente se desvia ao chão enquanto ele pensa.

Após alguns segundos, ele volta a olhar para cima e muda repentinamente de direção, novamente forçando você a caminhar com ele.

"Não tenho certeza, mas sei onde pode ter uma possível saída." Ele responde em voz baixa, olhando ao redor.

Você o acompanha até a entrada de uma pequena viela escura, pela qual vocês entram rapidamente.

"No final dessa rua e seguindo pela esquerda..." Ele fala, indicando com uma das mãos. "Você vai chegar em território dos Lagartos, onde eu já ouvi dizer várias vezes que tem uma saída semi-escondida."

Você se vira na direção para a qual Ned aponta, já pensando em como seguir em frente.

"Tome cuidado." Ele continua, fazendo você se virar para ele. "Você sabe que eles estão atrás de você."

"Procure um jeito de dar notícias. Vamos deixar a cidade segura para a sua volta" Ele diz sorrindo.

Você sorri de volta, e, com uma pontada de culpa, começa a caminhar na direção indicada por ele.`,
                proximaCena: "becosOpostos",
              },

              fracasso: {
                texto: `Ainda caminhando ao seu lado, o olhar de Ned lentamente se desvia ao chão enquanto ele pensa.

Após alguns segundos, ele volta a olhar para cima e muda repentinamente de direção, novamente forçando você a caminhar com ele.

"Não tenho certeza, mas sei onde pode ter uma possível saída." Ele responde em voz baixa, olhando ao redor.

Você o acompanha até a entrada de uma pequena viela escura, pela qual vocês entram rapidamente.

"No final dessa rua e seguindo pela esquerda..." Ele fala, indicando com uma das mãos. "Você vai chegar em território dos Lagartos, onde eu já ouvi dizer várias vezes que tem uma saída semi-escondida."

Você se vira na direção para a qual Ned aponta, já pensando em como seguir em frente.

"Tome cuidado." Ele continua, fazendo você se virar para ele. "Você sabe que eles estão atrás de você."

"Procure um jeito de dar notícias. Vamos deixar a cidade segura para a sua volta" Ele diz sorrindo.

Você sorri de volta, e, com uma pontada de culpa, começa a caminhar na direção indicada por ele.`,
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

            instrucao: "se lembrar da geografia local.",

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
                texto: `Você se lembra de uma rota que pode {o|a} levar diretamente para a parte de trás da cidade.
                
                É uma rota potencialmente perigosa, passando pelo território dos Lagartos, mas é o caminho mais direto que você consegue se lembrar.`,
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

            proximaCena: "movimentacaoNoite",
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
                texto: `Você se desloca pelos telhados com paciência, esperando a oportunidade certa, e sempre tendo a certeza de qual será sua próxima cobertura.

                Engajados no conflito, os guardas não prestam atenção na sua movimentação, e você consegue tranquilamente descer dos telhados e se infiltrar no conflito.

                Porém, o caos se mostra maior do que você esperava, {atordoando-o|atordoando-a} por um momento antes que você consiga se recompor.`,
                proximaCena: "confronto",
              },

              fracasso: {
                texto: ``,
                proximaCena: "movimentacaoTelhadoRapida",
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
            descricao: `Tentar o pulo é arriscado demais. Você já se deslocou boa parte do caminho pelos telhados e julga que encontrar uma rota até a torre não vai se provar muito difícil.

            E, de fato, apesar do caos do conflito, uma rota direta se apresenta entre você e a torre.

            Deslocando-se rápido e não chamando a atenção, você desce da rua para a margem do rio e rapidamente entra na torre.`,

            proximaCena: "torreChao",
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
                texto: `Em um momento desesperador, ainda no alto, você julga que não vai conseguir alcançar a torre.

                Porém, esticando os braços e se preparando para se agarrar a qualquer saliência de sua alvenaria irregular, você consegue se segurar em uma viga de madeira que se projeta para fora da torre.

                Usando toda sua força, você consegue se erguer, entrando na torre pelo teto.`,
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
                texto: `Por um triz, você consegue se deslocar até a carruagem e usá-la como cobertura no exato momento em que um grupo de guardas chega ao local.

                Ao perceber que a atenção deles está voltada para as caixas quebradas por sua queda, você rapidamente se desloca para o lado oposto em direção à torre.`,
                proximaCena: "torreChao",
              },

              fracasso: {
                texto: ``,
                proximaCena: "becosOpostos",
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
              veioDe: {
                cenaId: "inicio",
                etapaId: "movimentacaoFurtiva",
                tipo: "teste",
                resultado: "fracasso",
              },
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
              veioDe: {
                cenaId: "esperaNoTelhado",
                etapaId: "movimentacaoFurtiva",
                tipo: "teste",
                resultado: "fracasso",
              },
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
              veioDe: {
                cenaId: "esperaNoTelhado",
                etapaId: "escolherRotaTelhado",
                tipo: "escolha",
                resultado: "rotaRapida",
              },
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
              veioDe: {
                cenaId: "inicio",
                etapaId: "escolherRotaTelhado",
                tipo: "escolha",
                resultado: "rotaRapida",
              },
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
                proximaCena: "batalhaTorreM",
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
                descricao:`Rapidamente, você vira em direção aos becos e pula do telhado.

                Assim que cai no chão, você corre em direção a uma pequena rua ao lado. Se você for {rápido|rápida} o suficiente, vai conseguir entrar nela e usá-la para dar a volta e chegar na torre; do contrário, os guardas {o|a} verão.

                Para sua sorte, os guardas se confundem em relação a como cercar a pequena casa na qual você estava, e isso lhe dá margem suficiente para entrar na rua.

               Seguindo o plano, você rapidamente se desloca para a torre.`,

                proximaCena: "torreChao",
              },
            ],
          },

          pularAteTorreFlechada: {
            descricao: `Pode ser arriscado tentar o pulo, mas é ainda mais arriscado descer e se expor pelas ruas tão próximo dos guardas.

            Você dá alguns passos para trás, aproveitando ao máximo o pequeno espaço que o telhado oferece.

            Então respira fundo e parte em disparada à torre, usando toda sua força para realizar o salto no último momento possível.`,

            instrucao: "pular para a torre.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 16,
            },

            resultados: {
              sucesso: {
                texto: `Em um momento desesperador, ainda no alto, você julga que não vai conseguir alcançar a torre.

                Porém, esticando os braços e se preparando para se agarrar a qualquer saliência de sua alvenaria irregular, você consegue se segurar em uma viga de madeira que se projeta para fora da torre.

                Usando toda sua força, você consegue se erguer, entrando na torre pelo teto.`,
                proximaCena: "torreTetoComGuardas",
              },

              fracasso: {
                texto: `Ainda no alto, você percebe com desespero que não vai alcançar a torre. Você não calculou bem a distância e precisou diminuir a velocidade, perdendo potência no pulo.

                Você estica os braços em uma tentativa pífia de se agarrar a alguma parte da torre, mas sem sucesso. O choque com a torre tira completamente o seu fôlego enquanto você vai ao chão, caindo entre caixas e ferramentas.

                {Dolorido|Dolorida}, você começa a se levantar em meio aos escombros e congela ao ouvir uma voz próxima.

                "Aqui!"

                Você se levanta lentamente enquanto os três guardas {o|a} cercam.`,
                proximaCena: "batalhaTorreM",
                queda: {
                  distanciaMetros: 3,
                },
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
              veioDe: {
                cenaId: "inicio",
                etapaId: "decidirNaMultidao",
                tipo: "escolha",
                resultado: "distrairGuardas",
              },
            },

            contexto: [
              `Vendo a comoção, os dois guardas na ponte saem do posto e correm em direção ao conflito.

              Essa é a sua chance.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "inicio",
                etapaId: "decidirPedidoAjuda",
                tipo: "escolha",
                resultado: "pedirDistracao",
              },
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

          A outra possibilidade é tentar atravessar nadando pelo rio. Isso lhe daria uma chance de tentar passar {despercebido|despercebida} pelos guardas do outro lado.`,

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
            descricao: `Você decide se aproveitar da confusão para tentar atravessar a ponte.

            Ainda perto da margem, você espera o momento certo de dar o primeiro passo.`,
            instrucao: "passar {escondido|escondida} pela ponte.",

            teste: {
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Com os guardas envolvidos no combate, passar {escondido|escondida} pela ponte é fácil.
                
                Assim que atinge uma distância segura, você apressa o passo em direção ao outro extremo da ponte, onde outros dois guardas, de costas para você, fazem a vigília.

                Quando se aproxima o suficiente, você volta a andar mais devagar e se prepara para desferir um golpe em um deles, esperando que um ataque rápido os pegue distraídos.`,
                proximaCena: "batalhaPonteF",
              },

              fracasso: {
                texto: `Com os guardas envolvidos no combate, dar os primeiros passos pela ponte é fácil.
                
                Assim que atinge uma distância segura, você se move mais rápido em direção ao outro extremo da ponte, onde outros dois guardas, de costas para você, fazem a vigília.

                Prestando atenção aos guardas, você não percebe uma pedra solta em seu caminho e acaba chutando-a. O barulho chama a atenção dos guardas e um deles olha para trás.

                De início, ele se assusta com sua presença, mas logo se recompõe e chama a atenção do companheiro, e ambos saem correndo em sua direção.

                "Martin! Hector!" Um deles grita a plenos pulmões.

                Às suas costas, outros dois guardas se aproximam.

                {Cercado|Cercada}, você se prepara para a batalha.`,
                proximaCena: "batalhaPonteD",
              },
            },
          },

          atravessarRio: {
            descricao: `Você entra devagar no rio, evitando fazer barulho. A água gelada pressionando o ar de seu peito e roubando-lhe o ar.

            Logo nos primeiros passos, a força da correnteza {o|a} surpreende. Você respira fundo e mergulha.`,
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
                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Incapaz de lutar contra a correnteza, você perde completamente a noção de direção enquanto perde rapidamente o ar, vendo-se {obrigado|obrigada} a voltar para a superfície.`,

                ataquesNpc: {
                  npcId: "guardaConde",
                  ataqueId: "bestaLeve",
                  quantidade: 2,
                  tipoRolagem: "desvantagem",

                  resultadosPorAcertos: {
                    0: {
                      texto: `Assim que coloca a cabeça para fora d'água, você vê uma flecha voar em sua direção, {o|a} errando por pouco.

                      Em meio ao borbulho incessante da água ao seu redor, você consegue ouvir gritos vindos da ponte, onde os dois soldados o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas não consegue se concentrar em nadar. O rio agora {o|a} carrega até a margem. Além dos guardas da ponte, outros dois envolvidos no conflito correm em sua direção.`,

                      proximaCena: "batalhaPonteD",
                    },

                    1: {
                      texto: `Enquanto volta para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora da água e respirar fundo, você consegue ouvir gritos vindos da ponte, onde os dois soldados o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas não consegue se concentrar em nadar. O rio agora {o|a} carrega até a margem. Além dos guardas da ponte, outros dois envolvidos no conflito correm em sua direção.`,

                      proximaCena: "batalhaPonteD",
                    },

                    2: {
                      texto: `Enquanto volta para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos da ponte, onde os dois soldados o observam, um deles disparando um virote em sua direção.

                      Lutando contra a correnteza, você não consegue se desviar, e sente outra pontada forte, dessa vez na perna, onde o virote {o|a} atinge dentro d'água. Com os membros feridos, você não consegue nadar, e o rio agora {o|a} carrega até a margem. Além dos guardas da ponte, outros dois envolvidos no conflito correm em sua direção.`,

                      proximaCena: "batalhaPonteD",
                    },

                  },
                },
              },
            },
          },
        }
      },

      becosOpostos: {
        // Numero correspondente ao mapa da aventura no Miro/documento-fonte.
        numeroFonte: 6,

        // Trechos exibidos antes do contexto geral quando a condicao e atendida.
        variacoes: [
          {
            se: {
              veioDe: {
                cenaId: "movimentacaoTelhadoFurtiva",
                etapaId: "fracassoPulo",
                tipo: "teste",
                resultado: "fracasso",
              },
            },

            contexto: [
              `Um passo em falso faz você esbarrar em uma pilha de madeira próxima. Os guardas se voltam imediatamente para a sua direção.

            "Ali!" Um deles grita, apontando para a sua direção.

            Rapidamente você vai para trás da carruagem e, para despistar os guardas, volta para o lado de onde veio, embrenhando-se em um dos becos atrás da torre.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "inicio",
                etapaId: "investigarBecos",
                tipo: "teste",
                resultado: "sucesso",
              },
            },

            contexto: [
              `Sua memória {o|a} manda seguir por um caminho específico, no qual você sabe que dificilmente encontrará a presença de guardas.

            Passando pelas vielas mais apertadas que vão em direção ao castelo, com o som da multidão se tornando cada vez mais distante.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "inicio",
                etapaId: "perguntarOutraSaida",
                tipo: "teste",
                resultado: "sucesso",
              },
            },

            contexto: [
              `Seguindo as indicações de Ned, você se embrenha por vielas apertadas que vão em direção ao castelo; o som da multidão se tornando cada vez mais distante.`,
            ],
          },
        ],

        // Texto principal. Pode ser uma string ou uma lista de trechos.
        contexto: [
          `Você caminha por alguns minutos, sem identificar a presença de guardas. Agora, mal consegue ouvir o som da multidão.

          Ao alcançar uma pequena rua, um pouco maior do que os becos que usou para chegar até esse ponto, é possível ver o castelo do conde. Você está no local certo; a questão agora é como prosseguir.

          Você pode tentar passar para o outro lado do castelo, saindo próximo ao rio, onde talvez uma saída se apresente. Porém, o risco de encontrar guardas patrulhando é grande.

          Outra possibilidade é ir para o lado oposto, entrando no território dos Lagartos de Bronze e procurando pelas supostas saídas que eles possuem. Nesse caso, o perigo deixa de ser os guardas e se torna os próprios Lagartos.

          Qual rota você vai seguir?`,
        ],

        escolhas: [
          {
            id: "voltaCastelo",
            texto: `Dar a volta no castelo.`,
            descricao: ``,
            proximaEtapa: "testeCastelo",
          },

          {
            id: "procurarTerritorio",
            texto: `Ir para o território dos Lagartos de Bronze.`,
            descricao: ``,
            proximaEtapa: "testeTerritorio",
          },
        ],

        etapas: {
          testeCastelo: {
            descricao: `Apesar do risco de encontrar guardas, você decide dar a volta no castelo, e planeja a possível rota que vai tomar em sua mente.`,
            instrucao: "planejar sua rota.",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "pericia",
              periciaId: "sobrevivencia",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Sua rota se prova bem-sucedida. Você até viu algumas patrulhas passarem, mas consegue evitá-las sem problema.`,

                proximaCena: "margemRioLonge",
              },

              fracasso: {
                texto: `Ao ver uma patrulha de guardas passar muito próxima, você acaba se vendo {obrigado|obrigada} a desviar da sua rota original.`,

                proximaCena: "becosLagartos",
              },
            },
          },

          testeTerritorio: {
            descricao: `Apesar do risco, você decide procurar uma saída pelo território dos Lagartos, e planeja a possível rota que vai tomar em sua mente.`,
            instrucao: "planejar sua rota.",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "pericia",
              periciaId: "sobrevivencia",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `A rota que você planejou se mostra segura, especialmente quando você olha por uma fresta antes de fazer a próxima curva e se depara com um grupo de Lagartos.

                Para além deles, uma grande abertura nos muros da cidade. Ali está a sua saída.

                Os Lagartos parecem distraídos e passar {despercebido|despercebida} por eles parece possível.

                Mas talvez o risco seja grande demais e o melhor seja voltar e procurar outra rota.

                O que você faz?`,

                escolhas: [
                  {
                    id: "tentarPassarLagartos",
                    texto: `Passar {despercebido|despercebida}.`,
                    descricao: ``,
                    proximaEtapa: "testePassarLagartos",
                  },

                  {
                    id: "voltarLagartos",
                    texto: `Voltar e buscar uma rota mais segura.`,
                    descricao: ``,
                    proximaCena: "becosLagartos",
                  },
                ],
              },

              fracasso: {
                texto: `Durante um momento de distração, você acaba virando uma curva sem antes verificar o caminho.
                
                Esse erro se prova fatal conforme você se expõe bem em frente a um grupo de Lagartos.
                
                Por um segundo, vocês apenas se encaram, e então eles partem em sua direção.`,

                proximaCena: "batalhaBecosM",
              },
            },
          },

          testePassarLagartos: {
            descricao: ``,
            instrucao: "passar {despercebido|despercebida}.",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Quase prendendo a respiração, você segue calmamente por entre os becos em direção à abertura, cuidando ao máximo onde pisa.
                
                Você atravessa uma pequena rua principal, movendo-se apenas quando tem a certeza de que não será {visto|vista}, e continua em direção aos muros da cidade.

                Se espremendo por um pequeno espaço entre as casas, você consegue sair do outro lado e passar pela abertura.`,

                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Você segue calmamente pelas pequenas vielas até chegar a um ponto em que precisa atravessar uma pequena rua principal.

                O nervosismo faz você se mover rápido demais, derrubando um amontoado de latas e madeiras no caminho. Imediatamente o grupo de Lagartos se vira em sua direção.

                Sua tentativa de passar {despercebido|despercebida} falhou, e agora o confronto direto é a única coisa entre você e sua fuga.`,

                proximaCena: "batalhaBecosM",
              },
            },
          },
        },
      },

      becosLagartos: {
        numeroFonte: 7,

        contexto: [
          `Você adentra as vielas escuras com cautela. Em vários locais, você vê pintado o símbolo dos Lagartos de Bronze, garras cortando uma armadura, indicando que agora você está definitivamente em território pertencente a eles.

          O som da batalha que acontece na rua principal da cidade parece se intensificar enquanto você caminha e, ao virar um conjunto particularmente apertado de casas, você vê o confronto ao longe e, do outro lado, a torre de embarcações.

         {Escondido|Escondida}, você também vê vários Lagartos passando pelos becos, correndo em direção à batalha. Continuar se movimentando na área torna-se cada vez mais perigoso.

         Agora, mais {próximo|próxima}, você pode tentar atravessar o conflito e chegar até a torre ou arriscar e continuar buscando uma outra saída pela área.`,
        ],

        escolhas: [
          {
            id: "irAteTorre",
            texto: `Tentar ir até a torre.`,
            descricao: ``,
            proximaEtapa: "testeTorreOuConflito",
          },

          {
            id: "outraSaida",
            texto: `Continuar buscando uma saída alternativa.`,
            descricao: ``,
            proximaEtapa: "testeSaida",
          },
        ],

        etapas: {
          testeTorreOuConflito: {
            descricao: `Buscar a esmo por uma saída que você nem ao menos tem certeza de que existe em uma área cercada de inimigos não parece uma boa opção. Não quando você está tão {próximo|próxima} da torre.
            
            O melhor é tentar passar pelo conflito e chegar até ela.`,
            instrucao: "passar pelo conflito.",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "pericia",
              periciaId: "sobrevivencia",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: `Ao se aproximar do conflito, inicialmente {o|a} caos o deixa {atordoado|atordoada}. Membros mais armados da população e Lagartos enfrentam os guardas em um embate mais violento do que você esperava.

                Ainda assim, você consegue se recompor e encontrar uma rota segura para a torre.`,

                proximaCena: "torreChao",
              },

              fracasso: {
                texto: `Ao se aproximar do conflito, inicialmente {o|a} caos o deixa {atordoado|atordoada}. Membros mais armados da população e Lagartos enfrentam os guardas em um embate mais violento do que você esperava.

                Você tenta buscar um caminho seguro até a torre, mas acaba sendo {engolfado|engolfada} pelo caos da batalha.`,

                proximaCena: "confronto",
              },
            },
          },

          testeSaida: {
            descricao: `Apesar do perigo, continuar buscando uma saída parece mais prudente do que tentar passar pelo caos da batalha.

            Você segue pelos becos e vielas, redobrando sua atenção para não ser {visto|vista}.`,

            instrucao: "se mover pela área sem ser {visto|vista}.",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Mover-se pelas vielas apertadas e evitar os grupos de mercenários que passavam provou-se mais difícil do que o antecipado.

                Em alguns momentos, Lagartos passaram muito próximos, mas, com sua atenção voltada à batalha, não se deram conta da sua presença.`,

                proximaCena: "margemRioLonge",

                
              },

              fracasso: {
                texto: `Você chega a um ponto em que precisa atravessar uma pequena área semelhante a uma praça que não oferece qualquer tipo de cobertura.

                Ao sair correndo em direção ao beco oposto, ao mesmo tempo, dois mercenários dos Lagartos surgem do lado oposto, correndo em sua direção.Tanto eles quanto você param, se encarando, até que um deles finalmente grita seu nome e começa a correr em sua direção.

                "{personagem}! Finalmente você deu as caras!"

                Sem ter para onde correr, você se prepara para a batalha.`,

                proximaCena: "batalhaBecosF",
              },
            },
          },
        },
      },

      confronto:{

        numeroFonte: 8,

        contexto: [`Você força sua passagem em meio ao caos e pensa nas suas opções.

        Surpreendentemente, os guardas, agora definitivamente engajados no combate, quebraram a linha de defesa, expondo uma pequena abertura por onde você conseguiria passar e ir diretamente para trás do castelo do conde.

        A torre também ainda permanece como sendo uma alternativa, e bem menos arriscada.

        Porém, ao olhar ao redor em direção à população que se aproxima do conflito, você vê ao longe que os guardas que antes protegiam a ponte saíram de seu posto e agora enfrentam um grupo de pessoas logo à frente. Talvez voltar e tentar passar pela ponte seja uma opção.

        O que você faz?`],

        escolhas: [
          {
            id: "trasCastelo",
            texto: `Ir para trás do castelo.`,
            descricao: `Indo na direção oposta do conflito, você encontra pouca resistência pelo caminho e consegue passar {despercebido|despercebida}, entrando em uma área com becos que seguem para trás do castelo e se afastam da batalha.`,
            proximaCena: "margemRioLonge",
          },

          {
            id: "torrePosConfronto",
            texto: `Ir para a torre.`,
            descricao: ``,
            proximaEtapa: "torrePosConfrontoTeste",
          },

          {
            id: "voltarPonte",
            texto: `Voltar e passar pela ponte.`,
            descricao: ``,
            proximaEtapa: "voltarPonteTeste",
          },
        ],

        etapas: {
          torrePosConfrontoTeste: {
            descricao: `Passar pelo caos e chegar até a torre parece mais difícil, mas menos perigoso.

            Você precisará forçar seu caminho pelo confronto, mas não vai precisar se expor diretamente.`,

            instrucao: "passar pelo conflito.",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: `Apesar da dificuldade, você consegue empurrar as pessoas pelo caminho, distraídas com a  batalha, e forçar sua passagem até a torre.`,

                proximaCena: "torreChao",
              },

              fracasso: {
                texto: `Forçando seu caminho, você acaba chegando a um ponto em que uma batalha particularmente brutal ocorre.

                Incapaz de seguir nessa direção, você tenta voltar, mas sente alguém {o|a} puxando por trás.
                
                Você se vira rapidamente e se depara com um guarda, já pronto para o combate.`,

                proximaCena: "batalhaConfrontoM",
              },
            },
          },

          voltarPonteTeste: {
            descricao: `Indo em direção à ponte, você precisará se expor em algumas áreas abertas, uma vez que, entre a rua e a margem do rio, não há qualquer tipo de cobertura.`,

            instrucao: "chegar até a ponte sem ser {visto|vista}",

            teste: {
              // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
              tipo: "periciaEscolha",
              periciasIds: ["furtividade", "sobrevivencia"],
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Você consegue cobrir a distância sem ser {visto|vista} e se aproximar da pequena batalha que acontece próximo à ponte.`,

                proximaCena: "guardasDistraidos",
              },

              fracasso: {
                texto: `O caos de pessoas correndo em direção ao conflito próximo ao castelo acaba se mostrando mais desafiador do que a falta de cobertura.

                Ao se aproximar da ponte, um dos guardas {o|a} percebe após ter recém desferido um golpe mortal em um dos mercenários dos Lagartos.

                "{personagem}!" Ele grita, já correndo em sua direção.`,

                proximaCena: "batalhaPonteAlt",
              },
            },
          },
        },

      },

      movimentacaoNoite:{

        numeroFonte: 9,

        contexto: [`Em cima do telhado, a noite chega enquanto você observa a batalha pelas ruas terminar.

        Os guardas reais acabaram cercados pela população vinda das ruas e os Lagartos vindo dos becos por trás do castelo. Ainda assim, conseguiram bater em retirada para dentro do castelo.

        Em meio aos gritos de comemoração da população, aos poucos a rua principal foi tomada por reforços de um grupo mais organizado e bem equipado de aldeões, apoiados por alguns membros dos Lagartos.

        Nas últimas horas, uma forte chuva começou a cair enquanto o grupo iniciava a montagem de uma espécie de cerco improvisado em volta do castelo.

        As coisas estão calmas no momento, mas, infelizmente, a ponte ainda está sendo vigiada, embora por um grupo de Lagartos, em vez de soldados.

        Com a chuva, continuar pulando pelos telhados escorregadios se torna perigoso demais, e sua melhor opção é descer e, usando a chuva e a noite como cobertura, tentar se aproximar da ponte ou da torre.

        Para onde você vai?`],

        escolhas: [
          {
            id: "noiteParaATorre",
            texto: `Para a torre.`,
            descricao: `Seguir para a torre parece muito menos arriscado. Com as ruas vazias, a chance de ser {visto|vista} é quase nula.`,
            proximaEtapa: "torreNoite",
          },

          {
            id: "noiteParaAPonte",
            texto: `Para a ponte.`,
            descricao: `Seguir para a ponte pode ser mais arriscado, mas é a rota mais direta para fora da cidade. E agora, com as ruas vazias, a chance de ser {visto|vista} é muito menor.`,
            proximaEtapa: "testePonteNoite",
          },
        ],

        etapas: {
          torreNoite: {
            descricao: `Você consegue chegar à torre sem problemas, mas congela ao perceber que o local está sendo fortemente vigiado por um grupo de Lagartos.
            
            Mais do que simplesmente vigiando, eles parecem estar fiscalizando as embarcações próximas, carregando caixas de dentro dos barcos para a margem.

            A chuva tornou o rio especialmente revolto, e atravessar a nado é uma opção perigosa. Porém, observando a disposição das embarcações paradas ao longo do rio, uma ideia ainda mais ousada lhe ocorre.

            Você percebe que seria possível atingir a margem oposta pulando de uma embarcação para outra. Algumas passam perigosamente perto de onde estão os Lagartos, mas parece perfeitamente possível chegar do outro lado sem ser {visto|vista}.

            Qual a sua escolha?`,

            escolhas: [
              {
                id: "irNoiteNadandoTorre",
                texto: `Tentar atravessar nadando.`,
                descricao: ``,
                proximaEtapa: "noiteNadandoTorre",
              },

              {
                id: "irNoitePelasEmbarcacoes",
                texto: `Tentar atravessar pelas embarcações.`,
                descricao: ``,
                proximaCena: "noitePelasEmbarcacoes",
              },
            ],
          },

          noiteNadandoTorre: {
            descricao: `Você julga que pular pelas embarcações seja arriscado demais e decide enfrentar o rio.

            Saindo de trás de seu esconderijo, você caminha rapidamente em direção ao rio, encontrando cobertura em algumas caixas empilhadas em um dos cais.

            O rio estaria frio, não fosse pelo fato de seu corpo já estar há algumas horas sendo castigado pela chuva.

            Você prende a respiração e mergulha.`,

            instrucao: "atravessar o rio.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              situacao: "nadarAguasRevoltas",
              dificuldade: 16,
            },

            resultados: {
              sucesso: {
                texto: ``,

                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Para o seu desespero, o rio se mostra muito mais revolto do que você esperava, {impedindo-o|impedindo-a} de nadar em linha reta até a outra margem.

                A forte correnteza joga você contra o casco de um navio, e você bate a cabeça, perdendo completamente a noção de espaço e sentindo a água entrar em suas narinas.`,

                ataquesNpc: {
                  npcId: "lagartoBronze",
                  ataqueId: "bestaLeve",
                  quantidade: 2,
                  tipoRolagem: "desvantagem",

                  resultadosPorAcertos: {
                    0: {
                      texto: `Você se recompõe e volta à superfície a tempo de ver uma flecha voar em sua direção, {o|a} errando por pouco.

                      Em meio ao borbulho incessante da água ao seu redor, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas não consegue se concentrar em nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    1: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas a dor no braço {o|a} impede de nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    2: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Lutando contra a correnteza, você não consegue se desviar, e sente outra pontada forte, dessa vez na perna, onde o virote {o|a} atinge dentro d'água. Com os membros feridos, você não consegue nadar, e o rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                  },
                },
              },
            },
          },

          testePonteNoite:{

            descricao: ``,

            instrucao: "chegar até a ponte sem ser {visto|vista}.",

            teste: {
                tipo: "oposto",

                jogador: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                },

                oponente: {
                  npcId: "lagartoBronze",
                  tipo: "pericia",
                  periciaId: "percepcao",
                },
            },

            resultados: {
              sucesso: {
                texto: `A chuva acaba {o|a} atrapalhando mais do que você imaginaria, mas você segue em frente.

                Em certo ponto, não há outro caminho a não ser atravessar a rua principal. No momento em que você se preparava para começar a travessia, um Lagarto surge de trás de uma das ruas.

                Você dá alguns passos para trás, escondendo-se nas sombras e esperando ele passar. Em seguida, atravessa a rua e se esconde no declive da cabeceira da ponte.`,

                proximaEtapa: "ponteNoiteEscolha",
              },

              fracasso: {
                texto: `A chuva acaba {o|a} atrapalhando mais do que você imaginaria, mas você segue em frente.

                Em certo ponto, não há outro caminho a não ser atravessar a rua principal. E, para o seu azar, um Lagarto surge de trás de uma das ruas no exato momento em que você começa a travessia.

                "Ei!" Ele grita atrás de você.

                Pouco tempo depois, uma flecha passa muito próxima, batendo no chão.

                À sua frente, outros dois mercenários surgem.

                {Cercado|Cercada}, você se prepara para a batalha.`,

                proximaCena: "batalhaPonteNoite",
              },
            },

          },

          ponteNoiteEscolha:{
            descricao: `{Escondido|Escondida}, você considera suas opções.

            A chuva tornou o rio especialmente revolto, e atravessar a nado é uma opção perigosa. Ainda assim, parece menos perigoso do que tentar atravessar a ponte, agora vigiada por três Lagartos, controlando a entrada.

            Enquanto você pensa, um barulho vindo da rua chama sua atenção. Uma grande carroça se aproxima, e para praticamente do seu lado.

            Apesar de não conseguir entender exatamente, o tom de conversa entre o cocheiro e os mercenários é amigável o suficiente. Há uma chance de que ele esteja pedindo para atravessar a ponte.

            Se você agir rápido, conseguiria se segurar embaixo da carroça e acompanhá-la até o outro lado da ponte.

            O que você faz?`,

            escolhas: [
              {
                id: "ponteNoitePonte",
                texto: `Aproveita o momento de distração dos Lagartos para tentar atravessar a ponte.`,
                descricao: ``,
                proximaEtapa: "testePonteNoitePonte",
              },

              {
                id: "ponteNoiteNado",
                texto: `Tenta atravessar o rio a nado.`,
                descricao: ``,
                proximaEtapa: "testePonteNoiteNado",
              },

              {
                id: "ponteNoiteCarroca",
                texto: `Vai para a carroça imediatamente e tenta se segurar nela até atravessar a ponte.`,
                descricao: ``,
                proximaEtapa: "testePonteNoiteCarroca",
              },
            ],


          },

          testePonteNoitePonte:{

            descricao: `Você dá alguns passos temerosos e olha pelo canto de um dos pequenos blocos estruturais da ponte. Os Lagartos ainda conversam com o cocheiro, e agora o tom da conversa é claro.

            Eles parecem se conhecer de fato, e estão apenas compartilhando algumas informações sobre os últimos acontecimentos.

            Parece ser possível, pelo outro lado, pular para a ponte e se arrastar próximo de suas ameias.`,

            instrucao: "pular para a ponte e seguir {despercebido|despercebida}.",

            teste: {
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 17,
            },

            resultados: {
              sucesso: {
                texto: `Encontrando um equilíbrio entre movimentos precisos para não chamar a atenção e rápidos para se expor o mínimo possível, você pula para a ponte.

                Erguer-se pelas ameias e efetuar o pulo foi surpreendentemente fácil, e rapidamente você consegue se abaixar e continuar uma boa parte do caminho {agachado|agachada}.

                Ao julgar que está a uma distância segura o suficiente, você apressa o passo. Em seguida, o som do galope do cavalo se aproximando pelas pedras da ponte lhe incentiva a correr o mais rápido possível.`,

                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Você tenta encontrar um equilíbrio entre movimentos precisos para não chamar a atenção e rápidos para se expor o mínimo possível.

                Porém, a pressa {o|a} impede de calcular bem a altura e, ao pular da ameia da ponte, você acaba perdendo o equilíbrio e se vê {forçado|forçada} a cair de joelhos.

                "O que foi isso?" Uma voz vem da entrada da ponte e, mais rápido do que você conseguiria imaginar, o rosto de um dos Lagartos surge fantasmagoricamente em meio à chuva, iluminado por um lampião carregado por ele.

                Seus olhos se cruzam e, após um segundo de silêncio, ele grita:

                "{personagem}!"

                Os passos dos outros mercenários acompanham o chamado, e rapidamente você se vê quase {cercado|cercada}, e sem alternativa a não ser lutar.`,

                proximaCena: "batalhaPonteNoite",
              },
            }
          },

          testePonteNoiteNado:{
            descricao: `Você julga que o risco de tentar passar pelos guardas é grande demais, mesmo com a possibilidade de usar a carroça como subterfúgio, e decide enfrentar o rio.

            Saindo de trás de seu esconderijo, você desce para a margem.

            O rio estaria frio, não fosse pelo fato de seu corpo já estar há algumas horas sendo castigado pela chuva.

            Você prende a respiração e mergulha.`,

            instrucao: "atravessar o rio.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              situacao: "nadarAguasRevoltas",
              dificuldade: 16,
            },

            resultados: {
              sucesso: {
                texto: `Nadar pelo rio se mostra muito mais desafiador do que você imaginou inicialmente.

                A correnteza {o|a} joga de um lado para o outro, e resistir a ela enquanto tenta permanecer {escondido|escondida} drena rapidamente o seu fôlego.

                Vendo-se {obrigado|obrigada} a voltar à superfície em três ocasiões, você teme estar fazendo barulho demais e chamando a atenção dos Lagartos.

                Por fim, você vence o rio e chega do outro lado.`,

                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Para o seu desespero, o rio se mostra muito mais revolto do que você esperava, {impedindo-o|impedindo-a} de nadar em linha reta até a outra margem.

                A forte correnteza joga você contra as bases da ponte, e você bate a cabeça, perdendo completamente a noção de espaço e sentindo a água entrar em suas narinas.

                Você se recompõe e volta à superfície a tempo de ver uma flecha voar em sua direção, {o|a} errando por pouco.
                
                "Connor!" Uma voz vem da margem, iluminada por um lampião.

                {Carregado|Carregada} de volta à margem pelo rio, você se prepara para o possível embate.`,

                proximaCena: "batalhaPonteNoite",
              },
            }
          },

          testePonteNoiteCarroca:{
            descricao: `Em um movimento rápido, você sai de seu esconderijo e vai {abaixado|abaixada} até a carroça, rapidamente se jogando ao chão e girando para baixo dela.

            Você tateia pelo escuro em algum local onde possa se segurar e encontra facilmente um apoio para as mãos no aro central da carroça.

            Porém, não consegue encontrar um local para encaixar os pés e, ao perceber a carroça começar a se movimentar, simplesmente pressiona-os contra duas extremidades com a maior força possível.

            Você vai precisar de mais força do que imaginou para se segurar.`,

            instrucao: "se segurar na carroça até a travessia.",

            teste: {
              tipo: "atributo",
              atributoIdId: "forca",
              dificuldade: 16,
            },

            resultados: {
              sucesso: {
                texto: `Seus músculos ardem com o esforço, mas você consegue se segurar na carroça até que ela termine a travessia.

                A mudança da suavidade do galope indica que o cavalo agora pisa na grama e que você chegou com sucesso à margem oposta.

                Você se solta antes que a velocidade se torne alta demais e se permite deitar na grama por breves segundos, sentindo o alívio nos músculos, a chuva no rosto e o ar de liberdade.`,

                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Seus músculos ardem com o esforço e, quando a carroça passa por um pequeno desnível nas pedras da ponte, seus pés se soltam.

                Eles se arrastam no chão e, incapaz de forçá-los novamente para cima, você solta da carroça, caindo no chão com um baque surdo.

                "O que foi isso?" Uma voz vem da entrada da ponte e, mais rápido do que você conseguiria imaginar, o rosto de um dos Lagartos surge fantasmagoricamente em meio à chuva, iluminado por um lampião carregado por ele.

                Seus olhos se cruzam e, após um segundo de silêncio, ele grita:

                "{personagem}!"

                Os passos dos outros guardas acompanham o chamado, e rapidamente você se vê quase {cercado|cercada}, e sem alternativa a não ser lutar.`,

                proximaCena: "batalhaPonteNoite",
              },
            }
          },
        },

      },

      torreChao: {
        numeroFonte: 10,

        contexto: `Você entra rapidamente na torre.

        Dentro da torre você encontra uma grande mesa com diversos instrumentos de pesca, bem como caixas com redes, varas e o que parecem ser instrumentos de navegação.

        Acima dessa mesa, há uma pequena janela, por onde é possível ver que a área não é muito vigiada. Há pouca movimentação de pescadores e apenas um guarda em um dos pequenos cais.

        O rio parece especialmente revolto, e atravessar a nado é uma opção perigosa. Porém, observando a disposição das embarcações paradas ao longo do rio, uma ideia ainda mais ousada lhe ocorre.

        Há uma pequena embarcação, um pouco mais distante, onde parece ser possível chegar sem que o guarda {o|a} veja. Se você conseguir, talvez consiga usá-la para atravessar o rio.

        Qual você considera a melhor alternativa?`,

        escolhas: [
          {
            id: "torreEscolhaNado",
            texto: `Tentar atravessar o rio a nado.`,
            descricao: ``,
            proximaEtapa: "torreNadando",
          },

          {
            id: "torreEscolhaBarco",
            texto: `Tentar chegar à pequena embarcação.`,
            descricao: ``,
            proximaEtapa: "furtividadeAteBarco",
          },
        ],

        etapas: {
          torreNadando: {
            descricao: `Chamar a atenção do guarda é arriscado demais, e você decide enfrentar a fúria do rio.

            Saindo da torre, você busca cobertura em uma pilha de caixas em um dos cais e entra devagar no rio, evitando fazer barulho. A água gelada pressionando o ar de seus pulmões.

            Logo nos primeiros passos, a força da correnteza {o|a} surpreende. Você respira fundo e mergulha.`,

            instrucao: "atravessar o rio.",

            teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              situacao: "nadarAguasRevoltas",
              dificuldade: 15,
            },

            resultados: {
              sucesso: {
                texto: `Nadar pelo rio se mostra muito mais desafiador do que você imaginou inicialmente.

                A correnteza {o|a} joga de um lado para o outro, e resistir a ela enquanto nada por entre os cascos de barcos drena rapidamente o seu fôlego.

                Vendo-se {obrigado|obrigada} a voltar à superfície em três ocasiões, você teme estar fazendo barulho demais e chamando a atenção do guarda.

                Por fim, você vence o rio e chega do outro lado.`,

                proximaCena: "fimVitoria",
              },

              fracasso: {
                texto: `Para o seu desespero, o rio se mostra muito mais revolto do que você esperava, {impedindo-o|impedindo-a} de nadar em linha reta até a outra margem.

                A forte correnteza joga você contra o casco de um navio, e você bate a cabeça, perdendo completamente a noção de espaço e sentindo a água entrar em suas narinas.

                Você se recompõe e volta à superfície a tempo de ver uma flecha voar em sua direção, {o|a} errando por pouco.
                
                "Connor!" O guarda que você havia visto antes grita enquanto prepara outro virote na besta.

                {Carregado|Carregada} de volta à margem pelo rio, você se prepara para o embate.`,

                proximaCena: "batalhaTorreF",
              },
            },
          },

          furtividadeAteBarco:{

            descricao:`Atravessar o rio não vale o risco. Não quando há uma alternativa melhor.

            Saindo da torre, você busca cobertura em uma pilha de caixas em um dos cais e se prepara para se esgueirar até o barco.`,

            instrucao: "chegar {escondido|escondida} até o barco.",

            teste: {
              tipo: "pericia",
              periciaId: "furtividade",
              dificuldade: 13,
            },

            resultados: {
              sucesso: {
                texto: ``,

                proximaEtapa: "pilotarBarco",
              },

              fracasso: {
                texto: `Enquanto se esgueira, repentinamente, uma flecha passa raspando pelo seu braço, vinda de trás.

                Você vira rapidamente e, para seu espanto, vê um guarda, diferente daquele que havia visto antes, já armando outra flecha.

                "Connor!" Ele grita, ainda sem disparar a flecha.

                Atrás de você, o outro guarda surge, já com a espada em punho.

                {Cercado|Cercada}, você se prepara para a batalha.`,

                proximaCena: "batalhaTorreF",
              },
            },

          },

          pilotarBarco:{}
        },
      },

      margemRioLonge:{

        numeroFonte: 15,

        contexto: [],
      },

      noitePelasEmbarcacoes: {

        numeroFonte: 17,

        contexto: [`Atravessar o rio a nado já seria perigoso em condições normais e, em sua condição atual, seria virtualmente impossível.

        Pular pelas embarcações, surpreendentemente, parece ser a melhor opção.

        Você sai do seu esconderijo e se aproxima do cais para poder ver melhor as embarcações e planejar a melhor rota.

        Uma sequência de três saltos {o|a} levaria muito próximo da outra margem, onde você poderia tentar um último salto mais longo ou mesmo nadar o restante do caminho.

        Você entra no cais e sobe na primeira embarcação aportada, um grande navio cargueiro, e caminha até onde vai realizar o primeiro salto, para um barco pesqueiro menor logo abaixo.`],

        etapaInicial: "testeAtletismo1",

        etapas: {
            testeAtletismo1: {
              descricao: ``,
              instrucao: "pular para o barco.",

              teste: {
              tipo: "pericia",
              periciaId: "atletismo",
              dificuldade: 13,
              },

              resultados: {
                sucesso: {
                  texto: ``,

                  proximaEtapa: "testeFurtividade1",
                },

                fracasso: {
                texto: `A chuva acaba {o|a} atrapalhando mais do que você imaginaria, e a dificuldade de identificar um ponto para aterrissagem faz com que você erre o pulo.

                Batendo desajeitadamente no barco e caindo no rio, você perde completamente a noção de espaço por um segundo.`,

                ataquesNpc: {
                  npcId: "lagartoBronze",
                  ataqueId: "bestaLeve",
                  quantidade: 2,
                  tipoRolagem: "desvantagem",

                  resultadosPorAcertos: {
                    0: {
                      texto: `Você se recompõe e volta à superfície a tempo de ver uma flecha voar em sua direção, {o|a} errando por pouco.

                      Em meio ao borbulho incessante da água ao seu redor, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas não consegue se concentrar em nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    1: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas a dor no braço {o|a} impede de nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    2: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Lutando contra a correnteza, você não consegue se desviar, e sente outra pontada forte, dessa vez na perna, onde o virote {o|a} atinge dentro d'água. Com os membros feridos, você não consegue nadar, e o rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                  },
                },
                },
              },
            },

            testeFurtividade1: {
              // NARRATIVA: descreva o personagem tentando não chamar atenção após o primeiro pulo.
              descricao: `Você pula na embarcação mais abaixo, causando um baque mais forte do que esperava.

              Imediatamente você se abaixa, prendendo a respiração.`,

              instrucao: "permanecer {escondido|escondida}.",

              teste: {
                tipo: "oposto",

                jogador: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                },

                oponente: {
                  npcId: "lagartoBronze",
                  tipo: "pericia",
                  periciaId: "percepcao",
                },
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: descreva os Lagartos ainda sem perceber o personagem.
                  texto: `"O que foi isso?" Você ouve uma voz vinda do cais.

                    "Isso o quê?" Uma outra voz, aparentemente mais longe, responde.

                    "Você não ouviu um barulho agora?"

                    A voz ao longe responde algo que você não consegue entender enquanto você se arrasta para o outro extremo do barco e, se escondendo atrás de duas grandes caixas, se prepara para se levantar e dar o próximo pulo.`,

                  proximaEtapa: "testeAtletismo2",
                },

                fracasso: {
                  // NARRATIVA: descreva o momento em que os Lagartos localizam o personagem.
                  texto: `"Ei! Rodrick! Eu vi alguém pulando entre os barcos."

                    Seu sangue gela ao ouvir a voz vindo do cais.

                    "Que barco?" Outra voz, mais próxima, responde.

                    "Esse barquinho menor aí perto de você, animal. Vai ali ver, rápido!"

                    Você precisa se mover rápido. Arrastando-se para o outro extremo do barco, você se esconde atrás de duas grandes caixas e se prepara para se levantar e dar o próximo pulo.`,
                  proximaEtapa: "ataquesAposFurtividade1",
                },
              },
            },

            ataquesAposFurtividade1: {
              // NARRATIVA: introduza o primeiro disparo depois que o personagem foi localizado.
              descricao: ``,

              ataqueNpc: {
                npcId: "lagartoBronze",
                ataqueId: "bestaLeve",
                tipoRolagem: "desvantagem",

                resultados: {
                  erro: {
                    // NARRATIVA: o disparo erra; o personagem continua sob fogo e tenta o segundo pulo.
                    texto: `Assim que você se levanta, ouve um grito do outro lado do cais.

                    "No barco da frente, Rodrick! Perto das caixas."

                    O caos se instaura.

                    Dois mercenários puxam suas bestas; um puxa um grande arco composto, e Rodrick corre em sua direção.

                    Uma flecha é lançada rapidamente e atinge a caixa a centímetros de onde você está. Não há tempo para pensar. Você pula para o próximo barco.`,
                    proximaEtapa: "testeAtletismo2SobFogo",
                  },

                  acerto: {
                    // NARRATIVA: o disparo acerta e ameaça derrubar o personagem.
                    texto: `Assim que você se levanta, ouve um grito do outro lado do cais.

                    "No barco da frente, Rodrick! Perto das caixas."

                    O caos se instaura.

                    Dois mercenários puxam suas bestas; um puxa um grande arco composto, e Rodrick corre em sua direção.

                    Não há tempo para pensar. Você se prepara para pular para o próximo barco.

                    Uma flecha é lançada rapidamente e atinge suas costas no momento em que você se preparava para dar o salto.`,
                    proximaEtapa: "salvaguardaAposFurtividade1",
                  },
                },
              },
            },

            salvaguardaAposFurtividade1: {
              // NARRATIVA: descreva o impacto ameaçando derrubar o personagem entre os barcos.
              descricao: `O impacto joga você para frente, atrapalhando totalmente o ritmo do seu pulo e fazendo você se desequilibrar próximo da borda do navio.`,

              instrucao: "manter o equilíbrio após ser {atingido|atingida}.",

              teste: {
                tipo: "salvaguarda",
                atributoId: "constituicao",
                dificuldade: 12,
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: suporta o impacto e se prepara para o segundo pulo.
                  texto: `Apesar da dor e do impacto, você consegue recuperar seu equilíbrio e se preparar para o salto.`,
                  proximaEtapa: "testeAtletismo2SobFogo",
                },

                fracasso: {
                  // NARRATIVA: perde o equilíbrio e cai em uma embarcação, iniciando a batalha.
                  texto: `O impacto foi forte demais, fazendo você se desequilibrar e cair no rio.

                    Por um momento, você perde completamente a noção de direção enquanto a água entra por suas narinas.

                    Nadando de volta à superfície, você vê virotes e flechas sendo lançados em sua direção enquanto o rio o arrasta de volta para a margem, onde os mercenários certamente estarão prontos para a sua captura.`,
                      proximaCena: "batalhaTorreNoite",
                    },
                  },
            },

            testeAtletismo2: {
              // NARRATIVA: introduza o segundo pulo enquanto o personagem ainda está escondido.
              descricao: ``,

              instrucao: "realizar o segundo pulo.",

              teste: {
                tipo: "pericia",
                periciaId: "atletismo",
                dificuldade: 13,
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: conclui o segundo pulo sem ter sido localizado.
                  texto: ``,
                  proximaEtapa: "testeFurtividade2",
                },

                fracasso: {
                texto: `A chuva acaba {o|a} atrapalhando mais do que você imaginaria, e a dificuldade de identificar um ponto para aterrissagem faz com que você erre o pulo.

                Batendo desajeitadamente no barco e caindo no rio, você perde completamente a noção de espaço por um segundo.`,

                ataquesNpc: {
                  npcId: "lagartoBronze",
                  ataqueId: "bestaLeve",
                  quantidade: 2,
                  tipoRolagem: "desvantagem",

                  resultadosPorAcertos: {
                    0: {
                      texto: `Você se recompõe e volta à superfície a tempo de ver uma flecha voar em sua direção, {o|a} errando por pouco.

                      Em meio ao borbulho incessante da água ao seu redor, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas não consegue se concentrar em nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    1: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas a dor no braço {o|a} impede de nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    2: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Lutando contra a correnteza, você não consegue se desviar, e sente outra pontada forte, dessa vez na perna, onde o virote {o|a} atinge dentro d'água. Com os membros feridos, você não consegue nadar, e o rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                  },
                },
                },
              },
            },

            testeAtletismo2SobFogo: {
              // NARRATIVA: introduza o segundo pulo com os Lagartos já atirando.
              descricao: `Sem pensar muito, você pula rapidamente para o próximo barco, agora sem se preocupar em permanecer {escondido|escondida}.`,

              instrucao: "realizar o segundo pulo.",

              teste: {
                tipo: "pericia",
                periciaId: "atletismo",
                dificuldade: 13,
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: conclui o segundo pulo, ainda sob ataque.
                  texto: ``,
                  proximaEtapa: "ataquesAposSegundoPulo",
                },

                fracasso: {
                  // NARRATIVA: falha no segundo pulo e cai na água.
                  texto: `A pressa em pular faz você calcular mal o pulo e cair no rio.

                    Por um momento, você perde completamente a noção de direção enquanto a água entra por suas narinas.

                    Nadando de volta à superfície, você vê virotes e flechas sendo lançados em sua direção enquanto o rio o arrasta de volta para a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                  proximaCena: "batalhaTorreNoite",
                },
              },
            },

            ataquesAposSegundoPulo: {
              // NARRATIVA: descreva um novo disparo antes do terceiro pulo.
              descricao: ``,

              ataqueNpc: {
                npcId: "lagartoBronze",
                ataqueId: "bestaLeve",
                tipoRolagem: "desvantagem",

                resultados: {
                  erro: {
                    // NARRATIVA: o disparo erra.
                    texto: `Você percebe a tempo um belo tiro de flecha, lançado à sua frente, na direção em que você está correndo.

                    Parando repentinamente, a flecha passa voando pela noite e não {o|a} atinge.

                    Você volta a correr, já se preparando para dar um próximo salto, enquanto seus perseguidores se aproximam pelos barcos.`,

                    proximaEtapa: "testeAtletismo3SobFogo",
                  },

                  acerto: {
                    // NARRATIVA: o disparo acerta.
                    texto: `Você percebe a tempo um belo tiro de flecha, lançado à sua frente, na direção em que você está correndo.

                    Você tenta parar repentinamente, mas seu momento ainda {o|a} leva um pouco mais à frente, fazendo com que a flecha {o|a} atinja na coxa.`,
                    proximaEtapa: "salvaguardaAposSegundoPulo",
                  },
                },
              },
            },

            salvaguardaAposSegundoPulo: {
              // NARRATIVA: descreva o impacto dos disparos depois do segundo pulo.
              descricao: `Batendo com as costas na borda do navio, você tenta se reequilibrar e continuar correndo.`,

              instrucao: "manter o equilíbrio.",

              teste: {
                tipo: "salvaguarda",
                atributoId: "constituicao",
                dificuldade: 12,
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: permanece de pé e prepara o terceiro pulo.
                  texto: `Mesmo com a perna machucada, você consegue firmar a base com força suficiente para evitar a queda e continuar correndo.

                  Você dispara em direção ao próximo salto.`,
                  proximaEtapa: "testeAtletismo3SobFogo",
                },

                fracasso: {
                  // NARRATIVA: cai em uma embarcação e inicia a batalha.
                  texto: `Com a perna machucada, você não consegue manter uma base forte o suficiente e acaba tombando do barco em direção ao rio.

                  Por um momento, você perde completamente a noção de direção enquanto a água entra por suas narinas.

                  Nadando de volta à superfície, você vê virotes e flechas sendo lançados em sua direção enquanto o rio o arrasta de volta para a margem, onde os mercenários certamente estarão prontos para a sua captura.`,
                  proximaCena: "batalhaTorreNoite",
                },
              },
            },

            testeFurtividade2: {
              // NARRATIVA: após o segundo pulo, descreva a nova tentativa de permanecer escondido.
              descricao: `Com certa dificuldade, você consegue realizar o salto para o próximo navio, um pouco mais afastado. Ao atingir o chão, você acaba se desequilibrando e batendo em uma mesa contendo ferramentas de pesca.

              Rapidamente você se desloca para o outro extremo do barco, já pegando impulso para o próximo pulo.`,

              instrucao: "continuar sem ser {visto|vista}.",

              teste: {
                tipo: "oposto",

                jogador: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                },

                oponente: {
                  npcId: "lagartoBronze",
                  tipo: "pericia",
                  periciaId: "percepcao",
                },
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: continua sem ser localizado e prepara o terceiro pulo.
                  texto: ``,
                  proximaEtapa: "testeAtletismo3",
                },

                fracasso: {
                  // NARRATIVA: é localizado depois do segundo pulo.
                  texto: `"Rodrick! Ali perto do pesqueiro grande! Rápido, animal!"

                  Seu sangue gela ao ouvir a voz vindo do cais e passos fortes vindo logo atrás.
                  
                  Sem pensar muito, você dispara em direção à barco, agora sem se preocupar em permanecer {escondido|escondida}.`,

                  proximaEtapa: "ataquesAposSegundoPulo",
                },
              },
            },

            testeAtletismo3: {
              // NARRATIVA: introduza o terceiro pulo enquanto o personagem ainda está escondido.
              descricao: `"Rodrick! Ali perto do pesqueiro grande! Eu ouvi um barulho."

              Seu sangue gela ao ouvir a voz vindo do cais e passos fortes vindo logo atrás.

              Rapidamente você calcula a próxima rota e pula para o navio seguinte.`,

              instrucao: "dar o terceiro pulo entre as embarcações.",

              teste: {
                tipo: "pericia",
                periciaId: "atletismo",
                dificuldade: 13,
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: conclui o terceiro pulo sem ser localizado.
                  texto: ``,
                  proximaEtapa: "testeFurtividade3",
                },

                fracasso: {
                texto: `A pressa em pular faz você calcular mal o pulo e cair no rio.

                Batendo desajeitadamente no barco, você perde completamente a noção de espaço por um segundo enquanto a água entra por suas narinas.`,

                ataquesNpc: {
                  npcId: "lagartoBronze",
                  ataqueId: "bestaLeve",
                  quantidade: 2,
                  tipoRolagem: "desvantagem",

                  resultadosPorAcertos: {
                    0: {
                      texto: `Você se recompõe e volta à superfície a tempo de ver uma flecha voar em sua direção, {o|a} errando por pouco.

                      Em meio ao borbulho incessante da água ao seu redor, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas não consegue se concentrar em nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    1: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Você consegue se desviar no último momento, mas a dor no braço {o|a} impede de nadar. O rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                    2: {
                      texto: `Você consegue prender a respiração segundos antes de cair, mas perde completamente o senso de direção debaixo d'água.

                      Enquanto tenta voltar para a superfície, sente repentinamente uma dor lancinante. Ao olhar para baixo, um virote de besta encontra-se cravado em seu ombro. Ao finalmente colocar a cabeça para fora das águas e respirar fundo, você consegue ouvir gritos vindos do cais, onde quatro mercenários o observam, um deles disparando um virote em sua direção.

                      Lutando contra a correnteza, você não consegue se desviar, e sente outra pontada forte, dessa vez na perna, onde o virote {o|a} atinge dentro d'água. Com os membros feridos, você não consegue nadar, e o rio agora {o|a} carrega até a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                      proximaCena: "batalhaTorreNoite",
                    },

                  },
                },
                },
              },
            },

            testeAtletismo3SobFogo: {
              // NARRATIVA: introduza o último pulo com os Lagartos já atirando.
              descricao: `No limite do navio, você pula com a maior força possível em uma trajetória calculada com pressa, torcendo para que seja o suficiente.`,

              instrucao: "realizar o terceiro pulo.",

              teste: {
                tipo: "pericia",
                periciaId: "atletismo",
                dificuldade: 13,
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: conclui o terceiro pulo, mas ainda precisa sobreviver à rajada final.
                  texto: ``,
                  proximaEtapa: "ataquesFinais",
                },

                fracasso: {
                  // NARRATIVA: falha no terceiro pulo e cai na água.
                  texto: `A pressa em pular faz você calcular mal o pulo e cair no rio.

                  Por um momento, você perde completamente a noção de direção enquanto a água entra por suas narinas.

                  Nadando de volta à superfície, você vê virotes e flechas sendo lançados em sua direção enquanto o rio o arrasta de volta para a margem, onde os mercenários certamente estarão prontos para a sua captura.`,

                  proximaCena: "batalhaTorreNoite",
                },
              },
            },

            testeFurtividade3: {
              // NARRATIVA: depois do terceiro pulo, descreva a última tentativa de não ser localizado.
              descricao: `Com um baque forte, você cai no último navio. Agora tudo que resta é permanecer {escondido|escondida} até chegar no outro lado do navio e dar um pulo simples até a margem.`,

              instrucao: "alcançar a margem.",

              teste: {
                tipo: "oposto",

                jogador: {
                  tipo: "pericia",
                  periciaId: "furtividade",
                },

                oponente: {
                  npcId: "lagartoBronze",
                  tipo: "pericia",
                  periciaId: "percepcao",
                },
              },

              resultados: {
                sucesso: {
                  // NARRATIVA: completa toda a travessia sem ser localizado.
                  texto: ``,
                  proximaEtapa: "travessiaConcluida",
                },

                fracasso: {
                  // NARRATIVA: é localizado no final da travessia.
                  texto: `"Rodrick! Ali perto do pesqueiro grande! Rápido, animal!"

                  Seu sangue gela ao ouvir a voz vindo do cais e passos fortes vindo logo atrás.

                  Sem pensar muito, você corre e se prepara para pular para a margem, agora sem se preocupar em permanecer {escondido|escondida}.`,

                  proximaEtapa: "ataquesFinais",
                },
              },
            },

            ataquesFinais: {
              // NARRATIVA: descreva o último disparo antes de o personagem alcançar a margem.
              descricao: ``,

              ataqueNpc: {
                npcId: "lagartoBronze",
                ataqueId: "bestaLeve",
                tipoRolagem: "desvantagem",

                resultados: {
                  erro: {
                    // NARRATIVA: o disparo erra e o personagem completa a travessia.
                    texto: `Duas últimas flechas passam próximo de você, uma enquanto você ainda estava no arco do pulo, outra assim que você alcança a margem oposta.`,
                    proximaEtapa: "travessiaConcluida",
                  },

                  acerto: {
                    // NARRATIVA: o disparo acerta no trecho final.
                    texto: `Uma flecha passa muito próxima enquanto você ainda estava no arco do pulo. Porém outra {o|a} atinge na parte de trás da perna no momento em que você cai no chão na margem oposta.`,
                    proximaEtapa: "travessiaConcluida",
                  },
                },
              },
            },

            travessiaConcluida: {
              // NARRATIVA: escreva aqui a conclusão da travessia e defina a próxima cena.
              descricao: ``,

              pendenciaFonte: {
                tipo: "destinoNarrativo",
                descricao:
                  "Definir o texto final e o destino após concluir a travessia noturna pelas embarcações.",
              },
            },
        },
      },

      //BATALHAS//

      batalhaRuasF: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      batalhaRuasD: {
        contexto: [
          `Os guardas avançam sobre você pelas ruas próximas à ponte. Não há mais como evitar o confronto.`,
        ],

        combate: {
          textoBotaoInicio: "Enfrentar os guardas",
          dificuldadePretendida: "alta",

          introducao: {
            titulo: "Confronto nas ruas",
            
            descricao: `Os guardas avançam em sua direção, bloqueando o caminho até a ponte.
            
            Você pode vencer o confronto derrotando-os ou encontrando uma oportunidade para escapar.`,
          },

          mapa: "Imagens/Mapas/A Fuga/batalhaRuas.webp",

          areas: {
            ponte: {
              colunaInicial: 23,
              colunaFinal: 25,
              linhaInicial: 1,
              linhaFinal: 8,

              rotulo: "Ponte",
              visivel: false,
            },

            saidaPonte: {
              colunaInicial: 23,
              colunaFinal: 25,
              linhaInicial: 1,
              linhaFinal: 1,

              rotulo: "Saída da ponte",
            },
          },

          objetivos: [
            {
              id: "eliminarGuardas",
              tipo: "principal",
              titulo: "Derrotar os guardas",
              descricao: "Derrote todos os guardas.",
              
              condicao: {
                tipo: "inimigosDerrotados",
              },
              
              resultadoId: "vitoria",
              categoria: "sucesso",
            },
          ],

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

                texto: `O último dos guardas tomba diante de você. Por alguns instantes, a ponte está livre e a multidão {o|a} observa em silêncio.
                
                Sentindo os ferimentos ardendo, você sai em disparada.`,
              },

              proximaCena: "fimVitoria",
            },

            derrota: {
              tela: {
                titulo: "Derrota",

                texto: `Suas forças chegam ao fim.
                
                {Cercado|Cercada} pelos guardas, você já não consegue continuar lutando.`,
              },

              proximaCena: "fimDerrota",
            },
          },
        },
      },

      batalhaTorreF:{
      },

      batalhaTorreM: {
        contexto: [``],

        combate: {
          textoBotaoInicio: "Enfrentar os guardas",
          dificuldadePretendida: "moderada",
          mapa: "Imagens/Mapas/A Fuga/batalhaTorre.webp",

          jogador: {
            posicao: {
              coluna: 21,
              linha: 21,
            },

            movimentoMaximo: 6,
          },

          inimigos: [
            {
              npcId: "guardaConde",

              quantidade: 3,

              posicoes: [
                {
                  coluna: 22,
                  linha: 25,
                },

                {
                  coluna: 24,
                  linha: 24,
                },
                {
                  coluna: 25,
                  linha: 26,
                },
              ],

              movimentoMaximo: 6,
            },
          ],
          resultados: {
            vitoria: {
              tela: {
                titulo: "Vitória",

                texto: `Você derrota o último dos guardas.

                Ainda ofegante, você olha ao redor {apreensivo|apreensiva}, na espera de encontrar mais guardas indo em sua direção.

                Surpreendentemente, você não vê ninguém, e parte em direção à torre.`,
              },

              proximaCena: "torreChao",
            },

            derrota: {
              tela: {
                titulo: "Derrota",

                texto: `Suas forças chegam ao fim.
                
                {Cercado|Cercada} pelos guardas, você já não consegue continuar lutando.`,
              },

              proximaCena: "fimDerrota",
            },
          },
        },
      },

      batalhaBecosM: {
        variacoes: [
          {
            se: {
              veioDe: {
                cenaId: "becosOpostos",
                etapaId: "testeTerritorio",
                tipo: "teste",
                resultado: "fracasso",
              },
            },

            contexto: [
              `Três mercenários do grupo {o|a} cercam e bloqueiam sua passagem. Para além deles, uma abertura nos muros da cidade que levará à sua liberdade.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "becosOpostos",
                etapaId: "testePassarLagartos",
                tipo: "teste",
                resultado: "fracasso",
              },
            },

            contexto: [``],
          },
        ],

        contexto: [`Sem uma rota segura para recuar, você se prepara para o confronto.`],

        combate: {
          textoBotaoInicio: "Enfrentar os Lagartos",
          dificuldadePretendida: "moderada",
          mapa: "Imagens/Mapas/A Fuga/batalhaBecos.webp",

          jogador: {
            posicao: {
              coluna: 22,
              linha: 14,
            },

            movimentoMaximo: 6,
          },

          inimigos: [
            {
              npcId: "lagartoBronze",
              quantidade: 3,

              posicoes: [
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
                  linha: 6,
                },
              ],

              movimentoMaximo: 6,
            },
          ],

          resultados: {
            vitoria: {
              tela: {
                titulo: "Vitória",

                texto: `O último dos Lagartos de Bronze cai diante de você.

          O caminho pelos becos está novamente livre.`,
              },

              proximaCena: "fimVitoria",
            },

            derrota: {
              tela: {
                titulo: "Derrota",

                texto: `Suas forças chegam ao fim.

          {Cercado|Cercada} pelos Lagartos de Bronze, você já não consegue continuar lutando.`,
              },

              proximaCena: "fimDerrota",
            },
          },
        },
      },

      batalhaBecosF:{ 
      },

      batalhaConfrontoM:{       
      },

      batalhaPonteAlt:{       
      },

      batalhaPonteNoite:{       
      },

      batalhaTorreNoite:{       
      },

      // Esqueletos de cenas ainda não implementadas.
      margemRioPonte: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      torreTetoSemGuardas: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      torreTetoComGuardas: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      batalha2torre: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      batalhaPonteF: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      batalhaPonteD: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      torreChaoMolhado: {
        numeroFonte: null,
        contexto: [],
        escolhas: [],
      },

      fimVitoria: {
        numeroFonte: null,

        variacoes: [
          {
            se: {
              veioDe: {
                cenaId: "batalhaRuasD",
                tipo: "combate",
                resultado: "vitoria",
              },
            },

            contexto: [
              `Às suas costas, você deixa a cidade em caos. À sua frente, a segurança da floresta de Rawriaq, onde você irá se esconder pelos próximos dias.

              Seu destino é incerto, mas ele está em suas mãos.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "becosOpostos",
                etapaId: "testePassarLagartos",
                tipo: "teste",
                resultado: "sucesso",
              },
            },

            contexto: [],
          },

          {
            se: {
              veioDe: {
                cenaId: "batalhaBecosM",
                tipo: "combate",
                resultado: "vitoria",
              },
            },

            contexto: [],
          },
        ],

        contexto: [],

        escolhas: [
          {
            id: "concluirAventuraVitoria",

            texto: `Concluir Aventura.`,

            registrarNarrativa: false,

            fimAventura: {
              resultadoId: "vitoria",
              rotulo: "A Fuga",

              titulo: "Você escapou",

              texto: `Você conseguiu escapar da cidade, mas a batalha por ela está apenas começando.`,

              resultado: "Vitória",
            },
          },
        ],
      },

      fimDerrota: {
        numeroFonte: null,

        variacoes: [
          {
            se: {
              veioDe: {
                cenaId: "batalhaRuasD",
                tipo: "combate",
                resultado: "derrota",
              },
            },

            contexto: [
              `Sua visão se torna turva enquanto suas forças abandonam seu corpo. Incapaz de se manter de pé, você cai de joelhos.
          
              Os sons do caos na cidade parecem cada vez mais distantes, e a última coisa que você sente é uma forte pancada na parte de trás da cabeça.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "batalhaTorreM",
                tipo: "combate",
                resultado: "derrota",
              },
            },

            contexto: [
              `Sua visão se torna turva enquanto suas forças abandonam seu corpo. Incapaz de se manter de pé, você cai de joelhos.

              Os sons do caos na cidade parecem cada vez mais distantes, e a última coisa que você sente é uma forte pancada na parte de trás da cabeça.`,
            ],
          },

          {
            se: {
              veioDe: {
                cenaId: "batalhaBecosM",
                tipo: "combate",
                resultado: "derrota",
              },
            },

            contexto: [],
          },
        ],

        contexto: [],

        escolhas: [
          {
            id: "concluirAventuraDerrota",

            texto: `Concluir Aventura.`,

            registrarNarrativa: false,

            fimAventura: {
              resultadoId: "derrota",
              rotulo: "A Fuga",

              titulo: "Sua fuga chega ao fim",

              texto: `Sua tentativa de escapar da cidade chega ao fim.
              
              {Desarmado|Desarmada} e {capturado|capturada}, seu destino é incerto.`,

              resultado: "Derrota",
            },
          },
        ],
      },
    },
  },
};

/* ============================================================================
   MODELOS DE CENA
   ----------------------------------------------------------------------------
   Referencia comentada: nao e executada pelo jogo. Copie apenas os blocos
   necessarios para dentro de `cenas` e substitua ids e textos de exemplo.

   LEMBRETES
   - O id da cena deve ser unico e nao deve usar acentos ou espacos.
   - Uma linha vazia dentro de `texto` ou `contexto` cria outro paragrafo.
   - Genero: `{ferido|ferida}`, `{o|a}`, `{sozinho|sozinha}`.
   - Cenas de combate exibem primeiro `contexto` e depois o botao de inicio.
   - O combate retorna a uma cena narrativa; nao encerra a aventura diretamente.
   ============================================================================

modeloCena: {
  // Numero correspondente ao mapa da aventura no Miro/documento-fonte.
  numeroFonte: 99,

  // Trechos exibidos antes do contexto geral quando a condicao e atendida.
  variacoes: [
    {
      se: {
        veioDe: {
          cenaId: "modeloCenaAnterior",
          etapaId: "modeloEtapaAnterior",
          tipo: "teste",
          resultado: "sucesso",
        },
      },

      contexto: [
        `Texto exclusivo desta variacao.`,
      ],
    },
  ],

  // Texto principal. Pode ser uma string ou uma lista de trechos.
  contexto: [
    `Primeiro paragrafo da cena.

    Segundo paragrafo, com personagem {cansado|cansada}.`,

    // Trecho condicional inserido no meio da narracao.
    {
      se: {
        flag: "modeloDescobriuSegredo",
        igualA: true,
      },

      texto: `Este trecho aparece apenas se a memoria estiver ativa.`,
    },

    // Condicao especial ja reconhecida pelo projeto.
    {
      se: {
        desvantagemNadoAguasRevoltas: true,
      },

      texto: `A armadura tornara a travessia especialmente dificil.`,
    },
  ],

  // Use quando a cena deve comecar por uma sequencia interna.
  etapaInicial: "modeloTeste",

  etapas: {
    modeloTeste: {
      descricao: `Voce se prepara para realizar a acao.`,
      instrucao: "realizar a acao.",

      teste: {
        // Tipos usuais: "pericia", "atributo" ou "salvaguarda".
        tipo: "pericia",
        periciaId: "furtividade",
        dificuldade: 13,

        // Opcional. Ativa regras especiais, quando reconhecida pelo sistema.
        // Exemplo existente: "nadarAguasRevoltas".
        situacao: "modeloSituacao",
      },

      resultados: {
        sucesso: {
          texto: `Voce consegue realizar a acao.`,

          // Memorias alteram textos e caminhos futuros.
          memorias: {
            modeloTeveSucesso: true,
          },

          proximaEtapa: "modeloDecisao",
        },

        fracasso: {
          texto: `Voce nao consegue realizar a acao.`,

          // Opcional: aplica dano conforme a distancia da queda.
          queda: {
            distanciaMetros: 3,
          },

          proximaCena: "modeloCenaFracasso",
        },
      },
    },

    modeloDecisao: {
      descricao: `Agora voce precisa decidir como prosseguir.`,

      escolhas: [
        {
          id: "modeloContinuar",
          texto: `Continuar.`,
          descricao: `Voce segue adiante.`,
          proximaCena: "modeloProximaCena",
        },

        {
          id: "modeloOutraEtapa",
          texto: `Tentar outra abordagem.`,
          proximaEtapa: "modeloPendente",
        },
      ],
    },

    modeloPendente: {
      descricao: `Este trecho ainda nao foi escrito.`,

      // Marcador temporario para conteudo ainda ausente no Miro/fonte.
      pendenciaFonte: {
        tipo: "destinoNarrativo",
        descricao: "Escrever a continuacao desta etapa.",
      },
    },
  },

  // ALTERNATIVA: ESCOLHAS DIRETAS
  // Use `escolhas` quando a cena nao possuir `etapaInicial` nem `combate`.
  escolhas: [
    {
      id: "modeloEscolha",
      texto: `Escolher este caminho.`,
      descricao: `Narracao exibida depois da escolha.`,

      memorias: {
        modeloEscolheuCaminho: true,
      },

      proximaCena: "modeloProximaCena",
    },
  ],

  // ALTERNATIVA: COMBATE
  // Ao usar este bloco, remova `etapaInicial`, `etapas` e `escolhas` acima.
  combate: {
    textoBotaoInicio: "Iniciar combate",
    dificuldadePretendida: "moderada",

    // Padrao oficial do projeto: mapa 6688 x 3764 px, celulas de 64 x 64 px.
    mapa: "Imagens/Mapas/Nome da Aventura/modeloMapa.webp",

    // `objetivos` e `areas` sao opcionais. Sem eles, o objetivo automatico
    // continua sendo derrotar todos os inimigos. Ao declarar `objetivos`,
    // inclua explicitamente a eliminacao caso ela tambem deva encerrar a luta.
    areas: {
      saida: {
        colunaInicial: 45,
        colunaFinal: 48,
        linhaInicial: 10,
        linhaFinal: 17,
        rotulo: "Area de fuga",
      },
    },

    objetivos: [
      {
        id: "eliminacao",
        tipo: "principal",
        titulo: "Derrotar os inimigos",
        descricao: "Derrote todos os inimigos.",
        condicao: {
          tipo: "inimigosDerrotados",
        },
        resultadoId: "vitoria",
        categoria: "sucesso",
      },

      {
        id: "escapar",
        tipo: "principal",
        titulo: "Escapar",
        descricao: "Alcance a area destacada.",
        condicao: {
          tipo: "participanteNaArea",
          participanteId: "jogador",
          areaId: "saida",
        },
        resultadoId: "fuga",
        categoria: "sucesso",
      },
    ],

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
        quantidade: 2,

        // Informe uma posicao para cada inimigo declarado em `quantidade`.
        posicoes: [
          {
            coluna: 20,
            linha: 9,
          },

          {
            coluna: 25,
            linha: 9,
          },
        ],

        movimentoMaximo: 6,
      },
    ],

    resultados: {
      vitoria: {
        categoria: "sucesso",
        tela: {
          titulo: "Vitoria",

          texto: `Texto da janela exibida sobre o mapa.

          Voce permanece {ferido|ferida}, mas venceu.`,
        },

        proximaCena: "modeloPosCombateVitoria",
      },

      fuga: {
        categoria: "sucesso",

        tela: {
          titulo: "Voce escapou",
          texto: `Voce alcanca a area de fuga antes que os inimigos consigam impedir.`,
        },

        proximaCena: "modeloPosCombateVitoria",
      },

      derrota: {
        categoria: "derrota",
        tela: {
          titulo: "Derrota",
          texto: `Suas forcas chegam ao fim.`,
        },

        proximaCena: "modeloPosCombateDerrota",
      },
    },
  },
},

// Modelo de cena narrativa posterior ao combate.
modeloPosCombateVitoria: {
  numeroFonte: 100,

  contexto: [
    `Narracao apresentada depois que o jogador deixa a tela de combate.`,
  ],

  escolhas: [
    {
      id: "modeloConcluirVitoria",
      texto: `Concluir aventura.`,
      registrarNarrativa: false,

      fimAventura: {
        // Vitoria recupera o personagem, registra a conclusao e bloqueia
        // recompensas futuras de XP desta aventura para este personagem.
        resultadoId: "vitoria",
        rotulo: "Nome da aventura",
        titulo: "Titulo do final",
        texto: `Resumo exibido na tela final.`,
        resultado: "Vitoria",
      },
    },
  ],
},

modeloPosCombateDerrota: {
  numeroFonte: 101,

  contexto: [
    `Narracao apresentada depois da derrota.`,
  ],

  escolhas: [
    {
      id: "modeloConcluirDerrota",
      texto: `Concluir aventura.`,
      registrarNarrativa: false,

      fimAventura: {
        // Derrota recupera o personagem, mas nao bloqueia XP de outra tentativa.
        resultadoId: "derrota",
        rotulo: "Nome da aventura",
        titulo: "Titulo do final",
        texto: `Resumo exibido na tela final.`,
        resultado: "Derrota",
      },
    },
  ],
},
*/
