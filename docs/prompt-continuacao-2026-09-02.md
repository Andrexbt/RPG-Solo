# Prompt para continuar o desenvolvimento do RPG Solo

Estou continuando o desenvolvimento do projeto local **RPG Solo**. Antes de propor ou alterar qualquer coisa, leia integralmente `docs/transmissor-de-contexto.md`, com atenção especial ao **Suplemento 6.0 — Estado em 2 de setembro de 2026**, e confira o código atual para validar nomes e pontos de integração.

Resumo do caminho até aqui: eu estava escrevendo a aventura **A Fuga**. A complexidade de cenas como `noitePelasEmbarcacoes` levou à criação de procedência narrativa automática, finais contextuais centralizados em `fimVitoria` e `fimDerrota` e encerramento por 0 PV. Depois estruturamos objetivos e resultados de combate usando `batalhaRuasD` como exemplo, incluindo modal inicial, painel pequeno de objetivos, modal de resultado e retorno à consequência correta na aventura. Para a fuga funcionar, implementamos terreno difícil/bloqueado, editor de mapa, barreiras direcionais, linha de visão, cobertura, alcance de armas, zona de controle, Desengajar e ataques de oportunidade. Isso revelou que a IA antiga era básica demais, então separamos as aventuras por arquivo e criamos `inteligencia-inimigos.js` com cinco perfis e um planejador tático.

O planejador já foi testado isoladamente: avalia alcance, cobertura, risco, aproximação, células alcançáveis, caminho, custo e escolha de arma/posição. Porém, ele **ainda não foi integrado ao turno real do inimigo**. A IA antiga continua em `combate.js`.

Quero continuar exatamente deste ponto: integrar `InteligenciaInimigos.planejarTurnoTatico` ao fluxo real equivalente a `SistemaCombate.executarTurnoInimigo`, preservando a regra de que a IA propõe e o motor valida e executa.

Trabalhe comigo devagar, uma parte por vez. Não edite o código diretamente, a menos que eu peça explicitamente. Em cada etapa:

1. confira o código atual;
2. explique com muita precisão qual arquivo, função e trecho devo localizar;
3. forneça somente a pequena alteração daquela etapa;
4. diga exatamente como testá-la;
5. espere eu confirmar antes de avançar.

Não remova de imediato as funções antigas de IA. Primeiro conecte e teste um plano de **movimento** em batalha real, respeitando caminho, custo, terreno e ataques de oportunidade. Depois conectaremos a ação de ataque escolhida. Use `batalhaRuasD` como cenário principal de teste e cubra inimigo adjacente, distante, ameaçado e sem linha de visão.

Também tenha em mente que **A Fuga ainda não está terminada**, algumas batalhas ainda precisam de acabamento, salvar/retomar aventura permanece pendente e o teste integral do Alpha ainda não foi feito. Não deixe a ampliação do sistema nos afastar indefinidamente da conclusão da aventura.
