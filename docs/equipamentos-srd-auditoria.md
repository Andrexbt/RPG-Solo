# Cadastro de equipamentos — SRD 5.2.1

Referência: `Fontes/srd-5.2.1.pdf`, páginas 89–92. Cadastro atualizado em 6 de setembro de 2026.

## Escopo cadastrado

- 38 armas: 10 simples corpo a corpo, 4 simples à distância, 18 marciais corpo a corpo e 6 marciais à distância.
- 12 armaduras, além da opção de interface `semArmadura`, e escudo em `itensSecundarios`.
- IDs anteriores preservados. Traduções dos nomes são rótulos do projeto.
- Armas de fogo incluídas porque constam na tabela do SRD; disponibilidade em uma aventura é uma decisão de conteúdo, não é concessão automática de equipamento inicial.

## Campos e unidades

`precoPO` usa peças de ouro; `pesoLb` usa libras; `alcanceCorpoACorpoPes` e `alcanceDistanciaPes` usam pés. Uma célula padrão corresponde a 5 pés. Nenhuma conversão de unidade é implícita nesses campos.

`danoVersatil` registra o dano em duas mãos. `municaoId` aponta para `itensGerais`. `duasMaosExcetoMontado` registra a exceção da lança de montaria. A zarabatana conserva `dano: "1"`, sem inventar uma rolagem de dado.

Armaduras registram categoria, CA, Destreza, penalidade de Furtividade, requisito de Força, preço, peso e tempos de vestir/remover. `forcaMinima` é o limiar para evitar a redução de velocidade, não uma proibição de vestir. O peso desprezível da funda foi representado por zero.

## Integrações pendentes — oportunidades de aprendizado

Cadastro completo não significa combate completo. Antes de considerar os itens jogáveis conforme a mesa:

- Substituir os alcances fixos de `criarAtaqueCombateArma`, em `regras-ficha-criacao.js`, pelos dados de cada arma. O código atual usa 16/64 células para armas à distância e uma célula no corpo a corpo.
- Aceitar dano fixo: o conversor atual exige `XdY` e não gera ataque para a zarabatana.
- Usar o dano Versátil conforme a empunhadura e permitir escolher o modo de ataque/arremesso.
- Integrar Alcance aos ataques e reações; Recarga à economia de ataques; Munição ao inventário, consumo e recuperação.
- Integrar a exceção montada da lança de montaria quando houver combate montado.
- Conferir treinamento por categoria de armadura, redução de velocidade por Força insuficiente, Furtividade e tempos de equipar, inclusive ação Utilizar para escudo.
- Integrar preços, peso, compra e conjuntos iniciais do Guerreiro (página 47). Ampliar o catálogo não implementa orçamento nem concede posse dos itens.
- Conferir todos os seletores, ficha, persistência e efeitos de maestria com os novos IDs; não marcar essas camadas como testadas por uma validação do banco.

Próxima aula sugerida: fazer o alcance do ataque nascer do cadastro da arma, com conversão explícita de pés para células e teste de arco curto, arco longo e arma de haste.
